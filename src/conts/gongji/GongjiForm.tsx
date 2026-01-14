import React, { useEffect, useState } from 'react'
import style from '../upboard/upboard.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';

interface GongjiVO{
    num: number;
    title: string;
    writer: string;
    member_num: number;
    content: string;
    gdate?: string;
   
}

const GongjiForm: React.FC = () => {

    const [formData, setFormData] = useState<GongjiVO>({
        num: 0,
        title: '',
        writer: '',
        member_num: 0,
        content: '',
   
    });

    const {member} = useAuth();
    useEffect(()=>{
        if(member !== null) {
            setFormData({...formData, member_num: member.num})
        }
    },[member])

    const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        const {name, value} = e.target
        setFormData({ ...formData, [name]: value})
    }
    
      const navigate = useNavigate();
      
      const myFormSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        alert('공지사항이 등록되었습니다.')
        const  gongjidata = new FormData();

        gongjidata.append('title',formData.title);
        gongjidata.append('writer', formData.writer);
        gongjidata.append('content', formData.content);
        gongjidata.append('member_num', formData.member_num.toString());
        
        try {
          console.log(`FormData=?${gongjidata}`);
          const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/gongji/add`,
            {method:'post',body:gongjidata});
            navigate('/gongji');
        } catch (error) {
          console.log('전송오류');
        }
      }

    return (
        <div className={style.container}>
            <h2>공지사항 작성</h2>
            <form  onSubmit={myFormSubmit} className={style.form}>
                <table className={style.boardTable}>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input type="text" name="title" id="title" className={style.input} onChange={formChange}
                                    style={{ width: "95%" }} required />
                            </td>
                        </tr>
                        <tr>
                            <th>작성자</th>
                            <td>
                                <input type="text" name="writer" id="writer" className={style.input} onChange={formChange}
                                    style={{ width: "95%" }} required />  </td>
                        </tr>
                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea name="content" id="content" style={{ width: "95%", height: "300px", padding: "8px" }}
                                    onChange={formChange}  required />
                            </td>
                        </tr>
                        
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={2}>
                                <button type="submit" className={style.button}>등록하기</button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </form>

        </div>

    )

}

export default GongjiForm