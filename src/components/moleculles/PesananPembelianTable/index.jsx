import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CloseOutlined, DeleteOutlined, EditOutlined, CheckCircleOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PesananPembelianTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pesananPembelian, setPesananPembelian] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [namaMataUang, setNamaMataUang] = useState();
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

                getPesananPembelian()
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
                getPesananPembelian()
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

                    getPesananPembelian();
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

    useEffect(() => {
        getPesananPembelian()
    }, [])

    const getPesananPembelian = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/purchase_orders`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setPesananPembelian(getData)
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
                    // else{
                    //     console.log(getData[i].currency)

                    // }
                }
                setNamaMataUang(mataUang);
                console.log(mataUang)
                setIsLoading(false);
                console.log(getData[0].can)
            })
    }

    const columns = [
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            ...getColumnSearchProps('date'),
        },
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            // sorter: true,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            key: 'supplier_name',
            width: '20%',
            ...getColumnSearchProps('supplier_name'),
            // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: '13%',
            // render(text, record, index) {
            //     return {
            //       props: {
            //         style: { background:  "#f5f5f5" }
            //       },
            //       children: <div>{ Number(text).toLocaleString('id')}</div> 
            //     };
            // },
            ...getColumnSearchProps('total'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '15%',
            // render: (_, { status }) => (
            //     <>
            //         {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : status === 'Cancelled' ? <Tag color="red">{status}</Tag> : status === 'Processed' ? <Tag color="purple">{status}</Tag> : null}
            //     </>
            // ),
            ...getColumnSearchProps('status'),
        },
        {
            title: 'Actions',
            dataIndex: 'action',
            width: '20%',
            align: 'center',
           
        },
    ];

    const dataColumn =
        [...pesananPembelian.map((item, i) => ({
            date: item.date,
            code: item.code,
            supplier_name: item.supplier_name,
            total: item.supplier._group == 'Lokal' ? <div>{"Rp" + ' ' + Number(item.total).toLocaleString('id')}</div> : <div>{namaMataUang[i] + ' ' + Number(item.total).toLocaleString('id')}</div>,
            status:
                <>
                    {item.status === 'Submitted' ? <Tag color="blue">{item.status}</Tag> : item.status === 'Draft' ? <Tag color="orange">{item.status}</Tag> : item.status === 'Done' ? <Tag color="green">{item.status}</Tag> : item.status === 'Cancelled' ? <Tag color="red">{item.status}</Tag> : item.status === 'Processed' ? <Tag color="purple">{item.status}</Tag> : null
                    }
                </>,
            action:
                <>
                    <Space size="middle">
                        {item.can['read-purchase_order'] ? (
                            <Link to={`/pesananpembelian/detail/${item.id}`}>
                                <Button
                                    size='small'
                                    type="primary"
                                    icon={<InfoCircleOutlined />}
                                />
                            </Link>
                        ) : null}
                        {
                            item.can['cancel-purchase_order'] ? (

                                <Button
                                    size='small'
                                    type="danger"
                                    icon={<CloseOutlined />}
                                    onClick={() => cancelPurchaseOrders(item.id, item.code)}
                                />

                            ) : null
                        }
                        {
                            item.can['delete-purchase_order'] ? (
                                    <Button
                                        size='small'
                                        type="danger"
                                        icon={<DeleteOutlined />}
                                        onClick={() => deletePurchaseOrders(item.id, item.code)}
                                    />
                            ) : null
                        }
                        {
                            item.can['update-purchase_order'] ? (
                                <Link to={`/pesananpembelian/edit/${item.id}`}>
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
        }))


        ]
    return <Table
        loading={isLoading}
        columns={columns}
        dataSource={dataColumn}
        pagination=
        {
            pesananPembelian.length < 50 ? { pageSize: 5 } : null
        }
    />;
};

export default PesananPembelianTable;