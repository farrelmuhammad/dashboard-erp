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

const DetailPelanggan = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [address, setAddress] = useState([]);

  const columns = [
    { title: "ID", field: "customer_id" },
    { title: "Alamat", field: "address" },
    { title: "Kelurahan", field: "urban_village" },
    { title: "Kecamatan", field: "sub_district" },
    { title: "Kota", field: "city" },
    { title: "Kode Pos", field: "postal_code" },
  ];

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
      setData(res.data.data);
      console.log(res.data.data);
      setAddress(res.data.data[0].customer_addresses)
      console.log(res.data.data[0].customer_addresses)
    })
    .catch((err) => {
      // Jika Gagal
      console.log(err);
    });
  }


  if(data) {
      return (
        <>
          <form className="  p-3 mb-3 bg-body rounded">
            <div className="text-title text-start mb-4">
              <h3 className="title fw-bold">Detail Pelanggan</h3>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
                Kode
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                <input
                  type="kode"
                  className="form-control"
                  id="inputKode3"
                  value={d.code}
                  disabled
                />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Nama Pelanggan
              </label>
              <div className="col-sm-10">
                {data.map((d) => (
                    <input
                      type="Nama"
                      className="form-control"
                      id="inputNama3"
                      disabled
                      value={d.name}
                    />
                ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                No Telepon
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.phone_number}
                  />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Email
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.email}
                  />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                NPWP
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.npwp}
                  />
              ))}
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
              {data.map((d) => (
                  <option>{d.business_entity}</option>
              ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Termin
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.term}
                  />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Diskon
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.discount}
                  />
              ))}
              </div>
            </div>
            <fieldset className="row mb-3">
              <legend className="col-form-label col-sm-2 pt-0">Status</legend>
              <div className="col-sm-10">
                {data?.map((d) => {
                if (d.status === "Active") {
                  return (
                    <button type="button" class="btn btn-primary pe-none">
                      {d.status}
                    </button>
                  );
                } else {
                  return (
                    <button type="button" class="btn btn-danger pe-none">
                      {d.status}
                    </button>
                  );
                }
              })}
              </div>
            </fieldset>
          </form>
          <form className="  p-3 mb-3 bg-body rounded">
            {/* <MaterialTable
              title="Alamat Pelanggan"
              data={address}
              columns={columns}
            //   editable={{
            //     onRowAdd: (newRow) =>
            //       new Promise((resolve, reject) => {
            //         const updatedRows = [
            //           ...data,
            //           { id: data.length + 1, ...newRow },
            //         ];
            //         setTimeout(() => {
            //           setData(updatedRows);
            //           resolve();
            //         }, 2000);
            //       }),
            //     onRowDelete: (selectedRow) =>
            //       new Promise((resolve, reject) => {
            //         const index = selectedRow.tableData.id;
            //         const updatedRows = [...data];
            //         updatedRows.splice(index, 1);
            //         setTimeout(() => {
            //           setData(updatedRows);
            //           resolve();
            //         }, 2000);
            //       }),
            //     onRowUpdate: (updatedRow, oldRow) =>
            //       new Promise((resolve, reject) => {
            //         const index = oldRow.tableData.id;
            //         const updatedRows = [...data];
            //         updatedRows[index] = updatedRow;
            //         setTimeout(() => {
            //           setData(updatedRows);
            //           resolve();
            //         }, 2000);
            //       }),
            //     onBulkUpdate: (selectedRows) =>
            //       new Promise((resolve, reject) => {
            //         const rows = Object.values(selectedRows);
            //         const updatedRows = [...data];
            //         let index;
            //         rows.map((emp) => {
            //           index = emp.oldData.tableData.id;
            //           updatedRows[index] = emp.newData;
            //         });
            //         setTimeout(() => {
            //           setData(updatedRows);
            //           resolve();
            //         }, 2000);
            //       }),
            //   }}
              options={{
                actionsColumnIndex: -1,
                addRowPosition: "first",
              }}
            /> */}
          </form>
        </>
      );
  }
};

export default DetailPelanggan;
