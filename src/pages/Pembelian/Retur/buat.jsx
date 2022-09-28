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

const BuatReturPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [code, setCode] = useState('');
    const [fakturType, setFakturType] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState("");
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [source, setSource] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const [grup, setGrup] = useState("Lokal")
    const [impor, setImpor] = useState(false);

    const { id } = useParams();

    //state return data from database

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [term, setTerm] = useState();
    const [muatan, setMuatan] = useState();
    const [ctn, setCtn] = useState();
    const [alamat, setAlamat] = useState();
    const [kontainer, setKontainer] = useState();
    const [referensi, setReferensi] = useState()

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
        setAddress(value.customer_addresses)
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_suppliers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        // getSalesOrderDetails()
        getCodeFaktur()
    })

    useEffect(() => {
        if (grup == "Impor") {
            setImpor(true);
        }
        else {
            setImpor(false);
        }

    }, [grup])

    const getCodeFaktur = async () => {
        await axios.get(`${Url}/get_new_standard_sales_invoice_code?tanggal=${date}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                setCode(res.data.data);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_delivery_notes?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
            // console.log(res.data.map(d => d.id))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'code',
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
                    // defaultChecked={record[getProduct]}
                    />
                </>
            )
        },
    ];

    const defaultColumns = [
        {
            title: 'No.Transaksi',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama Produk',
            dataIndex: 'delivery_note_details',
            render: (delivery_note_details) => delivery_note_details.map(service => service.product_alias_name).join(),
        },
        {
            title: 'Qty',
            dataIndex: 'delivery_note_details',
            width: '10%',
            align: 'center',
            render: (delivery_note_details) => delivery_note_details.map(service => service.quantity).join(),
            // editable: true,
        },
        {
            title: 'Stn',
            dataIndex: 'delivery_note_details',
            width: '5%',
            align: 'center',
            render: (delivery_note_details) => delivery_note_details.map(service => service.unit).splice(1, 1),
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
            title: 'Discount',
            dataIndex: 'nominal_disc',
            width: '10%',
            align: 'center',
            editable: true,
            render: (text) => <a>Rp. {text}</a>,
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

    const columAkun = [
        {
            title: 'No.Akun',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Deskripsi',
            dataIndex: 'delivery_note_details',
            render: (delivery_note_details) => delivery_note_details.map(service => service.product_alias_name).join(),
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


    // console.log(product)

    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(product, check_checked);
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
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
        setSource(updatedList.map(p => p.delivery_note_details))
        console.log(updatedList.map(p => p.delivery_note_details.map(prod => prod)))
    };

    // const getSalesOrderDetails = async () => {
    //     await axios.get(`${Url}/sales_order_details/${id}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     })
    //         .then((res) => {
    //             const getData = res.data.data
    //             setGetProduct(getData);
    //             console.log(getData)
    //         })
    //         .catch((err) => {
    //             // Jika Gagal
    //             console.log(err);
    //         });
    // }

    // console.log(product.map(p => p.delivery_note_details));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("tipe", fakturType);
        userData.append("penerima", customer);
        userData.append("catatan", description);
        userData.append("alamat_penerima", address);
        userData.append("status", "Submitted");
        // product.map((p) => {
        //     console.log(p);
        //     userData.append("nama_alias_produk[]", p.alias_name);
        //     userData.append("kuantitas[]", p.quantity);
        //     userData.append("satuan[]", p.unit);
        //     userData.append("harga[]", p.price);
        //     userData.append("persentase_diskon[]", p.discount);
        //     userData.append("diskon_tetap[]", p.nominal_disc);
        //     userData.append("ppn[]", p.ppn);
        // });
        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_invoices`,
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
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("tipe", fakturType);
        userData.append("penerima", customer);
        userData.append("catatan", description);
        userData.append("alamat_penerima", address);
        userData.append("status", "Draft");
        // product.map((p) => {
        //     console.log(p);
        //     userData.append("nama_alias_produk[]", p.alias_name);
        //     userData.append("kuantitas[]", p.quantity);
        //     userData.append("satuan[]", p.unit);
        //     userData.append("harga[]", p.price);
        //     userData.append("persentase_diskon[]", p.discount);
        //     userData.append("diskon_tetap[]", p.nominal_disc);
        //     userData.append("ppn[]", p.ppn);
        // });
        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_invoices`,
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
    const TableData =
        [
            {
                id: 24,
                code: "BM220803-SJ001",
                date: "2022-08-03",
                customer_id: 2,
                customer_address_id: 3,
                recipient: 1,
                recipient_address: 1,
                vehicle: "sadas",
                sender: "asda",
                notes: "asdasd",
                status: "Submitted",
                is_delivered: 1,
                sales_invoice_id: null,
                drafted_by: 2,
                last_edited_by: 2,
                last_edited_at: "2022-08-19 15:33:49",
                submitted_by: 2,
                submitted_at: "2022-08-19 15:33:49",
                delivered_by: 2,
                delivered_at: "2022-08-22 16:24:58",
                done_by: null,
                done_at: null,
                created_at: "2022-08-19T08:33:49.000000Z",
                updated_at: "2022-08-22T09:24:58.000000Z",
                delivery_note_details: [
                    {
                        id: 1,
                        delivery_note_id: 24,
                        tally_sheet_id: 8,
                        sales_order_id: 1,
                        product_id: 3,
                        product_alias_name: "Bagian 1 Grade 1 Merk 2",
                        product_name: "Bagian 1 Grade 1 IW Tipe 1 Merk 2",
                        quantity: 1,
                        unit: "kg",
                        returned: 0,
                        created_at: "2022-08-19T08:33:49.000000Z",
                        updated_at: "2022-08-19T08:33:49.000000Z"
                    },
                    {
                        id: 2,
                        delivery_note_id: 24,
                        tally_sheet_id: 9,
                        sales_order_id: 1,
                        product_id: 3,
                        product_alias_name: "Bagian 1 Grade 1 Merk 2",
                        product_name: "Bagian 1 Grade 1 IW Tipe 1 Merk 2",
                        quantity: 1,
                        unit: "kg",
                        returned: 0,
                        created_at: "2022-08-19T08:33:49.000000Z",
                        updated_at: "2022-08-19T08:33:49.000000Z"
                    }
                ],
                customer: {
                    id: 2,
                    code: "CUS-00002",
                    name: "Pelanggan 2",
                    business_entity: "PT",
                    phone_number: "2",
                    email: "E2",
                    npwp: "2",
                    term: 2,
                    discount: 2,
                    status: "Active",
                    created_at: "2022-08-15T04:22:12.000000Z",
                    updated_at: "2022-08-15T04:22:12.000000Z"
                },
            },
            {
                id: 27,
                code: "BM220802-SJ001",
                date: "2022-08-02",
                customer_id: 2,
                customer_address_id: 3,
                recipient: null,
                recipient_address: null,
                vehicle: "asdasd",
                sender: "asda",
                notes: "adad",
                status: "Submitted",
                is_delivered: 0,
                sales_invoice_id: null,
                drafted_by: 2,
                last_edited_by: 2,
                last_edited_at: "2022-08-19 15:35:25",
                submitted_by: 2,
                submitted_at: "2022-08-19 15:35:25",
                delivered_by: null,
                delivered_at: null,
                done_by: null,
                done_at: null,
                created_at: "2022-08-19T08:35:25.000000Z",
                updated_at: "2022-08-19T08:35:25.000000Z",
                delivery_note_details: [
                    {
                        id: 3,
                        delivery_note_id: 27,
                        tally_sheet_id: 10,
                        sales_order_id: 1,
                        product_id: 3,
                        product_alias_name: "Bagian 1 Grade 1 Merk 2",
                        product_name: "Bagian 1 Grade 1 IW Tipe 1 Merk 2",
                        quantity: 1,
                        unit: "kg",
                        returned: 0,
                        created_at: "2022-08-19T08:35:25.000000Z",
                        updated_at: "2022-08-19T08:35:25.000000Z"
                    },
                    {
                        id: 4,
                        delivery_note_id: 27,
                        tally_sheet_id: 11,
                        sales_order_id: 1,
                        product_id: 3,
                        product_alias_name: "Bagian 1 Grade 1 Merk 2",
                        product_name: "Bagian 1 Grade 1 IW Tipe 1 Merk 2",
                        quantity: 1,
                        unit: "kg",
                        returned: 0,
                        created_at: "2022-08-19T08:35:25.000000Z",
                        updated_at: "2022-08-19T08:35:25.000000Z"
                    }
                ],
                customer:
                {
                    id: 2,
                    code: "CUS-00002",
                    name: "Pelanggan 2",
                    business_entity: "PT",
                    phone_number: "2",
                    email: "E2",
                    npwp: "2",
                    term: 2,
                    discount: 2,
                    status: "Active",
                    created_at: "2022-08-15T04:22:12.000000Z",
                    updated_at: "2022-08-15T04:22:12.000000Z"
                },
            }
        ]

    const optionsType = [
        {
            value: "Lokal",
            label: "Lokal"
        },
        {
            value: "Standar",
            label: "Standar"
        }
    ]



    console.log(TableData.map(d => d.delivery_note_details.map(d => d.product_alias_name)));

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Buat Retur Pembelian</h3>
                </div>
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
                                />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Grup</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => setGrup(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option>Pilih Grup</option>
                                    <option value="Lokal" checked={grup === "Lokal"}>
                                        Lokal
                                    </option>
                                    <option value="Impor" checked={grup === "Impor"}>
                                        Import
                                    </option>

                                </select>
                            </div>
                        </div> */}
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Retur</label>
                            <div className="col-sm-7">
                                <input
                                    value={code}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled

                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
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
                        {/* <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >No. Kontainer</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setKontainer(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Term</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => setTerm(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option>Pilih Term</option>
                                    <option value="CIF">
                                        CIF
                                    </option>
                                    <option value="CFR">
                                        CFR
                                    </option>

                                </select>
                            </div>
                        </div> */}
                    </div>
                    <div className="col">
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Muatan</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => setMuatan(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option>Pilih Muatan</option>
                                    <option value="20ft">
                                        20 ft
                                    </option>
                                    <option value="40ft">
                                        40 ft
                                    </option>

                                </select>
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Ctn</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setCtn(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputPassword3" className="col-sm-4 col-form-label">Catatan</label>
                            <div className="col-sm-7">
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
                            <h4 className="title fw-normal">Daftar Pesanan</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />

                        </div>
                    </div>
                    <div className="row mt-4  mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Cari Pesanan</label>
                        <div className="col-sm-5">
                            <ReactSelect
                                className="basic-single"
                                placeholder="Pilih Pesanan..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsType}
                                onChange={() => setModal2Visible(true)}
                            />
                        </div>
                        <Modal
                            title="Tambah Penerima Pembelian"
                            centered
                            visible={modal2Visible}
                            onCancel={() => setModal2Visible(false)}
                            width={800}
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
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={TableData}
                        columns={columns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                {/* <div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Biaya Lain</label>
                        <div className="col-sm-5">
                            <ReactSelect
                                className="basic-single"
                                placeholder="Pilih Akun..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsType}
                                onChange={(e) => setFakturType(e.value)}
                            />
                        </div>
                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={TableData}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div> */}
                {/* <div className='mt-4' style={{display: impor ? "block" : "none"}}>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Credit Note</label>
                        <div className="col-sm-5">
                            <ReactSelect
                                className="basic-single"
                                placeholder="Pilih Credit Note..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsType}
                                onChange={(e) => setFakturType(e.value)}
                            />
                        </div>
                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={TableData}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div> */}
                <div className="d-flex justify-content-end mt-4 ">
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
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
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
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
                        {/* <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Uang Muka</label>
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
                        </div> */}
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>
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
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
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

export default BuatReturPembelian