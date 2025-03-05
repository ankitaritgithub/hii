import React from 'react';
import logo from '../assets/logo.svg';
import moonIcon from '../assets/moon.svg';
import notificationIcon from '../assets/notification.svg';
import logoutIcon from '../assets/Logout.svg';
import './Navbar.css';
import akiraLogo from '../assets/akira.svg';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo-container">
          <div className="navbar-logo-circle">
            <img src={logo} alt="Logo" />
          </div>
          <div className="navbar-logo-text">
            <span className="navbar-primary-text">AgentQA</span>
            <span className="navbar-powered-by">powered by <img src={akiraLogo} alt="Akira" className="navbar-akira-logo" /> <strong>akira™</strong></span>
          </div>
        </div> 
       </div>
      <div className="navbar-right">
        <img src={moonIcon} alt="Moon" className="icon moon-icon" />
        <img src={notificationIcon} alt="Notification" className="icon notification-icon" />
        <div className="logout-button">
        <img src={logoutIcon} alt="Logout" className="icon logout-icon" />
        <span>Logout</span>
         </div>
      </div>
      </div>
  );
}

export default Navbar;
