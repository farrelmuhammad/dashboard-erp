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
    const [total1Produk, setTotal1Produk] = useState("");
    const [totalKeseluruhan, setTotalKeseluruhan] = useState("")
    const [updateProduk, setUpdateProduk] = useState([])
    const [tampilTabel, setTampilTabel] = useState(true)
    const [tampilProduk, setTampilProduk] = useState([])
    const [jumlah, setJumlah] = useState([])
    // const [u, setUpdateData] = useState([])

    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [tampilPPN, setTampilPPN] = useState(false);

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [pilihanDiskon, setPilihanDiskon] = useState('');
    const [jumlahDiskon, setJumlahDiskon] = useState([]);
    const [fakturId, setFakturId] = useState()
    const [selectedFaktur, setSelectedFaktur] = useState()

    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }


    const handleChangeCustomer = (value) => {

        setSelectedCustomer(value);
        setCustomer(value.id);
        // setProdukFaktur([])
        setTampilPilihFaktur(true)
        setTampilProduk([])
        setSelectedFaktur('')
        // setGetDataFaktur([])
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
            //console.log(getDataFaktur)

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


        console.log(value.info.tax_included)

        setChecked(value.info.tax_included)
        setSelectedFaktur(value);
        setFakturId(value.value);
        setTampilPPN(true)
        setTampilPilihProduk(true)

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
            setProdukFaktur(data)
            console.log(produkFaktur)
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
                let tmpJumlah = [...jumlah]

                let grandTotal;
                let arrTotal = [];
                // console.log(tmpData)
                for (let i = 0; i < newData.length; i++) {
                    if (i >= tampilProduk.length) {

                        if (newData[i].sales_invoice_discount_percentage != 0) {
                            let total = newData[i].remains.toString().replace(',', '.') * Number(newData[i].sales_invoice_price);
                            let getDiskon = (Number(total) * newData[i].sales_invoice_discount_percentage.toString().replace(',', '.')) / 100;

                            let setelahDiskon = (Number(total) - Number(getDiskon))
                            let ppn = (setelahDiskon * newData[i].sales_invoice_ppn.toString().replace(',', '.')) / 100;
                            grandTotal = total + Number(ppn);
                        }
                        else if (newData[i].remaining_fixed_discount != 0) {
                            console.log('nomnal')
                            let total = (Number(newData[i].remains.toString().replace(',', '.')) * Number(newData[i].sales_invoice_price))
                            let getDiskon = newData[i].remaining_fixed_discount;
                            let setelahDiskon = (Number(total) - Number(getDiskon))
                            let ppn = (setelahDiskon * newData[i].sales_invoice_ppn.toString().replace(',', '.')) / 100;
                            // console.log(total)
                            // console.log(ppn)
                            grandTotal = total + Number(ppn);
                        }
                        else {
                            let total = (Number(newData[i].remains.toString().replace(',', '.')) * Number(newData[i].sales_invoice_price))
                            let ppn = (Number(total) * newData[i].sales_invoice_ppn.toString().replace(',', '.')) / 100;
                            grandTotal = total + Number(ppn);
                        }

                        tmpJumlah[i] = grandTotal
                    }

                }

                setJumlah(tmpJumlah)
                console.log(newData)
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
            width: '18%',
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
            title: 'PPN',
            dataIndex: 'ppn',
            width: '8%',
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
            width: '18%',
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
        let tmpData = [...tampilProduk];
        let tmpJumlah = [...jumlah]
        let hasil = value.replaceAll('.', '');
        console.log(hasil)
        for (let i = 0; i < tampilProduk.length; i++) {
            if (i == y) {
                tmpData[i].remains = hasil;
            }
        }
        console.log(tmpData)

        let grandTotal;
        let arrTotal = [];
        // console.log(tmpData)
        for (let i = 0; i < tmpData.length; i++) {
            if (i == y) {
                if (tmpData[i].sales_invoice_discount_percentage != 0) {
                    let total = tmpData[i].remains.toString().replace(',', '.') * Number(tmpData[i].sales_invoice_price);
                    let getDiskon = (Number(total) * tmpData[i].sales_invoice_discount_percentage.toString().replace(',', '.')) / 100;

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].sales_invoice_ppn.toString().replace(',', '.')) / 100;

                    grandTotal = Number(total) - Number(getDiskon) + Number(ppn);
                }
                else if (tmpData[i].remaining_fixed_discount != 0) {
                    let total = (Number(tmpData[i].remains.toString().replace(',', '.')) * Number(tmpData[i].sales_invoice_price))
                    let getDiskon = tmpData[i].remaining_fixed_discount;

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].sales_invoice_ppn.toString().replace(',', '.')) / 100;
                    grandTotal = total - Number(getDiskon) + Number(ppn);
                }
                else {
                    let total = (Number(tmpData[i].remains.toString().replace(',', '.')) * Number(tmpData[i].sales_invoice_price))
                    let ppn = (Number(total) * tmpData[i].sales_invoice_ppn.toString().replace(',', '.')) / 100;
                    grandTotal = total + Number(ppn);
                }

                tmpJumlah[i] = grandTotal
            }

        }

        // console.log(arrTotal)
        calculate(tmpData, checked);
        // setUpdateProduk(arrTotal);
        setTampilProduk(tmpData)
        setJumlah(tmpJumlah)
    }

    const dataProduk =
        [...tampilProduk.map((item, i) => ({
            name_product: item.name,
            qty: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.remains.toString().replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value)} key="qty" />,
            stn: item.unit,
            prc: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} value={Number(item.sales_invoice_price).toFixed(2).toString().replace('.', ',')} />,
            dsc:
                <>
                    {
                        item.remaining_fixed_discount != '0' ?
                            <CurrencyFormat disabled prefix={'Rp '} className='edit-disabled text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.remaining_fixed_discount).toString().replace('.', ',')} key="diskon" />
                            : item.sales_invoice_discount_percentage != '0' ?
                                <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={'%'} value={Number(item.sales_invoice_discount_percentage).toString().replace('.', ',')} />
                                : <>-</>
                    }


                </>
            ,
            total:
                checked === true ?
                    <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} onKeyDown={(event) => klikEnter(event)} value={Number(total1Produk[i].detail).toFixed(2).replace('.', ',')} /> :
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(jumlah[i]).toFixed(2).replace('.', ',')} key="diskon" />
            ,
            ppn: <CurrencyFormat disabled className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={'%'} value={Number(item.sales_invoice_ppn)} />,
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

    useEffect(() => {
        // console.log(subTotal)
        // console.log(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn) - Number(uangMuka))
        setGrandTotal(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn));
    }, [tampilProduk]);


    const calculate = (retur, check_checked) => {
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        let subTotal = 0;
        let totalPpn = 0;
        let rowDiscount = 0;
        let subTotalDiscount = 0;
        let totalDiscount = 0;

        let total1 = 0;
        let diskon2 = 0;
        let totalDiskon2 = 0;
        let subTotDiskon2 = 0;
        let subtotal2 = 0;
        let databaru = [];


        retur.map((values, i) => {
            // termasuk pajak 
            if (check_checked) {
                total += (Number(values.remains.toString().replace(',', '.')) * Number(values.sales_invoice_price));
                total1 = (Number(values.remains.toString().replace(',', '.')) * Number(values.sales_invoice_price));

                totalPerProduk = (Number(values.remains.toString().replace(',', '.')) * Number(values.sales_invoice_price));

                if (values.sales_invoice_discount_percentage != 0) {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.sales_invoice_discount_percentage) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.sales_invoice_discount_percentage) / 100);
                    diskon2 = (Number(total1) * Number(values.sales_invoice_discount_percentage) / 100);

                }
                else if (values.remaining_fixed_discount != 0) {
                    hasilDiskon += Number(values.remaining_fixed_discount);
                    rowDiscount = Number(values.remaining_fixed_discount);

                    diskon2 = (Number(values.remaining_fixed_discount));

                }
                totalDiscount += ((rowDiscount * 100) / (100 + Number(values.sales_invoice_ppn)));
                subTotalDiscount = totalPerProduk - rowDiscount;
                // subTotal += (totalPerProduk * 100) / (100 + Number(values.ppn.replace(',', '.')));

                subTotal += (totalPerProduk * 100) / (100 + Number(values.sales_invoice_ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + Number(values.sales_invoice_ppn))) - (rowDiscount * 100) / (100 + Number(values.sales_invoice_ppn))) * Number(values.sales_invoice_ppn)) / (100);

                // totalPpn = (totalPerProduk * Number(values.sales_invoice_ppn)) / 100;

                // console.log(subTot)
                grandTotal = subTotal - hasilDiskon + Number(totalPpn) - 0;

                // grandTotal = Number(subTotal) - Number(hasilDiskon) + Number(totalPpn);


                totalDiskon2 += ((diskon2 * 100) / (100 + Number(values.sales_invoice_ppn)));
                subTotDiskon2 = total1 - diskon2;
                subtotal2 = subTotDiskon2

                databaru.push({
                    detail: subtotal2
                })

                console.log(databaru)
                setTotal1Produk(databaru);

                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
                console.log(grandTotal)
            }

            // tidak termasuk pajak 
            else {
                total += (Number(values.remains.toString().replace(',', '.')) * Number(values.sales_invoice_price));
                totalPerProduk = (Number(values.remains.toString().replace(',', '.')) * Number(values.sales_invoice_price));

                if (values.sales_invoice_discount_percentage != 0) {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.sales_invoice_discount_percentage) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.sales_invoice_discount_percentage) / 100);
                }
                else if (values.remaining_fixed_discount != 0) {

                    hasilDiskon += Number(values.remaining_fixed_discount);
                    rowDiscount = Number(values.remaining_fixed_discount);
                }
                totalDiscount += Number(rowDiscount);

                subTotal = total - (Number(totalPerProduk) * Number(rowDiscount) / 100);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * values.sales_invoice_ppn) / 100;
                grandTotal = total - totalDiscount + Number(totalPpn);

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
            console.log(tampilProduk)
            const userData = new FormData();
            userData.append("tanggal", date);
            userData.append("referensi", referensi);
            userData.append("catatan", description);
            userData.append("id_faktur_penjualan", fakturId);
            userData.append("pelanggan", customer);
            userData.append("status", "Submitted");
            tampilProduk.map((p) => {
                console.log(p);
                userData.append("nama_alias_produk[]", p.alias_name);
                userData.append("id_produk[]", p.id);
                userData.append("produk[]", p.name);
                userData.append("kuantitas[]", p.remains.toString().replace(',', '.'));
                userData.append("satuan[]", p.unit);
                userData.append("harga[]", p.sales_invoice_price);
                userData.append("persentase_diskon[]", p.sales_invoice_discount_percentage);
                userData.append("diskon_tetap[]", p.remaining_fixed_discount);
                userData.append("ppn[]", p.sales_invoice_ppn);
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
                    navigate("/retur");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                           // text: "Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
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
            userData.append("id_faktur_penjualan", fakturId);
            userData.append("pelanggan", customer);
            userData.append("status", "Draft");
            tampilProduk.map((p) => {
                console.log(p);
                userData.append("nama_alias_produk[]", p.alias_name);
                userData.append("id_produk[]", p.id);
                userData.append("produk[]", p.name);
                userData.append("kuantitas[]", p.remains.toString().replace(',', '.'));
                // userData.append("susut[]", p.remains);
                userData.append("satuan[]", p.unit);
                userData.append("harga[]", p.sales_invoice_price);
                userData.append("persentase_diskon[]", p.sales_invoice_discount_percentage);
                userData.append("diskon_tetap[]", p.remaining_fixed_discount);
                userData.append("ppn[]", p.sales_invoice_ppn);
            });
            userData.append("termasuk_pajak", checked);

            // for (var pair of userData.entries()) {
            //     console.log(pair[0] + ', ' + pair[1]);
            // }

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
                    navigate("/retur");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            // text: "Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
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
                        <div className="form-check" style={{ display: checked ? 'flex' : 'none' }}>
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" defaultChecked={true} disabled />
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk PPN
                            </label>
                        </div>
                    </div>
                    <div className="col ms-5">
                        <div className="form-check" style={{ display: checked ? 'none' : 'flex' }}>
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" defaultChecked={false} disabled />
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