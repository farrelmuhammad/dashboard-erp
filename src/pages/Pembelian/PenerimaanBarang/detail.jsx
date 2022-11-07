import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined, PrinterOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PageHeader, Tooltip} from 'antd';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from "../../Logo.jpeg";
import { Update } from '@mui/icons-material'

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
    const [supplierEntity, setSupplierEntity] = useState()
    const [dataPBBarang, setDataPBBarang] = useState([])
    const [details, setDetails] = useState([]);
    const [brand, setBrand] = useState([]);
    const [noTrans, setNoTrans] = useState([])
    const [dataTS1, setDataTS1] = useState([]);
    const[codePB, setCodePB] = useState("")
    const [custName, setCustName] = useState("")
    const [custAdd, setCustAdd] = useState("")
    useEffect(()=> {
        getDataPOById();
        //nomorTS();

        //console.log(nomorTS());
      //  console.log(brand);
    //   for(let i=0; i< dataTS.length; i++){
    //     console.log(dataTS[i].tally_sheet_code);
    //   }
        
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
                setCodePB(getData.code)

                if(getData.code.includes("TR")){
                    setCustName(getData.customer_name)
                    setCustAdd(getData.customer.business_entity)
                    console.log(custName)
                }
                else{
                   setSupplierName(getData.supplier.name);
                    setSupplierEntity(getData.supplier.business_entity);
                }

              
                //setAddress(getData.address.address);
        
                setLoading(false);
                setBrand(nomorTS());

                console.log(getData)
                //setDataPBBarang(getData.goods_receipt_details);
                //console.log(dataTS);
                
                
              
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }
  
    let arrBrand = []
    function nomorTS()
    {
        for(let i=0; i<dataTS.length; i++)
        {
            arrBrand.push(dataTS[i].tally_sheet_code);

        }
        const hasilBrand = [...new Set(arrBrand)];
       //console.log(hasilBrand)
        return hasilBrand;
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
            width:"10%",
            render: (text) => {
                return Number(text).toFixed(2).replace('.', ',')
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

<div style={{ display: "none",  position: "absolute"}} >
                <div ref={componentRef} className="p-4" style={{width:"100%"}} >

  <table style={{width:"100%"}}>
    <thead>
      <tr>
       
         
          <div className="page-header-space"></div>
          <div className="page-header">
          <div className='row'>
          <div className='d-flex mb-3 float-container' style={{position:"fixed", height:"100px", top:"0", width:"100%"}}>
                
              
              
             
                <div className='col-1' style={{marginTop:"10px"}}><img src={logo} width="60px"></img></div>
                <div className='col-4' style={{marginTop:"10px", marginRight:"100px"}}>  
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

                <div className=' mt-3 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle:"bold"}}>
                      <div className='col-6'>
                          <div className="d-flex flex-row">
                          <label className='col-8'>Tanggal</label>
                              <div className='col-6'> : {dataPenerimaan.date}</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-8'>No. Tally Sheet</label>
                              {/* <div>:</div> */}
                              <div className='col-8'>
                                   : {
                                        nomorTS().map((item) => (
                                            <> {item}</>
                                        ))
                                    }

                                </div>
                              {/* <div className='col-8'> : {dataPenerimaan.code}</div> */}
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-8'>Dari</label>
                              {
                                codePB.includes("TR") ? 
                                custAdd == 'Lainnya' ? 
                                <div className='col-6'> : {custName}  </div> : 
                                <div className='col-12'> : {custAdd} {custName}  </div> :

                                supplierEntity == 'Lainnya' ? 
                                <div className='col-6'> : {supplierName}  </div> : 
                                <div className='col-12'> : {supplierEntity} {supplierName}  </div>
                              }
                              
                          </div>
                      </div>
                  </div>
                </div>
                </div>
               
        </div>
        </div>  
        </div>
        <br/>
<br/>
        <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign:"center"}}>
                      <div className='align-items-center' style={{ fontSize: "16px", textDecoration: "underline", textAlign:"center"}}>PENERIMAAN BARANG</div>
                      <div style={{ fontSize: "10px",marginTop: "-5px" }}>NO. {dataPenerimaan.code}</div>
        </div>
       
      </tr>
    </thead>

    <tbody style={{marginTop:"600px"}}>
      <tr>
        <td>
       
          <div className="page" style={{lineHeight:"3"}}>
           
          <div className='d-flex mt-1 ps-4 pe-4' >

                       {/* <Table style={{fontSize: "10px", width: "100%", pageBreakAfter:"auto", backgroundColor:"white"}}
                        bordered
                        pagination={false}
                        dataSource={dataTS}
                        // expandable={{ expandedRowRender }}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}

                    /> */}

                        <table style={{ fontSize: "10px", width: "100%"}}>
                            <tr className='text-center border' style={{ height: "50px" }}>
                                <th width="50px"  className='border' >No</th>
                                <th width="350px" className='border'>Nama Produk</th>
                                <th width="100px" className='border'>Qty</th>
                                <th width="100px" className='border'>Stn</th>
                            
                            </tr>
                            <tbody className="text-center border">
                                {
                                    dataTS.map((item, i) => (
                                        <tr  >
                                            <td className='border-isi' >{i+1}</td>
                                            <td className='border-isi'>{item.product_name}  
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

    <tfoot style={{position:"fixed", marginTop:"500px"}}>
      <tr>
        <td>
         
        <div className="page-footer-space"></div>
          <div className="page-footer" style={{position:"fixed", Bottom:"0px", width:"95%"}} >
          <div className='d-flex' style={{width:"100%", bottom:"0"}}>
          <table style={{ fontSize: "10px", width: "100%", height:"100%"}} >
                            <tr className='text-center border' style={{ height: "50px", width:"70%" }}>
                                <th width="45px" className='border'>Dibuat Oleh,</th>
                                <th width="45px" className='border'>Disetujui Oleh,</th>
                                <th width="45px" className='border'>Diterima Oleh,</th>
                            </tr>
                           
                                    <tr className='text-center border ' style={{ height: "80px" ,width:"70%"}}>
                                     
                                    <td width="45px" className='border'><b>_________________</b></td>
                                    <td width="45px"className='border'><b>_________________</b></td>
                                    <td width="45px"className='border'><b>_________________</b></td>
                                       
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
                        title="Detail Penerimaan Barang"
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
                    {/* <h3 className="title fw-bold">Buat Penerimaan Barang</h3> */}
                </div>
                {/* <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} class="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div> */}
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
                        {
                            codePB.includes("TR") ? 
                            <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={custName} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                         :
                            <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={supplierName} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                            </div>
                        }
                     
                        {/* <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={address} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div> */}
                    </div>
                    <div className="col">
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