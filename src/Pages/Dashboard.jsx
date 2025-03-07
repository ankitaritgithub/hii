import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Paperclip, X } from "lucide-react";
import Vector from "../assets/Vector.svg";
import "./Dashboard.css";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import UploadFile from "../Components/UploadFile";
import WelcomeModal from "../Components/WelcomeModal";
import ChatbotResponse from "../Components/chatbotresponse";
import dashboardArrow from "../assets/dashboaredarrow.svg";
import welcomescreenIcon from "../assets/welcomescreen.svg";
import microphoneIcon from "../assets/Microphone.svg";
import editIcon from "../assets/edit.svg";
import fileUploadIcon from "../assets/fileuploadinput.svg";
import MyAccountIcons from '../assets/MyAccount.svg';
import copyRightIcon from '../assets/copy-right.svg';
import downloadfileIcon from '../assets/Downloadfile.svg';
import closeIcon from '../assets/close.svg';
import SplitScreen from "../Components/splitscreen";
import { useChatContext } from "../utils/chatHistoryUtils";
import { v4 as uuid } from "uuid";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";



const Dashboard = () => {
  const { selectedChatId, setSelectedChatId, saveChatToHistory, getChatById } =
    useChatContext();
  const [showSplitScreen, setShowSplitScreen] = useState(false);
  const [isSidebar, setIsSidebar] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); 

  const features = {
    "Automate Case generation": [
      "Generate login test cases in a csv file",
      "Create a test case for password reset flow.",
      "Generate automated test cases for API authentication."
    ],
    "Test Case Execution": [
      "Execute test cases for login with valid and invalid credentials.",
      "Run API tests for user authentication endpoints.",
      "Perform automated cross-browser testing."
    ],
    "Code Import and Upload": [
      "Upload API test scripts for validation and execution.",
      "Validate uploaded test cases and execute them.",
      "Generate execution reports for uploaded test scripts."
    ]
  };

  const INACTIVITY_TIMEOUT = 1 * 60 * 1000;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isFileProcessed, setIsFileProcessed] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isChatActive, setIsChatActive] = useState(false);
  const wsRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMiddlePanelHidden, setIsMiddlePanelHidden] = useState(false);

  const [chatSessionId, setChatSessionId] = useState(null);
  const [realJson, setRealJson] = useState(null);

  const navigate = useNavigate();

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("WebSocket closed due to inactivity");
        wsRef.current.close();
      }
    }, INACTIVITY_TIMEOUT);
  }, []);

  const saveAssistantMessage = (message) => {
    // Define the function logic here
    console.log("Saving assistant message:", message);
  };

  const startNewChat = () => {
    // Define the function logic here
    console.log("Starting new chat");
  };

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenModal) {
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  useEffect(() => {
    const resetTimerEvents = ["mousemove", "keydown", "click"];
    const resetTimerHandler = resetInactivityTimer;

    resetTimerEvents.forEach((event) => {
      window.addEventListener(event, resetTimerHandler);
    });

    const createWebSocket = () => {
      wsRef.current = new WebSocket("ws://10.0.0.66:8000/ws/agentqa");

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");

        resetInactivityTimer();
      };

      wsRef.current.onmessage = (event) => {
        resetInactivityTimer();

        console.log("Raw message received:", event.data);
        if (event.data.startsWith("Unexpected")) {
          console.error("Received unexpected message:", event.data);
          return;
        }
        try {
          const response = JSON.parse(event.data); 
          console.log("Response:", response); // SETTING RESPONSE IN STATE
          setRealJson(response);
          console.log("Received message:", response); // Log the incoming message
          if (response?.chat_history) {
            const responseObj = response?.chat_history
              ?.filter((item) => item?.role !== "user")
              ?.map(msg => ({ ...msg, fromStorage: false }));

            setChatHistory((prev) => [...prev, ...responseObj]);

            // Save assistant messages to history
            responseObj.forEach((msg) => {
              if (msg.role === "assistant") {
                saveAssistantMessage(msg.content, selectedChatId);
              }
            });
          }
          setIsLoading(false);
          setUploadProgress(0);
        } catch (error) {
          console.error("Failed to parse JSON:", error); // Log the error
        }
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

    // Reset timer initially
    resetInactivityTimer();

    return () => {
      // Cleanup: remove event listeners and clear timer
      resetTimerEvents.forEach((event) => {
        window.removeEventListener(event, resetTimerHandler);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [resetInactivityTimer]);

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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      setSelectedFile(files);
      setSelectedFileName(files[0]?.name || '');
      setIsFileProcessed(true);
      setUploadProgress(100);
      setShowSplitScreen(true);
      setIsChatActive(true);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSelectedFileName('');
    setIsFileProcessed(false);
    setUploadProgress(0);
  };

  const handleDrop = () => {
    setIsDrop(!isDrop);
  };

  const handleStartNewChat = (chatId) => {
    if (chatId) {
      setChatSessionId(chatId);
      const chat = getChatById(chatId);
      const messagesWithStorageFlag = chat?.messages?.map(msg => ({ ...msg, fromStorage: true })) || [];
      setChatHistory(messagesWithStorageFlag);
      setIsChatActive(true)
    } else {
      const randomid = uuid();
      navigate({
        pathname: "/dashboard",
        search: createSearchParams({
          id: randomid,
        }).toString(),
      });

      setChatHistory([])
      setChatSessionId(randomid);
      initializeSession([], randomid);
      setIsChatActive(false)
    }
  };

  const handleSubmit = async (e) => {
    e.stopPropagation();
    if (!message && !selectedFile) return;

    setIsLoading(true);
    setIsChatActive(true);
    setShowSplitScreen(true);
    try {
      let fileContent = [];
      let fileName = '';



      if (selectedFile?.length) {
        try {
          fileContent = selectedFile.map(file => ({
            file_extension: file.file_extension,
            content: file.content
          }));
          fileName = selectedFile[0].name;
        } catch (error) {
          console.error("Error processing selected files:", error);
          throw new Error("Failed to process file");
        }
      }

      const requestBody = {
        prompt: message,
        file_content: fileContent
      };

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        resetInactivityTimer();

        wsRef.current.send(JSON.stringify(requestBody));


        const userMessage = {
          content: message,
          role: "user",
          fromStorage: false,
          file: selectedFile?.length > 0 ? {
            name: selectedFile[0].name,
            type: selectedFile[0].file_extension,
            size: selectedFile[0].size
          } : null
        };

        setChatHistory((prev) => [...prev, userMessage]);
        setMessage("");
        setSelectedFile(null);
        setSelectedFileName("");

        // Update chat history
        const updatedHistory = [...chatHistory, userMessage];
        setChatHistory(updatedHistory);

        console.log("updated history --", updatedHistory);

        // Clear input after sending
        setMessage("");
        setSelectedFile(null);
        setIsDrop(false);
      } else {
        console.error("WebSocket is not open yet");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { content: `Error: ${error.message}`, role: "system", name: "Error" },
      ]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const FeatureCard = ({ title, items, icon }) => {
    const handleFeatureClick = (items) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const messageObj = {
        prompt: items,
        role: "user"
      };
        wsRef.current.send(JSON.stringify(messageObj));

        const userMessage = {
          content: items,
          role: "user",
          fromStorage: false,
          file: selectedFile?.length > 0 ? {
            name: selectedFile[0].name,
            type: selectedFile[0].file_extension,
            size: selectedFile[0].size
          } : null
        };
        
        setChatHistory(prev => [...prev, userMessage]);
        setIsLoading(true);
        setIsChatActive(true);
      } else {
        console.error("WebSocket connection not open");
      }
    };

    return (
      <div className="feature-card">
        <div
          className="feature-header"
          data-type={title.toLowerCase().split(" ")[0]}
        >
          <h3>{title}</h3>
        </div>
        <div className="feature-items">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="feature-item"
              onClick={() => handleFeatureClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <span>{item}</span>
              <img src={dashboardArrow} alt="arrow" className="arrow-icon" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  async function initializeSession(messages, chatId) {
    await saveChatToHistory(messages, chatId);
  }

  useEffect(() => {
    const params = searchParams.get("id");

    if (params === null || params === "") {
      let randomId = uuid();
      setChatSessionId(randomId);
      setSearchParams({
        id: randomId,
      });
      // set session data
      initializeSession(chatHistory, randomId);
    }

    // if (chatHistory.length === 0 && chatSessionId === null) {
    //   let randomId = uuid(); // returns a random id
    //   setSelectedChatId(randomId);
    //   navigate({
    //     pathname: "/dashboard",
    //     search: createSearchParams({
    //       id: randomId,
    //     }).toString(),
    //   });
    // }
  }, []);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    if (chatSessionId) {
      if (chatHistory.length !== 0) {
        initializeSession(chatHistory, chatSessionId);
      }
    }
  }, [chatHistory]);

  return (
    <div className="dashboard-container">
      <WelcomeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <Navbar />
      <Sidebar onStartNewChat={handleStartNewChat} isSidebar={isSidebar} setIsSidebar={setIsSidebar} setIsHistoryOpen={setIsHistoryOpen}/>
      <div className="main-content-grid">
        <SplitScreen setIsSidebar={setIsSidebar} onStartNewChat={handleStartNewChat} setIsHistoryOpen={setIsHistoryOpen} />
        {/* TODO - add chat window  */}
        <div className={`middle-panel ${isMiddlePanelHidden ? "" : "middle-panel-hidden"}`}>
          <div className="chat-list">
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-item">
                <div className="chat-item-header">
                  <span className="chat-item-name">{chat.content}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
          <div className="main-content">
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
                    <h1 className="main-title">Welcome to Agent QA</h1>
                    <p className="subtitle">
                      What do you want to explore today? I can help you with <em>Generate Test Cases and Automate API Testing</em> & more.
                    </p>
                  </div>

                  <div className="features-section">
                    <div className="try-prompts">
                      <img src={welcomescreenIcon} alt="sparkles" />
                      <span>Try Out Suggested Prompts</span>
                    </div>

                    <div className="features-grid">
                      <FeatureCard
                        title="Automate Case generation"
                        items={features["Automate Case generation"]}
                      />
                      <FeatureCard
                        title="Test Case Execution"
                        items={features["Test Case Execution"]}
                      />
                      <FeatureCard
                        title="Code Import and Upload"
                        items={features["Code Import and Upload"]}
                      />
                    </div>
                  </div>

                </>
              )}
              <div className={`chat-section ${isChatActive ? "active" : ""}`}>

                <div className="chat-input">
                  {selectedFile && selectedFile?.length > 0 && (
                    <div className="selected-files-container">
                      {selectedFile.map((item, index) => (
                        <div key={index} className="selected-file-item">
                          <div className="file-left">
                            <div className="file-icon">
                              <img src={Vector} alt="Vector" width="24" height="24" />
                            </div>
                            <div className="file-name">{item?.name}</div>
                          </div>
                          <div
                            className="file-delete"
                            onClick={() => {
                              const newFiles = selectedFile.filter((_, i) => i !== index);
                              setSelectedFile(newFiles);
                            }}
                          >
                            ×
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="chat-input-wrapper">
                    <input
                      type="text"
                      value={message}
                      onChange={handleChangeMessage}
                      onKeyPress={handleKeyPress}
                      placeholder="How can I help you?"
                      className="chat-textfield"
                    />
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

                <div className="chat-messages">
                  {chatHistory.map((message, index) => {
                    if (message.role === "user") {
                      return (
                        <div key={index} className="message user">
                          <div className="user-avatar">
                            <div className="avatar-circle">👤</div>
                          </div>
                          <div className="message-content-wrapper">
                            <div className="message-content">
                              {editingMessageIndex === index ? (
                                <div className="content-text">
                                  <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="edit-textarea"
                                  />
                                  <div className="edit-actions">
                                    <button
                                      onClick={async () => {
                                        // Get all messages up to the edited message
                                        const messagesUpToEdit = chatHistory.slice(0, index + 1);
                                        // Update the edited message
                                        messagesUpToEdit[index].content = editedContent;
                                        
                                        // Set chat history to only include messages up to the edit
                                        setChatHistory(messagesUpToEdit);
                                        setEditingMessageIndex(null);

                                        // Send the updated conversation to LLM
                                        const requestBody = {
                                          prompt: editedContent,
                                          file_content: [],
                                          edit_index: index, // Add index to identify which message was edited
                                          conversation_history: messagesUpToEdit.map(msg => ({
                                            content: msg.content,
                                            role: msg.role
                                          }))
                                        };
                                        
                                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                                          resetInactivityTimer();
                                          wsRef.current.send(JSON.stringify(requestBody));
                                          setIsLoading(true);
                                          setIsChatActive(true);
                                        } else {
                                          console.error("WebSocket is not open yet");
                                          setIsLoading(false);
                                        }
                                        setEditedContent("");
                                      }}
                                      className="save-button"
                                    >
                                      <Send size={16} />
                                      Send
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingMessageIndex(null);
                                        setEditedContent("");
                                      }}
                                      className="cancel-button"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="content-text question-text">
                                  {message.content}
                                  <button
                                    className="edit-message"
                                    onClick={() => {
                                      setEditingMessageIndex(index);
                                      setEditedContent(message.content);
                                    }}
                                  >
                                    <img src={editIcon} alt="Edit" />
                                  </button>
                                </div>
                              )}
                            </div>
                            {message.file && (
                              <div className="file-preview-container">
                                <img src={fileUploadIcon} alt="File" className="file-icon" />
                                <div className="file-details">
                                  <div className="file-name">{message.file.name}</div>
                                  <div className="file-size">{formatFileSize(message.file.size)}</div>
                                  <button className="remove-file" onClick={handleRemoveFile}>
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <ChatbotResponse
                          key={index}
                          content={message.content}
                          isNewResponse={!message.fromStorage}
                          realJsonn={realJson}
                        />
                      );
                    }
                  })}

                  {isLoading && (
                    <div className="loading-message">
                      <div className="typing-indicator">
                        <span>Generating response</span>
                        <div className="typing-dots">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
          </div>
        </div>
      );
};

export default Dashboard;
