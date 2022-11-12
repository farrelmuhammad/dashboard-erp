import * as React from "react";
import axios from "axios";
import { useState } from "react";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Space, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { toTitleCase } from "../../../utils/helper";
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import { useRef } from "react";
const { Text } = Typography;

const PenggunaTable = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [users, setUsers] = useState();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [ellipsis, setEllipsis] = useState(true);

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
    console.log(qs.stringify(getParams(tableParams)))
    fetch(`${Url}/users?${qs.stringify(getParams(tableParams))}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json())
      .then(({ data }) => {
        const getData = data
        setUsers(getData)
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

  const columns = [
    {
      title: 'Kode',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      ...getColumnSearchProps('code'),
      sorter: (a, b) => a.code.length - b.code.length,
      // ...getColumnSearchProps('code', 'No. Transaksi'),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Grup',
      dataIndex: 'groups',
      key: 'groups',
      width: '30%',
      ...getColumnSearchProps('groups'),
      // sorter: true,
      // sortDirections: ['descend', 'ascend'],
      render: (groups) => groups.join(" ")
    },
    {
      title: 'Username',
      dataIndex: 'username',
      width: '30%',
      key: 'username',
      ...getColumnSearchProps('username'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      // render: (text) => (
      //   <Text
      //     style={
      //       ellipsis
      //         ? {
      //           width: 500,
      //         }
      //         : undefined
      //     }
      //     ellipsis={
      //       ellipsis
      //         ? {
      //           tooltip: toTitleCase(text),
      //         }
      //         : false
      //     }
      //   >
      //     {toTitleCase(text)}
      //   </Text>
      // )
      // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Actions',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Link to={`/pengguna/detail/${record.id}`}>
              <Button
                size='small'
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/pengguna/edit/${record.id}`}>
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
              onClick={() => deleteUsers(record.id, record.code)}
            />
          </Space>
        </>
      ),
    },
  ];

  // useEffect(() => {
  //   getUsers();
  // }, []);

  // const getUsers = async () => {
  //   axios
  //     .get(`${Url}/users`, {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${auth.token}`,
  //       },
  //     })
  //     .then(res => {
  //       const getData = res.data.data
  //       setUsers(getData)
  //       // setStatus(getData.map(d => d.status))
  //       setIsLoading(false);
  //       console.log(getData)
  //     })
  // };

  const deleteUsers = async (id, code) => {
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
          axios.delete(`${Url}/users/${id}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          });
          fetchData();
          Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");
        }
      })
  };



  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        onChange={handleTableChange}
        pagination={{ pageSize: 10 }}
        dataSource={users}
        scroll={{
          y: 295,
        }}
      />
    </>
  );
}

export default PenggunaTable;
