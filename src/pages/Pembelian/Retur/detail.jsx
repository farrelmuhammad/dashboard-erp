import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Tooltip } from 'antd'
import { DeleteOutlined, PlusOutlined, PrinterOutlined } from '@ant-design/icons'
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
    const [mataUang, setMataUang] = useState('Rp.')

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

                if (getData.purchase_return_details[0].currency) {

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
            width: '13%',
            align: 'center',
            editable: true,
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '20%',
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
            qty: <CurrencyFormat disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.quantity).toFixed(2).replace('.', ',')} key="qty" />,
            stn: item.unit,
            prc:
                <div className='d-flex'>
                    <CurrencyFormat disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} value={Number(item.price).toFixed(2).replace('.', ',')} />
                </div>
            ,
            dsc:
                <>
                    {
                        item.discount_percentage == 0 && item.fixed_discount == 0 ? <div>-</div> :
                            item.discount_percentage != 0 ?
                                <div className='d-flex p-1' style={{ height: "100%" }} >
                                    <CurrencyFormat disabled suffix={'%'} className=' text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.discount_percentage).toFixed(2).replace('.', ',')} key="diskon" />

                                </div> :
                                item.fixed_discount != 0 ?
                                    <div className='d-flex p-1' style={{ height: "100%" }}>
                                        <CurrencyFormat disabled prefix={mataUang} className=' text-center editable-input' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.fixed_discount).toFixed(2).replace('.', ',')} key="diskon" />

                                    </div> : null
                    }

                </>,

            total: < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.', ',')} key="diskon" />,

        }))

        ];



    if (loading) {
        return (
            <div></div>
        )
    }


    return (
        <>

            <div style={{ display: "none", position: "absolute" }} >
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

                                                        <div className=' mt-3 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle: "bold" }}>
                                                            <div className='col-6'>
                                                                <div className="d-flex flex-row">
                                                                    <label className='col-6'>No. Faktur</label>
                                                                    <div className='col-12'> : {dataHeader.purchase_invoice.code}</div>
                                                                </div>
                                                                <div className="d-flex flex-row">
                                                                    <label className='col-6'>Tanggal</label>
                                                                    <div className='col-8'>
                                                                        : {dataHeader.date}</div>
                                                                </div>
                                                                <div className="d-flex flex-row">
                                                                    <label className='col-6'>Kepada Yth.</label>
                                                                    {
                                                                        dataHeader.supplier.business_entity == 'Lainnya' ?
                                                                            <div className='col-8'> : {dataHeader.supplier.name}  </div> :
                                                                            <div className='col-8'> : {dataHeader.supplier.business_entity} {dataHeader.supplier.name}  </div>
                                                                    }

                                                                </div>
                                                            </div>
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
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <br />
                                        <br />
                                        <br />

                                        <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign: "center" }}>
                                            <div className='align-items-center' style={{ fontSize: "14px", textDecoration: "underline", textAlign: "center" }}>RETUR PEMBELIAN</div>
                                            <div className='align-items-center' style={{ fontSize: "10px", textAlign: "center" }}>NO. {dataHeader.code}</div>
                                        </div>

                                    </div>

                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>


                                    <div className="page" style={{ lineHeight: "3" }}>

                                        <div className='mt-2 ps-4 pe-4' >

                                            <div className='align-items-start' style={{ fontSize: "12px" }}>Kami telah mengirim kembali barang - barang sebagai berikut : </div>
                                            <table style={{ fontSize: "10px", width: "100%", pageBreakAfter: "auto" }}>
                                                <tr className='border' style={{ height: "40px", pageBreakInside: "avoid", pageBreakAfter: "auto" }}>
                                                    <th width="50px" className='text-center border'>No</th>
                                                    <th width="300px" className='text-center border'>Nama Produk</th>
                                                    <th width="80px" className='text-center border'>Qty</th>
                                                    <th width="50px" className='text-center border'>Stn</th>

                                                </tr>
                                                <tbody className="border">
                                                    {
                                                        produkRetur.map((item, i) => (
                                                            <tr style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} >
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {i + 1} </td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {item.product_name} </td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {Number(item.quantity).toFixed(2).replace('.', ',')} </td>
                                                                <td style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }} className='border-isi text-center'> {item.unit} </td>
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
                        <tfoot style={{ position: "fixed", marginTop: "500px" }}>
                            <tr>
                                <td>

                                    <div className="page-footer-space"></div>
                                    <div className="page-footer" style={{ position: "fixed", Bottom: "0px", width: "92%", marginRight: "5px", marginLeft: "5px" }} >
                                        <div className='d-flex' style={{ width: "100%", bottom: "0" }}>
                                            <table style={{ fontSize: "10px", width: "100%", height: "100%", marginRight: "5px", marginLeft: "5px" }} >
                                                <tr className='text-center border' style={{ height: "50px", width: "70%" }}>
                                                    <th width="45px" className='border'>Penerima</th>
                                                    <th width="45px" className='border'>Gudang</th>
                                                    <th width="45px" className='border'>Administrasi</th>
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





            <form className="p-3 mb-3 bg-body rounded">
                <div className="row">
                    <div className="col text-title text-start">
                        <PageHeader
                            ghost={false}
                            onBack={() => window.history.back()}
                            title="Detail Retur Pembelian"
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
                    </div>
                    {/* <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} class="btn btn-warning rounded m-1">
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
                                < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.subtotal).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.discount).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.ppn).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-3">
                            <label for="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.total).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                            </div>

                        </div>
                    </div>
                </div>

            </form>
        </>
    )
}

export default DetailReturPembelian