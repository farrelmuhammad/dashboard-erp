import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
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

const BuatPesanan = () => {
    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    // const [pilihanDiskon, setPilihanDiskon] = useState('percent');
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
    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_product_alias?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    useEffect(() => {
        setGrandTotal(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn));
    }, [totalPpn]);

    // Column for modal input product
    const columnsModal = [
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
    const [totalPerProduk, setTotalPerProduk] = useState([]);
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
                    children: <div>{formatQuantity(text)}</div>
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
                    children: <div>{formatRupiah(text)}</div>
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
                return <div class="input-group input-group-sm mb-3">
                    <input style={{ width: "30px" }} type="text" class="form-control" aria-label="Small" onChange={(e) => ubahJumlahDiskon(e.target.value, index)} defaultValue={jumlahDiskon[index]} aria-describedby="inputGroup-sizing-sm" />
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px", height: "35px" }}>
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
                // subTotal   += (subTotalDiscount * 100) / (100 + values.ppn);
                subTotal += (totalPerProduk * 100) / (100 + values.ppn);
                totalDiscount += ((rowDiscount * 100) / (100 + values.ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + values.ppn)) - (rowDiscount * 100) / (100 + values.ppn)) * values.ppn) / (100);
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
        userData.append("termasuk_pajak", checked);
        userData.append("status", "Submitted");
        product.map((p, i) => {
            userData.append("nama_alias_produk[]", p.alias_name);
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
            url: `${Url}/sales_orders`,
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
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("termasuk_pajak", checked);
        userData.append("status", "Draft");
        product.map((p, i) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
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
            url: `${Url}/sales_orders`,
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

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Buat Pesanan</h3>
                </div>
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
                                    // value={getCode}
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
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
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
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Produk</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
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
                                            loading={isLoading}
                                            size="middle"
                                        />
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={product}
                        columns={columns}
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
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
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
            </form>
        </>
    )
}

export default BuatPesanan