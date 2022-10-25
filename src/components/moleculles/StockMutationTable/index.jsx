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

const StockMutationTable = () => {
  const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataStockMutation, setGetDataStockMutation] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);

    const deleteStockMutation= async (id) => {
        await axios.delete(`${Url}/stockmutations/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        getStockMutation()
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
        getStockMutation()
    }, [])

    const getStockMutation= async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/stockmutations`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setGetDataStockMutation(getData)
                setStatus(getData.map(d => d.status))
                setIsLoading(false);
                console.log(getData)
            })
    }

    const columns = [
        {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            ...getColumnSearchProps('date'),
            sorter: (a, b) => a.date.length - b.date.length,
            sortDirections: ['descend'],
        },
        {
            title: 'No. Reference',
            dataIndex: 'reference',
            key: 'reference',
            width: '23%',
            ...getColumnSearchProps('reference'),
            sorter: (a, b) => a.reference.length - b.reference.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Gudang',
            dataIndex: 'wdestination_name',
            key: 'wdestination_name',
            ...getColumnSearchProps('wdestination_name'),
            width: '20%',
            sorter: (a, b) => a.wdestination_name.length - b.wdestination_name.length,
            sortDirections: ['ascend'],
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
            key: 'product_name',
            width: '25%',
            ...getColumnSearchProps('product_name'),
            sorter: (a, b) => a.product_name.length - b.product_name.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            key: 'qty',
            width: '13%',
            ...getColumnSearchProps('qty'),
            sorter: (a, b) => a.qty.length - b.qty.length,
            sortDirections: ['ascend'],
        },
        {
            title: 'Actions',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Space size="middle">
                        <Link to={`/stockmutation/detail/${record.id}`}>
                            <Button
                                size='small'
                                type="primary"
                                icon={<InfoCircleOutlined />}
                            />
                        </Link>
                        {/* <Link to={`/stockmutation/edit/${record.id}`}>
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
                            onClick={() => deleteStockMutation(record.id)}
                        /> */}
                    </Space>
                </>
            ),
        },
    ];
    return <Table
        size="small"
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        dataSource={getDataStockMutation}
        scroll={{
            y: 240,
        }}
    />;
};

export default StockMutationTable;
