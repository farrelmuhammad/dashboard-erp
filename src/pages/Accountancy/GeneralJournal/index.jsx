import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from "../../../Config";
import axios from 'axios'
import FakturTable from '../../../components/moleculles/FakturTable'
import { Button, Col, Popover, Row } from 'antd'
import { PlusOutlined, SendOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import CoaTable from '../../../components/moleculles/ChartOfAccounts'
import GeneralJournalTable from '../../../components/moleculles/GeneralJournalTable'

const GeneralJournal = () => {
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
              <h4 className="title fw-bold">Jurnal Umum</h4>
            </div>
            {userAccess?.map(d => {
              if (d.ability_name === "create-sales_order") {
                return (
                  <div className="col button-add text-end me-3">
                    <Link to="/jurnal/buat">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{
                          marginRight: 10,
                        }}
                      />
                    </Link>
                    <Popover placement="bottom" content='Publish'>
                      <Button
                        type="danger"
                        style={{ background: "green", borderColor: "green" }}
                        icon={<SendOutlined />}
                      />
                    </Popover>
                  </div>
                )
              }
            })}
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-piece") {
              return (
                <GeneralJournalTable />
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
      <GeneralJournalTable />
    </div>
  }
}

export default GeneralJournal;