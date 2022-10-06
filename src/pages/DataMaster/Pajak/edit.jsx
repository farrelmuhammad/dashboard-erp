import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { Checkbox } from "@mui/material";
import { useSelector } from "react-redux";
import { PageHeader } from "antd";

const BuatPajak = () => {
  // const auth.token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [type, setType] = useState('');
  const [rate, setRate] = useState('');
  const [product, setProduct] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState([]);
 
  const [getProduct, setGetProduct] = useState();

  

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("jenis", type);
    userData.append("tarif", rate);
    axios({
      method: "put",
      url: `${Url}/taxes/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (response) {
        //handle success
        console.log(response);
        Swal.fire("Berhasil Di Update", `${code} Masuk dalam list`, "success");
        navigate("/grade");
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

  // const handleCheck = (event) => {
  //   var updatedList = [...product];
  //   if (event.target.checked) {
  //     updatedList = [...product, event.target.value];
  //   } else {
  //     updatedList.splice(product.indexOf(event.target.value), 1);
  //   }
  //   setProduct(updatedList);
  // };

  useEffect(() => {
    axios
      .get(`${Url}/taxes?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (response) {
        const getData = response.data.data[0];
      setData(getData);
      setCode(getData.code);
      setType(getData.type);
      setRate(getData.rate);
      console.log(getData);
      })
      .catch((err) => {
        // Jika Gagal
      });

    axios
      .get(`${Url}/tax_products_available_products_update/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetProduct(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };

  if (getProduct?.length > 0)
    return (
      <>
       <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Edit Pajak">
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
                value={code}
                disabled
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Pajak
            </label>
            <div className="col-sm-10">
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  defaultValue={type}
                  onChange={(e) => setType(e.target.value)}
                />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Persentase
            </label>
            <div className="col-sm-5">
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  defaultValue={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
            </div>
            <div className="col-sm-1">
              <span className="input-group-text" id="addon-wrapping">
                %
              </span>
            </div>
          </div>
          {/* <div className="p-2 mb-2 bg-body rounded">
            <div className="text-title text-start">
              <h4 className="title fw-bold mb-2">Masukkan Produk</h4>
            </div>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Kode</TableCell>
                      <TableCell>Nama Produk</TableCell>
                      <TableCell>Grup</TableCell>
                      <TableCell>Kategori</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getProduct
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((d) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={d.id}
                          >
                            <TableCell>{d.id}</TableCell>
                            <TableCell>{d.name}</TableCell>
                            <TableCell>{d._group}</TableCell>
                            <TableCell>{d.category_id}</TableCell>
                            <TableCell>
                              <Checkbox
                                key={d.id}
                                value={d.id}
                                id={d.id}
                                onChange={handleCheck}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={getProduct.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div> */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            {/* <button onClick={handleUpdate} className="btn btn-success" type="button">Simpan</button> */}
            <Button
              onClick={handleUpdate}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Simpan
            </Button>
          </div>
        </form>
      </>
    );
};

export default BuatPajak;
