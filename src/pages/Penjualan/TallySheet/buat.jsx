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
    const [getDataRetur, setGetDataRetur] = useState('');
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
            // pengecekan transaksi 
            let dataSumber = [];
            if (sumber == 'Retur') {
                dataSumber = product[x].purchase_return_details;
            }
            else if (sumber == 'SO') {
                dataSumber = product[x].sales_order_details;
            }


            for (let i = 0; i < dataSumber.length; i++) {
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
        // console.log(value);

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
        // console.log(store2)
    };
    const loadOptionsProduct = (inputValue, alias) => {
        // console.log(inputValue)
        // console.log(namaAlias)
        return fetch(`${Url}/select_products?limit=10&nama=${inputValue}&nama_alias=${alias}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
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
            // pengecekan transaksi 
            let dataSumber = [];
            if (sumber == 'Retur') {
                dataSumber = product[x].purchase_return_details;
            }
            else if (sumber == 'SO') {
                dataSumber = product[x].sales_order_details;
            }

            for (let i = 0; i < dataSumber.length; i++) {
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
            // pengecekan transaksi 
            let dataSumber = [];
            if (sumber == 'Retur') {
                dataSumber = product[x].purchase_return_details;
            }
            else if (sumber == 'SO') {
                dataSumber = product[x].sales_order_details;
            }


            if (x === idxPesanan) {
                for (let i = 0; i < dataSumber.length; i++) {
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
                for (let i = 0; i < dataSumber.length; i++) {
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
            // pengecekan transaksi 
            let dataSumber = [];
            if (sumber == 'Retur') {
                dataSumber = product[x].purchase_return_details;
            }
            else if (sumber == 'SO') {
                dataSumber = product[x].sales_order_details;
            }

            if (x === idxPesanan) {
                for (let i = 0; i < dataSumber.length; i++) {
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
            // pengecekan transaksi 
            let dataSumber = [];
            if (sumber == 'Retur') {
                dataSumber = product[x].purchase_return_details;
            }
            else if (sumber == 'SO') {
                dataSumber = product[x].sales_order_details;
            }


            if (x === idxPesanan) {
                for (let i = 0; i < dataSumber.length; i++) {

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
        let qtySO
        let qtySebelumnya
        // pengecekan transaksi 
        let dataSumber = [];
        if (sumber == 'Retur') {

            qtySO = product[idxPesanan].purchase_return_details[i].quantity;
            qtySebelumnya = product[idxPesanan].purchase_return_details[i].tally_sheets_qty;
        }
        else if (sumber == 'SO') {
            qtySO = product[idxPesanan].sales_order_details[i].quantity;
            qtySebelumnya = product[idxPesanan].sales_order_details[i].tally_sheets_qty;
        }


        for (let x = 0; x < product.length; x++) {
            tmp = [];
            let dataSumber = [];
            if (sumber == 'Retur') {
                dataSumber = product[x].purchase_return_details;
            }
            else if (sumber == 'SO') {
                dataSumber = product[x].sales_order_details;
            }


            if (x == idxPesanan) {
                for (let i = 0; i < dataSumber.length; i++) {
                    if (i === indexPO) {
                        tmp[i] = 0;
                        tmp[i] = totalTallySheet[x][i];

                        if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) >= qtySO) {
                            stts[i] = 'Done'
                        }
                        else if (Number(totalTallySheet[x][i]) + Number(qtySebelumnya) < qtySO) {
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
        // console.log(arrStatus)
        setQuantity(arrtmp);
        setStatusSO(arrStatus);
        setModal2Visible2(false)
    }

    function hapusIndexProduct(i, idx) {
        setLoadingTable(true);
        let dataSumber = [];
        if (sumber == 'Retur') {
            dataSumber = product[idx].purchase_return_details;
        }
        else if (sumber == 'SO') {
            dataSumber = product[idx].sales_order_details;
        }


        if (i >= 0) {
            if (dataSumber.length == 1) {
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

                product.splice(idx, 1);
                data.splice(idx, 1)
                statusSO.splice(idx, 1)
                quantity.splice(idx, 1)
                totalBox.splice(idx, 1)
            } else {
                dataSumber.splice(i, 1);
                data[idx].splice(i, 1)
                statusSO[idx].splice(i, 1)
                quantity[idx].splice(i, 1)
                totalBox[idx].splice(i, 1)
            }
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil dihapus',
            }).then(() => setLoadingTable(false));
        }
    }

    function tambahIndexProduct(i, idx) {
        setLoadingTable(true);
        let dataSumber = [];
        if (sumber == 'Retur') {
            dataSumber = product[idx].purchase_return_details;
        }
        else if (sumber == 'SO') {
            dataSumber = product[idx].sales_order_details;
        }

        const oldArray = dataSumber;
        const newArray = dataSumber[i];
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

        // console.log('cek')

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
            let dataSumber = [];
            if (sumber == 'Retur') {
                dataSumber = product[x].purchase_return_details;
            }
            else if (sumber == 'SO') {
                dataSumber = product[x].sales_order_details;
            }

            if (x == idx) {
                for (let y = 0; y <= dataSumber.length; y++) {
                    if (y == i + 1) {
                        // console.log(qtyPesanan[x][i]);
                        // console.log(quantity[x][i]);
                        qtyStore.push(0)
                        boxStore.push(0)
                        idStore.push("")
                        valueStore.push("")
                        temp_qtyBox.push(0)
                        if (quantity[x][i] + dataSumber[i].tally_sheets_qty >= dataSumber[i].quantity) {
                            statusStore.push('Done')
                        }
                        else if (quantity[x][i] + dataSumber[i].tally_sheets_qty < dataSumber[i].quantity) {
                            statusStore.push('Next delivery')
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
                console.log(product)
                if (sumber == 'SO') {
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
                }
                else {
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
                        purchase_return_details: arr,
                        status: product[x].status,
                        submitted_at: product[x].submitted_at,
                        submitted_by: product[x].submitted_by,
                        subtotal: product[x].subtotal,
                        tax_included: product[x].tax_included,
                        total: product[x].total,
                        updated_at: product[x].updated_at,
                    })
                }

            }
            else {
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
        console.log(tmp)
        setQuantity(qty)
        setTotalBox(box)
        setData(temp)
        setSelectedProduct(value)
        setProductSelect(id)
        setStatusSO(status)
        setKuantitasBox(qtyBox_tmp)
        // console.log(qtyBox_tmp);
        // console.log(statusSO);
        setQtyPesanan(qtyPes)
        setProduct(tmp)
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data berhasil ditambah',
        }).then(() => setLoadingTable(false));
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
                // editable: true,
            },
            {
                title: 'Qty',
                dataIndex: 'quantity',
                width: '5%',
                align: 'center',
                // editable: true,
                render(text, record) {
                    return {
                        props: {
                        },
                        children: <div>{Number(text).toFixed(2).replace('.',',')}</div>
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

        let dataTampil;
        if (sumber == 'SO') {
            dataTampil =
                [...product[record.key].sales_order_details.map((item, i) => ({
                    product_alias_name: item.product_alias_name,
                    product_name: <>
                        <AsyncSelect
                            placeholder="Pilih Produk..."
                            cacheOptions
                            defaultOptions
                            value={selectedValue3[record.key][i]}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => e.id}
                            loadOptions={(value) => loadOptionsProduct(value, item.product_alias_name)}
                            onChange={(value) => handleChangeProduct(value, record.key, i)}
                        />
                    </>,
                    quantity: quantity[record.key][i].toString().replace('.', ','),
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
                                                        value={selectedValue3[idxPesanan][indexPO] == "" ? "" : selectedValue3[idxPesanan][indexPO].name}
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
                    status: statusSO[record.key][i] == '' ? <Tag color="red">Waiting</Tag> : statusSO[record.key][i] === 'Next delivery' ? <Tag color="orange">{statusSO[record.key][i]}</Tag> : statusSO[record.key][i] === 'Done' ? <Tag color="green">{statusSO[record.key][i]}</Tag> : null,
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
        }
        else {
            // console.log(product)
            dataTampil =
                [...product[record.key].purchase_return_details.map((item, i) => ({
                    // product_alias_name: item.product_alias_name,
                    // key: [record.key]
                    product_alias_name: item.product_alias_name,
                    product_name: item.product_name,
                    quantity: quantity[record.key][i].toString().replace('.', ','),
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
                                                        value={qtyPesanan[idxPesanan][indexPO].toString().replace('.', ',')}
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
                                                        value={sumber == 'Retur' ? product[idxPesanan].purchase_return_details[indexPO].product_name : selectedValue3[idxPesanan][indexPO] == "" ? "" : selectedValue3[idxPesanan][indexPO].name}
                                                        type="Nama"
                                                        className="form-control"
                                                        id="inputNama3"
                                                        disabled
                                                    />

                                                </div>
                                                <label htmlFor="inputNama3" className="col-sm-2 col-form-label ms-5">Qty Tally Sheet</label>
                                                <div className="col-sm-3">
                                                    <input
                                                        value={totalTallySheet[idxPesanan][indexPO].toString().replace('.', ',')}
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
                    status: statusSO[record.key][i] == '' ? <Tag color="red">Waiting</Tag> : statusSO[record.key][i] === 'Next delivery' ? <Tag color="orange">{statusSO[record.key][i]}</Tag> : statusSO[record.key][i] === 'Done' ? <Tag color="green">{statusSO[record.key][i]}</Tag> : null,
                    action:
                        <Space size="middle">
                            <Button
                                size='small'
                                type="danger"
                                icon={<DeleteOutlined />}
                                onClick={() => hapusIndexProduct(i, record.key)}
                            />
                        </Space>,
                }))

                ];

            // console.log(dataTampil)
        }


        if (sumber == 'SO') {
            return <Table
                style={{ display: loadingTable ? "none" : 'block' }}
                columns={columns}
                dataSource={dataTampil}
                pagination={false}
                isLoading={true}
                rowClassName={() => 'editable-row'}
            />
        }
        else if (sumber == 'Retur') {
            return <Table
                style={{ display: loadingTable ? "none" : 'block' }}
                columns={columns}
                dataSource={dataTampil}
                pagination={false}
                isLoading={true}
                rowClassName={() => 'editable-row'}
            />;
        }


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
                tmp.push({
                    detail: res.data[i],
                    statusCek: false
                });
            }
            setGetDataRetur(tmp);
            // setGetDataDetailSO(res.data.map(d => d.sales_order_details))
            // console.log(res.data.map(d => d.sales_order_details))
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
                tmp.push({
                    detail: res.data[i],
                    statusCek: false
                });
            }
            // console.log(tmp)
            setGetDataProduct(tmp);
            // setGetDataDetailSO(res.data.map(d => d.sales_order_details))
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


        // perubahan data dan status ceked 
        if (sumber == 'Retur') {
            for (let i = 0; i < getDataRetur.length; i++) {
                if (i == index) {
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
            for (let i = 0; i < getDataProduct.length; i++) {
                if (i == index) {
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


        if (tmpDataBaru[index].statusCek) {
            updatedList = [...product, event.target.value.detail];


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
                        tempKuantitas.push(0);
                        qty.push(0);
                        tempBox.push(0);
                        values.push("")
                        id.push("")
                        qtyPesanan.push(dataSumber[x].quantity)
                    }
                    arrStatus.push(stts);
                    arrData.push(tempData);
                    arrKuantitas[i] = tempKuantitas;
                    arrqty[i] = qty;
                    arrBox[i] = tempBox;
                    idValues.push(values)
                    arrQtyPesanan.push(qtyPesanan)
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
                            tempValues.push("");
                            tempId.push("");
                            tempStatus.push("");
                            tempQtyPesanan.push(dataSumber[x].quantity)
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
            setTotalBox(arrBox);
            setQuantity(arrqty);
            setQtyPesanan(arrQtyPesanan);
            setStatusSO(arrStatus)
            setGetDataDetailSO(updatedList.map(d => d.sales_order_details))
            setSelectedProduct(idValues)
            setProductSelect(valuesId)
            // console.log(arrQtyPesanan);
        }
        else {
            // console.log(updatedList)
            // console.log(event.target.value.detail)

            for (let i = 0; i < updatedList.length; i++) {

                if (updatedList[i] == event.target.value.detail) {
                    updatedList.splice(i, 1);
                    kuantitasBox.splice(i, 1);
                    data.splice(i, 1);
                    totalBox.splice(i, 1);
                    quantity.splice(i, 1);
                    statusSO.splice(i, 1);
                    qtyPesanan.splice(i, 1);
                    // console.log("test")

                }
            }
            // console.log(updatedList)
            setIdxPesanan(0)
            // setGetDataDetailSO(updatedList.map(d => d.sales_order_details))

        }
        // console.log(updatedList)
        setProduct(updatedList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("gudang", warehouse);
        userData.append("catatan", description);
        userData.append("status", "Submitted");
        product.map((p, pi) => {
            if (sumber == 'SO') {
                p.sales_order_details.map((po, i) => {
                    userData.append("pelanggan", customer);
                    userData.append("id_pesanan_penjualan[]", p.id);
                    userData.append("id_produk[]", productSelect[pi][i]);
                    userData.append("aksi[]", statusSO[pi][i]);
                    userData.append("jumlah_box[]", totalBox[pi][i]);
                    userData.append("satuan_box[]", po.unit);
                    // userData.append("kuantitas_product_box[]", totalTallySheet[pi][i]);
                })
            }
            else {
                p.purchase_return_details.map((po, i) => {
                    userData.append("pemasok", supplier);
                    userData.append("id_retur_pembelian[]", p.id);
                    userData.append("id_produk[]", po.product_id);
                    userData.append("aksi[]", statusSO[pi][i]);
                    userData.append("jumlah_box[]", totalBox[pi][i]);
                    userData.append("satuan_box[]", po.unit);
                    // userData.append("kuantitas_product_box[]", totalTallySheet[pi][i]);
                })
            }

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
        userData.append("status", "Draft");

        product.map((p, pi) => {
            if (sumber == 'SO') {
                p.sales_order_details.map((po, i) => {
                    userData.append("pelanggan", customer);
                    userData.append("id_pesanan_penjualan[]", p.id);
                    userData.append("id_produk[]", productSelect[pi][i]);
                    userData.append("aksi[]", statusSO[pi][i]);
                    userData.append("jumlah_box[]", totalBox[pi][i]);
                    userData.append("satuan_box[]", po.unit);
                })
            }
            else {
                p.purchase_return_details.map((po, i) => {
                    userData.append("pemasok", supplier);
                    userData.append("id_retur_pembelian[]", p.id);
                    userData.append("id_produk[]", po.product_id);
                    userData.append("aksi[]", statusSO[pi][i]);
                    userData.append("jumlah_box[]", totalBox[pi][i]);
                    userData.append("satuan_box[]", po.unit);
                    // userData.append("kuantitas_produk_box" + "[" + pi + "]" + "[" + i + "]", totalTallySheet[pi][i]);
                })
            }

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

    function klikUbahSumber(value) {
        setSumber(value);
        setProduct([])
        setSelectedSupplier('');
        setSelectedCustomer('')
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

                        {/* <div className="row mb-3">
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
                        </div> */}
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
<br/>

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