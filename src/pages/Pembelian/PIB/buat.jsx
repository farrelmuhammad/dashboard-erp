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
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [currencyID, setCurrencyID] = useState();
    const [selectedMataUang, setSelectedMataUang] = useState('');
    const [selectedFaktur, setSelectedFaktur] = useState(null);
    const [selectedCOA, setSelectedCOA] = useState(null);
    const [selectedBiaya, setSelectedBiaya] = useState(null);
    const [supplierId, setSupplierId] = useState();
    // const [term, setTerm] = useState('CIF');
    const [biayaId, setBiayaId] = useState();
    const [nominal, setNominal] = useState();
    const [deskripsi, setDeskripsi] = useState()
    const [COAId, setCOAId] = useState();
    const [fakturId, setFakturId] = useState();
    const [getCode, setGetCode] = useState('');
    const [mataUangId, setMataUangId] = useState();

    const [selectedBank, setSelectedBank] = useState()
    const [bankId, setBankId] = useState()
    const [totalAkhir, setTotalAkhir] = useState('');
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
    const [term, setTerm] = useState('CIF');
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
    const [tampil, setTampil] = useState(true)
    const [dataBank, setDataBank] = useState([])

    const [labelCode, setLabelCode] = useState([])
    const [coe, setCoe] = useState()


    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }

    useEffect(() => {
        getNewCode()
    })

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
                    info: data[x].purchase_invoice_details,
                    term: data[x].term
                })
            }
            setOptionsFaktur(tmp)
            console.log(optionsFaktur)
            setLabelCode(tmp)

        }
        );
    }, [supplierId])



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
        console.log(value)
        setTerm(value.term)






        let dataDouble = [];
        // console.log(tampilProduk)
        for (let i = 0; i < tampilProduk.length; i++) {
            if (tampilProduk[i] == value.info[i]) {
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
            let newIdFaktur = [...dataFaktur];
            let tmpJumlah = [...jumlah];

            let tmpBea = [...bea]
            let tempTotal = [...totalRupiah]
            let subTotal = 0;
            newIdFaktur.push(value.value);

            for (let i = 0; i < value.info.length; i++) {
                newData.push(value.info[i])
                let hasil = kurs * value.info[i].total
                tmpBea.push(0)
                tmpJumlah.push(hasil)
                tempTotal.push(hasil)
            }
            console.log(newData)
            setSubTotal(subTotal)
            setTotalRupiah(tempTotal)
            setBea(tmpBea)
            setJumlah(tmpJumlah)
            setDataFaktur(newIdFaktur)
            setTampilProduk(newData);
            setSelectedMataUang(newData[0].currency_name)
            setMataUangId(newData[0].currency_id)

            //console.log(dataFaktur)
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
        console.log(value)
        setSelectedBank(value);
        setBankId(value.value);
    };

    const loadOptionsBank = () => {

        return axios.get(`${Url}/chart_of_accounts?induk=0&kode_kategori[]=111`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => console.log(res.data.data));
    };

    // const loadOptionsBank = (inputValue) => {
    //     return axios.get(`${Url}/chart_of_accounts?induk=0&kode_kategori[]=111&nama=${inputValue}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     }).then((res) => res.data.data);
    // };

    useEffect(() => {
        axios.get(`${Url}/select_chart_of_accounts?induk=0&kode_kategori[]=111`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => {
            let tmp = []
            //let data = res.data.data
            for (let x = 0; x < res.data.data.length; x++) {
                tmp.push({
                    value: res.data.data[x].id,
                    label: res.data.data[x].name,
                })
            }
            setDataBank(tmp)
            console.log(tmp)
            console.log(res)
            // setLabelCode(tmp)

        }
        );
    }, [])

    const columnProduk = [
        {
            title: "Nomor Faktur",
            width: "10%",
            dataIndex: 'code',
        },
        {
            title: 'Nama Produk',
            width: '10%',
            dataIndex: 'nama',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '10%',
            align: 'center',
        },
        // {
        //     title: 'Harga',
        //     dataIndex: 'hrg',
        //     width: '10%',
        //     align: 'center',
        // },
        {
            title: term,
            dataIndex: 'uangasing',
            width: '12%',
            align: 'center',

        },
        {
            title: 'Jumlah (Rp)',
            dataIndex: 'rupiah',
            width: '18%',
            align: 'center',
        },
        {
            title: 'Bea Masuk',
            dataIndex: 'bea',
            width: '18%',
            align: 'center',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '20%',
            align: 'center',

        },
        {
            title: 'Action',
            dataIndex: 'actn',
            width: '15%',
            align: 'center',

        },

    ];

    const [totalBea, setTotalBea] = useState(0)
    function klikTambahBea(value, rupiah) {
        let hasil = value.toString().replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
       console.log(value)
        setTotalBea(hasil)
        console.log(hasil)

        // menghitung sub total 
        let subTotal = 0;
        for (let x = 0; x < tampilProduk.length; x++) {
            subTotal = Number(subTotal) + Number(rupiah[x]);
        }
        setSubTotal(subTotal)

        // menghitung bea per produk 
        let beaProduk = 0;
        let tmpBea = [];
        let tmpTotal = [];
        for (let x = 0; x < tampilProduk.length; x++) {
            beaProduk = (Number(rupiah[x]) / Number(subTotal)) * Number(hasil)
            console.log(beaProduk)
            let convertBea = beaProduk.toFixed(2).replace('.', ',')
            let hitungTotal = Number(rupiah[x]) + Number(beaProduk.toFixed(2))

            let convertTotal = hitungTotal.toFixed(2).replace('.', ',')
            console.log(hitungTotal)
            tmpBea.push(convertBea)
            tmpTotal.push(convertTotal)
        }

        setBea(tmpBea)
        setJumlah(tmpTotal)
    }

    function setUbahKurs(value) {
        let hasil = value.toString().replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
        console.log(hasil)
        let tempRupiah = []
        let tempTotal = []
        let subTotal = 0;
        let hitungTotal = 0;
        for (let i = 0; i < tampilProduk.length; i++) {
            let hitungRupiah = Number(hasil) * Number(tampilProduk[i].total)
            if (bea[i] != 0) {
                hitungTotal = Number(hitungRupiah) + Number(bea[i].toString().replace(',', '.'))

            }
            hitungTotal = Number(hitungRupiah) + Number(bea[i])
            let convertTotal = hitungTotal.toFixed(2).replace('.', ',')
            subTotal = Number(subTotal) + Number(hitungRupiah);
            console.log(subTotal)
            tempRupiah.push(hitungRupiah)
            tempTotal.push(convertTotal)
        }

        setSubTotal(subTotal)
        setTotalRupiah(tempRupiah)
        // setJumlah(tempTotal)
        setKurs(hasil)
        if (totalBea != 0) {
            klikTambahBea(totalBea, tempRupiah)

        }

    }

    const [totalPph, setTotalPph] = useState(0)
    function klikUbahPPh(value) {
        let hasil = value.toString().replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');

        setTotalPph(hasil);
        console.log(value)

        let totalAkhir = Number(hasil) + Number(subTotal) + Number(totalBea) + Number(totalPpn);
        setTotalAkhir(totalAkhir);
    }

    function klikUbahPPn(value) {
        let hasil = value.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
        console.log(value)
        setTotalPpn(hasil);

        let totalAkhir = Number(hasil) + Number(subTotal) + Number(totalBea) + Number(totalPph);
        setTotalAkhir(totalAkhir);
        console.log(hasil)
        console.log(subTotal)
        console.log(totalBea)
        console.log(totalPph)
    }

    function hapusFaktur(id) {
        setTampil(false)
        // console.log(id)
        console.log(tampilProduk)
        let total = 0;
        for (let x = 0; x < tampilProduk.length; x++) {
            if (tampilProduk[x].purchase_invoice_id == id) {
                total += 1
            }
        }
        for (let x = 0; x < tampilProduk.length; x++) {
            if (dataFaktur[x] == id) {
                dataFaktur.splice(x, 1);
            }
            if (tampilProduk[x].purchase_invoice_id == id) {
                tampilProduk.splice(x, total)
            }
        }
        Swal.fire(
            "Berhasil",
            total + ` Data Berhasil Di hapus`,
            "success"
        ).then(() =>
            setTampil(true)
        );
        // console.log(tampilProduk[index])
    }


    function ambilCode(id) {
        for (let i = 0; i < optionsFaktur.length; i++) {
            if (optionsFaktur[i].value === id) {
                return (optionsFaktur[i].label)
            }
            else {
                null
            }
        }

    }


    const dataProduk =
        [...tampilProduk.map((item, i) => ({


            code: ambilCode(item.purchase_invoice_id),
            nama: item.product_name,
            qty: <CurrencyFormat disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.quantity).toFixed(2).replace('.',',')} />,
            // hrg: <CurrencyFormat prefix={item.currency_name + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.price} key="total" />,
            dsc: <CurrencyFormat prefix={item.currency_name + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.price} key="total" />,
            uangasing: <CurrencyFormat prefix={item.currency_name + ' '} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.total.replace('.', ',')} key="total" />,
            rupiah: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={totalRupiah[i]} key="total" />,
            bea: <CurrencyFormat prefix='Rp ' disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} value={bea[i]} key="pay" />,
            total: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={jumlah[i]} key="total" />,


            actn: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => hapusFaktur(item.purchase_invoice_id)}
                />
            </Space>,
        }))

        ]



    const handleSubmit = async (e) => {


        if (!date) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!supplierId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!noBL) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data No Bill of Lading kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!kurs) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kurs kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!namaKapal) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Nama Kapal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!tanggalTiba) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal Tiba kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!estimasiAwal) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!estimasiAkhir) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!bankId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!mataUangId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Mata Uang kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {



            e.preventDefault();
            const formData = new FormData();
            formData.append("tanggal", date);
            if (code) {
                formData.append("code", code);

            }
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
            console.log(dataFaktur)
            for (let i = 0; i < dataFaktur.length; i++) {
                formData.append("id_faktur_pembelian[]", dataFaktur[i])
            }

            axios({
                method: "post",
                url: `${Url}/goods_import_declarations`,
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
                            text: "Data Faktur belum dipilih, silahkan lengkapi datanya dan coba kembali",
                            // text: err.response.data.error,
                        });
                    } else if (err.request) {
                        console.log("err.request ", err.request);
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    } else if (err.message) {
                        // do something other than the other two
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    }
                });
        }
    };

    const handleDraft = async (e) => {

        
        console.log(selectedMataUang)
        console.log(bankId)

        if (!date) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!supplierId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!noBL) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data No Bill of Lading kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!kurs) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kurs kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!namaKapal) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Nama Kapal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!tanggalTiba) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal Tiba kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!estimasiAwal) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!estimasiAkhir) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!bankId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!mataUangId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Mata Uang kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {



            e.preventDefault();
            console.log(bankId)
            const formData = new FormData();
            if (code) {
                formData.append("code", code);

            }
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
                method: "post",
                url: `${Url}/goods_import_declarations`,
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
                            text: "Data Faktur belum dipilih, silahkan lengkapi datanya dan coba kembali",
                            // text: err.response.data.error.nama,
                        });
                    } else if (err.request) {
                        console.log("err.request ", err.request);
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    } else if (err.message) {
                        // do something other than the other two
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    }
                });
        }
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
                                    // value="Otomatis"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setCode(e.target.value)}
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
                                {/* 
                            <AsyncSelect

                                    cacheOptions
                                    defaultOptions
                                    defaultValue={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                    disabled
                                /> */}

                                <input
                                    type="Nama"
                                    defaultValue={selectedMataUang}
                                    disabled
                                    // getOptionLabel={(e) => e.name}
                                    // getOptionValue={(e) => e.id}
                                    className="form-control"
                                    id="inputNama3"
                                />

                                {/* <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    disabled
                                    value={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">

                                <CurrencyFormat prefix='Rp ' className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={kurs.toString().replace('.',',')} onKeyDown={(event) => klikEnter(event)} onChange={(e) => setUbahKurs(e.target.value)} key="total" />


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
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Periode Pengiriman </label>
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
                                <ReactSelect
                                    placeholder="Pilih Bank..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedBank}
                                    getOptionLabel={(e) => e.label}
                                    getOptionValue={(e) => e.value}
                                    options={dataBank}
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
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toFixed(2).replace('.', ',')} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Bea Masuk</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' className='text-center editable-input pib-currencyinput' thousandSeparator={'.'} decimalSeparator={','} value={totalBea.toString().replace('.',',')} key="pay" onKeyDown={(event) => klikEnter(event)} onChange={(e) => klikTambahBea(e.target.value, totalRupiah)} />


                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">PPN</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' className='text-center editable-input pib-currencyinput' onKeyDown={(event) => klikEnter(event)} thousandSeparator={'.'} decimalSeparator={','} value={totalPpn.toString().replace('.',',')} onChange={(e) => klikUbahPPn(e.target.value)} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">PPh 22</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' className='text-center editable-input pib-currencyinput' onKeyDown={(event) => klikEnter(event)} thousandSeparator={'.'} decimalSeparator={','} value={totalPph.toString().replace('.',',')} onChange={(e) => klikUbahPPh(e.target.value)} key="pay"
                                            />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Total (Rp)</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(totalAkhir).toFixed(2).replace('.', ',')} key="pay" />

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
                    {/* <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>

        </>
    )
}

export default BuatPIB