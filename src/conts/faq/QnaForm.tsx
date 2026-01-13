import React, { useState } from 'react'
import style from '../upboard/upboard.module.css'
import { useNavigate } from 'react-router-dom';

interface FormData {
    qnum: number;
    qtitle: string;
    qwriter: string;
    qcontent: string;
    qdate?: string;

}

const QnaForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        qnum: 0,
        qtitle: '',
        qwriter: '',
        qcontent: '',
    });

  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
          const {name, value} = e.target
          setFormData({ ...formData, [name]: value})
      }
const navigate = useNavigate();

const myFormSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        alert('1:1 문의가 등록되었습니다.')
        const  qnadata = new FormData();
        qnadata.append('qtitle',formData.qtitle);
        qnadata.append('qwriter',formData.qwriter);
        qnadata.append('qcontent',formData.qcontent);

        try {
            console.log(`formData=?${qnadata}`);
            const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/qna/addq`,
                {method:'post',body:qnadata});
                navigate('/myqna')
        } catch (error) {
            console.log('전송 오류');
        }

}

    return (
        <div className={style.container}>
            <h1 style={{ textAlign: 'center' }}>1:1문의</h1>
            <form onSubmit={myFormSubmit} className={style.form}>
                <table className={style.boardTable}>
                    <tbody>
                        <tr>
                            <th>제목</th>
                            <td>
                                <input type="text" name="qtitle" id="qtitle" style={{ width: "95%" }} required
                                    className={style.input} onChange={formChange} />
                            </td>
                        </tr>

                            <tr>
                            <th>작성자</th>
                            <td>
                                <input type="text" name="qwriter" id="qwriter" style={{ width: "95%" }} required
                                    className={style.input} onChange={formChange} />
                            </td>

                        </tr>

                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea name="qcontent" id="qcontent"
                                    style={{ width: "95%", height: "150px", padding: "8px" }}
                                onChange={formChange} required/>
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

export default QnaForm