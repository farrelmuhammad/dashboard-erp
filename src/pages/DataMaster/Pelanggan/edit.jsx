import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Checkbox,
  IconButton,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
// import MaterialTable from "material-table";
import { useSelector } from "react-redux";
// import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { TextField } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";

const EditPelanggan = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [bussiness_ent, setBussiness_ent] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  const [term, setTerm] = useState('');
  const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [alamat, setAlamat] = useState([]);
  const [kota, setKota] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [kelurahan, setKelurahan] = useState([]);
  const [kode_pos, setKode_pos] = useState([]);

  // const [getCustomer, setGetCustomer] = useState();

  const [address, setAddress] = useState([]);

  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nama", name);
    userData.append("badan_usaha", bussiness_ent);
    userData.append("nomor_telepon", phone_number);
    userData.append("email", email);
    userData.append("npwp", npwp);
    userData.append("term", term);
    userData.append("diskon", discount);
    userData.append("status", status);
    // 
    // userData.append("alamat[]", address);
    // userData.append("kota[]", kota);
    // userData.append("kecamatan[]", kecamatan);
    // userData.append("kelurahan[]", kelurahan);
    // userData.append("kode_pos[]", kode_pos);

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    axios({
      method: "put",
      url: `${Url}/customers/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        // console.log(res);
        Swal.fire("Berhasil Ditambahkan", `${id} Masuk dalam list`, "success");
        navigate("/pelanggan");
      })
      .catch((err) => {
        if (err.response) {
          console.log("err.response ", err.response);
          Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        } else if (err.request) {
          console.log("err.request ", err.request);
          Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        } else if (err.message) {
          // do something other than the other two
          Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        }
      });
  };

  const columns = [
    { title: "ID", field: "id", editable: false },
    { title: "Alamat", field: "address" },
    { title: "Kelurahan", field: "urban_village" },
    { title: "Kecamatan", field: "sub_district" },
    { title: "Kota", field: "city" },
    { title: "Kode Pos", field: "postal_code" },
  ];

  const handleAddress = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    address.map((address) => {
      userData.append("alamat[]", address.address);
      userData.append("kota[]", address.city);
      userData.append("kecamatan[]", address.sub_district);
      userData.append("kelurahan[]", address.urban_village);
      userData.append("kode_pos[]", address.postal_code);
    });
    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    axios({
      method: "post",
      url: `${Url}/customer_addresses/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire("Alamat Berhasil Ditambahkan", `Alamat ${id} Berhasil Ditambah`, "success");
        navigate(`/pelanggan/edit/${id}`);
        setTimeout(window.location.reload.bind(window.location), 600);
      })
      .catch((err) => {
        if (err.response) {
          console.log("err.response ", err.response);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.response.data.error.nama,
          });
        } else if (err.request) {
          console.log("err.request ", err.request);
          Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        } else if (err.message) {
          // do something other than the other two
          Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        }
      });
  }

  useEffect(() => {
    getCustomerById()
  }, []);

  const getCustomerById = async () => {
    await axios.get(`${Url}/customers?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        setData(res.data.data[0]);
        const getData = res.data.data[0];
        setCode(getData.code);
        setName(getData.name);
        setBussiness_ent(getData.business_entity);
        setPhone_number(getData.phone_number);
        setEmail(getData.email);
        setNpwp(getData.npwp);
        setTerm(getData.term);
        setDiscount(getData.discount);
        setStatus(getData.status);
        console.log(getData.business_entity);
        setAddress(getData.customer_addresses)
        console.log(getData.customer_addresses)
        console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }



  return (
    <>
      <form className="  p-3 mb-4 bg-body rounded">
        <div className="text-title text-start mb-4">
          <h3 className="title fw-bold">Edit Pelanggan</h3>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              defaultValue={code}
              disabled
              id="inputKode3"
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
              defaultValue={name}
              id="inputNama3"
              onChange={(e) => setName(e.target.value)}
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
              defaultValue={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
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
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
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
              defaultValue={npwp}
              onChange={(e) => setNpwp(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Badan Usaha
          </label>
          <div className="col-sm-10">
            <select
              onChange={(e) => setBussiness_ent(e.target.value)}
              id="bussinessSelect"
              className="form-select"
            >
              <option>Pilih Badan Usaha</option>
              <option value="PT" selected={bussiness_ent === "PT"}>
                PT
              </option>
              <option value="CV" selected={bussiness_ent === "CV"}>
                CV
              </option>
              <option value="Lainnya" selected={bussiness_ent === "Lainnya.."}>
                Lainnya..
              </option>
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
              defaultValue={term}
              onChange={(e) => setTerm(e.target.value)}
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
              defaultValue={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </div>
        <fieldset className="row mb-3">
          <legend className="col-form-label col-sm-2 pt-0">Status</legend>
          <div className="col-sm-10">
            <div className="form-check">
              <input
                onChange={(e) => setStatus(e.target.value)}
                value="Active"
                checked={status === "Active"}
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" htmlFor="gridRadios1">
                Aktif
              </label>
            </div>
            <div className="form-check">
              <input
                onChange={(e) => setStatus(e.target.value)}
                value="Inactive"
                checked={status === "Inactive"}
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
              />
              <label className="form-check-label" htmlFor="gridRadios2">
                Non-Aktif
              </label>
            </div>
          </div>
        </fieldset>
        <div className="d-grid mt-3 gap-2 d-md-flex justify-content-md-end">
          <button onClick={handleUpdate} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
          {/* <Button
          onClick={handleSubmit}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Simpan
        </Button> */}
        </div>
      </form>
      <form className="  p-3 mb-3 bg-body rounded">
        {/* <MaterialTable
          title="Alamat Pelanggan"
          data={address}
          columns={columns}
          onChange={(e) => setAddress(e.target.value)}
          editable={{
            onRowAdd: (newRow) =>
              new Promise((resolve, reject) => {
                const updatedRows = [
                  ...address,
                  { id: address.length + 1, ...newRow },
                ];
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowDelete: (selectedRow) =>
              new Promise((resolve, reject) => {
                const index = selectedRow.tableData.id;
                const updatedRows = [...address];
                updatedRows.splice(index, 1);
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowUpdate: (updatedRow, oldRow) =>
              new Promise((resolve, reject) => {
                const index = oldRow.tableData.id;
                const updatedRows = [...address];
                updatedRows[index] = updatedRow;
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
            onBulkUpdate: (selectedRows) =>
              new Promise((resolve, reject) => {
                const rows = Object.values(selectedRows);
                const updatedRows = [...address];
                let index;
                rows.map((emp) => {
                  index = emp.oldData.tableData.id;
                  updatedRows[index] = emp.newData;
                });
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
          }}
        /> */}
        <div className="d-grid mt-3 gap-2 d-md-flex justify-content-md-end">
          <button onClick={handleAddress} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
          {/* <Button
          onClick={handleSubmit}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Simpan
        </Button> */}
        </div>
      </form>
      {/* <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <Button
          onClick={handleUpdate}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Simpan
        </Button>
      </div> */}
    </>
  );
};

export default EditPelanggan;
