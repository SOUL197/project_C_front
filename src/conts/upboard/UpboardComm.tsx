import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from '../matching/MatchingHome.module.css'
import { useAuth } from '../../comp/AuthProvider';

//부모로부터 전송되어 오는 properties
interface UpboardCommProps {
  num?: string;
}

interface UpboardCommVO {
  comm_num: number;
  board_num: number;
  bwriter: string;
  member_num: number;
  bcontent: string;
  elike: string;
  reip: string;
  bcdate: string;
}

const UpboardComm: React.FC<UpboardCommProps> = ({ num }) => {
  const [comments, setComments] = useState<UpboardCommVO[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [writer, setWriter] = useState("");
  const [content, setContent] = useState("");
  const [member_num, setMember_num] = useState(0);
  const { member } = useAuth();
  useEffect(() => {
    if (member !== null) {
      setMember_num(member?.num);
    }
  }, [member])

  const commentSubmit = async (e: React.FormEvent) => {
    if (member?.num === undefined) {
      alert("로그인이 필요합니다.");
      return;
    }
    e.preventDefault();
    console.log(`writer =>${writer}`);
    console.log(`Content =>${content}`);
    //useState에서 받아온 데이터를 json화 하기
    //이때 키 : 값 일때는 키는 UpBoardCommVO의 property와 같아야 한다.

    const commentData = {
      board_num: num,
      bwriter: member?.nickname,
      member_num: member.num,
      bcontent: content,
      // reip:'192.168.0.9'  --> 자동 입력으로 설정함
    }
    //axios.post(url,data,{headers:{'Content-Type':'application/json='}})
    try {
      await axios.post(`${process.env.REACT_APP_BACK_END_URL}/board/commadd`, commentData,
        { headers: { 'Content-Type': 'application/json' } })
      fetchboardcomm(1);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  }
  //페이지 처리
  const fetchboardcomm = async (page: number) => {
    try {
      //@RequestParam Map<String, String> paramMap
      const urls = `${process.env.REACT_APP_BACK_END_URL}/board/commlist`;
      const response = await axios.get(urls,
        {
          params: {
            cPage: page,
            board_num: num
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
    if (num) {
      fetchboardcomm(currentPage);
    }
  }, [num, currentPage]);
  //page Handler
  const pageChange = (page: number) => {
    setCurrentPage(page);
  }

  const delcomment = async (comm_num: number) => {
    if (!window.confirm("정말 삭제할까요?")) {
      return;
    }
    try {
      const url = `${process.env.REACT_APP_BACK_END_URL}/board/delcomm`;
      await axios.post(url, {
        comm_num: comm_num,
        board_num: num
      });
      fetchboardcomm(currentPage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='mt-4'>
      <h4>Comments</h4>
      <form className='mb-3' onSubmit={commentSubmit}>
        <div className='mb-2'>
          <input type='text' placeholder='작성자' className='form-control' onChange={(e) => setWriter(e.target.value)} value={member?.nickname || ''} disabled />
        </div>
        <div className='mb-2'>
          <textarea className='form-control' placeholder='댓글' onChange={(e) => setContent(e.target.value)} value={content || ''}></textarea>
        </div>
        <div className='text-center'>
          <button type="submit" className='btn btn-primary' >댓글작성</button>
        </div>
      </form>

      <ul className='list-group'>
        {
          comments && comments.map((vo) => (
            <div key={vo.comm_num} className='list-group-item'>
              <li className='list-group-item' style={{ textAlign: "left", padding: '15px' }}>{vo.bcontent}
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  {vo.bwriter} | {vo.bcdate}
                  {
                    (member?.num === vo.member_num || (member?.num ?? 0.5) <= 0) &&
                    <button className='btn btn-sm btn-warning ms-2' style={{ marginBottom: '10px' }} onClick={() => { delcomment(vo.comm_num) }}>삭제</button>
                  }
                </div></li>
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

export default UpboardComm