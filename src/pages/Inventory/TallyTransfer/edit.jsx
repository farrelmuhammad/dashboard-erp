import './form.css';
import React from "react";
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { toTitleCase } from '../../../utils/helper';


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

const EditTallyTransfer = () => {
    const { id } = useParams();
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [catatan, setCatatan] = useState('');
    const [loading, setLoading] = useState(true);
    const [productNoEdit, setProductNoEdit] = useState([]);
    const [sheetNoEdit, setSheetNoEdit] = useState([]);
    const [qty, setQty] = useState([]);
    const [box, setBox] = useState([])

    const [sumber, setSumber] = useState('PO');
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [getStatus, setStatus] = useState("");
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
    const [getTallySheet, setGetTallySheet] = useState([])

    const [modalListImpor, setModalListImpor] = useState(false);
    const [modalListLokal, setModalListLokal] = useState(false)
    const [modalListRetur, setModalListRetur] = useState(false)
    const [grup, setGrup] = useState()
    // const [checked, setChecked] = useState(false)¿
    const valueRenderer = (cell) => cell.value;
    const onContextMenu = (e, cell, i, j) =>
        cell.readOnly ? e.preventDefault() : null;

    useEffect(() => {
        axios.get(`${Url}/tally_sheet_tf?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                const tallySheetDetail = getData.tally_sheet_details;
                setGetTallySheet(getData)
                // setDetailTallySheet(getData.tally_sheet_details);
                setStatus(getData.status);
                setSelectedWarehouse(getData.warehouse_name);
                setWarehouse(getData.warehouse_id);
                setCatatan(getData.notes)
                setDate(getData.date);
                setLoading(false);

                let arrDataLama = [];
                let arrData = [];
                let tmpQty = []
                let tmpBox = []
                let tmpTally = []
                let arrKuantitas = []
                let kuantitas = [];
                let tmp = []
                let huruf = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

                if (data.length == 0) {


                    for (let i = 0; i < getData.tally_sheet_details.length; i++) {
                        let qtyPesanan;
                        let qtySisa;
                        let idSumber;
                        let codeSumber;
                        let qtyTally = getData.tally_sheet_details[i].tally_sheets_qty
                        // let qtyBox = getData.tally_sheet_details[i].boxes_quantity

                         if (tallySheetDetail[i].goods_request_id) {
                            setSelectedSupplier(getData.supplier_name);
                            setSupplier(getData.supplier_id)
                            idSumber = getData.tally_sheet_details[i].goods_request.id;
                            codeSumber = getData.tally_sheet_details[i].goods_request.code
                            qtyPesanan = getData.tally_sheet_details[i].goods_request_qty
                            // qtySisa = Number(qtyPesanan) - Number(qtyTally)+Number(qtyBox);
                        }

                        let tempData = []
                        let tempDataLama = []
                        kuantitas = []
                        qtySisa = Number(qtyPesanan) - Number(qtyTally);

                        tmp.push({
                            id_produk: getData.tally_sheet_details[i].product_id,
                            id_sumber: idSumber,
                            code: codeSumber,
                            boxes_quantity: getData.tally_sheet_details[i].boxes_quantity,
                            number_of_boxes: getData.tally_sheet_details[i].number_of_boxes,
                            boxes_unit: getData.tally_sheet_details[i].boxes_unit,
                            product_name: getData.tally_sheet_details[i].product_name,
                            action: getData.tally_sheet_details[i].action,
                            transaksi_qty: qtySisa,
                            tally_sheets_qty: qtyTally,
                            statusCek: true,
                            key: "lama"
                        })

                        let jumlahBaris = (Number(getData.tally_sheet_details[i].boxes.length) / 10) + 1;
                        let jumlahKolom = getData.tally_sheet_details[i].boxes.length;
                        let buatKolom = 0
                        let indexBox = 0;
                        let statusEdit = getData.tally_sheet_details[i].editable;

                        tmpBox.push(getData.tally_sheet_details[i].number_of_boxes);
                        tmpTally.push(getData.tally_sheet_details[i].boxes_quantity)
                        for (let x = 0; x <= jumlahBaris.toFixed(); x++) {
                            let baris = []
                            let kolom = [];
                            let barisLama = []
                            let kolomLama = [];
                            for (let y = 0; y <= 10; y++) {
                                if (x == 0) {
                                    if (y == 0) {
                                        kolom.push({ readOnly: true, value: "" })
                                        kolomLama.push({ readOnly: true, value: "" })
                                    }
                                    else {
                                        kolom.push({ value: huruf[y - 1], readOnly: true })
                                        kolomLama.push({ value: huruf[y - 1], readOnly: true })
                                    }

                                }
                                else {
                                    if (y == 0) {
                                        kolom.push(
                                            { readOnly: true, value: x }

                                        );
                                        kolomLama.push(
                                            { readOnly: true, value: x }

                                        );

                                    }
                                    else if (buatKolom < jumlahKolom && x <= jumlahBaris.toFixed()) {
                                        kolom.push(
                                            { value: getData.tally_sheet_details[i].boxes[indexBox].quantity.replace('.', ','), readOnly: !statusEdit }
                                        );
                                        kolomLama.push(
                                            { value: getData.tally_sheet_details[i].boxes[indexBox].quantity.replace('.', ','), readOnly: !statusEdit }
                                        );
                                        // pengecekan index box 
                                        if (indexBox < getData.tally_sheet_details[i].boxes.length - 1) {
                                            indexBox = indexBox + 1;
                                        }
                                        // penjumlahan kolom yang sudah diisi 
                                        buatKolom = buatKolom + 1;

                                        kuantitas.push(getData.tally_sheet_details[i].boxes[y - 1].quantity);


                                    }
                                    else {
                                        kolom.push(
                                            {
                                                value: '',
                                                readOnly: !statusEdit
                                            },
                                        );
                                        kolomLama.push(
                                            {
                                                value: '',
                                                readOnly: !statusEdit
                                            },
                                        );
                                    }
                                    baris.push(kolom)
                                    barisLama.push(kolomLama)

                                }


                            }
                            tempData.push(kolom);
                            tempDataLama.push(kolomLama)
                        }
                        arrKuantitas.push(kuantitas);
                        arrDataLama.push(tempDataLama)
                        arrData.push(tempData)
                    }
                    setProduct(tmp)
                    setProductNoEdit(tmp)
                    setKuantitasBox(arrKuantitas);
                    setTotalTallySheet(tmpTally);
                    setData(arrData);
                    // console.log(arrData)
                    setSheetNoEdit(arrDataLama)
                    setQty(tmpQty);
                    setBox(tmpBox)

                
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    const onCellsChanged = (changes) => {
        console.log(sheetNoEdit)
        const newGrid = [];
        newGrid[indexPO] = data[indexPO];

        // menyimpan perubahan 
        changes.forEach(({ cell, row, col, value }) => {

            for (let x = 0; x < product.length; x++) {
                if (x === indexPO) {
                    newGrid[x][row][col] = { ...data[x][row][col], value };
                }

            }
        });
        let totTly = [];

        // update jumlah tally sheet 
        for (let x = 0; x < product.length; x++) {
            totTly[x] = 0;
            for (let a = 1; a < data[x].length; a++) {
                for (let b = 1; b < data[x][a].length; b++) {
                    if (data[x][a][b].value != 0) {
                        console.log(data[x][a][b])
                        totTly[x] = Number(totTly[x]) + Number(data[x][a][b].value.replace(',', '.'));
                        console.log(totTly[x])
                    }
                }
            }
        }

        setTotalTallySheet(totTly);

        // update pada state 
        // let tempData = [];
        let arrData = [];
        for (let x = 0; x < product.length; x++) {
            // tempData = [];
            if (x == indexPO) {
                arrData.push(newGrid[x]);
            }
            else {
                arrData.push(data[x]);
            }
        }
        setData(arrData);


        // mencari jumlah qty dan total box 
        console.log(box)
        let total = [];
        let kuantitas = [];
        let arrKuantitas = [];

        for (let x = 0; x < product.length; x++) {
            kuantitas = [];
            if (x == indexPO) {
                total[x] = 0;
                for (let a = 1; a < data[x].length; a++) {
                    for (let b = 1; b < data[x][a].length; b++) {
                        if (data[x][a][b].value != 0) {
                            kuantitas.push(data[x][a][b].value);

                            total[x] = Number(total[x]) + Number(1);
                        }
                    }
                }
                arrKuantitas.push(kuantitas)

            }
            else {
                total.push(box[x]);
                console.log(box[x])
                arrKuantitas.push(kuantitasBox[x]);
            }
        }
        setBox(total);
        setKuantitasBox(arrKuantitas);

        let tmp = []
        for (let i = 0; i < product.length; i++) {

            if (i == indexPO) {
                tmp.push({
                    id_produk: product[i].id_produk,
                    id_sumber: product[i].id_sumber,
                    code: product[i].code,
                    boxes_quantity: totTly[i].toFixed(2),
                    number_of_boxes: total[i],
                    boxes_unit: product[i].boxes_unit,
                    product_name: product[i].product_name,
                    action: totTly[i] >= product[i].transaksi_qty ? 'Done' : 'Next delivery',
                    transaksi_qty: product[i].transaksi_qty,
                    tally_sheets_qty: product[i].tally_sheets_qty,
                    key: product[i].key
                })
            }
            else {
                tmp.push(product[i])
            }

        }
        console.log(tmp)
        console.log(sheetNoEdit)
        setProduct(tmp)
    };

    function klikTambahBaris() {
        let hasilData = [];
        let tmpData = [];
        // let defaultData 
        for (let x = 0; x < product.length; x++) {
            if (x == indexPO) {
                let defaultData = [
                    { readOnly: true, value: data[x].length },
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
                hasilData.push(...data[x], defaultData);
            }
            else {
                hasilData.push(data[x]);
            }
            tmpData.push(hasilData);

        }


        setData(tmpData);
    }

    function klikHapusBaris() {
        // setLoadingSpreadSheet(true);
        let hasilData = [];
        let tmpData = [...data];
        for (let x = 0; x < product.length; x++) {
            if (x === indexPO) {

                if (tmpData[x].length - 2 > 0) {
                    tmpData[x].splice(tmpData[x].length - 1, 1);
                }
            }
        }
        setData(tmpData)

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

    function hapusIndexProduct(index) {
        let code = product[index].code;
        let status;
        setLoadingTable(true);

        for (let x = 0; x < product.length; x++) {
            if (product[x].code == code) {

                // pengecekan centang 
                if (sumber == 'PO') {
                    // hapus cek 
                    let tmp = [];
                    for (let j = 0; j < getDataProduct.length; j++) {
                        if (getDataProduct[j].detail.code == code) {
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

                product.splice(index, 1);
                data.splice(index, 1);
                setIndexPO(0)
            }
        }
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data berhasil dihapus',
        }).then(() => setLoadingTable(false));


    }

    const handleChangeWarehouse = (value) => {
        setSelectedWarehouse(value);
        setWarehouse(value.id);
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

    const columns = [
        {
            title: 'No. Permintaan',
            dataIndex: 'code',
            width: '25%',
            key: 'name',
        },,
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
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     align: 'center',
        //     width: '10%',
        //     key: 'status',

        // },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            width: '10%',
            key: 'operation',
        },
    ];

    useEffect(() => {
        getNewCodeTally()
    }, [date])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheet_tf_available_goods_request?kode=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })

            let tmp = []
            for (let i = 0; i < res.data.data.length; i++) {
                for (let x = 0; x < product.length; x++) {

                    if (res.data.data[i].code == product[x].code) {
                        tmp.push({
                            detail: res.data.data[i],
                            statusCek: true
                        });
                    }
                    else {
                        tmp.push({
                            detail: res.data.data[i],
                            statusCek: false
                        });
                    }

                }

            }
            setGetDataProduct(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, warehouse])

    const handleCheck = (event, indexTransaksi) => {
        console.log(data)
        console.log(sheetNoEdit)
        var updatedList = [...product];
        let arrData = [];
        let panjang;
        let dataSumber;
        let tmpDataBaru = []
        const value = event.target.value.detail;

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
            panjang = value.goods_request_details.length;
            dataSumber = value.goods_request_details;
        }


        if (tmpDataBaru[indexTransaksi].statusCek) {

            let tmp = [];
            // setting baris 
            for (let i = 0; i <= updatedList.length; i++) {
                if (i == updatedList.length) {
                    // console.log(dataSumber.length)
                    for (let x = 0; x < dataSumber.length; x++) {
                        let qtyAwal = dataSumber[x].quantity;
                        let qtyAkhir = dataSumber[x].tally_sheets_qty;
                        // pengecekan qty sebelumnya 
                        for (let j = 0; j < productNoEdit.length; j++) {
                            console.log(productNoEdit)
                            if (value.code == productNoEdit[j].code) {
                                tmp.push(
                                    productNoEdit[j]
                                )
                            }
                            else if (qtyAkhir < qtyAwal) {
                                tmp.push({
                                    id_produk: dataSumber[x].product_id,
                                    id_sumber: value.id,
                                    code: value.code,
                                    boxes_quantity: 0,
                                    number_of_boxes: 0,
                                    boxes_unit: dataSumber[x].unit,
                                    product_name: dataSumber[x].product_name,
                                    action: qtyAkhir >= qtyAwal ? 'Done' : 'Next delivery',
                                    transaksi_qty: Number(qtyAwal) - Number(qtyAkhir),
                                    tally_sheets_qty: qtyAkhir,
                                    key: "baru"
                                })
                            }
                        }

                    }
                }
                else (
                    tmp.push(product[i])
                )
            }
            // console.log(tmp)
            updatedList = tmp

            // setting data 
            for (let i = 0; i < updatedList.length; i++) {
                if (i < updatedList.length - panjang) {
                    arrData.push(data[i])
                }
                else {
                    for (let j = 0; j < productNoEdit.length; j++) {
                        if (value.code == productNoEdit[j].code) {
                            arrData.push(sheetNoEdit[j])
                        }
                        else {
                            arrData[i] = [
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
                    }

                }
            }
            console.log(arrData)
            setProduct(updatedList);
            setData(arrData);

        }
        else {
            arrData = [...data]
            for (let i = 0; i < updatedList.length; i++) {
                for (let x = 0; x < dataSumber.length; x++) {
                    if (updatedList[i].id_sumber == value.id && updatedList[i].id_produk == dataSumber[x].product_id) {
                        updatedList.splice(i, 1);
                        arrData.splice(i, 1);
                        setIndexPO(0)
                    }
                }
            }
            console.log(arrData)
            setProduct(updatedList);
            setData(arrData)
        }
    };

    
    const dataPurchase =
        [...product.map((item, i) => ({
            code: item.code,
            product_name: item.product_name,
            quantity: Number(item.boxes_quantity).toFixed(2).replace('.', ','),
            unit: item.boxes_unit,
            box:
                <>

                    <a onClick={() =>
                        klikTampilSheet(i)} style={{ color: "#1890ff" }}>
                        {item.number_of_boxes}
                    </a>
                    <Modal
                        centered
                        visible={modal2Visible2}
                        onCancel={() => setModal2Visible2(false)}
                        footer={[
                            <Button
                                key="submit"
                                type="primary"
                                style={{ background: "green", borderColor: "white" }}
                                onClick={() => setModal2Visible2(false)}
                            >
                                OK
                            </Button>,
                        ]}  
                        // onOk={() => setModal2Visible2(false)}
                        width={1000}
                    >
                        <div className="text-title text-start">
                            <div className="row">
                                <div className="col">
                                    <div className="row">
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">No. Pesanan</label>
                                        <div className="col-sm-3">
                                            <input
                                                value={product[indexPO].code}
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />
                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Pesanan</label>
                                        <div className="col-sm-3">
                                            <input

                                                value={quantityPO ? quantityPO.replace('.', ',') : null}
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
                                                value={product[indexPO].product_name}
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />

                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                        <div className="col-sm-3">
                                            <input
                                                value={Number(product[indexPO].boxes_quantity).toFixed(2).toString().replace('.', ',')}
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
                                        data={data[indexPO]}
                                        valueRenderer={valueRenderer}
                                        onContextMenu={onContextMenu}
                                        onCellsChanged={onCellsChanged}
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
                                        data[indexPO].length - 2 > 0 ?
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

            status: item.action === 'Done' ? <Tag color="green" type="button" onClick={() => forceNexDeliveryProduct(i)}>{item.action}</Tag> : item.action === 'Next delivery' ? <Tag color="orange" type="button" onClick={() => forceDoneProduct(i)}>{item.action}</Tag> : <Tag color="red">{item.action}</Tag>,
            action: <Space size="middle">
                <Button
                    size='small'
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => { hapusIndexProduct(i) }}
                />
            </Space>

        }))
        ];

    // Column for modal input product
    const columnsModal = [
        {
            title: 'Tanggal',
            width: '20%',
            dataIndex: 'date',
        },
        {
            title: 'No. Permintaan',
            dataIndex: 'code',
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
            date: item.detail.date,
            code: item.detail.code,
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
        const tallySheetData = new URLSearchParams();
        tallySheetData.append("tanggal", date);
        tallySheetData.append("gudang", warehouse);
        tallySheetData.append("catatan", catatan);
        tallySheetData.append("status", "Submitted");

        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", p.id_produk);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("aksi[]", p.action);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            if (sumber == 'PO') {
                tallySheetData.append("id_permintaan_barang[]", p.id_sumber);
            }
        });

        let key = 0;
        for (let idx = 0; idx < kuantitasBox.length; idx++) {
            for (let x = 0; x < kuantitasBox[idx].length; x++) {
                tallySheetData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + x + "]", kuantitasBox[idx][x].toString().replace(',', '.'))
            }
            key++;
        }




        axios({
            method: "put",
            url: `${Url}/tally_sheet_tf/${id}`,
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
                navigate("/tallytransfer");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.message,
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
        const tallySheetData = new URLSearchParams();
        tallySheetData.append("tanggal", date);
        tallySheetData.append("gudang", warehouse);
        tallySheetData.append("catatan", catatan);
        tallySheetData.append("status", "Draft");

        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", p.id_produk);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("aksi[]", p.action);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            if (sumber == 'PO') {
                tallySheetData.append("id_permintaan_barang[]", p.id_sumber);
            }
        });

        // console.log(tallySheetData)
        let key = 0;
        for (let idx = 0; idx < kuantitasBox.length; idx++) {
            for (let x = 0; x < kuantitasBox[idx].length; x++) {
                tallySheetData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + x + "]", kuantitasBox[idx][x].toString().replace(',', '.'))
            }
            key++;
        }

// for (var pair of tallySheetData.entries()) {
//             console.log(pair[0] + ', ' + pair[1]);
//         }
        axios({
            method: "put",
            url: `${Url}/tally_sheet_tf/${id}`,
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
                navigate("/tallytransfer");
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

    function klikTampilSheet(indexPO) {
        // console.log(data)
        console.log(product)
        setQuantityPO(Number(product[indexPO].transaksi_qty).toFixed(2).toString())

        setIndexPO(indexPO);
        setModal2Visible2(true);


    }

    if (loading) {
        return (
            <div></div>
        )
    }

    return (
        <>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title="Edit Tally Transfer">
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
                                    defaultValue={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Permintaan</label>
                            <div className="col-sm-7">
                                <input
                                    value={getTallySheet.code}
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
                                    defaultInputValue={selectedWarehouse}
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
                                    defaultValue={catatan}
                                    rows="4"
                                    onChange={(e) => setCatatan(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-4 p-1">
                                {getStatus === 'Submitted' ? <Tag color="blue">{getStatus}</Tag> : getStatus === 'Draft' ? <Tag color="orange">{getStatus}</Tag> : getStatus === 'Done' ? <Tag color="green">{getStatus}</Tag> : <Tag color="red">{getStatus}</Tag>}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <form className="p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Daftar Permintaan</h4>
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
                                title="Tambah Permintaan"
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
                                                placeholder="Cari Nomor Permintaan.."
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
                        dataSource={dataPurchase}
                        columns={columns}
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

export default EditTallyTransfer