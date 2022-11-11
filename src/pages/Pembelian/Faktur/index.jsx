import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import jsCookie from 'js-cookie'
import Url from '../../../Config'
import axios from 'axios'
import FakturTable from '../../../components/moleculles/FakturTable'
import { Button, Modal, PageHeader, Tooltip, DatePicker, Select, message } from 'antd'
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import FakturPembelianTable from '../../../components/moleculles/FakturPembelianTable'
import { useSelector } from 'react-redux'
const { RangePicker } = DatePicker;

const FakturPembelian = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [groupType, setGroup] = useState('')

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // downloadLaporan()
    message
      .loading('Download sedang diproses', 2.5)
      .then(async () => {
        await axios.get(`${Url}/purchase_invoices/download_excel?startDate=${startDate}&endDate=${endDate}&group=${groupType}`)
          .then((res) => {
            const getData = res.data;
            if (getData.status === true) {
              message.success('Download berhasil!', 2.5)
              var file_path = getData.file;
              var a = document.createElement('A');
              a.href = file_path;
              a.download = getData.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setIsModalOpen(false);
            }
          })
          .catch((err) => {
            console.log(err);
            message.error('Download error', 1.5)
            message.error('Mohon Ditunggu response server', 2)
          })
      })
    // setStartDate('')
    // setEndDate('')
    // setGroup('')
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // const downloadLaporan = () => {
  //   message
  //     .loading('Action in progress..', 2.5)
  //     .then(async () => {
  //       await axios.get(`${Url}/purchase_invoices/download_excel`)
  //         .then((res) => {
  //           const getData = res.data;
  //           console.log(getData.file);
  //           if (getData.status === true) {
  //             message.success('Loading finished', 2.5)
  //             var file_path = getData.file;
  //             var a = document.createElement('A');
  //             a.href = file_path;
  //             a.download = getData.name;
  //             document.body.appendChild(a);
  //             a.click();
  //             document.body.removeChild(a);
  //             setIsModalOpen(false);
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         })
  //     })
  // }

  const handleChange = (value) => {
    // console.log(value);
    setGroup(value)
  }

  function convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  const onChange = (value) => {
    const date = value.map((data) =>
      data._d
    )

    setStartDate(convert(date[0]))
    setEndDate(convert(date[1]))
  }

  if (userAccess) {
    return (
      <>
        {userAccess?.map(d => {
          if (d.ability_name === "create-tax") {
            return (
              <PageHeader
                ghost={false}
                title="Daftar Faktur Pembelian"
                className="bg-body rounded mb-2"
                extra={[
                  <Tooltip title="Laporan" placement="bottom">
                    <Button
                      // type="danger"
                      style={{
                        background: "#fa541c",
                        borderColor: "#fa541c",
                        color: "white"
                      }}
                      icon={<DownloadOutlined />}
                      onClick={showModal}
                    />
                    <Modal
                      title="Laporan"
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      footer={[
                        <Button key="back" onClick={handleCancel}>
                          Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>
                          Download
                        </Button>,
                      ]}
                    >
                      <div className="text-title text-start">
                        <div className="row">
                          <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Range Tanggal</label>
                          <div className="col-sm-6">
                            <RangePicker
                              onChange={onChange}
                            />
                            {/* <input
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                              /> */}
                          </div>
                          <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Grup</label>
                          <div className="col-sm-6">
                            <Select
                              placeholder="Pilih Grup..."
                              style={{
                                width: 224,
                              }}
                              onChange={handleChange}
                              options={[
                                {
                                  value: 'Lokal',
                                  label: 'Lokal',
                                },
                                {
                                  value: 'Impor',
                                  label: 'Impor',
                                },
                              ]}
                            />
                            {/* <input
                              type="Nama"
                              className="form-control"
                              id="inputNama3"
                            /> */}
                          </div>
                        </div>
                      </div>
                    </Modal>
                  </Tooltip>,
                  <Tooltip title="Tambah" placement="bottom">
                    <Link to="/fakturpembelian/buat">
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                      />
                    </Link>
                  </Tooltip>
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
    <PageHeader
      ghost={false}
      title="Daftar Faktur Pembelian"
      className="bg-body rounded mb-2"
    >
      <FakturPembelianTable />
    </PageHeader>
  }
}

export default FakturPembelian;