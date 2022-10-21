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
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const [uangMuka, setUangMuka] = useState(0);
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const [getDataProduct, setGetDataProduct] = useState();
    const [getDataSurat, setGetDataSurat] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState(false);

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    // const [pilihanDiskon, setPilihanDiskon] = useState('percent');
    const [pilihanDiskon, setPilihanDiskon] = useState('');
    const [jumlahDiskon, setJumlahDiskon] = useState([]);

    const [selectedSupplier, setSelectedSupplier] = useState()
    const [sumber, setSumber] = useState('')
    const [fakturType, setFakturType] = useState('')
    const [selectedType, setSelectedType] = useState('')

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
            // console.log(res.data.map(d => d.id))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

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
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    useEffect(() => {
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
            align: 'center',
            title: 'Pelanggan',
            dataIndex: 'customer',
            render: (_, record) => {
                return <>{record.detail.customer.name}</>
            }
        },
        // {
        //     align: 'center',
        //     title: 'Penerima',
        //     dataIndex: 'recipient',
        //     render: (_, record) => {
        //         return <>{record.detail.code}</>
        //     }
        // },
        {
            align: 'center',
            title: 'Total',
            dataIndex: 'total',
            render: (_, record) => {
                return <>{record.detail.total}</>
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

    const columnsModal2 = [
        {
            title: 'Nama Produk',
            dataIndex: 'alias_name',
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
                subTotal += (totalPerProduk * 100) / (100 + product[i].ppn);
                totalDiscount += ((rowDiscount * 100) / (100 + product[i].ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + product[i].ppn)) - (rowDiscount * 100) / (100 + product[i].ppn)) * product[i].ppn) / (100);
                grandTotal = subTotal - totalDiscount + Number(totalPpn);
                console.log(rowDiscount, pilihanDiskon[i], "Cek")
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

                totalDiscount += Number(rowDiscount);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * Number(product[i].ppn)) / 100;
                grandTotal = Number(total) - Number(totalDiscount) + Number(totalPpn);

                setSubTotal(Number(total));
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                setJumlahDiskon(tmp);
            }
        }
    }
    const convertToRupiah = (angka, namaMataUang) => {
        return <input
            value={namaMataUang + ' ' + angka.toLocaleString('id')}
            readOnly="true"
            className="form-control form-control-sm"
            id="colFormLabelSm"
        />
    }
    const tableToRupiah = (angka, namaMataUang) => {
        return namaMataUang + ' ' + angka.toLocaleString('id');
    }



    useEffect(() => {
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
            if (checked) {
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
                totalDiscount += ((rowDiscount * 100) / (100 + Number(values.ppn)));
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (subTotalDiscount * 100) / (100 + Number(values.ppn));
                totalPpn = (subTotal * Number(values.ppn)) / 100;
                // if (uangMuka == null) {
                //     grandTotal = subTotal - hasilDiskon + Number(totalPpn);
                // } else {
                //     grandTotal = (subTotal - hasilDiskon + Number(totalPpn)) - uangMuka;
                // }

                grandTotal = subTotal - hasilDiskon + Number(totalPpn);

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
                // if (uangMuka == null) {
                //     grandTotal = subTotal - hasilDiskon + Number(totalPpn);
                // } else {
                //     grandTotal = (subTotal - hasilDiskon + Number(totalPpn)) - uangMuka;
                // }

                setSubTotal(total)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            }
        })
    }, [jumlahDiskon]);

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
            dataIndex: 'product_alias_name',
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
                    // children: <div>{formatQuantity(text)}</div>
                    children: <div>{text}</div>
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
                    // children: <div>{formatRupiah(text)}</div>
                    children: <div>{text}</div>
                };
            }
        },
        // {
        //     title: 'Discount (Rp)',
        //     dataIndex: 'nominal_disc',
        //     width: '10%',
        //     align: 'center',
        //     editable: true,
        //     render(text, record) {
        //         return {
        //             props: {
        //                 style: { background: "#f5f5f5" }
        //             },
        //             children: <div>{ formatRupiah(text) }</div>
        //         };
        //     }
        // },
        // {
        //     title: 'Discount (%)',
        //     dataIndex: 'discount',
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
            width: '20%',
            align: 'center',
            render: (text, record, index) => {
                return <div className="input-group input-group-sm mb-3">
                    <input style={{ width: "30px" }} type="text" className="form-control" aria-label="Small" onChange={(e) => ubahJumlahDiskon(e.target.value, index)} defaultValue={jumlahDiskon[index]} aria-describedby="inputGroup-sizing-sm" />
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px", height: "35px" }}>
                            <select
                                onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                id="grupSelect"
                                className="form-select select-diskon"
                                style={{ width: "70px" }}
                            >
                                {/* <option value="" >
                                    Pilih
                                </option> */}
                                <option value="percent">
                                    %
                                </option>
                                <option value="nominal">
                                    Rp
                                </option>
                            </select>
                        </span>
                    </div>
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
            dataIndex: 'total',
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
                            grandTotalAmount = tableToRupiah(total, "Rp");
                        } else {
                            grandTotalAmount = tableToRupiah(total + getPpn, "Rp");
                        }
                    } else {
                        grandTotalAmount = tableToRupiah(record.quantity * Number(record.price), "Rp");
                    }
                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: grandTotalAmount
                    }
                }
        },
    ];

    // const dataSuratJalan = [
    //     ...product.delivery_note_details.map((item, i) => ({
    //         product_alias_name: item.product_alias_name,
    //     }))
    // ]

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

    function tambahUangMuka(value) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");
        setUangMuka(hasil);

    }

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
                // subTotal   += (subTotalDiscount * 100) / (100 + values.ppn);
                subTotal += (totalPerProduk * 100) / (100 + values.ppn);
                totalDiscount += ((rowDiscount * 100) / (100 + values.ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + values.ppn)) - (rowDiscount * 100) / (100 + values.ppn)) * values.ppn) / (100);
                grandTotal = subTotal - totalDiscount + Number(totalPpn) - Number(uangMuka);
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
                totalDiscount += ((totalPerProduk * jumlahDiskon[i]) / 100);
                subTotal = total - (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * values.ppn) / 100;
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

    const handleCheck = (event, index) => {
        console.log(event.target.checked)
        var updatedList = [...product];
        let tmpData = [];
        let tmpDataBaru = [];


        // perubahan data dan status ceked 
        if (sumber == 'Surat') {
            for (let i = 0; i < getDataSurat.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataSurat[i].detail,
                        statusCek: !getDataSurat[i].statusCek
                    })
                }
                else {
                    tmpDataBaru.push(getDataSurat[i])
                }
            }
            setGetDataSurat(tmpDataBaru)
        }

        else if (sumber == 'SO') {
            for (let i = 0; i < getDataProduct.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: !getDataProduct[i].statusCek
                    })
                }
                else {
                    tmpDataBaru.push(getDataProduct[i])
                }
            }
            setGetDataProduct(tmpDataBaru)
        }


        if (tmpDataBaru[index].statusCek) {
            // updatedList = [...product];
            // console.log(product)
            let dataSumber;
            if (sumber == 'SO') {
                dataSumber = event.target.value.detail.sales_order_details
            }
            else if (sumber == 'Surat') {
                dataSumber = event.target.value.detail.delivery_note_details
            }
            // console.log(event.target.value.detail)

            let tmp = [];
            for (let i = 0; i <= updatedList.length; i++) {
                if (i == updatedList.length) {
                    for (let i = 0; i < dataSumber.length; i++) {
                        if (sumber == 'Retur') {
                            tmp.push({
                                id_datasumber: sumber == 'Retur' ? dataSumber[i].delivery_note_id : dataSumber[i].sales_order_id,
                                id: dataSumber[i].id,
                                product_alias_name: dataSumber[i].product_alias_name,
                                product_id: dataSumber[i].product_id,
                                product_name: dataSumber[i].product_name,
                                quantity: dataSumber[i].quantity,
                                returned: dataSumber[i].returned,
                                sales_order_id: dataSumber[i].sales_order_id,
                                tally_sheet_code: dataSumber[i].tally_sheet_code,
                                tally_sheet_id: dataSumber[i].tally_sheet_id,
                                unit: dataSumber[i].unit
                            })
                        }
                        else {
                            tmp.push({
                                customer_id: dataSumber[i].customer_id,
                                discount_percentage: dataSumber[i].discount_percentage,
                                fixed_discount: dataSumber[i].fixed_discount,
                                id: dataSumber[i].id,
                                notes: dataSumber[i].notes,
                                ppn: dataSumber[i].ppn,
                                price: dataSumber[i].price,
                                product_alias_name: dataSumber[i].product_alias_name,
                                quantity: dataSumber[i].quantity,
                                code: dataSumber[i].sales_order_code,
                                sales_order_id: dataSumber[i].sales_order_id,
                                subtotal: dataSumber[i].subtotal,
                                subtotal_after_discount: dataSumber[i].subtotal_after_discount,
                                tally_sheets_qty: dataSumber[i].tally_sheets_qty,
                                total: dataSumber[i].total,
                                unit: dataSumber[i].unit
                            })
                        }

                    }
                }
                else {
                    tmp.push(updatedList[i])
                }
                console.log(tmp)

            }
            updatedList = tmp

        }
        else {
            console.log(updatedList)
            console.log(event.target.value.detail)
            let jumlah = 0
            let index = []
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i].code == event.target.value.detail.code) {
                    jumlah = jumlah + 1
                    index.push(i);
                }
            }
            updatedList.splice(index[0], jumlah);
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
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("termasuk_pajak", checked);
        userData.append("uang_muka", uangMuka);
        userData.append("status", "Submitted");
        product.map((p, i) => {
            userData.append("nama_alias_produk[]", p.product_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            if (pilihanDiskon[i] == 'percent') {
                userData.append("persentase_diskon[]", jumlahDiskon[i]);
                userData.append("diskon_tetap[]", 0);
            }
            else if (pilihanDiskon[i] == 'nominal') {
                userData.append("diskon_tetap[]", jumlahDiskon[i]);
                userData.append("persentase_diskon[]", 0);
            }
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

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
        console.log(product)
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("tipe", fakturType);
        userData.append("alamat_penerima", address);
        userData.append("penerima", customer);
        userData.append("catatan", description);
        // userData.append("pelanggan", customer);
        userData.append("uang_muka", uangMuka);
        if (checked) {
            userData.append("termasuk_pajak", 1);

        }
        else {
            userData.append("termasuk_pajak", 0);

        }
        userData.append("status", "Draft");
        product.map((p, i) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.product_alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            if (sumber == 'SO') {
                userData.append("id_pesanan_penjualan[]", p.sales_order_id);

            }
            else {
                userData.append("id_surat_jalan[]", p.delivery_notes_id);

            }
            if (pilihanDiskon[i] == 'percent') {
                userData.append("persentase_diskon[]", jumlahDiskon[i]);

                userData.append("diskon_tetap[]", 0);
            }
            else if (pilihanDiskon[i] == 'nominal') {
                userData.append("diskon_tetap[]", jumlahDiskon[i]);

                userData.append("persentase_diskon[]", 0);
            }
            userData.append("ppn[]", p.ppn);
        });
        // userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

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

    function handleChangeTipe(value) {
        setFakturType(value.value)
        setSelectedType(value)
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
        setSumber(value);
        setProduct([])
        setSelectedSupplier('');
        setSelectedCustomer('')
    }

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
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
                                        Penjualan
                                    </option>
                                    <option value="Surat" >
                                        Surat Jalan
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
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Penerima</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Penerima..."
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
                                    onChange={(e) => setAddress(e.id)}
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
                        {/* <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                <h5>
                                    {getStatus === 'Submitted' ? <Tag color="blue">{getStatus}</Tag> : getStatus === 'Draft' ? <Tag color="orange">{getStatus}</Tag> : getStatus === 'Done' ? <Tag color="green">{getStatus}</Tag> : <Tag color="red">{getStatus}</Tag>}
                                </h5>
                            </div>
                        </div> */}
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
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={product}
                    columns={columns}
                    onChange={(e) => setProduct(e.target.value)}
                /> : <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={product}
                    columns={columns}
                    onChange={(e) => setProduct(e.target.value)}
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
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Uang Muka</label>
                            <div className="col-sm-6">
                                <CurrencyFormat
                                    className='form-control form-control-sm'
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={'Rp '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    value={uangMuka}
                                    onChange={(e) => tambahUangMuka(e.target.value)} />
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
                <div className="btn-group mt-2" role="group" aria-label="Basic mixed styles example">
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
                    <button
                        type="button"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
            </PageHeader>
        </>
    )
}

export default BuatFaktur