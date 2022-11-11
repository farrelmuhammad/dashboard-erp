import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, Tooltip } from 'antd'
import { DeleteOutlined, PlusOutlined, EditOutlined, PrinterOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';
import logo from "../../Logo.jpeg";
import { useReactToPrint } from 'react-to-print';
import Terbilang from 'terbilang-ts';

const { Text } = Typography;



const DetailPembayaranPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const { id } = useParams();
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true)
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
    const [mataUang, setMataUang] = useState('')
    const [terbilangMU, setTerbilangMU] = useState(' Rupiah')

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [dataHeader, setDataHeader] = useState()
    const [canEdit, setCanEdit] = useState()
    const [dataDetail, setDataDetail] = useState([])
    const [totalP, setTotalP] = useState(0);

    useEffect(() => {
        let total_p = 0;
        getDataPembayaran();
        dataDetail.map((item) => {
            total_p = Number(total_p) + Number(item.paid);
            setTotalP(Number(total_p));
            console.log(totalP);
        })


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
                console.log(getData)
                setCanEdit(getData.can['update-purchase_invoice_payment'])
                setDataDetail(getData.purchase_invoice_payment_details)
                if (getData.currency_name) {
                    setMataUang(' ' + getData.currency_name + ' ')

                }
                setStatus(getData.status)
                setLoading(false);
                console.log(getData)
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
        //pageStyle: pageStyle

    })

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

    const dataFaktur =
        [...dataDetail.map((item, i) => ({
            code: item.purchase_invoice_code,
            total:
                dataHeader.currency_name == null ?
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'IDR '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.purchase_invoice_total_payment).toFixed(2).replace('.', ',')} key="diskon" /> :
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.purchase_invoice_total_payment).toLocaleString('id')} key="diskon" />,
            sisa:

                dataHeader.currency_name === 'IDR' ?
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.remains).toFixed(2).replace('.', ',')} key="diskon" /> :
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.remains).toLocaleString('id')} key="diskon" />
            ,

            pays:
                dataHeader.currency_name === null || dataHeader.currency_name == 'IDR' ?
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'IDR '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.paid).toFixed(2).replace('.', ',')} key="diskon" /> :
                    < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.paid).toLocaleString('id')} key="diskon" />,

        }))

        ]

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

                                                        {/* <div className=' mt-3 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle:"bold"}}> */}
                                                        {/* <div className='col-6'>
                          <div className="d-flex flex-row">
                          <label className='col-8'>No. Pembayaran</label>
                              <div className='col-12'> : {dataHeader.code}</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-8'>Tanggal</label>
                              <div className='col-12'>
                                  : { dataHeader.date }</div>
                          </div>
                        
                      </div> */}
                                                        {/* <div className='col-6'>
                        <div className="d-flex flex-row">
                              <label className='col-8'>No. Faktur</label>
                              <div className='col-8'> : {dataHeader.purchase_invoice.code}</div>
                          </div>
                          <div className="d-flex flex-row">
                          <label className='col-8'>Tanggal</label>
                              <div className='col-6'> : {dataHeader.date}</div>
                          </div>
                         
                          <div className="d-flex flex-row">
                              <label className='col-8'>Kepada Yth. </label>
                              <div className='col-6'> : {dataHeader.supplier.business_entity} {dataHeader.supplier.name}  </div>
                          </div>
                      </div> */}
                                                        {/* </div> */}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <br />


                                        <div className='mt-5 mb-2 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign: "center" }}>
                                            <div className='align-items-center' style={{ fontSize: "14px", textDecoration: "underline", textAlign: "center" }}>VOUCHER KAS KELUAR</div>
                                            <div style={{ fontSize: "10px", marginTop: "-5px" }}>NO. {dataHeader.code}</div>
                                        </div>
                                        <br />


                                        <div className='mt-2 mb-1 col d-flex justify-content-center ps-4 pe-4 ' style={{ fontSize: "12px", width: "100%" }}>
                                            <div className='col-6'>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Divisi</label>
                                                    <div className='col-6'> : Purchasing</div>
                                                </div>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Rekening </label>
                                                    <div className='col-6'> : {dataHeader.chart_of_account.name} </div>
                                                </div>

                                            </div>
                                            <div className='col-6'>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Dari</label>
                                                    {
                                                        dataHeader.supplier.business_entity == 'Lainnya' ?
                                                            <div className='col-6'> : {dataHeader.supplier.name}</div> :
                                                            <div className='col-6'> : {dataHeader.supplier.business_entity} {dataHeader.supplier.name}</div>
                                                    }

                                                </div>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Tanggal</label>
                                                    <div className='col-6'> : {dataHeader.date} </div>
                                                </div>


                                            </div>
                                            <div>

                                            </div>
                                        </div>

                                        {/* <div className='mt-2 mb-4 col d-flex justify-content-left ps-4 pe-4'  style={{ fontSize: "12px", fontWeight:"bold" }}>
                      <div className='col-6 col-md-4'>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Divisi</label>
                              <div className='col-6'> : Purchasing</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Rekening</label>
                              <div className='col-6'> : {dataHeader.chart_of_account.name} </div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Dari</label>
                              <div className='col-6'> : {dataHeader.supplier.name} </div>
                          </div>
                      </div>
                  </div> */}
                                    </div>
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>
                                    <div className="page" style={{ lineHeight: "3", margin: "0" }}>

                                        <div className='mt-2 ps-3 pe-3' >

                                            <table style={{ fontSize: "10px", width: "100%", pageBreakAfter: "auto" }}>
                                                <tr className='border' style={{ height: "40px", pageBreakInside: "avoid", pageBreakAfter: "auto" }}>
                                                    <th width="50px" className='text-center border'>No</th>
                                                    <th width="300px" className='text-center border'>Deskripsi</th>
                                                    <th width="80px" className='text-center border'>Jumlah</th>


                                                </tr>
                                                <tbody className="border">
                                                    {
                                                        dataDetail.map((item, i) => (
                                                            <tr style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} >
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {i + 1} </td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'>Pembayaran Pembelian  {item.purchase_invoice_code} </td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {
                                                                    dataHeader.currency_name === 'IDR' ?
                                                                        < CurrencyFormat type='danger' disabled className=' text-center editable-input edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.paid).toFixed(2).replace('.', ',')} key="diskon" /> :
                                                                        < CurrencyFormat type='danger' disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.paid).toLocaleString('id')} key="diskon" />
                                                                } </td>

                                                            </tr>
                                                        ))

                                                    }
                                                </tbody>
                                            </table>

                                            <div className='d-flex mt-1 ps-1 pe-1' style={{ marginBottom: '2px', height: '65%' }}>


                                                <div style={{ width: '40%', alignItems: 'end', marginLeft: '450px' }}>

                                                    <div className='d-flex' style={{ fontSize: "12px" }}>
                                                        <label className='col-6'><b> Total :</b></label>
                                                        {/* <div>:</div> */}
                                                        <div width="100%">{
                                                            dataHeader.currency_name === 'Rp ' ?
                                                                < CurrencyFormat disabled className=' text-end editable-input edit-disabled' style={{ fontWeight: 'bold', width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.paid).toFixed(2).replace('.', ',')} key="diskon" /> :
                                                                < CurrencyFormat disabled className=' text-end editable-input  edit-disabled' style={{ fontWeight: 'bold', width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.paid).toLocaleString('id')} key="diskon" />
                                                        }  </div>
                                                        <div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                            <div className="row" style={{ marginLeft: '5px', height: "80px", alignItems: "start", fontSize: '12px' }}>
                                                Terbilang: {Terbilang(< CurrencyFormat style={{ fontWeight: 'bold', width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.paid).toFixed(2).replace('.', ',')} key="diskon" />)} {dataHeader.currency_name}

                                            </div>


                                        </div>



                                        {/* <div className='mt-4 ps-4 pe-4' style={{fontSize:"13px"}}>



           <div className="row" style={{marginBottom:"5px", height:"80px", display:"flex", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
                 <b> Sudah Dibayarkan Kepada</b>
                </div>
               <div className="col-7 " style={{fontSize:"10px"}} >
                   <input
                      value={dataHeader.supplier.name}
                       id="inputNama3"
                       className='form-control'
                       type="Nama"
                       width={"80%"}
                       height={"30px"}
                       fontSize={"10px"}
                      
                    /> 
            </div>
            </div>

            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}> 
              <div className="col-5" style={{alignItems:"center"}}>
              <b> Uang Sejumlah </b>
                </div>
               <div className="col-7">
               <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                value={Terbilang((dataHeader.paid)) +  mataUang}
                                width={"80%"}
                                height={"30px"}
                                fontSize={"10px"}
                            />
              
            </div>
            </div>

            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
               <b> Untuk Pembayaran </b>
                </div>
               <div className="col-7" >
                   <input
                   
                      value={
                        dataDetail.map((item, i) => (
                            item.purchase_invoice_code
                        ))
                      }
                       id="inputNama3"
                       className='form-control'
                       type="Nama"
                       width={"80%"}
                       height={"30px"}
                       fontSize={"10px"}
                    /> 
            </div>
            </div>

            
            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
             <b>     Jumlah </b>
                </div>
               <div className="col-7 text-start" style={{fontSize:"12px"}}>
               <input
                                className="form-control"
                                id="inputNama3"
                                type="Nama"
                                value={mataUang + dataHeader.paid}
                                width={"80%"}
                                height={"30px"}
                                fontSize={"10px"}
                            />
            </div>
            </div>

        </div> */}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot style={{ position: "fixed", marginTop: "400px" }}>
                            <tr>
                                <td>

                                    <div className="page-footer-space"></div>
                                    <div className="page-footer" style={{ position: "fixed", Bottom: "0px", width: "92%", marginRight: "5px", marginLeft: "5px" }} >
                                        <div className='d-flex' style={{ width: "100%", bottom: "0" }}>
                                            <table style={{ fontSize: "10px", width: "100%", height: "100%", marginRight: "5px", marginLeft: "5px" }} >
                                                <tr className='text-center border' style={{ height: "50px", width: "70%" }}>
                                                    <th width="35px" className='border'>Dibuat</th>
                                                    <th width="35px" className='border'>Mengetahui</th>
                                                    <th width="35px" className='border'>Disetujui</th>
                                                    <th width="35px" className='border'>Diterima</th>
                                                </tr>

                                                <tr className='text-center border ' style={{ height: "80px", width: "70%" }}>

                                                    <td width="35px" className='border'><b>_________________</b></td>
                                                    <td width="35px" className='border'><b>_________________</b></td>
                                                    <td width="35px" className='border'><b>_________________</b></td>
                                                    <td width="35px" className='border'><b>_________________</b></td>
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



            <form className="p-3 mb-3 bg-body rounded">
                <div className='row'>
                    <div className="col text-title text-start">
                        {
                            canEdit ?
                                <PageHeader
                                    ghost={false}
                                    onBack={() => window.history.back()}
                                    title="Detail Pembayaran Pembelian"
                                    extra={[
                                        <Link to={`/pembayaranpembelian/edit/${id}`}>
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
                                </PageHeader> :
                                <PageHeader
                                    ghost={false}
                                    onBack={() => window.history.back()}
                                    title="Detail Pembayaran Pembelian"
                                    extra={[
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
                                </PageHeader>
                        }

                    </div>
                    {/* <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint}  className="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div> */}
                </div>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    value={dataHeader.date}
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    disabled
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
                                <input
                                    value={dataHeader.supplier.name}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas/Bank</label>
                            <div className="col-sm-7">
                                <input
                                    value={dataHeader.chart_of_account.name}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <input
                                    value={dataHeader.currency_name == null ? 'Rp ' : dataHeader.currency_name}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>

                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">
                                {/* <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={dataHeader.exchange_rate}
                                    disabled
                                /> */}
                                < CurrencyFormat disabled className='form-control text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.exchange_rate).toFixed(2).replace('.', ',')} key="diskon" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">{
                                dataHeader.currency_name === null ?
                                    < CurrencyFormat disabled className='form-control text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.total).toFixed(2).replace('.', ',')} key="diskon" /> :
                                    < CurrencyFormat disabled className='form-control text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.total).toLocaleString('id')} key="diskon" />
                            }    </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                {
                                    dataHeader.currency_name === null ?
                                        < CurrencyFormat disabled className='form-control text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.remains).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm edit-disabled" />} /> :
                                        < CurrencyFormat disabled className='form-control text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.remains).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm edit-disabled" />} />

                                }
                                {/* {
                                      dataHeader.currency_name === 'IDR' ?
                                      < CurrencyFormat disabled className='form-control text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.remains).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                      < CurrencyFormat disabled className='form-control text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.remains).toLocaleString('id')} key="diskon" />                    
                                } */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={dataHeader.reference}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-2">
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
                            <h4 className="title fw-normal">Daftar Faktur</h4>
                        </div>
                    </div>
                    <Table
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataFaktur}
                        columns={defaultColumns}
                        summary={() => {
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} className="text-end">Total yang dibayarkan</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            {
                                                dataHeader.currency_name === 'IDR' ?
                                                    < CurrencyFormat disabled className=' text-end editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.paid).toFixed(2).replace('.', ',')} key="diskon" /> :
                                                    < CurrencyFormat disabled className=' text-end editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.paid).toLocaleString('id')} key="diskon" />

                                            }
                                            {/* {dataHeader.paid} */}
                                            {/* {
                                                  mataUang === 'IDR ' ?
                                                  < CurrencyFormat type='danger' disabled className=' text-end editable-input edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.paid).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                                  < CurrencyFormat type='danger' disabled className=' text-end editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={dataHeader.currency_name + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.paid).toLocaleString('id')} key="diskon" />                    
                                            } */}



                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>

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
                                value={dataHeader.notes}
                                disabled
                            />
                        </div>
                    </div>
                </form>



            </form>
        </>
    )
}

export default DetailPembayaranPembelian