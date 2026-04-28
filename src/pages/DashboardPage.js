import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <h1 className={styles.appTitle}>Dashboard</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.welcome}>Welcome, {user?.name}!</h2>
          <p className={styles.email}>Email: {user?.email}</p>
        </div>

        <div className={styles.card}>
          <h3>Getting Started</h3>
          <p>This is your dashboard. You have successfully logged in!</p>
          <ul>
            <li>This is a protected route - you can only see it when logged in</li>
            <li>Click the Logout button to return to the login page</li>
            <li>Try to refresh the page - note that the login state resets (you would store this in localStorage in a real app)</li>
          </ul>
        </div>

        <div className={styles.cardGrid}>
          <div className={styles.smallCard}>
            <h4>Profile</h4>
            <p>View and edit your profile information</p>
          </div>
          <div className={styles.smallCard}>
            <h4>Settings</h4>
            <p>Manage your account settings</p>
          </div>
          <div className={styles.smallCard}>
            <h4>Help</h4>
            <p>Get help and support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
