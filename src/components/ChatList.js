import React from "react";
import { List, Typography } from "antd";
import Cookies from 'js-cookie';
import { TiTick } from "react-icons/ti";
import { BiCheckDouble } from "react-icons/bi";

const { Text } = Typography;
const style = {
  container: {
    padding: "20px",
    background: "#fff",
    overflowY: "scroll",
    minHeight: "100%",
    maxHeight: "550px",
    width: "100%"
  },
  unreadMessageCount: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    fontSize: "10px",
    height: "20px",
    width: "20px",
    backgroundColor: "green",
    color: "#fff",
    lineHeight: "5px"
  },
  title: {
    display: "flex",
    justifyContent: "space-between"
  },
  description: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  chatName: {
    fontSize: "12px"
  },
  message: {
    fontSize: "10px"
  },
  listItem: {
    cursor: "pointer"
  }
}

const ChatList = ({ chats, onSelectChat }) => {

  const currentUserId = Cookies.get("user_id");

  const getMessageStatus = (msg) => {
    if (msg.status === "SENT" && msg.sender?.id === Number(currentUserId)) {
      return <TiTick />;
    }
    if (msg.status === "DELIVERED" && msg.sender?.id === Number(currentUserId)) {
      return <BiCheckDouble style={{ color: "", marginTop: "15px" }} />;;
    }
    if (msg.status === "READ" && msg.sender?.id === Number(currentUserId)) {
      return <BiCheckDouble style={{ color: "blue" }} />;
    }
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const inputDate = new Date(timestamp);
    const isToday = now.toDateString() === inputDate.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === inputDate.toDateString();
    if (isToday) {
      return inputDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return "Yesterday";
    } else if (now - inputDate <= 7 * 24 * 60 * 60 * 1000) {
      return inputDate.toLocaleDateString([], { weekday: 'long' });
    } else {
      return inputDate.toLocaleDateString();
    }
  };

  return (
    <div style={style.container}>
      <List
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(chat) => (
          <List.Item onClick={() => onSelectChat(chat)} style={style.listItem}>
            <List.Item.Meta
              title={
                <div style={style.title}>
                  <Text strong style={style.chatName}>{chat.chatName}</Text>
                  <Text type="secondary" style={style.message}>
                    {chat.lastMessage !== "No messages yet" ? formatTimestamp(chat.lastMessageTime) : ""}
                  </Text>
                </div>
              }
              description={
                <div style={style.description}>
                  <Text type="secondary" style={{
                    fontWeight: chat.status !== "READ"
                      && chat.sender?.id !== Number(currentUserId)
                      ? "bold" : "normal"
                  }}>
                    {chat.lastMessage} {getMessageStatus(chat)}
                  </Text>
                  {chat.unreadMessageCount > 0 ?
                    <Text
                      style={style.unreadMessageCount}>
                      {chat.unreadMessageCount}
                    </Text> : ""
                  }
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ChatList;

