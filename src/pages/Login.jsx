import React, { useState } from 'react';
import Logo from './Logo.jpeg'
import Swal from 'sweetalert2'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard'
import Url from '../Config';
import { useDispatch } from 'react-redux';
import { setData } from '../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';

export default function Login() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  // const isLoggedIn = jsCookie.get('auth')
  const isLoggedIn = !!useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    var toastMixin = Swal.mixin({
      toast: true,
      icon: 'success',
      title: 'General Title',
      animation: false,
      position: 'top-right',
      showConfirmButton: false,
      timer: 800,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    const userData = new URLSearchParams();
    userData.append('username', username);
    userData.append('password', password);
    axios({
      method: 'post',
      url: `${Url}/login`,
      data: userData,
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(setData({
            token: res.data,
          }));

          navigate('/')
          setTimeout(window.location.reload.bind(window.location), 300);
          toastMixin.fire({
            animation: true,
            title: 'Signed in Successfully'
          });
        }
      })
      .catch(err => {
        console.log(err)
        toastMixin.fire({
          icon: 'error',
          animation: true,
          title: 'Not match!'
        });
      })


  }

  if (isLoggedIn) {
    return <Dashboard />
  }

  return (
    <>
      <section class="h-120 gradient-form" style={{ backgroundColor: "#eee" }}>
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-xl-10">
              <div class="card rounded-3 text-black">
                <div class="row g-0">
                  <div class="col-lg-6">
                    <div class="card-body p-md-5 mx-md-4">

                      <div class="text-center">
                        <img src={Logo}
                          style={{ width: "100px" }} alt="logo" />
                        <h4 class="mt-1 mb-3 pb-2">PT. BMA - Dashboard</h4>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <p class="mt-1 mb-3 pb-2">Please login to your account</p>

                        <div class="form-outline mb-2">
                          <input
                            type="text"
                            id="form2Example11"
                            class="form-control"
                            onChange={e => setUserName(e.target.value)}
                          />
                          <label class="form-label" for="form2Example11">Username</label>
                        </div>

                        <div class="form-outline mb-2">
                          <input
                            type="password"
                            id="form2Example22"
                            class="form-control"
                            onChange={e => setPassword(e.target.value)}
                          />
                          <label class="form-label" for="form2Example22">Password</label>
                        </div>

                        <div class="d-grid gap-2">
                          <button class="btn btn-primary" type="submit">Login</button>
                        </div>

                      </form>

                    </div>
                  </div>
                  <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                    <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                      <h4 class="mb-4">We are more than just a company</h4>
                      <p class="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
// }