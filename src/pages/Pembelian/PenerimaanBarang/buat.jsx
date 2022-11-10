import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import Spreadsheet from 'react-spreadsheet';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';
import { SettingsSuggestSharp } from '@mui/icons-material';

const BuatPenerimaanBarang = () => {
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [warehouse, setWarehouse] = useState("");
    const [product, setProduct] = useState([]);
    const [productTampil, setProductTampil] = useState([])
    const [productSelect, setProductSelect] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState(false);

    const [getDataProduct, setGetDataProduct] = useState('');
    const [getDataRetur, setGetDataRetur] = useState('');
    const [getDataDetailSO, setGetDataDetailSO] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [count, setCount] = useState(0);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    // const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [supplierId, setSupplierId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedWarehouse] = useState(null);
    const [selectedValue3, setSelectedProduct] = useState([]);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal2Visible2, setModal2Visible2] = useState(false);
    const [indexTS, setIndexTS] = useState()
    const [tampil, setTampil] = useState(false)
    const [address, setAddress] = useState()
    const [dataAddress, setDataAddress] = useState([])
    const [gudang, setGudang] = useState()
    const [sumber, setSumber] = useState('')
    const [customerName, setCustomerName] = useState()
    const [supplierName, setSupplierName] = useState()
    const [grup, setGrup] = useState()

    const [tmpCentang, setTmpCentang] = useState([])


    const expandedRowRender = (record) => {
        const columns = [
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
                editable: true,
                render : (text) => {
                    return <>{text.replace('.', ',')}</>
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

        const dataPurchase =
            [...productTampil[record.key].tally_sheet_details.map((item, i) => ({
                product_name: item.product_name,
                quantity: item.boxes_quantity,
                unit: item.boxes_unit,
            }))

            ];


        return <Table
            style={{ display: loadingTable ? "none" : 'block' }}
            columns={columns}
            dataSource={dataPurchase}
            pagination={false}
            isLoading={true}
            rowClassName={() => 'editable-row'}
        />;

    };

    const defaultColumns = [
        {
            title: 'No. Transaksi',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'code',
        },
    ];

    const mainDataSource =
        [...product.map((item, i) => ({
            key: i,
            code: item.code,
            status: item.status,
        }))

        ]

    useEffect(() => {
        axios.get(`${Url}/select_supplier_addresses?id_pemasok=${supplierId}`, {
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
    }, [supplierId])

    const handleChangeSupplier = (value) => {
        setSupplierId(value.id);
        console.log(value)
        setProduct([])
        setSelectedSupplier(value);
        setGrup(value._group)
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
        setSelectedCustomer(value);
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


    const handleChangeProduct = (value) => {
        setSelectedProduct(value);
        setProductSelect(value.id);
    };
    // load options using API call
    const loadOptionsProduct = (inputValue) => {
        return fetch(`${Url}/select_products?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        getNewCodeTally()
    })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/goods_receipts_available_tally_sheets?kode=${query}&id_pemasok=${supplierId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                if(tmpCentang.indexOf(res.data.data[i].id) >= 0)
                tmp.push({
                    detail: res.data.data[i],
                    statusCek: true
                });
            }

            for(let i=0; i < res.data.data.length; i++){
                if(tmpCentang.indexOf(res.data.data[i].id) < 0)
                tmp.push({
                    detail:res.data.data[i],
                    statusCek:false
                })
            }

            setGetDataProduct(tmp)
            // setGetDataProduct(res.data.data);
            setGudang(res.data.warehouse_id)
            // setGetDataDetailSO(res.data.map(d => d.sales_order_details))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplierId])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/goods_receipts_available_tally_sheets?kode=${query}&id_pelanggan=${customerId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                if(tmpCentang.indexOf(res.data.data[i].id) >= 0)
                tmp.push({
                    detail: res.data.data[i],
                    statusCek: true
                });
            }

            for (let i = 0; i < res.data.data.length; i++) {
                if(tmpCentang.indexOf(res.data.data[i].id) < 0)
                tmp.push({
                    detail: res.data.data[i],
                    statusCek: false
                });
            }
            setGetDataRetur(tmp)
            // setGetDataRetur(res.data.data);
            setGudang(res.data.warehouse_id)

        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customerId])

    // Column for modal input product
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



    const handleCheck = (event, index) => {

        var updatedList = [...product];
        let tmpDataBaru = []
        const value = event.target.value.detail;
        let dataTally = value.tally_sheet_details

        let tmpDataCentang = [...tmpCentang]
        if (sumber == 'Retur') {
            for (let i = 0; i < getDataRetur.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataRetur[i].detail,
                        statusCek: !getDataRetur[i].statusCek
                    })
                    if (!tmpDataBaru[i].statusCek) {
                        let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.id);
                        tmpDataCentang.splice(idxHapus, 1)
                    }
                    else if (tmpDataBaru[i].statusCek == true) {
                        tmpDataCentang.push(tmpDataBaru[i].detail.id)
                    }
                    
                }
                else {
                    tmpDataBaru.push(getDataRetur[i])
                }

                // if(tmpDataBaru[i].statusCek == true){
                //     tmpDataCentang.push(tmpDataBaru[i].detail.id)
                // }
                // else{
                //     let index = tmpDataCentang.indexOf(tmpDataBaru[i].detail.id)
                //     if(index >= 0){
                //         tmpDataCentang.splice(index,1)
                //     }
                // }
            }
            setGetDataRetur(tmpDataBaru)

        }

        else if (sumber == 'PO') {
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

                if(tmpDataBaru[i].statusCek == true){
                    tmpDataCentang.push(tmpDataBaru[i].detail.id)
                }
                else{
                    let index = tmpDataCentang.indexOf(tmpDataBaru[i].detail.id)
                    if(index >= 0){
                        tmpDataCentang.splice(index,1)
                    }
                }
            }
            setGetDataProduct(tmpDataBaru)
        }

        let unikTmpCentang = [...new Set(tmpDataCentang)]
        setTmpCentang(unikTmpCentang)

        if (tmpDataBaru[index].statusCek) {
            updatedList = [...product, value];
        } else {
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
        setProduct(updatedList);
        setProductTampil(updatedList)
    };

    const getNewCodeTally = async () => {
        await axios.get(`${Url}/get_new_goods_receipt_draft_code/purchase_orders?tanggal=${date}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                setGetCode(res.data.data);
                console.log(res.data.data)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const handleSubmit = async (e) => {

        if(!date)
        {
            Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
                        });
        }
        else if(sumber == ''){
            Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Data Transaksi kosong, Silahkan Lengkapi datanya ",
                      });
        }
        else if(sumber == 'PO' && !supplierId ){
           
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
                  });
        }
        else if(sumber == 'Retur' && !customerId){
           
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Data Customer kosong, Silahkan Lengkapi datanya ",
                  });
           
        }
        else{



        e.preventDefault();
        const formData = new FormData();
        // console.log(product[0])
        formData.append("tanggal", date);
        if (sumber == 'PO') {
            formData.append("grup", grup);
            formData.append("pemasok", supplierId);
        }
        else {
            formData.append("pelanggan", customerId);
        }

        formData.append("catatan", description);


        for (let x = 0; x < productTampil.length; x++) {
            formData.append("id_tally_sheet[]", productTampil[x].id);
        }
        formData.append("status", "Submitted");
        axios({
            method: "post",
            url: `${Url}/goods_receipts`,
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
                        text:"Data  Tally Sheet belum lengkap, silahkan lengkapi datanya dan coba kembali",
                       // text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
   
         }     };

    const handleDraft = async (e) => {

        if(!date)
        {
            Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
                        });
        }
        else if(sumber == ''){
            Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Data Transaksi kosong, Silahkan Lengkapi datanya ",
                      });
        }
        else if(sumber == 'PO' && !supplierId ){
           
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
                  });
        }
        else if(sumber == 'Retur' && !customerId){
           
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Data Customer kosong, Silahkan Lengkapi datanya ",
                  });
           
        }
        else{

        e.preventDefault();
        console.log(productTampil)
        const formData = new FormData();
        formData.append("tanggal", date);
        if (sumber == 'PO') {
            formData.append("grup", grup);
            formData.append("pemasok", supplierId);
        }
        else {
            formData.append("pelanggan", customerId);
        }
     
        formData.append("catatan", description);

        for (let x = 0; x < productTampil.length; x++) {
            formData.append("id_tally_sheet[]", productTampil[x].id);
        }

        formData.append("status", "Draft");


        axios({
            method: "post",
            url: `${Url}/goods_receipts`,
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
                        text:"Data Tally Sheet belum lengkap, silahkan lengkapi datanya dan coba kembali",
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
  
          }      };

    function klikUbahSumber(value) {
        setSumber(value);
        setProduct([])
        setSelectedSupplier('');
        setSelectedCustomer('')
    }

    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Buat Penerimaan Barang">
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Penerimaan</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => klikUbahSumber(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option value="">Pilih Transaksi</option>
                                    <option value="PO">
                                        Pesanan Pembelian
                                    </option>
                                    <option value="Retur" >
                                        Retur Penjualan
                                    </option>


                                </select>
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'PO' ? 'flex' : 'none' }}>
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
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Customer..."
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
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
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
                            <h4 className="title fw-normal">Daftar Tally Sheet</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    if (sumber == '') {
                                        Swal.fire("Gagal", "Mohon Pilih Transaksi Dahulu..", "error");
                                    }
                                    else {
                                        setModal2Visible(true)
                                    }
                                }}
                            />
                            <Modal
                                title="Tambah Tally Sheet"
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
                                                placeholder="Cari Tally Sheet..."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        {
                                            sumber == 'PO' ?
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

                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleDraft}
                        style={{ width: '100px' }}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
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

export default BuatPenerimaanBarang