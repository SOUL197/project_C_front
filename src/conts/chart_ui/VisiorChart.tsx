import React, { useEffect, useRef, useState } from "react";
import ECharts from "echarts-for-react";
import axios from "axios";

const VisiorChart: React.FC = () => {
  const chartRef = useRef<any>(null);
  const [isDrilldown, setIsDrilldown] = useState(false);

  useEffect(()=>{
    visitorsStats();
  },[])

  const [totalUsers,setTotalUsers] = useState(0);
  const [activeUsers,setActiveUsers] = useState(0);
  const [genderData, setGenderData] = useState<{value: number, name: string}[]>([]);
  const [addrXData, setAddrXData] = useState<string[]>([]);
  const [addrSeries, setAddrSeries] = useState();
  const [matchXData, setMatchXData] = useState();
  const [matchSeries, setMatchSeries] = useState();

  const url = `${process.env.REACT_APP_BACK_END_URL}/chart`;
  const visitorsStats = async () => {
    const resp = await axios.get(`${url}/visitorStats`);
    setTotalUsers(resp.data.userTotal);
    setActiveUsers(resp.data.activeUser);
    setGenderData(resp.data.genderCount);
    const converted = resp.data.genderCount.map((e:any)=>({
        value: e.CNT,
        name: e.GENDER,
    }))
    setGenderData(converted);
    console.log(resp);
    const conAddrX = resp.data.addrCount.map((e:any)=>e.SIDO);
    const conAddrSeries = resp.data.addrCount.map((e:any)=>({value: e.CNT, groupId: e.SIDO}))
    setAddrXData(conAddrX);
    setAddrSeries(conAddrSeries);
    const conMatchX = resp.data.dailyMatch.map((e:any)=>{
        const d = new Date(e.DAY);
        return `${d.getMonth() + 1}월 ${d.getDate()}일`;
    });
    const conMatchSeries = resp.data.dailyMatch.map((e:any)=>e.COUNT);
    setMatchXData(conMatchX);
    setMatchSeries(conMatchSeries);
  };

  const genderOption = {
    tooltip: { trigger: "item" },
    legend: { bottom: "0%" },
    series: [
      {
        name: "성별 비율",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        data: genderData,
      },
    ],
  };

  const regionOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: addrXData
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "사용자 수",
        type: "bar",
        data: addrSeries,
        barWidth: "50%",
      },
    ],
    colorBy: "s",
  };

  const matchOption = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: matchXData
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "매칭 수",
        type: "line",
        smooth: true,
        data: matchSeries,
        areaStyle: {},
      },
    ],
  };

  const onEvents = {
  click: (params: any) => {
    if(isDrilldown) return;

    const sido = params.data.groupId; // seoul

    if (!sido) return;
    axios.get(`${url}/districtCount`,{params: { sido: sido }}).then(resp => {
        console.log(resp);
      const districtNames = resp.data.map((e: any) => e.DISTRICT);
      const districtValues = resp.data.map((e: any) => e.VALUE);

      chartRef.current?.getEchartsInstance().setOption({
        xAxis: {
          data: districtNames,
        },
        series: [
          {
            data: districtValues,
          },
        ],
      });
    });
    setIsDrilldown(true);
  },
};

  return (
    <div style={{ width: "100%", height: "100%", padding: 16 }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={cardStyle}>
          <div style={cardTitle}>총 가입자 수</div>
          <div style={cardValue}>{totalUsers.toLocaleString()}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardTitle}>활성 사용자</div>
          <div style={cardValue}>{activeUsers.toLocaleString()}</div>
        </div>
      </div>

      <section style={sectionStyle}>
        <h3>성별 비율</h3>
        <ECharts option={genderOption} style={{ height: 300 }} />
      </section>

      <section style={sectionStyle}>
        <h3>지역별 사용자</h3>
        {isDrilldown && (
          <button
            onClick={() => {
              chartRef.current
                ?.getEchartsInstance()
                .setOption(regionOption, true);
              setIsDrilldown(false);
            }}
            className="back-btn"
          >
            ← 뒤로가기
          </button>
        )}
        <ECharts
          option={regionOption}
          style={{ height: 500 }}
          onEvents={onEvents}
          ref={chartRef}
        />
      </section>

      <section style={sectionStyle}>
        <h3>최근 30일 매칭 수</h3>
        <ECharts option={matchOption} style={{ height: 300 }} />
      </section>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  flex: 1,
  padding: 16,
  borderRadius: 8,
  background: "#f8f9fa",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const cardTitle: React.CSSProperties = {
  fontSize: 14,
  color: "#666",
  marginBottom: 8,
};

const cardValue: React.CSSProperties = {
  fontSize: 28,
  fontWeight: "bold",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: 24,
};

export default VisiorChart;
