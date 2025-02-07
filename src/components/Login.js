import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add('auth-page'); // Додаємо клас для логіну

    return () => {
      document.body.classList.remove('auth-page'); // При виході — видаляємо
    };
  }, []);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const users = JSON.parse(localStorage.getItem('users')) || [];
  //   const user = users.find(user => user.username === username && user.password === password);
  
  //   if (user) {
  //     localStorage.setItem('currentUser', JSON.stringify({ username: user.username, role: user.role }));
  //     navigate('/dumps');
  //   } else {
  //     setError('Invalid username or password');
  //   }
  // };
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
        localStorage.setItem('token', data.token); // Зберігаємо токен або дані користувача
        console.log(data.token);
        const decodedToken = JSON.parse(atob(data.token.split(".")[1])); // Декодируем payload
        localStorage.setItem("username", decodedToken.sub);
        localStorage.setItem("role", decodedToken.roles)
        console.log(decodedToken.roles);
        navigate('/dumps');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid username or password');
      }
    } catch (error) {
      setError('Server error. Please try again later.');
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
            name="username"              // ✅ Поле для імені користувача
            autoComplete="username"      // ✅ Автозаповнення імені
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
            name="password"               // ✅ Поле для пароля
            autoComplete="current-password" // ✅ Автозаповнення пароля
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-field">
            <button className="btn btn-submit" type="submit">Log In</button>
            <div className='login-registration-container'>Don't have a account?<Link to="/registration" className="login-registration"> Sign up</Link></div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
