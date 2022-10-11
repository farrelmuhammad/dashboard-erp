import './form.css'
import { Button, Checkbox, Form, Input, InputNumber, Menu, Modal, Select, Space, Table, Tag } from 'antd'
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
import { PageHeader } from 'antd';


const EditTallySheet = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const auth = useSelector(state => state.auth);
    const [modal2Visible, setModal2Visible] = useState(false)
    const [query, setQuery] = useState("")
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getTallySheet, setGetTallySheet] = useState([])
    const [loadingTable, setLoadingTable] = useState(false);
    const [delIndex, setDelIndex] = useState([]);
    const [data, setData] = useState([]);
    const [dataSheet, setDataSheet] = useState([]);
    const [loadingSpreedSheet, setLoadingSpreadSheet] = useState(false);
    const [totalBox, setTotalBox] = useState([]);
    const [quantity, setQuantity] = useState([]);
    const [indexPO, setIndexPO] = useState(0);
    const [kuantitasBox, setKuantitasBox] = useState([]);
    const [idxPesanan, setIdxPesanan] = useState(0);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [modal2Visible2, setModal2Visible2] = useState(false);
    const [getDataProduct, setGetDataProduct] = useState()
    const [getDataDetailPO, setGetDataDetailPO] = useState('');
    const [detailTallySheet, setDetailTallySheet] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [getStatus, setStatus] = useState();
    const [qty, setQty] = useState([]);
    const [box, setBox] = useState([])
    const [totalTallySheet, setTotalTallySheet] = useState([])
    const [quantityPO, setQuantityPO] = useState()
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
                setGetTallySheet(getData)
                setDetailTallySheet(getData.tally_sheet_details);
                setStatus(getData.status);
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
                        let tempData = []
                        kuantitas = []
                        let qtyPesanan = getData.tally_sheet_details[i].purchase_order_qty
                        let qtyTally = getData.tally_sheet_details[i].tally_sheets_qty
                        let qtySisa = Number(getData.tally_sheet_details[i].purchase_order_qty) - Number(getData.tally_sheet_details[i].tally_sheets_qty);
                        console.log(qtySisa)
                        tmp.push({
                            id_produk: getData.tally_sheet_details[i].product_id,
                            id_pesanan_pembelian: getData.tally_sheet_details[i].purchase_order.id,
                            code: getData.tally_sheet_details[i].purchase_order.code,
                            boxes_quantity: getData.tally_sheet_details[i].boxes_quantity,
                            number_of_boxes: getData.tally_sheet_details[i].number_of_boxes,
                            boxes_unit: getData.tally_sheet_details[i].boxes_unit,
                            product_name: getData.tally_sheet_details[i].product_name,
                            action: qtyTally >= qtyPesanan ? 'Done' : 'Next delivery',
                            purchase_order_qty: qtySisa,
                            tally_sheets_qty: qtyTally,
                            key: "lama"
                        })

                        tmpBox.push(getData.tally_sheet_details[i].number_of_boxes);
                        tmpTally.push(getData.tally_sheet_details[i].boxes_quantity)
                        for (let x = 0; x <= 10; x++) {
                            let baris = []
                            let kolom = [];
                            for (let y = 0; y <= 10; y++) {
                                if (x == 0) {
                                    if (y == 0) {
                                        kolom.push({ readOnly: true, value: "" })
                                    }
                                    else {
                                        kolom.push({ value: huruf[y - 1], readOnly: true })
                                    }

                                }
                                else {
                                    if (y == 0) {
                                        kolom.push(
                                            { readOnly: true, value: x }

                                        );

                                    }
                                    else if (y <= getData.tally_sheet_details[i].boxes.length && x == 1) {
                                        kolom.push(
                                            { value: getData.tally_sheet_details[i].boxes[y - 1].quantity.replace('.', ',') }
                                        );

                                        kuantitas.push(getData.tally_sheet_details[i].boxes[y - 1].quantity);


                                    }
                                    else {
                                        kolom.push(
                                            { value: '' },
                                        );
                                    }
                                    baris.push(kolom)

                                }


                            }
                            tempData.push(kolom);
                        }
                        arrKuantitas.push(kuantitas);
                        arrData.push(tempData)
                    }
                    setProduct(tmp)
                    setKuantitasBox(arrKuantitas);
                    setTotalTallySheet(tmpTally);
                    setData(arrData);
                    setQty(tmpQty);
                    setBox(tmpBox)

                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        console.log(getTallySheet.supplier_id)
        const getProduct = async () => {
            const res = await axios.get(`${Url}/tally_sheet_ins_available_purchase_orders?include_tally_sheet_purchase_orders=${id}&kode=${query}&id_pemasok=${getTallySheet.supplier_id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            console.log(res.data.data)
            setGetDataProduct(res.data.data);
            setGetDataDetailPO(res.data.data.map(d => d.purchase_order_details))
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query, getTallySheet])

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
        // const tempGrid = [];
        console.log(changes)
        const newGrid = [];

        // tempGrid[indexPO] = data[idxPesanan][indexPO];
        newGrid[indexPO] = data[indexPO];

        // menyimpan perubahan 
        changes.forEach(({ cell, row, col, value }) => {

            for (let x = 0; x < product.length; x++) {
                if (x === indexPO) {
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
                    id_pesanan_pembelian: product[i].id_pesanan_pembelian,
                    code: product[i].code,
                    boxes_quantity: totTly[i].toString(),
                    number_of_boxes: total[i],
                    boxes_unit: product[i].boxes_unit,
                    product_name: product[i].product_name,
                    action: totTly[i] >= product[i].purchase_order_qty ? 'Done' : 'Next delivery',
                    purchase_order_qty: product[i].purchase_order_qty,
                    tally_sheets_qty: product[i].tally_sheets_qty,
                    key: product[i].key
                })
            }
            else {
                tmp.push(product[i])
            }

        }
        console.log(tmp)
        setProduct(tmp)
    };

    function hapusIndexProduct(index) {
        console.log(index)
        setLoadingTable(true);
        // for (let x = 0; x < dataTS.length; x++) {
        product.splice(index, 1);
        data.splice(index, 1);
        setIndexPO(0)
        console.log(product)

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data berhasil dihapus',
        }).then(() => setLoadingTable(false));
        // }

        // console.log(dataTS)

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
                            product_name: product[i].product_name,
                            action: 'Done',
                            purchase_order_qty: product[i].purchase_order_qty,
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
        if (product[index].boxes_quantity >= product[index].purchase_order_qty) {
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
                                product_name: product[i].product_name,
                                action: 'Next delivery',
                                purchase_order_qty: product[i].purchase_order_qty,
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
            quantity: item.boxes_quantity.toString().replace('.', ','),
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
                        onOk={() => setModal2Visible2(false)}
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
                                                value={product[indexPO].boxes_quantity.toString().replace('.', ',')}
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
            title: 'Supplier',
            dataIndex: 'supplier_name',
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
        let arrData = [];

        if (event.target.checked) {
            const value = event.target.value;
            const panjang = value.purchase_order_details.length;

            let tmp = [];
            // setting baris 
            for (let i = 0; i <= product.length; i++) {
                if (i == product.length) {
                    for (let x = 0; x < value.purchase_order_details.length; x++) {
                        let qtyAwal = value.purchase_order_details[x].quantity;
                        let qtyAkhir = value.purchase_order_details[x].tally_sheets_qty;
                        if (qtyAkhir < qtyAwal) {
                            tmp.push({
                                id_produk: value.purchase_order_details[x].product_id,
                                id_pesanan_pembelian: value.id,
                                code: value.code,
                                boxes_quantity: 0,
                                number_of_boxes: 0,
                                boxes_unit: value.purchase_order_details[x].unit,
                                product_name: value.purchase_order_details[x].product_name,
                                action: qtyAkhir >= qtyAwal ? 'Done' : 'Next delivery',
                                purchase_order_qty: Number(qtyAwal) - Number(qtyAkhir),
                                tally_sheets_qty: qtyAkhir,
                                key: "baru"
                            })
                        }


                    }
                }
                else (
                    tmp.push(product[i])
                )
            }
            updatedList = tmp

            // setting data 
            for (let i = 0; i < updatedList.length; i++) {
                if (i < updatedList.length - panjang) {
                    arrData[i] = data[i];
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
            setProduct(updatedList);
            setData(arrData);

        }
        else {
            const value = event.target.value;
            for (let i = 0; i < updatedList.length; i++) {
                for (let x = 0; x < value.purchase_order_details.length; x++) {
                    if (updatedList[i].id_pesanan_pembelian == value.id && updatedList[i].id_produk == value.purchase_order_details[x].product_id && updatedList[i].key == "baru") {
                        // console.log("kehpaus")
                        updatedList.splice(i, 1);
                        data.splice(i, 1);
                        setIndexPO(0)
                    }
                }
            }
        }
        // console.log(updatedList)
        // console.log(data);
        setProduct(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tallySheetData = new URLSearchParams();
        tallySheetData.append("tanggal", getTallySheet.date);
        tallySheetData.append("pemasok", getTallySheet.supplier_id);
        tallySheetData.append("gudang", getTallySheet.warehouse_id);
        tallySheetData.append("catatan", getTallySheet.notes);
        tallySheetData.append("status", "Submitted");
        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", p.id_produk);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            tallySheetData.append("aksi[]", p.action);
            tallySheetData.append("id_pesanan_pembelian[]", p.id_pesanan_pembelian);
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
        tallySheetData.append("tanggal", getTallySheet.date);
        tallySheetData.append("pemasok", getTallySheet.supplier_id);
        tallySheetData.append("gudang", getTallySheet.warehouse_id);
        tallySheetData.append("catatan", getTallySheet.notes);
        tallySheetData.append("status", "Draft");
        product.map((p, pi) => {
            tallySheetData.append("id_produk[]", p.id_produk);
            tallySheetData.append("jumlah_box[]", p.number_of_boxes);
            tallySheetData.append("aksi[]", p.action);
            tallySheetData.append("satuan_box[]", p.boxes_unit);
            tallySheetData.append("kuantitas_box[]", p.boxes_quantity);
            tallySheetData.append("id_pesanan_pembelian[]", p.id_pesanan_pembelian);
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
        console.log(data)
        // console.log(product[indexPO].purchase_order_qty)
        // setQuantityTally(product[indexPO].boxes_quantity)
        // console.log(product)
        setQuantityPO(product[indexPO].purchase_order_qty.toFixed(2).toString())
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
            <form className="  p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title="Edit Tally Sheet">
                    </PageHeader>
                    {/* <h3 className="title fw-bold">Detail Tally Sheet</h3> */}
                </div>
                <div class="row">
                    <div class="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.date} id="startDate" className="form-control" type="date" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.code} type="Nama" className="form-control" id="inputNama3" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Supplier</label>
                            <div className="col-sm-7">
                                <input disabled="true" value={getTallySheet.supplier_name} id="startDate" className="form-control" type="text" />

                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang</label>
                            <div className="col-sm-7">
                                <input disabled="true" type="text" value={getTallySheet.warehouse_name} className="form-control" id="inputNama3" />
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Catatan</label>
                        <div className="row mb-3">
                            <div className="col-sm-10">
                                <textarea disabled="true" value={getTallySheet.notes} className="form-control" id="form4Example3" rows="4" />
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
                            <h4 className="title fw-normal">Daftar Pesanan</h4>
                        </div>
                        <div className="col text-end me-2">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Pesanan"
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
                                                placeholder="Cari Nomor Pesanan.."
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
                        dataSource={dataPurchase}
                        // expandable={{ expandedRowRender }}
                        // defaultExpandAllRows
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
                    <button
                        type="button"
                        width="100px"
                        className="btn btn-warning rounded m-1">
                        Cetak
                    </button>
                </div>
                <div style={{ clear: 'both' }}></div>
            </form>
            {/* <form className="  p-3 mb-5 bg-body rounded">
                <div className="text-title text-start mb-4">
                    <div class="row">
                        <div class="col">
                            <h4 className="title fw-normal">Cari Produk</h4>
                        </div>
                        <div class="col-sm-3 me-5">
                        <div class="input-group">
                            <input type="text" class="form-control" id="inlineFormInputGroupUsername" placeholder="Type..."/>
                            <div class="input-group-text">Search</div>
                        </div>
                        </div>
                    </div>
                <ProdukPesananTable />
                </div>
            <div class="row p-0">
                <div class="col ms-5">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        <label class="form-check-label" for="flexCheckDefault">
                            Harga Termasuk Pajak
                        </label>
                    </div>
                </div>
                <div class="col">
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                        <div class="col-sm-6">
                            <input type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                        <div class="col-sm-6">
                            <input type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                        <div class="col-sm-6">
                            <input type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Total</label>
                        <div class="col-sm-6">
                            <input type="email" class="form-control form-control-sm" id="colFormLabelSm"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" class="btn btn-success rounded m-1">Simpan</button>
                <button type="button" class="btn btn-primary rounded m-1">Submit</button>
                <button type="button" class="btn btn-warning rounded m-1">Cetak</button>
            </div>
            </form> */}
        </>
    )
}

export default EditTallySheet