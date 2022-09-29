import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";

const DetailDepartemen = () => {
  // const auth = useSelector(state => state.auth);
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [employeeDepartment, setEmployeeDepartment] = useState([]);

  useEffect(() => {
    axios
      .get(`${Url}/departments?kode=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (res) {
        setData(res.data.data);
        setEmployeeDepartment(res.data.data[0].employees);
        console.log(res.data.data);
        console.log(res.data.data[0].employees);
      })
      .catch((err) => {
        // Jika Gagal
      });
  }, []);


  if (data.length > 0 && employeeDepartment.length > 0) {
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
                disabled
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Departemen
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <input
                  type="Name"
                  className="form-control"
                  defaultValue={d.name}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Keterangan
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <textarea
                  className="form-control"
                  id="form4Example3"
                  rows="4"
                  defaultValue={d.description}
                  disabled
                />
              ))}
            </div>
          </div>
        </form>
      </>
    );
  } else {
    return (
      <>
        <form className="  p-3 mb-3 bg-body rounded">
          <div className="text-title text-start mb-4">
            <h3 className="title fw-bold">Detail Departemen</h3>
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
                disabled
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Departemen
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <input
                  type="Name"
                  className="form-control"
                  defaultValue={d.name}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Keterangan
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <textarea
                  className="form-control"
                  id="form4Example3"
                  rows="4"
                  defaultValue={d.description}
                  disabled
                />
              ))}
            </div>
          </div>
        </form>
      </>
    );
  }
};

export default DetailDepartemen;
