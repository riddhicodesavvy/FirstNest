import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  BarChart3,
  Layers,
  HelpCircle,
  AlertTriangle,
  ArrowUpDown,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';

const AVAILABLE_FEATURES = [
  { id: 'Price', label: 'Price (₹)' },
  { id: 'living area', label: 'Living Area (sqft)' },
  { id: 'lot area', label: 'Lot Area (sqft)' },
  { id: 'number of bedrooms', label: 'Bedrooms' },
  { id: 'number of bathrooms', label: 'Bathrooms' },
  { id: 'grade of the house', label: 'Construction Grade (1-13)' },
  { id: 'condition of the house', label: 'Condition (1-5)' },
  { id: 'Distance from the airport', label: 'Airport Distance (km)' },
];

export default function StatisticsPage() {
  const [selectedFeature, setSelectedFeature] = useState('Price');
  const [stats, setStats] = useState(null);
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);
        const [featureData, allData] = await Promise.all([
          api.getFeatureStatistics(selectedFeature),
          api.getAllStatistics(),
        ]);
        setStats(featureData);
        setAllStats(allData.features || []);
      } catch (err) {
        setError(err.message || 'Failed to load statistical metrics');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [selectedFeature]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Feature Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-850 p-6 rounded-2xl border border-dark-750">
        <div>
          <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Core Module 2 — Unit 1 Statistical Foundations</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Descriptive Statistics & Quantiles</h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical calculation of central tendency, dispersion, quantiles, and distribution anomalies.
          </p>
        </div>

        {/* Feature Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-300 font-medium whitespace-nowrap">Select Feature:</label>
          <select
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="bg-dark-900 border border-dark-650 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500 transition-colors"
          >
            {AVAILABLE_FEATURES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {!loading && stats && (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Mean */}
            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Mean (μ)</span>
              <div className="text-xl font-bold text-white mt-1">
                {selectedFeature === 'Price' ? `₹${Number(stats.mean).toLocaleString()}` : stats.mean.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Sum / Count</p>
            </div>

            {/* Median */}
            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Median (Q2)</span>
              <div className="text-xl font-bold text-accent-cyan mt-1">
                {selectedFeature === 'Price' ? `₹${Number(stats.median).toLocaleString()}` : stats.median.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">50th Percentile</p>
            </div>

            {/* Mode */}
            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Mode</span>
              <div className="text-xl font-bold text-white mt-1">
                {selectedFeature === 'Price' ? `₹${Number(stats.mode).toLocaleString()}` : stats.mode.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Most Frequent</p>
            </div>

            {/* Variance */}
            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Variance (s²)</span>
              <div className="text-xl font-bold text-white mt-1 truncate" title={stats.variance.toLocaleString()}>
                {stats.variance > 1e6 ? `${(stats.variance / 1e6).toFixed(1)}M` : stats.variance.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Sample (ddof=1)</p>
            </div>

            {/* Std Dev */}
            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Std Dev (s)</span>
              <div className="text-xl font-bold text-accent-amber mt-1">
                {selectedFeature === 'Price' ? `₹${Number(stats.std_dev).toLocaleString()}` : stats.std_dev.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Dispersion Spread</p>
            </div>

            {/* IQR */}
            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">IQR (Q3 - Q1)</span>
              <div className="text-xl font-bold text-brand-300 mt-1">
                {selectedFeature === 'Price' ? `₹${Number(stats.iqr).toLocaleString()}` : stats.iqr.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Middle 50% Spread</p>
            </div>
          </div>

          {/* Secondary Details: Quantiles & Tukey Fences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quantiles breakdown */}
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-400" />
                <span>Five-Number Quantile Summary</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Minimum:</span>
                  <span className="font-mono text-white">{selectedFeature === 'Price' ? `₹${stats.min.toLocaleString()}` : stats.min}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Q1 (25th Percentile):</span>
                  <span className="font-mono text-white">{selectedFeature === 'Price' ? `₹${stats.q1.toLocaleString()}` : stats.q1}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Q2 (Median / 50th):</span>
                  <span className="font-mono text-accent-cyan font-bold">{selectedFeature === 'Price' ? `₹${stats.q2.toLocaleString()}` : stats.q2}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Q3 (75th Percentile):</span>
                  <span className="font-mono text-white">{selectedFeature === 'Price' ? `₹${stats.q3.toLocaleString()}` : stats.q3}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Maximum:</span>
                  <span className="font-mono text-white">{selectedFeature === 'Price' ? `₹${stats.max.toLocaleString()}` : stats.max}</span>
                </div>
              </div>
            </div>

            {/* Outliers & Tukey's Fences */}
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-accent-amber" />
                <span>Tukey Outlier Analysis (1.5 × IQR)</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Lower Fence [Q1 - 1.5·IQR]:</span>
                  <span className="font-mono text-slate-300">{stats.boxplot.lower_fence.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Upper Fence [Q3 + 1.5·IQR]:</span>
                  <span className="font-mono text-slate-300">{stats.boxplot.upper_fence.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Detected Outliers Count:</span>
                  <span className="font-mono text-accent-amber font-bold">{stats.outliers_count.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Outlier Percentage:</span>
                  <span className="font-mono text-accent-amber">
                    {((stats.outliers_count / stats.count) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Skewness Interpretation */}
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-accent-cyan" />
                <span>Shape & Skewness Insight</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {stats.mean > stats.median * 1.05 ? (
                  <>
                    <strong className="text-accent-amber">Positive (Right) Skew: </strong>
                    Mean ({stats.mean.toLocaleString()}) is noticeably higher than Median ({stats.median.toLocaleString()}).
                    This occurs because high-value extreme properties pull the arithmetic mean upward.
                  </>
                ) : stats.mean < stats.median * 0.95 ? (
                  <>
                    <strong className="text-accent-cyan">Negative (Left) Skew: </strong>
                    Mean ({stats.mean.toLocaleString()}) is lower than Median ({stats.median.toLocaleString()}).
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-400">Symmetric Distribution: </strong>
                    Mean ({stats.mean.toLocaleString()}) and Median ({stats.median.toLocaleString()}) are virtually identical, indicating balanced dispersion.
                  </>
                )}
              </p>
              <div className="pt-1 text-[11px] text-slate-400 bg-dark-900/60 p-2.5 rounded-lg border border-dark-750">
                Formula verified on all {stats.count.toLocaleString()} valid dataset rows.
              </div>
            </div>
          </div>

          {/* Histogram Chart */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Frequency Histogram for {stats.display_name}</h3>
                <p className="text-xs text-slate-400">Dynamic empirical bin counts</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.histogram}>
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111722', borderColor: '#26344d', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Observations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* All Features Summary Table */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-semibold text-white">All Key Numerical Features Comparison Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-dark-750 text-slate-400 bg-dark-900/50">
                    <th className="py-2.5 px-3 font-semibold">Feature</th>
                    <th className="py-2.5 px-3 font-semibold">Mean</th>
                    <th className="py-2.5 px-3 font-semibold">Median</th>
                    <th className="py-2.5 px-3 font-semibold">Std Dev</th>
                    <th className="py-2.5 px-3 font-semibold">Min</th>
                    <th className="py-2.5 px-3 font-semibold">Max</th>
                    <th className="py-2.5 px-3 font-semibold">IQR</th>
                    <th className="py-2.5 px-3 font-semibold">Outliers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-750">
                  {allStats.map((item) => (
                    <tr
                      key={item.feature}
                      onClick={() => setSelectedFeature(item.feature)}
                      className={`hover:bg-dark-750/50 cursor-pointer transition-colors ${
                        item.feature === selectedFeature ? 'bg-brand-500/10' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-medium text-white flex items-center space-x-1.5">
                        {item.feature === selectedFeature && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                        <span>{item.display_name}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {item.feature === 'Price' ? `₹${item.mean.toLocaleString()}` : item.mean.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-accent-cyan">
                        {item.feature === 'Price' ? `₹${item.median.toLocaleString()}` : item.median.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {item.feature === 'Price' ? `₹${item.std_dev.toLocaleString()}` : item.std_dev.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{item.min}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{item.max.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-brand-300">{item.iqr.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-accent-amber">{item.outliers_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
