import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import Spreadsheet from 'react-spreadsheet';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import ReactSelect from 'react-select';
import { PageHeader } from 'antd';

const BuatPIB = () => {
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedMataUang, setSelectedMataUang] = useState('Rp ');
    const [selectedFaktur, setSelectedFaktur] = useState(null);
    const [selectedCOA, setSelectedCOA] = useState(null);
    const [selectedBiaya, setSelectedBiaya] = useState(null);
    const [supplierId, setSupplierId] = useState();
    const [biayaId, setBiayaId] = useState();
    const [nominal, setNominal] = useState();
    const [deskripsi, setDeskripsi] = useState()
    const [COAId, setCOAId] = useState();
    const [fakturId, setFakturId] = useState();
    const [getCode, setGetCode] = useState('');
    const [mataUangId, setMataUangId] = useState();

    const [selectedBank, setSelectedBank] = useState()
    const [bankId, setBankId] = useState()
    const [totalAkhir, setTotalAkhir] = useState('-');
    const [sisaAkhir, setSisaAkhir] = useState('-')
    const [kurs, setKurs] = useState();
    const [referensi, setReferensi] = useState()

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [tampilPilihProduk, setTampilPilihProduk] = useState(false)
    const [tampilPilihFaktur, setTampilPilihFaktur] = useState(false)
    const [dataFaktur, setDataFaktur] = useState([])
    const [tampilTabel, setTampilTabel] = useState(true)
    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState(0);
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [modal2Visible, setModal2Visible] = useState(false);
    const [term, setTerm] = useState();
    const [muatan, setMuatan] = useState();
    const [ctn, setCtn] = useState();
    const [alamat, setAlamat] = useState();
    const [kontainer, setKontainer] = useState();
    const [produkFaktur, setProdukFaktur] = useState([])
    const [totalKeseluruhan, setTotalKeseluruhan] = useState()
    const [product, setProduct] = useState([]);
    const [mataUang, setMataUang] = useState("Rp ")
    const [tampilProduk, setTampilProduk] = useState([])
    const [updateProduk, setUpdateProduk] = useState([])
    const [totalCredit, setTotalCredit] = useState(0)
    const [namaKapal, setNamaKapal] = useState();
    const [estimasiAwal, setEstimasiAwal] = useState()
    const [estimasiAkhir, setEstimasiAkhir] = useState()
    const [tanggalTiba, setTanggalTiba] = useState()
    const [noBL, setNoBL] = useState()




    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }

    useEffect(() => {
        getNewCode()
    })

    useEffect(() => {
        axios.get(`${Url}/select_purchase_invoices/all?id_pemasok=${supplierId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => {
            let tmp = []
            let data = res.data[0]
            for (let x = 0; x < data.purchase_invoice_details.length; x++) {
                tmp.push({
                    value: data.purchase_invoice_details[x].id,
                    label: data.purchase_invoice_details[x].product_name,
                    quantity: data.purchase_invoice_details[x].quantity,
                    price: data.purchase_invoice_details[x].price,
                    fixed_discount: data.purchase_invoice_details[x].fixed_discount,
                    discount_percentage: data.purchase_invoice_details[x].discount_percentage[x],
                    unit: data.purchase_invoice_details[x].unit,
                    total: data.purchase_invoice_details[x].total,
                    pilihanDiskon: data.purchase_invoice_details[x].fixed_discount == 0 ? 'persen' : 'nominal'
                })
            }
            if (data.purchase_invoice_details[0].currency_name) {
                setMataUang(data.purchase_invoice_details[0].currency_name)
            }
            setTotalPpn(data.ppn);
            setProdukFaktur(tmp)
            setUpdateProduk(tmp)
            console.log(tmp)
        }
        );
    }, [])

    const getNewCode = async () => {
        await axios.get(`${Url}/get_new_goods_import_declaration_code?tanggal=${date}`, {
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

    const handleChangePilih = (value) => {
        let dataDouble = [];
        for (let i = 0; i < tampilProduk.length; i++) {
            if (tampilProduk[i] == value) {
                dataDouble.push(i)
            }
        }



        if (dataDouble.length != 0) {
            Swal.fire(
                "Gagal",
                `Data Sudah Ada pada List`,
                "success"
            )
        }
        else {
            console.log(value)
            let newData = [...tampilProduk];
            newData.push(value)
            let totalPerProduk = 0;
            let grandTotal = 0;
            let total = 0;
            let hasilDiskon = 0;
            console.log(newData)
            for (let x = 0; x < newData.length; x++) {
                total += (Number(newData[x].quantity.replace(',', '.')) * Number(newData[x].price));
                totalPerProduk = (Number(newData[x].quantity.replace(',', '.')) * Number(newData[x].price));

                console.log(totalPerProduk)
                if (newData[x].discount_percentage != 0) {
                    hasilDiskon += (Number(totalPerProduk) * Number(newData[x].discount_percentage.replace(',', '.')) / 100);
                }
                else if (newData[x].fixed_discount != 0) {

                    hasilDiskon += Number(newData[x].fixed_discount);
                }


                grandTotal = total - hasilDiskon;
            }
            let totalAkhir = Number(grandTotal) + Number(totalPpn) - Number(totalCredit)
            setTotalKeseluruhan(totalAkhir)
            setSubTotal(total)
            setGrandTotalDiscount(hasilDiskon);
            setGrandTotal(grandTotal);

            setUpdateProduk(newData)
            setTampilProduk(newData);
        }


    };

    // handle change supplier 
    const handleChangeSupplier = (value) => {
        setSupplierId(value.id);
        setSelectedSupplier(value);
    };
    const loadOptionsSupplier = (inputValue) => {
        return fetch(`${Url}/select_suppliers?nama=${inputValue}&grup=impor`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // handle change faktur 
    const handleChangeFaktur = (value) => {
        setFakturId(value.id);
        setSelectedFaktur(value);
    };
    const loadOptionsFaktur = (inputValue) => {
        return fetch(`${Url}/select_purchase_invoices/Import?code=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // handle change mata uang 
    const handleChangeMataUang = (value) => {
        setMataUangId(value.id);
        setSelectedMataUang(value);
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
        return fetch(`${Url}/select_chart_of_accounts?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const columnProduk = [
        {
            title: 'Nama Produk',
            width: '20%',
            dataIndex: 'name_product',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '10%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Harga',
            dataIndex: 'prc',
            width: '10%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '15%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Jumlah (Rp)',
            dataIndex: 'Jumlah',
            width: '15%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Bea Masuk',
            dataIndex: 'bea',
            width: '15%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            align: 'center',

        },

    ];



    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("tanggal", date);
        formData.append("pemasok", supplierId);
        formData.append("id_faktur_pembelian", fakturId);
        formData.append("mata_uang", mataUangId);
        formData.append("bagan_akun", COAId);
        formData.append("biaya", biayaId);
        formData.append("nominal", nominal);
        formData.append("deskripsi", deskripsi);
        formData.append("status", 'Draft');
        axios({
            method: "post",
            url: `${Url}/credit_notes`,
            data: formData,
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
                navigate("/penerimaanbarang");
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
        const formData = new FormData();
        formData.append("tanggal", date);
        formData.append("pemasok", supplierId);
        if (fakturId) {
            formData.append("id_faktur_pembelian", fakturId);
        }
        formData.append("mata_uang", mataUangId);
        formData.append("bagan_akun", COAId);
        formData.append("biaya", biayaId);
        formData.append("nominal", nominal.replaceAll('.', '').replace(/[^0-9\.]+/g, ""));
        formData.append("deskripsi", deskripsi);
        formData.append("status", 'Draft');


        axios({
            method: "post",
            url: `${Url}/credit_notes`,
            data: formData,
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
                navigate("/creditnote");
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
            	    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Buat PIB">
                     </PageHeader>
            <form className="p-3 mb-3 bg-body rounded">
                {/* <div className="text-title text-start mb-4">
                    
                    <h4 className="title fw-bold">Buat PIB</h4>
                </div> */}

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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. PIB</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
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
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">No B/L</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    onChange={(e) => setNoBL(e.target.value)}
                                    id="inputNama3"
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    onChange={(e) => setKurs(e.target.value)}
                                    id="inputNama3"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="col">

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Nama Kapal</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    onChange={(e) => setNamaKapal(e.target.value)}
                                    id="inputNama3"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal Tiba</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setTanggalTiba(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Shipment Periode </label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setEstimasiAwal(e.target.value)}
                                />
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setEstimasiAkhir(e.target.value)}
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
                        {/* <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="total" />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled  form-control' thousandSeparator={'.'} decimalSeparator={','} value={sisaAkhir} key="sisa" />
                            </div>
                        </div> */}
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
                    </div>
                    <div className="row mt-4  mb-3" >
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Cari Produk</label>
                        <div className="col-sm-5">

                            <ReactSelect

                                style={{ display: tampilTabel ? "block" : "none" }}
                                className="basic-single"
                                placeholder="Pilih Produk..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={produkFaktur}
                                onChange={(e) => handleChangePilih(e)}
                            />
                        </div>

                    </div>
                    <Table
                        // rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        // dataSource={dataProduk}
                        columns={columnProduk}
                        onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            let totalAkhir = 0;
                            let sisaAkhir = 0;
                            pageData.forEach(({ sisa, pays }) => {
                                totalAkhir += Number(pays.props.value);
                                sisaAkhir += Number(sisa.props.value);
                                setTotalAkhir(totalAkhir)
                                setSisaAkhir(sisaAkhir)
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Sub Total</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Biaya Masuk</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Pph 22</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Total (Rp)</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )
                        }}
                    />
                </div>

                {/* <div className="d-flex justify-content-end mt-4 ">
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">

                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={subTotal} key="diskon" />
                            </div>

                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">

                                < CurrencyFormat disabled className='form-control form-control-sm edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={grandTotalDiscount} key="diskon" />
                            </div>

                        </div>

                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>

                            <div className="col-sm-6">
                                < CurrencyFormat disabled className='form-control form-control-sm edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={totalPpn} key="diskon" />


                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">

                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={totalKeseluruhan} key="diskon" />
                            </div>

                        </div>
                    </div>
                </div> */}
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{float:'right', position:'relative'}}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                        width="100px"
                    >
                        Simpan
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
                    <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
                <div style={{clear:'both'}}></div>
            </form>

        </>
    )
}

export default BuatPIB