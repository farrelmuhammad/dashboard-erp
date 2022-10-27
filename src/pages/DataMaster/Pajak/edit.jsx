import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, Input, InputNumber, PageHeader, Skeleton } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditPajak = () => {
  // const auth.token = jsCookie.get("auth");
  const auth = useSelector((state) => state.auth);
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

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
        navigate("/pajak");
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
        setCode(getData.code);
        setType(getData.type);
        setRate(getData.rate);
        setLoading(false);
      })
      .catch((err) => {
        // Jika Gagal
      });
  }, []);

  const onChange = (value) => {
    // console.log('changed', value);
    setRate(value)
  };

  if (loading) {
    return (
      <>
        <form className="p-3 mb-3 bg-body rounded">
          <Skeleton active />
        </form>
      </>
    );
  }

  return (
    <>
      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Edit Pajak"
      >
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <Input
              size="large"
              value={code}
              style={{
                fontWeight: "bold",
              }}
              disabled
              // onChange={(e) => setType(e.target.value)}
            />
            {/* <input
              type="kode"
              className="form-control"
              id="inputKode3"
              value={code}
              disabled
            /> */}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Pajak
          </label>
          <div className="col-sm-10">
            <Input
              size="large"
              placeholder="Masukkan Nama Pajak"
              defaultValue={type}
              onChange={(e) => setType(e.target.value)}
            />
            {/* <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={type}
              onChange={(e) => setType(e.target.value)}
            /> */}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Persentase
          </label>
          <div className="col-sm-2">
            <div className="input-group">
              <InputNumber
                size="large"
                defaultValue={rate}
                formatter={(value) =>
                  `${value} %`.replace(/\B(?=(\d{2})+(?!\d))/g, ",")
                }
                // parser={(value) => value.replace(/\%\s?|(,*)/g, "")}
                // onChange={(e) => setRate(e.target.value)}
                onChange={onChange}
              />
              {/* <input
                type="number"
                className="form-control"
                aria-label="Dollar amount (with dot and two decimal places)"
                defaultValue={0}
                pattern="/\B(?=(\d{2})+(?!\d))/g"
                onChange={(e) => setRate(e.target.value)}
              />
              <span className="input-group-text">%</span> */}
            </div>
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

export default EditPajak;
