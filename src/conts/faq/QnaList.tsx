import { Link } from "react-router-dom";
import style from '../upboard/upboard.module.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../comp/AuthProvider";

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

const QnaList: React.FC = () => {
    const { member } = useAuth();
    const [qnalist, setQnaList] = useState<Qna_VO[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //검색을 위한 useState 추가하기
    const [searchType, setSearchType] = useState('1');
    const [searchValue, setSearchValue] = useState('');

    const fetchfaqList = async (page: number) => {
        if (!member) return; // 유저 정보 없으면 중단

        setIsLoading(true);
        try {
            // 질문 응답 한번에 가져옴
            const urlqnaq = `${process.env.REACT_APP_BACK_END_URL}/qna/qlist`;
            const urlqnaa = `${process.env.REACT_APP_BACK_END_URL}/qna/alist`;
            const [qnaq, qnaa] = await Promise.all([
                axios.get(urlqnaq, {
                    params: { cPage: page, searchType, searchValue },
                    withCredentials: true
                }),
                axios.get(urlqnaa, { withCredentials: true })
            ]);

            // data 병합
            const mergedData = qnaq.data.data.map((q: QnaQ_VO) => {
                const matchAnswer = qnaa.data.data.find((a: any) => a.anum === q.qnum);
                return {
                    ...q,
                    ...matchAnswer
                } as Qna_VO;
            });
            console.log(qnaq.data.data);
            console.log(qnaa.data.data);
            console.log(mergedData);
            // 3. admin(num<=0) 은전부 아니면 자신 것만 
            const finalData = (member.num || 0.5) <= 0
                ? mergedData
                : mergedData.filter((e: Qna_VO) => e.qwriter === member.nickname);

            setQnaList(finalData);
            console.log(finalData);
            // 페이징
            setTotalItems(qnaq.data.totalItems);
            setTotalPages(qnaq.data.totalPages);
            setCurrentPage(qnaq.data.currentPage);
            setStartPage(qnaq.data.startPage);
            setEndPage(qnaq.data.endPage);
        } catch (error) {
            console.error("데이터 로드 실패", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (member) {
            fetchfaqList(currentPage);
        }
    }, [currentPage, member]);

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
            setToggle(false);
            setNumber(0);
        } else {
            setToggle(true);
            setNumber(Num);
        }
    };
    return (
        <div className={style.container}>
            <h1 style={{ marginBottom: 30 }}>1:1문의</h1>
            <table className={style.boardTable} >
                <thead>
                    <tr>
                        <th colSpan={5} style={{ fontSize: 25 }}>문의내역</th>
                    </tr>
                </thead>
                <tbody>
                    {qnalist && qnalist.length > 0 ? (
                        qnalist.map((e, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td className={style.titleLink} style={{ width: '15%' }}>{e.qwriter}</td>
                                    <td className={style.titleLink} onClick={() => { ctoggle(e.anum) }} colSpan={3}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    >
                                        <span></span>
                                        <span>{e.qtitle}</span>
                                        {e.acontent === '응답대기중' ?
                                            <button className={style.abutton}>대기중</button> : <span></span>}
                                    </td>
                                </tr>
                                {toggle && number === e.anum && (
                                    <tr>
                                        <td className={style.titleLink} style={{ width: '15%' }}>{e.awriter}</td>
                                        <td style={{ fontWeight: 'bold', height: '75px' }} colSpan={2}>
                                            {e.acontent}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} style={{ textAlign: 'center' }}>문의 내역이 없습니다.</td>
                        </tr>
                    )}
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
                        <td colSpan={5} style={{ textAlign: "center" }}>
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

                        </td>

                    </tr>

                </tfoot>
            </table>
        </div>
    )
}

export default QnaList