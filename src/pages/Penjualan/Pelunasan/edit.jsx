import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, PageHeader } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';

const { Text } = Typography;

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

const EditPelunasan = () => {
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
    const [customer, setCustomer] = useState("");
    const [dataTampil, setDataTampil] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [COA, setCOA] = useState("");
    const [COAName, setCOAName] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const { id } = useParams();

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [sisaUang, setSisaUang] = useState("");
    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedPembayaran, setSelectedPembayaran] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

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

    const handleChangeCOA = (value) => {
        setSelectedCOA(value);
        setCOA(value.id);
    };
    // load options using API call
    const loadOptionsCOA = (inputValue) => {
        return fetch(`${Url}/select_chart_of_accounts?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/sales_invoice_payments_available_sales_invoices?include_sales_invoice_payment_sales_invoices=${id}&nama_alias=${query}&penerima=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            // let tmp = [];
            // for (let i = 0; i < res.data.data.length; i++) {
            //     for (let x = 0; x < product.length; x++) {

            //         if (res.data.data[i].code == product[x].code) {
            //             tmp.push({
            //                 detail: res.data.data[i],
            //                 statusCek: true
            //             });
            //         }
            //         else {
            //             tmp.push({
            //                 detail: res.data.data.[i],
            //                 statusCek: false
            //             });
            //         }

            //     }

            // }
            // console.log(tmp)
            // setGetDataProduct(tmp)
            setGetDataProduct(res.data.data);
            // console.log(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    useEffect(() => {
        getPelunasan();
    }, [])

    const getPelunasan = async () => {
        await axios.get(`${Url}/sales_invoice_payments?id=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((res) => {
                const getData = res.data.data[0]
                setGetCode(getData.code)
                setDate(getData.date)
                setReferensi(getData.reference);
                setSelectedPembayaran(getData.chart_of_account)
                setStatus(getData.status)
                setSelectedCustomer(getData.customer)
                let tmpData = [];
                let data = getData.sales_invoice_payment_details;
                for (let i = 0; i < data.length; i++) {
                    tmpData.push({
                        id: data[i].id,
                        bayar: Number(data[i].paid).toString().replace('.', ','),
                        sisa: Number(data[i].remains).toString().replace('.', ','),
                        code: data[i].sales_invoice_code,
                        sales_invoice_id: data[i].sales_invoice_id,
                        sales_invoice_payment_id: data[i].sales_invoice_payment_id,
                        sales_invoice_total_payment: data[i].sales_invoice_total_payment,
                        total: Number(data[i].total).toString().replace('.', ',')
                    })
                }
                console.log(tmpData)
                setDataTampil(tmpData)
                setCustomer(getData.recipient.id)
                setCustomerName(getData.recipient.name)
            })
    }

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            align: 'center',
            dataIndex: 'code',
        },
        {
            title: 'Pelanggan',
            dataIndex: 'recipient',
            align: 'center',
            render: (recipient) => recipient.name
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={record.total} />
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

    function klikUbahBayar(value, index) {
        let hasilValue = value.replaceAll('.', '').replace(/[^0-9_,\.]+/g, "");
        console.log(hasilValue)
        let tmpData = [];
        for (let i = 0; i < dataTampil.length; i++) {
            let sisaBaru = Number(dataTampil[i].total.toString().replace(',', '.')) - Number(hasilValue.toString().replace(',', '.'));
            console.log(sisaBaru)
            if (i == index) {
                tmpData.push({
                    id: dataTampil[i].id,
                    bayar: hasilValue,
                    sisa: Number(sisaBaru).toFixed(2).toString().replace('.', ','),
                    code: dataTampil[i].code,
                    sales_invoice_id: dataTampil[i].sales_invoice_id,
                    sales_invoice_payment_id: dataTampil[i].sales_invoice_payment_id,
                    sales_invoice_total_payment: dataTampil[i].sales_invoice_total_payment,
                    total: dataTampil[i].total,
                });
            }
            else {
                tmpData.push(dataTampil[i])
            }

        }
        setDataTampil(tmpData)
    }
    const data =
        [...dataTampil.map((item, i) => ({
            code: item.code,
            total: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={item.total} />,
            sisa: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={item.sisa} />,
            paid: <CurrencyFormat onKeyDown={(event) => klikEnter(event)} className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={item.bayar} onChange={(e) => klikUbahBayar(e.target.value, i)} />
        })

        )]
    const defaultColumns = [
        {
            title: 'No. Faktur',
            dataIndex: 'code',
            align: 'center',
            width: '25%',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '25%',
            align: 'center',
            // render: (_, record) => (
            //     <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={Number(record.total).toString().replace('.', ',')} />
            // )
        },
        {
            title: 'Sisa',
            dataIndex: 'sisa',
            width: '25%',
            align: 'center',
            // render: (text, record, index) => {
            //     let sisa = 0;
            //     let total = record.total;
            //     let bayar = record.paid;
            //     // console.log(total);
            //     sisa = Number(total) - Number(bayar);
            //     // console.log(sisa)

            //     return <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={Number(sisa).toString().replace('.', ',')} />

            //     // return sisa
            // }
        },
        {
            title: 'Dibayarkan',
            dataIndex: 'paid',
            width: '25%',
            align: 'center',
            // editable: true,
            // render: (_, record) => (
            //     <CurrencyFormat onKeyDown={(event) => klikEnter(event)} className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={Number(record.paid).toString().replace('.', ',')} />

            // )
        },
    ];

    // const handleChange = () => {
    //     setChecked(!checked);
    //     let check_checked = !checked;
    //     calculate(product, check_checked);
    // };

    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        // let check_checked = checked;
        calculate(product);
    };

    const calculate = (product) => {
        let sisa = 0;
        product.map((values, i) => {
            sisa = (values.total - values.pays);

            setSisaUang(sisa)
        })
    }

    useEffect(() => {
        let sisa = 0;
        product.map((values, i) => {
            sisa = (values.total - values.pays);

            setSisaUang(sisa)
        })
    }, [])

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
        var updatedList = [...product];
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/sales_invoice_payments`,
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
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/sales_invoice_payments`,
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
            <form className="p-2 mb-3 bg-body rounded">
                <PageHeader
                    className="bg-body rounded mb-2"
                    onBack={() => window.history.back()}
                    title="Edit Pelunasan"
                ></PageHeader>
                {/* <div className="text-title text-start mb-4">
                    <h4 className="title fw-bold">Buat Pelunasan</h4>
                </div> */}
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Kwitansi</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedCustomer}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    defaultValue={referensi}
                                    onChange={(e) => setReferensi(e.target.value)}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pembayaran</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pembayaran"
                                    cacheOptions
                                    defaultOptions
                                    value={selectedPembayaran}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCOA}
                                    onChange={handleChangeCOA}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-4 p-2">
                                {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Cari Faktur</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Faktur Penjualan"
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
                                                placeholder="Cari Nama Faktur..."
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
                        dataSource={data}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            let totalTotal = 0;

                            pageData.forEach(({ paid }) => {
                                totalTotal = Number(totalTotal) + Number(paid.props.value.replace(',', '.'));
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>Total yang dibayarkan</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat onKeyDown={(event) => klikEnter(event)} className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={totalTotal} />
                                        </Table.Summary.Cell>
                                        {/* <Table.Summary.Cell index={2}>
                                            <Text>{totalRepayment}</Text>
                                        </Table.Summary.Cell> */}
                                    </Table.Summary.Row>
                                    {/* <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2}>
                                            <Text type="danger">{totalBorrow - totalRepayment}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row> */}
                                </>
                            );
                        }}
                    />
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
            </form>
        </>
    )
}

export default EditPelunasan