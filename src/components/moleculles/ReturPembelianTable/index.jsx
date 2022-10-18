import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';

const ReturPembelianTable = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [getDataFaktur, setGetDataFaktur] = useState([]);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [mataUang, setMataUang] = useState('Rp.');

  const deletePurchaseRetur = async (id, code) => {
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
        axios.delete(`${Url}/purchase_returns/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        getRetur()
        Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");

      }
    })
  }

  const cancelPurchaseRetur = async (id, code) => {
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
            url: `${Url}/purchase_returns/cancel/${id}`,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          })

          getRetur();
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

  useEffect(() => {
    getRetur()
  }, [])

  const getRetur = async (params = {}) => {
    setIsLoading(true);
    await axios.get(`${Url}/purchase_returns`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
      .then(res => {
        const getData = res.data.data
        setGetDataFaktur(getData)
        setStatus(getData.map(d => d.status))
        setIsLoading(false);
        console.log(getData)

        if(getData.purchase_return_details[0].currency){

          setMataUang(getData.purchase_return_details[0].currency)
      }

      })
  }

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      width: '10%',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'No. Retur',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      ...getColumnSearchProps('code'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      width: '12%',
      key: 'supplier',
      ...getColumnSearchProps('supplier'),
      // render: (recipient) => recipient.name,
      // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '12%',
      ...getColumnSearchProps('total'),
    //   render: (text) => {
    //     return Number(text).toFixed(2).replace('.', ',')
    // },

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '10%',
      // render: (_, { status }) => (
      //   <>
      //     {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}

      //   </>
      // ),
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Actions',
      width: '10%',
      dataIndex:'action',
      align: 'center',
      // render: (_, record) => (
      //   <>
      //     <Space size="middle">
      //       {record.can['read-purchase_return'] ? (
      //         <Link to={`/returpembelian/detail/${record.id}`}>
      //           <Button
      //             size='small'
      //             type="primary"
      //             icon={<InfoCircleOutlined />}
      //           />
      //         </Link>
      //       ) : null}
      //       {
      //         record.can['cancel-purchase_return'] ? (

      //           <Button
      //             size='small'
      //             type="danger"
      //             icon={<CloseOutlined />}
      //             onClick={() => cancelPurchaseRetur(record.id, record.code)}
      //           />

      //         ) : null
      //       }
      //       {
      //         record.can['delete-purchase_return'] ? (
      //           // <Space size="middle">
      //           <Button
      //             size='small'
      //             type="danger"
      //             icon={<DeleteOutlined />}
      //             onClick={() => deletePurchaseRetur(record.id, record.code)}
      //           />
      //           // </Space>
      //         ) : null
      //       }
      //       {
      //         record.can['update-purchase_return'] ? (
      //           <Link to={`/returpembelian/edit/${record.id}`}>
      //             <Button
      //               size='small'
      //               type="success"
      //               icon={<EditOutlined />}
      //             />
      //           </Link>
      //         ) : null
      //       }
      //     </Space>
      //   </>


      // ),
    },
  ];

  const dataColumn = [
    ...getDataFaktur.map((item, i) => ({
      date: item.date, 
      code: item.code, 
      supplier: item.supplier.name, 
      total : <CurrencyFormat className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} value={Number(item.total).toFixed(2).replace('.' , ',')} />,
      status :  
        <>
        {item.status === 'Submitted' ? <Tag color="blue">{item.status}</Tag> : item.status === 'Draft' ? <Tag color="orange">{item.status}</Tag> : item.status === 'Done' ? <Tag color="green">{item.status}</Tag> : item.status === 'Cancelled' ? <Tag color="red">{item.status}</Tag> : item.status === 'Processed' ? <Tag color="purple">{item.status}</Tag> : null}
        </>,
      action:
      <>
      <Space size="middle">
          {item.can['read-purchase_return'] ? (
              <Link to={`/returpembelian/detail/${item.id}`}>
                  <Button
                      size='small'
                      type="primary"
                      icon={<InfoCircleOutlined />}
                  />
              </Link>
          ) : null}
          {
              item.can['cancel-purchase_return'] ? (

                  <Button
                      size='small'
                      type="danger"
                      icon={<CloseOutlined />}
                      onClick={() => cancelPurchaseRetur(item.id, item.code)}
                  />

              ) : null
          }
          {
              item.can['delete-purchase_return'] ? (
                      <Button
                          size='small'
                          type="danger"
                          icon={<DeleteOutlined />}
                          onClick={() => deletePurchaseRetur(item.id, item.code)}
                      />
              ) : null
          }
          {
              item.can['update-purchase_return'] ? (
                <Link to={`/returpembelian/edit/${item.id}`}>
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
    }))
  ]

  return <Table
    loading={isLoading}
    columns={columns}
    pagination={{ pageSize: 5 }}
    dataSource={dataColumn}
    scroll={{
      y: 240,
    }}
  />;
};

export default ReturPembelianTable;