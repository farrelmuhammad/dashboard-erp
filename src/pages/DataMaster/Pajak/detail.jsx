import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../../../Config';
import { useSelector } from 'react-redux';
import { PageHeader, Skeleton } from 'antd';

export const DetailPajak = () => {
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDetailTaxes()
    }, [])

    const getDetailTaxes = async () => {
        await axios.get(`${Url}/taxes?id=${id}`, {
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
                title="Detail Pajak"
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
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Pajak</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            value={data.type}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Persentase</label>
                    <div className="col-sm-5">
                        <input
                            disabled="true"
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                            value={data.rate}
                        />
                    </div>
                    <div className="col-sm-1">
                        <span className="input-group-text" id="addon-wrapping">%</span>
                    </div>
                </div>
            </PageHeader>
        </>
    )
}

export default DetailPajak