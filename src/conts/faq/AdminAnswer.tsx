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
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        setIsLoading(true);
        try {
            const urlqnaq = `${process.env.REACT_APP_BACK_END_URL}/qna/qlist`;
            const urlqnaa = `${process.env.REACT_APP_BACK_END_URL}/qna/alist`;

            // 검색/페이지 클릭 시에도 질문과 답변을 동시에 가져옴
            const [qnaq, qnaa] = await Promise.all([
                axios.get(urlqnaq, {
                    params: {
                        cPage: page,
                        searchType: searchType,
                        searchValue: searchValue
                    }
                }),
                axios.get(urlqnaa, { withCredentials: true })
            ]);

            // 초기 useEffect와 동일하게 질문과 답변을 합쳐줌
            const allqnalist = qnaq.data.data.map((e: QnaQ_VO, i: number) => ({
                ...e,
                ...qnaa.data.data[i]
            } as Qna_VO));

            setQnaList(allqnalist); // 이제 검색/페이징 후에도 답변이 포함된 리스트가 유지됨

            setTotalItems(qnaq.data.totalItems);
            setTotalPages(qnaq.data.totalPages);
            setCurrentPage(qnaq.data.currentPage);
            setStartPage(qnaq.data.startPage);
            setEndPage(qnaq.data.endPage);
        } catch (error) {
            console.error("검색 실패" + error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchfaqList(1);
    }, []); //한 번만 실행

    useEffect(() => {
        fetchfaqList(currentPage);
    }, [currentPage]);

    const pageChange = (page: number) => {
        setCurrentPage(page);
    }

    const searchFunction = () => {
        fetchfaqList(1);
    }

    const [toggle, setToggle] = useState(false);
    const [number, setNumber] = useState(0);
    const ctoggle = (Num: number) => {
        if (number === Num) {
            setToggle(!toggle);
            console.log(Num);
            console.log('number가 같음' + toggle);
        } else {
            setNumber(Num);
            setToggle(true);
            console.log('열림' + number)
        }
    };

    const handleAnswerSubmit = async (anum: number) => {
        try {
            const url = `${process.env.REACT_APP_BACK_END_URL}/qna/addanswer`;
            const response = await axios.post(url, {
                anum: anum, //어떤 질문에 대한 답변인지

                acontent: answerContent
            }, { withCredentials: true });
            alert("답변이 등록되었습니다.");
            setToggle(false);
            setAnswerContent(""); //입력창 초기화
            window.location.reload(); //새로고침
        } catch (error) {
            console.error("답변 등록 실패:", error);
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
                    {isLoading ? (
                        <tr>
                            <td colSpan={2} style={{ textAlign: 'center', padding: '100px 0', color: '#ff6f91', fontWeight: 'bold' }}>
                                데이터를 불러오는 중입니다...
                            </td>
                        </tr>
                    ) : (qnalist.map((e, i) => (
                        <React.Fragment key={e.anum || i}>
                            <tr>
                                <td style={{ width: '85px' }}>
                                    {e.qwriter}
                                </td>
                                <td className={style.titleLink}
                                    style={{ display: 'flex', textAlign: 'center', justifyContent: 'space-between', margin: '0 auto' }}
                                    onClick={() => { ctoggle(e.anum) }}
                                    colSpan={1}
                                >
                                    <span ></span>
                                    {e.qtitle}
                                    {(!e.acontent || e.acontent === '응답대기중' ?
                                        <button
                                            className={style.abutton}
                                            onClick={() => { ctoggle(e.anum) }}
                                        >
                                            대기중
                                        </button> : <span style={{ marginLeft: '85px' }}></span>)}
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
                                                        style={{ flex: 1, height: '40px', borderRadius: '8px', border: '1px solid #000' }}
                                                        placeholder="답변 내용을 입력하세요..."
                                                        value={answerContent}
                                                        onChange={(event) => setAnswerContent(event.target.value)} />
                                                    <button type="submit" className="btn btn-primary btn-sm w-auto py-1" onClick={() => handleAnswerSubmit(e.anum)}>확인</button></div>
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
                                    {/* NextPage 출력하기 : totalPage 보다 endPage 적을 때 다음페이지가 있는 것으로 계산*/}
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