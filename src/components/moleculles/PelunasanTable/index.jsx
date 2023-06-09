import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CheckOutlined, DeleteOutlined, CloseOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Modal, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import AsyncSelect from "react-select/async";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import CurrencyFormat from 'react-currency-format';

const PelunasanTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataSO, setGetDataSO] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const auth.token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);
    const [dataTampil, setDataTampil] = useState([])


    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');
    const [customer, setCustomer] = useState("");
    const [address, setAddress] = useState("");
    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedAddress] = useState(null);

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
        console.log(qs.stringify(getParams(tableParams)))
        fetch(`${Url}/sales_invoice_payments?${qs.stringify(getParams(tableParams))}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json())
            .then(({ data }) => {

                const getData = data
                setGetDataSO(getData)

                let tmp = []
                for (let i = 0; i < getData.length; i++) {
                    tmp.push({
                        id: getData[i].id,
                        can: getData[i].can,
                        code: getData[i].code,
                        date: getData[i].date,
                        customer: getData[i].customer.name ? getData[i].customer.name : <div className='text-center'>'-'</div>,
                        total: getData[i].paid,
                        status: getData[i].status
                    })
                }

                setDataTampil(tmp)


                setStatus(getData.map(d => d.status))
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

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
        setAddress(value.customer_addresses)
    };

    // console.log(selectedValue);
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_customers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = (e, id) => {
        // setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setVisible(false);
            setConfirmLoading(false);
        }, 2000);
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("penerima", customer);
        userData.append("alamat_penerima", address);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "patch",
            url: `${Url}/delivery_notes/delivered/${id}`,
            data: userData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                // navigate("/suratjalan");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.message,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };


    const deletePelunasan = async (id, code) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Data akan dihapus",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${Url}/sales_invoice_payments/${id}`, {
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

    const cancelPelunasan = async (id, code) => {
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
                        url: `${Url}/sales_invoice_payments/cancel/${id}`,
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
    //     // getDataPelunasan()
    // }, [])

    // const getDataPelunasan = async (params = {}) => {
    //     setIsLoading(true);
    //     await axios.get(`${Url}/sales_invoice_payments`, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${auth.token}`
    //         }
    //     })
    //         .then(res => {
    //             const getData = res.data.data
    //             setGetDataSO(getData)

    //             let tmp = []
    //             for (let i = 0; i < getData.length; i++) {
    //                 tmp.push({
    //                     id: getData[i].id,
    //                     can: getData[i].can,
    //                     code: getData[i].code,
    //                     date: getData[i].date,
    //                     customer: getData[i].customer.name ? getData[i].customer.name : <div className='text-center'>'-'</div>,
    //                     total: getData[i].total,
    //                     status: getData[i].status
    //                 })
    //             }

    //             setDataTampil(tmp)


    //             setStatus(getData.map(d => d.status))
    //             setIsLoading(false);
    //             console.log(getData)
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
            title: 'No. Pelunasan',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            width: '15%',
            key: 'customer',
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('customer'),
            //render: (customer) => customer.name
            // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: '15%',
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('total'),
            render: (text) => {
                return < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp ' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(text).toFixed(2).replace('.', ',')} key="diskon" />
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '15%',
            sorter: (a, b) => a.status.length - b.status.length,
            sortDirections: ['descend', 'ascend'],
            render: (_, { status }) => (
                <>
                    {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="volcano">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : status === 'Processed' ? <Tag color="orange">{status}</Tag> : <Tag color="red">{status}</Tag>}
                </>
            ),
            ...getColumnSearchProps('status'),
        },
        {
            title: 'Actions',
            width: '15%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        {record.can['read-sales_invoice_payment'] ? (
                            <Link to={`/pelunasan/detail/${record.id}`}>
                                <Button
                                    size='small'
                                    type="primary"
                                    icon={<InfoCircleOutlined />}
                                />
                            </Link>
                        ) : null}
                        {
                            record.can['update-sales_invoice_payment'] ? (
                                <Link to={`/pelunasan/edit/${record.id}`}>
                                    <Button
                                        size='small'
                                        type="success"
                                        icon={<EditOutlined />}
                                    />
                                </Link>
                            ) : null
                        }
                        {
                            record.can['cancel-sales_invoice_payment'] ? (

                                <Button
                                    size='small'
                                    type="danger"
                                    icon={<CloseOutlined />}
                                    onClick={() => cancelPelunasan(record.id, record.code)}
                                />

                            ) : null
                        }
                        {
                            record.can['delete-sales_invoice_payment'] ? (
                                <Space size="middle">
                                    <Button
                                        size='small'
                                        type="danger"
                                        icon={<DeleteOutlined />}
                                        onClick={() => deletePelunasan(record.id, record.code)}
                                    />
                                </Space>
                            ) : null
                        }

                    </Space>
                </>

                // <>
                //     <Space size="middle">
                //         <Link to={`/pelunasan/detail/${record.id}`}>
                //             <Button
                //                 size='small'
                //                 type="primary"
                //                 icon={<InfoCircleOutlined />}
                //             />
                //         </Link>
                //         <Link to={`/pelunasan/edit/${record.id}`}>
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
                //         // onClick={() => deleteDeliveryNotes(record.id)}
                //         />
                //     </Space>
                // </>
            ),
        },
    ];

    return <Table
        size="small"
        loading={isLoading}
        columns={columns}
        // pagination={{ pageSize: 10 }}
        onChange={handleTableChange}
        dataSource={dataTampil}
        scroll={{
            y: 240,
        }}
    />;
};

export default PelunasanTable;