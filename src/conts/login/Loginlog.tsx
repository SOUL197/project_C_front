import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../comp/AuthProvider";

interface LoginLog {
  ROW_NUM: number;
  IDN: number;
  REIP: string;
  UAGENT: string;
  STATUS: string;
  SSTIME: string;
}

const LoginLog: React.FC = () => {
  const { member } = useAuth();
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  useEffect(() => {
    fetchLoginLogs(currentPage);
  }, [currentPage]);

  const pageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchLoginLogs = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/api/login/loginlog`, { params: { cPage: page }, withCredentials: true });
      setLogs(response.data.data);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setStartPage(response.data.startPage);
      setEndPage(response.data.endPage);
    } catch (err) {
      console.error(err);
      setError("로그인 로그를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "lightskyblue", textAlign: "center", marginBottom: "25px" }}>로그인 기록</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>번호</th>
            <th>ID</th>
            <th>IP 주소</th>
            <th>브라우저 / OS</th>
            <th>상태</th>
            <th>접속 시각</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            logs.map((log, i) => (
              <tr key={log.ROW_NUM}>
                <td>{i + 1}</td>
                <td>{member?.id}</td>
                <td>{log.REIP}</td>
                <td>{log.UAGENT}</td>
                <td
                  style={{
                    color: log.STATUS === "login" ? "green" : "gray",
                    fontWeight: "bold",
                  }}
                >
                  {log.STATUS}
                </td>
                <td>{new Date(log.SSTIME).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <div>
                <nav>
                  <ul className='pagination justify-content-center'>
                    {currentPage > 1 && (
                      <li className='page-item'>
                        <button className='page-link' onClick={() => {
                          pageChange(currentPage - 1)
                        }}>이전</button>
                      </li>


                    )}
                    {
                      Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage)
                        .map((page) => (
                          <li key={page} className={`page-item ${page ===
                            currentPage ? 'active' : ''}`}>
                            <button className='page-link' onClick={() => {
                              pageChange(page)
                            }}>{page}</button>
                          </li>

                        ))
                    }
                    {currentPage < totalPages && (
                      <li className='page-item'>
                        <button className='page-link' onClick={() => {
                          pageChange(currentPage + 1)
                        }}>다음 </button>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default LoginLog;