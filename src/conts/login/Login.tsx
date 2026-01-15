import React, { useEffect, useState } from 'react'
import style from './login.module.css'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';
import axios from 'axios';

type LoginMode = "password" | "passwordless" | "pwlmanage";

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ id: '', pwd: '' });
    const [errors, setErrors] = useState<{ id?: string; pwd?: string }>({});
    const [message, setMessage] = useState('');
    const [loginMode, setLoginMode] = useState<LoginMode>("password");
    const [rememberId, setRememberId] = useState(false);
    const [progress, setProgress] = useState(0);

    // qr 생성
    const [qr, setQr] = useState();
    // 대기 시간
    const [waitTime, setWaitTime] = useState(0);
    // 등록 여부
    const [isJoined, setIsJoined] = useState(false);
    // 인증코드
    const [authCode, setAuthCode] = useState('');
    // 관리용 토큰
    // const [pwlToken, setPwlToken] = useState('');
    // // 세션 ID
    // const [sessionId, setSessionId] =useState('');

    useEffect(() => {
        if(isJoined){
            startPasswordless();
        }
    }, [isJoined]);

    useEffect(()=>{
        if (rememberId) {
            localStorage.setItem('rememberId', formData.id);
        }
    },[rememberId, formData])


        // let id = localStorage.getItem('rememberId');
        // if(id !== null){
        //     setFormData({...formData, id: id})
        // }


    const joinAp = async () => {
        try {
            // 인증 정보 조회
            const resp = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/passwordlessCallApi`,
                {url: "isApUrl", params: `userId=${formData.id}&QRReg=`},
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'},withCredentials: true})

            if(resp.data.data.exist){
                alert("이미 인증 정보가 있습니다.");
                return;
            }

            // 인증 정보가 없으면 등록 요청
            const resp2 = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/passwordlessManageCheck`,
                {id: formData.id, pwd: formData.pwd},{headers: {'Content-Type': 'application/x-www-form-urlencoded'},withCredentials: true})
                let pwlToken = resp2.data.PasswordlessToken;

            const resp3 = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/passwordlessCallApi`,
                {url: "joinApUrl", params: `userId=${formData.id}&token=${pwlToken}`},
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'},withCredentials: true})

            // qr 생성
            setQr(resp3.data.data.qr);

            //다시 사용자 등록 정보확인 요청 (이때 반복해서 1초마다 수행)
            // resp3.data.data.terms가 0이 될때가지  시간 감소하면서 수행
            let terms = resp3.data.data.terms
            const interval = setInterval(async () => {
                // 인증 정보 조회
                const resp4 = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/passwordlessCallApi`,
                {url: "isApUrl", params: `userId=${formData.id}&QRReg=`},
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'},withCredentials: true})

                // 등록이 되었다면  성공메세지를 출력하고 로그인 페이지로 이동
                if(resp4.data.data.exist){
                    alert("등록되었습니다.");
                    setQr(undefined);
                    setIsJoined(true);
                    setLoginMode('passwordless');
                    clearInterval(interval);
                    return;
                }

                // 대기 시간 감소
                setWaitTime(terms--);

                // terms가 0이 되면 종료
                if(terms === 0){
                    alert("등록에 실패했습니다.");
                    clearInterval(interval);
                    setQr(undefined);
                    return;
                }
            }, 1000);
            
          } catch (error) {
            // 에러 메시지 출력
            alert(error);
          }
    }

    // 등록되면 바로 로그인 수행할 수 있도록 인증번호 요청
    const handleRequestAuthCode = async () => {
        let interval: NodeJS.Timeout | undefined;
        try {
            // 토큰 요청
            console.log(formData.id)
            const resp = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/passwordlessCallApi`,
            {url: "getTokenForOneTimeUrl", params: `userId=${formData.id}`},
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'},withCredentials: true})

            // 토큰 할당
            const token = resp.data.oneTimeToken;

            // 토큰을 가지고 인증 요청, 프론트에서는 사용자 아이디와 토큰만 전달
            const resp2 = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/passwordlessCallApi`,
            {url: "getSpUrl", params: `userId=${formData.id}&token=${token}`},
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'},withCredentials: true})

            // 인증코드 설정
            setAuthCode(resp2.data.data.servicePassword);
            const sessionId = resp2.data.sessionId;

            // 반복하면서 모바일 승인 여부 확인
            interval = setInterval(async () => {
                try {
                    const resp4 = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/api/login/passwordlessCallApi`,
                    {url: "resultUrl", params: `userId=${formData.id}&sessionId=${sessionId}`},
                    {headers: {'Content-Type': 'application/x-www-form-urlencoded',}, withCredentials: true},)
                        console.log(resp4);
                    // 모바일 승인 여부 확인
                    if(resp4.data.data.auth === "Y"){
                        alert("모바일 승인 성공");
                        checkLogin();
                        clearInterval(interval);
                        navigate(from, { replace: true });
                        return;
                    }

                }catch(error){

                }
                
            }, 1000);
            
        } catch (error) {
            clearInterval(interval);
        }
    }

    const navigate = useNavigate();
    const { login, checkLogin } = useAuth();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    let from = '/';
    const state = location.state as { from?: Location | string };


    if (state?.from) {
        if (typeof state.from == 'string') {
            from = state.from;
        } else if (typeof state.from === 'object') {
            from = (state.from as Location).pathname;
        }

    } else if (searchParams.get('from')) {
        from = searchParams.get('from')!;
    }

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // 다시 입력하면 해당 필드 에러만 초기화
        setErrors(prev => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const submitLogin = async () => {
        const newErrors: { id?: string; pwd?: string } = {};
        if (!formData.id.trim()) {
            newErrors.id = '아이디를 입력해주세요.';
        }

        if (!formData.pwd.trim()) {
            newErrors.pwd = '비밀번호를 입력해주세요.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (loginMode === "passwordless") {
            startPasswordless();
            return;
        } else if (loginMode === 'pwlmanage') {
            joinAp();
            return;
        }

        const result = await login(formData.id, formData.pwd);
        if (result === 'success') {
            setErrors({});

            navigate(from, { replace: true });
        } else if (result === 'fail') {
            setErrors({
                pwd: '아이디나 비밀번호가 틀렸습니다.',
            });

        } else {
            alert('서버 오류');
        }
    };

    /** passwordless mock */
    const startPasswordless = () => {
        setProgress(0);
        handleRequestAuthCode();
        const timer = setInterval(() => {
        setProgress((prev) => {
            if (prev >= 100) {
            clearInterval(timer);
            return 100;
            }
            return prev + 1;
        });
        }, 600);
    };

    return (
        <div className={style.signupContainer}>
            <h2>Login</h2>
            <form className={style.form} onSubmit={(e) => {
                e.preventDefault();
            }}
            >
                <label>아이디</label>
                <div className={style.inputGroup}>
                    <input type="text" name="id" value={formData.id} onChange={inputChange} placeholder="id" className={style.inpuselectfield} />
                    {errors.id && <p className={style.error}>{errors.id}</p>}
                </div>

                {/* Remember ID */}
                <div style={{ fontSize: "80%" }}>
                    <input type="checkbox" id="save_id" checked={rememberId} onChange={() => setRememberId(!rememberId)} />
                    <label htmlFor="save_id"> ID 저장하기 </label>
                </div>

                <label>{loginMode === "password" ? "비밀번호" : ""}</label>
                <div className={style.inputGroup}>
                    {(loginMode === "password" || loginMode === 'pwlmanage') && (
                    <input type="password" name="pwd" value={formData.pwd} onChange={inputChange} placeholder="password" className={style.inpuselectfield} />
                    )}
                    {errors.pwd && <p className={style.error}>{errors.pwd}</p>}

                    {loginMode === "passwordless" && (
                    <div style={{ marginTop: 10 }}>
                        <div style={{ height: 50, borderRadius: 8, overflow: "hidden", position: "relative", backgroundImage:'url(/image/timerBG.png)', backgroundSize:'cover', backgroundPosition:'center right' }}>
                            <div style={{ height: "100%", width: `${progress}%`, background: "rgba(55,138,239,0.99)", transition: "width 0.5s" }}/>
                            <div style={{ position: "absolute", inset: 0, textAlign: "center",
                                lineHeight: "50px", color: "#fff", fontWeight: 800,
                                textShadow:'2px 2px 3px rgba(0,0,0,0.7)', fontSize: '22px', width: '100%', letterSpacing: '1px'
                                }}>
                                {progress > 0 && `${authCode.replace(/(\d{3})(\d{3})/, '$1 $2')}`}
                            </div>
                        </div>
                    </div>
                    )}
                    {qr !== undefined && 
                        <div>
                            <div>
                                <span style={{width: '100%', textAlign: 'center', fontWeight: 500, fontSize: '24px'}} >
                                    Registering the Passwordless Services
                                </span>
                                <img src={qr} alt='QR 이미지'/>
                                <p style={{width:'100%', padding: '0% 0%', fontWeight: 500, fontSize: '16px', lineHeight: '24px'}} >
                                    After installing the Passwordless X1280 app on your smartphone, please scan the QR code.
                                </p>
                                <b>
                                    <span id="rest_time" style={{fontSize: '24px', textShadow: '1px 1px 2px rgba(0,0,0,0.9)', color: '#afafaf'}} >
                                        {waitTime}
                                    </span>
                                </b>
                            </div>
                        </div>
                    }
                </div>

                {/* Login Mode Select */}
                    <div style={{ textAlign: "center", margin: "15px 0" }}>
                        <label>
                            <input type="radio" checked={loginMode === "password"} onChange={() => setLoginMode("password")}/>
                            Password
                        </label>

                        <label style={{ marginLeft: 20 }}>
                            <input type="radio" checked={loginMode === "passwordless"} onChange={() => setLoginMode("passwordless")}/>
                            Passwordless
                        </label>
                    </div>

                <button type="submit" onClick={submitLogin} className={style.loginButton}>{loginMode === 'pwlmanage' ? '등록하기' : '로그인'}</button>
                <button type="submit" className={style.pwdlessButton}>패스워드리스 로그인</button>
                <div style={{ textAlign: 'center' }}>아직 계정이 없으신가요?</div>
                <button type="submit" className={style.signupButton} onClick={() => window.location.href = '/signup'}>회원가입 하기</button>
                <div style={{ textAlign: 'center', marginTop: '15px', display: 'flex', justifyContent: 'space-evenly' }}>
                    <a href="/signup" style={{ textDecoration: 'none' }}>회원가입 하기</a>
                    |
                    {loginMode === 'password' ? 
                        (<><a href="/findId" style={{ textDecoration: 'none' }}>아이디 찾기</a>
                        |
                        <a href="/findPwd" style={{ textDecoration: 'none' }}>비밀번호 찾기</a></>)
                        :
                        (<a href='javacsript:void(0)' onClick={()=>setLoginMode('pwlmanage')} style={{ textDecoration: 'none' }}>패스워드리스 등록하기</a>)
                    }
                </div>
            </form>
        </div>
    );
};

export default Login