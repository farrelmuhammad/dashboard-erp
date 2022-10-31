import './form.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Switch, PageHeader } from 'antd'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const BuatCoa = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [accountCategory, setAccountCategory] = useState('');
    const [masterAcc, setMasterAcc] = useState('');
    // const [accountCode, setAccountCode] = useState('');
    const [accountName, setAccountName] = useState('');
    const [currency, setCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState('');
    const [firstBalance, setFirstBalance] = useState('');
    const [notes, setNotes] = useState('');
    const [checked, setChecked] = useState(true);
    const [status, setStatus] = useState('Active');

    const navigate = useNavigate();

    const [selectedValue, setSelectedAccountCategory] = useState(null);
    const [selectedValue2, setSelectedMasterAcc] = useState(null);
    const [selectedValue3, setSelectedCurrency] = useState(null);

    const handleChangeCategoryAcc = (value) => {
        setSelectedAccountCategory(value);
        setAccountCategory(value.id);
    };
    // load options using API call
    const loadOptionsCategoryAcc = (inputValue) => {
        return fetch(`${Url}/select_chart_of_account_categories?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeMasterAcc = (value) => {
        setSelectedMasterAcc(value);
        setMasterAcc(value.id);
    };
    // load options using API call
    const loadOptionsMasterAcc = (inputValue) => {
        return fetch(`${Url}/select_chart_of_accounts?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeCurrency = (value) => {
        setSelectedCurrency(value);
        setCurrency(value.id);
    };
    // load options using API call
    const loadOptionsCurrency = (inputValue) => {
        return fetch(`${Url}/select_currencies?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // useEffect(() => {

    // }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("kategori", accountCategory);
        userData.append("induk", masterAcc);
        userData.append("nama", accountName);
        userData.append("mata_uang", currency);
        userData.append("kurs", exchangeRate);
        userData.append("saldo_awal", firstBalance);
        userData.append("catatan", notes);
        userData.append("status", status);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/chart_of_accounts`,
            data: userData,
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
                navigate("/coa");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        // text: err.response.data.error.nama,
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

    // const onChange = () => {
    //     checked ? setChecked(false) : setChecked(true)

    //     if (checked === false) {
    //         setStatus("Active");
    //         // console.log('Active');
    //     } else {
    //         setStatus("Inactive");
    //         // console.log('Inactive');
    //     }
    // };

    const onChange = () => {
        setChecked(!checked)
        // checked ? setChecked(true) : setChecked(false)
        checked ? setStatus('Active') : setStatus ('NonActive')
        console.log(status)
        // if (checked === true) {
        //   setStatus("Active");
        //   // console.log('Active');
        // } else {
        //   setStatus("Inactive");
        //   // console.log('Inactive');
        // }
      };
    

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Buat COA">
            </PageHeader>
                {/* <div className="text-title text-start mb-4">
                    <h4 className="title fw-bold">Buat COA</h4>
                </div> */}
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal Awal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kategori Akun</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Kategori Akun..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCategoryAcc}
                                    onChange={handleChangeCategoryAcc}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Induk Akun</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Induk Akun..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue2}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsMasterAcc}
                                    onChange={handleChangeMasterAcc}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kode Akun</label>
                            <div className="col-sm-7">
                                <input
                                    value="Otomatis"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Nama Akun</label>
                            <div className="col-sm-7">
                                <input
                                    // value="Otomatis"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Mata Uang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue3}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCurrency}
                                    onChange={handleChangeCurrency}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kurs</label>
                            <div className="col-sm-7">
                                <input
                                    // value="Otomatis"
                                    type="number"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setExchangeRate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Saldo Awal</label>
                            <div className="col-sm-7">
                                <input
                                    // value="Otomatis"
                                    type="number"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setFirstBalance(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Catatan</label>
                            <div className="col-sm-7">
                                <input
                                    // value="Otomatis"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-7">
                                <Switch defaultChecked={checked} onChange={onChange} />
                                <label htmlFor="inputNama3" className="col-sm-4 ms-3 col-form-label">
                                    {
                                        checked ? "Aktif"
                                            : "Nonaktif"
                                    }
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end" role="group" aria-label="Basic mixed styles example">
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    )
}

export default BuatCoa;