import './form.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { PageHeader} from 'antd';

const BuatCreditNote = () => {
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedMataUang, setSelectedMataUang] = useState('Rp ');
    const [selectedFaktur, setSelectedFaktur] = useState(null);
    const [selectedCOA, setSelectedCOA] = useState(null);
    const [selectedBiaya, setSelectedBiaya] = useState(null);
    const [supplierId, setSupplierId] = useState();
    const [biayaId, setBiayaId] = useState();
    const [nominal, setNominal] = useState();
    const [deskripsi, setDeskripsi] = useState()
    const [COAId, setCOAId] = useState();
    const [fakturId, setFakturId] = useState();
    const [mataUangId, setMataUangId] = useState();

    function klikEnter(event) {
        if (event.code == "Enter") {
            event.target.blur()
        }
    }


    // handle change supplier 
    const handleChangeSupplier = (value) => {
        setSupplierId(value.id);
        setSelectedSupplier(value);
    };
    const loadOptionsSupplier = (inputValue) => {
        return fetch(`${Url}/select_suppliers?nama=${inputValue}&grup=impor`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // handle change faktur 
    const handleChangeFaktur = (value) => {
        setFakturId(value.id);
        setSelectedFaktur(value);
    };
    const loadOptionsFaktur = (inputValue) => {
        return fetch(`${Url}/select_purchase_invoices/Import?code=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // handle change mata uang 
    const handleChangeMataUang = (value) => {
        setMataUangId(value.id);
        setSelectedMataUang(value);
    };
    const loadOptionsMataUang = (inputValue) => {
        return fetch(`${Url}/select_currencies?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };


    // handle change COA
    const handleChangecoa = (value) => {
        setCOAId(value.id);
        setSelectedCOA(value);
    };
    const loadOptionscoa = (inputValue) => {
        return fetch(`${Url}/select_chart_of_accounts?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };


    // handle change COA
    const handleChangeBiaya = (value) => {
        setBiayaId(value.id);
        setSelectedBiaya(value);
    };
    const loadOptionsBiaya = (inputValue) => {
        return fetch(`${Url}/select_costs?name=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("tanggal", date);
        formData.append("pemasok", supplierId);
        formData.append("id_faktur_pembelian", fakturId);
        formData.append("mata_uang", mataUangId);
        formData.append("bagan_akun", COAId);
        formData.append("biaya", biayaId);
        formData.append("nominal", nominal);
        formData.append("deskripsi", deskripsi);
        formData.append("status", 'Draft');
        axios({
            method: "post",
            url: `${Url}/credit_notes`,
            data: formData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/penerimaanbarang");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    };

    const handleDraft = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("tanggal", date);
        formData.append("pemasok", supplierId);
        if (fakturId) {
            formData.append("id_faktur_pembelian", fakturId);
        }
        formData.append("mata_uang", mataUangId);
        formData.append("bagan_akun", COAId);
        formData.append("biaya", biayaId);
        formData.append("nominal", nominal.replace('.', '').replace(/[^0-9\.]+/g, ""));
        formData.append("deskripsi", deskripsi);
        formData.append("status", 'Draft');


        axios({
            method: "post",
            url: `${Url}/credit_notes`,
            data: formData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/creditnote");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    };

    return (
        <>
          <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Credit Note">
          </PageHeader>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Faktur Pembelian</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Faktur Pembelian..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedFaktur}
                                    getOptionLabel={(e) => e.code}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsFaktur}
                                    onChange={handleChangeFaktur}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Nominal</label>
                            <div className="col-sm-7">
                                <CurrencyFormat
                                    className='form-control form-control-sm'
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={selectedMataUang.name + ' '}
                                    onKeyDown={(event) => klikEnter(event)}
                                    onChange={(e) => setNominal(e.target.value)} />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Biaya</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Biaya..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedBiaya}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsBiaya}
                                    onChange={handleChangeBiaya}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Akun Kredit</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Akun Kredit..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedCOA}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionscoa}
                                    onChange={handleChangecoa}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedMataUang}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMataUang}
                                    onChange={handleChangeMataUang}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Deskripsi</label>
                            <div className="col-sm-7">
                                <textarea
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setDeskripsi(e.target.value)}

                                />
                            </div>
                        </div>


                    </div>
                </div>

                <div className="mt-5 mb-4 btn-group" role="group" aria-label="Basic mixed styles example" style={{float:'right',position:'relative'}}>
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
                    {/* <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{clear:'both'}}></div>
            </form>

        </>
    )
}

export default BuatCreditNote