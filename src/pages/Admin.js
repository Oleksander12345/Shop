import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";  // Фолбэк, если не найдено
  
  useEffect(() => {
    if (!localStorage.getItem("role") === "ADMIN") {
        navigate("/");
    } else {
      fetchUserData();
      fetchUsers();
    }
}, [navigate, token]);
 
  // Отримання даних адміністратора
  function fetchUserData() {
    fetch(`${API_URL}/api/admin/get-all-users`, {
      method: "GET",
      credentials: 'include', // Використовуємо cookie-based аутентифікацію
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
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

  // Отримання списку користувачів із сервера
  function fetchUsers() {
    fetch(`${API_URL}/api/admin/get-all-users`, {
      method: "GET",
      credentials: 'include',
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setMessage("Failed to load users.");
      });
  }

  // Видалення користувача через серверний API
  const handleDeleteUser = (username) => {
    fetch(`${API_URL}/api/admin/delete`, {
      method: "DELETE",
      credentials: 'include',
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", },
      body: JSON.stringify({ username }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUsers(users.filter(user => user.username !== username));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };


  // Вихід користувача (видалення сесії)
  const handleLogout = () => {
    fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: 'include',
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", },
    })
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <main className="admin-panel">
      <div className="admin-container">
        <h1 className="admin-title">Admin Panel</h1>

        <div className="admin-header">
          <p>Manage users and system settings</p>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <button className="btn btn-logout" onClick={handleLogout}>Log Out</button>
            <button className='btn btn-check-transactions' onClick={() => navigate('/transactions')}>
              Check transactions
            </button>
          </div>
        </div>

        {message && <p className="error-message">{message}</p>}

        <div className="user-list">
          <h2 style={{ marginBottom: "20px" }}>Registered Users</h2>
          {users.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="remove-button-container">
                        <button className="remove-button" style={{transform: "scale(1.5)", position: "relative", top: "3px"}} onClick={() => handleDeleteUser(user.username)}>
                          <MdDeleteForever/>
                        </button>
                      </div>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users registered yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminPanel;
