import React, { useEffect, useState } from 'react'
    ;
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../../../Config';
import { useSelector } from 'react-redux';
import { Button, PageHeader, Skeleton, Switch, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export const DetailProduk = () => {
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [pieces, setPieces] = useState('');
    const [group, setGroup] = useState('');
    const [category, setCategory] = useState('');
    const [grade, setGrade] = useState('');
    const [type, setType] = useState('');
    const [brands, setBrands] = useState('');
    const [packaging, setPackaging] = useState('');
    const [unit, setUnit] = useState('');
    const [buy_price, setBuy_price] = useState('');
    const [sell_price, setSell_price] = useState('');
    const [discount, setDiscount] = useState('');
    const [taxes, setTaxes] = useState('');
    const [status, setStatus] = useState('');

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
            .then((res) => {
                const getData = res.data.data[0]
                console.log(getData);
                setCode(getData.code)
                setName(getData.name || "")
                setAlias(getData.alias_name || "")
                setGroup(getData._group || "")
                setPieces(getData.piece.name || "")
                setCategory(getData.category.name || "")
                setGrade(getData.grade.name || "")
                setType(getData.type.name || "")
                setBrands(getData.brand.name || "")
                setUnit(getData.unit)
                setPackaging(getData.packaging_type || "")
                setBuy_price(getData.purchase_price || "")
                setSell_price(getData.selling_price || "")
                setDiscount(getData.discount || "")
                setTaxes(getData.tax.type) || ""
                setStatus(getData.status || "")
                // setLoading(false)
            })
            .catch((err) => {
                // Jika Gagal
                // console.log(err)
            })
            .finally((res) => {
                setLoading(false)
            })
    }

    if (loading) {
        return (
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        )
    }

    return (
        <>
            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Produk"
                extra={[
                    <Link to={`/produk/edit/${id}`}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                        />
                    </Link>,
                ]}
            >
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Kode</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                            value={code}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Nama Produk</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                            value={name}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Alias</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            value={alias}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Bagian</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="BagianSelect" className="form-select">
                            <option>{pieces}</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kategori</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="KategoriSelect" className="form-select">
                            <option>{category}</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Merek</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="MerekSelect" className="form-select">
                            <option>{brands}</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grup</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="GrupSelect" className="form-select">
                            <option>{group}</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Grade</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="GradeSelect" className="form-select">
                            <option>{grade}</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Tipe</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="TipeSelect" className="form-select">
                            <option>{type}</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Satuan</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            value={unit}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Packaging Type</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="MerekSelect" className="form-select">
                            <option>{packaging}</option>
                        </select>
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
                            disabled="true"
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                            value={buy_price}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Harga Jual</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            value={sell_price}
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
                                value={discount}
                                disabled
                            />
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Pajak</label>
                    <div className="col-sm-10">
                        <select disabled="true" id="PajakSelect" className="form-select">
                            <option>{taxes}</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                    <div className="col-sm-7">
                        {status === "Active" ? <Tag color="#108ee9">{status}</Tag> : <Tag color="#cf1322">Non-aktif</Tag>}
                    </div>
                </div>
            </PageHeader>
        </>
    )
}

export default DetailProduk