import axios from "axios";
// import MaterialTable from "material-table";
import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { PageHeader } from "antd";

const DetailMataUang = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [HU, setHU] = useState('')
  const [UMP,setUMP] = useState()
  const [cn, setCN] = useState()
  const [sk, setSK] = useState()

  const [dataHU, setDataHU] = useState('')
  const [dataUMP, setDataUMP] = useState('')
  const [dataCN, setDataCN] = useState('')
  const [dataSK, setDataSK] = useState('')

  useEffect(() => {
    getDetailSupplier()
    getDataCOAName(HU)
    getDataCOAName2(UMP)
    getDataCOAName3(cn)
    getDataCOAName4(sk)
  }, []);

  const getDetailSupplier = async () => {
    await axios.get(`${Url}/currencies?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then((res) => {
      setData(res.data.data);
      console.log(res.data.data)

      setHU(res.data.data[0].accounts_payable)
      setUMP(res.data.data[0].prepaid_expenses)
      setCN(res.data.data[0].credit_note_account)
      setSK(res.data.data[0].exchange_rate_difference)

      
      console.log(res.data.data[0].prepaid_expenses)
    })
    .catch((err) => {
      // Jika Gagal
      console.log(err);
    });
  }

  const getDataCOAName = async (idCOA) => {
  await  axios.get(`${Url}/chart_of_accounts?id=${idCOA}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then((res) => {
      setDataHU(res.data.data[0].name)
     // setData(res.data.data);
     // console.log(res.data.data[0].name)
    })
    .catch((err) => {
      // Jika Gagal
      console.log(err);
    });
  }

  const getDataCOAName2 = async (idCOA) => {
    await  axios.get(`${Url}/chart_of_accounts?id=${idCOA}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setDataUMP(res.data.data[0].name)
       // setData(res.data.data);
       // console.log(res.data.data[0].name)
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
    }

    const getDataCOAName3 = async (idCOA) => {
      await  axios.get(`${Url}/chart_of_accounts?id=${idCOA}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        })
        .then((res) => {
          setDataCN(res.data.data[0].name)
         // setData(res.data.data);
         // console.log(res.data.data[0].name)
        })
        .catch((err) => {
          // Jika Gagal
          console.log(err);
        });
      }

      const getDataCOAName4 = async (idCOA) => {
        await  axios.get(`${Url}/chart_of_accounts?id=${idCOA}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          })
          .then((res) => {
            setDataSK(res.data.data[0].name)
           // setData(res.data.data);
           // console.log(res.data.data[0].name)
          })
          .catch((err) => {
            // Jika Gagal
            console.log(err);
          });
        }

  if(data) {
      return (
        <>
         <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Mata Uang">
          </PageHeader>
          
          <form className="  p-3 mb-3 bg-body rounded">
            {/* <div className="text-title text-start mb-4">  
              <h3 className="title fw-bold">Detail Mata Uang</h3>
            </div> */}
            <div className="row mb-3">
              <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
                Kode
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                <input
                  type="kode"
                  className="form-control"
                  id="inputKode3"
                  value={d.code}
                  disabled
                />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Nama Mata Uang
              </label>
              <div className="col-sm-10">
                {data.map((d) => (
                    <input
                      type="Nama"
                      className="form-control"
                      id="inputNama3"
                      disabled
                      value={d.name}
                    />
                ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Keterangan
              </label>
              <div className="col-sm-10">
              {data.map((d) => (
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={d.description}
                  />
              ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Akun Hutang Usaha
              </label>
              <div className="col-sm-10">
              <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={dataHU}
              
              />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Akun Uang Muka Pembelian
              </label>
              <div className="col-sm-10">
            
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={dataUMP}
              />
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Akun Credit Note
              </label>
              <div className="col-sm-10">
            
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={dataCN}
                  />
            
              </div>
            </div>

            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Akun Selisih Kurs
              </label>
              <div className="col-sm-10">
            
                  <input
                    type="Nama"
                    className="form-control"
                    id="inputNama3"
                    disabled
                    value={dataSK}
                  />
             
              </div>
            </div>
           
          </form>
        </>
      );
  }
};

export default DetailMataUang;
