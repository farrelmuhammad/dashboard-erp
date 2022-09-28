import './css/form.css'

const buatModul = () => {
    return (
        <>
        <form className="form-input   p-3 mb-5 bg-body rounded">
            <div className="text-title text-start mb-4">
                <h3 className="title fw-bold">Buat Modul</h3>
            </div>
                <div className="row mb-3">
                    <label for="inputKode3" className="col-sm-2 col-form-label">Urutan</label>
                    <div className="col-sm-2">
                    <input type="kode" className="form-control" id="inputKode3"/>
                    </div>
                </div>
                <div className="row mb-3">
                    <label for="inputNama3" className="col-sm-2 col-form-label">Modul</label>
                    <div className="col-sm-6">
                        <select id="disabledSelect" className="form-select">
                            <option>Disabled select</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <label for="inputPassword3" className="col-sm-2 col-form-label">Nama</label>
                    <div className="col-sm-6">
                    <input type="kode" className="form-control" id="inputKode3"/>
                    </div>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className="btn btn-success" type="button">Simpan</button>
                </div>
            </form>
        </>
    )
}

export default buatModul