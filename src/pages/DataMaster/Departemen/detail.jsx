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
// import InfoIcon from "@mui/icons-material/Info";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import jsCookie from "js-cookie";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Url from "../../../Config";
import "./form.css";
import { Checkbox } from "@mui/material";
import { useSelector } from "react-redux";
import { PageHeader } from "antd";

const DetailDepartemen = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [employeeDepartment, setEmployeeDepartment] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios
      .get(`${Url}/departments?kode=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then(function (res) {
        setData(res.data.data);
        setEmployeeDepartment(res.data.data[0].employees);
        console.log(res.data.data);
        console.log(res.data.data[0].employees);
      })
      .catch((err) => {
        // Jika Gagal
      });
  }, []);


  if (data.length > 0 && employeeDepartment.length > 0) {
    return (
        <>
          <form className="  p-3 mb-3 bg-body rounded">
            <div className="text-title text-start mb-4">
              <h3 className="title fw-bold">Edit Departemen</h3>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
                Kode
              </label>
              <div className="col-sm-10">
                <input
                  type="kode"
                  className="form-control"
                  value={id}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Nama Departemen
              </label>
              <div className="col-sm-10">
                {data?.map((d) => (
                  <input
                    type="Name"
                    className="form-control"
                    defaultValue={d.name}
                    disabled
                  />
                ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Keterangan
              </label>
              <div className="col-sm-10">
                {data?.map((d) => (
                  <textarea
                    className="form-control"
                    id="form4Example3"
                    rows="4"
                    defaultValue={d.description}
                    disabled
                  />
                ))}
              </div>
            </div>
            <div className="p-2 mb-2 bg-body rounded">
              <div className="text-title text-start">
                <h4 className="title fw-bold mb-2">Masukkan Karyawan</h4>
              </div>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nama Karyawan</TableCell>
                        <TableCell>Departmen</TableCell>
                        <TableCell>Posisi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employeeDepartment
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
                              <TableCell>{d.department_id}</TableCell>
                              <TableCell>{d.position_id}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={employeeDepartment.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </form>
        </>
      );
  } else {
    return (
        <>
        <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Departemen">
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
                  value={id}
                  disabled
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                Nama Departemen
              </label>
              <div className="col-sm-10">
                {data?.map((d) => (
                  <input
                    type="Name"
                    className="form-control"
                    defaultValue={d.name}
                    disabled
                  />
                ))}
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                Keterangan
              </label>
              <div className="col-sm-10">
                {data?.map((d) => (
                  <textarea
                    className="form-control"
                    id="form4Example3"
                    rows="4"
                    defaultValue={d.description}
                    disabled
                  />
                ))}
              </div>
            </div>
            <div className="p-2 mb-2 bg-body rounded">
              <div className="text-title text-start">
                <h4 className="title fw-bold mb-2">Masukkan Karyawan</h4>
              </div>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nama Karyawan</TableCell>
                        <TableCell>Departmen</TableCell>
                        <TableCell>Posisi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                            >
                              <TableCell></TableCell>
                              <TableCell>No Data</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                      {/* {employeeDepartment
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
                              <TableCell>{d.department_id}</TableCell>
                              <TableCell>{d.position_id}</TableCell>
                            </TableRow>
                          );
                        })} */}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={employeeDepartment.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </div>
          </form>
        </>
      );
  }
};

export default DetailDepartemen;
