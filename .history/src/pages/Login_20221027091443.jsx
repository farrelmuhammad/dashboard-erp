import React, { useState } from "react";
import Logo from "./Logo.jpeg";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Url from "../Config";
import { useDispatch } from "react-redux";
import { setData } from "../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function Login() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  // const isLoggedIn = jsCookie.get('auth')
  const isLoggedIn = !!useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var toastMixin = Swal.mixin({
      toast: true,
      icon: "success",
      title: "General Title",
      animation: false,
      position: "top-right",
      showConfirmButton: false,
      timer: 800,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    const userData = new URLSearchParams();
    userData.append("username", username);
    userData.append("password", password);
    axios({
      method: "post",
      url: `${Url}/login`,
      data: userData,
    })
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setData({
              token: res.data,
            })
          );

          navigate("/");
          setTimeout(window.location.reload.bind(window.location), 300);
          toastMixin.fire({
            animation: true,
            title: "Signed in Successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toastMixin.fire({
          icon: "error",
          animation: true,
          title: "Not match!",
        });
      });
  };

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <>
      <section
        className="h-120 gradient-form"
        style={{ backgroundColor: "#eee" }}
      >
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img src={Logo} style={{ width: "100px" }} alt="logo" />
                        <h4 className="mt-1 mb-3 pb-2">PT. BMA - Dashboard</h4>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <p className="mt-1 mb-3 pb-2">
                          Please login to your account
                        </p>

                        <div className="form-outline mb-2">
                          <Input
                            size="large"
                            value={getTaxes}
                            onChange={(e) => setUserName(e.target.value)}
                          />
                          <label className="form-label" for="form2Example11">
                            Username
                          </label>
                        </div>

                        <div className="form-outline mb-2">
                          <Input.Password
                            placeholder="input password"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                          />
                          <input
                            type="password"
                            id="form2Example22"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label className="form-label" for="form2Example22">
                            Password
                          </label>
                        </div>

                        <div className="d-grid gap-2">
                          <button className="btn btn-primary" type="submit">
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                      <h4 className="mb-4">We are more than just a company</h4>
                      <p className="small mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
// }
