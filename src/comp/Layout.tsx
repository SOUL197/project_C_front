import React, { useEffect, useState } from 'react'
import './headers.css'
import DropdownNav from './DropdownNav'
import DropdownNavService from './DropdownNavService'
import { useNavigate } from 'react-router-dom'
import DropdownChart from '../conts/chart_ui/DropdownChart'
import { useAuth } from './AuthProvider'
import axios from 'axios'


interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { member, logout } = useAuth();
    const [profileimage, setProfileImage] = useState('');
    const imageBasePath = `${process.env.REACT_APP_BACK_END_URL}/imgfile/profileimage/`;
    const navigate = useNavigate();

    const loginNav = () => {
        navigate("/login")
    }
    const handleLogout = async () => {
        await logout();
        alert('로그아웃 되었습니다');
        navigate('/');
    }

    useEffect(() => {
        if (!member?.nickname) {
            return;
        }
        const getprofileimage = async () => {
            try {
                const url = `${process.env.REACT_APP_BACK_END_URL}/matching/getimage`;
                const resp = await axios.get(url, { withCredentials: true });
                setProfileImage(resp.data);
            } catch (error) {
                console.error(error);
            }
        }
        getprofileimage();
    }, [member]);
    return (

        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header>
                <div className="header" style={{padding:'8px 0'}}>
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-lg-start" style={{ justifyContent: 'center' }}>
                            <a href="/"><img src="/image/header_1.png" alt="" style={{ marginTop: '13px', width: '200px', marginRight: '450px' }} /></a>
                            <ul className="nav col-12 col-lg-auto my-2 my-md-0" style={{ justifyContent: 'center', marginLeft: 10 }}>
                                {/* <li>
                                    <a href="/test" style={{ font: 'icon', textDecoration: 'underline', textUnderlineOffset: '5px', fontWeight: 'bolder', paddingTop: '22px' }}>
                                        테스트
                                    </a>
                                </li>
                                <li>
                                    <a href="/test2" style={{ font: 'icon', textDecoration: 'underline', textUnderlineOffset: '5px', fontWeight: 'bolder', paddingTop: '22px' }}>
                                        테스트2
                                    </a>
                                </li>
                                <li>
                                    <a href="/test3" style={{ font: 'icon', textDecoration: 'underline', textUnderlineOffset: '5px', fontWeight: 'bolder', paddingTop: '22px' }}>
                                        테스트3
                                    </a>
                                </li> */}

                                <li>
                                    <a href="/" className="nav-link text-white" style={{ font: 'icon', textDecoration: 'underline', textUnderlineOffset: '5px', fontWeight: 'bolder', paddingTop: '22px' }}>
                                        홈
                                    </a>
                                </li>
                                <li>
                                    <DropdownNav />
                                </li>
                                <li>
                                    <a href="/surveylist" className="nav-link text-white" style={{ font: 'icon', textDecoration: 'underline', textUnderlineOffset: '5px', fontWeight: 'bold', paddingTop: '22px' }}>
                                        설문조사
                                    </a>
                                </li>
                                <li>
                                    <a href="/vchart" className="nav-link text-white" style={{ font: 'icon', textDecoration: 'underline', textUnderlineOffset: '5px', fontWeight: 'bold', paddingTop: '22px' }}>
                                        대시보드
                                    </a>
                                </li>
                                <li>
                                    <DropdownNavService />
                                </li>
                            </ul>
                            <div className="text-end">
                                {
                                    !member && <button type="button" className="login-btn" onClick={loginNav}>Login</button>
                                }
                                {
                                    member && <><a href="/alarm"><img src="/home/alarm_1.png" alt="1" style={{ width: '45px', paddingLeft: '8px' }} /></a>
                                        <a href="/mypage"><img src={`${imageBasePath}${profileimage}`} alt="1" style={{ marginLeft: '13px', border: '3px solid #ddd', borderRadius: '50%', width: '45px' }} /></a>
                                        &nbsp;&nbsp;
                                        <button type="button" className="login-btn" onClick={handleLogout}>Logout</button></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-3 py-2 border-bottom mb-3">
                </div>
            </header>

            <main style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{children}</main>

            <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
                <div style={{ color: '#000', padding: '1px', borderRadius: '0 0 8px 8px', textAlign: 'center' }}>
                    @ 2025 ICTPassword
                </div>
            </footer>
        </div>
    )
}

export default Layout