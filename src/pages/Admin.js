import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getUserData();
    }
  }, [navigate, token]);

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

  const handleDeleteUser = (username) => {
    // Видалення користувача
    const updatedUsers = users.filter(user => user.username !== username);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleChangeRole = (username) => {
    // Зміна ролі користувача
    const updatedUsers = users.map(user => {
      if (user.username === username) {
        return {
          ...user,
          role: user.role === 'ADMIN' ? 'USER' : 'ADMIN', // Зміна ролі
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <main className="admin-panel">
      <div className="admin-container">
        <h1 className="admin-title">Admin Panel</h1>

        <div className="admin-header">
          <p>Manage users and system settings</p>
          <button className="btn btn-logout" onClick={handleLogout}>Log Out</button>
        </div>

        <div className="user-list">
          <h2 style={{ marginBottom: "20px" }}>Registered Users</h2>
          {users.length > 0 ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-change-role"
                        onClick={() => handleChangeRole(user.username)}
                      >
                        Change Role
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteUser(user.username)}
                      >
                        Delete
                      </button>
                      <button className='btn btn-check-transactions'>
                        Check transactions
                      </button>
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
