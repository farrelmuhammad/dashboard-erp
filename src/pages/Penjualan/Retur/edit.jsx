import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import CurrencyFormat from 'react-currency-format';
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

const BuatRetur = () => {
    // const auth.token = jsCookie.get("auth");

    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }


    const { id } = useParams();

    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(null);
    const [code, setCode] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [getStatus, setGetStatus] = useState('');
    const [customer, setCustomer] = useState("");
    const [faktur, setFaktur] = useState([]);
    const [fakturId, setFakturId] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const [mataUang, setMataUang] = useState('Rp')
    const navigate = useNavigate();

    const [getDataFaktur, setGetDataFaktur] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [total1Produk, setTotal1Produk] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState();

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [product, setProduct] = useState([]);
    const [pilihanDiskon, setPilihanDiskon] = useState([]);
    const [modal2Visible, setModal2Visible] = useState(false);

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
    };

    useEffect(() => {
        getDataRetur()
    }, [])

    const getDataRetur = async () => {
        await axios.get(`${Url}/sales_returns?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data.data[0]
                console.log(getData)
                setCode(getData.code)
                setDate(getData.date)
                if(getData.reference){
                    setReferensi(getData.reference)
                }
                if(getData.description){
                    setDescription(getData.notes)
                }
                setSelectedCustomer(getData.customer)
                setCustomer(getData.customer.id)
                setProduct(getData.sales_return_details)
                setChecked(getData.tax_included)
                setFakturId(getData.sales_invoice_id)
                calculate(getData.sales_return_details, getData.tax_included)
                setGetStatus(getData.status)
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

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
            const res = await axios.get(`${Url}/sales_returns_available_sales_invoices?nama_alias=${query}&id_penerima=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataFaktur(res.data.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    // Column for modal input product
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

    function klikUbahData(y, value) {
        let tmpData = [...product];
        // let tmpJumlah = [...jumlah]
        let hasil = value.replaceAll('.', '');
        console.log(hasil)
        for (let i = 0; i < product.length; i++) {
            if (i == y) {
                tmpData[i].quantity = hasil;
            }
        }
        // console.log(tmpData)

        let grandTotal;
        let arrTotal = [];
        // console.log(tmpData)
        for (let i = 0; i < tmpData.length; i++) {
            if (i == y) {
                if (tmpData[i].discount_percentage != 0) {
                    let total = tmpData[i].quantity.toString().replace(',', '.') * Number(tmpData[i].price);
                    let getDiskon = (Number(total) * tmpData[i].discount_percentage.toString().replace(',', '.')) / 100;

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.toString().replace(',', '.')) / 100;

                    grandTotal = Number(total) - Number(getDiskon) + Number(ppn);
                }
                else if (tmpData[i].fixed_discount != 0) {
                    let total = (Number(tmpData[i].quantity.toString().replace(',', '.')) * Number(tmpData[i].price))
                    let getDiskon = tmpData[i].fixed_discount;

                    let ppn = ((Number(total) - Number(getDiskon)) * tmpData[i].ppn.toString().replace(',', '.')) / 100;
                    grandTotal = total - Number(getDiskon) + Number(ppn);
                }
                else {
                    let total = (Number(tmpData[i].quantity.toString().replace(',', '.')) * Number(tmpData[i].price))
                    let ppn = (Number(total) * tmpData[i].ppn.toString().replace(',', '.')) / 100;
                    grandTotal = total + Number(ppn);
                }

                tmpData[i].subtotal = grandTotal
            }

        }

        console.log(tmpData)
        calculate(tmpData, checked);
        // setUpdateProduk(arrTotal);
        setProduct(tmpData)
        // setJumlah(tmpJumlah)
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
            title: 'Nama Produk',
            dataIndex: 'product_alias_name',
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
            width: '12%',
            align: 'center'
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
            dataIndex: 'price',
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
            title: 'Discount',
            dataIndex: 'discount',
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
            width: '20%',
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
        [
            ...product.map((item, i) => ({
                product_alias_name: item.product_alias_name,
                // quantity: item.quantity,
                quantity: <CurrencyFormat className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} onKeyDown={(event) => klikEnter(event)} value={item.quantity.replace('.', ',')} onChange={(e) => klikUbahData(i, e.target.value, "qty")} />,
                unit: item.unit,
                price:
                    <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} onKeyDown={(event) => klikEnter(event)} value={item.price} onChange={(e) => klikUbahData(i, e.target.value, "price")} />,
                discount:
                    <>
                        {
                            item.fixed_discount != '0' ?
                                <CurrencyFormat disabled prefix={'Rp '} className='edit-disabled text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.fixed_discount).toString().replace('.', ',')} key="diskon" />
                                : item.discount_percentage != '0' ?
                                    <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={'%'} value={Number(item.discount_percentage).toString().replace('.', ',')} />
                                    : <>0 %</>
                        }
                    </>,
                ppn: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} suffix={' %'} onKeyDown={(event) => klikEnter(event)} value={item.ppn} onChange={(e) => klikUbahData(i, e.target.value, "ppn")} />,
                total:
                    checked === true ?
                        <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} onKeyDown={(event) => klikEnter(event)} value={Number(total1Produk[i].detail).toFixed(2).replace('.', ',')} /> :
                        <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} onKeyDown={(event) => klikEnter(event)} value={item.subtotal} />,

            }))
        ]
    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(faktur, check_checked);
    };


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
                total += (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));
                total1 = (Number(values.quantity.replace(',', '.')) * Number(values.price.replace(',', '.')));
                totalPerProduk = (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));

                if (values.discount_percentage != 0) {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                    diskon2 = (Number(total1) * Number(values.discount_percentage.replace(',', '.')) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                }
                else if (values.fixed_discount != 0) {
                    console.log(values.fixed_discount)
                    hasilDiskon += Number(values.fixed_discount);
                    rowDiscount = Number(values.fixed_discount);
                    diskon2 = (Number(values.fixed_discount.replace(',', '.')));

                }
                totalDiscount += ((rowDiscount * 100) / (100 + Number(values.ppn)));
                subTotalDiscount = totalPerProduk - rowDiscount;
                subTotal += (totalPerProduk * 100) / (100 + Number(values.ppn));
                totalPpn += ((((totalPerProduk * 100) / (100 + Number(values.ppn))) - (rowDiscount * 100) / (100 + Number(values.ppn))) * Number(values.ppn)) / (100);


                // totalPpn = (subTotal * Number(values.ppn)) / 100;


                grandTotal = subTotal - hasilDiskon + Number(totalPpn);

                totalDiskon2 += ((diskon2 * 100) / (100 + Number(values.ppn.replace(',', '.'))));
                subTotDiskon2 = total1 - diskon2;
                // subtotal2 = (subTotDiskon2 * 100) / (100 + Number(values.ppn.replace(',', '.')));
                subtotal2 = subTotDiskon2;

                databaru.push({
                    detail: subtotal2
                })

                console.log(databaru)
                setTotal1Produk(databaru);


                setSubTotal(subTotal)
                setGrandTotalDiscount(totalDiscount);
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal);
            }

            // tidak termasuk pajak 
            else {
                total += (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));
                totalPerProduk = (Number(values.quantity.toString().replace(',', '.')) * Number(values.price));

                if (values.discount_percentage != 0) {
                    hasilDiskon += (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                    rowDiscount = (Number(totalPerProduk) * Number(values.discount_percentage) / 100);
                }
                else if (values.fixed_discount != 0) {

                    hasilDiskon += Number(values.fixed_discount);
                    rowDiscount = Number(values.fixed_discount);
                }
                subTotal = total - (Number(totalPerProduk) * Number(rowDiscount) / 100);
                subTotalDiscount = totalPerProduk - rowDiscount;
                totalPpn += (subTotalDiscount * values.ppn) / 100;
                grandTotal = total - hasilDiskon + Number(totalPpn);

                setSubTotal(total)
                setGrandTotalDiscount(hasilDiskon);
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
    // const columns = defaultColumns.map((col) => {
    //     if (!col.editable) {
    //         return col;
    //     }

    //     return {
    //         ...col,
    //         onCell: (record) => ({
    //             record,
    //             editable: col.editable,
    //             dataIndex: col.dataIndex,
    //             title: col.title,
    //             handleSave,
    //         }),
    //     };
    // });

    const handleCheck = (event) => {
        var updatedList = [...faktur];
        if (event.target.checked) {
            updatedList = [...faktur, event.target.value];
        } else {
            updatedList.splice(faktur.indexOf(event.target.value), 1);
        }
        setFaktur(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(product)
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("id_faktur_penjualan", fakturId);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.product_alias_name);
            userData.append("id_produk[]", p.product_id);
            userData.append("produk[]", p.product_name);
            userData.append("kuantitas[]", p.quantity.toString().replace(',', '.'));
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount_percentage);
            userData.append("diskon_tetap[]", p.fixed_discount);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);


        axios({
            method: "put",
            url: `${Url}/sales_returns/${id}`,
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
        userData.append("id_faktur_penjualan", fakturId);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.product_alias_name);
            userData.append("id_produk[]", p.product_id);
            userData.append("produk[]", p.product_name);
            userData.append("kuantitas[]", p.quantity.toString().replace(',', '.'));
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount_percentage);
            userData.append("diskon_tetap[]", p.fixed_discount);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/sales_returns/${id}`,
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

            <form className="p-3 mb-3 bg-body rounded">
                {/* <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Edit Retur Penjualan</h3>
                </div> */}
                <PageHeader
                    className="bg-body rounded mb-2"
                    onBack={() => window.history.back()}
                    title="Edit Retur Penjualan"
                ></PageHeader>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    defaultValue={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedCustomer}
                                    value={selectedCustomer}
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
                                    defaultValue={referensi}
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
                            <h4 className="title fw-normal">Daftar Faktur</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
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
                            </Modal>
                        </div>
                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={TableData}
                        columns={defaultColumns}
                        onChange={(e) => setFaktur(e.target.value)}
                    />
                </div>
                <div className="row p-0">
                    <div className="col ms-5">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" defaultChecked={checked} disabled />
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk Pajak
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

                                {/* {convertToRupiah(grandTotal, "Rp")} */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: "right", position: "relative" }}>
                    {
                        getStatus == 'Submitted' ?
                            <button
                                type="button"
                                className="btn btn-success rounded m-1"
                                value="Draft"
                                onClick={handleSubmit}
                            >
                                Simpan
                            </button>
                            :
                            <>
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
                                </button></>
                    }

                </div>
                <div style={{ clear: "both" }}></div>

            </form>
        </>
    )
}

export default BuatRetur