import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
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

const DetailRetur = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [customer, setCustomer] = useState("");
    const [faktur, setFaktur] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();

    const [getDataFaktur, setGetDataFaktur] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [dataHeader, setDataHeader] = useState([])
    const [salesRetur, setSalesRetur] = useState([])

    const { id } = useParams();
    useEffect(() => {
        getDataRetur();
    }, [])
    const getDataRetur = async () => {
        await axios.get(`${Url}/sales_returns?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data.data[0]
                setDataHeader(getData)
                setGetStatus(getData.status)
                setSalesRetur(getData.sales_return_details)

                // if(getData.sales_return_details[0].currency){

                //     setMataUang(getData.purchase_return_details[0].currency)
                // }
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }




    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_customers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        getNewCodeSales()
    })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_sales_invoices?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataFaktur(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            dataIndex: 'code',
        },
        {
            title: 'Pelanggan',
            dataIndex: 'recipient',
            render: (recipient) => recipient.name,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '15%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Checkbox
                        value={record}
                        onChange={handleCheck}
                    />
                </>
            )
        },
    ];

    const defaultColumns = [
        {
            title: 'No. Faktur',
            dataIndex: 'code',
            width: '15%',
            align: 'center',
            // render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama Produk',
            dataIndex: 'sales_invoice_details',
            render: (faktur) => (
                <>
                    <ReactSelect
                        className="basic-single"
                        placeholder="Pilih Alamat..."
                        classNamePrefix="select"
                        isLoading={isLoading}
                        isSearchable
                        getOptionLabel={(e) => e.product_alias_name}
                        getOptionValue={(e) => e.id}
                        options={faktur}
                        onChange={(e) => setFaktur(e.id)}
                    />
                </>
            ),
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '8%',
            align: 'center',
            editable: true,
            render: (text) => <a>{text}.00</a>,
        },
        {
            title: 'Stn',
            dataIndex: 'sales_invoice_details',
            width: '5%',
            align: 'center',
            render: (delivery_note_details) => delivery_note_details.map(service => service.unit),
        },
        {
            title: 'Harga',
            dataIndex: 'price',
            width: '10%',
            align: 'center',
            editable: true,
            render: (text) => <a>Rp. {text}</a>,
        },
        {
            title: 'Discount (Rp)',
            dataIndex: 'nominal_disc',
            width: '10%',
            align: 'center',
            editable: true,
            render: (text) => <a>Rp. {text}</a>,
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount',
            width: '5%',
            align: 'center',
            editable: true,
            render: (text) => <a>{text} %</a>,
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '10%',
            align: 'center',
            editable: true,
            render: (text) => <a>{text} %</a>,
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
            render:
                (text, record) => {
                    let total = (record.quantity * record.price) - record.nominal_disc;
                    let getPercent = (total * record.discount) / 100;
                    let totalDiscount = total - getPercent;
                    let getPpn = (totalDiscount * record.ppn) / 100;
                    if (checked) {
                        return totalDiscount;
                    } else {
                        return totalDiscount + getPpn;
                    }
                }
        },
    ];
    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(faktur, check_checked);
    };
    const handleSave = (row) => {
        const newData = [...faktur];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setFaktur(newData);
        let check_checked = checked;
        calculate(faktur, check_checked);
    };


    const calculate = (faktur, check_checked) => {
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
        faktur.map((values) => {
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
        var updatedList = [...faktur];
        if (event.target.checked) {
            updatedList = [...faktur, event.target.value];
        } else {
            updatedList.splice(faktur.indexOf(event.target.value), 1);
        }
        setFaktur(updatedList);
    };


    const getNewCodeSales = async () => {
        await axios.get(`${Url}/get_new_sales_order_code?tanggal=${date}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                setGetCode(res.data.data);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        faktur.map((p) => {
            console.log(p);
            userData.append("id_faktur_penjualan", p.id);
            userData.append("id_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_returns`,
        //     data: userData,
        //     headers: {
        //         Accept: "application/json",
        //         Authorization: `Bearer ${auth.token}`,
        //     },
        // })
        //     .then(function (response) {
        //         //handle success
        //         Swal.fire(
        //             "Berhasil Ditambahkan",
        //             ` Masuk dalam list`,
        //             "success"
        //         );
        //         navigate("/pesanan");
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             console.log("err.response ", err.response);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 text: err.response.data.error.nama,
        //             });
        //         } else if (err.request) {
        //             console.log("err.request ", err.request);
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         } else if (err.message) {
        //             // do something other than the other two
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         }
        //     });
    };

    const handleDraft = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        faktur.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("id_product[]", p.product_id);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.delivery_note_details.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_returns`,
        //     data: userData,
        //     headers: {
        //         Accept: "application/json",
        //         Authorization: `Bearer ${auth.token}`,
        //     },
        // })
        //     .then(function (response) {
        //         //handle success
        //         Swal.fire(
        //             "Berhasil Ditambahkan",
        //             ` Masuk dalam list`,
        //             "success"
        //         );
        //         navigate("/pesanan");
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             console.log("err.response ", err.response);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 text: err.response.data.error.nama,
        //             });
        //         } else if (err.request) {
        //             console.log("err.request ", err.request);
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         } else if (err.message) {
        //             // do something other than the other two
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         }
        //     });
    };

    return (
        <>
    
            <form className="p-3 mb-3 bg-body rounded">
                {/* <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Buat Retur</h3>
                </div> */}
                     <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Retur Penjualan"
            ></PageHeader>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                    value={dataHeader.date}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setReferensi(e.target.value)}
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
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Faktur</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Faktur"
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
                                width={600}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Faktur..."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={getDataFaktur}
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
                        dataSource={faktur}
                        columns={columns}
                        onChange={(e) => setFaktur(e.target.value)}
                    />
                </div>
                <div className="row p-0">
                    <div className="col ms-5">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" onChange={handleChange} />
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk Pajak
                            </label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={subTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(Total Qty X harga) per item + ... '
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={grandTotalDiscount}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(total disc/item) ditotal semua'
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={totalPpn}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='ppn per item di total semua row'
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={grandTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='subtotal - diskon + ppn'
                                />
                            </div>
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

export default DetailRetur