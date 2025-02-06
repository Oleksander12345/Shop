import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
  const isAdmin = currentUser.role === 'admin'; // Перевірка ролі

  return (
    <div className={`menu-container ${isMenuOpen ? 'open' : ''}`}>
      <div className="menu-trigger" onClick={toggleMenu}>
        <div className="bars">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>MENU</p>
      </div>

      <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/dumps">Dumps</Link></li>
          <li><Link to="/cvv2">CVV2</Link></li>
          <li><Link to="/fullz">Fullz</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          {isAdmin && <li><Link to="/admin">Admin Panel</Link></li>} {/* Лише для адмінів */}
        </ul>
      </nav>
    </div>
  );
}

export default Menu;
