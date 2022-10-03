import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Url from "../../../Config";
import axios from "axios";
import PosisiTable from "../../../components/moleculles/PosisiTable";
import { Button, PageHeader } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const Posisi = () => {
  // const auth = useSelector(state => state.auth);
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([]);

  useEffect(() => {
    axios
      .get(`${Url}/get_user_access_rights?ability_name=create-position`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setUserAccess(res.data);
        console.log(res.data);
      });
  }, []);

  if (userAccess) {
    return (
      <>
        {userAccess?.map((d) => {
          if (d.ability_name === "create-position") {
            return (
              <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Daftar Posisi"
                extra={[
                  <Link to="/posisi/buat">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                    />
                  </Link>,
                ]}
              >
                <PosisiTable />
              </PageHeader>
            );
          }
        })}
      </>
      // <div className="container p-3 mb-3 bg-body rounded d-flex flex-column">
      //   <div className="row">
      //     <div className="col text-title text-start">
      //       <h5 className="title fw-bold mb-2">Daftar Posisi</h5>
      //     </div>
      //     {userAccess?.map((d) => {
      //       if (d.ability_name === "create-position") {
      //         return (
      //           <div className="col button-add text-end mb-2 me-3">
      //             <Link to="/posisi/buat">
      //               <Button
      //                 type="primary"
      //                 icon={<PlusOutlined />}
      //               />
      //             </Link>
      //           </div>
      //         );
      //       }
      //     })}
      //   </div>
      //   <PosisiTable />
      // </div>
    );
  } else {
    return (
      <PageHeader
        ghost={false}
        bordered
        onBack={() => window.history.back()}
        title="Daftar Posisi"
        // extra={[
        //   <Link to="/posisi/buat">
        //     <Button
        //       type="primary"
        //       icon={<PlusOutlined />}
        //     />
        //   </Link>,
        // ]}
      >
        <PosisiTable />
      </PageHeader>
    );
  }
};

export default Posisi;
