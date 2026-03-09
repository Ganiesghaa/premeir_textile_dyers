import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
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
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={(
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/machine-data" element={<MachineData />} />
                <Route path="/dyes-chemicals" element={<DyesChemicals />} />
                <Route path="/color-inspection" element={<ColorInspection />} />
                <Route path="/color-recipes" element={<ColorRecipes />} />
                <Route path="/quality-reports" element={<QualityReports />} />
                <Route path="/standards-tracking" element={<StandardsTracking />} />
                <Route path="/production-schedule" element={<ProductionSchedule />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/batch-history" element={<BatchHistory />} />
              </Routes>
            </Layout>
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
