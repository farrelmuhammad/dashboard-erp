import './form.css'
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../../../Config';
import { Button, Modal, Checkbox, Space, Table, Tag } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Search from 'antd/lib/transfer/search';
import Swal from 'sweetalert2';
import AsyncSelect from "react-select/async";

import { PageHeader } from 'antd';

const EditPenerimaanBarang = () => {

    const navigate = useNavigate()
    const auth = useSelector(state => state.auth);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [query, setQuery] = useState("");
    const [getDataProduct, setGetDataProduct] = useState('');
    const [getDataRetur, setGetDataRetur] = useState('');
    const [getDataDetailSO, setGetDataDetailSO] = useState('');
    const [status, setStatus] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [dataPenerimaan, setDataPenerimaan] = useState([])
    const [dataTS, setDataTS] = useState([]);
    const [supplierName, setSupplierName] = useState()
    const [customerName, setCustomerName] = useState()
    const [productTampil, setProductTampil] = useState([])
    const [supplierId, setSupplierId] = useState()
    const [customerId, setCustomerId] = useState()
    const [loadingTable, setLoadingTable] = useState(false);
    // const [address, setAddress] = useState();
    const [addressId, setAddressId] = useState();
    const [grup, setGrup] = useState();
    const [gudang, setGudang] = useState();
    const [sumber, setSumber] = useState('');
    const [date, setDate] = useState();
    const [catatan, setCatatan] = useState();

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_tally_sheet_ins?include_goods_receipt_tally_sheets=${id}&kode=${query}&status=Submitted&id_pemasok=${supplierId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                for (let x = 0; x < dataTS.length; x++) {
                    if (res.data[i].code == dataTS[x].code) {
                        tmp.push({
                            detail: res.data[i],
                            statusCek: true
                        });
                    }
                    else {
                        tmp.push({
                            detail: res.data[i],
                            statusCek: false
                        });
                    }
                }

            }

            setGetDataProduct(tmp);
            setGetDataDetailSO(res.data.map(d => d.sales_order_details))
            // console.log(res.data.map(d => d.sales_order_details))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplierId])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/goods_receipts_available_tally_sheets?include_goods_receipt_tally_sheets=${id}&kode=${query}&id_pelanggan=${customerId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                for (let x = 0; x < dataTS.length; x++) {

                    if (res.data.data[i].code == dataTS[x].code) {
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
            setGetDataRetur(tmp);
            setGudang(res.data.warehouse_id)

        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customerId])

    const handleChangeSupplier = (value) => {
        setSupplierId(value.id);
        setProduct([])
        setSupplierName(value);
    };
    // load options using API call
    const loadOptionsSupplier = (inputValue) => {
        return axios.get(`${Url}/goods_receipts_available_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const handleChangeCustomer = (value) => {
        // setGrup(value._group)
        setProduct([])
        setCustomerName(value);
        setCustomerId(value.id);
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return axios.get(`${Url}/goods_receipts_available_customers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };


    const columnsModal = [
        {
            title: 'No. Transaksi',
            width: '20%',
            render: (_, record) => {
                return <>{record.detail.code}</>
            }
        },
        {
            title: sumber == 'Retur' ? 'Customer' : 'Supplier',
            width: '15%',
            align: 'center',
            render: (_, record) => {
                if (sumber == 'Retur') {
                    return <>{record.detail.customer_name}</>

                }
                else {
                    return <>{record.detail.supplier_name}</>

                }
            }
        },
        {
            title: 'Gudang',
            width: '30%',
            align: 'center',
            render: (_, record) => {
                return <>{record.detail.warehouse_name}</>
            }
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '8%',
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

    useEffect(() => {
        getDataPOById();
    }, [])
    const getDataPOById = async () => {
        await axios.get(`${Url}/goods_receipts?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                setDataPenerimaan(getData);
                setDate(getData.date);
                setStatus(getData.status)
                setCatatan(getData.notes)
                if (getData.customer_id != null) {
                    setSumber('Retur')
                    console.log('Retur')
                    setCustomerName(getData.customer_name);
                    setCustomerId(getData.customer_id);
                }
                else if (getData.supplier_id != null) {
                    console.log('Pembelian')
                    setSumber('Pembelian')
                    setSupplierName(getData.supplier_name);
                    setGrup(getData.supplier._group);
                    setSupplierId(getData.supplier_id);
                }
                let tmp = [];
                let data = getData.goods_receipt_details;
                for (let i = 0; i < data.length; i++) {
                    tmp.push({
                        quantity: data[i].quantity,
                        product_id: data[i].product_id,
                        product_name: data[i].product_name,
                        code: data[i].tally_sheet_code,
                        id: data[i].tally_sheet_id,
                        unit: data[i].unit,
                        key: i,
                        statusCek: true
                    })

                }
                setDataTS(tmp);
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    // function hapusIndexProduct(index) {
    //     console.log(index)
    //     setLoadingTable(true);
    //     // for (let x = 0; x < dataTS.length; x++) {
    //     dataTS.splice(index, 1);

    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Berhasil',
    //         text: 'Data berhasil dihapus',
    //     }).then(() => setLoadingTable(false));
    //     // }
    //     console.log(dataTS)

    // }

    const defaultColumns = [
        {
            title: 'No. Transaksi',
            dataIndex: 'code',
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
        },

    ];

    const dataSource =
        [
            ...dataTS.map((item, i) => ({
                code: item.code,
                product_name: item.product_name,
                quantity: item.quantity.replace('.', ','),
                unit: item.unit,
                // action:
                //     <Space size="middle">
                //         <Button
                //             size='small'
                //             type="danger"
                //             icon={<DeleteOutlined />}
                //             onClick={() => { hapusIndexProduct(i) }}
                //         />
                //     </Space>
            }))
        ]

    const handleCheck = (event, index) => {
        // console.log(event)
        var updatedList = [...dataTS];
        let arrData = [];
        let panjang;
        let dataSumber;
        let tmpDataBaru = []
        const value = event.target.value.detail;
        let dataTally = value.tally_sheet_details


        if (sumber == 'Retur') {
            for (let i = 0; i < getDataRetur.length; i++) {
                if (i == index) {
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
            // dataSumber = value.sales_return_details;
            // panjang = value.sales_return_details.length;

        }

        else if (sumber == 'Pembelian') {
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
            }
            setGetDataProduct(tmpDataBaru)
            // panjang = value.purchase_order_details.length;
            // dataSumber = value.purchase_order_details;
        }

        if (tmpDataBaru[index].statusCek) {
            let tmp = []
            for (let i = 0; i <= dataTS.length; i++) {
                if (i == dataTS.length) {
                    for (let x = 0; x < dataTally.length; x++) {
                        tmp.push({
                            quantity: dataTally[x].boxes_quantity,
                            product_id: dataTally[x].product_id,
                            product_name: dataTally[x].product_name,
                            code: value.code,
                            id: value.id,
                            unit: dataTally[x].boxes_unit,
                            key: i
                        })
                    }
                }
                else {
                    tmp.push(dataTS[i]);
                }
            }
            updatedList = tmp;
        } else {
            console.log(updatedList)
            console.log(value)
            let jumlah = 0
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i].code == value.code) {
                    jumlah +=1
                }
            }
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i].code == value.code) {
                    updatedList.splice(i, jumlah);
                }
            }


        }
        setDataTS(updatedList);
    };

    const handleSubmit = async (e) => {
        console.log(dataTS)
        const formData = new URLSearchParams();
        formData.append("tanggal", dataPenerimaan.date);
        formData.append("grup", grup);
        formData.append("pemasok", supplierId);
        formData.append("catatan", dataPenerimaan.notes);
        formData.append("referensi", dataPenerimaan.reference);
        formData.append("gudang", dataPenerimaan.warehouse_id);
        formData.append("id_tally_sheet[]", dataTS[0].id);
        formData.append("status", "Submitted");

        axios({
            method: "put",
            url: `${Url}/goods_receipts/${id}`,
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
                navigate("/penerimaanbarang");
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

    const handleDraft = async () => {
        const formData = new URLSearchParams();
        formData.append("tanggal", dataPenerimaan.date);
        formData.append("grup", grup);
        formData.append("pemasok", supplierId);
        formData.append("catatan", dataPenerimaan.notes);

        // formData.append("alamat", "30");
        formData.append("gudang", dataPenerimaan.warehouse_id);

        // for (let x = 0; x < dataTS.length; x++) {
        formData.append("id_tally_sheet[]", dataTS[0].id);
        // }
        formData.append("status", "Draft");


        axios({
            method: "put",
            url: `${Url}/goods_receipts/${id}`,
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
                navigate("/penerimaanbarang");
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
            <form className="shadow-lg p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Edit Penerimaan Barang">
                    </PageHeader>
                    {/* <h3 className="title fw-bold">Buat Penerimaan Barang</h3> */}
                </div>
                <div class="row">
                    <div class="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input value={date} onChange={(e) => setDate(e.target.value)} id="startDate" className="form-control" type="date" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Penerimaan</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={dataPenerimaan.code} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={sumber == 'Retur' ? 'Retur Penjualan' : 'Pesanan Pembelian'} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'none' : 'flex' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={supplierName}
                                    value={supplierName}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Customer..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={customerName}
                                    value={customerName}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
                                />
                            </div>
                        </div>

                    </div>
                    <div class="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 pt-0 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} className="form-control" id="form4Example3" rows="4" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
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
                            <h4 className="title fw-normal">Daftar Tally Sheet</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {

                                    setModal2Visible(true)

                                }}
                            />
                            <Modal
                                title="Tambah Produk"
                                centered
                                visible={modal2Visible}
                                onCancel={() => setModal2Visible(false)}
                                width={1000}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Nomor Pesanan.."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        {
                                            sumber == 'Pembelian' ?
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
                                                        dataSource={getDataProduct}
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
                            </Modal>
                        </div>
                    </div>
                    <Table
                        style={{ display: loadingTable ? "none" : 'block' }}
                        bordered
                        pagination={false}
                        dataSource={dataSource}
                        isLoading={true}
                        columns={defaultColumns}
                    />
                </div> <div class="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button type="button" width="100px" class="btn btn-success rounded m-1" onClick={() => handleDraft()}>Simpan</button>
                    <button type="button" width="100px" class="btn btn-primary rounded m-1" onClick={() => handleSubmit()}>Submit</button>
                    <button type="button" width="100px" class="btn btn-warning rounded m-1" onClick={() => handleDraft()}>Cetak</button>
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>

        </>
    )
}

export default EditPenerimaanBarang