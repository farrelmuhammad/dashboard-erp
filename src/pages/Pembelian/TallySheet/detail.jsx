
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { BarsOutlined, DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined, PrinterOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactDataSheet from 'react-datasheet';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from "../../Logo.jpeg";
import { PageHeader , Tooltip} from 'antd';
import { width } from '@mui/system'

export const DetailTallySheet = () => {

    const [code, setCode] = useState();
    const [cetak, setCetak] = useState(false);
    const { id } = useParams();
    const auth = useSelector(state => state.auth);
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getTallySheet, setGetTallySheet] = useState([])
    const [loadingTable, setLoadingTable] = useState(false);
    const [delIndex, setDelIndex] = useState([]);
    const [totalTallySheet, setTotalTallySheet] = useState([]);
    const [data, setData] = useState([]);
    const [dataSheet, setDataSheet] = useState([]);
    const [loadingSpreedSheet, setLoadingSpreadSheet] = useState(false);
    const [totalBox, setTotalBox] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [sumber, setSumber] = useState('')
    const [indexPO, setIndexPO] = useState(0);
    const [kuantitasBox, setKuantitasBox] = useState([]);
    const [idxPesanan, setIdxPesanan] = useState(0);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [modal2Visible2, setModal2Visible2] = useState(false);
    const [detailTallySheet, setDetailTallySheet] = useState([]);

    const valueRenderer = (cell) => cell.value;
    const onContextMenu = (e, cell, i, j) =>
        cell.readOnly ? e.preventDefault() : null;


    useEffect(() => {
        axios.get(`${Url}/tally_sheet_ins?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                const tallySheetDetail = getData.tally_sheet_details;
                setGetTallySheet(getData)
                setDetailTallySheet(getData.tally_sheet_details);

                let arrData = [];
                let huruf = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
                if (data.length == 0) {
                    for (let i = 0; i < getData.tally_sheet_details.length; i++) {

                        let tempData = []

                        let jumlahBaris = (Number(getData.tally_sheet_details[i].boxes.length) / 10) + 1;
                        let jumlahKolom = getData.tally_sheet_details[i].boxes.length;
                        let buatKolom = 0
                        let indexBox = 0;
                        if (tallySheetDetail[i].purchase_invoice_id) {
                            setSumber('Faktur');
                            setSelectedSupplier(getData.supplier_name);
                            setSupplier(getData.supplier_id)
                        }
                        else if (tallySheetDetail[i].purchase_order_id) {
                            setSumber('PO')
                            setSelectedSupplier(getData.supplier_name);
                            setSupplier(getData.supplier_id)
                        }
                        else if (tallySheetDetail[i].sales_return_id) {
                            setSumber('Retur')
                            setSelectedCustomer(getData.customer_name);
                            setCustomer(getData.customer_id)
                        }


                        for (let x = 0; x <= jumlahBaris.toFixed(); x++) {

                            let baris = []
                            let kolom = [];
                            for (let y = 0; y <= 10; y++) {
                                if (x == 0) {
                                    if (y == 0) {
                                        kolom.push({ readOnly: true, value: "" })
                                    }
                                    else {
                                        kolom.push({ value: huruf[y - 1], readOnly: true })
                                    }

                                }
                                else {
                                    if (y == 0) {
                                        kolom.push(
                                            { readOnly: true, value: x }

                                        );

                                    }
                                    else if (buatKolom < jumlahKolom && x <= jumlahBaris.toFixed()) {
                                        kolom.push(
                                            {
                                                value: Number(getData.tally_sheet_details[i].boxes[indexBox].quantity).toFixed(2).replace('.', ','),
                                                readOnly: true,
                                            }
                                        );
                                        if (indexBox < getData.tally_sheet_details[i].boxes.length - 1) {

                                            indexBox = indexBox + 1;
                                        }
                                        buatKolom = buatKolom + 1;
                                        // console.log(indexBox)
                                    }
                                    else {
                                        kolom.push(
                                            { value: '', readOnly: true },
                                        );
                                    }

                                    baris.push(kolom)

                                }

                            }
                            tempData.push(kolom);
                        }
                        arrData.push(tempData)
                    }

                    setData(arrData);

                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    const [quantityPO, setQuantityPO] = useState("0")
    function klikTampilSheet(indexPO) {

        if(sumber == 'PO'){
            setQuantityPO(detailTallySheet[indexPO].purchase_order_qty)
        }
        else if(sumber == 'Faktur'){
            setQuantityPO(detailTallySheet[indexPO].purchase_invoice_qty)

        }
        else if(sumber == 'Retur'){
            setQuantityPO(detailTallySheet[indexPO].sales_return_qty)

        }
        setIndexPO(indexPO);
        setModal2Visible2(true);
    }

    const [quantityTotal, setQuantityTotal] = useState("0")
    let totalQty = 0;

    function hitungTotal(indexPO) {
        for (let i = 0; i < indexPO.length; i++) {
            totalQty = Number(totalQty) + Number(detailTallySheet[i].boxes_quantity)
            setQuantityTotal(totalQty);
            //console.log(totalQty);
        }
        //return totalQty;
    }

    useEffect(() => {
        hitungTotal(detailTallySheet)
    }, [detailTallySheet])

    const columns = [
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
            width: '25%',
            key: 'name',
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
            width: '25%',
            key: 'name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            editable: true,
            
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            align: 'center',
            width: '10%',
            key: 'name',
        },
        {
            title: 'Box',
            dataIndex: 'box',
            align: 'center',
            width: '10%',
            key: 'box',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            width: '10%',
            key: 'operation',

        },
    ];

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
              }
    
           
            }`;


    const dataPurchase =
        [...detailTallySheet.map((item, i) => ({
            code: sumber=='PO' ? item.purchase_order.code : sumber=='Faktur' ? item.purchase_invoice.code : sumber=='Retur' ? item.sales_return.code : null,
            product_name: item.product_name,
            quantity: Number(item.boxes_quantity).toFixed(2).replace('.', ','),
            unit: item.boxes_unit,
            box:
                <>

                    <a onClick={() => klikTampilSheet(i)} style={{ color: "#1890ff" }}>
                        {item.number_of_boxes}
                    </a>
                    <Modal
                        centered
                        visible={modal2Visible2}
                        onCancel={() => setModal2Visible2(false)}
                        onOk={() => setModal2Visible2(false)}
                        width={1000}
                    >
                        <div className="text-title text-start">
                            <div className="row">
                                <div className="col">
                                    <div className="row">
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">No. Pesanan</label>
                                        <div className="col-sm-3">
                                            <input

                                                value={sumber=='PO' ? detailTallySheet[indexPO].purchase_order.code : sumber=='Faktur' ?detailTallySheet[indexPO].purchase_invoice.code : sumber=='Retur' ? detailTallySheet[indexPO].sales_return.code : null  }
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />
                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Pesanan</label>
                                        <div className="col-sm-3">
                                            <input
                                                value={quantityPO.replace('.', ',')}
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />

                                        </div>
                                    </div>
                                    <div className="row mb-1 mt-2">
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Produk</label>
                                        <div className="col-sm-3">
                                            <input
                                                value={detailTallySheet[indexPO].product_name}
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />

                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                        <div className="col-sm-3">
                                            <input
                                                value={Number(detailTallySheet[indexPO].boxes_quantity).toFixed(2).replace('.', ',')}
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10" style={{ overflowY: "scroll", height: "300px", display: loadingSpreedSheet ? "none" : 'block' }}>
                                    <ReactDataSheet
                                        data={data[indexPO]}
                                        valueRenderer={valueRenderer}
                                        onContextMenu={onContextMenu}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal>
                </>,
            action: item.action === 'Done' ? <Tag color="green">{item.action}</Tag> : item.action === 'Next delivery' ? <Tag color="orange">{item.action}</Tag> : <Tag color="red">{item.action}</Tag>


        }))

        ];

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        copyStyles: true,
        //pageStyle: pageStyle
    })

    if (loading) {
        return (
            <div></div>
        )
    }

    const cetakColumn = [
        {
            title: 'NAMA BARANG',
            dataIndex: 'desc',
            fontSize: '10px'
        },
        {
            title: 'BOX',
            dataIndex: 'box',
            align: 'center',
            fontSize: '10px'
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
            fontSize: '10px'
        }
    ]


    const cetakData = [
        ...detailTallySheet.map((item, i) => ({

            desc: item.product_name,
            qty: item.boxes_quantity,
            box:
                <ReactDataSheet
                    data={data[i]}
                    valueRenderer={valueRenderer}
                    onContextMenu={onContextMenu}
                    style={{ border: '1px black', fontColor: 'black', backgroundColor: 'white' }}
                />,


        }))

    ]



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
          <div className='mt-4 d-flex' style={{position:"fixed", height:"100px", top:"0"}}>
                      
                      <div><img src={logo} width="60px"></img></div>
                      <div className='ms-2' >
                          <div className='header-cetak'><b> PT. BUMI MAESTROAYU</b></div>
                          <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                          <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                          <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                      </div>
                     
        </div>
        <br/>
    <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold" }}>
                      <div style={{ fontSize: "16px", textDecoration: "underline", textAlign:'center'}}>TALLY SHEET</div>
                      <div style={{ fontSize: "10px", marginTop: "-5px" }}>NO. {getTallySheet.code}</div>
                  </div>

                  <div className='mt-4 mb-1 col d-flex justify-content-center '  style={{ fontSize: "12px", width:"100%" }}>
                      <div className='col-6'>
                          <div className="d-flex flex-row">
                              <label className='col-6'>DARI</label>
                              <div className='col-6'> : {getTallySheet.supplier_name}</div>
                          </div>
                          {/* <div className="d-flex flex-row">
                              <label className='col-6'>CATATAN </label>
                          </div> */}
                          <div className="d-flex flex-row">
                              <label className='col-6'>CATATAN : </label>
                              
                             
                          </div>
                    {/* <div className="mt-2 mb-2 d-flex flex-row justify-content-center">
                    <textarea
                                    className="col-6"
                                    id="form4Example3"
                                    rows="5"
                                    cols="100"
                                    value={getTallySheet.notes}
                                    disabled
                                    style={{resize:"none"}}
                                />
                    </div>
                           */}
                          
                      </div>
                      <div className='col-6'>
                        <div className="d-flex flex-row">
                                <label className='col-6'>TANGGAL</label>
                                <div className='col-6'> : {getTallySheet.date}</div>
                            </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>GUDANG</label>
                              <div className='col-6'> : {getTallySheet.warehouse_name} </div>
                          </div>
                        
                          
                      </div>
                      <div>
                        
                      </div>
                  </div>

                    <div className='mb-1 justify-content-start align-items-left d-flex flex-column' style={{ fontSize: "12px", width:"100%" }}>
                  
                    <div className="d-flex justify-content-center" style={{width:"100%", height:"100%"}}>
                    <br/>
                    <textarea
                                    className="col-12 class-catatan-cetak"
                                    id="form4Example3"
                                    rows="3"
                                    cols="100"
                                    value={getTallySheet.notes}
                                    disabled
                                    style={{resize:"none"}}
                                />
                    </div>
                    <br/>
                  

                  </div>

                </div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
       
        
          <div className="page" style={{lineHeight:"3"}}>
           
          <div className='d-flex mb-2' style={{width:"100%", height:"100%"}} >
                       
                        <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto", pageBreakInside:"avoid"}}>
                            <tr className='text-center border' style={{ height: "40px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>
                                <th width="50px" className='border' >No</th>
                                <th width="300px" className='border'>Box</th>
                                <th width="80px" className='border'>Qty</th>
                                <th width="80px" className='border'>Stn</th>
                               
                            
                            </tr>
                            <tbody className="border mb-0">
                                {
                                    detailTallySheet.map((item, i) => (
                                        <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto", verticalAlign:"top"}} className='border-isi text-center'><b> {i + 1} </b></td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-start'><b> {item.product_name} </b> 
                                            <ReactDataSheet
                                                    data={data[i]}
                                                    valueRenderer={valueRenderer}
                                                    onContextMenu={onContextMenu}
                                                    style={{border: '1px black', bottom:"0px", marginBottom:"0", fontColor:'black', backgroundColor:'white', borderInlineColor:'black'}}
                                                />
                                             </td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto", marginBottom:"0", verticalAlign:"bottom"}} className='border-isi text-center'>{Number(item.boxes_quantity).toFixed(2).replace('.',',')}</td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto", verticalAlign:"bottom"}} className='border-isi text-center'>{item.boxes_unit}  <br/> </td>
                                           
                                        </tr>

                                    ))
                                }
                            </tbody>


                        </table>
                        <br/>
                        <br/>
                        <br/>
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
          <div className="page-footer" >
          <div className='d-flex mt-1' style={{width:"100%", bottom:"0"}}>
            <br/>
            <br/>
                        <br/>
          <table style={{ fontSize: "10px", width: "100%", height:"100%"}} >
                            {/* <tr className='text-end' style={{ height: "20px", width:"70%", alignItems:"right", marginRight:"0px", textAlign:"right"}}>
                                <td width="35px" style={{alignItems:"right"}} ><b>Total : {quantityTotal} </b></td>
                            </tr> */}
                            <tr className='text-center border' style={{ height: "50px", width:"70%" }}>
                                <th width="35px" className='border'>Dibuat Oleh,</th>
                                <th width="35px" className='border'>Pengirim,</th>
                                <th width="35px" className='border'>Disetujui Oleh,</th>
                                <th width="35px" className='border'>Diterima Oleh,</th>
                            </tr>
                           
                            <tr className='text-center border ' style={{ height: "80px" ,width:"70%"}}>
                                     
                                    <td width="35px" className='border'><b>_________________</b></td>
                                    <td width="35px"className='border'><b>_________________</b></td>
                                    <td width="35px"className='border'><b>_________________</b></td>
                                    <td width="35px"className='border'><b>_________________</b></td>
                                       
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

                <div className="row">
                    <div className="col text-title text-start">
                        <PageHeader
                            ghost={false}
                            onBack={() => window.history.back()}
                            title="Detail Pesanan"
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
                        {/* <div className="text-title text-start mb-4">
                            <h3 className="title fw-bold">Detail Pesanan</h3>
                        </div> */}
                    </div>
                    {/* <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} class="btn btn-warning rounded m-1">
<<<<<<< HEAD
                    <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} className="btn btn-warning rounded m-1">
=======
>>>>>>> e96dfe8974c6f78ed50b9d708e37c6177b1dbf2e
                            Cetak
                        </button>
                    </div> */}
                </div>
                {/* <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Detail Pesanan</h3>
                </div> */}
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.date} id="startDate" className="form-control" type="date" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.code} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3" style={{display: sumber=='Retur' ? 'flex' : 'none'}}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.customer_name} id="startDate" className="form-control" type="text" />
                            </div>
                        </div>
                        <div className="row mb-3" style={{display: sumber=='Retur' ? 'none' : 'flex'}}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.supplier_name} id="startDate" className="form-control" type="text" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang</label>
                            <div className="col-sm-7">
                                <input disabled="true" type="text" value={getTallySheet.warehouse_name} className="form-control" id="inputNama3" />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                <textarea disabled="true" value={getTallySheet.notes} className="form-control" id="form4Example3" rows="4" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                {getTallySheet.status === 'Submitted' ? <Tag color="blue">{getTallySheet.status}</Tag> : getTallySheet.status === 'Draft' ? <Tag color="orange">{getTallySheet.status}</Tag> : getTallySheet.status === 'Done' ? <Tag color="green">{getTallySheet.status}</Tag> : <Tag color="red">{getTallySheet.status}</Tag>}
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
                        bordered
                        pagination={false}
                        dataSource={dataPurchase}
                        // expandable={{ expandedRowRender }}
                        // defaultExpandAllRows
                        columns={columns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
            </form>


        </>
    )
}

export default DetailTallySheet