import './form.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import { Table, Tag } from 'antd'
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';

const DetailFakturPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [code, setCode] = useState('');
    const [fakturType, setFakturType] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState("");
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [source, setSource] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const [grup, setGrup] = useState("Lokal")
    const [impor, setImpor] = useState(false);
    const [loading, setLoading] = useState(true)

    const { id } = useParams();

    //state return data from database

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [dataHeader, setDataHeader] = useState([])
    const [dataSupplier, setDataSupplier] = useState()
    const [dataBarang, setDataBarang] = useState([])
    const [biaya, setBiaya] = useState([])
    const [credit, setCredit] = useState([])
    const [getStatus, setGetStatus] = useState()
    const [mataUang, setMataUang] = useState('Rp ')

    useEffect(() => {
        getDataFaktur();
    }, [])
    const getDataFaktur = async () => {
        await axios.get(`${Url}/select_purchase_invoices/dua?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data[0]
                setBiaya(getData.purchase_invoice_costs)
                setCredit(getData.purchase_invoice_credit_notes)
                setGetStatus(getData.status)
                setDataHeader(getData);
                setGrup(getData.supplier._group)
                setDataSupplier(getData.supplier)
                setDataBarang(getData.purchase_invoice_details)
                if(getData.purchase_invoice_details[0].currency_name){

                    setMataUang(getData.purchase_invoice_details[0].currency_name)
                }
                console.log(getData.purchase_invoice_details)
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }


    useEffect(() => {
        if (grup == "Impor") {
            setImpor(true);
        }
        else {
            setImpor(false);
        }

    }, [grup])

    const defaultColumns = [
        {
            title: 'Nama Produk',
            dataIndex: 'nama',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Stn',
            dataIndex: 'stn',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Harga',
            dataIndex: 'price',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Discount',
            dataIndex: 'diskon',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',

        },
    ];


    const dataTBPenerimaan =
        [...dataBarang.map((item, i) => ({
            nama: item.product_name,
            qty: item.quantity,
            stn: item.unit,
            price:  mataUang + ' ' + Number(item.price).toLocaleString('id'),
            diskon:
                <>
                    {
                        item.discount_percentage == 0 && item.fixed_discount == 0 ? <div>-</div> :
                            item.discount_percentage != 0 ?
                                <div className='d-flex p-1' style={{ height: "100%" }} >
                                    <input disabled className=' text-center editable-input edit-disabled'  value={item.discount_percentage.replace('.', ',')} key="diskon" />

                                    <option selected value="persen" > %</option>
                                </div> :
                                item.fixed_discount != 0 ?
                                    <div className='d-flex p-1' style={{ height: "100%" }}>
                                        <CurrencyFormat disabled className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={item.fixed_discount} key="diskon" />

                                        <option selected value="nominal">{mataUang}</option>


                                    </div> : null
                    }

                </>,
            total:  mataUang + ' ' + Number(item.total).toLocaleString('id'),
        }))

        ]



        
    const convertToRupiah = (angka) => {
        // console.log(angka)
        let hasil = mataUang + ' ' + Number(angka).toLocaleString('id')
        return <input
            value={hasil}
            readOnly="true"
            className="form-control form-control-sm"
            id="colFormLabelSm"
        />
    }




    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
    };


    const columAkun = [
        {
            title: 'No.Akun',
            dataIndex: 'code',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Deskripsi',
            dataIndex: 'desc',
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',

        },
    ];

    const dataBiaya = 
    [...biaya.map((item , i) => ({
        code: item.chart_of_account.code,
        desc: item.description,
        total: mataUang + ' ' + Number(item.total).toLocaleString('id')

    }))

    ]

    const dataCredit = 
    [...credit.map((item , i) => ({
        code: item.credit_note_code,
        desc: item.description,
        total: mataUang + ' ' + Number(item.total).toLocaleString('id')

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
                        title="Detail Faktur Pembelian">
                </PageHeader>
                    {/* <h3 className="title fw-bold">Detail Faktur Pembelian</h3> */}
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
                                    value={dataHeader.date}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Grup</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={grup}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Faktur</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.code}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataSupplier.name}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >No. Kontainer</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.container_number}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Term</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.term}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Muatan</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.payload}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Ctn</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={dataHeader.carton}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputPassword3" className="col-sm-4 col-form-label">Catatan</label>
                            <div className="col-sm-7">
                                <textarea
                                    className="form-control"
                                    id="form4Example3"
                                    rows="4"
                                    value={dataHeader.notes}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                {getStatus === 'Submitted' ? <Tag color="blue">{getStatus}</Tag> : getStatus === 'Draft' ? <Tag color="orange">{getStatus}</Tag> : getStatus === 'Done' ? <Tag color="green">{getStatus}</Tag> : <Tag color="red">{getStatus}</Tag>}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Penerimaan Pesanan</h4>
                        </div>
                    
                    </div>
                    <Table
                        // components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataTBPenerimaan}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-5 ps-3 col-form-label">Biaya Lain</label>
                    </div>
                    <Table
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataBiaya}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div className='mt-4' style={{ display: impor ? "block" : "none" }}>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Credit Note</label>
                        <div className="col-sm-5">
                          
                        </div>
                    </div>
                    <Table
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={dataCredit}
                        pagination={false}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-end mt-4 ">
                    <div className="col-6">
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">{convertToRupiah(dataHeader.subtotal)}</div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">{convertToRupiah(dataHeader.discount)}</div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Uang Muka</label>
                            <div className="col-sm-6">{convertToRupiah(dataHeader.down_payment)}</div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">{convertToRupiah(dataHeader.ppn)}</div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">{convertToRupiah(dataHeader.total)}</div>
                        </div>
                    </div>
                </div>

            </form>
        </>
    )
}

export default DetailFakturPembelian