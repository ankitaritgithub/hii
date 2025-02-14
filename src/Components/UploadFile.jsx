import React, { useState, useRef } from 'react';
import './UploadFile.css';

const UploadFile = () => {
  const [testCases, setTestCases] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    files.forEach(file => {
      const testCase = {
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: formatFileSize(file.size),
        status: 'uploading'
      };

      setTestCases(prev => [...prev, testCase]);
      simulateUpload(testCase.id);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const simulateUpload = (id) => {
    let progress = 0;
    setUploadProgress(prev => ({ ...prev, [id]: 0 }));

    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(prev => ({ ...prev, [id]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setTestCases(prev => 
          prev.map(tc => 
            tc.id === id ? { ...tc, status: 'completed' } : tc
          )
        );
      }
    }, 200);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="swagger-container">
      <div className="swagger-header">
        <h2 className="swagger-title">Please Upload your Swagger Document</h2>
        <p className="swagger-subtitle">
          Upload your Swagger YAML file (optional) and/or enter a custom prompt
        </p>
      </div>

      <div
        className="upload-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="upload-icon-container">
          <svg
            className="upload-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="upload-text">Select a file or drag and drop here</p>
        <p className="upload-subtext">
          Upload swagger docs size no more than 200 MB
        </p>
        <label>
          <button className="browse-button" onClick={handleButtonClick}>Browse files </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileInput}
            accept=".yaml,.yml,.json"
            multiple
          />
        </label>
      </div>

      <div className="test-cases-container">
        {testCases.map((testCase) => (
          <div key={testCase.id} className="test-case">
            <div className="test-case-info">
              <svg
                className="file-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="test-case-name">{testCase.name}</span>
              <span className="test-case-size">{testCase.size}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress[testCase.id] || 0}%` }}
              />
            </div>
            <div className="progress-text">
              {uploadProgress[testCase.id] || 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFile;