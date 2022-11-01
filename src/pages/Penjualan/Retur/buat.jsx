import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Space, Table, Tag } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { formatQuantity, formatRupiah } from '../../../utils/helper';

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

const BuatRetur = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [customer, setCustomer] = useState("");
    const [faktur, setFaktur] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const [tampilPilihProduk, setTampilPilihProduk] = useState(false)
    const [tampilPilihFaktur, setTampilPilihFaktur] = useState(false)
    const navigate = useNavigate();

    const [getDataFaktur, setGetDataFaktur] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [totalKeseluruhan, setTotalKeseluruhan] = useState("")
    const [updateProduk, setUpdateProduk] = useState([])
    const [tampilTabel, setTampilTabel] = useState(true)
    const [tampilProduk, setTampilProduk] = useState([])
    // const [u, setUpdateData] = useState([])

    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [pilihanDiskon, setPilihanDiskon] = useState('');
    const [jumlahDiskon, setJumlahDiskon] = useState([]);
    const [fakturId, setFakturId] = useState('')
    const [selectedFaktur, setSelectedFaktur] = useState()

    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }


    const handleChangeCustomer = (value) => {

        setSelectedCustomer(value);
        setCustomer(value.id);
        setTampilPilihFaktur(true)
        setSelectedFaktur('')
        setFakturId('')
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return axios.get(`${Url}/sales_returns_available_customers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    // useEffect(() => {
    //     getNewCodeSales()
    // }) 

    // faktur 
    useEffect(() => {
        axios.get(`${Url}/sales_returns_available_sales_invoices?nama_alias=${query}&id_penerima=${customer}`, {
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

            setGetDataFaktur(tmp)
        
        }
        );
    }, [customer, query])

    const loadOptionsFaktur = (inputValue) => {
        return axios.get(`${Url}/sales_returns_available_sales_invoices?nama_alias=${inputValue}&id_penerima=${customer}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const handleChangeFaktur = (value) => {

        if (!value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Faktur kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {

            // console.log(value)
            setSelectedFaktur(value);
            setChecked(value.info.tax_included)
            console.log(value)
            setFakturId(value.value);
            setTampilPilihProduk(true)
        }
    };

    // produkFaktur 
    const [produkFaktur, setProdukFaktur] = useState([])
    const [mataUang, setMataUang] = useState("Rp ")
    useEffect(() => {
        axios.get(`${Url}/sales_returns_available_products?id_faktur_penjualan=${fakturId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => {
            let tmp = []
            let data = res.data
            // for (let x = 0; x < data.length; x++) {
            //     tmp.push({
            //         value: data.sales_invoice_details[x].product_alias_name,
            //         label: data.sales_invoice_details[x].product_alias_name,
            //         quantity: data.sales_invoice_details[x].quantity,
            //         price: data.sales_invoice_details[x].price,
            //         fixed_discount: data.sales_invoice_details[x].fixed_discount,
            //         discount_percentage: data.sales_invoice_details[x].discount_percentage,
            //         unit: data.sales_invoice_details[x].unit,
            //         subtotal_after_discount: data.sales_invoice_details[x].subtotal_after_discount,
            //         ppn: data.sales_invoice_details[x].ppn,
            //         shrink: data.sales_invoice_details[x].shrink,
            //         total: data.sales_invoice_details[x].total,
            //         pilihanDiskon: data.sales_invoice_details[x].fixed_discount == 0 ? 'persen' : 'nominal'
            //     })
            // }
            // setTotalPpn(data.ppn);
            // setProdukFaktur(tmp)
            setProdukFaktur(data)
            // console.log(tmp)
        }
        );
    }, [fakturId])

    // ubah produk faktur 
    const handleChangePilih = (value) => {

        if (!value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Produk Belum dipilih, Silahkan Lengkapi datanya ",
            });
        }
        else {

            let dataDouble = [];
            console.log(value)
            console.log(tampilProduk)
            for (let i = 0; i < tampilProduk.length; i++) {
                if (tampilProduk[i].id == value.id) {
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
                let newData = [...tampilProduk];
                newData.push(value)
                setUpdateProduk(newData)
                setTampilProduk(newData);
                calculate(newData, checked)
            }

        }
    };




    const columnProduk = [
        {
            title: 'Nama Alias Produk',
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
            title: 'PPN',
            dataIndex: 'ppn',
            width: '10%',
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
            width: '14%',
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
            width: '14%',
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

    function klikUbahData(y, value) {
       console.log(value)
        let tmpData = [];
        // if (key == 'qty') {
            let hasil = value.replaceAll('.', '');
            console.log(hasil)
            for (let i = 0; i < updateProduk.length; i++) {
                if (i == y) {
                    updateProduk[i].quantity = hasil;
                    // tmpData.push(
                    //     {
                    //         value: updateProduk[i].value,
                    //         label: updateProduk[i].label,
                    //         quantity: hasil,
                    //         price: updateProduk[i].price,
                    //         fixed_discount: updateProduk[i].fixed_discount,
                    //         discount_percentage: updateProduk[i].discount_percentage,
                    //         unit: updateProduk[i].unit,
                    //         subtotal_after_discount: updateProduk[i].subtotal_after_discount,
                    //         ppn: updateProduk[i].ppn,
                    //         shrink: updateProduk[i].shrink,
                    //         total: updateProduk[i].total,
                    //         pilihanDiskon: updateProduk[i].pilihanDiskon


                    //     })
                }
                // else {
                //     tmpData.push(updateProduk[i]);
                // }

            }
            console.log(updateProduk)
        // }
        // else if (key == 'price') {
        //     let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");

        //     for (let i = 0; i < updateProduk.length; i++) {
        //         if (i == y) {

        //             tmpData.push(
        //                 {
        //                     value: updateProduk[i].value,
        //                     label: updateProduk[i].label,
        //                     quantity: updateProduk[i].quantity,
        //                     price: hasil,
        //                     fixed_discount: updateProduk[i].fixed_discount,
        //                     discount_percentage: updateProduk[i].discount_percentage,
        //                     unit: updateProduk[i].unit,
        //                     subtotal_after_discount: updateProduk[i].subtotal_after_discount,
        //                     ppn: updateProduk[i].ppn,
        //                     shrink: updateProduk[i].shrink,
        //                     total: updateProduk[i].total,
        //                     pilihanDiskon: updateProduk[i].pilihanDiskon
        //                 })
        //         }
        //         else {
        //             tmpData.push(updateProduk[i]);
        //         }

        //     }
        // }
        // else if (key == 'diskonValue') {
        //     if (updateProduk[y].pilihanDiskon == 'nominal') {
        //         let hasil = value.replaceAll('.', '');

        //         for (let i = 0; i < updateProduk.length; i++) {
        //             if (i == y) {
        //                 tmpData.push(
        //                     {
        //                         value: updateProduk[i].value,
        //                         label: updateProduk[i].label,
        //                         quantity: updateProduk[i].quantity,
        //                         price: updateProduk[i].price,
        //                         fixed_discount: hasil,
        //                         discount_percentage: 0,
        //                         unit: updateProduk[i].unit,
        //                         subtotal_after_discount: updateProduk[i].subtotal_after_discount,
        //                         ppn: updateProduk[i].ppn,
        //                         shrink: updateProduk[i].shrink,
        //                         total: updateProduk[i].total,
        //                         pilihanDiskon: 'nominal'
        //                     })
        //             }

        //             else {
        //                 tmpData.push(updateProduk[i]);
        //             }

        //         }
        //         // setData(tmpData);
        //     }
        //     else {

        //         let hasil = value.replaceAll('.', '');
        //         console.log(hasil)

        //         for (let i = 0; i < updateProduk.length; i++) {

        //             if (i == y) {
        //                 tmpData.push(
        //                     {
        //                         value: updateProduk[i].value,
        //                         label: updateProduk[i].label,
        //                         quantity: updateProduk[i].quantity,
        //                         price: updateProduk[i].price,
        //                         fixed_discount: 0,
        //                         discount_percentage: hasil,
        //                         unit: updateProduk[i].unit,
        //                         subtotal_after_discount: updateProduk[i].subtotal_after_discount,
        //                         ppn: updateProduk[i].ppn,
        //                         shrink: updateProduk[i].shrink,
        //                         total: updateProduk[i].total,
        //                         pilihanDiskon: 'persen'
        //                     })
        //             }

        //             else {
        //                 tmpData.push(updateProduk[i]);
        //             }

        //         }
        //         // setData(tmpData);
        //     }
        // }
        // else if (key == 'pilihanDiskon') {
        //     for (let i = 0; i < updateProduk.length; i++) {
        //         if (i == y) {
        //             tmpData.push(
        //                 {
        //                     value: updateProduk[i].value,
        //                     label: updateProduk[i].label,
        //                     quantity: updateProduk[i].quantity,
        //                     price: updateProduk[i].price,
        //                     fixed_discount: updateProduk[i].fixed_discount,
        //                     discount_percentage: updateProduk[i].discount_percentage,
        //                     unit: updateProduk[i].unit,
        //                     subtotal_after_discount: updateProduk[i].subtotal_after_discount,
        //                     ppn: updateProduk[i].ppn,
        //                     shrink: updateProduk[i].shrink,
        //                     total: updateProduk[i].total,
        //                     pilihanDiskon: value

        //                 })
        //         }
        //         else {
        //             tmpData.push(updateProduk[i]);
        //         }

        //     }
        //     // setData(tmpData);
        // }
        // else if (key == 'ppn') {
        //     let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");

        //     for (let i = 0; i < updateProduk.length; i++) {
        //         if (i == y) {

        //             tmpData.push(
        //                 {
        //                     value: updateProduk[i].value,
        //                     label: updateProduk[i].label,
        //                     quantity: updateProduk[i].quantity,
        //                     price: updateProduk[i].price,
        //                     fixed_discount: updateProduk[i].fixed_discount,
        //                     discount_percentage: updateProduk[i].discount_percentage,
        //                     unit: updateProduk[i].unit,
        //                     subtotal_after_discount: updateProduk[i].subtotal_after_discount,
        //                     ppn: hasil,
        //                     shrink: updateProduk[i].shrink,
        //                     total: updateProduk[i].total,
        //                     pilihanDiskon: updateProduk[i].pilihanDiskon
        //                 })
        //         }
        //         else {
        //             tmpData.push(updateProduk[i]);
        //         }

        //         // }
        //         // setData(tmpData);
        //     }
        // }

        // ubah total 
        let grandTotal;
        let arrTotal = [];
        // console.log(tmpData)
        // for (let i = 0; i < tmpData.length; i++) {
        //     if (i == y) {
        //         if (tmpData[i].pilihanDiskon == 'persen') {
        //             let total = tmpData[i].quantity.toString().replace(',', '.') * Number(tmpData[i].price);
        //             let getDiskon = (Number(total) * tmpData[i].discount_percentage.toString().replace(',', '.')) / 100;

        //             let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.toString().replace(',', '.')) / 100;

        //             grandTotal = Number(total) - Number(getDiskon) + Number(ppn);
        //         }
        //         else if (tmpData[i].pilihanDiskon == 'nominal') {
        //             let total = (Number(tmpData[i].quantity.toString().replace(',', '.')) * Number(tmpData[i].price))
        //             let getDiskon = tmpData[i].fixed_discount;

        //             let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.toString().replace(',', '.')) / 100;
        //             grandTotal = total - Number(getDiskon) + Number(ppn);
        //         }
        //         else {
        //             let total = (Number(tmpData[i].quantity.toString().replace(',', '.')) * Number(tmpData[i].price))
        //             let ppn = (Number(total) * tmpData[i].ppn.toString().replace(',', '.')) / 100;
        //             grandTotal = total + Number(ppn);
        //         }
        //         arrTotal.push(
        //             {
        //                 value: tmpData[i].value,
        //                 label: tmpData[i].label,
        //                 quantity: tmpData[i].quantity,
        //                 price: tmpData[i].price,
        //                 fixed_discount: tmpData[i].fixed_discount,
        //                 discount_percentage: tmpData[i].discount_percentage,
        //                 unit: tmpData[i].unit,
        //                 subtotal_after_discount: tmpData[i].subtotal_after_discount,
        //                 ppn: tmpData[i].ppn,
        //                 shrink: tmpData[i].shrink,
        //                 total: grandTotal,
        //                 pilihanDiskon: tmpData[i].pilihanDiskon
        //             })
        //     }
        //     else {
        //         arrTotal.push(tmpData[i])

        //     }
        // }

        // console.log(arrTotal)
        calculate(updateProduk, checked);
        // setUpdateProduk(arrTotal);
        setTampilProduk(updateProduk)
    }

    const dataProduk =
        [...tampilProduk.map((item, i) => ({
            name_product: item.name,
            qty: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.remains} onChange={(e) => klikUbahData(i, e.target.value)} key="qty" />,
            stn: item.unit,
            prc: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '}value={Number(item.selling_price).toString().replace('.', ',')} />,
            dsc:<CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={'%'}  value={Number(item.discount).toString().replace('.', ',')}  />
                // <>
                //     {

                //         // item.pilihanDiskon == 'persen' ?
                //         <div className='d-flex p-1' style={{ height: "100%" }} >
                //             <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.discount} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />
                //             <div className="input-group-prepend" >
                //                 <select
                //                     onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                //                     id="grupSelect"
                //                     className="form-select select-diskon"
                //                 >
                //                     <option selected value="persen" >
                //                         %
                //                     </option>
                //                     <option value="nominal">
                //                         {mataUang}
                //                     </option>
                //                 </select>
                //             </div>
                //         </div>
                //         //             :
                //         //             item.pilihanDiskon == 'nominal' ?
                //         //                 <div className='d-flex p-1' style={{ height: "100%" }}>

                //         //                     <CurrencyFormat disabled className='edit-disabled text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(updateProduk[i].fixed_discount).toString().replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />

                //         //                     <div className="input-group-prepend" >
                //         //                         <select
                //         //                             onChange={(e) => klikUbahData(i, e.target.value, "pilihanDiskon")}
                //         //                             id="grupSelect"
                //         //                             className="form-select select-diskon"
                //         //                         >
                //         //                             <option value="persen" >
                //         //                                 %
                //         //                             </option>
                //         //                             <option selected value="nominal">
                //         //                                 {mataUang}
                //         //                             </option>
                //         //                         </select>
                //         //                     </div>
                //         //                 </div> : null
                //         // }
                //     }</>,
            ,
            total: < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.selling_price).toFixed(2).replace('.', ',')} key="diskon" />,
            ppn: <CurrencyFormat disabled className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={'%'}  value={Number(item.ppn)}  />,
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

    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(tampilProduk, check_checked);
    };



    const calculate = (faktur, check_checked) => {
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        let subTotal = 0;
        let totalPpn = 0;
        let rowDiscount = 0;
        let subTotalDiscount = 0;
        let totalDiscount = 0;
        faktur.map((values, i) => {
            // termasuk pajak 
            if (check_checked) {
                total += (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));
                totalPerProduk = (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));

                if (values.pilihanDiskon == 'persen') {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                }
                else if (values.pilihanDiskon == 'nominal') {
                    hasilDiskon += Number(values.fixed_discount);
                    rowDiscount = Number(values.fixed_discount);
                }
                totalDiscount += ((rowDiscount * 100) / (100 + Number(values.ppn)));
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (subTotalDiscount * 100) / (100 + Number(values.ppn));
                totalPpn = (subTotal * Number(values.ppn)) / 100;


                grandTotal = subTotal - hasilDiskon + Number(totalPpn);

                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            }

            // tidak termasuk pajak 
            else {
                total += (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));
                totalPerProduk = (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));

                if (values.pilihanDiskon == 'persen') {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                }
                else if (values.pilihanDiskon == 'nominal') {

                    hasilDiskon += Number(values.fixed_discount);
                    rowDiscount = Number(values.fixed_discount);
                }
                subTotal = total - (Number(totalPerProduk) * Number(rowDiscount) / 100);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * values.ppn) / 100;
                grandTotal = total - hasilDiskon + Number(totalPpn);

                setSubTotal(total)
                setGrandTotalDiscount(hasilDiskon);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            }

        })
    }


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

        if (!date) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!customer) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Pelanggan kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {

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

            axios({
                method: "post",
                url: `${Url}/sales_returns`,
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
                    navigate("/pesanan");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
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

    const handleDraft = async (e) => {
        e.preventDefault();

        if (!date) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!customer) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Pelanggan kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {


            const userData = new FormData();
            userData.append("tanggal", date);
            userData.append("referensi", referensi);
            userData.append("catatan", description);
            userData.append("pelanggan", customer);
            userData.append("status", "Draft");
            faktur.map((p) => {
                console.log(p);
                userData.append("nama_alias_produk[]", p.alias_name);
                userData.append("product[]", p.product_id);
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

            axios({
                method: "post",
                url: `${Url}/sales_returns`,
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
                    navigate("/pesanan");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
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
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Buat Retur Penjualan"
            >
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
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
                                    options={getDataFaktur}
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
            </PageHeader>

            <PageHeader
                ghost={false}
                title="Daftar Faktur Penjualan"
            // extra={[
            //     <Button
            //         type="primary"
            //         icon={<PlusOutlined />}
            //         onClick={() => setModal2Visible(true)}
            //     />,
            //     <Modal
            //         title="Tambah Faktur"
            //         centered
            //         visible={modal2Visible}
            //         onCancel={() => setModal2Visible(false)}
            //         // footer={[
            //         //     <Button
            //         //         key="submit"
            //         //         type="primary"

            //         //     >
            //         //         Tambah
            //         //     </Button>,
            //         // ]}
            //         footer={null}
            //         width={600}
            //     >
            //         <div className="text-title text-start">
            //             <div className="row">
            //                 <div className="col mb-3">
            //                     <Search
            //                         placeholder="Cari Faktur..."
            //                         style={{
            //                             width: 400,
            //                         }}
            //                         onChange={(e) => setQuery(e.target.value.toLowerCase())}
            //                     />
            //                 </div>
            //                 <Table
            //                     columns={columnsModal}
            //                     dataSource={getDataFaktur}
            //                     scroll={{
            //                         y: 250,
            //                     }}
            //                     pagination={false}
            //                     loading={isLoading}
            //                     size="middle"
            //                 />
            //             </div>
            //         </div>
            //     </Modal>,
            // ]}
            >
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
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
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
                // onChange={(e) => setProduct(e.target.value)}
                />

                {/* <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={dataTable}
                    columns={columns}
                    onChange={(e) => setFaktur(e.target.value)}
                /> */}
                <div className="row p-0 mt-3">
                    <div className="col ms-5">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" defaultChecked={checked} disabled onChange={handleChange} />
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk PPN
                            </label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix={'Rp '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toFixed(2).replace('.', ',')} key="total" />

                                {/* {convertToRupiah(subTotal, "Rp")} */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix={'Rp '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotalDiscount).toFixed(2).replace('.', ',')} key="total" />

                                {/* {convertToRupiah(grandTotalDiscount, "Rp")} */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix={'Rp '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(totalPpn).toFixed(2).replace('.', ',')} key="total" />

                                {/* {convertToRupiah(totalPpn, "Rp")} */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix={'Rp '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotal).toFixed(2).replace('.', ',')} key="total" />

                                {/* {convertToRupiah(grandTotal, "Rp")} */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: "right", position: "relative" }}>
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
                    {/* <button
                        type="button"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{ clear: "both" }}></div>
            </PageHeader>
        </>
    )
}

export default BuatRetur