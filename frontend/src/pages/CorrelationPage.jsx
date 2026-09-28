import React, { useState, useEffect } from 'react';
import { GitCompare, TrendingUp, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function CorrelationPage() {
  const [corrData, setCorrData] = useState(null);
  const [covData, setCovData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('correlation'); // 'correlation' | 'covariance'

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [corr, cov] = await Promise.all([
          api.getCorrelation(),
          api.getCovariance(),
        ]);
        setCorrData(corr);
        setCovData(cov);
      } catch (err) {
        setError(err.message || 'Failed to load correlation data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getHeatmapColor = (val) => {
    // Value is between -1 and +1
    if (val === 1) return 'bg-brand-600 text-white font-bold';
    if (val >= 0.7) return 'bg-indigo-600/90 text-white font-semibold';
    if (val >= 0.5) return 'bg-indigo-600/60 text-white';
    if (val >= 0.3) return 'bg-indigo-600/35 text-slate-200';
    if (val >= 0.1) return 'bg-indigo-600/20 text-slate-300';
    if (val > -0.1) return 'bg-dark-800 text-slate-400';
    if (val > -0.3) return 'bg-rose-500/20 text-rose-300';
    return 'bg-rose-500/50 text-white';
  };

  const formatFeatureName = (feat) => {
    const map = {
      'Price': 'Price',
      'living area': 'Living Area',
      'lot area': 'Lot Area',
      'number of bedrooms': 'Bedrooms',
      'number of bathrooms': 'Bathrooms',
      'grade of the house': 'Grade',
      'condition of the house': 'Condition',
      'Distance from the airport': 'Airport Dist',
    };
    return map[feat] || feat;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-dark-850 p-6 rounded-2xl border border-dark-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Core Module 3 — Bivariate Association & Joint Dispersion</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Covariance & Pearson Correlation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Measuring directional co-movement Cov(X, Y) and scale-invariant linear correlation r ∈ [-1, +1].
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-dark-900 p-1 rounded-xl border border-dark-700">
          <button
            onClick={() => setActiveTab('correlation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'correlation' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Correlation Matrix
          </button>
          <button
            onClick={() => setActiveTab('covariance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'covariance' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Covariance Matrix
          </button>
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

      {!loading && corrData && covData && (
        <>
          {/* Key Relationships Cards */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-white">Target Housing Associations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {corrData.key_pairs.map((pair, idx) => (
                <div key={idx} className="bg-dark-850 border border-dark-750 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {formatFeatureName(pair.feature_x)} ↔ {formatFeatureName(pair.feature_y)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        pair.strength === 'Strong'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : pair.strength === 'Moderate'
                          ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                          : 'bg-slate-700/50 text-slate-300 border-slate-600'
                      }`}
                    >
                      {pair.relationship}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-dark-750/70">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pearson (r)</span>
                      <span className="font-mono text-sm font-bold text-accent-cyan">{pair.correlation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Covariance</span>
                      <span className="font-mono text-sm font-bold text-slate-200" title={pair.covariance.toLocaleString()}>
                        {Math.abs(pair.covariance) > 1e6
                          ? `${(pair.covariance / 1e6).toFixed(1)}M`
                          : pair.covariance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {pair.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap / Matrix Display */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {activeTab === 'correlation' ? 'Pearson Correlation Matrix (Heatmap)' : 'Sample Covariance Matrix'}
                </h2>
                <p className="text-xs text-slate-400">
                  {activeTab === 'correlation'
                    ? 'Normalized linear dependency coefficient bounded between -1.0 and +1.0'
                    : 'Unstandardized joint variation: Cov(X, Y) = (1/(N-1)) Σ (X_i - μ_X)(Y_i - μ_Y)'}
                </p>
              </div>

              {/* Legend for correlation */}
              {activeTab === 'correlation' && (
                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <span>-1.0</span>
                  <span className="w-4 h-3 bg-rose-500/60 rounded-xs" />
                  <span className="w-4 h-3 bg-dark-800 rounded-xs" />
                  <span className="w-4 h-3 bg-indigo-600/35 rounded-xs" />
                  <span className="w-4 h-3 bg-indigo-600 rounded-xs" />
                  <span>+1.0</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-xs font-semibold text-slate-400 bg-dark-900/60">Features</th>
                    {(activeTab === 'correlation' ? corrData.features : covData.features).map((feat) => (
                      <th key={feat} className="p-2 text-[11px] font-semibold text-slate-300 bg-dark-900/40">
                        {formatFeatureName(feat)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'correlation' ? corrData.features : covData.features).map((rowFeat, rowIdx) => (
                    <tr key={rowFeat} className="border-t border-dark-750">
                      <td className="p-2 text-left text-[11px] font-medium text-slate-200 bg-dark-900/40 whitespace-nowrap">
                        {formatFeatureName(rowFeat)}
                      </td>
                      {(activeTab === 'correlation' ? corrData.matrix[rowIdx] : covData.matrix[rowIdx]).map((val, colIdx) => (
                        <td
                          key={colIdx}
                          className={`p-2 text-[11px] font-mono transition-colors ${
                            activeTab === 'correlation' ? getHeatmapColor(val) : 'bg-dark-800/40 text-slate-200'
                          }`}
                        >
                          {activeTab === 'correlation'
                            ? val.toFixed(2)
                            : Math.abs(val) > 1e6
                            ? `${(val / 1e6).toFixed(1)}M`
                            : val.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Formula & Theoretical Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-xl space-y-2">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Covariance vs Correlation Definition
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Covariance:</strong> Quantifies whether higher values of one variable correspond to higher values of another.
                However, its magnitude is scale-dependent (multiplying living area by 100 multiplies covariance by 100).
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Correlation (r):</strong> Standardizes covariance by dividing by the product of both variables' standard deviations:
                <span className="block font-mono text-[11px] text-accent-cyan mt-1 bg-dark-900 p-2 rounded border border-dark-750">
                  r_xy = Cov(X, Y) / (s_X · s_Y)
                </span>
                This removes measurement units, producing a pure dimensionless metric bounded between -1.0 and +1.0.
              </p>
            </div>

            <div className="bg-dark-850 border border-dark-750 p-5 rounded-xl space-y-2">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Practical Housing Takeaway
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-accent-cyan font-bold">Living area (r = 0.71)</span> and <span className="text-brand-300 font-bold">construction grade (r = 0.67)</span> are the two strongest linear predictors of price in this dataset.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conversely, <span className="text-slate-400">Distance to Airport (r = 0.01)</span> shows almost zero linear correlation, meaning proximity to the airport does not systematically elevate or depress house prices across these regions.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
