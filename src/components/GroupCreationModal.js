import React, { useEffect, useRef, useState, useCallback } from "react";
import { Modal, Input, Button, Select, Form, message, Spin } from "antd";
import '../styles/login.css';
import GroupChatService from "../service/chat/groupChatService";
import Cookies from "js-cookie";

const GroupCreationModal = ({ visible, userList, closeGroupModal, selectedChat, fetchChatList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);
  const [formData, setFormData] = useState(selectedChat);
  const groupChatService = new GroupChatService();
  const currentUserId = Number(Cookies.get("user_id"));

  useEffect(() => {
    if (formRef.current) {
      if (formData) {
        formRef.current.setFieldsValue({
          chatName: formData.chatName || "",
          participants: formData.participants?.map(user => user.id) || [],
          admins: formData.admins?.map(admin => admin.id) || [],
        });
      } else {
        formRef.current.resetFields();
      }
    }
  }, [formData, closeGroupModal]);

  const onFinish = useCallback(async (values) => {
    setIsLoading(true);
    let admins = new Set([currentUserId, ...(values?.admins || []).map(Number)]);
    let participants = new Set([currentUserId, ...(values?.participants || []).map(Number)]);

    const updatedValues = {
      ...values,
      isGroup: true,
      admins: Array.from(admins).map(id => ({ id })),
      participants: Array.from(participants).map(id => ({ id })),
    };
    if (selectedChat) {
      groupChatService.update(selectedChat.id, updatedValues)
        .then((res) => {
          setFormData(res.data.data);
          message.success("Group updated successfully!");
        })
        .catch((err) => {
          message.error(err.response?.data?.message || "Error updating group!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      groupChatService.create(updatedValues)
        .then(() => {
          message.success("Group created successfully!");
        })
        .catch((err) => {
          message.error(err.response?.data?.message || "Error creating group!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    formRef.current?.resetFields();
    closeGroupModal();
    fetchChatList();
  }, [selectedChat, closeGroupModal]);

  return (
    <Modal
      title={selectedChat ? "Edit Group" : "Create New Group"}
      width={350}
      open={visible}
      onCancel={closeGroupModal}
      footer={null}
    >
      <Form ref={formRef} onFinish={onFinish} layout="vertical">
        {/* Group Name */}
        <Form.Item
          label="Group Name"
          name="chatName"
          rules={[{ required: true, message: "Please enter your Group Name!" }]}
        >
          <Input placeholder="Group Name" />
        </Form.Item>

        {/* Group Members */}
        <Form.Item label="Group Members" name="participants">
          <Select mode="multiple" style={{ width: "100%" }} placeholder="Select Group Members" options={userList} />
        </Form.Item>

        {/* Group Admins */}
        <Form.Item label="Group Admins" name="admins">
          <Select mode="multiple" style={{ width: "100%" }} placeholder="Select Group Admins" options={userList} />
        </Form.Item>

        {/* Submit and Cancel buttons */}
        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={closeGroupModal} style={{ marginRight: 10 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {selectedChat ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupCreationModal;

