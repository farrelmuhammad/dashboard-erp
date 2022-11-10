
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, PageHeader } from 'antd';
import { SendOutlined } from "@ant-design/icons";

const BuatBagian = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  // const [id, setId] = useState();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  const [getPiece, setGetPiece] = useState();

  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      handleSubmit()
      // setName('');
      // setDescription('');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();

    if (!name) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data nama kosong, Silahkan lengkapi datanya"
      })
    }
    else {

      const userData = new FormData();
      userData.append("nama", name);
      userData.append("deskripsi", description);
      product.map((p) => userData.append("produk[]", p));

      // for (var pair of userData.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]);
      // }

      // await axios.post(`${Url}/pieces`, {
      //   data: userData,
      //   headers: {
      //     Accept: "application/json",
      //     Authorization: `Bearer ${auth.token}`,
      //   },
      // })

      await axios({
        method: "post",
        url: `${Url}/pieces`,
        data: userData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
        .then(function (res) {
          //handle success
          console.log(res);
          if (res.status === 201) {
            Swal.fire(
              "Berhasil Ditambahkan",
              `${getPiece} Masuk dalam list`,
              "success"
            );
            navigate("/bagian");
          }
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
    }
  };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_piece_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetPiece(res.data.data);
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
        title="Buat Bagian"
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
              // onChange={e => setId(e.target.value)}
              // value={getPiece}
              value={'Otomatis'}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Bagian
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              required="true"
              onChange={(e) => setName(e.target.value)}
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
              id="form4Example3"
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={loadings[1]}
            onClick={() => enterLoading(1)}
          >
            Submit
          </Button>
          {/* <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={handleSubmit}
          >
            Submit
          </Button> */}
        </div>
      </PageHeader>
    </>
  );
};

export default BuatBagian;
