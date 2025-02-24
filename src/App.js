import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import Cookies from 'js-cookie';
import ResetPassword from "./pages/ResetPassword";

const isAuthenticated = () => {
  return Cookies.get("login_token") !== null;
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const AppContent = () => {
  return (
    <>
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />}/>
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/chat/:id"
            element={<ProtectedRoute element={<ChatWindow />} />}
          />
      </Routes>
    </>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
