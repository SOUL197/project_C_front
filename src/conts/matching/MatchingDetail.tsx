import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './MatchingHome.module.css'
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';

interface MatchingVO {
    NUM: number;
    NICKNAME: string;
    GENDER: string;
    BIRTH: string;
    PHONE: string;
    ADDRESS: string;
    COUNTRY: string;
    MBTI: string;
    HEIGHT: number;
    WEIGHT: number;
    SMOKING: string;
    DRINKING: string;
    RELIGION: string;
    HOBBY: string;
    PROFILEIMAGE: string[];
}

const MatchingDetail: React.FC = () => {
    const [matchingDetail, setMatchingDetail] = useState<MatchingVO>();
    const { member, getAge } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const imageBasePath = `${process.env.REACT_APP_BACK_END_URL}/imgfile/profileimage/`;
    const navigate = useNavigate();

    //id parameter에 따른 각자의 상세정보 데이터를 불러옴
    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                console.error("id parameter가 없습니다");
                setLoading(false);
                return;
            }
            try {
                const url = `${process.env.REACT_APP_BACK_END_URL}/matching/matchingdetail`;
                const resp = await axios.get(url, {
                    params: { num: parseInt(id) }
                });
                console.log(resp.data);
                setMatchingDetail(resp.data);
            } catch (error) {
                console.log("데이터 요청 실패: ", error)
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    // Like 요청 보내기
    const sendRequest = async () => {
        const receiverId = matchingDetail?.NICKNAME;
        await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/like/request`, { receiverId }, { withCredentials: true });
        alert("Like 신청 완료");
    }

    return (
        <div style={{ marginBottom: 80 }}>
            <div className={styles.card} style={{ width: '500px', height: '600px', margin: '0 auto', textAlign: 'center' }}>
                <img src={imageBasePath + matchingDetail?.PROFILEIMAGE} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <br />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                    {matchingDetail?.NICKNAME} {getAge(matchingDetail?.BIRTH || '')}세
                </span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '20px' }}>
                <p>#{matchingDetail?.ADDRESS} 거주 #MBTI는 {matchingDetail?.MBTI}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <button className={styles.likebutton} onClick={sendRequest} style={{ fontSize: 'x-large', padding: '10px 20px' }}>Like</button>
            </div>
            <br />
            <div style={{ textAlign: 'center' }}>
                <button className={styles.backbutton} onClick={() => { navigate(-1) }}>돌아가기</button>
            </div>
            {
                loading && <p>로딩중입니다...</p>
            }
        </div>
    )
}

export default MatchingDetail