import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import Chatbotresponse from './Components/chatbotresponse';
import { ChatProvider } from './utils/chatHistoryUtils';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ProtectedRoute from './Components/ProtectedRoute';
import SplitScreen from './Components/splitscreen';

function App() {
  return (
    <ChatProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* <Route path='/SplitScreen' element={<SplitScreen />} /> */}
            {/* <Route path='/dashboard' element={<Dashboard />} /> */}
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path='/chatbotresponse' element={
              <ProtectedRoute>
                <Chatbotresponse />
              </ProtectedRoute>
            } />
            <Route path='*' element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ChatProvider>
  );
}

export default App;
