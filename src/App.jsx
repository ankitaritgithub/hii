import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import Chatbotresponse from './Components/chatbotresponse';
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/dashboard/*' element={<Dashboard />} />
          <Route path='/chatbotresponse' element={<Chatbotresponse />} />
          <Route path='*' element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>     
  );
}

export default App;
