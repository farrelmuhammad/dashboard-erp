import "./form.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsCookie from "js-cookie";
import Swal from "sweetalert2";
import Url from "../../../Config";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useSelector } from "react-redux";
import { PageHeader} from 'antd';

const BuatGrup = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [access, setAccess] = useState([]);
  const navigate = useNavigate();

  const [getGroup, setGetGroup] = useState();
  const [getModules, setGetModules] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("nama", name);
    userData.append("deskripsi", description);
    access.map((acc) => userData.append("hak_akses[]", acc));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }
    axios({
      method: "post",
      url: `${Url}/groups`,
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
          `${getGroup} Masuk dalam list`,
          "success"
        );
        navigate("/grup");
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

  const handleCheck = (event) => {
    var updatedList = [...access];
    if (event.target.checked) {
      updatedList = [...access, event.target.value];
    } else {
      updatedList.splice(access.indexOf(event.target.value), 1);
    }
    setAccess(updatedList);
  };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_group_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetGroup(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });

    axios
      .get(`${Url}/modules`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetModules(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  if (getModules?.length > 0) {
    return (
      <>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Grup Pengguna">
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
                // onChange={e => setId(e.target.value)}
                value={getGroup}
                readOnly={getGroup}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Grup
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
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Keterangan
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                id="form4Example3"
                rows="4"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="p-1 mb-2 bg-body rounded">
            <div className="text-title text-start">
              <h4 className="title fw-bold mb-2">Hak Akses</h4>
            </div>
            <div className="container">
              <div className="row">
                {getModules.map(
                  (d) =>
                    d.menus.map((menu) => {
                      return (
                        <div className="col-md-3 p-1">
                          <div className="card p-1">
                            <div className="card-body">
                              <h5 className="card-title">{menu.name}</h5>
                              <h6 className="card-subtitle mb-2 text-muted">
                                {d.id}
                              </h6>
                              <h6 className="card-subtitle mb-2 text-muted">
                                {d.name}
                              </h6>
                              <FormGroup>
                                {menu.access_rights.map((ar) => {
                                  return (
                                    // <div className="d-flex flex-column mb-3">
                                    //   <div className="p-2">
                                    //   <FormControlLabel
                                    //   control={<Checkbox />}
                                    //   onChange={handleCheck}
                                    //   label={ar.ability_name}
                                    //   // value={
                                    //   //   access.module_id ||
                                    //   //   access.module_menu_id ||
                                    //   //   access.id
                                    //   // }
                                    //   />
                                    //   </div>
                                    // </div>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      onChange={handleCheck}
                                      className="text-capitalize"
                                      label={ar.name}
                                      value={ar.id}
                                      />
                                  );
                                })}
                                {/* <FormControlLabel
                                  control={<Checkbox />}
                                  label="Read"
                                  />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="Update"
                                  />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="Delete"
                                  /> */}
                              </FormGroup>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  // menu.access_rights.map((access) =>
                  // )
                )}
              </div>
            </div>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            {/* <button className="btn btn-success" type="button" onClick={handleSubmit}>Simpan</button> */}
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

export default BuatGrup;
