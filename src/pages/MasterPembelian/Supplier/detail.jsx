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
import { PageHeader, Radio, Skeleton, Table, Tag } from "antd";

const DetailSupplier = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    getDetailSupplier()
  }, []);

  const getDetailSupplier = async () => {
    await axios.get(`${Url}/suppliers?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        setLoading(false)
        const getData = res.data.data[0]
        setData(getData);
        console.log(getData)
        setDataSource(res.data.data[0].supplier_addresses);
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
    },
    {
      title: 'Kelurahan',
      dataIndex: 'urban_village',
    },
    {
      title: 'Kecamatan',
      dataIndex: 'sub_district',
    },
    {
      title: 'Kota',
      dataIndex: 'city',
    },
    {
      title: 'Kode Pos',
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
        title="Detail Supplier"
      >
        <div className="row mb-3">
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
            Grup
          </label>
          <div className="col-sm-10">
            <select
              id="grupSelect"
              className="form-select"
              disabled
            >
              <option>{data._group}</option>
            </select>
          </div>
        </div>
        <fieldset className="row mb-3">
          <legend className="col-form-label col-sm-2 pt-0">Status</legend>
          <div className="col-sm-10">
            {data.status === 'Active' ? <Tag color="blue">{data.status}</Tag> : <Tag color="red">{data.status}</Tag>}
          </div>
        </fieldset>
      </PageHeader>

      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        title="Alamat Supplier"
      >
        <Table
          size="small"
          // components={components}
          // rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </PageHeader>
    </>
  );
};

export default DetailSupplier;
