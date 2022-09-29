
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditDepartemen = () => {
  const auth = useSelector(state => state.auth);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState(false);

  const [getEmployee, setGetEmployee] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchDepartment()
  }, [])

  const fetchDepartment = async (e) => {
    axios
      .get(`${Url}/departments?kode=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (response) {
        setData(response.data.data[0]);
        console.log(response.data.data[0]);
        const getData = response.data.data[0]
        console.log(getData)
        setNama(getData.name)
        setDeskripsi(getData.description)
      })
      .catch((err) => {
        // Jika Gagal
      });
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nama", nama);
    userData.append("deskripsi", deskripsi);
    employee.map((emp) => userData.append("karyawan[]", emp));
    axios({
      method: "put",
      url: `${Url}/departments/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire("Berhasil Ditambahkan", `${id} Masuk dalam list`, "success");
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

  const handleCheck = (event) => {
    var updatedList = [...employee];
    if (event.target.checked) {
      updatedList = [...employee, event.target.value];
    } else {
      updatedList.splice(employee.indexOf(event.target.value), 1);
    }
    setEmployee(updatedList);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios
      .get(`${Url}/department_employees_available_employees_update/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetEmployee(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  if (data) {
    return (
      <>
        <form className="  p-3 mb-3 bg-body rounded">
          <div className="text-title text-start mb-4">
            <h3 className="title fw-bold">Edit Departemen</h3>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
              Kode
            </label>
            <div className="col-sm-10">
              <input
                type="kode"
                className="form-control"
                value={id}
                readOnly={id}
                id="inputKode3"
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
                defaultValue={nama}
                onChange={(e) => setNama(e.target.value)}
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
                defaultValue={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
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
    );
  }
};

export default EditDepartemen;
