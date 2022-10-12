import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from "../../../Config";
import axios from 'axios'
import SuratJalanTable from '../../../components/moleculles/SuratJalanTable'
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const SuratJalan = () => {
  // const token = jsCookie.get('auth')
  const [userAccess, setUserAccess] = useState([])
  const auth = useSelector(state => state.auth);

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
          if (d.ability_name === "create-delivery_note") {
            return (
              <PageHeader
                ghost={false}
                title="Daftar Surat Jalan"
                extra={[
                  <Link to="/suratjalan/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <SuratJalanTable />
              </PageHeader>
            )
          }
        })}
      </>
      // <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h4 className="title fw-bold">Daftar Surat Jalan</h4>
      //     </div>
      //     {userAccess?.map(d => {
      //       if (d.ability_name === "create-sales_order") {
      //         return (
      //           <div className="col button-add text-end me-3">
      //             <Link to="/suratjalan/buat">
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
      //   {/* {userAccess?.map(d => {
      //     if (d.ability_name === "create-piece") {
      //       return ( */}
      //         <SuratJalanTable />
      //       {/* )
      //     }
      //   })} */}
      // </div>
    )
  } else {
    <>
      <PageHeader
        ghost={false}
        title="Daftar Surat Jalan"
      >
        <SuratJalanTable />
      </PageHeader>
    </>
  }
}

export default SuratJalan;