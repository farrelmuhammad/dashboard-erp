import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag, Tooltip } from 'antd'
import { DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined,EditOutlined , PrinterOutlined } from '@ant-design/icons'
import React, { useEffect, useState, useRef } from 'react'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useParams , Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import CurrencyFormat from 'react-currency-format';
import { PageHeader } from 'antd';
import logo from "../../Logo.jpeg";
import { useReactToPrint } from 'react-to-print';
import { SettingsRemoteRounded } from '@material-ui/icons'

export const DetailPIB = () => {
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(true)
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedMataUang, setSelectedMataUang] = useState(null);
    const [selectedFaktur, setSelectedFaktur] = useState(null);
    const [selectedCOA, setSelectedCOA] = useState(null);
    const [selectedBiaya, setSelectedBiaya] = useState(null);
    const [supplierId, setSupplierId] = useState();
    const [biayaId, setBiayaId] = useState();
    const [nominal, setNominal] = useState();
    const [deskripsi, setDeskripsi] = useState()
    const [COAId, setCOAId] = useState();
    const { id } = useParams();
    const [fakturId, setFakturId] = useState();
    const [mataUangId, setMataUangId] = useState();
    const [dataHeader, setDataHeader] = useState()
    const [canEdit, setCanEdit] = useState()
    const [term, setTerm] = useState()
    const [dataPIB, setDataPIB] = useState([])
    const [totalP, setTotalP] = useState([])
    const [beCust, setbeCust] = useState([])

    useEffect(() => {
        getDataPIB();
    }, [])
    const getDataPIB = async () => {
        await axios.get(`${Url}/goods_import_declarations?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                console.log(getData);
                setCanEdit(getData.can['update-goods_import_declaration'])
                setDataHeader(getData);
                setTerm(getData.term)
                setDataPIB(getData.goods_import_declaration_details)
                setSelectedMataUang(getData.currency_name)
                setLoading(false);

                setbeCust(getData.supplier.business_entity)
                console.log(getData)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        //pageStyle: pageStyle

    })
    const columnProduk = [
        {
            title: 'Nama Produk',
            width: '20%',
            dataIndex: 'nama',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '10%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                    },
                    // children: <div>{formatQuantity(text)}</div>
                    children: <div>{Number(text).toFixed(2).replace('.', ',')}</div>
                };
            }
        },
        // {
        //     title: 'Harga',
        //     dataIndex: 'hrg',
        //     width: '10%',
        //     align: 'center',
        // },
        // {
        //     title: 'Diskon',
        //     dataIndex: 'dsc',
        //     width: '10%',
        //     align: 'center',
        // },
        {
            title: term,
            dataIndex: 'uangasing',
            width: '15%',
            align: 'center',

        },
        {
            title: 'Jumlah (Rp)',
            dataIndex: 'rupiah',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Bea Masuk',
            dataIndex: 'bea',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            align: 'center',

        },

    ];

    //     let totalpajak = 0;
    //   function hitungTotalP()
    //   {
    //     totalpajak = dataHeader.pph + dataHeader.ppn +dataHeader.import_duty
    //     setTotalP(totalpajak);
    //   }

    //   useEffect(() => {
    //     hitungTotalP()
    // }, [])


    const dataProduk =

        [...dataPIB.map((item, i) => ({
            nama: item.product_name,
            qty: item.quantity,
            // hrg: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.price).toFixed(2).replace('.', ',')} key="total" />,
            uangasing: <CurrencyFormat prefix={selectedMataUang} disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.subtotal).toFixed(2).replace('.', ',')} key="total" />,
            rupiah: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.converted_subtotal).toFixed(2).replace('.', ',')} key="total" />,
            bea: <CurrencyFormat prefix='Rp ' disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.import_duty).toFixed(2).replace('.', ',')} key="pay" />,
            total: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.', ',')} key="total" />,
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
                                                    <div className='col-6'> : {dataHeader.chart_of_account_name} </div>
                                                </div>

                                            </div>
                                            <div className='col-6'>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Kepada</label>
                                                    {
                                                        beCust == 'Lainnya' ?
                                                            <div className='col-6'> : {dataHeader.supplier.name}</div> :
                                                            <div className='col-6'> : {beCust} {dataHeader.supplier.name}</div>
                                                    }

                                                </div>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Tanggal</label>
                                                    <div className='col-6'> : {dataHeader.date} </div>
                                                </div>

                                                <div className="d-flex flex-row p-3" style={{float:"right", alignContent:"right"}}>
                                                {dataHeader.status === 'Cancelled'  ?  <Tag color="red">{dataHeader.status}</Tag> : null }
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
                                    <div className="page" style={{ lineHeight: "2", margin: "0" }}>

                                        <div className='mt-2 ps-2 pe-2' >

                                            <table style={{ fontSize: "10px", width: "100%", pageBreakAfter: "auto" }}>
                                                <tr className='border' style={{ height: "40px", pageBreakInside: "avoid", pageBreakAfter: "auto" }}>
                                                    {/* <th width="50px" className='text-center border'>No</th> */}
                                                    <th width="300px" className='text-center border'>Deskripsi</th>
                                                    <th width="80px" className='text-center border'>Jumlah</th>


                                                </tr>
                                                <tbody className="border">
                                                    {
                                                        dataHeader.import_duty == 0 && dataHeader.pph == 0 && dataHeader.ppn == 0 ?
                                                            <tr style={{ height: "50px" }} >
                                                                <td className='border-isi text-center'></td>
                                                                <td className='border-isi text-center'></td>
                                                            </tr> : null
                                                    }
                                                    {dataHeader.import_duty != 0 ?
                                                        <tr style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} >
                                                            {/* <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {i + 1} </td> */}
                                                            <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> Bea Masuk </td>
                                                            <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {
                                                                < CurrencyFormat type='danger' disabled className=' text-center editable-input edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.import_duty).toFixed(2).replace('.', ',')} key="diskon" />
                                                            } </td>
                                                        </tr> :
                                                        null
                                                    }

                                                    {
                                                        dataHeader.pph != 0 ?
                                                            <tr style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} >

                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> Pph 22 </td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {
                                                                    < CurrencyFormat type='danger' disabled className=' text-center editable-input edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.pph).toFixed(2).replace('.', ',')} key="diskon" />
                                                                } </td>
                                                            </tr> :
                                                            null
                                                    }

                                                    {
                                                        dataHeader.ppn != 0 ?
                                                            <tr style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} >

                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> PPN </td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {
                                                                    < CurrencyFormat type='danger' disabled className=' text-center editable-input edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.ppn).toFixed(2).replace('.', ',')} key="diskon" />
                                                                } </td>
                                                            </tr> :
                                                            null
                                                    }
                                                </tbody>
                                            </table>

                                            <div className='d-flex mt-1 ps-1 pe-1' style={{ marginBottom: '2px', height: '65%' }}>


                                                <div style={{ width: '40%', alignItems: 'end', marginLeft: '450px' }}>

                                                    <div className='d-flex' style={{ fontSize: "10px" }}>
                                                        <label className='col-6'><b> Total :</b></label>

                                                        <div width="100%">{
                                                            < CurrencyFormat type='danger' disabled className=' text-center editable-input edit-disabled' style={{ fontWeight: "bold", width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(Number(dataHeader.ppn) + Number(dataHeader.pph) + Number(dataHeader.import_duty)).toFixed(2).replace('.', ',')} key="diskon" />
                                                        }  </div>
                                                        <div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                            {/* <div className="row" style={{ marginLeft:'5px', height:"80px", alignItems:"start", fontSize:'12px'}}> 
            Terbilang: {Terbilang(dataHeader.paid)} { dataHeader.currency_name} */}
                                            {/* <div className="col-2" style={{alignItems:"start", fontSize:"12px"}}>
              <b> Terbilang : {Terbilang(totalP) +  mataUang} </b>
                </div> */}
                                            {/* <div className="col-10">
                {
                    
                } */}
                                            {/* <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                value={Terbilang(totalP) +  mataUang}
                                width={"100%"}
                                height={"20px"}
                                fontSize={"10px"}
                                disabled
                            /> */}

                                            {/* </div> */}
                                            {/* </div> */}


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


            {
                canEdit ?
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Detail PIB"
                        extra={[
                            <Link to={`/pib/edit/${id}`}>
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
                        title="Detail PIB"
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


            <form className="p-3 mb-3 bg-body rounded">
                {/* <div className="text-title text-start mb-4">
                    
                    <h4 className="title fw-bold">Buat PIB</h4>
                </div> */}

                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    disabled
                                    value={dataHeader.date}
                                // onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. PIB</label>
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
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">No B/L</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    disabled
                                    // onChange={(e) => setNoBL(e.target.value)}
                                    value={dataHeader.bill_of_lading_number}
                                    id="inputNama3"
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <input
                                    value={dataHeader.currency_name}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                                {/* <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">

                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.exchange_rate).toFixed(2).replace('.', ',')} key="total" />


                            </div>
                        </div>

                    </div>
                    <div className="col">

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Nama Kapal</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    // onChange={(e) => setNamaKapal(e.target.value)}
                                    defaultValue={dataHeader.ship_name}
                                    disabled
                                    id="inputNama3"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal Tiba</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    // onChange={(e) => setTanggalTiba(e.target.value)}
                                    disabled
                                    value={dataHeader.arrival_date}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Periode Pengiriman </label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    // onChange={(e) => setEstimasiAwal(e.target.value)}
                                    disabled
                                    value={dataHeader.shipment_period_end_date}
                                />
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    // onChange={(e) => setEstimasiAkhir(e.target.value)}
                                    value={dataHeader.shipment_period_start_date}
                                    disabled

                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas/Bank</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    // onChange={(e) => setEstimasiAkhir(e.target.value)}
                                    value={dataHeader.chart_of_account_name}
                                    disabled


                                />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="total" />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled  form-control' thousandSeparator={'.'} decimalSeparator={','} value={sisaAkhir} key="sisa" />
                            </div>
                        </div> */}
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    // onChange={(e) => setReferensi(e.target.value)}
                                    value={dataHeader.reference != undefined ? dataHeader.reference : ''}
                                    id="inputNama3"
                                    disabled
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
                            <h4 className="title fw-normal">Daftar Produk Faktur</h4>
                        </div>
                    </div>
                    {/* <div className="row mt-4  mb-3" >
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Cari Faktur</label>
                        <div className="col-sm-5">

                            <ReactSelect

                                style={{ display: tampilTabel ? "block" : "none" }}
                                className="basic-single"
                                placeholder="Pilih Faktur..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsFaktur}
                                onChange={(e) => handleChangePilih(e)}
                            />
                        </div>

                    </div> */}
                    <Table
                        // rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataProduk}
                        columns={columnProduk}
                        // onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            // let totalAkhir = 0;
                            // let sisaAkhir = 0;
                            // pageData.forEach(({ sisa, pays }) => {
                            //     totalAkhir += Number(pays);
                            //     sisaAkhir += Number(sisa);
                            //     setTotalAkhir(totalAkhir)
                            //     setSisaAkhir(sisaAkhir)
                            // });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={5} className="text-end">Sub Total</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.subtotal).toFixed(2).replace('.', ',')} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={5} className="text-end">Bea Masuk</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.import_duty).toFixed(2).replace('.', ',')} key="pay" />


                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={5} className="text-end">PPh 22</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.pph).toFixed(2).replace('.', ',')} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={5} className="text-end">PPN</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.ppn).toFixed(2).replace('.', ',')} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={5} className="text-end">Total (Rp)</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.total).toFixed(2).replace('.', ',')} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )
                        }}
                    />
                </div>


                {/* <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
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
                <div style={{ clear: 'both' }}></div> */}
            </form>

        </>
    )
}

export default DetailPIB