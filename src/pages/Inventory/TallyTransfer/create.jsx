import './form.css';
import React from "react";
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tabs, Tag } from 'antd'
import { ConsoleSqlOutlined, DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactDataSheet from 'react-datasheet';
import { useSelector } from 'react-redux';
import "react-datasheet/lib/react-datasheet.css";
import { CreateOutlined } from '@material-ui/icons';
import { update } from 'lodash';
import { array } from 'yup';
import { PageHeader } from 'antd';


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

const CreateTallyTransfer = () => {

    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [sumber, setSumber] = useState('PO');
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [supplier, setSupplier] = useState("");
    const [customer, setCustomer] = useState("");
    const [warehouse, setWarehouse] = useState("");
    const [product, setProduct] = useState([]);
    const [productSelect, setProductSelect] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const [productName, setProductName] = useState()
    const [statusPO, setStatusPO] = useState([])
    // const []
    // const [tampilCek, setTampilCek]  = useState(true)
    const [quantityPO, setQuantityPO] = useState()

    const [getDataProduct, setGetDataProduct] = useState([]);
    const [getDataFaktur, setGetDataFaktur] = useState([]);
    const [getDataRetur, setGetDataRetur] = useState([]);
    const [getDataDetailPO, setGetDataDetailPO] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState(false);
    const [count, setCount] = useState(0);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
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
    const [indexPO, setIndexPO] = useState(0);
    const [kuantitasBox, setKuantitasBox] = useState([]);
    const [idxPesanan, setIdxPesanan] = useState(0);

    const [modalListImpor, setModalListImpor] = useState(false);
    const [modalListLokal, setModalListLokal] = useState(false)
    const [modalListRetur, setModalListRetur] = useState(false)
    const [grup, setGrup] = useState()
    // const [checked, setChecked] = useState(false)¿



    useEffect(() => {
        let arrTotal = [];
        let total = [];

        for (let x = 0; x < product.length; x++) {
            total = [];
            let dataProduk;
            if (sumber == 'PO') {
                dataProduk = product[x].goods_request_details;
            }

            for (let i = 0; i < dataProduk.length; i++) {
                total[i] = 0;
                for (let a = 1; a < data[x][i].length; a++) {
                    for (let b = 1; b < data[x][i][a].length; b++) {
                        if (data[x][i][a][b].value != 0) {
                            total[i] = Number(total[i]) + Number(data[x][i][a][b].value.replace(',', '.'));

                        }
                    }
                }
            }
            arrTotal[x] = total;
        }
        setTotalTallySheet(arrTotal);

        let arrStatus = []
        for (let x = 0; x < product.length; x++) {
            let dataProduk;
            if (sumber == 'PO') {
                dataProduk = product[x].goods_request_details;
            }

            let stts = []
            for (let i = 0; i < dataProduk.length; i++) {
                // status 
                let qtyPO = dataProduk[i].quantity;
                let qtySebelumnya = dataProduk[i].tally_sheets_qty;
                console.log(qtySebelumnya)
                if (Number(arrTotal[x][i]) + Number(qtySebelumnya) >= qtyPO) {
                    stts.push('Done')
                }
                else if (Number(arrTotal[x][i]) + Number(qtySebelumnya) < qtyPO) {
                    stts.push('Next delivery')
                }

            }
            // console.log(stts)
            arrStatus.push(stts);
        }
        // console.log(arrStatus)
        setStatusPO(arrStatus)
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
            let dataProduk;
            if (sumber == 'PO') {
                dataProduk = product[x].goods_request_details;
            }


            for (let i = 0; i < dataProduk.length; i++) {
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
            let dataProduk;
            if (sumber == 'PO') {
                dataProduk = product[x].goods_request_details;
            }

            if (x === idxPesanan) {
                for (let i = 0; i < dataProduk.length; i++) {
                    indexBox = 0;
                    total[i] = 0;

                    kuantitas = [];
                    if (i === indexPO) {
                        for (let a = 1; a < data[x][i].length; a++) {
                            for (let b = 1; b < data[x][i][a].length; b++) {
                                if (data[x][i][a][b].value != 0) {
                                    // kuantitas.push([data[x][i][a][b].value.replace(',', '.')]);
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
                for (let i = 0; i < dataProduk.length; i++) {
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
        let hasilData = [];
        let tmpData = [];
        for (let x = 0; x < product.length; x++) {
            if (x === idxPesanan) {
                for (let i = 0; i < product[x].goods_request_details.length; i++) {
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

        setData(tmpData);
    }

    function klikHapusBaris() {
        // setLoadingSpreadSheet(true);
        let hasilData = [];
        let tmpData = [];
        for (let x = 0; x < product.length; x++) {
            if (x === idxPesanan) {
                for (let i = 0; i < product[x].goods_request_details.length; i++) {

                    if (i === indexPO) {
                        if (data[x][i].length - 2 > 0) {
                            data[x][i].splice(data[x][i].length - 1, 1);
                            hasilData.push(data[x][i]);
                        }
                        else {
                            hasilData.push(data[x][i]);
                        }

                    }
                    else {
                        hasilData.push(data[x][i]);
                    }
                    tmpData.push(hasilData);

                }
            }
            else {
                tmpData.push(data[x]);
            }
        }


        setData(tmpData);

    }


    function simpanTallySheet(i) {
        let tmp = [];
        let arrtmp = [];
        let stts = [];
        let arrStatus = []
        let dataProduk;
        if (sumber == 'PO') {
            dataProduk = product[idxPesanan].goods_request_details;
        }


        let qtyPO = dataProduk[i].quantity;
        let qtySebelumnya = dataProduk[i].tally_sheets_qty;

        for (let x = 0; x < product.length; x++) {
            tmp = [];
            if (x == idxPesanan) {
                for (let i = 0; i < dataProduk.length; i++) {
                    if (i === indexPO) {
                        tmp[i] = 0;
                        tmp[i] = totalTallySheet[x][i];

                        if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) >= qtyPO) {
                            stts[i] = 'Done'
                        }
                        else if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) < qtyPO) {
                            stts[i] = 'Next delivery'
                        }
                    }
                    else {
                        tmp[i] = quantity[x][i];
                        stts[i] = statusPO[x][i]
                    }
                }
                arrtmp.push(tmp);
                arrStatus.push(stts)
            }
            else {
                arrtmp.push(quantity[x]);
                arrStatus.push(statusPO[x])
            }
        }

        setQuantity(arrtmp);
        setStatusPO(arrStatus);
        setModal2Visible2(false)
    }

    function hapusIndexProduct(i, idx) {
        setLoadingTable(true)

        // console.log(getDataProduct)

        for (let x = 0; x < product.length; x++) {
            let dataDetail;
            if (sumber == 'PO') {
                dataDetail = product[x].goods_request_details;
            }


            for (let y = 0; y < dataDetail.length; y++) {
                if (x == i && y == idx) {

                    if (dataDetail.length == 1) {

                        // pengecekan centang 
                        if (sumber == 'PO') {
                            // hapus cek 
                            let tmp = [];
                            for (let j = 0; j < getDataProduct.length; j++) {
                                if (getDataProduct[j].detail.code == product[x].code) {
                                    tmp.push({
                                        detail: getDataProduct[j].detail,
                                        statusCek: false
                                    })
                                }
                                else {
                                    tmp.push(getDataProduct[j])
                                }
                            }
                            setGetDataProduct(tmp)
                        }

                        // hapus data 
                        data.splice(x, 1)
                        quantity.splice(x, 1)
                        totalBox.splice(x, 1)
                        product.splice(x, 1);
                        statusPO.splice(x, 1)

                        setIndexPO(0)
                        setIdxPesanan(0)
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Data berhasil dihapus',
                        }).then(() => {
                            setLoadingTable(false)
                        });

                    }
                    else {
                        data[x].splice(y, 1)
                        statusPO[x].splice(y, 1)
                        quantity[x].splice(y, 1)
                        totalBox[x].splice(y, 1)
                        dataDetail.splice(y, 1);
                        setIndexPO(0)
                        setIdxPesanan(0)
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Data berhasil dihapus',
                        }).then(() => {
                            console.log(statusPO)
                            setLoadingTable(false)
                        });

                    }

                }
            }


        }


    }

    function klikTampilSheet(indexProduct, indexPO, productName, quantity, tally_sheets_qty) {
        // let hasilAkhirQtyPO = Number(quantity) - Number(tally_sheets_qty);
        setQuantityPO((Number(quantity) - Number(tally_sheets_qty)).toString().replace('.', ','))
        setProductName(productName)
        setIndexPO(indexPO);
        setIdxPesanan(indexProduct);if (sumber == 'PO') {
            setProductPO(product[indexProduct].goods_request_details);
        }

        setModal2Visible2(true);
    }

    const expandedRowRender = (record) => {
        const columns = [
            {
                title: 'Nama Produk',
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
            {
                title: 'Box',
                dataIndex: 'box',
                align: 'center',
                width: '10%',
                key: 'box',

            },
            {
                title: 'Status',
                dataIndex: 'status',
                align: 'center',
                width: '10%',
                key: 'status',

            },
            {
                title: 'Action',
                dataIndex: 'action',
                align: 'center',
                width: '10%',
                key: 'operation',
            },
        ];

        function forceDoneProduct(baris, kolom) {
            Swal.fire({
                title: 'Apakah Anda Yakin?',
                text: "Status akan diubah menjadi Done",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya'
            }).then((result) => {
                if (result.isConfirmed) {
                    let arrStatus = []
                    for (let x = 0; x < product.length; x++) {
                        let status = []

                        if (x == baris) {
                            for (let y = 0; y < product[x].goods_request_details.length; y++) {
                                if (y == kolom) {
                                    status.push('Done')
                                }
                                else {
                                    status.push(statusPO[x][y])
                                }
                            }
                            arrStatus.push(status)

                        }
                        else {
                            arrStatus.push(statusPO[x])

                        }

                    }
                    setStatusPO(arrStatus)
                }
            })
        }

        function forceNexDeliveryProduct(baris, kolom) {
            // console.log(quantity[baris][kolom])
            // console.log(product[baris].goods_request_details[kolom].tally_sheets_qty)
            let jumlahNow = Number(quantity[baris][kolom]) + Number(product[baris].goods_request_details[kolom].tally_sheets_qty);
            if (jumlahNow >= product[baris].goods_request_details[kolom].quantity) {
                Swal.fire(
                    "Tidak bisa mengubah status",
                    `Jumlah ini sudah melebihi jumlah pesanan`,
                    "error"
                )
            }
            else {
                Swal.fire({
                    title: 'Apakah Anda Yakin?',
                    text: "Status akan diubah menjadi Next Delivery",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ya'
                }).then((result) => {
                    if (result.isConfirmed) {
                        let arrStatus = []
                        for (let x = 0; x < product.length; x++) {
                            let status = []

                            if (x == baris) {
                                for (let y = 0; y < product[x].goods_request_details.length; y++) {
                                    if (y == kolom) {
                                        status.push('Next delivery')
                                    }
                                    else {
                                        status.push(statusPO[x][y])
                                    }
                                }
                                arrStatus.push(status)

                            }
                            else {
                                arrStatus.push(statusPO[x])

                            }

                        }
                        setStatusPO(arrStatus)
                    }
                })
            }

        }

        //  dataProdukTabel = []
        if (sumber == 'PO') {
            const dataProdukTabel =
                [...product[record.key].goods_request_details.map((item, i) => ({
                    product_name: item.product_name,
                    quantity: quantity[record.key][i].toFixed(2).replace('.', ','),
                    unit: item.unit,
                    status: statusPO[record.key][i] == '' ? <Tag color="red">Waiting</Tag> : statusPO[record.key][i] === 'Next delivery' ? <Tag color="orange" type="button" onClick={() => forceDoneProduct(record.key, i)}>{statusPO[record.key][i]}</Tag> : statusPO[record.key][i] === 'Done' ? <Tag color="green" type="button" onClick={() => forceNexDeliveryProduct(record.key, i)}>{statusPO[record.key][i]}</Tag> : null
                    ,
                    box:
                        <>
                            <a onClick={() => klikTampilSheet(record.key, i, item.product_name, item.quantity, item.tally_sheets_qty)}>
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
                                                <label htmlFor="inputNama3" className="col-sm-2 col-form-label">No. Tally Sheet</label>
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
                                                        value={quantityPO}
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
                                                        value={productName}
                                                        type="Nama"
                                                        className="form-control"
                                                        id="inputNama3"
                                                        disabled
                                                    />

                                                </div>
                                                <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                                <div className="col-sm-3">
                                                    <input
                                                        value={totalTallySheet[idxPesanan][indexPO].toFixed(2).replace('.', ',')}
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
                                            {
                                                data[idxPesanan][indexPO].length - 2 > 0 ?
                                                    <Button
                                                        className='ms-2'
                                                        size='small'
                                                        type="danger"
                                                        icon={<MinusOutlined />}
                                                        onClick={() => klikHapusBaris()}
                                                    /> :
                                                    <Button
                                                        disabled
                                                        className='ms-2'
                                                        size='small'
                                                        type="danger"
                                                        icon={<MinusOutlined />}
                                                        onClick={() => klikHapusBaris()}
                                                    />
                                            }

                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        </>,
                    action:
                        <Space size="middle">
                            <Button
                                size='small'
                                type="danger"
                                icon={<DeleteOutlined />}
                                onClick={() => hapusIndexProduct(record.key, i)}
                            />
                        </Space>,
                }))

                ];

            return <Table
                style={{ display: loadingTable ? "none" : 'block' }}
                columns={columns}
                dataSource={dataProdukTabel}
                pagination={false}
                isLoading={true}
                rowClassName={() => 'editable-row'}
            />;
        }



    };

    // 

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

    useEffect(() => {
        getNewCodeTally()
    }, [date])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheet_tf_available_goods_request?kode=${query}&id_pemasok=${supplier}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                tmp.push({
                    detail: res.data.data[i],
                    statusCek: false
                });
            }
            setGetDataProduct(tmp)

            // setGetDataProduct(res.data.data);
            // setGetDataDetailPO(res.data.data.map(d => d.goods_request_details))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplier])

    const handleCheck = (event, indexTransaksi) => {
        console.log(sumber,"ssss")
        let tmpDataBaru = [];

        // perubahan data dan status ceked 
        if (sumber == 'PO') {
            for (let i = 0; i < getDataProduct.length; i++) {
                if (i == indexTransaksi) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: !getDataProduct[i].statusCek
                    })
                }
                else {
                    tmpDataBaru.push(getDataProduct[i])
                }
            }
            setGetDataProduct(tmpDataBaru)
        }


        var updatedList = [...product];
        let arrData = [];
        let arrBox = [];
        let arrqty = []
        let arrKuantitas = [];
        let arrStatus = []

        // jika ceked 
        if (tmpDataBaru[indexTransaksi].statusCek) {
            updatedList = [...product, event.target.value.detail];

            // tambah data pas di checked ketika data masih 0
            if (data.length == 0) {
                for (let i = 0; i < updatedList.length; i++) {
                    let tempData = [];
                    let tempKuantitas = [];
                    let qty = [];
                    let stts = []
                    let tempBox = [];
                    let dataSumber = [];
                    if (sumber == 'PO') {
                        dataSumber = updatedList[i].goods_request_details;
                    }



                    for (let x = 0; x < dataSumber.length; x++) {
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
                        if (dataSumber[x].tally_sheets_qty >= dataSumber[x].quantity) {
                            stts.push('Done')
                        }
                        else if (dataSumber[x].tally_sheets_qty < dataSumber[x].quantity) {
                            stts.push('Next delivery')

                        }
                        tempKuantitas.push(0);
                        qty.push(0);
                        tempBox.push(0);
                    }
                    arrStatus.push(stts)
                    arrData.push(tempData);
                    arrKuantitas[i] = tempKuantitas;
                    arrqty[i] = qty;
                    arrBox[i] = tempBox;
                }
            }
            else {

                // setting data 
                for (let i = 0; i < updatedList.length; i++) {
                    let tempData = [];
                    let dataSumber = [];
                    if (sumber == 'PO') {
                        dataSumber = updatedList[i].goods_request_details;
                    }

                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < dataSumber.length; x++) {
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

                // memasukkan ulang kuantitas box 
                for (let i = 0; i < updatedList.length; i++) {
                    let tempKuantitas = [];
                    let dataSumber = [];
                    if (sumber == 'PO') {
                        dataSumber = updatedList[i].goods_request_details;
                    }

                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < dataSumber.length; x++) {
                            tempKuantitas.push(0);
                        }
                        arrKuantitas[i] = tempKuantitas;
                    }
                    else {
                        arrKuantitas[i] = kuantitasBox[i]
                    }
                }

                // memasukkan jumlah box, dan jumlah keseluruhan box || status
                for (let i = 0; i < updatedList.length; i++) {
                    let qty = [];
                    let tempBox = [];
                    let stts = [];
                    let dataSumber = [];
                    if (sumber == 'PO') {
                        dataSumber = updatedList[i].goods_request_details;
                    }
                    // ini jika data yang bertambah 
                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < dataSumber.length; x++) {
                            qty.push(0);
                            tempBox.push(0);
                            stts.push('Next delivery')
                        }
                        arrStatus[i] = stts;
                        arrqty[i] = qty;
                        arrBox[i] = tempBox;
                    }
                    else {
                        arrStatus[i] = statusPO[i];
                        arrBox[i] = totalBox[i];
                        arrqty[i] = quantity[i]
                    }
                }



            }


            // cek status done dari awal 
            for (let i = 0; i < updatedList.length; i++) {
                let dataSumber = [];
                if (sumber == 'PO') {
                    dataSumber = updatedList[i].goods_request_details;
                }
                for (let x = 0; x < dataSumber.length; x++) {
                    if (dataSumber[x].tally_sheets_qty >= dataSumber[x].quantity) {
                        arrKuantitas[i].splice(x, 1);
                        arrData[i].splice(x, 1);
                        arrBox[i].splice(x, 1);
                        arrStatus[i].splice(x, 1);
                        arrqty[i].splice(x, 1);
                        dataSumber.splice(x, 1);

                    }
                }
            }

            console.log(arrData)
            setKuantitasBox(arrKuantitas);
            setData(arrData);
            setTotalBox(arrBox);
            setStatusPO(arrStatus);
            setQuantity(arrqty);
            setGetDataDetailPO(updatedList.map(d => d.goods_request_details))

        }
        else {
            for (let i = 0; i < updatedList.length; i++) {
                if (updatedList[i] == event.target.value.detail) {
                    updatedList.splice(i, 1);
                    kuantitasBox.splice(i, 1);
                    data.splice(i, 1);
                    statusPO.splice(i, 1);
                    totalBox.splice(i, 1);
                    quantity.splice(i, 1);
                }
            }
            setIdxPesanan(0)
            setGetDataDetailPO(updatedList.map(d => d.goods_request_details))

        }
        setProduct(updatedList);
    };

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Pesanan',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: 'Supplier',
            dataIndex: 'nama',
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
            dataIndex: 'action',
            width: '8%',
            align: 'center',
            // render: (_, record) => (
            //     <>
            //         <Checkbox
            //             // style={{ display: tampilCek ? "block" : "none"}}
            //             value={record}
            //             onChange={handleCheck}
            //         />
            //     </>
            // )
        },
    ];

    const columnDataPO =
        [...getDataProduct.map((item, i) => ({
            code: item.detail.code,
            nama: item.detail.code,
            notes: item.detail.notes,
            action:
                <>
                    <Checkbox
                        // style={{ display: tampilCek ? "block" : "none"}}
                        value={item}
                        checked={item.statusCek}
                        onChange={(e) => handleCheck(e, i)}
                    />
                </>
        }))

        ]
    const getNewCodeTally = async () => {
        await axios.get(`${Url}/get_new_tally_sheet_draft_code/purchase_orders?tanggal=${date}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tallySheetData = new FormData();
        tallySheetData.append("tanggal", date);
        // tallySheetData.append("pemasok", supplier);
        tallySheetData.append("gudang", warehouse);
        tallySheetData.append("catatan", description);
        tallySheetData.append("status", "Submitted");
        if (sumber == 'PO') {
            product.map((p, pi) => {
                p.goods_request_details.map((po, i) => {
                    tallySheetData.append("id_pesanan_pembelian[]", p.id);
                    tallySheetData.append("id_produk[]", po.product_id);
                    tallySheetData.append("jumlah_box[]", totalBox[pi][i]);
                    tallySheetData.append("aksi[]", statusPO[pi][i]);
                    tallySheetData.append("satuan_box[]", po.unit);
                    tallySheetData.append("kuantitas_box[]", totalTallySheet[pi][i]);

                })
            });
        }

        let key = 0;
        for (let idx = 0; idx < kuantitasBox.length; idx++) {
            for (let x = 0; x < kuantitasBox[idx].length; x++) {
                for (let y = 0; y < kuantitasBox[idx][x].length; y++) {
                    tallySheetData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + y + "]", kuantitasBox[idx][x][y].toString().replace(',', '.'))

                }
                key++;
            }
        }
        axios({
            method: "post",
            url: `${Url}/tally_sheet_ins`,
            data: tallySheetData,
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
                navigate("/tallypembelian");
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
        const tallySheetData = new FormData();
        tallySheetData.append("tanggal", date);
        tallySheetData.append("gudang", warehouse);
        tallySheetData.append("catatan", description);
        tallySheetData.append("status", "Draft");
        if (sumber == 'PO') {
            product.map((p, pi) => {
                p.goods_request_details.map((po, i) => {
                    tallySheetData.append("id_pesanan_pembelian[]", p.id);
                    tallySheetData.append("id_produk[]", po.product_id);
                    tallySheetData.append("jumlah_box[]", totalBox[pi][i]);
                    tallySheetData.append("aksi[]", statusPO[pi][i]);
                    tallySheetData.append("satuan_box[]", po.unit);
                    tallySheetData.append("kuantitas_box[]", totalTallySheet[pi][i]);

                })
            });
        }

        let key = 0;
        for (let idx = 0; idx < kuantitasBox.length; idx++) {
            for (let x = 0; x < kuantitasBox[idx].length; x++) {
                for (let y = 0; y < kuantitasBox[idx][x].length; y++) {
                    tallySheetData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + y + "]", kuantitasBox[idx][x][y].toString().replace(',', '.'))

                }
                key++;
            }
        }


        axios({
            method: "post",
            url: `${Url}/tally_sheet_ins`,
            data: tallySheetData,
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
                navigate("/tallypembelian");
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
                title="Buat Tally Sheet">
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Gudang..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedWarehouse}
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
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Produk</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setModalListLokal(true)
                                }}
                            />
                            <Modal
                                title="Tambah Pesanan"
                                centered
                                visible={modalListLokal}
                                onCancel={() => setModalListLokal(false)}
                                width={1000}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Nomor Pesanan.."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={columnDataPO}
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

                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleDraft}
                        style={{ width: '100px' }}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onChange={(e) => setStatus(e.target.value)}
                        onClick={handleSubmit}
                        style={{ width: '100px' }}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        style={{ width: '100px' }}
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
        </>
    )
}

export default CreateTallyTransfer