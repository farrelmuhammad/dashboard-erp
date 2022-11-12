import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import qs from "https://cdn.skypack.dev/qs@6.11.0";

const CoaTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataSO, setGetDataSO] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const token = jsCookie.get('auth');
    const auth = useSelector(state => state.auth);

    const [dataTampil, setDataTampil] = useState([]);

    const { id } = useParams();

    //   const fetchData = () => {
    //     setIsLoading(true);
    //     console.log(qs.stringify(getParams(tableParams)))
    //     fetch(`${Url}/chart_of_accounts?${qs.stringify(getParams(tableParams))}`, {
    //       headers: {
    //         Accept: "application/json",
    //         Authorization: `Bearer ${auth.token}`,
    //       },
    //     }).then((res) => res.json())
    //       .then(({ data }) => {
    //         const getData = data;
    //         setGetDataSO(getData)
           
    //         console.log(getDataSO)
    
    //         // let tmp = []
    //         // for (let i = 0; i < getData.length; i++) {
    //         //   tmp.push({
    //         //      id: getData[i].id,
    //         //      can: getData[i].can,
    //         //      code: getData[i].code,
    //         //      name: getData[i].name,
    //         //      description : getData[i].description,
    //         //   })
    //         // }
    
    //       //  setDataTampil(tmp)
    //         setIsLoading(false);
    //         setTableParams({
    //           ...tableParams,
    //           pagination: {
    //             ...tableParams.pagination,
    //             total: 200,
    //           },
    //         });
    //       });
    //   };
    
    
   
    
      
      const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
          pagination,
          filters,
          ...sorter,
        });
      };
    
    




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


    const deleteCOA = async (id, code) => {
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
            axios.delete(`${Url}/chart_of_accounts/${id}`, {
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

      const fetchData = () => {
        setIsLoading(true);
        fetch(`${Url}/chart_of_accounts?${qs.stringify(getParams(tableParams))}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }).then((res) => res.json())
          .then(({ data }) => {
            const getData = data
            setGetDataSO(getData)
            console.log(getData)

            let tmp = []
            for (let i = 0; i < getData.length; i++) {
              tmp.push({
                 id: getData[i].id,
                 can: getData[i].can,
                 code: getData[i].code,
                 name: getData[i].name,
                 //description : getData[i].description,
                 total:getData[i].total,
                 category_name: getData[i].chart_of_account_category.name
                 
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
    

    const deleteSalesOrder = async (id) => {
        await axios.delete(`${Url}/chart_of_accounts/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        getSalesOrder()
        Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
    };

    const cancelSalesOrder = async (id) => {
        await axios.patch(`${Url}/sales_orders/cancel/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        getSalesOrder()
        Swal.fire("Berhasil Dibatalkan!", `${id} Dibatalkan`, "success");
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


    useEffect(() => {
        fetchData();
      }, [JSON.stringify(tableParams)]);
    

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
    //     await axios.get(`${Url}/chart_of_accounts`, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': `Bearer ${auth.token}`
    //         }
    //     })
    //         .then(res => {
    //             const getData = res.data.data
    //             setGetDataSO(getData)
    //             setStatus(getData.map(d => d.status))
    //             setIsLoading(false);
    //             console.log(getData[0].can)
    //         })
    // }

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            sorter: true,
            width: '8%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Kategori Akun',
            dataIndex: 'category_name',
            key: 'category_name',
            width: '20%',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Kode',
            dataIndex: 'code',
            key: 'code',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
            // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Nama Akun',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'status',
            align: 'center',
            width: '20%',
            // render: (_, { status }) => (
            //     <>
            //         {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="volcano">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : status === 'Processed' ? <Tag color="orange">{status}</Tag> : <Tag color="red">{status}</Tag>}
            //     </>
            // ),
            //...getColumnSearchProps('status'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Actions',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <>
                  <Space size="middle">
                    {
                        record.can['read-chart_of_account'] ? 
                        <Link to={`/coa/detail/${record.id}`}>
                        <Button
                            size='small'
                            type="primary"
                            icon={<InfoCircleOutlined />}
                        />
                    </Link> :
                    null
                    }
                    {
                        record.can ['update-chart_of_account'] ? 
                        <Link to={`/coa/edit/${record.id}`}>
                            <Button
                                size='small'
                                type="success"
                                icon={<EditOutlined />}
                            />
                        </Link>
                       : null
                    }
                  {
                    record.can ['delete-chart_of_account'] ? 
                    <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                     onClick={() => deleteCOA(record.id, record.code)}
                /> : null
                }
                  </Space>
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
        scroll={{
            y: 240,
        }}
    />;
};

export default CoaTable;