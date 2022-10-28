import * as React from "react";
import { useState } from "react";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, CloseOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import { useSelector } from "react-redux";

const TallyTable = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = React.useRef(null);
  const [getDataTally, setGetDataTally] = useState([]);
  const [dataTampil, setDataTampil] = useState([]);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const auth = useSelector(state => state.auth);
  const [supplierName, setSupplierName] = useState()
  const [sumber, setSumber] = useState()
  const [customer, setCustomer] = useState()
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
    fetch(`${Url}/tally_sheets?tipe=Sales&${qs.stringify(getParams(tableParams))}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json())
      .then(({ data }) => {
        // setGetDataTally(data);
         // agar bisa di search 
        let tmp = []
        for (let i = 0; i < data.length; i++) {
          tmp.push({
            id: data[i].id,
            can: data[i].can,
            code: data[i].code,
            customer_name: data[i].customer_name ? data[i].customer_name : '',
            supplier_name: data[i].supplier_name ? data[i].supplier_name : '',
            date: data[i].date,
            status: data[i].status,
            warehouse_name: data[i].warehouse.name
          })
        }
        setGetDataTally(tmp)

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


  const deleteTallySheet = async (id, code) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Data akan dihapus",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${Url}/tally_sheets/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        getTallySheet()
        Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");

      }
    })

  };

  const cancelTallySheet = async (id, code) => {
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
            url: `${Url}/tally_sheets/cancel/${id}`,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          })

          getTallySheet();
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

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${title}`}
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
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  // useEffect(() => {
  //   getTallySheet()
  // }, [])

  // function handleTableChange(dataIndex) {
  //   console.log(dataIndex)
  //   axios.get(`${Url}/tally_sheets?tipe=Sales`, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${auth.token}`
  //     }
  //   })
  //     .then(res => {
  //       const getData = res.data.data
  //       setGetDataTally(getData)
  //       if (getData.supplier_id) {
  //         setSumber('Retur')
  //       }
  //       else {
  //         setSumber('SO')
  //       }

  //       // agar bisa di search 
  //       let tmp = []
  //       for (let i = 0; i < getData.length; i++) {
  //         tmp.push({
  //           id: getData[i].id,
  //           can: getData[i].can,
  //           code: getData[i].code,
  //           customer_name: getData[i].customer_name ? getData[i].customer_name : '',
  //           supplier_name: getData[i].supplier_name ? getData[i].supplier_name : '',
  //           date: getData[i].date,
  //           status: getData[i].status,
  //           warehouse: getData[i].warehouse.name
  //         })
  //       }
  //       setDataTampil(tmp)
  //     })
  // }

  const getTallySheet = async (params = {}) => {
    setIsLoading(true);
    await axios.get(`${Url}/tally_sheets?tipe=Sales`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
      .then(res => {
        const getData = res.data.data
        setGetDataTally(getData)
        if (getData.supplier_id) {
          setSumber('Retur')
        }
        else {
          setSumber('SO')
        }

        // // agar bisa di search 
        // let tmp = []
        // for (let i = 0; i < getData.length; i++) {
        //   tmp.push({
        //     id: getData[i].id,
        //     can: getData[i].can,
        //     code: getData[i].code,
        //     customer_name: getData[i].customer_name ? getData[i].customer_name : '',
        //     supplier_name: getData[i].supplier_name ? getData[i].supplier_name : '',
        //     date: getData[i].date,
        //     status: getData[i].status,
        //     warehouse: getData[i].warehouse.name
        //   })
        // }
        // setDataTampil(tmp)
        setIsLoading(false);
      })
  }


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
      // sorter: true,
      sorter: (a, b) => a.date.length - b.date.length,
      sortDirections: ['descend', 'ascend'],
      // sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('date', 'Tanggal'),
    },
    {
      title: 'No. Transaksi',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      sorter: (a, b) => a.code.length - b.code.length,
      ...getColumnSearchProps('code', 'No. Transaksi'),
      // defaultSortOrder: 'descend',
      // sorter: (a, b) => a.code - b.code,
      // sorter: (a, b) => a.code.length - b.code.length,
      // sortOrder: sortedInfo.columnKey === 'code' ? sortedInfo.order : null,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      width: '15%',
      key: 'customer_name',
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('customer_name', 'Customer'),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      width: '15%',
      key: 'supplier_name',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('supplier_name', 'Supplier'),
    },
    {
      title: 'Gudang',
      dataIndex: 'warehouse_name',
      key: 'warehouse_name',
      width: '15%',
      sorter: (a, b) => a.warehouse_name.length - b.warehouse_name.length,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('warehouse_name', 'Gudang'),
      // render: (warehouse) => warehouse.name
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '15%',
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ['descend', 'ascend'],
      render: (_, { status }) => (
        <>
          {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="volcano">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : status === 'Processed' ? <Tag color="orange">{status}</Tag> : <Tag color="red">{status}</Tag>}
        </>
      ),
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Actions',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <>
          <Space size="middle">
            {record.can['read-tally_sheet'] ? (
              <Link to={`/tally/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
            ) : null}
            {
              record.can['cancel-tally_sheet'] ? (

                <Button
                  size='small'
                  type="danger"
                  icon={<CloseOutlined />}
                  onClick={() => cancelTallySheet(record.id, record.code)}
                />

              ) : null
            }
            {
              record.can['delete-tally_sheet'] ? (
                <Space size="middle">
                  <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTallySheet(record.id, record.code)}
                  />
                </Space>
              ) : null
            }
            {
              record.can['update-tally_sheet'] ? (
                <Link to={`/tally/edit/${record.id}`}>
                  <Button
                    size='small'
                    type="success"
                    icon={<EditOutlined />}
                  />
                </Link>
              ) : null
            }
          </Space>
        </>
      )
    },
  ];
  return <Table
    size="small"
    loading={isLoading}
    columns={columns}
    // pagination={{ pageSize: 10 }}
    onChange={handleTableChange}
    dataSource={getDataTally}
    scroll={{
      y: 240,
    }}
  />;
};

export default TallyTable;
