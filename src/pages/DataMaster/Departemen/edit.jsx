import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { Checkbox } from "@mui/material";
import { useSelector } from "react-redux";
import { Button, PageHeader, Skeleton } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditDepartemen = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState(null || '');
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartment()
  }, [])

  const fetchDepartment = async (e) => {
    axios
      .get(`${Url}/departments?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (response) {
        const getData = response.data.data[0]
        setLoading(false)
        setData(getData);
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
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Edit Departemen">
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              value={data.code}
              id="inputKode3"
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
              defaultValue={data.name}
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
              defaultValue={data.description}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={handleUpdate}
          >
            Submit
          </Button>
        </div>
      </PageHeader>
    </>
  );
};

export default EditDepartemen;
