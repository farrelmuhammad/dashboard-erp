import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Url from '../../../Config'
import axios from 'axios'

import ProdukTable from '../../../components/moleculles/ProdukTable'

import { Button, Descriptions, PageHeader, Skeleton } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const Produk = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

  useEffect(() => {
    axios.get(`${Url}/get_user_access_rights?ability_name=create-product`, {
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
          if (d.ability_name === "create-product") {
            return (
              <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Daftar Produk"
                extra={[
                  <Link to="/produk/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <ProdukTable />
              </PageHeader>
            )
          }
        })}
      </>
      // <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h5 className="title fw-bold">Daftar Produk</h5>
      //     </div>
      //     {userAccess?.map(d => {
      //       if (d.ability_name === "create-product") {
      //         return (
      //           <div className="col button-add text-end me-3">
      //             <Link to="/produk/buat">
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
      //   <ProdukTable />
      // </div>
    )
  } else {
    return (
      <>
        <PageHeader
          ghost={false}
          className="bg-body rounded mb-2"
          title="Daftar Produk"
        // extra={[
        //   <Link to="/produk/buat">
        //     <Button
        //       type="primary"
        //       icon={<PlusOutlined />}
        //     />
        //   </Link>,
        // ]}
        >
          <ProdukTable />
        </PageHeader>
      </>
    )
    // <div>
    //   <div className="text-title text-start">
    //     <h5 className="title fw-bold">Daftar Produk</h5>
    //   </div>
    //   <ProdukTable />
    // </div>
  }
}

export default Produk