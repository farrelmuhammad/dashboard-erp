import './form.css'
import jsCookie from "js-cookie";
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Badge, Button, Checkbox, Dropdown, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, DownOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';

// const EditableContext = React.createContext(null);

// const EditableRow = ({ index, ...props }) => {
//     const [form] = Form.useForm();
//     return (
//         <Form form={form} component={false}>
//             <EditableContext.Provider value={form}>
//                 <tr {...props} />
//             </EditableContext.Provider>
//         </Form>
//     );
// };

// const EditableCell = ({
//     title,
//     editable,
//     children,
//     dataIndex,
//     record,
//     handleSave,
//     ...restProps
// }) => {
//     const [editing, setEditing] = useState(false);
//     const inputRef = useRef(null);
//     const form = useContext(EditableContext);
//     useEffect(() => {
//         if (editing) {
//             inputRef.current.focus();
//         }
//     }, [editing]);

//     const toggleEdit = () => {
//         setEditing(!editing);
//         form.setFieldsValue({
//             [dataIndex]: record[dataIndex],
//         });
//     };

//     const save = async () => {
//         try {
//             const values = await form.validateFields();
//             toggleEdit();
//             handleSave({ ...record, ...values });
//         } catch (errInfo) {
//             console.log('Save failed:', errInfo);
//         }
//     };

//     let childNode = children;

//     if (editable) {
//         childNode = editing ? (
//             <Form.Item
//                 style={{
//                     margin: 0,
//                 }}
//                 name={dataIndex}
//                 rules={[
//                     {
//                         required: true,
//                         message: `${title} is required.`,
//                     },
//                 ]}
//             >
//                 <Input ref={inputRef} onPressEnter={save} onBlur={save} />
//             </Form.Item>
//         ) : (
//             <div
//                 className="editable-cell-value-wrap"
//                 style={{
//                     paddingRight: 24,
//                 }}
//                 onClick={toggleEdit}
//             >
//                 {children}
//             </div>
//         );
//     }

//     return <td {...restProps}>{childNode}</td>;
// };


const menu = (
    <Menu
        items={[
            {
                key: '1',
                label: 'Action 1',
            },
            {
                key: '2',
                label: 'Action 2',
            },
        ]}
    />
);


