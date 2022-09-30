import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const DetailPenerimaanBarang = () => {


    const auth = useSelector(state => state.auth);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [query, setQuery] = useState("");
    const [getDataProduct, setGetDataProduct] = useState('');
    const [status, setStatus] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [dataPenerimaan, setDataPenerimaan] = useState([])
    const [dataTS, setDataTS] = useState([]);
    const [supplierName, setSupplierName] = useState()
    const [address, setAddress] = useState()

    useEffect(()=> {
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
                setStatus(getData.status)
                setDataTS(getData.goods_receipt_details);
                setSupplierName(getData.supplier.name);
                setAddress(getData.address.address)
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const defaultColumns = [
        {
            title: 'No. Transaksi',
            dataIndex: 'tally_sheet_code',
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
        // {
        //     title: 'Action',
        //     dataIndex: 'action',
        // },
        
    ];

    const columnsModal = []

    if (loading) {
        return (
            <div></div>
        )
    }


    return (
        <>
            <form className="  p-3 mb-5 bg-body rounded">
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
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
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
                    </div>
                    <Table
                        bordered
                        pagination={false}
                        dataSource={dataTS}
                        // expandable={{ expandedRowRender }}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
            </form>
        </>
    )
}

export default DetailPenerimaanBarang