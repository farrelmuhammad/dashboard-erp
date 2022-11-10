import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import Url from "../../../Config";;
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography, Tooltip , PageHeader} from 'antd'
import { DeleteOutlined, PlusOutlined , PrinterOutlined, FileTextOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';
import CurrencyFormat from 'react-currency-format';
import { useReactToPrint } from 'react-to-print';
import Terbilang from 'terbilang-ts';
import logo from "../../Logo.jpeg";

const { Text } = Typography;

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

const DetailPelunasan = () => {
    // const auth.token = jsCookie.get("auth");
    const [date, setDate] = useState(null);
    const [referensi, setReferensi] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [COA, setCOA] = useState("");
    const [product, setProduct] = useState([]);
    const [query, setQuery] = useState("");
    const [getCode, setGetCode] = useState('');
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);

    const [getDataProduct, setGetDataProduct] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [subTotal, setSubTotal] = useState("");
    const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
    const [totalPpn, setTotalPpn] = useState("");
    const [grandTotal, setGrandTotal] = useState("");
    const [checked, setChecked] = useState("");

    const [selectedValue, setSelectedCustomer] = useState(null);
    const [selectedValue2, setSelectedCOA] = useState(null);
    const [modal2Visible, setModal2Visible] = useState(false);

    const [dataHeader, setDataHeader] = useState([])
    const [namaCust, setNamaCust] = useState('')
    const [dataIDCoa, setDataIDCoa] = useState('')
    const [namaCOA, setNamaCOA] = useState('')
    const [getStatus, setGetStatus] = useState()
    const [salesInvoicePayment, setSalesInvoicePayment] = useState([])
    const [sipCetak, setSIPCetak] = useState([])

    const [totalAkhir, setTotalAkhir] = useState(0)
    const [mataUangT, setMataUangT] = useState(' Rupiah')

    const [beCust, setBECust] = useState("")

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

    const handleChangeCOA = (value) => {
        setSelectedCOA(value);
        setCOA(value.id);
    };
    // load options using API call
    const loadOptionsCOA = (inputValue) => {
        return fetch(`${Url}/select_chart_of_accounts?limit=10&nama=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => res.json());
    };

    // useEffect(() => {
    //     getNewCodeSales()
    // })

    useEffect(() => {
        const getProduct = async () => {
            const res = await axios.get(`${Url}/select_sales_invoices?nama_alias=${query}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setGetDataProduct(res.data);
        };

        if (query.length === 0 || query.length > 2) getProduct();
    }, [query])

    // Column for modal input product
    const columnsModal = [
        {
            title: 'No. Faktur',
            align: 'center',
            dataIndex: 'code',
        },
        {
            title: 'Pelanggan',
            dataIndex: 'customer_id',
            align: 'center',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '20%',
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
            title: 'No. Faktur',
            dataIndex: 'no_faktur',
            align: 'center',
            width: '25%',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            width: '25%',
            align: 'center',
        },
        {
            title: 'Sisa',
            dataIndex: 'sisa',
            width: '25%',
            align: 'center',
            // render: (record) => (
            //     <>
            //         <a>0</a>
            //     </>
            // )
        },
        {
            title: 'Dibayarkan',
            dataIndex: 'bayar',
            width: '25%',
            align: 'center',
            render(text) {
                return {
                    props: {
                        style: { background: "#f5f5f5" }
                    },
                    children: <CurrencyFormat disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp.' + ' '} value={Number(text).toFixed(2).replace('.' , ',')} />
                }
            }
            // render: (record) => {
            //     let pay = 0;
            //     if (record.pays !== 0) {
            //         return pay += record.pays
            //     } 
            //     else {
            //         return pay
            //     }
            // }
        },
    ];

    // const handleChange = () => {
    //     setChecked(!checked);
    //     let check_checked = !checked;
    //     calculate(product, check_checked);
    // };

    const handleSave = (row) => {
        const newData = [...product];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setProduct(newData);
        let check_checked = checked;
        calculate(product, check_checked);
    };

    const calculateInvoice = (product) => {
        let total = 0;
        let pay = 0;
        let sisa = 0;
        product.map((values) => {
            total = values.pays - values.total;

        })
    }

    const calculate = (product, check_checked) => {
        let subTotal = 0;
        let totalDiscount = 0;
        let totalNominalDiscount = 0;
        let grandTotalDiscount = 0;
        let getPpnDiscount = 0;
        let allTotalDiscount = 0;
        let totalPpn = 0;
        let grandTotal = 0;
        let getPpn = 0;
        let total = 0;
        product.map((values) => {
            if (check_checked) {
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                subTotal += ((total - getPpnDiscount) * 100) / (100 + values.ppn);
                allTotalDiscount += total - getPpnDiscount;
                totalPpn = allTotalDiscount - subTotal;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            } else {
                subTotal += (values.quantity * values.price);
                total = (values.quantity * values.price) - values.nominal_disc;
                getPpnDiscount = (total * values.discount) / 100;
                totalDiscount += (total * values.discount) / 100;

                totalNominalDiscount += values.nominal_disc;
                grandTotalDiscount = totalDiscount + totalNominalDiscount;
                allTotalDiscount = total - getPpnDiscount;
                getPpn = (allTotalDiscount * values.ppn) / 100;
                totalPpn += getPpn;
                grandTotal = subTotal - grandTotalDiscount + totalPpn;
                setSubTotal(subTotal)
                setGrandTotalDiscount(grandTotalDiscount)
                setTotalPpn(totalPpn)
                setGrandTotal(grandTotal)
            }
        })
    }

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
                handleSave,
            }),
        };
    });

    const handleCheck = (event) => {
        var updatedList = [...product];
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
    };

    const { id } = useParams();
    // const getNewCodeSales = async () => {
    //     await axios.get(`${Url}/get_new_sales_invoice_payment_code?tanggal=${date}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     })
    //         .then((res) => {
    //             let getData1 = res.data.data
    //             setGetCode(res.data.data);
    //             //console.log(getData1)
    //         })
    //         .catch((err) => {
    //             // Jika Gagal
    //             console.log(err);
    //         });
    // }

    useEffect(() => {
        getDataPelunasan();
    }, [])

    // const getCOAname  = (inputValue) => {
    //     await axios.get(`${Url}/chart_of_accounts?id=${input}`, {
    //         headers: {
    //             Accept: "application/json",
    //             Authorization: `Bearer ${auth.token}`,
    //         },
    //     })
    //         .then((res) => {
    //             let getData1 = res.data.data
    //             setGetCode(res.data.data);
    //             console.log(getData1)
    //         })
    //         .catch((err) => {
    //             // Jika Gagal
    //             console.log(err);
    //         });
    // }



    const loadnamaCOA = async (inputValue) => {
      await  axios.get(`${Url}/chart_of_accounts?id=${inputValue}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        }).then((res) => {
            let data1 = res.data.data[0]
            setNamaCOA(data1.name)
            //console.log(data1)
        });
    };


    const sip = 
    salesInvoicePayment.map((item, i) => (
         item.sales_invoice_code + '\n' 

        ))

    const getDataPelunasan = async () => {
        await axios.get(`${Url}/sales_invoice_payments?id=${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then((res) => {
                let getData = res.data.data[0]
                setDataHeader(getData)
                setDataIDCoa(getData.chart_of_account_id)
                setGetStatus(getData.status)
                setNamaCust(getData.customer.name)
                setSalesInvoicePayment(getData.sales_invoice_payment_details)
                setGetCode(getData.code)
                setBECust(getData.customer.business_entity)
                console.log(getData)

                //console.log(namaCust)
                //console.log(dataIDCoa)
                // setGetStatus(getData.status)
                // setSalesRetur(getData.sales_return_details)

                // setGrandTotal(getData.total)
                // setSubTotal(getData.subtotal)
                // setTotalPpn(getData.ppn)
                // setGrandTotalDiscount(getData.discount)

                // setChecked(getData.tax_included);

                //console.log(checked)

                // let disc = [];
                // let ppn = [];
                
                // for(let i=0; i< salesRetur.length; i++){
                //     disc[i] = salesRetur[i].discount_percentage;
                //     ppn[i] = salesRetur[i].ppn;  
                // }
    
                // setDiskonPersen(disc);
                // setJumlahPPN(ppn);
                // console.log(diskonPersen)

                 //console.log(salesRetur)

                // if(getData.sales_return_details[0].currency){

                //     setMataUang(getData.purchase_return_details[0].currency)
                // }
                // setLoading(false);

                // setPelanggan(getData.customer.name);
                // setNoCode(getData.sales_invoice.code);
                // setBEPelanggan(getData.customer.business_entity);
                // console.log(bePelanggan)
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }

    useEffect(() => {
        loadnamaCOA(dataIDCoa)
    })


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Submitted");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/sales_invoice_payments`,
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
                navigate("/pesanan");
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
        const userData = new FormData();
        userData.append("tanggal", date);
        userData.append("referensi", referensi);
        userData.append("catatan", description);
        userData.append("pelanggan", customer);
        userData.append("status", "Draft");
        product.map((p) => {
            console.log(p);
            userData.append("nama_alias_produk[]", p.alias_name);
            userData.append("kuantitas[]", p.quantity);
            userData.append("satuan[]", p.unit);
            userData.append("harga[]", p.price);
            userData.append("persentase_diskon[]", p.discount);
            userData.append("diskon_tetap[]", p.nominal_disc);
            userData.append("ppn[]", p.ppn);
        });
        userData.append("termasuk_pajak", checked);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        axios({
            method: "post",
            url: `${Url}/sales_invoice_payments`,
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
                navigate("/pesanan");
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

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
         copyStyles: true,
       //pageStyle: pageStyle
        
    })

   // const componentRef1 = useRef();
    const componentRef1 = useRef(null);
    const handlePrint1 = useReactToPrint({
        content: () => componentRef1.current,
         copyStyles: true,
       //pageStyle: pageStyle
        
    })

    const dataFaktur = [
    ...salesInvoicePayment.map((item , i ) => ({
        no_faktur: item.sales_invoice_code,
        total : <>
                <CurrencyFormat disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp.' + ' '} value={Number(item.sales_invoice_total_payment).toFixed(2).replace('.' , ',')} />
        </>,
        sisa: <>
        {
            item.remains < 0 ? 
             <CurrencyFormat disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp.' + ' '} value={Number(0).toFixed(2).replace('.' , ',')} /> :
            <CurrencyFormat disabled className=' text-center edit-disabled editable-input' thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp.' + ' '} value={Number(item.remains).toFixed(2).replace('.' , ',')} />
        }
        </>,
        bayar: item.paid,
    }))
    ]

    return (
        <>


        <div style={{ display: "none"}} >
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

                {/* <div className=' mt-3 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle:"bold"}}> */}
                    {/* <div className='col-6'>
                          <div className="d-flex flex-row">
                          <label className='col-8'>No. Pembayaran</label>
                              <div className='col-12'> : {dataHeader.code}</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-8'>Tanggal</label>
                              <div className='col-12'>
                                  : { dataHeader.date }</div>
                          </div>
                        
                      </div> */}
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
                  {/* </div> */}
                </div>
                </div>

            </div>
            </div>
        
        <br/>
      
   
        <div className='mt-5 mb-2 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign:"center"}}>
                      <div className='align-items-center' style={{ fontSize: "14px", textDecoration: "underline", textAlign:"center"}}>VOUCHER KAS MASUK</div>
                      <div style={{ fontSize: "10px", marginTop: "-5px" }}>NO. {dataHeader.code}</div>
        </div>
        <br/>

        
        <div className='mt-2 mb-1 col d-flex justify-content-center ps-4 pe-4 '  style={{ fontSize: "12px", width:"100%" }}>
                      <div className='col-6'>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Divisi</label>
                              <div className='col-6'> : Purchasing</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Rekening </label>
                              <div className='col-6'> : {namaCOA} </div>
                          </div>
                          
                      </div>
                      <div className='col-6'>
                        <div className="d-flex flex-row">
                                <label className='col-6'>Kepada</label>
                                {
                                    beCust == 'Lainnya' ? 
                                    <div className='col-6'> : {namaCust}</div> :
                                    <div className='col-6'> : {beCust} {namaCust}</div>
                                }
                               
                            </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Tanggal</label>
                              <div className='col-6'> : {dataHeader.date} </div>
                          </div>
                        
                          
                      </div>
                      <div>
                        
                      </div>
                  </div>

        {/* <div className='mt-2 mb-4 col d-flex justify-content-left ps-4 pe-4'  style={{ fontSize: "12px", fontWeight:"bold" }}>
                      <div className='col-6 col-md-4'>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Divisi</label>
                              <div className='col-6'> : Purchasing</div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Rekening</label>
                              <div className='col-6'> : {dataHeader.chart_of_account.name} </div>
                          </div>
                          <div className="d-flex flex-row">
                              <label className='col-6'>Dari</label>
                              <div className='col-6'> : {dataHeader.supplier.name} </div>
                          </div>
                      </div>
                  </div> */}
                </div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <div className="page" style={{lineHeight:"3", margin:"0"}}>

          <div className='mt-2 ps-3 pe-3' >

                <table style={{ fontSize: "10px", width: "100%", pageBreakAfter:"auto"}}>
                    <tr className='border' style={{ height: "40px", pageBreakInside:"avoid", pageBreakAfter:"auto" }}>  
                        <th width="50px" className='text-center border'>No</th>
                        <th width="300px" className='text-center border'>Deskripsi</th>
                        <th width="80px" className='text-center border'>Jumlah</th>
                     
                    
                    </tr>
                    <tbody className="border">
                        {
                            salesInvoicePayment.map((item, i) => (
                                <tr style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} >
                                    <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {i + 1} </td>
                                    <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'>Pelunasan Penjualan {getCode} </td>
                                    <td style={{ pageBreakInside:"avoid", pageBreakAfter:"auto"}} className='border-isi text-center'> {
                                 < CurrencyFormat  disabled className=' text-center editable-input edit-disabled' style={{width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(item.paid).toFixed(2).replace('.' , ',')} key="diskon" /> 
                                    } </td>
            
                                </tr>
                                ))
                            
                        }
                    </tbody>
                </table>

            <div className='d-flex mt-1 ps-1 pe-1' style={{marginBottom:'2px', height:'65%'}}>
                    
             
             <div style={{width:'40%', alignItems:'end', marginLeft:'450px'}}>

             <div className='d-flex' style={{fontSize:"10px"}}>
                                <label className='col-6'><b> Total :</b></label>
                               
                                <div width="100%">{
                                   < CurrencyFormat  disabled className=' text-end editable-input edit-disabled' style={{fontWeight:'bold' ,width: "70%", fontSize: "10px!important" }} prefix={'Rp '} thousandSeparator={'.'} decimalSeparator={','} value={Number(totalAkhir).toFixed(2).replace('.' , ',')} key="diskon" /> 
                               }  </div>
                                <div>
                                </div>
                            </div>
                      
             </div>
                    </div>


            <div className="row" style={{ marginLeft:'5px', height:"80px", alignItems:"start", fontSize:'12px'}}> 
            Terbilang: {Terbilang(totalAkhir)} Rupiah
              {/* <div className="col-2" style={{alignItems:"start", fontSize:"12px"}}>
              <b> Terbilang : {Terbilang(totalP) +  mataUang} </b>
                </div> */}
               {/* <div className="col-10">
                {
                    
                } */}
               {/* <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                value={Terbilang(totalP) +  mataUang}
                                width={"100%"}
                                height={"20px"}
                                fontSize={"10px"}
                                disabled
                            /> */}
              
            {/* </div> */}
            </div>
       

            </div>



        {/* <div className='mt-4 ps-4 pe-4' style={{fontSize:"13px"}}>



           <div className="row" style={{marginBottom:"5px", height:"80px", display:"flex", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
                 <b> Sudah Dibayarkan Kepada</b>
                </div>
               <div className="col-7 " style={{fontSize:"10px"}} >
                   <input
                      value={dataHeader.supplier.name}
                       id="inputNama3"
                       className='form-control'
                       type="Nama"
                       width={"80%"}
                       height={"30px"}
                       fontSize={"10px"}
                      
                    /> 
            </div>
            </div>

            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}> 
              <div className="col-5" style={{alignItems:"center"}}>
              <b> Uang Sejumlah </b>
                </div>
               <div className="col-7">
               <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                value={Terbilang((dataHeader.paid)) +  mataUang}
                                width={"80%"}
                                height={"30px"}
                                fontSize={"10px"}
                            />
              
            </div>
            </div>

            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
               <b> Untuk Pembayaran </b>
                </div>
               <div className="col-7" >
                   <input
                   
                      value={
                        dataDetail.map((item, i) => (
                            item.purchase_invoice_code
                        ))
                      }
                       id="inputNama3"
                       className='form-control'
                       type="Nama"
                       width={"80%"}
                       height={"30px"}
                       fontSize={"10px"}
                    /> 
            </div>
            </div>

            
            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
             <b>     Jumlah </b>
                </div>
               <div className="col-7 text-start" style={{fontSize:"12px"}}>
               <input
                                className="form-control"
                                id="inputNama3"
                                type="Nama"
                                value={mataUang + dataHeader.paid}
                                width={"80%"}
                                height={"30px"}
                                fontSize={"10px"}
                            />
            </div>
            </div>

        </div> */}
                    </div>
                    </td>
                </tr>
                </tbody>
                <tfoot style={{position:"fixed", marginTop:"400px"}}>
                        <tr>
                            <td>
                            
                            <div className="page-footer-space"></div>
                            <div className="page-footer" style={{position:"fixed", Bottom:"0px", width:"92%", marginRight:"5px", marginLeft:"5px"}} >
                            <div className='d-flex' style={{width:"100%", bottom:"0"}}>
                            <table style={{ fontSize: "10px", width: "100%", height:"100%", marginRight:"5px", marginLeft:"5px"}} >
                                <tr className='text-center border' style={{ height: "50px", width:"70%" }}>
                                    <th width="35px" className='border'>Dibuat</th>
                                    <th width="35px" className='border'>Mengetahui</th>
                                    <th width="35px" className='border'>Disetujui</th>
                                    <th width="35px" className='border'>Diterima</th>
                                </tr>
                            
                                        <tr className='text-center border ' style={{ height: "80px" ,width:"70%"}}>
                                        
                                        <td width="35px" className='border'><b>_________________</b></td>
                                        <td width="35px"className='border'><b>_________________</b></td>
                                        <td width="35px"className='border'><b>_________________</b></td>
                                        <td width="35px"className='border'><b>_________________</b></td>
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


        <div style={{ display: "none"}} >
                <div ref={componentRef1} className="p-4" style={{width:"100%"}} >

  <table style={{width:"100%"}}>
    <thead>
      <tr>
        <td>
         
          <div className="page-header-space"></div>
          <div className="page-header">
            <div className='row'>
           
                <div className='d-flex mb-3 float-container' style={{position:"fixed", height:"100px", top:"0"}}>
                <div className='col-1' style={{ marginTop: "10px" }}><img src={logo} width="60px"></img></div>
                  <div className='col-4' style={{ marginTop: "10px", marginRight: "100px" }}>
                        <div className='ms-2' >
                        <div className='header-cetak'><b>PT. BUMI MAESTROAYU</b></div>
                        <div className='header-cetak'>JL. RAYA DUREN TIGA NO. 11</div>
                        <div className='header-cetak'>JAKARTA SELATAN 12760</div>
                        <div className='header-cetak'>TELP. (021)7981368 - 7943968 FAX. 7988488 - 7983249</div>
                        </div>
                    </div>
               

                <div className='col float-child' style={{width:"50%", alignItems:"right"}}>
                    <div height="100px"></div>

                <div className=' mt-4 mb-4 col d-flex justify-content-right ps-4 pe-4' height="100px" style={{ fontSize: "12px", fontStyle:"bold"}}>
                      <div className='col-md-4'>
                        <div className="d-flex flex-row">
                              <label className='col-6'>No. Kwitansi</label>
                              <div className='col-8'> : {getCode}</div>
                          </div>
                          <div className="d-flex flex-row">
                          <label className='col-6'>Tanggal</label>
                              <div className='col-8'> : {dataHeader.date}</div>
                          </div>
                      </div>
                  </div>
                </div>
                </div>

            </div>
        
        <br/>
        <br/>
        <br/>
   
        <div className='mt-3 mb-3 justify-content-center align-items-center d-flex flex-column' style={{ fontWeight: "bold", textAlign:"center"}}>
                      <div className='align-items-center' style={{ fontSize: "15px", textDecoration: "underline", textAlign:"center"}}>KWITANSI</div>
                  </div>
                    <br/>
                </div>
        </td>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <div className="page" style={{lineHeight:"3", margin:"0"}}>

        <div className='mt-2 ps-2 pe-2' style={{fontSize:"13px"}}>



           <div className="row" style={{marginBottom:"5px", height:"80px", display:"flex", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
                 <b> Sudah Terima Dari</b>
                </div>
               <div className="col-7 " style={{fontSize:"10px"}} >
                {
                    beCust == 'Lainnya' ? 
                    <input
                    value={namaCust}
                     id="inputNama3"
                     className='form-control'
                     type="Nama"
                     width={"80%"}
                     height={"30px"}
                     fontSize={"10px"}
                    
                  /> : 
                  <input
                  value= {beCust + " " + namaCust}
                   id="inputNama3"
                   className='form-control'
                   type="Nama"
                   width={"80%"}
                   height={"30px"}
                   fontSize={"10px"}
                  
                /> 
                }
                 
            </div>
            </div>

            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}> 
              <div className="col-5" style={{alignItems:"center"}}>
              <b> Uang Sejumlah </b>
                </div>
               <div className="col-7">
               <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="2"
                                value={Terbilang((totalAkhir)) + mataUangT }
                                width={"80%"}
                                height={"30px"}
                                fontSize={"10px"}
                            />
              
            </div>
            </div>

            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
               <b> Untuk Pembayaran </b>
                </div>
               <div className="col-7" >
                    <textarea
                                className="form-control"
                                id="form4Example3"
                                value={
                                sip.join('')
                                 }
                                width={"80%"}
                                height={"30px"}
                                fontSize={"10px"}
                                style={{overflow:"hidden"}} 
                            />
            </div>
            </div>

            
            <div className="row" style={{marginBottom:"5px", height:"80px", alignItems:"center"}}>
              <div className="col-5" style={{alignItems:"center"}}>
             <b>     Jumlah </b>
                </div>
               <div className="col-7 text-start" style={{fontSize:"12px"}}>
                  < CurrencyFormat className=' text-start form-control form-control-sm editable-input  edit-disabled' style={{ width: "100%",height:"40px", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(totalAkhir).toFixed(2).replace('.', ',')} key="diskon" renderText={value => <input value={value} readOnly="true" id="colFormLabelSm" width="100%" height="40px" style={{width:"100%", height:"40px"}} className="form-control form-control-sm" />} />
            </div>
            </div>

        </div>
                    </div>
                    </td>
                </tr>
                </tbody>

                    </table>

                    </div>
                    </div>

            <form className="p-3 mb-3 bg-body rounded">
            <PageHeader
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="Detail Pelunasan Penjualan"
                extra={[
                    <Tooltip title="Cetak" placement="bottom">
                    <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        style={{ background: "orange", borderColor: "orange" }}
                        onClick={handlePrint}
                    />
                    </Tooltip>,     
                     <Tooltip title="Kwitansi" placement="bottom">
                     <Button
                         type="primary"
                         icon={<FileTextOutlined />}
                         style={{ background: "green", borderColor: "green" }}
                         onClick={handlePrint1}
                     />
                     </Tooltip>, 
                ]}
            ></PageHeader>
                {/* <div className="text-title text-start mb-4">
                    <h4 className="title fw-bold">Detail Pelunasan</h4>
                </div> */}
                <div className="row">
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Tanggal</label>
                            <div className="col-sm-7">
                                <input
                                    id="startDate"
                                    className="form-control"
                                    type="date"
                                    value={dataHeader.date}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No. Kwitansi</label>
                            <div className="col-sm-7">
                                <input
                                    value={getCode}
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
                                <input
                                    value={namaCust}
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    disabled
                                />

                            </div>
                        </div>

                    </div>
                    <div className="col">
                        <div className="row mb-3">
                            <label htmlFor="inputKode3" className="col-sm-4 col-form-label">Referensi</label>
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
                        <div className="row mb-3">
                            <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Pembayaran</label>
                            <div className="col-sm-7">
                                {/* <AsyncSelect
                                    placeholder="Dari COA"
                                    cacheOptions
                                    defaultOptions
                                    value={selectedValue2}
                                    getOptionLabel={(e) => e.name}
                                    getOptionValue={(e) => e.id}
                                    loadOptions={loadOptionsCOA}
                                    onChange={handleChangeCOA}
                                /> */}
                                <input
                                    type="Nama"
                                    className="form-control"
                                    id="inputNama3"
                                    value={namaCOA}
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
                        <div className="col text-end me-2">
                            {/* <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                            <Modal
                                title="Tambah Faktur Penjualan"
                                centered
                                visible={modal2Visible}
                                onCancel={() => setModal2Visible(false)}
                                // footer={[
                                //     <Button
                                //         key="submit"
                                //         type="primary"

                                //     >
                                //         Tambah
                                //     </Button>,
                                // ]}
                                footer={null}
                            >
                                <div className="text-title text-start">
                                    <div className="row">
                                        <div className="col mb-3">
                                            <Search
                                                placeholder="Cari Nama Faktur..."
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
                            </Modal> */}
                        </div>
                    </div>
                    <Table
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        pagination={false}
                        dataSource={dataFaktur}
                        columns={columns}
                        onChange={(e) => setProduct(e.target.value)}
                        summary={(pageData) => {
                            let totalTotal = 0;
                            pageData.forEach(({ bayar }) => {
                                totalTotal += Number(bayar);
                                setTotalAkhir(totalTotal)
                            });
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3} className="text-end">Total yang dibayarkan</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                        < CurrencyFormat disabled className=' text-end editable-input  edit-disabled' style={{ width: "70%", fontSize: "10px!important" }} prefix={'Rp.' + ' '} thousandSeparator={'.'} decimalSeparator={','} value={Number(totalTotal).toFixed(2).replace('.', ',')} key="diskon" />
                                            {/* <Text type="danger">{totalTotal}</Text> */}
                                        </Table.Summary.Cell>
                                        {/* <Table.Summary.Cell index={2}>
                                            <Text>{totalRepayment}</Text>
                                        </Table.Summary.Cell> */}
                                    </Table.Summary.Row>
                                    {/* <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} colSpan={2}>
                                            <Text type="danger">{totalBorrow - totalRepayment}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row> */}
                                </>
                            );
                        }}
                    />
                </div>
{/* 
                <div className="btn-group" role="group" aria-label="Basic mixed styles example" style={{ float: 'right', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn btn-success rounded m-1"
                        value="Draft"
                        onClick={handleDraft}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded m-1"
                        value="Submitted"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
                <div style={{clear:"both"}}></div> */}
            </form>
        </>
    )
}

export default DetailPelunasan