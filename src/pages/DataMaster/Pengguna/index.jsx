import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import PenggunaTable from '../../../components/moleculles/PenggunaTable'
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const Pengguna = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

  useEffect(() => {
    axios.get(`${Url}/get_user_access_rights?ability_name=create-user`, {
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
          if (d.ability_name === "create-user") {
            return (
              <PageHeader
                ghost={false}
                title="Daftar Pengguna"
                extra={[
                  <Link to="/pengguna/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <PenggunaTable />
              </PageHeader>
            )
          }
        })}
      </>
    )
  } else {
    return (
      <>
        <PageHeader
          ghost={false}
          title="Daftar Pengguna"
        // extra={[
        //   <Link to="/produk/buat">
        //     <Button
        //       type="primary"
        //       icon={<PlusOutlined />}
        //     />
        //   </Link>,
        // ]}
        >
          <PenggunaTable />
        </PageHeader>
      </>
    )
  }
}

export default Pengguna