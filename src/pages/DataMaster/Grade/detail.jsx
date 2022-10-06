import * as React from "react";
import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { PageHeader } from "antd";

const DetailGrade = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${Url}/grades?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        // console.log(res.data.data);
        // console.log(res.data.data[0].products);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  if (data) {
    return (
      <>
         <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Grade">
        </PageHeader>

        <form className="  p-3 mb-3 bg-body rounded">
          
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
                  defaultValue={d.code}
                  disabled
                />
              ))}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Grade
            </label>
            <div className="col-sm-10">
              {data?.map((d) => (
                <input
                  type="text"
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
    )}
    else {
      return (
          <h1>Loading Data</h1>
      )
  }
};

export default DetailGrade;
