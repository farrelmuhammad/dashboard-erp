import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, PageHeader } from 'antd';
import { SendOutlined } from "@ant-design/icons";
import AsyncSelect from "react-select/async";
import ReactSelect from "react-select";

const BuatGudang = () => {
  // const auth.token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [tipe, setTipe] = useState('');
  const [city, setCity] = useState('');
  const [chart, setChart] = useState('');
  const [postal_code, setPostal_code] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [employees, setEmployees] = useState('');
  const navigate = useNavigate();

  const [employeesData, setEmployeesData] = useState();
  const [getWarehouse, setGetWarehouse] = useState();

  const [selectedValue, setSelectedChart] = useState(null);
  const [selectedValue2, setSelectedEmployee] = useState(null);


  const handleChangeChart = (value) => {
    setSelectedChart(value);
    setChart(value.id);
    // console.log(value)
  };
  // load options using API call
  const loadOptionsChart = (inputValue) => {
    return fetch(`${Url}/select_chart_of_accounts?limit=10&nama=${inputValue}&kode_kategori=114`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangeEmployee = (value) => {
    setSelectedEmployee(value);
    setEmployees(value.id);
    // console.log(value)
  };
  // load options using API call
  const loadOptionsEmployee = (inputValue) => {
    return fetch(`${Url}/select_employees?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("nama", name);
    userData.append("alamat", address);
    userData.append("kota", city);
    userData.append("tipe", tipe);
    userData.append("kode_pos", postal_code);
    userData.append("nomor_telepon", phone_number);
    userData.append("karyawan", employees);
    userData.append("bagan_akun", chart);

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

    axios({
      method: "post",
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
            text: err.response.data.message,
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

  const optionsType = [
    {
      label: "Internal",
      value: "internal"
    },
    {
      label: "External",
      value: "external"
    },
    {
      label: "Virtual",
      value: "virtual"
    }
  ];

  const handleSingleChangeType = (e) => {
    setTipe(e.value);
  };

  if (employeesData?.length > 0) {
    return (
      <>
        <PageHeader
          ghost={false}
          className="bg-body rounded mb-2"
          onBack={() => window.history.back()}
          title="Buat Gudang"
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
              <ReactSelect
                className="basic-single"
                placeholder="Pilih Tipe Gudang..."
                classNamePrefix="select"
                isSearchable
                onChange={handleSingleChangeType}
                options={optionsType}
              />
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
              <AsyncSelect
                placeholder="Pilih Karyawan..."
                cacheOptions
                defaultOptions
                value={selectedValue2}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e.id}
                loadOptions={loadOptionsEmployee}
                onChange={handleChangeEmployee}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              COA
            </label>
            <div className="col-sm-10">
              <AsyncSelect
                placeholder="Pilih Akun..."
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e.id}
                loadOptions={loadOptionsChart}
                onChange={handleChangeChart}
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

export default BuatGudang;
