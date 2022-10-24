import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, PageHeader, Skeleton } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditGrade = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);


  const [data, setData] = useState();
  const [getProduct, setGetProduct] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchGrade();
  }, []);

  const fetchGrade = async () => {
    await axios
      .get(`${Url}/grades?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (response) {
        setData(response.data.data[0]);
        const getData = response.data.data[0];
        // console.log(getData);
        setLoading(false)
        setCode(getData.code);
        setName(getData.name);
        setDescription(getData.description);
      })
      .catch((err) => {
        // Jika Gagal
      });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nama", name);
    userData.append("deskripsi", description);
    userData.append("produk[]", product);
    // product.map((p) => userData.append("produk[]", p));
    axios({
      method: "put",
      url: `${Url}/grades/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        Swal.fire("Berhasil Di Update", `${code} Masuk dalam list`, "success");
        navigate("/grade");
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

  useEffect(() => {
    axios
      .get(`${Url}/grade_products_available_products_update/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetProduct(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

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
        title="Edit Grade"
      >
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              id="inputKode3"
              defaultValue={code}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Grade
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label
            htmlFor="inputPassword3"
            className="col-sm-2 col-form-label"
          >
            Keterangan
          </label>
          <div className="col-sm-10">
            <textarea
              className="form-control"
              id="form4Example3"
              rows="4"
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default EditGrade;
