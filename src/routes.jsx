
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

import Login from './pages/Login'

import Grup from './pages/DataMaster/Grup'
import BuatGrup from './pages/DataMaster/Grup/buat'
import EditGrup from './pages/DataMaster/Grup/edit'
import DetailGrup from './pages/DataMaster/Grup/detail'

import Pengguna from './pages/DataMaster/Pengguna'
import BuatPengguna from './pages/DataMaster/Pengguna/buat'
import EditPengguna from './pages/DataMaster/Pengguna/edit'
import DetailPengguna from './pages/DataMaster/Pengguna/detail'

import Departemen from './pages/DataMaster/Departemen'
import BuatDepartemen from './pages/DataMaster/Departemen/buat'
import EditDepartemen from './pages/DataMaster/Departemen/edit'
import DetailDepartemen from './pages/DataMaster/Departemen/detail'

import Posisi from './pages/DataMaster/Posisi'
import BuatPosisi from './pages/DataMaster/Posisi/buat'
import EditPosisi from './pages/DataMaster/Posisi/edit'
import DetailPosisi from './pages/DataMaster/Posisi/detail'

import Karyawan from './pages/DataMaster/Karyawan'
import BuatKaryawan from './pages/DataMaster/Karyawan/buat'
import EditKaryawan from './pages/DataMaster/Karyawan/edit'
import DetailKaryawan from './pages/DataMaster/Karyawan/detail'

import Pelanggan from './pages/DataMaster/Pelanggan'
import BuatPelanggan from './pages/DataMaster/Pelanggan/buat'
import EditPelanggan from './pages/DataMaster/Pelanggan/edit'
import DetailPelanggan from './pages/DataMaster/Pelanggan/detail'

import Gudang from './pages/DataMaster/Gudang'
import BuatGudang from './pages/DataMaster/Gudang/buat'
import EditGudang from './pages/DataMaster/Gudang/edit'
import DetailGudang from './pages/DataMaster/Gudang/detail'

import Bagian from './pages/DataMaster/Bagian'
import BuatBagian from './pages/DataMaster/Bagian/buat'
import EditBagian from './pages/DataMaster/Bagian/edit'
import DetailBagian from './pages/DataMaster/Bagian/detail'

import Kategori from './pages/DataMaster/Kategori'
import BuatKategori from './pages/DataMaster/Kategori/buat'
import EditKategori from './pages/DataMaster/Kategori/edit'
import DetailKategori from './pages/DataMaster/Kategori/detail'

import Merek from './pages/DataMaster/Merek'
import BuatMerek from './pages/DataMaster/Merek/buat'
import EditMerek from './pages/DataMaster/Merek/edit'
import DetailMerek from './pages/DataMaster/Merek/detail'

import Pajak from './pages/DataMaster/Pajak'
import BuatPajak from './pages/DataMaster/Pajak/buat'
import EditPajak from './pages/DataMaster/Pajak/edit'
import DetailPajak from './pages/DataMaster/Pajak/detail'

import Grade from './pages/DataMaster/Grade'
import BuatGrade from './pages/DataMaster/Grade/buat'
import EditGrade from './pages/DataMaster/Grade/edit'
import DetailGrade from './pages/DataMaster/Grade/detail'

import TipeProduk from './pages/DataMaster/Tipe Produk'
import BuatTipeProduk from './pages/DataMaster/Tipe Produk/buat'
import EditTipeProduk from './pages/DataMaster/Tipe Produk/edit'
import DetailTipeProduk from './pages/DataMaster/Tipe Produk/detail'

import Produk from './pages/DataMaster/Produk'
import BuatProduk from './pages/DataMaster/Produk/buat'
import EditProduk from './pages/DataMaster/Produk/edit'
import DetailProduk from './pages/DataMaster/Produk/detail'

// module Inventory
import Adjustment from './pages/Inventory/Adjustment'
import CreateAdjustment from './pages/Inventory/Adjustment/create'
import EditAdjustment from './pages/Inventory/Adjustment/edit'
import DetailAdjustment from './pages/Inventory/Adjustment/detail'

import StockMutation from './pages/Inventory/StockMutation'

import GoodsRequest from './pages/Inventory/GoodsRequest'
import CreateGoodsRequest from './pages/Inventory/GoodsRequest/create'
import EditGoodsRequest from './pages/Inventory/GoodsRequest/edit'
import DetailGoodsRequest from './pages/Inventory/GoodsRequest/detail'

