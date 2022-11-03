import axios from "axios";
// import MaterialTable from "material-table";
import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { PageHeader, Skeleton, Switch, Table, Tag } from "antd";

const DetailPelanggan = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [address, setAddress] = useState([]);

  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDetailCustomer()
  }, []);

  const getDetailCustomer = async () => {
    await axios.get(`${Url}/customers?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        const getData = res.data.data[0]
        setData(getData);
        setStatus(getData.status)
        setLoading(false);
        setAddress(getData.customer_addresses)
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }

  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      width: '3%',
      align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      width: '30%',
      editable: true,
    },
    {
      title: 'Kelurahan',
      editable: true,
      dataIndex: 'urban_village',
    },
    {
      title: 'Kecamatan',
      editable: true,
      dataIndex: 'sub_district',
    },
    {
      title: 'Kota',
      editable: true,
      dataIndex: 'city',
    },
    {
      title: 'Kode Pos',
      editable: true,
      dataIndex: 'postal_code',
    },
  ];

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
        ghost={false}
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Detail Pelanggan">
        <div className="row mb-3"
        >
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              id="inputKode3"
              value={data.code}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Pelanggan
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.name}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            No Telepon
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.phone_number}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.email}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            NPWP
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.npwp}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Badan Usaha
          </label>
          <div className="col-sm-10">
            <select
              id="bussinessSelect"
              className="form-select"
              disabled
            >
              <option>{data.business_entity}</option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Termin
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.term}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Diskon
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.discount}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
          <div className="col-sm-7">
            {data.status === 'Active' ? <Tag color="blue">{data.status}</Tag> : <Tag color="red">{data.status}</Tag>}
          </div>
        </div>
      </PageHeader>

      <PageHeader
        ghost={false}
        className="bg-body rounded"
        title="Alamat Pelanggan"
      >
        <Table
          size="small"
          columns={columns}
          dataSource={address}
        />
      </PageHeader>
    </>
  );
};

export default DetailPelanggan;
