import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Url from '../../../Config';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CurrencyFormat from 'react-currency-format';
import { PageHeader } from 'antd';

export const DetailCreditNote = () => {
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
    const [code, setCode] = useState();

    useEffect(() => {
        getDataCreditNoteById();
    }, [])
    const getDataCreditNoteById = async () => {
        await axios.get(`${Url}/credit_notes?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                console.log(getData)

                setDate(getData.date);
                setCode(res.data.data[0].code)

                console.log(code)
                setSelectedSupplier(getData.supplier_name);
                if (getData.purchase_invoice_code) {

                    setSelectedFaktur(getData.purchase_invoice_code)
                } else {

                    setSelectedFaktur('-')
                }
                console.log(res.data.data[0].purchase_invoice)

                if(res.data.data[0].chart_of_account){
                    setSelectedCOA(getData.chart_of_account.name)
                }
                else{
                    setSelectedCOA('-')
                }

                if(res.data.data[0].cost){
                    setSelectedBiaya(getData.cost.name)
                }
                else{
                    setSelectedBiaya('-')
                }

             
                setSelectedMataUang(getData.currency.name)
                setNominal(getData.nominal);
                console.log(nominal)
               
                setDeskripsi(getData.description)
                setLoading(false);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    if (loading) {
        return (
            <div></div>
        )
    }


    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Detail Credit Note">
                </PageHeader>
                    {/* <h4 className="title fw-bold">Buat Credit Note</h4> */}
                </div>
                <div className="row">
                    <div className="col">
                    <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">No. Kredit Note</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={code}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    defaultValue={date}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={selectedSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Faktur Pembelian</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={selectedFaktur}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={selectedMataUang}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Nominal</label>
                            <div className="col-sm-7">
                            <CurrencyFormat
                                    className='form-control'
                                    decimalSeparator=','
                                    //fixedDecimalScale={2}
                                    thousandSeparator={'.'}
                                   // decimalSeparator={','}
                                    //value={nominal.substring(0, nominal.length - 2) + ',' + nominal.slice(-2)}
                                    //decimalScale={2}
                                    value={nominal.replace('.', ',')}
                                    disabled
                                    prefix={selectedMataUang + ' '} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Biaya</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={selectedBiaya}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Akun Kredit</label>
                            <div className="col-sm-7">
                                <input
                                    disabled
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    defaultValue={selectedCOA}
                                />
                            </div>
                        </div>
           
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Deskripsi</label>
                            <div className="col-sm-7">
                                <textarea
                                    disabled
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    defaultValue={deskripsi}

                                />
                            </div>
                        </div>


                    </div>
                </div>


            </form>
        </>
    )
}

export default DetailCreditNote