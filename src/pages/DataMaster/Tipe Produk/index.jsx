import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import TipeProdukTable from '../../../components/moleculles/TipeProdukTable'
import { IconButton } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const TipeProduk = () => {
  // const token = jsCookie.get('auth')
  const [userAccess, setUserAccess] = useState([])
  const auth = useSelector(state => state.auth);

  // useEffect(() => {
  //   axios.get(`${Url}/get_user_access_rights?ability_name=create-type`, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     }
  //   })
  //     .then(res => {
  //       setUserAccess(res.data)
  //       console.log(res.data)
  //     })
  // }, [])

  useEffect(() => {
    axios.get(`${Url}/get_user_access_rights?ability_name=create-type`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
      .then(res => {
        setUserAccess(res.data)
        console.log(res.data)
      })
  }, [])

  if (userAccess) {
    return (
      <div className="container   p-3 mb-5 bg-body rounded d-flex flex-column">
        <div className="row">
          <div className="col text-title text-start">
            <h5 className="title fw-bold">Daftar Tipe Produk</h5>
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-type") {
              return (
                <div className="col button-add text-end me-3">
                  <Link to="/tipe/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>
                </div>
              )
            }
          })}
        </div>
        <TipeProdukTable />
      </div>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h5 className="title fw-bold">Daftar Tipe Produk</h5>
      </div>
      <TipeProdukTable />
    </div>
  }
}

export default TipeProduk