import GoodsTransfer from './pages/Inventory/GoodsTransfer'
import CreateGoodsTransfer from './pages/Inventory/GoodsTransfer/create'
import EditGoodsTransfer from './pages/Inventory/GoodsTransfer/edit'
import DetailGoodsTransfer from './pages/Inventory/GoodsTransfer/detail'

import Production from './pages/Inventory/Production'
import CreateProduction from './pages/Inventory/Production/create'
import EditProduction from './pages/Inventory/Production/edit'
import DetailProduction from './pages/Inventory/Production/detail'

import Pesanan from './pages/Penjualan/Pesanan'
import BuatPesanan from './pages/Penjualan/Pesanan/buat'
import EditPesanan from './pages/Penjualan/Pesanan/edit'
import DetailPesanan from './pages/Penjualan/Pesanan/detail'

import SuratJalan from './pages/Penjualan/SuratJalan'
import BuatSuratJalan from './pages/Penjualan/SuratJalan/buat'
import EditSuratJalan from './pages/Penjualan/SuratJalan/edit'
import DetailSuratJalan from './pages/Penjualan/SuratJalan/detail'

import Faktur from './pages/Penjualan/Faktur'
import BuatFaktur from './pages/Penjualan/Faktur/buat'
import EditFaktur from './pages/Penjualan/Faktur/edit'
import DetailFaktur from './pages/Penjualan/Faktur/detail'

import Retur from './pages/Penjualan/Retur'
import BuatRetur from './pages/Penjualan/Retur/buat'
import EditRetur from './pages/Penjualan/Retur/edit'
import DetailRetur from './pages/Penjualan/Retur/detail'

import Pelunasan from './pages/Penjualan/Pelunasan'
import BuatPelunasan from './pages/Penjualan/Pelunasan/buat'
import EditPelunasan from './pages/Penjualan/Pelunasan/edit'
import DetailPelunasan from './pages/Penjualan/Pelunasan/detail'

import Tally from './pages/Penjualan/TallySheet'
import BuatTally from './pages/Penjualan/TallySheet/buat'
import EditTally from './pages/Penjualan/TallySheet/edit'
import DetailTally from './pages/Penjualan/TallySheet/detail'

import Supplier from './pages/MasterPembelian/Supplier'
import BuatSupplier from './pages/MasterPembelian/Supplier/buat'
import EditSupplier from './pages/MasterPembelian/Supplier/edit'
import DetailSupplier from './pages/MasterPembelian/Supplier/detail'

import MataUang from './pages/MasterPembelian/DaftarMataUang'
import BuatMataUang from './pages/MasterPembelian/DaftarMataUang/buat'
import EditMataUang from './pages/MasterPembelian/DaftarMataUang/edit'
import DetailMataUang from './pages/MasterPembelian/DaftarMataUang/detail'

import BiayaImport from './pages/MasterPembelian/BiayaImport'
import BuatBiayaImport from './pages/MasterPembelian/BiayaImport/buat'
import EditBiayaImport from './pages/MasterPembelian/BiayaImport/edit'
import DetailBiayaImport from './pages/MasterPembelian/BiayaImport/detail'

import PesananPembelian from './pages/Pembelian/Pembelian'
import BuatPesananPembelian from './pages/Pembelian/Pembelian/buat'
import EditPesananPembelian from './pages/Pembelian/Pembelian/edit'
import DetailPesananPembelian from './pages/Pembelian/Pembelian/detail'

import TallySheetPembelian from './pages/Pembelian/TallySheet'
import BuatTallySheet from './pages/Pembelian/TallySheet/buat'
import EditTallySheet from './pages/Pembelian/TallySheet/edit'
import DetailTallySheet from './pages/Pembelian/TallySheet/detail'

import FakturPembelian from './pages/Pembelian/Faktur'
import BuatFakturPembelian from './pages/Pembelian/Faktur/buat'
import EditFakturPembelian from './pages/Pembelian/Faktur/edit'
import DetailFakturPembelian from './pages/Pembelian/Faktur/detail'

