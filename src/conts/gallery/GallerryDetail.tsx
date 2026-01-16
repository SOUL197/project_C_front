//GalleryDetail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './gallery.module.css';
import styles from '../matching/MatchingHome.module.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import GalleryComm from './GalleryComm';
import { useAuth } from '../../comp/AuthProvider';


interface GalleryItem {
  num: number;
  title: string;
  writer: string;
  contents: string;
  member_num: number;
  reip: string;
  hit: string;
  elike: string;
  gdate: string;
  getImgvo: string[] | null;
}

const GalleryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { member } = useAuth();
  const { num } = useParams<{ num: string }>();
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [elike, setElike] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!num) {
        console.error("num 파라미터가 없습니다.");
        setLoading(false);
        return;
      }
      try {
        const url = `${process.env.REACT_APP_BACK_END_URL}/gallery/galdetail`;
        const response = await axios.get(url, {
          params: { num: parseInt(num) }
        });
        console.log(response.data);
        setItem(response.data);
        setElike((response.data.elike));

      } catch (error) {
        console.error("데이터 요청 실패!", error);

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [num]);
  const galleryDel = async () => {
    if (window.confirm("정말 삭제할까요?")) {
      const url = `${process.env.REACT_APP_BACK_END_URL}/gallery/galdel?num=${num}`
      await axios.get(url);
      navigate("/gallery");
    }
  }
  const LikeClick = async () => {
    if (!item) return;

    try {
      // 1. 서버에 추천 요청 보냄 (API 경로는 실제 백엔드 컨트롤러에 맞춤)
      const url = `${process.env.REACT_APP_BACK_END_URL}/gallery/elike`;
      const response = await axios.post(url, null, {
        params: { num: item.num }
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

  return (
    <div className={style.container}>

      <table className={style.boardTable} width={"auto"}>
        <thead>
          <tr className={style.th}>
            <th>쓴이</th>
            <th>Date</th>
            <th>조회수</th>
            <th>추천</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td>{item?.writer}</td>
            <td>{item?.gdate}</td>
            <td>{item?.hit}</td>
            <td><img src={`${process.env.REACT_APP_BACK_END_URL}/imgfile/elike.png`}
              style={{ width: '30px', height: 'auto' }} onClick={LikeClick} alt='elike' />{elike}</td>
          </tr>
        </tbody></table>
      <div className={style.detail} >{item?.contents}</div>

      <div className={style.detail} >

        {item?.getImgvo && item.getImgvo.length > 0 ? (
          item.getImgvo.map((img, idx) => (
            <div className={style.detail} key={idx}>
              <img src={`${process.env.REACT_APP_BACK_END_URL}/imgfile/gallery/${img}`}
                alt={`img-${idx}`}
                className={style.image} />
            </div>
          ))
        ) : (
          <p>이미지가 없습니다.</p>
        )}
      </div>

      <div style={{ textAlign: 'center', margin: 20 }}>
        <button className={styles.likebutton} style={{ margin: 10 }} onClick={LikeClick}>추천</button>
        <button className={style.button} style={{ margin: 10 }} onClick={() => { navigate('/gallery') }}>목록</button>
        {
          (member?.num === item?.member_num || (member?.num ?? 0.5) <= 0) &&
          <button className={style.button} style={{ margin: 10 }} onClick={galleryDel}>삭제</button>
        }
      </div>
      <hr />
      <GalleryComm num={num} />
    </div>
  );
};
export default GalleryDetail;