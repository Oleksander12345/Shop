import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const token = localStorage.getItem("token");
  console.log(token);
  const username = localStorage.getItem("username")


  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getUserData();
    }
  }, [navigate, token]);

  // Получение данных пользователя с сервера
  function getUserData() {
    fetch(`http://192.168.0.219:8081/api/auth/${username}/user-data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.error || "Failed to fetch user profile");
            });
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setMessage("Failed to load user profile. Please try again.");
        });
  }

  const handlePasswordChangeEmail = async () => {
    if (!userData?.email) {
      setMessage("Error: No email associated with the user.");
      clearMessageAfterTimeout(setMessage);
      return;
    }

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
      clearMessageAfterTimeout(setMessage);
    } catch (error) {
      setMessage("Server error. Please try again later.");
      clearMessageAfterTimeout(setMessage);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage("New passwords do not match.");
      clearMessageAfterTimeout(setPasswordChangeMessage);
      return;
    }

    // Здесь должен быть вызов API для смены пароля, если требуется.
    setPasswordChangeMessage("Password changed successfully.");
    clearMessageAfterTimeout(setPasswordChangeMessage);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const clearMessageAfterTimeout = (setMessageFunction) => {
    setTimeout(() => {
      setMessageFunction("");
    }, 3000);
  };

  return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <h2>{userData ? userData.username : "Loading..."}</h2>
            <p>Email: {userData ? userData.email : "Loading..."}</p>
            <p>Balance: {userData ? `$${userData.balance.toFixed(2)}` : "Loading..."}</p>
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
          {message && <p className="message">{message}</p>}
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
