import React, { useEffect, useState } from 'react'
import jsCookie from "js-cookie";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../../../Config';
import { useSelector } from 'react-redux';
import { PageHeader, Skeleton } from 'antd';

export const DetailKategori = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDetailCategory()
    }, [])

    const getDetailCategory = async () => {
        await axios.get(`${Url}/categories?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0]
                setData(getData)
                setLoading(false)
            });
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
                title="Detail Kategori"
            >
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Kode</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                            value={data.code}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Kategori</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            value={data.name}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Keterangan</label>
                    <div className="col-sm-10">
                        <textarea
                            disabled="true"
                            className="form-control"
                            id="form4Example3"
                            rows="4"
                            value={data.description}
                        />
                    </div>
                </div>
            </PageHeader>
        </>
    )
}

export default DetailKategori