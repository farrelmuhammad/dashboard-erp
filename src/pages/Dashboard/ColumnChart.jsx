import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Column } from '@ant-design/plots';

const ColumnChart = ({ data }) => {
    const config = {
        data,
        isStack: true,
        xField: 'year',
        yField: 'value',
        seriesField: 'type',
        label: {
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'bottom', 'middle'
            // 可配置附加的布局方法
            layout: [
                // 柱形图数据标签位置自动调整
                {
                    type: 'interval-adjust-position',
                }, // 数据标签防遮挡
                {
                    type: 'interval-hide-overlap',
                }, // 数据标签文颜色自动调整
                {
                    type: 'adjust-color',
                },
            ],
        },
    };

    return (
        <>
            <div className="container p-3 me-2 mb-2 bg-body rounded d-flex flex-column">
                <div className="row">
                    <div className="col text-title text-start">
                        <h3 className="title fw-bold">Column Chart</h3>
                    </div>
                </div>
                <Column {...config} />
            </div>
        </>
    );
};

export default ColumnChart;