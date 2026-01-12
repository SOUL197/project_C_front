import React, { useRef, useState } from "react";
import ECharts from 'echarts-for-react'
import './styles.css'

const TestChart: React.FC = () => {
  const chartRef = useRef<any>(null);
  const [isDrilldown, setIsDrilldown] = useState(false);

  const options = {
    grid: {
      top: 20,
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['서울', '부산', '테스트시'],
    },
    yAxis: {
      type: 'value',
    },
    animationDurationUpdate: 500,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    series: [
      {
        type: 'bar',
        id: 'population',
        data: [
          { value: 560, groupId: 'seoul' },
          { value: 293, groupId: 'busan' },
          { value: 461, groupId: 'test' },
        ],
        universalTransition: {
          enabled: true,
          divideShape: 'clone',
        },
      },
    ],
  };

  const drilldownData = [
    {
      dataGroupId: "seoul",
      data: [
        ["강동", 4],
        ["강서", 2],
        ["강남", 1],
        ["강북", 2],
      ],
    },
    {
      dataGroupId: "busan",
      data: [
        ["강서", 4],
        ["기장", 2],
      ],
    },
    {
      dataGroupId: "test",
      data: [
        ["Test1", 4],
        ["Test2", 2],
        ["Test3", 2],
      ],
    },
  ];

  const onEvents = {
    click: (params: any) => {
      if (isDrilldown) return;

      const target = drilldownData.find(
        d => d.dataGroupId === params.data.groupId
      );
      if (!target) return;

      chartRef.current?.getEchartsInstance().setOption({
        xAxis: {
          data: target.data.map(d => d[0]),
        },
        series: [
          {
            id: 'population',
            data: target.data.map(d => d[1]),
          },
        ],
      });

      setIsDrilldown(true);

    },
  };

  return (
    <div className="chart-container">
      {isDrilldown && (
        <button
          onClick={() => {
            chartRef.current?.getEchartsInstance().setOption(options, true);
            setIsDrilldown(false);
          }}

          className="back-btn"
        >
          ← 뒤로가기
        </button>
      )}
      <ECharts option={options} style={{ height: '95%' }} onEvents={onEvents} ref={chartRef} />
    </div>
  );
};

export default TestChart;
