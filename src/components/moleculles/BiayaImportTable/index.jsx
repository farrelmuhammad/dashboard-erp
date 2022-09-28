import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { useState } from "react";
import jsCookie from "js-cookie";
import Url from "../../../Config";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";

const BiayaImportTable = () => {
  // const token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [biayaImport, setBiayaImport] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBiayaImport();
  }, []);

  const getBiayaImport = async () => {
    axios
      .get(`${Url}/costs`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setBiayaImport(res.data.data);
        setLoading(false);
      }
      );
  };

  const deleteBiayaImport = async (id, code) => {
  try {
    await axios.delete(`${Url}/costs/${id}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    }).then((res)=> {
      console.log("coba")
      console.log(res) 
      getBiayaImport();
      Swal.fire("Berhasil Dihapus!", `${code} Berhasil hapus`, "success");
    }) 
  }
  catch(err){
    Swal.fire("Gagal Dihapus!", "Data Tidak Bisa Dihapus", "error");
  };
   
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  if (!loading) {
    return (
      <>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Kode</TableCell>
                  <TableCell align="center">Nama Biaya</TableCell>
                  <TableCell align="center">Referensi</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  biayaImport?.length > 0 ? (
                    biayaImport
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((d) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={d.id}>
                          <TableCell align="center">{d.code}</TableCell>
                          <TableCell align="center">{d.name}</TableCell>
                          <TableCell align="center">{d.reference}</TableCell>
                          <TableCell align="center">
                            <Link to={`/biayaimport/detail/${d.id}`}>
                              <IconButton aria-label="detail">
                                <InfoIcon sx={{ color: "black" }} />
                              </IconButton>
                            </Link>
                            <Link to={`/biayaimport/edit/${d.id}`}>
                              <IconButton aria-label="edit">
                                <EditIcon sx={{ color: "black" }} />
                              </IconButton>
                            </Link>
                            <IconButton
                              aria-label="delete"
                              onClick={() => deleteBiayaImport(d.id, d.code)}
                            >
                              <DeleteIcon sx={{ color: "black" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    }) 
                  ) : 

                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell align="center" colSpan={4} className="text-no-data">No Rows Data</TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={biayaImport.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </>
    );
  }

  return <p>Loading</p>;
};

export default BiayaImportTable;