import ChartOfAccounts from './pages/Accountancy/ChartOfAccounts'
import BuatCoa from './pages/Accountancy/ChartOfAccounts/buat'
import NotFound from './pages/NotFound'
import EditCoa from './pages/Accountancy/ChartOfAccounts/edit'
import DetailCoa from './pages/Accountancy/ChartOfAccounts/detail'

import HistoryBankReconciliation from './pages/Accountancy/BankReconciliation/History'
import ListBankReconciliation from './pages/Accountancy/BankReconciliation/List'

import GeneralJournal from './pages/Accountancy/GeneralJournal'
import BuatGeneralJournal from './pages/Accountancy/GeneralJournal/buat'
import EditGeneralJournal from './pages/Accountancy/GeneralJournal/edit'
import DetailGeneralJournal from './pages/Accountancy/GeneralJournal/detail'
import AccountMapping from './pages/Accountancy/AccountMapping'

import PenerimaanBarang from './pages/Pembelian/PenerimaanBarang'
import EditPenerimaanBarang from './pages/Pembelian/PenerimaanBarang/edit'
import DetailPenerimaanBarang from './pages/Pembelian/PenerimaanBarang/detail'
import BuatPenerimaanBarang from './pages/Pembelian/PenerimaanBarang/buat'
import ReturPembelian from './pages/Pembelian/Retur'
import BuatReturPembelian from './pages/Pembelian/Retur/buat'
import EditReturPembelian from './pages/Pembelian/Retur/edit'
import DetailReturPembelian from './pages/Pembelian/Retur/detail'
import PembayaranPembelian from './pages/Pembelian/Pembayaran'
import BuatPembayaranPembelian from './pages/Pembelian/Pembayaran/buat'
import EditPembayaranPembelian from './pages/Pembelian/Pembayaran/edit'
import DetailPembayaranPembelian from './pages/Pembelian/Pembayaran/detail'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Url from './Config'
import CreditNote from './pages/Pembelian/CreditNote'
import BuatCreditNote from './pages/Pembelian/CreditNote/buat'
import EditCreditNote from './pages/Pembelian/CreditNote/edit'
import DetailCreditNote from './pages/Pembelian/CreditNote/detail'
import PIB from './pages/Pembelian/PIB'
import BuatPIB from './pages/Pembelian/PIB/buat'
import EditPIB from './pages/Pembelian/PIB/edit'
import DetailPIB from './pages/Pembelian/PIB/detail'

// modules pelanggan datamaster 



