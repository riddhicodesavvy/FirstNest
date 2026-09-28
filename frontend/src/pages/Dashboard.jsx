import React, { useState, useEffect } from 'react';
import {
  Building2,
  IndianRupee,
  Maximize2,
  BedDouble,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart2,
  PieChart,
  BrainCircuit,
  Database,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { api } from '../services/api';

export default function Dashboard({ setActiveTab }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [priceStats, setPriceStats] = useState(null);
  const [areaStats, setAreaStats] = useState(null);
  const [corrData, setCorrData] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [summary, pStats, aStats, corr] = await Promise.all([
          api.getDatasetSummary(),
          api.getFeatureStatistics('Price'),
          api.getFeatureStatistics('living area'),
          api.getCorrelation(),
        ]);
        setStats(summary);
        setPriceStats(pStats);
        setAreaStats(aStats);
        setCorrData(corr);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading dataset statistics & mathematical models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-850 via-dark-900 to-brand-950/40 border border-dark-750 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unit-1 Machine Learning Academic Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            FirstNest — Smart House Budget & Requirement Analyzer
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A comprehensive, rigorous analytics application exploring the <span className="text-white font-medium">House Price India</span> dataset (14,619 properties) with all valuations in <span className="text-emerald-400 font-semibold">Indian Rupees (₹)</span>.
            Calculates empirical descriptive statistics, covariance & Pearson correlation, conditional probability, Bayes' theorem verification,
            and polynomial curve fitting with multi-objective house matching.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('matcher')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Find Your Ideal House</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-200 border border-dark-600 font-medium text-sm transition-all"
            >
              <span>Explore Statistics</span>
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 border border-dark-700 font-medium text-sm transition-all"
            >
              <span>Unit 1 Syllabus Mapping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl shadow-sm hover:border-dark-600 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Properties</span>
            <Building2 className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.clean_row_count ? Number(stats.clean_row_count).toLocaleString() : '14,619'}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 inline mr-1" />
            0 Missing Values
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl shadow-sm hover:border-dark-600 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Average Price (₹)</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{priceStats?.mean ? Number(priceStats.mean).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '538,806'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Std Dev: ₹{priceStats?.std_dev ? Number(priceStats.std_dev).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '367,229'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl shadow-sm hover:border-dark-600 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Median Price (₹)</span>
            <IndianRupee className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{priceStats?.median ? Number(priceStats.median).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '450,000'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            IQR: ₹{priceStats?.iqr ? Number(priceStats.iqr).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '325,000'}
          </p>
        </div>


        {/* Metric 4 */}
        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl shadow-sm hover:border-dark-600 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Avg Living Area</span>
            <Maximize2 className="w-4 h-4 text-accent-amber" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {areaStats?.mean ? Number(areaStats.mean).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '2,098'} sqft
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Median: {areaStats?.median ? Number(areaStats.median).toLocaleString() : '1,930'} sqft
          </p>
        </div>

        {/* Metric 5 */}
        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl shadow-sm hover:border-dark-600 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Avg Bedrooms</span>
            <BedDouble className="w-4 h-4 text-accent-purple" />
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            3.38
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Mode: 3 Bedrooms
          </p>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Distribution Histogram */}
        <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">House Price Empirical Distribution</h2>
              <p className="text-xs text-slate-400">Histogram across 18 computed frequency intervals</p>
            </div>
            <button
              onClick={() => setActiveTab('statistics')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1"
            >
              <span>View Full Stats</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceStats?.histogram || []}>
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111722', borderColor: '#26344d', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Properties" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 bg-dark-900/60 p-3 rounded-lg border border-dark-750">
            <span className="font-semibold text-slate-200">Statistical Observation: </span>
            Distribution exhibits strong right-skewness (Mean ₹538k &gt; Median ₹450k), driven by higher-priced properties up to ₹7.7M.
          </div>

        </div>

        {/* Living Area Distribution */}
        <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Living Area Distribution (sqft)</h2>
              <p className="text-xs text-slate-400">Frequency distribution of square footage</p>
            </div>
            <button
              onClick={() => setActiveTab('polynomial')}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center space-x-1"
            >
              <span>Curve Fitting</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaStats?.histogram || []}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111722', borderColor: '#26344d', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" fillOpacity={1} fill="url(#areaGradient)" name="Properties" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 bg-dark-900/60 p-3 rounded-lg border border-dark-750">
            <span className="font-semibold text-slate-200">Predictive Impact: </span>
            Living area has a Pearson correlation of <span className="text-accent-cyan font-bold">r = 0.71</span> with Price, making it the primary feature for Polynomial Curve Fitting.
          </div>
        </div>
      </div>

      {/* Core Unit-1 Modules Showcase */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Machine Learning Unit-1 Syllabus Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab('statistics')}
            className="p-5 rounded-xl bg-dark-850 border border-dark-750 hover:border-brand-500/40 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">Descriptive Statistics & IQR</h3>
            <p className="text-xs text-slate-400 mt-1">
              Computes Mean, Median, Mode, Sample Variance, Standard Deviation, Quantiles (Q1, Q2, Q3), and Tukey Outliers.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab('correlation')}
            className="p-5 rounded-xl bg-dark-850 border border-dark-750 hover:border-brand-500/40 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">Covariance & Correlation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates joint variability Cov(X, Y) and Pearson r matrices with an interactive heatmap and mathematical explanations.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab('probability')}
            className="p-5 rounded-xl bg-dark-850 border border-dark-750 hover:border-brand-500/40 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">Probability & Expectation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct empirical probabilities, multi-condition filtering, conditional probability P(A|B), and E[X] = Σ x·P(x).
            </p>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => setActiveTab('bayes')}
            className="p-5 rounded-xl bg-dark-850 border border-dark-750 hover:border-brand-500/40 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">Bayes' Theorem Laboratory</h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculates Prior, Likelihood, Evidence, and Posterior; empirically verifies Bayes formula vs direct dataset count.
            </p>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => setActiveTab('polynomial')}
            className="p-5 rounded-xl bg-dark-850 border border-dark-750 hover:border-brand-500/40 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">Polynomial Curve Fitting</h3>
            <p className="text-xs text-slate-400 mt-1">
              Fits Degrees 1, 2, and 3 regression curves on 80/20 train-test splits; evaluates MSE, RMSE, and R² scores.
            </p>
          </div>

          {/* Card 6 */}
          <div
            onClick={() => setActiveTab('matcher')}
            className="p-5 rounded-xl bg-gradient-to-br from-brand-900/30 to-indigo-900/20 border border-brand-500/30 hover:border-brand-400 transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-brand-300">House Matcher & Budget Gap</h3>
            <p className="text-xs text-slate-300 mt-1">
              Multi-criteria heuristic matching, budget gap analysis, dataset affordability distribution, and dynamic reasoning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
