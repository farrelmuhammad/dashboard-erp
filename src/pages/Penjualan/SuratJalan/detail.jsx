import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import jsCookie from "js-cookie";
import axios from 'axios';
import Url from "../../../Config";;
import { Table, Tag } from 'antd';
import { useSelector } from 'react-redux';

export const DetailSuratJalan = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const { id } = useParams();
    const [dataSO, setDataSO] = useState([]);
    const [code, setCode] = useState('');
    const [date, setDate] = useState('');
    const [customer, setCustomer] = useState([]);
    const [address, setAddress] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [sender, setSender] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState([]);
    const [details, setDetails] = useState([]);
    const [taxInclude, setTaxInclude] = useState("");

    const columns = [
        {
            title: 'No.',
            width: '4%',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama Alias Produk',
            width: '25%',
            dataIndex: 'product_alias_name',
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
            width: '25%',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            width: '10%',
            align: 'center',
        },
    ];

    useEffect(() => {
        getDataSOById()
    }, [])

    const getDataSOById = async () => {
        await axios.get(`${Url}/delivery_notes?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                setDataSO(getData);
                setCode(getData.code)
                setDate(getData.date)
                setCustomer(getData.customer.name)
                setAddress(getData.customer_address_id)
                setVehicle(getData.vehicle)
                setSender(getData.sender)
                setNotes(getData.notes)
                setStatus(getData.status)
                setDetails(getData.delivery_note_details)
                console.log(getData.delivery_note_details)
                // console.log(res.data.data.map(d => d.sales_order_details));
                // console.log(getData.map(d => d.sales_order_details));
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="row">
                    <div className="col text-title text-start">
                        <div className="text-title text-start mb-4">
                            <h3 className="title fw-bold">Detail Pesanan</h3>
                        </div>
                    </div>
                    <div className="col button-add text-end me-3">
                        <button type="button" class="btn btn-warning rounded m-1">
                            Cetak
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    disabled="true"
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    value={date}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                <input
                                    disabled="true"
                                    type="text"
                                    className="form-control"
                                    id="inputNama3"
                                    value={code}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                            <div className="col-sm-7">
                                <select disabled="true" id="PelangganSelect" className="form-select">
                                    <option>{customer}</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <select disabled="true" id="PelangganSelect" className="form-select">
                                    <option>{address}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div className="col">
                            <div className="row mb-3">
                                <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Kendaraan</label>
                                <div className="col-sm-7">
                                    <input
                                        value={vehicle}
                                        type="Nama"
                                        className="form-control"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pengirim</label>
                                <div className="col-sm-7">
                                    <input
                                        value={sender}
                                        type="Nama"
                                        disabled
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Catatan</label>
                                <div className="col-sm-7">
                                    <input
                                        value={notes}
                                        type="Nama"
                                        disabled
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
                                <div className="col-sm-7 p-2">
                                    {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div class="row">
                        <div class="col">
                            <h4 className="title fw-normal">Daftar Produk</h4>
                        </div>
                        {/* <div class="col-sm-3 me-5">
                            <div class="input-group">
                                <input disabled="true" type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Type..." />
                                <div class="input-group-text">Search</div>
                            </div>
                        </div> */}
                    </div>
                    <Table
                        columns={columns}
                        dataSource={details}
                        pagination={false}
                        scroll={{
                            y: 200,
                        }}
                        size="middle"
                    />
                </div>
            </form>
        </>
    )
}

export default DetailSuratJalan