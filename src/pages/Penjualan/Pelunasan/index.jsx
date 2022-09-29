import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from "../../../Config";
import axios from 'axios'
import PelunasanTable from '../../../components/moleculles/PelunasanTable'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useSelector } from 'react-redux'

const Pelunasan = () => {
  // const token = jsCookie.get('auth')
  const [userAccess, setUserAccess] = useState([])
  const auth = useSelector(state => state.auth);


  useEffect(() => {
    axios.get(`${Url}/get_user_access_rights?ability_name=create-tax`, {
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
      <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
        <div className="row">
          <div className="col text-title text-start">
            <h5 className="title fw-bold">Pelunasan</h5>
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-tax") {
              return (
                <div className="col button-add text-end me-3">
                  <Link to="/pelunasan/buat">
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
        <PelunasanTable />
      </div>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h5 className="title fw-bold">Daftar Pajak</h5>
      </div>
      <PelunasanTable />
    </div>
  }
}

export default Pelunasan;