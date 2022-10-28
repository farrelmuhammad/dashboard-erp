import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Url from "../../../Config";
import "./form.css";
import { PageHeader, Skeleton } from "antd";

const DetailPosisi = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [getEmployee, setGetEmployee] = useState({});

  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get(`${Url}/positions?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        const getData = res.data.data[0]
        setLoading(false)
        setData(getData);
        // console.log(res.data.data);
        // console.log(res.data.data[0].employees)
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
        onBack={() => window.history.back()}
        title="Detail Posisi">
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              disabled="true"
              type="kode"
              className="form-control"
              id="inputKode3"
              value={data.code}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Posisi
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              defaultValue={data.name}
              disabled
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
              rows="4"
              type="Nama"
              defaultValue={data.description}
              disabled
            />
          </div>
        </div>
      </PageHeader>
    </>
  );
};

export default DetailPosisi;
