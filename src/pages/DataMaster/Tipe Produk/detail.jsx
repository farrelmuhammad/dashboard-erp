import React, { useEffect, useState } from 'react'
import jsCookie from "js-cookie";
import { useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PageHeader } from 'antd';


export const DetailTipeProduk = () => {
    // const token = jsCookie.get("auth");
    const { id } = useParams();
    const [data, setData] = useState([]);
    const auth = useSelector(state => state.auth);


    useEffect(() => {
        getDetailTypes()
    }, [])

    const getDetailTypes = async () => {
        await axios.get(`${Url}/types?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
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
          <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Tipe Produk">
        </PageHeader>
                <form className="  p-3 mb-5 bg-body rounded">
                    
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
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Tipe Produk</label>
                        <div className="col-sm-10">
                            {data.map((d) => (
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
                            {data.map((d) => (
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
    } else {
        return (
            <h1>Loading Data</h1>
        )
    }
}

export default DetailTipeProduk