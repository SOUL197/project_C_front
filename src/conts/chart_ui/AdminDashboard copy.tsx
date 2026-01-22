import React from 'react';
import ECharts from 'echarts-for-react';

const AdminDashboard: React.FC = () => {
  const funnelOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'funnel',
        width: '60%',
        data: [
          { value: 5000, name: '가입자 수' },
          { value: 3200, name: '좋아요 받은 사용자 수' },
          { value: 1800, name: '매칭 경험 사용자 수' },
          { value: 620, name: '데이트 경험 사용자 수' },
        ],
        left: '20%',
        sort: 'none'
      },
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

  const churnRateOption = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = params[0];
        return `
          <strong>${p.axisValue}</strong><br/>
          이탈률: ${p.value}%
        `;
      },
    },
    xAxis: {
      type: 'category',
      data: ['5주 전', '4주 전', '3주 전', '2주 전', '1주 전'],
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: '이탈률',
        type: 'line',
        smooth: true,
        data: [30, 25, 36, 48, 17],
        areaStyle: {
          opacity: 0.15,
        },
        markLine: {
          data: [
            {
              yAxis: 40,
              name: '관리 기준선',
              label: {
                formatter: '주의 기준 (40%)',
              },
            },
          ],
          lineStyle: {
            type: 'dashed',
            color: '#ff4d4f',
          },
        },
      },
    ],
  };

  const conversionOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'gauge',
        progress: { show: true },
        axisLine: { lineStyle: { width: 5 } },
        data: [{ value: 35, name: '전환율 (%)' }],
      },
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
          <h4>페이지 활성도</h4>
          <strong>13.8%</strong>
        </div>
      </div>

      <hr />

      <h4>가입 → 데이트 성사</h4>
      <ECharts option={funnelOption} style={{ height: 300 }} />

      <hr />

      <h4>성별 / 연령 분포</h4>
      <ECharts option={genderAgeOption} style={{ height: 300 }} />

      <hr />

      <h4>주간 사용자 이탈률 추이</h4>
      <ECharts option={churnRateOption} style={{ height: 260 }} />

      <hr />
      
      <h4>비회원 → 회원 전환율 (최근 30일)</h4>
      <ECharts option={conversionOption} style={{ height: 300 }} />
    </div>
  );
};

const kpiStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    textAlign: 'center',
    background: '#fafafa',
};

export default AdminDashboard;
