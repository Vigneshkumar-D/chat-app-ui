
import { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import ForgetPasswordService from '../service/auth/forgotPasswordService';
import { IoMdArrowBack } from 'react-icons/io';
import { MailOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const service = new ForgetPasswordService();

    const onFinish = (values) => {
        setLoading(true);
        service.create(values).then((res) => {
        }).catch((err) => {
            message.error(err.response?.data || "Login failed. Please try again.");
        }).finally(() => {
            setLoading(false);
        })
    };

    if (Cookies.get('jwt_token')) {
        navigate('/');
        return null;
    }

    return (
        <div className="login-form-container">
            <img
                src={`${process.env.PUBLIC_URL}/bg-image.png`}
                className="login-image"
                alt="website login"
            />
            <Form className="form-container" onFinish={onFinish} layout="vertical">
                <img
                    src={`${process.env.PUBLIC_URL}/chat-app-logo.png`}
                    className="login-website-logo-desktop-image"
                    alt="website logo"
                />
                <Form.Item
                    className='input-label'
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter your username!' }]}
                >
                    <Input prefix={<UserOutlined /> } className='input-field' placeholder="Username" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    className='input-label'
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }]}
                >
                    <Input prefix={<MailOutlined />} type='email' className='input-field' placeholder="Email" />
                </Form.Item>

                <Form.Item className='input-label'>
                    <Button type="primary" className='button' htmlType="submit" loading={loading} block>
                        Submit
                    </Button>
                </Form.Item>
                <Text className='forget-password' type="secondary">
                    <Link to="/login"> <IoMdArrowBack style={{ marginTop: "px" }} /> Go Back</Link>
                </Text>
            </Form>
        </div>
    );
};

export default ForgetPassword;
