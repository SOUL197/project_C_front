import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import style from '../upboard/upboard.module.css'

interface GongjiVO{
  num: number;
  title: string;
  writer: string;
  content: string;
  gdate: string;
}

const Gongjilist: React.FC = () => {
 
  const [gongjiList, setGongjiList] = useState<GongjiVO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const [searchType, setSearchType] = useState('1');
  const [searchValue, setSearchValue] = useState('');

const pagePerBlcok = 5;


const fetchgongjiList = async (page: number) => {
        try {
            const urls = `${process.env.REACT_APP_BACK_END_URL}/gongji/list`
            const response = await axios.get(urls, 
                {params: {cPage: page,
                    searchType: searchType,
                    searchValue: searchValue}});
            setGongjiList(response.data.data);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);
        } catch (error) {
            console.error("실패" + error)
        }
    }
    useEffect(() => {
            fetchgongjiList(currentPage);
        }, [currentPage]);
    
        const pageChange = (page: number) => {
            setCurrentPage(page);
        }
    
        const searchFunction = () => {
            fetchgongjiList(1);
        }

        const [toggle, setToggle] = useState(false);
            const [number, setNumber] = useState(0);
            const ctoggle = (Num: number) => {
                if (number === Num) {
                    setToggle(false);
                    setNumber(0);
                } else {
                    setToggle(true);
                    setNumber(Num);
                }
            };
  return (

    <div className={style.container}>
      <div className={style.fading}>
        <h3 className={style.title} >공지사항</h3></div>
      <table className={style.boardTable} >
        <thead style={{textAlign:'center'}}>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>

          {
            gongjiList.map((item) => (
              <tr key={item.num}>
                <td style={{ width: "120px", textAlign: 'center' }}>{item.num}</td>
                <td><Link to={`/gongji/detail/${item.num}`} className={style.titleLink2}>{item.title}</Link></td>
                <td style={{ width: "170px", textAlign: 'center' }}>{item.writer}</td>
                <td style={{ width: "170px", textAlign: 'center' }}>{item.gdate}</td>
              </tr>
            ))
          }
        </tbody>
        <tfoot style={{ textAlign: 'right' }}>
          <tr>
                        <th colSpan={6} className="text-center align-middle">
                            <select onChange={(e) => { setSearchType(e.target.value) }}>
                                <option value="1">작성자</option>
                                <option value="2">제목</option>
                                <option value="3">내용</option>
                            </select>
                            <input type='text'
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                            <button className="btn btn-warning" onClick={searchFunction}>검색</button>
                        </th>
                        {/* 검색폼 추가 영역 */}
                    </tr>
                  
          <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                            <nav>
                                <ul className="pagination justify-content-center">
                                    {startPage > 1 && (
                                        <li className="page-item">
                                            <button className="page-link"
                                                onClick={() => { pageChange(startPage - 1) }}>
                                                이전</button>
                                        </li>
                                    )}
                                    {/* 페이지 출력하기 */}
                                    {
                                        Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage)
                                            .map((page) => (
                                                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                                    <button className='page-link' onClick={() => { pageChange(page) }}>{page}</button>
                                                </li>
                                            ))
                                    }
                                    {/* 
                      NextPage 출력하기 : totalPage 보다 endPage 적을 때 다음페이지가 있는 것으로 계산
                      */}
                                    {endPage < totalPages && (
                                        <li className='page-item'>
                                            <button className='page-link' onClick={() => { pageChange(endPage + 1) }}>다음</button>
                                        </li>
                                    )}
                                </ul>

                            </nav>

                            {/* UpBoardForm.tsx */}
                            <Link to="/gongji/form" className={style.button}>
                                글쓰기
                            </Link>
                        </td>

                    </tr>


          <tr>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Gongjilist