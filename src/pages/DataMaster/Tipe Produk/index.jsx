import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import TipeProdukTable from '../../../components/moleculles/TipeProdukTable'
import { IconButton } from '@mui/material'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button, PageHeader } from 'antd'
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

  // useEffect(() => {
  //   axios.get(`${Url}/get_user_access_rights?ability_name=create-type`, {
  //     headers: {
  //       'Accept': 'application/json',
  //       'Authorization': `Bearer ${auth.token}`
  //     }
  //   })
  //     .then(res => {
  //       setUserAccess(res.data)
  //       console.log(res.data)
  //     })
  // }, [])

  // if (userAccess) {
  //   return (
  //     <>
  //       {userAccess?.map(d => {
  //         if (d.ability_name === "create-type") {
            return (
              <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Daftar Tipe Produk"
                extra={[
                  <Link to="/tipe/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <TipeProdukTable />
              </PageHeader>
            )
  //         }
  //       })}
  //     </>
  //   )
  // } 
  // else {
  //   <>
  //     <PageHeader
  //       ghost={false}
  //       className="bg-body rounded mb-2"
  //       title="Daftar Tipe Produk"
  //     >
  //       <TipeProdukTable />
  //     </PageHeader>
  //   </>
  // }
}

export default TipeProduk