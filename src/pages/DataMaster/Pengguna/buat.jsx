import * as React from "react";
import axios from "axios";
// import { useFormik } from "formik";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import ReactSelect from "react-select";
// import { AsyncPaginate } from "react-select-async-paginate";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";


const BuatPengguna = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState("");
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const [getUser, setGetUser] = useState();
  // const [employeesData, setEmployeesData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);

  const [selectedValue, setSelectedEmployee] = useState(null);


  // const handleCheck = (event) => {
  //   var updatedList = [...groups];
  //   if (event.target.checked) {
  //     updatedList = [...groups, event.target.value];
  //   } else {
  //     updatedList.splice(groups.indexOf(event.target.value), 1);
  //   }
  //   setGroups(updatedList);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("username", username);
    userData.append("password", password);
    userData.append("karyawan", employees);
    groups.map((g) => userData.append("grup[]", g));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/users`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        Swal.fire(
          "Berhasil Ditambahkan",
          `${getUser} Masuk dalam list`,
          "success"
        );
        navigate("/pengguna");
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
    getIDuser();
    // getEmployees();
    getGroups();
  }, []);

  const getIDuser = async () => {
    await axios
      .get(`${Url}/get_new_user_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetUser(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  };

  const getGroups = async () => {
    await axios
      .get(`${Url}/groups`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGroupsData(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  };

  // const getEmployees = async () => {
  //   await axios
  //     .get(`${Url}/employees`, {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${auth.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setEmployeesData(res.data.data);
  //       console.log(res.data.data);
  //       const data = res.data.data;
  //     })
  //     .catch((err) => {
  //       // Jika Gagal
  //       console.log(err);
  //     });
  // };

  // handle selection
  const handleChangeEmployee = (value) => {
    setSelectedEmployee(value);
    setEmployees(value.id);
  };
  // load options using API call
  const loadOptionsEmployee = (inputValue) => {
    return fetch(`${Url}/select_employees?limit=10&name=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const optionsGroups = groupsData.map((d) => {
    return {
      label: d.name,
      value: d.id,
    };
  });

  // const optionsEmployees = employeesData.map((d) => {
  //   return {
  //     label: d.id,
  //     value: d.id,
  //   };
  // });

  // const optionsEmployees =[
  //   {
  //     label: "d.id",value: "d.id",
  //   },
  //   {
  //     label: "d.aa",value: "d.bb",
  //   }
  // ];

  const handleMultipleChange = (e) => {
    setGroups(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  // const handleSingleChange = (e) => {
  //   setEmployees(e.value);
  // };
  // const handleChangeEmployee = (e) => {
  //   setEmployees(Array.isArray(e) ? e.map((x) => x.value) : []);
  // };

  if ((groupsData?.length > 0)) {
    return (
      <>
        <form className="  p-3 mb-5 bg-body rounded">
          <div className="text-title text-start mb-4">
            <h3 className="title fw-bold">Buat Pengguna</h3>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Karyawan
            </label>
            <div className="col-sm-10">
              <AsyncSelect
                placeholder="Pilih Karyawan..."
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={(e) => e.name}
                getOptionValue={(e) => e.id}
                loadOptions={loadOptionsEmployee}
                onChange={handleChangeEmployee}
              />
              {/* <ReactSelect
                name="colors"
                options={optionsEmployees}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Masukkan Karyawan..."
                // onSelect={(e) => setGroups(e.target.value)}
                onChange={handleSingleChange}
              /> */}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Grup
            </label>
            <div className="col-sm-10">
              {/* <AsyncPaginate
                value={groups}
                loadOptions={optionsGroups}
                isMulti
                closeMenuOnSelect={false}
                onChange={setGroups}
              /> */}
              <ReactSelect
                value={optionsGroups.filter((obj) =>
                  groups.includes(obj.value)
                )}
                isMulti
                name="colors"
                options={optionsGroups}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Masukkan Grup..."
                onChange={handleMultipleChange}
              />
            </div>
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
                value={getUser}
                readOnly={getUser}
              // onChange={e => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Username
            </label>
            <div className="col-sm-10">
              <input
                type="Nama"
                className="form-control"
                id="inputNama3"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Kata Sandi
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                className="form-control"
                id="inputpassword"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Konfirmasi Kata Sandi
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                className="form-control"
                id="inputconfirmpassword"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button
              onClick={handleSubmit}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Simpan
            </Button>
          </div>
        </form>
      </>
    );
  }
};

export default BuatPengguna;
