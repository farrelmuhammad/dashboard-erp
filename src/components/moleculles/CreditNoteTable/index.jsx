import * as React from "react";
import { useState } from "react";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Space, Table, Tag } from "antd";
import { CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import CurrencyFormat from 'react-currency-format';

const CreditNoteTable = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = React.useRef(null);
  const [getPenerimaanBarang, setGetPenerimaanBarang] = useState([]);
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  // const token = jsCookie.get('auth')
  const [creditNote, setCreditNote] = useState([])
  const auth = useSelector(state => state.auth);


  const deleteCredit = async (id, code) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Data ini akan dihapus",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${Url}/credit_notes/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
        getCreditNote()
        Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");

      }
    })

  };

  const cancelCredit = async (id, code) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Status data akan diubah ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios({
            method: "patch",
            url: `${Url}/credit_notes/cancel/${id}`,
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          })

          getCreditNote();
          Swal.fire("Berhasil Dibatalkan!", `${code} Dibatalkan`, "success");
        }
        catch (err) {
          console.log(err);
        }
      }
    })

  };


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  useEffect(() => {
    getCreditNote()
  }, [])

  const getCreditNote = async (params = {}) => {
    setIsLoading(true);
    await axios.get(`${Url}/credit_notes`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
      .then(res => {
        const getData = res.data.data;
        setCreditNote(getData)
        // setGetPenerimaanBarang(getData)
        // setCode(getData.code)
        // setStatus(getData.map(d => d.status))
        setIsLoading(false);
        // console.log(getData)
      })
  }

  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      ...getColumnSearchProps('date'),
    },
    {
      title: 'No. Credit Note',
      dataIndex: 'code',
      key: 'code',
      width: '20%',
      ...getColumnSearchProps('code'),
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      width: '20%',
      ...getColumnSearchProps('supplier_name'),

      // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Nominal',
      dataIndex: 'nominal',
      key: 'nominal',
      width: '15%',
      ...getColumnSearchProps('total'),
      render(text, record, index) {
        return {
          children: <CurrencyFormat
            style={{
              width: "100%",
              border: "none",
              backgroundColor: "transparent "
              
            }}
            disabled
            thousandSeparator={'.'}
            decimalSeparator={','}
            value={text}
            prefix={creditNote[index].currency.name + ' '} />
        }
      }
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: '15%',
      render: (_, { status }) => (
        <>
          {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="orange">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="red">{status}</Tag>}

        </>
      ),
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Actions',
      width: '15%',
      align: 'center',
      render: (_, record) => (
        <>
          {record.status === 'Submitted' ? (
            <Space size="middle">
              <Button
                size='small'
                type="danger"
                icon={<CloseOutlined />}
                onClick={() => cancelCredit(record.id, record.code)}
              />
              <Link to={`/creditnote/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
              <Link to={`/creditnote/edit/${record.id}`}>
                <Button
                  size='small'
                  type="success"
                  icon={<EditOutlined />}
                />
              </Link>
            </Space>
          ) : record.status === 'Draft' ? (
            <Space size="middle">
              <Link to={`/creditnote/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
              <Link to={`/creditnote/edit/${record.id}`}>
                <Button
                  size='small'
                  type="success"
                  icon={<EditOutlined />}
                />
              </Link>
              <Button
                size='small'
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => deleteCredit(record.id, record.code)}
              />
            </Space>
          ) : record.status === 'Done' || record.status === 'Done' ? (
            <Space size="middle">
              <Link to={`/creditnote/detail/${record.id}`}>
                <Button
                  size='small'
                  type="primary"
                  icon={<InfoCircleOutlined />}
                />
              </Link>
            </Space>
          ) : (
            <>
            </>
          )}
        </>

        // <>
        //   <Space size="middle">
        //     <Link to={`/penerimaanbarang/detail/${record.id}`}>
        //       <Button
        //         size='small'
        //         type="primary"
        //         icon={<InfoCircleOutlined />}
        //       />
        //     </Link>
        //     <Link to={`/penerimaanbarang/edit/${record.id}`}>
        //       <Button
        //         size='small'
        //         type="success"
        //         icon={<EditOutlined />}
        //       />
        //     </Link>
        //     <Button
        //       size='small'
        //       type="danger"
        //       icon={<DeleteOutlined />}
        //       onClick={() => deleteTallySheet(record.id, record.code)}
        //     />
        //   </Space>
        // </>
      ),
    },
  ];
  return <Table
    loading={isLoading}
    columns={columns}
    pagination={{ pageSize: 5 }}
    dataSource={creditNote}
  />;
};

export default CreditNoteTable;