const RouteApp = () => {
    const auth = useSelector(state => state.auth);
    const [isAdmin, setIsAdmin] = useState();

    const getUser = async () => {
        axios.get(`${Url}/user`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                setIsAdmin(res.data.is_admin)
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    const adminRoute = <>
        {/* Data Master */}
        <Route path="/grup" exact element={<Grup />} />
        <Route path="/grup/buat" exact element={<BuatGrup />} />
        <Route path="/grup/edit/:id" exact element={<EditGrup />} />
        <Route path="/grup/detail/:id" exact element={<DetailGrup />} />

        <Route path="/pengguna" exact element={<Pengguna />} />
        <Route path="/pengguna/buat" exact element={<BuatPengguna />} />
        <Route path="/pengguna/edit/:id" exact element={<EditPengguna />} />
        <Route path="/pengguna/detail/:id" exact element={<DetailPengguna />} />

        <Route path="/departemen" exact element={<Departemen />} />
        <Route path="/departemen/buat" exact element={<BuatDepartemen />} />
        <Route path="/departemen/edit/:id" exact element={<EditDepartemen />} />
        <Route path="/departemen/detail/:id" exact element={<DetailDepartemen />} />

        <Route path="/posisi" exact element={<Posisi />} />
        <Route path="/posisi/buat" exact element={<BuatPosisi />} />
        <Route path="/posisi/edit/:id" exact element={<EditPosisi />} />
        <Route path="/posisi/detail/:id" exact element={<DetailPosisi />} />

        <Route path="/karyawan" exact element={<Karyawan />} />
        <Route path="/karyawan/buat" exact element={<BuatKaryawan />} />
        <Route path="/karyawan/edit/:id" exact element={<EditKaryawan />} />
        <Route path="/karyawan/detail/:id" exact element={<DetailKaryawan />} />

        <Route path="/pelanggan" exact element={<Pelanggan />} />
        <Route path="/pelanggan/buat" exact element={<BuatPelanggan />} />
        <Route path="/pelanggan/edit/:id" exact element={<EditPelanggan />} />
        <Route path="/pelanggan/detail/:id" exact element={<DetailPelanggan />} />

        <Route path="/gudang" exact element={<Gudang />} />
        <Route path="/gudang/buat" exact element={<BuatGudang />} />
        <Route path="/gudang/edit/:id" exact element={<EditGudang />} />
        <Route path="/gudang/detail/:id" exact element={<DetailGudang />} />

        <Route path="/bagian" exact element={<Bagian />} />
        <Route path="/bagian/buat" exact element={<BuatBagian />} />
        <Route path="/bagian/edit/:id" exact element={<EditBagian />} />
        <Route path="/bagian/detail/:id" exact element={<DetailBagian />} />

        <Route path="/kategori" exact element={<Kategori />} />
        <Route path="/kategori/buat" exact element={<BuatKategori />} />
        <Route path="/kategori/edit/:id" exact element={<EditKategori />} />
        <Route path="/kategori/detail/:id" exact element={<DetailKategori />} />

        <Route path="/merek" exact element={<Merek />} />
        <Route path="/merek/buat" exact element={<BuatMerek />} />
        <Route path="/merek/edit/:id" exact element={<EditMerek />} />
        <Route path="/merek/detail/:id" exact element={<DetailMerek />} />

        <Route path="/pajak" exact element={<Pajak />} />
        <Route path="/pajak/buat" exact element={<BuatPajak />} />
        <Route path="/pajak/edit/:id" exact element={<EditPajak />} />
        <Route path="/pajak/detail/:id" exact element={<DetailPajak />} />

        <Route path="/grade" exact element={<Grade />} />
        <Route path="/grade/buat" exact element={<BuatGrade />} />
        <Route path="/grade/edit/:id" exact element={<EditGrade />} />
        <Route path="/grade/detail/:id" exact element={<DetailGrade />} />

        <Route path="/tipe" exact element={<TipeProduk />} />
        <Route path="/tipe/buat" exact element={<BuatTipeProduk />} />
        <Route path="/tipe/edit/:id" exact element={<EditTipeProduk />} />
        <Route path="/tipe/detail/:id" exact element={<DetailTipeProduk />} />

        <Route path="/produk" exact element={<Produk />} />
        <Route path="/produk/buat" exact element={<BuatProduk />} />
        <Route path="/produk/edit/:id" exact element={<EditProduk />} />
        <Route path="/produk/detail/:id" exact element={<DetailProduk />} />

        {/* Inventory Modul */}
        <Route path="/adjustment" exact element={<Adjustment />} />
        <Route path="/adjustment/create" exact element={<CreateAdjustment />} />
        <Route path="/adjustment/edit/:id" exact element={<EditAdjustment />} />
        <Route path="/adjustment/detail/:id" exact element={<DetailAdjustment />} />

        <Route path="/stockmutation" exact element={<StockMutation />} />

        <Route path="/goodsrequest" exact element={<GoodsRequest />} />
        <Route path="/goodsrequest/create" exact element={<CreateGoodsRequest />} />
        <Route path="/goodsrequest/edit/:id" exact element={<EditGoodsRequest />} />
        <Route path="/goodsrequest/detail" exact element={<DetailGoodsRequest />} />

        <Route path="/goodstransfer" exact element={<GoodsTransfer />} />
        <Route path="/goodstransfer/create" exact element={<CreateGoodsTransfer />} />
        <Route path="/goodstransfer/edit/:id" exact element={<EditGoodsTransfer />} />
        <Route path="/goodstransfer/detail" exact element={<DetailGoodsTransfer />} />

        <Route path="/production" exact element={<Production />} />
        <Route path="/production/create" exact element={<CreateProduction />} />
        <Route path="/production/edit/:id" exact element={<EditProduction />} />
        <Route path="/production/detail" exact element={<DetailProduction />} />

        {/* Supllier Modul */}
        <Route path="/supplier" exact element={<Supplier />} />
        <Route path="/supplier/buat" exact element={<BuatSupplier />} />
        <Route path="/supplier/edit/:id" exact element={<EditSupplier />} />
        <Route path="/supplier/detail/:id" exact element={<DetailSupplier />} />

        <Route path="/matauang" exact element={<MataUang />} />
        <Route path="/matauang/buat" exact element={<BuatMataUang />} />
        <Route path="/matauang/edit/:id" exact element={<EditMataUang />} />
        <Route path="/matauang/detail/:id" exact element={<DetailMataUang />} />

        <Route path="/biayaimport" exact element={<BiayaImport />} />
        <Route path="/biayaimport/buat" exact element={<BuatBiayaImport />} />
        <Route path="/biayaimport/edit/:id" exact element={<EditBiayaImport />} />
        <Route path="/biayaimport/detail/:id" exact element={<DetailBiayaImport />} />

        {/* Seller Modul */}
        <Route path="/pesanan" exact element={<Pesanan />} />
        <Route path="/pesanan/buat" exact element={<BuatPesanan />} />
        <Route path="/pesanan/edit/:id" exact element={<EditPesanan />} />
        <Route path="/pesanan/detail/:id" exact element={<DetailPesanan />} />

        <Route path="/suratjalan" exact element={<SuratJalan />} />
        <Route path="/suratjalan/buat" exact element={<BuatSuratJalan />} />
        <Route path="/suratjalan/edit/:id" exact element={<EditSuratJalan />} />
        <Route path="/suratjalan/detail/:id" exact element={<DetailSuratJalan />} />

        <Route path="/faktur" exact element={<Faktur />} />
        <Route path="/faktur/buat" exact element={<BuatFaktur />} />
        <Route path="/faktur/edit/:id" exact element={<EditFaktur />} />
        <Route path="/faktur/detail/:id" exact element={<DetailFaktur />} />

        <Route path="/retur" exact element={<Retur />} />
        <Route path="/retur/buat" exact element={<BuatRetur />} />
        <Route path="/retur/edit/:id" exact element={<EditRetur />} />
        <Route path="/retur/detail/:id" exact element={<DetailRetur />} />

        <Route path="/pelunasan" exact element={<Pelunasan />} />
        <Route path="/pelunasan/buat" exact element={<BuatPelunasan />} />
        <Route path="/pelunasan/edit/:id" exact element={<EditPelunasan />} />
        <Route path="/pelunasan/detail/:id" exact element={<DetailPelunasan />} />

        <Route path="/tally" exact element={<Tally />} />
        <Route path="/tally/buat" exact element={<BuatTally />} />
        <Route path="/tally/edit/:id" exact element={<EditTally />} />
        <Route path="/tally/detail/:id" exact element={<DetailTally />} />

        {/* Pembelian Modul */}
        <Route path="/pesananpembelian" exact element={<PesananPembelian />} />
        <Route path="/pesananpembelian/buat" exact element={<BuatPesananPembelian />} />
        <Route path="/pesananpembelian/edit/:id" exact element={<EditPesananPembelian />} />
        <Route path="/pesananpembelian/detail/:id" exact element={<DetailPesananPembelian />} />

        <Route path="/tallypembelian" exact element={<TallySheetPembelian />} />
        <Route path="/tallypembelian/buat" exact element={<BuatTallySheet />} />
        <Route path="/tallypembelian/edit/:id" exact element={<EditTallySheet />} />
        <Route path="/tallypembelian/detail/:id" exact element={<DetailTallySheet />} />


        <Route path="/penerimaanbarang" exact element={<PenerimaanBarang />} />
        <Route path="/penerimaanbarang/buat" exact element={<BuatPenerimaanBarang />} />
        <Route path="/penerimaanbarang/edit/:id" exact element={<EditPenerimaanBarang />} />
        <Route path="/penerimaanbarang/detail/:id" exact element={<DetailPenerimaanBarang />} />

        <Route path="/creditnote" exact element={<CreditNote />} />
        <Route path="/creditnote/buat" exact element={<BuatCreditNote />} />
        <Route path="/creditnote/edit/:id" exact element={<EditCreditNote />} />
        <Route path="/creditnote/detail/:id" exact element={<DetailCreditNote />} />
        
        <Route path="/fakturpembelian" exact element={<FakturPembelian />} />
        <Route path="/fakturpembelian/buat" exact element={<BuatFakturPembelian />} />
        <Route path="/fakturpembelian/edit/:id" exact element={<EditFakturPembelian />} />
        <Route path="/fakturpembelian/detail/:id" exact element={<DetailFakturPembelian />} />

        <Route path="/returpembelian" exact element={<ReturPembelian />} />
        <Route path="/returpembelian/buat" exact element={<BuatReturPembelian />} />
        <Route path="/returpembelian/edit/:id" exact element={<EditReturPembelian />} />
        <Route path="/returpembelian/detail/:id" exact element={<DetailReturPembelian />} />

        <Route path="/pembayaranpembelian" exact element={<PembayaranPembelian />} />
        <Route path="/pembayaranpembelian/buat" exact element={<BuatPembayaranPembelian />} />
        <Route path="/pembayaranpembelian/edit/:id" exact element={<EditPembayaranPembelian />} />
        <Route path="/pembayaranpembelian/detail/:id" exact element={<DetailPembayaranPembelian />} />

        <Route path="/pib" exact element={<PIB />} />
        <Route path="/pib/buat" exact element={<BuatPIB />} />
        <Route path="/pib/edit/:id" exact element={<EditPIB />} />
        <Route path="/pib/detail/:id" exact element={<DetailPIB />} />

        {/* Accountancy Modul */}
        <Route path="/coa" exact element={<ChartOfAccounts />} />
        <Route path="/coa/buat" exact element={<BuatCoa />} />
        <Route path="/coa/edit/:id" exact element={<EditCoa />} />
        <Route path="/coa/detail/:id" exact element={<DetailCoa />} />

        <Route path="/jurnal" exact element={<GeneralJournal />} />
        <Route path="/jurnal/buat" exact element={<BuatGeneralJournal />} />
        <Route path="/jurnal/edit/:id" exact element={<EditGeneralJournal />} />
        <Route path="/jurnal/detail/:id" exact element={<DetailGeneralJournal />} />

        <Route path="/bankreconciliation/history" exact element={<HistoryBankReconciliation />} />
        <Route path="/bankreconciliation/list" exact element={<ListBankReconciliation />} />

        <Route path="/accountmapping" exact element={<AccountMapping />} />
    </>

    const userRoute = <>
        {/* Data Master */}
        <Route path="/grup" exact element={<Grup />} />
        <Route path="/grup/buat" exact element={<BuatGrup />} />
        <Route path="/grup/edit/:id" exact element={<EditGrup />} />
        <Route path="/grup/detail/:id" exact element={<DetailGrup />} />

        <Route path="/pengguna" exact element={<Pengguna />} />
        <Route path="/pengguna/buat" exact element={<BuatPengguna />} />
        <Route path="/pengguna/edit/:id" exact element={<EditPengguna />} />
        <Route path="/pengguna/detail/:id" exact element={<DetailPengguna />} />

        <Route path="/departemen" exact element={<Departemen />} />
        <Route path="/departemen/buat" exact element={<BuatDepartemen />} />
        <Route path="/departemen/edit/:id" exact element={<EditDepartemen />} />
        <Route path="/departemen/detail/:id" exact element={<DetailDepartemen />} />

        <Route path="/posisi" exact element={<Posisi />} />
        <Route path="/posisi/buat" exact element={<BuatPosisi />} />
        <Route path="/posisi/edit/:id" exact element={<EditPosisi />} />
        <Route path="/posisi/detail/:id" exact element={<DetailPosisi />} />

        <Route path="/karyawan" exact element={<Karyawan />} />
        <Route path="/karyawan/buat" exact element={<BuatKaryawan />} />
        <Route path="/karyawan/edit/:id" exact element={<EditKaryawan />} />
        <Route path="/karyawan/detail/:id" exact element={<DetailKaryawan />} />

        <Route path="/pelanggan" exact element={<Pelanggan />} />
        <Route path="/pelanggan/buat" exact element={<BuatPelanggan />} />
        <Route path="/pelanggan/edit/:id" exact element={<EditPelanggan />} />
        <Route path="/pelanggan/detail/:id" exact element={<DetailPelanggan />} />

        <Route path="/gudang" exact element={<Gudang />} />
        <Route path="/gudang/buat" exact element={<BuatGudang />} />
        <Route path="/gudang/edit/:id" exact element={<EditGudang />} />
        <Route path="/gudang/detail/:id" exact element={<DetailGudang />} />

        <Route path="/bagian" exact element={<Bagian />} />
        <Route path="/bagian/buat" exact element={<BuatBagian />} />
        <Route path="/bagian/edit/:id" exact element={<EditBagian />} />
        <Route path="/bagian/detail/:id" exact element={<DetailBagian />} />

        <Route path="/kategori" exact element={<Kategori />} />
        <Route path="/kategori/buat" exact element={<BuatKategori />} />
        <Route path="/kategori/edit/:id" exact element={<EditKategori />} />
        <Route path="/kategori/detail/:id" exact element={<DetailKategori />} />

        <Route path="/merek" exact element={<Merek />} />
        <Route path="/merek/buat" exact element={<BuatMerek />} />
        <Route path="/merek/edit/:id" exact element={<EditMerek />} />
        <Route path="/merek/detail/:id" exact element={<DetailMerek />} />

        <Route path="/pajak" exact element={<Pajak />} />
        <Route path="/pajak/buat" exact element={<BuatPajak />} />
        <Route path="/pajak/edit/:id" exact element={<EditPajak />} />
        <Route path="/pajak/detail/:id" exact element={<DetailPajak />} />

        <Route path="/grade" exact element={<Grade />} />
        <Route path="/grade/buat" exact element={<BuatGrade />} />
        <Route path="/grade/edit/:id" exact element={<EditGrade />} />
        <Route path="/grade/detail/:id" exact element={<DetailGrade />} />

        <Route path="/tipe" exact element={<TipeProduk />} />
        <Route path="/tipe/buat" exact element={<BuatTipeProduk />} />
        <Route path="/tipe/edit/:id" exact element={<EditTipeProduk />} />
        <Route path="/tipe/detail/:id" exact element={<DetailTipeProduk />} />

        <Route path="/produk" exact element={<Produk />} />
        <Route path="/produk/buat" exact element={<BuatProduk />} />
        <Route path="/produk/edit/:id" exact element={<EditProduk />} />
        <Route path="/produk/detail/:id" exact element={<DetailProduk />} />

        {/* Inventory Modul */}
        <Route path="/adjustment" exact element={<Adjustment />} />
        <Route path="/adjustment/create" exact element={<CreateAdjustment />} />
        <Route path="/adjustment/edit/:id" exact element={<EditAdjustment />} />
        <Route path="/adjustment/detail/:id" exact element={<DetailAdjustment />} />

        <Route path="/stockmutation" exact element={<StockMutation />} />

        <Route path="/goodsrequest" exact element={<GoodsRequest />} />
        <Route path="/goodsrequest/create" exact element={<CreateGoodsRequest />} />
        <Route path="/goodsrequest/edit/:id" exact element={<EditGoodsRequest />} />
        <Route path="/goodsrequest/detail" exact element={<DetailGoodsRequest />} />

        <Route path="/goodstransfer" exact element={<GoodsTransfer />} />
        <Route path="/goodstransfer/create" exact element={<CreateGoodsTransfer />} />
        <Route path="/goodstransfer/edit/:id" exact element={<EditGoodsTransfer />} />
        <Route path="/goodstransfer/detail" exact element={<DetailGoodsTransfer />} />

        <Route path="/production" exact element={<Production />} />
        <Route path="/production/create" exact element={<CreateProduction />} />
        <Route path="/production/edit/:id" exact element={<EditProduction />} />
        <Route path="/production/detail" exact element={<DetailProduction />} />

        {/* Supllier Modul */}
        <Route path="/supplier" exact element={<Supplier />} />
        <Route path="/supplier/buat" exact element={<BuatSupplier />} />
        <Route path="/supplier/edit/:id" exact element={<EditSupplier />} />
        <Route path="/supplier/detail/:id" exact element={<DetailSupplier />} />

        <Route path="/matauang" exact element={<MataUang />} />
        <Route path="/matauang/buat" exact element={<BuatMataUang />} />
        <Route path="/matauang/edit/:id" exact element={<EditMataUang />} />
        <Route path="/matauang/detail/:id" exact element={<DetailMataUang />} />

        <Route path="/biayaimport" exact element={<BiayaImport />} />
        <Route path="/biayaimport/buat" exact element={<BuatBiayaImport />} />
        <Route path="/biayaimport/edit/:id" exact element={<EditBiayaImport />} />
        <Route path="/biayaimport/detail/:id" exact element={<DetailBiayaImport />} />

        {/* Seller Modul */}
        <Route path="/pesanan" exact element={<Pesanan />} />
        <Route path="/pesanan/buat" exact element={<BuatPesanan />} />
        <Route path="/pesanan/edit/:id" exact element={<EditPesanan />} />
        <Route path="/pesanan/detail/:id" exact element={<DetailPesanan />} />

        <Route path="/suratjalan" exact element={<SuratJalan />} />
        <Route path="/suratjalan/buat" exact element={<BuatSuratJalan />} />
        <Route path="/suratjalan/edit/:id" exact element={<EditSuratJalan />} />
        <Route path="/suratjalan/detail/:id" exact element={<DetailSuratJalan />} />

        <Route path="/faktur" exact element={<Faktur />} />
        <Route path="/faktur/buat" exact element={<BuatFaktur />} />
        <Route path="/faktur/edit/:id" exact element={<EditFaktur />} />
        <Route path="/faktur/detail/:id" exact element={<DetailFaktur />} />

        <Route path="/retur" exact element={<Retur />} />
        <Route path="/retur/buat" exact element={<BuatRetur />} />
        <Route path="/retur/edit/:id" exact element={<EditRetur />} />
        <Route path="/retur/detail/:id" exact element={<DetailRetur />} />

        <Route path="/pelunasan" exact element={<Pelunasan />} />
        <Route path="/pelunasan/buat" exact element={<BuatPelunasan />} />
        <Route path="/pelunasan/edit/:id" exact element={<EditPelunasan />} />
        <Route path="/pelunasan/detail/:id" exact element={<DetailPelunasan />} />

        <Route path="/tally" exact element={<Tally />} />
        <Route path="/tally/buat" exact element={<BuatTally />} />
        <Route path="/tally/edit/:id" exact element={<EditTally />} />
        <Route path="/tally/detail/:id" exact element={<DetailTally />} />

        {/* Pembelian Modul */}
        <Route path="/pesananpembelian" exact element={<PesananPembelian />} />
        <Route path="/pesananpembelian/buat" exact element={<BuatPesananPembelian />} />
        <Route path="/pesananpembelian/edit/:id" exact element={<EditPesananPembelian />} />
        <Route path="/pesananpembelian/detail/:id" exact element={<DetailPesananPembelian />} />

        <Route path="/tallypembelian" exact element={<TallySheetPembelian />} />
        <Route path="/tallypembelian/buat" exact element={<BuatTallySheet />} />
        <Route path="/tallypembelian/edit/:id" exact element={<EditTallySheet />} />
        <Route path="/tallypembelian/detail/:id" exact element={<DetailTallySheet />} />


        <Route path="/penerimaanbarang" exact element={<PenerimaanBarang />} />
        <Route path="/penerimaanbarang/buat" exact element={<BuatPenerimaanBarang />} />
        <Route path="/penerimaanbarang/edit/:id" exact element={<EditPenerimaanBarang />} />
        <Route path="/penerimaanbarang/detail/:id" exact element={<DetailPenerimaanBarang />} />

        <Route path="/fakturpembelian" exact element={<FakturPembelian />} />
        <Route path="/fakturpembelian/buat" exact element={<BuatFakturPembelian />} />
        <Route path="/fakturpembelian/edit/:id" exact element={<EditFakturPembelian />} />
        <Route path="/fakturpembelian/detail/:id" exact element={<DetailFakturPembelian />} />

        <Route path="/returpembelian" exact element={<ReturPembelian />} />
        <Route path="/returpembelian/buat" exact element={<BuatReturPembelian />} />
        <Route path="/returpembelian/edit/:id" exact element={<EditReturPembelian />} />
        <Route path="/returpembelian/detail/:id" exact element={<DetailReturPembelian />} />

        <Route path="/pembayaranpembelian" exact element={<PembayaranPembelian />} />
        <Route path="/pembayaranpembelian/buat" exact element={<BuatPembayaranPembelian />} />
        <Route path="/pembayaranpembelian/edit/:id" exact element={<EditPembayaranPembelian />} />
        <Route path="/pembayaranpembelian/detail/:id" exact element={<DetailPembayaranPembelian />} />
    </>


    return (
        <>
            <Routes>
                <Route path="/login" exact element={<Login />} />

                <Route path="/" exact element={<Dashboard />} />

                {
                    isAdmin ? adminRoute : userRoute
                }

                {/* PageNotFound */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}

export default RouteApp;