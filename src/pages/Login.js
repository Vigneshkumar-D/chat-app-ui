
import { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import LoginService from '../service/auth/loginService';
import '../styles/login.css';
import { LockOutlined, UserOutlined } from "@ant-design/icons";
const { Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
    const service = new LoginService();
    const token = Cookies.get('jwt_token');
    

    useEffect(() => {
      const handleResize = () => setIsDesktop(window.innerWidth > 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const bgImage = isDesktop ? "none" :`${process.env.PUBLIC_URL}/bg-image.png`;

    const onFinish = async (values) => {
        setLoading(true);
        service.post(values)
            .then((res) => {
                const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000);
                Cookies.set("login_token", res.data.message, { expires: expirationTime });
                message.success("Login successful!");
                navigate("/", { replace: true });
            })
            .catch((err) => {
                message.error(err.response.data?.message || "Login failed. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (token ? navigate('/') :
        <div className="login-form-container" style={{ backgroundImage:  `url(${bgImage})` }}>
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
                   <img
                    src={`${process.env.PUBLIC_URL}/chat-app-logo.png`}
                    className="login-website-logo-mobile-image"
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
                    label="Password"
                    className='input-label'
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                    <Input.Password  prefix={<LockOutlined />} className='input-field' placeholder="Password" />
                </Form.Item>

                <Form.Item className='input-label'>
                    <Button type="primary" className='button' htmlType="submit" loading={loading} block>
                        Login
                    </Button>
                </Form.Item>

                <Text className='forget-password' type="secondary" >
                    <Link to="/forget-password">Forgot password?</Link>
                </Text>

                <Text className='accout-register'>
                    Don't have an account? <Link to="/register">Register</Link>
                </Text>
            </Form>
        </div>
    );
};

export default Login;
