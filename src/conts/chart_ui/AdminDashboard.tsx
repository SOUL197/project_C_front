import React from 'react';
import ECharts from 'echarts-for-react';

const AdminDashboard: React.FC = () => {
  /* ===================== KPI ===================== */
  const kpiStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    textAlign: 'center',
    background: '#fafafa',
  };

  /* ===================== 1. 가입 → 유료 퍼널 ===================== */
  const funnelOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'funnel',
        width: '60%',
        data: [
          { value: 5000, name: '가입' },
          { value: 3200, name: '프로필 완성' },
          { value: 1800, name: '첫 매칭' },
          { value: 620, name: '유료 전환' },
        ],
      },
    ],
  };

  /* ===================== 2. 코호트 유지율 ===================== */
  const cohortOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['1주차', '2주차', '3주차', '4주차'],
    },
    xAxis: {
      type: 'category',
      data: ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
    },
    yAxis: {
      type: 'value',
      max: 100,
    },
    series: [
      { name: '1주차', type: 'line', data: [100, 62, 48, 40, 35] },
      { name: '2주차', type: 'line', data: [100, 58, 45, 38, 32] },
      { name: '3주차', type: 'line', data: [100, 55, 42, 34, 30] },
      { name: '4주차', type: 'line', data: [100, 52, 40, 33, 28] },
    ],
  };

  /* ===================== 3. 성별 / 연령 스택 바 ===================== */
  const genderAgeOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['남성', '여성'],
    },
    xAxis: {
      type: 'category',
      data: ['20대', '30대', '40대', '50대+'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '남성',
        type: 'bar',
        stack: 'total',
        data: [1200, 900, 400, 150],
      },
      {
        name: '여성',
        type: 'bar',
        stack: 'total',
        data: [1400, 1100, 500, 200],
      },
    ],
  };

  /* ===================== 4. 신고 발생 추이 + 경고 ===================== */
  const reportTrendOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1주', '2주', '3주', '4주', '5주'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '신고 건수',
        type: 'line',
        data: [12, 18, 15, 26, 40],
        markLine: {
          data: [
            {
              yAxis: 30,
              name: '경고 기준',
            },
          ],
        },
      },
    ],
  };

  return (
    <div style={{ padding: 24 }}>
      {/* ===================== KPI ===================== */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={kpiStyle}>
          <h4>DAU</h4>
          <strong>3,420</strong>
        </div>
        <div style={kpiStyle}>
          <h4>MAU</h4>
          <strong>24,800</strong>
        </div>
        <div style={kpiStyle}>
          <h4>유료 전환율</h4>
          <strong>12.4%</strong>
        </div>
      </div>

      <hr />

      {/* ===================== 퍼널 ===================== */}
      <h4>가입 → 유료 퍼널</h4>
      <ECharts option={funnelOption} style={{ height: 300 }} />

      <hr />

      {/* ===================== 코호트 ===================== */}
      <h4>코호트 유지율</h4>
      <ECharts option={cohortOption} style={{ height: 300 }} />

      <hr />

      {/* ===================== 성별/연령 ===================== */}
      <h4>성별 / 연령 분포</h4>
      <ECharts option={genderAgeOption} style={{ height: 300 }} />

      <hr />

      {/* ===================== 신고 추이 ===================== */}
      <h4>신고 발생 추이</h4>
      <ECharts option={reportTrendOption} style={{ height: 260 }} />
    </div>
  );
};

export default AdminDashboard;
