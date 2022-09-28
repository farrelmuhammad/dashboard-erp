import { Collapse } from 'antd'
import AsyncSelect from "react-select/async";
import React from 'react'
const { Panel } = Collapse;

const AccountMapping = () => {
    const headerPanel = () => (
        <h5
            style={{
                // fontWeight: 'bold',
                // fontSize: '20px',
            }}>
            Penjualan Wholesale
        </h5>
    );

    const headerPanel1 = () => (
        <h5
            style={{
                // fontWeight: 'bold',
                // fontSize: '20px',
            }}>
            Penjualan Retail
        </h5>
    );

    const headerPanel2 = () => (
        <h5
            style={{
                // fontWeight: 'bold',
                // fontSize: '20px',
            }}>
            Pembelian
        </h5>
    );

    const headerPanel3 = () => (
        <h5
            style={{
                // fontWeight: 'bold',
                // fontSize: '20px',
            }}>
            Persediaan
        </h5>
    );

    const headerPanel4 = () => (
        <h5
            style={{
                // fontWeight: 'bold',
                // fontSize: '20px',
            }}>
            Lain-lain
        </h5>
    );
    return (
        <>
            <div className="text-title text-start mb-3">
                <h5 className="title fw-bold">Pemetaan Akun</h5>
            </div>

            <form className="p-1 mb-3 bg-body rounded">
                <Collapse expandIconPosition="right" ghost>
                    <Panel
                        header={headerPanel()}
                    >
                        <div className="row">
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Periode</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Import Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </form>

            <form className="p-1 mb-3 bg-body rounded">
                <Collapse expandIconPosition="right" ghost>
                    <Panel
                        header={headerPanel1()}
                    >
                        <div className="row">
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Periode</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Import Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </form>

            <form className="p-1 mb-3 bg-body rounded">
                <Collapse expandIconPosition="right" ghost>
                    <Panel
                        header={headerPanel2()}
                    >
                        <div className="row">
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Periode</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Import Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </form>

            <form className="p-1 mb-3 bg-body rounded">
                <Collapse expandIconPosition="right" ghost>
                    <Panel
                        header={headerPanel3()}
                    >
                        <div className="row">
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Periode</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Import Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </form>

            <form className="p-1 mb-3 bg-body rounded">
                <Collapse expandIconPosition="right" ghost>
                    <Panel
                        header={headerPanel4()}
                    >
                        <div className="row">
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Kas / Bank</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Kas/Bank..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsCategoryAcc}
                                        // onChange={handleChangeCategoryAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row mb-3">
                                    <label htmlFor="inputNama3" className="col-sm-4 col-form-label">Sumber</label>
                                    <div className="col-sm-7">
                                        <AsyncSelect
                                            placeholder="Pilih Transaksi..."
                                            cacheOptions
                                            defaultOptions
                                            // value={selectedValue2}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.id}
                                        // loadOptions={loadOptionsMasterAcc}
                                        // onChange={handleChangeMasterAcc}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </form>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3" role="group" aria-label="Basic mixed styles example">
                <button
                    type="button"
                    className="btn btn-primary rounded m-1"
                // onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </>
    )
}

export default AccountMapping