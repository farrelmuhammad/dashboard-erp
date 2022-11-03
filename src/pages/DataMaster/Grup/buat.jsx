import "./form.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import { useSelector } from "react-redux";
import { Button, Checkbox, Col, Collapse, Modal, PageHeader, Row } from 'antd';
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { array } from "yup";
const { Panel } = Collapse;

const BuatGrup = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [Edescription, setEDescription] = useState('  ');
  const [access, setAccess] = useState([]);
  const navigate = useNavigate();

  const [getGroup, setGetGroup] = useState();
  const [getModules, setGetModules] = useState();

  const [modal2Visible, setModal2Visible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Nama kosong, Silahkan Lengkapi datanya ",
      });
    }
    // else if(!description){
    //   userData.append("deskripsi", Edescription)
    // }
    else {
      const userData = new FormData();
      userData.append("nama", name);
      if (!description) {
        userData.append("deskripsi", description)
      }
      else {
        userData.append("deskripsi", description);
      }

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
              text: err.response.data.error,
            });
          } else if (err.request) {
            console.log("err.request ", err.request);
            Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
          } else if (err.message) {
            // do something other than the other two
            Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
          }
        });
    }
  };

  const handleCheck = (event) => {
    var updatedList = [...access];
    if (event.target) {
      updatedList = [...access, event.target.value];
    } else {
      updatedList.splice(access.indexOf(event.target.value), 1);
    }
    setAccess(updatedList);
    console.log(updatedList);
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
          className="bg-body rounded mb-2"
          onBack={() => window.history.back()}
          title="Buat Grup Pengguna"
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
                // onChange={e => setId(e.target.value)}
                value={getGroup}
                disabled
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
                // defaultValue={"-"}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Hak Akses
            </label>
            <div className="col-sm-10">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModal2Visible(true)}
              />
            </div>
          </div>
          <Modal
            title="Tambah Hak Akses"
            centered
            visible={modal2Visible}
            onCancel={() => setModal2Visible(false)}
            width={800}
            height={500}
            footer={null}
          >
            {getModules.map(
              (d) =>
                d.menus.map((menu) => {
                  return (
                    <Collapse>
                      <Panel header={menu.name} key={menu.id}>
                        {/* <Checkbox.Group
                          style={{
                            width: '100%',
                          }}
                          onChange={handleCheck}
                        > */}
                        <Row>
                          {menu.access_rights.map((ar) => {
                            return (
                              <Col span={8}>
                                {/* <Checkbox value={ar.id}>{ar.name}</Checkbox> */}
                                <Checkbox
                                  value={ar.id}
                                  // checked={ar.id == access}
                                  // checked={ar.id}
                                  onChange={handleCheck}
                                >
                                  {ar.name}
                                </Checkbox>
                              </Col>
                            )
                          })}
                        </Row>
                        {/* </Checkbox.Group> */}
                      </Panel>
                    </Collapse>
                  )
                }))}
          </Modal>
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

export default BuatGrup;
