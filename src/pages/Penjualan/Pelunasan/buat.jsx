import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, PageHeader } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import { formatRupiah } from '../../../utils/helper';
import CurrencyFormat from 'react-currency-format';

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

const BuatPelunasan = () => {
    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [chartOfAcc, setChartOfAcc] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [namaMataUang, setNamaMataUang] = useState('Rp');
    

    const [sisaUang, setSisaUang] = useState("");
    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
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

        if(!value){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
              });
        }
        else{

        setSelectedCOA(value);
        setChartOfAcc(value.id);
        }
    };
    // load options using API call
    const loadOptionsCOA = (inputValue) => {
        return fetch(`${Url}/select_chart_of_accounts?limit=10&nama=${inputValue}&parent=null`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // useEffect(() => {
    //     getNewCodeSales()
    // })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_sales_invoices?nama_alias=${query}&penerima=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
            console.log(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            align: 'center',
            dataIndex: 'code',
        },
        {
            title: 'Customer',
            dataIndex: 'recipient',
            align: 'center',
            render: (recipient) => recipient.name
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '20%',
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

    const convertToRupiahTabel = (angka) => {
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
                    : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />

            }
        </>
    }

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
            render: (text) => formatRupiah(text)
        },
        {
            title: 'Sisa',
            dataIndex: 'sisa',
            width: '25%',
            align: 'center',
            render: (text, record, index) => {
                let sisa = 0;
                sisa = (record.total - record.pays);

                return convertToRupiahTabel(sisa) || 0
            }
        },
        {
            title: 'Dibayarkan',
            dataIndex: 'pays',
            width: '25%',
            align: 'center',
            editable: true,
            // render: (record) => {
            //     let pay = 0;
            //     if (record.pays !== 0) {
            //         return pay += record.pays
            //     } 
            //     else {
            //         return pay
            //     }
            // }
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

    // const calculateInvoice = (product) => {
    //     let total = 0;
    //     let pay = 0;
    //     let sisa = 0;
    //     product.map((values) => {
    //         total = values.pays - values.total;

    //     })
    // }

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

        if(!date){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if (!customer){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Pelanggan kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!chartOfAcc){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
              });
        }
        else{


        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("bagan_akun", chartOfAcc);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        product.map((p) => {
            console.log(p);
            userData.append("id_faktur_penjualan[]", p.id);
            userData.append("terbayar[]", p.pays);
        });

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
                        text:"Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
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
        }    };

    const handleDraft = async (e) => {
        e.preventDefault();

        if(!date){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if (!customer){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Pelanggan kosong, Silahkan Lengkapi datanya ",
              });
        }
        else if(!chartOfAcc){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Kas/Bank kosong, Silahkan Lengkapi datanya ",
              });
        }
        else{

        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("bagan_akun", chartOfAcc);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("id_faktur_penjualan[]", p.id);
            userData.append("terbayar[]", p.pays);
        });

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
                        text:"Data belum lengkap, silahkan lengkapi datanya dan coba kembali"
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
     } };

    return (
        <>
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Buat Pelunasan"
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Kwitansi</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Customer..."
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
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setReferensi(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas/Bank</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Kas/Bank"
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue2}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCOA}
                                    onChange={handleChangeCOA}
                                />
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
                    dataSource={product}
                    columns={columns}
                    onChange={(e) => setProduct(e.target.value)}
                    summary={(pageData) => {
                        // let totalTotal = 0;
                        // pageData.forEach(({ total }) => {
                        //     totalTotal += total;
                        // });
                        let totalTotal = 0;
                        pageData.forEach(({ pays }) => {
                            totalTotal += pays;
                        });
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3}>Total yang dibayarkan</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <Text type="danger">Rp {totalTotal || 0}</Text>
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
                </div>
            </PageHeader>
        </>
    )
}

export default BuatPelunasan