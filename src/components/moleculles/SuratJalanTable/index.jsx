import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CheckOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Input, Menu, Modal, Skeleton, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from "../../../Config";;
import jsCookie from 'js-cookie'
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import AsyncSelect from "react-select/async";
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';

const SuratJalanTable = () => {
    const auth = useSelector(state => state.auth);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getDataSO, setGetDataSO] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState('');
    const [cuy, setCuy] = useState("");

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');
    const [getCustomerName, setGetCustomerName] = useState(null);
    const [selectedValue, setSelectedCustomer] = useState(null);
    const [customer, setCustomer] = useState("");
    const [address, setAddress] = useState("");

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
        setAddress(value.customer_addresses)
    };

    // console.log(checked)

    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_customers?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const showModal = async (id) => {
        // setIsLoading(true);
        setVisible(true);
        await axios.get(`${Url}/delivery_notes?id=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data[0]
                setCustomer(getData.customer.id)
                setGetCustomerName(getData.customer.name)
                setAddress(getData.customer_address_id)
                // console.log(getData)
                setIsLoading(true);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    };

    const handleOk = async (id, code, record) => {
        // setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        try {
            const userData = new URLSearchParams();
            userData.append("penerima", customer);
            userData.append("alamat_penerima", address);

            for (var pair of userData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            // await axios({
            //     method: "patch",
            //     url: `${Url}/delivery_notes/delivered/${id}`,
            //     data: userData,
            //     headers: {
            //         Accept: "application/json",
            //         Authorization: `Bearer ${auth.token}`,
            //     },
            // })
            // getDeliveryNotes();
            // Swal.fire("Sudah Diterima!", `${code} Diterima`, "success");
        }
        catch (err) {
            console.log(err);
        }
    };

    // const onChange = (e) => {
    //     // console.log(e.target.checked,checked);
    //     if (e.target.checked) {
    //         let aa = e.target.checked;
    //         setCuy(!true);
    //         console.log(cuy, "aa");
    //     } else {
    //         let aa = e.target.checked;
    //         setCuy(true);
    //         console.log(cuy, "bb");
    //     }
    // };

    const onChange = (e) => {
        // console.log('checked = ', e.target.checked);
        setChecked(e.target.checked);
    };

    // console.log('checked = ', checked);

    const deleteDeliveryNotes = async (id) => {
        await axios.delete(`${Url}/delivery_notes/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        });
        getDeliveryNotes()
        Swal.fire("Berhasil Dihapus!", `${id} Berhasil hapus`, "success");
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
        getDeliveryNotes()
        // getDeliveryNotesById()
    }, [])

    const getDeliveryNotes = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/delivery_notes`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setGetDataSO(getData)
                setStatus(getData.map(d => d.status))
                // setGetCustomer(getData.map(d => d.customer_id))
                // setGetAddress(getData.map(d => d.customer_address_id))
                setIsLoading(false);
                console.log(getData)
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
            title: 'No. Transaksi',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            ...getColumnSearchProps('code'),
            sorter: true,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Pelanggan',
            dataIndex: 'customer',
            key: 'customer',
            width: '15%',
            ...getColumnSearchProps('customer'),
            render: (customer) => customer.name
            // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Kendaraan',
            dataIndex: 'vehicle',
            key: 'vehicle',
            width: '15%',
            ...getColumnSearchProps('vehicle'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            width: '15%',
            render: (_, { status }) => (
                <>
                    {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="volcano">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : status === 'Processed' ? <Tag color="orange">{status}</Tag> : <Tag color="red">{status}</Tag>}
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
                    {record.status === 'Submitted' && record.is_delivered === false ?
                        <Space size="middle">
                            <Button
                                size='small'
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => showModal(record.id)}
                            />
                            <Modal
                                title="Konfirmasi Penerima"
                                visible={visible}
                                onCancel={() => { setVisible(false); setIsLoading(false) }}
                                footer={[
                                    <Button
                                        key="submit"
                                        type="primary"
                                        onClick={() => handleOk(record.id, record.code)}
                                    >
                                        Submit
                                    </Button>,
                                ]}
                            >
                                {isLoading === false ? (
                                    <div className="text-title text-start">
                                        <div className="row">
                                            <div className="row">
                                                <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-3 col-form-label">
                                                    <Skeleton.Input active="active" size="small" />
                                                </label>
                                                <div className="col-sm-6">
                                                    <Skeleton.Input active="active" size="default" />
                                                </div>
                                                <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-3 col-form-label">
                                                    <Skeleton.Input active="active" size="small" />
                                                </label>
                                                <div className="col-sm-6">
                                                    <Skeleton.Input active="active" size="default   " />
                                                </div>
                                                <label htmlFor="inputNama3" className="col-sm-4 ms-5 col-form-label"></label>
                                                <div className="col-sm-6">
                                                    <Skeleton.Input active="active" size="small" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    // <Space>
                                    //     <Skeleton.Button active="active" size="default" shape="default" block={false} />
                                    //     <Skeleton.Avatar active="active" size="default" shape="circle" />
                                    //     <Skeleton.Input active="active" size="default" />
                                    // </Space>
                                )
                                    : (
                                        <div className="text-title text-start">
                                            <div className="row">
                                                <div className="row">
                                                    <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Penerima</label>
                                                    <div className="col-sm-6">
                                                        <AsyncSelect
                                                            placeholder="Pilih Pelanggan..."
                                                            cacheOptions
                                                            defaultInputValue={getCustomerName}
                                                            defaultOptions
                                                            value={selectedValue}
                                                            getOptionLabel={(e) => e.name}
                                                            getOptionValue={(e) => e.id}
                                                            loadOptions={loadOptionsCustomer}
                                                            onChange={handleChangeCustomer}
                                                        />
                                                    </div>
                                                    <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Alamat Penerima</label>
                                                    <div className="col-sm-6">
                                                        <ReactSelect
                                                            className="basic-single"
                                                            placeholder="Pilih Alamat..."
                                                            classNamePrefix="select"
                                                            defaultInputValue={address}
                                                            isSearchable
                                                            getOptionLabel={(e) => e.address}
                                                            getOptionValue={(e) => e.id}
                                                            options={address}
                                                            onChange={(e) => setAddress(e.id)}
                                                        />
                                                    </div>
                                                    <label htmlFor="inputNama3" className="col-sm-4 ms-5 col-form-label"></label>
                                                    <div className="col-sm-6">
                                                        <Checkbox
                                                            onChange={onChange}
                                                        >
                                                            Sama Dengan Pelanggan
                                                        </Checkbox>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </Modal>
                            <Dropdown overlay={
                                <Menu menu="horizontal">
                                    <Menu.Item key="detail">
                                        <Link to={`/suratjalan/detail/${record.id}`}>
                                            <Button
                                                size='small'
                                                type="primary"
                                                icon={<InfoCircleOutlined />}
                                            />
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="edit">
                                        <Link to={`/suratjalan/edit/${record.id}`}>
                                            <Button
                                                size='small'
                                                type="success"
                                                icon={<EditOutlined />}
                                            />
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item key="delete">
                                        <Button
                                            size='small'
                                            type="danger"
                                            icon={<DeleteOutlined />}
                                            onClick={() => deleteDeliveryNotes(record.id)}
                                        />
                                    </Menu.Item>
                                </Menu>
                            }>
                                <a onClick={(e) => e.preventDefault()}>
                                    <MoreOutlined style={{ marginBottom: 6 }} />
                                </a>
                            </Dropdown>
                        </Space >
                        : record.status === 'Submitted' && record.is_delivered === true ?
                            <Space size="middle">
                                <Link to={`/suratjalan/detail/${record.id}`}>
                                    <Button
                                        size='small'
                                        type="primary"
                                        icon={<InfoCircleOutlined />}
                                    />
                                </Link>
                                <Link to={`/suratjalan/edit/${record.id}`}>
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
                                    onClick={() => deleteDeliveryNotes(record.id)}
                                />
                            </Space>
                            : record.status === 'Draft' ?
                                <Space size="middle">
                                    <Link to={`/suratjalan/detail/${record.id}`}>
                                        <Button
                                            size='small'
                                            type="primary"
                                            icon={<InfoCircleOutlined />}
                                        />
                                    </Link>
                                    <Link to={`/suratjalan/edit/${record.id}`}>
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
                                        onClick={() => deleteDeliveryNotes(record.id)}
                                    />
                                </Space>
                                : record.status === 'Processed' ?
                                    <Space size="middle">
                                        <Link to={`/suratjalan/detail/${record.id}`}>
                                            <Button
                                                size='small'
                                                type="primary"
                                                icon={<InfoCircleOutlined />}
                                            />
                                        </Link>
                                    </Space>
                                    : <Space size="middle">
                                        <Link to={`/suratjalan/detail/${record.id}`}>
                                            <Button
                                                size='small'
                                                type="primary"
                                                icon={<InfoCircleOutlined />}
                                            />
                                        </Link>
                                    </Space>
                    }
                </>
            ),
        },
    ];

    // if (isLoading) {
    //     return (
    //         <div></div>
    //     )
    // }

    return <Table
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 5 }}
        dataSource={getDataSO}
        scroll={{
            y: 240,
        }}
    />;
};

export default SuratJalanTable;