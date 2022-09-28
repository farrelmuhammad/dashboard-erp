import { Button, Result } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotAuthorized = () => {
    const navigate = useNavigate();

    return (
        <>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Button type="primary" onClick={() => navigate('/login')}>
                        Login
                    </Button>
                }
            />
        </>
    )
}

export default NotAuthorized