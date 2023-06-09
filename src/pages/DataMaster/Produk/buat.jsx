import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import AsyncSelect from "react-select/async";
import { useSelector } from "react-redux";
import { Button, PageHeader, Radio, Switch } from "antd";
import { SendOutlined } from "@ant-design/icons";
import ReactSelect from "react-select";

const BuatProduk = () => {
  // const auth = useSelector(state => state.auth);
  const auth = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [pieces_id, setPieces_id] = useState('');
  const [group, setGroup] = useState('');
  const [category_id, setCategory_id] = useState('');
  const [grade_id, setGrade_id] = useState('');
  const [type_id, setType_id] = useState('');
  const [brands_id, setBrands_id] = useState('');
  const [packaging_id, setPackaging_id] = useState('');
  const [unit, setUnit] = useState('');
  const [buy_price, setBuy_price] = useState(0);
  const [sell_price, setSell_price] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [taxes_id, setTaxes_id] = useState('');
  const [status, setStatus] = useState('Active');
  const [checked, setChecked] = useState(true);
  const navigate = useNavigate();

  const [getProduct, setGetProduct] = useState();

  const [selectedValue, setSelectedPieces] = useState(null);
  const [selectedValue2, setSelectedCategory] = useState(null);
  const [selectedValue3, setSelectedGrades] = useState(null);
  const [selectedValue4, setSelectedTypes] = useState(null);
  const [selectedValue5, setSelectedBrands] = useState(null);
  const [selectedValue6, setSelectedTaxes] = useState(null);
  const [selectedValue7, setSelectedPackaging] = useState(null);


  const handleChangePieces = (value) => {
    setSelectedPieces(value);
    setPieces_id(value.id);
  };
  // load options using API call
  const loadOptionsPieces = (inputValue) => {
    return fetch(`${Url}/select_pieces?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangeCategory = (value) => {
    setSelectedCategory(value);
    setCategory_id(value.id);
  };
  // load options using API call
  const loadOptionsCategory = (inputValue) => {
    return fetch(`${Url}/select_categories?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangeGrades = (value) => {
    setSelectedGrades(value);
    setGrade_id(value.id);
  };
  // load options using API call
  const loadOptionsGrades = (inputValue) => {
    return fetch(`${Url}/select_grades?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangeTypes = (value) => {
    setSelectedTypes(value);
    setType_id(value.id);
  };
  // load options using API call
  const loadOptionsTypes = (inputValue) => {
    return fetch(`${Url}/select_types?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangeBrands = (value) => {
    setSelectedBrands(value);
    setBrands_id(value.id);
  };
  // load options using API call
  const loadOptionsBrands = (inputValue) => {
    return fetch(`${Url}/select_brands?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangeTaxes = (value) => {
    setSelectedTaxes(value);
    setTaxes_id(value.id);
  };
  // load options using API call
  const loadOptionsTaxes = (inputValue) => {
    return fetch(`${Url}/select_taxes?limit=10&nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleChangePackaging = (value) => {
    setSelectedPackaging(value);
    setPackaging_id(value.name);
  };
  // load options using API call
  const loadOptionsPackaging = (inputValue) => {
    return fetch(`${Url}/select_packaging_types?nama=${inputValue}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res) => res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pieces_id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Bagian kosong, Silahkan lengkapi datanya"
      })
    }
    else if (!group) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Grup kosong, Silahkan lengkapi datanya"
      })
    }
    // else if (!brands_id) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Merek kosong, Silahkan lengkapi datanya"
    //   })
    // }
    else if (!category_id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Kategori kosong, Silahkan lengkapi datanya"
      })
    }
    // else if (!grade_id) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Grade kosong, Silahkan lengkapi datanya"
    //   })
    // }
    // else if (!type_id) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Tipe kosong, Silahkan lengkapi datanya"
    //   })
    // }
    else if (!unit) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Satuan kosong, Silahkan lengkapi datanya"
      })
    }
    // else if (!packaging_id) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Tipe Packaging kosong, Silahkan lengkapi datanya"
    //   })
    // }
    // else if (!buy_price) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Harga Beli kosong, Silahkan lengkapi datanya"
    //   })
    // }
    // else if (!sell_price) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Harga Jual kosong, Silahkan lengkapi datanya"
    //   })
    // }
    // else if (!discount) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Diskon kosong, Silahkan lengkapi datanya"
    //   })
    // }
    // else if (!taxes_id) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Data Pajak kosong, Silahkan lengkapi datanya"
    //   })
    // }
    else {


      const userData = new FormData();
      // userData.append("nama", name);
      // userData.append("nama_alias", alias);
      userData.append("bagian", pieces_id);
      userData.append("grup", group);
      userData.append("kategori", category_id);
      userData.append("grade", grade_id);
      userData.append("tipe", type_id);
      userData.append("merk", brands_id);
      userData.append("satuan", unit);
      userData.append("harga_beli", buy_price);
      userData.append("harga_jual", sell_price);
      userData.append("diskon", discount);
      userData.append("pajak", taxes_id);
      userData.append("jenis_kemasan", packaging_id);
      userData.append("status", status);

      // for (var pair of userData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }

      axios({
        method: "post",
        url: `${Url}/products`,
        data: userData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
        .then(function (res) {
          //handle success
          Swal.fire(
            "Berhasil Ditambahkan",
            `${getProduct} Masuk dalam list`,
            "success"
          );
          navigate("/produk");
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
    }
  };

  const getCodeById = async () => {
    axios
      .get(`${Url}/get_new_product_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetProduct(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }

  const onChange = () => {
    checked ? setChecked(false) : setChecked(true)

    if (checked === true) {
      setStatus("Active");
      // console.log('Active');
    } else {
      setStatus("Inactive");
      // console.log('Inactive');
    }
  };

  useEffect(() => {
    getCodeById()
  }, []);

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

  const optionsGroup = [
    {
      label: "Lokal",
      value: "Lokal"
    },
    {
      label: "Impor",
      value: "Impor"
    },
    {
      label: "Meatshop",
      value: "Meatshop"
    }
  ];

  const optionsUnit = [
    {
      label: "Kg",
      value: "kg"
    },
    {
      label: "Ekor",
      value: "ekor"
    },
    {
      label: "Pack",
      value: "pack"
    }
  ];

  const handleSingleChange = (value) => {
    setGroup(value.value);
  };

  const handleSingleChange1 = (value) => {
    setUnit(value.value)
  };

  return (
    <>

      <PageHeader
        className="bg-body rounded mb-2"
        onBack={() => window.history.back()}
        title="Buat Produk"
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
              value="Otomatis"
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Nama Produk
          </label>
          <div className="col-sm-10">
            <input
              type="kode"
              className="form-control"
              id="inputKode3"
              value="Otomatis"
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Alias
          </label>
          <div className="col-sm-10">
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              value="Otomatis"
              disabled
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Bagian
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Bagian..."
              cacheOptions
              defaultOptions
              isClearable
              value={selectedValue}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsPieces}
              onChange={handleChangePieces}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Merek
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Merek..."
              cacheOptions
              defaultOptions
              isClearable
              value={selectedValue5}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsBrands}
              onChange={handleChangeBrands}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Kategori
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Kategori..."
              cacheOptions
              defaultOptions
              isClearable
              value={selectedValue2}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsCategory}
              onChange={handleChangeCategory}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Grup
          </label>
          <div className="col-sm-10">
            <ReactSelect
              className="basic-single"
              placeholder="Pilih Grup..."
              classNamePrefix="select"
              isSearchable
              getOptionLabel={(value) => value.label}
              getOptionValue={(value) => value.value}
              onChange={handleSingleChange}
              options={optionsGroup}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Grade
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Grade..."
              cacheOptions
              defaultOptions
              isClearable
              value={selectedValue3}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsGrades}
              onChange={handleChangeGrades}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Tipe
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Tipe..."
              cacheOptions
              defaultOptions
              isClearable
              value={selectedValue4}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsTypes}
              onChange={handleChangeTypes}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Satuan
          </label>
          <div className="col-sm-10">
            <ReactSelect
              className="basic-single"
              placeholder="Pilih Satuan..."
              classNamePrefix="select"
              isSearchable
              getOptionLabel={(value) => value.label}
              getOptionValue={(value) => value.value}
              onChange={handleSingleChange1}
              options={optionsUnit}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Packaging Type
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Tipe Packaging"
              cacheOptions
              defaultOptions
              isClearable
              value={selectedValue7}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsPackaging}
              onChange={handleChangePackaging}
            />
          </div>
        </div>
      </PageHeader>

      <PageHeader
        className="bg-body rounded mb-2"
        title="Lain - lain"
      >
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            Harga Beli
          </label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              defaultValue={0}
              placeholder="Masukkan Harga..."
              id="inputKode3"
              value={buy_price}
              onChange={(e) => setBuy_price(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Harga Jual
          </label>
          <div className="col-sm-10">
            <input
              type="number"
              className="form-control"
              placeholder="Masukkan Harga..."
              id="inputNama3"
              value={sell_price}
              onChange={(e) => setSell_price(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Diskon</label>
          <div className="col-sm-2">
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                aria-label="Dollar amount (with dot and two decimal places)"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <span className="input-group-text">%</span>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Pajak
          </label>
          <div className="col-sm-10">
            <AsyncSelect
              placeholder="Pilih Pajak..."
              cacheOptions
              defaultOptions
              isClearable
              value={selectedValue6}
              getOptionLabel={(e) => e.type}
              getOptionValue={(e) => e.id}
              loadOptions={loadOptionsTaxes}
              onChange={handleChangeTaxes}
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
          </div>
        </div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
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

export default BuatProduk;
