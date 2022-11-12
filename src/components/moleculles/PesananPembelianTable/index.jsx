import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CloseOutlined, DeleteOutlined, EditOutlined, CheckCircleOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import CurrencyFormat from 'react-currency-format';

const PesananPembelianTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pesananPembelian, setPesananPembelian] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [namaMataUang, setNamaMataUang] = useState([]);
    const [dataTampil, setDataTampil] = useState([]);
    const [getData1, setGetData1] = useState([])

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const getParams = (params) => ({
        results: params.pagination?.pageSize,
        page: params.pagination?.current,
        ...params,
    });

    const fetchData = () => {
        setIsLoading(true);
        fetch(`${Url}/purchase_orders?${qs.stringify(getParams(tableParams))}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json())
            .then(({ data }) => {

                const getData = data
                console.log(getData)

                setStatus(getData.map(d => d.status))
                let mataUang = [];
                let varnull = null;
                for (let i = 0; i < getData.length; i++) {
                    if (getData[i].supplier._group === "Lokal" || !getData[i].currency) {
                        mataUang.push("Rp ")
                    }
                    else if (getData[i].currency) {
                        mataUang.push(getData[i].currency.name);
                    }
                }
                setNamaMataUang(mataUang);
                setIsLoading(false);
                setGetData1(getData)

                setPesananPembelian(getData)

                let tmp = []
                for (let i = 0; i < getData.length; i++) {
                    // let uang = getData[i].currency.name;
                    tmp.push({
                        id: getData[i].id,
                        can: getData[i].can,
                        code: getData[i].code,
                        date: getData[i].date,
                        total: getData[i].supplier._group === "Lokal" || !getData[i].currency ?
                            < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].total).toFixed(2).replace('.', ',')} key="diskon" />
                            : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={getData[i].currency.name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].total).toLocaleString('id')} key="diskon" />,

                        status: getData[i].status,
                        name: getData[i].name,
                        supplier_name: getData[i].supplier_name ? getData[i].supplier_name : '',
                        reference: getData[i].reference ? getData[i].reference : <div className='text-center'>-</div>,
                    })
                }
                setDataTampil(tmp)
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



    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);

    const forceDonePurchaseOrder = async (id, code) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Status akan diubah menjadi done",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya'
        }).then((result) => {
            if (result.isConfirmed) {
                axios({
                    method: "patch",
                    url: `${Url}/purchase_orders/force_done/${id}`,
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                })

                fetchData()
                Swal.fire("Berhasil Diubah!", `${code} Done`, "success");

            }
        })
    }

    const deletePurchaseOrders = async (id, code) => {
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
                axios.delete(`${Url}/purchase_orders/${id}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                fetchData()
                Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");

            }
        })


    };

    const cancelPurchaseOrders = async (id, code) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Status data akan diubah",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const datakirim = new FormData();
                    datakirim.append("", '');

                    axios({
                        method: "patch",
                        url: `${Url}/purchase_orders/cancel/${id}`,
                        data: datakirim,
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${auth.token}`,
                        },
                    })

                    fetchData();
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
        onFilter: (value, record) => {
            if (record[dataIndex]) {

                return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            }
        }
        ,
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

    // useEffect(() => {
    //     getPesananPembelian()
    // }, [])

    // const getPesananPembelian = async (params = {}) => {
    //     setIsLoading(true);
    //     await axios.get(`${Url}/purchase_orders`, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${auth.token}`
    //         }
    //     })
    //         .then(res => {
    //             const getData = res.data.data

    //             setStatus(getData.map(d => d.status))
    //             let mataUang = [];
    //             let varnull = null;
    //             for (let i = 0; i < getData.length; i++) {
    //                 if (getData[i].supplier._group === "Lokal" || !getData[i].currency) {
    //                     mataUang.push("Rp ")
    //                 }
    //                 else if (getData[i].currency) {
    //                     mataUang.push(getData[i].currency.name);
    //                 }
    //                 // else{
    //                 //     console.log(getData[i].currency)

    //                 // }
    //             }
    //             setNamaMataUang(mataUang);
    //             console.log(mataUang)
    //             console.log(namaMataUang)
    //             setIsLoading(false);
    //             setGetData1(getData)

    //             setPesananPembelian(getData)

    //             let tmp = []
    //             for (let i = 0; i < getData.length; i++) {
    //                 // let uang = getData[i].currency.name;
    //                 tmp.push({
    //                     id: getData[i].id,
    //                     can: getData[i].can,
    //                     code: getData[i].code,
    //                     date: getData[i].date,
    //                     total: getData[i].supplier._group === "Lokal" || !getData[i].currency ?
    //                         < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].total).toFixed(2).replace('.', ',')} key="diskon" />
    //                         : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={getData[i].currency.name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].total).toLocaleString('id')} key="diskon" />,

    //                     status: getData[i].status,
    //                     name: getData[i].name,
    //                     supplier_name: getData[i].supplier_name ? getData[i].supplier_name : '',
    //                 })
    //             }
    //             setDataTampil(tmp)
    //         })
    // }

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const columns = [
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            sorter: (a, b) => a.date.length - b.date.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('date'),
        },
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
            width: '20%',
            ...getColumnSearchProps('supplier_name'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: '20%',
            sorter: (a, b) => a.total - b.total,
            ...getColumnSearchProps('total'),
            sortDirections: ['descend', 'ascend'],
            // render(text, record, index) {
            //     return {
            //       props: {
            //         style: { background:  "#f5f5f5" }
            //       },
            //       children: <div>{ Number(text).toLocaleString('id')}</div> 
            //     };
            // },
            //...getColumnSearchProps('currency_name'),
            //...getColumnSearchProps('total'),
            // render: (text) => {
            //     for (let i = 0; i < getData1.length; i++) {
            //         < CurrencyFormat  className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang[i] + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(text).toFixed(2).replace('.' , ',')} key="diskon" />
            //     }
            // }

        },
        {
            title: 'Reference',
            dataIndex: 'reference',
            key: 'reference',
            width: '20%',
            ...getColumnSearchProps('reference'),
            // sorter: true,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '15%',
            render: (_, { status }) => (
                <>
                    {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : status === 'Cancelled' ? <Tag color="red">{status}</Tag> : status === 'Processed' ? <Tag color="purple">{status}</Tag> : null}
                </>
            ),
            ...getColumnSearchProps('status'),
            sorter: (a, b) => a.status.length - b.status.length

        },
        {
            title: 'Actions',
            dataIndex: 'action',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        {record.can['read-purchase_order'] ? (
                            <Link to={`/pesananpembelian/detail/${record.id}`}>
                                <Button
                                    size='small'
                                    type="primary"
                                    icon={<InfoCircleOutlined />}
                                />
                            </Link>
                        ) : null}
                        {
                            record.can['cancel-purchase_order'] ? (

                                <Button
                                    size='small'
                                    type="danger"
                                    icon={<CloseOutlined />}
                                    onClick={() => cancelPurchaseOrders(record.id, record.code)}
                                />

                            ) : null
                        }
                        {
                            record.can['delete-purchase_order'] ? (
                                <Button
                                    size='small'
                                    type="danger"
                                    icon={<DeleteOutlined />}
                                    onClick={() => deletePurchaseOrders(record.id, record.code)}
                                />
                            ) : null
                        }
                        {
                            record.can['update-purchase_order'] ? (
                                <Link to={`/pesananpembelian/edit/${record.id}`}>
                                    <Button
                                        size='small'
                                        type="success"
                                        icon={<EditOutlined />}
                                    />
                                </Link>
                            ) : null
                        }
                        {

                            record.can['force_done-purchase_order'] ? (
                                <Button
                                    size='small'
                                    type="success"
                                    icon={<CheckCircleOutlined />}
                                    onClick={() => forceDonePurchaseOrder(record.id, record.code)}
                                />
                                // <Button
                                //     size='small'
                                //     type="success"
                                //     icon={<CheckCircleOutlined />}
                                //     oncClick = {() => forceDonePurchaseOrder(record.id, record.code)}
                                // />

                            ) : null
                        }

                    </Space>
                </>
            )
        },
    ];


    return <Table
        size="small"
        loading={isLoading}
        columns={columns}
        dataSource={dataTampil}
        pagination={{ pageSize: 10 }}
        onChange={handleTableChange}


    // pagination=
    // {
    //     pesananPembelian.length < 50 ? { pageSize: 5 } : null
    // }
    />;
};

export default PesananPembelianTable;