import { Checkbox, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import jsCookie from 'js-cookie'
import axios from 'axios';
import Url from '../../../../Config';



const ModalProdukTable = () => {
    const [getDataProduct, setGetDataProduct] = useState([]);
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = jsCookie.get('auth')

    useEffect(() => {
        getProduct()
    }, [])

    const getProduct = async (params = {}) => {
        setIsLoading(true);
        await axios.get(`${Url}/products`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const getData = res.data.data
                setGetDataProduct(getData)
                // setStatus(getData.map(d => d.status))
                setIsLoading(false);
                console.log(res.data.data)
            })
    }

    const handleCheck = (event) => {
        var updatedList = [...product];
        if (event.target.checked) {
            updatedList = [...product, event.target.value];
        } else {
            updatedList.splice(product.indexOf(event.target.value), 1);
        }
        setProduct(updatedList);
    };


    const columns = [
        {
            title: 'Nama Produk',
            dataIndex: 'alias_name',
        },
        {
            title: 'Stok',
            dataIndex: 'age',
            width: '15%',
            align: 'center',
        },
        {
            title: 'actions',
            dataIndex: 'address',
            width: '15%',
            align: 'center',
            render: (_, record) => (
                <>
                    <Checkbox onChange={handleCheck} />
                </>
            )
        },
    ];

    return (
        <div className="text-title text-start">
            <div className="row">
                <div className="col">
                    <h4 className="title fw-normal">Cari Produk</h4>
                </div>
                <div className="col">
                    <form action="" className="search-form mb-2">
                        <input type="text" className="form-control" name="search" id="search" placeholder="search" />
                    </form>
                </div>
                <Table
                    columns={columns}
                    dataSource={getDataProduct}
                    pagination={{ pageSize: 15 }}
                    scroll={{
                        y: 240,
                    }}
                    size="middle"
                />
            </div>
        </div>
    )
}

export default ModalProdukTable