import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toTitleCase } from '../../../utils/helper';
import qs from "https://cdn.skypack.dev/qs@6.11.0";

const ProductionTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataProduction, setGetDataProduction] = useState([]);
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

    const deleteProduction = async (id) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Data ini akan dihapus",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${Url}/productions/${id}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                getProduction()
                Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");

            }
        })


    };

    const cancelProduction = async (id, code) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Status data akan diubah ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    axios({
                        method: "patch",
                        url: `${Url}/productions/cancel/${id}`,
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${auth.token}`,
                        },
                    })

                    getProduction();
                    Swal.fire("Berhasil Dibatalkan!", `${code} Dibatalkan`, "success");
                }
                catch (err) {
                    console.log(err);
                }
            }
        })

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
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: '#ffc069',
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={text ? text.toString() : ''}
        //     />
        //   ) : (
        //     text
        //   ),
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };
    const getParams = (params) => ({
        results: params.pagination?.pageSize,
        page: params.pagination?.current,
        ...params,
    });

    const getProduction = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/productions?${qs.stringify(getParams(tableParams))}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setGetDataProduction(getData)
                setStatus(getData.map(d => d.status))
                setIsLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                    },
                });
            })
    }

    useEffect(() => {
        getProduction();
    }, [JSON.stringify(tableParams)]);

    const columns = [
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            ...getColumnSearchProps('date'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'No. Produksi',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Gudang Input',
            dataIndex: 'warehouse_input_name',
            key: 'warehouse_input_name',
            width: '20%',
            ...getColumnSearchProps('warehouse_input_name'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Gudang Output',
            dataIndex: 'warehouse_output_name',
            key: 'warehouse_output_name',
            width: '20%',
            ...getColumnSearchProps('warehouse_output_name'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '20%',
            render: (_, { status }) => (
                <>
                    {status === 'Submitted' ? <Tag color="blue">{toTitleCase(status)}</Tag> : status === 'Draft' ? <Tag color="orange">{toTitleCase(status)}</Tag> : status === 'Done' ? <Tag color="green">{toTitleCase(status)}</Tag> : <Tag color="red">{toTitleCase(status)}</Tag>}

                </>
            ),
            ...getColumnSearchProps('status'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Actions',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        {record.can['read-production'] ? (
                            <Link to={`/produksi/detail/${record.id}`}>
                                <Button
                                    size='small'
                                    type="primary"
                                    icon={<InfoCircleOutlined />}
                                />
                            </Link>
                        ) : null}
                        {
                            record.can['cancel-production'] ? (

                                <Button
                                    size='small'
                                    type="danger"
                                    icon={<CloseOutlined />}
                                    onClick={() => cancelProduction(record.id, record.code)}
                                />

                            ) : null
                        }
                        {
                            record.can['delete-production'] ? (
                                <Space size="middle">
                                    <Button
                                        size='small'
                                        type="danger"
                                        icon={<DeleteOutlined />}
                                        onClick={() => deleteProduction(record.id, record.code)}
                                    />
                                </Space>
                            ) : null
                        }
                        {
                            record.can['update-production'] ? (
                                <Link to={`/produksi/edit/${record.id}`}>
                                    <Button
                                        size='small'
                                        type="success"
                                        icon={<EditOutlined />}
                                    />
                                </Link>
                            ) : null
                        }
                    </Space>
                </>

                // <>
                //     {record.status === 'Done' || record.status === 'Submitted' || record.status === 'Processed'? (
                //         <Space size="middle">
                //         <Link to={`/produksi/detail/${record.id}`}>
                //             <Button
                //                 size='small'
                //                 type="primary"
                //                 icon={<InfoCircleOutlined />}
                //             />
                //         </Link>
                //     </Space>
                //     ) : (
                //         <Space size="middle">
                //         <Link to={`/produksi/detail/${record.id}`}>
                //             <Button
                //                 size='small'
                //                 type="primary"
                //                 icon={<InfoCircleOutlined />}
                //             />
                //         </Link>
                //         <Link to={`/produksi/edit/${record.id}`}>
                //             <Button
                //                 size='small'
                //                 type="success"
                //                 icon={<EditOutlined />}
                //             />
                //         </Link>
                //         <Button
                //             size='small'
                //             type="danger"
                //             icon={<DeleteOutlined />}
                //             onClick={() => deleteProduction(record.id)}
                //         />
                //     </Space>
                //     )}
                // </>
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
        dataSource={getDataProduction}
        onChange={handleTableChange}
        scroll={{
            y: 240,
        }}
    />;
};

export default ProductionTable;
