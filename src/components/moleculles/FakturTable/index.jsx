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

const FakturTable = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [getDataFaktur, setGetDataFaktur] = useState([]);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);

  const deleteSalesFaktur = async (id) => {
    await axios.delete(`${Url}/sales_orders/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    getFaktur()
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
    getFaktur()
  }, [])

  const getFaktur = async (params = {}) => {
    setIsLoading(true);
    await axios.get(`${Url}/sales_invoices`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
      .then(res => {
        const getData = res.data.data
        setGetDataFaktur(getData)
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
      width: '10%',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'No. Faktur',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      ...getColumnSearchProps('code'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Pelanggan',
      dataIndex: 'recipient',
      width: '15%',
      key: 'recipient',
      ...getColumnSearchProps('customer_id'),
      render: (recipient) => recipient.name,
      // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '10%',
      ...getColumnSearchProps('total'),
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      ...getColumnSearchProps('type'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
      render: (_, { status }) => (
        <>
          {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}

        </>
      ),
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Actions',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Link to={`/faktur/detail/${record.id}`}>
              <Button
                size='small'
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/faktur/edit/${record.id}`}>
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
              onClick={() => deleteSalesFaktur(record.id)}
            />
          </Space>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 5 }}
        dataSource={getDataFaktur}
        scroll={{
          y: 240,
        }}
      />
    </>
  )
};

export default FakturTable;