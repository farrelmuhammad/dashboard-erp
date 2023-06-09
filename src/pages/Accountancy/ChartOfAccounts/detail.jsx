import './form.css'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Switch, Table } from 'antd'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { Code } from '@mui/icons-material';
import { PageHeader } from 'antd';

const DetailCoa = () => {
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
    const [entity, setEntity] = useState('');

    const [loading, setLoading] = useState(true);

    const [accountCategoryname, setAccountCategoryname] = useState(null);
    const [masterAccountName, setMasterAccountName] = useState(null);
    const [currencyName, setCurrencyName] = useState(null);


    const { id } = useParams();

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
                if(getData.parent){
                    setMasterAcc(getData.parent.id)
                    setMasterAccountName(getData.parent.name)
                }
                
                setCurrency(getData.currency.id)
                setCurrencyName(getData.currency.name)
                setExchangeRate(getData.exchange_rate)
                setFirstBalance(getData.opening_balance)
                setNotes(getData.notes)
                setStatus(getData.status)
                setEntity(getData.entity)
                setLoading(false)
                console.log(getData)
            })
    }

    useEffect(() => {
        getCoaById()
    }, [])

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const userData = new FormData();
    //     userData.append("tanggal", date);
    //     userData.append("kategori", accountCategory);
    //     userData.append("induk", masterAcc);
    //     userData.append("nama", accountName);
    //     userData.append("mata_uang", currency);
    //     userData.append("kurs", exchangeRate);
    //     userData.append("saldo_awal", firstBalance);
    //     userData.append("catatan", notes);
    //     userData.append("status", status);

    //     // for (var pair of userData.entries()) {
    //     //     console.log(pair[0] + ', ' + pair[1]);
    //     // }

    //     axios({
    //         method: "post",
    //         url: `${Url}/chart_of_accounts`,
    //         data: userData,
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     })
    //         .then(function (response) {
    //             //handle success
    //             Swal.fire(
    //                 "Berhasil Ditambahkan",
    //                 ` Masuk dalam list`,
    //                 "success"
    //             );
    //             navigate("/coa");
    //         })
    //         .catch((err) => {
    //             if (err.response) {
    //                 console.log("err.response ", err.response);
    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "Oops...",
    //                     // text: err.response.data.error.nama,
    //                 });
    //             } else if (err.request) {
    //                 console.log("err.request ", err.request);
    //                 Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
    //             } else if (err.message) {
    //                 // do something other than the other two
    //                 Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
    //             }
    //         });
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

    // const valueSwitch = () => {
    //     if (status === "Active") {
    //         setChecked(true);
    //     } else {
    //         setChecked(false);
    //     }
    // }

    const columns = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tanggal Transaksi',
            dataIndex: 'age',
            key: 'age',
            width: '15%',
        },
        {
            title: 'Deskripsi',
            dataIndex: 'address',
            key: 'address',
            // width: '25%',
        },
        {
            title: 'Debit',
            dataIndex: 'age',
            key: 'address',
            width: '15%',
        },
        {
            title: 'Credit',
            dataIndex: 'age',
            key: 'address',
            width: '15%',
        },
        
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <a>Invite {record.name}</a>
        //             <a>Delete</a>
        //         </Space>
        //     ),
        // },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];

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
                title="Detail COA">
            </PageHeader>
                {/* <div className="text-title text-start mb-4">
                    <h5 className="title fw-bold">Detail COA</h5>
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
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kategori Akun</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={accountCategoryname}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Induk Akun</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="text"
                                    value={masterAccountName}
                                    disabled
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
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">
                            Entitas
                        </label>
                        <div className="col-sm-7">
                        <input
                            value={entity}
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                           disabled
                                />
                        </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Mata Uang</label>
                            <div className="col-sm-7">
                                <input
                                    value={currencyName}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
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
                                    disabled
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
                                    disabled
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
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-7">
                                <Switch defaultChecked={status} disabled onChange={onChange} />
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
            </form>

            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h5 className="title fw-bold">Detail COA</h5>
                </div>
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
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal Akhir</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    value={date}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end" role="group" aria-label="Basic mixed styles example">
                        <button
                            type="button"
                            className="btn btn-primary rounded m-1"
                            value="Submitted"
                        // onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>

            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h5 className="title fw-bold">Riwayat COA</h5>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Saldo Awal</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Saldo Awal..."
                                    cacheOptions
                                    defaultOptions
                                    // defaultInputValue={currencyName}
                                    value={selectedValue3}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCurrency}
                                // onChange={handleChangeCurrency}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Saldo Akhir</label>
                            <div className="col-sm-7">
                                <input
                                    // value={accountName}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                // onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Debit</label>
                            <div className="col-sm-7">
                                <input
                                    // value={accountName}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                // onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Credit</label>
                            <div className="col-sm-7">
                                <input
                                    // value={accountName}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                // onChange={(e) => setAccountName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={data}
                    />
                    {/* <div className="d-grid gap-2 d-md-flex justify-content-md-end" role="group" aria-label="Basic mixed styles example">
                        <button
                            type="button"
                            className="btn btn-primary rounded m-1"
                            value="Submitted"
                        // onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div> */}
                </div>
            </form>
        </>
    )
}

export default DetailCoa;