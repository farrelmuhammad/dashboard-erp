import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';

const Dashboard = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
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

export default Dashboard;