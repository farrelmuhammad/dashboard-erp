import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const BuatGudang = () => {
  // 
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [tipe, setTipe] = useState('');
  const [city, setCity] = useState('');
  const [postal_code, setPostal_code] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [employees, setEmployees] = useState('');
  const navigate = useNavigate();

  const [employeesData, setEmployeesData] = useState();
  const [getWarehouse, setGetWarehouse] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    // console.log(name, address, city, postal_code, phone_number, employees)
    userData.append("nama", name);
    userData.append("alamat", address);
    userData.append("kota", city);
    userData.append("tipe", tipe);
    userData.append("kode_pos", postal_code);
    userData.append("nomor_telepon", phone_number);
    userData.append("karyawan", employees);
    console.log(userData);
    axios({
      method: "POST",
      url: `${Url}/warehouses`,
      data: userData,
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        Swal.fire(
          "Berhasil Di Update",
          `${getWarehouse} Masuk dalam list`,
          "success"
        );
        navigate("/gudang");
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
      .get(`${Url}/employees`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => setEmployeesData(res.data.data));

    axios
      .get(`${Url}/get_new_warehouse_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetWarehouse(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  if (employeesData?.length > 0) {
    return (
      <>
        <form className="  p-3 mb-3 bg-body rounded">
          <div className="text-title text-start mb-4">
            <h3 className="title fw-bold">Buat Gudang</h3>
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
                value={getWarehouse}
                disabled
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Gudang
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="inputNama3"
                placeholder="Masukkan Nama Gudang"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Tipe
            </label>
            <div className="col-sm-10">
              <select
                onChange={(e) => setTipe(e.target.value)}
                id="bussinessSelect"
                className="form-select"
              >
                <option>Pilih Tipe Gudang</option>
                <option value="internal" selected={tipe === "Internal"}>
                  Internal
                </option>
                <option value="external" selected={tipe === "External"}>
                  External
                </option>
                <option value="virtual" selected={tipe === "Virtual"}>
                  Virtual
                </option>
              </select>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Alamat
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                id="form4Example3"
                rows="4"
                placeholder="Masukkan Alamat Gudang"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Kota
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="inputNama3"
                placeholder="Masukkan Kota"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Kode Pos
            </label>
            <div className="col-sm-10">
              <input
                type="number"
                className="form-control"
                id="inputNama3"
                placeholder="Masukkan Kode Pos"
                onChange={(e) => setPostal_code(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              No Telepon
            </label>
            <div className="col-sm-10">
              <input
                type="tel"
                className="form-control"
                id="inputNama3"
                placeholder="08x-xxxx-xxx-xxx"
                onChange={(e) => setPhone_number(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Karyawan
            </label>
            <div className="col-sm-10">
              <select
                onChange={(e) => setEmployees(e.target.value)}
                className="form-select"
              >
                <option>Pilih Karyawan</option>
                {employeesData?.map((d) => {
                  return (
                    <option value={d.id} key={d.id}>
                      {d.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button
              type="primary"
              icon={<SendOutlined />}
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </form>
      </>
    );
  }
};

export default BuatGudang;
