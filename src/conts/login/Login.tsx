import React, { useEffect, useState } from 'react'
import style from './login.module.css'
import styles from '../signup/signup.module.css'
import { useLocation } from 'react-router-dom'

const Login: React.FC = () => {
    const singupSubmit = () => { }
    const memberChange = () => { }
    const location = useLocation();
    const {state} = location;
    const [userid, setUserid] = useState("");

    useEffect(()=>{
        if (state !== null) {
            setUserid(state.userid);
        }
    },[state])

    return (
        <div className={styles.signupContainer}>
            <h2>Login</h2>
            <form className={styles.form} onSubmit={singupSubmit}>
                <label>아이디</label>
                <div className={styles.inputRow}>
                    <input type="text" name="username" id="username" value={userid} onChange={memberChange} required />
                </div>

                <label>비밀번호</label>
                <input type="password" name="password" id="password" onChange={memberChange} required />

                <button type="submit" className={styles.submitButton}>로그인</button>
                <button type="submit" className={styles.submitButton}>패스워드리스 로그인</button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '15px', display: 'flex', justifyContent: 'space-evenly' }}>
                <a href="/signup" style={{ textDecoration: 'none' }}>회원가입 하기</a>
                |
                <a href="/findId" style={{ textDecoration: 'none' }}>아이디 찾기</a>
                |
                <a href="/findPwd" style={{ textDecoration: 'none' }}>비밀번호 찾기</a>
            </div>

            {/* 버튼 이미지와 함께 추가 */}
            <div className={style.buttonContainer}>

            <button className={style.imageButton}>
                <img src="/social/instagram.png" alt="Instagram" />
            </button>

            <button className={style.imageButton}>
                <img src="/social/x.jpg" alt="X" />
            </button>

            <button className={style.imageButton}>
                <img src="/social/kakaotalk.png" alt="KakaoTalk"/>
            </button>
            </div>
        </div>
    )
}

export default Login