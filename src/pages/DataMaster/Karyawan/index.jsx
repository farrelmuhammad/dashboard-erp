import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import KaryawanTable from '../../../components/moleculles/KaryawanTable'
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const Karyawan = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

  useEffect(() => {
    axios.get(`${Url}/get_user_access_rights?ability_name=create-employee`, {
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
        <>
          {userAccess?.map(d => {
            if (d.ability_name === "create-employee") {
              return (
                <PageHeader
                  ghost={false}
                  className="bg-body rounded mb-2"
                  title="Daftar Karyawan"
                  extra={[
                    <Link to="/karyawan/buat">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                      />
                    </Link>,
                  ]}
                >
                  <KaryawanTable />
                </PageHeader>
              )
            }
          })}
        </>
      </>
      // <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h5 className="title fw-bold">Daftar Karyawan</h5>
      //     </div>
      //     {userAccess?.map(d => {
      //       if (d.ability_name === "create-employee") {
      //         return (
      //           <div className="col button-add text-end me-3">
      //             <Link to="/karyawan/buat">
      //               <Button
      //                 type="primary"
      //                 icon={<PlusOutlined />}
      //               />
      //             </Link>
      //           </div>
      //         )
      //       }
      //     })}
      //   </div>
      //   <KaryawanTable />
      // </div>
    )
  } else {
    <>
      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        title="Daftar Karyawan"
      >
        <KaryawanTable />
      </PageHeader>
    </>
  }
}

export default Karyawan