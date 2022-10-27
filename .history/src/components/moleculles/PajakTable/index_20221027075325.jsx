import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Popconfirm, Space, Table, Typography } from "antd";
import { useRef } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { toTitleCase } from "../../../utils/helper";
const { Text } = Typography;

const PajakTable = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector((state) => state.auth);
  const [taxes, setTaxes] = useState();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ellipsis, setEllipsis] = useState(true);

  const { id } = useParams();

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

  const columns = [
    {
      title: "Kode",
      dataIndex: "code",
      key: "code",
      width: "15%",
      ...getColumnSearchProps("code"),
    },
    {
      title: "Nama Pajak",
      dataIndex: "type",
      key: "type",
      width: "30%",
      ...getColumnSearchProps("type"),
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Persentase",
      dataIndex: "rate",
      key: "rate",
      ...getColumnSearchProps("rate"),
      render: (text) => <div>{text} %</div>,
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
            <Link to={`/pajak/detail/${record.id}`}>
              <Button
                size="small"
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/pajak/edit/${record.id}`}>
              <Button size="small" type="success" icon={<EditOutlined />} />
            </Link>
            <Popconfirm
              title="Yakin hapus?"
              onConfirm={() => deleteTaxes(record.id)}
            >
              <Button
                size="small"
                type="danger"
                icon={<DeleteOutlined />}
                // onClick={() => deleteTaxes(record.id)}
              />
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  useEffect(() => {
    getTaxes();
  }, []);

  const getTaxes = async () => {
    axios
      .get(`${Url}/taxes`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        const getData = res.data.data;
        setTaxes(getData);
        // setStatus(getData.map(d => d.status))
        setIsLoading(false);
        console.log(getData);
      });
  };

  const deleteTaxes = async (id) => {
    await axios.delete(`${Url}/taxes/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    getTaxes();
    Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
  };

  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        dataSource={taxes}
        scroll={{
          y: 295,
        }}
      />
    </>
  );
};

export default PajakTable;
