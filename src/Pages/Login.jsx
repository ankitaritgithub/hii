import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import loginLeftBg from '../assets/loginleft.svg';
import microsoftLogo from '../assets/microsoft.svg';
import logo from '../assets/logo.svg';
import akiraLogo from '../assets/akira.svg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    // After successful login validation, navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-left" style={{ 
        backgroundImage: `url(${loginLeftBg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="login-content">
          <h1 className="brand-title">Agent QA</h1>
          <p className="login-brand-description">
            Unlock the power of seamless automation with our AI-driven agent flows. Log in to
            explore personalized workflows, intuitive insights, and cutting-edge technology
            designed to simplify your day-to-day processes.
          </p>
        </div>
      </div>
      
      <div className="login-right">
      <div className="login-logo-container">
          <div className="login-logo-circle">
            <img src={logo} alt="Logo" />
          </div>
          <div className="login-logo-text">
            <span className="login-primary-text">AgentQA</span>
            <span className="login-powered-by">powered by <img src={akiraLogo} alt="Akira" className="login-akira-logo" /> <strong>akira™</strong></span>
          </div>
        </div>
        <div className="login-form-container">
          
          <h2 className="welcome-text">Welcome back</h2>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Id</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@xenonstack.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******************"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me-container">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                  <span className="remember-text">Remember me</span>
                </label>
              </div>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
            
            <div className="divider">
              <span className="divider-text">OR</span>
            </div>

            <button type="button" className="microsoft-login-button">
              <img src={microsoftLogo} alt="Microsoft" className="microsoft-icon" />
              Sign in using Microsoft
            </button>
            
            <p className="signup-prompt">
              Don't you have an account? <a href="/Signup">Sign up</a>
            </p>
            
            <p className="terms-text">
              By signing up to create an account I accept Company's{' '}
              <a href="/terms">Terms of use</a> & <a href="/privacy">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
