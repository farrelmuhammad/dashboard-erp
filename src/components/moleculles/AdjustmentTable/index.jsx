import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toTitleCase } from '../../../utils/helper';
import qs from "https://cdn.skypack.dev/qs@6.11.0";

const AdjustmentTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataAdjustment, setGetDataAdjustment] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const deleteAdjustment = async (id) => {
        await axios.delete(`${Url}/adjustments/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        // getAdjustment()
        Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    // useEffect(() => {
    //     getAdjustment()
    // }, [])

    // const getAdjustment = async (params = {}) => {
    //     setIsLoading(true);
    //     await axios.get(`${Url}/adjustments`, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${auth.token}`
    //         }
    //     })
    //         .then(res => {
    //             const getData = res.data.data
    //             setGetDataAdjustment(getData)
    //             setIsLoading(false);
    //             // console.log(getData)
    //         })
    // }

    const getParams = (params) => ({
        results: params.pagination?.pageSize,
        page: params.pagination?.current,
        ...params,
    });

    const fetchData = () => {
        setIsLoading(true);
        fetch(`${Url}/adjustments?${qs.stringify(getParams(tableParams))}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json())
            .then(({ data }) => {
                setGetDataAdjustment(data);
                setIsLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const columns = [
        {
            title: 'Tanggal',
            dataIndex: 'adjustment_date',
            key: 'adjustment_date',
            width: '25%',
            ...getColumnSearchProps('adjustment_date'),
            sorter: (a, b) => a.adjustment_date.length - b.adjustment_date.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'No. Penyesuaian',
            dataIndex: 'code',
            key: 'code',
            width: '25%',
            ...getColumnSearchProps('code'),
            sorter: (a, b) => a.code.length - b.code.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Gudang',
            dataIndex: 'warehouse_name',
            key: 'warehouse_name',
            width: '25%',
            ...getColumnSearchProps('warehouse_name'),
            sorter: (a, b) => a.warehouse_name.length - b.warehouse_name.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '20%',
            sorter: (a, b) => a.status.length - b.status.length,
            sortDirections: ['descend', 'ascend'],
            render: (_, { status }) => (
                <>
                    {status === 'Submitted' ? <Tag color="blue">{toTitleCase(status)}</Tag> : status === 'Draft' ? <Tag color="orange">{toTitleCase(status)}</Tag> : status === 'Done' ? <Tag color="green">{toTitleCase(status)}</Tag> : <Tag color="red">{toTitleCase(status)}</Tag>}
                </>
            ),
            ...getColumnSearchProps('status'),
        },
        {
            title: 'Actions',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <>
                    {record.status === 'Done' ? (
                        <Space size="middle">
                        <Link to={`/adjustment/detail/${record.id}`}>
                            <Button
                                size='small'
                                type="primary"
                                icon={<InfoCircleOutlined />}
                            />
                        </Link>
                    </Space>
                    ) : (
                        <Space size="middle">
                        <Link to={`/adjustment/detail/${record.id}`}>
                            <Button
                                size='small'
                                type="primary"
                                icon={<InfoCircleOutlined />}
                            />
                        </Link>
                        <Link to={`/adjustment/edit/${record.id}`}>
                            <Button
                                size='small'
                                type="success"
                                icon={<EditOutlined />}
                            />
                        </Link>
                        <Button
                            size='small'
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => deleteAdjustment(record.id)}
                        />
                    </Space>
                    )}
                </>
            ),
        },
    ];
    return <Table
        size="small"
        loading={isLoading}
        columns={columns}
        rowKey={(record) => record.id}
        sortDirections={["descend", "ascend"]}
        pagination={{ pageSize: 10 }}
        dataSource={getDataAdjustment}
        onChange={handleTableChange}
        scroll={{
            y: 300,
        }}
    />;
};

export default AdjustmentTable;
