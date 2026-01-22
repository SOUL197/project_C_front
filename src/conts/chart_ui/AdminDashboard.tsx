import React, { useEffect, useState } from 'react';
import ECharts from 'echarts-for-react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [dau, setDau] = useState(0);
  const [mau, setMau] = useState(0);
  const [funnelData, setFunnelData] = useState();
  const [maleAgeData, setMaleAgeData] = useState<number[]>([0,0,0,0]);
  const [femaleAgeData, setFemaleAgeData] = useState<number[]>([0,0,0,0]);
  const [conversionRate, setConversionRate] = useState();
  const [churnRateData, setChurnRateData] = useState<{ week: string; rate: number }[]>([]);

  const url = `${process.env.REACT_APP_BACK_END_URL}/chart`;
  const adminStats = async () => {
    const resp = await axios.get(`${url}/adminStats`);
    console.log(resp.data);
    setDau(resp.data.dau);
    setMau(resp.data.mau);
    const conFunnel = resp.data.funnel.map((item:any)=>{
      return {value: item.COUNT, name: item.STAGE}
    })
    setFunnelData(conFunnel);
    const conMale = [0,0,0,0];
    const conFemale = [0,0,0,0]
    resp.data.genderAge.forEach((item:any)=>{
      const ageIndex: Record<string,number> = {
        '20대': 0, '30대': 1, '40대': 2, '50대+': 3, 
      }
      const idx = ageIndex[item.AGE_GROUP]
      if(item.GENDER === '남자') {
        conMale[idx] += item.COUNT;
      } else {
        conFemale[idx] += item.COUNT;
      }
    })
    setMaleAgeData(conMale);
    setFemaleAgeData(conFemale);
    setConversionRate(resp.data.conversionRate);
    setChurnRateData(resp.data.churnRate);
  }
  useEffect(()=>{
    adminStats();
  },[]);

  const funnelOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'funnel',
        width: '60%',
        data: funnelData,
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
        data: maleAgeData,
      },
      {
        name: '여성',
        type: 'bar',
        stack: 'total',
        data: femaleAgeData,
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
      data: churnRateData.map(item => item.week),
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
        data: churnRateData.map(item => item.rate),
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
        data: [{ value: conversionRate, name: '전환율 (%)' }],
      },
    ],
  };

  return (
    <div style={{ padding: 24 }}>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={kpiStyle}>
          <h4>DAU</h4>
          <strong>{dau}</strong>
        </div>
        <div style={kpiStyle}>
          <h4>MAU</h4>
          <strong>{mau}</strong>
        </div>
        <div style={kpiStyle}>
          <h4>페이지 활성도</h4>
          <strong>{Math.round(dau/mau*100*100)/100}%</strong>
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
