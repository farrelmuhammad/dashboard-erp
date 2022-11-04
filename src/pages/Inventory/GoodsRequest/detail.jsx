import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Skeleton, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import { toTitleCase } from '../../../utils/helper';

const EditableContext = createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {/* <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={1} max={1000} defaultValue={1} /> */}
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} step="0.01" defaultValue={1}
                    //               formatter={value => `${value.replace('.',',')}`} 
                    decimalSeparator={','}
                    onChange={value => {
                        value = parseFloat(value.toString().replace('.', ','))
                    }}

                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const EditGoodsRequest = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);

    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [code, setCode] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(null);
    const [type, setType] = useState('');
    const [status, setStatus] = useState(null);
    const [warehouseSourceName, setWarehouseSourceName] = useState(null);
    const [warehouse_source, setWarehouseSource] = useState('');
    const [selectedWarehouseSource, setSelectedWarehouseSource] = useState(null);

    const [warehouseDestinationName, setWarehouseDestinationName] = useState(null);
    const [warehouse_destination, setWarehouseDestination] = useState([]);
    const [selectedWarehouseDestination, setSelectedWarehouseDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [getDataGoodsRequestDetail, setGetDataGoodsRequestDetail] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const cardOutline = {
        borderTop: '3px solid #007bff',
    }

    useEffect(() => {
        fetchGoodsRequest()
    }, [])

    const fetchGoodsRequest = async (e) => {
        await axios.get(`${Url}/goodsrequests?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                // setGetPosition(res.data.data[0]);
                // console.log(res.data.data[0])
                const getData = res.data.data[0]
                setCode(getData.code);
                setType(getData.type);
                setDate(getData.date);
                setWarehouseSource(getData.whsource.id);
                setWarehouseSourceName(getData.whsource.name);
                setWarehouseDestination(getData.whdestination.id);
                setWarehouseDestinationName(getData.whdestination.name);
                setNotes(getData.notes);
                setStatus(getData.status);
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                //   console.log(err);
            });
    }

    useEffect(() => {
        getGoodsRequestDetail()
    }, [])

    const getGoodsRequestDetail = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/goodsrequest_details/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                // setGetDataGoodsRequestDetail(getData)
                setProduct(getData)
                // setStatus(getData.map(d => d.status))
                setIsLoading(false);
                //   console.log(getData)
            })
    }

    const handleChangeWarehouseSource = (value) => {
        setSelectedWarehouseSource(value);
        setWarehouseSource(value.id);
    };

    const handleChangeWarehouseDestination = (value) => {
        setSelectedWarehouseDestination(value);
        setWarehouseDestination(value.id);
    };

    // load options using API call
    const loadOptionsWarehouse = (inputValue) => {
        return fetch(`${Url}/select_warehouses?limit=10&nama=${inputValue}&tipe=internal`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_stock_warehouses?product_name=${query}&warehouse_source=${warehouse_source}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
        },
        {
            title: 'Stok',
            dataIndex: 'qty',
            width: '15%',
            align: 'center',
            render: (text) => {
                return <>{text.toString().replace('.', ',')}</>

            }
        },
        {
            title: 'actions',
            dataIndex: 'actions',
            width: '15%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Checkbox
                        value={record}
                        // checked
                        onChange={handleCheck}
                    />
                    {/* <CheckBox
          type="checkbox"
          checked={selected}
          onChange={handleOnChange} 
        ></CheckBox> */}
                </>
            )
        },
    ];
    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '30%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                    },
                    children: <div>{Number(text).toFixed(2).replace('.', ',')}</div>
                };
            }
        },
        {
            title: 'Satuan',
            dataIndex: 'unit',
            width: '30%',
            align: 'center',
        },
        // {
        //     title: 'actions',
        //     dataIndex: 'actions',
        //     width: '15%',
        //     align: 'center',
        //     render: (item, record) => (
        //         <>
        //             <a href="javascript:void(0)" onClick={() => {sayHello(record)}}>Delete</a>
        //         </>
        //     )
        // },
    ];

    const sayHello = (row) => {
        // alert(`Hello, ${name}!`);
        const newData = [...product];
        // updatedList.splice(product.indexOf(event.target.value), 1);
        const index = newData.findIndex((item) => row.product_id === item.product_id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        // console.log(index,item,newData)
        console.log(newData)
    };

    const checkWarehouse = () => {
        // var updatedList = [...product];
        // updatedList = []
        // updatedList.splice(product.indexOf(0), 1);
        // setProduct(updatedList);
        if (warehouse_source == "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Pilih Gudang Asal Terlebih Dahulu !",
            });
        } else {
            setModal2Visible(true)
        }
    };
    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.product_id === item.product_id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const handleCheck = (event) => {
        var updatedList = [...product];
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
        // updatedList.map((p) => (console.log(p.product_id )));
        // console.log(event.target.value.product_id)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("date", date);
        userData.append("warehouse_source", warehouse_source);
        userData.append("warehouse_destination", warehouse_destination);
        userData.append("type", type);
        userData.append("notes", notes);
        userData.append("status", "Submitted");
        product.map((p) => {
            console.log(p);
            userData.append("product_id[]", p.product_id);
            userData.append("qty[]", p.qty);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/goodsrequests/${id}`,
            data: userData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/permintaanbarang");
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
        userData.append("date", date);
        userData.append("warehouse_source", warehouse_source);
        userData.append("warehouse_destination", warehouse_destination);
        userData.append("type", type);
        userData.append("notes", notes);
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("product_id[]", p.product_id);
            userData.append("qty[]", p.qty);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/goodsrequests/${id}`,
            data: userData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/permintaanbarang");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    };

    if (loading) {
        return (
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        )
    }

    return (
        <>
            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Permintaan Barang"
            >
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row mb-1">
                            <label for="code" className="col-sm-4 col-form-label">No</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="code" disabled defaultValue={code} name="code" placeholder="Otomatis" readOnly />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="date" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-8">
                                <input type="date" className="form-control" id="date" disabled name="date" defaultValue={date} onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="type" className="col-sm-4 col-form-label">Tipe</label>
                            <div className="col-sm-8">
                                <select onChange={e => setType(e.target.value)} id="type" disabled name="type" className="form-select">
                                    <option>Pilih Tipe</option>
                                    <option value="send" selected={type === "send"}>Kirim</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Asal</label>
                            <div className="col-sm-8">
                                <select disabled name="warehouse_source" className="form-select">
                                    <option selected>{warehouseSourceName}</option>
                                </select>
                                {/* <AsyncSelect
                                                placeholder="Pilih Gudang Asal..."
                                                cacheOptions
                                                defaultOptions
                                                defaultInputValue={warehouseSourceName}
                                                value={selectedWarehouseSource}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={loadOptionsWarehouse}
                                                onChange={handleChangeWarehouseSource}
                                                isDisabled
                                            /> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row mb-1">
                            <label for="notes" className="col-sm-4 col-form-label">Catatan</label>
                            <div className="col-sm-8">
                                <textarea
                                    className="form-control"
                                    name="notes" id="notes"
                                    rows="3"
                                    defaultValue={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Tujuan</label>
                            <div className="col-sm-8">
                                <select id="type" disabled name="type" className="form-select">
                                    <option selected>{warehouseDestinationName}</option>
                                </select>
                                {/* <AsyncSelect
                                                placeholder="Pilih Gudang Tujuan..."
                                                cacheOptions
                                                defaultOptions
                                                defaultInputValue={warehouseDestinationName}
                                                value={selectedWarehouseDestination}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={loadOptionsWarehouse}
                                                onChange={handleChangeWarehouseDestination}
                                            /> */}
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="adjustment_status" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                                {/* <h3 className="badge bg-danger text-center m-1">
                                                {status}
                                            </h3> */}
                                {status === 'Submitted' ? <Tag color="blue">{toTitleCase(status)}</Tag> : status === 'Draft' ? <Tag color="orange">{toTitleCase(status)}</Tag> : status === 'Done' ? <Tag color="green">{toTitleCase(status)}</Tag> : <Tag color="red">{toTitleCase(status)}</Tag>}
                            </div>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Detail Produk"
            >
                <div className="row">
                    <div className="col text-end me-2">
                        <Modal
                            title="Tambah Produk"
                            centered
                            visible={modal2Visible}
                            onCancel={() => setModal2Visible(false)}
                            // footer={[
                            //     <Button
                            //         key="submit"
                            //         type="primary"

                            //     >
                            //         Tambah
                            //     </Button>,
                            // ]}
                            footer={null}
                        >
                            <div className="text-title text-start">
                                <div className="row">
                                    <div className="col mb-3">
                                        <Search
                                            placeholder="Cari Produk..."
                                            style={{
                                                width: 400,
                                            }}
                                            onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                        />
                                    </div>
                                    <Table
                                        columns={columnsModal}
                                        dataSource={getDataProduct}
                                        scroll={{
                                            y: 250,
                                        }}
                                        pagination={false}
                                        loading={isLoading}
                                        size="middle"
                                    />
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
                <Table
                    loading={isLoading}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    columns={columns}
                    dataSource={product}
                    onChange={(e) => setProduct(e.target.value)}
                />
                {/* <Table
                          components={components}
                          rowClassName={() => 'editable-row'}
                          bordered
                          pagination={false}
                          dataSource={product}
                          columns={columns}
                          onChange={(e) => setProduct(e.target.value)}
                      /> */}
            </PageHeader>
        </>
    )
}

export default EditGoodsRequest