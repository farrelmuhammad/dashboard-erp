import * as React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";
import { Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditPengguna = ({ defaultOptionValueEmp, defaultOptionValueGroups }) => {
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState('');
  const [groups, setGroups] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState([]);

  const [employeesData, setEmployeesData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, "Mininum 2 characters")
        .max(15, "Maximum 15 characters")
        .required("Required!"),
      password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Required!"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Password's not match")
        .required("Required!"),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("username", username);
    userData.append("password", password);
    userData.append("karyawan", employees);
    groups.map((g) => userData.append("grup[]", g));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    axios({
      method: "put",
      url: `${Url}/users/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        Swal.fire("Berhasil Ditambahkan", `${code} Masuk dalam list`, "success");
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
    getUserById();
    getEmployees();
    getGroups();
  }, []);

  const getUserById = async () => {
    await axios
      .get(`${Url}/users?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (response) {
        setData(response.data.data[0]);
        const getData = response.data.data[0];
        setCode(getData.code);
        setUsername(getData.username);
        setGroups(
          response.data.data[0].groups
        );
        console.log(response.data.data);
        console.log(
          response.data.data[0].groups
        );
        setEmployees(
          response.data.data[0].employee_id
        )
        console.log(JSON.stringify(response.data.data[0].employee_id));
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  };

  const getEmployees = async (inputValue) => {
    return axios(`${Url}/employees?limit=10&name=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        setEmployeesData(res.data.data)
        console.log(res.data.data)
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
      .then((res) => setGroupsData(res.data.data))
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  };


  const optionsGroups = groupsData.map((d) => {
    return {
      label: d.name,
      value: d.code,
    };
  });

  const optionsEmployees = employeesData.map((d) => {
    return {
      label: d.id,
      value: d.id,
    };
  });


  const handleMultipleChange = (e) => {
    setGroups(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const handleSingleChange = (e) => {
    setEmployees(e.value);
  };

  const [defaultValue, setDefaultValue] = useState('')

  useEffect(() => {
    setEmployees(defaultValue);
  }, [defaultValue]);

  const loadOptions = (searchKey) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        !defaultValue &&
          setDefaultValue(optionsEmployees.find((o) => o.value === defaultOptionValueEmp));
        const filtered = optionsEmployees.filter((o) => o.label.includes(searchKey));

        resolve(filtered);
      }, 1000);
    });
  };

  if (data) {
    if ((employeesData?.length > 0) & (groupsData?.length > 0)) {
      return (
        <>
          <form className="  p-3 mb-5 bg-body rounded">
            <div className="text-title text-start mb-4">
              <h3 className="title fw-bold">Edit Pengguna</h3>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Karyawan
              </label>
              <div className="col-sm-10">
                <AsyncSelect
                  placeholder="Masukkan Karyawan..."
                  cacheOptions
                  defaultOptions
                  value={optionsEmployees.find(op => {
                    return op.value === employees
                  })}
                  onChange={handleSingleChange}
                  loadOptions={loadOptions}
                />
                {/* <ReactSelect
                value={optionsEmployees.filter((obj) =>
                  employees.includes(obj.value)
                )}
                name="colors"
                options={optionsEmployees}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Masukkan Karyawan..."
                onChange={handleSingleChange}
              /> */}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Grup
              </label>
              <div className="col-sm-10">
                <ReactSelect
                  key={groups}
                  selectOption={groups}
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
                  value={code}
                  disabled
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
                  defaultValue={data.username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {formik.errors.username && formik.touched.username && (
                  <p>{formik.errors.username}</p>
                )}
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
                  defaultValue={data.password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {formik.errors.password && formik.touched.password && (
                  <p>{formik.errors.password}</p>
                )}
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
                {formik.errors.password && formik.touched.password && (
                  <p>{formik.errors.password}</p>
                )}
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
  }
};

export default EditPengguna;
