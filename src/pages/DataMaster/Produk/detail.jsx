import React, { useEffect, useState } from 'react'
;
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../../../Config';
import { useSelector } from 'react-redux';

export const DetailProduk = () => {
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        getDetailProducts();
    }, [])

    const getDetailProducts = async () => {
        await axios.get(`${Url}/products?id=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(function (response) {
                setData(response.data.data);
                console.log(response.data.data);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err)
            });
    }

    if (data) {
        return (
            <>
                <form className="  p-3 mb-3 bg-body rounded">
                    <div className="text-title text-start mb-4">
                        <h3 className="title fw-bold">Detail Produk</h3>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Kode</label>
                        <div className="col-sm-10">
                            {data.map((d) => (
                                <input
                                    disabled="true"
                                    type="kode"
                                    className="form-control"
                                    id="inputKode3"
                                    value={d.code}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Nama Produk</label>
                        <div className="col-sm-10">
                            {data.map((d) => (
                                <input
                                    disabled="true"
                                    type="kode"
                                    className="form-control"
                                    id="inputKode3"
                                    value={d.name}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Alias</label>
                        <div className="col-sm-10">
                            {data.map((d) => (
                                <input
                                    disabled="true"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={d.alias_name}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grup</label>
                        <div className="col-sm-10">
                            <select disabled="true" id="GrupSelect" className="form-select">
                                {data.map((d) => (
                                    <option>{d._group}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Bagian</label>
                        <div className="col-sm-10">
                            <select disabled="true" id="BagianSelect" className="form-select">
                                {data.map((d) => (
                                    <option>{d.piece_id}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kategori</label>
                        <div className="col-sm-10">
                            <select disabled="true" id="KategoriSelect" className="form-select">
                                {data.map((d) => (
                                    <option>{d.category_id}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grade</label>
                        <div className="col-sm-10">
                            <select disabled="true" id="GradeSelect" className="form-select">
                                {data.map((d) => (
                                    <option>{d.grade_id}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Tipe</label>
                        <div className="col-sm-10">
                            <select disabled="true" id="TipeSelect" className="form-select">
                                {data.map((d) => (
                                    <option>{d.type_id}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Merek</label>
                        <div className="col-sm-10">
                            <select disabled="true" id="MerekSelect" className="form-select">
                                {data.map((d) => (
                                    <option>{d.brand_id}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Satuan</label>
                        <div className="col-sm-10">
                            {data.map((d) => (
                                <input
                                    disabled="true"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={d.unit}
                                />
                            ))}
                        </div>
                    </div>
                </form>
                <form className="  p-3 mb-3 bg-body rounded">
                    <div className="text-title text-start mb-4">
                        <h3 className="title fw-bold">Lain-lain</h3>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Harga Beli</label>
                        <div className="col-sm-10">
                            {data.map((d) => (
                                <input
                                    disabled="true"
                                    type="kode"
                                    className="form-control"
                                    id="inputKode3"
                                    value={d.purchase_price}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Harga Jual</label>
                        <div className="col-sm-10">
                            {data.map((d) => (
                                <input
                                    disabled="true"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={d.selling_price}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Diskon</label>
                        <div className="col-sm-5">
                            {data.map((d) => (
                                <input
                                    disabled="true"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={d.discount}
                                />
                            ))}
                        </div>
                        <div className="col-sm-1">
                            <span className="input-group-text" id="addon-wrapping">%</span>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Pajak</label>
                        <div className="col-sm-10">
                            <select disabled="true" id="PajakSelect" className="form-select">
                                {data.map((d) => (
                                    <option>{d.tax_id}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <fieldset className="row mb-3">
                        <legend className="col-form-label col-sm-2 pt-0">Status</legend>
                        <div className="col-sm-10">
                            {data.map((d) => {
                                if (d.status === "Active") {
                                    return (
                                        <h3 className="badge bg-primary text-center m-1">
                                            {d.status}
                                        </h3>
                                    )
                                } else {
                                    return (
                                        <h3 className="badge bg-danger text-center m-1">
                                            {d.status}
                                        </h3>
                                    )
                                }
                            }
                            )}
                            {/* <div className="form-check">
                                <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked />
                                <label className="form-check-label" htmlFor="gridRadios1">
                                    Aktif
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2" />
                                <label className="form-check-label" htmlFor="gridRadios2">
                                    Arsip
                                </label>
                            </div> */}
                        </div>
                    </fieldset>
                </form>
            </>
        )
    } else {
        return (
            <h1>Loading Data</h1>
        )
    }
}

export default DetailProduk