import React, { useEffect, useState } from 'react'
import style from '../upboard/upboard.module.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';

interface FaqData {
    num: number;
    title: string;
    writer: string;
    member_num: number;
    content: string;
    gdate?: string;

}

const FaqForm: React.FC = () => {
    const [formData, setFormData] = useState<FaqData>({
        num: 0,
        title: '',
        writer: '',
        member_num: 0,
        content: '',
    });

    const { member } = useAuth();
    useEffect(() => {
        if (member !== null) {
            setFormData(prev => ({
                ...prev,
                member_num: member.num,
                writer: member.nickname
            }))
        }
    }, [member])

    const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }
    const navigate = useNavigate();

    const myFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('faq가 등록되었습니다.')
        const faqdata = new FormData();
        faqdata.append('title', formData.title);
        faqdata.append('writer', formData.writer);
        faqdata.append('content', formData.content);
        faqdata.append('member_num', formData.member_num.toString());

        try {
            console.log(`formData=?${faqdata}`);
            const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/faq/add`,
                { method: 'post', body: faqdata });
            navigate('/faq')
        } catch (error) {
            console.log('전송 오류');
        }

    }

    return (
        <div className={style.container}>
            <h1 style={{ textAlign: 'center' }}>FAQ 작성하기</h1>
            <form onSubmit={myFormSubmit} className={style.form}>
                <table className={style.boardTable}>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input type="text" name="title" id="title" style={{ width: "95%" }} required
                                    className={style.input} onChange={formChange} />
                            </td>
                        </tr>

                        <tr>
                            <th>내용</th>
                            <td>
                                <input type="text" name="content" id="content" style={{ width: "95%", height: "150px", padding: "8px" }}
                                    className={style.input} onChange={formChange} required />
                            </td>
                        </tr>

                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={2} style={{ textAlign: 'right' }}>
                                <button type="submit" className={style.button}>등록하기</button>
                            </th>

                        </tr>

                    </tfoot>
                </table>
            </form>
        </div>
    )
}

export default FaqForm