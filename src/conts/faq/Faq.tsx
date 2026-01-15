import { Link, useNavigate, useParams } from "react-router-dom";
import style from '../upboard/upboard.module.css'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../comp/AuthProvider";

interface FaqVO {
    num: number;
    title: string;
    writer: string;
    content: string;
    img: string;
    fdate: string;

}
/*private int num;
    private String title;
    private String writer;
    private String content;
    private String img;
    private String fdate;
    private MultipartFile mfile; */

const FAQ: React.FC = () => {

    const { member, logout } = useAuth();

    //페이지 만들기,
    const { num } = useParams<{ num: string }>();
    const [faqList, setFaqList] = useState<FaqVO[]>([]);

    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    const navigate = useNavigate();



    //검색을 위한 useState 추가하기
    const [searchType, setSearchType] = useState('1');
    const [searchValue, setSearchValue] = useState('');

    //한 번에 보여줄 페이지 블록 수
    const pagePerBlcok = 5;


    const fetchfaqList = async (page: number) => {
        try {
            const urls = `${process.env.REACT_APP_BACK_END_URL}/faq/list`
            const response = await axios.get(urls,
                {
                    params: {
                        cPage: page,
                        searchType: searchType,
                        searchValue: searchValue
                    }
                });
            setFaqList(response.data.data);
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

    const faqdel = async (targetNum: number) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const url = `${process.env.REACT_APP_BACK_END_URL}/faq/delete?num=${targetNum}`;
                await axios.get(url);

                alert("삭제되었습니다.");
                fetchfaqList(currentPage);
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };


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
            <div className={style.fading}>
                <h3 className={style.title} >FAQ</h3></div>
            <table className={style.boardTable} >
                <thead>
                    <tr>
                        <th colSpan={2} style={{ fontSize: 20, borderTop: '1px solid rgba(82, 194, 231, 0.445)', textAlign: 'center', color: 'lightpink' }}>FAQ</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        faqList.map((item) => (
                            <React.Fragment key={item.num}>
                                <tr style={{ height: '60px' }}>
                                    <td className={style.titleLink3} onClick={() => { ctoggle(item.num) }} colSpan={2}>{item.title}</td>
                                </tr>

                                {
                                    toggle && number === item.num && (
                                        <tr>
                                            <td style={{ fontWeight: 'bold', height: '75px', color: 'lightblue' }} colSpan={2}>
                                                {item.content}
                                                {

                                                }

                                                {member && member?.num === 0 && (
                                                    <button className={style.button} style={{ border: 'none' }} onClick={() => faqdel(item.num)}>삭제</button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }

                            </React.Fragment>)
                        )

                    }
                </tbody>
                <tfoot style={{ textAlign: 'right' }}>

                    <tr>
                        <th colSpan={6} className="text-center align-middle">
                            <select onChange={(e) => { setSearchType(e.target.value) }}>

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

                            {/* 어드민 전용 */}
                            {member && member.num === 0 && (
                                <Link to="/faq/form" className={style.button}>
                                    글쓰기
                                </Link>
                            )}
                        </td>

                    </tr>


                    <tr>
                        <td colSpan={2} style={{ border: 'none', borderTop: '1px solid rgba(82, 194, 231, 0.445)' }}>
                            <Link to="/myqna" className={style.button}>1대1 문의내역
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ border: 'none', borderTop: '1px solid rgba(82, 194, 231, 0.445)' }}>
                            <Link to="/qnaform" className={style.button}>1대1 문의하기
                            </Link>
                        </td>
                    </tr>
                    <tr>
                    </tr>
                </tfoot>
            </table>
            {/* 어드민 전용*/}
            {member && member?.num === 0 && (
                <div style={{ textAlign: 'right' }}>
                    <Link to="/adminanswer" className={style.button}>admin</Link>
                </div>
            )}
        </div>
    )
}
export default FAQ;