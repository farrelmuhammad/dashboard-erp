import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, PageHeader, Tooltip } from 'antd'
import { PlusOutlined, PrinterOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import ReactSelect from 'react-select';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import logo from "../../Logo.jpeg";
import { useReactToPrint } from 'react-to-print';


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
    // handleSave,
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

const DetailRetur = () => {
    // const auth.token = jsCookie.get("auth");
    const auth = useSelector(state => state.auth);
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [customer, setCustomer] = useState("");
    const [faktur, setFaktur] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();

    const [getDataFaktur, setGetDataFaktur] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [dataHeader, setDataHeader] = useState([])
    const [salesRetur, setSalesRetur] = useState([])
    const [getStatus, setGetStatus] = useState()
    const [mataUang, setMataUang] = useState('Rp.')
    const [pilihanDiskon, setPilihanDiskon] = useState('');
    const [jumlahDiskon, setJumlahDiskon] = useState([]);
    const [diskonPersen, setDiskonPersen] = useState([]);
    const [jumlahPPN, setJumlahPPN] = useState([]);

    const [pelanggan, setPelanggan] = useState('');
    const [noCode, setNoCode] = useState('')
    const [bePelanggan, setBEPelanggan] = useState('');

    const [loading, setLoading] = useState(true);

    const { id } = useParams();
    useEffect(() => {
        getDataRetur();
    }, [])
    const getDataRetur = async () => {
        await axios.get(`${Url}/sales_returns?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data.data[0]
                setDataHeader(getData)
                setGetStatus(getData.status)
                setSalesRetur(getData.sales_return_details)

                setGrandTotal(getData.total)
                setSubTotal(getData.subtotal)
                setTotalPpn(getData.ppn)
                setGrandTotalDiscount(getData.discount)

                setChecked(getData.tax_included);

                //console.log(checked)

                let disc = [];
                let ppn = [];
                
                for(let i=0; i< salesRetur.length; i++){
                    disc[i] = salesRetur[i].discount_percentage;
                    ppn[i] = salesRetur[i].ppn;  
                }
    
                setDiskonPersen(disc);
                setJumlahPPN(ppn);
                // console.log(diskonPersen)

                 //console.log(salesRetur)

                // if(getData.sales_return_details[0].currency){

                //     setMataUang(getData.purchase_return_details[0].currency)
                // }
                setLoading(false);

                setPelanggan(getData.customer.name);
                setNoCode(getData.sales_invoice.code);
                setBEPelanggan(getData.customer.business_entity);
                console.log(bePelanggan)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }


    const tableToRupiah = (angka, namaMataUang) => {
        //return namaMataUang + ' ' + angka.toLocaleString('id');
        return <>
            {
                namaMataUang === 'Rp' ?
                    < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toFixed(2).replace('.', ',')} key="diskon" />
                    : < CurrencyFormat disabled className=' text-left editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={namaMataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(angka).toLocaleString('id')} key="diskon" />

            }
        </>
    }

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

    useEffect(() => {
        getNewCodeSales()
    })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_sales_invoices?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataFaktur(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            dataIndex: 'code',
        },
        {
            title: 'Pelanggan',
            dataIndex: 'recipient',
            render: (recipient) => recipient.name,
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '15%',
            align: 'center',
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

    const defaultColumns = [
        {
            title: 'No.',
            dataIndex: '',
            width: '5%',
            align: 'center',
            render(text, record, index) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <div>{index + 1}</div>
                };
            }
        },
        {
            title: 'Nama Produk',
            dataIndex: 'product_alias_name',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Qty',
            dataIndex: 'quantity',
            width: '8%',
            align: 'center',
            editable: true,
            render(text, record) {
                return {
                    props: {
                    },
                    // children: <div>{formatQuantity(text)}</div>
                    children: <div>{Number(text).toFixed(2).replace('.', ',')}</div>
                };
            }
            
        },
        {
            title: 'Stn',
            dataIndex: 'unit',
            width: '5%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
        },
        {
            title: 'Harga',
            dataIndex: 'price',
            width: '15%',
            align: 'center',
            editable: true,
           
        },
        {
            title: 'Discount (Rp)',
            dataIndex: 'nominal_disc',
            width: '15%',
            align: 'center',
            editable: true,
            
        },
        {
            title: 'Discount (%)',
            dataIndex: 'discount',
            width: '5%',
            align: 'center',
            editable: true,
          
        },
        {
            title: 'PPN',
            dataIndex: 'ppn',
            width: '12%',
            align: 'center',
            editable: true,
        
            
        },
        {
            title: 'Jumlah',
            dataIndex: 'total',
            width: '14%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: text,
                }
            }
            // render:
            //     (text, record, index) => {
            //         let grandTotalAmount = 0;
            //         let  getPercent = 0;
            //         let totalDiscount = 0;
            //         let getPpn = 0;
            //         let  getPercent1 = 0;
            //         let  getPpn1 = 0;

            //         // console.log("masuk percent")
            //       //  let total = (record.quantity * record.price);
            //        // console.log(record.price);
            //         for(let i=0; i< salesRetur.length; i++){
            //             let subtotal = salesRetur[i].price * salesRetur[i].quantity;
            //             let s1 = subtotal - salesRetur[i].fixed_discount;
            //             totalDiscount = s1 - Number(diskonPersen[i]/100);
            //             let totalppn = totalDiscount + Number(jumlahPPN[i]/100)

            //             //getPercent1 = 1 - Number(Number(diskonPersen[i])/100)

            //             //getPercent = (salesRetur[i].price * Number(diskonPersen[i])) / 100;

            //             //console.log(getPercent1)

            //             //totalDiscount = Number(text) - getPercent;
            //             // getPpn1 = 1 + Number(jumlahPPN[i]/100);
            //             // getPpn = (totalDiscount * jumlahPPN[i]) / 100;
            //             console.log(totalppn)

            //             grandTotalAmount = Number(subtotal) * Number(getPercent1) * Number(getPpn1)

            //             if (checked) {
            //                 // grandTotalAmount = tableToRupiah(totalDiscount, "Rp");
            //                 // grandTotalAmount = totalDiscount
            //                 grandTotalAmount = subTotal * getPercent1 * getPpn1
            //             } else {
            //                 // grandTotalAmount = tableToRupiah(totalDiscount + getPpn, "Rp");
            //                 grandTotalAmount = totalDiscount + getPpn
            //             }
            //             // console.log(grandTotalAmount);
                       
            //         }
                    
                    

            //         return {
            //             props: {
            //                 style: { background: "#f5f5f5" }
            //             },
            //             children: grandTotalAmount
            //         }
            //     }
        },
    ];

    const dataProduk = [
        ...salesRetur.map((item,i) => ({
            product_alias_name: item.product_alias_name,
            quantity:item.quantity,
            unit: item.unit,
            price:  <div className='d-flex'>
             <CurrencyFormat disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} value={Number(item.price).toFixed(2).replace('.' , ',')} />
                    </div>,
            nominal_disc :  <>
            {
                item.fixed_discount == 0 ? <div> 0 </div> : 
                <div className='d-flex'>
                <CurrencyFormat disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={mataUang + ' '} value={Number(item.fixed_discount).toFixed(2).replace('.' , ',')} />
                            </div>
            }
            </>, 
            discount: <>
            {
                item.discount_percentage == 0 ? <div> 0 </div> : 
                <input disabled className=' text-center editable-input edit-disabled' value={item.discount_percentage.replace('.', ',') + '%'} key="diskon" />
            }
            </>,    
            ppn : <>
            {
                item.ppn == 0 ? <div> 0 </div> : 
                <input disabled className=' text-center editable-input edit-disabled' value={item.ppn.replace('.', ',') + '%'} key="diskon" />
            }
            </>,
            total : < CurrencyFormat disabled className=' text-center editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.total).toFixed(2).replace('.' , ',')} key="diskon" />,
          
           
        })
        )
    ]

    // const handleChange = () => {
    //     setChecked(!checked);
    //     let check_checked = !checked;
    //     calculate(salesRetur, check_checked);
    // };
    // const handleSave = (row) => {
    //     const newData = [...salesRetur];
    //     const index = newData.findIndex((item) => row.alias_name === item.alias_name);
    //     const item = newData[index];
    //     newData.splice(index, 1, { ...item, ...row });
    //     setSalesRetur(newData);
    //     let check_checked = checked;
    //     calculate(newData, check_checked);
    // };


    // const calculate = (salesRetur, check_checked) => {
    //     let subTotal = 0;
    //     let totalDiscount = 0;
    //     let totalNominalDiscount = 0;
    //     let grandTotalDiscount = 0;
    //     let getPpnDiscount = 0;
    //     let allTotalDiscount = 0;
    //     let totalPpn = 0;
    //     let grandTotal = 0;
    //     let getPpn = 0;
    //     let total = 0;
    //     let hasilDiskon = 0;
    //     let totalPerProduk = 0;
    //     let rowDiscount = 0;
    //     let subTotalDiscount = 0;

    //     salesRetur.map((values, i) => {
    //         if (check_checked) {
                
    //             total += (Number(values.quantity) * Number(values.price));
    //             totalPerProduk = (Number(values.quantity) * Number(values.price));

    //             if(pilihanDiskon[i] == 'percent'){
    //                 hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
    //                 rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
    //             }
    //             else if (pilihanDiskon[i] == 'nominal'){
    //                 hasilDiskon += Number(jumlahDiskon[i]);
    //                 rowDiscount = Number(jumlahDiskon[i]);
    //             }

    //             subTotalDiscount = totalPerProduk - rowDiscount;
    //             subTotal += (totalPerProduk * 100) / (100 + values.ppn );
    //             totalDiscount += ((rowDiscount * 100) / (100 + values.ppn));
    //             totalPpn += ((((totalPerProduk * 100) / (100 + values.ppn)) - (rowDiscount * 100) / (100 + values.ppn)) * values.ppn) / (100);
    //             grandTotal = subTotal - totalDiscount + Number(totalPpn);
                



    //             // total = (values.quantity * values.price) - values.nominal_disc;
    //             // getPpnDiscount = (total * values.discount) / 100;
    //             // totalDiscount += (total * values.discount) / 100;

    //             // totalNominalDiscount += values.nominal_disc;
    //             // grandTotalDiscount = totalDiscount + totalNominalDiscount;
    //             // subTotal += ((total - getPpnDiscount) * 100) / (100 + values.ppn);
    //             // allTotalDiscount += total - getPpnDiscount;
    //             // totalPpn = allTotalDiscount - subTotal;
    //            // grandTotal = subTotal - grandTotalDiscount + totalPpn;
    //             setSubTotal(subTotal)
    //             setGrandTotalDiscount(totalDiscount)
    //             setTotalPpn(totalPpn)
    //             setGrandTotal(grandTotal)
    //         } else {

    //             total += (Number(values.quantity) * Number(values.price));
    //             totalPerProduk = (Number(values.quantity) * Number(values.price));

    //             if(pilihanDiskon[i] == 'percent'){
    //                 hasilDiskon += (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
    //                 rowDiscount = (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
    //             }
    //             else if (pilihanDiskon[i] == 'nominal'){
    //                 hasilDiskon += Number(jumlahDiskon[i]);
    //                 rowDiscount = Number(jumlahDiskon[i]);
    //             }

    //             totalDiscount += ((totalPerProduk * jumlahDiskon[i]) / 100);
    //             subTotal = total - (Number(totalPerProduk) * Number(jumlahDiskon[i]) / 100);
    //             subTotalDiscount = totalPerProduk - rowDiscount;
    //             totalPpn += (subTotalDiscount * values.ppn) / 100;
    //             grandTotal = total - totalDiscount + Number(totalPpn);





    //             // subTotal += (values.quantity * values.price);
    //             // total = (values.quantity * values.price) - values.nominal_disc;
    //             // getPpnDiscount = (total * values.discount) / 100;
    //             // totalDiscount += (total * values.discount) / 100;

    //             // totalNominalDiscount += values.nominal_disc;
    //             // grandTotalDiscount = totalDiscount + totalNominalDiscount;
    //             // allTotalDiscount = total - getPpnDiscount;
    //             // getPpn = (allTotalDiscount * values.ppn) / 100;
    //             // totalPpn += getPpn;
    //             // grandTotal = subTotal - grandTotalDiscount + totalPpn;
    //             setSubTotal(subTotal)
    //             setGrandTotalDiscount(totalDiscount)
    //             setTotalPpn(totalPpn)
    //             setGrandTotal(grandTotal)
    //         }
    //     })
    // }

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
         copyStyles: true,
       //pageStyle: pageStyle
        
    })
      

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
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
                //handleSave,
            }),
        };
    });

    const handleCheck = (event) => {
        var updatedList = [...faktur];
        if (event.target.checked) {
            updatedList = [...faktur, event.target.value];
        } else {
            updatedList.splice(faktur.indexOf(event.target.value), 1);
        }
        setFaktur(updatedList);
    };


    const getNewCodeSales = async () => {
        await axios.get(`${Url}/get_new_sales_order_code?tanggal=${date}`, {
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
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        faktur.map((p) => {
            console.log(p);
            userData.append("id_faktur_penjualan", p.id);
            userData.append("id_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_returns`,
        //     data: userData,
        //     headers: {
        //         Accept: "application/json",
        //         Authorization: `Bearer ${auth.token}`,
        //     },
        // })
        //     .then(function (response) {
        //         //handle success
        //         Swal.fire(
        //             "Berhasil Ditambahkan",
        //             ` Masuk dalam list`,
        //             "success"
        //         );
        //         navigate("/pesanan");
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             console.log("err.response ", err.response);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 text: err.response.data.error.nama,
        //             });
        //         } else if (err.request) {
        //             console.log("err.request ", err.request);
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         } else if (err.message) {
        //             // do something other than the other two
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         }
        //     });
    };

    const handleDraft = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        faktur.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("id_product[]", p.product_id);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.delivery_note_details.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        for (var pair of userData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        // axios({
        //     method: "post",
        //     url: `${Url}/sales_returns`,
        //     data: userData,
        //     headers: {
        //         Accept: "application/json",
        //         Authorization: `Bearer ${auth.token}`,
        //     },
        // })
        //     .then(function (response) {
        //         //handle success
        //         Swal.fire(
        //             "Berhasil Ditambahkan",
        //             ` Masuk dalam list`,
        //             "success"
        //         );
        //         navigate("/pesanan");
        //     })
        //     .catch((err) => {
        //         if (err.response) {
        //             console.log("err.response ", err.response);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 text: err.response.data.error.nama,
        //             });
        //         } else if (err.request) {
        //             console.log("err.request ", err.request);
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         } else if (err.message) {
        //             // do something other than the other two
        //             Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
        //         }
        //     });
    };

    return (
        <>

<div style={{ display: "none", position:"absolute"}} >
                <div ref={componentRef} className="p-4" style={{width:"100%"}} >

  <table style={{width:"100%"}}>
    <thead>
      <tr>
        <td>
         
          <div className="page-header-space"></div>
          <div className="page-header">
          <div className='row'>
          <div className='d-flex mb-3 float-container' style={{position:"fixed", height:"100px", top:"0"}}>
                
                
               
                      <div className='col-1' style={{marginTop:"10px"}}><img src={logo} width="60px"></img></div>
                      <div className='col-4' style={{marginTop:"10px", marginRight:"100px"}}>
                      <div className='ms-2' >
                          <div className='header-cetak'><b>PT. BUMI MAESTROAYU</b></div>
                          <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                          <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                          <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                      </div>
                      </div>
                     
                
               
                <div className='col'>
                <div className='col float-child'>
                    <div className='col' width="100px"></div>

                <div className=' mt-3 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle:"bold"}}>
                    <div className='col-6'>
                          <div className="d-flex flex-row">
                          <label className='col-6'>No. Faktur</label>
                              <div className='col-12'> : {noCode}</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Tanggal</label>
                              <div className='col-8'>
                                  : { dataHeader.date }</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Kepada Yth.</label>
                              <div className='col-8'> : {
                                bePelanggan === 'Lainnya' || bePelanggan === 'lainnya' ? 
                            '' : bePelanggan} {pelanggan}  </div>
                          </div>
                      </div>
                      {/* <div className='col-6'>
                        <div className="d-flex flex-row">
                              <label className='col-8'>No. Faktur</label>
                              <div className='col-8'> : {dataHeader.purchase_invoice.code}</div>
                          </div>
                          <div className="d-flex flex-row">
                          <label className='col-8'>Tanggal</label>
                              <div className='col-6'> : {dataHeader.date}</div>
                          </div>
                         
                          <div className="d-flex flex-row">
                              <label className='col-8'>Kepada Yth. </label>
                              <div className='col-6'> : {dataHeader.supplier.business_entity} {dataHeader.supplier.name}  </div>
                          </div>
                      </div> */}
                  </div>
                </div>
                </div>

            </div>
            </div>
        
        <br/>
        <br/>
        <br/>
    
        <div className='mt-5 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign:"center"}}>
                      <div className='align-items-center' style={{ fontSize: "14px", textDecoration: "underline", textAlign:"center"}}>RETUR PENJUALAN</div>
                      <div className='align-items-center' style={{fontSize:"10px", textAlign:"center"}}>NO. {dataHeader.code}</div>
                  </div>
                    
        </div>

        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
       
        
          <div className="page" style={{lineHeight:"3"}}>
           
          <div className='mt-2 ps-4 pe-4' >

        <div className='align-items-start' style={{fontSize:"12px"}}>Kami telah menerima kembali barang - barang sebagai berikut : </div>
                        <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto"}}>
                            <tr className='border' style={{ height: "40px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>  
                                <th width="50px" className='text-center border'>No</th>
                                <th width="300px" className='text-center border'>Nama Produk</th>
                                <th width="80px" className='text-center border'>Qty</th>
                                <th width="50px" className='text-center border'>Stn</th>
                            
                            </tr>
                            <tbody className="border">
                                {
                                    salesRetur.map((item, i) => (
                                        <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {i + 1} </td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {item.product_alias_name} </td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {Number(item.quantity).toFixed(2).replace('.' , ',')} </td>
                                            <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {item.unit} </td>
                                        </tr>
                                        ))
                                    
                                }
                            </tbody>


                        </table>
                    </div>


                 
                    </div>
                    </td>
                </tr>
                </tbody>
                <tfoot style={{position:"fixed", marginTop:"500px"}}>
                        <tr>
                            <td>
                            
                            <div className="page-footer-space"></div>
                            <div className="page-footer" style={{position:"fixed", Bottom:"0px", width:"92%", marginRight:"5px", marginLeft:"5px"}} >
                            <div className='d-flex' style={{width:"100%", bottom:"0"}}>
                            <table style={{ fontSize: "10px", width: "100%", height:"100%", marginRight:"5px", marginLeft:"5px"}} >
                                <tr className='text-center border' style={{ height: "50px", width:"70%" }}>
                                    <th width="45px" className='border'>Pengirim</th>
                                    <th width="45px" className='border'>Gudang</th>
                                    <th width="45px" className='border'>Administrasi</th>
                                </tr>
                            
                                        <tr className='text-center border ' style={{ height: "80px" ,width:"70%"}}>
                                        
                                        <td width="45px" className='border'><b>_________________</b></td>
                                        <td width="45px"className='border'><b>_________________</b></td>
                                        <td width="45px"className='border'><b>_________________</b></td>
                                        
                                        </tr>
                            </table>
                            </div>
                            </div>
                            </td>
                        </tr>
                        </tfoot>

                    </table>

                    </div>
                    </div>

    
            <form className="p-3 mb-3 bg-body rounded">
                {/* <div className="text-title text-start mb-4">
                    <h3 className="title fw-bold">Buat Retur</h3>
                </div> */}
                     <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Retur Penjualan"
                extra={[
                    <Tooltip title="Cetak" placement="bottom">
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        style={{ background: "orange", borderColor: "orange" }}
                        onClick={handlePrint}
                    />
                    </Tooltip>,     
                ]}
            ></PageHeader>
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
                                    value={dataHeader.date}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Pesanan</label>
                            <div className="col-sm-7">
                                <input
                                    value={dataHeader.code}
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
                                <input
                                    value={pelanggan}
                                    type="Nama"
                                    className='form-control'
                                    id='inputNama3'
                                    disabled
                                />
                                {/* <AsyncSelect
                                    placeholder="Pilih Pelanggan..."
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCustomer}
                                    onChange={handleChangeCustomer}
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Faktur</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={noCode}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Referensi</label>
                            <div className="col-sm-7">
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={dataHeader.reference}
                                    disabled
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
                                    value={dataHeader.notes}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Status</label>
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
                            <h4 className="title fw-normal">Daftar Faktur</h4>
                        </div>
                    </div>
                    <Table
                      
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataProduk}
                        columns={columns}
                        onChange={(e) => setFaktur(e.target.value)}
                    />
                </div>
                <div className="row p-0">
                <div className="col ms-5">
                        <div className="form-check">
                            {checked === true ? <input 
                                checked 
                                disabled="true"
                                className="form-check-input"
                                type="checkbox"
                                id="flexCheckDefault"
                                value="yes"
                            
                                
                            /> : <input
                                disabled="true"
                                className="form-check-input"
                                type="checkbox"
                                value="0"
                                id="flexCheckDefault"
                            />}
                            {/* <input
                                disabled="true"
                                className="form-check-input"
                                type="checkbox"
                                value="1"
                                id="flexCheckDefault"
                                checked={taxInclude}
                            /> */}
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk Pajak
                            </label>
                        </div>
                    </div>
                    {/* <div className="col ms-5">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="flexCheckDefault" value={checked} />
                            <label className="form-check-label" for="flexCheckDefault">
                                Harga Termasuk Pajak
                            </label>
                        </div>
                    </div> */}
                    <div className="col">
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Subtotal</label>
                            <div className="col-sm-6">
                            < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(subTotal).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <input value={value} readOnly="true"  id="colFormLabelSm"  className="form-control form-control-sm"/>} />
                                {/* <input
                                    defaultValue={subTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(Total Qty X harga) per item + ... '
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Diskon</label>
                            <div className="col-sm-6">
                            < CurrencyFormat disabled  className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotalDiscount).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <input value={value} readOnly="true"  id="colFormLabelSm"  className="form-control form-control-sm"/>} />
                                {/* <input
                                    defaultValue={grandTotalDiscount}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='(total disc/item) ditotal semua'
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">PPN</label>
                            <div className="col-sm-6">
                            < CurrencyFormat disabled  className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(totalPpn).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <input value={value} readOnly="true"  id="colFormLabelSm"  className="form-control form-control-sm"/>} />
                                {/* <input
                                    defaultValue={totalPpn}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='ppn per item di total semua row'
                                /> */}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label for="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Total</label>
                            <div className="col-sm-6">
                            < CurrencyFormat disabled className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={mataUang + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(grandTotal).toFixed(2).replace('.' , ',')} key="diskon" renderText={value => <input value={value} readOnly="true"  id="colFormLabelSm"  className="form-control form-control-sm"/>} />
                                {/* <input
                                    defaultValue={grandTotal}
                                    readOnly="true"
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="colFormLabelSm"
                                // placeholder='subtotal - diskon + ppn'
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default DetailRetur