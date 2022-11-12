import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';

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
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} step="0.01" defaultValue={1}
                    //               formatter={value => `${value.replace('.',',')}`} 
                    decimalSeparator={','}
                    onChange={value => {
                        value = parseFloat(value.toString().replace('.', ','))
                    }}

                />
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

const CreateGoodsRequest = () => {
    // const token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);

    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');

    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(null);
    const [type, setType] = useState('');
    const [warehouse_source, setWarehouseSource] = useState([]);
    const [warehouse_destination, setWarehouseDestination] = useState([]);
    const [selectedWarehouseSource, setSelectedWarehouseSource] = useState(null);
    const [selectedWarehouseDestination, setSelectedWarehouseDestination] = useState(null);

    const navigate = useNavigate();

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [jumlah, setJumlah] = useState([])
    const [tmpCentang, setTmpCentang] = useState([]);

    const cardOutline = {
        borderTop: '3px solid #007bff',
    }

    const handleChangeWarehouseSource = (value) => {
        setSelectedWarehouseSource(value);
        setWarehouseSource(value.id);
    };

    const handleChangeWarehouseDestination = (value) => {
        setSelectedWarehouseDestination(value);
        setWarehouseDestination(value.id);
    };

    // load options using API call
    const loadOptionsWarehouse = (inputValue) => {
        return fetch(`${Url}/select_warehouses?limit=10&nama=${inputValue}&tipe=internal`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_stock_warehouses?product_name=${query}&warehouse_source=${warehouse_source}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].product_id) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
                // else {
                //     tmp.push({
                //         detail: res.data[i],
                //         statusCek: false
                //     });
                // }
//
            }
            for(let i=0; i < res.data.length; i++){
                if(tmpCentang.indexOf(res.data[i].product_id) < 0)
                tmp.push({
                    detail:res.data[i],
                    statusCek:false
                })
            }


            setGetDataProduct(tmp);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
            render: (_, record) => {
                return <>{record.detail.product_name}</>
            }
        },
        {
            title: 'Stok',
            dataIndex: 'qty',
            width: '15%',
            align: 'center',
            render: (_,record) => {
                return <>{record.detail.qty.toString().replace('.', ',')}</>

            }
        },
        {
            title: 'actions',
            dataIndex: 'actions',
            width: '15%',
            align: 'center',
            render: (_, record, index) => (
                <>
                    <Checkbox
                        value={record}
                        // checked
                        checked={record.statusCek}
                        onChange={(e) => handleCheck(e, index)}
                    // onChange={handleCheck}
                    />
                    {/* <CheckBox
          type="checkbox"
          checked={selected}
          onChange={handleOnChange} 
        ></CheckBox> */}
                </>
            )
        },
    ];
    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_name',
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: '30%',
            align: 'center',
            editable: true,
            render: (text) => {
                return convertToRupiahTabel(text)
            }
        },
        {
            title: 'Satuan',
            dataIndex: 'unit',
            width: '30%',
            align: 'center',
        },
    ];

    const convertToRupiahTabel = (angka) => {
        return <>
            {
                < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} />

            }
        </>
    }

    const checkWarehouse = () => {
        // var updatedList = [...product];
        // updatedList = []
        // updatedList.splice(product.indexOf(0), 1);
        // setProduct(updatedList);
        if (warehouse_source == "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Pilih Gudang Asal Terlebih Dahulu !",
            });
        } else {
            setModal2Visible(true)
            // setChecked(!checked);
            // let check_checked = !checked;
            // calculate(product, check_checked);
        }
    };
    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.product_id === item.product_id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        let check_checked = checked;
        calculate(product, check_checked);
    };
    const calculate = (product, check_checked) => {
        let subTotal = 0;
        let totalDiscount = 0;
        let totalNominalDiscount = 0;
        let grandTotalDiscount = 0;
        let getPpnDiscount = 0;
        let allTotalDiscount = 0;
        let totalPpn = 0;
        let grandTotal = 0;
        let getPpn = 0;
        let total = 0;
        product.map((values) => {
            if (check_checked) {
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                subTotal += ((total - getPpnDiscount) * 100) / (100 + values.ppn);
                allTotalDiscount += total - getPpnDiscount;
                totalPpn = allTotalDiscount - subTotal;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            } else {
                subTotal += (values.quantity * values.price);
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                allTotalDiscount = total - getPpnDiscount;
                getPpn = (allTotalDiscount * values.ppn) / 100;
                totalPpn += getPpn;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            }
        })
    }
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

    const handleCheck = (event, index) => {
        let data = event.target.value

        let tmpDataBaru = []
        let tmpJumlah = [...jumlah]
        let tmpDataCentang = [...tmpCentang]
        for (let i = 0; i < getDataProduct.length; i++) {
            if (i == index) {
                tmpDataBaru.push({
                    detail: getDataProduct[i].detail,
                    statusCek: !getDataProduct[i].statusCek
                })
                if (!tmpDataBaru[i].statusCek) {
                    let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.product_id);
                    tmpDataCentang.splice(idxHapus, 1)
                }
                else if (tmpDataBaru[i].statusCek == true) {
                    tmpDataCentang.push(tmpDataBaru[i].detail.product_id)
                }
                // tmpDataCentang.push(tmpDataBaru[i].detail.product_id)

            }
            else {
                tmpDataBaru.push(getDataProduct[i])
            }


            if (tmpDataBaru[i].statusCek == true) {
                tmpDataCentang.push(tmpDataBaru[i].detail.product_id)
            }
            else {
                let index = tmpDataCentang.indexOf(tmpDataBaru[i].detail.product_id);
                if (index >= 0) {
                    tmpDataCentang.splice(index, 1)
                }
                // tmpDataCentang.push('')
            }
        }
        let unikTmpCentang = [...new Set(tmpDataCentang)]
        setTmpCentang(unikTmpCentang)
        setGetDataProduct(tmpDataBaru)
        var updatedList = [...product];
        if (tmpDataBaru[index].statusCek) {
            updatedList = [...product, data.detail];

            for (let i = 0; i < updatedList.length; i++) {
                if (i >= product.length) {
                    tmpJumlah.push(0)
                }

            }
            console.log(tmpJumlah)
        } else {
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i].product_id == data.detail.product_id) {
                    updatedList.splice(i, 1);
                    tmpJumlah.splice(i, 1)
                }
            }
        }
        setProduct(updatedList);
        setJumlah(tmpJumlah)
        console.log(tmpDataBaru, "Cekk", updatedList)
    }

    // const handleCheck = (event) => {
    //     var updatedList = [...product];
    //     if (event.target.checked) {
    //         updatedList = [...product, event.target.value];
    //     } else {
    //         updatedList.splice(product.indexOf(event.target.value), 1);
    //     }
    //     console.log(product.indexOf(event.target.value))
    //     console.log(updatedList);
    //     setProduct(updatedList);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("date", date);
        userData.append("warehouse_source", warehouse_source);
        userData.append("warehouse_destination", warehouse_destination);
        userData.append("type", type);
        userData.append("notes", notes);
        userData.append("status", "Submitted");
        product.map((p) => {
            console.log(p);
            userData.append("product_id[]", p.product_id);
            userData.append("qty[]", p.qty);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/goodsrequests`,
            data: userData,
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
                navigate("/permintaanbarang");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Gagal Ditambahkan Mohon Cek Dahulu..",
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
        userData.append("date", date);
        userData.append("warehouse_source", warehouse_source);
        userData.append("warehouse_destination", warehouse_destination);
        userData.append("type", type);
        userData.append("notes", notes);
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("product_id[]", p.product_id);
            userData.append("qty[]", p.qty);
        });

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/goodsrequests`,
            data: userData,
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
                navigate("/permintaanbarang");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Gagal Ditambahkan Mohon Cek Dahulu..",
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
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Buat Permintaan Barang"
            >
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group row mb-1">
                            <label for="code" className="col-sm-4 col-form-label">No</label>
                            <div className="col-sm-8">
                                <input type="text" className="form-control" id="code" name="code" placeholder="Otomatis" readOnly />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="date" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-8">
                                <input type="date" className="form-control" id="date" name="date" onChange={(e) => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="type" className="col-sm-4 col-form-label">Tipe</label>
                            <div className="col-sm-8">
                                <select onChange={e => setType(e.target.value)} id="type" name="type" className="form-select">
                                    <option>Pilih Tipe</option>
                                    <option value="send">Kirim</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Asal</label>
                            <div className="col-sm-8">
                                <AsyncSelect
                                    placeholder="Pilih Gudang Asal..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedWarehouseSource}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsWarehouse}
                                    onChange={handleChangeWarehouseSource}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group row mb-1">
                            <label for="notes" className="col-sm-4 col-form-label">Catatan</label>
                            <div className="col-sm-8">
                                <textarea
                                    className="form-control"
                                    name="notes" id="notes"
                                    rows="3"
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label for="adjustment_status" className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                                <h3 className="badge bg-danger text-center m-1">
                                    Draft
                                </h3>
                            </div>
                        </div>
                        <div className="form-group row mb-1">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Tujuan</label>
                            <div className="col-sm-8">
                                <AsyncSelect
                                    placeholder="Pilih Gudang Tujuan..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedWarehouseDestination}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsWarehouse}
                                    onChange={handleChangeWarehouseDestination}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                title="Daftar Produk"
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        // onClick={() => setModal2Visible(true)}
                        onClick={checkWarehouse}
                    />,
                    <Modal
                        title="Tambah Produk"
                        centered
                        visible={modal2Visible}
                        onCancel={() => setModal2Visible(false)}
                        // footer={[
                        //     <Button
                        //         key="submit"
                        //         type="primary"

                        //     >
                        //         Tambah
                        //     </Button>,
                        // ]}
                        footer={null}
                    >
                        <div className="text-title text-start">
                            <div className="row">
                                <div className="col mb-3">
                                    <Search
                                        placeholder="Cari Produk..."
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
                ]}
            >
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    pagination={false}
                    dataSource={product}
                    columns={columns}
                    onChange={(e) => setProduct(e.target.value)}
                />
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2" role="group" aria-label="Basic mixed styles example">
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </PageHeader>
        </>
    )
}

export default CreateGoodsRequest