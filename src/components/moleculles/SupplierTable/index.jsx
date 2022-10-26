import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Space, Table, Tag } from "antd";
import { useRef } from "react";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";

const SupplierTable = () => {
  const auth = useSelector(state => state.auth);
  const [suppliers, setSuppliers] = useState();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

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

  const columns = [
    {
      title: 'Kode.',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      ...getColumnSearchProps('code'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      
    },
    {
      title: 'Nama Pemasok',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'No. Telepon',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: '30%',
      ...getColumnSearchProps('phone_number'),
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
          {status === 'Active' ? <Tag color="blue">{status}</Tag> : <Tag color="red">{status}</Tag>}
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
          <Space size="middle">
            <Link to={`/supplier/detail/${record.id}`}>
              <Button
                size='small'
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/supplier/edit/${record.id}`}>
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
              onClick={() => deleteSuppliers(record.id)}
            />
          </Space>
        </>
      ),
    },
  ];

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    axios
      .get(`${Url}/suppliers`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(res => {
        const getData = res.data.data
        setSuppliers(getData)
        // setStatus(getData.map(d => d.status))
        setIsLoading(false);
        console.log(getData)
      })
  };

  const deleteSuppliers = async (id) => {
    await axios.delete(`${Url}/suppliers/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    getSuppliers();
    Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
  };

  return (
   
      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        dataSource={suppliers}
        scroll={{
          y: 295,
        }}
      />
  
  );
}

export default SupplierTable;
