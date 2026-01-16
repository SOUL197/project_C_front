import React, { useEffect, useState } from 'react'
import style from './upboard.module.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import UpboardComm from './UpboardComm';
import styles from '../matching/MatchingHome.module.css'
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';

interface UpBoardVO {
  num: number;
  title: string;
  writer: string;
  content: string;
  member_num?: string;
  imgn?: string;
  hit: number;
  reip: string;
  elike?: string;
  bdate?: string;
  mfile: File | null;
}

const UpboardDetail: React.FC = () => {
  const { member } = useAuth();
  const [upboard, setUpboard] = useState<UpBoardVO | null>(null);
  const { num } = useParams<{ num: string }>();
  const [elike, setElike] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const detailServer = async () => {
      const url = `${process.env.REACT_APP_BACK_END_URL}/board/detail?num=${num}`;
      const resp = await axios.get(url);
      console.log(resp.data);
      setUpboard(resp.data);
      setElike((resp.data.elike));
    }
    detailServer();
  }, [num]);

  const LikeClick = async () => {
    if (!upboard) return;

    try {
      // 1. 서버에 추천 요청 보냄 (API 경로는 실제 백엔드 컨트롤러에 맞춤)
      const url = `${process.env.REACT_APP_BACK_END_URL}/board/elike`;
      const response = await axios.post(url, null, {
        params: { num: upboard.num }
      });

      if (response.status === 200) {
        // 2. 서버 저장 성공 시에만 화면의 숫자를 올림
        setElike(prev => (prev || 0) + 1);
        alert("추천되었습니다!");
      }
    } catch (error) {
      console.error("추천 처리 중 오류 발생:", error);
      alert("추천을 처리할 수 없습니다.");
    }

  };
  const imageBasePath = `${process.env.REACT_APP_BACK_END_URL}/imgfile/`;

  const upboardDel = async () => {
    const url = `${process.env.REACT_APP_BACK_END_URL}/board/del?num=${num}`
    await axios.get(url);
    if (window.confirm("정말 삭제할까요?")) {
      navigate("/community/uplist/");
    }
  }
  return (
    <div className={style.container}>
      <div >
        <table className={style.boardTable} >
          <thead>
            <tr className={style.th} style={{ textAlign: 'center' }}>
              <th>작성자</th>
              <th>제목</th>
              <th style={{ width: '175px' }}>Date</th>
              <th style={{ width: '80px' }}>조회수</th>
              <th style={{ width: '80px' }}>추천</th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td>{upboard?.writer}</td>
              <td>{upboard?.title}</td>
              <td>{upboard?.bdate}</td>
              <td>{upboard?.hit}</td>
              <td><img src={`${process.env.REACT_APP_BACK_END_URL}/imgfile/elike.png`}
                style={{ width: '30px', height: 'auto' }} onClick={LikeClick} alt='elike' />{elike}</td>
            </tr>
          </tbody></table>
      </div>
      <div className={style.boardTable} style={{ height: "auto", textAlign: "center" }}>
        {upboard?.imgn && (
          <img src={`${imageBasePath}${upboard.imgn}`} alt={upboard.title}
            className='img-fluid mt-2' />
        )}
      </div><br /><br />
      <div>
        {upboard?.content}
      </div>
      <div style={{ textAlign: 'center', margin: 20 }}>
        <button className={styles.likebutton} style={{ margin: 10 }} onClick={LikeClick} >추천</button>
        <Link to="/community/uplist" className={style.button} style={{ margin: 10 }} >목록</Link>
        {
          (member?.num === upboard?.member_num || (member?.num ?? 0.5) <= 0) &&
          <button className={style.button} style={{ margin: 10, backgroundColor: '#B22222' }} onClick={upboardDel} >삭제</button>
        }

      </div>
      <hr />
      <UpboardComm num={num} />
    </div>
  )

}

export default UpboardDetail