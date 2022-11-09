import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';


const EditFakturPembelian = () => {
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
    const [loading, setLoading] = useState(true)
    const [optionsCredit, setOptionCredit] = useState([]);
    const [optionsType, setOptionsType] = useState([]);
    const [idTandaTerima, setIdTandaTerima] = useState([])
    const [modal2Visible, setModal2Visible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();

    //state return data from database
    const [jatuhTempo, setJatuhTempo] = useState(null);
    const [supplierId, setSupplierId] = useState();

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [dataHeader, setDataHeader] = useState([])
    const [dataSupplier, setDataSupplier] = useState()
    const [dataBarang, setDataBarang] = useState([])
    const [biaya, setBiaya] = useState([])
    const [credit, setCredit] = useState([])
    const [tampilCOA, setTampilCOA] = useState([]);
    const [mataUang, setMataUang] = useState('Rp ')
    const [term, setTerm] = useState();
    const [muatan, setMuatan] = useState();
    const [ctn, setCtn] = useState();
    const [alamat, setAlamat] = useState();
    const [kontainer, setKontainer] = useState()
    const [loadingTable, setLoadingTable] = useState(false);
    const [idCOA, setIdCOA] = useState([]);
    const [idCredit, setIdCredit] = useState([]);
    // const [tampilCOA, setTampilCOA] = useState([]);
    const [tampilCredit, setTampilCredit] = useState([])
    const [totalCOA, setTotalCOA] = useState('');
    const [totalCredit, setTotalCredit] = useState('');
    const [uangMuka, setUangMuka] = useState(0);
    const [tampilTabel, setTampilTabel] = useState(true)
    const [data, setData] = useState([])
    const [getDataProductImpor, setGetDataProductImpor] = useState();
    const [getDataProduct, setGetDataProduct] = useState();
    const [totalKeseluruhan, setTotalKeseluruhan] = useState(0);
    // const [dataSupplier, setDataSupplier] = useState([]);
    const [getStatus, setGetStatus] = useState()
    const [modalListLokal, setModalListLokal] = useState(false);
    const [modalListImpor, setModalListImpor] = useState(false);

    useEffect(() => {
        getDataFaktur();
        getAkun()
        getCredit()
    }, [])
    useEffect(()=> {
        getCredit()

    }, [supplierId])
    const getDataFaktur = async () => {
        await axios.get(`${Url}/select_purchase_invoices/dua?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data[0]
                setDataHeader(getData);
                setSubTotal(getData.subtotal)
                setGrandTotal(getData.total)
                setCode(getData.code)
                setUangMuka(getData.down_payment);
                setTotalPpn(getData.ppn);
                setGetStatus(getData.status)
                let total = Number(getData.ppn) - Number(getData.down_payment) + Number(getData.subtotal) - Number(getData.discount)
                setTotalKeseluruhan(total)
                setGrandTotalDiscount(getData.discount)
                setGrup(getData.supplier._group)
                if (getData.notes) {
                    setDescription(getData.notes)
                }
                setDataSupplier(getData.supplier)
                setSupplierId(getData.supplier_id)
                setDataBarang(getData.purchase_invoice_details)
                setTerm(getData.term)
                console.log(getData.purchase_invoice_details)


                // setting dat aakun 
                let tmpAkun = []
                let listAkun = getData.purchase_invoice_costs;
                let totalCOA = 0
                console.log(listAkun)
                for (let i = 0; i < listAkun.length; i++) {
                    tmpAkun.push({

                        id: listAkun[i].chart_of_account_id,
                        code: listAkun[i].chart_of_account.code,
                        name: listAkun[i].description,
                        jumlah: listAkun[i].total,
                    })
                    totalCOA = totalCOA + Number(listAkun[i].total);

                }
                setTotalCOA(totalCOA)
                setTampilCOA(tmpAkun)

                // setting data credit 
                let tmpCredit = []
                let listCredit = getData.purchase_invoice_credit_notes
                console.log(listCredit)
                let totalCredit = 0
                console.log(listAkun)
                for (let i = 0; i < listCredit.length; i++) {
                    tmpCredit.push({
                        id: listCredit[i].credit_note_id,
                        code: listCredit[i].credit_note_code,
                        deskripsi: listCredit[i].credit_note.description,
                        jumlah: listCredit[i].credit_note.nominal,
                    })
                    totalCredit = totalCredit + Number(listCredit[i].total);

                }
                setTotalCredit(totalCredit)
                console.log(tmpCredit)
                setTampilCredit(tmpCredit)




                // setting data produk
                let updatedList = getData.purchase_invoice_details
                let tmpData = []
                let tmpTandaTerima = []
                for (let i = 0; i < updatedList.length; i++) {
                    updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                    tmpData.push(
                        {
                            id: updatedList[i].product_id,
                            product_name: updatedList[i].product_name,
                            quantity: updatedList[i].quantity,
                            price: updatedList[i].price,
                            discount_percentage: updatedList[i].discount_percentage,
                            fixed_discount: updatedList[i].fixed_discount,
                            subtotal: updatedList[i].subtotal,
                            pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                            currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                            unit: updatedList[i].unit,
                            total: updatedList[i].total

                        })
                }
                setData(tmpData);


                console.log(getData.goods_receipts)

                // setting id penerimaan barang 
                let listPenerimaanBarang = []
                if (getData.goods_receipts.length != 0) {
                    listPenerimaanBarang = getData.goods_receipts
                }
                else {
                    listPenerimaanBarang = getData.purchase_orders

                }

                for (let i = 0; i < listPenerimaanBarang.length; i++) {
                    tmpTandaTerima.push(listPenerimaanBarang[i].id)
                }
                console.log(tmpTandaTerima)
                setIdTandaTerima(tmpTandaTerima)



                if (getData.purchase_invoice_details[0].currency_name) {

                    setMataUang(getData.purchase_invoice_details[0].currency_name)
                }
                console.log(getData.purchase_invoice_details)
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/purchase_invoices_available_goods_receipts?kode=${query}&id_pemasok=${supplierId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplierId])

    useEffect(() => {
        const getProductImpor = async () => {
            const res = await axios.get(`${Url}/purchase_invoices_available_purchase_orders?kode=${query}&id_pemasok=${supplierId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProductImpor(res.data.data);
        };

        if (query.length === 0 || query.length > 2) getProductImpor();
    }, [query, supplierId])


    useEffect(() => {
        if (grup == "Impor") {
            setImpor(true);
        }
        else {
            setImpor(false);
        }

    }, [grup])

    function tambahUangMuka(value) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replace(',', '.');
        setUangMuka(hasil);
        let totalAkhir = subTotal - grandTotalDiscount - Number(hasil) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
        console.log(totalAkhir)
    }
    function tambahPPN(value) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replace(',', '.');
        setTotalPpn(hasil)
        let totalAkhir = subTotal - grandTotalDiscount - Number(uangMuka) + Number(totalCOA) + Number(hasil) - Number(totalCredit)
        console.log(totalAkhir)

        setTotalKeseluruhan(totalAkhir)
    }


    function getAkun() {
        let tmp = [];
        axios.get(`${Url}/filter_chart_of_accounts?induk=0&kode_kategori[]=511&kode_kategori[]=512&kode_kategori[]=611&kode_kategori[]=612&kode_kategori[]=811`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((res) => {
                for (let i = 0; i < res.data.length; i++) {

                    tmp.push({
                        value: res.data[i].id,
                        label: res.data[i].name,
                        info: res.data[i]
                    });
                }
                setOptionsType(tmp);
            })
    }


    function getCredit() {
        let tmp = [];
        axios.get(`${Url}/purchase_invoices_available_credit_notes?id_pemasok=${supplierId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((res) => {
                for (let i = 0; i < res.data.data.length; i++) {

                    tmp.push({
                        value: res.data.data[i].id,
                        label: res.data.data[i].code,
                        info: res.data.data[i]
                    });
                }
                setOptionCredit(tmp);
            })
    }

    function klikPilihAkun(value) {

        let dataDouble = [];

        for (let i = 0; i < tampilCOA.length; i++) {
            if (tampilCOA[i].id == value.info.id) {
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

            let newData = [...tampilCOA];

            newData.push({
                id: value.info.id,
                code: value.info.code,
                name: value.info.name,
                jumlah: 0,
            })
            setIdCOA(value.value);
            setTampilCOA(newData);

        }




    }


    function klikCreditNote(value) {

        console.log(value.info.id)
        let dataDouble = [];

        for (let i = 0; i < tampilCredit.length; i++) {
            console.log(tampilCredit[i].id)


            if (tampilCredit[i].id == value.info.id) {
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
            let newData = [...tampilCredit];
            console.log(value.info)

            newData.push({
                id: value.info.id,
                code: value.info.code,
                deskripsi: value.info.description,
                jumlah: value.info.nominal,
            })
            setIdCredit(value.value);
            setTampilCredit(newData);
        }



    }

    function hapusCOA(i) {

        setTampilTabel(false)
        let totcoa = []

        if (tampilCOA.length == 1) {
            setTampilCOA([])
            totcoa = 0;
        }
        else {
            tampilCOA.splice(i, 1);
            for (let i = 0; i < tampilCOA.length; i++) {
                totcoa = totcoa + Number(tampilCOA[i].jumlah);

            }

        }
        let totalAkhir = grandTotal - Number(uangMuka) + Number(totcoa) + Number(totalPpn) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
        setTotalCOA(totcoa)

        Swal.fire(
            "Berhasil",
            `Data Berhasil Di hapus`,
            "success"
        ).then(() =>
            setTampilTabel(true)
        );

    }

    function hapusCredit(i) {
        setTampilTabel(false)

        let tmp = []
        let totcredit = []
        if (tampilCredit.length == 1) {
            setTampilCredit([])

            totcredit = 0;
        }
        else {
            tampilCredit.splice(i, 1);
            for (let i = 0; i < tampilCredit.length; i++) {
                totcredit = totcredit + Number(tampilCredit[i].jumlah);

            }

        }

        let totalAkhir = grandTotal - Number(uangMuka) - Number(totcredit) + Number(totalPpn) + Number(totalCOA)
        setTotalKeseluruhan(totalAkhir)
        setTotalCredit(totcredit)

        Swal.fire(
            "Berhasil",
            `Data Berhasil Di hapus`,
            "success"
        ).then(() =>
            setTampilTabel(true)
        );

    }

    function ubahCOA(value, id) {
        // console.log(tampilCOA)
        let hasil = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replace(',', '.');

        let tmp = []
        let totalAkhir = 0;
        let totalCOA = 0;
        for (let i = 0; i < tampilCOA.length; i++) {
            if (i == id) {
                tmp.push({
                    id: tampilCOA[i].id,
                    code: tampilCOA[i].code,
                    name: tampilCOA[i].name,
                    jumlah: hasil,
                })
                totalCOA = totalCOA + Number(hasil);
            }
            else {
                tmp.push(tampilCOA[i])
                totalCOA = totalCOA + Number(tampilCOA[i].jumlah);
            }
        }

        totalAkhir = subTotal - grandTotalDiscount - Number(uangMuka) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)

        console.log(totalAkhir)

        setTotalKeseluruhan(totalAkhir)
        setTotalCOA(totalCOA)
        setTampilCOA(tmp)
    }

    function ubahCredit(value, id) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");

        let tmp = []
        let totalAkhir = 0;
        let totalCredit = 0;
        for (let i = 0; i < tampilCredit.length; i++) {
            if (i == id) {
                tmp.push({
                    id: tampilCredit[i].id,
                    code: tampilCredit[i].code,
                    deskripsi: tampilCredit[i].deskripsi,
                    jumlah: value,
                })
                totalCredit = totalCredit + Number(hasil);
            }
            else {
                tmp.push(tampilCredit[i])
                totalCredit = totalCredit + Number(tampilCredit[i].jumlah);
            }
        }
        console.log(grandTotal)
        console.log(grandTotalDiscount)
        console.log(uangMuka)
        console.log(totalCOA)
        console.log(totalPpn)
        totalAkhir = subTotal - grandTotalDiscount - Number(uangMuka) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)

        // totalAkhir = Number(grandTotal) - Number(grandTotalDiscount) + Number(uangMuka) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)

        // totalAkhir = grandTotal - Number(uangMuka) - Number(totalCredit) + Number(totalPpn) + Number(totalCOA)
        setTotalKeseluruhan(totalAkhir)
        setTotalCredit(totalCredit)
        setTampilCredit(tmp)
    }


    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }



    function klikUbahData(y, value, key) {
        console.log(dataBarang)
        let tmpData = [];
        if (key == 'qty') {
            let hasil = value.replaceAll('.', '');
            for (let i = 0; i < data.length; i++) {
                if (i == y) {
                    tmpData.push(
                        {
                            id: data[i].id,
                            product_name: data[i].product_name,
                            quantity: hasil,
                            price: data[i].price,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: data[i].pilihanDiskon,
                            currency_name: data[i].currency_name,
                            unit: data[i].unit,
                            total: data[i].total

                        })
                }
                else {
                    tmpData.push(data[i]);
                }

            }
            setData(tmpData);
            // setDataBarang(tmpData)
            console.log(tmpData)
        }
        else if (key == 'price') {
            let hasil = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replace(',', '.');

            for (let i = 0; i < data.length; i++) {
                if (i == y) {

                    tmpData.push(
                        {

                            id: data[i].id,
                            product_name: data[i].product_name,
                            quantity: data[i].quantity,
                            price: hasil,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: data[i].pilihanDiskon,
                            currency_name: data[i].currency_name,
                            unit: data[i].unit,
                            total: data[i].total



                        })
                }
                else {
                    tmpData.push(data[i]);
                }

                // }
                setData(tmpData);
                // setDataBarang(tmpData)

            }
        }
        else if (key == 'diskonValue') {
            if (data[y].pilihanDiskon == 'nominal') {
                // let hasil = value.replaceAll('.', '');
                let hasil = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "").replace(',', '.');


                for (let i = 0; i < data.length; i++) {
                    if (i == y) {
                        tmpData.push(
                            {

                                id: data[i].id,
                                product_name: data[i].product_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: data[i].discount_percentage,
                                fixed_discount: hasil,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: data[i].pilihanDiskon,
                                currency_name: data[i].currency_name,
                                unit: data[i].unit,
                                total: data[i].total


                            })
                    }

                    else {
                        tmpData.push(data[i]);
                    }

                }
                // setDataBarang(tmpData)

                setData(tmpData);
            }
            else {

                let hasil = value.replaceAll('.', '');
                console.log(hasil)

                for (let i = 0; i < data.length; i++) {

                    if (i == y) {
                        tmpData.push(
                            {
                                id: data[i].id,
                                product_name: data[i].product_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: hasil,
                                fixed_discount: data[i].fixed_discount,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: 'persen',
                                currency_name: data[i].currency_name,
                                unit: data[i].unit,
                                total: data[i].total


                            })
                    }

                    else {
                        tmpData.push(data[i]);
                    }

                }
                setData(tmpData);
                // setDataBarang(tmpData)

            }
        }
        else if (key == 'pilihanDiskon') {
            for (let i = 0; i < data.length; i++) {
                if (i == y) {
                    tmpData.push(
                        {
                            id: data[i].id,
                            product_name: data[i].product_name,
                            quantity: data[i].quantity,
                            price: data[i].price,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: value,
                            currency_name: data[i].currency_name,
                            unit: data[i].unit,
                            total: data[i].total

                        })
                }
                else {
                    tmpData.push(data[i]);
                }

            }
            setData(tmpData)
        }

        // ubah total 
        console.log(totalKeseluruhan)
        let grandTotal;
        let dataBaru = tmpData[0]
        let arrTotal = [];
        let tmpTotal = []
        for (let i = 0; i < tmpData.length; i++) {
            if (i == y) {
                if (tmpData[i].pilihanDiskon == 'persen') {
                    let total = tmpData[i].quantity.replace(',', '.') * Number(tmpData[i].price);

                    let getPercent = (Number(total) * tmpData[i].discount_percentage.replace(',', '.')) / 100;
                    grandTotal = total - Number(getPercent);
                }
                else if (tmpData[i].pilihanDiskon == 'nominal') {
                    grandTotal = (Number(tmpData[i].quantity.replace(',', '.')) * Number(tmpData[i].price)) - tmpData[i].fixed_discount;
                }
                else {
                    grandTotal = tmpData[i].quantity.replace(',', '.') * Number(tmpData[i].price);
                }
                arrTotal.push(
                    {
                        id: tmpData[i].id,
                        product_name: tmpData[i].product_name,
                        quantity: tmpData[i].quantity,
                        price: tmpData[i].price,
                        discount_percentage: tmpData[i].discount_percentage,
                        fixed_discount: tmpData[i].fixed_discount,
                        subtotal: tmpData[i].subtotal,
                        pilihanDiskon: tmpData[i].pilihanDiskon,
                        currency_name: tmpData[i].currency_name,
                        unit: tmpData[i].unit,
                        total: grandTotal

                    })
            }
            else {
                arrTotal.push(tmpData[i])

            }
        }

        console.log(arrTotal)
        setProduct(arrTotal)
        calculate(arrTotal);
        setData(arrTotal)
    }

    const calculate = (data) => {
        // console.log(data)
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        for (let x = 0; x < data.length; x++) {
            // for (let y = 0; y < data[x].length; y++) {
            total += (Number(data[x].quantity.replace(',', '.')) * Number(data[x].price));
            totalPerProduk = (Number(data[x].quantity.replace(',', '.')) * Number(data[x].price));

            console.log(total)
            if (data[x].pilihanDiskon == 'persen') {
                hasilDiskon += (Number(totalPerProduk) * Number(data[x].discount_percentage.replace(',', '.')) / 100);
            }
            else if (data[x].pilihanDiskon == 'nominal') {

                hasilDiskon += Number(data[x].fixed_discount);
            }


            grandTotal = total - hasilDiskon;
            // }
        }
        // console.log(hasilDiskon);
        let totalAkhir = Number(grandTotal) - Number(uangMuka) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
        console.log(totalAkhir)
        setSubTotal(total)
        setGrandTotalDiscount(hasilDiskon);
        setGrandTotal(grandTotal);
    }

    const defaultColumns = [
        {
            title: 'Nama Produk',
            dataIndex: 'nama',
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
            title: 'Stn',
            dataIndex: 'stn',
            width: '5%',
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
            title: 'Harga',
            dataIndex: 'price',
            width: '15%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Discount',
            dataIndex: 'disc',
            width: '16%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '20%',
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

    ];



    const dataTBPenerimaan =
        [...data.map((item, i) => ({
            nama: item.product_name,
            qty: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.quantity.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "qty")} key="qty" />,
            stn: item.unit,
            price:
                // <div className='d-flex'>
                //     <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={data[i].currency_name + ' '} onKeyDown={(event) => klikEnter(event)} value={Number(item.price).toFixed(2).replace('.',',')} onChange={(e) => klikUbahData(i, e.target.value, "price")} />
                // </div>
                grup === 'Lokal' ?
                    < CurrencyFormat className=' text-start  editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.price.replace('.', ',')} key="diskon" onChange={(e) => klikUbahData(i, e.target.value, "price")} />
                    : < CurrencyFormat className=' text-start  editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.price.replace('.', ',')} key="diskon" onChange={(e) => klikUbahData(i, e.target.value, "price")} />


            ,

            disc:
                item.pilihanDiskon == 'noDisc' ?
                    <div className='d-flex p-1' style={{ height: "100%" }}>
                        <input onKeyDown={(event) => klikEnter(event)} style={{ width: "70%", fontSize: "10px!important" }} type="text" className="text-center editable-input" defaultValue={item.discount_percentage.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} />
                        <div className="input-group-prepend"  >
                            <select
                                onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                                id="grupSelect"
                                className="form-select select-diskon"
                            >
                                <option selected value="persen" >
                                    %
                                </option>
                                <option value="nominal">
                                    {item.currency_name}
                                </option>
                            </select>
                        </div>
                    </div> :
                    item.pilihanDiskon == 'persen' ?
                        <div className='d-flex p-1' style={{ height: "100%" }} >
                            <CurrencyFormat className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.discount_percentage.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />
                            <div className="input-group-prepend" >
                                <select
                                    onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                                    id="grupSelect"
                                    className="form-select select-diskon"
                                >
                                    <option selected value="persen" >
                                        %
                                    </option>
                                    <option value="nominal">
                                        {item.currency_name}
                                    </option>
                                </select>
                            </div>
                        </div>
                        :
                        item.pilihanDiskon == 'nominal' ?
                            <div className='d-flex p-1' style={{ height: "100%" }}>
                                {
                                    grup === 'Lokal' ?
                                        < CurrencyFormat className=' text-start editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.fixed_discount.replace('.', ',')} key="diskon" onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} />
                                        : < CurrencyFormat className=' text-start  editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.fixed_discount.replace('.', ',')} key="diskon" onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} />

                                }

                                {/* <CurrencyFormat className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(item.fixed_discount).toFixed(2).replace('.',',')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" /> */}

                                <div className="input-group-prepend" >
                                    <select
                                        onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                                        id="grupSelect"
                                        className="form-select select-diskon"
                                    >
                                        <option value="persen" >
                                            %
                                        </option>
                                        <option selected value="nominal">
                                            {item.currency_name}
                                        </option>
                                    </select>
                                </div>
                            </div> : null,
            //     {
            //         item.discount_percentage == 0 && item.fixed_discount == 0 ? <div>-</div> :
            //             item.discount_percentage != 0 ?
            //                 <div className='d-flex p-1' style={{ height: "100%" }} >
            //                     <input disabled className=' text-center editable-input edit-disabled' value={item.discount_percentage.replace('.', ',')} key="diskon" />

            //                     <option selected value="persen" > %</option>
            //                 </div> :
            //                 item.fixed_discount != 0 ?
            //                     <div className='d-flex p-1' style={{ height: "100%" }}>
            //                         <CurrencyFormat disabled className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={item.fixed_discount} key="diskon" />

            //                         <option selected value="nominal">{mataUang}</option>


            //                     </div> : null
            //     }

            // </>,
            total:

                grup === 'Lokal' ?
                    < CurrencyFormat disabled className=' text-start editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.', ',')} key="diskon" />
                    : < CurrencyFormat disabled className=' text-start  editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toLocaleString('id')} key="diskon" />


        }))

        ]




    const convertToRupiah = (angka) => {
        // console.log(angka)
        // let hasil = mataUang + ' ' + Number(angka).toLocaleString('id')
        // return <input
        //     disabled
        //     value={hasil}
        //     readOnly="true"
        //     className="form-control form-control-sm"
        //     id="colFormLabelSm"
        // />

        return <>
            {
                grup === 'Lokal' ?
                    < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input disabled value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                    : < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input disabled value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
            }
        </>
    }

    const convertToRupiah2 = (angka) => {
        // console.log(angka)
        // let hasil = mataUang + ' ' + Number(angka).toLocaleString('id')
        // return <input
        //     disabled
        //     value={hasil}
        //     readOnly="true"
        //     className="form-control form-control-sm"
        //     id="colFormLabelSm"
        // />

        return <>
            {
                grup === 'Lokal' ?
                    < CurrencyFormat className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
                    : < CurrencyFormat className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />
            }
        </>
    }



    const columnsModal = [
        {
            title: 'No. Penerimaan Barang',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            align: 'center',
            dataIndex: 'supplier_name',
        },
        {
            title: 'Total',
            align: 'center',
            dataIndex: 'total',
            render: (text, record, index) => (
                <>
                    {getDataProduct[index].goods_receipt_details.length}
                </>
            )
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

    const columnsModalImpor = [
        {
            title: 'No. Pesanan',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Catatan',
            dataIndex: 'notes',
            width: '30%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '8%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Checkbox
                        // style={{ display: tampilCek ? "block" : "none"}}
                        value={record}
                        onChange={handleCheck}
                    />
                </>
            )
        },
    ];

    const columAkun = [
        {
            title: 'No.',
            dataIndex: 'noakun',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Deskripsi',
            dataIndex: 'desc',
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '14%',
            align: 'center',
        }
    ];


    const dataAkun =
        [...tampilCOA.map((item, i) => ({
            noakun: item.code,
            desc: item.name,
            total:
                <div className='d-flex'>
                    {
                        // grup === 'Lokal' ?
                        <CurrencyFormat
                            className=' text-center editable-input'
                            style={{ width: "100%", padding: "0px" }}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            prefix={mataUang + ' '}
                            onKeyDown={(event) => klikEnter(event)}
                            value={item.jumlah.replace('.', ',')}
                            onChange={(e) => ubahCOA(e.target.value, i)} key="coa" />
                        //     :


                        // <CurrencyFormat
                        //     className=' text-center editable-input'
                        //     style={{ width: "100%", padding: "0px" }}
                        //     thousandSeparator={'.'}
                        //     decimalSeparator={','}
                        //     prefix={mataUang + ' '}
                        //     onKeyDown={(event) => klikEnter(event)}
                        //     value={item.jumlahtoLocaleString('id')}
                        //     onChange={(e) => ubahCOA(e.target.value, i)} key="coa" />
                    }
                </div>,
            action: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => hapusCOA(i)}
                />
            </Space>,
        }))
        ]

    const dataCredit =
        [...tampilCredit.map((item, i) => ({
            noakun: item.code,
            desc: item.deskripsi,
            total:
                <div className='d-flex'>
                    {
                        grup === 'Lokal' ?
                            <CurrencyFormat
                                className=' text-center editable-input'
                                style={{ width: "100%", padding: "0px" }}
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                prefix={mataUang + ' '}
                                onKeyDown={(event) => klikEnter(event)}
                                value={Number(item.jumlah).toFixed(2).replace('.', ',')}
                                onChange={(e) => ubahCredit(e.target.value, i)} key="credit" disabled /> :

                            <CurrencyFormat
                                className=' text-center editable-input'
                                style={{ width: "100%", padding: "0px" }}
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                prefix={mataUang + ' '}
                                onKeyDown={(event) => klikEnter(event)}
                                value={Number(item.jumlah).toLocaleString('id')}
                                onChange={(e) => ubahCredit(e.target.value, i)} key="credit" disabled />
                    }

                </div>,
            action: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => hapusCredit(i)}
                />
            </Space>,

        }))

        ]

    // const handleCheck = (event) => {

    //     let tmpData = [];
    //     if (event.target.checked) {
    //         var idTerima = [...idTandaTerima];
    //         idTerima = [...idTandaTerima, event.target.value.id];
    //         setIdTandaTerima(idTerima);
    //         var updatedList;

    //         console.log(updatedList)
    //         var strParams;
    //         for (let i = 0; i < idTerima.length; i++) {
    //             if (i == 0) {
    //                 strParams = "id_tanda_terima_barang[]=" + idTerima[i]
    //             }
    //             else {
    //                 strParams = strParams + "&id_tanda_terima_barang[]=" + idTerima[i]
    //             }

    //         }

    //         axios.get(`${Url}/purchase_invoices_grouped_goods_receipt_details?${strParams}`, {
    //             headers: {
    //                 Accept: "application/json",
    //                 Authorization: `Bearer ${auth.token}`,
    //             },
    //         })
    //             .then((res) => {
    //                 updatedList = res.data.details;
    //             })
    //             .then(() => {
    //                 for (let i = 0; i < updatedList.length; i++) {
    //                     updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
    //                     tmpData.push(
    //                         {
    //                             id: updatedList[i].product_id,
    //                             product_name: updatedList[i].product_name,
    //                             quantity: updatedList[i].quantity,
    //                             price: updatedList[i].price,
    //                             discount_percentage: updatedList[i].discount_percentage,
    //                             fixed_discount: updatedList[i].fixed_discount,
    //                             subtotal: updatedList[i].subtotal,
    //                             pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
    //                             currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
    //                             unit: updatedList[i].unit,
    //                             total: updatedList[i].total

    //                         }
    //                     )

    //                 }
    //                 console.log(tmpData)
    //                 setData(tmpData)
    //                 calculate(tmpData)
    //                 console.log(tmpData)


    //             })
    //     }
    //     else {
    //         for (let i = 0; i < idTandaTerima.length; i++) {
    //             if (event.target.value.id == idTandaTerima[i]) {
    //                 idTandaTerima.splice(i, 1);
    //             }
    //         }

    //         if (idTandaTerima.length != 0) {
    //             var strParams;
    //             for (let i = 0; i < idTandaTerima.length; i++) {
    //                 if (i == 0) {
    //                     strParams = "id_tanda_terima_barang[]=" + idTandaTerima[i]
    //                 }
    //                 else {
    //                     strParams = strParams + "&id_tanda_terima_barang[]=" + idTandaTerima[i]
    //                 }

    //             }

    //             // for (let i = 0; i < idTandaTerima.length; i++) {
    //             axios.get(`${Url}/purchase_invoices_grouped_goods_receipt_details?${strParams}`, {
    //                 headers: {
    //                     Accept: "application/json",
    //                     Authorization: `Bearer ${auth.token}`,
    //                 },
    //             })
    //                 .then((res) => {

    //                     updatedList = res.data.details;
    //                 })
    //                 .then(() => {

    //                     for (let i = 0; i < updatedList.length; i++) {
    //                         tmpData.push(
    //                             {
    //                                 id: updatedList[i].product_id,
    //                                 product_name: updatedList[i].product_name,
    //                                 quantity: updatedList[i].quantity,
    //                                 price: updatedList[i].price,
    //                                 discount_percentage: updatedList[i].discount_percentage,
    //                                 fixed_discount: updatedList[i].fixed_discount,
    //                                 subtotal: updatedList[i].subtotal,
    //                                 pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
    //                                 currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
    //                                 unit: updatedList[i].unit,
    //                                 total: updatedList[i].total

    //                             }
    //                         )

    //                     }

    //                     setData(tmpData)
    //                     calculate(tmpData)
    //                 })

    //         }
    //         else {
    //             tmpData.push()
    //             setData(tmpData);
    //         }

    //     }

    //     setProduct(tmpData);
    //     console.log(tmpData)
    //     // console.log(updatedList)

    //     console.log(tmpData)
    // };


    const handleCheck = (event) => {
        setLoadingTable(true)
        let tmpData = [];
        if (event.target.checked) {
            var idTerima = [...idTandaTerima];
            idTerima = [...idTandaTerima, event.target.value.id];
            setIdTandaTerima(idTerima);
            var updatedList;

            // console.log(updatedList)
            var strParams;
            if (grup == "Lokal") {
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_tanda_terima_barang[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_tanda_terima_barang[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/purchase_invoices_grouped_goods_receipt_details?${strParams}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                })
                    .then((res) => {
                        updatedList = res.data.details;
                    })
                    .then(() => {
                        for (let i = 0; i < updatedList.length; i++) {
                            updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_name: updatedList[i].product_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: updatedList[i].fixed_discount,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                    currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData)
                    })

            }

            else if (grup == "Impor") {
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_pesanan_pembelian[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_pesanan_pembelian[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/purchase_invoices_grouped_purchase_order_details?${strParams}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${auth.token}`,
                    },
                })
                    .then((res) => {
                        updatedList = res.data.details;
                    })
                    .then(() => {
                        for (let i = 0; i < updatedList.length; i++) {
                            updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_name: updatedList[i].product_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: updatedList[i].fixed_discount,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                    currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData)
                    })
            }

            setProduct(tmpData);
            console.log(tmpData)

        }
        else {
            for (let i = 0; i < idTandaTerima.length; i++) {
                if (event.target.value.id == idTandaTerima[i]) {
                    idTandaTerima.splice(i, 1);
                }
            }

            if (grup == "Lokal") {
                if (idTandaTerima.length != 0) {
                    var strParams;
                    for (let i = 0; i < idTandaTerima.length; i++) {
                        if (i == 0) {
                            strParams = "id_tanda_terima_barang[]=" + idTandaTerima[i]
                        }
                        else {
                            strParams = strParams + "&id_tanda_terima_barang[]=" + idTandaTerima[i]
                        }

                    }

                    axios.get(`${Url}/purchase_invoices_grouped_goods_receipt_details?${strParams}`, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${auth.token}`,
                        },
                    })
                        .then((res) => {

                            updatedList = res.data.details;
                        })
                        .then(() => {

                            for (let i = 0; i < updatedList.length; i++) {
                                tmpData.push(
                                    {
                                        id: updatedList[i].product_id,
                                        product_name: updatedList[i].product_name,
                                        quantity: updatedList[i].quantity,
                                        price: updatedList[i].price,
                                        discount_percentage: updatedList[i].discount_percentage,
                                        fixed_discount: updatedList[i].fixed_discount,
                                        subtotal: updatedList[i].subtotal,
                                        pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                        currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                                        unit: updatedList[i].unit,
                                        total: updatedList[i].total

                                    }
                                )

                            }

                            setData(tmpData)
                            calculate(tmpData)
                        })

                }
                else {
                    tmpData.push()
                    setData(tmpData);
                }
            }
            else if (grup == "Impor") {
                if (idTandaTerima.length != 0) {
                    var strParams;
                    for (let i = 0; i < idTandaTerima.length; i++) {
                        if (i == 0) {
                            strParams = "id_pesanan_pembelian[]=" + idTandaTerima[i]
                        }
                        else {
                            strParams = strParams + "&id_pesanan_pembelian[]=" + idTandaTerima[i]
                        }

                    }

                    axios.get(`${Url}/purchase_invoices_grouped_purchase_order_details?${strParams}`, {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${auth.token}`,
                        },
                    })
                        .then((res) => {

                            updatedList = res.data.details;
                        })
                        .then(() => {

                            for (let i = 0; i < updatedList.length; i++) {
                                tmpData.push(
                                    {
                                        id: updatedList[i].product_id,
                                        product_name: updatedList[i].product_name,
                                        quantity: updatedList[i].quantity,
                                        price: updatedList[i].price,
                                        discount_percentage: updatedList[i].discount_percentage,
                                        fixed_discount: updatedList[i].fixed_discount,
                                        subtotal: updatedList[i].subtotal,
                                        pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                        currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                                        unit: updatedList[i].unit,
                                        total: updatedList[i].total

                                    }
                                )

                            }

                            setData(tmpData)
                            calculate(tmpData)
                        })

                }
                else {
                    tmpData.push()
                    setData(tmpData);
                }
            }
            setProduct(tmpData);



        }

        setLoadingTable(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append("tanggal", dataHeader.date);
        formData.append("kode", code);
        formData.append("pemasok", dataHeader.supplier_id);
        formData.append("catatan", description);
        formData.append("ppn", totalPpn);
        formData.append("muatan", dataHeader.payload);
        formData.append("karton", dataHeader.carton);
        // formData.append("term", term);
        formData.append("uang_muka", uangMuka);
        formData.append("tanggal_jatuh_tempo", dataHeader.due_date);
        formData.append("nomor_kontainer", dataHeader.payload);
        formData.append("id_faktur_pembelian", id);
        formData.append("term", term);


        for (let y = 0; y < idTandaTerima.length; y++) {

            if (grup == "Lokal") {
                formData.append("id_tanda_terima_barang[]", idTandaTerima[y]);

            }
            else if (grup == "Impor") {

                formData.append("id_pesanan_pembelian[]", idTandaTerima[y]);
            }
        }

        for (let x = 0; x < data.length; x++) {

            // formData.append("nama_alias_produk[]", data[x][y].nama);
            formData.append("kuantitas[]", data[x].quantity.replace(',', '.'));
            formData.append("satuan[]", data[x].unit);
            formData.append("id_produk[]", data[x].id);
            formData.append("harga[]", data[x].price);
            formData.append("persentase_diskon[]", data[x].discount_percentage.replace(',', '.'));
            formData.append("diskon_tetap[]", data[x].fixed_discount.replace(',', '.'));
        }

        for (let i = 0; i < tampilCOA.length; i++) {
            formData.append("biaya[]", tampilCOA[i].id);
            formData.append("total_biaya[]", tampilCOA[i].jumlah);
            formData.append("deskripsi_biaya[]", tampilCOA[i].name);
        }

        for (let i = 0; i < tampilCredit.length; i++) {
            formData.append("nota_kredit[]", tampilCredit[i].id);
            formData.append("total_nota_kredit[]", tampilCredit[i].jumlah);
            formData.append("deskripsi_nota_kredit[]", tampilCredit[i].deskripsi);
        }

        formData.append("status", "Submitted");
        axios({
            method: "put",
            url: `${Url}/purchase_invoices`,
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
                navigate("/fakturpembelian");
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
        const formData = new URLSearchParams();
        formData.append("tanggal", dataHeader.date);
        formData.append("pemasok", dataHeader.supplier_id);
        formData.append("kode", code);
        formData.append("catatan", description);
        formData.append("muatan", dataHeader.payload);
        formData.append("karton", dataHeader.carton);
        formData.append("ppn", totalPpn);

        // formData.append("term", term);
        formData.append("uang_muka", uangMuka);
        formData.append("tanggal_jatuh_tempo", dataHeader.due_date);
        formData.append("nomor_kontainer", dataHeader.payload);
        formData.append("term", term);
        formData.append("id_faktur_pembelian", id);

        console.log(idTandaTerima)
        console.log(grup)

        // for (let y = 0; y < idTandaTerima.length; y++) {

        //     formData.append("id_tanda_terima_barang[]", idTandaTerima[y]);
        // }

        for (let y = 0; y < idTandaTerima.length; y++) {

            if (grup == "Lokal") {
                formData.append("id_tanda_terima_barang[]", idTandaTerima[y]);

            }
            else if (grup == "Impor") {

                formData.append("id_pesanan_pembelian[]", idTandaTerima[y]);
            }
        }

        for (let i = 0; i < tampilCredit.length; i++) {
            formData.append("nota_kredit[]", tampilCredit[i].id);
            formData.append("total_nota_kredit[]", tampilCredit[i].jumlah);
            formData.append("deskripsi_nota_kredit[]", tampilCredit[i].deskripsi);
        }


        for (let x = 0; x < data.length; x++) {

            // formData.append("nama_alias_produk[]", data[x][y].nama);
            formData.append("kuantitas[]", data[x].quantity.replace(',', '.'));
            formData.append("satuan[]", data[x].unit);
            formData.append("id_produk[]", data[x].id);
            formData.append("harga[]", data[x].price);
            formData.append("persentase_diskon[]", data[x].discount_percentage.replace(',', '.'));
            formData.append("diskon_tetap[]", data[x].fixed_discount);
        }

        for (let i = 0; i < tampilCOA.length; i++) {
            formData.append("biaya[]", tampilCOA[i].id);
            formData.append("total_biaya[]", tampilCOA[i].jumlah);
            formData.append("deskripsi_biaya[]", tampilCOA[i].name);
        }


        formData.append("status", "Draft");

        axios({
            method: "put",
            url: `${Url}/purchase_invoices`,
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
                navigate("/fakturpembelian");
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
                <div className="text-title text-start mb-4">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Edit Faktur Pembelian">
                    </PageHeader>
                    {/* <h3 className="title fw-bold">Detail Faktur Pembelian</h3> */}
                    {/* <h3 className="title fw-bold">Edit Faktur Pembelian</h3> */}
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
                                    value={dataHeader.date}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Grup</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={grup}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Faktur</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataSupplier.name}
                                    disabled
                                />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataSupplier.address}
                                    disabled
                                />
                            </div>
                        </div> */}
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >No. Kontainer</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.container_number}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Term</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.term}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Muatan</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.payload}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Ctn</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={dataHeader.carton}
                                    disabled
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
                                    defaultValue={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                {getStatus === 'Submitted' ? <Tag color="blue">{getStatus}</Tag> : getStatus === 'Draft' ? <Tag color="orange">{getStatus}</Tag> : getStatus === 'Done' ? <Tag color="green">{getStatus}</Tag> : <Tag color="red">{getStatus}</Tag>}
                            </div>
                        </div>


                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Penerimaan Pesanan</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    if (grup == "Lokal") {

                                        setModalListLokal(true)
                                    }
                                    else if (grup == "Impor") {
                                        setModalListImpor(true)
                                    }
                                }}
                            />
                            <Modal
                                title="Tambah Penerima Pembelian"
                                centered
                                visible={modalListLokal}
                                onCancel={() => setModalListLokal(false)}
                                width={800}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari No Pesanan..."
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
                            <Modal
                                title="Tambah Penerima Pembelian"
                                centered
                                visible={modalListImpor}
                                onCancel={() => setModalListImpor(false)}
                                width={800}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari No Pesanan..."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModalImpor}
                                            dataSource={getDataProductImpor}
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
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataTBPenerimaan}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div>
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
                                onChange={(e) => klikPilihAkun(e)}
                            />
                        </div>
                    </div>
                    <Table
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataAkun}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div className='mt-4' style={{ display: impor ? "block" : "none" }}>
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
                                options={optionsCredit}
                                onChange={(e) => klikCreditNote(e)}
                            />
                        </div>
                    </div>
                    <Table
                        // components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataCredit}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-end mt-4 ">
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">{convertToRupiah(subTotal)}  </div>

                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">{convertToRupiah(grandTotalDiscount)}  </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Uang Muka</label>

                            <div className="col-sm-6">
                                {
                                    grup === 'Lokal' ?
                                        <CurrencyFormat
                                            className='form-control form-control-sm'
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            prefix={mataUang + ' '}
                                            onKeyDown={(event) => klikEnter(event)}
                                            value={uangMuka.replace('.', ',')}
                                            onChange={(e) => tambahUangMuka(e.target.value)}

                                            style={{ width: "70%", fontSize: "10px!important" }} /> :

                                        <CurrencyFormat
                                            className='form-control form-control-sm'
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            prefix={mataUang + ' '}
                                            onKeyDown={(event) => klikEnter(event)}
                                            value={uangMuka.replace('.', ',')}
                                            onChange={(e) => tambahUangMuka(e.target.value)}

                                            style={{ width: "70%", fontSize: "10px!important" }} />
                                }


                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                {
                                    grup === 'Lokal' ?
                                        <CurrencyFormat
                                            className='form-control form-control-sm'
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            prefix={mataUang + ' '}
                                            onKeyDown={(event) => klikEnter(event)}
                                            value={totalPpn.replace('.', ',')}
                                            onChange={(e) => tambahPPN(e.target.value)}

                                            style={{ width: "70%", fontSize: "10px!important" }} /> :

                                        <CurrencyFormat
                                            className='form-control form-control-sm'
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            prefix={mataUang + ' '}
                                            onKeyDown={(event) => klikEnter(event)}
                                            value={totalPpn.replace('.', ',')}
                                            onChange={(e) => tambahPPN(e.target.value)}

                                            style={{ width: "70%", fontSize: "10px!important" }} />

                                }

                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Biaya</label>
                            <div className="col-sm-6">{convertToRupiah(totalCOA)} </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">{convertToRupiah(totalKeseluruhan)} </div>
                        </div>
                    </div>
                </div>

                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    {
                        getStatus == 'Submitted' ?
                            <button
                                type="button"
                                className="btn btn-success rounded m-1"
                                value="Draft"
                                onClick={handleSubmit}
                                width="100px"
                            >
                                Simpan
                            </button> :
                            <>
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
                            </>

                    }

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

export default EditFakturPembelian