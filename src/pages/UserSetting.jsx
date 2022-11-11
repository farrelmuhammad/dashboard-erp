import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Title } from '@material-ui/icons'
import { Avatar, Button, Col, Divider, Image, Input, PageHeader, Row, Skeleton, Typography } from 'antd'
import axios from 'axios';
const { Text } = Typography;

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Url from '../Config';
import Swal from 'sweetalert2';

const UserSetting = () => {
    const [user, setUser] = useState('');
    const [employee, setEmployee] = useState('');
    const [getId, setGetId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [employeeName, setEmployeeName] = useState('')

    const auth = useSelector((state) => state.auth);

    const getUser = async () => {
        axios.get(`${Url}/user`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then(res => {
                const user = res.data;
                setLoading(false)
                console.log(user)
                setUser(user.username)
                setGetId(user.id)
                setEmployee(user.employee.id)
                setEmployeeName(user.employee.name)
                
            })
    }

    useEffect(() => {
        getUser()
    }, [])

    const handleSubmit = async (e) => {
        console.log(employee)
        e.preventDefault();
        const userData = new URLSearchParams();
        userData.append("username", user);
        userData.append("password", password);
        userData.append("karyawan", employee);

        // for (var pair of userData.entries()) {
        //     console.log(pair[0] + ", " + pair[1]);
        // }

        axios({
            method: "put",
            url: `${Url}/users/${getId}`,
            data: userData,
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        })
            .then(function (response) {
                //handle success
                console.log(response);
                Swal.fire("Berhasil Diubah!", "success");
                navigate("/pajak");
            })
            .catch((err) => {
                if (err.response) {
                    console.log("err.response ", err.response);
                    Swal.fire("Gagal Diubah!", "error");

                } else if (err.request) {
                    console.log("err.request ", err.request);

                } else if (err.message) {
                    // do something other than the other two

                }
            });
    }

    if (loading) {
        return (
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        );
    }

    return (
        <>
            <PageHeader
                ghost={false}
                className="bg-body rounded mb-2"
                onBack={() => window.history.back()}
                title="User Profile"
                extra={[
                    <Button onClick={() => window.history.back()}>Cancel</Button>,
                    <Button onClick={handleSubmit} type="primary">Simpan</Button>
                ]}
            >
                <Row justify="center">
                    <Col style={{ margin: 5 }}>
                        <Avatar
                            size={100}
                            src={
                                <Image
                                    src="https://joeschmoe.io/api/v1/random"
                                    style={{
                                        width: 100,
                                    }}
                                />
                            }
                        />
                    </Col>
                </Row>
                <Row justify="center">
                    <Col>
                        <Divider
                            style={{
                                fontSize: 30,
                            }}
                        >{employeeName}</Divider>
                    </Col>
                </Row>
                <Row justify="center">
                    <Col>
                        <Divider>Username</Divider>
                        <Input
                            size="large"
                            value={user}
                            style={{
                                fontWeight: "bold",
                            }}
                            disabled
                        // onChange={(e) => setType(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row justify="center" className='mb-3'>
                    <Col>
                        <Divider>Password</Divider>
                        <Input.Password
                            placeholder="input password"
                            size="large"
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Col>
                </Row>


                {/* <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        loading={loadings[1]}
                        onClick={() => enterLoading(1)}
                    >
                        Submit
                    </Button>
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        size="large"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div> */}
            </PageHeader>
        </>
    )
}

export default UserSetting