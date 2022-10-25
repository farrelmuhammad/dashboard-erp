import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, PageHeader, Skeleton } from "antd";
import AsyncSelect from "react-select/async";
import ReactSelect from "react-select";
import { SendOutlined } from "@ant-design/icons";

const EditGudang = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [tipe, setTipe] = useState('');
  const [city, setCity] = useState('');
  const [chart, setChart] = useState('');
  const [chartName, setChartName] = useState('');
  const [postal_code, setPostal_code] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [employees, setEmployees] = useState('');
  const [employeesName, setEmployeesName] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [employeesData, setEmployeesData] = useState();

  const [selectedValue, setSelectedChart] = useState(null);
  const [selectedValue2, setSelectedEmployee] = useState(null);

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [isError, setisError] = useState(false);

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
    setEmployee(value.id);
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

  useEffect(() => {
    fetchWarehouse();
  }, [])

  const fetchWarehouse = async () => {
    await axios.get(`${Url}/warehouses?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (response) {
        setData(response.data.data[0]);
        console.log(response.data.data[0]);
        const getData = response.data.data[0];
        console.log(getData)
        setCode(getData.code)
        setName(getData.name)
        setAddress(getData.address)
        setCity(getData.city)
        setTipe(getData.type)
        setChart(getData.chart_of_account.id)
        setChartName(getData.chart_of_account.name)
        setEmployeesName(getData.employee.name)
        setTipe(getData.type)
        setPostal_code(getData.postal_code)
        setPhone_number(getData.phone_number)
        setEmployees(getData.employee.id)
        setLoading(false)
      })
      .catch((err) => {
        // Jika Gagal
      });
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nama", name);
    userData.append("alamat", address);
    userData.append("kota", city);
    userData.append("tipe", tipe);
    userData.append("kode_pos", postal_code);
    userData.append("nomor_telepon", phone_number);
    userData.append("karyawan", employees);
    axios({
      method: "put",
      url: `${Url}/warehouses/${id}`,
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

  useEffect(() => {
    axios
      .get(`${Url}/employees`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => setEmployeesData(res.data.data));

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
        title="Edit Gudang"
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
              value={code}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Gudang
          </label>
          <div className="col-sm-10">
            {/* {data?.map((data, index) => ( */}
            <input
              // key={index}
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={name}
              // value={"aabb"}
              onChange={(e) => setName(e.target.value)}
            />
            {/* ))} */}
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
              defaultInputValue={tipe}
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
              defaultValue={address}
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
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={city}
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
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={postal_code}
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
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={phone_number}
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
              defaultInputValue={employeesName}
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
              defaultInputValue={chartName}
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
            onClick={handleUpdate}
          >
            Submit
          </Button>
        </div>
      </PageHeader>
    </>
  );
};

export default EditGudang;
