import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';

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
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} step="0.01" defaultValue={1} />
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

const EditAdjustment = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);

    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');

    const [notes, setAdjustmentNotes] = useState('');
    const [adjustment_date, setAdjustmentDate] = useState(null);
    const [warehouse_id, setWarehouse] = useState([]);
    const [warehouseName, setWarehouseName] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const [getDataProduct, setGetDataProduct] = useState();
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const cardOutline = {
        borderTop: '3px solid #007bff',
    }

    useEffect(() => {
      getAdjustmentById()
    }, [])
  
    const getAdjustmentById = async (e) => {
        await axios.get(`${Url}/adjustments?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                setGetCode(getData.code);
                setAdjustmentDate(getData.adjustment_date);
                setAdjustmentNotes(getData.notes);
                setWarehouse(getData.warehouse_id);
                setWarehouseName(getData.warehouse_name);
                // setProduct(getData.adjustmentdetails);
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    useEffect(() => {
        getGoodsRequestDetail()
    }, [])

    const getGoodsRequestDetail = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/adjustment_details/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data;
                setProduct(getData);
                setIsLoading(false);
            })
    }

    const handleChangeWarehouse = (value) => {
        setSelectedWarehouse(value);
        setWarehouse(value.id);
    };
    // load options using API call
    const loadOptionsWarehouse = (inputValue) => {
        return fetch(`${Url}/select_warehouses?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_stock_warehouses?product_name=${query}&warehouse_id=${warehouse_id}`, {
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
            dataIndex: 'qty_before',
            width: '15%',
            align: 'center',
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
            title: 'QTY Sistem',
            dataIndex: 'qty_before',
            width: '30%',
            align: 'center',
        },
        {
            title: 'Qty saat ini',
            dataIndex: 'qty_after',
            width: '30%',
            align: 'center',
            editable: true,
        },
    ];
    const checkWarehouse = () => {
        // var updatedList = [...product];
        // updatedList = []
        // updatedList.splice(product.indexOf(0), 1);
        // setProduct(updatedList);
        if (warehouse_id == "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Pilih Gudang Terlebih Dahulu !",
            });
        } else {
            setModal2Visible(true)
        }
    };
    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
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
        console.log(product.indexOf(event.target.value))
        setProduct(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("adjustment_date", adjustment_date);
        userData.append("warehouse_id", warehouse_id);
        userData.append("notes", notes);
        userData.append("status", "publish");
        product.map((p) => {
            console.log(p);
            userData.append("product_id[]", p.product_id);
            userData.append("qty_before[]", p.qty_before);
            userData.append("qty_after[]", p.qty_after);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/adjustments/${id}`,
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
                navigate("/adjustment");
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
        userData.append("adjustment_date", adjustment_date);
        userData.append("warehouse_id", warehouse_id);
        userData.append("notes", notes);
        userData.append("status", "draft");
        product.map((p) => {
            userData.append("product_id[]", p.product_id);
            userData.append("qty_before[]", p.qty_before);
            userData.append("qty_after[]", p.qty_after);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/adjustments/${id}`,
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
                navigate("/adjustment");
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
                            <h6 className="title fw-bold">Buat Penyesuaian Stok</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_no" className="col-sm-2 col-form-label">No</label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="adjustment_no" name="adjustment_no" value={getCode} placeholder="Otomatis" readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_date" className="col-sm-2 col-form-label">Tanggal</label>
                                        <div className="col-sm-10">
                                            <input type="date" className="form-control" id="adjustment_date" name="adjustment_date" value={adjustment_date} onChange={(e) => setAdjustmentDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Gudang</label>
                                        <div className="col-sm-10">
                                            <AsyncSelect
                                                placeholder="Pilih Gudang..."
                                                cacheOptions
                                                defaultOptions
                                                defaultInputValue={warehouseName}
                                                value={selectedWarehouse}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={loadOptionsWarehouse}
                                                onChange={handleChangeWarehouse}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_status" className="col-sm-2 col-form-label">Status</label>
                                        <div className="col-sm-10">
                                            <h3 className="badge bg-danger text-center m-1">
                                                Draft
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_notes" className="col-sm-2 col-form-label">Catatan</label>
                                        <div className="col-sm-10">
                                            <textarea
                                                className="form-control"
                                                name="adjustment_notes" id="adjustment_notes"
                                                rows="4"
                                                value={notes}
                                                onChange={(e) => setAdjustmentNotes(e.target.value)}
                                            />
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
                            <h6 className="title fw-bold">Daftar Produk</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col text-end me-2">
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        // onClick={() => setModal2Visible(true)}
                                        onClick={checkWarehouse}
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
                                dataSource={product}
                                columns={columns}
                                onChange={(e) => setProduct(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
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
            </form>
        </>
    )
}

export default EditAdjustment