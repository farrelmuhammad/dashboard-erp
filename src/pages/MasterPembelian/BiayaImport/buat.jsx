import axios from "axios";
// import MaterialTable from "material-table";
import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";
import { PageHeader, Switch} from 'antd';

const BuatBiayaImport = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [referensi, setReferensi] = useState('');
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [getBiayaImport, setGetBiayaImport] = useState();
  const [status, setStatus] = useState('Active');

  const [category_id, setCategory_id] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [account_id, setAccount_id] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [checked, setChecked] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Nama Biaya kosong, Silahkan Lengkapi datanya ",
      });
    }
    else if(!account_id){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Akun Jurnal kosong, Silahkan Lengkapi datanya ",
      });
    }
    else if(!category_id){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Kategori kosong, Silahkan Lengkapi datanya ",
      });
    }
    else{

    

    
    console.log(data);

    const userData = new FormData();

    userData.append("nama", name);
    userData.append("kategori", category_id);
    userData.append("bagan_akun", account_id);
    userData.append("referensi", referensi);
    userData.append("status", status);

    axios({
      method: "post",
      url: `${Url}/costs`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire(
          "Berhasil Ditambahkan",
          `${getBiayaImport} Masuk dalam list`,
          "success"
        );
        navigate("/biayaimport");
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
   } };

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
  
    // load options using API call
    const loadOptionsAccount = (inputValue) => {
      return fetch(`${Url}/select_chart_of_accounts?limit=10&nama=${inputValue}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }).then((res) => res.json());
    };

    const onChange = () => {
      setChecked(!checked)
      checked ? setStatus('Active') : setStatus ('NonActive')
      // checked ? setChecked(false) : setChecked(true)
  
      // if (checked === false) {
      //   setStatus("Active");
      //   // console.log('Active');
      // } else {
      //   setStatus("Inactive");
      //   // console.log('Inactive');
      // }
    };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_cost_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetBiayaImport(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });

    
  }, []);

  return (
    <>
      <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Biaya Import">
       </PageHeader>
      <form className="  p-3 mb-3 bg-body rounded">
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              id="inputKode3"
              value={getBiayaImport}
              readOnly={getBiayaImport}
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
            <AsyncSelect
              placeholder="Pilih Akun Jurnal..."
              cacheOptions
              defaultOptions
              value={selectedAccount}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsAccount}
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
              onChange={(e) => setReferensi(e.target.value)}
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
                  : "Nonaktif"
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
          <button onClick={handleSubmit} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
        </div>
      </form>
   
    </>
  );
};

export default BuatBiayaImport;
