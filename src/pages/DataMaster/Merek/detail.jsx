import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PageHeader, Skeleton } from 'antd';

export const DetailMerek = () => {
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDetailTypes()
    }, [])

    const getDetailTypes = async () => {
        await axios.get(`${Url}/brands?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (res) {
                const getData = res.data.data[0]
                setData(getData);
                setLoading(false)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err)
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
                title="Detail Merek"
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
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Merek</label>
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

export default DetailMerek