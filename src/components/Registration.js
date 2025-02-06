import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Роль за замовчуванням — "user"
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const users = JSON.parse(localStorage.getItem('users')) || [];
  //   const userExists = users.find(user => user.username === username || user.email === email);

  //   if (userExists) {
  //     setError('Username or email already exists');
  //   } else {
  //     const newUser = { username, email, password, role }; // Додаємо роль
  //     users.push(newUser);
  //     localStorage.setItem('users', JSON.stringify(users));
  //     localStorage.setItem('currentUser', JSON.stringify(newUser));
  //     navigate('/dumps');
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://192.168.0.219:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (response.ok) {
        navigate('/'); // Переходимо на логін після успішної реєстрації
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
    }
  };
  

  return (
    <main className="login-main">
      <div className="login-container">
        <h1 className="title">Sign up</h1>

        <form className="form" onSubmit={handleSubmit} autoComplete="on">
          <div className="form-field">
            <input
              type="text"
              placeholder="Name"
              id="register-name"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <input
              type="email"
              placeholder="Email"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <input
              type="password"
              placeholder="Password"
              id="register-password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="form-field">
            <label htmlFor="register-role">Role:</label>
            <select
              id="register-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-field">
            <button className="btn btn-submit" type="submit">Register</button>
            <div className='login-registration-container'>Already have an account?<Link to="/" className="login-registration"> Login</Link></div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Registration;