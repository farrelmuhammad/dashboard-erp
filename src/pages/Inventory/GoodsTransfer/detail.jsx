import './form.css'
import jsCookie from "js-cookie";
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Url from '../../../Config';
import axios from 'axios';
import AsyncSelect from "react-select/async";
import { Button, Checkbox, Form, Input, InputNumber, Modal, PageHeader, Select, Skeleton, Space, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Column from 'antd/lib/table/Column';
import { Option } from 'antd/lib/mentions';
import Swal from 'sweetalert2';
import Search from 'antd/lib/transfer/search';
import { useSelector } from 'react-redux';

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

const DetailGoodsTransfer = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);

  const [product, setProduct] = useState([]);
  const [query, setQuery] = useState("");
  const [code, setCode] = useState('');
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(null);
  const [type, setType] = useState("");
  const [whSourceName, setWhSourceName] = useState("");
  const [whDestinationName, setWhDestinationName] = useState("");
  const [warehouse_id, setWarehouseId] = useState([]);
  const [tally_sheet_id, setTallySheetId] = useState([]);
  const [goods_transfer_id, setGoodsTransfer] = useState([]);
  const [reference_no, setReferenceNo] = useState([]);
  const [warehouseSourceName, setWarehouseSourceName] = useState(null);
  const [warehouse_source, setWarehouseSource] = useState('');
  const [selectedWarehouseSource, setSelectedWarehouseSource] = useState(null);

  const [warehouseDestinationName, setWarehouseDestinationName] = useState(null);
  const [warehouse_destination, setWarehouseDestination] = useState([]);
  const [selectedWarehouseDestination, setSelectedWarehouseDestination] = useState(null);
  const [selectedTallySheet, setSelectedTallySheet] = useState(null);
  const [selectedGoodsTransfer, setSelectedGoodsTransfer] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const [getDataDetailWindow, setDataDetailWindow] = useState();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [subTotal, setSubTotal] = useState("");
  const [grandTotalDiscount, setGrandTotalDiscount] = useState("");
  const [totalPpn, setTotalPpn] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [checked, setChecked] = useState("");

  const [selectedValue, setSelectedCustomer] = useState(null);
  const [modal2Visible, setModal2Visible] = useState(false);

  const cardOutline = {
    borderTop: '3px solid #007bff',
  }

  useEffect(() => {
    fetchGoodsTransfer()
  }, [])

  const fetchGoodsTransfer = async (e) => {
    await axios.get(`${Url}/goodstransfers?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        // setGetPosition(res.data.data[0]);
        // console.log(res.data.data[0])
        const getData = res.data.data[0]
        setCode(getData.code);
        setStatus(getData.status)
        setType(getData.type_process);
        setReferenceNo(getData.reference_no);
        setDate(getData.date);
        setWarehouseSource(getData.whsource.id);
        setWarehouseSourceName(getData.whsource.name);
        setWarehouseDestination(getData.whdestination.id);
        setWarehouseDestinationName(getData.whdestination.name);
        setNotes(getData.notes);
        setWhSourceName(getData.warehouse_source_name)
        setWhDestinationName(getData.warehouse_destination_name)
        console.log(getData);
        setLoading(false);
      })
      .catch((err) => {
        // Jika Gagal
        //   console.log(err);
      });
  }

  useEffect(() => {
    getGoodsTransferDetail()
  }, [])

  const getGoodsTransferDetail = async (params = {}) => {
    setIsLoading(true);
    await axios.get(`${Url}/goodstransfer_details/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
      .then(res => {
        const getData = res.data.data
        setProduct(getData)
        setIsLoading(false);
      })
  }

  const columns = [
    {
      title: "No.",
      dataIndex: "",
      width: "5%",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Nama Produk",
      dataIndex: "product_name",
    },
    {
      title: "Stok Saat Ini",
      dataIndex: "current_qty",
      width: "15%",
      align: "center",
      render: (text) => {
        return <>{text.toString().replace(".", ",")}</>;
      },
    },
    {
      title: "Qty Transfer",
      dataIndex: "transfer_qty",
      width: "15%",
      align: "center",
      render: (text) => {
        return <>{text.toString().replace(".", ",")}</>;
      },
    },
    {
      title: "Satuan",
      dataIndex: "unit",
      width: "30%",
      align: "center",
    },
  ];

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
        ghost={false}
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Detail Transfer Barang"
      >
        <div className="row">
          <div className="col-md-6">
            <div className="form-group row mb-1">
              <label for="code" className="col-sm-4 col-form-label">No</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  disabled
                  defaultValue={code}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="date" className="col-sm-4 col-form-label">Tanggal</label>
              <div className="col-sm-8">
                <input type="date" className="form-control" id="date" name="date" disabled defaultValue={date} />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="type" className="col-sm-4 col-form-label">Tipe</label>
              <div className="col-sm-8">
                <select id="type" disabled name="type" className="form-select">
                  {/* <option>Pilih Tipe</option> */}
                  <option value="send" selected={type === "send"}>Kirim</option>
                  <option value="receive" selected={type === "receive"}>Terima</option>
                </select>
              </div>
            </div>
            <div className="form-group row mb-1" id="reference_tally_sheet">
              <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No Referensi</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  // placeholder="Otomatis"
                  value={reference_no}
                  disabled
                />
              </div>
            </div>
            <div className="form-group row mb-1" style={{ display: "none" }} id="reference_transfer_gudang">
              <label htmlFor="inputNama3" className="col-sm-4 col-form-label">No Referensi</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  // placeholder="Otomatis"
                  value={reference_no}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group row mb-1">
              <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Asal</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  // placeholder="Otomatis"
                  value={whSourceName}
                  disabled
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Gudang Tujuan</label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  // placeholder="Otomatis"
                  value={whDestinationName}
                  disabled
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="notes" className="col-sm-4 col-form-label">Catatan</label>
              <div className="col-sm-8">
                <textarea
                  className="form-control"
                  name="notes" id="notes"
                  rows="3"
                  disabled
                  defaultValue={notes}
                />
              </div>
            </div>
            <div className="form-group row mb-1">
              <label for="adjustment_status" className="col-sm-4 col-form-label">Status</label>
              <div className="col-sm-8 mt-2">
                {status === 'Submitted' ? <Tag color="blue">{status}</Tag> : status === 'Draft' ? <Tag color="volcano">{status}</Tag> : status === 'Done' ? <Tag color="green">{status}</Tag> : <Tag color="purple">{status}</Tag>}
              </div>
            </div>
          </div>
        </div>
      </PageHeader>

      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        title="Daftar Produk"
      >
        <Table
          loading={isLoading}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={product}
          columns={columns}
          onChange={(e) => setProduct(e.target.value)}
        />
      </PageHeader>
    </>
  )
}

export default DetailGoodsTransfer