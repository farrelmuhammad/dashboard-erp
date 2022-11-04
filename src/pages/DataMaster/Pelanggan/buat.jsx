import axios from "axios";
// import MaterialTable from "material-table";
import React, { useContext, useEffect, useRef, useState } from "react";
import jsCookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./form.css";
import { useSelector } from "react-redux";
import { Button, Form, Input, PageHeader, Popconfirm, Radio, Switch, Table } from 'antd';
import Url from "../../../Config";
import { DeleteOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
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

const BuatPelanggan = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [bussiness_ent, setBussiness_ent] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  const [term, setTerm] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState('Active');
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);

  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(2);

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

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
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

  const [getCustomer, setGetCustomer] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Nama kosong, Silahkan Lengkapi datanya ",
      });
    }
    // else if(!phone_number){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Nomor Telepon kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    else if (phone_number.length > 20) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Nomor Telepon maksimal 20 karakter, Silahkan periksa kembali ",
      });
    }
    // else if(!email){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Email kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    // else if(!npwp){
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data NPWP kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    else if (npwp.length > 25) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "NPWP maksimal 25 karakter, Silahkan periksa kembali ",
      });
    }
    // else if (!term) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Termin kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    else if (!bussiness_ent) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Badan Usaha kosong, Silahkan Lengkapi datanya ",
      });
    }
    // else if (!discount) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Diskon kosong, Silahkan Lengkapi datanya ",
    //   });
    // }
    else {

      const userData = new FormData();

      userData.append("nama", name);
      userData.append("badan_usaha", bussiness_ent);
      userData.append("nomor_telepon", phone_number);
      userData.append("email", email);
      userData.append("npwp", npwp);
      userData.append("term", term);
      userData.append("diskon", discount);
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
        url: `${Url}/customers`,
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
            `${getCustomer} Masuk dalam list`,
            "success"
          );
          navigate("/pelanggan");
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
    }
  };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_customer_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetCustomer(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  const optionsBussiness = [
    {
      label: "PT",
      value: "PT"
    },
    {
      label: "CV",
      value: "CV"
    },
    {
      label: "Lainnya...",
      value: "Lainnya"
    }
  ];

  const handleSingleChange = (e) => {
    setBussiness_ent(e.value);
  };

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

  const onChange4 = ({ target: { value } }) => {
    // console.log('radio4 checked', value);
    setStatus(value);
  };

  return (
    <>
      <PageHeader
        ghost={false}
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Buat Pelanggan"
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
              value={getCustomer}
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Pelanggan
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
            <ReactSelect
              className="basic-single"
              placeholder="Pilih Badan Usaha..."
              classNamePrefix="select"
              isSearchable
              onChange={handleSingleChange}
              options={optionsBussiness}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Termin
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Diskon
          </label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              id="inputNama3"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
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
            {/* <Switch defaultChecked={checked} onChange={onChange} />
            <label htmlFor="inputNama3" className="col-sm-4 ms-3 col-form-label">
              {
                checked ? "Aktif"
                  : "Nonaktif"
              }
            </label> */}
          </div>
        </div>
      </PageHeader>

      <PageHeader
        ghost={false}
        className="bg-body rounded"
        title="Tambah Alamat Pelanggan"
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
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </PageHeader>
    </>
  );
};

export default BuatPelanggan;
