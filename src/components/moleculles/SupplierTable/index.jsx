import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import { Button, Input, Space, Table, Tag } from "antd";
import { useRef } from "react";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";

const SupplierTable = () => {
  const auth = useSelector(state => state.auth);
  const [suppliers, setSuppliers] = useState();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataTampil, setDataTampil] = useState([]);

  const { id } = useParams();
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
    fetch(`${Url}/suppliers?${qs.stringify(getParams(tableParams))}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json())
      .then(({ data }) => {

        const getData = data
        setIsLoading(false);
        setSuppliers(getData)

        let tmp = []
        for (let i = 0; i < getData.length; i++) {
          tmp.push({
            id: getData[i].id,
            can: getData[i].can,
            code: getData[i].code,
            date: getData[i].date,
            phone_number: getData[i].phone_number ? getData[i].phone_number : <div>-</div>,
            status: getData[i].status,
            name: getData[i].name,

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

       return  record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      }
    },
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
      width: '15%',
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

      ...getColumnSearchProps('status'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
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
              onClick={() => deleteSuppliers(record.id, record.code)}
            />
          </Space>
        </>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };


  // useEffect(() => {
  //   getSuppliers();
  // }, []);

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
        setIsLoading(false);
        setSuppliers(getData)

        let tmp = []
        for (let i = 0; i < getData.length; i++) {
          tmp.push({
            id: getData[i].id,
            can: getData[i].can,
            code: getData[i].code,
            date: getData[i].date,
            phone_number: getData[i].phone_number ? getData[i].phone_number : <div>-</div>,
            status: getData[i].status,
            name: getData[i].name,

          })
        }

        setDataTampil(tmp)



        // setStatus(getData.map(d => d.status))
        setIsLoading(false);
        console.log(getData)
      })
  };

  const deleteSuppliers = async (id, code) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Data akan dihapus",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    })
      .then((result) => {
        if (result.isConfirmed) {
          axios.delete(`${Url}/suppliers/${id}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          })
            .then((res) => {
              Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");
              fetchData();
            })
            .catch((err) => {
              // console.log(res);
              Swal.fire("Tidak Bisa Dihapus", `${code} Sudah Diambil`, "error");
              getSuppliers();
            })
        }
      })
  };

  return (

    <Table
      size="small"
      loading={isLoading}
      columns={columns}
      pagination={{ pageSize: 10 }}
      dataSource={dataTampil}
      onChange={handleTableChange}

      scroll={{
        y: 295,
      }}
    />

  );
}

export default SupplierTable;
