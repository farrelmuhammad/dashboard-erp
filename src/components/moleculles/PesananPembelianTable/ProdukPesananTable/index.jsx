import { Table } from 'antd'
import React from 'react'

const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
    width: '5%',
    align: 'center',
  },
  {
    title: 'Nama Produk',
    dataIndex: 'name',
  },
  {
    title: 'Qty',
    dataIndex: '',
    width: '10%',
    align: 'center',
    render: (Qty) => (
      <>
        <div class="col-xs-2">
          <input class="form-control text-center" min={0} type="number"/>
        </div>
      </>
    ),
  },
  {
    title: 'Stn',
    dataIndex: '',
    width: '5%',
    align: 'center',
  },
  {
    title: 'Harga',
    dataIndex: '',
    width: '8%',
    align: 'center',
  },
  {
    title: 'Disc(%)',
    dataIndex: '',
    width: '8%',
    align: 'center',
  },
  {
    title: 'Disc(Rp)',
    dataIndex: '',
    width: '8%',
    align: 'center',
  },
  {
    title: 'PPN',
    dataIndex: '',
    width: '8%',
    align: 'center',
  },
  {
    title: 'Jumlah',
    dataIndex: '',
    width: '14%',
    align: 'center',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '5',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '6',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];

const ProdukPesananTable = () => {
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{
          y: 200,
        }}
        size="middle"
      />
    </>
  )
}

export default ProdukPesananTable