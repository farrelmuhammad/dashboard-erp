import React, { useState } from "react";
import { Drawer, Button, Row, Col, Dropdown, Menu, Tooltip } from "antd";
import { LogoutOutlined, MenuOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import "./Navbar.css";
import Logo from "./Logo.jpeg";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";
import { Header } from "antd/lib/layout/layout";
const NavBar = ({ menu }) => {
    const [visible, setVisible] = useState(false);
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
        Navigate('/')
        setTimeout(window.location.reload.bind(window.location), 500);
    }

    return (
        <>
            <Header
                className="site-layout-background"
                style={{
                    padding: 0,
                }}
            >
                <Row>
                    <Col span={8} >
                        <Button
                            className="menu"
                            type="primary"
                            icon={<MenuOutlined />}
                            onClick={() => setVisible(true)}
                        />
                    </Col>
                    <Col span={8} >
                        <img src={Logo} className="logo" alt="logo" />
                    </Col>
                    <Col span={8} >
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="user" icon={<SettingOutlined />}>
                                    User Setting
                                </Menu.Item>
                                <Menu.Item onClickCapture={handleLogout} key="logout" icon={<LogoutOutlined />}>
                                    Logout
                                </Menu.Item>
                            </Menu>}>
                            <Tooltip>
                                <Button className='icon-user' type="primary" shape="circle" icon={<UserOutlined />} />
                            </Tooltip>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
            <Drawer
                title="Menu"
                placement="left"
                // onClick={() => setVisible(false)}
                onClose={() => setVisible(false)}
                visible={visible}
                width={250}
            >
                {menu}
            </Drawer>
            {/* <nav className="container">
                <Row>
                    <Col span={8} >
                        <Button
                            className="menu"
                            type="primary"
                            icon={<MenuOutlined />}
                            onClick={() => setVisible(true)}
                        />
                    </Col>
                    <Col span={8} >
                        <img src={Logo} className="logo" alt="logo" />
                    </Col>
                    <Col span={8} >
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="user" icon={<SettingOutlined />}>
                                    User Setting
                                </Menu.Item>
                                <Menu.Item onClickCapture={handleLogout} key="logout" icon={<LogoutOutlined />}>
                                    Logout
                                </Menu.Item>
                            </Menu>}>
                            <Tooltip>
                                <Button className='icon-user' type="primary" shape="circle" icon={<UserOutlined />} />
                            </Tooltip>
                        </Dropdown>
                    </Col>
                </Row>
                <Drawer
                    title="Menu"
                    placement="left"
                    // onClick={() => setVisible(false)}
                    onClose={() => setVisible(false)}
                    visible={visible}
                    width={250}
                >
                    {menu}
                </Drawer>
            </nav> */}
        </>
    );
};
export default NavBar;