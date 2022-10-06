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

const EditBagian = () => {
  // const auth.token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState([]);

  const [getProduct, setGetProduct] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    fetchBagian()
  },[])

  const fetchBagian = async () => {
    await axios.get(`${Url}/pieces?id=${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then(function (response) {
      setData(response.data.data[0]);
      const getData = response.data.data[0]; 
      // console.log(response.data.data);
      console.log(getData)
      // {data.map((d) => {
      //   console.log(d.name) 
      //   console.log(d.description) 
      //   setName(d.name) 
      // setDescription(d.description) 
      // })}
      setCode(getData.code)
      setName(getData.name)
      setDescription(getData.description) 
    })
    .catch((err) => {
      // Jika Gagal
    });
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userData = new URLSearchParams();
    userData.append("nama", name);
    userData.append("deskripsi", description);
    product.map((p) => userData.append("produk[]", p));
    axios({
      method: "put",
      url: `${Url}/pieces/${id}`,
      data: userData,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(function (res) {
        //handle success
        console.log(res);
        Swal.fire("Berhasil Ditambahkan", `${id} Masuk dalam list`, "success");
        navigate("/bagian");
      })
      .catch((err) => {
        if (err.response) {
          console.log("err.response ", err.response);
          Swal.fire("Gagal Ditambahkan", "Mohon Cek Dahulu..", "error");
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
      .get(`${Url}/piece_products_available_products_update/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetProduct(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleCheck = (event) => {
    var updatedList = [...product];
    if (event.target.checked) {
      updatedList = [...product, event.target.value];
    } else {
      updatedList.splice(product.indexOf(event.target.value), 1);
    }
    setProduct(updatedList);
  };

   if (data){
    if(getProduct)
    return (
      <>
       <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Edit Bagian">
        </PageHeader>

        <form className="  p-3 mb-3 bg-body rounded">
        
          <div className="row mb-3">
            <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
              Kode
            </label>
            <div className="col-sm-10">
              <input
                type="kode"
                defaultValue={code}
                className="form-control"
                disabled
                id="inputKode3"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Bagian
            </label>
            <div className="col-sm-10">
              {/* {data?.map((d, index) => ( */}
                <input
                  type="Nama"
                  className="form-control"
                  id="inputNama3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              {/* ))} */}
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Keterangan
            </label>
            <div className="col-sm-10">
              {/* {data?.map((d, index) => ( */}
                <textarea
                  class="form-control"
                  id="form4Example3"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              {/* ))} */}
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
  }
};

export default EditBagian;