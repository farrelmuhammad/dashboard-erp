import axios from 'axios';
import jsCookie from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Url from '../../../Config';
import './form.css'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

const EditProduk = () => {
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [pieces_id, setPieces_id] = useState([]);
    const [group, setGroup] = useState([]);
    const [category_id, setCategory_id] = useState([]);
    const [grade_id, setGrade_id] = useState([]);
    const [type_id, setType_id] = useState([]);
    const [brands_id, setBrands_id] = useState([]);
    const [unit, setUnit] = useState('');
    const [buy_price, setBuy_price] = useState('');
    const [sell_price, setSell_price] = useState('');
    const [discount, setDiscount] = useState('');
    const [taxes_id, setTaxes_id] = useState([]);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const { id } = useParams();

    const [piecesData, setPiecesData] = useState();
    const [categoryData, setCategoryData] = useState();
    const [gradesData, setGradesData] = useState();
    const [typesData, setTypesData] = useState();
    const [brandsData, setBrandsData] = useState();
    const [taxesData, setTaxesData] = useState();

    const [data, setData] = useState();

    const handleUpdate = async e => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append('nama', name);
        userData.append('nama_alias', alias);
        userData.append('bagian', pieces_id);
        userData.append('grup', group);
        userData.append('kategori', category_id);
        userData.append('grade', grade_id);
        userData.append('tipe', type_id);
        userData.append('merk', brands_id);
        userData.append('satuan', unit);
        userData.append('harga_beli', buy_price);
        userData.append('harga_jual', sell_price);
        userData.append('diskon', discount);
        userData.append('pajak', taxes_id);
        userData.append('status', status);
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
                        text: err.response.data.error.nama,
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

    const getProductById = async () => {
        await axios.get(`${Url}/products?id=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }

        })
            .then(function (response) {
                const getData = response.data.data[0]
                setData(getData);
                setCode(getData.code)
                setName(getData.name)
                setAlias(getData.alias_name)
                setUnit(getData.unit)
                setBuy_price(getData.purchasing_price)
                setSell_price(getData.selling_price)
                setDiscount(getData.discount)
                setStatus(getData.status)
                setGroup(getData._group)
                console.log(response.data.data);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err)
            });
    }

    useEffect(() => {
        getProductById()

        axios.get(`${Url}/pieces`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => setPiecesData(res.data.data))

        axios.get(`${Url}/categories`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => setCategoryData(res.data.data))

        axios.get(`${Url}/grades`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => setGradesData(res.data.data))

        axios.get(`${Url}/types`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => setTypesData(res.data.data))

        axios.get(`${Url}/brands`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => setBrandsData(res.data.data))

        axios.get(`${Url}/taxes`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => setTaxesData(res.data.data))


    }, [])


    if (data && piecesData?.length > 0 & categoryData?.length > 0 & gradesData?.length > 0 & typesData?.length > 0 & brandsData?.length > 0 & taxesData?.length > 0) {
        return (
            <>
                <div>
                    <form className="  p-3 mb-3 bg-body rounded">
                        <div className="text-title text-start mb-4">
                            <h3 className="title fw-bold">Edit Produk</h3>
                        </div>
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
                                    readOnly
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
                                    readOnly
                                    onChange={e => setAlias(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grup</label>
                            <div className="col-sm-10">
                                <select onChange={e => setGroup(e.target.value)} id="Typeselect" className="form-select">
                                    <option>Pilih Grup</option>
                                    <option value="Lokal" selected={group === "Lokal"}>Lokal</option>
                                    <option value="Import" selected={group === "Import"}>Import</option>
                                    <option value="Meatshop" selected={group === "Meatshop"}>Meatshop</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Bagian</label>
                            <div className="col-sm-10">
                                <select onChange={e => setPieces_id(e.target.value)} id="BagianSelect" className="form-select">
                                    <option>Pilih Bagian</option>
                                    {piecesData?.map(d => {
                                        return (
                                            <option value={d.id} key={d.id}>{d.id}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kategori</label>
                            <div className="col-sm-10">
                                <select onChange={e => setCategory_id(e.target.value)} id="KategoriSelect" className="form-select">
                                    <option>Pilih Kategori</option>
                                    {categoryData?.map(d => {
                                        return (
                                            <option value={d.id} key={d.id}>{d.id}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grade</label>
                            <div className="col-sm-10">
                                <select onChange={e => setGrade_id(e.target.value)} id="GradeSelect" className="form-select">
                                    <option>Pilih Grade</option>
                                    {gradesData?.map(d => {
                                        return (
                                            <option value={d.id} key={d.id}>{d.id}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Tipe</label>
                            <div className="col-sm-10">
                                <select onChange={e => setType_id(e.target.value)} id="TypeSelect" className="form-select">
                                    <option>Pilih Tipe</option>
                                    {typesData?.map(d => {
                                        return (
                                            <option value={d.id} key={d.id}>{d.id}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Merek</label>
                            <div className="col-sm-10">
                                <select onChange={e => setBrands_id(e.target.value)} id="MerekSelect" className="form-select">
                                    <option>Pilih Merek</option>
                                    {brandsData?.map(d => {
                                        return (
                                            <option value={d.id} key={d.id}>{d.id}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Satuan</label>
                            <div className="col-sm-10">
                                <select onChange={e => setUnit(e.target.value)} id="Typeselect" className="form-select">
                                    <option>Pilih Satuan</option>
                                    <option value="kg" selected={unit === "kg"}>Kg</option>
                                    <option value="pack" selected={unit === "pack"}>Pack</option>
                                    <option value="ekor" selected={unit === "ekor"}>Ekor</option>
                                </select>
                                {/* <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    defaultValue={unit}
                                    onChange={e => setUnit(e.target.value)}
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                                Packaging Type
                            </label>
                            <div className="col-sm-10">

                                <select onChange={e => setUnit(e.target.value)} id="Typeselect" className="form-select">
                                    <option>Pilih Tipe</option>
                                    <option value="kg">Kg</option>
                                    <option value="pack">Pack</option>
                                    <option value="ekor">Ekor</option>
                                </select>
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Keterangan</label>
                    <div className="col-sm-10">
                    <textarea className="form-control" id="form4Example3" rows="4"/>
                    </div>
                </div> */}
                    </form>
                    <form className="  p-3 mb-3 bg-body rounded">
                        <div className="text-title text-start mb-4">
                            <h3 className="title fw-bold">Lain-lain</h3>
                        </div>
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
                            <div className="col-sm-5">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    defaultValue={discount}
                                    onChange={e => setDiscount(e.target.value)}
                                />
                            </div>
                            <div className="col-sm-1">
                                <span className="input-group-text" id="addon-wrapping">%</span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Pajak</label>
                            <div className="col-sm-10">
                                <select onChange={e => setTaxes_id(e.target.value)} id="PajakSelect" className="form-select">
                                    <option>Pilih Pajak</option>
                                    {taxesData?.map(d => {
                                        return (
                                            <option value={d.id} key={d.id}>{d.id}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <fieldset className="row mb-3">
                            <legend className="col-form-label col-sm-2 pt-0">Status</legend>
                            <div className="col-sm-10">
                                <div className="form-check">
                                    <input onChange={e => setStatus(e.target.value)} value="Active" checked={status === 'Active'} className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" />
                                    <label className="form-check-label" htmlFor="gridRadios1">
                                        Aktif
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input onChange={e => setStatus(e.target.value)} value="Inactive" checked={status === 'Inactive'} className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" />
                                    <label className="form-check-label" htmlFor="gridRadios2">
                                        Arsip
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button onClick={handleUpdate} variant="contained" endIcon={<SendIcon />}>
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </>
        )
    } else {
        return (
            <h1>Loading data</h1>
        )
    }

}


export default EditProduk