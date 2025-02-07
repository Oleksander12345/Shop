import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dumps from './pages/Dumps';
import Login from './components/Login';
import Registration from './components/Registration';
import "./index.css";
import "./main-page.css";
import CVV2 from './pages/CVV2';
import Fullz from './pages/Fullz';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ResetPassword from './components/PasswordReset';
import AdminPanel from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import Orders from './pages/Orders'
import ForgotPassword from './components/ForgotPassword'

function App() {
  return (
    <Router>
      <Routes>
        {/* Публічні сторінки */}
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/passwordreset" element={<ResetPassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Сторінки з Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dumps" element={<Dumps />} />
          <Route path="cvv2" element={<CVV2 />} />
          <Route path="fullz" element={<Fullz />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
