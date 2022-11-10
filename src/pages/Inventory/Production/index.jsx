import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import axios from "axios";
import ProductionTable from "../../../components/moleculles/ProductionTable";
import { Button, PageHeader } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useSelector } from "react-redux";


const Production = () => {
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
                title="Daftar Produksi"
                extra={[
                  <Link to="/produksi/create">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <ProductionTable />
              </PageHeader>
            )
          }
        })}
      </>
      // <div className="container   p-3 mb-5 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h5 className="title fw-bold">Daftar Produksi</h5>
      //     </div>
      //     {userAccess?.map(d => {
      //       if (d.ability_name === "create-adjustment") {
      //         return (
      //           <div className="col button-add text-end me-3">
      //             <Link to="/produksi/create">
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
      //     if (d.ability_name === "create-adjustment") {
      //       return (
      //         <ProductionTable />
      //       )
      //     }
      //   })}
      // </div>
    )
  } else {
    <PageHeader
      ghost={false}
      className="bg-body rounded mb-2"
      title="Daftar Produksi"
    >
      <ProductionTable />
    </PageHeader>
  }
};

export default Production;
