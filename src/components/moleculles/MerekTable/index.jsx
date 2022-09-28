import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, Space, Table, Typography } from "antd";
import { useRef } from "react";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { toTitleCase } from "../../../utils/helper";
const { Text } = Typography;


const MerekTable = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [brands, setBrands] = useState();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ellipsis, setEllipsis] = useState(true);

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
      title: 'Kode',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Nama Merk',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Keterangan',
      dataIndex: 'description',
      key: 'description',
      ...getColumnSearchProps('description'),
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
      title: 'Actions',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Link to={`/merek/detail/${record.id}`}>
              <Button
                size='small'
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/merek/edit/${record.id}`}>
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
              onClick={() => deleteBrands(record.id)}
            />
          </Space>
        </>
      ),
    },
  ];

  useEffect(() => {
    getBrands();
  }, []);

  const getBrands = async () => {
    axios
      .get(`${Url}/brands`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(res => {
        const getData = res.data.data
        setBrands(getData)
        // setStatus(getData.map(d => d.status))
        setIsLoading(false);
        console.log(getData)
      })
  };

  const deleteBrands = async (id) => {
    await axios.delete(`${Url}/brands/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    getBrands();
    Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
  };

  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 5 }}
        dataSource={brands}
        scroll={{
          y: 240,
        }}
      />
    </>
  );
}

export default MerekTable;