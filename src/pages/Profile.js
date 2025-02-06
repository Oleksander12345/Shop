import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../main-page.css";

function Profile() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); // Повідомлення про результат
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const token = localStorage.getItem("token");

  // const users = JSON.parse(localStorage.getItem("users")) || []; // Отримання всіх користувачів
  // const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Поточний користувач

  // // Пошук даних поточного користувача серед усіх користувачів
  // const userData = users.find((user) => user.username === currentUser?.username);

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Якщо користувач не авторизований, перенаправити на логін
    }
  });

  function getUserData(){
    fetch('fff',{
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }) 
      .then((response) => {
        if(!response.ok) {
          return response.json().than((error) => {
            throw new Error(error.error || 'Failed to fetch user profile')
          });
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('Error fetching user profile');
      })
  } 

  function changePassword(username, oldPassword, newPassword){
    return null;
  }

  const handlePasswordChangeEmail = async () => {
    // if (!userData?.email) {
    //   setMessage("Error: No email associated with the user.");
    //   clearMessageAfterTimeout(setMessage); // Зникнення повідомлення через 3 сек.
    //   return;
    // }

    try {
      const response = await fetch("http://your-server.com/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userData.email }),
      });

      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setMessage("Error: Unable to send the reset link.");
      }
      clearMessageAfterTimeout(setMessage); // Зникнення повідомлення через 3 сек.
    } catch (error) {
      setMessage("Server error. Please try again later.");
      clearMessageAfterTimeout(setMessage); // Зникнення повідомлення через 3 сек.
    }
  };

  const handlePasswordChange = () => {

    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage("New passwords do not match.");
      clearMessageAfterTimeout(setPasswordChangeMessage);
      return;
    }

    setPasswordChangeMessage("Password changed successfully.");
    clearMessageAfterTimeout(setPasswordChangeMessage); // Зникнення повідомлення через 3 сек.
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  // Функція для очищення повідомлення через 3 секунди
  const clearMessageAfterTimeout = (setMessageFunction) => {
    setTimeout(() => {
      setMessageFunction("");
    }, 3000); // 3000 мс = 3 секунди
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">A</div>
        <div className="profile-info">
          <h2>{userData?.username}</h2>
          <p>Email: {userData?.email}</p>
          <p>Balance:</p>
        </div>
      </div>

      <div className="profile-section">
        <h3>Update Password</h3>
        <table className="password-table">
          <tbody>
            <tr>
              <td>Current Password:</td>
              <td>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </td>
            </tr>
            <tr>
              <td>New Password:</td>
              <td>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </td>
            </tr>
            <tr>
              <td>Confirm Password:</td>
              <td>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type="button" onClick={handlePasswordChange}>
            Change Password
          </button>
          <button type="button" onClick={handlePasswordChangeEmail}>
            Forgot password? Send link on email
          </button>
        </div>
        
        {passwordChangeMessage && (
          <p className="message">{passwordChangeMessage}</p>
        )}
        {message && <p className="message">{message}</p>} {/* Виведення повідомлення */}
      </div>

      <div className="profile-section order-history">
        <h3>Order History</h3>
        <div className="order-history-item">
          <span>Order #12345</span>
          <span>01/10/2025</span>
          <span>$250.00</span>
        </div>
        <div className="order-history-item">
          <span>Order #12346</span>
          <span>01/12/2025</span>
          <span>$150.00</span>
        </div>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
