
import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Popconfirm, Space, Table, Typography } from "antd";
import qs from "https://cdn.skypack.dev/qs@6.11.0";

import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toTitleCase } from "../../../utils/helper";
const { Text } = Typography;

const DepartemenTable = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector((state) => state.auth);
  const [departments, setDepartments] = useState();

  const searchInput = React.useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
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
    fetch(`${Url}/departments?${qs.stringify(getParams(tableParams))}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json())
      .then(({ data }) => {
        const getData = data;
        setDepartments(getData);
        // setStatus(getData.map(d => d.status))
        setIsLoading(false);
        console.log(getData);

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
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (record[dataIndex]) {
       return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())

      }
    },

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
      title: "Kode",
      dataIndex: "code",
      key: "code",
      width: "10%",
      ...getColumnSearchProps("code"),
      sorter: (a, b) => a.code.length - b.code.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Departemen",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Keterangan",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text) => (
        <Text
          style={
            ellipsis
              ? {
                width: 500,
              }
              : undefined
          }
          ellipsis={
            ellipsis
              ? {
                tooltip: text,
              }
              : false
          }
        >
          {text}
        </Text>
      ),
      // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Actions",
      width: "20%",
      align: "center",
      render: (_, record) => (
        <>
          <Space size="middle">
            <Link to={`/departemen/detail/${record.id}`}>
              <Button
                size="small"
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/departemen/edit/${record.id}`}>
              <Button size="small" type="success" icon={<EditOutlined />} />
            </Link>
            <Button
              size="small"
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => deleteDepartments(record.id, record.code)}
            />
          </Space>
        </>
      ),
    },
  ];

  // useEffect(() => {
  //   getDepartments();
  // }, []);

  // const getDepartments = async () => {
  //   axios
  //     .get(`${Url}/departments`, {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${auth.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       const getData = res.data.data;
  //       setDepartments(getData);
  //       // setStatus(getData.map(d => d.status))
  //       setIsLoading(false);
  //       console.log(getData);
  //     });
  // };

  const deleteDepartments = async (id, code) => {
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
          axios.delete(`${Url}/departments/${id}`, {
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
        pagination={{ pageSize: 10 }}
        dataSource={departments}
        onChange={handleTableChange}

        scroll={{
          y: 295,
        }}
      />
    </>
  );
};

export default DepartemenTable;
