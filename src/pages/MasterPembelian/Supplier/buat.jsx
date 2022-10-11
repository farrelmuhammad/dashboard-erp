import axios from "axios";
// import MaterialTable from "material-table";
import React, { useContext, useEffect, useRef} from "react";
import jsCookie from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import { Button, Form, Input, Popconfirm, Switch, Table } from 'antd';
import { useSelector } from "react-redux";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Grid } from "@material-ui/core";
import { PageHeader} from 'antd';

const EditableContext = React.createContext(null);

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
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


const BuatSupplier = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [checked, setChecked] = useState(false);
  const [bussiness_ent, setBussiness_ent] = useState('');
  
  const [grup, setGrup] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  // const [term, setTerm] = useState('');
  // const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(2);
  
  const handleAdd = () => {
    const newData = {
      key: count,
      name: ``,
      age: '',
      address: ``,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const onChange = () => {
    checked ? setChecked(false) : setChecked(true)

    if (checked === false) {
      setStatus("Active");
      // console.log('Active');
    } else {
      setStatus("Inactive");
      // console.log('Inactive');
    }
  };

  const [data, setData] = useState([]);
  const columns = [
    { title: "ID", field: "id", editable: false },
    { title: "Alamat", field: "address" },
    { title: "Kelurahan", field: "urban_village" },
    { title: "Kecamatan", field: "sub_district" },
    { title: "Kota", field: "city" },
    { title: "Kode Pos", field: "postal_code" },
  ];

  const [getSupplier, setGetSupplier] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const userData = new FormData();

    userData.append("nama", name);
    userData.append("badan_usaha", bussiness_ent);
    userData.append("grup", grup);
    userData.append("nomor_telepon", phone_number);
    userData.append("email", email);
    userData.append("npwp", npwp);
    // userData.append("term", term);
    // userData.append("diskon", discount);
    userData.append("status", status);

    data.map((address) => {
      console.log(address);
      userData.append("alamat[]", address.address);
      userData.append("kota[]", address.city);
      userData.append("kecamatan[]", address.sub_district);
      userData.append("kelurahan[]", address.urban_village);
      userData.append("kode_pos[]", address.postal_code);
    });

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/suppliers`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire(
          "Berhasil Ditambahkan",
          `${getSupplier} Masuk dalam list`,
          "success"
        );
        navigate("/supplier");
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

  useEffect(() => {
    axios
      .get(`${Url}/get_new_supplier_code/Lokal`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetSupplier(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  return (
    <>
      <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Supplier">
          </PageHeader>

      <form className="  p-3 mb-3 bg-body rounded">
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              id="inputKode3"
              value={getSupplier}
              readOnly={getSupplier}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Supplier
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            No Telepon
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              onChange={(e) => setPhone_number(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            NPWP
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              onChange={(e) => setNpwp(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Badan Usaha
          </label>
          <div className="col-sm-10">
            <select
              onChange={(e) => setBussiness_ent(e.target.value)}
              id="bussinessSelect"
              className="form-select"
            >
              <option>Pilih Badan Usaha</option>
              <option value="PT" checked={bussiness_ent === "PT"}>
                PT
              </option>
              <option value="CV" checked={bussiness_ent === "CV"}>
                CV
              </option>
              <option value="Lainnya" checked={bussiness_ent === "Lainnya.."}>
                Lainnya..
              </option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Grup
          </label>
          <div className="col-sm-10">
            <select
              onChange={(e) => setGrup(e.target.value)}
              id="grupSelect"
              className="form-select"
            >
              <option>Pilih Grup</option>
              <option value="Lokal" checked={grup === "Lokal"}>
                Lokal
              </option>
              <option value="Impor" checked={grup === "Import"}>
                Import
              </option>
              
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
          <div className="col-sm-7">
            <Switch defaultChecked={checked} onChange={onChange} />
            <label htmlFor="inputNama3" className="col-sm-4 ms-3 col-form-label">
              {
                checked ? "Aktif"
                  : "Nonaktif"
              }
            </label>
          </div>
        </div>

      </form>
      <form className="  p-3 mb-3 bg-body rounded">
      <div className="row">
         <div className="col">
             <h4 className="title fw-normal">Tambah Alamat Supplier</h4>
          </div>
          <div className="col text-end me-2">
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{
                        marginBottom: 16,
                       }}
           />
        </div> 
      </div>

      {/* <h5 className="title fw-bold"></h5> */}
      {/* <Grid container justify="flex-end">
      
        </Grid> */}
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />

{/* 
        <MaterialTable
          title="Alamat Supplier"
          data={data}
          columns={columns}
          onChange={(e) => setData(e.target.value)}
          editable={{
            onRowAdd: (newRow) =>
              new Promise((resolve, reject) => {
                const updatedRows = [
                  ...data,
                  { id: data.length + 1, ...newRow },
                ];
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowDelete: (selectedRow) =>
              new Promise((resolve, reject) => {
                const index = selectedRow.tableData.id;
                const updatedRows = [...data];
                updatedRows.splice(index, 1);
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000);
              }),
            onRowUpdate: (updatedRow, oldRow) =>
              new Promise((resolve, reject) => {
                const index = oldRow.tableData.id;
                const updatedRows = [...data];
                updatedRows[index] = updatedRow;
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000);
              }),
            onBulkUpdate: (selectedRows) =>
              new Promise((resolve, reject) => {
                const rows = Object.values(selectedRows);
                const updatedRows = [...data];
                let index;
                rows.map((emp) => {
                  index = emp.oldData.tableData.id;
                  updatedRows[index] = emp.newData;
                });
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000);
              }),
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
          }}
        /> */}
        <div className="d-grid mt-3 gap-2 d-md-flex justify-content-md-end">
          <button onClick={handleSubmit} className="btn btn-primary" type="button">
            Simpan <SendIcon className="ms-1" />
          </button>
        </div>
      </form>
    </>
  );
};

export default BuatSupplier;
