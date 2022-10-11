import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import jsCookie from "js-cookie";
import axios from 'axios';
import Url from '../../../Config';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';

export const DetailPajak = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);

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
                setData(res.data.data);
            })
            .catch((err) => {
                // Jika Gagal
            });
    }

    return (
        <>
         <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Pajak">
        </PageHeader>
            <form className="  p-3 mb-5 bg-body rounded">
              
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Kode</label>
                    <div className="col-sm-10">
                        {data?.map((d) => (
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
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Pajak</label>
                    <div className="col-sm-10">
                        {data?.map((d) => (
                            <input
                                disabled="true"
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                value={d.type}
                            />
                        ))}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Persentase</label>
                    <div className="col-sm-5">
                        {data?.map((d) => (
                            <input
                                disabled="true"
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                value={d.rate}
                            />
                        ))}
                    </div>
                    <div className="col-sm-1">
                        <span className="input-group-text" id="addon-wrapping">%</span>
                    </div>
                </div>
            </form>
        </>
    )
}

export default DetailPajak