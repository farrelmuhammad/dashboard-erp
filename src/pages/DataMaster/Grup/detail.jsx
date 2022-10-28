import axios from 'axios';
import jsCookie from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Url from '../../../Config';
import './form.css'
import { useSelector } from 'react-redux';
import { Button, Checkbox, Col, Collapse, Modal, PageHeader, Row, Skeleton } from 'antd';
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
const { Panel } = Collapse;

const DetailGrup = () => {
    // const token = jsCookie.get('auth')
    const auth = useSelector(state => state.auth);
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [access, setAccess] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState();
    const [getModules, setGetModules] = useState();
    const [loading, setLoading] = useState(true);


    const [modal2Visible, setModal2Visible] = useState(false);

    useEffect(() => {
        axios.get(`${Url}/groups?id=${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }

        })
            .then(function (res) {
                const getData = res.data.data[0]
                setData(getData);
                setAccess(getData.group_access_rights.map((d) => d.id))
                console.log(getData.group_access_rights)
                setLoading(false)
                // console.log(getData.group_access_rights.map((d) => d.id))
            })
            .catch((err) => {
                // Jika Gagal
            });

        axios
            .get(`${Url}/modules`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            })
            .then((res) => {
                const getData = res.data.data
                setGetModules(getData);
            })
            .catch((err) => {
                // Jika Gagal
                console.log(err);
            });
    }, [])

    const handleCheck = (event) => {
        var updatedList = [...access];
        if (event.target.checked) {
            updatedList = [...access, event.target.value];
        } else {
            updatedList.splice(access.indexOf(event.target.value), 1);
        }
        setAccess(updatedList);
    };

    if (loading) {
        return (
            <>
                <form className="p-3 mb-3 bg-body rounded">
                    <Skeleton active />
                </form>
            </>
        )
    }


    if (getModules?.length > 0) {
        return (
            <>
                <PageHeader
                    ghost={false}
                    className="bg-body rounded mb-2"
                    onBack={() => window.history.back()}
                    title="Detail Grup Pengguna"
                >
                    <div className="row mb-3">
                        <label htmlFor="inputKode3" className="col-sm-2 col-form-label">
                            Kode
                        </label>
                        <div className="col-sm-10">
                            <input
                                type="kode"
                                className="form-control"
                                id="inputKode3"
                                // onChange={e => setId(e.target.value)}
                                value={data.code}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNama3" className="col-sm-2 col-form-label">
                            Nama Grup
                        </label>
                        <div className="col-sm-10">
                            <input
                                type="Nama"
                                className="form-control"
                                id="inputNama3"
                                value={data.name}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                            Keterangan
                        </label>
                        <div className="col-sm-10">
                            <textarea
                                className="form-control"
                                id="form4Example3"
                                rows="4"
                                value={data.description}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
                            Hak Akses
                        </label>
                        <div className="col-sm-10">
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModal2Visible(true)}
                            />
                        </div>
                    </div>
                    <Modal
                        title="Tambah Hak Akses"
                        centered
                        visible={modal2Visible}
                        onCancel={() => setModal2Visible(false)}
                        width={800}
                        height={500}
                        footer={null}
                    >
                        {getModules.map(
                            (d) =>
                                d.menus.map((menu) => {
                                    return (
                                        <Collapse>
                                            <Panel header={menu.name} key={menu.id}>
                                                <Checkbox.Group
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    defaultValue={access}
                                                    disabled
                                                    onChange={handleCheck}
                                                >
                                                    <Row>
                                                        {menu.access_rights.map((ar) => {
                                                            return (
                                                                <Col span={8}>
                                                                    <Checkbox value={ar.id}>{ar.name}</Checkbox>
                                                                </Col>
                                                            )
                                                        })}
                                                    </Row>
                                                </Checkbox.Group>
                                            </Panel>
                                        </Collapse>
                                    )
                                }))}
                    </Modal>
                </PageHeader>
            </>
        )
    }
}

export default DetailGrup