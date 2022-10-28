
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { Checkbox } from "@mui/material";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";
import { Button, PageHeader, Skeleton, Switch } from "antd";
import { SendOutlined } from "@ant-design/icons";

const EditKaryawan = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [nip, setNip] = useState('');
  const [name, setName] = useState('');
  const [initial, setInitial] = useState('');
  const [department_id, setDepartment_id] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [position_id, setPosition_id] = useState('');
  const [positionName, setPositionName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [nik, setNik] = useState('');
  const [npwp, setNpwp] = useState('');
  const [alamat, setAlamat] = useState("");
  const [kelurahan, setkelurahan] = useState("");
  const [kecamatan, setKecataman] = useState("");
  const [kota, setKota] = useState("");
  const [kode_pos, setKode_pos] = useState("");
  const [date_of_birth, setDate_of_birth] = useState(null);
  const [start_date, setStart_date] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedValue, setSelectedDepartment] = useState([]);
  const [selectedValue2, setSelectedPosition] = useState(null);

  const [checked, setChecked] = useState(false);

  const handleChangeDepartment = (value) => {
    setSelectedDepartment(value);
    setDepartment_id(value.id);
  };
  // load options using API call
  const loadOptionsDepartment = (inputValue) => {
    return fetch(`${Url}/select_departments?nama=${inputValue}&limit=10`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangePosition = (value) => {
    setSelectedPosition(value);
    setPosition_id(value.id);
  };
  // load options using API call
  const loadOptionsPositon = (inputValue) => {
    return fetch(`${Url}/select_positions?nama=${inputValue}&limit=10`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const onChange = () => {
    checked ? setChecked(false) : setChecked(true)
    console.log(checked)

    if (checked === false) {
      setStatus("Inactive");
      // console.log('Active');
    } else {
      setStatus("Active");
      // console.log('Inactive');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nip", nip);
    userData.append("nama", name);
    userData.append("inisial", initial);
    userData.append("departemen", department_id);
    userData.append("posisi", position_id);
    userData.append("email", email);
    userData.append("nomor_telepon", phone_number);
    userData.append("nik", nik);
    userData.append("npwp", npwp);
    userData.append("alamat", alamat);
    userData.append("kelurahan", kelurahan);
    userData.append("kecamatan", kecamatan);
    userData.append("kota", kota);
    userData.append("kode_pos", kode_pos);
    userData.append("tanggal_lahir", date_of_birth);
    userData.append("tanggal_masuk", start_date);
    userData.append("status", status);
    axios({
      method: "put",
      url: `${Url}/employees/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire("Berhasil Ditambahkan", `${code} Masuk dalam list`, "success");
        navigate("/karyawan");
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

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };

  const getEmployeeById = async () => {
    axios
      .get(`${Url}/employees?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (response) {
        setData(response.data.data[0]);
        const getData = response.data.data[0];
        setLoading(false)
        setCode(getData.code);
        setNip(getData.nip);
        setName(getData.name);
        setInitial(getData.initial);
        setDepartment_id(getData.department.id);
        setDepartmentName(getData.department.name);
        setPosition_id(getData.position.id);
        setPositionName(getData.position.name);
        setEmail(getData.email);
        setPhone_number(getData.phone_number);
        setNik(getData.nik);
        setNpwp(getData.npwp);
        setAlamat(getData.address);
        setkelurahan(getData.urban_village);
        setKecataman(getData.sub_district);
        setKota(getData.city);
        setKode_pos(getData.postal_code);
        setDate_of_birth(getData.date_of_birth);
        setStart_date(getData.start_date);
        setStatus(getData.status);
        console.log(getData)
      })
      .catch((err) => {
        // Jika Gagal
      });
  }

  useEffect(() => {
    getEmployeeById()
  }, []);

  if (loading) {
    return (
      <>
        <form className="p-3 mb-3 bg-body rounded">
          <Skeleton active />
        </form>
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
        title="Edit Karyawan">
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              defaultValue={code}
              disabled
              id="inputKode3"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            NIP
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputKode3"
              defaultValue={nip}
              onChange={(e) => setNip(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            NIK
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              id="inputKode3"
              defaultValue={nik}
              onChange={(e) => setNik(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Karyawan
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Inisial
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={initial}
              onChange={(e) => setInitial(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Departemen
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Departemen..."
              cacheOptions
              defaultOptions
              defaultInputValue={departmentName}
              value={selectedValue}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsDepartment}
              onChange={handleChangeDepartment}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Posisi
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Posisi..."
              cacheOptions
              defaultOptions
              defaultInputValue={positionName}
              value={selectedValue2}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsPositon}
              onChange={handleChangePosition}
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
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Tanggal Lahir
          </label>
          <div className="col-sm-10">
            <input
              type="date"
              className="form-control"
              defaultValue={date_of_birth}
              onChange={(e) => setDate_of_birth(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Tanggal Masuk
          </label>
          <div className="col-sm-10">
            <input
              type="date"
              className="form-control"
              defaultValue={start_date}
              onChange={(e) => setStart_date(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      <PageHeader
        ghost={false}
        title="Dokumen"
      >
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            NPWP
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={npwp}
              onChange={(e) => setNpwp(e.target.value)}
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
              placeholder="Masukkan Alamat"
              defaultValue={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Kelurahan
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              placeholder="Masukkan Kelurahan"
              defaultValue={kelurahan}
              onChange={(e) => setkelurahan(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Kecamatan
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              placeholder="Masukkan Kecamatan"
              defaultValue={kecamatan}
              onChange={(e) => setKecataman(e.target.value)}
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
              placeholder="Masukkan Kota"
              defaultValue={kota}
              onChange={(e) => setKota(e.target.value)}
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
              placeholder="Masukkan Kode Pos"
              defaultValue={kode_pos}
              onChange={(e) => setKode_pos(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
          <div className="col-sm-7">
            <Switch defaultChecked={status} onChange={onChange} />
            <label htmlFor="inputNama3" className="col-sm-4 ms-3 col-form-label">
              {
                checked ? "Nonaktif"
                  : "Aktif"
              }
            </label>
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

export default EditKaryawan;
