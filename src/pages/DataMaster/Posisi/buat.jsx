import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
// import InfoIcon from '@mui/icons-material/Info';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { Checkbox } from "@mui/material";
import { useSelector } from "react-redux";
import { PageHeader} from 'antd';


const BuatPosisi = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  // const [id, setId] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [employee, setEmployee] = useState([]);
  const [validate, setValidate] = useState(false);
  const navigate = useNavigate();

  const [getPosition, setGetPosition] = useState();
  const [getEmployee, setGetEmployee] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Nama kosong, Silahkan Lengkapi datanya ",
      });
    }
    else{

    const userData = new FormData();
    // userData.append('id', id);
    userData.append("nama", name);
    userData.append("deskripsi", description);
    employee.map((emp) => userData.append("karyawan[]", emp));

    // for (var pair of userData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    axios({
      method: "post",
      url: `${Url}/positions`,
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
          `${getPosition} Masuk dalam list`,
          "success"
        );
        navigate("/posisi");
      })
      .catch((err) => {
        if (err.response) {
          console.log("err.response ", err.response);
          setValidate(err.response)
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
   } };

  const handleCheck = (event) => {
    var updatedList = [...employee];
    if (event.target.checked) {
      updatedList = [...employee, event.target.value];
    } else {
      updatedList.splice(employee.indexOf(event.target.value), 1);
    }
    setEmployee(updatedList);
  };

  useEffect(() => {
    axios
      .get(`${Url}/get_new_position_code`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetPosition(res.data.data);
      })
      .catch((err) => {
        // Jika Gagal
        console.log(err);
      });

    axios
      .get(`${Url}/employees`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setGetEmployee(res.data.data);
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

  if (getEmployee?.length > 0) {
    return (
      <>
       <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Buat Posisi">
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
                // onChange={e => setId(e.target.value)}
                value={getPosition}
                disabled
                // readOnly={getPosition}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
              Nama Posisi
            </label>
            <div className="col-sm-10">
              <input
                type="Nama"
                className="form-control"
                id="inputNama3"
                required
                onChange={(e) => setName(e.target.value)}
              />
              <div className="valid-feedback">Looks good!</div>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Keterangan
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                id="form4Example3"
                rows="4"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            {/* <button onClick={handleSubmit} className="btn btn-success" type="button">Simpan</button> */}
            <Button
              onClick={handleSubmit}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Simpan
            </Button>
          </div>
        </form>

        {/* <form className="  p-3 mb-3 bg-body rounded">
          <div className="text-title text-start mb-2">
            <h4 className="title fw-bold">Masukkan Data Karyawan</h4>
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>Kode</TableCell>
                    <TableCell>Nama Karyawan</TableCell>
                    <TableCell>Departmen</TableCell>
                    <TableCell>Posisi</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getEmployee
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                          <TableCell>{d.department_id}</TableCell>
                          <TableCell>{d.position_id}</TableCell>
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
              count={getEmployee.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </form> */}
      </>
    );
  }
};

export default BuatPosisi;
