import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  GitCompare,
  PieChart,
  BrainCircuit,
  TrendingUp,
  Sparkles,
  Database,
  BookOpen,
  Activity,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendOnline }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'matcher', label: 'House Matcher', icon: Sparkles, highlight: true },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'correlation', label: 'Covariance & Corr', icon: GitCompare },
    { id: 'probability', label: 'Probability & Exp', icon: PieChart },
    { id: 'bayes', label: 'Bayes Theorem', icon: BrainCircuit },
    { id: 'polynomial', label: 'Polynomial Model', icon: TrendingUp },
    { id: 'dataset', label: 'Dataset', icon: Database },
    { id: 'syllabus', label: 'Syllabus Mapping', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-750">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan p-0.5 shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                  FirstNest
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  ML Unit-1
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Smart House Budget & Requirement Analyzer</p>
            </div>
          </div>


          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30'
                        : 'bg-dark-750 text-white border border-dark-600'
                      : item.highlight
                      ? 'text-brand-300 hover:text-white hover:bg-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                backendOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="text-[11px] hidden sm:inline">
                {backendOnline ? 'FastAPI Live' : 'Backend Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile / Scrollable Navigation Bar */}
        <div className="lg:hidden flex items-center space-x-1 py-2 overflow-x-auto no-scrollbar border-t border-dark-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-dark-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
