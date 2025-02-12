import React from "react";
import { FileText, LayoutDashboard, Layers, Settings, Users } from "lucide-react";
import ProfileImage from "../assets/profileimage.svg";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="profile-section">
        <img
          src={ProfileImage}
          alt="User Avatar"
          className="avatar"
        />
        <span className="username">Piyush Sonawane</span>
        <Settings className="settings" />
      </div>

      <button className="start-button">+ Start New</button>

      <nav className="nav-menu">
        <NavItem icon={FileText} label="Summary" />
        <NavItem icon={Users} label="Dashboard" />
        <NavItem icon={LayoutDashboard} label="Integration Tools" />
        <NavItem icon={Layers} label="History" />
      </nav>

      <div className="bottom-links">
        <NavItem icon={Settings} label="Settings" />
        <NavItem icon={Users} label="Explore Agent" />
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label }) {
  return (
    <div className="nav-item">
      <Icon className="nav-icon" />
      <span className="nav-label">{label}</span>
    </div>
  );
}
