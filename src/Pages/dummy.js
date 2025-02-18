import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import "./Dashboard.css";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import UploadFile from "../Components/UploadFile";
import WelcomeModal from "../Components/WelcomeModal";
import dashboardArrow from "../assets/dashboaredarrow.svg";
import apitestingIcon from "../assets/apitestingicons.svg";
import guitestingIcon from "../assets/guitestingagent.svg";
import microphoneIcon from "../assets/Microphone.svg";

const Dashboard = () => {
  const features = {
    "API Testing Agent": [
      "Generate the test cases for on-boarding flow",
      "Generate and run the test cases from the given swagger file",
      "Generate and run the test cases from the given swagger file",
    ],
    "GUI Testing Agent": [
      "Generate and run the test cases from the given swagger file",
      "Generate and run the test cases from the given swagger file",
      "Generate and run the test cases from the given swagger file",
    ],
  };

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDrop, setIsDrop] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isChatActive, setIsChatActive] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const createWebSocket = () => {
      wsRef.current = new WebSocket("ws://localhost:8000/ws/process_task");

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      wsRef.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response?.chat_history) {
          const responseObj = response?.chat_history?.filter(
            (item) => item?.role !== "user"
          );
          setChatHistory((prev) => [...prev, ...responseObj]);
        }
        setIsLoading(false);
        setUploadProgress(0);
      };
      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsLoading(false);
        setUploadProgress(0);
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket connection closed", event);
        setTimeout(createWebSocket, 5000);
      };
    };

    createWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.toString().split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadProgress(0);
  };

  const handleDrop = () => {
    setIsDrop(!isDrop);
  };

  const handleSubmit = async () => {
    if (!message && !selectedFile) return;

    setIsLoading(true);
    setIsChatActive(true);
    try {
      let fileContent = "";
      let fileExtension = "";

      if (selectedFile) {
        try {
          fileContent = await convertFileToBase64(selectedFile);
          fileExtension = selectedFile.name.split(".").pop();
        } catch (error) {
          console.error("Error converting file to Base64:", error);
          throw new Error("Failed to process file");
        }
      }

      const requestBody = {
        prompt: message,
        file_content: fileContent,
        file_extension: fileExtension,
      };

      // Send message through WebSocket only if it's open
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(requestBody));

        // Add user message to chat history immediately
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            content: message,
            role: "user",
            name: selectedFile ? `File: ${selectedFile.name}` : "gfdgggf",
          },
        ]);
      } else {
        console.error("WebSocket is not open yet");
        setIsLoading(false);
      }

      // Clear input after sending
      setMessage("");
      setSelectedFile(null);
      setIsDrop(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          content: `Error: ${error.message}`,
          role: "system",
          name: "Error",
        },
      ]);
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const FeatureCard = ({ title, items, icon }) => (
    <div className="feature-card">
      <div
        className="feature-header"
        data-type={title.toLowerCase().split(" ")[0]}
      >
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


  return (
    <div className="dashboard-container">
      <WelcomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="dashboard-content">
          {isDrop && (
            <UploadFile
              onClose={() => setIsDrop(false)}
              onFileSelect={handleFileSelect}
              wsRef={wsRef}
            />
          )}
          {!isChatActive && (
            <>
              <div className="dashboard-overlay-block-1"></div>
              <div className="dashboard-overlay-block-2"></div>
              <div className="header">
                <h1 className="main-title">
                  Unveiling the Power of Test Case Generation
                  <br />
                  and Execution
                </h1>
                <p className="subtitle">
                  Software testing with automated case generation, execution,
                  and meticulous scrutiny, ensuring precision and efficiency in
                  development workflows.
                </p>
              </div>

              <div className="features-section">
                <h2>Try out our Features</h2>

                <div className="features-grid">
                  <FeatureCard
                    title="API Testing Agent"
                    items={features["API Testing Agent"]}
                    icon={apitestingIcon}
                  />
                  <FeatureCard
                    title="GUI Testing Agent"
                    items={features["GUI Testing Agent"]}
                    icon={guitestingIcon}
                  />
                </div>
              </div>
            </>
          )}
          <div className={`chat-section ${isChatActive ? "active" : ""}`}>
            <div className="chat-input">
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can I help you?"
                  className="chat-textfield"
                  // disabled={isLoading}
                />
                {selectedFile && (
                  <div className="file-preview">
                    <span>{selectedFile.name}</span>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="attachment-buttons">
                <div className="chat-actions">
                  <button
                    className="icon-button"
                    disabled={isLoading}
                    onClick={() => setIsDrop(true)}
                  >
                    <Paperclip size={20} />
                  </button>
                  <button className="icon-button" disabled={isLoading}>
                    <img
                      src={microphoneIcon}
                      alt="microphone"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
                <button
                  className="send-button"
                  onClick={handleSubmit}
                  disabled={isLoading || (!message && !selectedFile)}
                >
                  <Send size={16} /> {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
            {chatHistory.length > 0 && (
              <div className="chat-history">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`chat-message ${chat.role}`}>
                    <strong>{chat.role}:</strong> {chat.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
