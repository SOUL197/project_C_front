import React from "react";
import ECharts from 'echarts-for-react'

const TestChart: React.FC = () => {
  interface DataItem {
    value: number;
    groupId: string;
  }
  const options = {
    xAxis: {
      data: ["서울", "부산", "테스트시"],
    },
    yAxis: {},
    dataGroupId: "",
    animationDurationUpdate: 500,
    series: {
      type: "bar",
      id: "population",
      data: [
        {
          value: 5,
          groupId: "seoul",
        },
        {
          value: 2,
          groupId: "busan",
        },
        {
          value: 4,
          groupId: "test",
        },
      ] as DataItem[],
      universalTransition: {
        enabled: true,
        divideShape: "clone",
      },
    },
    tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  }
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

  return (
    <div>
      <ECharts option={options} opts={{renderer:'svg', width:'auto', height:800}} />
    </div>
  );
};

export default TestChart;
