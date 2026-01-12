import React, { useRef, useState } from 'react';
import ECharts from 'echarts-for-react';

const TestChart2: React.FC = () => {
    const chartRef = useRef<any>(null);
    const [isDrilldown, setIsDrilldown] = useState(false);

    const totalUsers = 12480;
    const activeUsers = 3421;

    const genderOption = {
        tooltip: { trigger: 'item' },
        legend: { bottom: '0%' },
        series: [
            {
                name: '성별 비율',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 6,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: { show: false },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                },
                data: [
                    { value: 6200, name: '남성' },
                    { value: 5800, name: '여성' },
                    { value: 480, name: '기타' },
                ],
            },
        ],
    };

    const regionOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        xAxis: {
            type: 'category',
            data: ['서울', '부산', '대구', '인천', '기타'],
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: '사용자 수',
                type: 'bar',
                data: [{ value: 5200, groupId: 'seoul' }, { value: 2100, groupId: 'busan' }, { value: 1600, groupId: 'daegu' },
                { value: 1300, groupId: 'incheon' }, { value: 2280, groupId: 'etc' }],
                barWidth: '50%',
            },
        ],
        colorBy: 's'
    };

    const drilldownData = [
        {
            dataGroupId: "seoul",
            data: [
                ["강남구", 1200],
                ["강동구", 800],
                ["마포구", 900],
                ["송파구", 1300],
            ],
        },
        {
            dataGroupId: "busan",
            data: [
                ["해운대구", 900],
                ["수영구", 600],
                ["사하구", 600],
            ],
        },
        {
            dataGroupId: "daegu",
            data: [
                ["수성구", 700],
                ["달서구", 500],
                ["북구", 400],
            ],
        },
        {
            dataGroupId: "incheon",
            data: [
                ["남동구", 500],
                ["연수구", 400],
                ["부평구", 400],
            ],
        },
    ];

    const matchOption = {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: Array.from({ length: 30 }, (_, i) => `${i + 1}일`),
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: '매칭 수',
                type: 'line',
                smooth: true,
                data: [
                    32, 45, 38, 50, 61, 55, 70, 68, 72, 80,
                    76, 82, 90, 95, 88, 92, 100, 104, 98, 110,
                    108, 115, 120, 118, 125, 130, 128, 135, 140, 145,
                ],
                areaStyle: {},
            },
        ],
    };

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
        <div style={{ width: '100%', height: '100%', padding: 16 }}>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
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
                            chartRef.current?.getEchartsInstance().setOption(regionOption, true);
                            setIsDrilldown(false);
                        }}

                        className="back-btn"
                    >
                        ← 뒤로가기
                    </button>
                )}
                <ECharts option={regionOption} style={{ height: 500 }} onEvents={onEvents} ref={chartRef} />
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
    background: '#f8f9fa',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const cardTitle: React.CSSProperties = {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
};

const cardValue: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 'bold',
};

const sectionStyle: React.CSSProperties = {
    marginBottom: 24,
};

export default TestChart2;