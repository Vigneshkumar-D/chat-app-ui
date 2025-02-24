import React, { Component } from "react";
import { Layout, Button, message } from "antd";
import { Navigate } from "react-router-dom";
import ChatList from "../components/ChatList";
import GroupCreationModal from "../components/GroupCreationModal";
import ChatWindow from "../components/ChatWindow";
import UserService from "../service/user/userService";
import ChatHistoryService from "../service/chat/chatHistoryService";
import CurrentUserService from "../service/user/currentUserSevice";
import ChatListService from "../service/chat/chatListService";
import Cookies from "js-cookie";
import LogoutService from "../service/auth/logoutService";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import { IoPower } from "react-icons/io5";
import { TiGroupOutline } from "react-icons/ti";

import "../styles/global.css";
import "../styles/home.css";
import { FaRegCircleUser } from "react-icons/fa6";

const { Header } = Layout;
const style = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    padding: "10px"
  },
  subContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    backgroundColor: "gray",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "10px",
    minWidth: "100%",
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  username: {
    fontSize: "20px",
    color: "green"
  },
  button: {
    fontSize: "12px",
    display: "inline - flex",
    alignSelf: "center"
  },
  usernameHeader: {
    color: "#fff",
    fontWeight: "bold"
  },
  avatar: {
    alignSelf: "center",
    color: "#fff",
    fontSize: "20px"
  },
  logoContainer: {
    display: "flex", 
    justifyContent: "center", 
    flexDirection: "row", 
    alignSelf: "center"
  },
  logo: {
    marginTop: "7px", 
    height: "50px", 
    width: "80px"
  },
  actionButtonsContainer: {
    display: "flex", 
    justifyContent: "space-between", 
    minWidth: "100px", 
    width: "300px"
  }
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      userList: [],
      loading: false,
      chatList: [],
      currentUser: "",
      chatHistory: [],
      showChatWindow: false,
      openedChat: null,
      token: Cookies.get("login_token"),
      message: [],
    };

    this.userService = new UserService();
    this.chatListService = new ChatListService();
    this.currentUserService = new CurrentUserService();
    this.chatHistoryService = new ChatHistoryService();
    this.logoutService = new LogoutService();
    this.stompClient = null;
  }

  componentDidMount() {
    const { token } = this.state;
    if (token) {
      this.fetchCurrentUser();
      this.fetchUserList();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chatHistory !== this.state.chatHistory && this.state.chatHistory) {
      this.fetchChatList();
    }
    if (prevState.isModalVisible !== this.state.isModalVisible) {
      this.fetchChatList();
    }
  }

  componentWillUnmount() {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  handleIncomingMessage = (message) => {
    const parsedMessage = JSON.parse(message.body);
    const ts = new Date().getTime();
    console.log("Received Message: ", ts, parsedMessage);
    this.setState((prevState) => ({
      chatHistory: [...prevState.chatHistory, parsedMessage],
    }));
  };

  fetchCurrentUser = () => {
    this.currentUserService
      .getAll()
      .then((res) => {
        Cookies.set("user_id", res.data?.data?.id);
        Cookies.set("user_name", res.data?.data?.username);
        this.setState({ currentUser: res.data.data }, this.fetchChatList);
      })
      .catch((err) => {
        message.error(err.response?.data?.error || "Data Fetching failed. Please try again.");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  fetchChatList = () => {
    const userId = Cookies.get("user_id");
    this.chatListService
      .getById(userId)
      .then((res) => {
        this.setState({ chatList: res.data.data }, this.connectWebSocket);
      })
      .catch((err) => {
        message.error(err.response?.data?.error || "Data Fetching failed. Please try again.");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  connectWebSocket = () => {
    if (this.stompClient && this.stompClient.connected) {
      console.log("WebSocket already connected.");
      return;
    }

    const socket = new SockJS("http://localhost:4001/ws");
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("Connected:", frame);

        const userId = Cookies.get("user_id");
        const { chatList } = this.state;

        this.subscribedChats = new Set();

        chatList.forEach((chat) => {
          console.log("chat.isGroup", chat.isGroup);

          const chatTopic = chat.isGroup 
          ? `/topic/chat/group/${chat.id}`  
          : `/queue/message/${chat.id}`;

          if (!this.subscribedChats.has(chatTopic)) {
            this.stompClient.subscribe(chatTopic, (message) => {
              console.log("received msg", message.body);

              this.handleIncomingMessage(message);
            });
            this.subscribedChats.add(chatTopic);
            console.log("Subscribed to:", chatTopic);
          }
        });
      },
      onDisconnect: () => {
        console.log("WebSocket Disconnected");
      },
      onStompError: (error) => {
        console.error("WebSocket Error:", error);
      },
    });

    this.stompClient.activate();
  };

  onSelectChat = (value) => {
    this.chatHistoryService
      .getById(value.id)
      .then((res) => {
        this.setState(
          { chatHistory: res.data.data, showChatWindow: true, openedChat: value }
        );
      })
      .catch((err) => {
        message.error(err.response?.data?.error || "Data Fetching failed. Please try again.");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  fetchUserList = () => {
    const currentUserId = Cookies.get("user_id");
    this.userService
      .getAll()
      .then((res) => {
        const userList = res.data?.data;
        const options = userList?.map((user) => ({ label: user.username, value: user.id }));
        // filter((user) => user.id !== Number(currentUserId))

        this.setState({ userList: options });

      })
      .catch((err) => {
        message.error(err.response?.data?.error || "Data Fetching failed. Please try again.");
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  onClickLogout = () => {
    this.logoutService
      .create(this.token)
      .then((res) => {
        if (this.stompClient) {
          this.stompClient.deactivate();
        }
        Cookies.remove("login_token");
        window.location.href = "/login";

      })
      .catch((err) => {
        message.error(err.response?.data?.message);
      });
  };

  openGroupModal = () => {
    this.setState({ isModalVisible: true });
  };

  closeGroupModal = () => {
    console.log("hii", "hii");
    this.setState({ isModalVisible: false });
  };

  render() {
    const { token, isModalVisible, unreadChatCounts, stompClient, currentUser, chatList, userList, chatHistory, showChatWindow, openedChat } = this.state;

    if (!token) {
      return <Navigate to="/login" />;
    }

    return (
      <div style={style.mainContainer}>
        <div style={style.subContainer}>
          <Header style={style.header}>
            <div style={style.logoContainer}>
              <img src={`${process.env.PUBLIC_URL}/chat-app-logo.png`} style={style.logo} alt="app-logo" />
            </div>
            <div style={style.actionButtonsContainer}>
              <Button color="cyan" variant="filled" style={style.button} onClick={this.openGroupModal}>
                Create Group
              </Button>
              <Button color="primary" variant="filled" style={style.button} onClick={this.onClickLogout}>
                Logout
              </Button>
              <div style={style.usernameHeader}>{currentUser.username}</div>
              <FaRegCircleUser style={style.avatar} />
            </div>
          </Header>
          <div className={`chat-container ${showChatWindow ? "chat-open" : ""}`}>
            <div className="chat-list-container">
              <ChatList chats={chatList} onSelectChat={this.onSelectChat} />
            </div>

            <div className="chat-window-container">
              {showChatWindow ? (
                <ChatWindow
                  selectedChat={openedChat}
                  stompClient={this.stompClient}
                  fetchChatList={this.fetchChatList}
                  existingMessages={chatHistory}
                  userList={userList}
                  visible={isModalVisible}
                  openGroupModal={this.openGroupModal}
                  closeGroupModal={this.closeGroupModal}
                />
              ) : (
                <p className="">
                  <span style={style.username}>Welcome {currentUser?.username}...</span>
                  <br />
                  <br />
                  Select a chat to start messaging...
                </p>
              )}
            </div>
          </div>
        </div>
        <GroupCreationModal visible={isModalVisible} userList={this.state.userList} closeGroupModal={this.closeGroupModal} fetchChatList={this.fetchChatList} />
      </div>
    );
  }
}


export default Home;