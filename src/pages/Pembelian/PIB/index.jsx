import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import TallyTable from '../../../components/moleculles/TallyTable'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import TallyPembelianTable from '../../../components/moleculles/TallyPembelianTable'
import PenerimaanBarangTable from '../../../components/moleculles/PenerimaanBarangTable'
import { useSelector } from 'react-redux'
import CreditNoteTable from '../../../components/moleculles/CreditNoteTable'
import PIBTable from '../../../components/moleculles/PIBTable'

const PIB = () => {
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
      <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
        <div className="row">
          <div className="col text-title text-start">
            <h3 className="title fw-bold">Daftar PIB</h3>
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-tax") {
              return (
                <div className="col button-add text-end me-3">
                  <Link to="/pib/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>
                </div>
              )
            }
          })}
        </div>
        <PIBTable />
      </div>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h3 className="title fw-bold">Daftar Pajak</h3>
      </div>
      <PIBTable />
    </div>
  }
}

export default PIB;