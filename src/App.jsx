import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import Chatbotresponse from './Components/chatbotresponse';
import { ChatProvider } from './utils/chatHistoryUtils';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

function App() {
  return (
    <ChatProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/chatbotresponse' element={<Chatbotresponse />} />
            <Route path='*' element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ChatProvider>
  );
}

export default App;
