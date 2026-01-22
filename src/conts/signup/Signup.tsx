import React, { useEffect, useState } from 'react'
import style from './signup.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* 회원가입 */

interface MemberForm {
    username: string;
    nickname: string;
    id: string;
    pwd: string;
    email: string;
    regDate?: string;
}

const Signup: React.FC = () => {

    const [form, setForm] = useState<MemberForm>({
        username: '',
        nickname: '',
        id: '',
        pwd: '',
        email: '',
    });

    const regex = {
        username: /^[가-힣a-zA-Z]{1,30}$/,               // 한글 or 영문만
        nickname: /^[가-힣a-zA-Z0-9]{1,10}$/,                      // 최대 10자
        id: /^[a-z0-9]{5,20}$/,                     // 영문 소문자 + 숫자 (5~20)
        pwd: /^[A-Za-z0-9^$*.[\]{}()?\-"!@#%&/,><':;|_~`+=]{8,30}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,        // 일반 이메일
    };

    const [code, setCode] = useState('');

    const [usernameMessage, setUsernameMessage] = useState('');
    const [isUsernameValid, setIsUsernameValid] = useState(false);

    const [nicknameMessage, setNicknameMessage] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

    const [idMessage, setIdMessage] = useState('');
    const [isIdAvailable, setIsIdAvailable] = useState(false);

    const [pwdConfirm, setPwdConfirm] = useState('');
    const [pwdMessage, setPwdMessage] = useState('');
    const [isPwdMatched, setIsPwdMatched] = useState(false);
    const [pwdConfirmTouched, setPwdConfirmTouched] = useState(false);
    const [pwdErrorMessage, setPwdErrorMessage] = useState('');

    const [emailMessage, setEmailMessage] = useState('');
    const [isEmailAvailable, setIsEmailAvailable] = useState(false);

    const [codeMessage, setCodeMessage] = useState('');
    const [isCodeAvailable, setIsCodeAvailable] = useState(false);

    const [type, setType] = useState('');

    const navigate = useNavigate();
    const urls = `${process.env.REACT_APP_BACK_END_URL}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'username') {
            if (!value) {
                setUsernameMessage('');
                setIsUsernameValid(false);
            } else if (!regex.username.test(value)) {
                setUsernameMessage('이름에는 공백이나 숫자, 특수문자를 사용할 수 없습니다.');
                setIsUsernameValid(false);
            } else {
                setUsernameMessage('');
                setIsUsernameValid(true);
            }
        }

        if (name === 'nickname') { setNicknameMessage(''); setIsNicknameAvailable(false); }
        if (name === 'id') { setIdMessage(''); setIsIdAvailable(false); }
        if (name === 'pwd') {
            setPwdConfirmTouched(false);
            setPwdErrorMessage('');
            setPwdMessage('');
        }
        if (name === 'email') { setEmailMessage(''); setIsEmailAvailable(false); }
        if (name === 'code') { setCodeMessage(''); setIsCodeAvailable(false); }
    };

    const nicknameCheck = async () => {
        if (!form.nickname.trim()) {
            setNicknameMessage('닉네임을 입력해 주세요.');
            setIsNicknameAvailable(false);
            return;
        }

        if (!regex.nickname.test(form.nickname)) {
            setNicknameMessage('닉네임은 공백/특수문자 없이 10자 이내여야 합니다.');
            setIsNicknameAvailable(false);
            return;
        }

        try {
            const res = await axios.get(`${urls}/member/nicknameCheck?nickname=${form.nickname}`);
            if (res.data === 0) {
                setNicknameMessage('사용 가능한 닉네임입니다.');
                setIsNicknameAvailable(true);

            } else {
                setNicknameMessage('이미 사용 중인 닉네임입니다.');
                setIsNicknameAvailable(false);
            }
        } catch (err) {
            alert('닉네임 중복 확인 실패');
            console.error(err);
        }
    };

    const idCheck = async () => {
        if (!form.id.trim()) {
            setIdMessage('아이디를 입력해 주세요.');
            setIsIdAvailable(false);
            return;
        }

        if (!regex.id.test(form.id)) {
            setIdMessage("아이디는 5~20자의 영문 소문자와 숫자만 가능합니다.");
            setIsIdAvailable(false);
            return;
        }

        try {
            const res = await axios.get(`${urls}/member/idCheck?id=${form.id}`);
            if (res.data === 0) {
                setIdMessage('사용 가능한 아이디입니다.');
                setIsIdAvailable(true);

            } else {
                setIdMessage('이미 사용 중인 아이디입니다.')
                setIsIdAvailable(false);
            }
        } catch (err) {
            alert('아이디 중복 확인 실패');
            console.error(err);
        }
    };

    const pwdRules = {
        lowercase: /[a-z]/,
        uppercase: /[A-Z]/,
        number: /[0-9]/,
        special: /[^A-Za-z0-9]/,
    };

    const pwdChecks = {
        lowercase: pwdRules.lowercase.test(form.pwd),
        uppercase: pwdRules.uppercase.test(form.pwd),
        number: pwdRules.number.test(form.pwd),
        special: pwdRules.special.test(form.pwd),
        length: form.pwd.length >= 8,
    };

    const validatePassword = () => {
        if (!form.pwd) return '';

        if (form.pwd.length > 30) {
            return '비밀번호는 30자를 초과할 수 없습니다.';
        }

        if (!isPwdValid) {
            return '비밀번호 조건을 모두 만족해야 합니다.';
        }

        return '';
    };


    const isPwdValid = Object.values(pwdChecks).every(Boolean);

    const handlePwdConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPwdConfirm(value);

        if (!value) {
            setPwdMessage('');
            setIsPwdMatched(false);
            return;
        }

        if (value !== form.pwd) {
            setPwdMessage('비밀번호가 맞지 않습니다.');
            setIsPwdMatched(false);
        } else {
            setPwdMessage('비밀번호가 일치합니다.');
            setIsPwdMatched(true);
        }
    };

    useEffect(() => {
        if (!form.pwd) {
            setPwdErrorMessage('');
            return;
        }

        if (form.pwd.length > 30) {
            setPwdErrorMessage('비밀번호는 30자를 초과할 수 없습니다.');
            return;
        }

        if (!isPwdValid) {
            setPwdErrorMessage('비밀번호 조건을 모두 만족해야 합니다.');
        } else {
            setPwdErrorMessage('');
        }
    }, [form.pwd]);

    const emailCheck = async () => {

        if (!form.email.trim()) {
            setEmailMessage('이메일을 입력해 주세요.');
            setIsEmailAvailable(false);
            return;
        }

        if (!regex.email.test(form.email)) {
            setEmailMessage("이메일 주소가 정확한지 확인해 주세요.");
            setIsEmailAvailable(false);
            return;
        }

        try {
            const res = await axios.post(`${urls}/api/auth/emailCheck`, {
                email: form.email, type: 'sign'
            });
            if (res.data === 0) {
                alert('인증 번호가 발송되었습니다.');
                setEmailMessage('사용 가능한 이메일입니다.');
                setIsEmailAvailable(true);
            } else {
                setEmailMessage('이미 사용 중인 이메일입니다.');
                setIsEmailAvailable(false);
            }

        } catch (err) {
            alert('이메일 인증 중 오류 발생');
            console.error(err);
        }

    };

    const checkEmailCode = async () => {
        try {
            const res = await axios.post(`${urls}/api/auth/emailCheck/certification`, {
                email: form.email, code: code
            });

            const result = res.data;

            if (result.success) {
                setCodeMessage('이메일 인증이 완료되었습니다.');
                setIsCodeAvailable(true);

            } else {
                if (result.reason === 'exceeded') {
                    setCodeMessage('3회 이상 인증번호를 틀려 더 이상 시도할 수 없습니다. \n 다시 인증번호를 요청하세요.');
                    setIsCodeAvailable(false);

                } else if (result.reason === 'expired') {
                    setCodeMessage('인증번호 유효 시간이 만료되었습니다. \n 다시 인증번호를 요청하세요.');
                    setIsCodeAvailable(false);

                } else if (result.reason === 'wrong') {
                    setCodeMessage('인증번호가 일치하지 않습니다.');
                    setIsCodeAvailable(false);
                }
            }

        } catch (err) {
            alert('인증번호 확인 오류');
            console.error(err);
        }
    };

    const canSubmitSignup = () => {

        if (!isUsernameValid) return false;

        if (!isNicknameAvailable) return false;

        if (!isIdAvailable) return false;

        if (!isPwdValid) return false;
        if (form.pwd.length > 30) return false;
        if (!isPwdMatched) return false;

        if (!isEmailAvailable) return false;
        if (!isCodeAvailable) return false;

        return true;
    };




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isUsernameValid) return;
        if (!isNicknameAvailable) return;
        if (!isIdAvailable) return;
        if (!isPwdValid || !isPwdMatched) return;
        if (!isEmailAvailable || !isCodeAvailable) return;

        if (!canSubmitSignup()) {
            alert('입력값을 다시 확인해 주세요.');
            return;
        }

        try {
            const formdata = new FormData()
            formdata.append('username', form.username);
            formdata.append('nickname', form.nickname);
            formdata.append('id', form.id);
            formdata.append('pwd', form.pwd);
            formdata.append('email', form.email);

            await axios.post(`${urls}/member/signup`, formdata);
            alert('회원가입이 완료되었습니다.');
            navigate('/');

        } catch (error) {
            console.error('회원가입 오류', error);
            alert('회원가입 실패');
        }

        if (!regex.pwd.test(form.pwd)) {
        alert("비밀번호는 8~30자의 영문, 숫자, 특수문자를 사용해 주세요.");
        return;
        }

        if (!isPwdValid) {
        alert("비밀번호 조건을 모두 만족해야 합니다.");
        return;
        }

        if (!isPwdMatched) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return;
        }
    }


    return (
        <div className={style.signupContainer}>
            <form onSubmit={handleSubmit} className={style.form}>
                <h2 className={style.title}>회 원 가 입</h2>
                <div className={style.formBody}>

                    {/* 이름 */}
                    <div className={style.fieldset}>
                        <label htmlFor="username">이름</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="한글 또는 영문만 입력"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className={style.inputselectfield}
                        />
                        {usernameMessage && (
                            <p className={style.error}>{usernameMessage}</p>
                        )}
                    </div>


                    {/* 닉네임 */}
                    <div className={style.fieldset}>
                        <label htmlFor="nickname">닉네임</label>
                        <div className={style.inputRow}>
                            <input
                                type="text"
                                name="nickname"
                                placeholder="한글 또는 영문만 최대 10글자"
                                value={form.nickname}
                                onChange={handleChange}
                                required
                                className={style.inputselectfield}
                            />
                        </div>
                    </div>
                    <button type="button" className={style.checkButton} onClick={nicknameCheck}>중복확인</button>
                    {nicknameMessage && (<p className={isNicknameAvailable ? style.success : style.error}> {nicknameMessage}</p>)}


                    {/* 아이디 */}
                    <div className={style.fieldset}>
                        <label htmlFor="id">아이디</label>
                        <div className={style.inputRow}>
                            <input
                                type="text"
                                name="id"
                                placeholder="영문 소문자, 숫자 (5~20자)"
                                value={form.id}
                                onChange={handleChange}
                                required
                                className={style.inputselectfield}
                            />
                        </div>
                    </div>
                    <button type="button" className={style.checkButton} onClick={idCheck}>중복확인</button>
                    {idMessage && (<p className={isIdAvailable ? style.success : style.error}> {idMessage}</p>)}


                    {/* 비밀번호 */}
                    <div className={style.fieldset}>
                        <label htmlFor="pwd">비밀번호</label>
                        <input
                            type="password"
                            name="pwd"
                            placeholder="영문 대/소문자, 숫자, 특수문자 (8~30자)"
                            value={form.pwd}
                            onChange={handleChange}
                            required
                            className={style.inputselectfield}
                        />
                        

                        <ul className={style.passwordRules}>
                        <li className={pwdChecks.lowercase ? style.active : ""}>
                        <span className={style.dot} /> 영문 소문자 1개 이상
                        </li>
                        <li className={pwdChecks.uppercase ? style.active : ""}>
                        <span className={style.dot} /> 영문 대문자 1개 이상
                        </li>
                        <li className={pwdChecks.number ? style.active : ""}>
                        <span className={style.dot} /> 숫자 1개 이상
                        </li>
                        <li className={pwdChecks.special ? style.active : ""}>
                        <span className={style.dot} /> 특수문자 1개 이상
                        </li>
                        <li className={pwdChecks.length ? style.active : ""}>
                        <span className={style.dot} /> 8자 이상
                        </li>
                    </ul>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className={style.fieldset}>
                        <label htmlFor="pwdConfirm">비밀번호 확인</label>
                        <input
                            type="password"
                            name="pwdConfirm"
                            value={pwdConfirm}
                            onChange={handlePwdConfirmChange}
                            onBlur={() => {
                                setPwdConfirmTouched(true);

                                const error = validatePassword();
                                setPwdErrorMessage(error);
                            }}
                            required
                            className={style.inputselectfield}
                        />
                        
                    </div>
                    {pwdMessage && (<p className={isPwdMatched ? style.success : style.error}> {pwdMessage}</p>)}
                    {pwdConfirmTouched && pwdErrorMessage && (
                        <p className={style.error}>{pwdErrorMessage}</p>
                    )}

                    {/* 이메일 */}
                    <div className={style.fieldset}>
                        <label htmlFor="email">이메일</label>
                        <div className={style.inputRow}>
                            <input
                                type="email"
                                name="email"
                                placeholder="example@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className={style.inputselectfield}
                            />
                        </div>
                    </div>
                    <button type="button" className={style.checkButton} onClick={emailCheck}>인증</button>
                    {emailMessage && (<p className={isEmailAvailable ? style.success : style.error}> {emailMessage}</p>)}


                    {/* 인증번호 */}
                    <div className={style.fieldset}>
                        <label htmlFor="code">인증번호</label>
                        <div className={style.inputRow}>
                            <input
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className={style.inputselectfield}
                            />
                        </div>
                    </div>
                    <button type="button" className={style.checkButton} onClick={checkEmailCode}>확인</button>
                    {codeMessage && (<p className={isCodeAvailable ? style.success : style.error}> {codeMessage}</p>)}

                    {/* 버튼 */}
                    <div className={style.buttonRow}>
                        <button type="button" className={style.backButton} onClick={() => navigate(-1)}>뒤 로 가 기</button>

                        <button type="submit" className={style.joinButton} disabled={
                            !isPwdValid ||
                            !isPwdMatched ||
                            !isNicknameAvailable ||
                            !isIdAvailable ||
                            !isEmailAvailable ||
                            !isCodeAvailable
                        }>가 입 하 기</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Signup