import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Url from '../../../../Config'
import HistoryBankReconciliationTable from '../../../../components/moleculles/BankReconciliationTable/HistoryTable'

const HistoryBankReconciliation = () => {
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
        <div className="container p-3 mb-5 bg-body rounded d-flex flex-column">
          <div className="row">
            <div className="col text-title text-start">
              <h4 className="title fw-bold">History Rekonsiliasi</h4>
            </div>
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-piece") {
              return (
                <HistoryBankReconciliationTable />
              )
            }
          })}
        </div>
      </>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h4 className="title fw-bold">Chart of accounts</h4>
      </div>
      {/* <CoaTable /> */}
    </div>
  }
}

export default HistoryBankReconciliation;