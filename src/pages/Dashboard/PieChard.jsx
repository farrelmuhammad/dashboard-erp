import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import { Card } from 'antd';

const PieChart = () => {
    const data = [
        {
            type: '分类一',
            value: 27,
        },
        {
            type: '分类二',
            value: 25,
        },
        {
            type: '分类三',
            value: 18,
        },
        {
            type: '分类四',
            value: 15,
        },
        {
            type: '分类五',
            value: 10,
        },
        {
            type: '其他',
            value: 5,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
        ],
    };
    return (
        <>
            {/* <Card
                bordered={true}
                style={{
                    width: 300,
                    marginLeft: '10px',
                }}
            >
                <Pie {...config} />
            </Card> */}
            <div className="container p-3 ms-1 mb-2 bg-body rounded d-flex flex-column">
                <div className="row">
                    <div className="col text-title text-start">
                        <h3 className="title fw-bold">Pie Chart</h3>
                    </div>
                </div>
                <Pie {...config} />
            </div>
        </>
    )
};

export default PieChart;