const BuatTally = () => {
    const token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [warehouse, setWarehouse] = useState("");
    const [product, setProduct] = useState([]);
    const [salesOrder, setSalesOrder] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const { id } = useParams();

    //state return data from database
    const [getData, setGetData] = useState([]);
    const [getCode, setGetCode] = useState('');
    const [getDate, setGetDate] = useState('');
    const [getReferensi, setGetReferensi] = useState('');
    const [getDesciption, setGetDesciption] = useState('');
    const [getStatus, setGetStatus] = useState('');
    const [getCustomer, setGetCustomer] = useState('');
    const [getProduct, setGetProduct] = useState([]);


    const [getDataSO, setGetDataSO] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedWarehouse] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(2);

    // const handleDelete = (key) => {
    //     const newData = dataSource.filter((item) => item.key !== key);
    //     setDataSource(newData);
    // };
    const expandedRowRender = () => {
        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Status',
                key: 'state',
                render: () => (
                    <span>
                        <Badge status="success" />
                        Finished
                    </span>
                ),
            },
            {
                title: 'Upgrade Status',
                dataIndex: 'upgradeNum',
                key: 'upgradeNum',
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: 'operation',
                render: () => (
                    <Space size="middle">
                        <a>Pause</a>
                        <a>Stop</a>
                        <Dropdown overlay={menu}>
                            <a>
                                More <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                ),
            },
        ];
        const data = [];

        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i.toString(),
                date: '2014-12-24 23:12:00',
                name: 'This is produksi name',
                upgradeNum: 'Upgraded: 56',
            });
        }

        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
            width: '20%',
            key: 'name',
        },
        {
            title: 'Referensi',
            dataIndex: 'reference',
            key: 'platform',
        },
        {
            title: 'Catatan',
            dataIndex: 'notes',
            key: 'version',
        },
        {
            title: 'Action',
            key: 'operation',
            width: '5%',
            align: 'center',
            render: (_, record) =>
                <Space size="middle">
                    <Button
                        size='small'
                        type="danger"
                        icon={<DeleteOutlined />}
                    // onClick={() => deleteSalesOrder(record.id)}
                    />
                    <Button
                        size='small'
                        type="primary"
                        icon={<PlusOutlined />}
                    />
                </Space>
        },
    ];
    const data = [];

    for (let i = 0; i < 3; ++i) {
        data.push({
            key: i.toString(),
            name: 'Screem',
            platform: 'iOS',
            version: '10.3.4.5654',
            upgradeNum: 500,
            creator: 'Jack',
            createdAt: '2014-12-24 23:12:00',
        });
    }

    // const defaultColumns = [
    //     {
    //         title: 'No. Pesanan',
    //         dataIndex: 'code',
    //         align: 'center',
    //         width: '14%',
    //     },
    //     {
    //         title: 'Nama Alias',
    //         dataIndex: 'alias_name',
    //         align: 'center',
    //         width: '20%',
    //     },
    //     {
    //         title: 'Produk',
    //         dataIndex: 'product',
    //         align: 'center',
    //         width: '20%',
    //     },
    //     {
    //         title: 'Qty',
    //         dataIndex: 'quantity',
    //         align: 'center',
    //         width: '5%',
    //     },
    //     {
    //         title: 'Stn',
    //         dataIndex: 'unit',
    //         align: 'center',
    //         width: '5%',
    //     },
    //     {
    //         title: 'Box',
    //         dataIndex: 'box',
    //         align: 'center',
    //         width: '5%',
    //     },
    //     {
    //         title: '#',
    //         dataIndex: '#',
    //         align: 'center',
    //         width: '5%',
    //         render: (_, record) =>
    //             <Space size="middle">
    //                  <Button
    //                     size='small'
    //                     type="danger"
    //                     icon={<DeleteOutlined />}
    //                 />
    //                 <Button
    //                     size='small'
    //                     type="primary"
    //                     icon={<PlusOutlined />}
    //                 />
    //             </Space>
    //     },
    // ];

    const handleAdd = () => {
        const newData = {
            key: count,
            // name: `Edward King ${count}`,
            // age: '32',
            // address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    // const handleSave = (row) => {
    //     const newData = [...dataSource];
    //     const index = newData.findIndex((item) => row.key === item.key);
    //     const item = newData[index];
    //     newData.splice(index, 1, { ...item, ...row });
    //     setDataSource(newData);
    // };

    // const components = {
    //     body: {
    //         row: EditableRow,
    //         cell: EditableCell,
    //     },
    // };
    // const columns = defaultColumns.map((col) => {
    //     if (!col.editable) {
    //         return col;
    //     }

    //     return {
    //         ...col,
    //         onCell: (record) => ({
    //             record,
    //             editable: col.editable,
    //             dataIndex: col.dataIndex,
    //             title: col.title,
    //             handleSave,
    //         }),
    //     };
    // });

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_customers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeWarehouse = (value) => {
        setSelectedWarehouse(value);
        setWarehouse(value.id);
    };
    // load options using API call
    const loadOptionsWarehouse = (inputValue) => {
        return fetch(`${Url}/select_warehouses?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        // getSalesOrderById()
        getSalesOrderDetails()
    }, [])

    useEffect(() => {
        const getSO = async () => {
            const res = await axios.get(`${Url}/select_sales_orders?kode=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setGetDataSO(res.data);
            console.log(res.data)
        };

        if (query.length === 0 || query.length > 2) getSO();
    }, [query])

    // const getSalesOrderById = async () => {
    //     await axios.get(`${Url}/sales_orders?id=${id}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${token}`,
    //         },
    //     })
    //         .then((res) => {
    //             const getData = res.data.data[0]
    //             setGetData(getData);
    //             // setGetCode(getData.code);
    //             // setGetDate(getData.date);
    //             // setGetReferensi(getData.reference);
    //             // setGetDesciption(getData.notes);
    //             // setGetStatus(getData.status);
    //             // setGetCustomer(getData.customer_id);
    //             // setGetProduct(getData.sales_order_details);
    //             // console.log(getData.sales_order_details)
    //         })
    //         .catch((err) => {
    //             // Jika Gagal
    //             console.log(err);
    //         });
    // }

    const getSalesOrderDetails = async () => {
        await axios.get(`${Url}/sales_order_details/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data
                setGetProduct(getData);
                console.log(getData)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/sales_orders/${id}`,
            data: userData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/pesanan");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    };

    const handleDraft = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/sales_orders/${id}`,
            data: userData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/pesanan");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    };

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h4 className="title fw-bold">Buat Tally Sheet</h4>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    disabled
                                    defaultValue={getDate}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Transaksi</label>
                            <div className="col-sm-7">
                                <input
                                    value={getCode}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Gudang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue2}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsWarehouse}
                                    onChange={handleChangeWarehouse}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                <textarea
                                    className="form-control"
                                    id="form4Example3"
                                    rows="4"
                                    value={getDesciption}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                <h5>
                                    {getStatus === 'Submitted' ? <Tag color="blue">{getStatus}</Tag> : getStatus === 'Draft' ? <Tag color="orange">{getStatus}</Tag> : getStatus === 'Done' ? <Tag color="green">{getStatus}</Tag> : <Tag color="red">{getStatus}</Tag>}
                                </h5>
                            </div>
                        </div> */}
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h5 className="title fw-normal">Daftar Pesanan</h5>
                        </div>
                        <div className="col text-end me-2 mb-2">
                            {/* <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            /> */}
                        </div>
                    </div>
                    <Table
                        columns={columns}
                        expandable={{
                            expandedRowRender,
                            defaultExpandedRowKeys: ['0'],
                        }}
                        dataSource={data}
                    />
                    {/* <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={salesOrder}
                        columns={columns}
                        onChange={(e) => setProduct(e.target.value)}
                    /> */}
                    {/* <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataSource}
                        columns={columns}
                    /> */}
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleDraft}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
            </form>
        </>
    )
}

export default BuatTally