import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import GudangTable from '../../../components/moleculles/GudangTable'
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const Gudang = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

  // useEffect(() => {
  //   axios.get(`${Url}/get_user_access_rights?ability_name=create-warehouse`, {
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
  //         if (d.ability_name === "create-warehouse") {
            return (
              <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Daftar Gudang"
                extra={[
                  <Link to="/gudang/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <GudangTable />
              </PageHeader>
            )
  //         }
  //       })}
  //     </>
  //   )
  // } else {
  //   <>
  //     <PageHeader
  //       ghost={false}
  //       className="bg-body rounded mb-2"
  //       title="Daftar Gudang"
  //     >
  //       <GudangTable />
  //     </PageHeader>
  //   </>
  // }
}

export default Gudang