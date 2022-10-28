import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { PageHeader, Skeleton } from "antd";

const DetailGudang = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [tipe, setTipe] = useState('');
  const [city, setCity] = useState('');
  const [chart, setChart] = useState('');
  const [chartName, setChartName] = useState('');
  const [postal_code, setPostal_code] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [employees, setEmployees] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWarehouse()
  }, []);

  const fetchWarehouse = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${Url}/warehouses?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      const getData = res.data.data[0];
      setCode(getData.code)
      setName(getData.name)
      setAddress(getData.address)
      setCity(getData.city)
      setTipe(getData.type)
      setChart(getData.chart_of_account.id)
      setChartName(getData.chart_of_account.name)
      setEmployees(getData.employee.id)
      setEmployeesName(getData.employee.name)
      setTipe(getData.type)
      setPostal_code(getData.postal_code)
      setPhone_number(getData.phone_number)
    }
    catch (err) {
      // setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
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
        title="Detail Gudang"
      >
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
            <input
              // key={index}
              type="Nama"
              className="form-control"
              id="inputNama3"
              defaultValue={name}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Tipe
          </label>
          <div className="col-sm-10">
            <select
              id="bussinessSelect"
              className="form-select"
              disabled
            >
              <option>{tipe}</option>
            </select>
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
              defaultValue={address}
              disabled
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
              defaultValue={city}
              disabled
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
              defaultValue={postal_code}
              disabled
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
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Karyawan
          </label>
          <div className="col-sm-10">
            <select
              id="bussinessSelect"
              className="form-select"
              disabled
            >
              <option>{employees}</option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            COA
          </label>
          <div className="col-sm-10">
            <select
              id="bussinessSelect"
              className="form-select"
              disabled
            >
              <option>{chartName}</option>
            </select>
          </div>
        </div>
      </PageHeader>
    </>
  );
};

export default DetailGudang;
