import './form.css'
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Skeleton, Space, Table, Tag } from 'antd'
import { DeleteOutlined, LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import ProdukPesananTable from '../../../components/moleculles/PesananTable/ProdukPesananTable'
import Search from 'antd/lib/transfer/search'
import axios from 'axios'
import Url from '../../../Config';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ReactDataSheet from 'react-datasheet'
import Swal from 'sweetalert2';
import AsyncSelect from "react-select/async";
import ReactSelect from 'react-select';
import { PageHeader } from 'antd';
import { number } from 'yup/lib/locale'
import { getElementError } from '@testing-library/react'
import { display } from '@mui/system'

const EditTally = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const auth = useSelector(state => state.auth);
    const [modal2Visible, setModal2Visible] = useState(false)
    const [query, setQuery] = useState("")
    const [customer, setCustomer] = useState("");
    const [supplier, setSupplier] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [warehouse, setWarehouse] = useState("");
    const [warehouseName, setWarehouseName] = useState("");
    const [product, setProduct] = useState([]);
    const [productNoEdit, setProductNoEdit] = useState([])
    const [sheetNoEdit, setSheetNoEdit] = useState([])
    const [loading, setLoading] = useState(true);
    const [catatan, setCatatan] = useState('')
    const [getTallySheet, setGetTallySheet] = useState([])
    const [loadingTable, setLoadingTable] = useState(false);
    const [delIndex, setDelIndex] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [optionsProduct, setOptionsProduct] = useState([]);
    const [dataTampil, setDataTampil] = useState([]);
    const [selectedProductNoEdit, setSelectedProductNoEdit] = useState([]);
    const [data, setData] = useState([]);
    const [loadingSpreedSheet, setLoadingSpreadSheet] = useState(false);
    const [totalBox, setTotalBox] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [indexSO, setIndexSO] = useState(0);
    const [kuantitasBox, setKuantitasBox] = useState([]);
    const [idxPesanan, setIdxPesanan] = useState(0);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [modal2Visible2, setModal2Visible2] = useState(false);
    const [getDataProduct, setGetDataProduct] = useState()
    const [codeProduct, setCodeProduct] = useState([])
    const [getDataRetur, setGetDataRetur] = useState()
    const [getDataDetailPO, setGetDataDetailPO] = useState('');
    const [detailTallySheet, setDetailTallySheet] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [getStatus, setStatus] = useState();
    const [qty, setQty] = useState([]);
    const [box, setBox] = useState([])
    const [totalTallySheet, setTotalTallySheet] = useState([])
    const [quantityPO, setQuantityPO] = useState()
    const [qtyPesanan, setQtyPesanan] = useState([])
    const [statusSO, setStatusSO] = useState([]);
    const [productId, setProductId] = useState([]);
    const [productIdNoEdit, setProductIdNoEdit] = useState([]);
    const [sumber, setSumber] = useState()
    const [productSelectName, setProductSelectName] = useState([]);
    const [tampil, setTampil] = useState(true)

    // const [quantityTally, setQuantityPO] = useState()
    const valueRenderer = (cell) => cell.value;
    const onContextMenu = (e, cell, i, j) =>
        cell.readOnly ? e.preventDefault() : null;

    useEffect(() => {
        axios.get(`${Url}/tally_sheets?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                const getData = res.data.data[0];
                let dataTallySheet = getData.tally_sheet_details;
                setGetTallySheet(getData)
                if (getData.customer_id) {
                    setSelectedCustomer(getData.customer_name)
                    setCustomer(getData.customer_id)
                    setSumber('SO')
                }
                else {
                    setSelectedSupplier(getData.supplier_name)
                    setSupplier(getData.supplier_id)
                    setSumber('Retur')
                }
                if (getData.notes || getData.notes != null) {
                    setCatatan(getData.notes)

                }
                setWarehouse(getData.warehouse.id)
                setWarehouseName(getData.warehouse.name)
                setProductSelectName(dataTallySheet[0].product_name)
                setDetailTallySheet(dataTallySheet);
                setStatus(getData.status);

                let arrData = [];
                let arrDataLama = [];
                let tmpQty = []
                let tmpBox = []
                let tmpTally = []
                let arrKuantitas = []
                let tmpProductName = []
                let tmpProductId = []
                let kuantitas = [];
                let tmp = []
                let dataOption = []
                let values = []
                let tmpCodeProduk = []
                let huruf = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

                if (data.length == 0) {

                    for (let i = 0; i < dataTallySheet.length; i++) {
                        let tempData = []
                        let tempDataLama = []
                        kuantitas = []
                        // dataOption = []
                        let id_pesanan_pembelian;
                        let number_order_qty;
                        let code;
                        if (getData.customer_id) {
                            id_pesanan_pembelian = dataTallySheet[i].sales_order.id;
                            code = dataTallySheet[i].sales_order.code
                            number_order_qty = dataTallySheet[i].sales_order_qty
                        }
                        else {
                            id_pesanan_pembelian = dataTallySheet[i].purchase_return.id;
                            code = dataTallySheet[i].purchase_return.code
                            number_order_qty = dataTallySheet[i].purchase_return_qty
                        }

                        tmp.push({
                            id_produk: dataTallySheet[i].product_id,
                            id_pesanan_pembelian: id_pesanan_pembelian,
                            code: code,
                            boxes_quantity: dataTallySheet[i].boxes_quantity,
                            number_of_boxes: dataTallySheet[i].number_of_boxes,
                            boxes_unit: dataTallySheet[i].boxes_unit,
                            product_alias_name: dataTallySheet[i].product_alias_name,
                            product_name: dataTallySheet[i].product_name,
                            action: dataTallySheet[i].action,
                            number_order_qty: number_order_qty,
                            tally_sheets_qty: Number(dataTallySheet[i].tally_sheets_qty) + Number(dataTallySheet[i].boxes_quantity),
                            tally_sheets_qty_NoEdit: dataTallySheet[i].tally_sheets_qty,
                            key: "lama"
                        })

                        // mengambil pilihan produk 
                        // console.log(dataTallySheet[i].product_alias_name)
                        axios.get(`${Url}/select_products?nama_alias=${dataTallySheet[i].product_alias_name}`, {
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${auth.token}`,
                            },
                        }).then((res) => {
                            dataOption = []

                            for (let idxProduk = 0; idxProduk < res.data.length; idxProduk++) {
                                dataOption.push({
                                    value: res.data[idxProduk].id,
                                    label: res.data[idxProduk].name
                                })
                            }
                            values.push(dataOption)
                        });

                        let jumlahBaris = (Number(getData.tally_sheet_details[i].boxes.length) / 10) + 1;
                        let jumlahKolom = getData.tally_sheet_details[i].boxes.length;
                        let buatKolom = 0
                        let indexBox = 0;
                        let statusEdit = getData.tally_sheet_details[i].editable;

                        tmpProductId.push(dataTallySheet[i].product_id)
                        tmpProductName.push({
                            value: dataTallySheet[i].product_id,
                            label: dataTallySheet[i].product_name
                        })
                        tmpBox.push(dataTallySheet[i].number_of_boxes);
                        tmpTally.push(dataTallySheet[i].boxes_quantity)
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
                        arrData.push(tempData)
                        arrDataLama.push(tempDataLama)
                        console.log(dataTallySheet[i])
                        tmpCodeProduk.push(code)
                    }
                    // console.log(values[0])
                    // let value = [...values]
                    let unik = [...new Set(tmpCodeProduk)]
                    setCodeProduct(unik)
                    setOptionsProduct(values)
                    setSelectedProduct(tmpProductName)
                    setSelectedProductNoEdit(tmpProductName)
                    setProductId(tmpProductId)
                    setProductIdNoEdit(tmpProductId)
                    setProduct(tmp)
                    setProductNoEdit(tmp)
                    setKuantitasBox(arrKuantitas);
                    setTotalTallySheet(tmpTally);
                    setSheetNoEdit(arrDataLama)
                    setData(arrData);
                    setQty(tmpQty);
                    setBox(tmpBox);
                    console.log(arrData)
                    console.log(arrDataLama)

                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleChangeCustomer = (value) => {
        setSelectedCustomer(value);
        setProduct([])
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

    const handleChangeWarehouse = (value) => {
        setSelectedWarehouse(value);
        setWarehouse(value.id);
    };
    // load options using API call
    const loadOptionsWarehouse = (inputValue) => {
        return axios.get(`${Url}/warehouses?virtual=0&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.data.data);
    };

    const handleChangeProduct = (value, idx) => {
        console.log(value)
        console.log(selectedProduct)
        let status = ''
        for (let i = 0; i < selectedProduct.length; i++) {
            if (selectedProduct[i].value == value.value && selectedProduct[idx].value != value.value) {
                status = 'ada'
                Swal.fire("Data Sudah Ada!", `${value.label} sudah ada di baris ${i + 1}`, "error");
            }
        }

        // jika data belum dipilih sebelumnya 
        if (status != 'ada') {
            let key = [];
            let store2 = [];

            for (let x = 0; x < data.length; x++) {
                if (x == idx) {
                    key.push(value.value)
                    // store2.push(value)
                    store2.push(value)
                } else {
                    key.push(productId[x])
                    // store2.push(selectedProduct[x])
                    store2.push(selectedProduct[x])

                }
            }
            setSelectedProduct(store2);
            setProductId(key);
        }

    };

    // load options using API call
    const loadOptionsProduct = (inputValue, alias) => {
        console.log(alias)
        console.log(inputValue)
        return fetch(`${Url}/select_products?limit=10&nama=${inputValue}&nama_alias=${alias}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheets_available_sales_orders?include_tally_sheet_sales_orders=${id}&kode=${query}&id_pelanggan=${customer}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            // console.log(product)
            // console.log(res.data)

            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                // for (let x = 0; x < product.length; x++) {

                // console.log(product.indexOf(res.data[i].code))
                if (codeProduct.indexOf(res.data[i].code) >= 0) {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: true
                    });
                }
                else {
                    tmp.push({
                        detail: res.data[i],
                        statusCek: false
                    });
                }

                // }

            }
            // let tmpUnik = new Set(tmp)
            // console.log(tmpUnik)
            setGetDataProduct(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, getTallySheet, customer, codeProduct])

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheets_available_purchase_returns?include_tally_sheet_sales_orders=${id}&kode=${query}&id_pemasok=${supplier}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            let tmp = []
            for (let i = 0; i < res.data.length; i++) {
                for (let x = 0; x < product.length; x++) {

                    if (res.data[i].code == product[x].code) {
                        tmp.push({
                            detail: res.data[i],
                            statusCek: true
                        });
                    }
                    else {
                        tmp.push({
                            detail: res.data[i],
                            statusCek: false
                        });
                    }

                }

            }
            console.log(tmp)
            setGetDataRetur(tmp)
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, supplier])

    const columns = [
        {
            title: 'No. Pesanan',
            dataIndex: 'code',
            width: '15%',
            key: 'name',
        },
        {
            title: 'Nama Alias',
            dataIndex: 'product_alias_name',
            width: '15%',
            key: 'name',
        },
        {
            title: 'Nama Product',
            dataIndex: 'product_name',
            width: '15%',
            key: 'name',
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '5%',
            align: 'center',
            editable: true,
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
            key: 'operation',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
            width: '5%',
            key: 'operation',

        },
    ];

    function simpanTallySheet(index) {

        // mencari jumlah qty dan total box 
        let total = [];
        let kuantitas = [];
        let arrKuantitas = [];

        for (let x = 0; x < product.length; x++) {
            kuantitas = [];
            if (x == index) {
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
            if (i == indexSO) {
                console.log(product[i].tally_sheets_qty)
                console.log(totalTallySheet[i])
                console.log(product[i].number_order_qty)
                tmp.push({
                    id_produk: product[i].id_produk,
                    id_pesanan_pembelian: product[i].id_pesanan_pembelian,
                    code: product[i].code,
                    boxes_quantity: totalTallySheet[i].toString(),
                    number_of_boxes: total[i],
                    boxes_unit: product[i].boxes_unit,
                    product_alias_name: product[i].product_alias_name,
                    product_name: product[i].product_name,
                    action: product[i].key == 'lama' ? Number(totalTallySheet[i]) + Number(product[i].tally_sheets_qty_NoEdit) >= product[i].number_order_qty ? 'Done' : 'Next delivery' : Number(totalTallySheet[i]) + Number(product[i - 1].tally_sheets_qty) >= product[i].number_order_qty ? 'Done' : 'Next delivery',
                    number_order_qty: product[i].number_order_qty,
                    tally_sheets_qty: product[i].key == 'lama' ? totalTallySheet[i].toString() : Number(totalTallySheet[i]) + Number(product[i - 1].tally_sheets_qty),
                    tally_sheets_qty_NoEdit: product[i].tally_sheets_qty_NoEdit,
                    key: product[i].key
                })
            }
            else {
                tmp.push(product[i])
            }
        }

        // pengecekan status yang alias dan id nya sama 
        let tmpAKhir = []
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].id_pesanan_pembelian == tmp[index].id_pesanan_pembelian && tmp[i].product_alias_name == tmp[index].product_alias_name) {
                tmpAKhir.push({
                    id_produk: tmp[i].id_produk,
                    id_pesanan_pembelian: tmp[i].id_pesanan_pembelian,
                    code: tmp[i].code,
                    boxes_quantity: tmp[i].boxes_quantity,
                    number_of_boxes: tmp[i].number_of_boxes,
                    boxes_unit: tmp[i].boxes_unit,
                    product_alias_name: tmp[i].product_alias_name,
                    product_name: tmp[i].product_name,
                    action: tmp[indexSO].action,
                    number_order_qty: tmp[i].number_order_qty,
                    tally_sheets_qty: tmp[i].tally_sheets_qty,
                    tally_sheets_qty_NoEdit: tmp[i].tally_sheets_qty_NoEdit,
                    key: tmp[i].key
                })
            }
            else {
                tmpAKhir.push(tmp[i])
            }
        }
        setProduct(tmpAKhir)
        console.log(sheetNoEdit)
        setModal2Visible2(false)
    }
    const onCellsChanged = (changes) => {
        console.log(sheetNoEdit)
        const newGrid = [];

        // tempGrid[indexSO] = data[idxPesanan][indexSO];
        newGrid[indexSO] = data[indexSO];

        // menyimpan perubahan 
        changes.forEach(({ cell, row, col, value }) => {

            for (let x = 0; x < product.length; x++) {
                if (x === indexSO) {
                    newGrid[x][row][col] = { ...data[x][row][col], value };
                }

            }
        });

        // update jumlah tally sheet 
        let totTly = [];
        for (let x = 0; x < product.length; x++) {
            totTly[x] = 0;
            for (let a = 1; a < data[x].length; a++) {
                for (let b = 1; b < data[x][a].length; b++) {
                    if (data[x][a][b].value != 0) {
                        totTly[x] = Number(totTly[x]) + Number(data[x][a][b].value.replace(',', '.'));
                    }
                }
            }
        }
        setTotalTallySheet(totTly);

        // update pada state 
        let tempData = [];
        let arrData = [];
        for (let x = 0; x < product.length; x++) {
            tempData = [];
            if (x == indexSO) {
                arrData.push(newGrid[x]);
            }
            else {
                arrData.push(data[x]);
            }
        }
        setData(arrData);

        // mencari jumlah qty dan total box 
        let total = [];
        let kuantitas = [];
        let arrKuantitas = [];

        for (let x = 0; x < product.length; x++) {
            kuantitas = [];
            if (x == indexSO) {
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
            if (i == indexSO) {
                console.log(product[i].tally_sheets_qty)
                console.log(totTly[i])
                console.log(product[i].number_order_qty)
                tmp.push({
                    id_produk: product[i].id_produk,
                    id_pesanan_pembelian: product[i].id_pesanan_pembelian,
                    code: product[i].code,
                    boxes_quantity: totTly[i].toString(),
                    number_of_boxes: total[i],
                    boxes_unit: product[i].boxes_unit,
                    product_alias_name: product[i].product_alias_name,
                    product_name: product[i].product_name,
                    action: product[i].key == 'lama' ? Number(totTly[i]) + Number(product[i].tally_sheets_qty_NoEdit) >= product[i].number_order_qty ? 'Done' : 'Next delivery' : Number(totTly[i]) + Number(product[i - 1].tally_sheets_qty) >= product[i].number_order_qty ? 'Done' : 'Next delivery',
                    number_order_qty: product[i].number_order_qty,
                    tally_sheets_qty: product[i].key == 'lama' ? totTly[i].toString() : Number(totTly[i]) + Number(product[i - 1].tally_sheets_qty),
                    tally_sheets_qty_NoEdit: product[i].tally_sheets_qty_NoEdit,
                    key: product[i].key
                })
            }
            else {
                tmp.push(product[i])
            }
        }

        // pengecekan status yang alias dan id nya sama 
        let tmpAKhir = []
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].id_pesanan_pembelian == tmp[indexSO].id_pesanan_pembelian && tmp[i].product_alias_name == tmp[indexSO].product_alias_name) {
                tmpAKhir.push({
                    id_produk: tmp[i].id_produk,
                    id_pesanan_pembelian: tmp[i].id_pesanan_pembelian,
                    code: tmp[i].code,
                    boxes_quantity: tmp[i].boxes_quantity,
                    number_of_boxes: tmp[i].number_of_boxes,
                    boxes_unit: tmp[i].boxes_unit,
                    product_alias_name: tmp[i].product_alias_name,
                    product_name: tmp[i].product_name,
                    action: tmp[indexSO].action,
                    number_order_qty: tmp[i].number_order_qty,
                    tally_sheets_qty: tmp[i].tally_sheets_qty,
                    tally_sheets_qty_NoEdit: tmp[i].tally_sheets_qty_NoEdit,
                    key: tmp[i].key
                })
            }
            else {
                tmpAKhir.push(tmp[i])
            }
        }
        setProduct(tmpAKhir)
        console.log(sheetNoEdit)

    };

    function klikTambahBaris() {
        console.log(data)
        let hasilData = [];
        let tmpData = [];
        // let defaultData 
        for (let x = 0; x < product.length; x++) {
            hasilData = [];

            if (x == indexSO) {
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
                tmpData.push(hasilData);

            }
            else {
                tmpData.push(data[x]);
            }

        } console.log(tmpData)

        setData(tmpData);
    }

    function klikHapusBaris() {
        // setLoadingSpreadSheet(true);
        let hasilData = [];
        let tmpData = [...data];
        for (let x = 0; x < product.length; x++) {
            if (x === indexSO) {

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
                            id_pesanan_pembelian: product[i].id_pesanan_pembelian,
                            code: product[i].code,
                            boxes_quantity: product[i].boxes_quantity,
                            number_of_boxes: product[i].number_of_boxes,
                            boxes_unit: product[i].boxes_unit,
                            product_alias_name: product[i].product_alias_name,
                            product_name: product[i].product_name,
                            action: 'Done',
                            number_order_qty: product[i].number_order_qty,
                            tally_sheets_qty: product[i].tally_sheets_qty,
                            tally_sheets_qty_NoEdit: product[i].tally_sheets_qty_NoEdit,
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
        console.log(product[index].tally_sheets_qty)
        console.log(product[index].boxes_quantity)
        if (product[index].boxes_quantity >= product[index].number_order_qty) {
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
                                id_pesanan_pembelian: product[i].id_pesanan_pembelian,
                                code: product[i].code,
                                boxes_quantity: product[i].boxes_quantity,
                                number_of_boxes: product[i].number_of_boxes,
                                boxes_unit: product[i].boxes_unit,
                                product_alias_name: product[i].product_alias_name,
                                product_name: product[i].product_name,
                                action: 'Next delivery',
                                number_order_qty: product[i].number_order_qty,
                                tally_sheets_qty: product[i].tally_sheets_qty,
                                tally_sheets_qty_NoEdit: product[i].tally_sheets_qty_NoEdit,
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

    function hapusIndexProduct(index) {
        console.log(product)
        let code = product[index].code;
        let jumlah = 0;
        // cek jumlah baris per produk 
        for (let i = 0; i < product.length; i++) {
            if (product[i].code == code) {
                jumlah++
            }
        }
        console.log(jumlah)

        setLoadingTable(true);
        if (sumber == 'Retur') {
            let tmp = [];
            for (let j = 0; j < getDataRetur.length; j++) {
                if (getDataRetur[j].detail.code == code) {
                    if (jumlah == 1) {
                        let idxCode = codeProduct.indexOf(getDataRetur[j].detail.code)
                        codeProduct.splice(idxCode, 1)
                        tmp.push({
                            detail: getDataRetur[j].detail,
                            statusCek: false
                        })
                    }
                    else {
                        tmp.push({
                            detail: getDataRetur[j].detail,
                            statusCek: true
                        })
                    }

                }
                else {
                    tmp.push(getDataRetur[j])
                }
            }
            setGetDataRetur(tmp)
            console.log(tmp)

        }
        else if (sumber == 'SO') {
            let tmp = [];
            for (let j = 0; j < getDataProduct.length; j++) {
                if (getDataProduct[j].detail.code == code) {
                    if (jumlah == 1) {
                        let idxCode = codeProduct.indexOf(getDataProduct[j].detail.code)
                        codeProduct.splice(idxCode, 1)
                        tmp.push({
                            detail: getDataProduct[j].detail,
                            statusCek: false
                        })
                    }
                    else {
                        tmp.push({
                            detail: getDataProduct[j].detail,
                            statusCek: true
                        })
                    }

                }
                else {
                    tmp.push(getDataProduct[j])
                }
            }
            console.log(tmp)
            setGetDataProduct(tmp)
        }

        // for (let x = 0; x < product.length; x++) {
        //     if (product[x].code == code) {
        if (index == 0 && product.length == 1) {

            setProduct([]);
            setData([])
            setIndexSO(0)
        }
        else {

            product.splice(index, 1);
            data.splice(index, 1);
            setIndexSO(0)
        }
        // }
        // }

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data berhasil dihapus',
        }).then(() => setLoadingTable(false));


        // console.log(index)
        // setLoadingTable(true);
        // // for (let x = 0; x < dataTS.length; x++) {
        // product.splice(index, 1);
        // data.splice(index, 1);
        // setIndexSO(0)
        // console.log(product)

        // Swal.fire({
        //     icon: 'success',
        //     title: 'Berhasil',
        //     text: 'Data berhasil dihapus',
        // }).then(() => setLoadingTable(false));
        // }

        // console.log(dataTS)

    }

    // console.log(product);


    function tambahIndexProduct(i) {
        setTampil(false)
        // let dataOption = [...optionsProduct]
        console.log(selectedProduct)
        setLoadingTable(true);

        if (product[i].action == 'Done') {
            Swal.fire("Gagal!", `Jumlah sudah memenuhi pesanan`, "error");
        }
        else {
            // data baris baru 
            let arr = [];
            for (let r = 0; r <= i + 1; r++) {
                if (r == i + 1) {
                    arr.push({
                        action: product[i].action,
                        boxes_quantity: 0,
                        boxes_unit: product[i].boxes_unit,
                        code: product[i].code,
                        id_pesanan_pembelian: product[i].id_pesanan_pembelian,
                        id_produk: product[i].id_produk,
                        key: "baru",
                        number_of_boxes: 0,
                        number_order_qty: product[i].number_order_qty,
                        product_alias_name: product[i].product_alias_name,
                        product_name: product[i].product_name,
                        tally_sheets_qty: product[i].tally_sheets_qty,
                        tally_sheets_qty_NoEdit: product[i].tally_sheets_qty_NoEdit
                    })
                }
                else {

                    arr.push(product[r])
                }
            }

            for (let r = arr.length; r <= product.length; r++) {
                // arr.push({
                //     action: product[r - 1].action,
                //     boxes_quantity: product[r - 1].boxes_quantity,
                //     boxes_unit: product[r - 1].boxes_unit,
                //     code: product[r - 1].code,
                //     id_pesanan_pembelian: product[r - 1].id_pesanan_pembelian,
                //     id_produk: product[r - 1].id_produk,
                //     key: "baru",
                //     number_of_boxes: product[r - 1].number_of_boxes,
                //     number_order_qty: product[r - 1].number_order_qty,
                //     product_alias_name: product[r - 1].product_alias_name,
                //     product_name: product[r - 1].product_name,
                //     tally_sheets_qty: product[r - 1].tally_sheets_qty,
                //     tally_sheets_qty_NoEdit: product[r - 1].tally_sheets_qty_NoEdit
                // })
                arr.push(product[r - 1])
            }

            let optionStore = [];
            let qtyStore = [];
            let boxStore = [];
            let tempData = [];
            let idStore = [];
            let valueStore = [];
            let statusStore = [];
            let temp_qtyBox = [];
            let qtyPesStore = [];
            let option = []
            for (let x = 0; x < arr.length; x++) {

                if (x == i + 1) {

                    qtyStore.push(0)
                    boxStore.push(0)
                    idStore.push("")
                    option.push(optionsProduct[i])
                    console.log(option)

                    valueStore.push({ id: '', name: '' })
                    temp_qtyBox.push(0)
                    if (quantity[x] + arr[x].tally_sheets_qty >= arr[x].boxes_quantity) {
                        statusStore.push('Done')
                    }
                    else if (quantity[x] + arr[x].tally_sheets_qty < arr[x].boxes_quantity) {
                        statusStore.push('Next Delivery')
                    }
                    qtyPesStore.push(qtyPesanan[x] - quantity[x])
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


                // data lainnya 
                else if (x <= i) {
                    qtyStore.push(quantity[x])
                    boxStore.push(totalBox[x])
                    qtyPesStore.push(qtyPesanan[x])
                    tempData.push(data[x])
                    valueStore.push(selectedProduct[x])
                    option.push(optionsProduct[x])
                    idStore.push(productId[x])
                    statusStore.push(statusSO[x])
                    temp_qtyBox.push(kuantitasBox[x])
                }
                else {
                    option.push(optionsProduct[x - 1])
                    qtyStore.push(quantity[x - 1])
                    boxStore.push(totalBox[x - 1])
                    tempData.push(data[x - 1])
                    valueStore.push(selectedProduct[x - 1])
                    idStore.push(productId[x - 1])
                    statusStore.push(statusSO[x - 1])
                    qtyPesStore.push(qtyPesanan[x - 1])
                    temp_qtyBox.push(kuantitasBox[x - 1])
                }

            }
            setQuantity(qtyStore)
            setTotalBox(boxStore)

            console.log(valueStore)
            setOptionsProduct(option)
            console.log(option)
            // setIdProductSelect(id)
            setProductId(idStore)
            setData(tempData)
            setSelectedProduct(valueStore)
            setStatusSO(statusStore)
            setKuantitasBox(temp_qtyBox)
            setQtyPesanan(qtyPesStore)
            setDataTampil(arr)
            setProduct(arr)
            setLoadingTable(false)
            setTampil(true)

        }
    }

    const dataPurchase =
        [...product.map((item, i) => ({
            code: item.code,
            product_alias_name: item.product_alias_name,
            product_name:
                sumber == 'Retur' ? selectedProduct[i].label :
                    // item.key == 'lama' ?
                    // <ReactSelect
                    // key={item.key + i}

                    //     className='select-antd'
                    //     placeholder="Pilih Produk..."
                    //     classNamePrefix="select"
                    //     defaultInputValue={selectedProduct[i].label}
                    //     isLoading={isLoading}
                    //     isSearchable
                    //     options={optionsProduct[i]}
                    //     onChange={(value) => handleChangeProduct(value, i)}
                    // />
                    //     :

                    <Select
                        key={item.product_alias_name + item.key + i}
                        defaultValue={selectedProduct[i].label}
                        style={{
                            width: "100%",
                        }}
                        // onChange={handleChange}
                        onChange={(_, value) => handleChangeProduct(value, i)}

                        options={optionsProduct[i]}
                    />

            // <ReactSelect
            //         className={'basic-single'}
            //         placeholder="Pilih lah aku..."
            //         classNamePrefix="select"
            //         defaultInputValue=''
            //         value={selectedProduct[i].label}
            //         isLoading={isLoading}
            //         isSearchable
            //         options={optionsProduct[i]}
            //         onChange={(value) => handleChangeProduct(value, i)}
            //     />

            ,
            quantity: Number(item.boxes_quantity).toFixed(2).toString().replace('.', ','),
            unit: item.boxes_unit,
            box:
                <>

                    <a onClick={() => klikTampilSheet(i)} style={{ color: "#1890ff" }}>
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
                                Ok
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
                                                value={product[indexSO].code}
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />
                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Pesanan</label>
                                        <div className="col-sm-3">
                                            <input
                                                value={quantityPO ? Number(quantityPO).toFixed(2).toString().replace('.', ',') : null}
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
                                                value={product[indexSO].product_name}
                                                type="Nama"
                                                className="form-control"
                                                id="inputNama3"
                                                disabled
                                            />

                                        </div>
                                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                        <div className="col-sm-3">
                                            <input
                                                value={Number(product[indexSO].tally_sheets_qty).toFixed(2).toString().replace('.', ',')}
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
                                        data={data[indexSO]}
                                        valueRenderer={valueRenderer}
                                        onContextMenu={onContextMenu}
                                        onCellsChanged={onCellsChanged}
                                    />
                                </div>
                                <div>
                                    <Button
                                        size='small'
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => klikTambahBaris()}
                                    />
                                    {
                                        data[indexSO].length - 2 > 0 ?
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
                {
                    sumber == 'SO' ? <Button
                        size='small'
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => { tambahIndexProduct(i) }}
                    /> : null
                }


            </Space>

        }))

        ];

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Pesanan',
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
            dataIndex: 'address',
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

    const handleCheck = (event, indexTransaksi) => {
        // console.log(event)
        var updatedList = [...product];
        let arrData = [];
        let dataSumber;
        let tmpDataBaru = []
        const value = event.target.value.detail;

        if (sumber == 'Retur') {
            dataSumber = value.purchase_return_details;
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
        }
        else if (sumber == 'SO') {
            dataSumber = value.sales_order_details;
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
        // console.log(tmpDataBaru)

        if (tmpDataBaru[indexTransaksi].statusCek) {

            const panjang = dataSumber.length;

            let tmp = [];
            let tmpProductName = []
            let tmpProductId = []
            for (let i = 0; i <= updatedList.length; i++) {
                if (i == updatedList.length) {
                    for (let x = 0; x < dataSumber.length; x++) {
                        let qtyAwal = dataSumber[x].quantity;
                        let qtyAkhir = dataSumber[x].tally_sheets_qty;

                        for (let j = 0; j < productNoEdit.length; j++) {
                            // console.log(productNoEdit)
                            // jika data lama yg dipilih
                            if (value.code == productNoEdit[j].code) {
                                tmp.push(
                                    productNoEdit[j]
                                )
                                tmpProductName.push(selectedProductNoEdit)
                                tmpProductId.push(productIdNoEdit)
                            }
                            else if (qtyAkhir < qtyAwal) {
                                tmp.push({
                                    id_produk: dataSumber[x].product_id,
                                    id_pesanan_pembelian: value.id,
                                    code: value.code,
                                    boxes_quantity: 0,
                                    number_of_boxes: 0,
                                    boxes_unit: dataSumber[x].unit,
                                    product_alias_name: dataSumber[x].product_alias_name,
                                    product_name: dataSumber[x].product_name,
                                    action: qtyAkhir >= qtyAwal ? 'Done' : 'Next delivery',
                                    number_order_qty: qtyAwal,
                                    tally_sheets_qty: qtyAkhir,
                                    tally_sheets_qty_NoEdit: qtyAkhir,
                                    key: "baru"
                                })
                            }
                        }



                    }
                }
                else {
                    tmp.push(product[i])
                    tmpProductId.push(productId)
                    tmpProductName.push(selectedProductNoEdit[i])
                }
            }
            updatedList = tmp
            setSelectedProduct(tmpProductName)
            setProductId(tmpProductId)

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
            console.log(updatedList)
            setProduct(updatedList);
            setData(arrData);

        }
        else {
            arrData = [...data]
            let arrProduct = [...selectedProduct]
            let arrProductId = [...productId]
            let jumlah = 0

            console.log(value)
            // menghitung baris yang no pesanannya sama 
            for (let i = 0; i < updatedList.length; i++) {
                // for (let x = 0; x < dataSumber.length; x++) {
                    if (updatedList[i].code == value.code) {
                        jumlah += 1;
                    }
                // }
            }

            // menghapus baris sesuai jumlah 
            if (jumlah != 0) {
                for (let i = 0; i < updatedList.length; i++) {
                    // for (let x = 0; x < dataSumber.length; x++) {
                        if (updatedList[i].code == value.code) {
                            updatedList.splice(i, jumlah);
                            arrData.splice(i, jumlah);
                            arrProduct.splice(i, jumlah)
                            arrProductId.splice(i, jumlah)
                            setIndexSO(0)
                        }
                    // }
                }
                setSelectedProduct(arrProduct)
                setProductId(arrProductId)
                console.log(arrProduct)
                setProduct(updatedList);
                setData(arrData)
            }
        };
    }

    const handleSubmit = async (e) => {
        console.log(product)

        e.preventDefault();
        const tallySheetData = new URLSearchParams();
        tallySheetData.append("tanggal", getTallySheet.date);
        if (sumber == 'SO') {
            tallySheetData.append("pelanggan", getTallySheet.customer_id);

        }
        if (sumber == 'Retur') {
            tallySheetData.append("pemasok", getTallySheet.supplier_id);

        }
        tallySheetData.append("gudang", getTallySheet.warehouse_id);
        tallySheetData.append("catatan", catatan);
        tallySheetData.append("status", "Submitted");
        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", productId[pi]);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            tallySheetData.append("aksi[]", p.action);
            if (sumber == 'SO') {
                tallySheetData.append("id_pesanan_penjualan[]", p.id_pesanan_pembelian);

            }
            else if (sumber == 'Retur') {
                tallySheetData.append("id_retur_pembelian[]", p.id_pesanan_pembelian);

            }
        });

        console.log(tallySheetData)
        let key = 0;
        for (let idx = 0; idx < kuantitasBox.length; idx++) {
            for (let x = 0; x < kuantitasBox[idx].length; x++) {
                tallySheetData.append("kuantitas_produk_box" + "[" + key + "]" + "[" + x + "]", kuantitasBox[idx][x])
            }
            key++;
        }

        axios({
            method: "put",
            url: `${Url}/tally_sheets/${id}`,
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
        const tallySheetData = new URLSearchParams();
        tallySheetData.append("tanggal", getTallySheet.date);
        if (sumber == 'SO') {
            tallySheetData.append("pelanggan", getTallySheet.customer_id);

        }
        if (sumber == 'Retur') {
            tallySheetData.append("pemasok", getTallySheet.supplier_id);

        }
        tallySheetData.append("gudang", getTallySheet.warehouse_id);
        tallySheetData.append("catatan", catatan);
        tallySheetData.append("status", "Draft");
        console.log(product)
        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", productId[pi]);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            tallySheetData.append("aksi[]", p.action);
            if (sumber == 'SO') {
                tallySheetData.append("id_pesanan_penjualan[]", p.id_pesanan_pembelian);

            }
            else if (sumber == 'Retur') {
                tallySheetData.append("id_retur_pembelian[]", p.id_pesanan_pembelian);

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
            url: `${Url}/tally_sheets/${id}`,
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

    function klikTampilSheet(indexSO) {
        console.log(data)
        // console.log(product[indexSO].number_order_qty)
        // setQuantityTally(product[indexSO].boxes_quantity)
        setQuantityPO(product[indexSO].number_order_qty)
        setIndexSO(indexSO);
        setModal2Visible2(true);
    }



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
                title="Edit Tally Sheet"
            >
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-4">
                                <input
                                    id="startDate"
                                    value={getTallySheet.date}
                                    className="form-control"
                                    type="date"
                                    disabled
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Tally Sheet</label>
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
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pilih Transaksi</label>
                            <div className="col-sm-7">
                                <input
                                    value={sumber == 'SO' ? 'Penjualan' : sumber == 'Retur' ? 'Retur Pembelian' : null}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3" style={{ display: sumber == 'Retur' ? 'flex' : 'none' }}>
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">

                                <AsyncSelect
                                    placeholder="Pilih Supplier..."
                                    cacheOptions
                                    defaultOptions
                                    defaultInputValue={selectedSupplier}
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
                                    defaultInputValue={warehouseName}
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
                                    defaultValue={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageHeader>

            <PageHeader
                ghost={false}
                // title="Daftar Pesanan"
                title={sumber == 'SO' ? "Daftar Pesanan" : "Daftar Surat Jalan"}
                extra={[
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModal2Visible(true)}
                    />,
                    <Modal
                        title="Tambah Pesanan Penjualan"
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
                    </Modal>
                ]}
            >

                <Table
                    bordered
                    pagination={false}
                    dataSource={dataPurchase}
                    style={{ display: tampil ? 'flex' : 'none' }}
                    // expandable={{ expandedRowRender }}
                    // defaultExpandAllRows
                    columns={columns}
                    onChange={(e) => setProduct(e.target.value)}
                />
                <br />
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
                            </button>
                        </>
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
                                </button>
                            </>
                    }
                    {/* <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button> */}
                </div>
                <div style={{ clear: 'both' }}></div>
            </PageHeader>

            {/* <form className="  p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div className="row">
                        <div className="col">
                            <h4 className="title fw-normal">Cari Produk</h4>
                        </div>
                        <div className="col-sm-3 me-5">
                        <div className="input-group">
                            <input type="text" className="form-control" id="inlineFormInputGroupUsername" placeholder="Type..."/>
                            <div className="input-group-text">Search</div>
                        </div>
                        </div>
                    </div>
                <ProdukPesananTable />
                </div>
            <div className="row p-0">
                <div className="col ms-5">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Harga Termasuk Pajak
                        </label>
                    </div>
                </div>
                <div className="col">
                    <div className="row mb-3">
                        <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                        <div className="col-sm-6">
                            <input type="email" className="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                        <div className="col-sm-6">
                            <input type="email" className="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                        <div className="col-sm-6">
                            <input type="email" className="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                        <div className="col-sm-6">
                            <input type="email" className="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" className="btn btn-success rounded m-1">Simpan</button>
                <button type="button" className="btn btn-primary rounded m-1">Submit</button>
                <button type="button" className="btn btn-warning rounded m-1">Cetak</button>
            </div>
            </form> */}
        </>
    )
}

export default EditTally