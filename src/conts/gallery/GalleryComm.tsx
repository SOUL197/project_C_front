import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from '../matching/MatchingHome.module.css'

//부모로부터 전송되어 오는 properties
interface GalleryCommProps {
  num?: string;
}

interface GalleryCommVO {
  num: number;
  ucode: number;
  uwriter: string;
  ucontent: string;
  elike: string;
  reip: string;
  gcdate: string;
}

const GalleryComm: React.FC<GalleryCommProps> = ({ num }) => {
  const [comments, setComments] = useState<GalleryCommVO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [imoticon, setImoticon] = useState(false);
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const imotV = [
    { num: 1, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/1.png` },
    { num: 2, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/2.png` },
    { num: 3, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/3.png` },
    { num: 4, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/4.png` },
    { num: 5, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/5.png` },
    { num: 6, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/6.png` },
    { num: 7, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/7.png` },
    { num: 8, img: `${process.env.REACT_APP_BACK_END_URL}/imgfile/8.png` }
  ];

  const getComments = async () => {
    try {
      const url = `${process.env.REACT_APP_BACK_END_URL}/gallery/listcomm?num=${num}`;
      const response = await axios.get(url);
      console.log(response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setComments(response.data.data);
      } else {
        setComments([]); // 데이터가 없을 경우 빈 배열 처리
      }

    } catch (error) {
      console.log("데이터 로딩 실패!", error);
    }
  };

  useEffect(() => {
    console.log("Num" + num);
    getComments();
  }, [num]);

  //폼에서 입력한 값을 onCange 이벤트가 발생할 때 마다 값을 저장하기 위한 저장장소를 선언한다.

  const selectImoticon = (imgUrl: string) => {
    setContent(imgUrl);
    setImoticon(false);
  }
  const commentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !writer) {
      alert("작성자와 내용을 입력하세요")
      return;
    }
    const commentData = {
      ucode: num,
      uwriter: writer,
      ucontent: content
    }
    try {
      await axios.post(`${process.env.REACT_APP_BACK_END_URL}/gallery/addcomm`, commentData,
        { headers: { 'Content-Type': 'application/json' } })
      //입력 후 초기화 및 댓글 리스트 다시 실행    
      setWriter("");
      setContent("");
      getComments();
    } catch (error) {
      console.error(error);
    }
  }
  //페이지 처리
  const fetchboardcomm = async (page: number) => {
    try {
      //@RequestParam Map<String, String> paramMap
      const urls = `${process.env.REACT_APP_BACK_END_URL}/gallery/listcomm`;
      const response = await axios.get(urls,
        {
          params: {
            cPage: page,
            num: num
          }
        })
      console.log(response.data.data);
      setComments(response.data.data);
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
    fetchboardcomm(currentPage);
  }, [currentPage]);
  //page Handler
  const pageChange = (page: number) => {
    setCurrentPage(page);
  }

  return (
    <div className='mt-4'>
      <h4>Comments</h4>
      <form className='mb-3' onSubmit={commentSubmit}>
        <div className='mb-2'>
          <input type='text' placeholder='작성자' className='form-control' onChange={(e) => setWriter(e.target.value)} value={writer} />
        </div>
        <div className='mb-2 position-relative'>
          {/* 1. 이모티콘 팝업창 (입력창 위로 뜨게 설정) */}
          {imoticon && (<div className="card p-2 shadow" style={{
            position: 'absolute', bottom: '100%', left: '0',
            zIndex: 1000, width: '300px', background: '#fff', marginBottom: '10px'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1">
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>골라줘~</span>
              <button type="button" className="btn-close btn-sm" onClick={() => setImoticon(false)}></button></div>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              {imotV.map((item) => (<div key={item.num} onClick={() => selectImoticon(item.img)}
                style={{ cursor: 'pointer', padding: '5px', border: '1px solid #eee', borderRadius: '5px' }}
                className="hover-bg-light"> <img src={item.img} alt={`icon-${item.num}`} style={{ width: '40px', height: '40px' }} />
              </div>))} </div> </div>)}
          {/* 2. 입력 영역 (이미지 미리보기 OR 텍스트 영역) */}
          {content.startsWith("http") && (content.includes("/imgfile/") || content.includes(".png")) ?
            (<div className="form-control d-flex align-items-center justify-content-between" style={{ height: 'auto', minHeight: '80px' }}>
              <div> <span className="badge bg-secondary me-2">Sticker</span><img src={content} alt="selected" style={{ width: '60px' }} />
              </div> <button type="button" className="btn btn-close" aria-label="Close" onClick={() => setContent("")}></button>
            </div>) : (<textarea className='form-control' onChange={(e) => setContent(e.target.value)} value={content}
              style={{ paddingRight: '50px', minHeight: '80px' }} >
            </textarea>)}
          {/* 3. 스티커 토글 버튼 (입력창 내부 우측 하단에 고정) */}
          {/* 이미지가 선택되지 않은 텍스트 모드일 때만 버튼을 보여주거나, 항상 보여줄 수 있음. 여기선 항상 노출 */}
          {!content.startsWith("http") && (<button type="button" className="btn btn-link text-decoration-none"
            onClick={() => setImoticon(!imoticon)}
            style={{
              position: 'absolute', bottom: '15px', left: '10px',
              fontSize: '2rem', padding: 0, lineHeight: 1, zIndex: 10
            }} title="스티커 추가" >
            😊 </button>)} </div> <div className='text-center'>
          <button type="submit" className='btn btn-primary'>댓글작성</button>
        </div></form>

      <ul className='list-group'>
        {comments && comments.map((vo) => (
          <div key={vo.num} className='list-group-item'>
            <li className='list-group-item' style={{ textAlign: "left" }}>
              {/* [수정] 내용이 이미지 URL인지 텍스트인지 판별하여 출력 */}
              {vo.ucontent.startsWith("http") && (vo.ucontent.includes("/imgfile/") || vo.ucontent.includes(".png")) ?
                (<div><img src={vo.ucontent} alt="이모티콘" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                </div>) : (<span>{vo.ucontent}</span>)}
              {/* 작성자와 날짜를 보기 좋게 구분 (선택사항) */}
              <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
                {vo.uwriter} | {vo.gcdate} </div></li>

          </div>
        ))
        }
      </ul>
      <table>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ textAlign: "center" }}>
              <nav>
                <ul className='pagination justify-content-center'>
                  {startPage > 1 && (
                    <li className='page-item'>
                      <button className='page-link' onClick={() => { pageChange(startPage - 1) }}>
                        이전</button>
                    </li>
                  )}
                  {/*페이지 출력하기 */}
                  {
                    Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage).map((page) => (
                      <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button className='page-link' onClick={() => { pageChange(page) }}>{page}</button>
                      </li>
                    ))
                  }
                  {/*넥스트페이지 출력하기 */}
                  {endPage < totalPages && (
                    <li className='page-item'>
                      <button className='page-link' onClick={() => { pageChange(endPage + 1) }}>다음</button>
                    </li>
                  )}
                </ul>
              </nav>
            </td></tr>
        </tfoot></table>
    </div>
  )
}

export default GalleryComm