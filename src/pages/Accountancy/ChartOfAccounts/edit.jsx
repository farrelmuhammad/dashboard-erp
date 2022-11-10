import './form.css'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Switch } from 'antd'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { Code } from '@mui/icons-material';
import { PageHeader } from 'antd';
import ReactSelect from "react-select";

const EditCoa = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [code, setCode] = useState(null);
    const [accountCategory, setAccountCategory] = useState('');
    const [masterAcc, setMasterAcc] = useState();
    // const [accountCode, setAccountCode] = useState('');
    const [accountName, setAccountName] = useState('');
    const [currency, setCurrency] = useState('');
    const [exchangeRate, setExchangeRate] = useState('');
    const [firstBalance, setFirstBalance] = useState('');
    const [notes, setNotes] = useState('');
    const [checked, setChecked] = useState(true);
    const [status, setStatus] = useState('');

    const [loading, setLoading] = useState(true);

    const [accountCategoryname, setAccountCategoryname] = useState(null);
    const [masterAccountName, setMasterAccountName] = useState(null);
    const [currencyName, setCurrencyName] = useState(null);

    const [entityName, setEntityName] = useState(null)

    const { id } = useParams();

    const navigate = useNavigate();

    const [selectedValue, setSelectedAccountCategory] = useState(null);
    const [selectedValue2, setSelectedMasterAcc] = useState(null);
    const [selectedValue3, setSelectedCurrency] = useState(null);
    const [selectedValue4, setSelectedEntity] = useState(null);

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
        console.log(value)
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

    const getCoaById = async () => {
        await axios.get(`${Url}/chart_of_accounts?id=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data[0]
                setCode(getData.code)
                setDate(getData.date)
                setAccountCategory(getData.chart_of_account_category_id)
                setAccountCategoryname(getData.chart_of_account_category.name)
                setAccountName(getData.name)
                setMasterAcc(getData.parent.id)
                setMasterAccountName(getData.parent.name)
                setCurrency(getData.currency.id)
                setCurrencyName(getData.currency.name)
                setExchangeRate(getData.exchange_rate)
                setFirstBalance(getData.opening_balance)
                setNotes(getData.notes)
                setStatus(getData.status)
                setEntityName(getData.entity)
                setLoading(false)
                setSelectedMasterAcc(getData.parent)
                console.log(getData)
            })
    }

    useEffect(() => {
        getCoaById()
    }, [])

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
        userData.append("entitas",entityName)

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

    const optionsBussiness = [
        {
          label: "Head Office",
          value: "Head Office"
        },
        {
          label: "Meat Shop",
          value: "Meat Shop"
        },
      ];

    const handleSingleChange = (e) => {
        setSelectedEntity(e.value)
        setEntityName(e.value);
        console.log(e)
      };

    //   const handleChangeCurrency = (value) => {
    //     setSelectedCurrency(value);
    //     setCurrency(value.id);
    // };

    const onChange = () => {
        checked ? setChecked(false) : setChecked(true)

        if (checked === false) {
            setStatus("Active");
            // console.log('Active');
        } else {
            setStatus("Inactive");
            // console.log('Inactive');
        }
    };

    const valueSwitch = () => {
        if (status === "Active") {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }

    if (loading) {
        return (
            <div></div>
        )
    }

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Edit COA">
            </PageHeader>
                {/* <div className="text-title text-start mb-4">
                    <h4 className="title fw-bold">Edit COA</h4>
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
                                    value={date}
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
                                    defaultInputValue={accountCategoryname}
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
                                    defaultInputValue={masterAccountName}
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
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={code}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Nama Akun</label>
                            <div className="col-sm-7">
                                <input
                                    value={accountName}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">
                                Entitas
                            </label>
                            <div className="col-sm-7">
                            <ReactSelect
                            placeholder="Pilih Entitas..."
                            className="basic-single"
                            classNamePrefix="select"
                            value={{ value: entityName, label: entityName }}
                          
                            isSearchable
                            name="color"
                            options={optionsBussiness}
                            onChange={(item) => {
                                console.log(item);
                                // set item instead of item.value
                                setEntityName(item.value);
                            }}
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
                                    defaultInputValue={currencyName}
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
                                    value={exchangeRate}
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
                                    value={firstBalance}
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
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-7">
                                <Switch defaultChecked={status} onChange={onChange} />
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

export default EditCoa;