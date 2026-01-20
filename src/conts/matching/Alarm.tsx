import React, { useEffect, useState } from 'react'
import styles from './MatchingHome.module.css'
import Chart from '../chart_ui/Chart';
import { Button, Modal } from 'react-bootstrap';
import Map from '../map/Map';
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';
import { AddressMap } from './Geocoding';

//프로필 받아오는 JSON 형식
interface MemberProfile {
  NUM: number;
  NICKNAME: string;
  BIRTH: string;
  PROFILEIMAGE: string;
  ID: number;
  DATE_LOCATION?: string;
}

const Alarm: React.FC = () => {
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [likeprofile, setLikeProfile] = useState<MemberProfile[]>([]);
  const [dateprofile, setDateProfile] = useState<MemberProfile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { member, getAge } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const imageBasePath = `${process.env.REACT_APP_BACK_END_URL}/imgfile/profileimage/`;

  //alarm 첫 화면 마운트 시 like 요청 띄우기
  useEffect(() => {
    setCategory('like');
  }, []);

  // category 바뀔때마다 like 및 date 요청 데이터 불러옴
  useEffect(() => {
    const fetchData = async () => {
      if (category === 'like') {
        try {
          const url = `${process.env.REACT_APP_BACK_END_URL}/api/like/incoming`;
          const resp = await axios.get(url, {
            withCredentials: true
          });
          console.log(resp.data);
          const exceptme = resp.data.filter((req: any) => req.NICKNAME !== member?.nickname);
          console.log(exceptme);
          setLikeProfile(exceptme);
        } catch (error) {
          console.log("데이터 요청 실패: ", error)
        } finally {
          setLoading(false);
        }
      } else if (category === 'date') {
        try {
          const url = `${process.env.REACT_APP_BACK_END_URL}/api/date/incoming`;
          const resp = await axios.get(url, {
            withCredentials: true
          });
          console.log(resp.data);
          setDateProfile(resp.data);
        } catch (error) {
          console.log("데이터 요청 실패: ", error)
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
    //카테고리 말고도 계정이 바뀌거나 refresh 변화시 데이터 재요청
  }, [category, member, refresh]);

  //내게 온 like 요청에 대해 응답하는 함수
  const likeResponse = async (nickname: string, action: string) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/like/respond`, { nickname, action }, { withCredentials: true });
      alert(`${action === 'accept' ? '수락' : '거절'} 처리됨`);
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error(error);
    }

  }
  //내게 온 date 요청에 대해 응답하는 함수 
  const dateResponse = async (nickname: string, action: string) => {
    try {
      const resp = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/date/respond`, { nickname, action }, { withCredentials: true });
      const status = resp.data;
      alert(`${status === 'accepted' ? '수락처리됨' : action === 'reject' ? '거절처리됨' : `${member?.nickname}님 또는 상대방이 이미 다른 데이트를 진행 중입니다.`}`);
      setRefresh(prev => prev + 1);
      setCategory('date');
    } catch (error) {
      console.error(error);
    }
  }

  // modal 관리용 usestate setshow로 모달 띄우기를 관리
  // menu는 모달창의 제목
  const [show, setShow] = useState(false);
  const [menu, setMenu] = useState('');
  // modal 닫는 함수
  const handleClose = () => { setShow(false); setMenu('') }
  // modal 여는 함수
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(e.currentTarget.id)
    setShow(true)
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>{member?.nickname}님의 Alarm</h2>
      {/*Like 요청 Date 요청 구분하여 볼 수 있게 함*/}
      <div style={{ textAlign: 'center', fontSize: '30px', height: '50px' }}>
        <button className={styles.button} id='like' type='button' onClick={() => { setCategory('like') }}>Like 요청</button>
        <button className={styles.button} id='date' type='button' onClick={() => { setCategory('date') }}>Date 요청</button>
      </div>

      {
        category === 'date' && (<div style={{ margin: '30px auto' }}>
          {
            dateprofile.map((e, i) => (<React.Fragment key={i}>
              <div className={styles.card} style={{ width: '500px', margin: '20px auto', textAlign: 'center' }}>
                <img src={`${imageBasePath}${e.PROFILEIMAGE}`} alt='' />
                <div className={styles.cardTitle}>{e.NICKNAME}님의 Date 요청</div>
                <div className={styles.cardTitle}>{e.DATE_LOCATION?.split(',')[0]}{e.DATE_LOCATION?.split(',')[1]}에서 만나요</div>
              </div>
              <br />
              <div style={{ textAlign: 'center' }}>
                {/*내게 온 date 요청에서 DB에 저장된 위치정보를 네이버맵 api의 GeoCoding을 통해 지도에 위치를 찍어주고 
                상세정보로 더욱 자세히 위치를 알 수 있음 위치보기는 이 위치를 modal로 띄워주는 역할이며 이 창에서 date 수락을 할 수 있음 */}
                <button id='mapp' className={styles.likebutton} onClick={(e) => { handleClick(e); setSelectedIndex(i) }}>위치보기</button>
                {/* date 거절 */}
                <button className={styles.dislikebutton} onClick={() => { dateResponse(e.NICKNAME, 'reject') }}>싫어요</button>
              </div>
            </React.Fragment>
            ))
          }
        </div>)
      }

      {
        category === 'like' && (<div style={{ margin: '30px auto' }}>
          {likeprofile.map((e, i) => (<React.Fragment key={i}>
            <div className={styles.card} style={{ width: '500px', margin: '20px auto', textAlign: 'center' }}>
              <img src={`${imageBasePath}${e.PROFILEIMAGE}`} alt='' />
              <div className={styles.cardTitle}>{e.NICKNAME}</div>
              <div className={styles.cardTitle}>{getAge(e.BIRTH)}</div>
            </div>
            <br />
            <div style={{ textAlign: 'center' }}>
              {/*Like 요청 수락 및 거절 */}
              <button className={styles.likebutton} onClick={() => { likeResponse(e.NICKNAME, 'accept') }}>좋아요</button>
              <button className={styles.dislikebutton} onClick={() => { likeResponse(e.NICKNAME, 'reject') }}>싫어요</button>
            </div></React.Fragment>
          ))
          }
        </div >)
      }

      {/* Modal 영역 */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='xl'
      >
        <Modal.Header closeButton>
          <Modal.Title>{menu}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {show && dateprofile[selectedIndex]?.DATE_LOCATION ? (
            <>{/* AddressMap 은 네이버 지도 api의 GeoCoding을 위한 컴포넌트, 각 date 요청의 위치정보를 받아 지도에 표시해주는 역할을 함*/}
              <AddressMap address={dateprofile[selectedIndex].DATE_LOCATION?.split(',')[0] || ''} />
              <div style={{ textAlign: 'center' }}><p>상세주소 : {dateprofile[selectedIndex].DATE_LOCATION?.split(',')[1]}</p></div>
            </>) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              위치 정보를 불러올 수 없습니다.
            </div>)}
        </Modal.Body>
        <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
          {/* Date 수락 및 modal 창 닫기 */}
          <Button variant="primary" onClick={() => { dateResponse(dateprofile[selectedIndex].NICKNAME, 'accept') }}>
            Date
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Alarm