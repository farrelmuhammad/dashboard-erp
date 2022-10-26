import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
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
    const navigate = useNavigate();

    const [getDataFaktur, setGetDataFaktur] = useState([]);
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

    // useEffect(() => {
    //     getNewCodeSales()
    // })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_sales_invoices?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataFaktur(res.data);
            console.log(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

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
            for (let i = 0; i < faktur.length; i++) {
                tmp[i] = '';
            }
            setPilihanDiskon(tmp);
        }

        for (let i = 0; i < faktur.length; i++) {
            if (checked) {
                total += (Number(faktur[i].quantity) * Number(faktur[i].price));
                totalPerProduk = (Number(faktur[i].quantity) * Number(faktur[i].price));

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
                // subTotal   += (subTotalDiscount * 100) / (100 + faktur[i].ppn);
                // totalPpn   = (subTotal * faktur[i].ppn) / 100;
                // grandTotal = subTotal - hasilDiskon + Number(totalPpn);

                // setSubTotal(Number(subTotal));
                // setGrandTotalDiscount(hasilDiskon);
                // setTotalPpn(totalPpn)
                // setGrandTotal(grandTotal);
                // setPilihanDiskon(tmp);



                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + faktur[i].ppn);
                totalDiscount += ((rowDiscount * 100) / (100 + faktur[i].ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + faktur[i].ppn)) - (rowDiscount * 100) / (100 + faktur[i].ppn)) * faktur[i].ppn) / (100);
                grandTotal = subTotal - totalDiscount + Number(totalPpn);
                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                setPilihanDiskon(tmp);
            } else {
                total += (Number(faktur[i].quantity) * Number(faktur[i].price));
                totalPerProduk = (Number(faktur[i].quantity) * Number(faktur[i].price));

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
                totalPpn += (subTotalDiscount * faktur[i].ppn) / 100;

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
            for (let i = 0; i < faktur.length; i++) {
                tmp[i] = '';
            }
            setJumlahDiskon(tmp);
        }

        for (let i = 0; i < faktur.length; i++) {
            if (checked) {
                total += (Number(faktur[i].quantity) * Number(faktur[i].price));
                totalPerProduk = (Number(faktur[i].quantity) * Number(faktur[i].price));

                if (i === index) {
                    tmp[i] = value;

                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    // if (value == 'percent') {
                    //     hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    //     rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    // }
                    // else if (value == 'nominal') {

                    //     hasilDiskon += Number(jumlahDiskon[i]);
                    //     rowDiscount = Number(jumlahDiskon[i]);
                    // }
                }
                else {
                    tmp[i] = jumlahDiskon[i];

                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    // if (pilihanDiskon[i] == 'percent') {
                    //     hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    //     rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    // }
                    // else if (pilihanDiskon[i] == 'nominal') {
                    //     hasilDiskon += Number(jumlahDiskon[i]);
                    //     rowDiscount = Number(jumlahDiskon[i]);
                    // }
                }
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + faktur[i].ppn);
                totalDiscount += ((rowDiscount * 100) / (100 + faktur[i].ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + faktur[i].ppn)) - (rowDiscount * 100) / (100 + faktur[i].ppn)) * faktur[i].ppn) / (100);
                grandTotal = subTotal - totalDiscount + Number(totalPpn);
                console.log(rowDiscount, pilihanDiskon[i], "Cek")
                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                setJumlahDiskon(tmp);
            } else {
                total += (Number(faktur[i].quantity) * Number(faktur[i].price));
                totalPerProduk = (Number(faktur[i].quantity) * Number(faktur[i].price));
                if (i === index) {
                    tmp[i] = value;

                    hasilDiskon += (Number(totalPerProduk) * Number(value) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(value) / 100);
                    // if (pilihanDiskon[i] == 'percent') {
                    //     hasilDiskon += (Number(totalPerProduk) * Number(value) / 100);
                    //     rowDiscount = (Number(totalPerProduk) * Number(value) / 100);
                    // }
                    // else if (pilihanDiskon[i] == 'nominal') {

                    //     hasilDiskon += Number(value);
                    //     rowDiscount = Number(value);
                    // }
                }
                else {
                    tmp[i] = jumlahDiskon[i];

                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    // if (pilihanDiskon[i] == 'percent') {
                    //     hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    //     rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    // }
                    // else if (pilihanDiskon[i] == 'nominal') {

                    //     hasilDiskon += Number(jumlahDiskon[i]);
                    //     rowDiscount = Number(jumlahDiskon[i]);
                    // }
                }

                totalDiscount += Number(rowDiscount);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * Number(faktur[i].ppn)) / 100;
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

    // Column for modal input faktur
    const columnsModal = [
        {
            title: 'No. Faktur',
            dataIndex: 'code',
        },
        {
            title: 'Pelanggan',
            dataIndex: 'recipient',
            render: (recipient) => recipient.name,
        },
        {
            title: 'Total',
            dataIndex: 'total',
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

    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render(text, record, index) {
                return {
                    children: <div>{index + 1}</div>
                };
            }
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
            render(text, record) {
                return {
                    props: {
                    },
                    children: <div>{formatQuantity(text)}</div>
                };
            }
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
        },
        {
            title: 'Discount (Rp)',
            dataIndex: 'fixed_discount',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount_percentage',
            width: '5%',
            align: 'center',
        },
        // {
        //     title: 'Discount',
        //     dataIndex: 'discount',
        //     width: '20%',
        //     align: 'center',
        // },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
            render:
                (text, record, index) => {
                    let grandTotalAmount = 0;
                    let total = (record.quantity * record.price);
                    let getPercent = (total * record.discount_percentage) / 100;
                    let totalDiscount = total - getPercent;
                    let getPpn = (totalDiscount * record.ppn) / 100;
                    if (checked) {
                        grandTotalAmount = tableToRupiah(totalDiscount, "Rp");
                    } else {
                        grandTotalAmount = tableToRupiah(totalDiscount + getPpn, "Rp");
                    }
                    // if (pilihanDiskon[index] == 'percent' || pilihanDiskon == 'percent') {
                    //     // console.log("masuk percent")
                    //     let total = (record.quantity * record.price);
                    //     let getPercent = (total * record.discount_percentage[index]) / 100;
                    //     let totalDiscount = total - getPercent;
                    //     let getPpn = (totalDiscount * record.ppn) / 100;
                    //     if (checked) {
                    //         grandTotalAmount = tableToRupiah(totalDiscount, "Rp");
                    //     } else {
                    //         grandTotalAmount = tableToRupiah(totalDiscount + getPpn, "Rp");
                    //     }
                    // } else if (pilihanDiskon[index] == 'nominal') {
                    //     // console.log("masuk nominal")
                    //     let total = (record.quantity * record.price) - record.discount_percentage[index];
                    //     let getPpn = (total * record.ppn) / 100;
                    //     if (checked) {
                    //         grandTotalAmount = tableToRupiah(total, "Rp");
                    //     } else {
                    //         grandTotalAmount = tableToRupiah(total + getPpn, "Rp");
                    //     }
                    // } else {
                    //     grandTotalAmount = tableToRupiah(record.quantity * Number(record.price), "Rp");
                    // }
                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: grandTotalAmount
                    }
                }
        },
    ];

    const dataTable =
        [...faktur.map((item, i) => ({
            product_alias_name: item.product_alias_name,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            // discount: <>
            //     <div className="input-group input-group-sm mb-3">
            //         <input
            //             style={{ width: "30px" }}
            //             type="text"
            //             className="form-control"
            //             aria-label="Small"
            //             onChange={(e) => ubahJumlahDiskon(e.target.value, i)}
            //             defaultValue={jumlahDiskon[i]}
            //             aria-describedby="inputGroup-sizing-sm"
            //             // value={item.discount_percentage}
            //         />
            //         <div className="input-group-prepend">
            //             <span className="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px", height: "35px" }}>
            //                 <select
            //                     onChange={(e) => gantiPilihanDiskon(e.target.value, i)}
            //                     id="grupSelect"
            //                     className="form-select select-diskon"
            //                     style={{ width: "70px" }}
            //                 >
            //                     {/* <option value="" >
            //                         Pilih
            //                     </option> */}
            //                     <option value="percent">
            //                         %
            //                     </option>
            //                     <option value="nominal">
            //                         Rp
            //                     </option>
            //                 </select>
            //             </span>
            //         </div>
            //     </div>
            // </>,
            // discount: <>
            //     <Input.Group compact>
            //         <Select defaultValue="percent" onChange={(e) => gantiPilihanDiskon(e.target.value, i)}>
            //             <Option value="percent">%</Option>
            //             <Option value="nominal">Rp</Option>
            //         </Select>
            //         <Input
            //             style={{
            //                 width: '50%',
            //             }}
            //             onChange={(e) => ubahJumlahDiskon(e.target.value, i)}
            //             defaultValue={jumlahDiskon[i]}
            //         // disabled
            //         />
            //     </Input.Group>
            // </>,
            discount_percentage: item.discount_percentage,
            fixed_discount: item.fixed_discount,
            ppn: item.ppn
        })
        )]

    // const [value, setValue] = useState(1);

    // const onChange = (e) => {
    //     console.log('radio checked', e.target.value);
    //     setValue(e.target.value);
    // };

    useEffect(() => {
        setGrandTotal(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn));
    }, [totalPpn]);

    const handleChange = () => {
        // console.log(checked);
        setChecked(!checked);
        let check_checked = !checked;
        calculate(faktur, check_checked);
    };

    const handleSave = (row) => {
        const newData = [...faktur];
        const index = newData.findIndex((item) => row.product_alias_name === item.product_alias_name);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setFaktur(newData);
        let check_checked = checked;
        calculate(newData, check_checked);
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
            let jumlahDiskon = values.discount_percentage

            if (check_checked) {
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

                hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);

                // // subTotal   += (subTotalDiscount * 100) / (100 + values.ppn);
                // totalDiscount += ((rowDiscount * 100) / (100 + values.ppn));
                // subTotalDiscount = totalPerProduk - rowDiscount;
                // subTotal += (totalPerProduk * 100) / (100 + values.ppn);
                // totalPpn += ((((totalPerProduk * 100) / (100 + values.ppn)) - (rowDiscount * 100) / (100 + values.ppn)) * values.ppn) / (100);
                // grandTotal = subTotal - totalDiscount + Number(totalPpn);

                subTotalDiscount = totalPerProduk - rowDiscount;
                // subTotal   += (subTotalDiscount * 100) / (100 + values.ppn);
                subTotal += (totalPerProduk * 100) / (100 + Number(values.ppn));
                totalDiscount += ((rowDiscount * 100) / (100 + values.ppn));
                // totalPpn += ((((totalPerProduk * 100) / (100 + values.ppn)) - (rowDiscount * 100) / (100 + values.ppn)) * values.ppn) / (100);
                totalPpn = (subTotal * Number(values.ppn)) / 100;
                grandTotal = subTotal - hasilDiskon + Number(totalPpn);
                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            } else {
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

                hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon) / 100);
                rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon) / 100);

                // totalDiscount += Number(rowDiscount);
                totalDiscount += ((totalPerProduk * jumlahDiskon) / 100);
                subTotal = total - (Number(totalPerProduk) * Number(jumlahDiskon) / 100);
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
        faktur.map((values, i) => {
            let jumlahDiskon = values.discount_percentage
            if (checked) {
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

                hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon) / 100);
                rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon) / 100);

                // totalDiscount += ((rowDiscount * 100) / (100 + Number(values.ppn)));
                // subTotalDiscount = totalPerProduk - rowDiscount;
                // subTotal += (totalPerProduk * 100) / (100 + Number(values.ppn));
                // totalPpn = (subTotal * Number(values.ppn)) / 100;
                // grandTotal = subTotal - hasilDiskon + Number(totalPpn);

                totalDiscount += ((rowDiscount * 100) / (100 + Number(values.ppn)));
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + Number(values.ppn));
                totalPpn = (subTotal * Number(values.ppn)) / 100;
                grandTotal = subTotal - hasilDiskon + Number(totalPpn);

                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            } else {
                total += (Number(values.quantity) * Number(values.price));
                totalPerProduk = (Number(values.quantity) * Number(values.price));

                hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon) / 100);
                rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon) / 100);

                totalDiscount += Number(rowDiscount);
                subTotal = total - (Number(totalPerProduk) * Number(jumlahDiskon) / 100);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * Number(values.ppn)) / 100;
                grandTotal = total - totalDiscount + Number(totalPpn);

                setSubTotal(total)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            }
        })
    }, [checked, totalPpn]);

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
        var updatedList = [...faktur];
        if (event.target.checked) {
            // updatedList = [...faktur, event.target.value];
            const value = event.target.value;
            const dataFaktur = value.sales_invoice_details.length;

            let tmp = [];
            for (let i = 0; i <= faktur.length; i++) {
                if (i == faktur.length) {
                    for (let x = 0; x < value.sales_invoice_details.length; x++) {
                        // let qtyAwal = value.sales_order_details[x].quantity;
                        // let qtyAkhir = value.sales_order_details[x].tally_sheets_qty;
                        // tmp.push({
                        //     id_produk: value.sales_order_details[x].product_id,
                        //     id_pesanan_pembelian: value.id,
                        //     code: value.code,
                        //     boxes_quantity: 0,
                        //     number_of_boxes: 0,
                        //     boxes_unit: value.sales_order_details[x].unit,
                        //     product_alias_name: value.sales_order_details[x].product_alias_name,
                        //     product_name: value.sales_order_details[x].product_name,
                        //     action: qtyAkhir >= qtyAwal ? 'Done' : 'Next delivery',
                        //     sales_order_qty: qtyAwal,
                        //     tally_sheets_qty: qtyAkhir,
                        //     key: "baru"
                        // })

                        tmp.push({
                            product_alias_name: value.sales_invoice_details[x].product_alias_name,
                            quantity: value.sales_invoice_details[x].quantity,
                            unit: value.sales_invoice_details[x].unit,
                            price: value.sales_invoice_details[x].price,
                            discount_percentage: value.sales_invoice_details[x].discount_percentage,
                            fixed_discount: value.sales_invoice_details[x].fixed_discount,
                            ppn: value.sales_invoice_details[x].ppn
                        })

                    }
                }
                else (
                    tmp.push(product[i])
                )
            }
            updatedList = tmp
        } else {
            for (let i = 0; i < updatedList.length; i++) {
                for (let x = 0; x < value.sales_order_details.length; x++) {
                    if (updatedList[i].id_pesanan_pembelian == value.id && updatedList[i].id_produk == value.sales_order_details[x].product_id && updatedList[i].key == "baru") {
                        console.log("kehpaus")
                        updatedList.splice(i, 1);
                        data.splice(i, 1);
                        // setindexSO(0)
                    }
                }
            }
        }
        setFaktur(updatedList);
        let tmp = [];
        let tmpJumlah = [];
        for (let i = 0; i < updatedList.length; i++) {
            tmp[i] = 'percent';
            tmpJumlah[i] = 0;
        }
        setPilihanDiskon(tmp);
        setJumlahDiskon(tmpJumlah)
    };


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

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_returns`,
        //     data: userData,
        //     headers: {
        //         Accept: "application/json",
        //         Authorization: `Bearer ${auth.token}`,
        //     },
        // })
        //     .then(function (response) {
        //         //handle success
        //         Swal.fire(
        //             "Berhasil Ditambahkan",
        //             ` Masuk dalam list`,
        //             "success"
        //         );
        //         navigate("/pesanan");
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             console.log("err.response ", err.response);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 text: err.response.data.error.nama,
        //             });
        //         } else if (err.request) {
        //             console.log("err.request ", err.request);
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         } else if (err.message) {
        //             // do something other than the other two
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         }
        //     });
    };

    const handleDraft = async (e) => {
        e.preventDefault();
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

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_returns`,
        //     data: userData,
        //     headers: {
        //         Accept: "application/json",
        //         Authorization: `Bearer ${auth.token}`,
        //     },
        // })
        //     .then(function (response) {
        //         //handle success
        //         Swal.fire(
        //             "Berhasil Ditambahkan",
        //             ` Masuk dalam list`,
        //             "success"
        //         );
        //         navigate("/pesanan");
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             console.log("err.response ", err.response);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 text: err.response.data.error.nama,
        //             });
        //         } else if (err.request) {
        //             console.log("err.request ", err.request);
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         } else if (err.message) {
        //             // do something other than the other two
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         }
        //     });
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
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModal2Visible(true)}
                    />,
                    <Modal
                        title="Tambah Faktur"
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
                        width={600}
                    >
                        <div className="text-title text-start">
                            <div className="row">
                                <div className="col mb-3">
                                    <Search
                                        placeholder="Cari Faktur..."
                                        style={{
                                            width: 400,
                                        }}
                                        onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                    />
                                </div>
                                <Table
                                    columns={columnsModal}
                                    dataSource={getDataFaktur}
                                    scroll={{
                                        y: 250,
                                    }}
                                    pagination={false}
                                    loading={isLoading}
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
                    dataSource={dataTable}
                    columns={columns}
                    onChange={(e) => setFaktur(e.target.value)}
                />
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
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                {convertToRupiah(grandTotal, "Rp")}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{float:"right", position:"relative"}}>
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
                <div style={{clear:"both"}}></div>
            </PageHeader>
        </>
    )
}

export default BuatRetur