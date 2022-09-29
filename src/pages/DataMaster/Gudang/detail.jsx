import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";


import { useSelector } from "react-redux";

const DetailGudang = () => {
  // const auth = useSelector(state => state.auth);
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${Url}/warehouses?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setData(res.data.data)
        console.log(res.data.data)
      });
  }, []);

  if (data) {
    return (
      <>
        <form className="  p-3 mb-3 bg-body rounded">
          <div className="text-title text-start mb-4">
            <h3 className="title fw-bold">Detail Gudang</h3>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
              Kode
            </label>
            <div className="col-sm-10">
            {data?.map((d) => (
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
              Nama Gudang
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <input
                  // key={index}
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  defaultValue={d.name}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Tipe
              </label>
              <div className="col-sm-10">
                <select
                  id="bussinessSelect"
                  className="form-select"
                  disabled
                >
              {data?.map((d) => (
                <option>{d.type}</option>
              ))}
                </select>
              </div>
            </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Alamat
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <textarea
                  className="form-control"
                  id="form4Example3"
                  rows="4"
                  defaultValue={d.address}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Kota
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  defaultValue={d.city}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Kode Pos
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  defaultValue={d.postal_code}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              No Telepon
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  defaultValue={d.phone_number}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Karyawan
            </label>
            <div className="col-sm-10">
            {data?.map((d) => (
                <input
                type="Nama"
                className="form-control"
                id="inputNama3"
                defaultValue={d.employee_id}
                disabled
              />
            )
            )}
            </div>
          </div>
        </form>
      </>
    );
  }
};

export default DetailGudang;
