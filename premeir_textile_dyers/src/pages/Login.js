import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">PTD</div>
        <h1 className="login-title">Premier Textile Dyers</h1>
        <p className="login-subtitle">Production Management System</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <div className="input-group">
            <User size={17} />
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-group password-group">
            <Lock size={17} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prevValue) => !prevValue)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

            {/* Demo Credentials section removed as per request */}
      </div>
    </div>
  );
};

export default Login;
