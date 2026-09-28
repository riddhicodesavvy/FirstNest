import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import HouseMatcherPage from './pages/HouseMatcherPage';
import StatisticsPage from './pages/StatisticsPage';
import CorrelationPage from './pages/CorrelationPage';
import ProbabilityPage from './pages/ProbabilityPage';
import BayesPage from './pages/BayesPage';
import PolynomialPage from './pages/PolynomialPage';
import DatasetPage from './pages/DatasetPage';
import SyllabusPage from './pages/SyllabusPage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendOnline, setBackendOnline] = useState(false);

  // Monitor backend health
  useEffect(() => {
    let isMounted = true;
    async function checkBackend() {
      try {
        await api.checkHealth();
        if (isMounted) setBackendOnline(true);
      } catch (err) {
        if (isMounted) setBackendOnline(false);
      }
    }
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'matcher' && <HouseMatcherPage />}
        {activeTab === 'statistics' && <StatisticsPage />}
        {activeTab === 'correlation' && <CorrelationPage />}
        {activeTab === 'probability' && <ProbabilityPage />}
        {activeTab === 'bayes' && <BayesPage />}
        {activeTab === 'polynomial' && <PolynomialPage />}
        {activeTab === 'dataset' && <DatasetPage />}
        {activeTab === 'syllabus' && <SyllabusPage />}
      </main>

      {/* Modern Academic Footer */}
      <footer className="bg-dark-900 border-t border-dark-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200">
              FirstNest
            </span>
            <span>&bull;</span>
            <span>Smart House Budget & Requirement Analyzer (All Prices in ₹ Rupees)</span>
          </div>
          <div>
            Dataset: <span className="text-white font-mono">House Price India.csv</span> (14,619 records, 23 attributes)
          </div>
        </div>
      </footer>
    </div>
  );
}

