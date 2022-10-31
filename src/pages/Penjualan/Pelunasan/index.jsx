import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from "../../../Config";
import axios from 'axios'
import PelunasanTable from '../../../components/moleculles/PelunasanTable'
import { PlusOutlined } from '@ant-design/icons'
import { Button, PageHeader } from 'antd'
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
      <>
        {userAccess?.map(d => {
          if (d.ability_name === "create-tax") {
            return (
              <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Daftar Pelunasan Penjualan"
                extra={[
                  <Link to="/pelunasan/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <PelunasanTable />
              </PageHeader>
            )
          }
        })}
      </>
      // <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h5 className="title fw-bold">Daftar Pelunasan Penjualan</h5>
      //     </div>
      //     {userAccess?.map(d => {
      //       if (d.ability_name === "create-tax") {
      //         return (
      //           <div className="col button-add text-end me-3">
      //             <Link to="/pelunasan/buat">
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
      //   <PelunasanTable />
      // </div>
    )
  } else {
    <>
      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        title="Daftar Pelunasan Penjualan"
      >
        <PelunasanTable />
      </PageHeader>
    </>
  }
}

export default Pelunasan;