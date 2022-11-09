import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CheckCircleOutlined, CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag , Tooltip} from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatRupiah } from '../../../utils/helper';
import CurrencyFormat from 'react-currency-format';
import { CheckCircleOutline } from '@mui/icons-material';
import qs from "https://cdn.skypack.dev/qs@6.11.0";
import { get } from 'lodash';

const PesananTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataSO, setGetDataSO] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // const token = jsCookie.get('auth');
    const auth = useSelector(state => state.auth);
    const [dataTampil, setDataTampil] = useState([]);


    const { id } = useParams();

    // const deleteSalesOrder = async (id) => {
    //     await axios.delete(`${Url}/sales_orders/${id}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     });
    //     getSalesOrder()
    //     Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
    // };


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
        console.log(qs.stringify(getParams(tableParams)))
        fetch(`${Url}/sales_orders?${qs.stringify(getParams(tableParams))}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }).then((res) => res.json()
        )
          .then(({ data }) => {
             console.log(data)
            // setGetDataTally(data);
            // agar bisa di search 
            let tmp = []
            for (let i = 0; i < data.length; i++) {
              tmp.push({
                id: data[i].id,
                can: data[i].can,
                date:data[i].date,
                code: data[i].code,
                customer:data[i].customer.name,
                status:data[i].status,
                total: data[i].total,

              })
            }
            setGetDataSO(tmp)
            setTableParams({
                ...tableParams,
                pagination: {
                  ...tableParams.pagination,
                  total: 200,
                },
              });
    
            setIsLoading(false);
           
          });
      };
    
    
      useEffect(() => {
        fetchData();
      }, [JSON.stringify(tableParams)]);
    
    
    const deleteSalesOrder = async (id, code) => {
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
            axios.delete(`${Url}/sales_orders/${id}`, {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
            });
            fetchData()
            Swal.fire("Berhasil Dihapus!", `Data ${code} Berhasil hapus`, "success");
    
          }
        })
    
      };

      const forceDoneSalesOrder = async (id, code) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Status akan diubah menjadi done",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya'
        }).then((result) => {
            if (result.isConfirmed) {
                axios({
                    method: "patch",
                    url: `${Url}/sales_orders/force_done/${id}`,
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                })

                fetchData()
                Swal.fire("Berhasil Diubah!", `${code} Done`, "success");

            }
        })
    }

      const cancelSalesOrder = async (id, code) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Status data akan diubah",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    const datakirim = new FormData();
                    datakirim.append("", '');

                    axios({
                        method: "patch",
                        url: `${Url}/sales_orders/cancel/${id}`,
                        data: datakirim,
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




    //   const cancelSalesOrder = async (id, code) => {
    //     Swal.fire({
    //         title: 'Apakah Anda Yakin?',
    //         text: "Status data akan diubah",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Ya'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 const datakirim = new FormData();
    //                 datakirim.append("", '');

    //                 axios({
    //                     method: "patch",
    //                     url: `${Url}/sales_orders/cancel/${id}`,
    //                     data: datakirim,
    //                     headers: {
    //                         Accept: "application/json",
    //                         Authorization: `Bearer ${auth.token}`,
    //                     },
    //                 })

    //                 fetchData();
    //                 Swal.fire("Berhasil Dihapus!", `Data ${code} Berhasil hapus`, "success");
    //             }
    //             catch (err) {
    //                 console.log(err);
    //             }

    //         }
    //     })


    // };


    // const cancelSalesOrder = async (id) => {
    //     await axios.patch(`${Url}/sales_orders/cancel/${id}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODgxODg3MTgzNzk4NGI2YWIzMmVkNDljMGYyYWI5MDQzN2YxNTZkNDUwMmRmN2RhY2ZlMTNhODhlZmI0MGRiOGU1NzkzNDgxMWJkM2FhMDQiLCJpYXQiOjE2NjcyNzU4MDIuOTQ3NzM3LCJuYmYiOjE2NjcyNzU4MDIuOTQ3NzM5LCJleHAiOjE2OTg4MTE4MDIuODU3NjY3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.bjbsnCMShERlIiw2GHtW9w2avdasIe_R7qbJkeJ62qmTrqbSF0sgHjOyrI_caShp7JBNIZ7XQX_4skoOn-rOb6YhGRG5P_8Mmtr8a5F3l3lkRbIArQq3Nbbj_tqDMmNfIFGDPBabm7V66g_dSQ8y2assPqk9eY2UYSmPfeuIVkriVddB-hCl35i1RJaSjGNQ7ebG-9Ys8GaCLot7RSj6aMpA4QOnZYraVcOdaC6BRzfkR5RO8lwG-5GfFbVfRrv1-cGZrk3Jk8m5vUTd7YTc6DQUXrsOStw20n0E9w9nZE71JOrmeZlW-QNZ3x2652kfRTnJ2PBAAPA2-6MFI6vOm64iasjzKQzhXlwGq_5N5ZriAbKqTPHzdHqz68HNtgXaoLb0FPzYjiSCadBWY90a6ri5rlca0SKC5prmcY62dKoboDroFI-L6nxmJZmm30fyQX28mpVHbQY2zzHaa4hKgaE50tuBNTVyDH4FK-nW-KthxuTxXjCHLO7wLYFMwaofrqXs-LIsOzNAfgxYehSeFnRkM6JNVvSPdurKrYdpaZXJbr_ygMT30GLvcY0qximnCtWwA1O1xhcjeGRZz0FxSSsMnGPnQjgBN83BkFL_kcA9wuBfSdiz3Bz3LK1NaCjj6OLDeI4lKNJZ-yT1WjB4iqKht3ahXOMtQw9GV2GbyKg`,
    //         },
    //     });
    //     fetchData()
    //     Swal.fire("Berhasil Dibatalkan!", `${id} Dibatalkan`, "success");
    // };

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
    //     getSalesOrder()
    // }, [])

    // const getSalesOrder = async (params = {}) => {
    //     setIsLoading(true);
    //     await axios.get(`${Url}/sales_orders`, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${auth.token}`
    //         }
    //     })
    //         .then(res => {
    //             const getData = res.data.data
    //             setGetDataSO(getData)
    //             setStatus(getData.map(d => d.status))


                
    //         let tmp = []
    //         for (let i = 0; i < getData.length; i++) {
    //         tmp.push({
    //             id: getData[i].id,
    //             can: getData[i].can,
    //             date:getData[i].date,
    //             code: getData[i].code,
    //             customer:getData[i].customer.name,
    //             status:getData[i].status,
    //             // name:getData[i].name,
    //             total: 
    //             //  < CurrencyFormat  className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(getData[i].total).toFixed(2).replace('.' , ',')} key="diskon" />,
    //              getData[i].total,
    //             // _group:getData[i]._group,
    //             // category:getData[i].category.name,
    //             // department : getData[i].department.name ,
    //             // position: getData[i].position.name,
    //             // customer_name: getData[i].customer_name ? getData[i].customer_name : '',
    //             // supplier_name: getData[i].supplier_name ? getData[i].supplier_name : '',
    //             // date: getData[i].date,
    //             // status: getData[i].status,
    //             // warehouse: getData[i].warehouse.name
    //         })
    //         }
    //             setDataTampil(tmp)
    //             setIsLoading(false);
    //             //console.log(getData)
    //         })
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
            title: 'No. Pesanan',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            //sorter:( a,b ) => a.code.length - b.code.length,
             sorter: true,
             sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            ...getColumnSearchProps('customer'),
            // render: (customer) => customer.name
            // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            width: '20%',
            align:'center',
            sorter:(a,b) => a.total - b.total,
            sortDirections:['descend','ascend'],
            ...getColumnSearchProps('total'),
            render: (text) => 
            < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(text).toFixed(2).replace('.' , ',')} key="diskon" />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '12%',
            render: (_, { status }) => (
                <>
                   
                     {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="volcano">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : status === 'Processed' ? <Tag color="purple">{status}</Tag> : status == 'Cancelled' ? <Tag color="red">{status}</Tag> : null}
                </>
            ),
            ...getColumnSearchProps('status'),
            sorter:(a,b) => a.status.length - b.status.length
        },
        {
            title: 'Actions',
            width: '20%',
            align: 'center',
            dataIndex:'action',
            render: (_, record) => (
                <>
             
                <Space size="middle">
                {record.can['read-sales_order'] ? (
                    <Tooltip title="Detail" placement="bottom">
                    <Link to={`/pesanan/detail/${record.id}`}>
                        <Button
                            size='small'
                            type="primary"
                            icon={<InfoCircleOutlined />}
                        />
                    </Link>
                    </Tooltip>
                ) : null}

                { record.can['update-sales_order'] ? (
                <Tooltip title="Edit" placement="bottom">
                <Link to={`/pesanan/edit/${record.id}`}>
                    <Button
                        size='small'
                        type="success"
                        icon={<EditOutlined />}
                    />
                </Link>
                </Tooltip>
                ) : null}

                { record.can['cancel-sales_order'] ? (
                <Tooltip title="Cancel" placement="bottom">
                <Button
                    size='small'
                    type="danger"
                    icon={<CloseOutlined />}
                    onClick={() => cancelSalesOrder(record.id, record.code)}
                />
                </Tooltip>
                ) : null}

                { record.can['delete-sales_order'] ? (
                      <Tooltip title="Delete" placement="bottom">
                      <Button
                          size='small'
                          type="danger"
                          icon={<DeleteOutlined />}
                          onClick={() => deleteSalesOrder(record.id, record.code)}
                      />
                      </Tooltip>
                ):null}

                {record.can['force_done-sales_order'] ? (
                        <Tooltip title="Force Done" placement="bottom">
                        <Button
                            size='small'
                            type="success"
                            icon={<CheckCircleOutlined />}
                            onClick={() => forceDoneSalesOrder(record.id, record.code)}
                        />
                        </Tooltip>

                ) : null}
                   
                </Space>
           
                {/* <Space size="middle">
                    <Tooltip title="Detail" placement="bottom">
                    <Link to={`/pesanan/detail/${record.id}`}>
                        <Button
                            size='small'
                            type="primary"
                            icon={<InfoCircleOutlined />}
                        />
                    </Link>
                    </Tooltip>
                    <Tooltip title="Edit" placement="bottom">
                    <Link to={`/pesanan/edit/${record.id}`}>
                        <Button
                            size='small'
                            type="success"
                            icon={<EditOutlined />}
                        />
                    </Link>
                    </Tooltip>
                    <Tooltip title="Delete" placement="bottom">
                    <Button
                        size='small'
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteSalesOrder(record.id, record.code)}
                    />
                    </Tooltip>
                </Space>
           
                <Space size="middle">
                    <Tooltip title="Detail" placement="bottom">
                    <Link to={`/pesanan/detail/${record.id}`}>
                        <Button
                            size='small'
                            type="primary"
                            icon={<InfoCircleOutlined />}
                        />
                    </Link>
                    </Tooltip>
                </Space> */}
           
                <>
                </>
          
                </>
            ),
        },
    ];

    const dataColumn = [
        ...getDataSO.map((item, i) => ({
            date: item.date,
            code:item.code,
            customer: item.customer.name,
            total: 
            < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.' , ',')} key="diskon" />,
            status:  <>
            {item.status === 'Submitted' ? <Tag color="blue">{item.status}</Tag> : item.status === 'Draft' ? <Tag color="volcano">{item.status}</Tag> : item.status === 'Done' ? <Tag color="green">{item.status}</Tag> : item.status === 'Processed' ? <Tag color="orange">{item.status}</Tag> : <Tag color="red">{item.status}</Tag>}
        </>,
            action:       <>
            {item.status === 'Submitted' ? (
                <Space size="middle">
                    <Button
                        size='small'
                        type="danger"
                        icon={<CloseOutlined />}
                        onClick={() => cancelSalesOrder(item.id,item.code)}
                    />
                    <Link to={`/pesanan/detail/${item.id}`}>
                        <Button
                            size='small'
                            type="primary"
                            icon={<InfoCircleOutlined />}
                        />
                    </Link>
                    <Link to={`/pesanan/edit/${item.id}`}>
                        <Button
                            size='small'
                            type="success"
                            icon={<EditOutlined />}
                        />
                    </Link>
                </Space>
            ) : item.status === 'Draft' ? (
                <Space size="middle">
                    <Link to={`/pesanan/detail/${item.id}`}>
                        <Button
                            size='small'
                            type="primary"
                            icon={<InfoCircleOutlined />}
                        />
                    </Link>
                    <Link to={`/pesanan/edit/${item.id}`}>
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
                        onClick={() => deleteSalesOrder(item.id, item.code)}
                    />
                </Space>
            ) : item.status === 'Done' ? (
                <Space size="middle">
                    <Link to={`/pesanan/detail/${item.id}`}>
                        <Button
                            size='small'
                            type="primary"
                            icon={<InfoCircleOutlined />}
                        />
                    </Link>
                </Space>
            ) : (
                <>
                </>
            )}
        </>
        }))
    ]

    return <Table
        size="small"
        loading={isLoading}
        columns={columns}
        onChange={handleTableChange}
        //pagination={{ pageSize: 10 }}
        dataSource={getDataSO}
        scroll={{
            y: 240,
        }}
    />; 
};

export default PesananTable;