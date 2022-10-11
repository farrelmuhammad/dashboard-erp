import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditPIB = () => {
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState(false);
    const { id } = useParams();

    const [selectedSupplier, setSelectedSupplier] = useState('');
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
    const [totalBea, setTotalBea] = useState(0)
    const [mataUangId, setMataUangId] = useState();

    const [selectedBank, setSelectedBank] = useState()
    const [bankId, setBankId] = useState()
    const [totalAkhir, setTotalAkhir] = useState('-');
    const [sisaAkhir, setSisaAkhir] = useState('-')
    const [kurs, setKurs] = useState(0);
    const [referensi, setReferensi] = useState()

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [tampilPilihProduk, setTampilPilihProduk] = useState(false)
    const [tampilPilihFaktur, setTampilPilihFaktur] = useState(false)
    // const [dataFaktur, setDataFaktur] = useState([])
    const [tampilTabel, setTampilTabel] = useState(true)
    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState(0);
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
    const [faktur, setFaktur] = useState([])
    const [bea, setBea] = useState([])
    const [jumlah, setJumlah] = useState([])
    const [totalRupiah, setTotalRupiah] = useState([])
    const [optionsFaktur, setOptionsFaktur] = useState([])
    const [dataFaktur, setDataFaktur] = useState([])
    const [dataHeader, setDataHeader] = useState()
    const [dataPIB, setDataPIB] = useState([])
    const [totalPph, setTotalPph] = useState(0)
    const [loading, setLoading] = useState(true)
    const [tampil, setTampil] = useState(true)






    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }

    const getDataPIB = async () => {
        await axios.get(`${Url}/goods_import_declarations?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                setDataHeader(getData);
                let tmpDataPIB = [];
                let tmpIDFaktur = [];
                let dataProduk = getData.goods_import_declaration_details;
                for (let x = 0; x < dataProduk.length; x++) {
                    tmpDataPIB.push({
                        id_pib: dataProduk[x].goods_import_declaration_id,
                        id_faktur: dataProduk[x].purchase_invoice_id,
                        id_produk: dataProduk[x].product_id,
                        unit: dataProduk[x].unit,
                        product_name: dataProduk[x].product_name,
                        quantity: dataProduk[x].quantity,
                        price: dataProduk[x].price,
                        totalAsing: dataProduk[x].subtotal,
                        totalRupiah: dataProduk[x].converted_subtotal,
                        bea: dataProduk[x].import_duty,
                        total: dataProduk[x].total,
                        currency_name: dataProduk[x].currency_name
                    })
                    tmpIDFaktur.push(dataProduk[x].purchase_invoice_id)

                }
                var unique = [...new Set(tmpIDFaktur)]
                setDataFaktur(unique)
                setDataPIB(tmpDataPIB)

                // data header 
                setGetCode(getData.code);
                setSelectedSupplier(getData.supplier.name)
                setSupplierId(getData.supplier_id)
                setDate(getData.date);
                setBankId(getData.chart_of_account_id)
                setKurs(getData.exchange_rate)
                setNoBL(getData.bill_of_lading_number);
                setSelectedMataUang(getData.currency_name);
                setMataUangId(getData.currency_id)
                setNamaKapal(getData.ship_name);
                setTanggalTiba(getData.arrival_date);
                setEstimasiAkhir(getData.shipment_period_end_date);
                setTotalBea(getData.import_duty);
                setTotalPph(getData.pph);
                setTotalPpn(getData.ppn)
                setTotalAkhir(Number(getData.total).toFixed(2).replace('.', ','))
                setEstimasiAwal(getData.shipment_period_end_date);
                setSelectedBank(getData.chart_of_account_name)
                setReferensi(getData.reference);
                setSubTotal(getData.subtotal);
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    useEffect(() => {
        getDataPIB();

    }, [])

    useEffect(() => {
        axios.get(`${Url}/goods_import_declarations_available_purchase_invoices?id_pemasok=${supplierId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => {
            let tmp = []
            let data = res.data.data
            for (let x = 0; x < data.length; x++) {
                tmp.push({
                    value: data[x].id,
                    label: data[x].code,
                    info: data[x].purchase_invoice_details
                })
            }
            setOptionsFaktur(tmp)
        }
        );
    }, [supplierId])


    if (loading) {
        return (
            <div></div>
        )
    }






    const handleChangePilih = (value) => {
        let dataDouble = [];
        // console.log(tampilProduk)
        for (let i = 0; i < dataPIB.length; i++) {
            if (dataFaktur[i] == value.value) {
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
            let newData = [...dataPIB];
            let newIdFaktur = [...dataFaktur]
            let subTotal = 0;
            newIdFaktur.push(value.value);

            for (let x = 0; x < value.info.length; x++) {
                newData.push({
                    id_pib: value.info[x].goods_import_declaration_id,
                    id_faktur: value.info[x].purchase_invoice_id,
                    id_produk: value.info[x].product_id,
                    unit: value.info[x].unit,
                    product_name: value.info[x].product_name,
                    quantity: value.info[x].quantity,
                    price: value.info[x].price,
                    totalAsing: value.info[x].subtotal,
                    totalRupiah: Number(kurs) * Number(value.info[x].subtotal),
                    bea: 0,
                    total: 0,
                    currency_name: value.info[x].currency_name
                })

                let hasil = kurs * value.info[x].total
                subTotal = subTotal + hasil;

            }
            setSubTotal(subTotal)
            setDataFaktur(newIdFaktur)
            setDataPIB(newData);
            console.log(newData)
            if (totalBea != 0) {
                klikTambahBea(totalBea, newData)

            }
        }


    };

    // handle change supplier 
    const handleChangeSupplier = (value) => {
        setSupplierId(value.id);
        setSelectedSupplier(value);
    };
    const loadOptionsSupplier = (inputValue) => {
        return axios.get(`${Url}/goods_import_declarations_available_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
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
            dataIndex: 'nama',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Harga',
            dataIndex: 'hrg',
            width: '10%',
            align: 'center',
        },
        // {
        //     title: 'Diskon',
        //     dataIndex: 'dsc',
        //     width: '10%',
        //     align: 'center',
        // },
        {
            title: 'Jumlah Setelah Diskon',
            dataIndex: 'uangasing',
            width: '15%',
            align: 'center',

        },
        {
            title: 'Jumlah (Rp)',
            dataIndex: 'rupiah',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Bea Masuk',
            dataIndex: 'bea',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            align: 'center',

        },
        {
            title: 'Action',
            dataIndex: 'actn',
            width: '15%',
            align: 'center',

        },

    ];

    function klikTambahBea(value, data) {
        let hasil = value.replace('.', '').replace(/[^0-9\.]+/g, "");
        setTotalBea(hasil)

        // menghitung sub total 
        let subTotal = 0;
        for (let x = 0; x < data.length; x++) {
            subTotal = Number(subTotal) + Number(data[x].totalRupiah);
        }
        setSubTotal(subTotal)

        // menghitung bea per produk 
        let beaProduk = 0;
        let tmpDataPIB = [];
        for (let x = 0; x < data.length; x++) {
            beaProduk = (Number(data[x].totalRupiah) / Number(subTotal)) * Number(hasil)
            let convertBea = beaProduk.toFixed(2)
            let hitungTotal = Number(data[x].totalRupiah) + Number(beaProduk.toFixed(2))
            let convertTotal = hitungTotal.toFixed(2)

            tmpDataPIB.push({
                id_pib: data[x].id_pib,
                id_faktur: data[x].id_faktur,
                id_produk: data[x].id_produk,
                unit: data[x].unit,
                product_name: data[x].product_name,
                quantity: data[x].quantity,
                price: data[x].price,
                totalAsing: data[x].totalAsing,
                totalRupiah: data[x].totalRupiah,
                bea: convertBea,
                total: convertTotal,
                currency_name: data[x].currency_name
            })

        }

        setDataPIB(tmpDataPIB)
    }

    function setUbahKurs(value) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");
        let tmpDataPIB = []
        // let tempTotal = []
        let subTotal = 0;
        let hitungTotal = 0;
        for (let x = 0; x < dataPIB.length; x++) {
            let hitungRupiah = Number(hasil) * Number(dataPIB[x].totalAsing)


            if (dataPIB[x].bea != 0) {
                hitungTotal = Number(hitungRupiah) + Number(dataPIB[x].bea.toString().replace(',', '.'))

            }
            hitungTotal = Number(hitungRupiah) + Number(dataPIB[x].bea)
            let convertTotal = hitungTotal.toFixed(2)
            subTotal = Number(subTotal) + Number(hitungRupiah);
            tmpDataPIB.push({
                id_pib: dataPIB[x].id_pib,
                id_faktur: dataPIB[x].id_faktur,
                id_produk: dataPIB[x].id_produk,
                unit: dataPIB[x].unit,
                product_name: dataPIB[x].product_name,
                quantity: dataPIB[x].quantity,
                price: dataPIB[x].price,
                totalAsing: dataPIB[x].totalAsing,
                totalRupiah: hitungRupiah,
                bea: dataPIB[x].bea,
                total: convertTotal,
                currency_name: dataPIB[x].currency_name
            })
        }
        console.log(tmpDataPIB)
        setDataPIB(tmpDataPIB)
        setSubTotal(subTotal)
        setKurs(hasil)
        if (totalBea != 0) {
            klikTambahBea(totalBea, tmpDataPIB)

        }

    }

    function klikUbahPPh(value) {
        let hasil = value.replace('.', '').replace(/[^0-9\.]+/g, "");

        setTotalPph(hasil);

        let totalAkhir = Number(hasil) + Number(subTotal) + Number(totalBea) + Number(totalPpn);
        setTotalAkhir(totalAkhir);
    }

    function klikUbahPPn(value) {
        let hasil = value.replace('.', '').replace(/[^0-9\.]+/g, "");

        setTotalPpn(hasil);

        let totalAkhir = Number(hasil) + Number(subTotal) + Number(totalBea) + Number(totalPph);
        setTotalAkhir(totalAkhir);
    }

    function hapusFaktur(id) {
        setTampil(false)
        console.log(id)
        let total = 0;
        for (let x = 0; x < dataPIB.length; x++) {
            if (dataPIB[x].id_faktur == id) {
                total += 1
            }
        }
        for (let x = 0; x < dataPIB.length; x++) {
            if (dataFaktur[x] == id) {
                dataFaktur.splice(x, 1);
            }
            if (dataPIB[x].id_faktur == id) {
                dataPIB.splice(x, total)
            }
        }
        Swal.fire(
            "Berhasil",
            total + ` Data Berhasil Di hapus`,
            "success"
        ).then(() =>
            setTampil(true)
        );
    }

    const dataProduk =
        [...dataPIB.map((item, i) => ({
            nama: item.product_name,
            qty: item.quantity.replace('.', ','),
            hrg: <CurrencyFormat prefix={item.currency_name + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.price} key="total" />,
            uangasing: <CurrencyFormat prefix={item.currency_name + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.totalAsing.replace('.', ',')} key="total" />,
            rupiah: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.totalRupiah} key="total" />,
            bea: <CurrencyFormat prefix='Rp ' disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.bea).toFixed(2).replace('.', ',')} key="pay" />,
            total: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.', ',')} key="total" />,
            actn: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => hapusFaktur(item.id_faktur)}
                />
            </Space>,
        }))

        ]



    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append("tanggal", date);
        formData.append("nomor_pib", getCode);
        formData.append("bagan_akun", bankId);
        formData.append("nomor_bl", noBL);
        formData.append("mata_uang", mataUangId);
        formData.append("pemasok", supplierId);
        formData.append("kurs", kurs);
        formData.append("tanggal_tiba", tanggalTiba);
        formData.append("tanggal_awal_periode_pengiriman", estimasiAwal);
        formData.append("tanggal_akhir_periode_pengiriman", estimasiAkhir);
        formData.append("nama_kapal", namaKapal);
        formData.append("bea_masuk", totalBea);
        formData.append("pph", totalPph);
        formData.append("ppn", totalPpn);
        formData.append("referensi", referensi);
        formData.append("status", 'Submitted');
        for (let i = 0; i < dataFaktur.length; i++) {
            formData.append("id_faktur_pembelian[]", dataFaktur[i])
        }

        axios({
            method: "put",
            url: `${Url}/goods_import_declarations/${id}`,
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
                navigate("/pib");
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
        console.log(bankId)
        const formData = new URLSearchParams();
        formData.append("tanggal", date);
        formData.append("nomor_pib", getCode);
        formData.append("bagan_akun", bankId);
        formData.append("nomor_bl", noBL);
        formData.append("mata_uang", mataUangId);
        formData.append("pemasok", supplierId);
        formData.append("kurs", kurs);
        formData.append("tanggal_tiba", tanggalTiba);
        formData.append("tanggal_awal_periode_pengiriman", estimasiAwal);
        formData.append("tanggal_akhir_periode_pengiriman", estimasiAkhir);
        formData.append("nama_kapal", namaKapal);
        formData.append("bea_masuk", totalBea);
        formData.append("pph", totalPph);
        formData.append("ppn", totalPpn);
        formData.append("referensi", referensi);
        formData.append("status", 'Draft');
        console.log(dataFaktur)
        for (let i = 0; i < dataFaktur.length; i++) {
            formData.append("id_faktur_pembelian[]", dataFaktur[i])
        }

        axios({
            method: "put",
            url: `${Url}/goods_import_declarations/${id}`,
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
                navigate("/pib");
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
                title="Edit PIB">
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
                                    defaultValue={date}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. PIB</label>
                            <div className="col-sm-7">
                                <input
                                    defaultValue={getCode}
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
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">No B/L</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    onChange={(e) => setNoBL(e.target.value)}
                                    defaultValue={noBL}
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
                                    defaultInputValue={selectedMataUang}
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

                                <CurrencyFormat prefix='Rp ' className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={kurs} onKeyDown={(event) => klikEnter(event)} onChange={(e) => setUbahKurs(e.target.value)} key="total" />


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
                                    defaultValue={namaKapal}
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
                                    defaultValue={tanggalTiba}
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
                                    defaultValue={estimasiAwal}
                                    onChange={(e) => setEstimasiAwal(e.target.value)}
                                />
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    defaultValue={estimasiAkhir}
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
                                    defaultInputValue={selectedBank}
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
                                    defaultValue={referensi}
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
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Cari Faktur</label>
                        <div className="col-sm-5">

                            <ReactSelect

                                style={{ display: tampilTabel ? "block" : "none" }}
                                className="basic-single"
                                placeholder="Pilih Faktur..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsFaktur}
                                onChange={(e) => handleChangePilih(e)}
                            />
                        </div>

                    </div>
                    <Table
                        style={{ display: tampil ? "block" : "none" }}
                        // rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataProduk}
                        columns={columnProduk}
                        onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            // let totalAkhir = 0;
                            // let sisaAkhir = 0;
                            // pageData.forEach(({ sisa, pays }) => {
                            //     totalAkhir += Number(pays);
                            //     sisaAkhir += Number(sisa);
                            //     setTotalAkhir(totalAkhir)
                            //     setSisaAkhir(sisaAkhir)
                            // });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Sub Total</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={subTotal} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Biaya Masuk</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' className='text-center editable-input pib-currencyinput' thousandSeparator={'.'} decimalSeparator={','} value={totalBea} key="pay" onKeyDown={(event) => klikEnter(event)} onChange={(e) => klikTambahBea(e.target.value, dataPIB)} />


                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">PPN</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' className='text-center editable-input pib-currencyinput' onKeyDown={(event) => klikEnter(event)} thousandSeparator={'.'} decimalSeparator={','} value={totalPpn} onChange={(e) => klikUbahPPn(e.target.value)} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Pph 22</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' className='text-center editable-input pib-currencyinput' onKeyDown={(event) => klikEnter(event)} thousandSeparator={'.'} decimalSeparator={','} value={totalPph} onChange={(e) => klikUbahPPh(e.target.value)} key="pay" />

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


                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
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
                <div style={{ clear: 'both' }}></div>
            </form>

        </>
    )
}

export default EditPIB