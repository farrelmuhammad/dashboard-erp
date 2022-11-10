import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Checkbox,
  IconButton,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
// import MaterialTable from "material-table";
import { useSelector } from "react-redux";
// import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { TextField } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";
import { PageHeader } from "antd";

const EditMataUang = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();


  const [hutangUsaha, setHutangUsaha] = useState('');
  const [selectedValue, setSelectedHU] = useState(null);

  const [uangMukaPembelian, setUangMukaPembelian] = useState('');
  const [selectedValue2, setSelectedUMP] = useState(null);

  const [creditNote, setCreditNote] = useState('');
  const [selectedValue3, setSelectedCN] = useState(null);

  const [selisihKurs, setSelisihKurs] = useState('');
  const [selectedValue4, setSelectedSK] = useState(null);


  // const [getCustomer, setGetCustomer] = useState();

  const [address, setAddress] = useState([]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nama", name);
    
    userData.append("deskripsi", keterangan);

    axios({
      method: "put",
      url: `${Url}/currencies/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        // console.log(res);
        Swal.fire("Berhasil Ditambahkan", `${code} Masuk dalam list`, "success");
        navigate("/matauang");
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


  // const handleAddress = async (e) => {
  //   e.preventDefault();
  //   const userData = new FormData();
  //   address.map((address) => {
  //     userData.append("alamat[]", address.address);
  //     userData.append("kota[]", address.city);
  //     userData.append("kecamatan[]", address.sub_district);
  //     userData.append("kelurahan[]", address.urban_village);
  //     userData.append("kode_pos[]", address.postal_code);
  //   });
  //   // for (var pair of userData.entries()) {
  //   //   console.log(pair[0] + ', ' + pair[1]);
  //   // }
  //   axios({
  //     method: "post",
  //     url: `${Url}/supplier_addresses/${id}`,
  //     data: userData,
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: `Bearer ${auth.token}`,
  //     },
  //   })
  //     .then(function (res) {
  //       //handle success
  //       console.log(res);
  //       Swal.fire("Alamat Berhasil Ditambahkan", `Alamat ${id} Berhasil Ditambah`, "success");
  //       navigate(`/supplier/edit/${id}`);
  //       setTimeout(window.location.reload.bind(window.location), 600);
  //     })
  //     .catch((err) => {
  //       if (err.response) {
  //         console.log("err.response ", err.response);
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: err.response.data.error.nama,
  //         });
  //       } else if (err.request) {
  //         console.log("err.request ", err.request);
  //         Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
  //       } else if (err.message) {
  //         // do something other than the other two
  //         Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
  //       }
  //     });
  // }

  useEffect(() => {
    getMataUangById()
  }, []);

  const getMataUangById = async () => {
    await axios.get(`${Url}/currencies?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        // setData(res.data.data[0]);
        const getData = res.data.data[0];
        setCode(getData.code);
        setName(getData.name);
        setKeterangan(getData.description);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }


  const loadOptionsHU = (inputValue) => {
    return fetch(`${Url}/select_chart_of_accounts?kode_kategori[]=211&kode_kategori[]=221&nama=${inputValue}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
        },
    }).then((res) => res.json());
};

const handleChangeHU = (value) => {
  setSelectedHU(value);
  setHutangUsaha(value.id);
};


const loadOptionsUMP = (inputValue) => {
  return fetch(`${Url}/select_chart_of_accounts?kode_kategori[]=113&nama=${inputValue}`, {
      headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
      },
  }).then((res) => res.json());
};

const handleChangeUMP = (value) => {
setSelectedUMP(value);
setUangMukaPembelian(value.id);
};

const loadOptionsCN = (inputValue) => {
  return fetch(`${Url}/select_chart_of_accounts?kode_kategori[]=113&nama=${inputValue}`, {
      headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
      },
  }).then((res) => res.json());
};

const handleChangeCN = (value) => {
setSelectedCN(value);
setCreditNote(value.id);
};

const loadOptionsSK = (inputValue) => {
  return fetch(`${Url}/select_chart_of_accounts?kode_kategori[]=512&kode_kategori[]=611&kode_kategori[]=612&kode_kategori[]=811&nama=${inputValue}`, {
      headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
      },
  }).then((res) => res.json());
};

const handleChangeSK = (value) => {
setSelectedSK(value);
setSelisihKurs(value.id);
};

  return (
    <>
      <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Edit Mata Uang">
        </PageHeader>
      <form className="  p-3 mb-4 bg-body rounded">
        {/* <div className="text-title text-start mb-4">
          <h3 className="title fw-bold">Edit Mata Uang</h3>
        </div> */}
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
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Mata Uang
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              defaultValue={name}
              id="inputNama3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Keterangan
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
                <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Akun Hutang Usaha</label>
                <div className="col-sm-10">
                 <AsyncSelect
                    placeholder="Pilih Akun Hutang Usaha..."
                    cacheOptions
                    defaultOptions
                    // defaultInputValue={masterAccountName}
                    // value={selectedValue2}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    loadOptions={loadOptionsHU}
                    onChange={handleChangeHU}
                  />
                </div>
          </div>
          <div className="row mb-3">
                <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Akun Uang Muka Pembelian</label>
                <div className="col-sm-10">
                 <AsyncSelect
                    placeholder="Pilih Akun Uang Muka Pembelian..."
                    cacheOptions
                    defaultOptions
                    // defaultInputValue={masterAccountName}
                    // value={selectedValue2}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    loadOptions={loadOptionsUMP}
                    onChange={handleChangeUMP}
                  />
                </div>
          </div>
          <div className="row mb-3">
                <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Akun Credit Note</label>
                <div className="col-sm-10">
                 <AsyncSelect
                    placeholder="Pilih Akun Credit Note..."
                    cacheOptions
                    defaultOptions
                    // defaultInputValue={masterAccountName}
                    // value={selectedValue2}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    loadOptions={loadOptionsCN}
                    onChange={handleChangeCN}
                  />
                </div>
          </div>
          <div className="row mb-3">
                <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Akun Selisih Kurs</label>
                <div className="col-sm-10">
                 <AsyncSelect
                    placeholder="Pilih Akun Selisih Kurs..."
                    cacheOptions
                    defaultOptions
                    // defaultInputValue={masterAccountName}
                    // value={selectedValue2}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    loadOptions={loadOptionsSK}
                    onChange={handleChangeSK}
                  />
                </div>
          </div>



        <div className="d-grid mt-3 gap-2 d-md-flex justify-content-md-end">
          <button onClick={handleUpdate} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
          {/* <Button
          onClick={handleSubmit}
          variant="contained"
          endIcon={<SendIcon />}
        >
          Simpan
        </Button> */}
        </div>
      </form>
      {/* <form className="  p-3 mb-3 bg-body rounded">
        <MaterialTable
          title="Alamat Pelanggan"
          data={address}
          columns={columns}
          onChange={(e) => setAddress(e.target.value)}
          editable={{
            onRowAdd: (newRow) =>
              new Promise((resolve, reject) => {
                const updatedRows = [
                  ...address,
                  { id: address.length + 1, ...newRow },
                ];
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowDelete: (selectedRow) =>
              new Promise((resolve, reject) => {
                const index = selectedRow.tableData.id;
                const updatedRows = [...address];
                updatedRows.splice(index, 1);
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowUpdate: (updatedRow, oldRow) =>
              new Promise((resolve, reject) => {
                const index = oldRow.tableData.id;
                const updatedRows = [...address];
                updatedRows[index] = updatedRow;
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
            onBulkUpdate: (selectedRows) =>
              new Promise((resolve, reject) => {
                const rows = Object.values(selectedRows);
                const updatedRows = [...address];
                let index;
                rows.map((emp) => {
                  index = emp.oldData.tableData.id;
                  updatedRows[index] = emp.newData;
                });
                setTimeout(() => {
                  setAddress(updatedRows);
                  resolve();
                }, 2000);
              }),
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
          }}
        />
        <div className="d-grid mt-3 gap-2 d-md-flex justify-content-md-end">
          <button onClick={handleAddress} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
        </div>
      </form> */}
      
    </>
  );
};

export default EditMataUang;
