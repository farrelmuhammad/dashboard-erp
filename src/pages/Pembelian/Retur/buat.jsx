import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { PageHeader} from 'antd';



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
    const [totalPpn, setTotalPpn] = useState(0);
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [modal2Visible, setModal2Visible] = useState(false);
    const [term, setTerm] = useState();
    const [muatan, setMuatan] = useState();
    const [ctn, setCtn] = useState();
    const [alamat, setAlamat] = useState();
    const [kontainer, setKontainer] = useState();
    const [referensi, setReferensi] = useState()

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedFaktur, setSelectedFaktur] = useState(null);
    const [fakturId, setFakturId] = useState();
    const [supplierId, setSupplierId] = useState()
    const [tampilPilihProduk, setTampilPilihProduk] = useState(false)
    const [tampilPilihFaktur, setTampilPilihFaktur] = useState(false)
    const [dataFaktur, setDataFaktur] = useState([])
    const [tampilTabel, setTampilTabel] = useState(true)


    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }


    // supplier 
    const handleChangeSupplier = (value) => {
        setSelectedSupplier(value);
        setTampilPilihFaktur(true)
        setSupplierId(value.id);
    };
    const loadOptionsSupplier = (inputValue) => {
        return axios.get(`${Url}/purchase_returns_available_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    // faktur 
    useEffect(() => {
        axios.get(`${Url}/purchase_returns_available_purchase_invoices?id_pemasok=${supplierId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => {
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {

                tmp.push({
                    value: res.data.data[i].id,
                    label: res.data.data[i].code,
                    info: res.data.data[i]
                });
            }

            setDataFaktur(tmp)
        }
        );
    }, [supplierId])

    // produkFaktur 
    const [produkFaktur, setProdukFaktur] = useState([])
    const [mataUang, setMataUang] = useState("Rp ")
    useEffect(() => {
        axios.get(`${Url}/select_purchase_invoices/all?id=${fakturId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => {
            let tmp = []
            let data = res.data[0]
            for (let x = 0; x < data.purchase_invoice_details.length; x++) {
                tmp.push({
                    value: data.purchase_invoice_details[x].product_id,
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
    }, [fakturId])

    const handleChangeFaktur = (value) => {
        // console.log(value)
        setSelectedFaktur(value);
        setFakturId(value.value);
        setTampilPilihProduk(true)
    };

    // cari pesanan dari faktur 
    const [tampilProduk, setTampilProduk] = useState([])
    const [updateProduk, setUpdateProduk] = useState([])
    const [totalCredit, setTotalCredit] = useState(0)
    const [totalKeseluruhan, setTotalKeseluruhan] = useState()
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
                    hasilDiskon += (Number(totalPerProduk) * Number(newData[x].discount_percentage.replaceAll(',', '.')) / 100);
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

    function hapusDataProduk(i) {
        setTampilTabel(false)
        if (tampilProduk.length == 1) {
            setUpdateProduk([])
            setTampilProduk([])
        }
        else {
            tampilProduk.splice(i, 1);

        }
        Swal.fire(
            "Berhasil",
            `Data Berhasil Di hapus`,
            "success"
        ).then(() =>
            setTampilTabel(true)
        );

    }

    useEffect(() => {
        // getSalesOrderDetails()
        getCodeFaktur()
    }, [date, grup])

    useEffect(() => {
        if (grup == "Impor") {
            setImpor(true);
        }
        else {
            setImpor(false);
        }

    }, [grup])

    const getCodeFaktur = async () => {
        await axios.get(`${Url}/get_new_purchase_return_code?tanggal=${date}`, {
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

    const columnProduk = [
        {
            title: 'Nama Produk',
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
            dataIndex: 'prc',
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
            title: 'Discount',
            dataIndex: 'dsc',
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
        {
            title: 'Action',
            dataIndex: 'act',
            width: '12%',
            align: 'center',

        },

    ];


    function klikUbahData(y, value, key) {
        let tmpData = [];

        if (key == 'qty') {
            let hasil = value.replaceAll('.', '');
            console.log(hasil)
            for (let i = 0; i < tampilProduk.length; i++) {
                if (i == y) {
                    tmpData.push(
                        {
                            value: updateProduk[i].value,
                            label: updateProduk[i].label,
                            quantity: hasil,
                            price: updateProduk[i].price,
                            fixed_discount: updateProduk[i].fixed_discount,
                            discount_percentage: updateProduk[i].discount_percentage,
                            pilihanDiskon: updateProduk[i].pilihanDiskon,
                            total: updateProduk[i].total,
                            unit: updateProduk[i].unit

                        })
                }
                else {
                    tmpData.push(updateProduk[i]);
                }

            }
            setUpdateProduk(tmpData)
            setTampilProduk(tmpData)
        }
        else if (key == 'price') {
            let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");

            for (let i = 0; i < updateProduk.length; i++) {
                if (i == y) {

                    tmpData.push(
                        {

                            value: updateProduk[i].value,
                            label: updateProduk[i].label,
                            quantity: updateProduk[i].quantity,
                            price: hasil,
                            fixed_discount: updateProduk[i].fixed_discount,
                            discount_percentage: updateProduk[i].discount_percentage,
                            pilihanDiskon: updateProduk[i].pilihanDiskon,
                            unit: updateProduk[i].unit,
                            total: updateProduk[i].total
                        })
                }
                else {
                    tmpData.push(updateProduk[i]);
                }

                setTampilProduk(tmpData);
                setUpdateProduk(tmpData)
            }
        }
        else if (key == 'diskonValue') {
            if (updateProduk[y].pilihanDiskon == 'nominal') {
                let hasil = value.replaceAll('.', '');

                for (let i = 0; i < updateProduk.length; i++) {
                    if (i == y) {
                        tmpData.push(
                            {
                                value: updateProduk[i].value,
                                label: updateProduk[i].label,
                                quantity: updateProduk[i].quantity,
                                price: updateProduk[i].price,
                                fixed_discount: hasil,
                                discount_percentage: updateProduk[i].discount_percentage,
                                pilihanDiskon: updateProduk[i].pilihanDiskon,
                                total: updateProduk[i].total,
                                unit: updateProduk[i].unit

                            })
                    }

                    else {
                        tmpData.push(updateProduk[i]);
                    }

                }
                setTampilProduk(tmpData);
                setUpdateProduk(tmpData)
            }
            else if (updateProduk[y].pilihanDiskon == 'persen') {

                let hasil = value.replaceAll('.', '');
                console.log(hasil)

                for (let i = 0; i < updateProduk.length; i++) {

                    if (i == y) {
                        tmpData.push(
                            {
                                value: updateProduk[i].value,
                                label: updateProduk[i].label,
                                quantity: updateProduk[i].quantity,
                                price: updateProduk[i].price,
                                fixed_discount: updateProduk[i].fixed_discount,
                                discount_percentage: hasil,
                                pilihanDiskon: updateProduk[i].pilihanDiskon,
                                total: updateProduk[i].total,
                                unit: updateProduk[i].unit

                            })
                    }

                    else {
                        tmpData.push(updateProduk[i]);
                    }

                }
                setTampilProduk(tmpData);
                setUpdateProduk(tmpData)
            }
        }
        else if (key == 'pilihanDiskon') {
            for (let i = 0; i < updateProduk.length; i++) {
                if (i == y) {
                    tmpData.push(
                        {
                            value: updateProduk[i].value,
                            label: updateProduk[i].label,
                            quantity: updateProduk[i].quantity,
                            price: updateProduk[i].price,
                            fixed_discount: updateProduk[i].fixed_discount,
                            discount_percentage: updateProduk[i].discount_percentage,
                            pilihanDiskon: value,
                            total: updateProduk[i].total,
                            unit: updateProduk[i].unit

                        })
                }
                else {
                    tmpData.push(updateProduk[i]);
                }

            }
            setTampilProduk(tmpData);
            setUpdateProduk(tmpData)
        }

        // ubah total 
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
                        value: tmpData[i].value,
                        label: tmpData[i].label,
                        quantity: tmpData[i].quantity,
                        price: tmpData[i].price,
                        fixed_discount: tmpData[i].fixed_discount,
                        discount_percentage: tmpData[i].discount_percentage,
                        pilihanDiskon: tmpData[i].pilihanDiskon,
                        total: grandTotal,
                        unit: tmpData[i].unit


                    })
            }
            else {
                arrTotal.push(tmpData[i])

            }
        }

        setSubTotal(grandTotal)
        console.log(arrTotal)
        calculate(arrTotal)
        setTampilProduk(arrTotal)
        setUpdateProduk(arrTotal)
    }

    const dataProduk =
        [...tampilProduk.map((item, i) => ({
            name_product: item.label,
            qty: 
            <div className='d-flex'>
{
   <CurrencyFormat className=' text-center editable-input'  thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={updateProduk[i].quantity.replace('.', ',')} 
   
   onChange={e => {
      // value = parseFloat(value.toString().replace('.', ',')
        klikUbahData(i, e.target.value, "qty")
       
   }}
   key="qty" />
}
</div>,


            
            // <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(updateProduk[i].quantity).toFixed(2).replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "qty")} key="qty" />,
            stn: updateProduk[i].unit,
            prc:
                <div className='d-flex'>
                    {
                        mataUang === 'Rp ' ?
                        <CurrencyFormat disabled className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} onKeyDown={(event) => klikEnter(event)} value={Number(updateProduk[i].price).toFixed(2).replace('.',',')} onChange={(e) => klikUbahData(i, e.target.value, "price")} /> :
                        <CurrencyFormat disabled className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} onKeyDown={(event) => klikEnter(event)} value={Number(updateProduk[i].price).toLocaleString('id')} onChange={(e) => klikUbahData(i, e.target.value, "price")} />
                    }
                   
                </div>
            ,
            dsc:
                <>
                    {
                        item.pilihanDiskon == 'noDisc' ?
                            <div className='d-flex p-1' style={{ height: "100%" }}>
                                <input onKeyDown={(event) => klikEnter(event)} style={{ width: "70%", fontSize: "10px!important" }} type="text" className="text-center editable-input" value={updateProduk[i].discount_percentage + '%'} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} />
                                {/* <div className="input-group-prepend"  >
                                    <select
                                        onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                                        id="grupSelect"
                                        className="form-select select-diskon"
                                    >
                                        <option selected value="persen" >
                                            %
                                        </option>
                                        <option value="nominal">
                                            {mataUang}
                                        </option>
                                    </select>
                                </div> */}
                            </div> :
                            item.pilihanDiskon == 'persen' ?
                                <div className='d-flex p-1' style={{ height: "100%" }} >
                                    <CurrencyFormat disabled  suffix={'%'}  className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={updateProduk[i].discount_percentage} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />
                                    
                                    {/* <div className="input-group-prepend" >
                                        <select
                                            onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                                            id="grupSelect"
                                            className="form-select select-diskon"
                                        >
                                            <option selected value="persen" >
                                                %
                                            </option>
                                            <option value="nominal">
                                                {mataUang}
                                            </option>
                                        </select>
                                    </div> */}
                                </div>
                                :
                                item.pilihanDiskon == 'nominal' ?
                                    <div className='d-flex p-1' style={{ height: "100%" }}>
                                       {
                                        mataUang === 'Rp '?
                                        <CurrencyFormat disabled prefix='Rp ' className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(updateProduk[i].fixed_discount).toFixed(2).replace('.',',')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" /> :
                                        <CurrencyFormat disabled prefix={mataUang} className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(updateProduk[i].fixed_discount).toLocaleString('id')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />
                                       }
                                        {/* <div className="input-group-prepend" >
                                            <select
                                                onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                                                id="grupSelect"
                                                className="form-select select-diskon"
                                            >
                                                <option value="persen" >
                                                    %
                                                </option>
                                                <option selected value="nominal">
                                                    {mataUang}
                                                </option>
                                            </select>
                                        </div> */}
                                    </div> : null
                    }</>,

            total: 
            mataUang === 'Rp ' ?
            < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(updateProduk[i].total).toFixed(2).toString().replace('.',',')} key="diskon" />:
            < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(updateProduk[i].total).toLocaleString('id')} key="diskon" />,

           act: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => hapusDataProduk(i)}
                />
            </Space >,
        }))

        ];


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
        let totalAkhir = Number(grandTotal)  + Number(totalPpn) 
        setTotalKeseluruhan(totalAkhir)
        // console.log(totalAkhir)
        setSubTotal(total)
        setGrandTotalDiscount(hasilDiskon);
        setGrandTotal(grandTotal);
    }
 
    const handleSubmit = async (e) => {

        if(!date){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!supplierId)
        {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!fakturId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Faktur kosong, Silahkan Lengkapi datanya ",
              });
        }
        else{

        e.preventDefault();
        const dataRetur = new URLSearchParams();
        dataRetur.append("tanggal", date);
        dataRetur.append("catatan", description);
        dataRetur.append("pemasok", supplierId);
        dataRetur.append("id_faktur_pembelian", fakturId);
        dataRetur.append('ppn', totalPpn);
        dataRetur.append('status', 'Submitted')

        for (let i = 0; i < tampilProduk.length; i++) {
            dataRetur.append('id_produk[]', tampilProduk[i].value);
            dataRetur.append('kuantitas[]', tampilProduk[i].quantity.replace(',', '.'));
            dataRetur.append('satuan[]', tampilProduk[i].unit);
            dataRetur.append('persentase_diskon[]', tampilProduk[i].discount_percentage);
            dataRetur.append('diskon_tetap[]', tampilProduk[i].fixed_discount);
            dataRetur.append('harga[]', tampilProduk[i].price);

        }

        axios({
            method: "post",
            url: `${Url}/purchase_returns`,
            data: dataRetur,
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
                navigate("/returpembelian");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        //text:"Data Produk belum dipilih, silahkan lengkapi datanya dan coba kembali",
                         text: err.response.data.message,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
       }   };

    const handleDraft = async (e) => {
        e.preventDefault();

        if(!date){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!supplierId)
        {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!fakturId){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Faktur kosong, Silahkan Lengkapi datanya ",
              });
        }
        else{

        const dataRetur = new URLSearchParams();
        dataRetur.append("tanggal", date);
        dataRetur.append("catatan", description);
        dataRetur.append("pemasok", supplierId);
        dataRetur.append("id_faktur_pembelian", fakturId);
        dataRetur.append('ppn', totalPpn);
        dataRetur.append('status', 'Draft')

        for (let i = 0; i < tampilProduk.length; i++) {
            dataRetur.append('id_produk[]', tampilProduk[i].value);
            dataRetur.append('kuantitas[]', tampilProduk[i].quantity.replace(',', '.'));
            dataRetur.append('satuan[]', tampilProduk[i].unit);
            dataRetur.append('persentase_diskon[]', tampilProduk[i].discount_percentage);
            dataRetur.append('diskon_tetap[]', tampilProduk[i].fixed_discount);
            dataRetur.append('harga[]', tampilProduk[i].price);

        }

        axios({
            method: "post",
            url: `${Url}/purchase_returns`,
            data: dataRetur,
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
                navigate("/returpembelian");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        //text:"Data Produk belum dipilih, silahkan lengkapi datanya dan coba kembali",
                        text: err.response.data.message,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
        }    };

    function klikTambahPpn(value){
        let hasil = value.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
        setTotalPpn(hasil)
        let totalAkhir = Number(subTotal) - Number(grandTotalDiscount) + Number(hasil)
        //let totalS = Number(totalAkhir + Number(totalPpn))
        setTotalKeseluruhan(totalAkhir)
    }



    return (
        <>
          <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Retur Pembelian">
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Retur</label>
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
                        <div className="row mb-3" style={{ display: tampilPilihFaktur ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Faktur</label>
                            <div className="col-sm-7">
                                <ReactSelect
                                    className="basic-single"
                                    placeholder="Pilih Faktur..."
                                    classNamePrefix="select"
                                    isLoading={isLoading}
                                    isSearchable
                                    getOptionLabel={(e) => e.label}
                                    getOptionValue={(e) => e.value}
                                    options={dataFaktur}
                                    onChange={(e) => handleChangeFaktur(e)}
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
                    </div>
                    <div className="row mt-4  mb-3" style={{ display: tampilPilihProduk ? "flex" : "none" }}>
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
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataProduk}
                        columns={columnProduk}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>

                <div className="d-flex justify-content-end mt-4 ">
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">

                            {
                                mataUang === 'Rp ' ?
                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toFixed(2).replace('.',',')} key="diskon" /> :
                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toLocaleString('id')} key="diskon" />
                            }
                               
                            </div>

                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                            {
                                mataUang === 'Rp ' ?
                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotalDiscount).toFixed(2).replace('.',',')} key="diskon" /> :
                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotalDiscount).toLocaleString('id')} key="diskon" />
                            }

                            </div>

                        </div>

                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>

                            <div className="col-sm-6">
                            {
                                mataUang === 'Rp ' ?
                                
                                <CurrencyFormat className=' editable-input form-control' style={{ width: "70%", fontSize: "10px!important" }}  thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang} onKeyDown={(event) => klikEnter(event)} value={totalPpn.toString().replace('.',',')} onChange={(e) => klikTambahPpn(e.target.value)} key="pay" />
 :
 <CurrencyFormat className=' editable-input form-control' style={{ width: "70%", fontSize: "10px!important" }}  thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang} onKeyDown={(event) => klikEnter(event)} value={Number(totalPpn).toLocaleString('id')} onChange={(e) => klikTambahPpn(e.target.value)} key="pay" />
 //< CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(totalPpn).toLocaleString('id')} key="diskon" />
                            }
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                            {
                                mataUang === 'Rp ' ?
                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(totalKeseluruhan).toFixed(2).replace('.',',')} key="diskon" /> :
                                < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang} thousandSeparator={'.'} decimalSeparator={','} value={Number(totalKeseluruhan).toLocaleString('id')} key="diskon" />
                            }

                            </div>

                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{float:'right', position:'relative'}}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                        style = {{width: '100px'}}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                        style = {{width: '100px'}}
                    >
                        Submit
                    </button>
                    {/* <button
                        type="button"
                        style = {{width: '100px'}}
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{clear:'both'}}></div>
            </form>
        </>
    )
}

export default BuatReturPembelian