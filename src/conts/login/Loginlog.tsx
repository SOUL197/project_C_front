import React, { useEffect, useState } from "react";
import axios from "axios";

interface LoginLog {
  lognum: number;
  idn: number;
  reip: string;
  uagent: string;
  status: string;
  sstime: string;
}

const LoginLog: React.FC = () => {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoginLogs();
  }, []);

  const fetchLoginLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get<LoginLog[]>(`${process.env.REACT_APP_BACK_END_URL}/api/login/loginlog`, { withCredentials: true });
      setLogs(response.data);
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
            logs.map((log) => (
              <tr key={log.lognum}>
                <td>{log.lognum}</td>
                <td>{log.idn}</td>
                <td>{log.reip}</td>
                <td>{log.uagent}</td>
                <td
                  style={{
                    color: log.status === "로그인" ? "green" : "gray",
                    fontWeight: "bold",
                  }}
                >
                  {log.status}
                </td>
                <td>{new Date(log.sstime).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoginLog;