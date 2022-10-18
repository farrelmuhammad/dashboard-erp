import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { PageHeader } from 'antd';
import logo from "../../Logo.jpeg";
import { useReactToPrint } from 'react-to-print';

const DetailReturPembelian = () => {
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

    const { id } = useParams();

    //state return data from database

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [loading, setLoading] = useState(true)
    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState(0);
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [modal2Visible, setModal2Visible] = useState(false);
    const [term, setTerm] = useState();
    const [muatan, setMuatan] = useState();
    const [ctn, setCtn] = useState();
    const [alamat, setAlamat] = useState();
    const [kontainer, setKontainer] = useState();
    const [referensi, setReferensi] = useState()

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedFaktur, setSelectedFaktur] = useState(null);
    const [fakturId, setFakturId] = useState();
    const [supplierId, setSupplierId] = useState()
    const [tampilPilihProduk, setTampilPilihProduk] = useState(false)
    const [tampilPilihFaktur, setTampilPilihFaktur] = useState(false)
    const [dataFaktur, setDataFaktur] = useState([])
    const [tampilTabel, setTampilTabel] = useState(true)
    const [dataHeader, setDataHeader] = useState([])
    const [getStatus, setGetStatus] = useState()
    const [produkRetur, setProdukRetur] = useState([])
    const [mataUang, setMataUang] = useState('Rp ')

    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }


    useEffect(() => {
        getDataRetur();
    }, [])
    const getDataRetur = async () => {
        await axios.get(`${Url}/purchase_returns?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data.data[0]
                setDataHeader(getData)
                setGetStatus(getData.status)
                setProdukRetur(getData.purchase_return_details)

                if(getData.purchase_return_details[0].currency){

                    setMataUang(getData.purchase_return_details[0].currency)
                }
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

    const columnProduk = [
        {
            title: 'Nama Produk',
            dataIndex: 'name_product',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '10%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Stn',
            dataIndex: 'stn',
            width: '5%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Harga',
            dataIndex: 'prc',
            width: '15%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Discount',
            dataIndex: 'dsc',
            width: '20%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
       

    ];

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


    // const dataProduk = []
    const dataProduk =
        [...produkRetur.map((item, i) => ({
            name_product: item.product_name,
            qty: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.quantity.replace('.' , ',')} key="qty" />,
            stn: item.unit,
            prc:
                <div className='d-flex'>
                    <CurrencyFormat className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} value={item.price} />
                </div>
            ,
            dsc:
                <>
                    {
                        item.discount_percentage == 0 && item.fixed_discount == 0 ? <div>-</div> :
                            item.discount_percentage != 0 ?
                                <div className='d-flex p-1' style={{ height: "100%" }} >
                                    <input disabled className=' text-center editable-input edit-disabled' value={item.discount_percentage.replace('.', ',')} key="diskon" />

                                    <option selected value="persen" > %</option>
                                </div> :
                                item.fixed_discount != 0 ?
                                    <div className='d-flex p-1' style={{ height: "100%" }}>
                                        <CurrencyFormat disabled className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={item.fixed_discount} key="diskon" />

                                        <option selected value="nominal">{mataUang + ' '} </option>


                                    </div> : null
                    }

                </>,

            total: < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={item.total} key="diskon" />,
          
        }))

        ];



if (loading) {
    return (
        <div></div>
    )
}


return (
    <>

<div style={{ display: "none"}} >
                <div ref={componentRef} className="p-4" style={{width:"100%"}} >

  <table style={{width:"100%"}}>
    <thead>
      <tr>
        <td>
         
          <div className="page-header-space"></div>
          <div className="page-header">
            <div className='row'>
           

                <div className='d-flex mb-3 float-container' style={{position:"fixed", height:"100px", top:"0"}}>
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

                <div className=' mt-4 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle:"bold"}}>
                      <div className='col-md-4'>
                        <div className="d-flex flex-row">
                              <label className='col-6'>No. Penerimaan</label>
                              <div className='col-6'> : {dataHeader.code}</div>
                          </div>
                          <div className="d-flex flex-row">
                          <label className='col-6'>Tanggal</label>
                              <div className='col-6'> : {dataHeader.date}</div>
                          </div>
                         
                          <div className="d-flex flex-row">
                              <label className='col-6'>Kepada Yth. </label>
                              <div className='col-6'> : {dataHeader.supplier.name} , {dataHeader.supplier.business_entity} </div>
                          </div>
                      </div>
                  </div>
                </div>
                </div>

            </div>
        
        <br/>
        <br/>
        <br/>
    {/* <div style={{clear:"both"}}></div> */}
        <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign:"center"}}>
                      <div className='align-items-center' style={{ fontSize: "14px", textDecoration: "underline", textAlign:"center"}}>RETUR PEMBELIAN</div>
                  </div>
                    <br/>
                </div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
       
        
          <div className="page" style={{lineHeight:"5"}}>
           
          <div className='mt-4 ps-4 pe-4' >

                       {/* <Table style={{fontSize: "10px", width: "100%", pageBreakAfter:"auto", backgroundColor:"white"}}
                        bordered
                        pagination={false}
                        dataSource={dataTS}
                        // expandable={{ expandedRowRender }}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}

                    /> */}

                        <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto"}}>
                            <tr className='text-center border' style={{ height: "50px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>     
                                <th width="300px" className='border'>Nama Produk</th>
                                <th width="100px" className='border'>Qty</th>
                            
                            </tr>
                            <tbody className="border">
                                {
                                    produkRetur.map((item, i) => (
                                        <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-start'> {item.product_name} </td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {item.quantity} {item.unit} </td>
                                        </tr>
                                        ))
                                    
                                }
                            </tbody>


                        </table>
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
                        <PageHeader
                            ghost={false}
                            onBack={() => window.history.back()}
                            title="Detail Retur Pembelian">
                        </PageHeader>
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
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Retur</label>
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
                    <div className="row mb-3" >
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Faktur</label>
                        <div className="col-sm-7">
                            <input
                                value={dataHeader.purchase_invoice.code}
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                disabled

                            />

                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                        <div className="col-sm-7">
                            <input
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                disabled
                                value={dataHeader.reference}
                            />
                        </div>
                    </div>

                </div>

                {/* kalau impor  */}
                <div className="col">
                    <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Muatan</label>
                        <div className="col-sm-7">
                            <select
                                onChange={(e) => setMuatan(e.target.value)}
                                id="grupSelect"
                                className="form-select"
                            >
                                <option>Pilih Muatan</option>
                                <option value="20ft">
                                    20 ft
                                </option>
                                <option value="40ft">
                                    40 ft
                                </option>

                            </select>
                        </div>
                    </div>
                    <div className="row mb-3" style={{ display: impor ? "flex" : "none" }}>
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label" >Ctn</label>
                        <div className="col-sm-7">
                            <input
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                onChange={(e) => setCtn(e.target.value)}
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
                                disabled
                                value={dataHeader.notes}
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
                        <h4 className="title fw-normal">Daftar Produk</h4>
                    </div>
                </div>
                <Table
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={dataProduk}
                    columns={columnProduk}
                    onChange={(e) => setProduct(e.target.value)}
                />

            </div>

            <div className="d-flex justify-content-end mt-4 ">
                <div className="col-6">
                    <div className="d-flex justify-content-end mb-3">
                        <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Subtotal</label>
                        <div className="col-sm-6">

                            < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.subtotal} key="diskon" />
                        </div>

                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                        <div className="col-sm-6">

                            < CurrencyFormat disabled className='form-control form-control-sm edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.discount} key="diskon" />
                        </div>

                    </div>

                    <div className="d-flex justify-content-end mb-3">
                        <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>

                        <div className="col-sm-6">
                            < CurrencyFormat disabled className='form-control form-control-sm edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.ppn} key="diskon" />


                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-3">
                        <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                        <div className="col-sm-6">

                            < CurrencyFormat disabled className='form-control form-control-sm  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.total} key="diskon" />
                        </div>

                    </div>
                </div>
            </div>

        </form>
    </>
)
}

export default DetailReturPembelian