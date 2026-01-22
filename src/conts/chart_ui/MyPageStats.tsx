import React, { useEffect, useState } from 'react';
import ECharts from 'echarts-for-react';
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';

const MyPageStats: React.FC = () => {
  const {member} = useAuth();
  const [likeCount, setLikeCount] = useState();
  const [matchCount, setMatchCount] = useState();
  const [dateCount, setDateCount] = useState();
  const [weekData,setWeekData] = useState<number[]>([]);
  const [heatmapData, setHeatmapData] = useState();
  const [responseRate, setResponseRate] = useState<number>(0);
  const [avgResponseRate, setAvgResponseRate] = useState<number>(0);

  const url = `${process.env.REACT_APP_BACK_END_URL}/chart`;
  const privateStats = async () => {
    const resp = await axios.get(`${url}/userStats`,{
      params: {nickname: member?.nickname, num: member?.num}
    });
    setLikeCount(resp.data.likeCount);
    setMatchCount(resp.data.matchCount);
    setDateCount(resp.data.dateCount);
    const conWeekData = [0, 0, 0, 0, 0, 0, 0];
    resp.data.weeklyMatch.forEach((item:any) => {
      const date = new Date(item.DAY);
      const jsDay = date.getDay(); // 0(일) ~ 6(토)

      // 월(0) ~ 일(6) 로 변환
      const weekIndex = jsDay === 0 ? 6 : jsDay - 1;

      conWeekData[weekIndex] = item.COUNT;
    });
    setWeekData(conWeekData);
    const conHeatData = resp.data.activityHeatmap.map((item:any) => {
      const yIndex = Number(item.WEEKDAY) - 2;   // heatmap 월=0 & weekday 월=2
      const xIndex = getTimeIndex(Number(item.HOUR));

      return [xIndex, yIndex, item.CNT];
    });
    setHeatmapData(conHeatData);
    setResponseRate(resp.data.responseRate);
    setAvgResponseRate(resp.data.avgResponseRate);
    console.log(resp.data);
  }

  useEffect(()=>{
    privateStats();
  },[])

  const getTimeIndex = (hour:number) => {
    if (hour < 3) return 0;
    if (hour < 6) return 1;
    if (hour < 9) return 2;
    if (hour < 12) return 3;
    if (hour < 15) return 4;
    if (hour < 18) return 5;
    if (hour < 21) return 6;
    return 7;
  }

  const weeklyMatchOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['월', '화', '수', '목', '금', '토', '일'],
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
    },
    series: [
      {
        type: 'line',
        data: weekData,
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
          { value: likeCount, name: '받은 좋아요' },
          { value: matchCount, name: '매칭 성사' },
          { value: dateCount, name: '데이팅(만남)' },
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
        data: heatmapData,
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
        data: [Math.round(responseRate*100)/100],
      },
      {
        name: '전체 평균',
        type: 'bar',
        data: [Math.round(avgResponseRate*100)/100],
      },
    ],
  };

  return (
    <div style={{ padding: 24 }}>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={kpiStyle}>
          <h4>받은 좋아요</h4>
          <strong>{likeCount}</strong>
        </div>
        <div style={kpiStyle}>
          <h4>매칭 수</h4>
          <strong>{matchCount}</strong>
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
