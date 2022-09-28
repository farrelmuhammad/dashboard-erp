import { Button, Result } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UnderMaintenance = () => {
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();

    return (
        <>
            <Result
                status="500"
                title="500"
                subTitle="Sorry, Under Maintenance"
                extra={<Button type="primary">Back Home</Button>}
            />
        </>
    )
}

export default UnderMaintenance