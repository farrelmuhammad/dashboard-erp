import React from 'react'
import jsCookie from 'js-cookie';
import { useSelector } from 'react-redux';
import { PageHeader} from 'antd';

export const DetailGrup = () => {
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);

    return (
        <>
         <PageHeader
          ghost={false}
          onBack={() => window.history.back()}
          title="Detail Grup Pengguna">
          </PageHeader>

            <form className="  p-3 mb-5 bg-body rounded">
                <div className="row mb-3">
                    <label htmlFor="inputKode3" className="col-sm-2 col-form-label">Kode</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="kode"
                            className="form-control"
                            id="inputKode3"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputNama3" className="col-sm-2 col-form-label">Nama Grup</label>
                    <div className="col-sm-10">
                        <input
                            disabled="true"
                            type="Nama"
                            className="form-control"
                            id="inputNama3"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Keterangan</label>
                    <div className="col-sm-10">
                        <textarea
                            disabled="true"
                            class="form-control"
                            id="form4Example3"
                            rows="4"
                        />
                    </div>
                </div>
            </form>
        </>
    )
}

export default DetailGrup