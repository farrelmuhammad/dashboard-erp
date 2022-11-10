import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import Select from "react-select";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';
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
                <InputNumber ref={inputRef}  onPressEnter={save} onBlur={save} min={0} step="0.01" defaultValue={1}
                    thousandSeparator={'.'}
                    decimalSeparator={','}
                    onChange={value => {
                        value = parseFloat(value.toString().replace('.', ','))
                    }}

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

const BuatPesananPembelian = () => {
    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [supplier, setSupplier] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const [grup, setGrup] = useState('');
    const navigate = useNavigate();

    const [getDataProduct, setGetDataProduct] = useState();
    const [tmpCentang, setTmpCentang] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState(0);
    const [tampilPPN, setTampilPPN] = useState(0);
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [selectedValue, setSelectedSupplier] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [dataSupplier, setDataSupplier] = useState([]);
    const [dataMataUang, setDataMataUang] = useState([]);
    const [matauang, setMataUang] = useState('');
    const [namaMataUang, setNamaMataUang] = useState('Rp');
    const [pilihanDiskon, setPilihanDiskon] = useState([]);
    const [jumlahDiskon, setJumlahDiskon] = useState([]);
    const [PIC, setPIC] = useState('')
    const [namaPenerima, setNamaPenerima] = useState('Dhany Saputra')
    const [tanggalAwal, setTanggalAwal] = useState('');
    const [tanggalAkhir, setTanggalAkhir] = useState('')

    const handleChangeSupplier = (value) => {
        setSelectedSupplier(value);
        setSupplier(value.id);
    };

    useEffect(() => {
        getNewCodePurchase();
        axios.get(`${Url}/currencies`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let matauang = [];
                res.data.data.map((item) => {
                    matauang.push({ value: item.id, label: item.name })
                })
                setDataMataUang(matauang);



            })
    }, [])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_products?nama=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].id) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
            }
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].id) < 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: false
                    });
                }

            }

            // let urut = tmp.sort()
            // console.log(urut)
            setGetDataProduct(tmp);
        };

        if (query.length >= 0) getProduct();
    }, [query, grup])

    useEffect(() => {
        if (grup == "Impor") {
            setNamaMataUang("IDR");
            document.getElementById('matauang').style.display = "flex";

            document.getElementById('ppn').style.display = "none";
        }
        else {
            setNamaMataUang("Rp");
            document.getElementById('matauang').style.display = "none";

            document.getElementById('ppn').style.display = "flex";
        }

        axios.get(`${Url}/suppliers?grup=${grup}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let supplier = [];
                res.data.data.map((item) => {
                    supplier.push({ value: item.id, label: item.name })
                })
                setDataSupplier(supplier);
            })
    }, [grup]);

    useEffect(() => {
        setGrandTotal(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn));
    }, [totalPpn]);

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'name',
            render: (_, record) => {
                return <>{record.detail.name}</>
            }
        },
        {
            title: 'Stok',
            dataIndex: 'stock',
            width: '15%',
            align: 'center',
            render(_, record) {
                return {
                    props: {
                    },
                    // children: <div>{formatQuantity(text)}</div>
                    children: <div>{Number(record.detail.stock).toFixed(2).replace('.', ',')}</div>
                };
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

    
    function tambahPPN(value) {
        let hasil = value.toString().replace('.', '').replace(/[^0-9_,\.]+/g, "").replaceAll(',', '.');
        console.log(hasil)
        setTotalPpn(hasil);
        setTampilPPN(value)

    }


    function gantiPilihanDiskon(value, index) {
        console.log(product);
        let tmp = [];
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;


        for (let i = 0; i < product.length; i++) {
            total += (Number(product[i].quantity) * Number(product[i].purchase_price));
            totalPerProduk = (Number(product[i].quantity) * Number(product[i].purchase_price));

            if (i === index) {
                tmp[i] = value;
                if (value == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                }
                else if (value == namaMataUang) {

                    hasilDiskon += Number(jumlahDiskon[i]);
                }
            }
            else {
                tmp[i] = pilihanDiskon[i];
                if (pilihanDiskon[i] == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                }
                else if (pilihanDiskon[i] == namaMataUang) {
                    console.log(jumlahDiskon[i]);
                    hasilDiskon += Number(jumlahDiskon[i]);
                }
            }
        }
        grandTotal = Number(total) - Number(hasilDiskon) + Number(totalPpn);
        console.log(tmp)
        setSubTotal(Number(total));
        setGrandTotalDiscount(hasilDiskon);
        setGrandTotal(grandTotal);
        setPilihanDiskon(tmp);
    }

    function ubahJumlahDiskon(value, index) {
        console.log(pilihanDiskon)
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        let tmp = [];
        if (jumlahDiskon.length === 0) {
            for (let i = 0; i < product.length; i++) {
                tmp[i] = '';
            }
            setJumlahDiskon(tmp);
        }

        for (let i = 0; i < product.length; i++) {

            total += (Number(product[i].quantity) * Number(product[i].purchase_price));
            totalPerProduk = (Number(product[i].quantity) * Number(product[i].purchase_price));
            console.log(pilihanDiskon[i])
            if (i === index) {
                tmp[i] = value;
                if (pilihanDiskon[i] == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(value) / 100);
                }
                else if (pilihanDiskon[i] == namaMataUang) {

                    hasilDiskon += Number(value);
                }
            }
            else {
                tmp[i] = jumlahDiskon[i];
                if (pilihanDiskon[i] == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                    // console.log(hasilDiskon)
                }
                else if (pilihanDiskon[i] == namaMataUang) {

                    hasilDiskon += Number(jumlahDiskon[i]);
                }
            }
        }

        grandTotal = Number(total) - Number(hasilDiskon) + Number(totalPpn);
        console.log(total)
        setSubTotal(Number(total));
        setGrandTotalDiscount(hasilDiskon);
        setGrandTotal(grandTotal);
        setJumlahDiskon(tmp);


        // let tmp = [];
        // if (jumlahDiskon.length === 0) {
        //     for (let i = 0; i < product.length; i++) {
        //         tmp[i] = '';
        //     }
        //     setJumlahDiskon(tmp);
        // }

        // for (let i = 0; i < product.length; i++) {
        //     if (i === index) {
        //         tmp[i] = value;
        //     }
        //     else {
        //         tmp[i] = jumlahDiskon[i];
        //     }
        // }
        // setJumlahDiskon(tmp);


    }
    const [totalPerProduk, setTotalPerProduk] = useState([]);
    useEffect(() => {
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        console.log(product);
        product.map((values, i) => {
            total += (Number(values.quantity) * Number(values.purchase_price));
            totalPerProduk = (Number(values.quantity) * Number(values.purchase_price));

            if (pilihanDiskon[i] == '%') {
                hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);;
            }
            else if (pilihanDiskon[i] == namaMataUang) {

                hasilDiskon += Number(jumlahDiskon[i]);
            }

            grandTotal = total - hasilDiskon + Number(totalPpn);
            console.log(hasilDiskon)
            setSubTotal(total)
            setGrandTotalDiscount(hasilDiskon);
            setGrandTotal(grandTotal);
        })
    }, [jumlahDiskon]);

    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: 'no',
            width: '5%',
            align: 'center',
            render(text, record, index) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: index + 1,
                }
            }
        },
        {
            title: 'Nama Produk',
            dataIndex: 'name',
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
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            editable: true,
            render(text, record) {

                return {
                    props: {
                    },
                    children: 
                    <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={text} key="qty" />
                  
                 
                     //<div>{Number(text).toFixed(2).replace('.', ',')}</div>
                };
            }
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
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
            dataIndex: 'purchase_price',
            width: '20%',
            align: 'center',
            editable: true,
            render: (text) => {
                return convertToRupiahTabel(text)
            }

        },
        {
            title: 'Discount',
            dataIndex: 'diskon',
            width: '20%',
            align: 'center',
            render: (text, record, index) => {
                return <div className="input-group input-group-sm mb-3">
                    <InputNumber style={{ width: "25px" }} type="text" thousandSeparator={'.'} decimalSeparator={','} className="form-control" aria-label="Small" onChange={(e) => ubahJumlahDiskon(e.target.value, index)} value={jumlahDiskon[index]} aria-describedby="inputGroup-sizing-sm" />
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                            <select
                                onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                id="grupSelect"
                                className="form-select select-diskon"
                                style={{ width: "60px" }}
                            >
                                {/* <option value="pilih" >
                            Pilih
                        </option> */}
                                <option value="%" >
                                    %
                                </option>
                                <option value={namaMataUang}>
                                    {namaMataUang}
                                </option>
                            </select>
                        </span>
                    </div>
                </div>
            }
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
            render:
                (text, record, index) => {
                    let grandTotal;
                    if (pilihanDiskon[index] == '%') {
                        let total = record.quantity * Number(record.purchase_price);

                        let getPercent = (Number(total) * jumlahDiskon[index]) / 100;
                        grandTotal = total - Number(getPercent);
                    }
                    else if (pilihanDiskon[index] == namaMataUang) {
                        grandTotal = (Number(record.quantity) * Number(record.purchase_price)) - jumlahDiskon[index];
                    }
                    else {
                        grandTotal = record.quantity * Number(record.purchase_price);
                    }
                    let hasil = convertToRupiahTabel(grandTotal);

                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: hasil
                    }

                }
        },
    ];


    // const convertToRupiah = (angka) => {
    //     // let rupiah = '';
    //     // let angkarev = angka.toString().split('').reverse().join('');
    //     // for (let i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    //     let hasil = namaMataUang + ' ' + angka.toLocaleString('id')
    //     return <input
    //         value={hasil}
    //         readOnly="true"
    //         className="form-control form-control-sm"
    //         id="colFormLabelSm"
    //     />
    // }

    const convertToRupiah = (angka) => {
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                    : < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
            }
        </>
    }

    const convertToRupiahTabel = (angka) => {
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
                    : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />

            }
        </>
    }



    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        calculate(newData);
    };

    const calculate = (product) => {
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        product.map((values, i) => {
            total += (Number(values.quantity) * Number(values.purchase_price));
            totalPerProduk = (Number(values.quantity) * Number(values.purchase_price));

            if (pilihanDiskon[i] == '%') {
                hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
            }
            else if (pilihanDiskon[i] == namaMataUang) {

                hasilDiskon += Number(jumlahDiskon[i]);
            }

            grandTotal = total - hasilDiskon + Number(totalPpn);
            setSubTotal(total)
            setGrandTotalDiscount(hasilDiskon);
            setGrandTotal(grandTotal);
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
        let data = event.target.value

        let tmpDataBaru = []
        // let tmpJumlah = [...jumlah]
        let tmpDataCentang = [...tmpCentang]
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

            if (tmpDataBaru[i].statusCek == true) {
                tmpDataCentang.push(tmpDataBaru[i].detail.id)
            }
            else {
                let index = tmpDataCentang.indexOf(tmpDataBaru[i].detail.id);
                if (index >= 0) {
                    tmpDataCentang.splice(index, 1)
                }
            }
        }

        let unikTmpCentang = [...new Set(tmpDataCentang)]
        setTmpCentang(unikTmpCentang)
        setGetDataProduct(tmpDataBaru)
        var updatedList = [...product];
        if (tmpDataBaru[index].statusCek) {
            updatedList = [...product, data.detail];
            let tmp = [];
            let tmpJumlah = [];
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i].id == data.detail.id) {
                    tmp.push('%');
                    tmpJumlah.push(0);

                }
                else {
                    tmp.push(pilihanDiskon[i]);
                    tmpJumlah.push(jumlahDiskon[i])
                }

            }
            console.log(tmp)
            console.log(tmpJumlah)
            setPilihanDiskon(tmp);
            setJumlahDiskon(tmpJumlah)
        } else {
            console.log(updatedList)
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i].id == data.detail.id) {
                    updatedList.splice(i, 1);
                    jumlahDiskon.splice(i, 1);
                    pilihanDiskon.splice(i, 1)
                }
            }

            console.log(jumlahDiskon)

        }
        setProduct(updatedList);

    };

    const getNewCodePurchase = async () => {
        await axios.get(`${Url}/get_new_purchase_order_code/Local?tanggal=${date}`, {
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
        else if (!grup) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Grup kosong, Silahkan Lengkapi datanya ",
            });
        }
        // else if (grup == "Impor") {
        //     if (!matauang) {
        //         Swal.fire({
        //             icon: "error",
        //             title: "Oops...",
        //             text: "Data Mata Uang kosong, Silahkan Lengkapi datanya ",
        //         });
        //     }
        // }
        else if (!supplier) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
            });
        }
        // else if(!tanggalAwal){
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
        //       });
        // }
        // else if(!tanggalAkhir){
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
        //       });
        // }
        // else if(!totalPpn && grup=='Lokal'){
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data PPN kosong, Silahkan Lengkapi datanya ",
        //     });
        // }
        else {


            console.log(pilihanDiskon);
            const OrderData = new FormData();
            OrderData.append("tanggal", date);
            OrderData.append("referensi", referensi);
            OrderData.append("_group", grup);
            OrderData.append("catatan", description);
            OrderData.append("pemasok", supplier);
            OrderData.append("berdasarkan", PIC);
            OrderData.append("dibeli_oleh", namaPenerima);
            OrderData.append("tanggal_awal_periode_pengiriman", tanggalAwal);
            OrderData.append("tanggal_akhir_periode_pengiriman", tanggalAkhir);

            OrderData.append("mata_uang", matauang);
            OrderData.append("status", "Submitted");

            OrderData.append("ppn", totalPpn);
            product.map((p, i) => {
                console.log(p);
                OrderData.append("nama_alias_produk[]", p.alias_name);
                OrderData.append("id_produk[]", p.id);
                OrderData.append("kuantitas[]", p.quantity);
                OrderData.append("satuan[]", p.unit);
                OrderData.append("harga[]", p.purchase_price);

                if (jumlahDiskon[i] == 0) {

                }
                if (pilihanDiskon[i] == '%') {
                    OrderData.append("persentase_diskon[]", jumlahDiskon[i]);

                    OrderData.append("diskon_tetap[]", 0);
                }
                else if (pilihanDiskon[i] == namaMataUang) {
                    OrderData.append("diskon_tetap[]", jumlahDiskon[i]);

                    OrderData.append("persentase_diskon[]", 0);
                }
                else {

                    OrderData.append("diskon_tetap[]", 0);

                    OrderData.append("persentase_diskon[]", 0);
                }
            });
            OrderData.append("termasuk_pajak", checked);


            axios({
                method: "post",
                url: `${Url}/purchase_orders`,
                data: OrderData,
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
                    navigate("/pesananpembelian");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data Produk belum lengkap, silahkan lengkapi datanya dan coba kembali",
                            //text: err.response.data.error.nama,
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
        console.log(pilihanDiskon);

        if (!date) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!grup) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Grup kosong, Silahkan Lengkapi datanya ",
            });
        }
        // else if (grup == "Impor") {
        //     if (!matauang) {
        //         Swal.fire({
        //             icon: "error",
        //             title: "Oops...",
        //             text: "Data Mata Uang kosong, Silahkan Lengkapi datanya ",
        //         });
        //     }
        // }
        else if (!supplier) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
            });
        }
        // else if (!tanggalAwal) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
        //     });
        // }
        // else if (!tanggalAkhir) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data Tanggal Estimasi kosong, Silahkan Lengkapi datanya ",
        //     });
        // }
        // else if (totalPpn == '' && grup == 'Lokal') {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: "Data PPN kosong, Silahkan Lengkapi datanya ",
        //     });
        // }
        else {
            e.preventDefault();
            const OrderData = new FormData();
            OrderData.append("tanggal", date);
            OrderData.append("pemasok", supplier);
            OrderData.append("ppn", totalPpn);
            OrderData.append("referensi", referensi);
            OrderData.append("catatan", description);
            OrderData.append("mata_uang", matauang);
            OrderData.append("status", "Draft");

            OrderData.append("berdasarkan", PIC);
            OrderData.append("dibeli_oleh", namaPenerima);
            OrderData.append("tanggal_awal_periode_pengiriman", tanggalAwal);
            OrderData.append("tanggal_akhir_periode_pengiriman", tanggalAkhir);
            OrderData.append("_group", grup);
            product.map((p, i) => {
                console.log(p.price);
                OrderData.append("nama_alias_produk[]", p.alias_name);
                OrderData.append("id_produk[]", p.id);
                OrderData.append("kuantitas[]", p.quantity);
                OrderData.append("satuan[]", p.unit);
                OrderData.append("harga[]", p.purchase_price);
                if (pilihanDiskon[i] == '%') {
                    OrderData.append("persentase_diskon[]", jumlahDiskon[i]);

                    OrderData.append("diskon_tetap[]", 0);
                }
                else if (pilihanDiskon[i] == namaMataUang) {
                    OrderData.append("diskon_tetap[]", jumlahDiskon[i]);

                    OrderData.append("persentase_diskon[]", 0);
                }
                else {

                    OrderData.append("diskon_tetap[]", 0);

                    OrderData.append("persentase_diskon[]", 0);
                }
            });
            axios({
                method: "post",
                url: `${Url}/purchase_orders`,
                data: OrderData,
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
                    navigate("/pesananpembelian");
                })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data Produk belum lengkap, silahkan lengkapi datanya dan coba kembali",
                            //text: err.response.data.error.nama,
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
                ghost={false}
                onBack={() => window.history.back()}
                title="Buat Pesanan Pembelian">
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
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Grup</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => setGrup(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option>Pilih Grup</option>
                                    <option value="Lokal" checked={grup === "Lokal"}>
                                        Lokal
                                    </option>
                                    <option value="Impor" checked={grup === "Impor"}>
                                        Impor
                                    </option>

                                </select>
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: "none" }} id="matauang">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <Select
                                    placeholder="Pilih Mata Uang..."
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isLoading={isLoading}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={dataMataUang}
                                    onChange={(e) => { setMataUang(e.value); setNamaMataUang(e.label) }}
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <Select
                                    placeholder="Pilih Supplier..."
                                    isLoading={isLoading}
                                    isClearable={false}
                                    isSearchable={true}
                                    options={dataSupplier}
                                    onChange={(e) => setSupplier(e.value)}
                                />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">According To</label>
                            <div className="col-sm-7">
                                <input
                                    onChange={(e) => setPIC(e.target.value)}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Purchased By</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => setNamaPenerima(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option value="Dhany Saputra">
                                        Dhany Saputra
                                    </option>
                                    <option value="Catherine">
                                        Catherine
                                    </option>

                                </select>

                            </div>
                        </div>

                    </div>
                    <div className="col">

                        <label htmlFor="inputPassword3" className="col-sm-6 col-form-label">Estimasi Pengiriman</label>
                        <div className="row mb-3">
                            <div className="d-flex col-sm-10">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setTanggalAwal(e.target.value)}
                                />
                                <div className='ms-2 me-2' style={{ paddingTop: "13px!important" }}>s.d</div>

                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setTanggalAkhir(e.target.value)}
                                />
                            </div>
                        </div>
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                        <div className="col-sm-7">
                            <input
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                onChange={(e) => setReferensi(e.target.value)}
                            />
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
                    <div className="col ms-5"></div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">{convertToRupiah(subTotal)}</div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6"> {convertToRupiah(grandTotalDiscount)} </div>
                        </div>
                        <div className="row mb-3" id="ppn" style={{ display: "none" }}>
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                <CurrencyFormat
                                    className='form-control form-control-sm'
                                    style={{width:"70%"}}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={namaMataUang + ' '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    value={tampilPPN}
                                    onChange={(e) => tambahPPN(e.target.value)} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6"> {convertToRupiah(grandTotal)} </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleDraft}
                        style={{ width: '100px' }}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleSubmit}
                        style={{ width: '100px' }}
                    >
                        Submit
                    </button>
                    {/* <button
                        type="button"
                        style={{ width: '100px' }}
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
        </>
    )
}

export default BuatPesananPembelian;