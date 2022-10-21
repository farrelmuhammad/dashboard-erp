// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Url from "../../../Config";
import "./form.css";
import { PageHeader, Skeleton, Switch, Tag } from "antd";

export const DetailKaryawan = () => {
  // const auth.token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const { id } = useParams();

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };

  useEffect(() => {
    axios
      .get(`${Url}/employees?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        const getData = res.data.data[0]
        setData(getData);
        setStatus(getData.status)
        setDepartment(getData.department.name)
        setPosition(getData.position.name)
        setLoading(false)
        console.log(getData);
      });
  }, []);

  if (loading) {
    return (
      <>
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
        onBack={() => window.history.back()}
        className="bg-body rounded mb-2"
        title="Detail Karyawan">
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              value={data.code}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            NIP
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              disabled
              value={data.nip}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            NIK
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              disabled
              value={data.nik}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Karyawan
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              disabled
              value={data.name}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Inisial
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              disabled
              value={data.initial}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Departemen
          </label>
          <div className="col-sm-10">
            <select className="form-select" disabled="true">
              <option>
                {department}
              </option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Posisi
          </label>
          <div className="col-sm-10">
            <select className="form-select" disabled="true">
              <option>
                {position}
              </option>
            </select>
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
              disabled
              defaultValue={data.email}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Tanggal Lahir
          </label>
          <div className="col-sm-10">
            <input disabled type="date" value={data.date_of_birth} className="form-control" />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Tanggal Masuk
          </label>
          <div className="col-sm-10">
            <input disabled type="date" value={data.start_date} className="form-control" />
          </div>
        </div>
      </PageHeader>
      <PageHeader
        ghost={false}
        title="Dokumen"
      >
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            NPWP
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              disabled
              value={data.npwp}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Alamat</label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              id="form4Example3"
              rows="4"
              value={data.address}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kelurahan</label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.urban_village}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kecamatan</label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.sub_district}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kota</label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.city}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kode Pos</label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={data.postal_code}
            />
          </div>
        </div>
        <div className="row mb-3">
          <legend className="col-form-label col-sm-2 pt-0">Status</legend>
          <div className="col-sm-7">
            {status === "Active" ? <Tag color="blue">{status}</Tag> : <Tag color="red">{status}</Tag>}
          </div>
        </div>
      </PageHeader>
    </>
  );
};

export default DetailKaryawan;
