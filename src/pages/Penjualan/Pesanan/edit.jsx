import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Skeleton, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import { formatQuantity, formatRupiah } from '../../../utils/helper';
import CurrencyFormat from 'react-currency-format';

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

const EditPesanan = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState('');
    const [customerName, setCustomerName] = useState(null);
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { id } = useParams();

    //state return data from database
    // const [getData, setGetData] = useState([]);
    const [getCode, setGetCode] = useState('');
    // const [getDate, setGetDate] = useState('');
    // const [getReferensi, setGetReferensi] = useState('');
    // const [getDesciption, setGetDesciption] = useState('');
    // const [getStatus, setGetStatus] = useState('');
    // const [getCustomer, setGetCustomer] = useState(null);
    // const [getProduct, setGetProduct] = useState([]);


    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [pilihanDiskon, setPilihanDiskon] = useState('');
    const [jumlahDiskon, setJumlahDiskon] = useState([]);

    useEffect(() => {
        getSalesOrderById()
    }, [])

    const getSalesOrderById = async (e) => {
        await axios.get(`${Url}/sales_orders?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0]
                setGetCode(getData.code);
                setDate(getData.date);
                setReferensi(getData.reference);
                setDescription(getData.notes);
                setStatus(getData.status);
                setCustomer(getData.customer.id);
                setCustomerName(getData.customer.name);
                setChecked(getData.tax_included);
                setProduct(getData.sales_order_details);

                setSubTotal(getData.subtotal);
                setGrandTotalDiscount(getData.discount);
                setTotalPpn(getData.ppn);
                setGrandTotal(getData.total);
                // setIsLoading(false);
                let temp = [];
                let tmpPilihanDiskon = [];
                let totalPerProduk = 0;
                let grandTotal = 0;
                let total = 0;
                let hasilDiskon = 0;
                for (let i = 0; i < getData.sales_order_details.length; i++) {
                    total += (Number(getData.sales_order_details[i].quantity) * Number(getData.sales_order_details[i].price));
                    totalPerProduk = (Number(getData.sales_order_details[i].quantity) * Number(getData.sales_order_details[i].price));

                    if (getData.sales_order_details[i].fixed_discount == 0 && getData.sales_order_details[i].discount_percentage == 0) {

                        temp[i] = 0;
                        tmpPilihanDiskon[i] = "percent";
                        hasilDiskon += 0;
                    }
                    else if (getData.sales_order_details[i].fixed_discount != 0) {
                        temp[i] = getData.sales_order_details[i].fixed_discount;
                        tmpPilihanDiskon[i] = "nominal";
                        hasilDiskon += Number(getData.sales_order_details[i].fixed_discount);

                    }
                    else {
                        temp[i] = getData.sales_order_details[i].discount_percentage;
                        tmpPilihanDiskon[i] = "percent";
                        hasilDiskon += (Number(totalPerProduk) * Number(getData.sales_order_details[i].discount_percentage) / 100);
                    }
                }
                setPilihanDiskon(tmpPilihanDiskon)
                setJumlahDiskon(temp);
                // console.log(getData)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    useEffect(() => {
        getSalesOrderDetails()
    }, [])
    const getSalesOrderDetails = async () => {
        await axios.get(`${Url}/sales_order_details/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data
                setProduct(getData);
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
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

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_products?nama_alias=${query}`, {
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

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'alias_name',
            key: 'alias_name',
        },
        {
            title: 'Stok',
            dataIndex: 'stock',
            width: '15%',
            align: 'center',
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
                    // checked={record.key === product.alias_name}
                    // defaultCheckedOptions={product}
                    />
                </>
            )
        },
    ];

    function gantiPilihanDiskon(value, index) {
        let tmp = [];
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        let subTotal = 0;
        let totalPpn = 0;
        let rowDiscount = 0;
        let subTotalDiscount = 0;
        let totalDiscount = 0;
        if (pilihanDiskon.length === 0) {
            for (let i = 0; i < product.length; i++) {
                tmp[i] = '';
            }
            setPilihanDiskon(tmp);
        }

        for (let i = 0; i < product.length; i++) {
            if (checked) {
                total += (Number(product[i].quantity) * Number(product[i].price));
                totalPerProduk = (Number(product[i].quantity) * Number(product[i].price));

                if (i === index) {
                    tmp[i] = value;
                    if (value == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    }
                    else if (value == 'nominal') {

                        hasilDiskon += Number(jumlahDiskon[i]);
                        rowDiscount = Number(jumlahDiskon[i]);
                    }
                }
                else {
                    tmp[i] = pilihanDiskon[i];
                    if (pilihanDiskon[i] == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    }
                    else if (pilihanDiskon[i] == 'nominal') {
                        hasilDiskon += Number(jumlahDiskon[i]);
                        rowDiscount = Number(jumlahDiskon[i]);
                    }
                }
                // subTotalDiscount   = totalPerProduk - rowDiscount;
                // subTotal   += (subTotalDiscount * 100) / (100 + product[i].ppn);
                // totalPpn   = (subTotal * product[i].ppn) / 100;
                // grandTotal = subTotal - hasilDiskon + Number(totalPpn);

                // setSubTotal(Number(subTotal));
                // setGrandTotalDiscount(hasilDiskon);
                // setTotalPpn(totalPpn)
                // setGrandTotal(grandTotal);
                // setPilihanDiskon(tmp);



                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + product[i].ppn);
                totalDiscount += ((rowDiscount * 100) / (100 + product[i].ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + product[i].ppn)) - (rowDiscount * 100) / (100 + product[i].ppn)) * product[i].ppn) / (100);
                grandTotal = subTotal - totalDiscount + Number(totalPpn);
                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                setPilihanDiskon(tmp);
            } else {
                total += (Number(product[i].quantity) * Number(product[i].price));
                totalPerProduk = (Number(product[i].quantity) * Number(product[i].price));

                if (i === index) {
                    tmp[i] = value;
                    if (value == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    }
                    else if (value == 'nominal') {

                        hasilDiskon += Number(jumlahDiskon[i]);
                        rowDiscount = Number(jumlahDiskon[i]);
                    }
                }
                else {
                    tmp[i] = pilihanDiskon[i];
                    if (pilihanDiskon[i] == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    }
                    else if (pilihanDiskon[i] == 'nominal') {
                        hasilDiskon += Number(jumlahDiskon[i]);
                        rowDiscount = Number(jumlahDiskon[i]);
                    }
                }
                grandTotal = Number(total) - Number(hasilDiskon) + Number(totalPpn);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * product[i].ppn) / 100;

                setSubTotal(Number(total));
                setGrandTotalDiscount(hasilDiskon);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                setPilihanDiskon(tmp);
            }
        }

    }

    function ubahJumlahDiskon(value, index) {
        console.log(checked)
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        let tmp = [];
        let subTotal = 0;
        let totalPpn = 0;
        let rowDiscount = 0;
        let subTotalDiscount = 0;
        let totalDiscount = 0;
        if (jumlahDiskon.length === 0) {
            for (let i = 0; i < product.length; i++) {
                tmp[i] = '';
            }
            setJumlahDiskon(tmp);
        }

        for (let i = 0; i < product.length; i++) {
            if (checked) {
                total += (Number(product[i].quantity) * Number(product[i].price));
                totalPerProduk = (Number(product[i].quantity) * Number(product[i].price));

                if (i === index) {
                    tmp[i] = value;
                    if (value == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    }
                    else if (value == 'nominal') {

                        hasilDiskon += Number(jumlahDiskon[i]);
                        rowDiscount = Number(jumlahDiskon[i]);
                    }
                }
                else {
                    tmp[i] = jumlahDiskon[i];
                    if (pilihanDiskon[i] == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    }
                    else if (pilihanDiskon[i] == 'nominal') {
                        hasilDiskon += Number(jumlahDiskon[i]);
                        rowDiscount = Number(jumlahDiskon[i]);
                    }
                }
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + Number(product[i].ppn));
                totalDiscount += ((rowDiscount * 100) / (100 + Number(product[i].ppn)));
                totalPpn += ((((totalPerProduk * 100) / (100 + Number(product[i].ppn))) - (rowDiscount * 100) / (100 + Number(product[i].ppn))) * product[i].ppn) / (100);
                grandTotal = subTotal - totalDiscount + Number(totalPpn);
                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                setJumlahDiskon(tmp);
            } else {
                total += (Number(product[i].quantity) * Number(product[i].price));
                totalPerProduk = (Number(product[i].quantity) * Number(product[i].price));
                if (i === index) {
                    tmp[i] = value;
                    if (pilihanDiskon[i] == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(value) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(value) / 100);
                    }
                    else if (pilihanDiskon[i] == 'nominal') {

                        hasilDiskon += Number(value);
                        rowDiscount = Number(value);
                    }
                }
                else {
                    tmp[i] = jumlahDiskon[i];
                    if (pilihanDiskon[i] == 'percent') {
                        hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                        rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    }
                    else if (pilihanDiskon[i] == 'nominal') {

                        hasilDiskon += Number(jumlahDiskon[i]);
                        rowDiscount = Number(jumlahDiskon[i]);
                    }
                }
                grandTotal = Number(total) - Number(hasilDiskon) + Number(totalPpn);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * product[i].ppn) / 100;

                setSubTotal(Number(total));
                setGrandTotalDiscount(hasilDiskon);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                setJumlahDiskon(tmp);
            }
        }
    }

    const convertToRupiah = (angka, namaMataUang) => {
        // return <input
        //     value={namaMataUang + ' ' + angka.toLocaleString('id')}
        //     readOnly="true"
        //     className="form-control form-control-sm"
        //     id="colFormLabelSm"
        // />

        return <>
        {
            namaMataUang === 'Rp' ?
                < CurrencyFormat className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                : < CurrencyFormat className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
        }
    </>
    }

    const tableToRupiah = (angka, namaMataUang) => {
        //return namaMataUang + ' ' + angka.toLocaleString('id');
        // {
        //     namaMataUang === 'Rp' ?
        //         < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
        //         : < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />

        // }
        return < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
    }

    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render(text, record, index) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{index + 1}</div>
                };
            }
        },
        {
            title: 'Nama Produk Alias',
            dataIndex: 'alias_name',
            render(text, record) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            editable: true,
            render(text, record) {
                return {
                    props: {
                    },
                    children: <div>{Number(text).toFixed(2).replace('.',',')}</div>
                };
            }
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            width: '5%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{text}</div>
                };
            }
        },
        {
            title: 'Harga',
            dataIndex: 'price',
            width: '15%',
            align: 'center',
            editable: true,
            render(text, record) {
                return {
                    props: {
                    },
                    children: <div>{< CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(text).toFixed(2).replace('.' , ',')} key="diskon" />}</div>
                };
            }
        },
        // {
        //     title: 'Discount (Rp)',
        //     dataIndex: 'fixed_discount',
        //     width: '10%',
        //     align: 'center',
        //     editable: true,
        //     render(text, record) {
        //         return {
        //             props: {
        //                 style: { background: "#f5f5f5" }
        //             },
        //             children: <div>Rp. {text}</div>
        //         };
        //     }
        // },
        // {
        //     title: 'Discount (%)',
        //     dataIndex: 'discount_percentage',
        //     width: '5%',
        //     align: 'center',
        //     editable: true,
        //     render(text, record) {
        //         return {
        //             props: {
        //                 style: { background: "#f5f5f5" }
        //             },
        //             children: <div>{text} %</div>
        //         };
        //     }
        // },
        {
            title: 'Discount',
            dataIndex: 'discount',
            width: '15%',
            align: 'center',
            render: (text, record, index) => {
                return <div className="input-group input-group-sm">
                    {
                        product[index].discount_percentage != 0 ?
                            <>
                                <input style={{ width: "30px" }} type="text" className="form-control" aria-label="Small" defaultValue={product[index].discount_percentage} onChange={(e) => ubahJumlahDiskon(e.target.value, index)} aria-describedby="inputGroup-sizing-sm" />
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                                        <select

                                            onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                            id="grupSelect"
                                            className="form-select select-diskon"
                                            style={{ width: "70px" }}
                                        >
                                            <option value="" >
                                                Pilih
                                            </option>
                                            <option selected value="percent" >
                                                %
                                            </option>
                                            <option value="nominal">
                                                Rp
                                            </option>
                                        </select>
                                    </span>
                                </div></> : product[index].fixed_discount != 0 ?
                                <>
                                    <input style={{ width: "30px" }} type="text" className="form-control" aria-label="Small" defaultValue={product[index].fixed_discount} onChange={(e) => ubahJumlahDiskon(e.target.value, index)} aria-describedby="inputGroup-sizing-sm" />
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                                            <select

                                                onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                                id="grupSelect"
                                                className="form-select select-diskon"
                                                style={{ width: "70px" }}
                                            >
                                                <option value="" >
                                                    Pilih
                                                </option>
                                                <option value="percent" >
                                                    %
                                                </option>
                                                <option selected value="nominal">
                                                    Rp
                                                </option>
                                            </select>
                                        </span>
                                    </div></> : <>
                                    <input style={{ width: "30px" }} type="text" className="form-control" aria-label="Small" defaultValue={product[index].fixed_discount} onChange={(e) => ubahJumlahDiskon(e.target.value, index)} aria-describedby="inputGroup-sizing-sm" />
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                                            <select

                                                onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                                id="grupSelect"
                                                className="form-select select-diskon"
                                                style={{ width: "70px" }}
                                            >
                                                {/* <option selected value="" >
                                     Pilih
                                 </option> */}
                                                <option value="percent" >
                                                    %
                                                </option>
                                                <option value="nominal">
                                                    Rp
                                                </option>
                                            </select>
                                        </span>
                                    </div></>
                    }

                </div>
            }
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '10%',
            align: 'center',
            editable: true,
            render(text, record) {
                return {
                    props: {
                    },
                    children: <div>{text} %</div>
                };
            }
        },
        {
            title: 'Jumlah',
            dataIndex: 'subtotal_after_discount',
            width: '14%',
            align: 'center',
            render:
                (text, record, index) => {
                    let grandTotalAmount = 0;
                    if (pilihanDiskon[index] == 'percent' || pilihanDiskon == 'percent') {
                        // console.log("masuk percent")
                        let total = (record.quantity * record.price);
                        let getPercent = (total * jumlahDiskon[index]) / 100;
                        let totalDiscount = total - getPercent;
                        let getPpn = (totalDiscount * record.ppn) / 100;
                        if (checked) {
                            grandTotalAmount = tableToRupiah(totalDiscount, "Rp");
                        } else {
                            grandTotalAmount = tableToRupiah(totalDiscount + getPpn, "Rp");
                        }
                    } else if (pilihanDiskon[index] == 'nominal') {
                        // console.log("masuk nominal")
                        let total = (record.quantity * record.price) - jumlahDiskon[index];
                        let getPpn = (total * record.ppn) / 100;
                        if (checked) {
                            grandTotalAmount = tableToRupiah(Number(total), "Rp");
                        } else {
                            grandTotalAmount = tableToRupiah(Number(total) + Number(getPpn), "Rp");
                        }
                    } else {
                        grandTotalAmount = tableToRupiah(Number(record.quantity) * Number(record.price), "Rp");
                    }
                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: grandTotalAmount
                    }
                }
        },
        {
            title: 'Actions',
            // dataIndex: 'ppn',
            width: '10%',
            align: 'center',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        size='small'
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            )
        },
    ];

    const handleDelete = (stid) => {
        setProduct(data => data.filter(item => item.id !== stid));
    };

    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(product, check_checked);
    };
    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.alias_name === item.alias_name);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        let check_checked = checked;
        calculate(newData, check_checked);
    };


    const calculate = (product, check_checked) => {
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
            if (check_checked) {
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

                if (pilihanDiskon[i] == 'percent') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                }
                else if (pilihanDiskon[i] == 'nominal') {

                    hasilDiskon += Number(jumlahDiskon[i]);
                    rowDiscount = Number(jumlahDiskon[i]);
                }
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + Number(values.ppn));
                totalDiscount += ((rowDiscount * 100) / (100 + Number(values.ppn)));
                totalPpn += ((((totalPerProduk * 100) / (100 + Number(values.ppn))) - (rowDiscount * 100) / (100 + Number(values.ppn))) * Number(values.ppn)) / (100);
                grandTotal = subTotal - totalDiscount + Number(totalPpn);
                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            } else {
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

                if (pilihanDiskon[i] == 'percent') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                }
                else if (pilihanDiskon[i] == 'nominal') {

                    hasilDiskon += Number(jumlahDiskon[i]);
                    rowDiscount = Number(jumlahDiskon[i]);
                }
                totalDiscount += Number(rowDiscount);
                subTotal = total - (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * Number(values.ppn)) / 100;
                grandTotal = total - totalDiscount + Number(totalPpn);

                setSubTotal(total)
                setGrandTotalDiscount(totalDiscount);
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

    const handleCheck = (event) => {
        console.log(event.target.checked)
        var updatedList = [...product];
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
        let tmp = [];
        let tmpJumlah = [];
        for (let i = 0; i < updatedList.length; i++) {
            tmp[i] = 'percent';
            tmpJumlah[i] = 0;
        }
        setPilihanDiskon(tmp);
        setJumlahDiskon(tmpJumlah)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        product.map((p) => {
            // console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/sales_orders/${id}`,
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
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/sales_orders/${id}`,
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
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        )
    }

    return (
        <>
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Edit Pesanan Penjualan"
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
                                    disabled
                                    defaultValue={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={customerName}
                                    value={selectedValue}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
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
                                    value={referensi}
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
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                <h5>
                                    {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                title="Daftar Produk"
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModal2Visible(true)}
                    />,
                    <Modal
                        title="Tambah Produk"
                        centered
                        visible={modal2Visible}
                        onCancel={() => setModal2Visible(false)}
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
                                        placeholder="Cari Produk..."
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
                                    loading={loading}
                                    size="middle"
                                />
                            </div>
                        </div>
                    </Modal>,
                ]}
            >
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={product}
                    columns={columns}
                    onChange={(e) => setProduct(e.target.value)}
                />

                <div className="row p-0 mt-3">
                    <div className="col ms-5">
                        <div className="form-check">
                            <input className="form-check-input" defaultChecked={checked} type="checkbox" id="flexCheckDefault" onChange={handleChange} />
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk PPN
                            </label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                                {convertToRupiah(subTotal, "Rp")}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                {convertToRupiah(grandTotalDiscount, "Rp")}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                {convertToRupiah(totalPpn, "Rp")}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                {convertToRupiah(grandTotal, "Rp")}
                            </div>
                        </div>
                    </div>
                </div>

<br/>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
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

export default EditPesanan