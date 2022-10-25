import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Skeleton, Space, Table, Tabs, Tag, Tooltip } from 'antd'
import { PlusOutlined, PrinterOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { formatQuantity, formatRupiah } from '../../../utils/helper';
import CurrencyFormat from 'react-currency-format';
import { useReactToPrint } from 'react-to-print';
import logo from "../../Logo.jpeg";

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

const DetailFaktur = () => {
    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [address, setAddress] = useState("");
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [fakturType, setFakturType] = useState("");
    const [code, setCode] = useState('');
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const { id } = useParams();

    const [getDataProduct, setGetDataProduct] = useState();
    const [getDataProduct2, setGetDataProduct2] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [uangMuka, setUangMuka] = useState(false);
    // const [pilihanDiskon, setPilihanDiskon] = useState('percent');
    const [pilihanDiskon, setPilihanDiskon] = useState('');
    const [jumlahDiskon, setJumlahDiskon] = useState([]);
    const [sumber, setSumber] = useState('')
    const [idTandaTerima, setIdTandaTerima] = useState([]);
    const [data, setData] = useState([])
    const [dataHeader, setDataHeader] = useState([])
    const [selectedType, setSelectedType] = useState([])
    const [selectedPenerima, setSelectedPenerima] = useState();
    const [selectedAddress, setSelectedAddress] = useState([])
    const [totalKeseluruhan, setTotalKeseluruhan] = useState("");
    const [dataBarang, setDataBarang] = useState([])
    const [catatan, setCatatan] = useState()

    const [getStatus, setGetStatus] = useState([])
    const [term, setTerm] = useState([])
    const [selectedSupplier, setSelectedSupplier] = useState()
    // const [sumber, setSumber] = useState('')





    useEffect(() => {
        axios.get(`${Url}/select_sales_invoices?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data[0]
                setDataHeader(getData);
                setDate(getData.date)
                setCode(getData.code)
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
                setSelectedPenerima(getData.recipient)
                setCustomer(getData.recipient.id)
                setCatatan(getData.notes)

                let dataSumber;
                if (getData.sales_invoice_details) {
                    setSumber('SO')
                    setDataBarang(getData.sales_invoice_details)
                    dataSumber = getData.sales_invoice_details

                }
                else {
                    setSumber('Retur')
                    setDataBarang(getData.sales_order_details)
                    dataSumber = getData.sales_order_details
                }
                let total = Number(getData.ppn) - Number(getData.down_payment) + Number(getData.subtotal) - Number(getData.discount)
                setTotalKeseluruhan(total)


                // setting data produk
                let updatedList = dataSumber
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
                            ppn: 0,
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
    }, [])

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
        // return <input
        //     value={namaMataUang + ' ' + angka.toLocaleString('id')}
        //     readOnly="true"
        //     className="form-control form-control-sm"
        //     id="colFormLabelSm"
        // />
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm edit-disabled" />} />
                    : < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm edit-disabled" />} />
            }
        </>
    }
    const tableToRupiah = (angka, namaMataUang) => {
        //return namaMataUang + ' ' + angka.toLocaleString('id');
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
                    : < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />

            }
        </>
    }

    const [dpp, setDpp] = useState('0');
    let hasildpp = 0;

    function hitungDPP() {
        hasildpp = subTotal - grandTotalDiscount - uangMuka;
        // console.log(hasildpp);
        setDpp(hasildpp);
    }


    useEffect(() => {
        hitungDPP()
    },)


    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        //  pageStyle: {pageStyle}
    })

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
            width: '9%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                    },
                    // children: <div>{formatQuantity(text)}</div>
                    children: <div>{Number(text).toFixed(2).replace('.', ',')}</div>
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
            width: '16%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                    },
                    // children: <div>{formatRupiah(text)}</div>
                    children: <div>{< CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(text).toFixed(2).replace('.', ',')} key="diskon" />}</div>
                };
            }
        },
        {
            title: 'Discount (Rp)',
            dataIndex: 'fixed_discount',
            width: '10%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{< CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(text).toFixed(2).replace('.', ',')} key="diskon" />}</div>
                };
            }
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount_percentage',
            width: '5%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{text} %</div>
                };
            }
        },
        // {
        //     title: 'Discount',
        //     dataIndex: 'discount',
        //     width: '20%',
        //     align: 'center',
        //     render: (text, record, index) => {
        //         return <div className="input-group input-group-sm mb-3">
        //             <input style={{ width: "30px" }} type="text" className="form-control" aria-label="Small" onChange={(e) => ubahJumlahDiskon(e.target.value, index)} defaultValue={jumlahDiskon[index]} aria-describedby="inputGroup-sizing-sm" />
        //             <div className="input-group-prepend">
        //                 <span className="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px", height: "35px" }}>
        //                     <select
        //                         onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
        //                         id="grupSelect"
        //                         className="form-select select-diskon"
        //                         style={{ width: "70px" }}
        //                     >
        //                         {/* <option value="" >
        //                             Pilih
        //                         </option> */}
        //                         <option value="percent">
        //                             %
        //                         </option>
        //                         <option value="nominal">
        //                             Rp
        //                         </option>
        //                     </select>
        //                 </span>
        //             </div>
        //         </div>
        //     }
        // },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '10%',
            align: 'center',
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
                    // console.log("masuk percent")
                    let total = (record.quantity * record.price);
                    let getPercent = (total * jumlahDiskon) / 100;
                    let totalDiscount = total - getPercent;
                    let getPpn = (totalDiscount * record.ppn) / 100;
                    if (checked) {
                        grandTotalAmount = tableToRupiah(totalDiscount, "Rp");
                    } else {
                        grandTotalAmount = tableToRupiah(totalDiscount + getPpn, "Rp");
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

            <div style={{ display: "none", position: "absolute" }} >
                <div ref={componentRef} className="p-4" >

                    <table>
                        <thead>
                            <tr>
                                <td>

                                    <div className="page-header-space"></div>
                                    <div className="page-header">
                                        <div className='d-flex' style={{ position: "fixed", height: "100px", top: "5" }}>

                                            <div><img src={logo} width="60px"></img></div>
                                            <div className='ms-2' >
                                                <div className='header-cetak'><b>PT. BUMI MAESTROAYU</b></div>
                                                <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                                                <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                                                <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                                            </div>

                                        </div>
                                        <br />
                                        <br />

                                        <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold" }}>
                                            <div style={{ fontSize: "16px", textDecoration: "underline", textAlign: 'center' }}>FAKTUR PENJUALAN</div>
                                            <div style={{ fontSize: "10px", textAlign: 'center' }}>NO. {getCode}</div>
                                        </div>

                                        <div className='mt-3 mb-2 col d-flex justify-content-start ps-4 pe-4' style={{ fontSize: "12px" }}>

                                            <div className='col-6'>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Tanggal</label>
                                                    <div className='col-6'> : {date} </div>
                                                </div>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Kepada Yth.</label>
                                                    <div className='col-6'> : {customer} </div>
                                                </div>
                                            </div>

                                            {/* <div className='col-6 col-md-4'>
                            <div className="d-flex flex-row">
                                {
                                    grup === 'Impor'?
                                    <div className='col-6'> No Kontainer </div> :
                                    <div></div>
                                }
                                {
                                    grup === 'Impor' ? 
                                    <div className='col-6'> : {dataHeader.container_number} </div>:
                                    <div></div>
                                }
                            </div>
                            <div className="d-flex flex-row">
                                {
                                    grup === 'Impor'?
                                    <label className='col-6'>Muatan</label> :
                                    <div></div>
                                }
                                {
                                    grup === 'Impor'?
                                    <div className='col-6'> : {dataHeader.payload} </div> :
                                    <div></div>
                                }
                            </div>
                            <div className="d-flex flex-row">
                                {
                                    grup === 'Impor'?
                                    <label className='col-6'>Term</label> :
                                    <div></div>
                                }
                                {
                                    grup === 'Impor'?
                                    <div className='col-6'> : {dataHeader.term} </div> : 
                                    <div></div>
                                }
                            </div>
                            <div className="d-flex flex-row">
                                {
                                    grup === 'Impor'?
                                    <label className='col-6'>Ctn</label> :
                                    <div></div>
                                }
                                {
                                    grup === 'Impor'?
                                    <div className='col-6'> : {dataHeader.carton} </div> : 
                                    <div></div>
                                }
                            </div>

                      </div> */}
                                        </div>

                                        <br />
                                    </div>
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>


                                    <div className="page" style={{ lineHeight: "2" }}>

                                        <div className='mt-1 ps-3 pe-3' >

                                            <table style={{ fontSize: "10px", width: "100%", pageBreakAfter: "auto" }}>
                                                <tr className='text-center border' style={{ height: "50px", pageBreakInside: "avoid", pageBreakAfter: "auto" }}>
                                                    <th width="50px" className='border'>No</th>
                                                    <th width="280px" className='border'>Nama Produk</th>
                                                    <th width="130px" className='border'>Qty</th>
                                                    <th width="150px" className='border'>Stn</th>
                                                    <th width="150px" className='border'>Harga</th>
                                                    <th width="160px" className='border'>Jumlah</th>

                                                </tr>
                                                <tbody className="border">
                                                    {
                                                        product.map((item, i) => (
                                                            <tr style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} >
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'>{i + 1}</td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'>{item.product_alias_name}</td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'>{Number(item.quantity).toFixed(2).replace('.', ',')}</td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'>{item.unit}</td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'>{
                                                                    tableToRupiah(item.price, "Rp")

                                                                    // mataUang + ' ' + Number(item.price).toFixed(2).toLocaleString('id')
                                                                }</td>

                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'>{
                                                                    // mataUang + ' ' + Number(item.total).toFixed(2).toLocaleString('id')
                                                                    tableToRupiah(Number(item.quantity) * Number(item.price), "Rp")
                                                                }</td>

                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        </tbody>

                        <tfoot>
                            <tr>
                                <td>
                                    <div className="page-footer-space"></div>
                                    <div className="page-footer" style={{ position: "fixed", marginBottom: "0px", marginTop: "450px", width: "95%" }} >

                                        <div className='mt-3 col d-flex justify-content-end ps-2 pe-2' style={{ fontSize: "12px", borderWidth: "0px" }}>
                                            <table style={{ fontSize: "10px", width: "100%", pageBreakAfter: "auto", marginRight: "10px", marginLeft: "10px" }}>
                                                <tr className='text-start border' style={{ height: "35px", pageBreakInside: "avoid", pageBreakAfter: "auto" }}>
                                                    <td width="450px" className='border' style={{ paddingLeft: "2px" }}> Jumlah Harga Jual / Penggantian / Uang Muka / Termin *)</td>
                                                    <td width="90px" className='border'>  {tableToRupiah(subTotal, "Rp")}</td>
                                                </tr>
                                                <tbody className="border">
                                                    <tr>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> Dikurangi Potongan Harga </td>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> {tableToRupiah(grandTotalDiscount, "Rp")}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> Dikurangi Uang Muka yang Telah Diterima </td>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> {tableToRupiah(uangMuka, 'Rp')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> Dasar Pengenaan Pajak </td>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> {tableToRupiah(dpp, 'Rp')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> PPN </td>
                                                        <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border text-start'> {tableToRupiah(totalPpn, "Rp")}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className='d-flex flex-row mt-2 ps-2 pe-2' style={{ fontSize: "10px" }}>
                                            <div style={{ width: "61%" }}> </div>
                                            <div className='justify-content-right ' style={{ width: "39%" }}>
                                                <div className='d-flex mt-3 justify-content-right  '>
                                                    <label className='col-6'><b>Jumlah </b></label>
                                                    <div> : </div>
                                                    <div width="100%" className="col-6" > {
                                                        tableToRupiah(grandTotal, "Rp")
                                                    }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        </tfoot>


                    </table>

                </div>
            </div>


            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Faktur Penjualan"
                extra={[
                    <Tooltip title="Cetak" placement="bottom">
                        <Button
                            type="primary"
                            icon={<PrinterOutlined />}
                            style={{ background: "orange", borderColor: "orange" }}
                            onClick={handlePrint}
                        />
                    </Tooltip>,
                ]}
            >
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
                                    disabled
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
                            <div className="col-sm-7">'
                                <input
                                    value={selectedType.label}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />

                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Penerima</label>
                            <div className="col-sm-7">
                                <input
                                    value={selectedPenerima.name}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <input
                                    value={selectedAddress.address}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />


                            </div>
                        </div>
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="col-sm-12">
                           
                            <textarea
                                defaultValue={catatan}
                                className="form-control"
                                disabled
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
            </PageHeader>

            <PageHeader
                ghost={false}
                title={sumber == 'SO' ? "Daftar Pesanan" : "Daftar Surat Jalan"}
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
                                {convertToRupiah(uangMuka, "Rp")}
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
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                {convertToRupiah(grandTotal, "Rp")}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="btn-group mt-2" role="group" aria-label="Basic mixed styles example">
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
                </div> */}
            </PageHeader>
        </>
    )
}

export default DetailFaktur