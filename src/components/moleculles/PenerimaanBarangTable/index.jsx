import * as React from "react";
import { useState } from "react";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Space, Table, Tag } from "antd";
import { CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import { useSelector } from "react-redux";

const PenerimaanBarangTable = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = React.useRef(null);
  const [getPenerimaanBarang, setGetPenerimaanBarang] = useState([]);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [dataTampil, setDataTampil] = useState([]);
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
    fetch(`${Url}/goods_receipts?${qs.stringify(getParams(tableParams))}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json())
      .then(({ data }) => {
        const getData = data;
        setGetPenerimaanBarang(getData)
        setCode(getData.code)

        let tmp = []
        for (let i = 0; i < getData.length; i++) {
          tmp.push({
            id: getData[i].id,
            can: getData[i].can,
            code: getData[i].code,
            date: getData[i].date,
            status: getData[i].status,
            customer_name: getData[i].customer_name ? getData[i].customer_name : <div className="text-start">-</div>,
            supplier_name: getData[i].supplier_name ? getData[i].supplier_name : <div className="text-start">-</div>,
            warehouse_name: getData[i].warehouse_name ? getData[i].warehouse_name : <div className="text-start">-</div>,
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


  const deletePenerimaan = async (id, code) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Data ini akan dihapus",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${Url}/goods_receipts/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        fetchData()
        Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");

      }
    })

  };

  const cancelPenerimaan = async (id, code) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Status data akan diubah ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios({
            method: "patch",
            url: `${Url}/goods_receipts/cancel/${id}`,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          })

          fetchData();
          Swal.fire("Berhasil Dibatalkan!", `${code} Dibatalkan`, "success");
        }
        catch (err) {
          console.log(err);
        }
      }
    })

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

  // useEffect(() => {
  //   getDataPenerimaan()
  // }, [])

  // const getDataPenerimaan = async (params = {}) => {
  //   setIsLoading(true);
  //   await axios.get(`${Url}/goods_receipts`, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${auth.token}`
  //     }
  //   })
  //     .then(res => {
  //       const getData = res.data.data;
  //       setGetPenerimaanBarang(getData)
  //       setCode(getData.code)

  //       let tmp = []
  //       for (let i = 0; i < getData.length; i++) {
  //         tmp.push({
  //           id: getData[i].id,
  //           can: getData[i].can,
  //           code: getData[i].code,
  //           date: getData[i].date,
  //           status: getData[i].status,
  //           customer_name: getData[i].customer_name ? getData[i].customer_name : <div className="text-center">-</div>,
  //           supplier_name: getData[i].supplier_name ? getData[i].supplier_name : <div className="text-center">-</div>,
  //           warehouse_name: getData[i].warehouse_name ? getData[i].warehouse_name : <div className="text-center">-</div>,
  //         })
  //       }

  //       setDataTampil(tmp)
  //       setIsLoading(false);
  //       console.log(getData)
  //     })
  // }

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      sorter: (a, b) => a.date.length - b.date.length,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('date'),
    },
    {
      title: 'No. Penerimaan',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      ...getColumnSearchProps('code'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: '20%',
      ...getColumnSearchProps('supplier_name'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      width: '20%',
      ...getColumnSearchProps('customer_name'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Gudang',
      dataIndex: 'warehouse_name',
      key: 'warehouse_name',
      width: '15%',
      ...getColumnSearchProps('warehouse_name'),
      sorter: (a, b) => a.warehouse_name.length - b.warehouse_name.length,
      sortDirections: ['descend', 'ascend'],

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '15%',
      render: (_, { status }) => (
        <>
          {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}

        </>
      ),
      ...getColumnSearchProps('status'),
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Actions',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <>
          {record.status === 'Submitted' ? (
            <Space size="middle">
              <Button
                size='small'
                type="danger"
                icon={<CloseOutlined />}
                onClick={() => cancelPenerimaan(record.id, record.code)}
              />
              <Link to={`/penerimaanbarang/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
              <Link to={`/penerimaanbarang/edit/${record.id}`}>
                <Button
                  size='small'
                  type="success"
                  icon={<EditOutlined />}
                />
              </Link>
            </Space>
          ) : record.status === 'Draft' ? (
            <Space size="middle">
              <Link to={`/penerimaanbarang/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
              <Link to={`/penerimaanbarang/edit/${record.id}`}>
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
                onClick={() => deletePenerimaan(record.id, record.code)}
              />
            </Space>
          ) : record.status === 'Done' || record.status === 'Done' ? (
            <Space size="middle">
              <Link to={`/penerimaanbarang/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
            </Space>
          ) :
            record.status === 'Cancelled' ? (
              <Space size="middle">
                <Link to={`/penerimaanbarang/detail/${record.id}`}>
                  <Button
                    size='small'
                    type="primary"
                    icon={<InfoCircleOutlined />}
                  />
                </Link>
              </Space>
            ) : (
              <></>
            )


          }
        </>
      ),
    },
  ];
  return <Table
    size="small"
    loading={isLoading}
    columns={columns}
    onChange={handleTableChange}
    pagination={{ pageSize: 10 }}
    dataSource={dataTampil}
  />;
};

export default PenerimaanBarangTable;
