import React, { useEffect, useState } from 'react'
import Style from '../upboard/upboard.module.css'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface GongjiVO{
  num: number;
  title: string;
  writer: string;
  content: string;
  gdate: string;
}



const GongjiDetail: React.FC = () => {
  const{num} = useParams<{num:string}>();
  const [gongjiList,setGongjiList] = useState<GongjiVO|null>(null);
  
  const gongjidel = async()=>{
    const url = `${process.env.REACT_APP_BACK_END_URL}/gongji/delete?num=${num}`
    await axios.get(url);
    if (window.confirm("삭제하겠습니까?")) {
      navigate("/gongji")
    }
  }

  const navigate = useNavigate();

  useEffect(()=>{
    const detailServer = async()=>{
      const url = `${process.env.REACT_APP_BACK_END_URL}/gongji/detail?num=${num}`;
      const resp = await axios.get(url);
      setGongjiList(resp.data);
    }
    detailServer();
  },[num]);
 
  
  return (
    <div className={Style.container}>
      <h2 className={Style.title}></h2>
      <table className={Style.boardTable}>
        <tbody>
          <tr>
            <th>제목</th>
            <td>
              {gongjiList?.title}
            </td>
          </tr>
          <tr>
            <th>작성자</th>
            <td>
              {gongjiList?.writer}
            </td>
          </tr>
          <tr style={{ height: '400px' }}>
            <th>내용</th>
            <td>
              {gongjiList?.content}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              <button className={Style.button} style={{ border: 'none' }} onClick={gongjidel}>삭제</button>&nbsp;
              <Link to="/gongji" className={Style.button}>목록</Link>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default GongjiDetail