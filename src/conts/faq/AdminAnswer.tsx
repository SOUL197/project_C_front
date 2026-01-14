import { Link } from "react-router-dom";
import style from '../upboard/upboard.module.css'
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Qna_VO {
    qnum: number;
    qtitle: string;
    qwriter: string;
    qcontent: string;
    qdate: string;
    anum: number;
    awriter: string;
    acontent: string;
    adate: string;
}

interface QnaQ_VO {
    qnum: number;
    qtitle: string;
    qwriter: string;
    qcontent: string;
    qdate: string;
}

const AdminAnswer: React.FC = () => {
    
    const [qnalist, setQnaList] = useState<Qna_VO[]>([]);
    const [answerContent, setAnswerContent] = useState<string>(""); // 입력 필드 값 저장

        const [totalItems, setTotalItems] = useState(0);
        const [totalPages, setTotalPages] = useState(0);
        const [currentPage, setCurrentPage] = useState(1);
        const [startPage, setStartPage] = useState(1);
        const [endPage, setEndPage] = useState(1);

        //검색을 위한 useState 추가하기
        const [searchType, setSearchType] = useState('1');
        const [searchValue, setSearchValue] = useState('');
        
        //한 번에 보여줄 페이지 블록 수
        const pagePerBlcok = 5;

        const fetchfaqList = async (page: number) => {
        try {
            const urls = `${process.env.REACT_APP_BACK_END_URL}/qna/qlist`
            const response = await axios.get(urls, 
                {params: {cPage: page,
                    searchType: searchType,
                    searchValue: searchValue}});
            setQnaList(response.data.data);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);
        } catch (error) {
            console.error("실패" + error)
        }
    }
    useEffect(() => {
            fetchfaqList(currentPage);
        }, [currentPage]);
    
        const pageChange = (page: number) => {
            setCurrentPage(page);
        }
    
        const searchFunction = () => {
            fetchfaqList(1);
        }


    useEffect(() => {
        const qnalist = async () => {
            try {
                const urlqnaq = `${process.env.REACT_APP_BACK_END_URL}/qna/qlist`; //qna_q 게시판 글들을 가져오는 url
                const urlqnaa = `${process.env.REACT_APP_BACK_END_URL}/qna/alist`; //qna_a 게시판 글들을 가져오는 url
                const [qnaq, qnaa] = await Promise.all([ //qna_q 게시판과 qna_a 게시판 내용을 한번에 불러옴
                    axios.get(urlqnaq, { withCredentials: true }),
                    axios.get(urlqnaa, { withCredentials: true })
                    // axios.get(urlqnaa,{params:{anum:'anum'},withCredentials:true}),
                ]);
                console.log(qnaq.data);
                console.log(qnaa.data);

                const allqnalist = qnaq.data.data.map((e: QnaQ_VO, i: number) => ({
                    ...e, ...qnaa.data.data[i]
                } as Qna_VO));

                console.log(allqnalist);
                setQnaList(allqnalist);
            } catch (error) {
                console.error(error);
            }
        }
        qnalist();
    }, []) //한 번만 실행
      
    const [toggle, setToggle] = useState(false);
    const [number, setNumber] = useState(0);
    const ctoggle = (Num: number) => {
        if (number === Num) {
            setToggle(false);
            setNumber(0);
        } else {
            setToggle(true);
            setNumber(Num);
        }
    };

    const handleAnswerSubmit = async(anum:number)=>{
        try {
            const url = `${process.env.REACT_APP_BACK_END_URL}/qna/addanswer`;
            const response = await axios.post(url,{
                anum:anum, //어떤 질문에 대한 답변인지
                acontent:answerContent
            },{withCredentials:true});
            alert("답변이 등록되었습니다.");
            setToggle(false);
            setAnswerContent(""); //입력창 초기화
            window.location.reload(); //새로고침
        } catch (error) {
            console.error("답변 등록 실패:",error);
            alert("답변 등록 실패")
        }
    };

    return (
        <div className={style.container}>
            <h1 style={{ marginBottom: 30 }}>1:1문의</h1>
            <table className={style.boardTable} >
                <thead>
                    <tr>
                        <th colSpan={2} style={{ fontSize: 25 }}>1:1문의 내역</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (qnalist.map((e) => (
                            <React.Fragment key={e.qnum}>
                                <tr>
                                    <td className={style.titleLink} onClick={() => { ctoggle(e.qnum) }} colSpan={2}>{e.qtitle}</td>
                                    <td style={{ textAlign: 'center', width: '105px', border: 'none' }}>
                                          {(!e.acontent || e.acontent === '응답대기중') && (
                                           <button className={style.abutton} onClick={() => { ctoggle(e.qnum) }}>대기중</button>)}
                                    </td>
                                </tr>
                                {
                                    toggle && number === e.anum && (
                                        <tr>
                                            <td style={{ fontWeight: 'bold', height: '90px' }} colSpan={2}>
                                                {e.acontent !== '응답대기중' ? (
                                     // 이미 답변이 있는 경우
                                    <div style={{ color: 'lightblue' }}>{e.acontent}</div>
                                    ) : (
                                    // 답변이 없는 경우: 입력 폼 표시
                                   <div style={{ display: 'flex', gap: '10px' }}>
                                     <input 
                                    type="text" 
                                    style={{ flex: 1, height: 30, padding: '0 10px' }}
                                    placeholder="답변 내용을 입력하세요..."
                                    value={answerContent}
                                    onChange={(event) => setAnswerContent(event.target.value)}/> 
                                    <button type="submit" onClick={()=>handleAnswerSubmit(e.anum)}>확인</button></div>
                        )}
                    </td>
                </tr>
            )}
                            </React.Fragment>)
                        )
                        )
                    }
                </tbody>
                <tfoot style={{ textAlign: 'right' }}>
                   <tr>
                        <th colSpan={6} className="text-center align-middle">
                            <select onChange={(e) => { setSearchType(e.target.value) }}>
                                <option value="1">작성자</option>
                                <option value="2">제목</option>
                                <option value="3">내용</option>
                            </select>
                            <input type='text'
                                onChange={(e) => { setSearchValue(e.target.value) }}
                            />
                            <button className="btn btn-warning" onClick={searchFunction}>검색</button>
                        </th>
                        {/* 검색폼 추가 영역 */}
                    </tr>
                    <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                            <nav>
                                <ul className="pagination justify-content-center">
                                    {startPage > 1 && (
                                        <li className="page-item">
                                            <button className="page-link"
                                                onClick={() => { pageChange(startPage - 1) }}>
                                                이전</button>
                                        </li>
                                    )}
                                    {/* 페이지 출력하기 */}
                                    {
                                        Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage)
                                            .map((page) => (
                                                <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                                    <button className='page-link' onClick={() => { pageChange(page) }}>{page}</button>
                                                </li>
                                            ))
                                    }
                                    {/* 
                      NextPage 출력하기 : totalPage 보다 endPage 적을 때 다음페이지가 있는 것으로 계산
                      */}
                                    {endPage < totalPages && (
                                        <li className='page-item'>
                                            <button className='page-link' onClick={() => { pageChange(endPage + 1) }}>다음</button>
                                        </li>
                                    )}
                                </ul>

                            </nav>

                            {/* UpBoardForm.tsx */}
                           
                        </td>

                    </tr>



                </tfoot>
            </table>
        </div>
    )
}
export default AdminAnswer