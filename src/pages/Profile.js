import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

function Profile() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [oldPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const token = localStorage.getItem("token");
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const username = localStorage.getItem("username");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";  // Фолбэк, если не найдено
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getUserData();
      fetchTransactions();
    }
  }, [navigate, token]);

  const fetchTransactions = () => {
    fetch(`http://localhost:8081/api/auth/${username}/user-transaction`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.error || "Failed to fetch transactions");
          });
        }
        return response.json();
      })
      .then((data) => {
        const userTransactions = data.filter(trans => trans.username === username); // 🛠 Фільтрація за ім’ям користувача
        setTransactions(userTransactions);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setMessage("Failed to load transactions. Please try again.");
      });
  };
  // Получение данных пользователя с сервера
  function getUserData() {
    fetch(`http://localhost:8081/api/auth/${username}/user-data`, {
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
  function handleCreatePayment() {
    const numericAmount = parseFloat(amount);
  
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      clearMessageAfterTimeout(setError);
      return;
    }
  
    fetch("http://localhost:8081/api/payment/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, amount: numericAmount }),
    })
      .then((response) => {
        const contentType = response.headers.get("Content-Type");
        if (!response.ok) {
          // Якщо сервер повернув помилку
          if (contentType && contentType.includes("application/json")) {
            return response.json().then((error) => {
              throw new Error(error.error || "Failed to create payment");
            });
          } else {
            throw new Error("Failed to create payment. Server returned non-JSON response.");
          }
        }
  
        // Якщо відповідь JSON
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        }
  
        // Якщо відповідь текст (наприклад, URL)
        return response.text();
      })
      .then((data) => {
        if (typeof data === "string" && data.startsWith("http")) {
          console.log("Redirecting to:", data);
          window.location.href = data; // Перенаправлення на URL
        } else if (data && data.paymentUrl) {
          console.log("Redirecting to:", data.paymentUrl);
          window.location.href = data.paymentUrl;
        } else {
          throw new Error("Unexpected response format.");
        }
      })
      .catch((error) => {
        console.error("Error creating payment:", error);
        setError(error.message || "Error creating payment. Please try again.");
        clearMessageAfterTimeout(setError);
      });
  }
 
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage("New passwords do not match.");
      clearMessageAfterTimeout(setPasswordChangeMessage);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/${username}/change-password`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", },
        body: JSON.stringify({ token, oldPassword, newPassword }),
      });

      if (response.ok) {
        setPasswordChangeMessage("Password changed successfully.");
        clearMessageAfterTimeout(setPasswordChangeMessage);
      } else {
        setMessage('Error: Invalid token or server issue.');
        clearMessageAfterTimeout(setMessage);
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    }


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
          <div className="addBalance-container"><button className="addBalance" onClick={() => setIsModalOpen(true)}>Add Balance</button></div>
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
                    value={oldPassword}
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
          </div>

          {passwordChangeMessage && (
              <p className="message">{passwordChangeMessage}</p>
          )}
          {message && <p className="message">{message}</p>}
        </div>

        <div className="profile-section order-history">
          <h3>Transaction History</h3>
          {transactions.length > 0 ? (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Crypto Currency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trans) => (
                  <tr key={trans.transactionId}>
                    <td>{trans.transactionId}</td>
                    <td>${parseFloat(trans.amount).toFixed(2)}</td>
                    <td>{new Date(trans.createdAt).toLocaleString()}</td>
                    <td>{trans.cryptocurrency}</td>
                    <td>{trans.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Increase your balance</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter your amount"
            className="modal-input"
          />
          {error && <p className="modal-error">{error}</p>}
          {message && <p className="modal-success">{message}</p>}
          <button className="modal-button" onClick={handleCreatePayment}>
            Create Payment
          </button>
        </Modal>
      </div>



      
  );
}

export default Profile;
