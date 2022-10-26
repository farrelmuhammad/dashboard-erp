import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';

const RaceLine = ({ data }) => {
    const config = {
        data,
        xField: 'year',
        yField: 'gdp',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: (v) => `${(v / 10e8).toFixed(1)} B`,
            },
        },
        legend: {
            position: 'top',
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
            appear: {
                animation: 'path-in',
                duration: 6000,
            },
        },
    };

    return (
        <>
            <div className="container p-3 me-2 mb-2 bg-body rounded d-flex flex-column">
                <div className="row">
                    <div className="col text-title text-start">
                        <h3 className="title fw-bold">Line Race</h3>
                    </div>
                </div>
                <Line {...config} />
            </div>
        </>
    );
};

export default RaceLine;