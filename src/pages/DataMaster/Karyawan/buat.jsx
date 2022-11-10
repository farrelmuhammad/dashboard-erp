// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
// import { Checkbox } from "@mui/material";
import React from "react";
// import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";
import { Button, PageHeader, Switch } from 'antd';
import { SendOutlined } from "@ant-design/icons";
import { number } from "yup";

const BuatKaryawan = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [nip, setNip] = useState("");
  const [name, setName] = useState("");
  const [initial, setInitial] = useState("");
  const [department_id, setDepartment_id] = useState("");
  const [position_id, setPosition_id] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [nik, setNik] = useState("");
  const [npwp, setNpwp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kelurahan, setkelurahan] = useState("");
  const [kecamatan, setKecataman] = useState("");
  const [kota, setKota] = useState("");
  const [kode_pos, setKode_pos] = useState("");
  const [date_of_birth, setDate_of_birth] = useState(null);
  const [start_date, setStart_date] = useState(null);
  const [status, setStatus] = useState("Active");
  const [warehouses, setWarehouses] = useState([]);
  const navigate = useNavigate();

  console.log(date_of_birth)

  // const [deptData, setDeptData] = useState();
  const [getEmployee, setGetEmployee] = useState([]);
  const [getWarehouse, setGetWarehouse] = useState([]);

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedValue, setSelectedDepartment] = useState(null);
  const [selectedValue2, setSelectedPosition] = useState(null);

  // handle selection
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

  const [checked, setChecked] = useState(true);
  const onChange = () => {
    setChecked(!checked)
    // checked ? setChecked(true) : setChecked(false)
    checked ? setStatus('Active') : setStatus ('NonActive')
    console.log(status)
    // if (checked === true) {
    //   setStatus("Active");
    //   // console.log('Active');
    // } else {
    //   setStatus("Inactive");
    //   // console.log('Inactive');
    // }
  };

  // useEffect(()=>{
  //   fetchDepartment()
  // },[])

  // const fetchDepartment = async () => {
  //   await axios.get(`${Url}/departments`, {
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: `Bearer ${auth.token}`,
  //     },
  //   }).then(function (response) {
  //     setDeptData(response.data.data);
  //     const getData = response.data.data;

  //     const optionsDepartments = getData.map(d => ({
  //       "value" : d.id,
  //       "label" : d.id

  //     }))
  //     setAllDepartment(optionsDepartments);
  //   })
  //   .catch((err) => {
  //     // Jika Gagal
  //   });
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!nip){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data NIP kosong, Silahkan Lengkapi datanya ",
      });
    }
    else if(nip.length > 9 )
    {
//Nip maksimal 9 karakter
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "NIP maksimal 9 karakter, Silahkan periksa kembali ",
      });
    }
    // else if(!nik){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Nama kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    else if(nik.length > 20 && nik != "")
    {
      //NIK maksimal 20 
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "NIK maksimal 20 karakter, Silahkan periksa kembali ",
      });
    }
    else if(!name){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Nama kosong, Silahkan Lengkapi datanya ",
      });
    }
    else if(!initial){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Inisial kosong, Silahkan Lengkapi datanya ",
      });
    }
    else if(!initial > 5 && initial != ""){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Inisial maksimal berisi 5 karakter ",
      });
    }
    else if(!department_id){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Departemen kosong, Silahkan Lengkapi datanya ",
      });
    }
    else if(!position_id){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Posisi kosong, Silahkan Lengkapi datanya ",
      });
    }
    // else if(!phone_number){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data nomor telepon kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    else if(phone_number?.length > 20 && phone_number != ""){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Nomor Telepon maksimal 20 karakter, Silahkan periksa kembali ",
      });
    }

    // else if(!email){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Email kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!date_of_birth){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Tanggal Lahir kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!start_date){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Tanggal Masuk kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!npwp){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Nama kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    else if(npwp?.length > 25 && npwp != ""){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "NPWP maksimal 25 karakter, Silahkan Lengkapi datanya ",
      });
    }

    // else if(!alamat){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Alamat kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!kelurahan){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Kelurahan kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!kecamatan){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Kecamatan kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!kota){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Kota kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!kode_pos){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Kode Pos kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!name){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Nama kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
else{

    

    const userData = new FormData();
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
    warehouses.map((war) => userData.append("gudang[]", war));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/employees`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        Swal.fire(
          "Berhasil Di Update",
          `${getEmployee} Masuk dalam list`,
          "success"
        );
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
  }};

  // const handleCheck = (event) => {
  //   var updatedList = [...warehouses];
  //   if (event.target.checked) {
  //     updatedList = [...warehouses, event.target.value];
  //   } else {
  //     updatedList.splice(warehouses.indexOf(event.target.value), 1);
  //   }
  //   setWarehouses(updatedList);
  // };
  useEffect(() => {
    axios
      .get(`${Url}/get_new_employee_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetEmployee(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });

    axios
      .get(`${Url}/warehouses`, {
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

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };

  if (getWarehouse?.length > 0) {
    return (
      <>
        <PageHeader
          ghost={false}
          className="bg-body rounded mb-2"
          onBack={() => window.history.back()}
          title="Buat Karyawan">
          <div className="row mb-3">
            <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
              Kode
            </label>
            <div className="col-sm-10">
              <input
                type="kode"
                className="form-control"
                id="inputKode3"
                // value={getEmployee}
                value={'Otomatis'}
                disabled
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
                id="inputnip"
                min="1"
                placeholder="Masukkan Nomor NIP"
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
                type="number"
                className="form-control"
                id="inputnik"
                min="1"
                placeholder="Masukkan Nomor KTP"
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
                type="text"
                className="form-control"
                id="inputNama"
                placeholder="Masukkan Nama Lengkap"
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
                type="text"
                className="form-control"
                id="inputinisial"
                placeholder="Masukkan Nama Inisial"
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
                type="number"
                id="phone"
                name="phone"
                className="form-control"
                placeholder="08x-xxx-xxx-xxx"
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
                type="email"
                className="form-control"
                id="inputemail"
                placeholder="mail@mail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputdate" className="col-sm-2 col-form-label">
              Tanggal Lahir
            </label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDate_of_birth(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputdate1" className="col-sm-2 col-form-label">
              Tanggal Masuk
            </label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                onChange={(e) => setStart_date(e.target.value)}
              />
            </div>
          </div>
        </PageHeader>
        <PageHeader
          ghost={false}
          className="bg-body rounded"
          title="Dokumen"
        >
          <div className="row mb-3">
            <label htmlFor="inputnpwp" className="col-sm-2 col-form-label">
              NPWP
            </label>
            <div className="col-sm-10">
              <input
                type="number"
                className="form-control"
                id="inputnpwp"
                min="1"
                placeholder="Masukkan Nomor NPWP"
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
                onChange={(e) => setKode_pos(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
            <div className="col-sm-7">
              <Switch defaultChecked={checked} onChange={onChange} />
              <label htmlFor="inputNama3" className="col-sm-4 ms-3 col-form-label">
                {
                  checked ? "Aktif"
                    : "NonAktif"
                }
              </label>
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

export default BuatKaryawan;
