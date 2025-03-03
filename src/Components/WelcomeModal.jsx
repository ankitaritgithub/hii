import React, { useState } from 'react';
import './WelcomeModal.css';
import welcomeStartModel from '../assets/welcomesstartmodel.svg';
import startnewModel from '../assets/startnewmodel.svg';
import uploadswagger from '../assets/uploadswagger.svg';
import inputPromptModel from '../assets/inputpromptmodel.svg';
import promptdirection from '../assets/promptdirection.svg';
import elementIcon from '../assets/Element.svg';
import chooseFlow from '../assets/chooseflow.svg';
import apiTesting from '../assets/apitestingpage.svg';
import fullscreenchatconversation from '../assets/fullscreenchatconversation.svg';
import fileuploadconversation from '../assets/fileuploadconversation.svg';
import chatconversation from '../assets/chatconversation.svg';


const WelcomeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  
  if (!isOpen) return null;

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const getStepContent = () => {
    switch(step) {
      case 1:
        return {
          title: "Start",
          description: "Welcome to Agent QA! You can start your journey with QA Agent now to get your GUI & API testing done!",
          image: welcomeStartModel,
          label: "Enter your prompt",
          subtext: "To start new chat for generating test cases",
          buttonText: "Next"
        };
      case 2:
        return {
          title: "Start",
          description: "You can also start we chat from other option as shown below",
          image: startnewModel,
          label: "Click On Start New",
          subtext: "To begin generating test cases",
          buttonText: "Got it"
        };
      case 3:
        return {
          title: "Choose Flow",
          description: "You will be re-directed to the pages where you can get the response according to the prompt",
          image: chooseFlow,
          label: "Click On API Testing Agent",
          subtext: "To start new chat for generating testcases for API testing",
          buttonText: "Next"
        };
      case 4:
        return {
          title: "API Testing Page",
          description: "You will now be on the API testing Agent page where you can give custom prompt and upload swagger file ",
          image: apiTesting,
          label: "Give Custom Prompt and swagger file",
          subtext: "To start new chat for generating testcases for API tetsing",
          buttonText: "Next"
        };
      case 5:
        return {
          title: "Upload File",
          description: "You can upload swagger document (File format) from which you want to get testcases",
          image: inputPromptModel,
          label: "Upload Option",
          subtext: "To start with testcase generation swagger docs",
          buttonText: "Finish"
        };
      case 6:
        return{
          title: "Upload Swagger File",
          description: "You will be re-directed to the pages where you can get the response based on Swagger doc prompt.",
          image: uploadswagger,
          label: "Upload your swagger file",
          subtext: "You can upload your file here",
          buttonText: "Finish"
        };
      case 7:
        return{
          title: "API Testing Page",
          description: "You will now be on the API testing Agent page where you can give custom prompt and upload swagger file ",
          image: fileuploadconversation,
          label: "Give Custom Prompt and swagger file",
          subtext: "To start new chat for generating testcases for API testing",
          buttonText: "Finish"
        };
      case 8:
        return{
          title: "Next Step",
          description: "You will be re-directed to the pages where you can get the response according to the prompt",
          image: chatconversation,
          label: "Prompt Page",
          subtext: "Here you can download or copy result",
          buttonText: "Finish"
        };
      case 9:
        return{
          title: "Next Step",
          description: "You can view the response in full page with the view option available on the screen and download the response",
          image: fullscreenchatconversation,
          label: "Prompt Page",
          subtext: "Here you can download or copy result",
          buttonText: "Finish"
        };
      default:
        return {};
    }
  };

  const content = getStepContent();

  const handleButtonClick = () => {
    if (step === 9) {
      onClose();
    } else {
      handleNext();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>

        <div className="image-container">
          <img 
            src={content.image}
            alt="Current Step" 
            className="welcome-image" 
          />
        </div>

        <div className="prompt-section">
          <div className="prompt-label">{content.label}</div>
          <div className="prompt-text">{content.subtext}</div>
          <div className="next-container">
            <button className="next-button" onClick={handleButtonClick}>
              {content.buttonText}
              <img src={elementIcon} alt="next" className="next-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
