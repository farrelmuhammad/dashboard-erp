import './form.css'
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import ReactSelect from 'react-select';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, PageHeader, Select, Space, Table, Tag } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import ReactDataSheet from 'react-datasheet';
import "react-datasheet/lib/react-datasheet.css";

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
    const [idProductSelect, setIdProductSelect] = useState([]);
    const [dataTampil, setDataTampil] = useState([])
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();

    const [getDataProduct, setGetDataProduct] = useState('');
    const [getDataRetur, setGetDataRetur] = useState('');
    const [tmpCentang, setTmpCentang] = useState([]);
    const [getDataDetailSO, setGetDataDetailSO] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");
    const [count, setCount] = useState(0);

    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [optionsProduct, setOptionsProduct] = useState([]);
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
    const [sumber, setSumber] = useState('')
    const [supplier, setSupplier] = useState('')
    const [selectedSupplier, setSelectedSupplier] = useState()
    const [grup, setGrup] = useState()


    // menghitung total tally sheet 
    useEffect(() => {
        let arrTotal = [];
        let total = [];

        for (let x = 0; x < product.length; x++) {
            total = [];

            for (let i = 0; i < dataTampil[x].length; i++) {
                total[i] = 0;
                if (data[x][i]) {
                    for (let a = 1; a < data[x][i].length; a++) {
                        for (let b = 1; b < data[x][i][a].length; b++) {
                            if (data[x][i][a][b].value != 0) {
                                total[i] = Number(total[i]) + Number(data[x][i][a][b].value.replace(',', '.'));
                            }
                        }
                    }
                }

            }
            arrTotal[x] = total;
        }
        setTotalTallySheet(arrTotal);
    }, [data]);

    // handle change supplier dan customer 
    const handleChangeSupplier = (value) => {
        setGrup(value._group)
        setProduct([])
        setSelectedSupplier(value);
        setSupplier(value.id);
    };
    const loadOptionsSupplier = (inputValue) => {
        return axios.get(`${Url}/tally_sheets_available_suppliers?nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data);
    };

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setProduct([])
        setCustomer(value.id);
    };
    const loadOptionsCustomer = (inputValue) => {
        return fetch(`${Url}/tally_sheets_available_customers?limit=10&nama=${inputValue}`, {
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
    const loadOptionsWarehouse = (inputValue) => {
        return axios.get(`${Url}/warehouses?virtual=0&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const handleChangeProduct = (value, record, idx) => {
        let status = ''
        for (let i = 0; i < idProductSelect[record].length; i++) {
            if (idProductSelect[record][i] == value.value) {
                status = 'ada'
                Swal.fire("Data Sudah Ada!", `${value.label} sudah ada di baris ${i + 1}`, "error");
            }
        }

        // jika data belum dipilih sebelumnya 
        if (status != 'ada') {
            let idKey = [];
            let key = [];
            let store = [];
            let store2 = [];

            for (let x = 0; x < data.length; x++) {
                if (x == record) {
                    for (let y = 0; y < data[x].length; y++) {
                        if (y == idx) {
                            idKey.push(value.value)
                            store.push(value)
                        } else {
                            idKey.push(idProductSelect[x][y])
                            store.push(selectedProduct[x][y])
                        }
                    }
                    key.push(idKey)
                    store2.push(store)
                } else {
                    key.push(idProductSelect[x])
                    store2.push(selectedProduct[x])
                }
            }
            setSelectedProduct(store2);
            setIdProductSelect(key);
        }
    };

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
                    for (let i = 0; i < dataTampil[x].length; i++) {
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
            console.log(dataTampil)

            for (let i = 0; i < dataTampil[x].length; i++) {
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
                for (let i = 0; i < dataTampil[x].length; i++) {
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
        console.log(kuantitasBox)
        for (let x = 0; x < product.length; x++) {
            tempKuantitas = [];
            total = [];

            if (x === idxPesanan) {
                for (let i = 0; i < dataTampil[x].length; i++) {
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
                for (let i = 0; i < dataTampil[x].length; i++) {
                    if (kuantitasBox[x][i] == 0 || kuantitasBox[x].length == 0) {
                        console.log("ndjbjzskg")
                        tempKuantitas.push([0]);
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
                for (let i = 0; i < dataTampil[x].length; i++) {
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
                for (let i = 0; i < dataTampil[x].length; i++) {

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
        // console.log(i)
        let tmp = [];
        let arrtmp = [];
        let stts = [];
        let arrStatus = []
        let qtySO
        let qtySebelumnya
        // pengecekan transaksi 

        qtySO = qtyPesanan[idxPesanan][i]
        qtySebelumnya = dataTampil[idxPesanan][i].tally_sheets_qty;


        for (let x = 0; x < product.length; x++) {
            tmp = [];

            if (x == idxPesanan) {
                for (let i = 0; i < dataTampil[x].length; i++) {
                    if (i === indexPO) {
                        tmp[i] = 0;
                        tmp[i] = totalTallySheet[x][i];


                        if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) >= Number(qtySO)) {
                            stts[i] = 'Done'
                        }
                        else if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) < Number(qtySO)) {
                            stts[i] = 'Next delivery'
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

        // pengecekan status atasnya 
        for (let x = 0; x < product.length; x++) {
            tmp = [];

            if (product[x].code == product[idxPesanan].code) {
                for (let i = 0; i < dataTampil[x].length; i++) {
                    if (dataTampil[x][i].product_alias_name === dataTampil[x][indexPO].product_alias_name) {
                        stts[i] = stts[indexPO]
                    }
                    else {
                        stts[i] = statusSO[x][i];
                    }
                }
            }
            else {
                arrStatus.push(statusSO[x]);
            }
        }
        setQuantity(arrtmp);
        setStatusSO(arrStatus);
        setModal2Visible2(false)
    }

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
                let newStatus = []
                let dataSumber = []
                for (let i = 0; i < product.length; i++) {
                    let status = []
                    if (sumber == 'Retur') {
                        dataSumber = product[i].purchase_return_details;
                    }
                    else if (sumber == 'SO') {
                        dataSumber = product[i].sales_order_details;
                    }

                    if (baris == i) {
                        for (let x = 0; x < dataSumber.length; x++) {
                            if (kolom == x) {
                                status.push('Done')
                            }
                            else {
                                status.push(statusSO[i][x])

                            }
                        }
                        newStatus.push(status)

                    }
                    else {
                        newStatus.push(statusSO[i])
                    }

                }
                setStatusSO(newStatus)
            }
        })
    }

    function forceNexDeliveryProduct(baris, kolom) {

        let dataSumber = []
        if (sumber == 'Retur') {
            dataSumber = product[baris].purchase_return_details;
        }
        else if (sumber == 'SO') {
            dataSumber = product[baris].sales_order_details;
        }


        if (dataSumber[kolom].tally_sheets_qty >= dataSumber[kolom].quantity) {
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
                    let newStatus = []
                    let dataSumber = []
                    for (let i = 0; i < product.length; i++) {
                        let status = []
                        if (sumber == 'Retur') {
                            dataSumber = product[i].purchase_return_details;
                        }
                        else if (sumber == 'SO') {
                            dataSumber = product[i].sales_order_details;
                        }

                        if (baris == i) {
                            for (let x = 0; x < dataSumber.length; x++) {
                                if (kolom == x) {
                                    status.push('Next delivery')
                                }
                                else {
                                    status.push(statusSO[i][x])

                                }
                            }
                            newStatus.push(status)

                        }
                        else {
                            newStatus.push(statusSO[i])
                        }

                    }
                    setStatusSO(newStatus)
                }
            })
        }

    }

    function hapusIndexProduct(i, idx) {
        setLoadingTable(true)
        let dataSumber = [];
        if (sumber == 'Retur') {
            dataSumber = product[idx].purchase_return_details;
        }
        else if (sumber == 'SO') {
            dataSumber = product[idx].sales_order_details;
        }

        // console.log(dataTampil)
        let tmpTotalTallySheet = [...totalTallySheet]
        let tmpSelectProduct = [...selectedProduct]
        let tmpOptionProduct = [...optionsProduct]
        let tmpIdProductSelect = [...idProductSelect]
        let tmpProduct = [...product]
        let tmpData = [...data]
        let tmpStatusSO = [...statusSO]
        let tmpQuantity = [...quantity]
        let tmpTotalBox = [...totalBox]
        let tmpDataTampil = [...dataTampil]
        if (i >= 0) {
            if (dataTampil[idx].length == 1) {
                // pengecekan centang 
                if (sumber == 'Retur') {
                    let tmp = [];
                    for (let j = 0; j < getDataRetur.length; j++) {
                        if (getDataRetur[j].detail.code == product[idx].code) {
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
                else if (sumber == 'SO') {
                    // hapus cek 
                    let tmp = [];
                    for (let j = 0; j < getDataProduct.length; j++) {
                        if (getDataProduct[j].detail.code == product[idx].code) {
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

                tmpOptionProduct.splice(idx, 1)
                tmpSelectProduct.splice(idx, 1)
                tmpTotalTallySheet.splice(idx, 1)
                tmpIdProductSelect.splice(idx, 1)
                tmpProduct.splice(idx, 1);
                tmpData.splice(idx, 1)
                tmpStatusSO.splice(idx, 1)
                tmpQuantity.splice(idx, 1)
                tmpTotalBox.splice(idx, 1)
                tmpDataTampil.splice(idx, 1)
                setIndexPO(0)
                setIdxPesanan(0)
            }

            else {
                let selectHapus = [...tmpSelectProduct[idx]]
                tmpOptionProduct[idx].splice(i, 1)
                tmpIdProductSelect[idx].splice(i, 1)
                tmpTotalTallySheet[idx].splice(i, 1)
                selectHapus.splice(i, 1);
                tmpData[idx].splice(i, 1)
                tmpStatusSO[idx].splice(i, 1)
                tmpQuantity[idx].splice(i, 1)
                tmpTotalBox[idx].splice(i, 1)
                tmpDataTampil[idx].splice(i, 1)
                tmpSelectProduct[idx] = selectHapus
                setIndexPO(0)
                setIdxPesanan(0)
            }
            setProduct(tmpProduct)
            setSelectedProduct(tmpSelectProduct)
            setIdProductSelect(tmpIdProductSelect)
            setTotalTallySheet(tmpTotalTallySheet)
            setDataTampil(tmpDataTampil)
            setData(tmpData)
            setStatusSO(tmpStatusSO)
            setQuantity(tmpQuantity)
            setTotalBox(tmpTotalBox)
            setOptionsProduct(tmpOptionProduct)
            setLoadingTable(false)

        }
    }

    function tambahIndexProduct(kolom, baris) {
        setLoadingTable(true);
        let dataSumber = dataTampil[baris]

        const oldArray = dataSumber;
        const newArray = dataSumber[kolom];
        let arr = [];

        for (let r = 0; r <= kolom + 1; r++) {
            if (r == kolom + 1) {
                arr.push(newArray)
            }
            else {
                arr.push(oldArray[r])
            }
        }

        for (let r = arr.length; r <= oldArray.length; r++) {
            arr.push(oldArray[r - 1])
        }

        let tmp = [];
        let qty = [];
        let box = [];
        let temp = [];
        let id = [];
        let value = [];
        let option = []
        let qtyPes = [];
        let status = [];
        let qtyBox_tmp = [];
        let qtyStore = [];
        let boxStore = [];
        let tempData = [];
        let idStore = [];
        let valueStore = [];
        let optionStore = [];
        let statusStore = [];
        let temp_qtyBox = [];
        let qtyPesStore = [];


        for (let x = 0; x < product.length; x++) {
            let dataSumber = dataTampil[x];

            if (x == baris) {
                for (let y = 0; y <= kolom + 1; y++) {
                    // data baru 
                    if (y == kolom + 1) {
                        qtyStore.push(0)
                        boxStore.push(0)
                        idStore.push("")

                        // ngambil jenis produk 
                        let dataOption = []
                        axios.get(`${Url}/select_products?nama_alias=${dataSumber[kolom].product_alias_name}`, {
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${auth.token}`,
                            },
                        }).then((res) => {
                            for (let idxProduk = 0; idxProduk < res.data.length; idxProduk++) {
                                dataOption.push({
                                    value: res.data[idxProduk].id,
                                    label: res.data[idxProduk].name
                                })
                            }

                        });
                        optionStore.push(dataOption)
                        valueStore.push("")
                        temp_qtyBox.push(0)
                        if (quantity[x][kolom] + dataSumber[kolom].tally_sheets_qty >= dataSumber[kolom].quantity) {
                            statusStore.push('Done')
                        }
                        else if (quantity[x][kolom] + dataSumber[kolom].tally_sheets_qty < dataSumber[kolom].quantity) {
                            statusStore.push('Next delivery')
                        }
                        qtyPesStore.push(qtyPesanan[x][kolom] - quantity[x][kolom])
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
                    }
                    else {
                        qtyStore.push(quantity[x][y])
                        boxStore.push(totalBox[x][y])
                        qtyPesStore.push(qtyPesanan[x][y])
                        tempData.push(data[x][y])
                        optionStore.push(optionsProduct[x][y])
                        valueStore.push(selectedProduct[x][y])
                        idStore.push(idProductSelect[x][y])
                        statusStore.push(statusSO[x][y])
                        temp_qtyBox.push(kuantitasBox[x][y])
                    }
                }

                // loop setelah data baru 
                for (let y = tempData.length; y <= dataSumber.length; y++) {
                    qtyStore.push(quantity[x][y - 1])
                    boxStore.push(totalBox[x][y - 1])
                    tempData.push(data[x][y - 1])
                    optionStore.push(optionsProduct[x][y - 1])
                    valueStore.push(selectedProduct[x][y - 1])
                    idStore.push(idProductSelect[x][y - 1])
                    statusStore.push(statusSO[x][y - 1])
                    qtyPesStore.push(qtyPesanan[x][y - 1])
                    temp_qtyBox.push(kuantitasBox[x][y - 1])
                }

                qty.push(qtyStore)
                box.push(boxStore)
                temp.push(tempData)
                qtyPes.push(qtyPesStore)
                id.push(idStore)
                option.push(optionStore)
                value.push(valueStore)
                status.push(statusStore)
                qtyBox_tmp.push(temp_qtyBox)
                tmp.push(arr)


            }
            else {

                tmp.push(dataTampil[x])
                qty.push(quantity[x])
                box.push(totalBox[x])
                temp.push(data[x])
                id.push(idProductSelect[x])
                option.push(optionsProduct[x])
                value.push(selectedProduct[x])
                status.push(statusSO[x])
                qtyPes.push(qtyPesanan[x])
                qtyBox_tmp.push(kuantitasBox[x])
            }
        }
        setDataTampil(tmp)

        setQuantity(qty)
        setTotalBox(box)
        setOptionsProduct(option)
        setSelectedProduct(value)
        setIdProductSelect(id)
        setStatusSO(status)
        setKuantitasBox(qtyBox_tmp)
        setQtyPesanan(qtyPes)
        setData(temp)

        console.log(temp)
        console.log(tmp)
        setLoadingTable(false)
    }

    function klikTampilSheet(indexProduct, indexPO) {
        setIndexPO(indexPO);
        setIdxPesanan(indexProduct);
        let dataSumber = [];
        if (sumber == 'Retur') {
            setProductPO(product[indexProduct].purchase_return_details);
        }
        else if (sumber == 'SO') {
            setProductPO(product[indexProduct].sales_order_details);
        }
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
            },
            {
                title: 'Qty',
                dataIndex: 'quantity',
                width: '5%',
                align: 'center',
                render(text, record) {
                    return {
                        props: {
                        },
                        children: <div>{Number(text).toFixed(2).replace('.', ',')}</div>
                    };
                }
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

        let source = dataTampil[record.key]
        let tabelData =
            [...source.map((item, i) => ({
                product_alias_name: item.product_alias_name,
                product_name:

                    sumber == 'Retur' ? item.product_name :

                        <>

                            <ReactSelect
                                className="basic-single"
                                placeholder="Pilih Produk..."
                                classNamePrefix="select"
                                value={selectedProduct[record.key][i]}
                                isLoading={isLoading}
                                isSearchable
                                options={optionsProduct[record.key][i]}
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
                                                    value={Number(qtyPesanan[idxPesanan][indexPO]).toFixed(2).toString().replace('.', ',')}
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
                                                    value={selectedProduct[idxPesanan][indexPO] == "" ? "" : selectedProduct[idxPesanan][indexPO].label}
                                                    type="Nama"
                                                    className="form-control"
                                                    id="inputNama3"
                                                    disabled
                                                />

                                            </div>
                                            <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                            <div className="col-sm-3">
                                                <input
                                                    value={Number(totalTallySheet[idxPesanan][indexPO]).toFixed(2).replace('.', ',')}
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
                status: statusSO[record.key][i] === 'Done' ? <Tag color="green" type="button" onClick={() => forceNexDeliveryProduct(record.key, i)}>{statusSO[record.key][i]}</Tag> : statusSO[record.key][i] === 'Next delivery' ? <Tag color="orange" type="button" onClick={() => forceDoneProduct(record.key, i)}>{statusSO[record.key][i]}</Tag> : <Tag color="red">{statusSO[record.key][i]}</Tag>,


                action:
                    <Space size="middle">
                        <Button
                            size='small'
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                hapusIndexProduct(i, record.key)

                            }}
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

        return <Table
            style={{ display: loadingTable ? "none" : 'block' }}
            columns={columns}
            dataSource={tabelData}
            pagination={false}
            isLoading={true}
            rowClassName={() => 'editable-row'}
        />


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





    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheets_available_purchase_returns?kode=${query}&id_pemasok=${supplier}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].code) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
            }
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].code) < 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: false
                    });
                }
            }
            setGetDataRetur(tmp);

        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplier])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheets_available_sales_orders?kode=${query}&id_pelanggan=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })

            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].code) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
            }
            for (let i = 0; i < res.data.length; i++) {
                if (tmpCentang.indexOf(res.data[i].code) < 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: false
                    });
                }
            }

            setGetDataProduct(tmp);

        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, customer])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Transaksi',
            width: '20%',
            dataIndex: 'code',
            render: (_, record) => {
                return <>{record.detail.code}</>
            }
        },
        {
            title: sumber == 'SO' ? 'Pelanggan' : 'Supplier',
            dataIndex: 'customer',
            width: '15%',
            align: 'center',
            render: (_, record) => {
                if (sumber == 'SO') {
                    return <>{record.detail.customer.name}</>

                }
                else {
                    return <>{record.detail.supplier.name}</>
                }
            }
        },
        {
            title: 'Catatan',
            dataIndex: 'notes',
            width: '30%',
            align: 'center',
            render: (_, record) => {
                return <>{record.detail.notes}</>
            }
        },
        {
            title: 'actions',
            // dataIndex: 'address',
            width: '8%',
            align: 'center',
            render: (_, record, index) => (
                <>
                    <Checkbox
                        value={record}
                        checked={record.statusCek}
                        onChange={(e) => handleCheck(e, index)}
                    />
                </>
            )
        },
    ];

    const handleCheck = (event, index) => {
        var updatedList = [...product];
        let arrData = [];
        let arrBox = [];
        let arrqty = []
        let arrKuantitas = [];
        let arrStatus = [];
        let arrQtyPesanan = [];
        let tmpDataBaru = [];
        let tmpDataCentang = [...tmpCentang]


        // perubahan data dan status ceked 
        if (sumber == 'Retur') {
            for (let i = 0; i < getDataRetur.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataRetur[i].detail,
                        statusCek: !getDataRetur[i].statusCek
                    })
                    if (!tmpDataBaru[i].statusCek) {
                        let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.code);
                        tmpDataCentang.splice(idxHapus, 1)
                    }
                    else if (tmpDataBaru[i].statusCek == true) {
                        tmpDataCentang.push(tmpDataBaru[i].detail.code)
                    }

                }
                else {
                    tmpDataBaru.push(getDataRetur[i])
                }


            }
            setGetDataRetur(tmpDataBaru)
        }
        else if (sumber == 'SO') {
            for (let i = 0; i < getDataProduct.length; i++) {
                if (i == index) {
                    tmpDataBaru.push({
                        detail: getDataProduct[i].detail,
                        statusCek: !getDataProduct[i].statusCek
                    })
                    if (!tmpDataBaru[i].statusCek) {
                        let idxHapus = tmpCentang.indexOf(tmpDataBaru[i].detail.code);
                        tmpDataCentang.splice(idxHapus, 1)
                    }
                }
                else {
                    tmpDataBaru.push(getDataProduct[i])
                }

                if (tmpDataBaru[i].statusCek == true) {
                    tmpDataCentang.push(tmpDataBaru[i].detail.code)
                }
            }
            setGetDataProduct(tmpDataBaru)
        }
        setTmpCentang(tmpDataCentang)


        if (tmpDataBaru[index].statusCek) {
            updatedList = [...product, event.target.value.detail];
            // tambah data pas di checked 
            let arrTotalTally = []
            let optProduk = [];
            let idProduk = [];
            let nameProduk = []
            let arrDataTampil = []
            let status_tmp = [];
            if (data.length == 0) {
                for (let i = 0; i < updatedList.length; i++) {
                    let tmpTotalTally = []
                    let tempData = [];
                    let tempKuantitas = [];
                    let qty = [];
                    let tempBox = [];
                    let stts = [];
                    let qtyPesanan = [];
                    let values = [];
                    let id = [];
                    let tmpDataTampil = []

                    // pengecekan transaksi 
                    let dataSumber = [];
                    if (sumber == 'Retur') {
                        dataSumber = updatedList[i].purchase_return_details;
                    }
                    else if (sumber == 'SO') {
                        dataSumber = updatedList[i].sales_order_details;
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
                        tmpTotalTally.push(0)
                        tempKuantitas.push(0);
                        qty.push(0);
                        tempBox.push(0);
                        tmpDataTampil.push(dataSumber[x])

                        // mengambil pilihan produk 
                        let dataOption = []
                        axios.get(`${Url}/select_products?nama_alias=${dataSumber[x].product_alias_name}`, {
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${auth.token}`,
                            },
                        }).then((res) => {
                            for (let idxProduk = 0; idxProduk < res.data.length; idxProduk++) {
                                dataOption.push({
                                    value: res.data[idxProduk].id,
                                    label: res.data[idxProduk].name
                                })
                            }

                        });
                        values.push(dataOption)
                        id.push("")
                        qtyPesanan.push(dataSumber[x].quantity)
                    }
                    arrDataTampil.push(tmpDataTampil)
                    arrStatus.push(stts);
                    arrData.push(tempData);
                    arrKuantitas[i] = tempKuantitas;
                    arrTotalTally.push(tmpTotalTally)
                    arrqty[i] = qty;
                    arrBox[i] = tempBox;
                    optProduk.push(values)
                    arrQtyPesanan.push(qtyPesanan)
                    idProduk.push(id)
                    nameProduk.push(id)
                }
            }
            else {
                for (let i = 0; i < updatedList.length; i++) {
                    let tempKuantitas = [];
                    let tempValues = [];
                    let tempId = [];
                    let tempStatus = [];
                    let tempQtyPesanan = [];
                    let tmpDataTampil = []
                    let tmpTotalTally = []

                    // pengecekan transaksi 
                    let dataSumber = [];
                    if (sumber == 'Retur') {
                        dataSumber = updatedList[i].purchase_return_details;
                    }
                    else if (sumber == 'SO') {
                        dataSumber = updatedList[i].sales_order_details;
                    }


                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < dataSumber.length; x++) {
                            tempKuantitas.push(0);

                            // ngambil jenis produk 
                            let dataOption = []
                            axios.get(`${Url}/select_products?nama_alias=${dataSumber[x].product_alias_name}`, {
                                headers: {
                                    Accept: "application/json",
                                    Authorization: `Bearer ${auth.token}`,
                                },
                            }).then((res) => {
                                // console.log(res.data)
                                for (let idxProduk = 0; idxProduk < res.data.length; idxProduk++) {
                                    dataOption.push({
                                        value: res.data[idxProduk].id,
                                        label: res.data[idxProduk].name
                                    })
                                }

                            });
                            tempValues.push(dataOption)

                            tempId.push("");
                            if (dataSumber[x].tally_sheets_qty >= dataSumber[x].quantity) {
                                tempStatus.push('Done')
                            }
                            else if (dataSumber[x].tally_sheets_qty < dataSumber[x].quantity) {
                                tempStatus.push('Next delivery')

                            }

                            tmpDataTampil.push(dataSumber[x])
                            tempQtyPesanan.push(dataSumber[x].quantity)
                            tmpTotalTally.push(0)
                        }
                        arrKuantitas[i] = tempKuantitas;
                        optProduk.push(tempValues)
                        idProduk.push(tempId)
                        nameProduk.push(tempId)
                        arrStatus.push(tempStatus)
                        arrDataTampil.push(tmpDataTampil)
                        arrTotalTally.push(tmpTotalTally)
                        arrQtyPesanan.push(tempQtyPesanan)
                    }
                    else {
                        arrKuantitas[i] = kuantitasBox[i]
                        optProduk.push(optionsProduct[i])
                        idProduk.push(idProductSelect[i])
                        nameProduk.push(selectedProduct[i])
                        arrStatus.push(statusSO[i])
                        arrDataTampil.push(dataTampil[i])
                        arrQtyPesanan.push(qtyPesanan[i])
                        arrTotalTally.push(totalTallySheet[i])
                    }
                }

                for (let i = 0; i < updatedList.length; i++) {
                    let qty = [];
                    let tempBox = [];
                    let tempStts = [];
                    let tempQty = [];
                    // pengecekan transaksi 
                    let dataSumber = [];
                    if (sumber == 'Retur') {
                        dataSumber = updatedList[i].purchase_return_details;
                    }
                    else if (sumber == 'SO') {
                        dataSumber = updatedList[i].sales_order_details;
                    }

                    if (i == updatedList.length - 1) {
                        for (let x = 0; x < dataSumber.length; x++) {
                            qty.push(0);
                            tempBox.push(0);
                            if (dataSumber[x].tally_sheets_qty >= dataSumber[x].quantity) {
                                tempStts.push('Done')
                            }
                            else if (dataSumber[x].tally_sheets_qty < dataSumber[x].quantity) {
                                tempStts.push('Next delivery')

                            }
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
                    // pengecekan transaksi 
                    let dataSumber = [];
                    if (sumber == 'Retur') {
                        dataSumber = updatedList[i].purchase_return_details;
                    }
                    else if (sumber == 'SO') {
                        dataSumber = updatedList[i].sales_order_details;
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

            }
            setKuantitasBox(arrKuantitas);
            setData(arrData);
            setTotalTallySheet(arrTotalTally)
            setTotalBox(arrBox);
            setQuantity(arrqty);
            setQtyPesanan(arrQtyPesanan);
            setStatusSO(arrStatus)
            setGetDataDetailSO(updatedList.map(d => d.sales_order_details))

            // product pilihan 
            setOptionsProduct(optProduk)
            setSelectedProduct(nameProduk)
            setIdProductSelect(idProduk)
            setDataTampil(arrDataTampil)
        }

        // non cek 
        else {
            for (let i = 0; i < updatedList.length; i++) {

                if (updatedList[i].code == event.target.value.detail.code) {
                    updatedList.splice(i, 1);
                    kuantitasBox.splice(i, 1);
                    data.splice(i, 1);
                    totalBox.splice(i, 1);
                    quantity.splice(i, 1);
                    statusSO.splice(i, 1);
                    totalTallySheet.splice(i, 1)
                    dataTampil.splice(i, 1)
                    qtyPesanan.splice(i, 1);
                    optionsProduct.splice(i, 1);
                }
            }
            setIdxPesanan(0)

        }

        setProduct(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!warehouse) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Gudang kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (sumber == 'SO' && !customer) {

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Customer kosong, Silahkan Lengkapi datanya ",
            });

        }
        else if (sumber == 'Retur' && !supplier) {

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {


            const userData = new FormData();
            userData.append("tanggal", date);
            userData.append("gudang", warehouse);
            userData.append("catatan", description);
            userData.append("status", "Submitted");

            product.map((p, pi) => {
                dataTampil[pi].map((item, i) => {
                    if (sumber == 'SO') {
                        userData.append("id_pesanan_penjualan[]", dataTampil[pi][i].sales_order_id);
                        userData.append("satuan_box[]", dataTampil[pi][i].unit);
                        userData.append("pelanggan", customer);
                        userData.append("id_produk[]", selectedProduct[pi][i].value);
                        userData.append("aksi[]", statusSO[pi][i]);
                        userData.append("jumlah_box[]", totalBox[pi][i]);
                    }
                    else {
                        userData.append("id_retur_pembelian[]", dataTampil[pi][i].purchase_return_id);
                        userData.append("id_produk[]", dataTampil[pi][i].product_id);
                        userData.append("satuan_box[]", dataTampil[pi][i].unit);
                        userData.append("pemasok", supplier);
                        userData.append("aksi[]", statusSO[pi][i]);
                        userData.append("jumlah_box[]", totalBox[pi][i]);
                    }
                })


            });


            let key = 0;
            for (let idx = 0; idx < kuantitasBox.length; idx++) {
                for (let x = 0; x < kuantitasBox[idx].length; x++) {
                    for (let y = 0; y < kuantitasBox[idx][x].length; y++) {
                        userData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + y + "]", kuantitasBox[idx][x][y].toString().replace(',', '.'))
                    }
                    key++;
                }
            }

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
                            text: "Data belum lengkap, silahkan lengkapi datanya",
                            //text: err.response.data.error,
                        });
                    } else if (err.request) {
                        console.log("err.request ", err.request);
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    } else if (err.message) {
                        // do something other than the other two
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    }
                });
        }
    };

    const handleDraft = async (e) => {
        e.preventDefault();

        // console.log("hai")

        if (!date) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Tanggal kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (!warehouse) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Gudang kosong, Silahkan Lengkapi datanya ",
            });
        }
        else if (sumber == 'SO' && !customer) {

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Customer kosong, Silahkan Lengkapi datanya ",
            });

        }
        else if (sumber == 'Retur' && !supplier) {

            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Supplier kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {

            console.log(dataTampil)
            console.log(selectedProduct)
            const userData = new FormData();
            userData.append("tanggal", date);
            userData.append("gudang", warehouse);
            userData.append("catatan", description);
            userData.append("status", "Draft");

            product.map((p, pi) => {
                dataTampil[pi].map((item, i) => {
                    if (sumber == 'SO') {
                        userData.append("id_pesanan_penjualan[]", dataTampil[pi][i].sales_order_id);
                        userData.append("satuan_box[]", dataTampil[pi][i].unit);
                        userData.append("pelanggan", customer);
                        userData.append("id_produk[]", selectedProduct[pi][i].value);
                        userData.append("aksi[]", statusSO[pi][i]);
                        userData.append("jumlah_box[]", totalBox[pi][i]);
                    }
                    else {
                        userData.append("id_retur_pembelian[]", dataTampil[pi][i].purchase_return_id);
                        userData.append("id_produk[]", dataTampil[pi][i].product_id);
                        userData.append("satuan_box[]", dataTampil[pi][i].unit);
                        userData.append("pemasok", supplier);
                        userData.append("aksi[]", statusSO[pi][i]);
                        userData.append("jumlah_box[]", totalBox[pi][i]);
                    }
                })


            });


            let key = 0;
            for (let idx = 0; idx < kuantitasBox.length; idx++) {
                for (let x = 0; x < kuantitasBox[idx].length; x++) {
                    for (let y = 0; y < kuantitasBox[idx][x].length; y++) {
                        userData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + y + "]", kuantitasBox[idx][x][y].toString().replace(',', '.'))
                    }
                    key++;
                }
            }


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
                            text: "Data belum lengkap, silahkan lengkapi datanya"
                            //text: err.response.data.error.nama,
                        });
                    } else if (err.request) {
                        console.log("err.request ", err.request);
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    } else if (err.message) {
                        // do something other than the other two
                        Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
                    }
                });
        }
    };

    function klikUbahSumber(value) {
        if (!value) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Data Jenis Transaksi kosong, Silahkan Lengkapi datanya ",
            });
        }
        else {
            setSumber(value);
            setProduct([])
            setSelectedSupplier('');
            setSelectedCustomer('')
        }
    }

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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Tally Sheet</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <select
                                    onChange={(e) => klikUbahSumber(e.target.value)}
                                    id="grupSelect"
                                    className="form-select"
                                >
                                    <option value="">Pilih Transaksi</option>
                                    <option value="SO">
                                        Penjualan
                                    </option>
                                    <option value="Retur" >
                                        Retur Pembelian
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'flex' : 'none' }}>
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
                        <div className="row mb-3" style={{ display: sumber == 'SO' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pelanggan</label>
                            <div className="col-sm-7">
                                <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
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
                title={sumber == 'SO' ? "Daftar Pesanan" : "Daftar Retur Pembelian"}
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            if (sumber == '') {
                                Swal.fire("Gagal", "Mohon Pilih Transaksi Dahulu..", "error");
                            }
                            else {
                                setModal2Visible(true)
                            }
                        }}
                    />,
                    <Modal
                        title={sumber == 'SO' ? 'Tambah Pesanan Penjualan' : 'Tambah Retur Pembelian'}
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
                                        placeholder={sumber == 'SO' ? 'Cari Pesanan Penjualan...' : 'Cari Retur Pembelian...'}
                                        style={{
                                            width: 400,
                                        }}
                                        onChange={(e) => setQuery(e.target.value.toLowerCase())}
                                    />
                                </div>
                                {
                                    sumber == 'SO' ?
                                        <Table
                                            columns={columnsModal}
                                            dataSource={getDataProduct}
                                            scroll={{
                                                y: 250,
                                            }}
                                            pagination={false}
                                            loading={isLoading}
                                            size="middle"
                                        /> : <Table
                                            columns={columnsModal}
                                            dataSource={getDataRetur}
                                            scroll={{
                                                y: 250,
                                            }}
                                            pagination={false}
                                            loading={isLoading}
                                            size="middle"
                                        />
                                }

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
                <br />

                <div className="btn-group mt-2" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
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
                    {/* <button
                        type="button"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{ clear: 'both' }}></div>
            </PageHeader>
        </>
    )
}

export default BuatTally