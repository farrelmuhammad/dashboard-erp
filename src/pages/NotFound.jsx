import { Button, Result } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();

    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => navigate(-1)}>Back Home</Button>}
            />
        </>
    )
}

export default NotFound