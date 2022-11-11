import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Input, Space, Table, Typography } from "antd";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { toTitleCase } from "../../../utils/helper";
const { Text } = Typography;

const ProdukTable = () => {
  const auth = useSelector(state => state.auth);
  const [products, setProducts] = useState();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [ellipsis, setEllipsis] = useState(true);
  const [dataTampil, setDataTampil] = useState([]);

  const [dataMerek, setDataMerek] = useState([])


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
      width: '12%',
      ...getColumnSearchProps('code'),
    },
    {
      title: 'Nama Produk',
      dataIndex: 'name',
      key: 'name',
      width: '24%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Bagian',
      dataIndex: 'piece',
      key: 'piece',
      width: '10%',
      ...getColumnSearchProps('piece'),
      // sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (piece) => piece.name
    },
    {
      title: 'Merek',
      dataIndex: 'brand',
      key: 'brand',
      width: '10%',
      ...getColumnSearchProps('brand'),
      // sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (text,index) => text
    },
    // {
    //   title: 'Merek',
    //   dataIndex: 'brand',
    //   key: 'brand',
    //   // width: '15%',
    //   ...getColumnSearchProps('brand'),
    //   // sorter: true,
    //   // sortDirections: ['descend', 'ascend'],
    //   //render: (brand) => brand.name
    //   render: (piece) => piece.name 
    // },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      ...getColumnSearchProps('category.name'),
      render: (category) => category.name
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
      title: 'Grup',
      dataIndex: '_group',
      key: '_group',
      width: '15%',
      ...getColumnSearchProps('_group'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Actions',
      width: '12%',
      align: 'center',
      render: (_, record) => (
        <>
          <Space size="middle">
            <Link to={`/produk/detail/${record.id}`}>
              <Button
                size='small'
                type="primary"
                icon={<InfoCircleOutlined />}
              />
            </Link>
            <Link to={`/produk/edit/${record.id}`}>
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
              onClick={() => deleteProducts(record.id)}
            />
          </Space>
        </>
      ),
    },
  ];

  useEffect(() => {
    getProducts();
    console.log(dataMerek)
  }, []);

  const getProducts = async (params = {}) => {
    setIsLoading(true);
    await axios
      .get(`${Url}/products`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(res => {
        const getData = res.data.data
        setProducts(getData)
        console.log(getData);

        setDataMerek(getData[0].brand.name)

        setIsLoading(false);

        //console.log(getData)
      })
  };

  const deleteProducts = async (id) => {
    await axios.delete(`${Url}/products/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    getProducts();
    Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
  };

  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        dataSource={products}
        scroll={{
          y: 295,
        }}
      />
    </>
  );
}


export default ProdukTable;
