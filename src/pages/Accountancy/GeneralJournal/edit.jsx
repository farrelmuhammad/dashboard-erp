import './form.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Space, Switch, Table , PageHeader} from 'antd'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import { formatRupiah } from '../../../utils/helper';
import ReactSelect from 'react-select';

const EditGeneralJournal = () => {
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
    const [checked, setChecked] = useState(false);
    const [status, setStatus] = useState('');

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

    const columns = [
        {
            title: 'Nama Akun',
            dataIndex: 'name',
            key: 'rekening',
            // render: (text, row) => <a>{row['date'] + "\n" + row["status"]}</a>,
        },
        {
            title: 'Debit',
            dataIndex: 'received',
            width: '20%',
            key: 'received',
            render: (text) => <div>{formatRupiah(text)}</div>,
        },
        {
            title: 'Kredit',
            dataIndex: 'pays',
            width: '20%',
            key: 'pays',
            render: (text) => <div>{formatRupiah(text)}</div>,
        },
        {
            title: '#',
            key: 'action',
            align: 'center',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        size='small'
                        type="danger"
                        icon={<DeleteOutlined />}
                    // onClick={() => deleteSalesOrder(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const options = [
        { value: 'Pelanggan', label: 'Pelanggan' },
        { value: 'Pemasok', label: 'Pemasok' },
    ]

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Edit Jurnal Umum">
            </PageHeader>
                {/* <div className="text-title text-start mb-4">
                    <h4 className="title fw-bold">Edit Jurnal Umum</h4>
                </div> */}
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Transaksi</label>
                            <div className="col-sm-7">
                                <input
                                    // value={getCode}
                                    value="Otomatis"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan/Pemasok</label>
                            <div className="col-sm-7">
                                <ReactSelect
                                    // value={optionsGroups.filter((obj) =>
                                    //     groups.includes(obj.value)
                                    // )}
                                    name="colors"
                                    options={options}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Pilih..."
                                    // onChange={handleMultipleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan/Pemasok..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                // loadOptions={loadOptionsCustomer}
                                // onChange={handleChangeCustomer}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                <textarea
                                    className="form-control"
                                    id="form4Example3"
                                    rows="4"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Pilih Akun</label>
                        <div className="col-sm-7">
                            <AsyncSelect
                                placeholder="Pilih Akun..."
                                cacheOptions
                                defaultOptions
                                value={selectedValue}
                                getOptionLabel={(e) => e.name}
                                getOptionValue={(e) => e.id}
                            // loadOptions={loadOptionsCustomer}
                            // onChange={handleChangeCustomer}
                            />
                        </div>
                    </div>
                    <Table
                        // components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        // dataSource={product}
                        columns={columns}
                    // onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div className="d-flex flex-row-reverse bd-highlight me-3">
                    <div className="p-2 bd-highlight">
                        <div className="col-sm-12">
                            <input
                                // defaultValue={subTotal}
                                readOnly="true"
                                type="number"
                                className="form-control form-control-sm"
                                id="colFormLabelSm"
                            // placeholder='(Total Qty X harga) per item + ... '
                            />
                        </div>
                    </div>
                    <div className="p-2 bd-highlight">
                        <label for="colFormLabelSm" className="col-sm-12 col-form-label col-form-label-sm">Total Debit</label>
                    </div>
                </div>
                <div className="d-flex flex-row-reverse bd-highlight me-3">
                    <div className="p-2 bd-highlight">
                        <div className="col-sm-12">
                            <input
                                // defaultValue={subTotal}
                                readOnly="true"
                                type="number"
                                className="form-control form-control-sm"
                                id="colFormLabelSm"
                            // placeholder='(Total Qty X harga) per item + ... '
                            />
                        </div>
                    </div>
                    <div className="p-2 bd-highlight">
                        <label for="colFormLabelSm" className="col-sm-12 col-form-label col-form-label-sm">Total Credit</label>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{float:"right", position:"relative"}}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                    // onClick={handleDraft}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                <div style={{clear:"both"}}></div>
            </form>
        </>
    )
}

export default EditGeneralJournal;