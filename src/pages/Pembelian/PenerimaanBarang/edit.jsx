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

const EditPenerimaanBarang = () => {

    const navigate = useNavigate()
    const auth = useSelector(state => state.auth);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [query, setQuery] = useState("");
    const [getDataProduct, setGetDataProduct] = useState('');
    const [getDataDetailSO, setGetDataDetailSO] = useState('');
    const [status, setStatus] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [dataPenerimaan, setDataPenerimaan] = useState([])
    const [dataTS, setDataTS] = useState([]);
    const [supplierName, setSupplierName] = useState()
    const [productTampil, setProductTampil] = useState([])
    const [supplierId, setSupplierId] = useState()
    const [loadingTable, setLoadingTable] = useState(false);
    // const [address, setAddress] = useState();
    const [addressId, setAddressId] = useState();
    const [grup, setGrup] = useState();

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_tally_sheet_ins?kode=${query}&status=Submitted&id_pemasok=${supplierId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
            setGetDataDetailSO(res.data.map(d => d.sales_order_details))
            // console.log(res.data.map(d => d.sales_order_details))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplierId])

    const columnsModal = [
        {
            title: 'No. Transaksi',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Gudang',
            dataIndex: 'notes',
            width: '30%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '8%',
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
                // setAddress(getData.address.address)
                // setAddressId(getData.address.id)
                setStatus(getData.status)
                console.log(getData);
                setSupplierName(getData.supplier.name);
                setGrup(getData.supplier._group);
                setSupplierId(getData.supplier.id);
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
                        key: i
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

    function hapusIndexProduct(index) {
        console.log(index)
        setLoadingTable(true);
        // for (let x = 0; x < dataTS.length; x++) {
        dataTS.splice(index, 1);

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data berhasil dihapus',
        }).then(() => setLoadingTable(false));
        // }
        console.log(dataTS)

    }

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
        {
            title: 'Action',
            dataIndex: 'action',
        },

    ];

    const dataSource =
        [
            ...dataTS.map((item, i) => ({
                code: item.code,
                product_name: item.product_name,
                quantity: item.quantity,
                unit: item.unit,
                action:
                    <Space size="middle">
                        <Button
                            size='small'
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => { hapusIndexProduct(i) }}
                        />
                    </Space>
            }))
        ]

    const handleCheck = (event) => {
        // console.log(event)
        var updatedList = [...dataTS];
        if (event.target.checked) {
            let data = event.target.value;
            let dataTally = data.tally_sheet_details
            console.log(data);
            let tmp = []
            for (let i = 0; i <= dataTS.length; i++) {
                if (i == dataTS.length) {
                    for (let x = 0; x < dataTally.length; x++) {
                        tmp.push({
                            quantity: dataTally[x].boxes_quantity,
                            product_id: dataTally[x].product_id,
                            product_name: dataTally[x].product_name,
                            code: data.code,
                            id: data.id,
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
            for (let i = 0; i < dataTS.length; i++) {
                if (updatedList[i] == event.target.value) {
                    updatedList.splice(i, 1);
                }
            }

        }
        setDataTS(updatedList);
        // setProductTampil(updatedList)
        // setGetDataDetailSO(updatedList.map(d => d.sales_order_details))
        // console.log(updatedList.map(d => d.sales_order_details));
        // console.log(updatedList);
    };

    const handleSubmit = async (e) => {
        console.log(productTampil)
        const formData = new URLSearchParams();
        formData.append("tanggal", dataPenerimaan.date);
        formData.append("grup", grup);
        formData.append("pemasok", supplierId);
        formData.append("catatan", dataPenerimaan.notes);
        
        formData.append("alamat", addressId);
        formData.append("gudang", dataPenerimaan.warehouse_id);

        for (let x = 0; x < dataTS.length; x++) {
            formData.append("id_tally_sheet[]", dataTS[x].id);
        }

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
        formData.append("pemasok", "1");
        formData.append("catatan", dataPenerimaan.notes);
        
        formData.append("alamat", "30");
        formData.append("gudang", dataPenerimaan.warehouse_id);

        for (let x = 0; x < dataTS.length; x++) {
            formData.append("id_tally_sheet[]", dataTS[x].id);
        }
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

    return (
        <>
            <form className="shadow-lg p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Buat Penerimaan Barang</h3>
                </div>
                <div class="row">
                    <div class="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={dataPenerimaan.date} id="startDate" className="form-control" type="date" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Penerimaan</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={dataPenerimaan.code} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={supplierName} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={address} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div> */}
                    </div>
                    <div class="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 pt-0 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                <textarea disabled="true" value={dataPenerimaan.notes} className="form-control" id="form4Example3" rows="4" />
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
                                onClick={() => setModal2Visible(true)}
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
                        style={{ display: loadingTable ? "none" : 'block' }}
                        bordered
                        pagination={false}
                        dataSource={dataSource}
                        isLoading={true}
                        columns={defaultColumns}
                    />
                </div> <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button type="button" class="btn btn-success rounded m-1" onClick={() => handleDraft()}>Simpan</button>
                    <button type="button" class="btn btn-primary rounded m-1" onClick={() => handleSubmit()}>Submit</button>
                    <button type="button" class="btn btn-warning rounded m-1" onClick={() => handleDraft()}>Cetak</button>
                </div>
            </form>

        </>
    )
}

export default EditPenerimaanBarang