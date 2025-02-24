import React, { useEffect, useRef, useState } from "react";
import { Input, Button, List, Typography, message } from "antd";
import Cookies from "js-cookie";
import { BiCheckDouble } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import GroupChatService from "../service/chat/groupChatService";
import GroupCreationModal from "./GroupCreationModal";

const { Text } = Typography;
const { TextArea } = Input;
const style = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    minWidth: "100%",
    height: "550px",
    padding: "10px"
  },
  subContainer: {
    paddingBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    fontSize: "18px",
    padding: "15px",
    fontWeight: "bold"
  },
  username: {
    fontSize: "10px",
    color: "blue"
  },
  inputContainer: {
    display: "flex",
    padding: "10px"
  },
  sendButton: {
    marginLeft: "10px"
  },
  chatListContainer: {
    flex: 1,
    overflowY: "scroll",
    padding: "20px",
  }

}

const ChatWindow = ({ selectedChat, stompClient, fetchChatList, existingMessages, userList }) => {
  const currentUserId = Cookies.get("user_id");
  const [newMessage, setNewMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState();
  const messageContainerRef = useRef(null);
  const groupChatService = new GroupChatService();
  console.log("stompClient", stompClient);


  useEffect(() => {
    if (selectedChat?.id) {
      setMessages(existingMessages);
    }
  }, [selectedChat, existingMessages]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChat?.id) return;

    groupChatService.getById(selectedChat.id).then((res) => {
      const isAdmin = res.data?.data?.admins?.some(admin => admin.id === Number(currentUserId));
      setIsAdmin(isAdmin);
    }).catch(error => console.error("Error fetching group details:", error));
  }, [selectedChat, currentUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat?.id) return;

    const messageData = {
      sender: { id: Number(currentUserId) },
      chat: selectedChat,
      status: "SENT",
      recipient: selectedChat?.participants
        .filter((user) => user.id !== Number(currentUserId))
        .map((user) => user),
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(messageData),
    });

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
    fetchChatList();

  };

  const handleSend = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };

  const getMessageStatus = (msg) => {
    console.log("msg ", msg.chat.status);

    if (msg.sender.id !== Number(currentUserId)) return null;

    switch (msg.chat.status) {
      case "SENT":
        return <TiTick />;
      case "DELIVERED":
        return <BiCheckDouble />;
      case "READ":
        return <BiCheckDouble style={{ color: "blue" }} />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const time = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    const datePart = date.toLocaleString("en-US", { day: "2-digit", month: "short", year: "numeric" });
    return `${time}, ${datePart}`;
  };

  const openGroupModal = () => {
    setIsModalVisible(true);
  };

  const closeGroupModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={style.mainContainer}>
      <div style={style.subContainer}>
        {selectedChat?.chatName}
        {selectedChat?.isGroup && isAdmin ? (
          <Button onClick={() => openGroupModal()} type="primary">Edit Group</Button>
        ) : (
          <Button type="primary">Info</Button>
        )}
      </div>
      <div ref={messageContainerRef} style={style.chatListContainer}>
        <List
          dataSource={messages}
          renderItem={(msg) => (
            <List.Item style={{
              justifyContent: msg.sender.id === Number(currentUserId) ? "flex-end" : "flex-start",
              border: "none",
            }}>
              <Text
                style={{
                  backgroundColor: msg.sender.id === Number(currentUserId) ? "#1890ff" : "#f0f0f0",
                  color: msg.sender.id === Number(currentUserId) ? "#fff" : "#000",
                  padding: "5px 8px",
                  borderRadius: "12px",
                  maxWidth: "100%",
                }}
              >
                {selectedChat?.isGroup && currentUserId != msg.sender.id && (
                  <Typography style={style.username}>{msg.sender.username}</Typography>
                )}
                {msg.chat.id === selectedChat.id && <span>{msg.content}</span>}
                {msg.chat.id === selectedChat.id && <span>{getMessageStatus(msg)}</span>}

                <Typography style={{
                  fontSize: "8px",
                  color: msg.sender.id === Number(currentUserId) ? "#fff" : "#000"
                }}>
                  {msg.chat.id === selectedChat.id && <span>{formatTimestamp(msg.timestamp)}</span>}
                  
                </Typography>
              </Text>
            </List.Item>
          )}
        />
      </div>
      <div style={style.inputContainer}>
        <TextArea
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleSend}
          placeholder="Type a message..."
        />
        <Button type="primary" onClick={() => handleSend({ key: "Enter" })} style={style.sendButton}>
          Send
        </Button>
      </div>
      <GroupCreationModal visible={isModalVisible} userList={userList} selectedChat={selectedChat} closeGroupModal={closeGroupModal} />
    </div>
  );
};

export default ChatWindow;


