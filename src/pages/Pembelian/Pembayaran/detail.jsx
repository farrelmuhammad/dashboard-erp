import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import CurrencyFormat from 'react-currency-format';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';
import logo from "../../Logo.jpeg";
import { useReactToPrint } from 'react-to-print';

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
    const [mataUang, setMataUang] = useState('Rp ')

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [dataHeader, setDataHeader] = useState()
    const [dataDetail, setDataDetail] = useState([])

    useEffect(() => {
        getDataPembayaran();
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
                setDataDetail(getData.purchase_invoice_payment_details)
                if(getData.currency_name){
                    setMataUang(getData.currency_name + ' ')

                }
                setStatus(getData.status)
                setLoading(false);
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
            total: <CurrencyFormat prefix={mataUang} type="danger" disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.purchase_invoice_total_payment} key="total" />,
            sisa: <CurrencyFormat prefix={mataUang} type="danger" disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.remains} key="sisa" />,
            pays: <CurrencyFormat prefix={mataUang} type="danger" disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.paid} key="pay" />,
        }))

        ]

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
                              <label className='col-6'>No. Kwitansi</label>
                              <div className='col-6'> : {dataHeader.code}</div>
                          </div>
                          <div className="d-flex flex-row">
                          <label className='col-6'>Tanggal</label>
                              <div className='col-6'> : {dataHeader.date}</div>
                          </div>
                      </div>
                  </div>
                </div>
                </div>

            </div>
        
        <br/>
        <br/>
        <br/>
   
        <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign:"center"}}>
                      <div className='align-items-center' style={{ fontSize: "14px", textDecoration: "underline", textAlign:"center"}}>KWITANSI</div>
                  </div>
                    <br/>
                </div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
       
        
          <div className="page d-flex" style={{lineHeight:"5"}}>
           
          <div className='mt-4 ps-4 pe-4' >


                        <div className='row'>
                            <div className='col'>
                            <div className="row mb-3 d-flex">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Tanggal</label>
                            <input
                                    value={dataHeader.supplier.name}
                                    id="inputNama3"
                                    className="form-control small-input"
                                    type="Nama"
                                    style={{width:"50%"}}
                             />     
                        </div>
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
                <div className='row'>
                <div className="col text-title text-start">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Detail Pembayaran Pembelian">
                    </PageHeader>
                </div>
                <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint}  class="btn btn-warning rounded m-1">
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
                                    value={dataHeader.currency_name}
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
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value=""
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix={mataUang} type="danger" disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.total} key="pay" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix={mataUang} type="danger" disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.remains} key="pay" />
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
                                            <CurrencyFormat prefix={mataUang} type="danger" disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.paid} key="pay" />


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