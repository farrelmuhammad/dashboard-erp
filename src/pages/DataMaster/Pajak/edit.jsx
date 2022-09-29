import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const BuatPajak = () => {
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [type, setType] = useState('');
  const [rate, setRate] = useState('');
  const [product, setProduct] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState([]);

  const [getProduct, setGetProduct] = useState();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("jenis", type);
    userData.append("tarif", rate);
    axios({
      method: "put",
      url: `${Url}/taxes/${id}`,
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
            text: err.response.data.error,
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
  //   var updatedList = [...product];
  //   if (event.target.checked) {
  //     updatedList = [...product, event.target.value];
  //   } else {
  //     updatedList.splice(product.indexOf(event.target.value), 1);
  //   }
  //   setProduct(updatedList);
  // };

  useEffect(() => {
    axios
      .get(`${Url}/taxes?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (response) {
        const getData = response.data.data[0];
        setData(getData);
        setCode(getData.code);
        setType(getData.type);
        setRate(getData.rate);
        console.log(getData);
      })
      .catch((err) => {
        // Jika Gagal
      });

    axios
      .get(`${Url}/tax_products_available_products_update/${id}`, {
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

  if (getProduct?.length > 0)
    return (
      <>
        <form className="  p-3 mb-3 bg-body rounded">
          <div className="text-title text-start mb-4">
            <h3 className="title fw-bold">Edit Pajak</h3>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
              Kode
            </label>
            <div className="col-sm-10">
              <input
                type="kode"
                className="form-control"
                id="inputKode3"
                value={code}
                disabled
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Pajak
            </label>
            <div className="col-sm-10">
              <input
                type="Nama"
                className="form-control"
                id="inputNama3"
                defaultValue={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Persentase
            </label>
            <div className="col-sm-5">
              <input
                type="number"
                step="any"
                className="form-control"
                defaultValue={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="col-sm-1">
              <span className="input-group-text" id="addon-wrapping">
                %
              </span>
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
};

export default BuatPajak;
