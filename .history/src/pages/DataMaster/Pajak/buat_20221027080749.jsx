import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, InputNumber, PageHeader } from "antd";
import { SendOutlined } from "@ant-design/icons";

const BuatPajak = () => {
  const auth = useSelector((state) => state.auth);
  const [type, setType] = useState("");
  const [rate, setRate] = useState("");
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  const [getTaxes, setGetTaxes] = useState("");

  const [getProduct, setGetProduct] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    // userData.append("id", id);
    userData.append("jenis", type);
    userData.append("tarif", rate);
    product.map((p) => userData.append("produk[]", p));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/taxes`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (response) {
        //handle success
        Swal.fire(
          "Berhasil Ditambahkan",
          `${getTaxes} Masuk dalam list`,
          "success"
        );
        navigate("/pajak");
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
      .get(`${Url}/get_new_tax_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetTaxes(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  return (
    <>
      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Buat Pajak"
      >
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputKode3"
              value={getTaxes}
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
              onChange={(e) => setType(e.target.value)}
            />
          </div>
        </div>
        <InputNumber
          defaultValue={10000}
          formatter={(value) =>
            `${value}%`.replace(/\B(?=(\d{2})+(?!\d))/g, ",")
          }
          parser={(value) => value}
          // onChange={onChange}
        />
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Persentase
          </label>
          <div className="col-sm-2">
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                aria-label="Dollar amount (with dot and two decimal places)"
                defaultValue={0}
                pattern="/\B(?=(\d{2})+(?!\d))/g"
                onChange={(e) => setRate(e.target.value)}
              />
              <span className="input-group-text">%</span>
            </div>
          </div>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </PageHeader>
    </>
  );
};

export default BuatPajak;
