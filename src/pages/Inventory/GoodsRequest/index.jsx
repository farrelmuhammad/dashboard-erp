import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import axios from "axios";
import GoodsRequestTable from "../../../components/moleculles/GoodsRequestTable";
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from "react-redux";


const GoodsRequest = () => {
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
      <div className="container   p-3 mb-5 bg-body rounded d-flex flex-column">
        <div className="row">
          <div className="col text-title text-start">
            <h5 className="title fw-bold">Daftar Permintaan barang</h5>
          </div>
          {userAccess?.map(d => {
            if (d.ability_name === "create-adjustment") {
              return (
                <div className="col button-add text-end me-3">
                  <Link to="/goodsrequest/create">
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
        {userAccess?.map(d => {
          if (d.ability_name === "create-adjustment") {
            return (
              <GoodsRequestTable />
            )
          }
        })}
      </div>
    )
  } else {
    <div>
      <div className="text-title text-start">
        <h3 className="title fw-bold">Daftar Permintaan barang</h3>
      </div>
      <GoodsRequestTable />
    </div>
  }
};

export default GoodsRequest;