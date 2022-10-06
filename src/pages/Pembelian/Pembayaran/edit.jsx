import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';

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

const EditPembayaranPembelian = () => {
    const { id } = useParams();
    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [catatan, setCatatan] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [COA, setCOA] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [kurs, setKurs] = useState()

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [dataHeader, setDataHeader] = useState()
    const [dataDetail, setDataDetail] = useState([]);
    const [loading, setLoading] = useState(true)
    const [selectedSupplier, setSelectedSupplier] = useState()
    const [selectedMataUang, setSelectedMataUang] = useState()
    const [supplierId, setSupplierId] = useState('')
    const [mataUangId, setMataUangId] = useState()
    const [selectedBank, setSelectedBank] = useState()
    const [bankId, setBankId] = useState()
    const [totalAkhir, setTotalAkhir] = useState('-');
    const [sisaAkhir, setSisaAkhir] = useState('-')



    // select supplier 
    const handleChangeSupplier = (value) => {
        setSelectedSupplier(value);
        setSupplierId(value.id);
    };
    const loadOptionsSupplier = (inputValue) => {
        return fetch(`${Url}/select_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // select mata uang 
    const handleChangeMataUang = (value) => {
        setSelectedMataUang(value);
        setMataUangId(value.id);
    };
    const loadOptionsMataUang = (inputValue) => {
        return fetch(`${Url}/select_currencies?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };


    // select bank/kas 
    const handleChangeBank = (value) => {
        setSelectedBank(value);
        setBankId(value.id);
    };
    const loadOptionsBank = (inputValue) => {
        return fetch(`${Url}/select_chart_of_accounts?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };



    useEffect(() => {
        getDataPembayaran();
    }, [])
    const getDataPembayaran = async () => {
        await axios.get(`${Url}/purchase_invoice_payments?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data.data[0];
                setDataHeader(getData)
                
                let tmp = []
                let data = getData.purchase_invoice_payment_details
                for (let i =0; i< data.length; i++){
                    tmp.push({
                        code: data[i].code,
                        total: data[i].total,
                        sisa: data[i].sisa,
                        bayar: data[i].bayar,
                        idFaktur: data[i].id
                    })
                }
                setDataDetail(tmp)

                // pengisian data Header 
                setDate(getData.date);
                setReferensi(getData.reference)
                setCatatan(getData.notes)
                setSelectedBank(getData.chart_of_account.name)
                setSelectedSupplier(getData.supplier.name)
                setSupplierId(getData.supplier_id)
                setMataUangId(getData.supplier_id);
                setBankId(getData.chart_of_account.id)
                setTotalAkhir(getData.total)
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }


    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_sales_invoices?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            align: 'center',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            dataIndex: 'customer_id',
            align: 'center',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Actions',
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
        },
        {
            title: 'Sisa',
            dataIndex: 'sisa',
            width: '25%',
            align: 'center',
            // render: (record) => (
            //     <>
            //         <a>0</a>
            //     </>
            // )
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
        userData.append("catatan", catatan);
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
        const dataKirim = new FormData();
        dataKirim.append("tanggal", date);
        dataKirim.append("referensi", referensi);
        dataKirim.append("kurs", kurs);
        dataKirim.append("pemasok", supplierId);
        dataKirim.append("status", "Draft");
        dataKirim.append("mata_uang", mataUangId);
        dataKirim.append("bagan_akun", bankId);
        dataKirim.append("catatan", catatan)

        product.map((p) => {
            dataKirim.append("id_faktur_pembelian[]", p.idFaktur);
            dataKirim.append("terbayar[]", p.bayar);
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

    const dataFaktur = 
    [...dataDetail.map((item,i )=> ({
        code: item.code,
        total: item.total,
        sisa: item.sisa,
        pays: item.bayar
    }))
    ]

    if (loading) {
        return (
            <div></div>
        )
    }

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Edit Pembayaran Pembelian">
                     </PageHeader>
                    {/* <h4 className="title fw-bold">Edit Pembayaran Pembelian</h4> */}
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
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pembayaran</label>
                            <div className="col-sm-7">
                                <input
                                    value={dataHeader.code}
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
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedSupplier}
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas/Bank</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Bank..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedBank}
                                    value={selectedBank}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedMataUang}
                                    defaultInputValue={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="col">
                        {/* <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                />
                            </div>
                        </div> */}
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix='Rp ' type="danger" disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir}  key="pay" />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                />
                            </div>
                        </div> */}
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
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
                                title="Tambah Pembauyaran Pembelian"
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
                                                placeholder="Cari No Transaksi..."
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
                        // components={components}
                        // rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataFaktur}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            let totalTotal = 0;
                            pageData.forEach(({ total }) => {
                                totalTotal = total;
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} className="text-end">Total yang dibayarkan</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text type="danger">{totalTotal}</Text>
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
                <form className="p-3 mb-5 bg-body rounded">
                    <div className="d-flex align-items-start mb-3">
                        <div htmlFor="inputPassword3" className="col-1 me-4">Catatan</div>
                        <div className="col-11">
                            <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                defaultValue={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                            />
                        </div>
                    </div>
                </form>


                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{float:'right', position:'relative'}}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                        width="100px"
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                        width="100px"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
                <div style={{clear:'both'}}></div>
            </form>
        </>
    )
}

export default EditPembayaranPembelian