import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Url from '../../../Config';
import './form.css'
import { useSelector } from 'react-redux';
import { Button, PageHeader, Radio, Skeleton, Switch } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import AsyncSelect from "react-select/async";
import ReactSelect from 'react-select';


const EditProduk = () => {
    const auth = useSelector(state => state.auth);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [pieces_id, setPieces_id] = useState('');
    const [pieces_name, setPieces_name] = useState('');
    const [group, setGroup] = useState('');
    const [category_id, setCategory_id] = useState('');
    const [category_name, setCategory_name] = useState('');
    const [grade_id, setGrade_id] = useState('');
    const [grade_name, setGrade_name] = useState('');
    const [type_id, setType_id] = useState('');
    const [type_name, setType_name] = useState('');
    const [brands_id, setBrands_id] = useState('');
    const [brands_name, setBrands_name] = useState('');
    const [packaging_id, setPackaging_id] = useState('');
    const [unit, setUnit] = useState('');
    const [buy_price, setBuy_price] = useState(0);
    const [sell_price, setSell_price] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [taxes_id, setTaxes_id] = useState('');
    const [taxes_name, setTaxes_name] = useState('');
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const { id } = useParams();

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);

    const [selectedValue, setSelectedPieces] = useState(null);
    const [selectedValue2, setSelectedCategory] = useState(null);
    const [selectedValue3, setSelectedGrades] = useState(null);
    const [selectedValue4, setSelectedTypes] = useState(null);
    const [selectedValue5, setSelectedBrands] = useState(null);
    const [selectedValue6, setSelectedTaxes] = useState(null);
    const [selectedValue7, setSelectedPackaging] = useState(null);

    const onChange = () => {
        checked ? setChecked(false) : setChecked(true)

        if (checked === false) {
            setStatus("Inactive");
            // console.log('Active');
        } else {
            setStatus("Active");
            // console.log('Inactive');
        }
    };

    const handleChangePieces = (value) => {
        setSelectedPieces(value);
        setPieces_id(value.id);
    };
    // load options using API call
    const loadOptionsPieces = (inputValue) => {
        return fetch(`${Url}/select_pieces?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeCategory = (value) => {
        setSelectedCategory(value);
        setCategory_id(value.id);
    };
    // load options using API call
    const loadOptionsCategory = (inputValue) => {
        return fetch(`${Url}/select_categories?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeGrades = (value) => {
        setSelectedGrades(value);
        setGrade_id(value.id);
    };
    // load options using API call
    const loadOptionsGrades = (inputValue) => {
        return fetch(`${Url}/select_grades?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeTypes = (value) => {
        setSelectedTypes(value);
        setType_id(value.id);
    };
    // load options using API call
    const loadOptionsTypes = (inputValue) => {
        return fetch(`${Url}/select_types?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeBrands = (value) => {
        setSelectedBrands(value);
        setBrands_id(value.id);
    };
    // load options using API call
    const loadOptionsBrands = (inputValue) => {
        return fetch(`${Url}/select_brands?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeTaxes = (value) => {
        setSelectedTaxes(value);
        setTaxes_id(value.id);
    };
    // load options using API call
    const loadOptionsTaxes = (inputValue) => {
        return fetch(`${Url}/select_taxes?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangePackaging = (value) => {
        setSelectedPackaging(value);
        setPackaging_id(value.name);
    };
    // load options using API call
    const loadOptionsPackaging = (inputValue) => {
        return fetch(`${Url}/select_packaging_types?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleUpdate = async e => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("bagian", pieces_id);
        userData.append("grup", group);
        userData.append("kategori", category_id);
        userData.append("grade", grade_id);
        userData.append("tipe", type_id);
        userData.append("merk", brands_id);
        userData.append("satuan", unit);
        userData.append("harga_beli", buy_price);
        userData.append("harga_jual", sell_price);
        userData.append("diskon", discount);
        userData.append("pajak", taxes_id);
        userData.append("jenis_kemasan", packaging_id);
        userData.append("status", status);

        // for (var pair of userData.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: 'put',
            url: `${Url}/products/${id}`,
            data: userData,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(function (res) {
                //handle success
                Swal.fire(
                    'Berhasil Di Update',
                    `${code} Masuk dalam list`,
                    'success'
                )
                navigate('/produk')
            })
            .catch(err => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire(
                        'Gagal Ditambahkan',
                        'Mohon Cek Dahulu..',
                        'error'
                    )
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire(
                        'Gagal Ditambahkan',
                        'Mohon Cek Dahulu..',
                        'error'
                    )
                }
            })
    }

    useEffect(() => {
        getProductById()
    }, [])

    const getProductById = async () => {
        await axios.get(`${Url}/products?id=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((response) => {
                const getData = response.data.data[0]
                setCode(getData.code)
                setLoading(false)

                console.log(getData)

                setName(getData.name)
                setAlias(getData.alias_name)
                setPieces_id(getData.piece ? getData.piece.id : "")
                setPieces_name(getData.piece ?  getData.piece.name : "")
                setCategory_id(getData.category ? getData.category.id : "")
                setCategory_name(getData.category ? getData.category.name : "")
                setGrade_id(getData.grade? getData.grade.id : "")
                setGrade_name(getData.grade ? getData.grade.name : "")
                setType_id(getData.type ? getData.type.id : "")
                setType_name(getData.type ? getData.type.name : "")
                setBrands_id(getData.brand ? getData.brand.id : "")
                setBrands_name(getData.brand ? getData.brand.name : "")
                setPackaging_id(getData.packaging_type)
                setTaxes_id(getData.tax ? getData.tax.id : "")
                setTaxes_name(getData.tax ? getData.tax.type : "")
                setUnit(getData.unit)
                setBuy_price(getData.purchase_price || "0")
                setSell_price(getData.selling_price || "0")
                setDiscount(getData.discount || "0")
                setStatus(getData.status)
                setGroup(getData._group)
            })
            .catch((err) => {
                // Jika Gagal
                // console.log(err)
            })
            .finally((res) => {
                setLoading(false)
            })
    }

    const optionsStatus = [
        {
            label: 'Aktif',
            value: 'Active',
        },
        {
            label: 'Nonaktif',
            value: 'Inactive',
        },
    ];

    const onChange4 = ({ target: { value } }) => {
        console.log('radio4 checked', value);
        setStatus(value);
    };

    const optionsGroup = [
        {
            label: "Lokal",
            value: "Lokal"
        },
        {
            label: "Impor",
            value: "Impor"
        },
        {
            label: "Meat Shop",
            value: "Meat Shop"
        }
    ];

    const optionsUnit = [
        {
            label: "Kg",
            value: "kg"
        },
        {
            label: "Ekor",
            value: "ekor"
        },
        {
            label: "Pack",
            value: "pack"
        }
    ];

    const handleSingleChange = (value) => {
        setGroup(value.value);
    };

    const handleSingleChange1 = (value) => {
        setUnit(value.value)
    };

    if (loading) {
        return (
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        )
    }

    return (
        <>
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Edit Produk"
            >
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Kode</label>
                    <div className="col-sm-10">
                        <input
                            type="kode"
                            className="form-control"
                            value={code}
                            disabled
                            id="inputKode3"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Nama Produk</label>
                    <div className="col-sm-10">
                        <input
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                            defaultValue={name}
                            disabled
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Alias</label>
                    <div className="col-sm-10">
                        <input
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            defaultValue={alias}
                            disabled
                            onChange={e => setAlias(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Bagian</label>
                    <div className="col-sm-10">
                        <AsyncSelect
                            placeholder="Pilih Bagian..."
                            cacheOptions
                            defaultOptions
                            isClearables
                            defaultInputValue={pieces_name}
                            value={selectedValue}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsPieces}
                            onChange={handleChangePieces}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Merek</label>
                    <div className="col-sm-10">
                        <AsyncSelect
                            placeholder="Pilih Merek..."
                            cacheOptions
                            defaultOptions
                            isClearable
                            defaultInputValue={brands_name}
                            value={selectedValue5}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsBrands}
                            onChange={handleChangeBrands}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kategori</label>
                    <div className="col-sm-10">
                        <AsyncSelect
                            placeholder="Pilih Kategori..."
                            cacheOptions
                            defaultOptions
                            isClearable
                            defaultInputValue={category_name}
                            value={selectedValue2}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsCategory}
                            onChange={handleChangeCategory}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grup</label>
                    <div className="col-sm-10">
                        <ReactSelect
                            className="basic-single"
                            placeholder="Pilih Grup..."
                            classNamePrefix="select"
                            isSearchable
                            getOptionLabel={(value) => value.label}
                            getOptionValue={(value) => value.value}
                            defaultInputValue={group}
                            onChange={handleSingleChange}
                            options={optionsGroup}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grade</label>
                    <div className="col-sm-10">
                        <AsyncSelect
                            placeholder="Pilih Grade..."
                            cacheOptions
                            defaultOptions
                            isClearable
                            defaultInputValue={grade_name}
                            value={selectedValue3}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsGrades}
                            onChange={handleChangeGrades}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Tipe</label>
                    <div className="col-sm-10">
                        <AsyncSelect
                            placeholder="Pilih Tipe..."
                            cacheOptions
                            defaultOptions
                            isClearable
                            defaultInputValue={type_name}
                            value={selectedValue4}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsTypes}
                            onChange={handleChangeTypes}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Satuan</label>
                    <div className="col-sm-10">
                        <ReactSelect
                            className="basic-single"
                            placeholder="Pilih Satuan..."
                            classNamePrefix="select"
                            isSearchable
                            // getOptionLabel={(value) => value.label}
                            // getOptionValue={(value) => value.value}
                            defaultValue={{ label: unit, value: unit }}
                            onChange={handleSingleChange1}
                            options={optionsUnit}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                        Packaging Type
                    </label>
                    <div className="col-sm-10">
                        <AsyncSelect
                            placeholder="Pilih..."
                            cacheOptions
                            defaultOptions
                            isClearable
                            defaultInputValue={packaging_id}
                            value={selectedValue7}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsPackaging}
                            onChange={handleChangePackaging}
                        />
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                className="bg-body rounded mb-2"
                title="Lain - lain"
            >
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Harga Beli</label>
                    <div className="col-sm-10">
                        <input
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                            defaultValue={buy_price}
                            onChange={e => setBuy_price(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Harga Jual</label>
                    <div className="col-sm-10">
                        <input
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            defaultValue={sell_price}
                            onChange={e => setSell_price(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Diskon</label>
                    <div className="col-sm-2">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Dollar amount (with dot and two decimal places)"
                                defaultValue={0}
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Pajak</label>
                    <div className="col-sm-10">
                        <AsyncSelect
                            placeholder="Pilih Pajak..."
                            cacheOptions
                            defaultOptions
                            isClearable
                            defaultInputValue={taxes_name}
                            value={selectedValue6}
                            getOptionLabel={(e) => e.type}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsTaxes}
                            onChange={handleChangeTaxes}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                    <div className="col-sm-7">
                        <Radio.Group
                            options={optionsStatus}
                            onChange={onChange4}
                            value={status}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        size="large"
                        onClick={handleUpdate}
                    >
                        Submit
                    </Button>
                </div>
            </PageHeader>
        </>
    )
}



export default EditProduk