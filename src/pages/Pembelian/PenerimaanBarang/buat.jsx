import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Space, Table, Tag } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import Spreadsheet from 'react-spreadsheet';
import { useSelector } from 'react-redux';
import { PageHeader} from 'antd';

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
                {/* <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={1} max={1000} defaultValue={1} /> */}
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} step="0.01" defaultValue={1} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const BuatPenerimaanBarang = () => {
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [warehouse, setWarehouse] = useState("");
    const [product, setProduct] = useState([]);
    const [productTampil, setProductTampil] = useState([])
    const [productSelect, setProductSelect] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const [loadingTable, setLoadingTable] = useState(false);

    const [getDataProduct, setGetDataProduct] = useState('');
    const [getDataDetailSO, setGetDataDetailSO] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [count, setCount] = useState(0);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [supplierId, setSupplierId] = useState();
    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedWarehouse] = useState(null);
    const [selectedValue3, setSelectedProduct] = useState([]);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal2Visible2, setModal2Visible2] = useState(false);
    const [indexTS, setIndexTS] = useState()
    const [tampil, setTampil] = useState(false)
    const [address, setAddress] = useState()
    const [dataAddress, setDataAddress] =  useState([])
    const [gudang, setGudang] = useState()

    function hapusIndexProduct(index1, index2) {
        console.log(index1)
        setLoadingTable(true);
        for (let x = 0; x < productTampil.length; x++) {
            console.log(productTampil[x].tally_sheet_details.length)
            for (let y = 0; y < productTampil[x].tally_sheet_details.length; y++) {
                if (x == index1 && y == index2) {
                    if (productTampil[x].tally_sheet_details.length == 1) {
                        console.log("ini ilang semua si")
                        productTampil.splice(x, 1);
                    }
                    else {
                        productTampil[x].tally_sheet_details.splice(y, 1);
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Data berhasil dihapus',
                    }).then(() => setLoadingTable(false));
                }
            }

        }
        console.log(product)

    }
    const expandedRowRender = (record) => {
        const columns = [
            {
                title: 'Nama Product',
                dataIndex: 'product_name',
                width: '25%',
                key: 'name',
            },
            {
                title: 'Qty',
                dataIndex: 'quantity',
                width: '10%',
                align: 'center',
                editable: true,
            },
            {
                title: 'Stn',
                dataIndex: 'unit',
                align: 'center',
                width: '10%',
                key: 'name',
            },
            // {
            //     title: 'Action',
            //     dataIndex: 'action',
            //     align: 'center',
            //     width: '10%',
            //     key: 'operation',

            // },
        ];

        const dataPurchase =
            [...productTampil[record.key].tally_sheet_details.map((item, i) => ({

                product_name: item.product_name,
                quantity: item.boxes_quantity,
                unit: item.boxes_unit,
                // action:
                //     <Space size="middle">
                //         <Button
                //             size='small'
                //             type="danger"
                //             icon={<DeleteOutlined />}
                //             onClick={() => { hapusIndexProduct(record.key, i) }}
                //         />
                //     </Space>,
            }))

            ];

        // if(loadingTable){
        //     return <LoadingOutlined/>
        // }
        // else{
        return <Table
            style={{ display: loadingTable ? "none" : 'block' }}
            columns={columns}
            dataSource={dataPurchase}
            pagination={false}
            isLoading={true}
            rowClassName={() => 'editable-row'}
        />;
        // }

    };
    // 

    const defaultColumns = [
        {
            title: 'No. Transaksi',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'code',
        },
    ];

    const mainDataSource =
        [...product.map((item, i) => ({
            key: i,
            code: item.code,
            status: item.status,
        }))

        ]

    useEffect(() => {
        axios.get(`${Url}/select_supplier_addresses?id_pemasok=${supplierId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let alamat = [];
                res.data.map((item) => {
                    alamat.push({ value: item.id, label: item.address })
                })
                setDataAddress(alamat);
            })
    }, [supplierId])

    const handleChangeSupplier = (value) => {
        setSupplierId(value.id);
        setProduct([])
        setSelectedSupplier(value);
    };
    // load options using API call
    const loadOptionsSupplier = (inputValue) => {
        return fetch(`${Url}/select_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // const handleChangeWarehouse = (value) => {
    //     setSelectedWarehouse(value);
    //     setWarehouse(value.id);
    // };
    // // load options using API call
    // const loadOptionsWarehouse = (inputValue) => {
    //     return fetch(`${Url}/select_supplier_addresses?nama=${inputValue}&id_pemasok=${supplierId}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     }).then((res) =>  res.json());
    // };

    const handleChangeProduct = (value) => {
        setSelectedProduct(value);
        setProductSelect(value.id);
    };
    // load options using API call
    const loadOptionsProduct = (inputValue) => {
        return fetch(`${Url}/select_products?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        getNewCodeTally()
    })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_tally_sheet_ins?kode=${query}&status=Submitted&id_pemasok=${supplierId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
            setGudang(res.data.warehouse_id)
            setGetDataDetailSO(res.data.map(d => d.sales_order_details))
            // console.log(res.data.map(d => d.sales_order_details))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplierId])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Transaksi',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier_name',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Gudang',
            dataIndex: 'notes',
            width: '30%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '8%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Checkbox
                        value={record}
                        onChange={handleCheck}
                    />
                </>
            )
        },
    ];



    const handleCheck = (event) => {
        var updatedList = [...product];
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            for (let i = 0; i < product.length; i++) {
                if (updatedList[i] == event.target.value) {
                    updatedList.splice(i, 1);
                }
            }

        }
        setProduct(updatedList);
        setProductTampil(updatedList)
        setGetDataDetailSO(updatedList.map(d => d.sales_order_details))
        console.log(updatedList.map(d => d.sales_order_details));
        console.log(updatedList);
    };

    const getNewCodeTally = async () => {
        await axios.get(`${Url}/get_new_goods_receipt_draft_code/purchase_orders?tanggal=${date}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                setGetCode(res.data.data);
                console.log(res.data.data)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("tanggal", date);
        formData.append("grup", productTampil[0].supplier._group);
        formData.append("pemasok", supplierId);
        formData.append("referensi", description);

        // formData.append("gudang", gudang);

        for (let x = 0; x < productTampil.length; x++) {
            formData.append("id_tally_sheet[]", productTampil[x].id);
            console.log(productTampil[x].id)
            for (let y = 0; y < productTampil[x].tally_sheet_details.length; y++) {
                formData.append("id_pesanan_penjualan[]", product[x].tally_sheet_details[y].purchase_order.id)
                // formData.append("id_tally_sheet[]", product[x].tally_sheet_details[y].id);
                formData.append("kuantitas_produk_box[]", product[x].tally_sheet_details[y].boxes_quantity);
            }
        }
        formData.append("status", "Submitted");

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/goods_receipts`,
            data: formData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/penerimaanbarang");
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
        console.log(productTampil)
        const formData = new FormData();
        formData.append("tanggal", date);
        formData.append("grup", productTampil[0].supplier._group);
        formData.append("alamat", address);
        formData.append("pemasok", supplierId);
        formData.append("referensi", description);

        // formData.append("gudang", gudang);

        for (let x = 0; x < productTampil.length; x++) {
            formData.append("id_tally_sheet[]", productTampil[x].id);
            for (let y = 0; y < productTampil[x].tally_sheet_details.length; y++) {
                formData.append("id_pesanan_penjualan[]", productTampil[x].tally_sheet_details[y].purchase_order.id)
                formData.append("kuantitas_produk_box[]", productTampil[x].tally_sheet_details[y].boxes_quantity);
            }
        }

        // userData.append("catatan", description);
        formData.append("status", "Draft");


        axios({
            method: "post",
            url: `${Url}/goods_receipts`,
            data: formData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                Swal.fire(
                    "Berhasil Ditambahkan",
                    ` Masuk dalam list`,
                    "success"
                );
                navigate("/penerimaanbarang");
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

    return (
        <>
          <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Penerimaan Barang">
          </PageHeader>

            <form className="p-3 mb-3 bg-body rounded">
              
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Penerimaan</label>
                            <div className="col-sm-7">
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        {/* <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Alamat</label>
                            <div className="col-sm-7">
                                <Select
                                    placeholder="Pilih Alamat..."
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isLoading={isLoading}
                                    isClearable={true}
                                    isSearchable={true}
                                    options={dataAddress}
                                    onChange={(e) => setAddress(e.value)}
                                />
                            </div>
                        </div> */}
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
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Tally Sheet</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Tally Sheet"
                                centered
                                visible={modal2Visible}
                                onCancel={() => setModal2Visible(false)}
                                width={1000}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Tally Sheet..."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={getDataProduct}
                                            scroll={{
                                                y: 250,
                                            }}
                                            pagination={false}
                                            loading={isLoading}
                                            size="middle"
                                        />
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                    <Table
                        bordered
                        pagination={false}
                        dataSource={mainDataSource}
                        expandable={{ expandedRowRender }}
                        columns={defaultColumns}
                        onChange={(e) => setProduct(e.target.value)}
                    />
                </div>

                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{float:'right', position:'relative'}}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleDraft}
                        style = {{width: '100px'}}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleSubmit}
                        style = {{width: '100px'}}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        style = {{width: '100px'}}
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
                <div style={{clear:'both'}}></div>
            </form>
        </>
    )
}

export default BuatPenerimaanBarang