import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Create this CSS file

function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">StayFinder</Link>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/host-dashboard">Host Dashboard</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            {/* Add logout button later when auth is implemented */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;