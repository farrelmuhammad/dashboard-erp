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
import { PageHeader } from "antd";

const DetailBiayaImport = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    getBiayaImport()
  }, []);

  const getBiayaImport = async () => {
    await axios.get(`${Url}/costs?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then((res) => {
      setData(res.data.data);
      console.log(res.data.data);
      // setAddress(res.data.data[0].supplier_addresses);
      // console.log(res.data.data[0].customer_addresses)
    })
    .catch((err) => {
      // Jika Gagal
      console.log(err);
    });
  }


  if(data) {
      return (
        <>
          <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Biaya Import">
          </PageHeader>

          <form className="  p-3 mb-3 bg-body rounded">
            {/* <div className="text-title text-start mb-4">
              <h3 className="title fw-bold">Detail Biaya Import</h3>
            </div> */}
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
                Nama Biaya
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
                Kategori
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.category.name}
                  />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Akun Jurnal
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.chart_of_account.name}
                  />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Referensi
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.reference}
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
                    <button type="button" className="btn btn-primary pe-none">
                      {d.status}
                    </button>
                  );
                } else {
                  return (
                    <button type="button" className="btn btn-danger pe-none">
                      {d.status}
                    </button>
                  );
                }
              })}
              </div>
            </fieldset>
          </form>
          
        </>
      );
  }
};

export default DetailBiayaImport;
