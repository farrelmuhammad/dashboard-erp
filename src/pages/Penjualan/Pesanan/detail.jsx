import React, { useEffect, useState } from 'react'
import { useParams , Link} from 'react-router-dom';
import jsCookie from "js-cookie";
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import { BarsOutlined, DeleteOutlined, EditOutlined, LoadingOutlined, MinusOutlined, PlusOutlined, PrinterOutlined } from '@ant-design/icons'
import axios from 'axios';
import Url from '../../../Config';
import { Table, Tag, Tooltip, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from "../../Logo.jpeg";
import { PageHeader } from 'antd';
import CurrencyFormat from 'react-currency-format';

export const DetailPesanan = () => {
    // const token = jsCookie.get("auth");
    const { id } = useParams();
    const [dataSO, setDataSO] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [status, setStatus] = useState([]);
    const [details, setDetails] = useState([]);
    const [taxInclude, setTaxInclude] = useState("");
    const [namaMataUang, setNamaMataUang] = useState();
    const [BECust, setBECust] = useState("");
    const auth = useSelector(state => state.auth);

    const convertToRupiah = (angka) => {
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
                    : < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" className="form-control form-control-sm" />} />
            }
        </>
    }

    const convertToRupiahTabel = (angka) => {
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
                    : < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />

            }
        </>
    }

    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_alias_name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '8%',
            align: 'center',
            render(text, record) {
                return <div>{Number(text).toFixed(2).replace('.',',')}</div>
            }
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            width: '5%',
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
                        style: { borderWidth: "0px", textAlign: 'center' }
                    },
                    children: <div className='text-center' style={{ borderWidth: "0px" }}>{convertToRupiahTabel(text)}</div>
                };
            }
        },
        {
            title: 'Disc(%)',
            dataIndex: 'discount_percentage',
            width: '8%',
            align: 'center',
        },
        {
            title: 'Disc(Rp)',
            dataIndex: 'fixed_discount',
            width: '8%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: { borderWidth: "0px", textAlign: 'center' }
                    },
                    children: <div style={{ borderWidth: "0px" }}>< CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(text).toFixed(2).replace('.', ',')} key="diskon" /></div>
                };
            }
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '8%',
            align: 'center',
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '17%',
            align: 'center',
            render(text, record) {
                return {
                    props: {
                        style: { borderWidth: "0px", textAlign: 'center' }
                    },
                    children: <div className='text-center' style={{ borderWidth: "0px", textAlign: 'center' }}>{convertToRupiahTabel(text)}</div>
                };
            }
        },
    ];

    useEffect(() => {
        getDataSOById()
    }, [])

    const [code, setCode] = useState()
    const [date, setDate] = useState()
    const [subTotal, setSubTotal] = useState(0);
    const [diskon, setDiskon] = useState(0);

    const getDataSOById = async () => {
        await axios.get(`${Url}/sales_orders?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data;
                setDataSO(getData);
                setCode(getData[0].code);
                setDate(getData[0].date);
                setStatus(res.data.data[0].status);
                setDetails(res.data.data[0].sales_order_details);
                setCustomer(res.data.data[0].customer.name);
                setTaxInclude(res.data.data[0].tax_included)
                setBECust(res.data.data[0].customer.business_entity);
                if (!getData[0].currency) {
                    setNamaMataUang("Rp")
                }
                else {
                    setNamaMataUang(getData[0].currency.name);
                }
                console.log(res.data.data[0])
                // console.log(res.data.data.map(d => d.sales_order_details));
                // console.log(getData.map(d => d.sales_order_details));
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const componentRef = useRef();
    const pageStyle = `{
    @page { 
      size: auto;  margin: 0mm ; } @media print { body { -webkit-print-color-adjust: exact; } }
    @media print {
      div.page-footer {
      position: fixed;
      bottom:0mm;
      width: 100%;
      height: 50px;
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
  
  
    }
    body {
      marginBottom:50px
    }
}`;
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        //  pageStyle: {pageStyle}
    })
    // if (loading) {
    //     return (
    //         <div></div>
    //     )
    // }

    const cetakColumn = [
        {
            title: 'Nama Produk',
            dataIndex: 'name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
        },
        {
            title: 'Diskon',
            dataIndex: 'discount',
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
        },
        {
            title: 'Harga',
            dataIndex: 'price',
        },
        {
            title: 'Total',
            dataIndex: 'total',
        },

    ]

    const cetakData =
        [...details.map((item, i) => ({
            name: item.product_alias_name,
            quantity: Number(item.quantity).toFixed(2).replace('.',','),
            discount: item.fixed_discount != 0 ? <>{'Rp ' + Number(Math.round(item.fixed_discount + 'e2') + 'e-2').toLocaleString('id')}</> : <>{item.discount_percentage + '%'}</>,
            ppn: item.ppn + '%',
            price: 'Rp ' + Number(Math.round(item.price + 'e2') + 'e-2').toLocaleString('id'),
            total: 'Rp ' + Number(Math.round(item.total + 'e2') + 'e-2').toLocaleString('id')
        }))

        ]

    return (
        <>

            <div style={{ display: "none", position: "absolute" }}>
                <div ref={componentRef} className="p-4" >

                    <table style={{ width: "100%" }}>
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
                                            <div style={{ fontSize: "16px", textDecoration: "underline" }}>PESANAN PENJUALAN</div>
                                            <div style={{ fontSize: "10px", marginTop: "-5px" }}>NO. {code}</div>
                                        </div>

                                        <div className='mt-4 mb-4 col d-flex justify-content-start ps-4 pe-4' style={{ fontSize: "12px" }}>
                                            <div className='col-6'>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Tanggal</label>
                                                    <div className='col-6'> : {date}</div>
                                                </div>
                                                <div className="d-flex flex-row">
                                                    <label className='col-6'>Kepada Yth.</label>
                                                    {
                                                        BECust === 'Lainnya'? <div className='col-6'> : {customer}</div> : 
                                                        <div className='col-6'> : {BECust} {customer} </div>
                                                    }
                                                    {/* <div className='col-6'> : {customer}</div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td></tr></thead>

                        <tbody>
                            <tr>
                                <td>
                                    <div className="page" style={{ lineHeight: "3" }}>
                                        <div className='mt-2 ps-4 pe-4 ' >

                                            <table style={{ fontSize: "10px", width: "100%" }}>
                                                <tr className='text-center border' style={{ height: "50px" }}>

                                                    <th width="350px" className='border'>Nama Produk</th>
                                                    <th width="100px" className='border'>Qty</th>
                                                    <th width="100px" className='border'>Stn</th>
                                                    <th width="200px" className='border'>Harga</th>
                                                    <th width="180px" className='border'>Diskon</th>
                                                    <th width="130px" className='border'>PPN</th>
                                                    
                                                    <th width="210px" className='border'>Total</th>
                                                </tr>
                                                <tbody className="border">
                                                    {
                                                        details.map((item, i) => (
                                                            <tr >

                                                                <td className='border-isi text-start'>{item.product_alias_name}</td>
                                                                <td className='border-isi text-center'>{Number(item.quantity).toFixed(2).replace('.',',')}</td>
                                                                <td className='border-isi text-center'>{item.unit}</td>
                                                                <td className='border-isi text-center'>{
                                                                    namaMataUang === 'Rp' ?
                                                                        < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.price).toFixed(2).replace('.', ',')} key="diskon" /> :
                                                                        < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.price).toLocaleString('id')} key="diskon" />
                                                                }</td>
                                                                <td className='border-isi text-center'>{
                                                                    namaMataUang === 'Rp' ?
                                                                        < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.fixed_discount).toFixed(2).replace('.', ',')} key="diskon" /> :
                                                                        < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.fixed_discount).toLocaleString('id')} key="diskon" />
                                                                }</td>

                                                                <td className='border-isi text-center'>{item.ppn} %


                                                                </td>

                                                             

                                                                <td className='border-isi text-center'>
                                                                    {
                                                                        namaMataUang === 'Rp' ?
                                                                            < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.', ',')} key="diskon" /> :
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
                                        {/* 
                    <div className='d-flex flex-column align-contents-end ps-4 pe-4' style={{ width: "200px", fontSize: "12px", marginLeft: "auto", marginTop: "200px" }}>
                            
                        </div> */}

                                        <div className='d-flex flex-row mt-2 ps-2 pe-2' style={{ fontSize: "10px" }}>
                                            <div style={{ width: "65%" }}>
                                                {/* <div className='mb-2 mt-4' ><b>Condition of Purchase</b></div>
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
                            </div> */}
                                            </div>
                                            <div className='justify-content-left ' style={{ width: "35%" }}>
                                                <div className='d-flex mt-3 justify-content-left  '>
                                                    <label className='col-6'>Sub Total</label>
                                                    {/* <div>:</div> */}
                                                    <div width="100%" className="text-left" > : {
                                                        //   namaMataUang === 'Rp' ?
                                                        //   < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                                        //   < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toLocaleString('id')} key="diskon" />
                                                        dataSO.map(d => (
                                                            convertToRupiahTabel(d.subtotal)

                                                        ))
                                                    }
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <label className='col-6'>Discount</label>
                                                    {/* <div>:</div> */}
                                                    <div width="100%" className="text-left" > : {
                                                        dataSO.map(d => (
                                                            convertToRupiahTabel(d.discount)

                                                        ))
                                                        //  namaMataUang === 'Rp' ? 
                                                        //  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(diskon).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                                        //  < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(diskon).toLocaleString('id')} key="diskon" />
                                                    }</div>
                                                </div>
                                                <div className='d-flex'>
                                                    <label className='col-6'>PPN</label>
                                                    {/* <div>:</div> */}
                                                    <div width="100%" className="text-left" > : {
                                                        dataSO.map(d => (
                                                            convertToRupiahTabel(d.ppn)

                                                        ))
                                                        //   namaMataUang === 'Rp' ? 
                                                        //   < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(PPN).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                                        //   < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(PPN).toLocaleString('id')} key="diskon" />
                                                    }
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <label className='col-6'><b>Total</b></label>
                                                    {/* <div>:</div> */}
                                                    <div width="100%" className="text-left" > : {
                                                        dataSO.map(d => (
                                                            convertToRupiahTabel(d.total)
                                                        ))
                                                        //   namaMataUang === 'Rp' ?    
                                                        //   < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(total).toFixed(2).replace('.' , ',')} key="diskon" /> :
                                                        //   < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(total).toLocaleString('id')} key="diskon" />
                                                    }</div>
                                                </div>

                                            </div>
                                        </div>

                                        {/* <div className='d-flex flex-column align-contents-end ps-4 pe-4' style={{ width: "300px", fontSize: "12px", marginLeft: "auto", marginTop: "100px" }}>
                            <div className='text-center' >_________________</div>
                            <div className='text-center' >{namaPenerima}</div>
                        </div> */}



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
                                extra={[
                                    <Tooltip title="Edit" placement="bottom">
                                        <Link to={`/pesanan/edit/${id}`}>
                                            <Button
                                                type="primary"
                                                icon={<EditOutlined />}
                                            />
                                        </Link>
                                    </Tooltip>,
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
                    {/* <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} className="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div> */}
                </div>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                {dataSO?.map((d) => (
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
                                {dataSO?.map((d) => (
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <select disabled="true" id="PelangganSelect" className="form-select">
                                    <option>{customer}</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                {dataSO?.map((d) => (
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
                    </div>
                    <div className="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                {dataSO?.map((d) => (
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
                            <h4 className="title fw-normal">Cari Produk</h4>
                        </div>
                        {/* <div className="col-sm-3 me-5">
                            <div className="input-group">
                                <input disabled="true" type="text" className="form-control" id="inlineFormInputGroupUsername" placeholder="Type..." />
                                <div className="input-group-text">Search</div>
                            </div>
                        </div> */}
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
                    <div className="col ms-5">
                        <div className="form-check">
                            {taxInclude === true ? <input
                                disabled="true"
                                className="form-check-input"
                                type="checkbox"
                                id="flexCheckDefault"
                                value="1"
                                checked
                            /> : <input
                                disabled="true"
                                className="form-check-input"
                                type="checkbox"
                                value="0"
                                id="flexCheckDefault"
                            />}
                            {/* <input
                                disabled="true"
                                className="form-check-input"
                                type="checkbox"
                                value="1"
                                id="flexCheckDefault"
                                checked={taxInclude}
                            /> */}
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk PPN
                            </label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                                {dataSO.map(d => (
                                    convertToRupiah(d.subtotal)
                                    // <input
                                    //     disabled="true"
                                    //     type="number"
                                    //     className="form-control form-control-sm"
                                    //     id="colFormLabelSm"
                                    //     value={d.total}
                                    // />
                                ))}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                {dataSO.map(d => (
                                    convertToRupiah(d.discount)
                                    // <input
                                    //     disabled="true"
                                    //     type="number"
                                    //     className="form-control form-control-sm"
                                    //     id="colFormLabelSm"
                                    //     value={d.discount}
                                    // />
                                ))}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                {dataSO.map(d => (
                                    convertToRupiah(d.ppn)
                                    // <input
                                    //     disabled="true"
                                    //     type="number"
                                    //     className="form-control form-control-sm"
                                    //     id="colFormLabelSm"
                                    //     value={d.ppn}
                                    // />
                                ))}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                {dataSO.map(d => (
                                    convertToRupiah(d.total)
                                    // <input
                                    //     disabled="true"
                                    //     type="number"
                                    //     className="form-control form-control-sm"
                                    //     id="colFormLabelSm"
                                    //     value={d.total}
                                    // />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default DetailPesanan