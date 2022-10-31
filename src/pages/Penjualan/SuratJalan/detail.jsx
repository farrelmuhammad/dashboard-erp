import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import jsCookie from "js-cookie";
import axios from 'axios';
import Url from "../../../Config";;
import { Button, PageHeader, Skeleton, Table, Tag, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { CheckCircleOutlined, EditOutlined, PrinterOutlined, SyncOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from "../../Logo.jpeg";
import { Steps } from 'antd';
const { Step } = Steps;

export const DetailSuratJalan = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [dataSO, setDataSO] = useState([]);
    const [code, setCode] = useState('');
    const [date, setDate] = useState('');
    const [customer, setCustomer] = useState([]);
    const [sumber, setSumber] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [address, setAddress] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [sender, setSender] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState([]);
    const [details, setDetails] = useState([]);
    const [delivered, setDelivered] = useState();
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();
    const columns = [
        {
            title: 'No.',
            width: '4%',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'No. Tally Sheet',
            width: '25%',
            dataIndex: 'tally_sheet_code',
        },
        {
            title: 'Nama Alias Produk',
            width: '25%',
            dataIndex: 'product_alias_name',
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
            width: '25%',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            render(text, record) {
                return <div>{Number(text).toFixed(2).replace('.', ',')}</div>
            }
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            width: '10%',
            align: 'center',
        },
    ];

    useEffect(() => {
        getDataSOById()
    }, [])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        // pageStyle: pageStyle
    })

    const getDataSOById = async () => {
        await axios.get(`${Url}/delivery_notes?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                setDataSO(getData);
                setCode(getData.code)
                setDate(getData.date)
                if (getData.customer) {
                    setCustomer(getData.customer.name)
                    setAddress(getData.customer_address.address)
                    setSumber('SO')
                }
                else if (getData.supplier) {
                    setSupplier(getData.supplier.name)
                    setAddress(getData.supplier_address.address)
                    setSumber('Retur')
                }
                
                setVehicle(getData.vehicle)
                setSender(getData.sender)
                setNotes(getData.notes)
                setStatus(getData.status)
                setDetails(getData.delivery_note_details)
                setDelivered(getData.is_delivered)
                setLoading(false)
                console.log(getData.delivery_note_details)
                // console.log(res.data.data.map(d => d.sales_order_details));
                // console.log(getData.map(d => d.sales_order_details));
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    if (loading) {
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


            <div style={{ display: "none", position: "absolute" }} >
                <div ref={componentRef} className="p-4" style={{ width: "100%" }} >

                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>


                                <div className="page-header-space"></div>
                                <div className="page-header">
                                    <div className='row'>
                                        <div className='d-flex mb-3 float-container' style={{ position: "fixed", height: "100px", top: "0", width: "100%" }}>




                                            <div className='col-1' style={{ marginTop: "10px" }}><img src={logo} width="60px"></img></div>
                                            <div className='col-4' style={{ marginTop: "10px", marginRight: "100px" }}>
                                                <div className='ms-2' >
                                                    <div className='header-cetak'><b>PT. BUMI MAESTROAYU</b></div>
                                                    <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                                                    <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                                                    <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                                                </div>
                                            </div>



                                            <div className='col'>
                                                <div className='col float-child'>
                                                    <div className='col' width="100px"></div>

                                                    <div className=' mt-3 mb-5 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle: "bold" }}>
                                                        <div className='col-6'>
                                                            <div className="d-flex flex-row">
                                                                <label className='col-8'>Tanggal</label>
                                                                <div className='col-6'> : {date}</div>
                                                            </div>
                                                            <div className="d-flex flex-row">
                                                                <label className='col-8'>Kepada Yth.</label>
                                                                {
                                                                    sumber === 'SO' ?
                                                                        <div className='col-6'>
                                                                            : {customer}
                                                                        </div> :
                                                                        <div className='col-6'>
                                                                            :  {supplier}
                                                                        </div>
                                                                }

                                                            </div>
                                                            <div className="d-flex flex-row">
                                                                <label className='col-8'>Alamat</label>
                                                                <div>:</div>
                                                                <div className='col-12' style={{overflowWrap:"break-word", maxWidth:"260px", marginLeft:"3px"}}> {address}  </div>
                                                            </div>
                                                            <div className="d-flex flex-row">
                                                                <label className='col-8'>Kendaraan</label>
                                                                <div className='col-6'> : {vehicle} </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <br/>
                                <br/>
                                <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign: "center" }}>
                                    <div className='align-items-center' style={{ fontSize: "16px", textDecoration: "underline", textAlign: "center" }}>SURAT JALAN</div>
                                    <div style={{ fontSize: "10px", marginTop: "-5px" }}>NO. {code}</div>
                                </div>

                            </tr>
                        </thead>

                        <tbody style={{ marginTop: "600px" }}>
                            <tr>
                                <td>

                                    <div className="page" style={{ lineHeight: "3" }}>

                                        <div className='d-flex mt-1 ps-3 pe-3' >

                                            {/* <Table style={{fontSize: "10px", width: "100%", pageBreakAfter:"auto", backgroundColor:"white"}}
                        bordered
                        pagination={false}
                        dataSource={dataTS}
                        // expandable={{ expandedRowRender }}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}

                    /> */}

                                            <table style={{ fontSize: "10px", width: "100%" }}>
                                                <tr className='text-center border' style={{ height: "50px" }}>
                                                    <th width="50px" className='border' >No</th>
                                                    <th width="350px" className='border'>Nama Produk</th>
                                                    <th width="100px" className='border'>Qty</th>
                                                    <th width="100px" className='border'>Stn</th>

                                                </tr>
                                                <tbody className="text-center border">
                                                    {
                                                        details.map((item, i) => (
                                                            <tr  >
                                                                <td className='border-isi' >{i + 1}</td>
                                                                <td className='border-isi'>{item.product_alias_name}
                                                                </td>
                                                                <td className='border-isi' >{Number(item.quantity).toFixed(2).replace('.', ',')}</td>
                                                                <td className='border-isi' >{item.unit}</td>
                                                            </tr>
                                                        ))

                                                    }
                                                </tbody>


                                            </table>
                                        </div>


                                        {/* <div className='d-flex mt-3 ps-4 pe-4'>
                        <div style={{ width: "80%" }}>
                        </div>
                        <div style={{ width: "20%" }}>
                            <div className='d-flex mt-4' style={{fontSize:"10px"}}>
                                <label className='col-6'><b>Total</b></label>
                                <div>:</div>
                                <div className='ms-3'>{quantityTotal} <br/> </div>
                                <div>
                                    <br/>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div> */}
                                    </div>
                                </td>
                            </tr>
                        </tbody>

                        <tfoot style={{ position: "fixed", marginTop: "500px" }}>
                            <tr>
                                <td>

                                    <div className="page-footer-space"></div>
                                    <div className="page-footer" style={{ position: "fixed", Bottom: "0px", width: "95%" }} >
                                        <div className='d-flex' style={{ width: "100%", bottom: "0" }}>
                                            <table style={{ fontSize: "10px", width: "100%", height: "100%" }} >
                                                <tr className='text-center border' style={{ height: "50px", width: "70%" }}>
                                                    <th width="45px" className='border'>Dibuat Oleh,</th>
                                                    <th width="45px" className='border'>Disetujui Oleh,</th>
                                                    <th width="45px" className='border'>Diterima Oleh,</th>
                                                </tr>

                                                <tr className='text-center border ' style={{ height: "80px", width: "70%" }}>

                                                    <td width="45px" className='border'><b>_________________</b></td>
                                                    <td width="45px" className='border'><b>_________________</b></td>
                                                    <td width="45px" className='border'><b>_________________</b></td>

                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>

                    </table>

                </div>
            </div>


            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Surat Jalan"
                extra={[
                    <Link to={`/suratjalan/edit/${id}`}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                        />
                    </Link>,
                    <Tooltip title="Cetak" placement="bottom">
                        <Button
                            type="primary"
                            icon={<PrinterOutlined />}
                            style={{ background: "orange", borderColor: "orange" }}
                            onClick={handlePrint}
                        />
                    </Tooltip>,
                ]}
            >
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    disabled="true"
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    value={date}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Surat Jalan</label>
                            <div className="col-sm-7">
                                <input
                                    disabled="true"
                                    type="text"
                                    className="form-control"
                                    id="inputNama3"
                                    value={code}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <input
                                    value={sumber == 'SO' ? 'Penjualan' : 'Retur Pembelian'}
                                    type="Nama"
                                    className="form-control"
                                    disabled
                                />
                            </div>
                        </div>
                        {
                            sumber == 'SO' ?
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                                    <div className="col-sm-7">
                                        <select disabled="true" id="PelangganSelect" className="form-select">
                                            <option>{customer}</option>
                                        </select>
                                    </div>
                                </div>
                                :
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                                    <div className="col-sm-7">
                                        <select disabled="true" id="PelangganSelect" className="form-select">
                                            <option>{supplier}</option>
                                        </select>
                                    </div>
                                </div>
                        }

                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <select disabled="true" id="PelangganSelect" className="form-select">
                                    <option>{address}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="col">
                            <div className="row mb-3">
                                <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Kendaraan</label>
                                <div className="col-sm-7">
                                    <input
                                        value={vehicle}
                                        type="Nama"
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pengirim</label>
                                <div className="col-sm-7">
                                    <input
                                        value={sender}
                                        type="Nama"
                                        disabled
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Catatan</label>
                                <div className="col-sm-7">
                                    <input
                                        value={notes}
                                        type="Nama"
                                        disabled
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                                <div className="col-sm-7 p-2">
                                    {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status Pengiriman</label>
                                <div className="col-sm-7 p-2">
                                    {delivered === true ?
                                        <Tag color="green">Sudah Diterima</Tag>
                                        : <Tag color="red">Belum Diterima</Tag>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                title="Daftar Tally Sheet"
            >
                <Table
                    columns={columns}
                    dataSource={details}
                    pagination={false}
                    scroll={{
                        y: 200,
                    }}
                    size="middle"
                />
            </PageHeader>
        </>
    )
}

export default DetailSuratJalan