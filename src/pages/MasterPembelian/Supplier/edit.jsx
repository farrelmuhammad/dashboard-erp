import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, Form, Input, PageHeader, Popconfirm, Radio, Skeleton, Switch, Table } from "antd";
import { DeleteOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import axios from "axios";
import ReactSelect from "react-select";

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

const EditSupplier = () => {
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [bussiness_ent, setBussiness_ent] = useState('');
  const [bussinessName, setBussinessName] = useState('');
  const [grup, setGrup] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  const [status, setStatus] = useState('');
  // const [checked, setChecked] = useState();
  const [check, setCheck] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(true);

  // const [getCustomer, setGetCustomer] = useState();

  const [dataSource, setDataSource] = useState([]);

  const handleAdd = () => {
    const newData = {
      key: count,
      id: '',
      address: '',
      urban_village: ``,
      sub_district: ``,
      city: ``,
      postal_code: ``,
    };
    console.log(newData);
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (id) => {
    const newData = dataSource.filter((item) => item.id !== id);
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
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <Button
              size='small'
              type="danger"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        ) : null,
    },
  ];

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    // console.log(status)
    const userData = new URLSearchParams();
    userData.append("nama", name);
    userData.append("badan_usaha", bussinessName);
    userData.append("grup", grup);
    userData.append("nomor_telepon", phone_number);
    userData.append("email", email);
    userData.append("npwp", npwp);
    userData.append("status", status);

    dataSource.map((address) => {
      userData.append("id_alamat_pemasok[]", address.id);
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
      method: "put",
      url: `${Url}/suppliers/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        //handle success
        console.log(res);
        Swal.fire(
          "Berhasil Ditambahkan",
          `${code} Masuk dalam list`,
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
    getSupplierById()
  }, []);

  const getSupplierById = async () => {
    await axios.get(`${Url}/suppliers?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        const getData = res.data.data[0];
        console.log(getData);
        setCode(getData.code);
        setName(getData.name || "");
        setBussinessName(getData.business_entity);
        setPhone_number(getData.phone_number || "");
        setEmail(getData.email || "");
        setNpwp(getData.npwp || "");
        setGrup(getData._group);
        setStatus(getData.status);
        setDataSource(getData.supplier_addresses);
        setLoading(false)
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }

  const optionsStatus = [
    {
      label: 'Aktif',
      value: 'Active',
    },
    {
      label: 'Nonaktif',
      value: 'Inactive',
    },
  ];

  // const [value4, setValue4] = useState('');

  const onChange4 = ({ target: { value } }) => {
    console.log('radio4 checked', value);
    setStatus(value);
  };

  const options = [
    { value: 'PT', label: 'PT' },
    { value: 'CV', label: 'CV' },
    { value: 'Lainnya...', label: 'Lainnya...' },
  ];

  const handleSingleChange = (e) => {
    setBussiness_ent(e.value);
  };

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
        title="Edit Supplier"
      >
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Kode
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              defaultValue={code}
              disabled
              id="inputKode3"
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
              defaultValue={name}
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
              defaultValue={phone_number}
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
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Badan Usaha
          </label>
          <div className="col-sm-10">
            <ReactSelect
              placeholder="Pilih Badan Usaha..."
              className="basic-single"
              classNamePrefix="select"
              //defaultInputValue={bussinessName}
              // value={{ value: bussinessName, label: bussinessName }}
              value={{ value: bussinessName, label: bussinessName }}
              // isDisabled={isDisabled}
              // isLoading={isLoading}
              // isClearable={isClearable}
              // isRtl={isRtl}
              isSearchable
              name="color"
              options={options}
              onChange={(item) => {
                console.log(item);

                // set item instead of item.value
                setBussinessName(item.value);
              }}
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
              <option value="Impor" checked={grup === "Impor"}>
                Impor
              </option>
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Status</label>
          <div className="col-sm-7">
            <Radio.Group
              options={optionsStatus}
              onChange={onChange4}
              value={status}
              optionType="button"
              buttonStyle="solid"
            />
            {/* <Switch defaultChecked={status} onChange={onChange} />
            <label htmlFor="inputNama3" className="col-sm-4 ms-3 col-form-label">
              {
                check === true ? "Aktif"
                  : "Nonaktif"
              }
            </label> */}
          </div>
        </div>
      </PageHeader>

      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
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
          size="small"
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
            onClick={handleUpdate}
          >
            Submit
          </Button>
        </div>
      </PageHeader>
    </>
  );
};

export default EditSupplier;
