import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import "../styles/global.css";
import "../styles/login.css";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import RegistrationService from "../service/auth/registrationService.js";
const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const service = new RegistrationService();

    const onFinish = (values) => {
        const {password, confirmPassword} = values;    
        if(password===confirmPassword){
            setLoading(true);
            service.post(values).then((res) => {
                message.success("Registration successful!");
                navigate("/login")
            }). catch( (err) => {
                message.error(err.response?.data || "Registration failed. Please try again.");
            }).finally(() => {
                setLoading(false);
            })
        }else{
            message.error("Passwords do not match!");
        }
       };

    return (
        <div className="login-form-container">
            <img
                src={`${process.env.PUBLIC_URL}/bg-image.png`}
                className="login-website-logo-mobile-image"
                alt="website logo"
            />
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
                <Form.Item className='input-label' label="Username" name="username" rules={[{ required: true, message: "Please enter your username" }]}> 
                    <Input prefix={<UserOutlined />} className='input-field' placeholder="Username" />
                </Form.Item>
                <Form.Item className='input-label' label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}> 
                    <Input prefix={<MailOutlined />} className='input-field' type="email" placeholder="Email" />
                </Form.Item>
                <Form.Item className='input-label' label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}> 
                    <Input.Password prefix={<LockOutlined />} className='input-field' placeholder="Password" visibilityToggle={{ visible: showPassword, onVisibleChange: setShowPassword }} />
                </Form.Item>
                <Form.Item className='input-label' label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: "Please confirm your password" }]}> 
                    <Input.Password prefix={<LockOutlined />} className='input-field' placeholder="Confirm Password" visibilityToggle={{ visible: showConfirmPassword, onVisibleChange: setShowConfirmPassword }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" className="button"> Register </Button>
            </Form>
        </div>
    );
};

export default Register;

