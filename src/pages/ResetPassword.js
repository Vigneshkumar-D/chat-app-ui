import React, { useState } from "react";

import {
  Button,
  Form,
  Grid,
  Input,
  message,
  Spin,
  theme,
} from "antd";

import { ArrowRightOutlined, LockOutlined, SyncOutlined } from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ResetPasswordService from "../service/auth/resetPasswordService";


const { useToken } = theme;
const { useBreakpoint } = Grid;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const reset_token = searchParams.get("token")?.replace(/'/g, "");
  const [successMessage, setSuccessMessage] = useState(null);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const service = new ResetPasswordService();
  const { token } = useToken();
  const screens = useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);

  const onFinish = (values) => {
    setIsLoading(true);
    service
      .post(values, {
        headers: {
          token: reset_token,
        },
      })
      .then((res) => {
        message.success(res.data.message);
        setStatus(true);
        setSuccessMessage(res.data.message);
      })
      .catch((err) => {
        setStatus(false);
       message.error(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const styles = {
    container: {
      backgroundColor: "rgba(240, 240, 240, 0.2)", 
      borderRadius: "10px",
      backdropFilter: "blur(28px)", 
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "auto", 
      alignSelf: "flex-end", 
      width: "350px",
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%",
    },
    forgotPassword: {
      paddingTop: "10px",
      float: "right",
      color: "#4c5270",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      backgroundColor: token.colorBgContainer,
      display: "flex",
      flexDirection: "column", 
      justifyContent: "center",
      alignItems: "flex-end", 
      minHeight: "100vh", 
      backgroundPosition: "center",
      backgroundSize: "cover",
      padding: screens.md ? `${token.sizeXXL}px 60px` : "10px",
      width: "100vw", 
    },
    text: {
      color: "white",
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };

  return (
    <section
      style={{
        ...styles.section,
        backgroundImage: `url(${process.env.PUBLIC_URL}/bg-image.png)`,
      }}
    >
      <div
        style={{
          ...styles.container,
        }}
      >
        <div style={{ textAlign: "center", paddingBottom: "1rem" }}>
          <img
            src={`${process.env.PUBLIC_URL}/chat-app-logo.png`}
            alt="Logo"
            style={{ width: "40%", height: "auto", borderRadius: "10px" }}
          />
        </div>
        {status ? (
          <>
            <h1
              style={{
                textAlign: "center",
                color: "#4c5270",
                paddingBottom: "2rem",
              }}
            >
              {successMessage}
            </h1>
            <Button
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "5px",
                  float: "right",
                  marginTop: "10px",
                }}
                disabled={isLoading}
              >
                <Link
                  to="/login"
                  style={{
                    float: "left",
                    color: "#4c5270",
                  }}
                >
                  Login
                  <ArrowRightOutlined
                    style={{ paddingLeft: "3px", marginTop: "7px" }}
                  />
                </Link>
              </Button>
          </>
        ) : (
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="newPassword"
              label={
                <div style={{ color: "#4c5270", fontWeight: "700" }}>
                  New Password
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="New Password"
                style={{ padding: "8px 12px" }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={
                <div style={{ color: "#4c5270", fontWeight: "600" }}>
                  Confirm Password
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your confirm password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirm Password"
                style={{ padding: "8px 12px" }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: "0px" }}>
              <Button
                block="true"
                type="primary"
                htmlType="submit"
                style={{
                  padding: "20px 12px",
                  backgroundColor: isLoading ? "#1677ff" : undefined,
                  borderColor: isLoading ? "#1677ff" : undefined,
                  cursor: isLoading ? "not-allowed" : undefined,
                }}
                disabled={isLoading}
                icon={
                  <Spin
                    spinning={isLoading}
                    indicator={<SyncOutlined spin />}
                    style={{ color: "white" }}
                  />
                }
              >
                {!isLoading ? "Reset" : ""}
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </section>
  );
}
