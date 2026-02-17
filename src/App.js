import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MachineData from './pages/MachineData';
import DyesChemicals from './pages/DyesChemicals';
import ColorInspection from './pages/ColorInspection';
import ColorRecipes from './pages/ColorRecipes';
import QualityReports from './pages/QualityReports';
import StandardsTracking from './pages/StandardsTracking';
import ProductionSchedule from './pages/ProductionSchedule';
import Alerts from './pages/Alerts';
import BatchHistory from './pages/BatchHistory';
import Login from './pages/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in (using localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/machine-data" element={<MachineData />} />
          <Route path="/dyes-chemicals" element={<DyesChemicals />} />
          <Route path="/color-inspection" element={<ColorInspection />} />
          <Route path="/color-recipes" element={<ColorRecipes />} />
          <Route path="/quality-reports" element={<QualityReports />} />
          <Route path="/standards-tracking" element={<StandardsTracking />} />
          <Route path="/production-schedule" element={<ProductionSchedule />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/batch-history" element={<BatchHistory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
