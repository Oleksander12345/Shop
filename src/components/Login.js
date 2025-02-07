import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

function Login() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.219:8081/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        clearMessageAfterTimeout(setMessage);
        setMessage('Email sent successfully!');
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send email');
      }
      
    } catch (err) {
      clearMessageAfterTimeout(setError);
      setError('Server error. Please try again later.');
    }
  };
  const clearMessageAfterTimeout = (setMessageFunction) => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };



  useEffect(() => {
    document.body.classList.add('auth-page');

    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://192.168.0.219:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Збереження токена та ролей у localStorage
        localStorage.setItem('token', data.token);
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("username", decodedToken.sub);
        localStorage.setItem("role", decodedToken.roles);
        navigate('/dumps');
      } else {
        // Отримання повідомлення про помилку від сервера
        const errorData = await response.json();
        setError(errorData.message || 'Invalid username or password'); // Відображення тексту помилки
      }
    } catch (error) {
      setError('Server error. Please try again later.'); // Обробка помилок під час запиту
    }
  };

  return (
    <main className="login-main">
      <div className="login-container">
        <h1 className="title">Sign in</h1>

        <form className="form" onSubmit={handleSubmit} autoComplete="on">
          <div className="form-field">
            <input
              type="text"
              placeholder="Username"
              id="login-username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <input
              type="password"
              placeholder="Password"
              id="login-password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}

          <div className="form-field">
            <button className="btn btn-submit" type="submit">
              Log In
            </button>
            <div className='login-registration-container'>
              Don't have an account?
              <Link to="/registration" className="login-registration"> Sign up</Link>
            </div>
            <div className='forgotPassword-container'>
              <span style={{display: 'block', textAlign: 'center'}}>Forgot password?</span>
              <button
                type="button"
                className="forgotPassword-link"
                onClick={() => setIsModalOpen(true)}
              >
                Click here
              </button>
            </div>
          </div>
        </form>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Reset Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="modal-input"
        />
        {error && <p className="modal-error">{error}</p>}
        {message && <p className="modal-success">{message}</p>}
        <button className="modal-button" onClick={handleSendEmail}>
          Reset Password
        </button>
      </Modal>
    </main>
  );
}

export default Login;
