import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined,CloseOutlined , ArrowLeftOutlined } from '@ant-design/icons'
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
            handleSave({ ...record, ...values }, type_production);
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

const CreateProduction = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);

    const [product, setProduct] = useState([]);
    const [productOutput, setProductOutput] = useState([]);
    const [query, setQuery] = useState("");
    const [query_out, setQueryOut] = useState("");
    const [checked, setChecked] = useState("");

    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(null);
    const [warehouse_input, setWarehouseInput] = useState([]);
    const [warehouse_output, setWarehouseOutput] = useState([]);
    const [selectedWarehouseInput, setSelectedWarehouseInput] = useState(null);
    const [selectedWarehouseOutput, setSelectedWarehouseOutput] = useState(null);

    const navigate = useNavigate();

    const [getDataProduct, setGetDataProduct] = useState();
    const [getDataOutput, setGetDataOutput] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [tmpCentangInput, setTmpCentangInput] = useState([]);
    const [jumlahInput, setJumlahInput] = useState([])
    const [tmpCentangOutput, setTmpCentangOutput] = useState([]);
    const [jumlahOutput, setJumlahOutput] = useState([])

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal2VisibleOutput, setModal2VisibleOutput] = useState(false);

    const cardOutline = {
        borderTop: '3px solid #007bff',
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
            const res = await axios.get(`${Url}/select_stock_warehouses?product_name=${query}&warehouse_id=${warehouse_input}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentangInput.indexOf(res.data[i].product_id) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
            }
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentangInput.indexOf(res.data[i].product_id) < 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: false
                    });
                }

            }

            setGetDataProduct(tmp);
        };

        if (query.length >= 0) getProduct();
    }, [query, warehouse_input])

    useEffect(() => {
        const getProductOut = async () => {
            const res = await axios.get(`${Url}/select_stock_warehouses?product_name=${query_out}&warehouse_id=${warehouse_output}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentangOutput.indexOf(res.data[i].product_id) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
            }
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentangOutput.indexOf(res.data[i].product_id) < 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: false
                    });
                }

            }

            setGetDataOutput(tmp);
            // console.log(tmp)

            // let tmp = []
            // for (let i = 0; i < res.data.length; i++) {
            //     if (tmpCentangOutput.indexOf(res.data[i].product_id) >= 0) {
            //         tmp.push({
            //             detail: res.data[i],
            //             statusCek: true
            //         });
            //     }
            //     else {
            //         tmp.push({
            //             detail: res.data[i],
            //             statusCek: false
            //         });
            //     }


            // }
            // setGetDataOutput(tmp);
        };

        if (query_out.length >= 0) getProductOut();
    }, [query_out, warehouse_output])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
            render: (_, record) => {
                return <>{record.detail.product_name}</>
            }
        },
        {
            title: 'Stok',
            dataIndex: 'qty',
            width: '15%',
            align: 'center',
            render: (_, record) => {
                return <>{record.detail.qty.toString().replace('.', ',')}</>

            }
        },
        {
            title: 'actions',
            dataIndex: 'actions',
            width: '15%',
            align: 'center',
            render:
                (_, record, index) => {
                    if (checked === "input") {
                        return <Checkbox value={record} onChange={event => handleCheck(event, index, 'input')} />
                    } else if (record) {
                        return <Checkbox value={record} onChange={event => handleCheck(event, index, 'output')} />
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
            render(text, record, index) {
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
                < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} />

            }
        </>
    }
    const handleSave = (row, type_production) => {
        console.log(row, type_production)
        if (type_production === 'input') {
            const newData = [...product];
            const index = newData.findIndex((item) => row.product_id === item.product_id);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setProduct(newData);
        } else {
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
                type_production: "input",
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
                type_production: "output",
                handleSave,
            }),
        };
    });

    const handleCheck = (event, index, param) => {

        if (param === "input") {
            let data = event.target.value

            let tmpDataBaru = []
            let tmpJumlah = [...jumlahInput]
            let tmpDataCentang = [...tmpCentangInput]
            for (let i = 0; i < getDataProduct.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: !getDataProduct[i].statusCek
                    })
                    if (!tmpDataBaru[i].statusCek) {
                        let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.product_id);
                        tmpDataCentang.splice(idxHapus, 1)
                    }
                    else if (tmpDataBaru[i].statusCek == true) {
                        tmpDataCentang.push(tmpDataBaru[i].detail.product_id)
                    }
                }
                else {
                    tmpDataBaru.push(getDataProduct[i])
                }
            }
            let unikTmpCentang = [...new Set(tmpDataCentang)]
            setTmpCentangInput(unikTmpCentang)
            setGetDataProduct(tmpDataBaru)
            var updatedList = [...product];
            if (tmpDataBaru[index].statusCek) {
                updatedList = [...product, data.detail];

                for (let i = 0; i < updatedList.length; i++) {
                    if (i >= product.length) {
                        tmpJumlah.push(0)
                    }

                }
                console.log(tmpJumlah)
            } else {
                for (let i = 0; i < updatedList.length; i++) {
                    if (updatedList[i].product_id == data.detail.product_id) {
                        updatedList.splice(i, 1);
                        tmpJumlah.splice(i, 1)
                    }
                }
            }
            setProduct(updatedList);
            setJumlahInput(tmpJumlah)
        } else {
            let data = event.target.value

            let tmpDataBaru = []
            let tmpJumlah = [...jumlahOutput]
            let tmpDataCentang = [...tmpCentangOutput]
            for (let i = 0; i < getDataOutput.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataOutput[i].detail,
                        statusCek: !getDataOutput[i].statusCek
                    })
                    if (!tmpDataBaru[i].statusCek) {
                        let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.product_id);
                        tmpDataCentang.splice(idxHapus, 1)
                    }
                    else if (tmpDataBaru[i].statusCek == true) {
                        tmpDataCentang.push(tmpDataBaru[i].detail.product_id)
                    }
                }
                else {
                    tmpDataBaru.push(getDataOutput[i])
                }
            }
            let unikTmpCentang = [...new Set(tmpDataCentang)]
            setTmpCentangOutput(unikTmpCentang)
            setGetDataOutput(tmpDataBaru)
            var updatedListOutput = [...productOutput];
            if (tmpDataBaru[index].statusCek) {
                updatedListOutput = [...productOutput, data.detail];

                for (let i = 0; i < updatedListOutput.length; i++) {
                    if (i >= productOutput.length) {
                        tmpJumlah.push(0)
                    }

                }
                console.log(tmpJumlah)
            } else {
                for (let i = 0; i < updatedListOutput.length; i++) {
                    if (updatedListOutput[i].product_id == data.detail.product_id) {
                        updatedListOutput.splice(i, 1);
                        tmpJumlah.splice(i, 1)
                    }
                }
            }
            setProductOutput(updatedListOutput);
            setJumlahOutput(tmpJumlah)
        }
    };

    const showBtnModal = (event) => {
        if (event === "input") {
            setModal2Visible(true)
            setChecked("input");
        }
        if (event === "output") {
            setModal2VisibleOutput(true)
            setChecked("output");
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
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
            method: "post",
            url: `${Url}/productions`,
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
        const userData = new FormData();
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
            method: "post",
            url: `${Url}/productions`,
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

    return (
        <>
            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Buat Produksi"
            >
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row mb-1">
                            <label for="code" className="col-sm-4 col-form-label">No Produksi</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="code" name="code" placeholder="Otomatis" readOnly />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="date" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-8">
                                <input type="date" className="form-control" id="date" name="date" onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Bahan Baku</label>
                            <div className="col-sm-8">
                                <AsyncSelect
                                    placeholder="Pilih Gudang Bahan Baku..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedWarehouseInput}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsWarehouse}
                                    onChange={handleChangeWarehouseInput}
                                />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Hasil Produksi</label>
                            <div className="col-sm-8">
                                <AsyncSelect
                                    placeholder="Pilih Gudang Hasil Produksi..."
                                    cacheOptions
                                    defaultOptions
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
                                    name="notes" id="notes"
                                    rows="3"
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="adjustment_status" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                                <Tag color="orange">{toTitleCase("Draft")}</Tag>
                            </div>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Bahan Baku"
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        // onClick={() => setModal2Visible(true)}
                        onClick={() => showBtnModal("input")}
                    />,
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
                ]}
            >
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={product}
                    columns={columns}
                    onChange={(e) => setProduct(e.target.value)}
                />
            </PageHeader>

            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Hasil Produksi"
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        // onClick={() => setModal2Visible(true)}
                        onClick={() => showBtnModal("output")}
                    />,
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
                ]}
            >
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={productOutput}
                    columns={columnOuts}
                    onChange={(e) => setProductOutput(e.target.value)}
                />
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2" role="group" aria-label="Basic mixed styles example">
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </PageHeader>
        </>
    )
}

export default CreateProduction