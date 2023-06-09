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
import { useSelector } from "react-redux";
import { PageHeader} from 'antd';
import AsyncSelect from "react-select/async";

const BuatMataUang = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [getMataUang, setGetMataUang] = useState();

  const [hutangUsaha, setHutangUsaha] = useState('');
  const [selectedValue, setSelectedHU] = useState(null);

  const [uangMukaPembelian, setUangMukaPembelian] = useState('');
  const [selectedValue2, setSelectedUMP] = useState(null);

  const [creditNote, setCreditNote] = useState('');
  const [selectedValue3, setSelectedCN] = useState(null);

  const [selisihKurs, setSelisihKurs] = useState('');
  const [selectedValue4, setSelectedSK] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name){
   
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Data Nama Mata Uang kosong, Silahkan Lengkapi datanya ",
        });
    
    }
    else{

    console.log(data);

    const userData = new FormData();

    userData.append("nama", name);
    userData.append("deskripsi", keterangan);
    userData.append("accounts_payable",hutangUsaha);
    userData.append("prepaid_expenses",uangMukaPembelian);
    userData.append("credit_note_account",creditNote)
    userData.append("exchange_rate_difference",selisihKurs);

    axios({
      method: "post",
      url: `${Url}/currencies`,
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
          `${getMataUang} Masuk dalam list`,
          "success"
        );
        navigate("/matauang");
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
    }  };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_currency_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetMataUang(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

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
          title="Buat Mata Uang">
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
              // value={getMataUang}
              // readOnly={getMataUang}
              value={'Otomatis'}
              disabled
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
                  value={selectedValue}
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
                  value={selectedValue2}
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
                  value={selectedValue3}
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
                  value={selectedValue4}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e.id}
                  loadOptions={loadOptionsSK}
                  onChange={handleChangeSK}
                />
            </div>
        </div>


        <div className="d-grid mt-3 gap-2 d-md-flex justify-content-md-end">
          <button onClick={handleSubmit} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
        </div>
      </form>
   
    </>
  );
};

export default BuatMataUang;
