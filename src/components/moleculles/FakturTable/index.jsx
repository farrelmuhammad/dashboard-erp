import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, CloseOutlined, SearchOutlined, FileSyncOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import CurrencyFormat from 'react-currency-format';

const FakturTable = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [getDataFaktur, setGetDataFaktur] = useState([]);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    fetch(`${Url}/sales_invoices?${qs.stringify(getParams(tableParams))}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json())
      .then(({ data }) => {
        const getData = data
        setGetDataFaktur(getData)

        let tmp = []
        for (let i = 0; i < getData.length; i++) {
          tmp.push({
            id: getData[i].id,
            can: getData[i].can,
            code: getData[i].code,
            date: getData[i].date,
            recipient: getData[i].recipient.name ? getData[i].recipient.name : <div className='text-center'>'-'</div>,
            total: getData[i].total,
            type: getData[i].type,
            status: getData[i].status
          })
        }

        setDataTampil(tmp)
        setStatus(getData.map(d => d.status))
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



  const deleteSalesFaktur = async (id, code) => {
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
        axios.delete(`${Url}/sales_invoices?id_faktur_penjualan=${id}`, {
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

  const cancelSalesFaktur = async (id, code) => {
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
            url: `${Url}/sales_invoices/cancel?id_faktur_penjualan=${id}`,
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

  const ubahToDraft = async (id, code) => {
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
            url: `${Url}/sales_invoices/submitted_to_draft?id_faktur_penjualan=${id}`,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          })

          fetchData();
          Swal.fire("Berhasil Diubah!", `${code} Menjadi Draft`, "success");
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
  //   // getFaktur()
  // }, [])

  // const getFaktur = async (params = {}) => {
  //   setIsLoading(true);
  //   await axios.get(`${Url}/sales_invoices`, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${auth.token}`
  //     }
  //   })
  //     .then(res => {
  //       const getData = res.data.data
  //       setGetDataFaktur(getData)

  //       let tmp = []
  //       for (let i = 0; i < getData.length; i++) {
  //         tmp.push({
  //           id: getData[i].id,
  //           can: getData[i].can,
  //           code: getData[i].code,
  //           date: getData[i].date,
  //           recipient: getData[i].recipient.name ? getData[i].recipient.name : <div className='text-center'>'-'</div>,
  //           total: getData[i].total,
  //           type: getData[i].type,
  //           status: getData[i].status
  //         })
  //       }

  //       setDataTampil(tmp)
  //       setStatus(getData.map(d => d.status))
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
      width: '10%',

      sorter: (a, b) => a.date.length - b.date.length,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('date'),
    },
    {
      title: 'No. Faktur',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      ...getColumnSearchProps('code'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Customer',
      dataIndex: 'recipient',
      width: '15%',
      key: 'recipient',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('recipient'),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '15%',
      sorter: (a, b) => a.total - b.total,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('total'),
      render(text) {
        return <div>{
          <CurrencyFormat className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp. '} value={Number(text).toFixed(2).replace('.', ',')} />
        }</div>
      }
    },
    {
      title: 'Tipe',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps('type'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      render: (_, { status }) => (
        <>
          {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}

        </>
      ),
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Actions',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <>
          <Space size="middle">
            {record.can['read-sales_invoice'] ? (
              <Link to={`/faktur/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
            ) : null}


            {
              record.can['update-sales_invoice'] ? (
                <Link to={`/faktur/edit/${record.id}`}>
                  <Button
                    size='small'
                    type="success"
                    icon={<EditOutlined />}
                  />
                </Link>
              ) : null
            }
            {
              record.can['delete-sales_invoice'] ? (
                <Space size="middle">
                  <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteSalesFaktur(record.id, record.code)}
                  />
                </Space>
              ) : null
            }
            {
              record.can['cancel-sales_invoice'] ? (

                <Button
                  size='small'
                  type="danger"
                  icon={<CloseOutlined />}
                  onClick={() => cancelSalesFaktur(record.id, record.code)}
                />

              ) : null
            }
            {
              record.can['submitted_to_draft-sales_invoice'] ? (
                <Space size="middle">
                  <Button
                    size='small'
                    type="danger"
                    icon={<FileSyncOutlined />}
                    onClick={() => ubahToDraft(record.id, record.code)}
                  />
                </Space>
              ) : null
            }
          </Space>
        </>

        // <>
        //   <Space size="middle">
        //     <Link to={`/faktur/detail/${record.id}`}>
        //       <Button
        //         size='small'
        //         type="primary"
        //         icon={<InfoCircleOutlined />}
        //       />
        //     </Link>
        //     <Link to={`/faktur/edit/${record.id}`}>
        //       <Button
        //         size='small'
        //         type="success"
        //         icon={<EditOutlined />}
        //       />
        //     </Link>
        //     <Button
        //       size='small'
        //       type="danger"
        //       icon={<DeleteOutlined />}
        //       onClick={() => deleteSalesFaktur(record.id, record.code)}
        //     />
        //   </Space>
        // </>
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        columns={columns}
        onChange={handleTableChange}
        // pagination={{ pageSize: 10 }}
        dataSource={dataTampil}
        scroll={{
          y: 295,
        }}
      />
    </>
  )
};

export default FakturTable;