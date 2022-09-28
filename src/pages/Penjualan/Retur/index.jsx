import { PlusOutlined } from '@ant-design/icons'
import jsCookie from 'js-cookie'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReturTable from '../../../components/moleculles/ReturTable'
import axios from 'axios'
import Url from '../../../Config'
import { useSelector } from 'react-redux'

const Retur = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

  useEffect(() => {
    axios.get(`${Url}/get_user_access_rights`, {
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
            <h5 className="title fw-bold">Daftar Retur</h5>
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-sales_return") {
              return (
                <div className="col button-add text-end me-3">
                  <Link to="/retur/buat">
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
        {/* {userAccess?.map(d => {
          if (d.ability_name === "create-sales_return") {
            return ( */}
              <ReturTable />
            {/* )
          }
        })} */}
      </div>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h5 className="title fw-bold">Daftar Retur</h5>
      </div>
      <ReturTable />
    </div>
  }
}

export default Retur