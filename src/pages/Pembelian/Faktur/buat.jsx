import './form.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { PageHeader } from 'antd';


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


const BuatFakturPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [jatuhTempo, setJatuhTempo] = useState(null);

    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [supplier, setSupplier] = useState();
    const [product, setProduct] = useState([]);
    const [source, setSource] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const [grup, setGrup] = useState("Lokal")
    const [impor, setImpor] = useState(false);
    const [tampilTabel, setTampilTabel] = useState(true)
    const [dataAddress, setDataAddress] = useState([])
    const [mataUang, setMataUang] = useState('Rp');
    const [data, setData] = useState([])
    const [idTandaTerima, setIdTandaTerima] = useState([])

    const { id } = useParams();

    //state return data from database

    const [getDataProduct, setGetDataProduct] = useState();
    const [getDataProductImpor, setGetDataProductImpor] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [modalListLokal, setModalListLokal] = useState(false);
    const [modalListImpor, setModalListImpor] = useState(false);

    const [term, setTerm] = useState('');
    const [muatan, setMuatan] = useState('');
    const [ctn, setCtn] = useState('');
    const [kontainer, setKontainer] = useState('')
    const [loadingTable, setLoadingTable] = useState(false);
    const [idCOA, setIdCOA] = useState([]);
    const [idCredit, setIdCredit] = useState([]);
    const [tampilCOA, setTampilCOA] = useState([]);
    const [tampilCredit, setTampilCredit] = useState([])
    const [totalCOA, setTotalCOA] = useState('');
    const [totalCredit, setTotalCredit] = useState('');
    const [uangMuka, setUangMuka] = useState(0);
    const [totalKeseluruhan, setTotalKeseluruhan] = useState(0);
    const [dataSupplier, setDataSupplier] = useState([]);

    useEffect(() => {
        getCodeFaktur()
        getAkun()
        getCredit()
        getAlamat()
    }, [])

    useEffect(() => {
        if (grup == "Impor") {
            setImpor(true);
            axios.get(`${Url}/purchase_invoices_available_suppliers/Import`, {
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
        }
        else if(grup == 'Lokal') {
            setImpor(false);
            axios.get(`${Url}/purchase_invoices_available_suppliers/Local`, {
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
        }

      

    }, [grup])

    const getCodeFaktur = async () => {
        await axios.get(`${Url}/get_new_purchase_invoice_code/Local?tanggal=${date}`, {
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
        console.log(supplier)
        const getProduct = async () => {
            const res = await axios.get(`${Url}/purchase_invoices_available_goods_receipts?kode=${query}&id_pemasok=${supplier}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplier])

    useEffect(() => {
        const getProductImpor = async () => {
            console.log(supplier)
            const res = await axios.get(`${Url}/purchase_invoices_available_purchase_orders?kode=${query}&id_pemasok=${supplier}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProductImpor(res.data.data);
        };

        if (query.length === 0 || query.length > 2) getProductImpor();
    }, [query, supplier])

    useEffect(() => {
        axios.get(`${Url}/select_supplier_addresses?id_pemasok=${supplier}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let alamat = [];
                res.data.map((item) => {
                    alamat.push({ value: item.id, label: item.address })
                })
                setDataAddress(alamat);
            })
    }, [supplier])

    function klikUbahData(y, value, key) {
        console.log(product)
        let tmpData = [];
        if (key == 'qty') {
            let hasil = value.replaceAll('.', '');
            for (let i = 0; i < data.length; i++) {
                if (i == y) {
                    tmpData.push(
                        {
                            id: data[i].id,
                            product_name: data[i].product_name,
                            quantity: hasil,
                            price: data[i].price,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: data[i].pilihanDiskon,
                            currency_name: data[i].currency_name,
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
                            product_name: data[i].product_name,
                            quantity: data[i].quantity,
                            price: hasil,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: data[i].pilihanDiskon,
                            currency_name: data[i].currency_name,
                            unit: data[i].unit,
                            total: data[i].total



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
                                product_name: data[i].product_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: data[i].discount_percentage,
                                fixed_discount: hasil,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: data[i].pilihanDiskon,
                                currency_name: data[i].currency_name,
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
            else {

                let hasil = value.replaceAll('.', '');
                console.log(hasil)

                for (let i = 0; i < data.length; i++) {

                    if (i == y) {
                        tmpData.push(
                            {
                                id: data[i].id,
                                product_name: data[i].product_name,
                                quantity: data[i].quantity,
                                price: data[i].price,
                                discount_percentage: hasil,
                                fixed_discount: data[i].fixed_discount,
                                subtotal: data[i].subtotal,
                                pilihanDiskon: 'persen',
                                currency_name: data[i].currency_name,
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
        }
        else if (key == 'pilihanDiskon') {
            for (let i = 0; i < data.length; i++) {
                if (i == y) {
                    tmpData.push(
                        {
                            id: data[i].id,
                            product_name: data[i].product_name,
                            quantity: data[i].quantity,
                            price: data[i].price,
                            discount_percentage: data[i].discount_percentage,
                            fixed_discount: data[i].fixed_discount,
                            subtotal: data[i].subtotal,
                            pilihanDiskon: value,
                            currency_name: data[i].currency_name,
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

        // ubah total 
        let grandTotal;
        let dataBaru = tmpData[0]
        let arrTotal = [];
        let tmpTotal = []
        for (let i = 0; i < tmpData.length; i++) {
            if (i == y) {
                if (tmpData[i].pilihanDiskon == 'persen') {
                    let total = tmpData[i].quantity.replace(',', '.') * Number(tmpData[i].price);

                    let getPercent = (Number(total) * tmpData[i].discount_percentage.replace(',', '.')) / 100;
                    grandTotal = total - Number(getPercent);
                }
                else if (tmpData[i].pilihanDiskon == 'nominal') {
                    grandTotal = (Number(tmpData[i].quantity.replace(',', '.')) * Number(tmpData[i].price)) - tmpData[i].fixed_discount;
                }
                else {
                    grandTotal = tmpData[i].quantity.replace(',', '.') * Number(tmpData[i].price);
                }
                arrTotal.push(
                    {
                        id: tmpData[i].id,
                        product_name: tmpData[i].product_name,
                        quantity: tmpData[i].quantity,
                        price: tmpData[i].price,
                        discount_percentage: tmpData[i].discount_percentage,
                        fixed_discount: tmpData[i].fixed_discount,
                        subtotal: tmpData[i].subtotal,
                        pilihanDiskon: tmpData[i].pilihanDiskon,
                        currency_name: tmpData[i].currency_name,
                        unit: tmpData[i].unit,
                        total: grandTotal

                    })
            }
            else {
                arrTotal.push(tmpData[i])

            }
        }

        console.log(arrTotal)
        setProduct(arrTotal)
        calculate(arrTotal);
        setData(arrTotal)
        // console.log(arrTotal)
    }

    const calculate = (data) => {
        // console.log(data)
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        for (let x = 0; x < data.length; x++) {
            // for (let y = 0; y < data[x].length; y++) {
            total += (Number(data[x].quantity.replace(',', '.')) * Number(data[x].price));
            totalPerProduk = (Number(data[x].quantity.replace(',', '.')) * Number(data[x].price));

            console.log(total)
            if (data[x].pilihanDiskon == 'persen') {
                hasilDiskon += (Number(totalPerProduk) * Number(data[x].discount_percentage.replace(',', '.')) / 100);
            }
            else if (data[x].pilihanDiskon == 'nominal') {

                hasilDiskon += Number(data[x].fixed_discount);
            }


            grandTotal = total - hasilDiskon;
            // }
        }
        // console.log(hasilDiskon);
        let totalAkhir = Number(grandTotal) - Number(uangMuka) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
        // console.log(totalAkhir)
        setSubTotal(total)
        setGrandTotalDiscount(hasilDiskon);
        setGrandTotal(grandTotal);
    }


    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }



    // const expandedRowRender = (record) => {
    const columns = [
        {
            title: 'Nama Produk',
            dataIndex: 'namaProduk',
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
            dataIndex: 'price',
            width: '15%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Discount',
            dataIndex: 'disc',
            width: '20%',
            align: 'center',
            editable: true,
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

    ];

    const TableData =
        [...product.map((item, i) => ({
            namaProduk: item.product_name,
            qty: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].quantity).toFixed(2).replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "qty")} key="qty" />,
            stn: item.unit,
            price:
                <div className='d-flex'>
                    {
                        grup === 'Lokal' ? 
                        <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={data[i].currency_name + ' '} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].price).toFixed(2).replace('.',',')} onChange={(e) => klikUbahData(i, e.target.value, "price")} /> :
                        <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={data[i].currency_name + ' '} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].price).toLocaleString('id')} onChange={(e) => klikUbahData(i, e.target.value, "price")} />
                    }
                </div>,
            disc:
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
                                    {data[i].currency_name}
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
                                        {data[i].currency_name}
                                    </option>
                                </select>
                            </div>
                        </div>
                        :
                        data[i].pilihanDiskon == 'nominal' ?
                            <div className='d-flex p-1' style={{ height: "100%" }}>
                                {
                                    grup === 'Lokal' ? 
                                    <CurrencyFormat className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].fixed_discount).toFixed(2).replace('.',',')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" /> : 
                                    <CurrencyFormat className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={Number(data[i].fixed_discount).toLocaleString('id')} onChange={(e) => klikUbahData(i, e.target.value, "diskonValue")} key="diskon" />
                                }
                              

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
                                            {data[i].currency_name}
                                        </option>
                                    </select>
                                </div>
                            </div> : null,

            total:
            
                grup === 'Lokal' ? 
                data[i].currency_name + ' ' + Number(data[i].total).toFixed(2).replace('.',',') : 
                data[i].currency_name + ' ' + Number(data[i].total).toLocaleString('id')
   
        }))
        ]

    const columnsModal = [
        {
            title: 'No. Penerimaan Barang',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            align: 'center',
            dataIndex: 'supplier_name',
        },
        {
            title: 'Total',
            align: 'center',
            dataIndex: 'total',
            render: (text, record, index) => (
                <>
                    {getDataProduct[index].goods_receipt_details.length}
                </>
            )
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

    const columnsModalImpor = [
        {
            title: 'No. Pesanan',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Catatan',
            dataIndex: 'notes',
            width: '30%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '8%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Checkbox
                        // style={{ display: tampilCek ? "block" : "none"}}
                        value={record}
                        onChange={handleCheck}
                    />
                </>
            )
        },
    ];


    const columAkun = [
        {
            title: 'No. Akun',
            dataIndex: 'noakun',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Deskripsi',
            dataIndex: 'desc',
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '14%',
            align: 'center',
        }
    ];

    const columnCredit = [
        {
            title: 'No.Akun',
            dataIndex: 'noakun',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Deskripsi',
            dataIndex: 'desc',
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            width: '14%',
            align: 'center',
        }
    ];

    function hapusCOA(i) {

        setTampilTabel(false)
        let totcoa = []

        if (tampilCOA.length == 1) {
            setTampilCOA([])
            totcoa = 0;
        }
        else {
            tampilCOA.splice(i, 1);
            for (let i = 0; i < tampilCOA.length; i++) {
                totcoa = totcoa + Number(tampilCOA[i].jumlah);

            }

        }
        let totalAkhir = grandTotal - Number(uangMuka) + Number(totcoa) + Number(totalPpn) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
        setTotalCOA(totcoa)

        Swal.fire(
            "Berhasil",
            `Data Berhasil Di hapus`,
            "success"
        ).then(() =>
            setTampilTabel(true)
        );

    }

    function hapusCredit(i) {
        setTampilTabel(false)

        let tmp = []
        let totcredit = []
        if (tampilCredit.length == 1) {
            setTampilCredit([])

            totcredit = 0;
        }
        else {
            tampilCredit.splice(i, 1);
            for (let i = 0; i < tampilCredit.length; i++) {
                totcredit = totcredit + Number(tampilCredit[i].jumlah);

            }

        }

        let totalAkhir = grandTotal - Number(uangMuka) - Number(totcredit) + Number(totalPpn) + Number(totalCOA)
        setTotalKeseluruhan(totalAkhir)
        setTotalCredit(totcredit)

        Swal.fire(
            "Berhasil",
            `Data Berhasil Di hapus`,
            "success"
        ).then(() =>
            setTampilTabel(true)
        );

    }
    function ubahCOA(value, id) {
        // console.log(tampilCOA)
        let hasil = value.replace('.', '').replace(/[^0-9\.]+/g, "");

        let tmp = []
        let totalAkhir = 0;
        let totalCOA = 0;
        for (let i = 0; i < tampilCOA.length; i++) {
            if (i == id) {
                tmp.push({
                    id: tampilCOA[i].id,
                    code: tampilCOA[i].code,
                    name: tampilCOA[i].name,
                    jumlah: hasil,
                })
                totalCOA = totalCOA + Number(hasil);
            }
            else {
                tmp.push(tampilCOA[i])
                totalCOA = totalCOA + Number(tampilCOA[i].jumlah);
            }
        }
        console.log(totalCOA)

        totalAkhir = grandTotal - Number(uangMuka) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
        setTotalCOA(totalCOA)
        setTampilCOA(tmp)
    }

    function ubahCredit(value, id) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");

        let tmp = []
        let totalAkhir = 0;
        let totalCredit = 0;
        for (let i = 0; i < tampilCredit.length; i++) {
            if (i == id) {
                tmp.push({
                    id: tampilCredit[i].id,
                    code: tampilCredit[i].code,
                    deskripsi: tampilCredit[i].deskripsi,
                    jumlah: hasil,
                })
                totalCredit = totalCredit + Number(hasil);
            }
            else {
                tmp.push(tampilCredit[i])
                totalCredit = totalCredit + Number(tampilCredit[i].jumlah);
            }
        }
        console.log(totalCredit)

        totalAkhir = grandTotal - Number(uangMuka) - Number(totalCredit) + Number(totalPpn) + Number(totalCOA)
        setTotalKeseluruhan(totalAkhir)
        setTotalCredit(totalCredit)
        setTampilCredit(tmp)
    }

    function tambahUangMuka(value) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");
        setUangMuka(hasil);
        let totalAkhir = grandTotal - Number(hasil) + Number(totalCOA) + Number(totalPpn) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
    }
    function tambahPPN(value) {
        let hasil = value.replaceAll('.', '').replace(/[^0-9\.]+/g, "");
        setTotalPpn(hasil)
        let totalAkhir = grandTotal - Number(uangMuka) + Number(totalCOA) + Number(hasil) - Number(totalCredit)
        setTotalKeseluruhan(totalAkhir)
    }

    function klikPilihAkun(value) {

        let dataDouble = [];

        for (let i = 0; i < tampilCOA.length; i++) {
            if (tampilCOA[i].id == value.info.id) {
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

            let newData = [...tampilCOA];

            newData.push({
                id: value.info.id,
                code: value.info.code,
                name: value.info.name,
                jumlah: 0,
            })
            setIdCOA(value.value);
            setTampilCOA(newData);

        }




    }

    function klikCreditNote(value) {


        let dataDouble = [];

        for (let i = 0; i < tampilCredit.length; i++) {
            if (tampilCredit[i].id == value.info.id) {
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
            let newData = [...tampilCredit];
            console.log(value.info)

            newData.push({
                id: value.info.id,
                code: value.info.code,
                deskripsi: value.info.description,
                jumlah: 0,
            })
            setIdCredit(value.value);
            setTampilCredit(newData);
        }



    }


    const convertToRupiah = (angka) => {
        // let hasil = mataUang + ' ' + Number(angka).toLocaleString('id')
        // return <input
        //     disabled
        //     value={hasil}
        //     readOnly="true"
        //     className="form-control form-control-sm"
        //     id="colFormLabelSm"
        // />

        return <>
        {
            grup === 'Lokal' ? 
                  < CurrencyFormat  className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm"  className="form-control form-control-sm"/>}  />
                  :< CurrencyFormat  className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true"  id="colFormLabelSm"  className="form-control form-control-sm"/>} />
        }
        </>
    }


    const dataAkun =
        [...tampilCOA.map((item, i) => ({
            noakun: item.code,
            desc: item.name,
            total:
                <div className='d-flex'>
                    <CurrencyFormat
                        className=' text-center editable-input'
                        style={{ width: "100%", padding: "0px" }}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={mataUang + ' '}
                        onKeyDown={(event) => klikEnter(event)}
                        value={item.jumlah}
                        onChange={(e) => ubahCOA(e.target.value, i)} />
                </div>,
            action: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => hapusCOA(i)}
                />
            </Space>,
        }))
        ]

    const dataCredit =
        [...tampilCredit.map((item, i) => ({
            noakun: item.code,
            desc: item.deskripsi,
            total:
                <div className='d-flex'>
                    <CurrencyFormat
                        className=' text-center editable-input'
                        style={{ width: "100%", padding: "0px" }}
                        thousandSeparator={'.'}
                        decimalSeparator={','}
                        prefix={mataUang + ' '}
                        onKeyDown={(event) => klikEnter(event)}
                        value={item.jumlah}
                        onChange={(e) => ubahCredit(e.target.value, i)} />
                </div>,

            action: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => hapusCredit(i)}
                />
            </Space>,
        }))
        ]

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const handleCheck = (event) => {
        setLoadingTable(true)
        let tmpData = [];
        if (event.target.checked) {
            var idTerima = [...idTandaTerima];
            idTerima = [...idTandaTerima, event.target.value.id];
            setIdTandaTerima(idTerima);
            var updatedList;

            var strParams;
            if (grup == "Lokal") {
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_tanda_terima_barang[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_tanda_terima_barang[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/purchase_invoices_grouped_goods_receipt_details?${strParams}`, {
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
                            updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_name: updatedList[i].product_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: updatedList[i].fixed_discount,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                    currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                                    unit: updatedList[i].unit,
                                    total: updatedList[i].total

                                }
                            )

                        }

                        setData(tmpData)
                        calculate(tmpData)
                    })

            }

            else if (grup == "Impor") {
                for (let i = 0; i < idTerima.length; i++) {
                    if (i == 0) {
                        strParams = "id_pesanan_pembelian[]=" + idTerima[i]
                    }
                    else {
                        strParams = strParams + "&id_pesanan_pembelian[]=" + idTerima[i]
                    }

                }
                axios.get(`${Url}/purchase_invoices_grouped_purchase_order_details?${strParams}`, {
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
                            updatedList[i].currency_name ? setMataUang(updatedList[i].currency_name) : setMataUang('Rp')
                            tmpData.push(
                                {
                                    id: updatedList[i].product_id,
                                    product_name: updatedList[i].product_name,
                                    quantity: updatedList[i].quantity,
                                    price: updatedList[i].price,
                                    discount_percentage: updatedList[i].discount_percentage,
                                    fixed_discount: updatedList[i].fixed_discount,
                                    subtotal: updatedList[i].subtotal,
                                    pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                    currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
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
            console.log(tmpData)

        }
        else {
            for (let i = 0; i < idTandaTerima.length; i++) {
                if (event.target.value.id == idTandaTerima[i]) {
                    idTandaTerima.splice(i, 1);
                }
            }

            if (grup == "Lokal") {
                if (idTandaTerima.length != 0) {
                    var strParams;
                    for (let i = 0; i < idTandaTerima.length; i++) {
                        if (i == 0) {
                            strParams = "id_tanda_terima_barang[]=" + idTandaTerima[i]
                        }
                        else {
                            strParams = strParams + "&id_tanda_terima_barang[]=" + idTandaTerima[i]
                        }

                    }

                    axios.get(`${Url}/purchase_invoices_grouped_goods_receipt_details?${strParams}`, {
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
                                tmpData.push(
                                    {
                                        id: updatedList[i].product_id,
                                        product_name: updatedList[i].product_name,
                                        quantity: updatedList[i].quantity,
                                        price: updatedList[i].price,
                                        discount_percentage: updatedList[i].discount_percentage,
                                        fixed_discount: updatedList[i].fixed_discount,
                                        subtotal: updatedList[i].subtotal,
                                        pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                        currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                                        unit: updatedList[i].unit,
                                        total: updatedList[i].total

                                    }
                                )

                            }

                            setData(tmpData)
                            calculate(tmpData)
                        })

                }
                else {
                    tmpData.push()
                    setData(tmpData);
                }
            }
            else if (grup == "Impor") {
                if (idTandaTerima.length != 0) {
                    var strParams;
                    for (let i = 0; i < idTandaTerima.length; i++) {
                        if (i == 0) {
                            strParams = "id_pesanan_pembelian[]=" + idTandaTerima[i]
                        }
                        else {
                            strParams = strParams + "&id_pesanan_pembelian[]=" + idTandaTerima[i]
                        }

                    }

                    axios.get(`${Url}/purchase_invoices_grouped_purchase_order_details?${strParams}`, {
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
                                tmpData.push(
                                    {
                                        id: updatedList[i].product_id,
                                        product_name: updatedList[i].product_name,
                                        quantity: updatedList[i].quantity,
                                        price: updatedList[i].price,
                                        discount_percentage: updatedList[i].discount_percentage,
                                        fixed_discount: updatedList[i].fixed_discount,
                                        subtotal: updatedList[i].subtotal,
                                        pilihanDiskon: updatedList[i].fixed_discount == 0 && updatedList[i].discount_percentage == 0 ? 'noDisc' : updatedList[i].fixed_discount == 0 ? 'persen' : 'nominal',
                                        currency_name: updatedList[i].currency_name ? updatedList[i].currency_name : 'Rp',
                                        unit: updatedList[i].unit,
                                        total: updatedList[i].total

                                    }
                                )

                            }

                            setData(tmpData)
                            calculate(tmpData)
                        })

                }
                else {
                    tmpData.push()
                    setData(tmpData);
                }
            }
            setProduct(tmpData);



        }

        setLoadingTable(false)
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append("tanggal", date);
        if (muatan) {
            formData.append("muatan", muatan.replace(/[^0-9\.]+/g, ""))
        }

        formData.append("karton", ctn);
        formData.append("pemasok", supplier);
        formData.append("catatan", description);
        formData.append("ppn", totalPpn);
        formData.append("uang_muka", uangMuka);
        formData.append("tanggal_jatuh_tempo", jatuhTempo);
        formData.append("nomor_kontainer", kontainer);
        formData.append("term", term);


        for (let y = 0; y < idTandaTerima.length; y++) {

            if (grup == "Lokal") {
                formData.append("id_tanda_terima_barang[]", idTandaTerima[y]);

            }
            else if (grup == "Impor") {

                formData.append("id_pesanan_pembelian[]", idTandaTerima[y]);
            } 
        }
        for (let x = 0; x < data.length; x++) {
            formData.append("kuantitas[]", data[x].quantity.replace(',', '.'));
            formData.append("satuan[]", data[x].unit);
            formData.append("id_produk[]", data[x].id);
            formData.append("harga[]", data[x].price);
            formData.append("persentase_diskon[]", data[x].discount_percentage.replace(',', '.'));
            formData.append("diskon_tetap[]", data[x].fixed_discount);
        }

        for (let i = 0; i < tampilCOA.length; i++) {
            formData.append("biaya[]", tampilCOA[i].id);
            formData.append("total_biaya[]", tampilCOA[i].jumlah);
            formData.append("deskripsi_biaya[]", tampilCOA[i].name);
        }


        for (let i = 0; i < tampilCredit.length; i++) {
            formData.append("nota_kredit[]", tampilCredit[i].id);
            formData.append("total_nota_kredit[]", tampilCredit[i].jumlah);
            formData.append("deskripsi_nota_kredit[]", tampilCredit[i].name);
        }

        formData.append("status", "Submitted");
        axios({
            method: "post",
            url: `${Url}/purchase_invoices`,
            data: formData,
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
                navigate("/fakturpembelian");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
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
    };

    const handleDraft = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append("tanggal", date);
        if (muatan) {
            formData.append("muatan", muatan.replace(/[^0-9\.]+/g, ""))
        }


        formData.append("karton", ctn);
        formData.append("pemasok", supplier);
        formData.append("catatan", description);
        formData.append("ppn", totalPpn);
        formData.append("uang_muka", uangMuka);
        formData.append("tanggal_jatuh_tempo", jatuhTempo);
        formData.append("nomor_kontainer", kontainer);
        formData.append("term", term);



        for (let y = 0; y < idTandaTerima.length; y++) {

            if (grup == "Lokal") {
                formData.append("id_tanda_terima_barang[]", idTandaTerima[y]);

            }
            else if (grup == "Impor") {

                formData.append("id_pesanan_pembelian[]", idTandaTerima[y]);
            }
        }
        for (let x = 0; x < data.length; x++) {

            formData.append("kuantitas[]", data[x].quantity.replace(',', '.'));
            formData.append("satuan[]", data[x].unit);
            formData.append("id_produk[]", data[x].id);
            formData.append("harga[]", data[x].price);
            formData.append("persentase_diskon[]", data[x].discount_percentage.replace(',', '.'));
            formData.append("diskon_tetap[]", data[x].fixed_discount);
        }

        for (let i = 0; i < tampilCOA.length; i++) {
            formData.append("biaya[]", tampilCOA[i].id);
            formData.append("total_biaya[]", tampilCOA[i].jumlah);
            formData.append("deskripsi_biaya[]", tampilCOA[i].name);
        }

        for (let i = 0; i < tampilCredit.length; i++) {
            formData.append("nota_kredit[]", tampilCredit[i].id);
            formData.append("total_nota_kredit[]", tampilCredit[i].jumlah);
            formData.append("deskripsi_nota_kredit[]", tampilCredit[i].deskripsi);
        }


        formData.append("status", "Draft");

        axios({
            method: "post",
            url: `${Url}/purchase_invoices`,
            data: formData,
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
                navigate("/fakturpembelian");
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

    const [optionsType, setOptionsType] = useState([]);
    const [optionsAlamat, setOptionsAlamat] = useState([])
    const [optionsCredit, setOptionCredit] = useState([]);

    function getAkun() {
        let tmp = [];
        axios.get(`${Url}/filter_chart_of_accounts?kode_kategori[]=511&kode_kategori[]=512&kode_kategori[]=611&kode_kategori[]=612&kode_kategori[]=811`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((res) => {
                for (let i = 0; i < res.data.length; i++) {

                    tmp.push({
                        value: res.data[i].id,
                        label: res.data[i].name,
                        info: res.data[i]
                    });
                }
                setOptionsType(tmp);
            })
    }

    function getCredit() {
        let tmp = [];
        axios.get(`${Url}/credit_notes`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((res) => {
                for (let i = 0; i < res.data.data.length; i++) {

                    tmp.push({
                        value: res.data.data[i].id,
                        label: res.data.data[i].code,
                        info: res.data.data[i]
                    });
                }
                setOptionCredit(tmp);
            })
    }

    function getAlamat() {
        let tmp = [];
        axios.get(`${Url}/supplier_addresses`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((res) => {
                // console.log(res.data)
                for (let i = 0; i < res.data.length; i++) {

                    tmp.push({
                        value: res.data[i].id,
                        label: res.data[i].address,
                        info: res.data[i]
                    });
                }
                setOptionsAlamat(tmp);
            })
    }


    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Buat Faktur Pembelian">
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Grup</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => {
                                        setGrup(e.target.value)
                                        setProduct([])
                                    }}
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
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Faktur</label>
                            <div className="col-sm-7">
                                <input
                                    value='Otomatis'
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
                                <ReactSelect
                                    placeholder="Pilih Supplier..."
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isLoading={isLoading}
                                    // isClearable={true}
                                    isSearchable={true}
                                    options={dataSupplier}
                                    onChange={(e) => {setSupplier(e.value), setProduct([])}}
                                />

                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >No. Kontainer</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setKontainer(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Term</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => setTerm(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option>Pilih Term</option>
                                    <option value="CIF">
                                        CIF
                                    </option>
                                    <option value="CFR">
                                        CFR
                                    </option>

                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal Jatuh Tempo</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setJatuhTempo(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Muatan</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => setMuatan(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option>Pilih Muatan</option>
                                    <option value="20ft">
                                        20 ft
                                    </option>
                                    <option value="40ft">
                                        40 ft
                                    </option>

                                </select>
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Ctn</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setCtn(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="row mb-3">
                            <label htmlFor="inputPassword3" className="col-sm-4 col-form-label">Catatan</label>
                            <div className="col-sm-7">
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
                                onClick={() => {
                                    if (grup == "Lokal") {

                                        setModalListLokal(true)
                                    }
                                    else if (grup == "Impor") {
                                        setModalListImpor(true)
                                    }
                                }
                                }
                            />
                            <Modal
                                title="Tambah Penerimaan Pembelian"
                                centered
                                visible={modalListLokal}
                                onCancel={() => setModalListLokal(false)}
                                width={800}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari No Penerimaan..."
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
                            <Modal
                                title="Tambah Pesanan Pembelian"
                                centered
                                visible={modalListImpor}
                                onCancel={() => setModalListImpor(false)}
                                width={800}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari No Pesanan..."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModalImpor}
                                            dataSource={getDataProductImpor}
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
                        // style={{ display: loadingTable ? "none" : 'block' }}
                        columns={columns}
                        dataSource={TableData}
                        pagination={false}
                        isLoading={loadingTable}
                    // rowClassName={() => 'editable-row'}
                    />

                </div>
                <div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Biaya Lain</label>
                        <div className="col-sm-5">
                            <ReactSelect
                                className="basic-single"
                                placeholder="Pilih Akun..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsType}
                                onChange={(e) => klikPilihAkun(e)}
                            />
                        </div>
                    </div>
                    <Table

                        style={{ display: tampilTabel ? "block" : "none" }}
                        components={components}
                        bordered
                        pagination={false}
                        dataSource={dataAkun}
                        columns={columAkun}
                    />
                </div>

                <div className='mt-4' style={{ display: impor ? "block" : "none" }}>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Credit Note</label>
                        <div className="col-sm-5">
                            <ReactSelect
                                className="basic-single"
                                placeholder="Pilih Credit Note..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsCredit}
                                onChange={(e) => klikCreditNote(e)}
                            />
                        </div>
                    </div>
                    <Table
                        components={components}
                        bordered
                        pagination={false}
                        dataSource={dataCredit}
                        columns={columnCredit}
                    />
                </div>

                <div className="d-flex justify-content-end mt-4 ">
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">{convertToRupiah(subTotal)}  </div>

                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">{convertToRupiah(grandTotalDiscount)}  </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Uang Muka</label>

                            <div className="col-sm-6">
                                {
                                    grup === 'Lokal' ?

                                    <CurrencyFormat
                                    className='form-control form-control-sm'
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={mataUang + ' '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    value={Number(uangMuka).toFixed(2).replace('.',',')}
                                    onChange={(e) => tambahUangMuka(e.target.value)} /> :

                                    <CurrencyFormat
                                    className='form-control form-control-sm'
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={mataUang + ' '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    value={Number(uangMuka).toLocaleString('id')}
                                    onChange={(e) => tambahUangMuka(e.target.value)} />
                                } 

                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                {
                                    grup === 'Lokal' ?
                                    <CurrencyFormat
                                    className='form-control form-control-sm'
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={mataUang + ' '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    value={Number(totalPpn).toFixed(2).replace('.',',')}
                                    onChange={(e) => tambahPPN(e.target.value)} /> : 

                                    <CurrencyFormat
                                    className='form-control form-control-sm'
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={mataUang + ' '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    value={Number(totalPpn).toLocaleString('id')}
                                    onChange={(e) => tambahPPN(e.target.value)} />
                                }
                               
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">{convertToRupiah(totalKeseluruhan)} </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                        style={{ width: '100px' }}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
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

export default BuatFakturPembelian