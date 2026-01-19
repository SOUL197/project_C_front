import React, { useEffect, useState } from 'react'
import style from './mypagedetail.module.css'
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';

interface ModalProps {
    setShow: (show: boolean) => void;
}

const Mypagedetail: React.FC<ModalProps> = ({ setShow }) => {
    const { member, profile } = useAuth();
    const [form, setForm] = useState({
        memberid: 0,
        gender: "",
        birth: "",
        phone: "",
        country: "",
        address: "",
        addressDetail: "",
        height: "",
        weight: "",
        hobby: [] as string[],
        mbti: "",
        religion: "",
        religionType: "",
        drinking: "",
        drinkingType: "",
        smoking: "",
        smokingType: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const submitData = async () => {

        try {
            const payload = {
                ...form,
                address: form.addressDetail
                    ? `${form.address} ${form.addressDetail}`
                    : form.address,
                drinking:
                    form.drinking === "음주"
                        ? `음주(${form.drinkingType})`
                        : "비음주",
                smoking:
                    form.smoking === "흡연"
                        ? `흡연(${form.smokingType})`
                        : "비흡연",
                religion:
                    form.religion === "종교"
                        ? `종교(${form.religionType})`
                        : "무교",
                hobby: form.hobby.join(",")
            };

            console.log("서버로 보내는 최종 데이터:", payload);

            const response = await axios.post(
                `${process.env.REACT_APP_BACK_END_URL}/mypage/detail`,
                payload
            );

            if (response.status === 200) {
                alert("프로필 정보가 성공적으로 저장되었습니다.");
                console.log("서버 응답:", response.data);
            }
        } catch (error) {
            console.error("저장 중 오류 발생:", error);
            alert("서버 연결에 실패했습니다.");
        }

    };

    useEffect(() => {
        const memberid = localStorage.getItem("memberid");
        if (member && member.num) {
            setForm(prev => ({ ...prev, memberid: member.num }));
        }
        const savedProfile = localStorage.getItem("userProfileForm"); //
        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile); //
            // memberid와 member.num이 일치하는 경우에만 불러오도록 조건 추가
            if (member && member.num && parsedProfile.memberid === member.num) {
                setForm(prev => ({ ...prev, ...parsedProfile }));
            }
        }
        if (!member?.num) return;

        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_BACK_END_URL}/mypage/detail/${member.num}`
                );

                if (res.data) {
                    const parsed = { ...res.data };

                    //   상세 선택 항목 불러오기

                    if (parsed.address?.includes(" ")) {
                        const [addr, detail] = parsed.address.split(" ");
                        parsed.address = addr;
                        parsed.addressDetail = detail;
                    }

                    if (parsed.drinking?.includes("(")) {
                        const [base, detail] = parsed.drinking.split("(");
                        parsed.drinking = base;
                        parsed.drinkingType = detail.replace(")", "");
                    }

                    if (parsed.smoking?.includes("(")) {
                        const [base, detail] = parsed.smoking.split("(");
                        parsed.smoking = base;
                        parsed.smokingType = detail.replace(")", "");
                    }

                    if (parsed.religion?.includes("(")) {
                        const [base, detail] = parsed.religion.split("(");
                        parsed.religion = base;
                        parsed.religionType = detail.replace(")", "");
                    }

                    const safeParsed = {
                        ...parsed,
                        phone: parsed.phone ?? "",
                        country: parsed.country ?? "",
                        address: parsed.address ?? "",
                        addressDetail: parsed.addressDetail ?? "",
                        height: parsed.height?.toString() ?? "",
                        weight: parsed.weight?.toString() ?? "",
                        mbti: parsed.mbti ?? "",
                        religion: parsed.religion ?? "",
                        drinking: parsed.drinking ?? "",
                        smoking: parsed.smoking ?? "",
                    };

                    setForm(prev => ({
                        ...prev,
                        ...safeParsed,
                        hobby: parsed.hobby === 'blank' ? [] : parsed.hobby ? parsed.hobby.split(",") : [],
                    }));
                }
            } catch (err) {
                console.error("프로필 조회 실패", err);
            }
        };

        fetchProfile();
    }, [member]);


    if (!member) {
        return <div>사용자 정보를 불러오는 중입니다...</div>;
    };

    const handleHobbyChange = (value: string) => {
        if (form.hobby.includes(value)) {
            setForm({ ...form, hobby: form.hobby.filter(h => h !== value) });

        } else {
            if (form.hobby.length >= 3) {
                alert("취미는 최대 3개까지 선택할 수 있습니다.");
                return;
            }
            setForm({ ...form, hobby: [...form.hobby, value] });
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNumber = e.target.value.replace(/\D/g, "");
        let formatted = onlyNumber;

        if (onlyNumber.length > 3 && onlyNumber.length <= 7) {
            formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
        } else if (onlyNumber.length > 7) {
            formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7, 11)}`;
        }
        setForm({ ...form, phone: formatted });
    };


    const addressMap: Record<string, string[]> = {
        서울: ["마포구", "동대문구", "강남구"],
        부산: ["해운대구", "수영구", "사하구"],
        제주: ["제주시", "서귀포시"]
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({
            ...form,
            address: e.target.value,
            addressDetail: ""
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.gender) return alert("성별을 선택해 주세요.");
        if (!/^\d{8}$/.test(form.birth.replaceAll("-", "")))
            return alert("생년월일은 8자리 숫자로 입력해 주세요.");
        if (!/^\d{3}-\d{4}-\d{4}$/.test(form.phone))
            return alert("휴대폰 번호가 정확한지 확인해 주세요.");
        if (!form.country) return alert("국가를 선택해 주세요.");
        if (!form.address) return alert("주소를 선택해 주세요.");
        if (!form.height) return alert("키를 입력해 주세요.");
        if (!form.weight) return alert("체중을 입력해 주세요.");
        if (form.hobby.length === 0)
            return alert("취미는 최소 하나 이상 선택해 주세요.");
        if (!form.mbti) return alert("MBTI를 선택해 주세요.");
        if (!form.religion) return alert("종교 여부를 확인해 주세요.");
        if (!form.drinking) return alert("음주 여부를 확인해 주세요.");
        if (!form.smoking) return alert("흡연 여부를 확인해 주세요.");

        await submitData();

        console.log("저장된 프로필 정보:", form);
        setShow(false);
    };


    return (
        <div className={style.container}>
            <h2 className={style.title}>프로필 저장</h2>
            <form onSubmit={handleSubmit} className={style.form}>
                <label className={style.label}></label>
                <table className={style.input} style={{ margin: '0 auto' }}>
                    <tbody>
                        <tr>
                            <th>성별</th>
                            <td>
                                <button type="button" className={form.gender === "남자" ? style.activeBtn : style.genderbtn}
                                    onClick={() => setForm({ ...form, gender: "남자" })} style={{ padding: '5px', borderRadius: '5px' }}
                                >
                                    남자
                                </button>
                                &nbsp;
                                <button
                                    type="button"
                                    className={form.gender === "여자" ? style.activeBtn : style.genderbtn}
                                    onClick={() => setForm({ ...form, gender: "여자" })} style={{ padding: '5px', borderRadius: '5px' }}
                                >
                                    여자
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <th>생년월일</th>
                            <td><input type="date" name="birth" value={form.birth} onChange={handleChange} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #000' }} /></td>
                        </tr>
                        <tr>
                            <th>휴대폰</th>
                            <td><input type="tel" name="phone" inputMode="numeric" maxLength={13} value={form.phone} onChange={handlePhoneChange} placeholder="010-0000-0000"
                                style={{ padding: '5px', borderRadius: '5px', border: '1px solid #000' }} /></td>
                        </tr>
                        <tr>
                            <th>국가</th>
                            <td>
                                <select name="country" onChange={handleChange} value={form.country} style={{ padding: '5px', borderRadius: '5px' }}>
                                    <option value="">선택</option>
                                    <option value="한국">대한민국</option>
                                    <option value="중국">중국</option>
                                    <option value="일본">일본</option>
                                    <option value="미국">미국</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td>
                                <select name="address" value={form.address} onChange={handleAddressChange} style={{ padding: '5px', borderRadius: '5px' }}>
                                    <option value="">선택</option>
                                    <option value="서울">서울</option>
                                    <option value="부산">부산</option>
                                    <option value="제주">제주</option>
                                </select>
                                {form.address && addressMap[form.address] && (
                                    <select
                                        name="addressDetail"
                                        value={form.addressDetail}
                                        onChange={handleChange}
                                        style={{ marginLeft: "8px", padding: '5px', borderRadius: '5px' }}
                                    >
                                        <option value="">상세 선택</option>
                                        {addressMap[form.address].map(detail => (
                                            <option key={detail} value={detail}>
                                                {detail}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>키</th>
                            <td><input type="number" name="height" onChange={handleChange} value={form.height ?? ""}
                                style={{ padding: '5px', borderRadius: '5px', border: '1px solid #000', marginRight: '5px' }} />
                                <span className='fs-5'>cm</span>
                            </td>
                        </tr>
                        <tr>
                            <th>체중</th>
                            <td><input type="number" name="weight" onChange={handleChange} value={form.weight ?? ""}
                                style={{ padding: '5px', borderRadius: '5px', border: '1px solid #000', marginRight: '5px' }} />
                                <span className='fs-5'>kg</span>
                            </td>
                        </tr>
                        <tr>
                            <th>취미</th>
                            <td>
                                {["운동", "영화", "게임", "여행"].map(h => (
                                    <label key={h}>
                                        <input
                                            type="checkbox"
                                            checked={form.hobby.includes(h)}
                                            onChange={() => handleHobbyChange(h)}

                                        /> {h}
                                    </label>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <th>mbti</th>
                            <td>
                                <select name="mbti" onChange={handleChange} value={form.mbti} style={{ padding: '5px', borderRadius: '5px' }}>
                                    <option value="">선택</option>
                                    {["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP",
                                        "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>종교</th>
                            <td>
                                <label>
                                    <input type="radio" name="religion" value="종교" onChange={handleChange} checked={form.religion === "종교"} /> 있음
                                </label>
                                <label>
                                    <input type="radio" name="religion" value="무교" onChange={handleChange} checked={form.religion === "무교"} /> 없음
                                </label>
                                {form.religion === "종교" && (
                                    <select name="religionType" onChange={handleChange} value={form.religionType}>
                                        <option value="">선택</option>
                                        <option value="불교">불교</option>
                                        <option value="기독교">기독교</option>
                                        <option value="천주교">천주교</option>
                                    </select>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>음주</th>
                            <td>
                                <label>
                                    <input type="radio" name="drinking" value="음주" onChange={handleChange} checked={form.drinking === "음주"} /> 마신다
                                </label>
                                <label>
                                    <input type="radio" name="drinking" value="비음주" onChange={handleChange} checked={form.drinking === "비음주"} /> 안 마신다
                                </label>
                                {form.drinking === "음주" && (
                                    <select name="drinkingType" onChange={handleChange} value={form.drinkingType}>
                                        <option value="">선택</option>
                                        <option value="맥주">맥주</option>
                                        <option value="소주">소주</option>
                                        <option value="와인">와인</option>
                                    </select>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>흡연</th>
                            <td>
                                <label>
                                    <input type="radio" name="smoking" value="흡연" onChange={handleChange} checked={form.smoking === "흡연"} /> 피운다
                                </label>
                                <label>
                                    <input type="radio" name="smoking" value="비흡연" onChange={handleChange} checked={form.smoking === "비흡연"} /> 안 피운다
                                </label>
                                {form.smoking === "흡연" && (
                                    <select name="smokingType" onChange={handleChange} value={form.smokingType}>
                                        <option value="">선택</option>
                                        <option value="일주일에 3번 이하">일주일에 3번 이하</option>
                                        <option value="일주일에 5번 이하">일주일에 5번 이하</option>
                                        <option value="매일">매일</option>
                                    </select>
                                )}
                            </td>
                        </tr>
                    </tbody>

                    {/* 버튼 */}
                    <tfoot>
                        <tr>
                            <th colSpan={2}>
                                <button type="submit" className={style.button + " btn btn-primary btn-sm w-auto py-2 mt-2"}>정보 수정</button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </form>
        </div>
    )
}

export default Mypagedetail