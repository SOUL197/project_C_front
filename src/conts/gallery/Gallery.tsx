import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './gallery.module.css';
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';


interface GalleryVO {
  NUM: number;
  TITLE: String;
  WRITER: String;
  CONTENTS: string;
  MEMBER_NUM?: number;
  REIP?: string;
  HIT?: string;
  ELIKE?: string;
  GDATE?: string;
  IMAGENAME: string;   //json data는 대소문자 구분함.
}

interface MyPageProps {
  isMyPage?: boolean;
}

const Gallery: React.FC<MyPageProps> = ({ isMyPage = false }) => {
  const { member } = useAuth();
  const [galleryList, setGalleryList] = useState<GalleryVO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  // 검색을 위한 useState를 추가
  const [searchType, setSearchType] = useState('1');
  const [searchValue, setSearchValue] = useState('');
  const imageBasePath = `${process.env.REACT_APP_BACK_END_URL}/imgfile/gallery/`;

  const fetchGalleryList = async (page: number) => {
    try {
      //@RequestParam Map<String, String> paramMap
      const urls = `${process.env.REACT_APP_BACK_END_URL}/gallery/gallist`;
      const response = await axios.get(urls,
        {
          params: {
            cPage: page,
            searchType: searchType,
            searchValue: searchValue,
            mypage: isMyPage ? true : false,
            num: isMyPage ? member?.num : -1000
          }
        })

      console.log(response.data.data);
      setGalleryList(response.data.data);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setStartPage(response.data.startPage);
      setEndPage(response.data.endPage);

    } catch (error) {
      console.error("데이터 가져오기 실패:" + error);
    }
  }
  useEffect(() => {
    fetchGalleryList(currentPage);
  }, [currentPage]);

  //page Handler
  const pageChange = (page: number) => {
    setCurrentPage(page);
  }
  const searchFunction = () => {
    fetchGalleryList(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.fading}>
        {
          isMyPage ? <h3 className={styles.title} >나의 자랑하기</h3> : <h3 className={styles.title} >자랑하기</h3>
        }
      </div>
      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
        {
          member && !isMyPage && <Link to="/gallery/write" className={styles.button}>글쓰기</Link>
        }
      </div>
      <div className={styles.grid}>
        {galleryList.map(item => (
          <Link to={`/gallery/gdetail/${item.NUM}`} key={item.NUM} style={{ textDecoration: 'none' }}>
            <div className={styles.card}>
              <img src={`${imageBasePath}${item.IMAGENAME}`} alt={item.IMAGENAME} />
              <div style={{ fontSize: '20px', margin: '10px 0', fontWeight: 'bold', color: '#2C3E50' }}>{item.TITLE}</div>
              <div>조회수 : {item.HIT}&nbsp;&nbsp; 추천: {item.ELIKE}</div>
            </div>
          </Link>
        ))}
      </div>

      <table className={styles.container} >
        <tfoot>

          <tr>
            <td style={{ width: "500px", textAlign: "center", margin: "10px", borderRadius: "8px" }}>
              <select onChange={(e) => { setSearchType(e.target.value) }} style={{ padding: '5px', borderRadius: '5px' }}>
                {
                  !isMyPage && <option value="1">작성자</option>
                }
                <option value="2">제목</option>
                <option value="3">내용</option>
              </select>
              &nbsp;
              <input type='text' onChange={(e) => { setSearchValue(e.target.value) }} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #000' }} />
              &nbsp;

              <button className='btn btn-warning' onClick={searchFunction}>
                검색
              </button>
            </td>
            <td style={{ width: "500px", textAlign: "center", borderRadius: "8px" }}>
              <ul className='pagination justify-content-center'>
                {startPage > 1 && (
                  <li className='page-item'>
                    <button className='page-link' onClick={() => { pageChange(startPage - 1) }}>
                      이전</button>
                  </li>
                )}
                {
                  Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage).map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <button className='page-link' onClick={() => { pageChange(page) }}>{page}</button>
                    </li>
                  ))
                }
                {endPage < totalPages && (
                  <li className='page-item'>
                    <button className='page-link' onClick={() => { pageChange(endPage + 1) }}>다음</button>
                  </li>
                )}
              </ul></td></tr>
        </tfoot>
      </table>
    </div>

  );
};

export default Gallery;