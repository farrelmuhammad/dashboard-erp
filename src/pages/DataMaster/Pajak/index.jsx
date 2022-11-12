import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import PajakTable from '../../../components/moleculles/PajakTable'
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const Pajak = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

  // useEffect(() => {
  //   axios.get(`${Url}/get_user_access_rights?ability_name=create-tax`, {
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
  //       <>
  //         {userAccess?.map(d => {
  //           if (d.ability_name === "create-tax") {
              return (
                <PageHeader
                  ghost={false}
                  className="bg-body rounded mb-2"
                  title="Daftar Pajak"
                  extra={[
                    <Link to="/pajak/buat">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                      />
                    </Link>,
                  ]}
                >
                  <PajakTable />
                </PageHeader>
              )
  //           }
  //         })}
  //       </>
  //     </>
  //   )
  // } else {
  //   <>
  //     <PageHeader
  //       ghost={false}
  //       className="bg-body rounded mb-2"
  //       title="Daftar Pajak"
  //     // extra={[
  //     //   <Link to="/produk/buat">
  //     //     <Button
  //     //       type="primary"
  //     //       icon={<PlusOutlined />}
  //     //     />
  //     //   </Link>,
  //     // ]}
  //     >
  //       <PajakTable />
  //     </PageHeader>
  //   </>
  // }
}

export default Pajak