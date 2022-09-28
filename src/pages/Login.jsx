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
      <section class="vh-100" style={{ backgroundColor: "#fff" }}>
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
              <div class="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                <div class="card-body p-5 text-center">

                  <h3 class="mb-5">Sign in</h3>

                  <div class="form-outline mb-4">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      onChange={e => setUserName(e.target.value)}
                    />
                    <label class="form-label">Username</label>
                  </div>

                  <div class="form-outline mb-4">
                    <input
                      type="password"
                      id="typePasswordX-2"
                      class="form-control form-control-lg"
                      onChange={e => setPassword(e.target.value)}
                    />
                    <label class="form-label" for="typePasswordX-2">Password</label>
                  </div>

                  <button class="btn btn-primary btn-lg btn-block" type="submit" onClick={handleSubmit}>Login</button>

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