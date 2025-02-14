import React, { useState } from 'react';
import { 
  FileText, 
  ChevronDown
} from 'lucide-react';
import './Sidebar.css';
import profileImage from '../assets/profileimage.svg';
import dashboardIcon from '../assets/dashboared.svg';
import exploreIcon from '../assets/Exploretoolsicons.svg';
import integrationIcon from '../assets/integrationtoolsicons.svg';
import historyIcon from '../assets/history.svg';
import signoutIcon from '../assets/signout.svg';
import sidebarLeftIcon from '../assets/Sidebar Left.svg';
import settingIcon from '../assets/setting.svg';
import startNewIcon from '../assets/startnew.svg';

const Sidebar = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="sidebar">
      <button className="start-button">
        <img src={startNewIcon} alt="Start New" width={16} height={16} />
        Start new
      </button>

      <nav className="nav-menu">
        <NavItem icon={FileText} label="Summary" />
        <NavItem icon={() => <img src={dashboardIcon} alt="Dashboard" />} label="Dashboard" />
        <NavItem icon={() => <img src={integrationIcon} alt="Integration Tools" />} label="Integration Tools" />
        <div className="history-item">
          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="history-button"
          >
            <div className="nav-item-content">
              <img src={historyIcon} alt="History" className="nav-icon" />
              <span>History</span>
            </div>
            <ChevronDown 
              className={`chevron-icon ${isHistoryOpen ? 'rotate' : ''}`}
            />
          </button>
        </div>
      </nav>

      <div className="bottom-section">
        <div className="bottom-menu">
          <NavItem icon={() => <img src={settingIcon} alt="Settings" />} label="Settings" />
          <NavItem icon={() => <img src={exploreIcon} alt="Explore" />} label="Explore Agent" />
          <NavItem icon={() => <img src={signoutIcon} alt="Sign Out" />} label="Sign Out" />
        </div>

        <div className="profile-section">
          <div className="profile-content">
            <img
              src={profileImage}
              alt="Profile"
              className="profile-image"
            />
            <span className="profile-name">Piyush Sonawane</span>
          </div>
          <button className="logout-button">
            <img src={sidebarLeftIcon} alt="Logout" width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label }) => {
  return (
    <button className="nav-item">
      <div className="nav-item-content">
        {typeof Icon === 'function' ? <Icon /> : <Icon className="nav-icon" />}
        <span>{label}</span>
      </div>
    </button>
  );
};

export default Sidebar;