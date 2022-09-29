// import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'
import Url from "../../../Config";
import GrupTable from '../../../components/moleculles/GrupTable'
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'

// axios.get('http://localhost:8000/groups')
// 	.then(res => console.log(res.data))
// 	.catch(() => {})

const Grup = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

  useEffect(() => {
    axios.get(`${Url}/get_user_access_rights?ability_name=create-group`, {
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
            <h5 className="title fw-bold">Daftar Grup</h5>
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-group") {
              return (
                <div className="col button-add text-end me-3">
                  <Link to="/grup/buat">
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
        <GrupTable />
      </div>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h5 className="title fw-bold">Daftar Grup</h5>
      </div>
      <GrupTable />
    </div>
  }
}

export default Grup