import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import TallyTable from '../../../components/moleculles/TallyTable'
import { PlusOutlined } from '@ant-design/icons'
import { Button, PageHeader } from 'antd'
import TallyPembelianTable from '../../../components/moleculles/TallyPembelianTable'
import { useSelector } from 'react-redux'

const TallySheetPembelian = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])

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
                title="Daftar Tally Sheet In"
                extra={[
                  <Link to="/tallypembelian/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <TallyPembelianTable />
              </PageHeader>
            )
          }
        })}
   </>
          // {userAccess?.map(d => {
          //   if (d.ability_name === "create-tax") {
          //     return (
          //       <div className="col button-add text-end me-3">
          //         <Link to="/tallypembelian/buat">
          //           <Button
          //             type="primary"
          //             icon={<PlusOutlined />}
          //           />
          //         </Link>
          //       </div>
          //     )

              
          //   }
        //   })}
          
       
        // <TallyPembelianTable />
    
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h3 className="title fw-bold">Daftar Pajak</h3>
      </div>
      <TallyPembelianTable />
    </div>
  }
}

export default TallySheetPembelian;