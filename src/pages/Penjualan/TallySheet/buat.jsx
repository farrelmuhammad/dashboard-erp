import './form.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, PageHeader, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import ReactDataSheet from 'react-datasheet';
import "react-datasheet/lib/react-datasheet.css";

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

const BuatTally = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
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
    const [isLoading, setIsLoading] = useState(false);

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

    const [productPO, setProductPO] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [delIndex, setDelIndex] = useState([]);
    const [totalTallySheet, setTotalTallySheet] = useState([]);
    const [data, setData] = useState([]);
    const [dataSheet, setDataSheet] = useState([]);
    const [loadingSpreedSheet, setLoadingSpreadSheet] = useState(false);
    const [totalBox, setTotalBox] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [qtyPesanan, setQtyPesanan] = useState([])
    const [indexPO, setIndexPO] = useState(0);
    const [kuantitasBox, setKuantitasBox] = useState([]);
    const [idxPesanan, setIdxPesanan] = useState(0);
    const [statusSO, setStatusSO] = useState([]);

    useEffect(() => {
        let arrTotal = [];
        let total = [];

        for (let x = 0; x < product.length; x++) {
            total = [];
            for (let i = 0; i < product[x].sales_order_details.length; i++) {
                total[i] = 0;
                for (let a = 1; a < data[x][i].length; a++) {
                    for (let b = 1; b < data[x][i][a].length; b++) {
                        if (data[x][i][a][b].value != 0) {
                            total[i] = Number(total[i]) + Number(data[x][i][a][b].value);
                        }
                    }
                }
            }
            arrTotal[x] = total;
        }
        setTotalTallySheet(arrTotal);

        // let arrStatus = [];
        // for (let x = 0; x < product.length; x++) {
        //     let stts = [];
        //     for (let i = 0; i < product[x].sales_order_details[i].length; i++) {
        //         let qtySO = product[x].sales_order_details[i].quantity;
        //         let qtySebelumnya = product[x].sales_order_details[i].tally_sheets_qty;
        //         console.log(qtySebelumnya)
        //         if (Number(arrTotal[x][i]) + Number(qtySebelumnya) >= qtySO) {
        //             stts.push('Done')
        //         }
        //         else if (Number(arrTotal[x][i]) + Number(qtySebelumnya) < qtySO) {
        //             stts.push('Next Delivery')
        //         }
        //     }
        //     arrStatus.push(stts);
        // }
        // setStatusSO(arrStatus)
    }, [data]);


    const valueRenderer = (cell) => cell.value;

    const onCellsChanged = (changes) => {
        const tempGrid = [];
        const newGrid = [];

        tempGrid[indexPO] = data[idxPesanan][indexPO];
        newGrid[idxPesanan] = tempGrid;

        // menyimpan perubahan 
        changes.forEach(({ cell, row, col, value }) => {

            for (let x = 0; x < product.length; x++) {
                if (x === idxPesanan) {
                    for (let i = 0; i < productPO.length; i++) {
                        if (i === indexPO) {
                            newGrid[idxPesanan][i][row][col] = { ...data[idxPesanan][indexPO][row][col], value };
                        }
                    }
                }
            }
        });

        // update jumlah tally sheet 
        let arrTly = [];
        let totTly = [];

        for (let x = 0; x < product.length; x++) {
            totTly = [];
            for (let i = 0; i < product[x].sales_order_details.length; i++) {
                totTly[i] = 0;
                for (let a = 1; a < data[x][i].length; a++) {
                    for (let b = 1; b < data[x][i][a].length; b++) {
                        if (data[x][i][a][b].value != 0) {
                            totTly[i] = Number(totTly[i]) + Number(data[x][i][a][b].value);
                        }
                    }
                }
            }
            arrTly[x] = totTly;
        }
        setTotalTallySheet(arrTly);

        // update pada state 
        let arrData = [];
        let tempData = [];
        for (let x = 0; x < product.length; x++) {

            tempData = [];
            if (x == idxPesanan) {
                for (let i = 0; i < productPO.length; i++) {
                    if (i === indexPO) {
                        tempData[i] = newGrid[x][i];
                    } else {
                        tempData[i] = data[x][i];
                    }
                }
                arrData.push(tempData);
            }
            else {
                arrData.push(data[x]);
            }
        }
        setData(arrData);


        // mencari jumlah qty dan total box 
        let arrTotal = []
        let total = [];
        let kuantitas = [];
        let tempKuantitas = [];
        let arrKuantitas = [];
        let indexBox = 0;
        let FinalTotal = [];
        let FinalQty = [];

        for (let x = 0; x < product.length; x++) {
            tempKuantitas = [];
            total = [];
            if (x === idxPesanan) {
                for (let i = 0; i < product[x].sales_order_details.length; i++) {
                    indexBox = 0;
                    total[i] = 0;

                    kuantitas = [];
                    if (i === indexPO) {
                        for (let a = 1; a < data[x][i].length; a++) {
                            for (let b = 1; b < data[x][i][a].length; b++) {
                                if (data[x][i][a][b].value != 0) {
                                    kuantitas.push([data[x][i][a][b].value]);
                                    total[i] = Number(total[i]) + Number(1);
                                }
                            }
                        }
                    }
                    else {
                        if (kuantitasBox[x][i] == 0 || kuantitasBox[x].length == 0) {
                            kuantitas.push([0]);
                        }
                        else {
                            let tampung = [];
                            for (let b = 0; b < kuantitasBox[x][i].length; b++) {
                                kuantitas.push(kuantitasBox[x][i][b]);
                            }

                        }
                        total[i] = totalBox[x][i];
                    }
                    tempKuantitas.push(kuantitas);
                }

            }
            else {
                kuantitas = [];
                for (let i = 0; i < product[x].sales_order_details.length; i++) {
                    if (kuantitasBox[x][i] == 0 || kuantitasBox[x].length == 0) {
                        kuantitas.push([0]);
                    }
                    else {
                        tempKuantitas.push(kuantitasBox[x][i]);
                    }
                    total.push(totalBox[x][i]);
                }
            }

            arrKuantitas.push(tempKuantitas);
            arrTotal.push(total);
        }
        setTotalBox(arrTotal);
        setKuantitasBox(arrKuantitas);
    };

    const onContextMenu = (e, cell, i, j) =>
        cell.readOnly ? e.preventDefault() : null;

    function klikTambahBaris() {
        console.log(indexPO)
        console.log(data)
        let hasilData = [];
        let tmpData = [];
        for (let x = 0; x < product.length; x++) {
            if (x === idxPesanan) {
                for (let i = 0; i < product[x].sales_order_details.length; i++) {
                    if (i === indexPO) {
                        let pushData = [];
                        let defaultData = [
                            { readOnly: true, value: data[x][i].length },
                            { value: '' },
                            { value: '' },
                            { value: '' },
                            { value: '' },
                            { value: '' },
                            { value: '' },
                            { value: '' },
                            { value: '' },
                            { value: '' },
                            { value: '' }
                        ]
                        pushData.push(...data[x][i], defaultData)
                        hasilData.push(pushData);
                    }
                    else {
                        hasilData.push(data[x][i]);
                    }
                }
                tmpData.push(hasilData);
            }
            else {
                tmpData.push(data[x]);
            }
        }
        console.log(tmpData);
        setData(tmpData);
    }

    function klikHapusBaris() {
        // setLoadingSpreadSheet(true);
        let hasilData = [];
        let tmpData = [];
        for (let x = 0; x < product.length; x++) {
            if (x === idxPesanan) {
                for (let i = 0; i < product[x].sales_order_details.length; i++) {
                    if (i === indexPO) {
                        data[x][i].splice(data[x][i].length - 1, 1);
                        hasilData.push(data[x][i]);
                    }
                    else {
                        hasilData.push(data[x][i]);
                    }
                }
                tmpData.push(hasilData);
            }
            else {
                tmpData.push(data[x]);
            }
        }
        console.log(tmpData);
        setData(tmpData);
    }

    function simpanTallySheet(i) {
        let tmp = [];
        let arrtmp = [];
        let stts = [];
        let arrStatus = []
        let qtySO = product[idxPesanan].sales_order_details[i].quantity;
        let qtySebelumnya = product[idxPesanan].sales_order_details[i].tally_sheets_qty;

        // for (let x = 0; x < product.length; x++) {
        //     for (let i = 0; i < product[x].sales_order_details.length; i++) {

        //     }
        // }

        for (let x = 0; x < product.length; x++) {
            tmp = [];
            if (x == idxPesanan) {
                for (let i = 0; i < product[x].sales_order_details.length; i++) {
                    if (i === indexPO) {
                        tmp[i] = 0;
                        tmp[i] = totalTallySheet[x][i];

                        if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) >= qtySO) {
                            stts[i] = 'Done'
                        }
                        else if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) < qtySO) {
                            stts[i] = 'Next Delivery'
                        }
                    }
                    else {
                        tmp[i] = quantity[x][i];
                        stts[i] = statusSO[x][i];
                    }
                }
                arrtmp.push(tmp);
                arrStatus.push(stts);
            }
            else {
                arrtmp.push(quantity[x]);
                arrStatus.push(statusSO[x]);
            }
        }
        console.log(arrStatus)
        setQuantity(arrtmp);
        setStatusSO(arrStatus);
        setModal2Visible2(false)
    }

    function hapusIndexProduct(i, idx) {
        setLoadingTable(true);
        if (i >= 0) {
            if (product[idx].sales_order_details.length == 1) {
                product.splice(idx, 1);
            }
            product[idx].sales_order_details.splice(i, 1);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil dihapus',
            }).then(() => setLoadingTable(false));
        }
    }

    function tambahIndexProduct(i, idx) {
        setLoadingTable(true);
        const oldArray = product[idx].sales_order_details;
        const newArray = product[idx].sales_order_details[i];
        let arr = [];

        for (let r = 0; r <= oldArray.length; r++) {
            if (r == i + 1) {
                arr.push(newArray)
            } else if (r == oldArray.length) {
                arr.push(oldArray[r - 1])
            }
            else {
                arr.push(oldArray[r])
            }
        }

        let tmp = [];
        let qty = [];
        let box = [];
        let qtyBox = [];
        let temp = [];
        let id = [];
        let value = [];
        let qtyPes = [];
        let status = [];
        let qtyBox_tmp = [];
        let qtyStore = [];
        let boxStore = [];
        let tempData = [];
        let idStore = [];
        let valueStore = [];
        let statusStore = [];
        let temp_qtyBox = [];
        let qtyPesStore = [];


        for (let x = 0; x < product.length; x++) {
            if (x == idx) {
                for (let y = 0; y <= product[x].sales_order_details.length; y++) {
                    if (y == i + 1) {
                        console.log(qtyPesanan[x][i]);
                        console.log(quantity[x][i]);
                        qtyStore.push(0)
                        boxStore.push(0)
                        idStore.push("")
                        valueStore.push("")
                        temp_qtyBox.push(0)
                        if (quantity[x][i] + product[x].sales_order_details[i].tally_sheets_qty >= product[x].sales_order_details[i].quantity) {
                            statusStore.push('Done')
                        }
                        else if (quantity[x][i] + product[x].sales_order_details[i].tally_sheets_qty < product[x].sales_order_details[i].quantity) {
                            statusStore.push('Next Delivery')
                        }
                        // statusStore.push()
                        qtyPesStore.push(qtyPesanan[x][i] - quantity[x][i])
                        tempData.push([
                            [
                                { readOnly: true, value: "" },
                                { value: "A", readOnly: true },
                                { value: "B", readOnly: true },
                                { value: "C", readOnly: true },
                                { value: "D", readOnly: true },
                                { value: "E", readOnly: true },
                                { value: "F", readOnly: true },
                                { value: "G", readOnly: true },
                                { value: "H", readOnly: true },
                                { value: "I", readOnly: true },
                                { value: "J", readOnly: true },
                            ],
                            [
                                { readOnly: true, value: 1 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 2 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 3 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 4 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 5 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 6 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 7 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 8 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 9 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 10 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ]
                        ]);
                    } else if (y == oldArray.length) {
                        qtyStore.push(quantity[x][y - 1])
                        boxStore.push(totalBox[x][y - 1])
                        tempData.push(data[x][y - 1])
                        valueStore.push(selectedValue3[x][y - 1])
                        idStore.push(productSelect[x][y - 1])
                        statusStore.push(statusSO[x][y - 1])
                        qtyPesStore.push(qtyPesanan[x][y - 1])
                        temp_qtyBox.push(kuantitasBox[x][y - 1])
                    }
                    else {
                        qtyStore.push(quantity[x][y])
                        boxStore.push(totalBox[x][y])
                        qtyPesStore.push(qtyPesanan[x][y])
                        tempData.push(data[x][y])
                        valueStore.push(selectedValue3[x][y])
                        idStore.push(productSelect[x][y])
                        statusStore.push(statusSO[x][y])
                        temp_qtyBox.push(kuantitasBox[x][y])
                    }
                }
                qty.push(qtyStore)
                box.push(boxStore)
                temp.push(tempData)
                qtyPes.push(qtyPesStore)
                id.push(idStore)
                value.push(valueStore)
                status.push(statusStore)
                qtyBox_tmp.push(temp_qtyBox)
                tmp.push({
                    code: product[x].code,
                    created_at: product[x].created_at,
                    customer: product[x].customer,
                    customer_id: product[x].customer_id,
                    date: product[x].date,
                    discount: product[x].discount,
                    done_at: product[x].done_at,
                    done_by: product[x].done_by,
                    drafted_by: product[x].drafted_by,
                    id: product[x].id,
                    last_edited_at: product[x].last_edited_at,
                    last_edited_by: product[x].last_edited_by,
                    notes: product[x].notes,
                    ppn: product[x].ppn,
                    reference: product[x].reference,
                    sales_order_details: arr,
                    status: product[x].status,
                    submitted_at: product[x].submitted_at,
                    submitted_by: product[x].submitted_by,
                    subtotal: product[x].subtotal,
                    tax_included: product[x].tax_included,
                    total: product[x].total,
                    updated_at: product[x].updated_at,
                })
            } else {
                tmp.push(product[x])
                qty.push(quantity[x])
                box.push(totalBox[x])
                temp.push(data[x])
                id.push(productSelect[x])
                value.push(selectedValue3[x])
                status.push(statusSO[x])
                qtyPes.push(qtyPesanan[x])
                qtyBox_tmp.push(kuantitasBox[x])
            }
        }
        setQuantity(qty)
        setTotalBox(box)
        setData(temp)
        setSelectedProduct(value)
        setProductSelect(id)
        setStatusSO(status)
        setKuantitasBox(qtyBox_tmp)
        console.log(qtyBox_tmp);
        console.log(statusSO);
        setQtyPesanan(qtyPes)
        setProduct(tmp)
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data berhasil ditambah',
        }).then(() => setLoadingTable(false));
    }

    function klikTampilSheet(indexProduct, indexPO) {
        console.log(indexProduct)
        // setQtyPesanan(product[indexProduct].sales_order_details[indexPO].quantity)
        setIndexPO(indexPO);
        setIdxPesanan(indexProduct);
        setProductPO(product[indexProduct].sales_order_details);
        setModal2Visible2(true);
    }

    const expandedRowRender = (record) => {
        const columns = [
            {
                title: 'Nama Alias Produk',
                dataIndex: 'product_alias_name',
                width: '18%',
                key: 'product_alias_name',
            },
            {
                title: 'Nama Produk',
                dataIndex: 'product_name',
                width: '20%',
                key: 'product_name',
                // editable: true,
            },
            {
                title: 'Qty',
                dataIndex: 'quantity',
                width: '5%',
                align: 'center',
                // editable: true,
            },
            {
                title: 'Stn',
                dataIndex: 'unit',
                align: 'center',
                width: '5%',
                key: 'name',
            },
            {
                title: 'Box',
                dataIndex: 'box',
                align: 'center',
                width: '5%',
                key: 'box',

            },
            {
                title: 'Status',
                dataIndex: 'status',
                align: 'center',
                width: '10%',
                key: 'box',

            },
            {
                title: 'Action',
                dataIndex: 'action',
                align: 'center',
                width: '10%',
                key: 'operation',
            },
        ];

        const dataPurchase =
            [...product[record.key].sales_order_details.map((item, i) => ({
                // product_alias_name: item.product_alias_name,
                // key: [record.key]
                product_alias_name: item.product_alias_name,
                product_name: <>
                    <AsyncSelect
                        placeholder="Pilih Produk..."
                        cacheOptions
                        defaultOptions
                        value={selectedValue3[record.key][i]}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        loadOptions={loadOptionsProduct}
                        onChange={(value) => handleChangeProduct(value, record.key, i)}
                    />
                </>,
                quantity: quantity[record.key][i],
                unit: item.unit,
                box:
                    <>
                        <a onClick={() => klikTampilSheet(record.key, i)}>
                            {totalBox[record.key][i]}
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
                                    onClick={() => simpanTallySheet(indexPO)}
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
                                                <input
                                                    value={product[idxPesanan].code}
                                                    type="Nama"
                                                    className="form-control"
                                                    id="inputNama3"
                                                    disabled
                                                />
                                            </div>
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Pesanan</label>
                                            <div className="col-sm-3">
                                                <input
                                                    value={qtyPesanan[idxPesanan][indexPO]}
                                                    type="Nama"
                                                    className="form-control"
                                                    id="inputNama3"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-1 mt-2">
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Produk</label>
                                            <div className="col-sm-3">
                                                <input
                                                    value={selectedValue3[idxPesanan][indexPO] == ""? "" : selectedValue3[idxPesanan][indexPO].name}
                                                    type="Nama"
                                                    className="form-control"
                                                    id="inputNama3"
                                                    disabled
                                                />

                                            </div>
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                            <div className="col-sm-3">
                                                <input
                                                    value={totalTallySheet[idxPesanan][indexPO]}
                                                    type="Nama"
                                                    className="form-control"
                                                    id="inputNama3"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-10" style={{ overflowY: "scroll", height: "300px", display: loadingSpreedSheet ? "none" : 'block' }}>
                                        <ReactDataSheet
                                            data={data[idxPesanan][indexPO]}
                                            valueRenderer={valueRenderer}
                                            onCellsChanged={onCellsChanged}
                                            onContextMenu={onContextMenu}
                                        />
                                    </div>
                                    <div className='mt-2 d-flex'>
                                        <Button
                                            size='small'
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => klikTambahBaris()}
                                        />
                                        <Button
                                            className='ms-2'
                                            size='small'
                                            type="danger"
                                            icon={<MinusOutlined />}
                                            onClick={() => klikHapusBaris()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </>,
                status: statusSO[record.key][i] == '' ? <Tag color="red">Waiting</Tag> : statusSO[record.key][i] === 'Next Delivery' ? <Tag color="orange">{statusSO[record.key][i]}</Tag> : statusSO[record.key][i] === 'Done' ? <Tag color="green">{statusSO[record.key][i]}</Tag> : null,
                action:
                    <Space size="middle">
                        <Button
                            size='small'
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => hapusIndexProduct(i, record.key)}
                        />
                        <Button
                            size='small'
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => tambahIndexProduct(i, record.key)}
                        />
                    </Space>,
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

    const defaultColumns = [
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
    ];

    const mainDataSource =
        [...product.map((item, i) => ({
            key: i,
            code: item.code,
            status: item.status,
        }))

        ]

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setCustomer(value.id);
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

    const handleChangeWarehouse = (value) => {
        setSelectedWarehouse(value);
        setWarehouse(value.id);
    };
    // load options using API call
    const loadOptionsWarehouse = (inputValue) => {
        return fetch(`${Url}/select_warehouses?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    const handleChangeProduct = (value, record, idx) => {
        // console.log(selectedValue3)
        let idKey = [];
        let key = [];
        let store = [];
        let store2 = [];
        console.log(value);

        for (let x = 0; x < data.length; x++) {
            if (x == record) {
                for (let y = 0; y < data[x].length; y++) {
                    if (y == idx) {
                        idKey.push(value.id)
                        store.push(value)
                    } else {
                        idKey.push(productSelect[x][y])
                        store.push(selectedValue3[x][y])
                    }
                }
                key.push(idKey)
                store2.push(store)
            } else {
                key.push(productSelect[x])
                store2.push(selectedValue3[x])
            }
        }
        setSelectedProduct(store2);
        setProductSelect(key);
        console.log(store2)
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
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_sales_orders?kode=${query}&id_pelanggan=${customer}&status=Submitted`, {
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
    }, [query, customer])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Transaksi',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: 'Pelanggan',
            dataIndex: 'customer',
            width: '15%',
            align: 'center',
            render: (customer) => customer.name
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
        let arrData = [];
        let arrBox = [];
        let arrqty = []
        let arrKuantitas = [];
        let arrStatus = [];
        let arrQtyPesanan = [];

        if (event.target.checked) {
            updatedList = [...product, event.target.value];

            // tambah data pas di checked 
            let idValues = [];
            let valuesId = [];
            let status_tmp = [];
            if (data.length == 0) {

                for (let i = 0; i < updatedList.length; i++) {
                    let tempData = [];
                    let tempKuantitas = [];
                    let qty = [];
                    let tempBox = [];
                    let stts = [];
                    let qtyPesanan = [];

                    let values = [];
                    let id = [];

                    for (let x = 0; x < updatedList[i].sales_order_details.length; x++) {
                        tempData.push([
                            [
                                { readOnly: true, value: "" },
                                { value: "A", readOnly: true },
                                { value: "B", readOnly: true },
                                { value: "C", readOnly: true },
                                { value: "D", readOnly: true },
                                { value: "E", readOnly: true },
                                { value: "F", readOnly: true },
                                { value: "G", readOnly: true },
                                { value: "H", readOnly: true },
                                { value: "I", readOnly: true },
                                { value: "J", readOnly: true },
                            ],
                            [
                                { readOnly: true, value: 1 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 2 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 3 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 4 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 5 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 6 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 7 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 8 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 9 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ],
                            [
                                { readOnly: true, value: 10 },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                                { value: '' },
                            ]
                        ]);
                        if (updatedList[i].sales_order_details[x].tally_sheets_qty >= updatedList[i].sales_order_details[x].quantity) {
                            stts.push('Done')
                        }
                        else if (updatedList[i].sales_order_details[x].tally_sheets_qty < updatedList[i].sales_order_details[x].quantity) {
                            stts.push('Next Delivery')
                        }
                        tempKuantitas.push(0);
                        qty.push(0);
                        tempBox.push(0);
                        values.push("")
                        id.push("")
                        qtyPesanan.push(updatedList[i].sales_order_details[x].quantity)
                    }
                    arrStatus.push(stts);
                    // console.log(arrStatus);
                    arrData.push(tempData);
                    arrKuantitas[i] = tempKuantitas;
                    arrqty[i] = qty;
                    arrBox[i] = tempBox;
                    idValues.push(values)
                    arrQtyPesanan.push(qtyPesanan)
                    // console.log(idValues);
                    valuesId.push(id)
                }
            }
            else {
                for (let i = 0; i < updatedList.length; i++) {
                    let tempKuantitas = [];
                    let tempValues = [];
                    let tempId = [];
                    let tempStatus = [];
                    let tempQtyPesanan = [];
                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < updatedList[i].sales_order_details.length; x++) {
                            tempKuantitas.push(0);
                            tempValues.push("");
                            tempId.push("");
                            tempStatus.push("");
                            tempQtyPesanan.push(updatedList[i].sales_order_details[x].quantity)
                        }
                        arrKuantitas[i] = tempKuantitas;
                        idValues.push(tempValues)
                        valuesId.push(tempId)
                        arrStatus.push(tempStatus)
                        arrQtyPesanan.push(tempQtyPesanan)
                    }
                    else {
                        arrKuantitas[i] = kuantitasBox[i]
                        idValues.push(selectedValue3[i])
                        valuesId.push(productSelect[i])
                        arrStatus.push(statusSO[i])
                        arrQtyPesanan.push(qtyPesanan[i])
                    }
                }

                for (let i = 0; i < updatedList.length; i++) {
                    let qty = [];
                    let tempBox = [];
                    let tempStts = [];
                    let tempQty = [];
                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < updatedList[i].sales_order_details.length; x++) {
                            qty.push(0);
                            tempBox.push(0);
                            tempStts.push("");
                        }
                        arrqty[i] = qty;
                        arrBox[i] = tempBox;
                        arrStatus[i] = tempStts;
                    }
                    else {
                        arrBox[i] = totalBox[i];
                        arrqty[i] = quantity[i]
                        arrStatus[i] = statusSO[i];
                    }
                }

                for (let i = 0; i < updatedList.length; i++) {
                    let tempData = [];
                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < updatedList[i].sales_order_details.length; x++) {
                            tempData[x] = [
                                [
                                    { readOnly: true, value: "" },
                                    { value: "A", readOnly: true },
                                    { value: "B", readOnly: true },
                                    { value: "C", readOnly: true },
                                    { value: "D", readOnly: true },
                                    { value: "E", readOnly: true },
                                    { value: "F", readOnly: true },
                                    { value: "G", readOnly: true },
                                    { value: "H", readOnly: true },
                                    { value: "I", readOnly: true },
                                    { value: "J", readOnly: true },
                                ],
                                [
                                    { readOnly: true, value: 1 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 2 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 3 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 4 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 5 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 6 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 7 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 8 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 9 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ],
                                [
                                    { readOnly: true, value: 10 },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                    { value: '' },
                                ]
                            ];
                        }

                        arrData[i] = tempData;
                    }
                    else {
                        arrData[i] = data[i];
                    }

                }

            }
            setKuantitasBox(arrKuantitas);
            setData(arrData);
            setTotalBox(arrBox);
            setQuantity(arrqty);
            setQtyPesanan(arrQtyPesanan);
            setStatusSO(arrStatus)
            setGetDataDetailSO(updatedList.map(d => d.sales_order_details))
            setSelectedProduct(idValues)
            setProductSelect(valuesId)
            console.log(arrQtyPesanan);
        }
        else {

            console.log(data);
            console.log(data.length)
            console.log("proses")
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i] == event.target.value) {
                    updatedList.splice(i, 1);
                    kuantitasBox.splice(i, 1);
                    data.splice(i, 1);
                    totalBox.splice(i, 1);
                    quantity.splice(i, 1);
                    statusSO.splice(i, 1);
                    qtyPesanan.splice(i, 1);
                }
            }

            console.log(statusSO);
            console.log(data.length)
            setIdxPesanan(0)
            console.log(updatedList)
            setGetDataDetailSO(updatedList.map(d => d.sales_order_details))

        }
        setProduct(updatedList);
    };

    // const getNewCodeTally = async () => {
    //     await axios.get(`${Url}/get_new_tally_sheet_code/sales_orders?tanggal=${date}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     })
    //         .then((res) => {
    //             setGetCode(res.data.data);
    //             console.log(res.data.data)
    //         })
    //         .catch((err) => {
    //             // Jika Gagal
    //             console.log(err);
    //         });
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("gudang", warehouse);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        product.map((p, pi) => {
            p.sales_order_details.map((po, i) => {
                userData.append("id_pesanan_penjualan[]", p.id);
                userData.append("id_produk[]", productSelect[pi][i]);
                userData.append("aksi[]", statusSO[pi][i]);
                userData.append("jumlah_box[]", totalBox[pi][i]);
                userData.append("satuan_box[]", po.unit);
                userData.append("kuantitas_product_box[]", totalTallySheet[pi][i]);
            })
        });
        let key = 0;
        for (let idx = 0; idx < kuantitasBox.length; idx++) {
            for (let x = 0; x < kuantitasBox[idx].length; x++) {
                for (let y = 0; y < kuantitasBox[idx][x].length; y++) {
                    userData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + y + "]", kuantitasBox[idx][x][y])
                }
                key++;
            }
        }

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/tally_sheets`,
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
                navigate("/tally");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.error,
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
        userData.append("tanggal", date);
        userData.append("gudang", warehouse);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        product.map((p, pi) => {
            p.sales_order_details.map((po, i) => {
                userData.append("id_pesanan_penjualan[]", p.id);
                userData.append("id_produk[]", productSelect[pi][i]);
                userData.append("aksi[]", statusSO[pi][i]);
                userData.append("jumlah_box[]", totalBox[pi][i]);
                userData.append("satuan_box[]", po.unit);
                userData.append("kuantitas_product_box[]", totalTallySheet[pi][i]);
            })
        });
        let key = 0;
        for (let idx = 0; idx < kuantitasBox.length; idx++) {
            for (let x = 0; x < kuantitasBox[idx].length; x++) {
                for (let y = 0; y < kuantitasBox[idx][x].length; y++) {
                    userData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + y + "]", kuantitasBox[idx][x][y])
                }
                key++;
            }
        }

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/tally_sheets`,
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
                navigate("/tally");
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
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Buat Tally Sheet"
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
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                <input
                                    value="Otomatis"
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Gudang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue2}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsWarehouse}
                                    onChange={handleChangeWarehouse}
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
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                title="Daftar Pesanan"
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModal2Visible(true)}
                    />,
                    <Modal
                        title="Tambah Produk"
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
                    </Modal>,
                ]}
            >
                <Table
                    bordered
                    pagination={false}
                    dataSource={mainDataSource}
                    expandable={{ expandedRowRender }}
                    columns={defaultColumns}
                    onChange={(e) => setProduct(e.target.value)}
                />

                <div className="btn-group mt-2" role="group" aria-label="Basic mixed styles example">
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
            </PageHeader>
        </>
    )
}

export default BuatTally