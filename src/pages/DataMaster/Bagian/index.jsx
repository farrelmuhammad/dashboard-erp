import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import BagianTable from '../../../components/moleculles/BagianTable'
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const Bagian = () => {
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
        {userAccess?.map(d => {
          if (d.ability_name === "create-piece") {
            return (
              <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Daftar Bagian"
                extra={[
                  <Link to="/bagian/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>
                ]}
              >
                {userAccess?.map(d => {
                  if (d.ability_name === "read-piece") {
                    return (
                      <BagianTable />
                    )
                  }
                })}
              </PageHeader >
            )
          }
        })}
      </>
    )
  } else {
    <>
      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        title="Daftar Bagian"
      >
        <BagianTable />
      </PageHeader >
    </>
  }
}

export default Bagian