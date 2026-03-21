import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Strategies from './pages/Strategies';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import MT5 from './pages/MT5';
import Navbar from './components/Navbar';
import './styles/global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState<'demo' | 'real'>('demo');
  const [platform, setPlatform] = useState<'deriv' | 'mt5'>('deriv');
  const [apiToken, setApiToken] = useState('');

  const handleLogin = (token: string, accType: 'demo' | 'real', plat: 'deriv' | 'mt5') => {
    console.log('Login clicked:', { token, accType, plat });
    setApiToken(token);
    setAccountType(accType);
    setPlatform(plat);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setApiToken('');
  };

  const handleSwitchAccount = () => {
    setIsAuthenticated(false);
    setApiToken('');
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <Navbar 
            accountType={accountType} 
            platform={platform}
            onSwitchAccount={handleSwitchAccount}
            onLogout={handleLogout}
          />
        )}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={
            isAuthenticated ? 
            <Dashboard 
              apiToken={apiToken} 
              accountType={accountType} 
              platform={platform} 
            /> : 
            <Navigate to="/login" />
          } />
          <Route path="/strategies" element={isAuthenticated ? <Strategies /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/mt5" element={isAuthenticated ? <MT5 /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import Admin from './pages/Admin';

// Add this route inside <Routes>
<Route path="/admin" element={<Admin />} />