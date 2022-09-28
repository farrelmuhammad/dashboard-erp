import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import jsCookie from "js-cookie";
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import axios from 'axios';
import Url from '../../../Config';
import { Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import logo from "../../Logo.jpeg"

export const DetailPesanan = () => {
    // const token = jsCookie.get("auth");
    const { id } = useParams();
    const [dataSO, setDataSO] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [status, setStatus] = useState([]);
    const [details, setDetails] = useState([]);
    const [taxInclude, setTaxInclude] = useState("");
    const auth = useSelector(state => state.auth);

    const columns = [
        {
            title: 'No.',
            dataIndex: 'id',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_alias_name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '5%',
            align: 'center',
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
            width: '8%',
            align: 'center',
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
            width: '14%',
            align: 'center',
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
                console.log(dataSO[0]);
                setCode(getData[0].code);
                setDate(getData[0].date);
                setStatus(res.data.data[0].status);
                setDetails(res.data.data[0].sales_order_details);
                setCustomer(res.data.data[0].customer.name);
                setTaxInclude(res.data.data[0].tax_included)
                console.log(res.data.data[0].tax_included)
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
        pageStyle: {pageStyle}
    })
    // if (loading) {
    //     return (
    //         <div></div>
    //     )
    // }

    const cetakColumn = [
        {
            title: 'NAMA BARANG',
            dataIndex: 'name',
        },
        {
            title: 'QTY',
            dataIndex: 'quantity',
        },
        {
            title: 'DISKON',
            dataIndex: 'discount',
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
        },
        {
            title: 'HARGA',
            dataIndex: 'price',
        },
        {
            title: 'JUMLAH',
            dataIndex: 'total',
        },

    ]

    const cetakData =
        [...details.map((item, i) => ({
            name: item.product_alias_name,
            quantity: item.quantity,
            discount: item.fixed_discount != null ? <>{'Rp ' + Number(item.fixed_discount).toLocaleString('id')}</> : <>{item.discount_percentage + '%'}</>,
            ppn: item.ppn + '%',
            price: 'Rp ' + Number(item.price).toLocaleString('id'),
            total: 'Rp ' + Number(item.total).toLocaleString('id')
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
                        <div style={{ fontSize: "25px", textDecoration: "underline" }}>PESANAN PENJUALAN</div>
                    </div>

                    <div className='mt-4 mb-4 col d-flex justify-content-center ps-4 pe-4'>
                        <div className='col-6'>
                            <div className="d-flex flex-row">
                                <label className='col-6'>NO PESANAN</label>
                                <div className='col-6'>: {code}</div>
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-6'>TANGGAL</label>
                                <div className='col-6'>: {date}</div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <div className="d-flex flex-row">
                                <label className='col-8'>KEPADA YTH.</label>
                            </div>
                            <div className="d-flex flex-row">
                                <label className='col-8'>{customer}</label>
                            </div>
                        </div>
                    </div>

                    <div className='mt-4 ps-4 pe-4'>
                        <Table pagination={false} columns={cetakColumn} dataSource={cetakData} />
                    </div>

                    <div className='d-flex mt-3 ps-4 pe-4'>
                        <div style={{ width: "35%" }}>
                            <div className='d-flex mt-5'>
                                <label className='col-6'>SUBTOTAL</label>
                                <div>:</div>
                                <div className='ms-3'>  {'Rp ' + Number(dataSO.subtotal).toLocaleString('id')} </div>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'>Discount</label>
                                <div>:</div>
                                <div className='ms-3'>  {'Rp ' + Number(dataSO.discount).toLocaleString('id')}</div>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'>Tax</label>
                                <div>:</div>
                                <div className='ms-3'>  {'Rp ' + Number(dataSO.ppn).toLocaleString('id')}</div>
                            </div>
                            <div className='d-flex'>
                                <label className='col-6'><b>Total</b></label>
                                <div>:</div>
                                <div className='ms-3'>  {'Rp ' + Number(dataSO.total).toLocaleString('id')}</div>
                            </div>

                        </div>
                    </div>

                    <div className='d-flex flex-column align-contents-end ps-4 pe-4' style={{ width: "200px", marginLeft: "auto", marginTop: "200px" }}>
                        <div className='text-center' >Drew Feig</div>
                        <div ><hr></hr></div>
                        <div className='text-center'>Administrator</div>
                    </div>
                </div>
            </div>
            
            <form className="p-3 mb-3 bg-body rounded">
                <div className="row">
                    <div className="col text-title text-start">
                        <div className="text-title text-start mb-4">
                            <h3 className="title fw-bold">Detail Pesanan</h3>
                        </div>
                    </div>
                    <div className="col button-add text-end me-3">
                    <button type="button" onClick={handlePrint} class="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
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
                    <div class="col">
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
                    <div class="row">
                        <div class="col">
                            <h4 className="title fw-normal">Cari Produk</h4>
                        </div>
                        {/* <div class="col-sm-3 me-5">
                            <div class="input-group">
                                <input disabled="true" type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Type..." />
                                <div class="input-group-text">Search</div>
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
                <div class="row p-0">
                    <div class="col ms-5">
                        <div class="form-check">
                            {taxInclude === "1" ? <input
                                disabled="true"
                                class="form-check-input"
                                type="checkbox"
                                id="flexCheckDefault"
                                value="1"
                                checked
                            /> : <input
                                disabled="true"
                                class="form-check-input"
                                type="checkbox"
                                value="0"
                                id="flexCheckDefault"
                            />}
                            {/* <input
                                disabled="true"
                                class="form-check-input"
                                type="checkbox"
                                value="1"
                                id="flexCheckDefault"
                                checked={taxInclude}
                            /> */}
                            <label class="form-check-label" for="flexCheckDefault">
                                Harga Termasuk PPN
                            </label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="row mb-3">
                            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div class="col-sm-6">
                                {dataSO.map(d => (
                                    <input
                                        disabled="true"
                                        type="number"
                                        class="form-control form-control-sm"
                                        id="colFormLabelSm"
                                        value={d.total}
                                    />
                                ))}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div class="col-sm-6">
                                {dataSO.map(d => (
                                    <input
                                        disabled="true"
                                        type="number"
                                        class="form-control form-control-sm"
                                        id="colFormLabelSm"
                                        value={d.discount}
                                    />
                                ))}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div class="col-sm-6">
                                {dataSO.map(d => (
                                    <input
                                        disabled="true"
                                        type="number"
                                        class="form-control form-control-sm"
                                        id="colFormLabelSm"
                                        value={d.ppn}
                                    />
                                ))}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div class="col-sm-6">
                                {dataSO.map(d => (
                                    <input
                                        disabled="true"
                                        type="number"
                                        class="form-control form-control-sm"
                                        id="colFormLabelSm"
                                        value={d.total}
                                    />
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