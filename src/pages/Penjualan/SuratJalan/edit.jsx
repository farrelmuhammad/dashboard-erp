import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
// import Select from 'react-select';
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Skeleton, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import { TenMp } from '@mui/icons-material';

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

const EditSuratJalan = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [vehicle, setVehicle] = useState('');
    const [description, setDescription] = useState('');
    const [sender, setSender] = useState("");
    const [customer, setCustomer] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [supplier, setSupplier] = useState("");
    const [supplierName, setSupplierName] = useState("");
    const [sumber, setSumber] = useState("");
    const [address, setAddress] = useState("");
    const [product, setProduct] = useState('');
    const [idTallySheet, setIdTallySheet] = useState([]);
    const [tally, setTally] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    const [getDataProduct, setGetDataProduct] = useState([]);
    const [getDataRetur, setGetDataRetur] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressId, setAddressId] = useState('');
    const [modal2Visible, setModal2Visible] = useState(false);

    useEffect(() => {
        axios.get(`${Url}/delivery_notes?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0]
                setGetCode(getData.code)
                setDate(getData.date)
                if (getData.customer) {
                    setCustomer(getData.customer.id)
                    setSelectedCustomer(getData.customer)
                    setAddressId(getData.customer_address.id)
                    setSelectedAddress(getData.customer_address)
                    setSumber('SO')
                }
                else if (getData.supplier) {
                    setSupplier(getData.supplier.id)
                    setSelectedAddress(getData.supplier_address)
                    setAddressId(getData.supplier_address.id)
                    setSelectedSupplier(getData.supplier)
                    setSumber('Retur')
                }

                setProduct(getData.delivery_note_details)
                let tmp = []
                for (let i = 0; i < getData.delivery_note_details.length; i++) {
                    tmp.push(getData.delivery_note_details[i].tally_sheet_id)
                }
                console.log(tmp)
                const unikTmp = [...new Set(tmp)];
                console.log(unikTmp)
                setIdTallySheet(unikTmp);

                setVehicle(getData.vehicle)
                setDescription(getData.notes)
                setSender(getData.sender)
                setIsLoading(false)
                console.log(getData);
            })
    }, [])

    // const expandedRowRender = (product) => {

    const columns = [
        {
            title: 'No. Transaksi',
            dataIndex: 'tally_sheet_code',
            width: '25%',
            key: 'date',

        },
        {
            title: 'Nama Alias',
            dataIndex: 'product_alias_name',
            width: '25%',
            key: 'date',

        },
        {
            title: 'Nama Product',
            dataIndex: 'product_name',
            width: '25%',
            key: 'name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            key: 'name',
            render : (_,record) => {
                return <>{Number(record.quantity).toFixed(2).replace('.',',')}</>
            }
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            align: 'center',
            width: '10%',
            key: 'name',
        },
    ];
    // return <Table columns={columns} dataSource={product.tally_sheet_details} pagination={false} />;
    // };

    const handleChangeSupplier = (value) => {
        setSupplier(value.id);
        setProduct([])
        setSelectedSupplier(value);
        // setSelectedAddress(value.supplier_addresses)
        setGrup(value._group)
    };
    // load options using API call
    const loadOptionsSupplier = (inputValue) => {
        return axios.get(`${Url}/delivery_notes_available_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
        // setSelectedAddress(value.customer_addresses)
    };

    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return axios.get(`${Url}/delivery_notes_available_customers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const loadOptionsAddress = (inputValue) => {
        if (sumber == 'Retur') {
            return axios.get(`${Url}/supplier_addresses?alamat=${inputValue}&id_pemasok=${supplier}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            }).then((res) => res.data);
        }
        else if (sumber == 'SO') {
            return axios.get(`${Url}/customer_addresses?alamat=${inputValue}&pelanggan=${supplier}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            }).then((res) => res.data.data);
        }

    };

    const handleChangeAddress = (value) => {
        console.log(value)
        setSelectedAddress(value);
        setAddressId(value.id);
        // setAddress(value.customer_addresses)
    };

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/delivery_notes_available_tally_sheets?nama_alias=${query}&pelanggan=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                for (let x = 0; x < idTallySheet.length; x++) {

                    if (res.data.data[i].id == idTallySheet[x]) {
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

            }
            console.log(tmp)
            setGetDataProduct(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/delivery_notes_available_tally_sheets?nama_alias=${query}&pemasok=${supplier}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            // let panjang = idTallySheet.length;
            // let banding;
            // for (let i = 0; i < res.data.data.length; i++) {
            //     for (let x = 0; x < panjang; x++) {
            //         if (x == 0) {
            //             banding = idTallySheet[x]
            //         }
            //         else {
            //             banding = banding + "|| res.data.data["+i+"].id == idTallySheet["+x+"]"
            //         }
            //     }
            // }

            for (let i = 0; i < res.data.data.length; i++) {
                for (let x = 0; x < idTallySheet.length; x++) {
                    if (res.data.data[i].id == idTallySheet[x]) {
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

            }
            console.log(tmp)
            setGetDataRetur(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplier])

    // useEffect(() => {
    //     const getProduct = async () => {
    //         const res = await axios.get(`${Url}/customer_addresses?nama_alias=${query}&pemasok=${supplier}`, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Authorization': `Bearer ${auth.token}`
    //             }
    //         })

    //         setGetDataRetur(res.data.data)
    //     };

    //     if (query.length === 0 || query.length > 2) getProduct();
    // }, [query, supplier, customer])


    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Transaksi',
            width: '25%',
            dataIndex: 'code',
            render: (_, record) => {
                return <>{record.detail.code}</>
            }
        },
        {
            title: sumber == 'SO' ? 'Pelanggan' : 'Supplier',
            dataIndex: 'customer',
            width: '20%',
            align: 'center',
            render: (_, record) => {
                if (sumber == 'SO') {
                    return record.detail.customer.name

                }
                else {
                    return record.detail.supplier.name

                }
            }
        },
        {
            title: 'Gudang',
            dataIndex: 'warehouse',
            width: '15%',
            align: 'center',
            // render: (warehouse) => warehouse.name
            render: (_, record) => {
                return <>{record.detail.warehouse.name}</>
            }
        },
        {
            title: 'Actions',
            dataIndex: 'action',
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

    // const defaultColumns = [
    //     {
    //         title: 'No. Transaksi',
    //         dataIndex: 'code',
    //         align: 'center',
    //     },
    //     {
    //         title: 'Status',
    //         dataIndex: 'status',
    //         align: 'center',
    //         render: (_, { status }) => (
    //             <>
    //                 <Tag color="blue">{status}</Tag>
    //             </>
    //         ),
    //     },
    // ];

    const handleChange = () => {
        setChecked(!checked);
        let check_checked = !checked;
        calculate(product, check_checked);
    };
    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        let check_checked = checked;
        calculate(product, check_checked);
    };


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
    // const components = {
    //     body: {
    //         row: EditableRow,
    //         cell: EditableCell,
    //     },
    // };
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

    const handleCheck = (event, indexTransaksi) => {
        var updatedList = [...product];
        let tmpDataBaru = []
        console.log(product)
        console.log(event.target.value.detail)

        if (sumber == 'Retur') {
            // dataSumber = value.purchase_return_details;
            for (let i = 0; i < getDataRetur.length; i++) {
                if (i == indexTransaksi) {
                    tmpDataBaru.push({
                        detail: getDataRetur[i].detail,
                        statusCek: !getDataRetur[i].statusCek
                    })
                }
                else {
                    tmpDataBaru.push(getDataRetur[i])
                }
            }
            setGetDataRetur(tmpDataBaru)
        }
        else if (sumber == 'SO') {
            // dataSumber = value.sales_order_details;
            for (let i = 0; i < getDataProduct.length; i++) {
                if (i == indexTransaksi) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: !getDataProduct[i].statusCek
                    })
                }
                else {
                    tmpDataBaru.push(getDataProduct[i])
                }
            }
            setGetDataProduct(tmpDataBaru)
        }

        if (tmpDataBaru[indexTransaksi].statusCek) {
            // let tmp = []
            let dataProduk = event.target.value.detail.tally_sheet_details
            for (let i = 0; i < dataProduk.length; i++) {
                updatedList.push({
                    product_alias_name: dataProduk[i].product_alias_name,
                    product_id: dataProduk[i].product_id,
                    product_name: dataProduk[i].product_name,
                    purchase_return_id: dataProduk[i].purchase_return_id,
                    quantity: dataProduk[i].boxes_quantity,
                    returned: dataProduk[i].purchase_return_qty,
                    sales_order_id: dataProduk[i].sales_order_id,
                    tally_sheet_code: event.target.value.detail.code,
                    tally_sheet_id: dataProduk[i].tally_sheet_id,
                    unit: dataProduk[i].boxes_unit
                })
            }
            // updatedList=[...product, tmp];
            console.log(updatedList)

        } else {
            let jumlah = 0
            for(let i = 0; i<updatedList.length; i++){
                if(updatedList[i].tally_sheet_code == event.target.value.detail.code){
                    jumlah = jumlah +1;
                }
            }
            for(let i = 0; i<updatedList.length; i++){
                if(updatedList[i].tally_sheet_code == event.target.value.detail.code){
                    updatedList.splice(i, jumlah);

                }
            }
        }
        setProduct(updatedList);
        setIdTallySheet(updatedList.map(d => d.tally_sheet_id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("kendaraan", vehicle);
        userData.append("pengirim", sender);
        userData.append("catatan", description);
        if (sumber == 'SO') {
            userData.append("pelanggan", customer);
            userData.append("alamat_pelanggan", addressId);
        }
        else if (sumber == 'Retur') {
            userData.append("alamat_pemasok", addressId);
            userData.append("pemasok", supplier);
        }
        idTallySheet.map((t) => userData.append("id_tally_sheet[]", t));
        userData.append("status", "Submitted");

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        axios({
            method: "put",
            url: `${Url}/delivery_notes/${id}`,
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
                navigate("/suratjalan");
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
        const userData = new URLSearchParams();
        userData.append("tanggal", date);
        userData.append("kendaraan", vehicle);
        userData.append("pengirim", sender);
        userData.append("catatan", description);
        if (sumber == 'SO') {
            userData.append("pelanggan", customer);
            userData.append("alamat_pelanggan", addressId);
        }
        else if (sumber == 'Retur') {
            userData.append("alamat_pemasok", addressId);
            userData.append("pemasok", supplier);
        }

        idTallySheet.map((t) => userData.append("id_tally_sheet[]", t));
        userData.append("status", "Draft");

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/delivery_notes/${id}`,
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
                navigate("/suratjalan");
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

    if (isLoading) {
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
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Edit Surat Jalan"
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
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Surat Jalan</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <input
                                    value={sumber == 'SO' ? 'Pesanan Penjualan' : 'Retur Pembelian'}
                                    type="Nama"
                                    className="form-control"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'SO' ? 'flex' : 'none' }}>
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
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Alamat..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedAddress}
                                    getOptionLabel={(e) => e.address}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsAddress}
                                    onChange={handleChangeAddress}
                                // onChange={(e) => setAddress(e.id)}
                                />

                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Kendaraan</label>
                            <div className="col-sm-7">
                                <input
                                    value={vehicle}
                                    type="Nama"
                                    className="form-control"
                                    onChange={(e) => setVehicle(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pengirim</label>
                            <div className="col-sm-7">
                                <input
                                    value={sender}
                                    type="Nama"
                                    className="form-control"
                                    onChange={(e) => setSender(e.target.value)}
                                />
                            </div>
                        </div>
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="col-sm-12">
                            <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                title="Daftar Tally Sheet"
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModal2Visible(true)}
                    />,
                    <Modal
                        title="Tambah Tally Sheet"
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
                                        placeholder="Cari Tally Sheet..."
                                        style={{
                                            width: 400,
                                        }}
                                        onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                    />
                                </div>
                                {
                                    sumber == 'SO' ?
                                        <Table
                                            columns={columnsModal}
                                            dataSource={getDataProduct}
                                            scroll={{
                                                y: 250,
                                            }}
                                            pagination={false}
                                            loading={isLoading}
                                            size="middle"
                                        /> :
                                        sumber == 'Retur' ?
                                            <Table
                                                columns={columnsModal}
                                                dataSource={getDataRetur}
                                                scroll={{
                                                    y: 250,
                                                }}
                                                pagination={false}
                                                loading={isLoading}
                                                size="middle"
                                            /> : null

                                }
                            </div>
                        </div>
                    </Modal>,
                ]}
            >
                <Table
                    // components={components}
                    bordered
                    pagination={false}
                    dataSource={product}
                    columns={columns}
                // expandable={{
                //     expandedRowRender,
                //     defaultExpandedRowKeys: ['0'],
                // }}
                // onChange={(e) => setProduct(e.id)}
                />
<br/>
                <div className="btn-group mt-2" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
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
                <div style={{ clear: 'both' }}></div>
            </PageHeader>
        </>
    )
}

export default EditSuratJalan