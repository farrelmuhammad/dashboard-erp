import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditGudang = () => {
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [tipe, setTipe] = useState('');
  const [city, setCity] = useState('');
  const [postal_code, setPostal_code] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [employees, setEmployees] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [employeesData, setEmployeesData] = useState();

  const [data, setData] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isError, setisError] = useState(false);

  useEffect(() => {
    fetchWarehouse();
  }, [])

  const fetchWarehouse = async () => {
    axios
      .get(`${Url}/warehouses?id=${id}`, {
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
        setPostal_code(getData.postal_code)
        setPhone_number(getData.phone_number)
        setEmployees(getData.employee_id)
      })
      .catch((err) => {
        // Jika Gagal
        setisError(true);
        setisLoading(false);
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

  //   const handleInputChange = event => {
  //     const { name, value } = event.target;
  //     setName({ ...name, [name]: value });
  //   };

  useEffect(() => {
    axios
      .get(`${Url}/employees`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => setEmployeesData(res.data.data));

    setisLoading(true);

  }, []);

  if (data) {
    if (employeesData)
      return (
        <>
          <form className="  p-3 mb-3 bg-body rounded">
            <div className="text-title text-start mb-4">
              <h3 className="title fw-bold">Edit Gudang</h3>
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
                {/* {data?.map((data) => ( */}
                <textarea
                  className="form-control"
                  id="form4Example3"
                  rows="4"
                  defaultValue={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                {/* ))} */}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Kota
              </label>
              <div className="col-sm-10">
                {/* {data?.map((data) => ( */}
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  defaultValue={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {/* ))} */}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Kode Pos
              </label>
              <div className="col-sm-10">
                {/* {data?.map((data) => ( */}
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  defaultValue={postal_code}
                  onChange={(e) => setPostal_code(e.target.value)}
                />
                {/* ))} */}
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
                <select
                  onChange={(e) => setEmployees(e.target.value)}
                  className="form-select"
                >
                  <option>Pilih Karyawan</option>
                  {employeesData?.map((d) => {
                    return (
                      <option selected={employees} value={d.id} key={d.id}>
                        {d.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </form>
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
        </>
      );
  }
};

export default EditGudang;
