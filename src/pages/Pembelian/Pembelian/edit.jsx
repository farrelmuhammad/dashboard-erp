import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Spin, Table, Tag } from 'antd'
import { DislikeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';
import CurrencyFormat from 'react-currency-format';

function klikEnter(event) {
    if (event.code == "Enter") {
        event.target.blur()
    }
}


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

        console.log("keubah");

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
                {/* <Input type="text" ref={inputRef} onPressEnter={save} onBlur={save}/> */}
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

const EditPesananPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const [load, setLoad] = useState(true);
    const [dataSementara, setSemuaSupplier] = useState([]);
    const { id } = useParams();
    const [getData, setGetData] = useState([]);
    const [getCode, setGetCode] = useState('');
    const [getDate, setGetDate] = useState('');
    const [getReferensi, setGetReferensi] = useState('');
    const [getDesciption, setGetDesciption] = useState('');
    const [getStatus, setGetStatus] = useState('');
    const [getSupplier, setGetSupplier] = useState('');
    const [getSupplierName, setGetSupplierName] = useState('');
    const [selectedMataUang, setSelectedMataUang] = useState('Rp ')
    const [mataUangId, setMataUangId] = useState([])
    const [getProduct, setGetProduct] = useState([]);
    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [dataSupplier, setDataSupplier] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [matauang, setMataUang] = useState();
    const [grup, setGrup] = useState();
    const [dataMataUang, setDataMataUang] = useState([]);
    // const [matauang, setMataUang] = useState();
    const [namaMataUang, setNamaMataUang] = useState();
    const [pilihanDiskon, setPilihanDiskon] = useState([]);
    const [jumlahDiskon, setJumlahDiskon] = useState([]);
    const [namaPIC, setNamaPIC] = useState()
    const [tanggalAwal, setTanggalAwal] = useState();
    const [tanggalAkhir, setTanggalAkhir] = useState();
    const [namaPenerima, setNamaPenerima] = useState()


    // handle change mata uang 
    const handleChangeMataUang = (value) => {
        setMataUangId(value.id);
        setSelectedMataUang(value);
    };
    const loadOptionsMataUang = (inputValue) => {
        return fetch(`${Url}/select_currencies?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };


    // handle change supplier
    const handleChangeSupplier = (value) => {
        setSelectedSupplier(value);
        setSupplierId(value.id);
    };

    const loadOptionsSupplierLokal = (inputValue) => {
        return axios.get(`${Url}/suppliers?nama=${inputValue}&status=Active&grup=Lokal`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    }; const loadOptionsSupplierImpor = (inputValue) => {
        return axios.get(`${Url}/suppliers?nama=${inputValue}&status=Active&grup=Impor`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    useEffect(() => {
        setGrandTotal(Number(subTotal) - Number(grandTotalDiscount) + Number(totalPpn));
    }, [totalPpn]);

    useEffect(() => {
        matchingData();

    }, [dataSementara]);

    useEffect(() => {
        const task = async () => {
            await getPurchaseOrderById();
            // await getSupplierAll();
            setLoad(false);
        }
        task();
    }, [])

    useEffect(() => {


        const getProductSearch = async () => {
            const res = await axios.get(`${Url}/select_products?nama_alias=${query}&grup=${grup}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProductSearch();
    }, [query, grup])

    const [tampilPPN, setTampilPPN] = useState(true);
    const [tampilMataUang, setTampilMataUang] = useState(false);
 

    const convertToRupiah = (angka) => {
        return <input
            value={selectedMataUang + ' ' + angka.toLocaleString('id')}
            readOnly="true"
            className="form-control form-control-sm"
            id="colFormLabelSm"
        />
    }


    function ubahJumlahDiskon(value, index) {
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        let tmp = [];
        if (jumlahDiskon.length === 0) {
            for (let i = 0; i < getProduct.length; i++) {
                tmp[i] = '';
            }
            setJumlahDiskon(tmp);
        }

        for (let i = 0; i < getProduct.length; i++) {

            total += (Number(getProduct[i].quantity) * Number(getProduct[i].price));
            totalPerProduk = (Number(getProduct[i].quantity) * Number(getProduct[i].price));
            if (i === index) {
                tmp[i] = value;
                if (pilihanDiskon[i] == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(value) / 100);
                }
                else if (pilihanDiskon[i] == "diskonuang") {

                    hasilDiskon += Number(value);
                }
            }
            else {
                tmp[i] = jumlahDiskon[i];
                if (pilihanDiskon[i] == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                }
                else if (pilihanDiskon[i] == "diskonuang") {

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
    }

    function gantiPilihanDiskon(value, index) {
        let tmp = [];
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;

        if (pilihanDiskon.length === 0) {
            for (let i = 0; i < getProduct.length; i++) {
                tmp[i] = '';
            }
            setPilihanDiskon(tmp);
        }

        for (let i = 0; i < getProduct.length; i++) {
            total += (Number(getProduct[i].quantity) * Number(getProduct[i].price));
            totalPerProduk = (Number(getProduct[i].quantity) * Number(getProduct[i].price));

            if (i === index) {
                tmp[i] = value;
                if (value == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                }
                else if (value == "diskonuang") {

                    hasilDiskon += Number(jumlahDiskon[i]);
                }
            }
            else {
                tmp[i] = pilihanDiskon[i];
                if (pilihanDiskon[i] == '%') {
                    hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
                }
                else if (pilihanDiskon[i] == "diskonuang") {

                    hasilDiskon += Number(jumlahDiskon[i]);
                }
            }
        }
        grandTotal = Number(total) - Number(hasilDiskon) + Number(totalPpn);
        console.log(total)
        setSubTotal(Number(total));
        setGrandTotalDiscount(hasilDiskon);
        setGrandTotal(grandTotal);
        setPilihanDiskon(tmp);
    }


    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'name',
        },
        {
            title: 'Stok',
            dataIndex: 'stock',
            width: '15%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'action',
            width: '15%',
            align: 'center',
            render: (_, record) => (

                <>
                    {console.log(record)}
                    <Checkbox
                        value={record}
                        onChange={handleCheck}
                        defaultValue={['darta']}
                    // defaultChecked={record[getProduct]}
                    />
                </>
            )
        },
    ];

    function converHarga(angka) {
        return namaMataUang + angka.toLocaleString('id');
    }
    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render: (text, record, index) => {
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
            dataIndex: 'product_name',
            render: (text) => {
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
                    children: <div>{Number(text).toLocaleString('id')}</div>
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
                    children: <div>{selectedMataUang + ' ' + Number(text).toLocaleString('id')}</div>
                };
            }
        },
        {
            title: 'Discount',
            dataIndex: 'diskon',
            width: '20%',
            align: 'center',
            // editable: true,
            render: (text, record, index) => {
                return <div class="input-group input-group-sm">
                    {
                        getProduct[index].discount_percentage != 0 ?
                            <>
                                <input style={{ width: "30px" }} type="text" class="form-control" aria-label="Small" defaultValue={getProduct[index].discount_percentage} onChange={(e) => ubahJumlahDiskon(e.target.value, index)} aria-describedby="inputGroup-sizing-sm" />
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                                        <select

                                            onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                            id="grupSelect"
                                            className="form-select select-diskon"
                                            style={{ width: "70px" }}
                                        >
                                            <option value="" >
                                                Pilih
                                            </option>
                                            <option selected value="%" >
                                                %
                                            </option>
                                            <option value="diskonuang">
                                                {namaMataUang}
                                            </option>
                                        </select>
                                    </span>
                                </div>
                            </> : getProduct[index].fixed_discount != 0 ?
                                <>
                                    <input style={{ width: "30px" }} type="text" class="form-control" aria-label="Small" defaultValue={getProduct[index].fixed_discount} onChange={(e) => ubahJumlahDiskon(e.target.value, index)} aria-describedby="inputGroup-sizing-sm" />
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                                            <select

                                                onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                                id="grupSelect"
                                                className="form-select select-diskon"
                                                style={{ width: "70px" }}
                                            >
                                                <option value="" >
                                                    Pilih
                                                </option>
                                                <option value="%" >
                                                    %
                                                </option>
                                                <option selected value="diskonuang">
                                                    {namaMataUang}
                                                </option>
                                            </select>
                                        </span>
                                    </div></> : <>
                                    <input style={{ width: "30px" }} type="text" class="form-control" aria-label="Small" defaultValue={getProduct[index].fixed_discount} onChange={(e) => ubahJumlahDiskon(e.target.value, index)} aria-describedby="inputGroup-sizing-sm" />
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroup-sizing-sm" style={{ width: "90px" }}>
                                            <select

                                                onChange={(e) => gantiPilihanDiskon(e.target.value, index)}
                                                id="grupSelect"
                                                className="form-select select-diskon"
                                                style={{ width: "70px" }}
                                            >
                                                {/* <option selected value="" >
                                     Pilih
                                 </option> */}
                                                <option value="%" >
                                                    %
                                                </option>
                                                <option value="diskonuang">
                                                    {namaMataUang}
                                                </option>
                                            </select>
                                        </span>
                                    </div></>
                    }

                </div>
            }

        },

        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '15%',
            align: 'center',
            render:
                (text, record, index) => {
                    let grandTotal;
                    if (pilihanDiskon[index] == '%') {
                        let total = record.quantity * Number(record.price);

                        let getPercent = (Number(total) * jumlahDiskon[index]) / 100;
                        grandTotal = total - Number(getPercent);
                    }
                    else if (pilihanDiskon[index] == "diskonuang") {
                        grandTotal = (Number(record.quantity) * Number(record.price)) - jumlahDiskon[index];
                    }
                    else {
                        grandTotal = record.quantity * Number(record.price);
                    }

                    var hasil = selectedMataUang + ' ' + grandTotal.toLocaleString('id');

                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: hasil
                    }




                }

        },
    ];

    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(getProduct, check_checked);
    };
    const handleSave = (row) => {
        const newData = [...getProduct];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setGetProduct(newData);
        calculate(newData);
    };
    const calculate = (product) => {
        let totalPerProduk = 0;
        let grandTotal = 0;
        let total = 0;
        let hasilDiskon = 0;
        console.log(jumlahDiskon);
        product.map((values, i) => {
            // let quantity = values.quantity.toLocaleString()
            // console.log(quantity)
            total += (Number(values.quantity) * Number(values.price));
            totalPerProduk = (Number(values.quantity) * Number(values.price));

            if (pilihanDiskon[i] == '%') {
                hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
            }
            else if (pilihanDiskon[i] == "diskonuang") {

                hasilDiskon += Number(jumlahDiskon[i]);
            }

            grandTotal = total - hasilDiskon + Number(totalPpn);
            setSubTotal(total);
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

    const handleCheck = (event) => {
        // console.log("keubah");
        var updatedList = [...getProduct];
        if (event.target.checked) {
            updatedList = [...getProduct, {
                product_name: event.target.value.name, quantity: event.target.value.quantity,
                unit: event.target.value.unit, price: event.target.value.price, fixed_discount: event.target.value.nominal_disc,
                discount_percentage: event.target.value.discount, product_alias_name: event.target.value.alias_name, product_id: event.target.value.id
            }];
        } else {
            updatedList.splice(getProduct.indexOf(event.target.value), 1);
        }
        // console.log(updatedList);
        setGetProduct(updatedList);

        let tmp = [];
        for (let i = 0; i < updatedList.length; i++) {
            tmp[i] = 'pilih';
        }
        setPilihanDiskon(tmp);
        console.log(tmp)

        // console.log()
    };

    // const getSupplierAll = async () => {
    //     await axios.get(`${Url}/suppliers`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     }).then((res) => {
    //         const getData = res.data.data;
    //         setSemuaSupplier(getData);
    //     })
    //         .catch((err) => {
    //             // Jika Gagal
    //             console.log(err);
    //         })
    // }

    const getPurchaseOrderById = async () => {
        await axios.get(`${Url}/purchase_orders?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                setGetData(getData);
                setTotalPpn(getData.ppn);
                setGrandTotal(getData.total);
                setGetCode(getData.code);
                setDate(getData.date);
                setReferensi(getData.reference);
                setDescription(getData.notes);
                setGetStatus(getData.status);
                setSupplierId(getData.supplier_id);
                setSelectedSupplier(getData.supplier.name);
                setMataUangId(getData.currency_id);
                setNamaPIC(getData.according_to);
                setTanggalAkhir(getData.shipment_period_end_date);
                setTanggalAwal(getData.shipment_period_start_date);
                setNamaPenerima(getData.purchased_by)
                setGrup(getData.supplier._group);
                if (getData.currency == null) {
                    setSelectedMataUang("Rp")
                }
                else {
                    setSelectedMataUang(getData.currency.name);
                }
                setGetProduct(getData.purchase_order_details);
                console.log(getData.purchase_order_details)

                let temp = [];
                let tmpPilihanDiskon = [];
                let totalPerProduk = 0;
                let grandTotal = 0;
                let total = 0;
                let hasilDiskon = 0;
                for (let i = 0; i < getData.purchase_order_details.length; i++) {
                    total += (Number(getData.purchase_order_details[i].quantity) * Number(getData.purchase_order_details[i].price));
                    totalPerProduk = (Number(getData.purchase_order_details[i].quantity) * Number(getData.purchase_order_details[i].price));

                    if (getData.purchase_order_details[i].fixed_discount == 0 && getData.purchase_order_details[i].discount_percentage == 0) {

                        temp[i] = 0;
                        tmpPilihanDiskon[i] = "%";
                        hasilDiskon += 0;
                    }
                    else if (getData.purchase_order_details[i].fixed_discount != 0) {
                        temp[i] = getData.purchase_order_details[i].fixed_discount;
                        tmpPilihanDiskon[i] = "diskonuang";
                        hasilDiskon += Number(getData.purchase_order_details[i].fixed_discount);

                    }
                    else {
                        temp[i] = getData.purchase_order_details[i].discount_percentage;
                        tmpPilihanDiskon[i] = "%";
                        hasilDiskon += (Number(totalPerProduk) * Number(getData.purchase_order_details[i].discount_percentage) / 100);
                    }
                }
                grandTotal = total - hasilDiskon + Number(getData.ppn);
                setSubTotal(total);
                setGrandTotalDiscount(hasilDiskon);
                setGrandTotal(grandTotal);
                setPilihanDiskon(tmpPilihanDiskon)
                setJumlahDiskon(temp);

            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    var indexSupplier;
    const matchingData = async () => {
        let newSupplier = []
        dataSementara.map((item) => {
            newSupplier.push({ value: item.id, label: item.name })
        })

        setDataSupplier(newSupplier);

        dataSupplier.map((item, i) => {

            if (item.label == selectedSupplier) {
                indexSupplier = i;

            }
        })
        // console.log(dataSupplier);


    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const produkData = new URLSearchParams();
        produkData.append("tanggal", date);
        produkData.append("referensi", referensi);
        produkData.append("catatan", description);
        produkData.append("pemasok", supplierId);
        produkData.append("status", "Submitted");
        produkData.append("berdasarkan", namaPIC);
        produkData.append("dibeli_oleh", namaPenerima);
        produkData.append("tanggal_awal_periode_pengiriman", tanggalAwal);
        produkData.append("tanggal_akhir_periode_pengiriman", tanggalAkhir);
        produkData.append("ppn", totalPpn);
        produkData.append("mata_uang", selectedMataUang);
        getProduct.map((p, i) => {

            produkData.append("nama_alias_produk[]", p.product_alias_name);
            produkData.append("kuantitas[]", p.quantity);
            produkData.append("id_produk[]", p.product_id);
            produkData.append("satuan[]", p.unit);
            produkData.append("harga[]", p.price);
            if (pilihanDiskon[i] == '%') {
                produkData.append("persentase_diskon[]", jumlahDiskon[i]);

                produkData.append("diskon_tetap[]", 0);
            }
            else if (pilihanDiskon[i] == 'diskonuang') {
                produkData.append("diskon_tetap[]", jumlahDiskon[i]);

                produkData.append("persentase_diskon[]", 0);
            } else if (pilihanDiskon[i] == "pilih") {

                produkData.append("diskon_tetap[]", 0);

                produkData.append("persentase_diskon[]", 0);
            }


        });
        // produkData.append("termasuk_pajak", checked);

        axios({
            method: "put",
            url: `${Url}/purchase_orders/${id}`,
            data: produkData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                // handle success
                Swal.fire(
                    "Berhasil Submit",
                    `Masuk dalam list`,
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        const produkData = new URLSearchParams();
        produkData.append("tanggal", date);
        produkData.append("referensi", referensi);
        produkData.append("catatan", description);
        produkData.append("pemasok", supplierId);
        produkData.append("status", getStatus);
        produkData.append("ppn", totalPpn);
        produkData.append("mata_uang", matauang);
        produkData.append("berdasarkan", namaPIC);
        produkData.append("dibeli_oleh", namaPenerima);
        produkData.append("tanggal_awal_periode_pengiriman", tanggalAwal);
        produkData.append("tanggal_akhir_periode_pengiriman", tanggalAkhir);
        getProduct.map((p, i) => {
            produkData.append("nama_alias_produk[]", p.product_alias_name);
            produkData.append("id_produk[]", p.product_id);
            produkData.append("kuantitas[]", p.quantity);
            produkData.append("satuan[]", p.unit);
            produkData.append("harga[]", p.price);
            if (pilihanDiskon[i] == '%') {
                produkData.append("persentase_diskon[]", jumlahDiskon[i]);

                produkData.append("diskon_tetap[]", 0);
            }
            else if (pilihanDiskon[i] == 'diskonuang') {
                produkData.append("diskon_tetap[]", jumlahDiskon[i]);

                produkData.append("persentase_diskon[]", 0);
            } else if (pilihanDiskon[i] == "pilih") {

                produkData.append("diskon_tetap[]", 0);

                produkData.append("persentase_diskon[]", 0);
            }
        });
        // produkData.append("termasuk_pajak", checked);

        axios({
            method: "put",
            url: `${Url}/purchase_orders/${id}`,
            data: produkData,
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

    if (load) {
        return (
            <div className='text-center'>
                <Spin />
            </div>
        )
    }

    const options = [
        { value: 1, label: 'Supplier 1' },
        { value: 2, label: 'Supplier 2' },
        { value: 3, label: 'Pemasok 3' }
    ]

    const optionss = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]



    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Edit Pesanan Pembelian">
                    </PageHeader>
                    {/* <h3 className="title fw-bold">Edit Pesanan Pembelian</h3> */}
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
                                    defaultValue={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    disabled={status == 'Submitted' ? true : false}
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Grup</label>
                            <div className="col-sm-7">
                                <select
                                    disabled={status == 'Submitted' ? true : false}

                                    onChange={(e) => setGrup(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option>Pilih Grup</option>
                                    <option value="Lokal" selected={grup === "Lokal" ? true : false}>
                                        Lokal
                                    </option>
                                    <option value="Impor" selected={grup === "Impor" ? true : false}>
                                        Import
                                    </option>

                                </select>
                                {/* <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={grup}
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3" id="matauang" style={{ display: grup == 'Impor' ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedMataUang}
                                    value={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                />

                            </div>
                        </div>
                        <div className="row mb-3" style={{display: grup=='Lokal' ? 'flex' : 'none'}}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedSupplier}
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplierLokal}
                                    onChange={handleChangeSupplier}
                                />

                            </div>
                        </div>
                        <div className="row mb-3" style={{display: grup=='Lokal' ? 'none' : 'flex'}}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedSupplier}
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplierImpor}
                                    onChange={handleChangeSupplier}
                                />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">According To</label>
                            <div className="col-sm-7">
                                <input
                                    defaultValue={namaPIC}
                                    onChange={(e) => setNamaPIC(e.target.value)}
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
                                    <option value="Dhany Saputra" selected={namaPenerima == '' ? true : false}>
                                        Pilih Penerima
                                    </option>
                                    <option value="Dhany Saputra" selected={namaPenerima == 'Dhany Saputra' ? true : false}>
                                        Dhany Saputra
                                    </option>
                                    <option value="Catherine" selected={namaPenerima == 'Catherine' ? true : false}>
                                        Catherine
                                    </option>
                                </select>
                            </div>
                        </div>
                        {/* <div className="row mb-3" style={{ display: tampilMataUang ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={namaMataUang}
                                />
                            </div>
                        </div> */}
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    defaultValue={referensi}
                                    onChange={(e) => setReferensi(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="inputPassword3" className="col-sm-6 col-form-label">Estimasi Diterima</label>
                        <div className="row mb-3">
                            <div className="d-flex col-sm-10">
                                <input
                                    id="startDate"
                                    className=" form-control"
                                    type="date"
                                    defaultValue={tanggalAwal}
                                    onChange={(e) => setTanggalAwal(e.target.value)}
                                />
                                <div className='ms-2 me-2' style={{ paddingTop: "13px!important" }}>s.d</div>
                                <input
                                    id="startDate"
                                    className=" form-control"
                                    type="date"
                                    defaultValue={tanggalAkhir}
                                    onChange={(e) => setTanggalAkhir(e.target.value)}

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
                                    defaultValue={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
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
                        dataSource={getProduct}
                        columns={columns}
                        onChange={(e) => setGetProduct(e.target.value)}
                    />
                </div>
                <div className="row p-0">
                    <div className="col ms-5">
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                                {convertToRupiah(subTotal)}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                {convertToRupiah(grandTotalDiscount)}
                            </div>
                        </div>
                        <div className="row mb-3" id="ppn" style={{ display: tampilPPN ? "flex" : "none" }}>
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                <CurrencyFormat prefix='Rp ' className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={totalPpn} onKeyDown={(event) => klikEnter(event)} onChange={(e) => setTotalPpn(e.target.value.replace('.', '').replace(/[^0-9\.]+/g, ""))} key="total" />


                                {/* <input
                                    defaultValue={totalPpn}
                                    onChange={(e) => setTotalPpn(e.target.value)}
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
                                {convertToRupiah(grandTotal)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleUpdate}
                        width="100px"
                    >
                        Update
                    </button>
                    {
                        getStatus != "Submitted" ?
                            <button
                                type="button"
                                className="btn btn-primary rounded m-1"
                                value="Submitted"
                                onChange={(e) => setStatus(e.target.value)}
                                onClick={handleSubmit}
                                width="100px"
                            >
                                Submit
                            </button>
                            : null
                    }

                    <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
        </>
    )
}

export default EditPesananPembelian