import React ,{useEffect, useState} from 'react'
import jsCookie from 'js-cookie';
import { useSelector } from 'react-redux';
import { PageHeader} from 'antd';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../../../Config';
// import { useEffect } from 'react';

export const DetailGrup = () => {
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);


    useEffect(() => {
        getGrupById()
       
    }, []);

    const getGrupById = async () => {
        await axios
            .get(`${Url}/groups?id=${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            .then(function (response) {
                setData(response.data.data[0]);
                console.log(response.data.data[0])
                // setGroups(response.data.data[0].groups);
                // console.log(response.data.data[0].groups)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    };

    return (
        <>
         <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Grup Pengguna">
          </PageHeader>

            <form className="  p-3 mb-5 bg-body rounded">
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
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Grup</label>
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
            </form>
        </>
    )
}

export default DetailGrup