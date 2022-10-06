
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { BarsOutlined, DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
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
import { PageHeader } from 'antd';

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
    const [indexPO, setIndexPO] = useState(0);
    const [kuantitasBox, setKuantitasBox] = useState([]);
    const [idxPesanan, setIdxPesanan] = useState(0);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
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
                setGetTallySheet(getData)
                setDetailTallySheet(getData.tally_sheet_details);

                let arrData = [];
                let huruf = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
                if (data.length == 0) {

                    for (let i = 0; i < getData.tally_sheet_details.length; i++) {
                        let tempData = []

                        for (let x = 0; x <= getData.tally_sheet_details[i].boxes.length; x++) {

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
                                    else if (y <= getData.tally_sheet_details[i].boxes.length && x == 1) {
                                        kolom.push(
                                            { value: getData.tally_sheet_details[i].boxes[y - 1].quantity.replace('.', ','), readOnly: true }
                                        );
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
        setQuantityPO(detailTallySheet[indexPO].purchase_order_qty)
        console.log(indexPO)
        console.log(data)
        setIndexPO(indexPO);
        // setProductPO(product[indexProduct].purchase_order_details);
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
            title: 'Nama Product',
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
          
          
            }
            body {
              marginBottom:50px
            }
            }`;


    const dataPurchase =
        [...detailTallySheet.map((item, i) => ({
            code: item.purchase_order.code,
            product_name: item.product_name,
            quantity: item.boxes_quantity.replace('.', ','),
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
                                                value={detailTallySheet[indexPO].purchase_order.code}
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
                                                value={detailTallySheet[indexPO].boxes_quantity.replace('.', ',')}
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
        pageStyle: pageStyle
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
        },
        {
            title: 'BOX',
            dataIndex: 'box',
            align: 'center',
        },
        {
            title: 'QTY',
            dataIndex: 'qty',
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
                />,


        }))

    ]



    return (
        <>

            <div style={{ display: "none", position: "absolute" }}>
                <div ref={componentRef} className="p-4" >
                    <div className='d-flex'>
                        <div><img src={logo} width="100px"></img></div>
                        <div className='ms-2'>
                            <div className='header-cetak'>P T . B U M I M A E S T R O A Y U</div>
                            <div className='header-cetak'>J L . R A Y A D U R E N T I G A N O . 1 1</div>
                            <div className='header-cetak'>T E L P . ( 0 2 1 ) 7 9 8 1 3 6 8 - 7 9 4 3 9 6 8</div>
                            <div className='header-cetak'>F A X . ( 0 2 1 ) 7 9 8 3 2 4 9</div>
                            <div className='header-cetak'>J A K A R T A S E L A T A N 1 2 7 6 0</div>

                        </div>
                    </div>

                    <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold" }}>
                        <div style={{ fontSize: "25px", textDecoration: "underline" }}>TALLY SHEET</div>
                        <div style={{ fontSize: "20px" }}>NO. {getTallySheet.code}</div>
                    </div>

                    <div className='mt-4 mb-4 col d-flex justify-content-center ps-4 pe-4'>
                        <div className='col-6'>
                            <div className="d-flex flex-row">
                                <label className='col-6'>ORDER DATE</label>
                                <div className='col-6'> : {getTallySheet.date}</div>
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-6'>TO</label>
                                <div className='col-6'> : {getTallySheet.supplier_name}</div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="d-flex flex-row">
                                <label className='col-6'>WAREHOUSE</label>
                                <div className='col-6'> : {getTallySheet.warehouse_name} </div>
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-6'>NOTES</label>
                                <div className='col-6'> : {getTallySheet.notes}</div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-4 ps-4 pe-4 justify-content-center'>
                        <Table pagination={false} columns={cetakColumn} dataSource={cetakData} />
                    </div>

                    <div className='d-flex mt-3 ps-4 pe-4'>
                        <div style={{ width: "80%" }}>
                        </div>
                        <div style={{ width: "20%" }}>
                            <div className='d-flex mt-4'>
                                <label className='col-6'><b>Total</b></label>
                                <div>:</div>
                                <div className='ms-3'>{quantityTotal} </div>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex mt-3 ps-4 pe-4'>

                        <div className='d-flex flex-column align-contents-left ps-4 pe-4' style={{ width: "200px", marginRight: "auto", marginTop: "100px" }}>
                            <div className='text-center'>Penerima,</div>
                            <br />
                            <br />
                            <br />
                            <div className='text-center' >_________________</div>
                        </div>


                        <div className='d-flex flex-column align-contents-end ps-4 pe-4' style={{ width: "200px", marginLeft: "auto", marginTop: "100px" }}>
                            <div className='text-center'>Pengirim,</div>
                            <br />
                            <br />
                            <br />
                            <div className='text-center' >_________________</div>
                        </div>
                    </div>


                </div>
            </div>

            <form className="  p-3 mb-5 bg-body rounded">

                <div className="row">
                    <div className="col text-title text-start">
                        <PageHeader
                            ghost={false}
                            onBack={() => window.history.back()}
                            title="Detail Pesanan">
                        </PageHeader>
                        {/* <div className="text-title text-start mb-4">
                            <h3 className="title fw-bold">Detail Pesanan</h3>
                        </div> */}
                    </div>
                    <div className="col button-add text-end me-3">
                        <button type="button" onClick={handlePrint} class="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div>
                </div>
                {/* <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Detail Pesanan</h3>
                </div> */}
                <div class="row">
                    <div class="col">
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
                        <div className="row mb-3">
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
                    <div class="col">
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
                            <h4 className="title fw-normal">Daftar Pesanan</h4>
                        </div>
                        {/* <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Produk"
                                centered
                                visible={modal2Visible}
                                onCancel={() => setModal2Visible(false)}
                                width={1000}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Nomor Pesanan.."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={getDataProduct}
                                            scroll={{
                                                y: 250,
                                            }}
                                            pagination={false}
                                            loading={isLoading}
                                            size="middle"
                                        />
                                    </div>
                                </div>
                            </Modal>
                        </div> */}
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
            {/* <form className="  p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div class="row">
                        <div class="col">
                            <h4 className="title fw-normal">Cari Produk</h4>
                        </div>
                        <div class="col-sm-3 me-5">
                        <div class="input-group">
                            <input disabled="true" type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Type..."/>
                            <div class="input-group-text">Search</div>
                        </div>
                        </div>
                    </div>
                <ProdukPesananTable />
                </div>
            <div class="row p-0">
                <div class="col ms-5">
                    <div class="form-check">
                        <input disabled="true" class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        <label class="form-check-label" for="flexCheckDefault">
                            Harga Termasuk Pajak
                        </label>
                    </div>
                </div>
                <div class="col">
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                        <div class="col-sm-6">
                            <input disabled="true" type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                        <div class="col-sm-6">
                            <input disabled="true" type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                        <div class="col-sm-6">
                            <input disabled="true" type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Total</label>
                        <div class="col-sm-6">
                            <input disabled="true" type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" class="btn btn-success rounded m-1">Simpan</button>
                <button type="button" class="btn btn-primary rounded m-1">Submit</button>
                <button type="button" class="btn btn-warning rounded m-1">Cetak</button>
            </div>
            </form> */}
        </>
    )
}

export default DetailTallySheet