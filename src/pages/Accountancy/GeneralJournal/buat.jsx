import './form.css'
import { createContext, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, InputNumber, Modal, Space, Typography, Table } from 'antd'
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { formatRupiah } from '../../../utils/helper';
import ReactSelect from 'react-select';
import { useEffect } from 'react';
import Search from 'antd/lib/transfer/search';
const { Text } = Typography;

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
                <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} min={0} defaultValue={1} />
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

const BuatGeneralJournal = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [selected, setSelected] = useState('');
    const [selectValues, setSelectValues] = useState('');
    const [selectValues1, setSelectValues1] = useState('');
    const [accountSelected, setAccountSelected] = useState('');
    const [selectedCoaId, setSelectedCoaId] = useState('');
    const [notes, setNotes] = useState('');
    const [checked, setChecked] = useState(false);
    const [status, setStatus] = useState('');
    const [totalDebit, setTotalDebit] = useState('');
    const [totalCredit, setTotalCredit] = useState('');

    const navigate = useNavigate();

    const [selectedValue, setSelectedType] = useState(null);
    const [selectedValue2, setSelectedCoa] = useState(null);
    const [selectedValue3, setSelectedCurrency] = useState(null);

    const [modal2Visible, setModal2Visible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState("");

    const handleChangeSelected = (value) => {
        setSelectedType(value);
        // setSelectValues(value.id);
        if (selected === "customer_type") {
            setSelectValues(value.id);
            setSelectValues1(null);
        } else {
            setSelectValues(null);
            setSelectValues1(value.id);
        }

    };

    // load options using API call
    const loadOptions = (inputValue) => {
        if (selected === 'customer_type') {
            return fetch(`${Url}/select_customers?limit=10&nama=${inputValue}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            }).then((res) => res.json());
        } else if (selected === 'supplier_type') {
            return fetch(`${Url}/select_suppliers?limit=10&nama=${inputValue}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            }).then((res) => res.json());
        } else { }
    };

    const options = [
        {
            label: "Pelanggan",
            value: "customer_type",
        },
        {
            label: "Pemasok",
            value: "supplier_type",
        },
    ];

    const handleSingleChange = (e) => {
        setSelected(e.value);
    };

    // const handleChangeCoa = (value) => {
    //     setSelectedCoa(value);
    //     setAccountSelected(value.id);
    // };
    // // load options using API call
    // const loadOptionsCoa = (inputValue) => {
    //     return fetch(`${Url}/select_chart_of_accounts?limit=10&nama=${inputValue}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     }).then((res) => res.json());
    // };

    // console.log(selectedValue2);

    const columnCoa = [
        {
            title: 'Nama Akun',
            dataIndex: 'name',
            key: 'rekening',
            // render: (text, row) => <a>{row['date'] + "\n" + row["status"]}</a>,
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            align: 'center',
            width: '20%',
            editable: true,
            render(text, record) {
                let pay = 0;
                if (record.debit !== 0) {
                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: <div>{formatRupiah(pay += record.debit)}</div>
                    }
                }
                else {
                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: <div>{formatRupiah(pay)}</div>
                    }
                }
            }
        },
        {
            title: 'Kredit',
            dataIndex: 'credit',
            align: 'center',
            width: '20%',
            editable: true,
            render(text, record) {
                let pay = 0;
                if (record.credit !== 0) {
                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: <div>{formatRupiah(pay += record.credit)}</div>
                    }
                }
                else {
                    return {
                        props: {
                            style: { background: "#f5f5f5" }
                        },
                        children: <div>{formatRupiah(pay)}</div>
                    }
                }
            }
        },
        {
            title: '#',
            key: 'action',
            align: 'center',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        size='small'
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const handleCheck = (event) => {
        var updatedList = [...selectedCoaId];
        if (event.target.checked) {
            updatedList = [...selectedCoaId, event.target.value];
        } else {
            updatedList.splice(selectedCoaId.indexOf(event.target.value), 1);
        }
        setSelectedCoaId(updatedList);
    };

    const handleSave = (row) => {
        const newData = [...selectedCoaId];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setSelectedCoaId(newData);
        // let check_checked = checked;
        // calculate(product, check_checked);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = columnCoa.map((col) => {
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

    const calculate = () => {
        let totalDebit = 0;
        let totalCredit = 0;
    }

    // useEffect(() => {
    //     loadOptions()
    // }, [])

    // const handleChangeCategoryAcc = (value) => {
    //     setSelectedAccountCategory(value);
    //     setAccountCategory(value.id);
    // };
    // // load options using API call
    // const loadOptionsCategoryAcc = (inputValue) => {
    //     return fetch(`${Url}/select_chart_of_account_categories?nama=${inputValue}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     }).then((res) => res.json());
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("transaction_date", date);
        userData.append("type_of_service", selected);
        userData.append("customer_id", selectValues);
        userData.append("supplier_id", selectValues1);
        selectedCoaId.map((p) => userData.append("chart_of_account_id[]", p.id));
        userData.append("debit[]", totalDebit);
        userData.append("credit[]", totalCredit);
        userData.append("notes", notes);
        userData.append("status", "publish");

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/accountmovements`,
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
                navigate("/coa");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        // text: err.response.data.error.nama,
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
        userData.append("transaction_date", date);
        userData.append("type_of_service", selected);
        userData.append("customer_id", selectValues);
        userData.append("supplier_id", selectValues1);
        selectedCoaId.map((p) => userData.append("chart_of_account_id[]", p.id));
        userData.append("debit[]", totalDebit);
        userData.append("credit[]", totalCredit);
        userData.append("notes", notes);
        userData.append("status", "draft");

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/accountmovements`,
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
                navigate("/coa");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        // text: err.response.data.error.nama,
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

    const onChange = () => {
        checked ? setChecked(false) : setChecked(true)

        if (checked === false) {
            setStatus("Active");
            // console.log('Active');
        } else {
            setStatus("Inactive");
            // console.log('Inactive');
        }
    };

    const handleDelete = (stid) => {
        setSelectedCoaId(data => data.filter(item => item.id !== stid));
    };



    const columnsModal = [
        {
            title: 'Nama Akun',
            dataIndex: 'name',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '15%',
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

    useEffect(() => {
        const getAccount = async () => {
            const res = await axios.get(`${Url}/select_chart_of_accounts?nama=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setAccountSelected(res.data);
        };

        if (query.length === 0 || query.length > 2) getAccount();
    }, [query])

    return (
        <>
            <form className="p-3 mb-3 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <h4 className="title fw-bold">Buat Jurnal Umum</h4>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Transaksi</label>
                            <div className="col-sm-7">
                                <input
                                    // value={getCode}
                                    value="Otomatis"
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan/Pemasok</label>
                            <div className="col-sm-7">
                                <ReactSelect
                                    // value={optionsGroups.filter((obj) =>
                                    //     groups.includes(obj.value)
                                    // )}
                                    name="colors"
                                    options={options}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Pilih..."
                                    onChange={handleSingleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan/Pemasok..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptions}
                                    onChange={handleChangeSelected}
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
                                    onChange={(e) => setNotes(e.target.value)}
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
                            <h4 className="title fw-normal">Pilih Akun</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Daftar Akun"
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
                                                placeholder="Cari Akun..."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={accountSelected}
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
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={selectedCoaId}
                        columns={columns}
                        onChange={(e) => setSelectedCoaId(e.target.value)}
                        summary={(pageData) => {
                            let totalDebit = 0;
                            let totalCredit = 0;
                            pageData.forEach(({ debit, credit }) => {
                                totalDebit += debit;
                                totalCredit += credit;
                            });
                            setTotalDebit(totalDebit)
                            setTotalCredit(totalCredit)
                            return (
                                <>
                                    <Table.Summary.Row style={{ background: "#f5f5f5" }}>
                                        <Table.Summary.Cell index={0}>
                                            <Text style={{ fontWeight: 'bold' }}>Total</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="center">
                                            <Text>{formatRupiah(totalDebit)}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={2} align="center">
                                            <Text>{formatRupiah(totalCredit)}</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3} align="center">
                                            {/* <Text>{formatRupiah(totalCredit)}</Text> */}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                    {/* <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2}>
                                            <Text type="danger">{totalDebit - totalRepayment}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row> */}
                                </>
                            );
                        }}
                    />
                </div>
                {/* <div className="d-flex flex-row-reverse bd-highlight me-3">
                    <div className="p-2 bd-highlight">
                        <div className="col-sm-12">
                            <input
                                // defaultValue={subTotal}
                                readOnly="true"
                                type="number"
                                className="form-control form-control-sm"
                                id="colFormLabelSm"
                            // placeholder='(Total Qty X harga) per item + ... '
                            />
                        </div>
                    </div>
                    <div className="p-2 bd-highlight">
                        <label for="colFormLabelSm" className="col-sm-12 col-form-label col-form-label-sm">Total Debit</label>
                    </div>
                </div>
                <div className="d-flex flex-row-reverse bd-highlight me-3">
                    <div className="p-2 bd-highlight">
                        <div className="col-sm-12">
                            <input
                                // defaultValue={subTotal}
                                readOnly="true"
                                type="number"
                                className="form-control form-control-sm"
                                id="colFormLabelSm"
                            // placeholder='(Total Qty X harga) per item + ... '
                            />
                        </div>
                    </div>
                    <div className="p-2 bd-highlight">
                        <label for="colFormLabelSm" className="col-sm-12 col-form-label col-form-label-sm">Total Credit</label>
                    </div>
                </div> */}
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
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
                        Publish
                    </button>
                </div>
            </form>
        </>
    )
}

export default BuatGeneralJournal;