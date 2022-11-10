import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { Checkbox } from "@mui/material";
import { useSelector } from "react-redux";
import { Button, PageHeader } from 'antd';
import { SendOutlined } from "@ant-design/icons";


const BuatPosisi = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  // const [id, setId] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [employee, setEmployee] = useState([]);
  const [validate, setValidate] = useState(false);
  const navigate = useNavigate();

  const [getPosition, setGetPosition] = useState();
  const [getEmployee, setGetEmployee] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Nama kosong, Silahkan Lengkapi datanya ",
      });
    }
    else{

    const userData = new FormData();
    // userData.append('id', id);
    userData.append("nama", name);
    userData.append("deskripsi", description);
    employee.map((emp) => userData.append("karyawan[]", emp));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/positions`,
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
          `${getPosition} Masuk dalam list`,
          "success"
        );
        navigate("/posisi");
      })
      .catch((err) => {
        if (err.response) {
          console.log("err.response ", err.response);
          setValidate(err.response)
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
   } };

  const handleCheck = (event) => {
    var updatedList = [...employee];
    if (event.target.checked) {
      updatedList = [...employee, event.target.value];
    } else {
      updatedList.splice(employee.indexOf(event.target.value), 1);
    }
    setEmployee(updatedList);
  };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_position_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetPosition(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });

    axios
      .get(`${Url}/employees`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetEmployee(res.data.data);
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

  if (getEmployee?.length > 0) {
    return (
      <>
        <PageHeader
          ghost={false}
          className="bg-body rounded mb-2"
          onBack={() => window.history.back()}
          title="Buat Posisi"
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
                //value={getPosition}
                value={'Otomatis'}
                disabled
              // readOnly={getPosition}
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
                id="inputNama3"
                required
                onChange={(e) => setName(e.target.value)}
              />
              <div className="valid-feedback">Looks good!</div>
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
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </PageHeader>
      </>
    );
  }
};

export default BuatPosisi;
