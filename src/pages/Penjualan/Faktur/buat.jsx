import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Space, Table, Tabs, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { formatQuantity, formatRupiah } from '../../../utils/helper';
import CurrencyFormat from 'react-currency-format';
import { update } from 'lodash';

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

const BuatFaktur = () => {
    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }

    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [address, setAddress] = useState("");
    const [addressId, setAddressId] = useState("");
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const [uangMuka, setUangMuka] = useState(0);
    const [tampilUangMuka, setTampilUangMuka] = useState(0);
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const [loadingTable, setLoadingTable] = useState(false)
    const [getDataProduct, setGetDataProduct] = useState();
    const [tmpCentang, setTmpCentang] = useState([]);
    const [getDataSurat, setGetDataSurat] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [total1Produk, setTotal1Produk] = useState([]);
    const [checked, setChecked] = useState(false);

    const [selectedValue, setSelectedCustomer] = useState('');
    const [modal2Visible, setModal2Visible] = useState(false);
    // const [pilihanDiskon, setPilihanDiskon] = useState('percent');
    const [pilihanDiskon, setPilihanDiskon] = useState('');
    const [jumlahDiskon, setJumlahDiskon] = useState([]);
    const [mataUang, setMataUang] = useState('Rp ')
    const [data, setData] = useState('')
    const [selectedSupplier, setSelectedSupplier] = useState()
    const [sumber, setSumber] = useState('')
    const [idTandaTerima, setIdTandaTerima] = useState([])
    const [fakturType, setFakturType] = useState('')
    const [selectedType, setSelectedType] = useState('')

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/sales_invoices_available_delivery_notes?kode=${query}&id_penerima=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].code) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
            }
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].code) < 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: false
                    });
                }
            }   
            console.log(tmp)


            setGetDataSurat(tmp);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/sales_invoices_available_sales_orders?kode=${query}&id_penerima=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                if (tmpCentang.indexOf(res.data.data[i].code) >= 0) {
                    tmp.push({
                        detail: res.data.data[i],
                        statusCek: true
                    });
                }
            }
            for (let i = 0; i < res.data.data.length; i++) {
                if (tmpCentang.indexOf(res.data.data[i].code) < 0) {
                    tmp.push({
                        detail: res.data.data[i],
                        statusCek: false
                    });
                }
            }
            setGetDataProduct(tmp);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    useEffect(() => {
        console.log(subTotal)
        console.log(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn) - Number(uangMuka))
        setGrandTotal(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn) - Number(uangMuka));
    }, [totalPpn, uangMuka]);

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Transaksi',
            dataIndex: 'code',
            render: (_, record) => {
                return <>{record.detail.code}</>
            }
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            width: '15%',
            align: 'center',
            render: (_, record) => {
                return <>{record.detail.customer_name}</>
            }
        },
        {
            title: 'Penerima',
            dataIndex: 'recipient_name',
            width: '15%',
            align: 'center',
            render: (_, record) => {
                return <>{record.detail.recipient_name}</>
            }
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '15%',
            align: 'center',
            render: (_, record, index) => (
                <>
                    <Checkbox
                        value={record}
                        checked={record.statusCek}
                        onChange={(e) => handleCheck(e, index)}
                    />
                </>
            )
        },
    ];

    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Nama Produk Alias',
            width: '8%',
            dataIndex: 'product_alias_name',
        },
        {
            title: 'Nama Produk',
            width: '8%',
            dataIndex: 'product_name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            width: '5%',
            align: 'center',
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
            dataIndex: 'discount',
            width: '10%',
            align: 'center',
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '10%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '20%',
            align: 'center',
        },
    ];

    function klikUbahData(y, value, key) {
        // console.log(value)
        let tmpData = [];
        if (key == 'qty') {
            let hasil = value.replaceAll('.', '');
            for (let i = 0; i < data.length; i++) {
                if (i == y) {
                    tmpData.push(
                        {
                            id: data[i].id,
                            product_alias_name: data[i].product_alias_name,
                            quantity: hasil,
                            price: data[i].price,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            ppn: data[i].ppn,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: data[i].pilihanDiskon,
                            unit: data[i].unit,
                            total: data[i].total

                        })
                }
                else {
                    tmpData.push(data[i]);
                }

            }
            setData(tmpData);
        }
        else if (key == 'price') {
            let hasil = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "");

            for (let i = 0; i < data.length; i++) {
                if (i == y) {

                    tmpData.push(
                        {
                            id: data[i].id,
                            product_alias_name: data[i].product_alias_name,
                            quantity: data[i].quantity,
                            price: hasil,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            ppn: data[i].ppn,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: data[i].pilihanDiskon,
                            unit: data[i].unit,
                            total: data[i].total,
                        })
                }
                else {
                    tmpData.push(data[i]);
                }

                // }
                setData(tmpData);
            }
        }
        else if (key == 'diskonValue') {
            if (data[y].pilihanDiskon == 'nominal') {
                let hasil = value.replaceAll('.', '');

                for (let i = 0; i < data.length; i++) {
                    if (i == y) {
                        tmpData.push(
                            {
                                id: data[i].id,
                                product_alias_name: data[i].product_alias_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: '0',
                                fixed_discount: hasil,
                                ppn: data[i].ppn,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: 'nominal',
                                unit: data[i].unit,
                                total: data[i].total,
                            })
                    }

                    else {
                        tmpData.push(data[i]);
                    }

                }
                setData(tmpData);
            }
            else {

                let hasil = value.replaceAll('.', '');

                for (let i = 0; i < data.length; i++) {

                    if (i == y) {
                        tmpData.push(
                            {
                                id: data[i].id,
                                product_alias_name: data[i].product_alias_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: hasil,
                                fixed_discount: '0',
                                ppn: data[i].ppn,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: 'persen',
                                unit: data[i].unit,
                                total: data[i].total,
                            })
                    }

                    else {
                        tmpData.push(data[i]);
                    }

                }
                setData(tmpData);
            }
        }
        else if (key == 'pilihanDiskon') {
            for (let i = 0; i < data.length; i++) {
                if (i == y) {
                    if (value == 'nominal') {
                        tmpData.push(
                            {
                                id: data[i].id,
                                product_alias_name: data[i].product_alias_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: '0',
                                fixed_discount: data[i].fixed_discount,
                                ppn: data[i].ppn,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: value,
                                unit: data[i].unit,
                                total: data[i].total,

                            })
                    }
                    else if (value == 'persen') {
                        tmpData.push(
                            {
                                id: data[i].id,
                                product_alias_name: data[i].product_alias_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: data[i].discount_percentage,
                                fixed_discount: '0',
                                ppn: data[i].ppn,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: value,
                                unit: data[i].unit,
                                total: data[i].total,

                            })
                    }

                }
                else {
                    tmpData.push(data[i]);
                }

            }
            setData(tmpData);
        }
        else if (key == 'ppn') {
            // let hasil = value.toString().replaceAll('.', ',');
            let hasil = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "");

            // let hasil = value

            for (let i = 0; i < data.length; i++) {
                if (i == y) {

                    tmpData.push(
                        {
                            id: data[i].id,
                            product_alias_name: data[i].product_alias_name,
                            quantity: data[i].quantity,
                            price: data[i].price,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            ppn: hasil,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: data[i].pilihanDiskon,
                            unit: data[i].unit,
                            total: data[i].total,
                        })
                }
                else {
                    tmpData.push(data[i]);
                }

                // }
                setData(tmpData);
            }
        }

        // ubah total 
        let grandTotal;
        let arrTotal = [];
        console.log(tmpData)
        for (let i = 0; i < tmpData.length; i++) {
            if (i == y) {
                if (tmpData[i].pilihanDiskon == 'persen') {
                    let total = tmpData[i].quantity.replace(',', '.') * Number(tmpData[i].price.replace(',', '.'));
                    let getDiskon = (Number(total) * tmpData[i].discount_percentage.replace(',', '.')) / 100;

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.replace(',', '.')) / 100;
                    console.log(total)
                    console.log(ppn)

                    grandTotal = Number(total) - Number(getDiskon) + Number(ppn);
                    console.log(grandTotal)
                }
                else if (tmpData[i].pilihanDiskon == 'nominal') {
                    let total = (Number(tmpData[i].quantity.replace(',', '.')) * Number(tmpData[i].price.replace(',', '.')))
                    let getDiskon = Number(tmpData[i].fixed_discount.replace(',', '.'));

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.replace(',', '.')) / 100;
                    grandTotal = total - Number(getDiskon) + Number(ppn);
                }
                else {
                    let total = (Number(tmpData[i].quantity.replace(',', '.')) * Number(tmpData[i].price.replace(',', '.')))
                    let ppn = (Number(total) * tmpData[i].ppn.replace(',', '.')) / 100;
                    grandTotal = total + Number(ppn);
                }
                arrTotal.push(
                    {
                        id: tmpData[i].id,
                        product_alias_name: tmpData[i].product_alias_name,
                        quantity: tmpData[i].quantity,
                        price: tmpData[i].price,
                        discount_percentage: tmpData[i].discount_percentage,
                        fixed_discount: tmpData[i].fixed_discount,
                        ppn: tmpData[i].ppn,
                        subtotal: tmpData[i].subtotal,
                        pilihanDiskon: tmpData[i].pilihanDiskon,
                        unit: tmpData[i].unit,
                        total: grandTotal,
                    })
            }
            else {
                arrTotal.push(tmpData[i])

            }
        }

        setProduct(arrTotal)
        calculate(arrTotal, checked);
        setData(arrTotal)

    }

    const tableData =
        [...product.map((item, i) => ({
            no: i + 1,
            product_alias_name: item.product_alias_name,
            quantity: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={data[i].quantity.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "qty")} key="qty" />,
            unit: item.unit,
            price: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang} onKeyDown={(event) => klikEnter(event)} value={data[i].price.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "price")} />,
            discount:
                data[i].pilihanDiskon == 'noDisc' ?
                    <div className='d-flex p-1' style={{ height: "100%" }}>
                        <input onKeyDown={(event) => klikEnter(event)} style={{ width: "70%", fontSize: "10px!important" }} type="text" className="text-center editable-input" defaultValue={data[i].discount_percentage} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} />
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
                                    {mataUang}
                                </option>
                            </select>
                        </div>
                    </div> :
                    data[i].pilihanDiskon == 'persen' ?
                        <div className='d-flex p-1' style={{ height: "100%" }} >
                            <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={data[i].discount_percentage} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />
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
                                        {mataUang}
                                    </option>
                                </select>
                            </div>
                        </div>
                        :
                        data[i].pilihanDiskon == 'nominal' ?
                            <div className='d-flex p-1' style={{ height: "100%" }}>
                                <CurrencyFormat className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={data[i].fixed_discount.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />

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
                                            {mataUang}
                                        </option>
                                    </select>
                                </div>
                            </div> : null,
            ppn: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={'%'} onKeyDown={(event) => klikEnter(event)} value={item.ppn.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "ppn")} />,
            total:
                checked === true ?
                    <CurrencyFormat disabled className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} onKeyDown={(event) => klikEnter(event)} value={Number(total1Produk[i].detail).toFixed(2).replace('.', ',')} /> :
                    <CurrencyFormat disabled className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].total).toFixed(2).replace('.', ',')} />,
        }))]

    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(data, check_checked);
    };

    function tambahUangMuka(value) {
        let hasil = value.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
        console.log(hasil)
        setUangMuka(hasil);
        setTampilUangMuka(value)

    }

    const calculate = (product, check_checked) => {
        console.log(product)
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        let subTotal = 0;
        let totalPpn = 0;
        let rowDiscount = 0;
        let subTotalDiscount = 0;
        let totalDiscount = 0;
        let totalProdPpn = 0;

        let total1 = 0;
        let diskon2 = 0;
        let ppn2 = 0;
        let totalDiskon2 = 0;
        let subTotDiskon2 = 0;
        let subtotal2 = 0;

        let databaru = [];

        product.map((values, i) => {
            // termasuk pajak 
            if (check_checked) {
                total += (Number(values.quantity.replace(',', '.')) * Number(values.price.replace(',', '.')));
                totalPerProduk = (Number(values.quantity.replace(',', '.')) * Number(values.price.replace(',', '.')));

                total1 = (Number(values.quantity.replace(',', '.')) * Number(values.price.replace(',', '.')));


                if (values.pilihanDiskon == 'persen') {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.discount_percentage.replace(',', '.')) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.discount_percentage.replace(',', '.')) / 100);

                    diskon2 = (Number(total1) * Number(values.discount_percentage.replace(',', '.')) / 100);
                }
                else if (values.pilihanDiskon == 'nominal') {
                    hasilDiskon += Number(values.fixed_discount.replace(',', '.'));
                    rowDiscount = Number(values.fixed_discount.replace(',', '.'));

                    diskon2 = (Number(values.fixed_discount.replace(',', '.')));
                }
                totalDiscount += ((rowDiscount * 100) / (100 + Number(values.ppn.replace(',', '.'))));
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + Number(values.ppn.replace(',', '.')));
                totalPpn += ((((totalPerProduk * 100) / (100 + Number(values.ppn.replace(',', '.')))) - (rowDiscount * 100) / (100 + Number(values.ppn.replace(',', '.')))) * Number(values.ppn.replace(',', '.'))) / (100);
                grandTotal = subTotal - hasilDiskon + Number(totalPpn);
                subTotDiskon2 = total1 - diskon2;
                subtotal2 = subTotDiskon2;

                databaru.push({
                    detail: subtotal2
                })

                setTotal1Produk(databaru);

                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);

            }

            // tidak termasuk pajak 
            else {
                total += (Number(values.quantity.replace(',', '.')) * Number(values.price.replace(',', '.')));
                totalPerProduk = (Number(values.quantity.replace(',', '.')) * Number(values.price.replace(',', '.')));

                if (values.pilihanDiskon == 'persen') {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.discount_percentage.replace(',', '.')) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.discount_percentage.replace(',', '.')) / 100);
                }
                else if (values.pilihanDiskon == 'nominal') {

                    hasilDiskon += Number(values.fixed_discount.replace(',', '.'));
                    rowDiscount = Number(values.fixed_discount.replace(',', '.'));
                }
                // console.log(hasilDiskon)
                // totalDiscount += ((totalPerProduk * rowDiscount) / 100);
                // totalDiscount = hasilDiskon;
                totalDiscount += Number(rowDiscount);
                subTotal = total - (Number(totalPerProduk) * Number(rowDiscount) / 100);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * values.ppn.replace(',', '.')) / 100;
                grandTotal = total - totalDiscount + Number(totalPpn);

                setSubTotal(total)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);

            }


        })
    }


    const handleCheck = (event, index) => {
        setLoadingTable(true)
        let tmpData = [];
        let tmpDataBaru = [];
        let idTerima = [];
        let tmpDataCentang = [...tmpCentang]
        console.log(event)

        // pengecekan centang
        if (sumber == 'SO') {
            for (let i = 0; i < getDataProduct.length; i++) {

                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: !getDataProduct[i].statusCek
                    })
                    if (!tmpDataBaru[i].statusCek) {
                        let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.code);
                        tmpDataCentang.splice(idxHapus, 1)
                    }
                    else if (tmpDataBaru[i].statusCek == true) {
                        tmpDataCentang.push(tmpDataBaru[i].detail.code)
                    }
                }
                else {
                    tmpDataBaru.push(getDataProduct[i])
                }

              
            }
            setGetDataProduct(tmpDataBaru)
            // setIdTandaTerima(idTerima);

        }

        else if (sumber == 'Surat') {
            for (let i = 0; i < getDataSurat.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataSurat[i].detail,
                        statusCek: !getDataSurat[i].statusCek
                    })
                    if (!tmpDataBaru[i].statusCek) {
                        let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.code);
                        tmpDataCentang.splice(idxHapus, 1)
                    }
                    else if (tmpDataBaru[i].statusCek == true) {
                        tmpDataCentang.push(tmpDataBaru[i].detail.code)
                    }
                }
                else {
                    tmpDataBaru.push(getDataSurat[i])
                }

                
            }
            setGetDataSurat(tmpDataBaru)
        }

        setTmpCentang(tmpDataCentang)


        if (tmpDataBaru[index].statusCek) {
            // mencari id 
            if (sumber == 'SO') {
                for (let i = 0; i < getDataProduct.length; i++) {
                    if (tmpDataBaru[i].statusCek) {
                        idTerima = [...idTandaTerima, getDataProduct[i].detail.id]

                    }
                }
                setIdTandaTerima(idTerima);

            }
            else if (sumber == 'Surat') {
                for (let i = 0; i < getDataSurat.length; i++) {
                    if (tmpDataBaru[i].statusCek) {
                        idTerima = [...idTandaTerima, getDataSurat[i].detail.id]
                    }
                }
                setIdTandaTerima(idTerima);
            }

            console.log(idTerima)
            var strParams;
            var updatedList;
            if (sumber == "SO") {
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_pesanan_penjualan[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_pesanan_penjualan[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/sales_invoices_grouped_sales_order_details?${strParams}`, {
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
                            // updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_alias_name: updatedList[i].product_alias_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: '0',
                                    ppn: updatedList[i].ppn,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData, checked)
                    })
            }

            else if (sumber == "Surat") {
                console.log("halloi")
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_surat_jalan[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_surat_jalan[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/sales_invoices_grouped_delivery_note_details?${strParams}`, {
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
                            // updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_alias_name: updatedList[i].product_alias_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: '0',
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    ppn: updatedList[i].ppn,
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData, checked)

                    })
            }



            setProduct(tmpData);
        }
        else {

            idTerima = [...idTandaTerima]

            console.log(event.target.value.detail.id)
            for (let i = 0; i < idTerima.length; i++) {
                if (event.target.value.detail.id == idTerima[i]) {
                    idTerima.splice(i, 1);
                }
            }
            setIdTandaTerima(idTerima)
            // idTerima = [...idTandaTerima]
            console.log(idTerima)

            if (sumber == "SO") {
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_pesanan_penjualan[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_pesanan_penjualan[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/sales_invoices_grouped_sales_order_details?${strParams}`, {
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
                            // updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_alias_name: updatedList[i].product_alias_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: '0',
                                    ppn: updatedList[i].ppn,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData, checked)
                    })
            }

            else if (sumber == "Surat") {
                console.log("halloi")
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_surat_jalan[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_surat_jalan[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/sales_invoices_grouped_delivery_note_details?${strParams}`, {
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
                            // updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_alias_name: updatedList[i].product_alias_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: '0',
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    ppn: updatedList[i].ppn,
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData, checked)

                    })
            }
            setProduct(tmpData)
        }

        setLoadingTable(false)
    };

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
                text: "Data Penerima kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!addressId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Alamat Penerima kosong, Silahkan Lengkapi datanya ",
            });
        }
        // else if (!uangMuka){
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data Uang Muka kosong, Silahkan Lengkapi datanya ",
        //       });
        // }
        else if (!fakturType) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {

            const userData = new FormData();
            userData.append("tanggal", date);
            userData.append("referensi", referensi);
            userData.append("tipe", fakturType);
            userData.append("alamat_penerima", addressId);
            userData.append("penerima", customer);
            userData.append("catatan", description);
            userData.append("uang_muka", uangMuka);
            if (checked) {
                userData.append("termasuk_pajak", 1);

            }
            else {
                userData.append("termasuk_pajak", 0);

            }
            userData.append("status", "Submitted");
            product.map((p, i) => {
                userData.append("nama_alias_produk[]", p.product_alias_name);
                userData.append("kuantitas[]", p.quantity);
                userData.append("satuan[]", p.unit);
                userData.append("harga[]", p.price);
                userData.append("diskon_tetap[]", p.fixed_discount);
                userData.append("persentase_diskon[]", p.discount_percentage);
                if (p.pilihanDiskon == 'persen') {
                    userData.append("persentase_diskon[]", p.discount_percentage);

                    userData.append("diskon_tetap[]", 0);
                }
                else if (p.pilihanDiskon == 'nominal') {
                    userData.append("diskon_tetap[]", p.fixed_discount);

                    userData.append("persentase_diskon[]", 0);
                }
                userData.append("ppn[]", p.ppn);
            });
            console.log(idTandaTerima)

            idTandaTerima.map((item, i) => {
                if (sumber == 'SO') {
                    userData.append("id_pesanan_penjualan[]", item);

                }
                else {
                    userData.append("id_surat_jalan[]", item);

                }
            })


            axios({
                method: "post",
                url: `${Url}/sales_invoices`,
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
                    navigate("/faktur");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
                            //text: err.response.data.error,
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
                text: "Data Penerima kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!addressId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Alamat Penerima kosong, Silahkan Lengkapi datanya ",
            });
        }
        // else if (!uangMuka){
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data Uang Muka kosong, Silahkan Lengkapi datanya ",
        //       });
        // }
        else {

            const userData = new FormData();
            userData.append("tanggal", date);
            userData.append("referensi", referensi);
            userData.append("tipe", fakturType);
            userData.append("alamat_penerima", addressId);
            userData.append("penerima", customer);
            userData.append("catatan", description);
            userData.append("uang_muka", uangMuka);
            if (checked) {
                userData.append("termasuk_pajak", 1);

            }
            else {
                userData.append("termasuk_pajak", 0);

            }
            userData.append("status", "Draft");
            product.map((p, i) => {
                userData.append("nama_alias_produk[]", p.product_alias_name);
                userData.append("kuantitas[]", p.quantity);
                userData.append("satuan[]", p.unit);
                userData.append("harga[]", p.price);
                userData.append("diskon_tetap[]", p.fixed_discount);
                userData.append("persentase_diskon[]", p.discount_percentage);
                if (p.pilihanDiskon == 'persen') {
                    userData.append("persentase_diskon[]", p.discount_percentage);

                    userData.append("diskon_tetap[]", 0);
                }
                else if (p.pilihanDiskon == 'nominal') {
                    userData.append("diskon_tetap[]", p.fixed_discount);

                    userData.append("persentase_diskon[]", 0);
                }
                userData.append("ppn[]", p.ppn);
            });
            console.log(idTandaTerima)

            idTandaTerima.map((item, i) => {
                if (sumber == 'SO') {
                    userData.append("id_pesanan_penjualan[]", item);

                }
                else {
                    userData.append("id_surat_jalan[]", item);

                }
            })

            axios({
                method: "post",
                url: `${Url}/sales_invoices`,
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
                    navigate("/faktur");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
                            //text: err.response.data.error,
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

    function handleChangeTipe(value) {
        if (!value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tipe Faktur kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {
            setFakturType(value.value)
            setSelectedType(value)
        }
    }
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

    function klikUbahSumber(value) {

        if (!value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Jenis Transaksi kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {



            let tmpDataBaru = []
            // handle cek 
            if (sumber == 'SO') {
                for (let i = 0; i < getDataProduct.length; i++) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: false
                    })
                }
                setGetDataProduct(tmpDataBaru)
            }
            else if (sumber == 'Surat') {
                for (let i = 0; i < getDataSurat.length; i++) {
                    tmpDataBaru.push({
                        detail: getDataSurat[i].detail,
                        statusCek: false
                    })
                }
                setGetDataSurat(tmpDataBaru)
            }

            setSumber(value);
            setProduct([])
            setSelectedSupplier('');
            setSelectedCustomer('')
        }
    }

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
        setAddress(value.customer_addresses)
        setTmpCentang([])
        setProduct([])
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return axios.get(`${Url}/sales_invoices_available_customers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const loadOptionsPenerima = (inputValue) => {
        return axios.get(`${Url}/sales_invoices_available_recipients?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    return (
        <>
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Buat Faktur Penjualan"
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Faktur</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => klikUbahSumber(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option value="">Pilih Transaksi</option>
                                    <option value="SO">
                                        Uang Muka
                                    </option>
                                    <option value="Surat" >
                                        Penjualan
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Tipe Faktur</label>
                            <div className="col-sm-7">
                                <ReactSelect
                                    className="basic-single"
                                    placeholder="Pilih Tipe Faktur..."
                                    classNamePrefix="select"
                                    value={selectedType}
                                    isLoading={isLoading}
                                    isSearchable
                                    options={optionsType}
                                    onChange={handleChangeTipe}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col">
                        {
                            sumber == 'SO' ?
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Customer..."
                                            cacheOptions
                                            defaultOptions
                                            value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                            loadOptions={loadOptionsCustomer}
                                            onChange={handleChangeCustomer}
                                        />
                                    </div>
                                </div> :
                                null
                        }
                        {
                            sumber == 'Surat' ?
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Customer..."
                                            cacheOptions
                                            defaultOptions
                                            value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                            loadOptions={loadOptionsPenerima}
                                            onChange={handleChangeCustomer}
                                        />
                                    </div>
                                </div> : null
                        }



                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <ReactSelect
                                    className="basic-single"
                                    placeholder="Pilih Alamat..."
                                    classNamePrefix="select"
                                    isLoading={isLoading}
                                    isSearchable
                                    getOptionLabel={(e) => e.address}
                                    getOptionValue={(e) => e.id}
                                    options={address}
                                    onChange={(e) => setAddressId(e.id)}
                                />
                            </div>
                        </div>
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="col-sm-12">
                            <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                title={sumber == 'SO' ? "Daftar Pesanan" : "Daftar Surat Jalan"}
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            if (sumber == '') {
                                Swal.fire("Gagal", "Mohon Pilih Transaksi Dahulu..", "error");
                            }
                            else if (selectedValue == '') {
                                Swal.fire("Gagal", "Mohon Pilih Penerima Dahulu..", "error");

                            }
                            else {
                                setModal2Visible(true)
                            }
                        }}
                    />,
                    <Modal
                        title={sumber == 'SO' ? "Tambah Pesanan" : "Tambah Surat Jalan"}
                        centered
                        visible={modal2Visible}
                        onCancel={() => setModal2Visible(false)}
                        width={800}
                        footer={null}
                    >
                        <div className="text-title text-start">
                            <div className="row">
                                <div className="col mb-3">
                                    <Search
                                        placeholder={sumber == 'SO' ? "Cari Pesanan..." : "Cari Surat Jalan..."}
                                        style={{
                                            width: 400,
                                        }}
                                        onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                    />
                                </div>
                                {sumber == 'SO' ? <Table
                                    columns={columnsModal}
                                    dataSource={getDataProduct}
                                    scroll={{
                                        y: 250,
                                    }}
                                    pagination={false}
                                    loading={isLoading}
                                    size="middle"
                                /> : <Table
                                    columns={columnsModal}
                                    dataSource={getDataSurat}
                                    scroll={{
                                        y: 250,
                                    }}
                                    pagination={false}
                                    loading={isLoading}
                                    size="middle"
                                />
                                }
                            </div>
                        </div>
                    </Modal>,
                ]}
            >
                {sumber == 'SO' ? <Table
                    // components={components}
                    // rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={tableData}
                    isLoading={loadingTable}
                    columns={columns}
                // onChange={(e) => setProduct(e.target.value)}
                /> : <Table
                    // components={components}
                    // rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={tableData}
                    isLoading={loadingTable}
                    columns={columns}
                // onChange={(e) => setProduct(e.target.value)}
                />}
                <div className="row p-0 mt-3">
                    <div className="col ms-5">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" onChange={handleChange} />
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
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Uang Muka</label>
                            <div className="col-sm-6">
                                <CurrencyFormat
                                    className='form-control form-control-sm'
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={'Rp '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    value={tampilUangMuka}
                                    onChange={(e) => tambahUangMuka(e.target.value)} />
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
                <br />
                <div className="btn-group mt-2" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleDraft}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
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
                <div style={{ clear: 'both' }}></div>
            </PageHeader>
        </>
    )
}

export default BuatFaktur