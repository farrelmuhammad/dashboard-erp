import { HomeOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import RaceLine from './RaceLine'
import DashboardTable from '../../components/moleculles/DashboardTable'
import PieChart from './PieChard'
import ColumnChart from './ColumnChart'
import axios from 'axios'
import Url from '../../Config'
import { useSelector } from 'react-redux'

const Dashboard = () => {
    

    return (
        <>
            <Row>
                <Col span={8}>
                    <Card
                        style={{
                            margin: 5,
                            borderRadius: "20px",
                        }}
                        bordered
                        rounded
                    >
                        <Row>
                            <Col span={12} className="p-3">
                                <HomeOutlined
                                    style={{
                                        marginLeft: -20,
                                        fontSize: '40px',
                                    }}
                                />
                            </Col>
                            <Col span={12} className='text-end'>
                                <h1 className='text-dark'>20</h1>
                                <h6 className='text-dark'>Induk</h6>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        style={{
                            margin: 5,
                            borderRadius: "20px",
                        }}
                        bordered
                        rounded
                    >
                        <Row>
                            <Col span={12} className="p-3">
                                <HomeOutlined
                                    style={{
                                        marginLeft: -20,
                                        fontSize: '40px',
                                    }}
                                />
                            </Col>
                            <Col span={12} className='text-end'>
                                <h1 className='text-dark'>20</h1>
                                <h6 className='text-dark'>Induk</h6>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        style={{
                            margin: 5,
                            borderRadius: "20px",
                        }}
                        bordered
                        rounded
                    >
                        <Row>
                            <Col span={12} className="p-3">
                                <HomeOutlined
                                    style={{
                                        marginLeft: -20,
                                        fontSize: '40px',
                                    }}
                                />
                            </Col>
                            <Col span={12} className='text-end'>
                                <h1 className='text-dark'>20</h1>
                                <h6 className='text-dark'>Induk</h6>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <RaceLine />
            <ColumnChart />
            <Row>
                <Col span={12}>
                    <div className="container p-3 me-2 mb-2 bg-body rounded d-flex flex-column">
                        <div className="row">
                            <div className="col text-title text-start">
                                <h3 className="title fw-bold">Data Table</h3>
                            </div>
                        </div>
                        <DashboardTable />
                    </div>

                </Col>
                <Col span={12}>
                    <PieChart />
                </Col>
            </Row>
            {/* <Row justify="space-around">
                <Col span={4}>col-4</Col>
                <Col span={4}>col-4</Col>
                <Col span={4}>col-4</Col>
                <Col span={4}>col-4</Col>
            </Row> */}

        </>
    )
}

export default Dashboard