import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import jsCookie from "js-cookie";
import Url from '../../../Config';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';

export const DetailBagian = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        getDetailPieces()
    }, [])

    const getDetailPieces = async () => {
        await axios.get(`${Url}/pieces?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                setData(response.data.data);
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
          title="Detail Bagian">
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
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Bagian</label>
                    <div className="col-sm-10">
                        {data?.map((d) => (
                            <input
                                disabled="true"
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                value={d.name}
                            />
                        ))}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Keterangan</label>
                    <div className="col-sm-10">
                        {data?.map((d) => (
                            <textarea
                                disabled="true"
                                className="form-control"
                                id="form4Example3"
                                rows="4"
                                value={d.description}
                            />
                        ))}
                    </div>
                </div>
            </form>
        </>
    )
}

export default DetailBagian