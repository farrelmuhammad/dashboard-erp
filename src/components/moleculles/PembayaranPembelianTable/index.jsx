import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CheckOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Modal, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import AsyncSelect from "react-select/async";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import Item from 'antd/lib/list/Item';
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import CurrencyFormat from 'react-currency-format';

const PembayaranPembelianTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [dataPembayaran, setDataPembayaran] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const auth.token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);


    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');
    const [customer, setCustomer] = useState("");
    const [address, setAddress] = useState("");
    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedAddress] = useState(null);
    const [dataTampil, setDataTampil] = useState([])

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
        fetch(`${Url}/purchase_invoice_payments?${qs.stringify(getParams(tableParams))}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json())
            .then(({ data }) => {
                const getData = data
                setDataPembayaran(getData)

                let tmp = []
                for (let i = 0; i < getData.length; i++) {
                    tmp.push({
                        id: getData[i].id,
                        can: getData[i].can,
                        code: getData[i].code,
                        date: getData[i].date,
                        total:
                            getData[i].currency_name == null || getData[i].currency_name == 'IDR' ?
                                < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={'IDR' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].paid).toFixed(2).replace('.', ',')} key="diskon" />
                                : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={getData[i].currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].paid).toLocaleString('id')} key="diskon" />,

                        status: getData[i].status,
                        supplier: getData[i].supplier.name ? getData[i].supplier.name : <div className='text-start'>-</div>,
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

    console.log(address)

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

    // const deletePembayaran = async (id, code) => {
    //     await axios.delete(`${Url}/purchase_invoice_payments/${id}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     });
    //     getDataPembayaran()
    //     Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");
    // };


    const deletePembayaran = async (id, code) => {
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
                axios.delete(`${Url}/purchase_invoice_payments/${id}`, {
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

    // useEffect(() => {
    //     getDataPembayaran()
    // }, [])

    // const getDataPembayaran = async (params = {}) => {
    //     setIsLoading(true);
    //     await axios.get(`${Url}/purchase_invoice_payments`, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${auth.token}`
    //         }
    //     })
    //         .then(res => {
    //             const getData = res.data.data
    //             setDataPembayaran(getData)



    //             let tmp = []
    //             for (let i = 0; i < getData.length; i++) {
    //                 tmp.push({
    //                     id: getData[i].id,
    //                     can: getData[i].can,
    //                     code: getData[i].code,
    //                     date: getData[i].date,
    //                     total:
    //                         getData[i].currency_name == null || getData[i].currency_name == 'IDR' ?
    //                             < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={'IDR' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].paid).toFixed(2).replace('.', ',')} key="diskon" />
    //                             : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "100%", fontSize: "10px!important" }} prefix={getData[i].currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].paid).toLocaleString('id')} key="diskon" />,

    //                     status: getData[i].status,
    //                     customer_id: getData[i].supplier.name ? getData[i].supplier.name : <div className='text-center'>-</div>,
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
            width: '13%',
            sorter: (a, b) => a.date.length - b.date.length,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('date'),
        },
        {
            title: 'No. Pembayaran',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            width: '20%',
            ...getColumnSearchProps('supplier'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            // render: (text, record, index) => (
            //     <>{dataPembayaran[index].supplier.name}</>
            // )

        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: '20%',
            sorter: (a, b) => a.total - b.total,
            ...getColumnSearchProps('total'),
            sortDirections: ['descend', 'ascend'],
            //...getColumnSearchProps('total'),
            // render: (text) => {
            //     return Number(text).toFixed(2).replace('.', ',')
            // }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '15%',
            render: (_, { status }) => (
                <>
                    {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}

                </>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
            ...getColumnSearchProps('status'),
        },
        {
            title: 'Actions',
            width: '20%',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        <Link to={`/pembayaranpembelian/detail/${record.id}`}>
                            <Button
                                size='small'
                                type="primary"
                                icon={<InfoCircleOutlined />}
                            />
                        </Link>
                        <Link to={`/pembayaranpembelian/edit/${record.id}`}>
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
                            onClick={() => deletePembayaran(record.id, record.code)}
                        />
                    </Space>
                </>
            ),
        },
    ];

    // const dataColumn = [
    //     ...dataPembayaran.map((item, i) => ({
    //         date: item.date,
    //         code: item.code,
    //         customer_id: item.supplier.name,
    //         total: item.currency_name == null ?
    //             < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.paid).toFixed(2).replace('.', ',')} key="diskon" />
    //             : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={item.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.paid).toLocaleString('id')} key="diskon" />,
    //         status: <>
    //             {item.status === 'Submitted' ? <Tag color="blue">{item.status}</Tag> : item.status === 'Draft' ? <Tag color="orange">{item.status}</Tag> : item.status === 'Done' ? <Tag color="green">{item.status}</Tag> : <Tag color="red">{item.status}</Tag>}
    //         </>,
    //         action: <>
    //             <Space size="middle">
    //                 <Link to={`/pembayaranpembelian/detail/${item.id}`}>
    //                     <Button
    //                         size='small'
    //                         type="primary"
    //                         icon={<InfoCircleOutlined />}
    //                     />
    //                 </Link>
    //                 <Link to={`/pembayaranpembelian/edit/${item.id}`}>
    //                     <Button
    //                         size='small'
    //                         type="success"
    //                         icon={<EditOutlined />}
    //                     />
    //                 </Link>
    //                 <Button
    //                     size='small'
    //                     type="danger"
    //                     icon={<DeleteOutlined />}
    //                     onClick={() => deletePembayaran(item.id, item.code)}
    //                 />
    //             </Space>
    //         </>,
    //     })
    //     )
    // ]

    return <Table
        size="small"
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        onChange={handleTableChange}
        dataSource={dataTampil}
        scroll={{
            y: 240,
        }}
    />;
};

export default PembayaranPembelianTable;