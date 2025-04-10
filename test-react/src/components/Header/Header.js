import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>React App</h1>
      </div>
    </header>
  );
}

export default Header;