import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
// import ModalProdukTable from '../../../components/moleculles/PesananTable/ModalProdukTable';
// import { DatePicker, Input } from 'antd';

const EditableContext = createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={1} max={1000} defaultValue={1} />
                {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                // style={{
                //     paddingRight: 24,
                // }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const BuatPesanan = () => {
    const token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [product, setProduct] = useState([]);
    const [productTotal, setProductTotal] = useState([]);
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
    };
    // load options using API call
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/select_customers??limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json());
    };

    // console.log(date)

    useEffect(() => {
        getNewCodeSales()
    })

    useEffect(() => {
        getProduct()
    }, [])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'alias_name',
        },
        {
            title: 'Stok',
            dataIndex: 'stock',
            width: '15%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '15%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Checkbox value={record} onChange={handleCheck} />
                </>
            )
        },
    ];

    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: 'no',
            width: '5%',
            align: 'center',
            key: 'no',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama Produk',
            dataIndex: 'alias_name',
            key: 'alias_name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            key: 'quantity',
            editable: true,
            // render: (index) => (
            //     <>
            //         <InputNumber min={1} max={1000} defaultValue={1} />
            //     </>
            // ),
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Harga',
            dataIndex: 'price',
            width: '10%',
            align: 'center',
            editable: true,
            // render: (index) => (
            //     <>
            //         <InputNumber min={1} max={1000} defaultValue={1} />
            //     </>
            // ),
        },
        {
            title: 'Disc',
            dataIndex: 'discount',
            width: '20%',
            align: 'center',
            editable: true,
            // render: (Disc) => (
            //     <>
            //         <InputNumber addonBefore={selectAfter} defaultValue={1} />
            //     </>
            // ),
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '10%',
            align: 'center',
            editable: true,
            // render: (index) => (
            //     <>
            //         <InputNumber name={`ppn-${index}`} min={1} max={1000} defaultValue={1} />
            //     </>
            // ),
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
            render:
                () => {
                    let ageSum = 0
                    for (let i = 0; i <= productTotal.length; i++) {
                        ageSum += productTotal
                    }
                    return productTotal
                }
        },
    ];

    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        const newTotal = [newData[index].quantity * newData[index].price];
        const newSum = [...newTotal]
        newSum.slice(index, 1, { ...item, ...row });
        setProductTotal(newTotal);

        // console.log(newData[index])
        console.log([...newSum, newTotal])
    };

    const handleTotal = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProductTotal(newData[index].quantity * newData[index].price);

        console.log(newData[index].quantity * newData[index].price)
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const getProduct = async () => {
        setIsLoading(true);
        await axios.get(`${Url}/select_products`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const getData = res.data
                setGetDataProduct(getData)
                // setStatus(getData.map(d => d.status))
                setIsLoading(false);
                console.log(res.data)
            })
    }

    const handleCheck = (event) => {
        var updatedList = [...product];
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
    };


    const getNewCodeSales = async () => {
        await axios.get(`${Url}/get_new_sales_order_code?tanggal=${date}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setGetCode(res.data.data);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    // const getDate = async (e) => {
    //     setDate(e.target)
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        // userData.append("id", id);
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");

        // product.map((p) => userData.append("produk[]", p));
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.percentage);
            userData.append("diskon_tetap[]", p.discount);
            userData.append("ppn[]", p.ppn);
        });

        // product.map((p) => {
        //     console.log(p);
        //     userData.append("nama_alias_produk[]", p);
        //     userData.append("kuantitas[]", p);
        //     userData.append("satuan[]", p);
        //     userData.append("harga[]", p);
        //     userData.append("persentase_diskon[]", p);
        //     userData.append("diskon_tetap[]", p);
        //     userData.append("ppn[]", p);
        // });

        // productTotal.map((d) => {
        //     userData.append("nama_alias_produk[]", d);
        //     userData.append("kuantitas[]", d);
        //     userData.append("satuan[]", d);
        //     userData.append("harga[]", d);
        //     userData.append("persentase_diskon[]", d);
        //     userData.append("diskon_tetap[]", d);
        //     userData.append("ppn[]", d);
        // })

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/types`,
            data: userData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/tipe");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error.nama,
                    });
                } else if (err.request) {
                    console.log("err.request ", err.request);
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                } else if (err.message) {
                    // do something other than the other two
                    Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                }
            });
    };

    const handleDraft = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        // userData.append("id", id);
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        // product.map((p) => userData.append("produk[]", p));
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.percentage);
            userData.append("diskon_tetap[]", p.disc);
            userData.append("ppn[]", p.ppn);
        });

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/types`,
        //     data: userData,
        //     headers: {
        //         Accept: "application/json",
        //         Authorization: `Bearer ${token}`,
        //     },
        // })
        //     .then(function (response) {
        //         //handle success
        //         Swal.fire(
        //             "Berhasil Ditambahkan",
        //             ` Masuk dalam list`,
        //             "success"
        //         );
        //         navigate("/tipe");
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             console.log("err.response ", err.response);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 text: err.response.data.error.nama,
        //             });
        //         } else if (err.request) {
        //             console.log("err.request ", err.request);
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         } else if (err.message) {
        //             // do something other than the other two
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         }
        //     });
    };

    // add on select dickon
    const selectAfter = (
        <Select
            defaultValue="Rp"
            style={{
                width: 60,
            }}
        >
            <Option value="nominal">Rp</Option>
            <Option value="percent">%</Option>
        </Select>
    );

    // const calculateTotal = (index, allFields) => {
    //     //get values of input based on index
    //     let QtyTotal = allFields[`Qty-${index}`] || 0;
    //     let PriceTotal = allFields[`price-${index}`] || 0;
    //     let PpnTotal = allFields[`ppn-${index}`] || 0;

    //     //you can validate more the input here

    //     //do your calculation
    //     const total = QtyTotal + PriceTotal + PpnTotal;

    //     //update state
    //     const newData = product.map(row => {
    //         if (row.key === index) {
    //             return {
    //                 ...row,
    //                 total
    //             }
    //         }
    //         return row
    //     })

    //     setProduct(newData)
    // }

    const onFinish = values => {
        console.log(values);
    };

    return (
        <>
            <form className="  p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Buat Pesanan</h3>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                {/* <Input
                                    value={getCode}
                                    disabled
                                    style={{
                                        color: 'black',
                                    }}
                                /> */}
                                <input
                                    value={getCode}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    onChange={(e) => setReferensi(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                <textarea
                                    className="form-control"
                                    id="form4Example3"
                                    rows="4"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                <h5>
                                    <span className="badge bg-danger">Draft</span>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form className="  p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Produk</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Produk"
                                centered
                                visible={modal2Visible}
                                // onOk={() => setModal2Visible(false)}
                                onCancel={() => setModal2Visible(false)}
                                footer={[
                                    <Button
                                        key="submit"
                                        type="primary"
                                    //   loading={loading}
                                    //   onClick={handleOk}
                                    >
                                        Tambah
                                    </Button>,
                                ]}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col">
                                            <h4 className="title fw-normal">Cari Produk</h4>
                                        </div>
                                        <div className="col">
                                            <form action="" className="search-form mb-2">
                                                <input type="text" className="form-control" name="search" id="search" placeholder="search" />
                                            </form>
                                        </div>
                                        <Table
                                            rowKey={record => record.key}
                                            columns={columnsModal}
                                            dataSource={getDataProduct}
                                            pagination={{ pageSize: 15 }}
                                            scroll={{
                                                y: 240,
                                            }}
                                            size="middle"
                                        />
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={product}
                        columns={columns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>
                <div className="row p-0">
                    <div className="col ms-5">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk Pajak
                            </label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                    placeholder='(Total Qty X harga) per item + ... '
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                    placeholder='(total disc/item) ditotal semua'
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                    placeholder='ppn per item di total semua row'
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                    placeholder='subtotal - diskon + ppn'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleDraft}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
            </form>
        </>
    )
}

export default BuatPesanan