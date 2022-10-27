import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import FakturTable from '../../../components/moleculles/FakturTable'
import { Button , PageHeader} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import FakturPembelianTable from '../../../components/moleculles/FakturPembelianTable'
import { useSelector } from 'react-redux'

const FakturPembelian = () => {
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
       if (d.ability_name === "create-tax") {
         return (
           <PageHeader
             ghost={false}
             title="Daftar Faktur Pembelian"
             extra={[
               <Link to="/fakturpembelian/buat">
                 <Button
                   type="primary"
                   icon={<PlusOutlined />}
                 />
               </Link>,
             ]}
           >
             <FakturPembelianTable />
           </PageHeader>
         )
       }
     })}
</>

      // <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h3 className="title fw-bold">Daftar Faktur </h3>
      //     </div>
      //     {userAccess?.map(d => {
      //       if (d.ability_name === "create-sales_order") {
      //         return (
      //           <div className="col button-add text-end me-3">
      //             <Link to="/fakturpembelian/buat">
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
      //   {userAccess?.map(d => {
      //     if (d.ability_name === "create-piece") {
      //       return (
      //         <FakturPembelianTable />
      //       )
      //     }
      //   })}
      // </div>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h3 className="title fw-bold">Daftar Faktur</h3>
      </div>
      <FakturPembelianTable />
    </div>
  }
}

export default FakturPembelian;