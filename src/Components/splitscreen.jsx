import React from 'react';
import './splitscreen.css';
import dashboardIcon from '../assets/Dashboared.svg';
import userIcon from '../assets/User.svg';
import exploreIcon from '../assets/exploreagent.svg';
import historyIcon from '../assets/history.svg';
import toolsandintegrationIcon from '../assets/Integration.svg';
import settingIcon from '../assets/Settings.svg';
import startNewIcon from '../assets/sliderchat.svg';
import profileImage from '../assets/profileimage.svg';
import sidebarLeft from '../assets/SidebarLeft.svg';
import MyAccountIcons from '../assets/MyAccount.svg';
import copyRightIcon from '../assets/copy-right.svg';
import downloadfileIcon from '../assets/Downloadfile.svg';
import closeIcon from '../assets/close.svg';

const SplitScreen = ({ isChatActive, setIsSidebar, onStartNewChat , setIsHistoryOpen}) => {
  return (
    <div className="split-screen-container">
      <div className="left-panel">
        <div className="split-screen-menu">
          <button className="split-screen-sidebarleft-btn" onClick={() => setIsSidebar(true)}>
            <img src={sidebarLeft} alt="sidebarleft" />
          </button>
          <button className="split-screen-user-btn">
            <div className="split-screen-avatar">
              <img src={profileImage} alt="User avatar" />
            </div>
          </button>
          <button className="split-screen-item" onClick={() => onStartNewChat(null)}>
            <img src={startNewIcon} alt="Start New" />
          </button>
          <button className="split-screen-item">
            <img src={dashboardIcon} alt="Dashboard" />
          </button>
          <button className="split-screen-item">
            <img src={toolsandintegrationIcon} alt="Tools" />
          </button>
          <button className="split-screen-item"  onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            <img src={historyIcon} alt="History" />
          </button>
        </div>
        <div className="bottom-menu">
          <button className="split-screen-item">
            <img src={settingIcon} alt="Settings" />
          </button>
          <button className="split-screen-item">
            <img src={exploreIcon} alt="Explore" />
          </button>
          <button className="split-screen-item">
            <img src={MyAccountIcons} alt="My Account" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitScreen;
