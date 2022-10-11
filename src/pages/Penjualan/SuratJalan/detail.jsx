import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import jsCookie from "js-cookie";
import axios from 'axios';
import Url from "../../../Config";;
import { Button, PageHeader, Skeleton, Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { EditOutlined } from '@ant-design/icons';

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
    const [loading, setLoading] = useState(true);

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
                setLoading(false)
                console.log(getData.delivery_note_details)
                // console.log(res.data.data.map(d => d.sales_order_details));
                // console.log(getData.map(d => d.sales_order_details));
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    if (loading) {
        return (
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        )
    }

    return (
        <>
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Surat Jalan"
                extra={[
                    <Link to={`/suratjalan/edit/${id}`}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                        />
                    </Link>,
                ]}
            >
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
            </PageHeader>

            <PageHeader
                ghost={false}
                title="Daftar Tally Sheet"
            >
                <Table
                    columns={columns}
                    dataSource={details}
                    pagination={false}
                    scroll={{
                        y: 200,
                    }}
                    size="middle"
                />
            </PageHeader>
        </>
    )
}

export default DetailSuratJalan