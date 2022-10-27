import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { Button, Form, Input, Popconfirm, Switch, Table } from 'antd';
import { useSelector } from "react-redux";
import { DeleteOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import { PageHeader } from 'antd';

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
  const [checked, setChecked] = useState(true);
  const [bussiness_ent, setBussiness_ent] = useState('');

  const [grup, setGrup] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  // const [term, setTerm] = useState('');
  // const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState('Active');
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

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
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
    setChecked(!checked)
    checked ? setStatus('Active') : setStatus ('NonActive')
   // checked ? setChecked(false) : setChecked(true)

    // if (checked === false) {
    //   setStatus("Active");
    //   // console.log('Active');
    // } else {
    //   setStatus("Inactive");
    //   // console.log('Inactive');
    // }
  };

  const defaultColumns = [
    {
      title: 'No.',
      dataIndex: 'index',
      width: '3%',
      align: 'center',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Alamat',
      dataIndex: 'address',
      width: '30%',
      editable: true,
    },
    {
      title: 'Kelurahan',
      editable: true,
      dataIndex: 'urban_village',
    },
    {
      title: 'Kecamatan',
      editable: true,
      dataIndex: 'sub_district',
    },
    {
      title: 'Kota',
      editable: true,
      dataIndex: 'city',
    },
    {
      title: 'Kode Pos',
      editable: true,
      dataIndex: 'postal_code',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      align: 'center',
      width: '5%',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <Button
              size='small'
              type="danger"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        ) : null,
    },
  ];

  const [data, setData] = useState([]);
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

  const [getSupplier, setGetSupplier] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("nama", name);
    userData.append("badan_usaha", bussiness_ent);
    userData.append("grup", grup);
    userData.append("nomor_telepon", phone_number);
    userData.append("email", email);
    userData.append("npwp", npwp);
    userData.append("status", status);

    dataSource.map((address) => {
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
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Buat Supplier"
      >
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
              disabled
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
      </PageHeader>

      <PageHeader
        ghost={false}
        className="bg-body rounded"
        title="Tambah Alamat Supplier"
        extra={[
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            style={{
              marginBottom: 16,
            }}
          />
        ]}
      >
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </PageHeader>
    </>
  );
};

export default BuatSupplier;
