import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import axios from "axios";
import AdjustmentTable from "../../../components/moleculles/AdjustmentTable";
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from "react-redux";


const Adjustment = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([]);

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
          if (d.ability_name === "create-adjustment") {
            return (
              <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Daftar Penyesuaian Stok"
                extra={[
                  <Link to="/adjustment/create">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <AdjustmentTable />
              </PageHeader>
            )
          }
        })}
      </>
    )
  } else {
    <>
      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        title="Daftar Penyesuaian Stok"
      >
        <AdjustmentTable />
      </PageHeader>
    </>
  }
};

export default Adjustment;
