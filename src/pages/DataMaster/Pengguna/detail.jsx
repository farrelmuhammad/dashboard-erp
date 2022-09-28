import React, { useEffect, useState } from 'react'
import jsCookie from "js-cookie";
import ReactSelect from 'react-select';
import AsyncSelect from "react-select/async";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Url from '../../../Config';
import { useSelector } from 'react-redux';

export const DetailPengguna = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsData, setGroupsData] = useState([]);

    useEffect(() => {
        getUserById()
        getGroups();
    }, []);

    const getUserById = async () => {
        await axios
            .get(`${Url}/users?id=${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            .then(function (response) {
                setData(response.data.data);
                console.log(response.data.data)
                setGroups(response.data.data[0].groups);
                // console.log(response.data.data[0].groups)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    };

    const getGroups = async () => {
        await axios
            .get(`${Url}/groups`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            .then((res) => setGroupsData(res.data.data))
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    };


    const optionsGroups = groupsData.map((d) => {
        return {
            label: d.name,
            value: d.code,
        };
    });

    return (
        <>
            <form className="  p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Edit Pengguna</h3>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                        Karyawan
                    </label>
                    <div className="col-sm-10">
                        <select
                            id="bussinessSelect"
                            className="form-select"
                            disabled
                        >
                            {data.map((d) => {
                                if (!d.employee_id) {
                                    return (
                                        <option>No Data</option>
                                    )
                                } else {
                                    return (
                                        <option>{d.employee_id}</option>
                                    )
                                }
                            }
                            )}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                        Grup
                    </label>
                    <div className="col-sm-10">
                        <ReactSelect
                            selectOption={groups}
                            value={optionsGroups.filter((obj) =>
                                groups.includes(obj.value)
                            )}
                            isMulti
                            isDisabled
                            name="colors"
                            options={optionsGroups}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
                        Kode
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                            value={id}
                            disabled
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                        Username
                    </label>
                    <div className="col-sm-10">
                        {data?.map((d) => (
                            <input
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                value={d.username}
                                disabled
                            />
                        ))}
                    </div>
                </div>
                {/* <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                        Kata Sandi
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="password"
                            className="form-control"
                            id="inputpassword"
                        //   defaultValue={data.password}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                        Konfirmasi Kata Sandi
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="password"
                            className="form-control"
                            id="inputconfirmpassword"
                        />
                    </div>
                </div> */}
            </form>

        </>
    )
}

export default DetailPengguna