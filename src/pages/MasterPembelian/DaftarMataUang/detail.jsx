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

const DetailMataUang = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    getDetailSupplier()
  }, []);

  const getDetailSupplier = async () => {
    await axios.get(`${Url}/currencies?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then((res) => {
      setData(res.data.data);
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
          title="Detail Mata Uang">
          </PageHeader>
          
          <form className="  p-3 mb-3 bg-body rounded">
            {/* <div className="text-title text-start mb-4">  
              <h3 className="title fw-bold">Detail Mata Uang</h3>
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
                Keterangan
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.description}
                  />
              ))}
              </div>
            </div>
           
          </form>
        </>
      );
  }
};

export default DetailMataUang;
