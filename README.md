
# 💬 Real-Time Chat Application - Frontend

This is the frontend for the Real-Time Messaging Web App, built using **React.js**, **SockJS**, and **StompJS** for real-time messaging.

---

## 🚀 Features
- 🔐 **User Authentication** (Login, Logout, JWT Handling)
- 📬 **Real-Time Messaging** (One-on-One & Group Chats)
- 👥 **Group Management** (Admins, Add/Remove Users)
- 📊 **Unread Messages Count**
- 📡 **WebSocket-Based Live Chat**

---

## 🛠️ Tech Stack
- **Frontend**: React.js, React Router
- **WebSockets**: SockJS, StompJS
- **State Management**: React State
- **UI Library**: Ant Desing
- **Authentication**: JWT (stored in cookies)
- **Backend**: Spring Boot (see backend README)

---

## 📂 Project Structure
```
CHAT-APP-REACT/
│── node_modules/           # Dependencies installed via npm
│── public/                 # Static files (index.html, icons, etc.)
│── src/                    # Source code directory
│   ├── components/         # Reusable React components
│   ├── pages/              # Page components for routing
│   ├── service/            # API service files (handling API calls)
│   ├── styles/             # CSS/SCSS stylesheets
│   ├── App.css             # Global styles for the App component
│   ├── App.js              # Root React component
│   ├── App.test.js         # Tests for the App component
│   ├── index.css           # Global styles
│   ├── index.js            # Entry point of the React app
│   ├── logo.svg            # Logo asset
│   ├── reportWebVitals.js  # Performance reporting
│   ├── routes.js           # Route definitions for the app
│   ├── setupTests.js       # Test setup file
│── .env                    # Environment variables
│── .gitattributes          # Git attributes configuration
│── .gitignore              # Files to ignore in Git
│── package-lock.json       # Lock file for npm dependencies
│── package.json            # Project metadata and dependencies
│── README.md               # Project documentation

```

---

## 🔧 Setup & Installation

### 1️⃣ Prerequisites
- Install **Node.js** (>= 16.x)
- Install **npm** or **yarn**

### 2️⃣ Clone Repository
```sh
git clone https://github.com/Vigneshkumar-D/chat-app-ui.git
cd chat-app-ui
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Configure Environment Variables
Create a `.env` file:
```env
REACT_APP_URL=http://localhost:4001
```

### 5️⃣ Start Frontend
```sh
npm start
```
The app runs on: **`http://localhost:3000`**  

---

---

## **WebSocket Integration**
This project uses **SockJS** and **STOMP.js** for real-time chat functionality.

### **WebSocket Connection Setup**
The WebSocket connection is established in `pages/home.js`:

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

 const socket = new SockJS(this.webSocketService.url);
const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
});

export default stompClient;
```

---

## 📮 API Endpoints Used
| Method | Endpoint | Description |
|--------|---------|------------|
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/chat/create` | Create a new chat |
| `GET` | `/api/chat/list` | Fetch user’s chat list |
| `POST` | `/api/message/send` | Send a chat message |
| `GET` | `/api/message/history/{chatId}` | Get chat history |

---

## 📸 Screenshots
### 💬 Chat Interface  
![image](https://github.com/user-attachments/assets/4bb030a6-3feb-44bf-b498-16f738abb5cb)

### Register Screen 
![image](https://github.com/user-attachments/assets/c0978250-5802-412b-95bf-58d0b97d1387)

### 🔐 Login Screen  
![image](https://github.com/user-attachments/assets/4ee57c51-863d-4db3-826a-03cd6601f50c)

---
