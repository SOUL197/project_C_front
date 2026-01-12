import React from 'react';
import ECharts from 'echarts-for-react';

const AdminDashboard: React.FC = () => {

  const kpiStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    textAlign: 'center',
    background: '#fafafa',
  };

  const funnelOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'funnel',
        width: '60%',
        data: [
          { value: 5000, name: '가입' },
          { value: 3200, name: '좋아요' },
          { value: 1800, name: '첫 매칭' },
          { value: 620, name: '데이트' },
        ],
        left: '20%'
      },
    ],
  };

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
      // {
      //   name: '신고 건수',
      //   type: 'line',
      //   data: [12, 18, 15, 26, 40],
      //   markLine: {
      //     data: [
      //       {
      //         yAxis: 30,
      //         name: '경고 기준',
      //       },
      //     ],
      //   },
      // },
      {
        name: '방문자',
        type: 'line',
        markLine: {
          data: [
            {
              yAxis: 5000,
              name: '평균 회원 방문율'
            }
          ]
        },
        data: [5000, 3900, 6700, 5300, 4800]
      },
      {
        name: '회원 방문',
        type: 'line',
        markLine: {
          data: [
            {
              yAxis: '27%'
            }
          ]
        },
        data: []
      }
    ],
  };

  return (
    <div style={{ padding: 24 }}>

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
          <h4>사용자 참여도</h4>
          <strong>13.8%</strong>
        </div>
      </div>

      <hr />

      <h4>가입 → 데이트 성사 퍼널</h4>
      <ECharts option={funnelOption} style={{ height: 300 }} />

      <hr />

      <h4>코호트 유지율</h4>
      <ECharts option={cohortOption} style={{ height: 300 }} />

      <hr />

      <h4>성별 / 연령 분포</h4>
      <ECharts option={genderAgeOption} style={{ height: 300 }} />

      <hr />

      <h4>회원 전환율 추이</h4>
      <ECharts option={reportTrendOption} style={{ height: 260 }} />
    </div>
  );
};

export default AdminDashboard;
