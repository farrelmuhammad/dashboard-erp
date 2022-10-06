// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
import axios from "axios";
import jsCookie from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Url from "../../../Config";
import "./form.css";
import { PageHeader } from "antd";

export const DetailKaryawan = () => {
  // const auth.token = jsCookie.get("auth");
  const auth = useSelector(state => state.auth);
  const [data, setData] = useState([]);
  const [dataWarehouse, setDataWarehouse] = useState([]);
  const { id } = useParams();

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(event.target.value);
  //   setPage(0);
  // };

  useEffect(() => {
    axios
      .get(`${Url}/employees?id=${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        console.log(res.data.data);
      });

    axios
      .get(`${Url}/employee_warehouses/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => setDataWarehouse(res.data.data));
  }, []);

  return (
    <>
    <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Karyawan">
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
              defaultValue={id}
              readOnly
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            NIP
          </label>
          <div className="col-sm-10">
            {data?.map((d, index) => (
              <input
                key={index}
                type="kode"
                className="form-control"
                readOnly
                defaultValue={d.nip}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
            NIK
          </label>
          <div className="col-sm-10">
            {data?.map((d, index) => (
              <input
                key={index}
                type="kode"
                className="form-control"
                readOnly
                defaultValue={d.nik}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Nama Karyawan
          </label>
          <div className="col-sm-10">
            {data?.map((d, index) => (
              <input
                key={index}
                type="Nama"
                className="form-control"
                readOnly
                defaultValue={d.name}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Inisial
          </label>
          <div className="col-sm-10">
            {data?.map((d, index) => (
              <input
                key={index}
                type="Nama"
                className="form-control"
                readOnly
                defaultValue={d.initial}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Departemen
          </label>
          <div className="col-sm-10">
            <select className="form-select" disabled="true">
              <option>Pilih Departemen</option>
              {data?.map((d) => {
                return (
                  <option selected={d.department_id} key={d}>
                    {d.department_id}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Posisi
          </label>
          <div className="col-sm-10">
            <select className="form-select" disabled="true">
              <option>Pilih Posisi</option>
              {data?.map((d) => {
                return (
                  <option selected={d.position_id} key={d}>
                    {d.position_id}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            No Telepon
          </label>
          <div className="col-sm-10">
            {data?.map((d, index) => (
              <input
                key={index}
                type="Nama"
                className="form-control"
                readOnly
                defaultValue={d.phone_number}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            {data?.map((d, index) => (
              <input
                key={index}
                type="Nama"
                className="form-control"
                readOnly
                defaultValue={d.email}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Tanggal Lahir
          </label>
          <div className="col-sm-10">
            {data?.map((d) => (
              <input readOnly type="date" value={d.date_of_birth} className="form-control" />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            Tanggal Masuk
          </label>
          <div className="col-sm-10">
            {data?.map((d) => (
              <input readOnly type="date" value={d.start_date} className="form-control" />
            ))}
          </div>
        </div>
      </form>
      <form className="  p-3 mb-3 bg-body rounded">
        <div className="text-title text-start mb-4">
          <h3 className="title fw-bold">Dokumen</h3>
        </div>
        {/* <div className="row mb-3">
                        <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Tanggal Keluar</label>
                        <div className="col-sm-10">
                        <input type="kode" className="form-control" id="inputKode3"/>
                        </div>
                    </div> */}
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
            NPWP
          </label>
          <div className="col-sm-10">
            {data?.map((d, index) => (
              <input
                key={index}
                type="Nama"
                className="form-control"
                readOnly
                defaultValue={d.npwp}
              />
            ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Alamat</label>
          <div className="col-sm-10">
          {data?.map((d, index) => (
            <textarea
            key={index}
              className="form-control"
              id="form4Example3"
              rows="4"
              value={d.address}
              disabled
            />
          ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kelurahan</label>
          <div className="col-sm-10">
          {data?.map((d, index) => (
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={d.urban_village}
              key={index}
            />
          ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kecamatan</label>
          <div className="col-sm-10">
          {data?.map((d, index) => (
            <input
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={d.sub_district}
              key={index}
            />
          ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kota</label>
          <div className="col-sm-10">
          {data?.map((d, index) => (
            <input
            key={index}
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={d.city}
            />
          ))}
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Kode Pos</label>
          <div className="col-sm-10">
          {data?.map((d, index) => (
            <input
            key={index}
              type="Nama"
              className="form-control"
              id="inputNama3"
              disabled
              value={d.postal_code}
            />
          ))}
          </div>
        </div>
        <fieldset className="row mb-3">
          <legend className="col-form-label col-sm-2 pt-0">Status</legend>
          <div className="col-sm-10">
            <div className="status">
              {data?.map((d) => {
                if (d.status === "active") {
                  return (
                    <button type="button" class="btn btn-primary pe-none">
                      {d.status}
                    </button>
                  );
                } else {
                  return (
                    <button type="button" class="btn btn-danger pe-none">
                      {d.status}
                    </button>
                  );
                }
              })}
              {/* <input
                value="active"
                checked={status === "active"}
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" htmlFor="gridRadios1">
                Aktif
              </label> */}
            </div>
            {/* <div className="form-check">
                  <input
                    value="non-active"
                    checked={status === "non-active"}
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                  />
                  <label className="form-check-label" htmlFor="gridRadios2">
                    Non-Aktif
                  </label>
                </div> */}
          </div>
        </fieldset>
      </form>
      {/* <form className="  p-3 mb-3 bg-body rounded">
        <div className="text-title text-start mb-2">
          <h4 className="title fw-bold">Data Gudang</h4>
        </div>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Kode</TableCell>
                  <TableCell>Nama Gudang</TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>Kota</TableCell>
                  <TableCell>Kode Pos</TableCell>
                  <TableCell>No. Telepon</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataWarehouse
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((d) => {
                    if (!dataWarehouse) {
                      return (
                        <TableRow>
                          <TableCell>Data Kosong</TableCell>
                        </TableRow>
                      );
                    } else {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={d.id}
                        >
                          <TableCell>{d.id}</TableCell>
                          <TableCell>{d.name}</TableCell>
                          <TableCell>{d.address}</TableCell>
                          <TableCell>{d.city}</TableCell>
                          <TableCell>{d.postal_code}</TableCell>
                          <TableCell>{d.phone_number}</TableCell>
                          
                        </TableRow>
                      );
                    }
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </form> */}
      {/* <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <Button
              onClick={handleUpdate}
              variant="contained"
              endIcon={<SendIcon />}
            >
              Simpan
            </Button>
          </div> */}
    </>
  );
};

export default DetailKaryawan;
