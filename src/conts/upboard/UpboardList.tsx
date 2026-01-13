import React, { useEffect, useState } from 'react'
import style from  './upboard.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'path';

interface UpBoardVO {
  num:number;
  title:string;
  writer:string;
  content:string;
  imgn:string;
  hit:number;
  elike:number;
  reip:string;
  bdate:string;
}

const UpboardList: React.FC = () => {

  const [upboardlist, setUpboardList] =useState<UpBoardVO[]>([]);
  const [totalItems, setTotalItems] =useState(0);
  const [totalPages, setTotalPages] =useState(0);
  const [currentPage, setCurrentPage] =useState(1);
  const [startPage, setStartPage] =useState(1);
  const [endPage, setEndPage] =useState(1);

// 검색을 위한 useState를 추가
  const [searchType, setSearchType] =useState('1');
  const [searchValue, setSearchValue] =useState('');
  const pagePerBlock =5;
  const imageBasePath =`${process.env.REACT_APP_BACK_END_URL}/imgfile/gallery/`;
  const fetchUpboardList= async (page:number)=>{
      try{
        //@RequestParam Map<String, String> paramMap
        const urls=`${process.env.REACT_APP_BACK_END_URL}/board/list`;
        const response = await axios.get<any>(urls, 
          {params: { cPage:page,
            searchType:searchType,
            searchValue: searchValue
          }})

        console.log(response.data.data);
        setUpboardList(response.data.data);
        setTotalItems(response.data.totalItems);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setStartPage(response.data.startPage);
        setEndPage(response.data.endPage);

      }catch(error){
        console.error("데이터 가져오기 실패:" +error);
      }
    };
  useEffect(() =>{
   
    fetchUpboardList(currentPage);
  }, [currentPage]);
  //page Handler
  const pageChange =(page:number) =>{
    setCurrentPage(page);
  }
  const searchFunction= () =>{
    fetchUpboardList(1);
  };

  return (

    
    <div className={style.container}>
      <div className={style.fading}>
      <h3 className={style.title} >자유게시판</h3></div>
      <table className={style.boardTable}>
        <thead>
            
            
            <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
               
                <th>조회수</th>
                <th>좋아요</th>

            </tr>
        </thead>
        <tbody>
          {
            upboardlist.map((item) =>(
            <tr key={item.num}>
                <td style={{width:"70px"}}>{item.num}</td>
                <td><Link to={`/community/updetail/${item.num}`} className={style.titleLink} style={{color:"black"}}>{item.title}</Link></td>
                <td style={{width:"120px"}}>{item.writer}</td>
               
                <td style={{width:"80px"}}>{item.hit}</td>
                <td style={{width:"80px"}}>{item.elike}
                                </td>
                
                
            </tr>
           )) }
          
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={2} className='text-center align-midle'>
              <select onChange={(e)=>{setSearchType(e.target.value)}}>
                <option value="1">작성자</option>
                <option value="2">제목</option>
                <option value="3">내용</option>

              </select>
              <input type='text' onChange={(e)=>{setSearchValue(e.target.value)}}/>
              <button className='btn btn-warning' onClick={searchFunction}>검색

              </button>
            </th>      
                <td colSpan={3} style={{textAlign:"center"}}>
                  <nav>
                    <ul className='pagination justify-content-center'>
                      {startPage >1 && (
                        <li className='page-item'>
                          <button className='page-link' onClick={()=>{}}>
                            이전</button>
                        </li>
                      )}
                      {
                        Array.from({length:endPage-startPage+1}, (xx,i) =>i+startPage).map((page)=>(
                          <li key={page} className={`page-item ${page===currentPage?'active':''}`}>
                          <button className='page-link' onClick={()=>{pageChange(page)}}>{page}</button>
                          </li>
                        ))                     
                      }
                       {endPage <totalPages &&(
                        <li className='page-item'>
                          <button className='page-link' onClick={()=>{pageChange(endPage+1)}}>다음</button>
                        </li>
                       )}
                    </ul>
                  </nav>                 
                </td>
            </tr>
        </tfoot>
      </table>
      <div style={{textAlign:"right"}}><Link to="/community/upform" className={style.button}>글쓰기</Link></div>
    </div>
    
  )
}

export default UpboardList