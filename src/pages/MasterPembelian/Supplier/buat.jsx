import axios from "axios";
// import MaterialTable from "material-table";
import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

const BuatSupplier = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [bussiness_ent, setBussiness_ent] = useState('');
  
  const [grup, setGrup] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  // const [term, setTerm] = useState('');
  // const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const columns = [
    { title: "ID", field: "id", editable: false },
    { title: "Alamat", field: "address" },
    { title: "Kelurahan", field: "urban_village" },
    { title: "Kecamatan", field: "sub_district" },
    { title: "Kota", field: "city" },
    { title: "Kode Pos", field: "postal_code" },
  ];

  const [getSupplier, setGetSupplier] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const userData = new FormData();

    userData.append("nama", name);
    userData.append("badan_usaha", bussiness_ent);
    userData.append("grup", grup);
    userData.append("nomor_telepon", phone_number);
    userData.append("email", email);
    userData.append("npwp", npwp);
    // userData.append("term", term);
    // userData.append("diskon", discount);
    userData.append("status", status);

    data.map((address) => {
      console.log(address);
      userData.append("alamat[]", address.address);
      userData.append("kota[]", address.city);
      userData.append("kecamatan[]", address.sub_district);
      userData.append("kelurahan[]", address.urban_village);
      userData.append("kode_pos[]", address.postal_code);
    });

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/suppliers`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire(
          "Berhasil Ditambahkan",
          `${getSupplier} Masuk dalam list`,
          "success"
        );
        navigate("/supplier");
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
  };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_supplier_code/Lokal`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetSupplier(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  return (
    <>
      <form className="  p-3 mb-3 bg-body rounded">
        <div className="text-title text-start mb-4">
          <h3 className="title fw-bold">Buat Supplier</h3>
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
              value={getSupplier}
              readOnly={getSupplier}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Supplier
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
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
              <option value="PT" checked={bussiness_ent === "PT"}>
                PT
              </option>
              <option value="CV" checked={bussiness_ent === "CV"}>
                CV
              </option>
              <option value="Lainnya" checked={bussiness_ent === "Lainnya.."}>
                Lainnya..
              </option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Grup
          </label>
          <div className="col-sm-10">
            <select
              onChange={(e) => setGrup(e.target.value)}
              id="grupSelect"
              className="form-select"
            >
              <option>Pilih Grup</option>
              <option value="Lokal" checked={grup === "Lokal"}>
                Lokal
              </option>
              <option value="Impor" checked={grup === "Import"}>
                Import
              </option>
              
            </select>
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
      </form>
      <form className="  p-3 mb-3 bg-body rounded">
        {/* <MaterialTable
          title="Alamat Supplier"
          data={data}
          columns={columns}
          onChange={(e) => setData(e.target.value)}
          editable={{
            onRowAdd: (newRow) =>
              new Promise((resolve, reject) => {
                const updatedRows = [
                  ...data,
                  { id: data.length + 1, ...newRow },
                ];
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowDelete: (selectedRow) =>
              new Promise((resolve, reject) => {
                const index = selectedRow.tableData.id;
                const updatedRows = [...data];
                updatedRows.splice(index, 1);
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowUpdate: (updatedRow, oldRow) =>
              new Promise((resolve, reject) => {
                const index = oldRow.tableData.id;
                const updatedRows = [...data];
                updatedRows[index] = updatedRow;
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000);
              }),
            onBulkUpdate: (selectedRows) =>
              new Promise((resolve, reject) => {
                const rows = Object.values(selectedRows);
                const updatedRows = [...data];
                let index;
                rows.map((emp) => {
                  index = emp.oldData.tableData.id;
                  updatedRows[index] = emp.newData;
                });
                setTimeout(() => {
                  setData(updatedRows);
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
          <button onClick={handleSubmit} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
        </div>
      </form>
    </>
  );
};

export default BuatSupplier;
