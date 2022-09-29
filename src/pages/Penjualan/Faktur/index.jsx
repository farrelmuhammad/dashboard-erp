import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from "../../../Config";
import axios from 'axios'
import FakturTable from '../../../components/moleculles/FakturTable'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const SalesOrder = () => {
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
      <>
        <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
          <div className="row">
            <div className="col text-title text-start">
              <h5 className="title fw-bold">Daftar Faktur</h5>
            </div>
            {userAccess?.map(d => {
              if (d.ability_name === "create-sales_order") {
                return (
                  <div className="col button-add text-end me-3">
                    <Link to="/faktur/buat">
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
            if (d.ability_name === "create-piece") {
              return ( */}
                <FakturTable />
              {/* )
            }
          })} */}
        </div>
      </>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h5 className="title fw-bold">Daftar Faktur</h5>
      </div>
      <FakturTable />
    </div>
  }
}

export default SalesOrder;