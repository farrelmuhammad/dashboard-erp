import React, { useEffect, useState, Component } from 'react'
import { useParams } from 'react-router-dom';
import jsCookie from "js-cookie";
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import axios from 'axios';
import Url from '../../../Config';
import { Table, Tag, Tooltip, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import ReactToPrint from "react-to-print";
import logo from "../../Logo.jpeg"
import "./form.css";
import { PageHeader } from 'antd';
import CurrencyFormat from 'react-currency-format';
import { DeleteOutlined, PlusOutlined , PrinterOutlined} from '@ant-design/icons'


export const DetailPesananPembelian = () => {
    // const auth.token = jsCookie.get("auth");
    const [cetak, setCetak] = useState(false)
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [dataPO, setDataPO] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [status, setStatus] = useState([]);
    const [details, setDetails] = useState([]);
    const [taxInclude, setTaxInclude] = useState("");
    const [grup, setGrup] = useState();
    const [total, setTotal] = useState();
    const [namaMataUang, setNamaMataUang] = useState();
    const [loading, setLoading] = useState(true);
    const [namaPIC, setNamaPIC] = useState()
    const [tanggalAwal, setTanggalAwal] = useState();
    const [tanggalAkhir, setTanggalAkhir] = useState();
    const [namaPenerima, setNamaPenerima] = useState();
    const [brand, setBrand] = useState([])

    const convertToRupiahTabel = (angka) => {
    return <>
    {
        namaMataUang === 'Rp' ? 
        < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.' , ',')} key="diskon" />
        :< CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />
        
    }
    </>
    }

    // const convertToRupiah = (angka) => {
    //     return <input
    //         value={
    //             namaMataUang === 'Rp' ? 
    //             < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <div>{value}</div>}  />
    //             :< CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />
    //         }
    //         readOnly="true"
    //         className="form-control form-control-sm"
    //         id="colFormLabelSm"
            
    //     />
    // }

    const convertToRupiah = (angka) => {
        return <>
        {
            namaMataUang === 'Rp' ? 
                  < CurrencyFormat  className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm"  className="form-control form-control-sm"/>}  />
                  :< CurrencyFormat  className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true"  id="colFormLabelSm"  className="form-control form-control-sm"/>} />
        }
        </>
    }

    const convertToRupiah2 = (angka) => {
        return <>
        {
            namaMataUang === 'Rp' ? 
                  < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "50px", fontSize: "10px!important" }}  thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm"  className="form-control form-control-sm"/>}  />
                  :< CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "50px", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true"  id="colFormLabelSm"  className="form-control form-control-sm"/>} />
        }
        </>
    }
    

    

    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => index + 1,
            width: '5%',
            align: 'center',
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
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
            width: '6%',
            align: 'center',
        },
        {
            title: 'Harga',
            dataIndex: 'price',
            width: '15%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: {  borderWidth:"0px"}
                    },
                    children: <div style={{ borderWidth:"0px"}}>{convertToRupiahTabel(text)}</div>
                };
            }
        },
        {
            title: 'Discount',
            dataIndex: 'diskon',
            width: '12%',
            align: 'center',
            // editable: true,
            render: (text, record, index) => {
                return <div className="input-group input-group-sm mb-3">

                    {


                        dataPO[0].purchase_order_details[index].discount_percentage != 0 ?
                            <>
                                <input style={{ width: "30px" }} readOnly type="text" className="form-control" aria-label="Small" defaultValue={dataPO[0].purchase_order_details[index].discount_percentage} aria-describedby="inputGroup-sizing-sm" />
                                <div className="input-group-prepend">
                                    <input style={{ width: "50px" }} readOnly type="text" className="form-control" aria-label="Small" defaultValue="%" aria-describedby="inputGroup-sizing-sm" />
                                </div>
                            </> :
                            <>
                                <div className="input-group-prepend">
                                    <input style={{ width: "50px" }} readOnly type="text" className="form-control" aria-label="Small" defaultValue={namaMataUang} aria-describedby="inputGroup-sizing-sm" />
                                </div>
                                {
                                    namaMataUang === 'Rp'?
                                    convertToRupiah2(dataPO[0].purchase_order_details[index].discount_percentage) :
                                    convertToRupiah2(dataPO[0].purchase_order_details[index].discount_percentage)
                                }
                            </>

                    }

                </div>
            }
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '16%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: {  borderWidth:"0px"}
                    },
                    children: <div style={{ borderWidth:"0px"}}>{convertToRupiahTabel(text)}</div>
                };
                
            }
        },
    ];

    useEffect(() => {
        getDataPOById()
    }, [])

    const [code, setCode] = useState()
    const [date, setDate] = useState()
    const [subTotal, setSubTotal] = useState(0);
    const [diskon, setDiskon] = useState(0);
    useEffect(() => {
        let subTotal = 0;
        let total = 0;
        let totalPerProduk = 0;
        let totalDiskonPersen = 0;
        let totalNominalDiscount = 0;
        let totalDiscount = 0;
        // let grandTotal = 0;
        details.map((item) => {
            subTotal += Number(item.subtotal);
            console.log(subTotal);
        })
        setSubTotal(subTotal);

        details.map((item, i) => {
            total += (item.quantity * item.price);
            totalPerProduk = (item.quantity * item.price);

            totalDiskonPersen = (totalPerProduk * item.discount_percentage / 100);

            // console.log(totalPerProduk);
            // totalNominalDiscount = ;
            totalDiscount += Number(item.fixed_discount) + totalDiskonPersen;
            // grandTotal = total - totalDiscount ;
        })
        setDiskon(totalDiscount);

    }, [dataPO])

    const [tampilPPN, setTampilPPN] = useState(true);
    const [tampilMataUang, setTampilMataUang] = useState(false);
    const [beCust, setBECust] = useState("")
    const [PPN, setPPN] = useState();
    useEffect(() => {
        if (grup == "Impor") {
            setTampilPPN(false);
            setTampilMataUang(true);
        }
        else {
            setTampilPPN(true);
            setTampilMataUang(false);
        }
    }, [grup])

    const getDataPOById = async () => {
        await axios.get(`${Url}/purchase_orders?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data;
                setDataPO(getData);
                setCode(getData[0].code);
                setDate(getData[0].date);
                setStatus(getData[0].status);
                setNamaPIC(getData[0].according_to)
                setTanggalAwal(getData[0].shipment_period_start_date);
                setTanggalAkhir(getData[0].shipment_period_end_date);
                setNamaPenerima(getData[0].purchased_by)
                setDetails(getData[0].purchase_order_details);
                setSupplier(getData[0].supplier.name);
                setTaxInclude(getData[0].tax_included);
                setPPN(getData[0].ppn);
                setTotal(getData[0].total);
                setGrup(getData[0].supplier._group);
                setBECust(getData[0].supplier.business_entity)

                console.log(getData)

                if (!getData[0].currency) {
                    setNamaMataUang("Rp")
                }
                else {
                    setNamaMataUang(getData[0].currency.name);
                }

                let po = getData[0].purchase_order_details;
                let arrBrand = []
                let total = 0;
                for (let i = 0; i < po.length; i++) {

                    arrBrand.push(po[i].product.brand.name);

                }
                const hasilBrand = [...new Set(arrBrand)];
                setBrand(hasilBrand);

                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    // const [componentRef, setComponentRef] = useState()
    const componentRef = useRef();
    const pageStyle = `{
    @page { 
      size: auto;  margin: 0mm ; } @media print { body { -webkit-print-color-adjust: exact; } }
    @media print {
      div.page-footer {
      position: fixed;
      bottom:0mm;
      width: 100%;
      height: 900px;
      font-size: 15px;
      color: #fff;
      /* For testing */
      background: red; 
      opacity: 0.5;
      
      page-break-after: always;
      }
      .page-number:before {
        /* counter-increment: page; */
        content: "Pagina "counter(page);
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
  
    }
    body {
      marginBottom:50px
    }
    }`;

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    //
    if (loading) {
        return (
            <div></div>
        )
    }

    const cetakColumn = [
        {
            title: 'DESCRIPTION OF GOODS',
            dataIndex: 'desc',
        },
        {
            title: 'QTY',
            dataIndex: 'qty'

        },
        {
            title: 'STN',
            dataIndex: 'stn'

        },
        {
            title: 'PRICE',
            dataIndex: 'prc'

        },
        {
            title: 'DISC',
            dataIndex: 'disc'
        },
        {
            title: 'TOTAL',
            dataIndex: 'total'

        },

    ]

    const cetakData =
        [...details.map((item, i) => ({
            desc: item.product_name,
            qty: Number(item.quantity).toFixed(2),
            stn:item.unit,
            disc: item.fixed_discount != null ? <>{
                namaMataUang + ' ' + Number(item.fixed_discount).toFixed(2)
                }</> : <>{item.discount_percentage + '%'}</>,
            prc: namaMataUang + ' ' + Number(item.price).toFixed(2).toLocaleString('id'),
            total: namaMataUang + ' ' + Number(item.total).toFixed(2).toLocaleString('id')
        }))

        ]


    return (
        //
        <>

            <div style={{ display: "none", position: "absolute" }}>
                <div ref={componentRef} className="p-4" >

<table style={{width:"100%"}}>
    <thead>
      <tr>
        <td>
            <div className="page-header-space"></div>
            <div className="page-header">
                    <div className='d-flex'>
                        <div><img src={logo} width="60px"></img></div>
                        <div className='ms-2'>
                            <div className='header-cetak'><b>PT. BUMI MAESTROAYU</b></div>
                            <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                            <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                            <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                        </div>
                    </div>

                    <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold" }}>
                        <div style={{ fontSize: "16px", textDecoration: "underline" }}>PURCHASE ORDER</div>
                        <div style={{ fontSize: "10px", marginTop: "-5px" }}>NO. {code}</div>
                    </div>

                    <div className='mt-4 mb-4 col d-flex justify-content-center ps-4 pe-4' style={{ fontSize: "12px" }}>
                        <div className='col-6'>
                            <div className="d-flex flex-row">
                                <label className='col-6'>ORDER DATE</label>
                                <div className='col-6'> : {date}</div>
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-6'>TO</label>
                                {
                                    beCust == 'Lainnya' ? 
                                    <div className='col-6'> : {supplier}</div> : 
                                    <div className='col-6'> : {beCust} {supplier}</div>
                                }
                               
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-6'>ACCORDING TO</label>
                                <div className='col-6'> : {namaPIC} </div>
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-6'>CURRENCY</label>
                                <div className='col-6'> : {namaMataUang}</div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="d-flex flex-row">
                                <label className='col-8'>DATE OF CONFIRMATION</label>
                                <div className='col-4'> : {date}</div>
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-8'>PURCHASED BY</label>
                                <div className='col-4'> : {namaPenerima} </div>
                            </div>
                        </div>
                    </div>
            </div>
            </td></tr></thead>

            <tbody>
                <tr>
                    <td>
                    <div className="page" style={{lineHeight:"3"}}>
                    <div className='mt-4 ps-4 pe-4 ' >
                        {/* <Table pagination={false} columns={cetakColumn} dataSource={cetakData} /> */}
                        <table style={{ fontSize: "10px", width: "100%" }}>
                            <tr className='text-center border' style={{ height: "50px" }}>
                                <th width="50px" className='border'>NO</th>
                                <th width="350px" className='border'>DESCRIPTION OF GOODS</th>
                                <th width="100px" className='border'>QTY</th>
                                <th width="100px" className='border'>STN</th>
                                <th width="160px" className='border'>PRICE</th>
                                <th width="180px" className='border'>DISC</th>
                                <th width="180px" className='border'>TOTAL</th>
                            </tr>
                            <tbody className="border">
                                {
                                    details.map((item, i) => (
                                        <tr >
                                            <td className='border-isi text-center'>{i + 1}</td>
                                            <td className='border-isi text-start'>{item.product_name}</td>
                                            <td className='border-isi text-center'>{Number(item.quantity).toFixed(2)}</td>
                                            <td className='border-isi text-center'>{item.unit}</td>
                                            <td className='border-isi text-center'>{
                                                 namaMataUang === 'Rp' ?
                                                 < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.price).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                                 < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.price).toLocaleString('id')} key="diskon" />
                                            }</td>
                                            {item.fixed_discount != 0 && item.discount_percentage == 0 ? <td className='text-center border-isi'>{
                                             namaMataUang === 'Rp' ?
                                             < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.fixed_discount).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                             < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.fixed_discount).toLocaleString('id')} key="diskon" />                        
                                            }</td> :
                                                item.fixed_discount == 0 && item.discount_percentage != 0 ? <td className='text-center border-isi'>{item.discount_percentage + '%'}</td> : <td className='text-center border-isi'>-</td>
                                            }

                                            <td className='border-isi text-center'>
                                                {
                                                     namaMataUang === 'Rp' ?
                                                     < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                                     < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toLocaleString('id')} key="diskon" />
                                                }</td>

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
              
         <tfoot>
           <tr>
            <td>
                    <div className="page-footer-space"></div>
                    <div className="page-footer" >

                    <div className='d-flex flex-column align-contents-end ps-4 pe-4' style={{ width: "200px", fontSize: "12px", marginLeft: "auto", marginTop: "200px" }}>
                            {/* <div className='text-center' >_________________</div>
                            <div className='text-center' >{namaPenerima}</div> */}
                        </div>
                     
            <div className='d-flex flex-row mt-8 ps-4 pe-4' style={{ fontSize: "10px" }}>
                        <div style={{ width: "65%" }}>
                            <div className='mb-2 mt-4' ><b>Condition of Purchase</b></div>
                            <div className='d-flex'>
                                <label style={{ width: "150px" }}>Brand</label>
                                <div >:
                                    {
                                        brand.map((item, i) => (
                                            <> {item}</>
                                        ))
                                    }

                                </div>
                            </div>
                            <div className='d-flex'>
                                <label style={{ width: "150px" }}>Shipment Period</label>

                                {
                                    tanggalAkhir == tanggalAwal ?
                                        <div>: {tanggalAkhir}</div> :
                                        <div>: {tanggalAwal} TO {tanggalAkhir}</div>
                                }
                            </div>
                        </div>
                        <div style={{ width: "35%" }}>
                            <div className='d-flex mt-5'>
                                <label className='col-6'>Sub Total</label>
                                <div>:</div>
                                <div className='ms-3 text-start' width="100%">  {
                                  namaMataUang === 'Rp' ?
                                  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toLocaleString('id')} key="diskon" />
                               }
                               </div>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'>Discount</label>
                                <div>:</div>
                                <div className='ms-3 text-start' width="100%">  {
                                 namaMataUang === 'Rp' ? 
                                 < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(diskon).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                 < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(diskon).toLocaleString('id')} key="diskon" />
                            }</div>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'>VAT</label>
                                <div>:</div>
                                <div className='ms-3 text-start' width="100%">  {
                                  namaMataUang === 'Rp' ? 
                                  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(PPN).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(PPN).toLocaleString('id')} key="diskon" />
                            }
                            </div>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'><b>Total</b></label>
                                <div>:</div>
                                <div className='ms-3 text-start' width="100%">  {
                                  namaMataUang === 'Rp' ?    
                                  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(total).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(total).toLocaleString('id')} key="diskon" />
                                }</div>
                            </div>

                        </div>
                    </div>

                    <div className='d-flex flex-column align-contents-end ps-4 pe-4' style={{ width: "300px", fontSize: "12px", marginLeft: "auto", marginTop: "100px" }}>
                            <div className='text-center' >_________________</div>
                            <div className='text-center' >{namaPenerima}</div>
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
                        <div className="text-title text-start mb-4">
                            <PageHeader
                                ghost={false}
                                onBack={() => window.history.back()}
                                title="Detail Pesanan"
                                extra={ status == 'Cancelled' ? null : [
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
                            {/* <h3 className="title fw-bold">Detail Pesanan</h3> */}
                        </div>
                    </div>
                    {/* {
                        status == 'Cancelled' ? null :
                            <div className="col button-add text-end me-3">
                                <button type="button" onClick={handlePrint} className="btn btn-warning rounded m-1">
                                    Cetak
                                </button>
                            </div>
                    } */}

                </div>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                {dataPO?.map((d) => (
                                    <input
                                        disabled="true"
                                        id="startDate"
                                        className="form-control"
                                        type="date"
                                        value={d.date}
                                    />

                                ))}

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                {dataPO?.map((d) => (
                                    <input
                                        disabled="true"
                                        type="text"
                                        className="form-control"
                                        id="inputNama3"
                                        value={d.code}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Grup</label>
                            <div className="col-sm-7">
                                <input
                                    disabled="true"
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={grup}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input
                                    disabled="true"
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={supplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">According To</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    value={namaPIC}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Purchased By</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    value={namaPenerima}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                {dataPO?.map((d) => (
                                    <input
                                        disabled="true"
                                        type="text"
                                        className="form-control"
                                        id="inputNama3"
                                        value={d.reference}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: tampilMataUang ? "flex" : "none" }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                {dataPO?.map((d) => (
                                    d.supplier._group == "Impor" ?
                                        <input
                                            disabled="true"
                                            id="startDate"
                                            className="form-control"
                                            type="text"
                                            value={namaMataUang}
                                        /> : null
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="inputPassword3" className="col-sm-6 col-form-label">Estimasi Diterima</label>
                        <div className="row mb-3">
                            <div className="d-flex col-sm-10">
                                <input
                                    id="startDate"
                                    className=" form-control"
                                    type="date"
                                    value={tanggalAwal}
                                    disabled
                                />
                                <div className='ms-2 me-2' style={{ paddingTop: "13px!important" }}>s.d</div>
                                <input
                                    id="startDate"
                                    className=" form-control"
                                    type="date"
                                    value={tanggalAkhir}
                                    disabled
                                />
                            </div>
                        </div>

                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                {dataPO?.map((d) => (
                                    <textarea
                                        disabled="true"
                                        className="form-control"
                                        id="form4Example3"
                                        rows="4"
                                        value={d.notes}
                                    />
                                ))}
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
                            <h4 className="title fw-normal">Daftar Produk</h4>
                        </div>
                    </div>
                    {/* <ProdukPesananTable /> */}
                    <Table
                        columns={columns}
                        dataSource={details}
                        pagination={false}
                        scroll={{
                            y: 200,
                        }}
                        size="middle"
                    />
                </div>
                <div className="row p-0">
                    <div className="col ms-5"></div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6 form-control-sm" style={{borderWidth:"1px"}} >
                                {convertToRupiah(subTotal)}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                {convertToRupiah(diskon)}
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: tampilPPN ? "flex" : "none" }}>
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                {convertToRupiah(PPN)}
                            </div>

                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                {/* <input
                                    value={namaMataUang + ' ' + Number(total).toLocaleString('id')}
                                    readOnly="true"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                /> */}
                                {convertToRupiah(total)}
                            </div>

                            {/* {dataPO.map(d => (
                                
                                <input
                                    disabled="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                    value={d.total}
                                />
                            ))}
                            </div> */}
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default DetailPesananPembelian