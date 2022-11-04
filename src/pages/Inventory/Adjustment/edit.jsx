import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Skeleton, Space, Table, Tag } from 'antd'
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
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

const EditAdjustment = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);

    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const [status, setStatus] = useState("");

    const [notes, setAdjustmentNotes] = useState('');
    const [adjustment_date, setAdjustmentDate] = useState(null);
    const [warehouse_id, setWarehouse] = useState([]);
    const [warehouseName, setWarehouseName] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const [getDataProduct, setGetDataProduct] = useState([]);
    const [getAdjustment, setGetAdjustment] = useState([])
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [tmpCentang, setTmpCentang] = useState([]);
    const [jumlah, setJumlah] = useState([])

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
                setGetAdjustment(getData);
                setGetCode(getData.code);
                setAdjustmentDate(getData.adjustment_date);
                setAdjustmentNotes(getData.notes || "");
                setWarehouse(getData.warehouse_id);
                setWarehouseName(getData.warehouse_name);
                setStatus(getData.status);
                // setProduct(getData.adjustmentdetails);
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    useEffect(() => {
        getAdjustmentDetails()
    }, [])

    const getAdjustmentDetails = async (params = {}) => {
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
        return fetch(`${Url}/select_warehouses?limit=10&nama=${inputValue}&tipe=internal`, {
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
            let tmp = []
            for (let x = 0; x < product.length; x++) {
                for (let i = 0; i < res.data.length; i++) {

                    if (res.data[i].product_id == product[x].product_id) {
                        tmp.push({
                            detail: res.data[i],
                            statusCek: true
                        });
                    }
                    else {
                        tmp.push({
                            detail: res.data[i],
                            statusCek: false
                        });
                    }

                }

            }
            setGetDataProduct(tmp)
        };
        if (query.length >= 0) getProduct();
    }, [query, warehouse_id, getAdjustment])

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
            render: (text) => {
                return <>{text.toString().replace('.', ',')}</>

            }
        },
        {
            title: 'actions',
            dataIndex: 'actions',
            width: '15%',
            align: 'center',
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
            title: 'Qty Sistem',
            dataIndex: 'qty_before',
            width: '30%',
            align: 'center',
            // render: (text) => {
            //     return <>{text.toString().replace('.', ',')}</>

            // }
        },
        {
            title: 'Qty saat ini',
            dataIndex: 'qty_after',
            width: '30%',
            align: 'center',
            editable: true,
            render: (text) => {
                return convertToRupiahTabel(text)
            }
        },
    ];

    const columnDataProduct =
        [...getDataProduct.map((item, i) => ({
            product_name: item.detail.product_name,
            qty_before: item.detail.qty_before,
            notes: item.detail.notes,
            actions:
                <>
                    <Checkbox
                        value={item}
                        checked={item.statusCek}
                        onChange={(e) => handleCheck(e, i)}
                    />
                </>
        }))

        ]
    const checkWarehouse = () => {
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

    const convertToRupiahTabel = (angka) => {
        return <>
            {
                < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} />

            }
        </>
    }

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

    const handleCheck = (event, index) => {
        let data = event.target.value

        let tmpDataBaru = []
        let tmpJumlah = [...jumlah]
        let tmpDataCentang = [...tmpCentang]
        for (let i = 0; i < getDataProduct.length; i++) {
            if (i == index) {
                tmpDataBaru.push({
                    detail: getDataProduct[i].detail,
                    statusCek: !getDataProduct[i].statusCek
                })
                // tmpDataCentang.push(tmpDataBaru[i].detail.product_id)

            }
            else {
                tmpDataBaru.push(getDataProduct[i])
            }


            if (tmpDataBaru[i].statusCek == true) {
                tmpDataCentang.push(tmpDataBaru[i].detail.product_id)
            }
            else {
                let index = tmpDataCentang.indexOf(tmpDataBaru[i].detail.product_id);
                if (index >= 0) {
                    tmpDataCentang.splice(index, 1)
                }
                // tmpDataCentang.push('')
            }
        }
        let unikTmpCentang = [...new Set(tmpDataCentang)]
        setTmpCentang(unikTmpCentang)
        setGetDataProduct(tmpDataBaru)
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
        setJumlah(tmpJumlah)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("code", getCode);
        userData.append("adjustment_date", adjustment_date);
        userData.append("warehouse_id", warehouse_id);
        userData.append("notes", notes);
        userData.append("status", "Done");
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
        userData.append("code", getCode);
        userData.append("adjustment_date", adjustment_date);
        userData.append("warehouse_id", warehouse_id);
        userData.append("notes", notes);
        userData.append("status", "Draft");
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
            <div className="p-3 mb-3 bg-body rounded">
                <div className="p-3 mb-3">
                    <div className="card" style={cardOutline}>
                        <div className="card-header bg-white">
                            <h6 className="title fw-bold">
                                <Button
                                    style={{ border: 'none' }}
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => navigate(-1)}
                                />
                                Edit Penyesuaian Stok
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_no" className="col-sm-4 col-form-label">No</label>
                                        <div className="col-sm-8">
                                            <input type="text" className="form-control" id="adjustment_no" name="adjustment_no" value={getCode} placeholder="Otomatis" readOnly />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_date" className="col-sm-4 col-form-label">Tanggal</label>
                                        <div className="col-sm-8">
                                            <input type="date" className="form-control" id="adjustment_date" name="adjustment_date" value={adjustment_date} onChange={(e) => setAdjustmentDate(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang</label>
                                        <div className="col-sm-8">
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
                                        <label for="adjustment_status" className="col-sm-4 col-form-label">Status</label>
                                        <div className="col-sm-8">
                                            {status === 'Submitted' ? <Tag color="blue">{toTitleCase(status)}</Tag> : status === 'Draft' ? <Tag color="orange">{toTitleCase(status)}</Tag> : status === 'Done' ? <Tag color="green">{toTitleCase(status)}</Tag> : <Tag color="red">{toTitleCase(status)}</Tag>}
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label for="adjustment_notes" className="col-sm-4 col-form-label">Catatan</label>
                                        <div className="col-sm-8">
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
                                                    dataSource={columnDataProduct}
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
                        status != "Done" ?
                            <button
                                type="button"
                                className="btn btn-primary rounded m-1"
                                value="Done"
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
            </div>
        </>
    )
}

export default EditAdjustment