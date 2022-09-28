import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDate, formatRupiah, toTitleCase } from '../../../utils/helper';
import { Switch, Typography } from 'antd';
const { Text } = Typography;

const GeneralJournalTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataSO, setGetDataSO] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const token = jsCookie.get('auth');
    const auth = useSelector(state => state.auth);

    const [selectionType, setSelectionType] = useState('checkbox');

    const [ellipsis, setEllipsis] = useState(true);

    const { id } = useParams();

    const deleteSalesOrder = async (id) => {
        await axios.delete(`${Url}/chart_of_accounts/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        getSalesOrder()
        Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
    };

    const cancelSalesOrder = async (id) => {
        await axios.patch(`${Url}/sales_orders/cancel/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        getSalesOrder()
        Swal.fire("Berhasil Dibatalkan!", `${id} Dibatalkan`, "success");
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
        getSalesOrder()
    }, [])

    const getSalesOrder = async () => {
        setIsLoading(true);
        await axios.get(`${Url}/accountmovements`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setGetDataSO(getData)
                setStatus(getData.map(d => d.status))
                setIsLoading(false);
                console.log(getData)
            })
    }

    const columns = [
        {
            title: 'Tanggal',
            dataIndex: 'transaction_date',
            width: '15%',
            sorter: true,
            // render: (text, record) => <a>{formatDate(text)}</a>
        },
        {
            title: 'No. Transaksi',
            dataIndex: 'transaction_no',
            sorter: true,
            width: '20%',
        },
        {
            title: 'Deskripsi',
            dataIndex: 'notes',
            render: (text) => (
                <Text
                    style={
                        ellipsis
                            ? {
                                width: 100,
                            }
                            : undefined
                    }
                    ellipsis={
                        ellipsis
                            ? {
                                tooltip: toTitleCase(text),
                            }
                            : false
                    }
                >
                    {toTitleCase(text)}
                </Text>
            )
            // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Total',
            dataIndex: 'transaction_amount',
            width: '15%',
            align: 'center',
            render: (text) => <div>{formatRupiah(text)}</div>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
            align: 'center',
            render: (text, { status }) => (
                <>
                    {status === 'publish' ? <Tag color="blue">{toTitleCase(status)}</Tag> : <Tag color="volcano">{toTitleCase(status)}</Tag>}
                </>
            ),
        },
        {
            title: 'Actions',
            width: '10%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        <Link to={`/jurnal/detail/${record.id}`}>
                            <Button
                                size='small'
                                type="primary"
                                icon={<InfoCircleOutlined />}
                            />
                        </Link>
                        <Link to={`/jurnal/edit/${record.id}`}>
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
                        // onClick={() => deleteSalesOrder(record.id)}
                        />
                    </Space>
                </>
            ),
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    return (
        <>

            <Table
                rowSelection={rowSelection}
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={getDataSO}
            />
        </>
    )
};

export default GeneralJournalTable;