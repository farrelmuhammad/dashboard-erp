import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CurrencyFormat from 'react-currency-format';
import { PageHeader } from 'antd';

export const DetailPIB = () => {
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(true)
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedMataUang, setSelectedMataUang] = useState(null);
    const [selectedFaktur, setSelectedFaktur] = useState(null);
    const [selectedCOA, setSelectedCOA] = useState(null);
    const [selectedBiaya, setSelectedBiaya] = useState(null);
    const [supplierId, setSupplierId] = useState();
    const [biayaId, setBiayaId] = useState();
    const [nominal, setNominal] = useState();
    const [deskripsi, setDeskripsi] = useState()
    const [COAId, setCOAId] = useState();
    const { id } = useParams();
    const [fakturId, setFakturId] = useState();
    const [mataUangId, setMataUangId] = useState();
    const [dataHeader, setDataHeader] = useState()
    const [dataPIB, setDataPIB] = useState([])

    useEffect(() => {
        getDataPIB();
    }, [])
    const getDataPIB = async () => {
        await axios.get(`${Url}/goods_import_declarations?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                console.log(getData);
                setDataHeader(getData);
                setDataPIB(getData.goods_import_declaration_details)
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const columnProduk = [
        {
            title: 'Nama Produk',
            width: '20%',
            dataIndex: 'nama',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Harga',
            dataIndex: 'hrg',
            width: '10%',
            align: 'center',
        },
        // {
        //     title: 'Diskon',
        //     dataIndex: 'dsc',
        //     width: '10%',
        //     align: 'center',
        // },
        {
            title: 'Jumlah Setelah Diskon',
            dataIndex: 'uangasing',
            width: '15%',
            align: 'center',

        },
        {
            title: 'Jumlah (Rp)',
            dataIndex: 'rupiah',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Bea Masuk',
            dataIndex: 'bea',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            align: 'center',

        },

    ];

    const dataProduk =
    
    [...dataPIB.map((item, i) => ({
        nama: item.product_name,
        qty: item.quantity.replace('.', ','),
        hrg: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.price.replace('.', ',')} key="total" />,
        uangasing: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={item.subtotal.replace('.', ',')} key="total" />,
        rupiah: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.converted_subtotal).toFixed(2).replace('.' , ',')} key="total" />,
        bea: <CurrencyFormat prefix='Rp ' disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.import_duty).toFixed(2).replace('.' , ',')} key="pay" />,
        total: <CurrencyFormat prefix="Rp " disabled className='edit-disabled  text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.' , ',')} key="total" />,
    }))

    ]



    if (loading) {
        return (
            <div></div>
        )
    }


    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Detail PIB">
            </PageHeader>
            <form className="p-3 mb-3 bg-body rounded">
                {/* <div className="text-title text-start mb-4">
                    
                    <h4 className="title fw-bold">Buat PIB</h4>
                </div> */}

                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    disabled
                                    value={dataHeader.date}
                                // onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. PIB</label>
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
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">No B/L</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    disabled
                                    // onChange={(e) => setNoBL(e.target.value)}
                                    value={dataHeader.bill_of_lading_number}
                                    id="inputNama3"
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
                                {/* <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Rate Kurs</label>
                            <div className="col-sm-7">

                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.exchange_rate} key="total" />


                            </div>
                        </div>

                    </div>
                    <div className="col">

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Nama Kapal</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    // onChange={(e) => setNamaKapal(e.target.value)}
                                    defaultValue={dataHeader.ship_name}
                                    disabled
                                    id="inputNama3"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal Tiba</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    // onChange={(e) => setTanggalTiba(e.target.value)}
                                    disabled
                                    value={dataHeader.arrival_date}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Shipment Periode </label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    // onChange={(e) => setEstimasiAwal(e.target.value)}
                                    disabled
                                    value={dataHeader.shipment_period_end_date}
                                />
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    // onChange={(e) => setEstimasiAkhir(e.target.value)}
                                    value={dataHeader.shipment_period_start_date}
                                    disabled

                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas/Bank</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    // onChange={(e) => setEstimasiAkhir(e.target.value)}
                                    value={dataHeader.chart_of_account_name}
                                    disabled


                                />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Total</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled form-control' thousandSeparator={'.'} decimalSeparator={','} value={totalAkhir} key="total" />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Sisa</label>
                            <div className="col-sm-7">
                                <CurrencyFormat prefix='Rp ' disabled className='edit-disabled  form-control' thousandSeparator={'.'} decimalSeparator={','} value={sisaAkhir} key="sisa" />
                            </div>
                        </div> */}
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    // onChange={(e) => setReferensi(e.target.value)}
                                    value={dataHeader.reference}
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Produk Faktur</h4>
                        </div>
                    </div>
                    {/* <div className="row mt-4  mb-3" >
                        <label htmlFor="inputNama3" className="col-sm-2 ps-3 col-form-label">Cari Faktur</label>
                        <div className="col-sm-5">

                            <ReactSelect

                                style={{ display: tampilTabel ? "block" : "none" }}
                                className="basic-single"
                                placeholder="Pilih Faktur..."
                                classNamePrefix="select"
                                isLoading={isLoading}
                                isSearchable
                                getOptionLabel={(e) => e.label}
                                getOptionValue={(e) => e.value}
                                options={optionsFaktur}
                                onChange={(e) => handleChangePilih(e)}
                            />
                        </div>

                    </div> */}
                    <Table
                        // rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataProduk}
                        columns={columnProduk}
                        // onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            // let totalAkhir = 0;
                            // let sisaAkhir = 0;
                            // pageData.forEach(({ sisa, pays }) => {
                            //     totalAkhir += Number(pays);
                            //     sisaAkhir += Number(sisa);
                            //     setTotalAkhir(totalAkhir)
                            //     setSisaAkhir(sisaAkhir)
                            // });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Sub Total</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.subtotal).toFixed(2).replace('.', ',')} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Biaya Masuk</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.import_duty} key="pay"/>


                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Pph 22</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.pph} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">PPN</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp '  disabled className='text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={dataHeader.ppn}  key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={6} className="text-end">Total (Rp)</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <CurrencyFormat prefix='Rp ' disabled className='edit-disabled text-center editable-input' thousandSeparator={'.'} decimalSeparator={','} value={Number(dataHeader.total).toFixed(2).replace('.', ',')} key="pay" />

                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </>
                            )
                        }}
                    />
                </div>


                {/* <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                        width="100px"
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                        width="100px"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
                <div style={{ clear: 'both' }}></div> */}
            </form>

        </>
    )
}

export default DetailPIB