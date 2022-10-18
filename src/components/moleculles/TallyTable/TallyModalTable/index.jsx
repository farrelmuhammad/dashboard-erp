import React from 'react'
// import { Link } from 'react-router-dom'
// import './Modal.css'


const TallyModalTable = ({setOpenModal}) => {

  return (
    <>
     <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
                setOpenModal(false);
            }}
            >
            X
          </button>
        </div>
    <h3 className="fw-normal">Tambah Box Tally Sheets</h3>
    <div className="container-list p-1 mb-2 bg-body rounded d-flex flex-column">
        <div className="container-table">
            {/* <CTable striped hover className="container-form">
                <CTableHead>
                    <CTableRow>
                    <CTableHeaderCell scope="col">Jumlah</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow>
                    <CTableDataCell scope="row">11</CTableDataCell>
                    <CTableDataCell>20</CTableDataCell>
                    <CTableDataCell>
                        <button type="button" className="btn btn-success m-1">Edit</button>
                    </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                    <CTableDataCell scope="row">11</CTableDataCell>
                    <CTableDataCell>20</CTableDataCell>
                    <CTableDataCell>
                        <button type="button" className="btn btn-success m-1">Edit</button>
                    </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                    <CTableDataCell scope="row">11</CTableDataCell>
                    <CTableDataCell>20</CTableDataCell>
                    <CTableDataCell>
                        <button type="button" className="btn btn-success m-1">Edit</button>
                    </CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable> */}
        </div>
    </div>
        
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button>Tambah</button>
        </div>
      </div>
    </div>

    </>
  )
}

export default TallyModalTable