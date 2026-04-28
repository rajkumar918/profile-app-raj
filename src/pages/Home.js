import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Welcome to MyApp</h1>
        <p>Your simple React application with authentication</p>

        {!isAuthenticated() && (
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Secure Login</h3>
            <p>Simple and secure authentication system</p>
          </div>
          <div className="feature-card">
            <h3>📱 Responsive Design</h3>
            <p>Works great on all devices and screen sizes</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Fast Performance</h3>
            <p>Built with React for optimal performance</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Modern UI</h3>
            <p>Clean and intuitive user interface</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
