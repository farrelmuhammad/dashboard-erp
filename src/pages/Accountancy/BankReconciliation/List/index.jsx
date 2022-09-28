import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Url from '../../../../Config'
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Col, Collapse, Input, Modal, Popconfirm, Popover, Row, Space, Table } from 'antd'
import { DeleteOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { formatRupiah } from '../../../../utils/helper'
const { Panel } = Collapse;


const ListBankReconciliation = () => {
  // const token = jsCookie.get('auth')
  const auth = useSelector(state => state.auth);
  const [userAccess, setUserAccess] = useState([]);

  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: 'Edward King 0',
      age: '32',
      address: 'London, Park Lane no. 0',
    },
    {
      key: '1',
      name: 'Edward King 1',
      age: '32',
      address: 'London, Park Lane no. 1',
    },
    {
      key: '2',
      name: 'Edward King 2',
      age: '32',
      address: 'London, Park Lane no. 2',
    },
  ]);
  const [count, setCount] = useState(3);

  const [dataSource2, setDataSource2] = useState([
    {
      key: '0',
      name: 'Edward King 0',
      age: '32',
      address: 'London, Park Lane no. 0',
    },
    {
      key: '1',
      name: 'Edward King 1',
      age: '32',
      address: 'London, Park Lane no. 1',
    },
  ]);
  const [count2, setCount2] = useState(2);

  const [modal2Visible, setModal2Visible] = useState(false);

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

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (key) => {
    const newData = dataSource2.filter((item) => item.key !== key);
    setDataSource2(newData);
  };

  const columns1 = [
    {
      title: 'Rekening Koran',
      dataIndex: ['date', 'status'],
      key: 'rekening',
      render: (text, row) => <a>{row['date'] + "\n" + row["status"]}</a>,
    },
    {
      title: 'Terima',
      dataIndex: 'received',
      key: 'received',
      render: (text) => <div>{formatRupiah(text)}</div>,
    },
    {
      title: 'Bayar',
      dataIndex: 'pays',
      key: 'pays',
      render: (text) => <div>{formatRupiah(text)}</div>,
    },
    {
      title: '#',
      key: 'action',
      align: 'center',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <Checkbox
            value={record}
          // onChange={handleCheck}
          />
        </Space>
      ),
    },
  ];

  const data1 = [
    {
      date: '01-01-2015',
      received: '200000',
      pays: '0',
      status: 'Pembayaran'
    },
    {
      date: '02-01-2015',
      received: '0',
      pays: '200000',
      status: 'Pembayaran'
    },
    {
      date: '03-01-2015',
      received: '0',
      pays: '200000',
      status: 'Pembayaran'
    },
    {
      date: '04-01-2015',
      received: '200000',
      pays: '0',
      status: 'Pembayaran'
    },
    {
      date: '05-01-2015',
      received: '200000',
      pays: '0',
      status: 'Pembayaran'
    },
  ];

  const columns2 = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },

    {
      title: '#',
      key: 'action',
      align: 'center',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            placement="bottomRight"
            title="Delete Row?"
            onConfirm={handleDelete}
          >
            <Checkbox
              value={record}
            // onClick={handleDelete}
            />
          </Popconfirm>
          <Popover
            placement="bottomRight"
            content={content}
            trigger="click"
          >
            <MoreOutlined />
          </Popover>
        </Space>
      ),
    },
  ];

  const content = (
    <div>
      <a
        onClick={() => setModal2Visible(true)}
      >
        Tambah Akun
      </a>
    </div>
  );

  const columns3 = [
    {
      title: 'Nama Akun',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Debit',
      dataIndex: 'age',
      width: '20%',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
    },

    {
      title: '#',
      key: 'action',
      align: 'center',
      width: '5%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            size='small'
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          />
          {/* <Button
            size='small'
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          /> */}
        </Space>
      ),
    },
  ];

  // const data2 = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     age: 32,
  //     address: 'New York No. 1 Lake Park',
  //     tags: ['nice', 'developer'],
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     age: 42,
  //     address: 'London No. 1 Lake Park',
  //     tags: ['loser'],
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     age: 32,
  //     address: 'Sidney No. 1 Lake Park',
  //     tags: ['cool', 'teacher'],
  //   },
  // ];

  const headerPanel = () => (
    <h6
      style={{
        // fontWeight: 'bold',
        // fontSize: '20px',
      }}>
      Daftar Rekonsiliasi Bank
    </h6>
  );

  return (
    <>
      <form className="p-3 mb-3 bg-body rounded">
        <div className="text-title text-start mb-2">
          <h4 className="title fw-bold">Rekonsiliasi Bank</h4>
        </div>

        <Collapse defaultActiveKey={['1']} expandIconPosition="right" ghost>
          <Panel
            header={headerPanel()}
            key="1"
          >
            <div className="row">
              <div className="col">
                <div className="row mb-3">
                  <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Periode</label>
                  <div className="col-sm-7">
                    <input
                      // value="Otomatis"
                      type="Nama"
                      className="form-control"
                      id="inputNama3"
                      placeholder='Bulan dan Tahun'
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                  <div className="col-sm-7">
                    <AsyncSelect
                      placeholder="Pilih Kas/Bank..."
                      cacheOptions
                      defaultOptions
                      // value={selectedValue}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.id}
                    // loadOptions={loadOptionsCategoryAcc}
                    // onChange={handleChangeCategoryAcc}
                    />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="row mb-3">
                  <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Import Bank</label>
                  <div className="col-sm-7">
                    <input
                      // value="Otomatis"
                      type="number"
                      className="form-control"
                      id="inputNama3"
                      placeholder='Pilih File'
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                  <div className="col-sm-7">
                    <AsyncSelect
                      placeholder="Pilih Transaksi..."
                      cacheOptions
                      defaultOptions
                      // value={selectedValue2}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.id}
                    // loadOptions={loadOptionsMasterAcc}
                    // onChange={handleChangeMasterAcc}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3" role="group" aria-label="Basic mixed styles example">
              <button
                type="button"
                className="btn btn-success rounded m-1"
              // onClick={handleSubmit}
              >
                Cari
              </button>
            </div>
          </Panel>
          {/* <Panel header="This is panel header 2" key="2">
            <p>{text}</p>
          </Panel>
          <Panel header="This is panel header 3" key="3">
            <p>{text}</p>
          </Panel> */}
        </Collapse>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end" role="group" aria-label="Basic mixed styles example">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          />
        </div>

        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Table
              columns={columns1}
              dataSource={data1}
              scroll={{
                y: 400,
              }}
              pagination={false}
            />
          </Col>
          <Col span={12}>
            <Table
              columns={columns2}
              dataSource={dataSource}
              scroll={{
                y: 400,
              }}
              pagination={false}
            />
            <Modal
              title="Tambah Akun"
              centered
              visible={modal2Visible}
              width={800}
              onCancel={() => setModal2Visible(false)}
              footer={[
                <Button
                  key="submit"
                  type="primary"

                >
                  Tambah
                </Button>,
              ]}
            // footer={null}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{
                  display: 'flex',
                }}
              >
                <Row>
                  <Col span={10} push={4}>
                    <Input></Input>
                  </Col>
                  <Col span={4} pull={10}>
                    Tanggal
                  </Col>
                </Row>

                <Row>
                  <Col span={10} push={4}>
                    <Input></Input>
                  </Col>
                  <Col span={4} pull={10}>
                    Deskripsi
                  </Col>
                </Row>

                <Table
                  columns={columns3}
                  dataSource={dataSource2}
                  scroll={{
                    y: 240,
                  }}
                  pagination={false}
                />

                <Row justify="end">
                  <Col span={10} push={4}>
                    <Input></Input>
                  </Col>
                  <Col span={4} pull={10}>
                    Total
                  </Col>
                </Row>
              </Space>
            </Modal>
          </Col>
        </Row>
      </form>
    </>
  )
}

export default ListBankReconciliation;