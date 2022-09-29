import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditBagian = () => {
  // 
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState([]);

  const [getProduct, setGetProduct] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchBagian()
  }, [])

  const fetchBagian = async () => {
    await axios.get(`${Url}/pieces?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (response) {
        setData(response.data.data[0]);
        const getData = response.data.data[0];
        // console.log(response.data.data);
        console.log(getData)
        // {data.map((d) => {
        //   console.log(d.name) 
        //   console.log(d.description) 
        //   setName(d.name) 
        // setDescription(d.description) 
        // })}
        setCode(getData.code)
        setName(getData.name)
        setDescription(getData.description)
      })
      .catch((err) => {
        // Jika Gagal
      });
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nama", name);
    userData.append("deskripsi", description);
    product.map((p) => userData.append("produk[]", p));
    axios({
      method: "put",
      url: `${Url}/pieces/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire("Berhasil Ditambahkan", `${id} Masuk dalam list`, "success");
        navigate("/bagian");
      })
      .catch((err) => {
        if (err.response) {
          console.log("err.response ", err.response);
          Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
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
      .get(`${Url}/piece_products_available_products_update/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetProduct(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleCheck = (event) => {
    var updatedList = [...product];
    if (event.target.checked) {
      updatedList = [...product, event.target.value];
    } else {
      updatedList.splice(product.indexOf(event.target.value), 1);
    }
    setProduct(updatedList);
  };

  if (data) {
    if (getProduct)
      return (
        <>
          <form className="  p-3 mb-3 bg-body rounded">
            <div className="text-title text-start mb-4">
              <h3 className="title fw-bold">Edit Bagian</h3>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
                Kode
              </label>
              <div className="col-sm-10">
                <input
                  type="kode"
                  defaultValue={code}
                  className="form-control"
                  disabled
                  id="inputKode3"
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Nama Bagian
              </label>
              <div className="col-sm-10">
                {/* {data?.map((d, index) => ( */}
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {/* ))} */}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Keterangan
              </label>
              <div className="col-sm-10">
                {/* {data?.map((d, index) => ( */}
                <textarea
                  class="form-control"
                  id="form4Example3"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {/* ))} */}
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
  }
};

export default EditBagian;