import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';

function Layout() {
  return (
    <div className="layout">
      <Menu />  {/* Загальне меню */}
      <main className="content">
        <Outlet /> {/* Тут буде виводитися контент поточної сторінки */}
      </main>
    </div>
  );
}

export default Layout;
