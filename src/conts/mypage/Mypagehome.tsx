import React, { useEffect, useState } from 'react'
import style from './mypage.module.css'
import { useNavigate } from 'react-router-dom'
import Mypagedetail from './Mypagedetail'
import Gallery from '../gallery/Gallery'
import UpboardList from '../upboard/UpboardList'
import LikeHome from '../Like/LikeHome'
import Gongjilist from '../gongji/Gongjilist'
import MyQna from '../faq/MyQna'
import { Button, Modal } from 'react-bootstrap'
import Mypageimage from './MypageImage'
import Loginlog from '../login/Loginlog'
import MyPageStats from '../chart_ui/MyPageStats'
import MyDate from '../date/Mydate'
import { useAuth } from '../../comp/AuthProvider'
import axios from 'axios'
import QnaList from '../faq/QnaList'
import AdminAnswer from '../faq/AdminAnswer'

const Mypagehome: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const [profileimage, setProfileImage] = useState('');
  const [likes, setLikes] = useState(0);
  const [date, setDate] = useState([]);
  const [show, setShow] = useState(false);
  const [menu, setMenu] = useState('');
  const [selectedMenu, setSelectedMenu] = useState<React.ReactElement>();
  const [myupboard, SetMyUpBoard] = useState(0);
  const [mygallery, SetMyGallery] = useState(0);
  const imageBasePath = `${process.env.REACT_APP_BACK_END_URL}/imgfile/profileimage/`;

  const renderContent = (menu: string) => {
    switch (menu) {
      case 'Chart':
        return <MyPageStats />
      case 'Change Profile':
        return <Mypagedetail onSuccess={handleClose} />;
      case 'Gallery':
        return <Gallery isMyPage={true} />
      case 'Community':
        return <UpboardList isMyPage={true} />
      case 'Like':
        return <LikeHome />
      case 'Notice':
        return <Gongjilist />
      case 'FAQ':
        return <MyQna />
      case 'Image':
        return <Mypageimage />
      case 'LoginLog':
        return <Loginlog />
      case 'Qna':
        return <QnaList />
      case 'AdminA':
        return <AdminAnswer />
      case 'MyDate':
        return <MyDate setShow={setShow} />
    }
  }

  useEffect(() => {
    if (!member) return;

    const getprofileimage = async () => {
      try {
        const url = `${process.env.REACT_APP_BACK_END_URL}/matching/getimage`;
        const likeurl = `${process.env.REACT_APP_BACK_END_URL}/api/like/mylike`;
        const dateurl = `${process.env.REACT_APP_BACK_END_URL}/api/date/mydate`;
        const boardurl = `${process.env.REACT_APP_BACK_END_URL}/board/list`;
        const galleryurl = `${process.env.REACT_APP_BACK_END_URL}/gallery/gallist`;
        const [resp, likeresp, dateresp, boardresp, gallresp] = await Promise.all([
          axios.get(url, { withCredentials: true }),
          axios.post(likeurl, { cPage: 1 }, { withCredentials: true }),
          axios.get(dateurl, { withCredentials: true }),
          axios.get(boardurl, {
            params: {
              mypage: true,
              num: member?.num,
            }, withCredentials: true
          }),
          axios.get(galleryurl, {
            params: {
              mypage: true,
              num: member?.num,
            }, withCredentials: true
          })
        ]);
        console.log('게시판 >' + boardresp.data.data.length + '갤러리 >' + gallresp.data.data.length);
        setProfileImage(resp.data);
        setLikes(likeresp.data.data.length);
        setDate(dateresp.data);
        SetMyUpBoard(boardresp.data.data.length);
        SetMyGallery(gallresp.data.data.length);
        console.log(dateresp.data);
      } catch (error) {
        console.error(error);
      }
    }
    getprofileimage();
  }, [member]);

  useEffect(() => {
    setSelectedMenu(renderContent(menu));
  }, [menu])

  const handleClose = () => {
    setShow(false)
    setMenu('')
    setSelectedMenu(undefined)
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShow(true)
    setMenu(e.currentTarget.id)
  };
  return (
    <div>
      <section className={style.mypageContainer}>
        <div className={style.fading}>
          <h3 className={style.title} >{member?.nickname}님의 마이페이지</h3></div>

        {/* 상단 영역 */}
        <div className={style.topArea}>
          <div className={style.profileRow}>
            {/* 프로필 */}
            <div className={style.profileSection}>
              <img
                className={style.profileImg}
                src={`${imageBasePath}${profileimage}?t=${Date.now()}`}
                alt="user"
              />
              <button id='Image' className={style.addBtn} onClick={handleClick}>+</button>
              <div className={style.username}>{member?.nickname}</div>
              <p>다들 좋은 하루 되세요</p>
            </div>

            {/* 통계 */}
            <div className={style.statsRow}>
              <button
                className={style.statBtn}
              >
                <div className={style.num}>{mygallery + myupboard}</div>
                <div className={style.label}>내 게시물</div>
              </button>
              <button
                className={style.statBtn}
              >
                <div className={style.num}>{likes}</div>
                <div className={style.label}>Like</div>
              </button>
              <button
                className={style.statBtn}
              >
                <div className={style.num}>{date.length ? 'YES' : 'NO'}</div>
                <div className={style.label}>Date</div>
              </button>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className={style.menuGrid}>
          <button id='Change Profile' onClick={handleClick} className={style.menuBtn}>
            개인정보 수정
          </button>
          <button id='Chart' onClick={handleClick} className={style.menuBtn}>
            내 매칭 통계
          </button>
          <button id='Gallery' onClick={handleClick} className={style.menuBtn}>
            나의 자랑하기
          </button>
          <button id='Community' onClick={handleClick} className={style.menuBtn}>
            내 작성글
          </button>
          <button id='Like' onClick={handleClick} className={style.like}>
            Like
          </button>

          {(member?.num ?? 0.5) <= 0 ?
            <button id='AdminA' onClick={handleClick} className={style.menuBtn}>
              1대1 문의 답변
            </button> : <button id='Qna' onClick={handleClick} className={style.menuBtn}>
              내 문의
            </button>
          }
          <button id='LoginLog' className={style.menuBtn} onClick={handleClick}>로그인 기록</button>
          <button id='MyDate' className={style.date} onClick={handleClick}>Date</button>
        </div>

      </section>
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
        <Modal.Body style={{ textAlign: 'center' }}>
          {selectedMenu}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  )
}

export default Mypagehome
