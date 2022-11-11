import './form.css'
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useNavigate, useParams } from 'react-router-dom'
import AsyncSelect from "react-select/async";
import { useSelector } from 'react-redux'
import ReactDataSheet from 'react-datasheet'
import Swal from 'sweetalert2';
import { PageHeader } from 'antd';


const EditTallySheet = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const auth = useSelector(state => state.auth);
    const [modal2Visible, setModal2Visible] = useState(false)
    const [query, setQuery] = useState("")
    const [product, setProduct] = useState([]);
    const [productNoEdit, setProductNoEdit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getTallySheet, setGetTallySheet] = useState([])
    const [loadingTable, setLoadingTable] = useState(false);
    const [delIndex, setDelIndex] = useState([]);
    const [data, setData] = useState([]);
    const [sheetNoEdit, setSheetNoEdit] = useState([]);
    const [dataSheet, setDataSheet] = useState([]);
    const [loadingSpreedSheet, setLoadingSpreadSheet] = useState(false);
    const [totalBox, setTotalBox] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [indexPO, setIndexPO] = useState(0);
    const [kuantitasBox, setKuantitasBox] = useState([]);
    const [idxPesanan, setIdxPesanan] = useState(0);
    const [supplier, setSupplier] = useState();
    const [customer, setCustomer] = useState()
    const [warehouse, setWarehouse] = useState()
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [modal2Visible2, setModal2Visible2] = useState(false);
    const [getDataProduct, setGetDataProduct] = useState([])
    const [getDataFaktur, setGetDataFaktur] = useState([])
    const [getDataRetur, setGetDataRetur] = useState([])
    const [getDataDetailPO, setGetDataDetailPO] = useState('');
    const [detailTallySheet, setDetailTallySheet] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [sumber, setSumber] = useState('');
    const [getStatus, setStatus] = useState();
    const [qty, setQty] = useState([]);
    const [box, setBox] = useState([])
    const [totalTallySheet, setTotalTallySheet] = useState([])
    const [quantityPO, setQuantityPO] = useState()
    const [catatan, setCatatan] = useState('')
    const [date, setDate] = useState()

    const [canc, setCancel] = useState(false)

    const [modalListImpor, setModalListImpor] = useState(false);
    const [modalListLokal, setModalListLokal] = useState(false)
    const [modalListRetur, setModalListRetur] = useState(false)
    // const [quantityTally, setQuantityPO] = useState()
    const valueRenderer = (cell) => cell.value;
    const onContextMenu = (e, cell, i, j) =>
        cell.readOnly ? e.preventDefault() : null;

    useEffect(() => {
        axios.get(`${Url}/tally_sheet_ins?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                const tallySheetDetail = getData.tally_sheet_details;
                setGetTallySheet(getData)
                setDetailTallySheet(getData.tally_sheet_details);
                setStatus(getData.status);
                setSelectedWarehouse(getData.warehouse_name);
                setWarehouse(getData.warehouse_id);
                if (getData.notes) {
                    setCatatan(getData.notes)

                }
                setDate(getData.date);

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

                        if (tallySheetDetail[i].purchase_invoice_id) {
                            setSumber('Faktur');
                            setSelectedSupplier(getData.supplier_name);
                            setSupplier(getData.supplier_id)
                            idSumber = getData.tally_sheet_details[i].purchase_invoice.id;
                            qtyPesanan = getData.tally_sheet_details[i].purchase_invoice_qty
                            codeSumber = getData.tally_sheet_details[i].purchase_invoice.code
                            // qtySisa = Number(qtyPesanan) - Number(qtyTally)+Number(qtyBox);
                        }
                        else if (tallySheetDetail[i].purchase_order_id) {
                            setSumber('PO')
                            setSelectedSupplier(getData.supplier_name);
                            setSupplier(getData.supplier_id)
                            idSumber = getData.tally_sheet_details[i].purchase_order.id;
                            codeSumber = getData.tally_sheet_details[i].purchase_order.code
                            qtyPesanan = getData.tally_sheet_details[i].purchase_order_qty
                            // qtySisa = Number(qtyPesanan) - Number(qtyTally)+Number(qtyBox);
                        }
                        else if (tallySheetDetail[i].sales_return_id) {
                            setSumber('Retur')
                            setSelectedCustomer(getData.customer_name);
                            setCustomer(getData.customer_id)
                            codeSumber = getData.tally_sheet_details[i].sales_return.code
                            idSumber = getData.tally_sheet_details[i].sales_return.id;
                            qtyPesanan = getData.tally_sheet_details[i].sales_return_qty
                            // qtySisa = Number(qtyPesanan) - Number(qtyTally);
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
                                            { value: Number(getData.tally_sheet_details[i].boxes[indexBox].quantity).toFixed(2).replace('.', ','), readOnly: !statusEdit }
                                        );
                                        kolomLama.push(
                                            { value: Number(getData.tally_sheet_details[i].boxes[indexBox].quantity).toFixed(2).replace('.', ','), readOnly: !statusEdit }
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

                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // jika dari PO 
    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheet_ins_available_purchase_orders?include_tally_sheet_purchase_orders=${id}&kode=${query}&id_pemasok=${getTallySheet.supplier_id}`, {
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
            console.log(tmp)
            setGetDataProduct(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, getTallySheet])

    // jika dari faktur 
    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheet_ins_available_purchase_invoices?include_tally_sheet_purchase_invoices=${id}&kode=${query}&id_pemasok=${getTallySheet.supplier_id}`, {
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
            setGetDataFaktur(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, getTallySheet])

    // jika dari retur 
    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheet_ins_available_sales_returns?include_tally_sheet_sales_returns=${id}&kode=${query}&id_pemasok=${getTallySheet.customer_id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            let status;
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
            setGetDataRetur(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, getTallySheet])


    const handleChangeSupplier = (value) => {
        setGrup(value._group)
        setProduct([])
        setSelectedSupplier(value);
        setSupplier(value.id);
    };
    const loadOptionsSupplier = (inputValue) => {

        return axios.get(`${Url}/tally_sheet_ins_available_suppliers/purchase_orders?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };
    const loadOptionsSupplierImpor = (inputValue) => {

        return axios.get(`${Url}/tally_sheet_ins_available_suppliers/purchase_invoices?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const handleChangeCustomer = (value) => {
        // setGrup(value._group)
        setProduct([])
        setSelectedCustomer(value);
        setCustomer(value.id);
    };
    const loadOptionsCustomer = (inputValue) => {
        return axios.get(`${Url}/tally_sheet_ins_available_customers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const handleChangeWarehouse = (value) => {
        // setGrup(value._group)
        setProduct([])
        setSelectedWarehouse(value);
        setWarehouse(value.id);
    };
    const loadOptionsWarehouse = (inputValue) => {
        return axios.get(`${Url}/select_warehouses?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };


    const columns = [
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
            width: '25%',
            key: 'name',
        },
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
            key: 'operation',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            width: '10%',
            key: 'operation',

        },
    ];

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


    function hapusIndexProduct(index) {
        // console.log(index)
        let code = product[index].code;
        let status;
        setLoadingTable(true);



        for (let x = 0; x < product.length; x++) {
            if (product[x].code == code) {

                // pengecekan centang 
                if (sumber == 'Retur') {
                    let tmp = [];
                    for (let j = 0; j < getDataRetur.length; j++) {
                        if (getDataRetur[j].detail.code == code) {
                            tmp.push({
                                detail: getDataRetur[j].detail,
                                statusCek: false
                            })
                        }
                        else {
                            tmp.push(getDataRetur[j])
                        }
                    }
                    setGetDataRetur(tmp)

                }
                else if (sumber == 'PO') {
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
                else if (sumber == 'Faktur') {
                    let tmp = [];
                    for (let j = 0; j < getDataFaktur.length; j++) {
                        if (getDataFaktur[j].detail.code == code) {
                            tmp.push({
                                detail: getDataFaktur[j].detail,
                                statusCek: false
                            })
                        }
                        else {
                            tmp.push(getDataFaktur[j])
                        }
                    }
                    setGetDataFaktur(tmp)

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

    function forceDoneProduct(index) {
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
                let newProduct = []
                for (let i = 0; i < product.length; i++) {

                    if (i == index) {
                        newProduct.push({
                            id_produk: product[i].id_produk,
                            id_sumber: product[i].id_sumber,
                            code: product[i].code,
                            boxes_quantity: product[i].boxes_quantity,
                            number_of_boxes: product[i].number_of_boxes,
                            boxes_unit: product[i].boxes_unit,
                            product_name: product[i].product_name,
                            action: 'Done',
                            transaksi_qty: product[i].transaksi_qty,
                            tally_sheets_qty: product[i].tally_sheets_qty,
                            key: product[i].key
                        })

                    }
                    else {
                        newProduct.push(product[i])

                    }

                }
                setProduct(newProduct)
            }
        })
    }

    function forceNexDeliveryProduct(index) {
        if (product[index].boxes_quantity >= product[index].transaksi_qty) {
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
                    let newProduct = []
                    for (let i = 0; i < product.length; i++) {
                        if (i == index) {
                            newProduct.push({
                                id_produk: product[i].id_produk,
                                id_sumber: product[i].id_sumber,
                                code: product[i].code,
                                boxes_quantity: product[i].boxes_quantity,
                                number_of_boxes: product[i].number_of_boxes,
                                boxes_unit: product[i].boxes_unit,
                                product_name: product[i].product_name,
                                action: 'Next delivery',
                                transaksi_qty: product[i].transaksi_qty,
                                tally_sheets_qty: product[i].tally_sheets_qty,
                                key: product[i].key
                            })
                        }
                        else {
                            newProduct.push(product[i])

                        }

                    }
                    setProduct(newProduct)
                }
            })
        }

    }

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
            title: 'No. Pesanan',
            width: '20%',
            dataIndex: 'code',
        },
        {
            title: sumber == 'Retur' ? 'Customer' : 'Supplier',
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
            title: 'Actions',
            dataIndex: 'action',
            width: '8%',
            align: 'center',
        },
    ];

    const columnDataRetur =
        [...getDataRetur.map((item, i) => ({
            code: item.detail.code,
            nama: item.detail.customer_name,
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

    const columnDataPO =
        [...getDataProduct.map((item, i) => ({
            code: item.detail.code,
            nama: item.detail.supplier_name,
            notes: item.detail.notes,
            action:
                <>
                    <Checkbox
                        value={item}
                        checked={item.statusCek}
                        onChange={(e) => handleCheck(e, i)}
                    />
                </>
        }))

        ]

    const columnDataFaktur =
        [...getDataFaktur.map((item, i) => ({
            code: item.detail.code,
            nama: item.detail.supplier_name,
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
        if (sumber == 'Retur') {
            for (let i = 0; i < getDataRetur.length; i++) {
                if (i == indexTransaksi) {
                    tmpDataBaru.push({
                        detail: getDataRetur[i].detail,
                        statusCek: !getDataRetur[i].statusCek
                    })
                }
                else {
                    tmpDataBaru.push(getDataRetur[i])
                }
            }
            setGetDataRetur(tmpDataBaru)
            dataSumber = value.sales_return_details;
            panjang = value.sales_return_details.length;

        }

        else if (sumber == 'PO') {
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
            panjang = value.purchase_order_details.length;
            dataSumber = value.purchase_order_details;
        }

        else if (sumber == 'Faktur') {
            for (let i = 0; i < getDataFaktur.length; i++) {
                if (i == indexTransaksi) {
                    tmpDataBaru.push({
                        detail: getDataFaktur[i].detail,
                        statusCek: !getDataFaktur[i].statusCek
                    })
                }
                else {
                    tmpDataBaru.push(getDataFaktur[i])
                }
            }
            setGetDataFaktur(tmpDataBaru)
            dataSumber = value.purchase_invoice_details;
            panjang = value.purchase_invoice_details.length;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tallySheetData = new URLSearchParams();
        tallySheetData.append("tanggal", date);
        if (sumber == 'Retur') {
            tallySheetData.append("pelanggan", customer);
        }
        else {
            tallySheetData.append("pemasok", supplier);
        }
        tallySheetData.append("gudang", warehouse);
        tallySheetData.append("catatan", catatan);
        tallySheetData.append("status", "Submitted");

        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", p.id_produk);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("aksi[]", p.action);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            if (sumber == 'Faktur') {
                tallySheetData.append("id_faktur_pembelian[]", p.id_sumber);
            }
            else if (sumber == 'Retur') {
                tallySheetData.append("id_retur_penjualan[]", p.id_sumber);
            }
            else if (sumber == 'PO') {
                tallySheetData.append("id_pesanan_pembelian[]", p.id_sumber);
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
            url: `${Url}/tally_sheet_ins/${id}`,
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
        if (sumber == 'Retur') {
            tallySheetData.append("pelanggan", customer);
        }
        else {
            tallySheetData.append("pemasok", supplier);
        }
        tallySheetData.append("gudang", warehouse);
        tallySheetData.append("catatan", catatan);
        tallySheetData.append("status", "Draft");

        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", p.id_produk);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("aksi[]", p.action);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            if (sumber == 'Faktur') {
                tallySheetData.append("id_faktur_pembelian[]", p.id_sumber);
            }
            else if (sumber == 'Retur') {
                tallySheetData.append("id_retur_penjualan[]", p.id_sumber);
            }
            else if (sumber == 'PO') {
                tallySheetData.append("id_pesanan_pembelian[]", p.id_sumber);
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


        axios({
            method: "put",
            url: `${Url}/tally_sheet_ins/${id}`,
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

    function klikTampilSheet(indexPO) {
        // console.log(data)
        console.log(product)

        setQuantityPO(Number(product[indexPO].transaksi_qty).toFixed(2).toString())
        setIndexPO(indexPO)
        setModal2Visible2(true)
    }

    // function klikTampilSheet2() {
    //     // console.log(data)
    //     //console.log(product)

    //         // setQuantityPO(Number(product[indexPO].transaksi_qty).toFixed(2).toString())
    //         // setIndexPO(indexPO)
    //         setCancel(true)
    //         setModal2Visible2(false)
    // }

    if (loading) {
        return (
            <div></div>
        )
    }
    return (
        <>
            <form className="  p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Edit Tally Sheet">
                    </PageHeader>
                    {/* <h3 className="title fw-bold">Detail Tally Sheet</h3> */}
                </div>
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input defaultValue={date} id="startDate" onChange={(e) => setDate(e.target.value)} className="form-control" type="date" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.code} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Transaksi</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={sumber == 'Retur' ? 'Retur Penjualan' : sumber == 'Faktur' ? 'Pembelian Impor' : sumber == 'PO' ? 'Pembelian Lokal' : null} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Faktur' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultInputValue={selectedSupplier}
                                    defaultOptions
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplierImpor}
                                    onChange={handleChangeSupplier}
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'PO' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">

                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultInputValue={selectedSupplier}
                                    defaultOptions
                                    value={selectedSupplier}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsSupplier}
                                    onChange={handleChangeSupplier}
                                />

                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Customer</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Customer..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedCustomer}
                                    value={selectedCustomer}
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
                                <textarea defaultValue={catatan} onChange={(e) => setCatatan(e.target.value)} className="form-control" id="form4Example3" rows="4" />
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
                            <h4 className="title fw-normal">Daftar Produk</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    if (sumber == "") {
                                        Swal.fire("Gagal", "Mohon Pilih Sumber Dahulu..", "error");
                                    }
                                    else if (sumber == "Faktur") {
                                        setModalListImpor(true)
                                    }
                                    else if (sumber == "PO") {
                                        setModalListLokal(true)
                                    }
                                    else if (sumber == "Retur") {
                                        setModalListRetur(true)
                                    }

                                }}
                            />
                            {/* modal dari PO  */}
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

                            {/* modal dari faktur  */}
                            <Modal
                                title="Tambah Faktur"
                                centered
                                visible={modalListImpor}
                                onCancel={() => setModalListImpor(false)}
                                width={1000}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Nomor Faktur.."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={columnDataFaktur}
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

                            {/* modal dari retur  */}
                            <Modal
                                title="Tambah Retur"
                                centered
                                visible={modalListRetur}
                                onCancel={() => setModalListRetur(false)}
                                width={1000}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Nomor Retur.."
                                                style={{
                                                    width: 400,
                                                }}
                                                onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                        <Table
                                            columns={columnsModal}
                                            dataSource={columnDataRetur}
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

                    {
                        getStatus != "Submitted" ? <>
                            <button
                                type="button"
                                className="btn btn-success rounded m-1"
                                value="Draft"
                                onChange={(e) => setStatus(e.target.value)}
                                onClick={handleDraft}
                                width="100px"
                            >
                                Simpan
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary rounded m-1"
                                value="Submitted"
                                onChange={(e) => setStatus(e.target.value)}
                                onClick={handleSubmit}
                                width="100px"
                            >
                                Submit
                            </button></>
                            : <>
                                <button
                                    type="button"
                                    className="btn btn-success rounded m-1"
                                    value="Draft"
                                    onChange={(e) => setStatus(e.target.value)}
                                    onClick={handleSubmit}
                                    width="100px"
                                >
                                    Simpan
                                </button></>
                    }
                    {/* <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
        </>
    )
}

export default EditTallySheet