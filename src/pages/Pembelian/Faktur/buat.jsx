import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
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


const BuatFakturPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [code, setCode] = useState('');
    const [fakturType, setFakturType] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState("");
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [source, setSource] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const [grup, setGrup] = useState("Lokal")
    const [impor, setImpor] = useState(false);
    const [dataPenerimaan, setDataPenerimaan] = useState([])
    const [tampilTabel, setTampilTabel] = useState(true)

    const { id } = useParams();

    //state return data from database

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [term, setTerm] = useState();
    const [muatan, setMuatan] = useState();
    const [ctn, setCtn] = useState();
    const [alamat, setAlamat] = useState();
    const [kontainer, setKontainer] = useState()
    const [loadingTable, setLoadingTable] = useState(false);
    const [idCOA, setIdCOA] = useState();
    const [tampilCOA, setTampilCOA] = useState([]);

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
        setAddress(value.customer_addresses)
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_suppliers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        getCodeFaktur()
        getAkun()
    }, [])

    useEffect(() => {
        if (grup == "Impor") {
            setImpor(true);
        }
        else {
            setImpor(false);
        }

    }, [grup])

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
            const res = await axios.get(`${Url}/select_goods_receipts?code=${query}&status=Submitted`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])


    function gantiPilihanDiskon(x, y, value) {
        // console.log(product);
        // let tmp = [];
        // let totalPerProduk = 0;
        // let grandTotal = 0;
        // let total = 0;
        // let hasilDiskon = 0;


        // for (let i = 0; i < product.length; i++) {
        //     total += (Number(product[i].quantity) * Number(product[i].purchase_price));
        //     totalPerProduk = (Number(product[i].quantity) * Number(product[i].purchase_price));

        //     if (i === index) {
        //         tmp[i] = value;
        //         if (value == '%') {
        //             hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
        //         }
        //         else if (value == namaMataUang) {

        //             hasilDiskon += Number(jumlahDiskon[i]);
        //         }
        //     }
        //     else {
        //         tmp[i] = pilihanDiskon[i];
        //         if (pilihanDiskon[i] == '%') {
        //             hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
        //         }
        //         else if (pilihanDiskon[i] == namaMataUang) {
        //             console.log(jumlahDiskon[i]);
        //             hasilDiskon += Number(jumlahDiskon[i]);
        //         }
        //     }
        // }
        // grandTotal = Number(total) - Number(hasilDiskon) + Number(totalPpn);
        // console.log(tmp)
        // setSubTotal(Number(total));
        // setGrandTotalDiscount(hasilDiskon);
        // setGrandTotal(grandTotal);
        // setPilihanDiskon(tmp);
    }

    function klikUbahData(x, y, value, key) {
        let arrData = [];
        if (key == 'qty') {
            for (let i = 0; i < data.length; i++) {
                let tmpData = []
                if (i == x) {
                    for (let j = 0; j < data[i].length; j++) {
                        if (j == y) {
                            tmpData.push(
                                {
                                    quantity: value,
                                    price: data[i][j].price,
                                    discount_percentage: data[i][j].discount_percentage,
                                    fixed_discount: data[i][j].fixed_discount,
                                    pilihanDiskon: data[i][j].pilihanDiskon,
                                    currency_name: data[i][j].currency_name,
                                    unit: data[i][j].unit,
                                    total: data[i][j].total

                                })
                        }
                        else {
                            tmpData.push(
                                {
                                    quantity: data[i][j].quantity,
                                    price: data[i][j].price,
                                    discount_percentage: data[i][j].discount_percentage,
                                    fixed_discount: data[i][j].fixed_discount,
                                    pilihanDiskon: data[i][j].pilihanDiskon,
                                    currency_name: data[i][j].currency_name,
                                    unit: data[i][j].unit,
                                    total: data[i][j].total

                                })
                        }
                    }

                    arrData.push(tmpData);
                }
                else {
                    arrData.push(data[i]);
                }

            }
            setData(arrData);
        }
        else if (key == 'price') {
            for (let i = 0; i < data.length; i++) {
                let tmpData = []
                if (i == x) {
                    for (let j = 0; j < data[i].length; j++) {
                        if (j == y) {
                            tmpData.push(
                                {
                                    quantity: data[i][j].quantity,
                                    price: value,
                                    discount_percentage: data[i][j].discount_percentage,
                                    fixed_discount: data[i][j].fixed_discount,
                                    pilihanDiskon: data[i][j].pilihanDiskon,
                                    currency_name: data[i][j].currency_name,
                                    unit: data[i][j].unit,
                                    total: data[i][j].total

                                })
                        }
                        else {
                            tmpData.push(
                                {
                                    quantity: data[i][j].quantity,
                                    price: data[i][j].price,
                                    discount_percentage: data[i][j].discount_percentage,
                                    fixed_discount: data[i][j].fixed_discount,
                                    pilihanDiskon: data[i][j].pilihanDiskon,
                                    currency_name: data[i][j].currency_name,
                                    unit: data[i][j].unit,
                                    total: data[i][j].total

                                })
                        }
                    }

                    arrData.push(tmpData);
                }
                else {
                    arrData.push(data[i]);
                }

            }
            setData(arrData);
        }
        else if (key == 'diskonValue') {
            if (data[x][y].pilihanDiskon == 'nominal') {
                for (let i = 0; i < data.length; i++) {
                    let tmpData = []
                    if (i == x) {
                        for (let j = 0; j < data[i].length; j++) {
                            if (j == y) {
                                tmpData.push(
                                    {
                                        quantity: data[i][j].quantity,
                                        price: data[i][j].price,
                                        discount_percentage: data[i][j].discount_percentage,
                                        fixed_discount: value,
                                        pilihanDiskon: data[i][j].pilihanDiskon,
                                        currency_name: data[i][j].currency_name,
                                        unit: data[i][j].unit,
                                        total: data[i][j].total

                                    })
                            }
                            else {
                                tmpData.push(
                                    {
                                        quantity: data[i][j].quantity,
                                        price: data[i][j].price,
                                        discount_percentage: data[i][j].discount_percentage,
                                        fixed_discount: data[i][j].fixed_discount,
                                        pilihanDiskon: data[i][j].pilihanDiskon,
                                        currency_name: data[i][j].currency_name,
                                        unit: data[i][j].unit,
                                        total: data[i][j].total

                                    })
                            }
                        }

                        arrData.push(tmpData);
                    }
                    else {
                        arrData.push(data[i]);
                    }

                }
                setData(arrData);
            }
            else if (data[x][y].pilihanDiskon == 'persen') {
                for (let i = 0; i < data.length; i++) {
                    let tmpData = []
                    if (i == x) {
                        for (let j = 0; j < data[i].length; j++) {
                            if (j == y) {
                                tmpData.push(
                                    {
                                        quantity: data[i][j].quantity,
                                        price: data[i][j].price,
                                        discount_percentage: value,
                                        fixed_discount: data[i][j].fixed_discount,
                                        pilihanDiskon: data[i][j].pilihanDiskon,
                                        currency_name: data[i][j].currency_name,
                                        unit: data[i][j].unit,
                                        total: data[i][j].total

                                    })
                            }
                            else {
                                tmpData.push(
                                    {
                                        quantity: data[i][j].quantity,
                                        price: data[i][j].price,
                                        discount_percentage: data[i][j].discount_percentage,
                                        fixed_discount: data[i][j].fixed_discount,
                                        pilihanDiskon: data[i][j].pilihanDiskon,
                                        currency_name: data[i][j].currency_name,
                                        unit: data[i][j].unit,
                                        total: data[i][j].total

                                    })
                            }
                        }

                        arrData.push(tmpData);
                    }
                    else {
                        arrData.push(data[i]);
                    }

                }
                setData(arrData);
            }
        }
        else if (key == 'pilihanDiskon') {
            for (let i = 0; i < data.length; i++) {
                let tmpData = []
                if (i == x) {
                    for (let j = 0; j < data[i].length; j++) {
                        if (j == y) {
                            tmpData.push(
                                {
                                    quantity: data[i][j].quantity,
                                    price: data[i][j].price,
                                    discount_percentage: data[i][j].discount_percentage,
                                    fixed_discount: data[i][j].fixed_discount,
                                    pilihanDiskon: value,
                                    currency_name: data[i][j].currency_name,
                                    unit: data[i][j].unit,
                                    total: data[i][j].total

                                })
                        }
                        else {
                            tmpData.push(
                                {
                                    quantity: data[i][j].quantity,
                                    price: data[i][j].price,
                                    discount_percentage: data[i][j].discount_percentage,
                                    fixed_discount: data[i][j].fixed_discount,
                                    pilihanDiskon: data[i][j].pilihanDiskon,
                                    currency_name: data[i][j].currency_name,
                                    unit: data[i][j].unit,
                                    total: data[i][j].total

                                })
                        }
                    }

                    arrData.push(tmpData);
                }
                else {
                    arrData.push(data[i]);
                }

            }
            setData(arrData);
        }
        console.log(arrData)
    }



    const expandedRowRender = (record) => {
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
                // render: (delivery_note_details) => delivery_note_details.map(service => service.product_alias_name).join(),
            },
            {
                title: 'Qty',
                dataIndex: 'qty',
                width: '10%',
                align: 'center',
                editable: true,

                // render: (delivery_note_details) => delivery_note_details.map(service => service.quantity).join(),
                // editable: true,
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
                // render: (delivery_note_details) => delivery_note_details.map(service => service.unit).splice(1, 1),
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
            [...product[record.key].goods_receipt_details.map((item, i) => ({
                namaProduk: item.product_name,
                qty: <input className=' text-center editable-input' defaultValue={data[record.key][i].quantity} onChange={(e) => klikUbahData(record.key, i, e.target.value, "qty")}></input>,
                stn: item.unit,
                price: <input className=' text-center editable-input' defaultValue={data[record.key][i].currency_name + ' ' + Number(data[record.key][i].price).toLocaleString('id')} onChange={(e) => klikUbahData(record.key, i, e.target.value, "price")}></input>,
                disc:
                    data[record.key][i].pilihanDiskon == 'noDisc' ?
                        <div className='d-flex p-1' style={{ height: "100%" }}>
                            <input style={{ width: "70%", fontSize: "10px!important" }} type="text" class="text-center editable-input" defaultValue={data[record.key][i].discount_percentage} onChange={(e) => klikUbahData(record.key, i, e.target.value, "diskonValue")} />
                            <div class="input-group-prepend"  >
                                <select
                                    onChange={(e) => klikUbahData(record.key, i, e.target.value, "pilihanDiskon")}
                                    id="grupSelect"
                                    className="form-select select-diskon"
                                >
                                    <option selected value="persen" >
                                        %
                                    </option>
                                    <option value="nominal">
                                        {data[record.key][i].currency_name}
                                    </option>
                                </select>
                            </div>
                        </div> :
                        data[record.key][i].pilihanDiskon == 'persen' ?
                            <div className='d-flex p-1' style={{ height: "100%" }} >
                                <input style={{ width: "70%", fontSize: "10px!important" }} type="text" class="text-center editable-input" defaultValue={data[record.key][i].fixed_discount} onChange={(e) => klikUbahData(record.key, i, e.target.value, "diskonValue")} />
                                <div class="input-group-prepend" >
                                    <select
                                        onChange={(e) => klikUbahData(record.key, i, e.target.value, "pilihanDiskon")}
                                        id="grupSelect"
                                        className="form-select select-diskon"
                                    >
                                        <option selected value="persen" >
                                            %
                                        </option>
                                        <option value="nominal">
                                            {data[record.key][i].currency_name}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            :
                            data[record.key][i].pilihanDiskon == 'nominal' ?
                                <div className='d-flex p-1' style={{ height: "100%" }}>
                                    <input style={{ width: "70%", fontSize: "10px!important" }} type="text" class="text-center editable-input" defaultValue={data[record.key][i].fixed_discount} onChange={(e) => klikUbahData(record.key, i, e.target.value, "diskonValue")} />
                                    <div class="input-group-prepend" >
                                        <select
                                            onChange={(e) => klikUbahData(record.key, i, e.target.value, "pilihanDiskon")}
                                            id="grupSelect"
                                            className="form-select select-diskon"
                                        >
                                            <option value="persen" >
                                                %
                                            </option>
                                            <option selected value="nominal">
                                                {data[record.key][i].currency_name}
                                            </option>
                                        </select>
                                    </div>
                                </div> : null,

                // <input className=' text-center editable-input' defaultValue={item.discount_percentage}></input>,
                total: data[record.key][i].currency_name + ' ' + Number(data[record.key][i].total).toLocaleString('id'),


            }))
            ]


        return <Table
            style={{ display: loadingTable ? "none" : 'block' }}
            columns={columns}
            dataSource={TableData}
            pagination={false}
            isLoading={true}
            rowClassName={() => 'editable-row'}
        />;

    };

    const columnsModal = [
        {
            title: 'No. Pesanan',
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


    const columAkun = [
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



    function hapusCOA(i){
        setTampilTabel(false)
        tampilCOA.splice(i, 1);
        setTampilTabel(true)
    }

    const dataAkun =
        [...tampilCOA.map((item, i) => ({
            noakun: item.code,
            desc: item.name,
            total: <input className=' text-center editable-input' defaultValue={0}></input>,
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




    const calculate = (product, check_checked) => {
        let subTotal = 0;
        let totalDiscount = 0;
        let totalNominalDiscount = 0;
        let grandTotalDiscount = 0;
        let getPpnDiscount = 0;
        let allTotalDiscount = 0;
        let totalPpn = 0;
        let grandTotal = 0;
        let getPpn = 0;
        let total = 0;
        product.map((values) => {
            if (check_checked) {
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                subTotal += ((total - getPpnDiscount) * 100) / (100 + values.ppn);
                allTotalDiscount += total - getPpnDiscount;
                totalPpn = allTotalDiscount - subTotal;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            } else {
                subTotal += (values.quantity * values.price);
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                allTotalDiscount = total - getPpnDiscount;
                getPpn = (allTotalDiscount * values.ppn) / 100;
                totalPpn += getPpn;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            }
        })
    }
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };


    const defaultColumns = [
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
    ];


    const mainDataSource =
        [...product.map((item, i) => ({
            key: i,
            code: item.code,
            status: item.status,
        }))

        ]

    const [data, setData] = useState([])
    const handleCheck = (event) => {
        var updatedList = [...product];
        if (event.target.checked) {
            console.log(data.length)
            updatedList = [...product, event.target.value];

            let tmpData = [];
            let arrData = [];
            if (data.length == 0) {
                for (let i = 0; i < updatedList.length; i++) {
                    console.log(updatedList.length)
                    tmpData = []
                    for (let x = 0; x < updatedList[i].goods_receipt_details.length; x++) {

                        tmpData.push(
                            {
                                quantity: updatedList[i].goods_receipt_details[x].quantity,
                                price: updatedList[i].goods_receipt_details[x].price,
                                discount_percentage: updatedList[i].goods_receipt_details[x].discount_percentage,
                                fixed_discount: updatedList[i].goods_receipt_details[x].fixed_discount,
                                pilihanDiskon: updatedList[i].goods_receipt_details[x].fixed_discount == 0 && updatedList[i].goods_receipt_details[x].discount_percentage == 0 ? 'noDisc' : updatedList[i].goods_receipt_details[x].fixed_discount == 0 ? 'persen' : 'nominal',
                                currency_name: updatedList[i].goods_receipt_details[x].currency_name ? updatedList[i].goods_receipt_details[x].currency_name : 'Rp',
                                unit: updatedList[i].goods_receipt_details[x].unit,
                                total: updatedList[i].goods_receipt_details[x].total

                            }
                        )

                    }
                    arrData.push(tmpData)
                }

            }
            else {
                for (let i = 0; i < updatedList.length; i++) {
                    if (i == updatedList.length - 1) {
                        tmpData = []
                        for (let x = 0; x < updatedList[i].goods_receipt_details.length; x++) {
                            tmpData.push(
                                {
                                    quantity: updatedList[i].goods_receipt_details[x].quantity,
                                    price: updatedList[i].goods_receipt_details[x].price,
                                    discount_percentage: updatedList[i].goods_receipt_details[x].discount_percentage,
                                    fixed_discount: updatedList[i].goods_receipt_details[x].fixed_discount,
                                    pilihanDiskon: updatedList[i].goods_receipt_details[x].fixed_discount == 0 && updatedList[i].goods_receipt_details[x].discount_percentage == 0 ? 'noDisc' : updatedList[i].goods_receipt_details[x].fixed_discount == 0 ? 'persen' : 'nominal',
                                    currency_name: updatedList[i].goods_receipt_details[x].currency_name ? updatedList[i].goods_receipt_details[x].currency_name : 'Rp',
                                    unit: updatedList[i].goods_receipt_details[x].unit,
                                    total: updatedList[i].goods_receipt_details[x].total

                                }
                            )

                        }
                        arrData.push(tmpData)
                    }
                    else {

                        arrData.push(data[i])
                    }

                }

            }
            setData(arrData)

        } else {
            for (let i = 0; i < product.length; i++) {
                data.splice(i, 1);
                updatedList.splice(i, 1);
            }
        }
        setProduct(updatedList);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("tipe", fakturType);
        userData.append("penerima", customer);
        userData.append("catatan", description);
        userData.append("alamat_penerima", address);
        userData.append("status", "Submitted");
        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        //     method: "post",
        //     url: `${Url}/sales_invoices`,
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
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("tipe", fakturType);
        userData.append("penerima", customer);
        userData.append("catatan", description);
        userData.append("alamat_penerima", address);
        userData.append("status", "Draft");

        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_invoices`,
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

    const [optionsType, setOptionsType] = useState([]);

    function getAkun() {
        let tmp = [];
        axios.get(`${Url}/chart_of_accounts`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((res) => {
                console.log(res.data.data)
                for (let i = 0; i < res.data.data.length; i++) {

                    tmp.push({
                        value: res.data.data[i].id,
                        label: res.data.data[i].name,
                        info: res.data.data[i]
                    });
                }
                setOptionsType(tmp);
            })
    }

    function klikPilihAkun(value) {
        let newData = [...tampilCOA];
        newData.push(value.info);
        setIdCOA(value.value);
        setTampilCOA(newData);

    }

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Buat Faktur Pembelian</h3>
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
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Grup</label>
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
                                        Import
                                    </option>

                                </select>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
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
                                    getOptionLabel={(e) => e.label}
                                    getOptionValue={(e) => e.value}
                                    options={optionsType}
                                    onChange={(e) => setAlamat(e.value)}
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
                            <h4 className="title fw-normal">Daftar Pesanan</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Penerima Pembelian"
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
                                                placeholder="Cari No Pesanan..."
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
                        bordered
                        pagination={false}
                        dataSource={mainDataSource}
                        expandable={{ expandedRowRender }}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
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
                        style={{display: tampilTabel? "block" : "none"}}
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataAkun}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>

                {/* <div className='mt-4' style={{ display: impor ? "block" : "none" }}>
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
                                options={optionsType}
                                onChange={(e) => setFakturType(e.value)}
                            />
                        </div>
                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataAkun}
                        columns={columns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div> */}

                <div className="d-flex justify-content-end mt-4 ">
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={subTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(Total Qty X harga) per item + ... '
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={grandTotalDiscount}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(total disc/item) ditotal semua'
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Uang Muka</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={totalPpn}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='ppn per item di total semua row'
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={totalPpn}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='ppn per item di total semua row'
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                <input
                                    defaultValue={grandTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='subtotal - diskon + ppn'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
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

export default BuatFakturPembelian