import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { CheckOutlined, DeleteOutlined,CloseOutlined , EditOutlined, InfoCircleOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Input, Menu, Modal, Skeleton, Space, Table, Tag } from 'antd';
import axios from 'axios';
import Url from '../../../Config';
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
    // const [getCustomer, setGetCustomer] = useState('');
    const [getCustomerName, setGetCustomerName] = useState(null);
    const [getAddressName, setGetAddressName] = useState(null);
    // const [getAddress, setGetAddress] = useState('');
    // const [getAddressName, setGetAddressName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState(null);

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // const [modalText, setModalText] = useState('Content of the modal');
    const [customer, setCustomer] = useState("");
    const [customerIdDefault, setCustomerIdDefault] = useState("");
    const [address, setAddress] = useState("");
    const [addressId, setAddressId] = useState("");
    const [addressIdDefault, setAddressIdDefault] = useState("");
    const [tampilPelanggan, setTampilPelanggan] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
        setAddress(value.customer_addresses)
        setSelectedAddress([])
        // console.log(value.customer_addresses)
    };

    const handleChangeAddress = (value) => {
        setSelectedAddress(value);
        setAddressId(value.id);
        // setAddress(value.customer_addresses)
    };

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
                setCustomerIdDefault(getData.customer.id)
                setGetCustomerName(getData.customer.name)
                setGetAddressName(getData.customer_address.address)
                setAddressIdDefault(getData.customer_address_id)
                setIsLoading(true);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    };

    const handleOk = async (id, code) => {
        try {
            const formData = new URLSearchParams();
            if (tampilPelanggan) {
                formData.append("penerima", customerIdDefault);
                formData.append("alamat_penerima", addressIdDefault);
            }
            else {
                formData.append("penerima", customer);
                formData.append("alamat_penerima", addressId);
            }

            axios({
                data: formData,
                method: "patch",
                url: `${Url}/delivery_notes/delivered/${id}`,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            }).then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil DiSubmit!",
                    `${code} Disubmit`,
                    "success"
                );
                getDeliveryNotes()
                // navigate("/suratjalan");
            })
                .catch((err) => {
                    if (err.response) {
                        console.log("err.response ", err.response);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: err.response.data.error.nama,
                        });
                    }
                });
            setVisible(false)
            // setModalText('The modal will be closed after two seconds');
            setIsLoading(false)


        }
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response.data.error.nama,
            });
            console.log(err);
            setVisible(false)
            setIsLoading(false)
            // setModalText('The modal will be closed after two seconds');
            // setConfirmLoading(false);
        }


    };

    const [tampil, setTampil] = useState(false)
    const onChange = (e) => {

    };

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

    const cancelDeliveryNote = async (id, code) => {
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
                url: `${Url}/delivery_notes/cancel/${id}`,
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${auth.token}`,
                },
              })
    
              getDeliveryNotes();
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
            dataIndex: 'customer_name',
            key: 'customer',
            width: '15%',
            ...getColumnSearchProps('customer'),
            render: (_, record) => {
                if (record.customer_name) {
                    return <>{record.customer_name}</>
                }
                else {
                    return <div className='text-center'>-</div>
                }
            },
            // render: (customer) => customer.name
            // sorter: (a, b) => a.customer_id.length - b.customer_id.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            width: '15%',
            key: 'supplier',
            render: (_, record) => {
                if (record.supplier_name) {
                    return <>{record.supplier_name}</>
                }
                else {
                    return <div className='text-center'>-</div>
                }
            },
            ...getColumnSearchProps('supplier_name'),
            // render: (customer) => customer.name
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
                    {
                        record.can['delivered-delivery_note'] ? (
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
                                    )
                                        : (

                                            <div className="text-title text-start">
                                                <div className="row">
                                                    <div className="row">
                                                        {
                                                            tampilPelanggan ?
                                                                <>
                                                                    <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Penerima</label>
                                                                    <div className="col-sm-6">
                                                                        <input
                                                                            value={getCustomerName}
                                                                            type="Nama"
                                                                            className="form-control"
                                                                            id="inputNama3"
                                                                            disabled
                                                                        />

                                                                    </div>
                                                                    <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Alamat Penerima</label>
                                                                    <div className="col-sm-6">
                                                                        <input
                                                                            value={getAddressName}
                                                                            type="Nama"
                                                                            className="form-control"
                                                                            id="inputNama3"
                                                                            disabled
                                                                        />

                                                                    </div>
                                                                </> :
                                                                <>
                                                                    <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Penerima</label>
                                                                    <div className="col-sm-6">
                                                                        <AsyncSelect
                                                                            placeholder="Pilih Penerima..."
                                                                            cacheOptions
                                                                            defaultOptions
                                                                            // defaultInputValue={ getCustomerName }
                                                                            value={selectedCustomer}
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
                                                                            // defaultInputValue={address}
                                                                            isSearchable
                                                                            value={selectedAddress}
                                                                            getOptionLabel={(e) => e.address}
                                                                            getOptionValue={(e) => e.id}
                                                                            options={address}

                                                                            // loadOptions={loadOptionsCustomer}
                                                                            onChange={handleChangeAddress}
                                                                        // onChange={(e) => setAddress(e.id)}
                                                                        />
                                                                    </div>
                                                                </>
                                                        }
                                                        <label htmlFor="inputNama3" className="col-sm-4 ms-5 col-form-label"></label>
                                                        <div className="col-sm-6">
                                                            <Checkbox
                                                                onChange={(e) => { setTampilPelanggan(!tampilPelanggan), setSelectedCustomer(''), setSelectedAddress('') }}
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
                        ) :

                            <Space size="middle">
                                {record.can['read-delivery_note'] ? (
                                    <Link to={`/suratjalan/detail/${record.id}`}>
                                        <Button
                                            size='small'
                                            type="primary"
                                            icon={<InfoCircleOutlined />}
                                        />
                                    </Link>
                                ) : null}
                                {
                                    record.can['cancel-delivery_note'] ? (

                                        <Button
                                            size='small'
                                            type="danger"
                                            icon={<CloseOutlined />}
                                            onClick={() => cancelDeliveryNote(record.id, record.code)}
                                        />

                                    ) : null
                                }
                                {
                                    record.can['delete-delivery_note'] ? (
                                        <Space size="middle">
                                            <Button
                                                size='small'
                                                type="danger"
                                                icon={<DeleteOutlined />}
                                                onClick={() => deleteDeliveryNotes(record.id, record.code)}
                                            />
                                        </Space>
                                    ) : null
                                }
                                {
                                    record.can['update-delivery_note'] ? (
                                        <Link to={`/suratjalan/edit/${record.id}`}>
                                            <Button
                                                size='small'
                                                type="success"
                                                icon={<EditOutlined />}
                                            />
                                        </Link>
                                    ) : null
                                }

                            </Space>
                    }

                    {/* {record.status === 'Submitted' && record.is_delivered === false && record.customer != null ?
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
                                )
                                    : (

                                        <div className="text-title text-start">
                                            <div className="row">
                                                <div className="row">
                                                    {
                                                        tampilPelanggan ?
                                                            <>
                                                                <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Penerima</label>
                                                                <div className="col-sm-6">
                                                                    <input
                                                                        value={getCustomerName}
                                                                        type="Nama"
                                                                        className="form-control"
                                                                        id="inputNama3"
                                                                        disabled
                                                                    />

                                                                </div>
                                                                <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Alamat Penerima</label>
                                                                <div className="col-sm-6">
                                                                    <input
                                                                        value={getAddressName}
                                                                        type="Nama"
                                                                        className="form-control"
                                                                        id="inputNama3"
                                                                        disabled
                                                                    />

                                                                </div>
                                                            </> :
                                                            <>
                                                                <label htmlFor="inputNama3" className="col-sm-4 ms-5 mb-2 col-form-label">Penerima</label>
                                                                <div className="col-sm-6">
                                                                    <AsyncSelect
                                                                        placeholder="Pilih Penerima..."
                                                                        cacheOptions
                                                                        defaultOptions
                                                                        // defaultInputValue={ getCustomerName }
                                                                        value={selectedCustomer}
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
                                                                        // defaultInputValue={address}
                                                                        isSearchable
                                                                        value={selectedAddress}
                                                                        getOptionLabel={(e) => e.address}
                                                                        getOptionValue={(e) => e.id}
                                                                        options={address}

                                                                        // loadOptions={loadOptionsCustomer}
                                                                        onChange={handleChangeAddress}
                                                                    // onChange={(e) => setAddress(e.id)}
                                                                    />
                                                                </div>
                                                            </>
                                                    }
                                                    <label htmlFor="inputNama3" className="col-sm-4 ms-5 col-form-label"></label>
                                                    <div className="col-sm-6">
                                                        <Checkbox
                                                            onChange={(e) => { setTampilPelanggan(!tampilPelanggan), setSelectedCustomer(''), setSelectedAddress('') }}
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
                            : record.status === 'Submitted' && record.is_delivered === false && record.customer == null ?
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
                    } */}
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
        size="small"
        loading={isLoading}
        columns={columns}
        pagination={{ pageSize: 10 }}
        dataSource={getDataSO}
        scroll={{
            y: 240,
        }}
    />;
};

export default SuratJalanTable;