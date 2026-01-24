import React from 'react';
import ECharts from 'echarts-for-react';

const MyPageStats: React.FC = () => {
  const weeklyMatchOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['월', '화', '수', '목', '금', '토', '일'],
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        type: 'line',
        data: [1, 0, 2, 1, 3, 2, 4],
        smooth: true,
      },
    ],
  };

  const funnelOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'funnel',
        width: '60%',
        data: [
          { value: 120, name: '받은 좋아요' },
          { value: 70, name: '매칭 성사' },
          { value: 35, name: '데이팅(만남)' },
        ],
        left: '20%'
      },
    ],
  };

  const heatmapOption = {
    tooltip: { position: 'top' },
    grid: { height: '70%' },
    xAxis: {
      type: 'category',
      data: ['0-3', '3-6', '6-9', '9-12', '12-15', '15-18', '18-21', '21-24'],
    },
    yAxis: {
      type: 'category',
      data: ['월', '화', '수', '목', '금', '토', '일'],
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      bottom: 0,
    },
    series: [
      {
        type: 'heatmap',
        data: [
          [0, 0, 2], [1, 0, 1], [2, 0, 0],
          [3, 1, 5], [4, 1, 3],
          [5, 2, 6], [6, 2, 4],
          [7, 6, 8],
        ],
      },
    ],
  };

  const responseRateOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['응답률'],
    },
    yAxis: {
      type: 'value',
      max: 100,
    },
    series: [
      {
        name: '나',
        type: 'bar',
        data: [82],
      },
      {
        name: '전체 평균',
        type: 'bar',
        data: [64],
      },
    ],
    barMaxWidth:'25%'
  };

  return (
    <div style={{ padding: 24, width: '50%' }}>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={kpiStyle}>
          <h4>받은 좋아요</h4>
          <strong>120</strong>
        </div>
        <div style={kpiStyle}>
          <h4>매칭 수</h4>
          <strong>35</strong>
        </div>
      </div>

      <hr />

      <h4>주간 매칭 추이</h4>
      <ECharts option={weeklyMatchOption} style={{ height: 260 }} />

      <hr />

      <h4>좋아요 → 매칭</h4>
      <ECharts option={funnelOption} style={{ height: 260 }} />

      <hr />

      <h4>활동 시간대</h4>
      <ECharts option={heatmapOption} style={{ height: 320 }} />

      <hr />

      <h4>내 응답률 vs 평균</h4>
      <ECharts option={responseRateOption} style={{ height: 400 }} />
    </div>
  );
};

const kpiStyle: React.CSSProperties = {
    flex: 1,
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: 8,
    textAlign: 'center',
};

export default MyPageStats;
