import './form.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import { Table, Tag } from 'antd'
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';
import { useReactToPrint } from 'react-to-print';
import logo from "../../Logo.jpeg";

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
        console.log(credit.length)
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
        [...dataBarang?.map((item, i) => ({
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
                                         <option selected value="nominal">{mataUang}</option>
                                        <CurrencyFormat disabled className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={item.fixed_discount} key="diskon" />

                                       


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
            className="form-control form-control-sm "
            id="colFormLabelSm"
            border="none"
        />
    }

    const convertToRupiah2 = (angka) => {
        // console.log(angka)
        let hasil = mataUang + ' ' + Number(angka).toLocaleString('id')
       
        return <input
            value={hasil}
            readOnly="true"
            className="form-control form-control-sm border-0 "
            id="colFormLabelSm"
            border="none"
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
    [...biaya?.map((item , i) => ({
        code: item.chart_of_account.code,
        desc: item.description,
        total: mataUang + ' ' + Number(item.total).toLocaleString('id')

    }))

    ]

   
    let dataCredit = []

       if (credit.length != 0)
       {
        dataCredit = 
        [...credit?.map((item , i) => ({
            code: item.credit_note_code,
            desc: item.description,
            total: mataUang + ' ' + Number(item.total).toLocaleString('id')
    
        }))
    
        ]
       }


    const componentRef = useRef();
    const pageStyle = `{
      
        @page { 
            size: auto;  margin: 0mm ; } @media print { body { -webkit-print-color-adjust: exact; } }
            
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
                margin: 20mm
              }
              
              @media print {
                 thead {display: table-header-group;} 
                 tfoot {display: table-footer-group;}
                 
                 button {display: none;}
                 
                 body {margin-bottom:20;
                margin-top:5;}

                table { page-break-after:auto }
                tr    { page-break-inside:avoid; page-break-after:auto }
                td    { page-break-inside:avoid; page-break-after:auto }

                .hid {
                    border:0; 
                    border:none;
                }
              }
    
           
            }`;


       const handlePrint = useReactToPrint({
        content: () => componentRef.current,
         copyStyles: true,
       // pageStyle: pageStyle
    })




    if (loading) {
        return (
            <div></div>
        )
    }


    return (
        <>

<div style={{ display: "none" , position:"absolute"}} >
                <div ref={componentRef} className="p-4" >

  <table>
    <thead>
      <tr>
        <td>
         
          <div className="page-header-space"></div>
          <div className="page-header">
          <div className='d-flex' style={{position:"fixed", height:"100px", top:"5"}}>
                      
                      <div><img src={logo} width="60px"></img></div>
                      <div className='ms-2' >
                          <div className='header-cetak'>PT. BUMI MAESTROAYU</div>
                          <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                          <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                          <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                      </div>
                     
                  </div>
        <br/>
        <br/>

    <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold" }}>
                      <div style={{ fontSize: "16px", textDecoration: "underline", textAlign:'center'}}>FAKTUR PEMBELIAN</div>
                      {/* <div style={{ fontSize: "10px", textAlign:'center' }}>NO. FAKTUR {dataHeader.code}</div> */}
                  </div>

                  <div className='mt-4 mb-4 col d-flex justify-content-center ps-4 pe-4'  style={{ fontSize: "12px" }}>
                      <div className='col-6 col-md-4'>
                          <div className="d-flex flex-row">
                              <label className='col-6'>NO. FAKTUR</label>
                              <div className='col-6'> : {dataHeader.code}</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>CATATAN</label>
                              <div className='col-6'> : {dataHeader.notes}</div>
                          </div>
                      </div>
                      <div className='col-6 col-md-4'>
                          <div className="d-flex flex-row">
                              <label className='col-6'>KEPADA YTH.</label>
                              <div className='col-6'> : {dataSupplier.business_entity} {dataSupplier.name} </div>
                          </div>
                      </div>
                  </div>

                    <br/>
                </div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
       
        
          <div className="page" style={{lineHeight:"3"}}>
 
          <div className='mt-4 ps-4 pe-4' >
                       
                        <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto"}}>
                            <tr className='text-center border' style={{ height: "50px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>
                                <th width="300px" className='border' >Nama Barang</th>
                                <th width="80px" className='border'>Qty</th>
                                <th width="50px" className='border'>Stn</th>
                                <th width="100px" className='border'>Harga</th>
                                <th width="100px" className='border'>Diskon</th>
                                <th width="150px" className='border'>Jumlah</th>
                            
                            </tr>
                            <tbody className="border">
                                {
                                    dataBarang.map((item, i) => (
                                        <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.product_name}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.quantity}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.unit}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{mataUang + ' ' + Number(item.price).toLocaleString('id')}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{
                                                        <>
                                                        {
                                                            item.discount_percentage == 0 && item.fixed_discount == 0 ? <div>-</div> :
                                                                item.discount_percentage != 0 ?
                                                                    <div className='d-flex p-1' style={{ height: "100%" }} >
                                                                        <input disabled className=' text-center editable-input edit-disabled'  value={item.discount_percentage.replace('.', ',')} key="diskon" />
                                    
                                                                        <option selected value="persen" >%</option>
                                                                    </div> :
                                                                    item.fixed_discount != 0 ?
                                                                        <div className='d-flex p-1' style={{ height: "100%" }}>
                                                                             <option selected value="nominal">{mataUang}</option>
                                                                            <CurrencyFormat disabled className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={item.fixed_discount} key="diskon" />
                                    
                                                                           
                                    
                                    
                                                                        </div> : null
                                                        }
                                    
                                                    </>
                                            }</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{mataUang + ' ' + Number(item.total).toLocaleString('id')}</td>

                                     </tr>
                                    ))  
                                }
                            </tbody>
                        </table>
                    </div>


                    <div className='mt-4 ps-4 pe-4'> 
                        {/* <div style={{ width: "80%" }}>
                        </div> */}
                        <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-5 ps-3 col-form-label" style={{fontSize:"12px"}}> <br/><b>Biaya Lain </b></label>
                    </div>
                   
                        <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto"}}>
                            <tr className='text-center border' style={{ height: "50px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>
                                <th width="80px" className='border' >NO. AKUN</th>
                                <th width="150px" className='border'>DESKRIPSI</th>
                                <th width="100px" className='border'>JUMLAH</th>
                             
                            
                            </tr>
                            <tbody className="border">
                                {
                                    biaya.map((item, i) => (
                                        <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.chart_of_account.code}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.description}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{mataUang + ' ' + Number(item.total).toLocaleString('id')}</td>
                                            
                                     </tr>
                                    ))  
                                }
                            </tbody>
                        </table>
                    </div> 


                    <div className='mt-4 ps-4 pe-4' style={{ display: impor ? "block" : "none" }}> 
                        {/* <div style={{ width: "80%" }}>
                        </div> */}
                        <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-5 ps-3 col-form-label" style={{fontSize:"12px"}}> <br/><b>Credit Note</b></label>
                    </div>

                    <Table
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={credit?dataCredit:null}
                        pagination={false}
                        columns={columAkun}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                   
                        {/* <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto"}}>
                            <tr className='text-center border' style={{ height: "50px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>
                                <th width="80px" className='border' >NO. AKUN</th>
                                <th width="150px" className='border'>DESKRIPSI</th>
                                <th width="100px" className='border'>JUMLAH</th>
                             
                            
                            </tr>
                            <tbody className="border">
                                {
                                    
                                    credit.map((item, i) => (
                                        <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.credit_note_code}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{item.description}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>{mataUang + ' ' + Number(item.total).toLocaleString('id')}</td>
                                            
                                     </tr>
                                    ))  
                                }
                            </tbody>
                        </table> */}
                    </div> 

                    <div className='d-flex mt-3 ps-4 pe-4' style={{ fontSize: "10px" , borderWidth:"0px"}}>
                        <div style={{width:"65%"}}></div>
                        <div style={{width:"35%"}}>
                            
                        <div className='d-flex mt-5'>
                                <label className='col-6'>Subtotal</label>
                                <div>:</div>
                                <div className='hid ms-3 text-end' width="100%"> {convertToRupiah2(dataHeader.subtotal)} </div>
                            </div>
                            <div>
                                <br/>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'>Diskon</label>
                                <div>:</div>
                                <div className='ms-3 text-end ' width="100%"> {convertToRupiah2(dataHeader.discount)}</div>
                            </div>
                            <div>
                                <br/>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'>Uang Muka</label>
                                <div>:</div>
                                <div className='ms-3 text-end' width="100%">  {convertToRupiah2(dataHeader.down_payment)}</div>
                            </div>
                            <div>
                                <br/>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'>PPN</label>
                                <div>:</div>
                                <div className='ms-3 text-end' width="100%">  {convertToRupiah2(dataHeader.ppn)}</div>
                            </div>
                            <div>
                                <br/>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'><b>Total</b></label>
                                <div>:</div>
                                <div className='ms-3 text-end' width="100%">  {convertToRupiah2(dataHeader.total)}</div>
                            </div>
                        </div>
                    </div>

                    </div>
                    </td>
                </tr>
                </tbody>


    </table>

</div>
</div>


            <form className="p-3 mb-3 bg-body rounded">
                <div className="row">
                    <div className="col text-title text-start">
                        <div className="text-title text-start mb-4">
                        <PageHeader
                                ghost={false}
                                onBack={() => window.history.back()}
                                title="Detail Faktur Pembelian">
                        </PageHeader>
                        </div>
                    </div>
                    <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} className="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div>
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
                        dataSource={credit?dataCredit:null}
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