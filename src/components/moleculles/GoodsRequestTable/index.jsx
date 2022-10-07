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

const GoodsRequestTable = () => {
  const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataGoodsRequest, setGetDataGoodsRequest] = useState([]);
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

    const deleteGoodsRequest= async (id) => {
        await axios.delete(`${Url}/goodsrequests/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        getGoodsRequest()
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

    const getGoodsRequest= async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/goodsrequests?${qs.stringify(getParams(tableParams))}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setGetDataGoodsRequest(getData)
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
        getGoodsRequest();
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
            title: 'No. Permintaan Barang',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Gudang Awal',
            dataIndex: 'warehouse_source_name',
            key: 'warehouse_source_name',
            width: '20%',
            ...getColumnSearchProps('warehouse_source_name'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Gudang Tujuan',
            dataIndex: 'warehouse_destination_name',
            key: 'warehouse_destination_name',
            width: '20%',
            ...getColumnSearchProps('warehouse_destination_name'),
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
                    {status === 'publish' ? <Tag color="blue">{toTitleCase(status)}</Tag> : status === 'draft' ? <Tag color="orange">{toTitleCase(status)}</Tag> : status === 'Done' ? <Tag color="green">{toTitleCase(status)}</Tag> : <Tag color="red">{toTitleCase(status)}</Tag>}

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
                    {record.status === 'publish' ? (
                        <Space size="middle">
                        <Link to={`/goodsrequest/detail/${record.id}`}>
                            <Button
                                size='small'
                                type="primary"
                                icon={<InfoCircleOutlined />}
                            />
                        </Link>
                    </Space>
                    ) : (
                        <Space size="middle">
                        <Link to={`/goodsrequest/detail/${record.id}`}>
                            <Button
                                size='small'
                                type="primary"
                                icon={<InfoCircleOutlined />}
                            />
                        </Link>
                        <Link to={`/goodsrequest/edit/${record.id}`}>
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
                            onClick={() => deleteGoodsRequest(record.id)}
                        />
                    </Space>
                    )}
                </>
            ),
        },
    ];
    return <Table
        loading={isLoading}
        columns={columns}
        rowKey={(record) => record.id}
        sortDirections={["descend", "ascend"]}
        pagination={{ pageSize: 5 }}
        dataSource={getDataGoodsRequest}
        onChange={handleTableChange}
        scroll={{
            y: 240,
        }}
    />;
};

export default GoodsRequestTable;
