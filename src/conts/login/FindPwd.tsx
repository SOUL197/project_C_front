import React, { useEffect, useState } from "react";
import style from "./login.module.css";
import SyncLoader from "react-spinners/SyncLoader";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const FindPwd: React.FC = () => {
  const url = `${process.env.REACT_APP_BACK_END_URL}`;
  const location = useLocation();
  const {state} = location;

  const [id, setId] = useState<string|null>("");
  const [pwd, setPwd] = useState("");
  const [passCheck, setPassCheck] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [idMessage, setIdMessage] = useState("");
  const [passMessage, setPassMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    if(state!==null) {
        setId(state.id);
        setEmail(state.email);
        setIsEmailVerified(state.emailVerify)
    }
  },[state])

  useEffect(()=>{
    if(pwd !== passCheck) {
        setPassMessage("비밀번호를 확인해주세요.");
    } else {
        setPassMessage("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[passCheck])

  const emailCheck = async () => {
    setLoading(true);
    setEmailMessage("");
    try {
      const res = await axios.post(`${url}/api/auth/emailCheck`, {
        email: email,
        type: "find",
        id: id,
      });
      if (res.data === 2) {
        alert("인증 번호가 발송되었습니다.");
        setEmailMessage("인증 번호가 발송되었습니다.");
        setIsEmailVerified(false);
      } else if (res.data === 0) {
        setEmailMessage("해당 메일의 가입 정보가 없습니다.");
      } else {
        setEmailMessage("이메일 형식을 확인해주세요.");
      }
    } catch (error) {
      alert("이메일 인증 중 오류 발생");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const checkEmailCode = async () => {
    try {
      const res = await axios.post(`${url}/api/auth/emailCheck/certification`, {
        email: email,
        code: code,
      });
      const result = res.data;
      if (result.success) {
        alert("이메일 인증 성공!");
        setIsEmailVerified(true);
      } else {
        if (result.reason === "exceeded") {
          alert(
            "3회 이상 인증번호를 틀려 더 이상 시도할 수 없습니다. \n다시 인증번호를 요청하세요."
          );
        } else if (result.reason === "expired") {
          alert(
            "인증번호 유효시간이 만료되었습니다. \n다시 인증번호를 요청하세요."
          );
        } else if (result.reason === "wrong") {
          alert("인증번호가 일치하지 않습니다.");
        }
      }
    } catch (err) {
      alert("인증번호 확인 오류");
      console.error(err);
    }
  };
  const idCheck = async (e:React.FormEvent) => {
    e.preventDefault();
    setIdMessage("");
    try {
      const res = await axios.get(`${url}/member/idCheck?id=${id}`);
      if (res.data === 0) {
        setIdMessage('가입된 아이디가 아닙니다. 다시 확인해 주세요.')
      } else {
        setIsIdVerified(true);
      }
    } catch (error) {
      alert('아이디 확인 실패'); console.error(error);
    }
  };
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post(`${url}/member/findPwd`,{
            id:id,
            email:email,
            pwd:pwd
        });
        alert('비밀번호 변경이 완료되었습니다.');
        navigate('/login',{state:{id:id}});
    } catch (error) {
        alert('변경 중 문제 발생');
        console.error(error);
    }
  }
    
  return (
    <div className={style.signupContainer}>
      {state === null && !isIdVerified && (
      <div>
      <h2>비밀번호 찾기</h2>
      <p>아이디를 입력해 주세요.</p>
      <form className={style.form} onSubmit={idCheck}>

        <label>아이디</label>
            <div className={style.inputGroup}>
                <input type="name" name="id" id="id" onChange={(e) => {setId(e.target.value)}} className={style.inpuselectfield} />
            </div>
            {idMessage && <div>{idMessage}</div>}
        <button type="submit" className={style.loginButton}>
          다음
        </button>
      </form>
      </div>
      )}
      {isIdVerified && !isEmailVerified && (
        <div>
        <h2>비밀번호 찾기</h2>
        <p>이메일 인증을 완료해주세요.</p>
        <form className={style.form}>
            <label>이메일</label>
                <div className={style.inputGroup}>
                    <input type="email" name="email" id="email" onChange={(e) => {
                        setEmail(e.target.value);
                    }} className={style.inpuselectfield}/>
                    <button type="button" className={style.checkButton} onClick={emailCheck}>
                        인증
                    </button>
                </div>
                {loading && (
                    <div style={{ textAlign: "center" }}>
                        <SyncLoader color="#C63DEE" />
                    </div>
                )}
                {emailMessage && <div>{emailMessage}</div>}

            <label>인증번호</label>
                <div className={style.inputGroup}>
                    <input type="text" name="code" id="code"onChange={(e) => {
                        setCode(e.target.value);
                    }} className={style.inpuselectfield}/>
                    <button type="button" className={style.loginButton} onClick={checkEmailCode}>
                        확인
                    </button>
                </div>
        </form>
        </div>
      )}
      {(state !== null || isEmailVerified) && (
        <div className={style.inputGroup}>
            <h2>새 비밀번호를 입력해주세요</h2>
            <form className={style.form} onSubmit={handleSubmit}>
                <label>비밀번호</label>
                    <input type="password" name="pwd" id="pwd" onChange={(e)=>{setPwd(e.target.value)}} className={style.inpuselectfield}/>

                <label>비밀번호 확인</label>
                    <input type="password" name="pwdCheck" id="pwdCheck" onChange={(e)=>{setPassCheck(e.target.value)}} className={style.inpuselectfield}/>
                    {passMessage && (<div>{passMessage}</div>)}
                <button type='submit' className={style.loginButton}>변경</button>
            </form>
        </div>
      )}
    </div>
  );
};

export default FindPwd;
