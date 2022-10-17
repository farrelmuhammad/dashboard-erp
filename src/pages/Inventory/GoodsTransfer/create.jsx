import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CreateGoodsRequest = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);

    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');

    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(null);
    const [type, setType] = useState('send');
    const [warehouse_id, setWarehouseId] = useState([]);
    const [tally_sheet_id, setTallySheetId] = useState([]);
    const [goods_transfer_id, setGoodsTransfer] = useState([]);
    const [reference_no, setReferenceNo] = useState([]);
    const [warehouse_source, setWarehouseSource] = useState([]);
    const [warehouse_destination, setWarehouseDestination] = useState([]);

    const [selectedWarehouseSource, setSelectedWarehouseSource] = useState(null);
    const [selectedWarehouseDestination, setSelectedWarehouseDestination] = useState(null);
    const [selectedTallySheet, setSelectedTallySheet] = useState(null);
    const [selectedGoodsTransfer, setSelectedGoodsTransfer] = useState(null);

    const navigate = useNavigate();

    const [getDataDetail, setDataDetailWindow] = useState();
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

    const handleChangeTallySheet = (value) => {
        setSelectedTallySheet(value);
        setReferenceNo(value.code);
        setWarehouseId(value.warehouse_id);
        setTallySheetId(value.id);
        var updatedList = [];
        setProduct(updatedList);
    };

    const handleChangeGoodsTransfer = (value) => {
        setSelectedGoodsTransfer(value);
        setReferenceNo(value.code);
        setGoodsTransfer(value.id);
        var updatedList = [];
        setProduct(updatedList);
    };

    const handleChangeWarehouseSource = (value) => {
        setSelectedWarehouseSource(value);
        setWarehouseSource(value.id);
    };

    const handleChangeWarehouseDestination = (value) => {
        setSelectedWarehouseDestination(value);
        setWarehouseDestination(value.id);
    };

    // load options warehouse using API call
    const loadOptionsWarehouse = (inputValue) => {
        return fetch(`${Url}/select_warehouses?limit=10&nama=${inputValue}&tipe=internal`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // load options tally sheet using API call
    const loadOptionsTallySheet = (inputValue) => {
        return fetch(`${Url}/select_tally_sheet_tf?limit=10&kode=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // load options Goods Transfer using API call
    const loadOptionsGoodsTransfer = (inputValue) => {
        return fetch(`${Url}/select_goodstransfers?limit=10&code=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        if(type === 'send'){
            const getTallySheet = async () => {
                const res = await axios.get(`${Url}/select_stock_referece_tally_sheets?product_name=${query}&warehouse_id=${warehouse_id}&tally_sheet_id=${tally_sheet_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                })
                setDataDetailWindow(res.data);
            };
            if (query.length === 0 || query.length > 2) getTallySheet();
        }
        if (type === 'receive'){
            const getGoodsTransfer = async () => {
                const res = await axios.get(`${Url}/select_goods_transfer_details?product_name=${query}&goods_transfer_id=${goods_transfer_id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                })
                setDataDetailWindow(res.data);
            };
            if (query.length === 0 || query.length > 2) getGoodsTransfer();
        }
    }, [query,selectedTallySheet,selectedGoodsTransfer]);

    useEffect(() => {
        if (type == "send") {
            setType("send");
            document.getElementById('reference_tally_sheet').style.display = "flex";

            document.getElementById('reference_transfer_gudang').style.display = "none";
            setSelectedGoodsTransfer("");
            setReferenceNo();
            setGoodsTransfer();
            var updatedList = [];
            setProduct(updatedList);
        }
        if(type == "receive"){
            setType("receive");
            document.getElementById('reference_tally_sheet').style.display = "none";

            document.getElementById('reference_transfer_gudang').style.display = "flex";
            var updatedList = [];
            setProduct(updatedList);
            setSelectedTallySheet("");
            setReferenceNo();
            setWarehouseId();
            setTallySheetId();
        }
    }, [type]);

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
        },
        {
            title: 'Qty',
            dataIndex: 'transfer_qty',
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
            title: 'Stok Saat Ini',
            dataIndex: 'current_qty',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Qty Transfer',
            dataIndex: 'transfer_qty',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Satuan',
            dataIndex: 'unit',
            width: '30%',
            align: 'center',
        },
    ];
    const checkWarehouse = () => {
        // if (warehouse_source == "") {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Pilih Gudang Asal Terlebih Dahulu !",
        //     });
        // } else {
        //     setModal2Visible(true)
        // }
        setModal2Visible(true)
    };
    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        let check_checked = checked;
        calculate(product, check_checked);
    };
    const calculate = (product, check_checked) => {
        let subTotal = 0;
        let totalDiscount = 0;
        let totalNominalDiscount = 0;
        let grandTotalDiscount = 0;
        let getPpnDiscount = 0;
        let allTotalDiscount = 0;
        let totalPpn = 0;
        let grandTotal = 0;
        let getPpn = 0;
        let total = 0;
        product.map((values) => {
            if (check_checked) {
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                subTotal += ((total - getPpnDiscount) * 100) / (100 + values.ppn);
                allTotalDiscount += total - getPpnDiscount;
                totalPpn = allTotalDiscount - subTotal;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            } else {
                subTotal += (values.quantity * values.price);
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                allTotalDiscount = total - getPpnDiscount;
                getPpn = (allTotalDiscount * values.ppn) / 100;
                totalPpn += getPpn;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            }
        })
    }
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
        console.log(event.target.checked,updatedList);
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
        userData.append("date", date);
        userData.append("reference_no", reference_no);
        userData.append("warehouse_source", warehouse_source);
        userData.append("warehouse_destination", warehouse_destination);
        userData.append("type_process", type);
        userData.append("notes", notes);
        userData.append("status", "publish");
        product.map((p) => {
            console.log(p);
            userData.append("product_id[]", p.product_id);
            userData.append("current_qty[]", p.current_qty);
            userData.append("transfer_qty[]", p.transfer_qty);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/goodstransfers`,
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
                navigate("/goodstransfer");
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
        console.log(type)
        e.preventDefault();
        const userData = new FormData();
        userData.append("date", date);
        userData.append("reference_no", reference_no);
        userData.append("warehouse_source", warehouse_source);
        userData.append("warehouse_destination", warehouse_destination);
        userData.append("type_process", type);
        userData.append("notes", notes);
        userData.append("status", "draft");
        product.map((p) => {
            console.log(p);
            userData.append("product_id[]", p.product_id);
            userData.append("current_qty[]", p.current_qty);
            userData.append("transfer_qty[]", p.transfer_qty);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/goodstransfers`,
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
                navigate("/goodstransfer");
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
                <div className="p-3 mb-3">
                    <div className="card" style={cardOutline}>
                        <div className="card-header bg-white">
                            <h6 className="title fw-bold">Buat Transfer Barang</h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row mb-1">
                                        <label for="code" className="col-sm-4 col-form-label">No</label>
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
                                        <label for="type" className="col-sm-4 col-form-label">Tipe</label>
                                        <div className="col-sm-8">
                                            <select onChange={e => setType(e.target.value)} id="type" name="type" className="form-select">
                                                {/* <option>Pilih Tipe</option> */}
                                                <option value="send">Kirim</option>
                                                <option value="receive">Terima</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1" id="reference_tally_sheet">
                                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No Referensi</label>
                                        <div className="col-sm-8">
                                            <AsyncSelect
                                                placeholder="Pilih Tally Sheet..."
                                                cacheOptions
                                                defaultOptions
                                                value={selectedTallySheet}
                                                getOptionLabel={(e) => e.code}
                                                getOptionValue={(e) => e.code}
                                                loadOptions={loadOptionsTallySheet}
                                                onChange={handleChangeTallySheet}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1" style={{ display: "none" }} id="reference_transfer_gudang">
                                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No Referensi</label>
                                        <div className="col-sm-8">
                                            <AsyncSelect
                                                placeholder="Pilih Transfer Barang..."
                                                cacheOptions
                                                defaultOptions
                                                value={selectedGoodsTransfer}
                                                getOptionLabel={(e) => e.code}
                                                getOptionValue={(e) => e.code}
                                                loadOptions={loadOptionsGoodsTransfer}
                                                onChange={handleChangeGoodsTransfer}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row mb-1">
                                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Asal</label>
                                        <div className="col-sm-8">
                                            <AsyncSelect
                                                placeholder="Pilih Gudang Asal..."
                                                cacheOptions
                                                defaultOptions
                                                value={selectedWarehouseSource}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={loadOptionsWarehouse}
                                                onChange={handleChangeWarehouseSource}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row mb-1">
                                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Tujuan</label>
                                        <div className="col-sm-8">
                                            <AsyncSelect
                                                placeholder="Pilih Gudang Tujuan..."
                                                cacheOptions
                                                defaultOptions
                                                value={selectedWarehouseDestination}
                                                getOptionLabel={(e) => e.name}
                                                getOptionValue={(e) => e.id}
                                                loadOptions={loadOptionsWarehouse}
                                                onChange={handleChangeWarehouseDestination}
                                            />
                                        </div>
                                    </div>
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
                                            <h3 className="badge bg-danger text-center m-1">
                                                Draft
                                            </h3>
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
                                                    dataSource={getDataDetail}
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

export default CreateGoodsRequest