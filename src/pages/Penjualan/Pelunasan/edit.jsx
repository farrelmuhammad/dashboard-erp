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
    const [selectedPembayaran, setSelectedPembayaran] = useState("");
    const [COA, setCOA] = useState("");
    const [customer, setCustomer] = useState("");
    const [dataTampil, setDataTampil] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [chartOfAcc, setChartOfAcc] = useState("");
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
    const [tmpCentang, setTmpCentang] = useState([])

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [loading, setLoading] = useState(true)

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
        setChartOfAcc(value.id);
    };
    // load options using API call
    const loadOptionsCOA = (inputValue) => {
        return fetch(`${Url}/select_chart_of_accounts?anak_terakhir=1&kode_kategori[]=111&kode_kategori[]=112&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/sales_invoice_payments_available_sales_invoices?include_sales_invoice_payment_sales_invoices=${id}&kode=${query}&penerima=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            console.log(res.data.data)
            for (let i = 0; i < res.data.data.length; i++) {
                if (dataTampil[i] || res.data.data[i].id == id) {
                    tmp.push({
                        detail: res.data.data[i],
                        statusCek: true
                    });
                }
                else {
                    tmp.push({
                        detail: res.data.data[i],
                        statusCek: false
                    });
                }
            }
            setGetDataProduct(res.data.data);
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
                console.log(getData)
                setGetCode(getData.code)
                setDate(getData.date)
                if (getData.reference) {
                    setReferensi(getData.reference);
                }
                if (getData.chart_of_account) {
                    setSelectedPembayaran(getData.chart_of_account)
                }
                // setSelectedCOA(getData.chart_of_account.name);
                setCOA(getData.chart_of_account.id);
                setStatus(getData.status)
                setCustomer(getData.customer_id)
                setSelectedCustomer(getData.customer)
                let tmpData = [];
                let data = getData.sales_invoice_payment_details;
                for (let i = 0; i < data.length; i++) {
                    tmpData.push({
                        id: data[i].id,
                        bayar: Number(data[i].paid).toString().replace('.', ','),
                        bayarNoEdit: Number(data[i].paid).toString().replace('.', ','),
                        sisa: Number(data[i].remains).toString().replace('.', ','),
                        sisaNoEDit: Number(data[i].remains).toString().replace('.', ','),
                        code: data[i].sales_invoice_code,
                        sales_invoice_id: data[i].sales_invoice_id,
                        sales_invoice_payment_id: data[i].sales_invoice_payment_id,
                        sales_invoice_total_payment: data[i].sales_invoice_total_payment,
                        total: Number(data[i].sales_invoice_total_payment).toString().replace('.', ',')
                    })
                    // tmpCentang[i] = data[i].sales_invoice_code
                }
                // console.log(tmpCentang)
                setDataTampil(tmpData)
                setLoading(false)
                // setCustomerName(getData.recipient.name)
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
            let sisaBaru =  Number(dataTampil[i].sisaNoEDit.toString().replace(',', '.')) + Number(dataTampil[i].bayarNoEdit.toString().replace(',', '.')) - Number(hasilValue.toString().replace(',', '.'));
            console.log(sisaBaru)
            if (i == index) {
                tmpData.push({
                    id: dataTampil[i].id,
                    bayar: hasilValue,
                    bayarNoEdit: dataTampil[i].bayarNoEdit,
                    sisa : sisaBaru,
                    sisaNoEDit: dataTampil[i].sisaNoEDit,
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
            total: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={Number(item.total).toFixed(2).toString().replace('.', ',')} />,
            sisa: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={Number(item.sisa).toFixed(2).toString().replace('.', ',')} />,
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
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("bagan_akun", COA);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        dataTampil.map((p, i) => {
            console.log(p);
            userData.append("id_faktur_penjualan[]", p.sales_invoice_id);
            userData.append("terbayar[]", p.bayar);

            // userData.append("terbayar[]", p.pays);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/sales_invoice_payments/${id}`,
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
                navigate("/pelunasan");
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
        console.log(dataTampil)
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("bagan_akun", chartOfAcc);
        userData.append("pelanggan", customer);
        userData.append("bagan_akun", COA);
        userData.append("status", "Draft");
        dataTampil.map((p, i) => {
            console.log(p);
            userData.append("id_faktur_penjualan[]", p.sales_invoice_id);
            userData.append("terbayar[]", p.bayar);

            // userData.append("terbayar[]", p.pays);
        });
        // userData.append("termasuk_pajak", checked);

        axios({
            method: "put",
            url: `${Url}/sales_invoice_payments/${id}`,
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
                navigate("/pelunasan");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error,
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
        return <div></div>
    }

    return (
        <>
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Edit Pelunasan"
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
                                <input
                                    value={selectedCustomer.name}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />

                                {/* <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    disabled
                                    value={selectedCustomer}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
                                /> */}
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
                                    defaultInputValue={selectedPembayaran.name}
                                    value={selectedValue2}
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
            </PageHeader>

            <PageHeader
                className="bg-body rounded mb-2"
                title="Cari Faktur"
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModal2Visible(true)}
                    />,
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
                ]}
            >
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
                                        <CurrencyFormat disabled onKeyDown={(event) => klikEnter(event)} className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} value={Number(totalTotal).toFixed(2).toString().replace('.',',')} />
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

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2" role="group" aria-label="Basic mixed styles example">
                    {
                        status == 'Submitted' ?
                            <button
                                type="button"
                                className="btn btn-success rounded m-1"
                                value="Draft"
                                onClick={handleSubmit}
                            >
                                Simpan
                            </button> :
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
                                </button>
                            </>
                    }
                </div>
            </PageHeader>
        </>
    )
}

export default EditPelunasan