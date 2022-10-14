import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PageHeader } from 'antd';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from "../../Logo.jpeg";

export const DetailPenerimaanBarang = () => {


    const auth = useSelector(state => state.auth);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [query, setQuery] = useState("");
    const [getDataProduct, setGetDataProduct] = useState('');
    const [status, setStatus] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [dataPenerimaan, setDataPenerimaan] = useState([])
    const [dataTS, setDataTS] = useState([]);
    const [grup, setGrup] = useState([]);
    const [address, setAddress] = useState()
    const [supplierEntity, setSupplierEntity] = useState()
    const [dataPBBarang, setDataPBBarang] = useState([])
    const [details, setDetails] = useState([]);
    const [customerName, setCustomerName] = useState([]);
    const [supplierName, setSupplierName] = useState([]);
    const [supplierId, setSupplierId] = useState([]);
    const [customerId, setCustomerId] = useState([]);
    const [sumber, setSumber] = useState([]);

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
                if (getData.customer_id != null) {
                    setSumber('Retur')
                    setCustomerName(getData.customer_name);
                    setCustomerId(getData.customer_id);
                }
                else if (getData.supplier_id != null) {
                    setSumber('Pembelian')
                    setSupplierName(getData.supplier_name);
                    setGrup(getData.supplier._group);
                    setSupplierId(getData.supplier_id);
                    setSupplierEntity(getData.supplier.business_entity);

                }

                setDataPenerimaan(getData);
                setStatus(getData.status)
                setDataTS(getData.goods_receipt_details);
                setLoading(false);
                setDataPBBarang(getData.goods_receipt_details);
                //console.log(dataTS);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const componentRef = useRef();
    const pageStyle = `{
      
        @page { 
            size: 210mm 148mm; margin:0mm; } @media print { body {  size: a5 ;  height: 210mm;
                width: 148.5mm; margin:0mm;
                 -webkit-print-color-adjust: exact; } }
            
                .float-container {
                    
                    padding: 20px;
                }
                
                .float-child {
                    width: 50%;
                    float: left;
                    padding: 20px;
                    
                }  
            
            .page-header, .page-header-space {
                height: 100px;
              }
              
              .page-footer, .page-footer-space {
                height: 50px;
              
              }
              
              .page-footer {
                position: fixed;
                bottom: 0;
                width: 100%;
                border-top: 1px solid black; /* for demo */
                background: yellow; /* for demo */
              }
              
              .page-header {
                position: fixed;
                top: 0mm;
                width: 100%;
                border-bottom: 1px solid black; /* for demo */
                background: yellow; /* for demo */
              }
              
              .page {
                page-break-after: always;
              }
              
              @page {
                margin: 0mm
              }
              
              @media print {

                size: a5 landscape;
                margin: 0mm !important;

                 thead {display: table-header-group;} 
                 tfoot {display: table-footer-group;}
                 
                 button {display: none;}
                 
                 body {margin-bottom:20;
                margin-top:5;}

                table { page-break-after:auto }
                tr    { page-break-inside:avoid; page-break-after:auto }
                td    { page-break-inside:avoid; page-break-after:auto }
              }
    
           
            }`;



    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        //   pageStyle: pageStyle

    })




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
            width: "10%",
            render: (text) => {
                return text.replace('.', ',')
            }
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

    const dataPBPenerimaan =
        [...dataPBBarang?.map((item, i) => ({
            tally_sheet_code: item.tally_sheet_code,
            product_name: item.product_name,
            quantity: item.quantity,
            unit: item.unit,


        }))

        ]

    const cetakData =
        [...details.map((item, i) => ({
            notrans: item.tally_sheet_code,
            nama: item.product_name,
            qty: item.quantity,
            stn: item.unit,
        }))

        ]


    const columnsModal = []

    if (loading) {
        return (
            <div></div>
        )
    }


    return (
        <>

            <div style={{ display: "none" }} >
                <div ref={componentRef} className="p-4" style={{ width: "100%" }} >

                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <td>

                                    <div className="page-header-space"></div>
                                    <div className="page-header">
                                        <div className='row'>


                                            <div className='d-flex mb-3 float-container' style={{ position: "fixed", height: "100px", top: "0" }}>
                                                <div className='col float-child'>
                                                    <div><img src={logo} width="60px"></img></div>
                                                    <div className='ms-2' >
                                                        <div className='header-cetak'>PT. BUMI MAESTROAYU</div>
                                                        <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                                                        <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                                                        <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                                                    </div>

                                                </div>


                                                <div className='col float-child'>
                                                    <div height="100px"></div>

                                                    <div className=' mt-4 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle: "bold" }}>
                                                        <div className='col-md-4'>
                                                            <div className="d-flex flex-row">
                                                                <label className='col-6'>Tanggal</label>
                                                                <div className='col-6'> : {dataPenerimaan.date}</div>
                                                            </div>
                                                            <div className="d-flex flex-row">
                                                                <label className='col-6'>No. Penerimaan</label>
                                                                <div className='col-6'> : {dataPenerimaan.code}</div>
                                                            </div>
                                                            <div className="d-flex flex-row">
                                                                <label className='col-6'>Kepada Yth. </label>
                                                                <div className='col-6'> : {supplierName} {supplierEntity} <br /> di Tempat </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <br />
                                        <br />
                                        <br />
                                        {/* <div style={{clear:"both"}}></div> */}
                                        <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign: "center" }}>
                                            <div className='align-items-center' style={{ fontSize: "14px", textDecoration: "underline", textAlign: "center" }}>PENERIMAAN BARANG</div>
                                        </div>
                                        <br />
                                    </div>
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>


                                    <div className="page" style={{ lineHeight: "5" }}>

                                        <div className='mt-4 ps-4 pe-4' >

                                            <Table style={{ fontSize: "10px", width: "100%", pageBreakAfter: "auto", backgroundColor: "white" }}
                                                bordered
                                                pagination={false}
                                                dataSource={dataTS}
                                                // expandable={{ expandedRowRender }}
                                                columns={defaultColumns}
                                                onChange={(e) => setProduct(e.target.value)}

                                            />

                                            {/* <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto"}}>
                            <tr className='text-center border' style={{ height: "50px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>
                                <th width="100px" className='border' >No Transaksi</th>
                                <th width="200px" className='border'>Nama Produk</th>
                                <th width="80px" className='border'>Qty</th>
                                <th width="80px" className='border'>Stn</th>
                            
                            </tr>
                            <tbody className="border">
                                {
                                    dataPBBarang.map((item, i) => (
                                        <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item[i].tally_sheet_code}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-start'><b> {item.product_name} </b> <br/> 
                                          
                                             </td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.quantity}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.unit}</td>
                                        </tr>
                                        ))
                                    
                                }
                            </tbody>


                        </table> */}
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

                        <tfoot>
                            <tr>
                                <td>

                                    <div className="page-footer-space"></div>
                                    <div className="page-footer"  >
                                        <div className='d-flex' style={{ width: "100%", bottom: "0" }}>
                                            <table style={{ fontSize: "13px", width: "100%", height: "100%" }}  >
                                                <tr className='text-center' style={{ height: "50px", width: "70%" }}>
                                                    <th width="35px" >Tanda Terima,</th>
                                                    <th width="35px" >Hormat Kami,</th>

                                                </tr>

                                                <tr className='text-center' style={{ height: "80px", width: "70%" }}>

                                                    <td width="35px" ><b>_________________</b></td>
                                                    <td width="35px"><b>_________________</b></td>


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





            <form className="  p-3 mb-5 bg-body rounded">
                <div className='row'>
                    <div className="col text-title text-start">
                        <PageHeader
                            ghost={false}
                            onBack={() => window.history.back()}
                            title="Detail Penerimaan Barang">
                        </PageHeader>
                        {/* <h3 className="title fw-bold">Buat Penerimaan Barang</h3> */}
                    </div>
                    <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} class="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div>
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
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'none' : 'flex' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={supplierName} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={customerName} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>

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