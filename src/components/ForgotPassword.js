import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function ForgotPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token'); // Отримати токен із URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://your-server.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setMessage('Password successfully reset. You can now log in.');
      } else {
        setMessage('Error: Invalid token or server issue.');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Set a New Password</h2>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          className="forgot-password-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="forgot-password-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="forgot-password-button">Reset Password</button>
      </form>
      {message && <p className="forgot-password-message">{message}</p>}
    </div>
  );
}

export default ForgotPassword;
