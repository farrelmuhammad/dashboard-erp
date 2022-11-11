import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { PageHeader } from 'antd';
import ReactSelect from 'react-select';

const { Text } = Typography;


const BuatPembayaranPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [kurs, setKurs] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [COA, setCOA] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const [getDataFaktur, setGetDataFaktur] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [tampilTabel, setTampilTabel] = useState(true)

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState()
    const [selectedMataUang, setSelectedMataUang] = useState()
    const [nmMataUang, setnmMataUang] = useState()
    const [nmMataUang2, setnmMataUang2] = useState('')
    const [supplierId, setSupplierId] = useState('')
    const [mataUangId, setMataUangId] = useState()
    const [selectedBank, setSelectedBank] = useState()
    const [bankId, setBankId] = useState()
    const [totalAkhir, setTotalAkhir] = useState('-');
    const [sisaAkhir, setSisaAkhir] = useState('-')

    const [tmpCentang, setTmpCentang] = useState([])


    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }



    // select supplier 
    const handleChangeSupplier = (value) => {
        setSelectedSupplier(value);
        setSupplierId(value.id);
        setProduct([])
    };
    const loadOptionsSupplier = (inputValue) => {
        return axios.get(`${Url}/purchase_invoice_payments_available_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    // select mata uang 
    const handleChangeMataUang = (value) => {
        setnmMataUang(value.name);
        setSelectedMataUang(value);
        setnmMataUang2(value)
        setMataUangId(value.id);
        console.log(selectedMataUang)
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

        return axios.get(`${Url}/select_chart_of_accounts?anak_terakhir=1&kode_kategori[]=111&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data);
    };


    useEffect(() => {
        getNewCode()
    })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/purchase_invoice_payments_available_purchase_invoices?id_pemasok=${supplierId}&kode=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })

            let tmp = []
            for(let i=0; i<res.data.data.length; i++){
                if(tmpCentang.indexOf(res.data.data[i].code) >= 0 ){
                    tmp.push({
                        detail:res.data.data[i],
                        statusCek: true
                    });
                }
            }
            for(let i=0; i<res.data.data.length; i++){
                if(tmpCentang.indexOf(res.data.data[i].code) < 0 ){
                    tmp.push({
                        detail:res.data.data[i],
                        statusCek: false
                    });
                }
            }

            // console.log(res.data)
            setGetDataFaktur(tmp);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplierId])

    function klikUbahTotal(index, value) {
        let tmp = []
        let hasil = value.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
        // setting data baru 
        // let hasilSisa = Number(product[index].sisaNoEdit);

        for (let i = 0; i < product.length; i++) {
            console.log(hasil)
            if (i == index) {
                tmp.push({
                    code: product[i].code,
                    total: product[i].total,
                    sisa: product[i].sisaNoEdit - hasil,
                    sisaNoEdit: product[i].sisaNoEdit,
                    bayar: hasil,
                    idFaktur: product[i].idFaktur
                })
                // console.log(hasil)
                // console.log(Number(product[i].sisa))

            }
            else {
                tmp.push(product[i])
            }
        }
        setProduct(tmp)

    }
    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            align: 'center',
            dataIndex: 'code',
            render: (_, record) => {
                return <>{record.detail.code}</>
            }
        },
        {
            title: 'Supplier',
            // dataIndex: 'customer_id',
            align: 'center',
            // render: (text, record, index) => (
            //     <>{getDataFaktur[index].supplier.name}</>
            // )
            render: (_, record) => {
                return <>{record.detail.supplier.name}</>
            }
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '20%',
            align: 'center',
            render: (_, record) => {
                return <>{record.detail.total}</>
            }
        },
        {
            title: 'Actions',
            dataIndex: 'address',
            width: '15%',
            align: 'center',
            render: (_, record, index) => (
                <>
                    <Checkbox
                        value={record}
                        checked={record.statusCek}
                        onChange={(e) => handleCheck(e,index)}
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
        },
        {
            title: 'Dibayarkan',
            dataIndex: 'pays',
            width: '25%',
            align: 'center',
            editable: true,
        },
    ];


    const dataFaktur =
        [...product.map((item, i) => ({
            code: item.code,
            total: 
            nmMataUang === 'IDR' || nmMataUang ==='Rp' ? 
             <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.',',')} key="total" /> :
             <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toLocaleString('id')} key="total" /> 
             ,
            sisa:
            nmMataUang === 'IDR' || nmMataUang ==='Rp' ? 
            <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.sisa).toFixed(2).replace('.',',')} key="sisa" /> : 
            <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.sisa).toLocaleString('id')} key="sisa" /> , 
            

            pays: nmMataUang === 'IDR' || nmMataUang ==='Rp' ? 
            <CurrencyFormat prefix={nmMataUang + ' '} className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.bayar.toString().replace('.',',')} onChange={(e) => klikUbahTotal(i, e.target.value)} key="pay" /> :
            <CurrencyFormat prefix={nmMataUang + ' '} className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.bayar.toLocaleString('id')} onChange={(e) => klikUbahTotal(i, e.target.value)} key="pay" /> ,


        }))

        ]


    const handleCheck = (event, index) => {
        
       // var updatedList = [...product];
        let data = event.target.value
        let tmpDataBaru=[]
        let tmpDataCentang = [...tmpCentang]
        // let mataUang = data.purchase_invoice_details[0].currency_name
        // if(mataUang){
        //     setSelectedMataUang(mataUang)
        // }
        // else{
        //     setSelectedMataUang('Rp ')
        // }
        // console.log(data)


        for(let i=0;i<getDataFaktur.length; i++){
            if(i == index){
                tmpDataBaru.push({
                    detail:getDataFaktur[i].detail,
                    statusCek: !getDataFaktur[i].statusCek
                })
                if (!tmpDataBaru[i].statusCek) {
                    let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.code);
                    tmpDataCentang.splice(idxHapus, 1)
                }
                else if (tmpDataBaru[i].statusCek == true) {
                    tmpDataCentang.push(tmpDataBaru[i].detail.code)
                }
            }
            else{
                tmpDataBaru.push(getDataFaktur[i])
            }

            // if (tmpDataBaru[i].statusCek == true) {
            //     tmpDataCentang.push(tmpDataBaru[i].detail.code)
            // }
            // else {
            //     let index = tmpDataCentang.indexOf(tmpDataBaru[i].detail.code);
            //     if (index >= 0) {
            //         tmpDataCentang.splice(index, 1)
            //     }
            // }
        }

        let unikTmpCentang = [...new Set(tmpDataCentang)]
        setTmpCentang(unikTmpCentang)
        setGetDataFaktur(tmpDataBaru)
        var updatedList = [...product];


        //681
        if (tmpDataBaru[index].statusCek) {
            console.log(data.detail)
            // updatedList = [...product, event.target.value];
            updatedList = [...product, data.detail];
            console.log(updatedList)
            let tmp = []
            if (updatedList.length == 0) {
                tmp.push({
                    code: data.detail.code,
                    total: data.detail.total_payment,
                    sisa: data.detail.remains,
                    sisaNoEdit: data.detail.remains,
                    bayar: 0,
                    idFaktur: data.detail.id
                })
            }
            else {
                for (let i = 0; i < updatedList.length; i++) {
                    if (updatedList.length -1 == i) {
                        tmp.push({
                            code: data.detail.code,
                            total: data.detail.total_payment,
                            sisa: data.detail.remains,
                            sisaNoEdit: data.detail.remains,
                            bayar: 0,
                            idFaktur: data.detail.id
                        })
                    }
                    else {

                        tmp.push(product[i])
                    }

                }
            }
            setProduct(tmp)
            console.log(tmp)
        }
        else {
            for (let i = 0; i < updatedList.length; i++) {
                // console.log(product[i].idFaktur);
                if (updatedList[i].idFaktur == data.detail.id) {
                    updatedList.splice(i, 1);

                }
            }
            setProduct(updatedList)

        }
      
    };


    const getNewCode = async () => {
        await axios.get(`${Url}/get_new_purchase_invoice_payment_draft_code?tanggal=${date}`, {
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

        console.log(kurs)

        if(!date){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if (!supplierId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!bankId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if (!mataUangId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Mata Uang kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!kurs){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Rate Kurs kosong, Silahkan Lengkapi datanya ",
              });
        }
        else{


        e.preventDefault();
        const dataKirim = new FormData();
        dataKirim.append("tanggal", date);
        dataKirim.append("referensi", referensi);
        //dataKirim.append("kurs", kurs.replace(',','.'));
        dataKirim.append("kurs", kurs.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.'))
        dataKirim.append("pemasok", supplierId);
        dataKirim.append("status", "Submitted");
        dataKirim.append("mata_uang", mataUangId);
        dataKirim.append("bagan_akun", bankId);
        dataKirim.append("catatan", description)

        product.map((p) => {
            dataKirim.append("id_faktur_pembelian[]", p.idFaktur);
            dataKirim.append("terbayar[]", p.bayar);
        });


        axios({
            method: "post",
            url: `${Url}/purchase_invoice_payments`,
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
                        text:"Data Faktur belum dipilih, silahkan lengkapi datanya dan coba kembali",
                        //text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    }};

    const handleDraft = async (e) => {


        if(!date){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if (!supplierId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!bankId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if (!mataUangId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Mata Uang kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!kurs){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Rate Kurs kosong, Silahkan Lengkapi datanya ",
              });
        }
        else{


        e.preventDefault();
        const dataKirim = new FormData();
        dataKirim.append("tanggal", date);
        dataKirim.append("referensi", referensi);
        dataKirim.append("kurs", kurs.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.'));
        dataKirim.append("pemasok", supplierId);
        dataKirim.append("status", "Draft");
        dataKirim.append("mata_uang", mataUangId);
        dataKirim.append("bagan_akun", bankId);
        dataKirim.append("catatan", description)

        product.map((p) => {
            dataKirim.append("id_faktur_pembelian[]", p.idFaktur);
            dataKirim.append("terbayar[]", p.bayar);
        });

        axios({
            method: "post",
            url: `${Url}/purchase_invoice_payments`,
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
                        text:"Data Faktur belum dipilih, silahkan lengkapi datanya dan coba kembali",
                        //text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
      }  };


    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Buat Pembayaran Pembelian">
            </PageHeader>

            <form className="p-3 mb-3 bg-body rounded">
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
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pembayaran</label>
                            <div className="col-sm-7">
                                <input
                                    value="Otomatis"
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
                               
                               {
                                nmMataUang == '' ? 
                                <AsyncSelect
                                placeholder="Pilih Mata Uang..."
                                cacheOptions
                                defaultOptions
                                value={selectedMataUang}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                                loadOptions={loadOptionsMataUang}
                                onChange={handleChangeMataUang}
                            /> : 
                        //     <input
                        //     type="Nama"
                        //     className="form-control"
                        //     value={nmMataUang}
                        //     id="inputNama3"

                        // />
                        <AsyncSelect
                        placeholder="Pilih Mata Uang..."
                        cacheOptions
                        defaultOptions
                        value={nmMataUang2}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        loadOptions={loadOptionsMataUang}
                        onChange={handleChangeMataUang}
                    /> 


                               }

                             
                            </div>
                        </div>

                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">
                                {/* <input
                                    
                                    prefix={nmMataUang}
                                    type="Nama"
                                    className="form-control"
                                    defaultValue={Number(kurs).toFixed(2).replace('.',',')}
                                    onChange={(e) => setKurs(e.target.value)}
                                    decimalSeparator={','}
                                    id="inputNama3"
                                /> */}


                                <div className="col-sm-7">

                                <CurrencyFormat className=' editable-input form-control' thousandSeparator={'.'} decimalSeparator={','} prefix={nmMataUang + ' '} onKeyDown={(event) => klikEnter(event)} value={kurs} onChange={(e) => setKurs(e.target.value)} key="pay" />

{/* <CurrencyFormat prefix={nmMataUang} className='form-control' thousandSeparator={'.'} decimalSeparator={','} value={kurs} onKeyDown={(event) => klikEnter(event)} onChange={(e) => setUbahKurs(e.target.value)} key="total" /> */}


</div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">
                                <>
                                {
                                   nmMataUang === 'IDR' || nmMataUang ==='Rp' ?  
                                   <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(totalAkhir).toFixed(2).replace('.',',')} key="total" /> :
                                   <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir.toLocaleString('id')} key="total" />
                                }
                                </>
                         

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                <>
                                {
                                     nmMataUang === 'IDR' || nmMataUang ==='Rp' ?   
                                     <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled  form-control' thousandSeparator={'.'} decimalSeparator={','} value={ Number(sisaAkhir).toFixed(2).replace('.',',')} key="sisa" /> :
                                     <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled  form-control' thousandSeparator={'.'} decimalSeparator={','} value={sisaAkhir.toLocaleString('id')} key="sisa" />
                                }
                                </>
                              
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    onChange={(e) => setReferensi(e.target.value)}
                                    id="inputNama3"
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
                                title="Tambah Faktur Pembelian"
                                centered
                                visible={modal2Visible}
                                onCancel={() => setModal2Visible(false)}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari No Faktur..."
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
                        bordered
                        pagination={false}
                        dataSource={dataFaktur}
                        // loading={isLoading}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            let totalAkhir = 0;
                            let sisaAkhir = 0;
                            pageData.forEach(({ sisa, pays }) => {
                                //totalAkhir += Number(pays.props.value);
                                //sisaAkhir += Number(sisa.props.value);
                               // setTotalAkhir(totalAkhir)
                               // setSisaAkhir(sisaAkhir)
                               // console.log(totalAkhir)


                                let pay =  pays.props.value
                                let sisaa = sisa.props.value
                                let pay2 = 0; 
                                let sisa2 = 0;
                               if( nmMataUang === 'IDR' || nmMataUang ==='Rp' ){
                               
                                let p1 = pay.replace(',','.')
                                totalAkhir = Number(totalAkhir) + Number(p1)    

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
                                  console.log(Number(totalAkhir))
                                //  console.log(sisaAkhir)







                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} className="text-end">Total yang dibayarkan</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix={nmMataUang + ' '} disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="pay" />

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
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </form>


                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                        style={{ width: '100px' }}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                        style={{ width: '100px' }}
                    >
                        Submit
                    </button>
                    {/* <button
                        type="button"
                        style={{ width: '100px' }}
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
        </>
    )
}

export default BuatPembayaranPembelian