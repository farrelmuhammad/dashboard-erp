// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
// import InfoIcon from "@mui/icons-material/Info";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import jsCookie from "js-cookie";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { PageHeader } from 'antd';

// import { Checkbox } from "@mui/material";

const BuatDepartemen = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  const [getDepartment, setGetDepartment] = useState('');

  const [getEmployee, setGetEmployee] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const columns = [
  //     { title: "ID", field: "id", editable: false },
  //     { title: "Nama", field: "name" },
  //     { title: "Departemen", field: "department_id" },
  //     { title: "Posisi", field: "position_id" },
  //   ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(employee);
    const userData = new FormData();
    // userData.append("id", id);
    userData.append("nama", name);
    userData.append("deskripsi", description);
    // employee.map((emp) => userData.append("karyawan[]", emp));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/departments`,
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
          `${getDepartment} Masuk dalam list`,
          "success"
        );
        navigate("/departemen");
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

  // const handleCheck = (event) => {
  //   var updatedList = [...employee];
  //   if (event.target.checked) {
  //     updatedList = [...employee, event.target.value];
  //   } else {
  //     updatedList.splice(employee.indexOf(event.target.value), 1);
  //   }
  //   setEmployee(updatedList);
  // };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_department_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetDepartment(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });

    axios
      .get(`${Url}/employees`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetEmployee(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };

  // const deleteData = async (id) => {
  //     await axios.delete(`${Url}department_employees/D-00012?kode=${id}`,{
  //         headers: {
  //             'Accept': 'application/json',
  //             'Authorization': `Bearer ${token}`
  //         }
  //     })
  //     setData();
  //     Swal.fire(
  //         'Berhasil Dihapus!',
  //         `${id} Berhasil hapus`,
  //         'success'
  //       )
  // }

  if (getEmployee?.length > 0) {
    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Departemen">
          <div className="row mb-3">
            <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
              Kode
            </label>
            <div className="col-sm-10">
              <input
                type="kode"
                className="form-control"
                // id="inputKode3"
                // onChange={e => setId(e.target.value)}
                value={getDepartment}
                disabled
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Departemen
            </label>
            <div className="col-sm-10">
              <input
                type="Name"
                className="form-control"
                id="inputNama3"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Keterangan
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                id="form4Example3"
                rows="4"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button
              onClick={handleSubmit}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Simpan
            </Button>
          </div>
        </PageHeader>
      </>
    );
  }
};

export default BuatDepartemen;
