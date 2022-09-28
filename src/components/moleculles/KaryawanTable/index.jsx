import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { Button, Input, Space, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { toTitleCase } from "../../../utils/helper";
import { positions } from "@mui/system";
const { Text } = Typography;

const KaryawanTable = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [employees, setEmployees] = useState();

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
      width: '20%',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Nama Karyawan',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Departemen',
      dataIndex: 'department',
      key: 'department',
      width: '30%',
      ...getColumnSearchProps('department'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (department) => department.name,
    },
    {
      title: 'Posisi',
      dataIndex: 'position',
      key: 'position',
      width: '30%',
      ...getColumnSearchProps('position'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (position) => position.name,

    },
    {
      title: 'Actions',
      width: '20%',
      align: 'center',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Link to={`/karyawan/detail/${record.id}`}>
              <Button
                size='small'
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/karyawan/edit/${record.id}`}>
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
              onClick={() => deleteEmployees(record.id)}
            />
          </Space>
        </>
      ),
    },
  ];

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    axios
      .get(`${Url}/employees`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(res => {
        const getData = res.data.data
        setEmployees(getData)
        // setDepartment(getData.department.name)
        // setStatus(getData.map(d => d.status))
        setIsLoading(false);
        // console.log(getData)
      })
  };

  const deleteEmployees = async (id) => {
    await axios.delete(`${Url}/employees/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    getEmployees();
    Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
  };

  return (
    <>
      <Table
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 5 }}
        dataSource={employees}
        scroll={{
          y: 240,
        }}
      />
    </>
  );
}

export default KaryawanTable;
