import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Url from '../../../Config';
import './form.css'
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const EditGrup = () => {
    const auth = useSelector(state => state.auth);
    const [kode, setKode] = useState();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState();
    const [isLoading, setisLoading] = useState(false);
    const [isError, setisError] = useState(false);

    const handleUpdate = async e => {
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append('id', kode);
        userData.append('nama', name);
        userData.append('deskripsi', description);
        axios({
            method: 'put',
            url: `${Url}/groups/${id}`,
            data: userData,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(function (response) {
                //handle success
                console.log(response)
                Swal.fire(
                    'Berhasil Di Update',
                    `${id} Masuk dalam list`,
                    'success'
                )
                navigate('/grup')
            })
            .catch(err => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire(
                        'Gagal Ditambahkan',
                        'Mohon Cek Dahulu..',
                        'error'
                    )
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire(
                        'Gagal Ditambahkan',
                        'Mohon Cek Dahulu..',
                        'error'
                    )
                }
            })
    }

    useEffect(() => {
        setisLoading(true);
        axios.get(`${Url}/groups?kode=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }

        })
            .then(function (response) {
                setData(response.data.data);
                setisLoading(false);
                console.log(response.data.data);
            })
            .catch((err) => {
                // Jika Gagal
                setisError(true);
                setisLoading(false);
            });

    }, [])

    if (isLoading) return <h1>Loading data</h1>;
    else if (data && !isError)

        return (
            <>
                <form className="  p-3 mb-3 bg-body rounded">
                    <div className="text-title text-start mb-4">
                        <h3 className="title fw-bold">Edit Grup Pengguna</h3>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Kode</label>
                        <div className="col-sm-10">
                            <input
                                type="kode"
                                className="form-control"
                                id="inputKode3"
                                value={id}
                                onChange={e => setKode(e.target.value)} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Grup</label>
                        <div className="col-sm-10">
                            {data?.map((data) => (
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    defaultValue={data.name}
                                    onChange={e => setName(e.target.value)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Keterangan</label>
                        <div className="col-sm-10">
                            {data?.map((data) => (
                                <textarea
                                    className="form-control"
                                    id="form4Example3"
                                    rows="4"
                                    defaultValue={data.description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            size="large"
                            onClick={handleUpdate}
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </>
        )
}

export default EditGrup