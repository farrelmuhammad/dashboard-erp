import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';

const { Text } = Typography;

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

const EditPembayaranPembelian = () => {
    const { id } = useParams();
    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [catatan, setCatatan] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [COA, setCOA] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [kurs, setKurs] = useState('')

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [dataHeader, setDataHeader] = useState()
    const [dataDetail, setDataDetail] = useState([]);
    const [loading, setLoading] = useState(true)
    const [selectedSupplier, setSelectedSupplier] = useState()
    const [selectedMataUang, setSelectedMataUang] = useState('Rp ')
    const [supplierId, setSupplierId] = useState('')
    const [mataUangId, setMataUangId] = useState()
    const [selectedBank, setSelectedBank] = useState()
    const [bankId, setBankId] = useState()
    const [totalAkhir, setTotalAkhir] = useState('-');
    const [sisaAkhir, setSisaAkhir] = useState('-')



    // select supplier 
    const handleChangeSupplier = (value) => {
        setSelectedSupplier(value);
        setSupplierId(value.id);
    };
    const loadOptionsSupplier = (inputValue) => {
        return fetch(`${Url}/select_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // select mata uang 
    const handleChangeMataUang = (value) => {
        setSelectedMataUang(value);
        setMataUangId(value.id);
    };
    const loadOptionsMataUang = (inputValue) => {
        return fetch(`${Url}/select_currencies?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };


    // select bank/kas 
    const handleChangeBank = (value) => {
        setSelectedBank(value);
        setBankId(value.id);
    };
    const loadOptionsBank = (inputValue) => {
        return axios.get(`${Url}/chart_of_accounts?induk=0&kode_kategori[]=111&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };



    useEffect(() => {
        getDataPembayaran();
    }, [])
    const getDataPembayaran = async () => {
        await axios.get(`${Url}/purchase_invoice_payments?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data.data[0];
                setDataHeader(getData)

                let tmp = []
                let data = getData.purchase_invoice_payment_details
                for (let i = 0; i < data.length; i++) {
                    tmp.push({
                        code: data[i].purchase_invoice_code,
                        total: data[i].purchase_invoice_total_payment,
                        sisa: data[i].remains,
                        bayar: data[i].paid,
                        idFaktur: data[i].purchase_invoice_id
                    })
                }
                setDataDetail(tmp)

                // pengisian data Header 
                setDate(getData.date);
                setStatus(getData.status)
                setReferensi(getData.reference)
                setCatatan(getData.notes)
                setSisaAkhir(getData.remains)
                setSelectedBank(getData.chart_of_account.name)
                setSelectedSupplier(getData.supplier.name)
                if (getData.currency_name) {

                    setSelectedMataUang(getData.currency_name + ' ')
                }
                setSupplierId(getData.supplier_id)
                setMataUangId(getData.supplier_id);
                setBankId(getData.chart_of_account.id)
                setTotalAkhir(getData.total)
                setLoading(false);

                setKurs(getData.exchange_rate.toString().replace('.',','))
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }


    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/purchase_invoice_payments_available_purchase_invoices?id_pemasok=${supplierId}&kode=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            // console.log(res.data)
            setGetDataProduct(res.data.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplierId])



    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            align: 'center',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            align: 'center',
            render: (text, record, index) => (
                <>{getDataProduct[index].supplier.name}</>
            )
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Actions',
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
            align: 'center',
            width: '25%',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '25%',
            align: 'center',
            
        },
        {
            title: 'Sisa',
            dataIndex: 'sisa',
            width: '25%',
            align: 'center',
            // render: (record) => (
            //     <>
            //         <a>0</a>
            //     </>
            // )
        },
        {
            title: 'Dibayarkan',
            dataIndex: 'pays',
            width: '25%',
            align: 'center',
            editable: true,
            // render: (record) => {
            //     let pay = 0;
            //     if (record.pays !== 0) {
            //         return pay += record.pays
            //     } 
            //     else {
            //         return pay
            //     }
            // }
                // render(text, record) {
            //     return {
            //         props: {
            //         },
            //         children: <div>{Number(text).toFixed(2).replace('.', ',')}</div>
            //     };
            // }
        },
    ];




    const handleCheck = (event) => {
        var updatedList = [...dataDetail];
        let data = event.target.value


        if (event.target.checked) {
            // updatedList = [...product, event.target.value];
            let tmp = []
            if (updatedList.length == 0) {
                tmp.push({
                    code: data.code,
                    total: data.total,
                    sisa: data.remains,
                    bayar: 0,
                    idFaktur: data.id
                })
            }
            else {
                let doubleData = 0;
                for (let i = 0; i < updatedList.length; i++) {
                    // console.log(product[i].code)

                    if (updatedList[i].code == data.code) {
                        doubleData = Number(doubleData) + Number(1);
                    }
                }

                if (doubleData > 0) {
                    Swal.fire(
                        "Gagal",
                        `Data Sudah Ada pada List`,
                        "success"
                    )
                    tmp = updatedList
                }
                else {
                    for (let i = 0; i <= updatedList.length; i++) {
                        if (updatedList.length == i) {
                            tmp.push({
                                code: data.code,
                                total: data.total,
                                sisa: 0,
                                bayar: 0,
                                idFaktur: data.id
                            })
                        }
                        else {

                            tmp.push(dataDetail[i])
                        }

                    }
                }


            }
            setDataDetail(tmp)
        }
        else {
            for (let i = 0; i < updatedList.length; i++) {
                // console.log(product[i].idFaktur);
                if (updatedList[i].idFaktur == data.id) {
                    updatedList.splice(i, 1);

                }
            }
            setDataDetail(updatedList)

        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataKirim = new URLSearchParams();
        dataKirim.append("tanggal", date);
        dataKirim.append("referensi", referensi);
        dataKirim.append("kurs", kurs.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.'));
        dataKirim.append("pemasok", supplierId);
        dataKirim.append("status", "Submitted");
        dataKirim.append("mata_uang", mataUangId);
        dataKirim.append("bagan_akun", bankId);
        dataKirim.append("catatan", catatan)

        console.log(kurs)

        dataDetail.map((p) => {
            dataKirim.append("id_faktur_pembelian[]", p.idFaktur);
            dataKirim.append("terbayar[]", p.bayar);
        });

        axios({
            method: "put",
            url: `${Url}/purchase_invoice_payments/${id}`,
            data: dataKirim,
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
                navigate("/pembayaranpembelian");
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
        const dataKirim = new URLSearchParams();
        dataKirim.append("tanggal", date);
        dataKirim.append("referensi", referensi);
        dataKirim.append("kurs", kurs.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.'));
        dataKirim.append("pemasok", supplierId);
        dataKirim.append("status", "Submitted");
        dataKirim.append("mata_uang", mataUangId);
        dataKirim.append("bagan_akun", bankId);
        dataKirim.append("catatan", catatan)

        dataDetail.map((p) => {
            dataKirim.append("id_faktur_pembelian[]", p.idFaktur);
            dataKirim.append("terbayar[]", p.bayar);
        });

        axios({
            method: "put",
            url: `${Url}/purchase_invoice_payments/${id}`,
            data: dataKirim,
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
                navigate("/pembayaranpembelian");
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


    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }


    function klikUbahTotal(index, value) {
        let tmp = []
        let hasil = value.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
        console.log(tmp)
       // let hasil = value.replaceAll('.', '').replace( /^[-+]?[0-9]+\.[^0-9]+$/, '')
        //let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");
        // setting data baru 
        for (let i = 0; i < dataDetail.length; i++) {
            if (i == index) {
                tmp.push({
                    code: dataDetail[i].code,
                    total: dataDetail[i].total,
                    sisa: dataDetail[i].total - hasil,
                    bayar: hasil,
                    idFaktur: dataDetail[i].idFaktur
                })

            }
            else {
                tmp.push(dataDetail[i])
            }
        }
        setDataDetail(tmp)

        console.log(value)
    }

    const dataFaktur =
        [...dataDetail.map((item, i) => ({
            code: item.code,
            total: selectedMataUang === 'IDR ' || selectedMataUang === 'Rp ' ? 
           
            <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.',',')} key="total" /> :
            <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toLocaleString('id')} key="total" />,
           
            sisa: 
            selectedMataUang === 'IDR ' || selectedMataUang === 'Rp '  ?

              <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.sisa).toFixed(2).replace('.',',')} key="sisa" /> :
            <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.sisa)} key="sisa" />,
            pays: 

            selectedMataUang === 'IDR ' || selectedMataUang === 'Rp ' ? 
            // <CurrencyFormat prefix={selectedMataUang} className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.bayar.toString().replace('.',',')} 
            // onChange={(e) => klikUbahTotal(i, e.target.value)} key="pay" /> 

            <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={selectedMataUang} onKeyDown={(event) => klikEnter(event)} value={item.bayar.replace('.', ',')} onChange={(e) => klikUbahTotal(i, e.target.value)} key="pay" />

            // < CurrencyFormat  className=' text-start  editable-input ' style={{ width: "100%", fontSize: "10px!important" }} prefix={selectedMataUang} thousandSeparator={'.'} decimalSeparator={','} value={item.bayar} 

            // renderText={value => <input 
            // value={Number(value)*100}  id="colFormLabelSm"  className="form-control form-control-sm editable-input" onChange={(e) =>klikUbahTotal(i, e.target.value)} key="pays" />}  />

            
            :
            <CurrencyFormat prefix={selectedMataUang} className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(item.bayar)} onChange={(e) => klikUbahTotal(i, e.target.value)} key="pay" />,
        }))
        ]

    if (loading) {
        return (
            <div></div>
        )
    }

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Edit Pembayaran Pembelian">
                    </PageHeader>
                    {/* <h4 className="title fw-bold">Edit Pembayaran Pembelian</h4> */}
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
                                    defaultValue={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pembayaran</label>
                            <div className="col-sm-7">
                                <input
                                    value={dataHeader.code}
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
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedSupplier}
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas/Bank</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Bank..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedBank}
                                    value={selectedBank}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsBank}
                                    onChange={handleChangeBank}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <input
                                        value={selectedMataUang}
                                        type="Nama"
                                        className="form-control"
                                        id="inputNama3"
                                        disabled
                                    />

                                {/* <AsyncSelect
                                    placeholder={selectedMataUang}
                                    cacheOptions
                                    defaultOptions
                                    value={selectedMataUang}
                                    defaultInputValue={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                  readOnly = {true}
                                  isDisabled
                                /> */}
                            </div>
                        </div>

                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">
                                {/* <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={dataHeader.exchange_rate}
                                    onChange={(e) => setKurs(e.target.value)}
                                /> */}

                <CurrencyFormat className=' editable-input form-control' thousandSeparator={'.'} decimalSeparator={','} prefix={selectedMataUang } onKeyDown={(event) => klikEnter(event)} value={kurs} onChange={(e) => setKurs(e.target.value)} key="kurs" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">
                                {
                                    selectedMataUang === 'IDR ' || selectedMataUang === 'Rp'  ? 
                                    <CurrencyFormat prefix={selectedMataUang} type="danger" disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(totalAkhir).toFixed(2).replace('.',',')} key="pay" /> :
                                    <CurrencyFormat prefix={selectedMataUang} type="danger" disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(totalAkhir)} key="pay" />
                                }

                                
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                {
                                    selectedMataUang === 'IDR ' || selectedMataUang === 'Rp' ? 
                                    <CurrencyFormat prefix={selectedMataUang} type="danger" disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(sisaAkhir).toFixed(2).replace('.',',')} key="pay" /> :
                                    <CurrencyFormat prefix={selectedMataUang} type="danger" disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(sisaAkhir)} key="pay" />
                                }



                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                {
                                    referensi === null ? 
                                    <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    defaultValue={"-"}
                                    onChange={(e) => setReferensi(e.target.value)}
                                /> : 
                                <input
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                defaultValue={referensi}
                                onChange={(e) => setReferensi(e.target.value)}
                            />
                                }
                                {/* <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    defaultValue={referensi}
                                    onChange={(e) => setReferensi(e.target.value)}
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-2">
                                {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}
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
                                title="Tambah Pembauyaran Pembelian"
                                centered
                                visible={modal2Visible}
                                onCancel={() => setModal2Visible(false)}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari No Transaksi..."
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
                        // components={components}
                        // rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataFaktur}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            let totalAkhir = 0;
                            let sisaAkhir = 0;
                            
                            pageData.forEach(({ sisa, pays }) => {
                                let pay =  pays.props.value
                                let sisaa = sisa.props.value
                                let pay2 = 0; 
                                let sisa2 = 0;
                               if( selectedMataUang === 'IDR ' || selectedMataUang === 'Rp ' ){
                               
                                let p1 = pay.replace(',','.')
                                totalAkhir = totalAkhir + Number(p1)    

                                let s1 = sisaa.replace(',','.')
                                sisaAkhir = sisaAkhir + Number(s1)

                               // console.log(pays.props.value)

                               }
                               else 
                               {
                                pay2 = Number(pay).toString().replace('.','')
                                totalAkhir = totalAkhir + Number(pay2) ;
                                sisa2 = Number(sisaa).toString().replace('.','')
                                sisaAkhir = sisaAkhir + Number(sisa2)
                               }

                               // sisaAkhir += Number(sisa.props.value);
                                setTotalAkhir(totalAkhir)
                                setSisaAkhir(sisaAkhir)
                               
                                 console.log(pay)
                                 console.log(sisaa)
                                  console.log(totalAkhir)
                                //  console.log(sisaAkhir)
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} className="text-end">Total yang dibayarkan</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>

                                            {
                                                  selectedMataUang === 'IDR ' || selectedMataUang === 'Rp ' ?
                                                  <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={
                                                   // totalAkhir.toLocaleString(undefined, {maximumFractionDigits:2}).replace('.',',')
                                                   // parseInt(totalAkhir).toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",")
                                                   // totalAkhir.toFixed(2)
                                                   totalAkhir
                                                  } key="pay" /> :
                                                  <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(totalAkhir).toLocaleString('id')} key="pay" />
                                              
                                            }
{/* 
                                            <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="pay" /> */}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            );
                        }}
                    />
                </div>
                <form className="p-3 mb-5 bg-body rounded">
                    <div className="d-flex align-items-start mb-3">
                        <div htmlFor="inputPassword3" className="col-1 me-4">Catatan</div>
                        <div className="col-11">
                            <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                defaultValue={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                            />
                        </div>
                    </div>
                </form>


                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    {
                        status == 'Submitted' ? <>
                            <button
                                type="button"
                                className="btn btn-success rounded m-1"
                                value="Draft"
                                onClick={handleSubmit}
                                width="100px"
                            >
                                Update
                            </button>
                        </> :

                            <>
                                <button
                                    type="button"
                                    className="btn btn-success rounded m-1"
                                    value="Draft"
                                    onClick={handleDraft}
                                    width="100px"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary rounded m-1"
                                    value="Submitted"
                                    onClick={handleSubmit}
                                    width="100px"
                                >
                                    Submit
                                </button>
                                {/* <button
                                    type="button"
                                    width="100px"
                                    className="btn btn-warning rounded m-1">
                                    Cetak
                                </button>  */}
                                </>
                    }

                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
        </>
    )
}

export default EditPembayaranPembelian