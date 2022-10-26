import React, { useState } from "react";
import {
    CopyOutlined,
    DatabaseOutlined,
    LogoutOutlined,
    PieChartOutlined,
    RiseOutlined,
    SettingOutlined,
    FundProjectionScreenOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    AuditOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { Menu } from "antd";
import { Link } from "react-router-dom";
const TopicMenu = ({ topics, selectedKey, changeSelectedKey }) => {
    // const styledTopics = [];
    // topics.forEach((topic, index) =>
    //     styledTopics.push(
    //         <Menu.Item key={index} onClick={changeSelectedKey}>
    //             {topic}
    //         </Menu.Item>
    //     )
    // );

    return (
        <Menu mode="inline" selectedKeys={[selectedKey]}>
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={changeSelectedKey}>
                <Link to="/" />
                Dashboard
            </Menu.Item>
            <Menu.SubMenu title="SDM" icon={<AuditOutlined />}>
                <Menu.Item key="2" onClick={changeSelectedKey}>
                    <Link to="/grup" />
                    Grup Pengguna
                </Menu.Item>
                <Menu.Item key="3" onClick={changeSelectedKey}>
                    <Link to="/pengguna" />
                    Pengguna
                </Menu.Item>
                <Menu.Item key="4" onClick={changeSelectedKey}>
                    <Link to="/departemen" />
                    Department
                </Menu.Item>
                <Menu.Item key="5" onClick={changeSelectedKey}>
                    <Link to="/posisi" />
                    Posisi
                </Menu.Item>
                <Menu.Item key="6" onClick={changeSelectedKey}>
                    <Link to="/karyawan" />
                    Karyawan
                </Menu.Item>
                <Menu.Item key="7" onClick={changeSelectedKey}>
                    <Link to="/pelanggan" />
                    Pelanggan
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Produk" icon={<CopyOutlined />}>
                <Menu.Item key="8" onClick={changeSelectedKey}>
                    <Link to="/grade" />
                    Grade
                </Menu.Item>
                <Menu.Item key="9" onClick={changeSelectedKey}>
                    <Link to="/kategori" />
                    Kategori
                </Menu.Item>
                <Menu.Item key="10" onClick={changeSelectedKey}>
                    <Link to="/bagian" />
                    Bagian
                </Menu.Item>
                <Menu.Item key="11" onClick={changeSelectedKey}>
                    <Link to="/tipe" />
                    Tipe Produk
                </Menu.Item>
                <Menu.Item key="12" onClick={changeSelectedKey}>
                    <Link to="/merek" />
                    Merk Produk
                </Menu.Item>
                <Menu.Item key="13" onClick={changeSelectedKey}>
                    <Link to="/produk" />
                    Produk
                </Menu.Item>
                <Menu.Item key="14" onClick={changeSelectedKey}>
                    <Link to="/pajak" />
                    Pajak
                </Menu.Item>
                <Menu.Item key="15" onClick={changeSelectedKey}>
                    <Link to="/gudang" />
                    Gudang
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Inventory" icon={<DatabaseOutlined />}>
                <Menu.Item key="16" onClick={changeSelectedKey}>
                    <Link to="/adjustment" />
                    Penyesuaian Stok
                </Menu.Item>
                <Menu.Item key="17" onClick={changeSelectedKey}>
                    <Link to="/stockmutation" />
                    Mutasi Stok
                </Menu.Item>
                <Menu.Item key="18" onClick={changeSelectedKey}>
                    <Link to="/permintaanbarang" />
                    Permintaan Barang
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Penjualan" icon={<RiseOutlined />}>
                <Menu.Item key="19" onClick={changeSelectedKey}>
                    <Link to="/pesanan" />
                    Pesanan Penjualan
                </Menu.Item>
                <Menu.Item key="20" onClick={changeSelectedKey}>
                    <Link to="/tally" />
                    Tally Sheet
                </Menu.Item>
                <Menu.Item key="21" onClick={changeSelectedKey}>
                    <Link to="/suratjalan" />
                    Surat Jalan
                </Menu.Item>
                <Menu.Item key="22" onClick={changeSelectedKey}>
                    <Link to="/faktur" />
                    Faktur Penjualan
                </Menu.Item>
                <Menu.Item key="23" onClick={changeSelectedKey}>
                    <Link to="/retur" />
                    Retur Penjualan
                </Menu.Item>
                <Menu.Item key="24" onClick={changeSelectedKey}>
                    <Link to="/pelunasan" />
                    Pelunasan Penjualan
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Master Pembelian" icon={<FundProjectionScreenOutlined />}>
                <Menu.Item key="25" onClick={changeSelectedKey}>
                    <Link to="/supplier" />
                    Supplier
                </Menu.Item>
                <Menu.Item key="26" onClick={changeSelectedKey}>
                    <Link to="/matauang" />
                    Mata Uang
                </Menu.Item>
                <Menu.Item key="27" onClick={changeSelectedKey}>
                    <Link to="/biayaimport" />
                    Master Biaya Import
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Pembelian" icon={<ShoppingCartOutlined />}>
                <Menu.Item key="28" onClick={changeSelectedKey}>
                    <Link to="/pesananpembelian" />
                    Pesanan Pembelian
                </Menu.Item>
                <Menu.Item key="29" onClick={changeSelectedKey}>
                    <Link to="/tallypembelian" />
                    Tally Sheet
                </Menu.Item>
                <Menu.Item key="30" onClick={changeSelectedKey}>
                    <Link to="/fakturpembelian" />
                    Faktur Pembelian
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu title="Chart Of Accounts" icon={<LineChartOutlined />}>
                <Menu.Item key="31" onClick={changeSelectedKey}>
                    <Link to="/pesananpembelian" />
                    Pesanan Pembelian
                </Menu.Item>
                <Menu.Item key="32" onClick={changeSelectedKey}>
                    <Link to="/tallypembelian" />
                    Tally Sheet
                </Menu.Item>
                <Menu.Item key="33" onClick={changeSelectedKey}>
                    <Link to="/fakturpembelian" />
                    Faktur Pembelian
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    );
}
export default TopicMenu;