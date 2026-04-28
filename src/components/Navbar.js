import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

// Simplified navbar: no login/signup; always show main links.
const Navbar = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = stored ? JSON.parse(stored) : { name: 'Candidate' };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ProfileApp
        </Link>
        <div className="navbar-menu">
          <span className="user-name">Welcome, {user?.name}!</span>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
