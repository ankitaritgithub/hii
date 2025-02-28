import React, { useState, useEffect } from "react";
import "./chatbotresponse.css";
import copyIcon from "../assets/copy-icon.svg";
import downloadIcon from "../assets/Download.svg";
import AIAvatar from "../assets/AIAvatar.svg";

const ChatbotResponse = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isContentExpanded, setContentExpanded] = useState(true);

  useEffect(() => {
    if (!content) return;

    setDisplayedContent("");
    setIsTyping(true);

    const typingSpeed = 20;
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent((prev) => prev + content[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => {
      clearInterval(typingInterval);
      setIsTyping(false);
    };
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/download-report/newman-report.html"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "newman-report.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const splitContent = (content) => {
    const [header, ...rest] = content.split(":");
    return {
      header: header.trim(),
      body: rest.join(":").trim()
    };
  };

  const formatContent = (content) => {
    const lines = content.split("\n");
    return lines.map((line, index) => (
      <div key={index} className="content-line">
        {line}
      </div>
    ));
  };

  const hasHeader = splitContent(displayedContent).header !== '';
  const hasBody = splitContent(displayedContent).body !== '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatContent(splitContent(displayedContent).body));
  };

  return (
    <div className="message bot">
      <div className="bot-message">
        <div className="message-container">   
          {hasHeader && hasBody ? (
            <>
              <div className="messsage-header-wrapper">
                <div className="message-avatar">
                  <img src={AIAvatar} alt="AI Avatar" className="avatar-circle" />
                </div>
                <div className="message-header">
                  <h3>{splitContent(displayedContent).header}</h3>
                </div>
              </div>
              <div className="response-card">
                <div className="status-indicator" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  {isTyping ? 'Typing...' : <button className="copy-button" onClick={copyToClipboard}><img src={copyIcon} alt="Copy" /> Copy</button>}
                </div>
                <div className="content-text">
                  {formatContent(splitContent(displayedContent).body)}
                </div>
              </div>
            </>
          ) : hasHeader ? (
            <div className="messsage-header-wrapper">
            <div className="message-avatar">
              <img src={AIAvatar} alt="AI Avatar" className="avatar-circle" />
            </div>
            <div className="message-header">
              <h3>{splitContent(displayedContent).header}</h3>
            </div>
            </div>
          ) : hasBody ? (
            <div className="response-card">
              <div className="status-indicator" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                {isTyping ? 'Typing...' : <button onClick={copyToClipboard}>Copy</button>}
              </div>
              <div className="content-text">
                {formatContent(splitContent(displayedContent).body)}   
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ChatbotResponse;