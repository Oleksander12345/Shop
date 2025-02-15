import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [role, setRole] = useState('user'); // Роль за замовчуванням — "user"
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";  // Фолбэк, если не найдено

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => document.body.classList.remove('auth-page');
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
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