import React, { useEffect, useState } from 'react';
import './App.css';
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
  BoxPlotOutlined,
  ContainerOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { Affix, Breadcrumb, Button, Col, Dropdown, Layout, Menu, Row, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import RouteApp from './routes';
import Login from './pages/Login';
import Search from 'antd/lib/transfer/search';
import NotAuthorized from './pages/NotAuthorized';
import SkeletonPage from './pages/SkeletonPage';
import axios from 'axios';
import Url from './Config';
import Logo from './pages/Logo.jpeg'

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const isLoggedIn = !!useSelector(state => state.auth.token);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate()

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

  const handleLogout = () => {
    // jsCookie.remove('auth')
    localStorage.removeItem('persist:auth')
    var toastMixin = Swal.mixin({
      toast: true,
      icon: 'success',
      title: 'General Title',
      animation: false,
      position: 'top-right',
      showConfirmButton: false,
      timer: 800,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    toastMixin.fire({
      animation: true,
      title: 'Logout Successfully'
    });
    navigate('/')
    setTimeout(window.location.reload.bind(window.location), 500);
  }

  const adminMenu = <>
    <Menu.SubMenu title="SDM" icon={<AuditOutlined />}>
      <Menu.Item key="2">
        <Link to="/grup" />
        Grup Pengguna
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/pengguna" />
        Pengguna
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/departemen" />
        Department
      </Menu.Item>
      <Menu.Item key="5">
        <Link to="/posisi" />
        Posisi
      </Menu.Item>
      <Menu.Item key="6">
        <Link to="/karyawan" />
        Karyawan
      </Menu.Item>
      <Menu.Item key="8">
        <Link to="/pelanggan" />
        Pelanggan
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Produk" icon={<CopyOutlined />}>
      <Menu.Item key="9">
        <Link to="/grade" />
        Grade
      </Menu.Item>
      <Menu.Item key="10">
        <Link to="/kategori" />
        Kategori
      </Menu.Item>
      <Menu.Item key="11">
        <Link to="/bagian" />
        Bagian
      </Menu.Item>
      <Menu.Item key="12">
        <Link to="/tipe" />
        Tipe Produk
      </Menu.Item>
      <Menu.Item key="13">
        <Link to="/merek" />
        Merk Produk
      </Menu.Item>
      <Menu.Item key="14">
        <Link to="/produk" />
        Produk
      </Menu.Item>
      <Menu.Item key="15">
        <Link to="/pajak" />
        Pajak
      </Menu.Item>
      <Menu.Item key="16">
        <Link to="/gudang" />
        Gudang
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Inventory" icon={<DatabaseOutlined />}>
      <Menu.Item key="17">
        <Link to="/adjustment" />
        Penyesuaian Stok
      </Menu.Item>
      <Menu.Item key="18">
        <Link to="/stockmutation" />
        Mutasi Stok
      </Menu.Item>
      <Menu.Item key="19">
        <Link to="/permintaanbarang" />
        Permintaan Barang
      </Menu.Item>
      <Menu.Item key="50">
        <Link to="/tallytransfer" />
        Tally Transfer
      </Menu.Item>
      <Menu.Item key="48">
        <Link to="/goodstransfer" />
        Transfer Barang
      </Menu.Item>
      <Menu.Item key="49">
        <Link to="/produksi" />
        Produksi
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Penjualan" icon={<RiseOutlined />}>
      <Menu.Item key="20">
        <Link to="/pesanan" />
        Pesanan Penjualan
      </Menu.Item>
      <Menu.Item key="21">
        <Link to="/tally" />
        Tally Sheet
      </Menu.Item>
      <Menu.Item key="22">
        <Link to="/suratjalan" />
        Surat Jalan
      </Menu.Item>
      <Menu.Item key="23">
        <Link to="/faktur" />
        Faktur Penjualan
      </Menu.Item>
      <Menu.Item key="24">
        <Link to="/retur" />
        Retur Penjualan
      </Menu.Item>
      <Menu.Item key="25">
        <Link to="/pelunasan" />
        Pelunasan Penjualan
      </Menu.Item>
    </Menu.SubMenu >
    <Menu.SubMenu title="Master Pembelian" icon={<FundProjectionScreenOutlined />}>
      <Menu.Item key="26">
        <Link to="/supplier" />
        Supplier
      </Menu.Item>
      <Menu.Item key="27">
        <Link to="/matauang" />
        Mata Uang
      </Menu.Item>
      <Menu.Item key="28">
        <Link to="/biayaimport" />
        Master Biaya Import
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Pembelian" icon={<ShoppingCartOutlined />}>
      <Menu.Item key="29">
        <Link to="/pesananpembelian" />
        Pesanan Pembelian
      </Menu.Item>
      <Menu.Item key="30">
        <Link to="/tallypembelian" />
        Tally Sheet
      </Menu.Item>
      <Menu.Item key="50">
        <Link to="/penerimaanbarang" />
        Penerimaan Barang
      </Menu.Item>
      <Menu.Item key="31">
        <Link to="/fakturpembelian" />
        Faktur Pembelian
      </Menu.Item> 
      <Menu.Item key="53">
        <Link to="/creditnote" />
        Credit Note
      </Menu.Item>
      <Menu.Item key="51">
        <Link to="/returpembelian" />
        Retur Pembelian
      </Menu.Item>
      <Menu.Item key="52">
        <Link to="/pembayaranpembelian" />
        Pembayaran Pembelian
      </Menu.Item>
      <Menu.Item key="54">
        <Link to="/pib" />
        PIB
      </Menu.Item>
    </Menu.SubMenu>

    <Menu.SubMenu title="Akuntansi" icon={<LineChartOutlined />}>
      <Menu.Item key="32">
        <Link to="/coa" />
        Chart Of Accounts
      </Menu.Item>
      <Menu.Item key="33">
        <Link to="/accountmapping" />
        Pemetaan Akun
      </Menu.Item>
      <Menu.Item key="34">
        <Link to="/jurnal" />
        Jurnal Umum
      </Menu.Item>
      <Menu.SubMenu title="Rekonsiliasi Bank">
        <Menu.Item key="35">
          <Link to="/bankreconciliation/list" />
          List
        </Menu.Item>
        <Menu.Item key="36">
          <Link to="/bankreconciliation/history" />
          History
        </Menu.Item>
      </Menu.SubMenu>

    </Menu.SubMenu>
    <Menu.SubMenu title="Aset Tetap" icon={<BoxPlotOutlined />}>
      <Menu.Item key="37">
        {/* <Link to="/tallypembelian" /> */}
        Pemetaan Akun
      </Menu.Item>
      <Menu.Item key="38">
        {/* <Link to="/fakturpembelian" /> */}
        Jurnal Umum
      </Menu.Item>
      <Menu.Item key="39">
        {/* <Link to="/fakturpembelian" /> */}
        Rekonsiliasi Bank
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="POS" icon={<ContainerOutlined />}>
      <Menu.Item key="40">
        {/* <Link to="/coa" /> */}
        Chart Of Accounts
      </Menu.Item>
      <Menu.Item key="41">
        {/* <Link to="/tallypembelian" /> */}
        Pemetaan Akun
      </Menu.Item>
      <Menu.Item key="42">
        {/* <Link to="/fakturpembelian" /> */}
        Jurnal Umum
      </Menu.Item>
      <Menu.Item key="43">
        {/* <Link to="/fakturpembelian" /> */}
        Rekonsiliasi Bank
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Transaksi Impor" icon={<ImportOutlined />}>
      <Menu.Item key="44">
        <Link to="/" />
        Pesanan Impor
      </Menu.Item>
      <Menu.Item key="45">
        <Link to="/" />
        Faktur Impor
      </Menu.Item>
      <Menu.Item key="46">
        <Link to="/" />
        PIB
      </Menu.Item>
      <Menu.Item key="47">
        <Link to="/" />
        Credit Note
      </Menu.Item>
      <Menu.Item key="48">
        <Link to="/" />
        Biaya
      </Menu.Item>
      <Menu.Item key="49">
        <Link to="/" />
        Pengembalian Biaya
      </Menu.Item>
    </Menu.SubMenu>
  </>

  const userMenu = <>
    <Menu.SubMenu title="SDM" icon={<AuditOutlined />}>
      <Menu.Item key="2">
        <Link to="/grup" />
        Grup Pengguna
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/pengguna" />
        Pengguna
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/departemen" />
        Department
      </Menu.Item>
      <Menu.Item key="5">
        <Link to="/posisi" />
        Posisi
      </Menu.Item>
      <Menu.Item key="6">
        <Link to="/karyawan" />
        Karyawan
      </Menu.Item>
      <Menu.Item key="8">
        <Link to="/pelanggan" />
        Pelanggan
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Produk" icon={<CopyOutlined />}>
      <Menu.Item key="9">
        <Link to="/grade" />
        Grade
      </Menu.Item>
      <Menu.Item key="10">
        <Link to="/kategori" />
        Kategori
      </Menu.Item>
      <Menu.Item key="11">
        <Link to="/bagian" />
        Bagian
      </Menu.Item>
      <Menu.Item key="12">
        <Link to="/tipe" />
        Tipe Produk
      </Menu.Item>
      <Menu.Item key="13">
        <Link to="/merek" />
        Merk Produk
      </Menu.Item>
      <Menu.Item key="14">
        <Link to="/produk" />
        Produk
      </Menu.Item>
      <Menu.Item key="15">
        <Link to="/pajak" />
        Pajak
      </Menu.Item>
      <Menu.Item key="16">
        <Link to="/gudang" />
        Gudang
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Inventory" icon={<DatabaseOutlined />}>
      <Menu.Item key="17">
        <Link to="/adjustment" />
        Penyesuaian Stok
      </Menu.Item>
      <Menu.Item key="18">
        <Link to="/stockmutation" />
        Mutasi Stok
      </Menu.Item>
      <Menu.Item key="19">
        <Link to="/permintaanbarang" />
        Permintaan Barang
      </Menu.Item>
      <Menu.Item key="48">
        <Link to="/goodstransfer" />
        Transfer Barang
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Penjualan" icon={<RiseOutlined />}>
      <Menu.Item key="20">
        <Link to="/pesanan" />
        Pesanan Penjualan
      </Menu.Item>
      <Menu.Item key="21">
        <Link to="/tally" />
        Tally Sheet
      </Menu.Item>
      <Menu.Item key="22">
        <Link to="/suratjalan" />
        Surat Jalan
      </Menu.Item>
      <Menu.Item key="23">
        <Link to="/faktur" />
        Faktur Penjualan
      </Menu.Item>
      <Menu.Item key="24">
        <Link to="/retur" />
        Retur Penjualan
      </Menu.Item>
      <Menu.Item key="25">
        <Link to="/pelunasan" />
        Pelunasan Penjualan
      </Menu.Item>
    </Menu.SubMenu >
    <Menu.SubMenu title="Master Pembelian" icon={<FundProjectionScreenOutlined />}>
      <Menu.Item key="26">
        <Link to="/supplier" />
        Supplier
      </Menu.Item>
      <Menu.Item key="27">
        <Link to="/matauang" />
        Mata Uang
      </Menu.Item>
      <Menu.Item key="28">
        <Link to="/biayaimport" />
        Master Biaya Import
      </Menu.Item>
    </Menu.SubMenu>
    <Menu.SubMenu title="Pembelian" icon={<ShoppingCartOutlined />}>
      <Menu.Item key="29">
        <Link to="/pesananpembelian" />
        Pesanan Pembelian
      </Menu.Item>
      <Menu.Item key="30">
        <Link to="/tallypembelian" />
        Tally Sheet
      </Menu.Item>
      <Menu.Item key="50">
        <Link to="/penerimaanbarang" />
        Penerimaan Barang
      </Menu.Item>
      <Menu.Item key="31">
        <Link to="/fakturpembelian" />
        Faktur Pembelian
      </Menu.Item>
      <Menu.Item key="51">
        <Link to="/returpembelian" />
        Retur Pembelian
      </Menu.Item>
      <Menu.Item key="52">
        <Link to="/pembayaranpembelian" />
        Pembayaran Pembelian
      </Menu.Item>
    </Menu.SubMenu>
  </>

  return (
    <>
      {isLoggedIn ? (
        <Layout hasSider style={{
          height: '100vh',
          width: 'auto',
        }}>
          <Sider
            style={{
              overflow: 'auto',
              // height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
            width={280}
          >
            <Affix offsetTop>
              <Header
                // className="site-layout-header"
                style={{
                  padding: 0,
                  backgroundColor: "white",
                }}
              >
                <div className='text-center'>
                  <img src={Logo}
                    style={{ width: "60px" }} alt="logo" />
                </div>
                {/* <img src="https://www.edwinconsultant.com/assets/img/logo.png" className='logo-header-sidebar' alt='Logo' /> */}
              </Header>
            </Affix>
            <Menu
              // theme="dark"
              defaultSelectedKeys={['1']}
              // selectedKeys={[sideBarMenuKey]}
              mode="inline"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                <Link to="/" />
                Dashboard
              </Menu.Item>
              {
                isAdmin ? adminMenu : userMenu
              }
            </Menu>
          </Sider>
          <Layout
            className="site-layout"
            style={{
              marginLeft: 280,
              width: '1080px',
            }}
          >
            <Affix offsetTop>
              <Header
                className="site-layout-header"
                style={{
                  // position: 'fixed',
                  backgroundColor: 'rgb(216, 218, 221)',
                }}
              >
                <Row>
                  <Col span={8}>
                    <Search
                      placeholder="input search text"
                      allowClear
                      enterButton="Search"
                      size="large"
                      onSearch={true}
                    />
                  </Col>
                  <Col span={8} offset={8}>
                    <div className='text-end'>
                      <Dropdown overlay={
                        <Menu>
                          <Menu.Item key="user" icon={<SettingOutlined />}>
                            User Setting
                          </Menu.Item>
                          <Menu.Item onClickCapture={handleLogout} key="logout" icon={<LogoutOutlined />}>
                            Logout
                          </Menu.Item>
                        </Menu>
                      }>
                        <Tooltip>
                          <Button className='icon-user' type="primary" shape="circle" icon={<UserOutlined style={{ fontSize: '20px', }} />} />
                        </Tooltip>
                      </Dropdown>
                    </div>
                  </Col>
                </Row>
              </Header>
            </Affix>
            <Content
              style={{
                margin: '0 16px',
                overflow: 'auto',
              }}
            >
              {/* <Breadcrumb
                style={{
                  margin: '16px 0',
                  // marginTop: '5.5rem'
                }}
              >
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb> */}
              <div
                className="site-layout-background"
                bordered
                style={{
                  margin: '20px 0',
                  padding: 4,
                  minHeight: 360,
                }}
              >
                <React.Suspense fallback={<SkeletonPage />}>
                  <RouteApp />
                </React.Suspense>
              </div>
            </Content>
            {/* <Footer
              style={{
                textAlign: 'center',
              }}
            >
              Ant Design ©2018 Created by Ant UED
            </Footer> */}
          </Layout>
        </Layout >
      ) : (
        // <NotAuthorized />
        <Login />
      )
      }
    </>
  )
}

export default App
