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
import Kategori from "../../DataMaster/Kategori";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";
// import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { TextField } from "@mui/material";
// import CheckIcon from "@mui/icons-material/Check";
import { PageHeader, Switch } from "antd";
import ReactSelect from "react-select";

const EditBiayaImport = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [kategori, setKategori] = useState(null);
  const [referensi, setReferensi] = useState('');
  const [baganakun, setBaganAkun] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  
  const [checked, setChecked] = useState();

  // const [idBaganAkun, setIdBaganAkun] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [category_id, setCategory_id] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [account_id, setAccount_id] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [dataAkun, setDataAkun] = useState()

  // const statusAwal = () => {

  //  // status === "Inactive" ? setChecked(false) : setChecked(true)

  //   if(status === 'Active'){
  //     setChecked(checked)
  //   }
  //   else if(status === 'Inactive'){
  //     setChecked(!checked)
  //   }
  // }

  // useEffect(() => {
  //   statusAwal()
  // }, []);

  const onChange = () => {
    console.log(checked)
   setChecked(!checked)
    
   if(checked === false){
    setStatus("Active")
    console.log("as")
   }
   else{
    setStatus("Inactive")
    console.log("ia")
   }

    //checked ? setStatus('Active') : setStatus ('InActive')

    //checked ? setChecked(false) : setChecked(true)

    // if (checked === false) {
    //     setStatus("Active");
    //     // console.log('Active');
    // } else {
    //     setStatus("Inactive");
    //     // console.log('Inactive');
    // }
};


  const handleUpdate = async (e) => {
    e.preventDefault();
    const biayaImportData = new URLSearchParams();
    biayaImportData.append("nama", name);
    biayaImportData.append("kategori", category_id);
    biayaImportData.append("bagan_akun", account_id);
    biayaImportData.append("referensi", referensi);
    biayaImportData.append("status", status);

    axios({
      method: "put",
      url: `${Url}/costs/${id}`,
      data: biayaImportData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        // console.log(res);
        Swal.fire("Berhasil Ditambahkan", `${code} Masuk dalam list`, "success");
        navigate("/biayaimport");
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

  useEffect(() => {
    getSupplierById()
  }, []);

  const getSupplierById = async () => {
    await axios.get(`${Url}/costs?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        setData(res.data.data[0]);
        const getData = res.data.data[0];
        setCode(getData.code);
        setName(getData.name);
        setKategori(getData.category);
        setAccount_id(getData.chart_of_account.id);
        setBaganAkun(getData.chart_of_account.name);
        setSelectedAccount(getData.chart_of_account.name);
        if(getData.category != null){
          setCategory_id(getData.category.id);
          setKategori(getData.category.name);
        }
        if( getData.reference != null ){
          setReferensi(getData.reference) ;
        } 

        setStatus(getData.status);

        if(getData.status === 'Active'){
          setChecked(true)
        }
        else{
          setChecked(false)
        }
        setLoading(false);
        console.log(res.data.data[0])

        //setChecked(res.data.data[0].status)


      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }

  // select data kategori
  const handleChangeCategory = (value) => {
    setSelectedCategory(value);
    setCategory_id(value.id);
  };

  // load options using API call
  const loadOptionsCategory = (inputValue) => {
    return fetch(`${Url}/select_costs?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

    // select data akun
    const handleChangeAccount = (value) => {
      setSelectedAccount(value);
      setAccount_id(value.id);
    };
  
    useEffect(() => {
        
      axios.get(`${Url}/select_chart_of_accounts?anak_terakhir=1&kode_kategori[]=511&kode_kategori[]=512&kode_kategori[]=611&kode_kategori[]=612&kode_kategori[]=811`, {
          headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
          },
      }).then((res) => {
          let tmp = []
          for (let i = 0; i < res.data.length; i++) {
              tmp.push({
                  label: res.data[i].name,
                  value: res.data[i].id
              })
          }
          //console.log(res)
          setDataAkun(tmp)
       // console.log(dataAkun)
      }


      );
  }, [])


    // load options using API call
    // const loadOptionsAccount = () => {
    //   return fetch(`${Url}select_chart_of_accounts?anak_terakhir=1&kode_kategori[]=511&kode_kategori[]=512&kode_kategori[]=611&kode_kategori[]=612&kode_kategori[]=811`, {
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: `Bearer ${auth.token}`,
    //     },
    //   }).then((res) => console.log(res)
    //   );
    // };

    const loadOptionsAccount = (inputValue) => {
      return fetch(`${Url}/select_chart_of_accounts?anak_terakhir=1&nama=${inputValue}`, {
          headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
          },
      }).then((res) => res.json());
  };


  if(loading){
    return(
      <div></div>
    )
  }

  return (
    <>
      <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Edit Biaya Import">
        </PageHeader>
      <form className="  p-3 mb-4 bg-body rounded">
        {/* <div className="text-title text-start mb-4">
          <h3 className="title fw-bold">Edit Biaya Import</h3>
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
            Nama Biaya
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
            Kategori
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Kategori..."
              cacheOptions
              defaultOptions
              defaultInputValue={kategori}
              value={selectedCategory}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsCategory}
              onChange={handleChangeCategory}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Akun Jurnal
          </label>
          <div className="col-sm-10">
            <ReactSelect
              placeholder="Pilih Akun Jurnal..."
              cacheOptions
              defaultOptions
              defaultInputValue={baganakun}
              value={selectedAccount}
              getOptionLabel={(e) => e.label}
              getOptionValue={(e) => e.value}
              options={dataAkun}
              onChange={handleChangeAccount}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Referensi
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={referensi}
              onChange={(e) => setReferensi(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
          <div className="col-sm-7">
            
            <Switch defaultChecked={status === 'Active' ? true : false
            } onChange={onChange} />
            <label htmlFor="inputNama3" className="col-sm-4 ms-3 col-form-label">
              {
                checked === true ? "Aktif"
                  : "NonAktif"
              }
            </label>
            </div>
          </div>


        {/* <fieldset className="row mb-3">
          <legend className="col-form-label col-sm-2 pt-0">Status</legend>
          <div className="col-sm-10">
            <div className="form-check">
              <input
                onChange={(e) => setStatus(e.target.value)}
                value="Active"
                checked={status === "Active"}
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" htmlFor="gridRadios1">
                Aktif
              </label>
            </div>
            <div className="form-check">
              <input
                onChange={(e) => setStatus(e.target.value)}
                value="Inactive"
                checked={status === "Inactive"}
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
              />
              <label className="form-check-label" htmlFor="gridRadios2">
                Non-Aktif
              </label>
            </div>
          </div>
        </fieldset> */}
        <div className="d-grid mt-3 gap-2 d-md-flex justify-content-md-end">
          <button onClick={handleUpdate} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
        </div>
      </form>
  
    </>
  );
};

export default EditBiayaImport;
