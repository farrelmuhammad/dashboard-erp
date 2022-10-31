import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined,ArrowLeftOutlined  } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
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
    type_production,
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
            handleSave({ ...record, ...values },type_production);
            // console.log({ ...record, ...values },"aaa",type_production);
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
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} step="0.01" defaultValue={1}
                    decimalSeparator = {','}
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

const EditProduction = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);

    const [product, setProduct] = useState([]);
    const [productOutput, setProductOutput] = useState([]);
    const [query, setQuery] = useState("");
    const [query_out, setQueryOut] = useState("");
    const [checked, setChecked] = useState("");
    const [status, setStatus] = useState("");

    const [code, setCode] = useState('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(null);
    const [warehouse_input, setWarehouseInput] = useState([]);
    const [warehouse_output, setWarehouseOutput] = useState([]);
    const [selectedWarehouseInput, setSelectedWarehouseInput] = useState(null);
    const [warehouseInputName, setWarehouseInputName] = useState(null);
    const [warehouseOutputName, setWarehouseOutputName] = useState(null);
    const [selectedWarehouseOutput, setSelectedWarehouseOutput] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const [getDataProduct, setGetDataProduct] = useState();
    const [getDataOutput, setGetDataOutput] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal2VisibleOutput, setModal2VisibleOutput] = useState(false);

    const cardOutline = {
        borderTop: '3px solid #007bff',
    }

    useEffect(() => {
        fetchProduction()
    }, [])

    const fetchProduction = async (e) => {
        await axios.get(`${Url}/productions?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0]
                setCode(getData.code);
                setDate(getData.date);
                setWarehouseInput(getData.whinput.id);
                setWarehouseInputName(getData.whinput.name);
                setWarehouseOutput(getData.whoutput.id);
                setWarehouseOutputName(getData.whoutput.name);
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
        getProductInput()
    }, [])

    const getProductInput = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/production_input_details/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setProduct(getData)
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getProductOutput()
    }, [])

    const getProductOutput = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/production_output_details/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setProductOutput(getData)
                setIsLoading(false);
            })
    }

    const handleChangeWarehouseInput = (value) => {
        setSelectedWarehouseInput(value);
        setWarehouseInput(value.id);
    };

    const handleChangeWarehouseOutput = (value) => {
        setSelectedWarehouseOutput(value);
        setWarehouseOutput(value.id);
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
            const res = await axios.get(`${Url}/select_stock_warehouses?product_name=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    useEffect(() => {
        const getProductOut = async () => {
            const res = await axios.get(`${Url}/select_stock_warehouses?product_name=${query_out}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataOutput(res.data);
        };

        if (query_out.length === 0 || query_out.length > 2) getProductOut();
    }, [query_out])

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
        },
        {
            title: 'actions',
            dataIndex: 'actions',
            width: '15%',
            align: 'center',
            render:
                (text, record, index) => {
                    if (checked === "input") {
                        return <Checkbox value={record} onChange={ event  => handleCheck(event, 'input')}/>
                    } else if (record) {
                        return <Checkbox value={record} onChange={ event  => handleCheck(event, 'output')}/>
                    }
                }
        },
    ];
    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render(text, record,index) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{index + 1}</div>
                };
            }
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
            render(text, record) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '30%',
            align: 'center',
            editable: true,
            render: (text) => {
                return convertToRupiahTabel(text)
            }
        },
        {
            title: 'Satuan',
            dataIndex: 'unit',
            width: '30%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
    ];
    const convertToRupiahTabel = (angka) => {
        return <>
        {
            < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.' , ',')} />
            
        }
        </>
    }
    const handleSave = (row,type_production) => {
        console.log(row,type_production)
        if (type_production === 'input') {
            const newData = [...product];
            const index = newData.findIndex((item) => row.product_id === item.product_id);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setProduct(newData);
        }else {
            const newData = [...productOutput];
            const index = newData.findIndex((item) => row.product_id === item.product_id);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setProductOutput(newData);
        }
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
                type_production:"input",
                handleSave,
            }),
        };
    });

    const columnOuts = defaultColumns.map((col) => {
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
                type_production:"output",
                handleSave,
            }),
        };
    });

    const handleCheck = (event, param) => {
        
        if (param === "input") {
            var updatedList = [...product];
            // console.log(event.target.checked, param,updatedList);
            if (event.target.checked) {
                updatedList = [...product, event.target.value];
            } else {
                updatedList.splice(product.indexOf(event.target.value), 1);
            }
            setProduct(updatedList);
        } else {
            var updatedListOutput = [...productOutput];
            if (event.target.checked) {
                updatedListOutput = [...productOutput, event.target.value];
            } else {
                updatedListOutput.splice(productOutput.indexOf(event.target.value), 1);
            }
        setProductOutput(updatedListOutput);
        }
    };

    const showBtnModal = (event) => {
        if(event === "input"){
            setModal2Visible(true)
            setChecked("input");
        }
        if(event === "output"){
            setModal2VisibleOutput(true)
            setChecked("output");
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("code", code);
        userData.append("date", date);
        userData.append("warehouse_input", warehouse_input);
        userData.append("warehouse_output", warehouse_output);
        userData.append("notes", notes);
        userData.append("status", "Submitted");
        product.map((p) => {
            userData.append("product_input_id[]", p.product_id);
            userData.append("qty_input[]", p.qty);
        });
        productOutput.map((p) => {
            userData.append("product_output_id[]", p.product_id);
            userData.append("qty_output[]", p.qty);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/productions/${id}`,
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
                navigate("/produksi");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Gagal Ditambahkan Mohon Cek Dahulu..",
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
        userData.append("code", code);
        userData.append("date", date);
        userData.append("warehouse_input", warehouse_input);
        userData.append("warehouse_output", warehouse_output);
        userData.append("notes", notes);
        userData.append("status", "Draft");
        product.map((p) => {
            userData.append("product_input_id[]", p.product_id);
            userData.append("qty_input[]", p.qty);
        });
        productOutput.map((p) => {
            userData.append("product_output_id[]", p.product_id);
            userData.append("qty_output[]", p.qty);
        });

        axios({
            method: "put",
            url: `${Url}/productions/${id}`,
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
                navigate("/produksi");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Gagal Ditambahkan Mohon Cek Dahulu..",
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

    if (loading) {
        return (
            <div></div>
        )
    }

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="p-3 mb-3">
                    <div className="card" style={cardOutline}>
                        <div className="card-header bg-white">
                            <h6 className="title fw-bold">
                                <Button
                                    style={{border: 'none'}}
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => navigate(-1)}
                                />
                                Edit Produksi
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row mb-1">
                                        <label for="code" className="col-sm-4 col-form-label">No Produksi</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" id="code" name="code" defaultValue={code} placeholder="Otomatis" readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label for="date" className="col-sm-4 col-form-label">Tanggal</label>
                                        <div className="col-sm-8">
                                            <input type="date" className="form-control" id="date" name="date" defaultValue={date} onChange={(e) => setDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Input</label>
                                        <div className="col-sm-8">
                                            <AsyncSelect
                                                placeholder="Pilih Gudang Input..."
                                                cacheOptions
                                                defaultOptions
                                                defaultInputValue={warehouseInputName}
                                                value={selectedWarehouseInput}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={loadOptionsWarehouse}
                                                onChange={handleChangeWarehouseInput}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Output</label>
                                        <div className="col-sm-8">
                                            <AsyncSelect
                                                placeholder="Pilih Gudang Output..."
                                                cacheOptions
                                                defaultOptions
                                                defaultInputValue={warehouseOutputName}
                                                value={selectedWarehouseOutput}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={loadOptionsWarehouse}
                                                onChange={handleChangeWarehouseOutput}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row mb-1">
                                        <label for="notes" className="col-sm-4 col-form-label">Catatan</label>
                                        <div className="col-sm-8">
                                            <textarea
                                                className="form-control"
                                                defaultValue={notes}
                                                name="notes" id="notes"
                                                rows="3"
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_status" className="col-sm-4 col-form-label">Status</label>
                                        <div className="col-sm-8">
                                        {status === 'Submitted' ? <Tag color="blue">{toTitleCase(status)}</Tag> : status === 'Draft' ? <Tag color="orange">{toTitleCase(status)}</Tag> : status === 'Done' ? <Tag color="green">{toTitleCase(status)}</Tag> : <Tag color="red">{toTitleCase(status)}</Tag>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3 mb-3">
                    <div className="card" style={cardOutline}>
                        <div className="card-header bg-white">
                            <h6 className="title fw-bold">Bahan Baku</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col text-end me-2">
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        // onClick={() => setModal2Visible(true)}
                                        onClick={ () => showBtnModal("input")}
                                    />
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
                                                        placeholder="Cari Bahan Baku..."
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
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                pagination={false}
                                dataSource={product}
                                columns={columns}
                                onChange={(e) => setProduct(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-3 mb-3">
                    <div className="card" style={cardOutline}>
                        <div className="card-header bg-white">
                            <h6 className="title fw-bold">Hasil Produksi</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col text-end me-2">
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        // onClick={() => setModal2Visible(true)}
                                        onClick={ () => showBtnModal("output")}
                                    />
                                    <Modal
                                        title="Tambah Produk"
                                        centered
                                        visible={modal2VisibleOutput}
                                        onCancel={() => setModal2VisibleOutput(false)}
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
                                                        placeholder="Cari Hasil Produksi..."
                                                        style={{
                                                            width: 400,
                                                        }}
                                                        onChange={(e) => setQueryOut(e.target.value.toLowerCase())}
                                                    />
                                                </div>
                                                <Table
                                                    columns={columnsModal}
                                                    dataSource={getDataOutput}
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
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                pagination={false}
                                dataSource={productOutput}
                                columns={columnOuts}
                                onChange={(e) => setProductOutput(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                    >
                        Update
                    </button>
                    {
                        status != "Submitted" ?
                            <button
                                type="button"
                                className="btn btn-primary rounded m-1"
                                value="Submitted"
                                onChange={(e) => setStatus(e.target.value)}
                                onClick={handleSubmit}
                                width="100px"
                            >
                                Submit
                            </button>
                            : null
                    }
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
        </>
    )
}

export default EditProduction