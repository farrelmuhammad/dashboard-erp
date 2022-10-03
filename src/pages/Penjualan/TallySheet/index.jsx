import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from "../../../Config";
import axios from 'axios'
import TallyTable from '../../../components/moleculles/TallyTable'
import { PlusOutlined } from '@ant-design/icons'
import { Button, PageHeader } from 'antd'
import { useSelector } from 'react-redux'

const TallySheet = () => {
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
                onBack={() => window.history.back()}
                title="Daftar Tally Sheet"
                extra={[
                  <Link to="/tally/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <TallyTable />
              </PageHeader>
            )
          }
        })}
      </>
      // <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h3 className="title fw-bold">Tally Sheet</h3>
      //     </div>
      //     {userAccess?.map(d => {
      //       if (d.ability_name === "create-tax") {
      //         return (
      //           <div className="col button-add text-end me-3">
      //             <Link to="/tally/buat">
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
      //   <TallyTable />
      // </div>
    )
  } else {
    <>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title="Daftar Tally Sheet"
      >
        <TallyTable />
      </PageHeader>
    </>
  }
}

export default TallySheet;