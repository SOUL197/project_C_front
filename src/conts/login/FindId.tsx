import axios from "axios";
import React, { useState } from "react";
import style from "../signup/signup.module.css";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from "react-router-dom";

const FindId: React.FC = () => {
  const url = `${process.env.REACT_APP_BACK_END_URL}`;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string|null>(null);
  const navigate = useNavigate();

  const emailCheck = async () => {
    setLoading(true);
    setEmailMessage("");
    try {
      const res = await axios.post(`${url}/api/auth/emailCheck`, {
        email: email,
        type: "find",
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailVerified) {
      alert("이메일 인증을 해주세요.");
      return;
    }
    try {
      const res = await axios.post(`${url}/member/findId`, {
        email: email,
        username: username
      });
      if (res.data === "checkEmail") {
        alert("이름과 가입한 메일을 확인해주세요.")
      } else {
        setId(res.data);
      }
    } catch (error) {
      alert("처리 중 문제 발생");
      console.error(error);
    }
  };

  return (
    <div className={style.signupContainer}>
      {!id && (
      <div>
      <h2>아이디 찾기</h2>
      <form className={style.form} onSubmit={handleSubmit}>

        <label>이름</label>
            <div className={style.inputRow}>
                <input type="text" name="username" id="username" onChange={(e) => {setUsername(e.target.value)}} />
            </div>

        <label>이메일</label>
        <div className={style.inputRow}>
          <input type="email" name="email" id="email" onChange={(e) => {
              setEmail(e.target.value);
            }}/>
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
        <div className={style.inputRow}>
          <input type="text" name="code" id="code"onChange={(e) => {
              setCode(e.target.value);
            }}/>
          <button type="button" className={style.checkButton} onClick={checkEmailCode}>
            확인
          </button>
        </div>
        
        <button type="submit" className={style.submitButton}>
          다음
        </button>
      </form>
      </div>
      )}
      {id && (
        <div>
            <h2>아이디를 찾았어요</h2>
            <p>비밀번호를 잊으셨다면 '비밀번호 찾기'를 눌러주세요.</p>
            <div className={style.form}>
                <div className={style.inputRow}>
                    <p style={{border:'1px solid #ccc', borderRadius:'4px', flex:1, backgroundColor:'white',
                        fontSize:'20px', padding:'8px'
                    }}>{id}</p>
                </div>
                <div style={{display:'flex', justifyContent:'space-evenly'}}>
                <button onClick={()=> navigate('/findPwd',{state:{id:id, emailVerify:true}})} className={style.submitButton} style={{width:'45%', backgroundColor:'lightgray'}}>
                    비밀번호 찾기
                </button>
                <button onClick={()=> navigate('/login',{state:{id:id}})} className={style.submitButton} style={{width:'45%'}}>
                    로그인하러 가기
                </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FindId;
