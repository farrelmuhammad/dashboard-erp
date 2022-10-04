import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, PageHeader, Select, Skeleton, Space, Table, Tag } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import Spreadsheet from 'react-spreadsheet';
import { useSelector } from 'react-redux';

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

const DetailTally = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [code, setCode] = useState("");
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [warehouse, setWarehouse] = useState("");
    const [product, setProduct] = useState([]);
    const [productSelect, setProductSelect] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();

    const [getDataProduct, setGetDataProduct] = useState('');
    const [getDataDetailSO, setGetDataDetailSO] = useState('');
    const [loading, setLoading] = useState(true);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [count, setCount] = useState(0);

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedWarehouse] = useState(null);
    const [selectedValue3, setSelectedProduct] = useState([]);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal2Visible2, setModal2Visible2] = useState(false);

    const [data, setData] = useState([
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
        [{ value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }, { value: '' }, { value: "" }],
    ]);

    const { id } = useParams();

    useEffect(() => {
        axios.get(`${Url}/tally_sheets?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0]
                setCode(getData.code)
                setDate(getData.date)
                setCustomer(getData.customer.name)
                setWarehouse(getData.warehouse.name)
                setDescription(getData.notes)
                setLoading(false)
                console.log(getData);
            })
    }, [])

    const expandedRowRender = (product) => {
        const handleAddBox = () => {
            // const box = [...data];
            const newBox = [{ value: '' } * 10]
            setData([...data], newBox)
        }

        const columns = [
            {
                title: 'Nama Alias',
                dataIndex: 'alias_name',
                width: '25%',
                key: 'date',

            },
            {
                title: 'Nama Product',
                dataIndex: 'name',
                width: '25%',
                key: 'name',
                render: (text, record) => (
                    <>
                        <AsyncSelect
                            placeholder="Pilih Product..."
                            cacheOptions
                            defaultOptions
                            value={selectedValue3}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={loadOptionsProduct}
                            onChange={handleChangeProduct}
                        />
                    </>
                )
            },
            {
                title: 'Qty',
                dataIndex: 'quantity',
                width: '10%',
                align: 'center',
                editable: true,
                key: 'name',
                render: (record) => (
                    <>
                        <a>dari box</a>
                    </>
                )
            },
            {
                title: 'Stn',
                dataIndex: 'unit',
                align: 'center',
                width: '10%',
                key: 'name',
            },
            {
                title: 'Box',
                dataIndex: 'box',
                align: 'center',
                width: '10%',
                key: 'box',
                render: (text) =>
                    <>
                        <a onClick={() => setModal2Visible2(true)}>
                            0
                        </a>
                        <Modal
                            centered
                            visible={modal2Visible2}
                            onCancel={() => setModal2Visible2(false)}
                            width={1000}
                            footer={[
                                <Button
                                    key="submit"
                                    type="primary"
                                    style={{ background: "green", borderColor: "white" }}
                                >
                                    Simpan
                                </Button>,
                            ]}
                        >
                            <div className="text-title text-start">
                                <div className="row">
                                    <div className="col">
                                        <div className="row">
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">No. Pesanan</label>
                                            <div className="col-sm-3">
                                                <Input
                                                    placeholder="No. Pesanan"
                                                    disabled
                                                />
                                            </div>
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Pesanan</label>
                                            <div className="col-sm-3">
                                                <Input
                                                    placeholder="Qty Pesanan"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-1">
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Produk</label>
                                            <div className="col-sm-3">
                                                <Input
                                                    placeholder="Nama Produk"
                                                    disabled
                                                />
                                            </div>
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                            <div className="col-sm-3">
                                                <Input
                                                    placeholder="Qty Tally Sheet"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10">
                                        <Spreadsheet
                                            data={data}
                                            onChange={setData}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </>
            },
            {
                title: 'Action',
                dataIndex: 'action',
                align: 'center',
                width: '10%',
                key: 'operation',
                render: (record) => (
                    <Space size="middle">
                        <Button
                            size='small'
                            type="danger"
                            icon={<DeleteOutlined />}
                        // onClick={() => handleDelete(record.id)}
                        />
                        <Button
                            size='small'
                            type="primary"
                            icon={<PlusOutlined />}
                        // onClick={handleAdd}
                        />
                    </Space>
                ),
            },
        ];

        return <Table
            columns={columns}
            dataSource={product.sales_order_details}
            pagination={false}
            rowClassName={() => 'editable-row'}
        />;
    };

    console.log(product.map(d => d.details.map(data => data)))

    const dataSelect = [
        {
            code: 'BM220906-SO001',
            customer_id: 2,
            notes: 'asdf',
            details: [
                {
                    id: 8,
                    sales_order_id: 17,
                    product_alias_name: "Bagian 1-Grade 1-Merk 1",
                    quantity: "2",
                    unit: "kg",
                    price: "1500",
                    subtotal: "3000",
                    discount_percentage: "50",
                    fixed_discount: "100",
                    subtotal_after_discount: "1400",
                    ppn: "50",
                    total: "1450",
                    created_at: "2022-09-06T07:10:42.000000Z",
                    updated_at: "2022-09-06T07:10:42.000000Z",
                    sales_order_code: "BM220906-SO001",
                    customer_id: 2,
                    notes: "C4",
                    tally_sheets_qty: 0
                },
                {
                    id: 9,
                    sales_order_id: 17,
                    product_alias_name: "Bagian 1 Grade 1 Merk 1",
                    quantity: "50",
                    unit: "kg",
                    price: "5000",
                    subtotal: "250000",
                    discount_percentage: "0",
                    fixed_discount: "1000",
                    subtotal_after_discount: "249000",
                    ppn: "1000",
                    total: "250000",
                    created_at: "2022-09-06T07:10:42.000000Z",
                    updated_at: "2022-09-06T07:10:42.000000Z",
                    sales_order_code: "BM220906-SO001",
                    customer_id: 2,
                    notes: "C4",
                    tally_sheets_qty: 0
                }
            ]
        }
    ];

    const defaultColumns = [
        {
            title: 'No. Pesanan',
            dataIndex: 'sales_order_code',
            key: 'code',
            width: '20%',
        },
        {
            title: 'Nama Alias',
            dataIndex: 'product_alias_name',
            width: '20%',
            // key: 'date',

        },
        {
            title: 'Nama Product',
            dataIndex: 'name',
            width: '25%',
            key: 'name',
            render: (text, record) => (
                <>
                    {/* <AsyncSelect
                        placeholder="Pilih Product..."
                        cacheOptions
                        defaultOptions
                        value={selectedValue3}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        loadOptions={loadOptionsProduct}
                        onChange={handleChangeProduct}
                    /> */}
                </>
            )
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '10%',
            align: 'center',
            editable: true,
            key: 'name',
            render: (record) => (
                <>
                    <a>dari box</a>
                </>
            )
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            align: 'center',
            width: '10%',
            key: 'name',
        },
        {
            title: 'Box',
            dataIndex: 'box',
            align: 'center',
            width: '10%',
            key: 'box',
            render: (text, record) =>
                <>
                    <a onClick={() => setModal2Visible2(true)}>
                        0
                    </a>
                    <Modal
                        centered
                        visible={modal2Visible2}
                        onCancel={() => setModal2Visible2(false)}
                        width={1000}
                        footer={[
                            <Button
                                key="submit"
                                type="primary"
                                style={{ background: "green", borderColor: "white" }}
                            >
                                Simpan
                            </Button>,
                        ]}
                    >
                        <div className="text-title text-start">
                            <div className="row">
                                <div className="col">
                                    <div className="row">
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">No. Pesanan</label>
                                        <div className="col-sm-3">
                                            <Input
                                                value={record.sales_order_code}
                                                disabled
                                            />
                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Pesanan</label>
                                        <div className="col-sm-3">
                                            <Input
                                                value={record.quantity}
                                                disabled
                                                style={{ fontWeight: 'bold' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-1">
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Produk</label>
                                        <div className="col-sm-3">
                                            <Input
                                                value={productSelect}
                                                disabled
                                            />
                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                        <div className="col-sm-3">
                                            <Input
                                                value="Qty Tally Sheet"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10">
                                    <Spreadsheet
                                        data={data}
                                        onChange={setData}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal>
                </>
        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            width: '10%',
            key: 'operation',
            render: (record) => (
                <Space size="middle">
                    <Button
                        size='small'
                        type="danger"
                        icon={<DeleteOutlined />}
                    // onClick={() => handleDelete(record.id)}
                    />
                    <Button
                        size='small'
                        type="primary"
                        icon={<PlusOutlined />}
                    // onClick={handleAdd}
                    />
                </Space>
            ),
        },
    ];


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

    // useEffect(() => {
    //     getNewCodeTally()
    // })

    console.log(customer);

    useEffect(() => {
        const getProduct = async (costumer) => {
            const res = await axios.get(`${Url}/select_sales_order_details/17`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
            setGetDataDetailSO(res.data.map(d => d.sales_order_details))
            // console.log(res.data.map(d => d.sales_order_details))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Transaksi',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: 'Pelanggan',
            dataIndex: 'customer_id',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Catatan',
            dataIndex: 'notes',
            width: '30%',
            align: 'center',
        },
        {
            title: 'actions',
            // dataIndex: 'address',
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
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
        setGetDataDetailSO(updatedList.map(d => d.sales_order_details))
        console.log(updatedList.map(d => d.sales_order_details));
    };

    if (loading) {
        return (
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        )
    }

    return (
        <>
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Tally Sheet"
                extra={[
                    <Link to={`/tally/edit/${id}`}>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                        />
                    </Link>,
                ]}
            >
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    value={date}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                <input
                                    value={code}
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
                                <select disabled="true" id="PelangganSelect" className="form-select">
                                    <option>{customer}</option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang</label>
                            <div className="col-sm-7">
                                <select disabled="true" id="PelangganSelect" className="form-select">
                                    <option>{warehouse}</option>
                                </select>
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
                                    value={description}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                title="Daftar Pesanan"
            >
                <Table
                    bordered
                    pagination={false}
                    dataSource={product}
                    // expandable={{ expandedRowRender }}
                    columns={defaultColumns}
                />
            </PageHeader>
        </>
    )
}

export default DetailTally