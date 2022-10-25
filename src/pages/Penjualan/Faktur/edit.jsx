import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import CurrencyFormat from 'react-currency-format';
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

const EditFaktur = () => {

    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [code, setCode] = useState('');
    const [transaksi, setTransaksi] = useState('');
    const [fakturType, setFakturType] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState("");
    const [customer, setCustomer] = useState("");
    const [catatan, setCatatan] = useState("");
    const [product, setProduct] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [source, setSource] = useState([]);
    const [query, setQuery] = useState("");
    const [idTandaTerima, setIdTandaTerima] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState("");
    const [uangMuka, setUangMuka] = useState()

    const navigate = useNavigate();

    const { id } = useParams();

    //state return data from database

    const [getDataProduct, setGetDataProduct] = useState();
    const [getDataSurat, setGetDataSurat] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [getStatus, setGetStatus] = useState('');

    const [subTotal, setSubTotal] = useState("");
    const [dataHeader, setDataHeader] = useState([]);
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalKeseluruhan, setTotalKeseluruhan] = useState("");
    const [mataUang, setMataUang] = useState("Rp ");
    const [grup, setGrup] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [term, setTerm] = useState("");
    // const [selectedAlamat, setSelectedAlamat] = useState("");
    const [selectedPenerima, setSelectedPenerima] = useState();
    const [selectedAddress, setSelectedAddress] = useState();
    const [addressId, setAddressId] = useState();
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [sumber, setSumber] = useState("");
    const [dataSupplier, setDataSupplier] = useState()
    const [dataBarang, setDataBarang] = useState([])
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const handleChangeTipe = (value) => {
        // console.log(value)
        // setSelectedAddress('')
        console.log(value)
        setSelectedType(value);
    };

    const handleChangeCustomer = (value) => {
        // console.log(value)
        setSelectedAddress('')
        setSelectedPenerima(value);
        setCustomer(value.id);
        setAddress(value.customer_addresses)
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_customers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // const loadOptionsAddress = () => {
    //         return axios.get(`${Url}/customer_addresses/${customer}`, {
    //             headers: {
    //                 Accept: "application/json",
    //                 Authorization: `Bearer ${auth.token}`,
    //             },
    //         }).then((res) => res.data);

    // };

    // useEffect(()=>{
    //     loadOptionsAddress()
    // }, [customer])

    const handleChangeAddress = (value) => {
        // console.log(value)
        setSelectedAddress(value);
        setAddressId(value.id);
    };


    useEffect(() => {
        // getSalesOrderDetails()
        getCodeFaktur()
        getDataFaktur()
    }, [])

    const getDataFaktur = async () => {
        await axios.get(`${Url}/select_sales_invoices?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data[0]
                setDataHeader(getData);
                setDate(getData.date)
                setSubTotal(getData.subtotal)
                setGrandTotal(getData.total)
                setUangMuka(getData.down_payment);
                setTotalPpn(getData.ppn);
                setSelectedType({
                    value: getData.type,
                    label: getData.type
                });
                setGetStatus(getData.status);
                setGrandTotalDiscount(getData.discount);
                setTerm(getData.term);
                setSelectedAddress(getData.recipient_address)
                setAddressId(getData.recipient_address.id)
                setSelectedPenerima(getData.recipient)
                setCustomer(getData.recipient.id)
                setCatatan(getData.notes)

                let dataSumber;
                if (getData.delivery_notes) {
                    setSumber('Surat')
                    setDataBarang(getData.sales_invoice_details)
                    dataSumber = getData.delivery_notes

                }
                else if (getData.sales_orders) {
                    setSumber('SO')
                    setDataBarang(getData.sales_invoice_details)
                    dataSumber = getData.sales_orders
                }
                let total = Number(getData.ppn) - Number(getData.down_payment) + Number(getData.subtotal) - Number(getData.discount)
                setTotalKeseluruhan(total)


                // setting data produk
                let updatedList = getData.sales_invoice_details
                let tmpData = []
                let tmpTandaTerima = []
                for (let i = 0; i < updatedList.length; i++) {
                    tmpData.push(
                        {
                            product_alias_name: updatedList[i].product_alias_name,
                            quantity: updatedList[i].quantity,
                            price: updatedList[i].price,
                            discount_percentage: updatedList[i].discount_percentage,
                            fixed_discount: updatedList[i].fixed_discount,
                            subtotal: updatedList[i].subtotal,
                            pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                            ppn: updatedList[i].ppn,
                            unit: updatedList[i].unit,
                            total: updatedList[i].total

                        })
                }
                setData(tmpData);
                setProduct(tmpData)
                console.log(tmpData)

                for (let i = 0; i < dataSumber.length; i++) {
                    tmpTandaTerima.push(dataSumber[i].id)
                }
                setIdTandaTerima(tmpTandaTerima)

                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }



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
            const res = await axios.get(`${Url}/sales_invoices_available_sales_orders?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                tmp.push({
                    detail: res.data.data[i],
                    statusCek: false
                });
            }

            setGetDataProduct(tmp);
            console.log(res.data.data)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/sales_invoices_available_delivery_notes?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                tmp.push({
                    detail: res.data.data[i],
                    statusCek: false
                });
            }
            setGetDataSurat(tmp);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])


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
                return <>{record.detail.customer.name}</>
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


    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: 'no',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Nama Produk Alias',
            dataIndex: 'product_alias_name',
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
            width: '20%',
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
            width: '14%',
            align: 'center',

        },
    ];

    // console.log(product)

    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(data, check_checked);
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

    function klikUbahData(y, value, key) {
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
            let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");

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
                                discount_percentage: data[i].discount_percentage,
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
                                fixed_discount: data[i].fixed_discount,
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
                    tmpData.push(
                        {
                            id: data[i].id,
                            product_alias_name: data[i].product_alias_name,
                            quantity: data[i].quantity,
                            price: data[i].price,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            ppn: data[i].ppn,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: value,
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
        else if (key == 'ppn') {
            let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");

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
                    let total = tmpData[i].quantity.replace(',', '.') * Number(tmpData[i].price);
                    let getDiskon = (Number(total) * tmpData[i].discount_percentage.replace(',', '.')) / 100;

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.toString().replace(',', '.')) / 100;
                    console.log(total)
                    console.log(ppn)

                    grandTotal = Number(total) - Number(getDiskon) + Number(ppn);
                    console.log(grandTotal)
                }
                else if (tmpData[i].pilihanDiskon == 'nominal') {
                    let total = (Number(tmpData[i].quantity.replace(',', '.')) * Number(tmpData[i].price))
                    let getDiskon = tmpData[i].fixed_discount;

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.toString().replace(',', '.')) / 100;
                    grandTotal = total - Number(getDiskon) + Number(ppn);
                }
                else {
                    let total = (Number(tmpData[i].quantity.replace(',', '.')) * Number(tmpData[i].price))
                    let ppn = (Number(total) * tmpData[i].ppn.toString().replace(',', '.')) / 100;
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
        product.map((values, i) => {
            // termasuk pajak 
            if (check_checked) {
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

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
                console.log("sndjsbfj")
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

                if (values.pilihanDiskon == 'persen') {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                }
                else if (values.pilihanDiskon == 'nominal') {

                    hasilDiskon += Number(values.fixed_discount);
                    rowDiscount = Number(values.fixed_discount);
                }
                // console.log(hasilDiskon)
                // totalDiscount += ((totalPerProduk * rowDiscount) / 100);
                // totalDiscount = hasilDiskon;
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

    const handleCheck = (event, index) => {
        setLoadingTable(true)
        let tmpData = [];
        let tmpDataBaru = [];
        let idTerima = [];

        // pengecekan centang
        if (sumber == 'SO') {
            for (let i = 0; i < getDataProduct.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: !getDataProduct[i].statusCek
                    })
                    // if (tmpDataBaru[i].statusCek) {
                    //     idTerima = [...idTandaTerima, getDataProduct[i].detail.id]

                    // }
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
                    // if (tmpDataBaru[i].statusCek) {
                    //     idTerima = [...idTandaTerima, getDataProduct[i].detail.id]
                    // }
                }
                else {
                    tmpDataBaru.push(getDataSurat[i])
                }
            }
            setGetDataSurat(tmpDataBaru)
            // setIdTandaTerima(idTerima);
        }

        if (tmpDataBaru[index].statusCek) {
            // mencari id 
            if (sumber == 'SO') {
                for (let i = 0; i < getDataProduct.length; i++) {
                    if (tmpDataBaru[i].statusCek) {
                        idTerima = [...idTandaTerima, getDataProduct[i].detail.id]

                    }
                }
                setIdTandaTerima(new Set(idTerima));

            }



            else if (sumber == 'Surat') {
                for (let i = 0; i < getDataSurat.length; i++) {
                    if (tmpDataBaru[i].statusCek) {
                        idTerima = [...idTandaTerima, getDataSurat[i].detail.id]
                    }
                }
                setIdTandaTerima(new Set(idTerima));
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
                                    fixed_discount: 0,
                                    ppn: updatedList[i].ppn,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData)
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
                                    fixed_discount: 0,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    ppn: updatedList[i].ppn,
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
                                    fixed_discount: 0,
                                    ppn: updatedList[i].ppn,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData)
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
                                    fixed_discount: 0,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: 'persen',
                                    ppn: updatedList[i].ppn,
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData)

                    })
            }
            setProduct(tmpData)
        }

        setLoadingTable(false)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        // userData.append("referensi", referensi);
        userData.append("tipe", fakturType);
        userData.append("alamat_penerima", address);
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

        idTandaTerima.map((item, i) => {
            if (sumber == 'SO') {
                userData.append("id_pesanan_penjualan[]", item);

            }
            else {
                userData.append("id_surat_jalan[]", item);

            }
        })

        axios({
            method: "put",
            url: `${Url}/sales_invoices?id_faktur_penjualan=${id}`,
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
                navigate("/tallypembelian");
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
        const userData = new URLSearchParams();
        console.log(selectedType)
        userData.append("tanggal", date);
        // userData.append("referensi", referensi);
        userData.append("tipe", selectedType.value);
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
            // userData.append("diskon_tetap[]", p.fixed_discount);
            // userData.append("persentase_diskon[]", p.discount_percentage);
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

        idTandaTerima.map((item, i) => {
            if (sumber == 'SO') {
                userData.append("id_pesanan_penjualan[]", item);

            }
            else {
                userData.append("id_surat_jalan[]", item);

            }
        })


        axios({
            method: "put",
            url: `${Url}/sales_invoices?id_faktur_penjualan=${id}`,
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
                navigate("/tallypembelian");
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

    const TableData =
        [...product.map((item, i) => ({
            no: i + 1,
            product_alias_name: item.product_alias_name,
            quantity: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].quantity)} onChange={(e) => klikUbahData(i, e.target.value, "qty")} key="qty" />,
            unit: item.unit,
            price: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang} onKeyDown={(event) => klikEnter(event)} value={Number(item.price)} onChange={(e) => klikUbahData(i, e.target.value, "price")} />,
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
                                <CurrencyFormat className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].fixed_discount)} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />

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
            ppn: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={'%'} onKeyDown={(event) => klikEnter(event)} value={Number(item.ppn)} onChange={(e) => klikUbahData(i, e.target.value, "ppn")} />,
            total: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].total)} />,
        }))]


    if (loading) {
        return <div></div>
    }

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Edit Faktur</h3>
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
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Faktur</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <input
                                    value={sumber == 'SO' ? 'Penjualan' : 'Surat Jalan'}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Tipe Faktur</label>
                            <div className="col-sm-7">
                                <ReactSelect
                                    className="basic-single"
                                    placeholder="Pilih Tipe Faktur..."
                                    classNamePrefix="select"
                                    defaultInputValue={selectedType.label}
                                    value={selectedType}
                                    getOptionLabel={(e) => e.label}
                                    getOptionValue={(e) => e.value}
                                    options={optionsType}
                                    onChange={handleChangeTipe}
                                // options={optionsType}
                                // onChange={handleChangeTipe}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Penerima</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Penerima..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedPenerima.name}
                                    value={selectedPenerima}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <ReactSelect
                                    placeholder="Pilih Alamat..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedAddress.address}
                                    value={selectedAddress}
                                    getOptionLabel={(e) => e.address}
                                    getOptionValue={(e) => e.id}
                                    options={address}
                                    onChange={handleChangeAddress}
                                />
                            </div>
                        </div>
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="col-sm-12">
                            <textarea
                                defaultValue={catatan}
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                onChange={(e) => setCatatan(e.target.value)}
                            />
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                <h5>
                                    {getStatus === 'Submitted' ? <Tag color="blue">{getStatus}</Tag> : getStatus === 'Draft' ? <Tag color="orange">{getStatus}</Tag> : getStatus === 'Done' ? <Tag color="green">{getStatus}</Tag> : <Tag color="red">{getStatus}</Tag>}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Surat Jalan</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Surat Jalan"
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
                                                placeholder="Cari Surat Jalan..."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={sumber == 'SO' ? getDataProduct : getDataSurat}
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
                        isLoading={loadingTable}
                        dataSource={TableData}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div className="row p-0">
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


                                {/* <input
                                    defaultValue={subTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(Total Qty X harga) per item + ... '
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix={'Rp '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotalDiscount).toFixed(2).replace('.', ',')} key="total" />

                                {/* <input
                                    defaultValue={grandTotalDiscount}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(total disc/item) ditotal semua'
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix={'Rp '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(totalPpn).toFixed(2).replace('.', ',')} key="total" />

                                {/* <input
                                    defaultValue={totalPpn}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='ppn per item di total semua row'
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix={'Rp '} disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotal).toFixed(2).replace('.', ',')} key="total" />

                                {/* <input
                                    defaultValue={grandTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='subtotal - diskon + ppn'
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    {
                        getStatus == 'Submitted' ?
                            <button
                                type="button"
                                className="btn btn-success rounded m-1"
                                value="Draft"
                                onClick={handleSubmit}
                            >
                                Simpan
                            </button>
                            :
                            <>
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
                                </button></>
                    }

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

export default EditFaktur