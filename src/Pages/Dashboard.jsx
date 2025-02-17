import React, { useState, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import './Dashboard.css';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import UploadFile from '../Components/UploadFile';
import WelcomeModal from '../Components/WelcomeModal';
import dashboardArrow from '../assets/dashboaredarrow.svg';
import apitestingIcon from '../assets/apitestingicons.svg';
import guitestingIcon from '../assets/guitestingagent.svg';
import microphoneIcon from '../assets/Microphone.svg';

const Dashboard = () => {
  const features = {
    'API Testing Agent': [
      'Generate the test cases for on-boarding flow',
      'Generate and run the test cases from the given swagger file',
      'Generate and run the test cases from the given swagger file'
    ],
    'GUI Testing Agent': [
      'Generate and run the test cases from the given swagger file',
      'Generate and run the test cases from the given swagger file',
      'Generate and run the test cases from the given swagger file'
    ]
  };

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDrop, setIsDrop] = useState(false);

  const handleDrop = () => {
    setIsDrop(!isDrop);
  };

  const handleSubmit = () => {
    console.log("clicked")
    // try catch block - react js
    // axios - react js 

    // useEffect - api call - react js
  }

  const FeatureCard = ({ title, items, icon }) => (
    <div className="feature-card">
      <div className="feature-header" data-type={title.toLowerCase().split(' ')[0]}>
        <img src={icon} alt={title} className="feature-icon" />
        <h3>{title}</h3>
      </div>
      <div className="feature-items">
        {items.map((item, index) => (
          <div key={index} className="feature-item">
            <span>{item}</span>
            <img src={dashboardArrow} alt="arrow" className="arrow-icon" />
          </div>
        ))}
      </div>
    </div>
  );

  const ChatInput = ({ handleDrop }) => {
    const [message, setMessage] = useState('');

    return (
      <div className="chat-input">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={message}
            onChange={(e) => {setMessage(e.target.value)}}
            placeholder="How can I help you?"
            className="chat-textfield"
          />
        </div>
        <div className="attachment-buttons">
          <div className="chat-actions">
            <button className="icon-button">
              <Paperclip size={20} onClick={handleDrop} />
            </button>
            <button className="icon-button">
              <img src={microphoneIcon} alt="microphone" width={20} height={20} />
            </button>
          </div>
          <button className="send-button" onClick={handleSubmit}>
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <WelcomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="dashboard-content">
          <div className="dashboard-overlay-block-1"></div>
          <div className="dashboard-overlay-block-2"></div>
          <div className="header">
            <h1 className="main-title">
              Unveiling the Power of Test Case Generation
              <br />
              and Execution
            </h1>
            <p className="subtitle">
              Software testing with automated case generation, execution, and meticulous scrutiny, ensuring precision
              and efficiency in development workflows.
            </p>
          </div>

          <div className="features-section">
            <h2>Try out our Features</h2>
            {isDrop ? (
              <UploadFile onClose={() => setIsDrop(false)} />
            ) : (
              <div className="features-grid">
                <FeatureCard
                  title="API Testing Agent"
                  items={features['API Testing Agent']}
                  icon={apitestingIcon}
                />
                <FeatureCard
                  title="GUI Testing Agent"
                  items={features['GUI Testing Agent']}
                  icon={guitestingIcon}
                />
              </div>
            )}
            <ChatInput handleDrop={handleDrop}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;