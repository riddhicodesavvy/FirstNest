import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  HelpCircle,
  Calculator,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '../services/api';

export default function PolynomialPage() {
  const [degree, setDegree] = useState(2);
  const [modelData, setModelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prediction state
  const [inputSqft, setInputSqft] = useState(2000);
  const [prediction, setPrediction] = useState(null);
  const [predLoading, setPredLoading] = useState(false);

  // Train and fetch models
  const fetchPolynomial = async (deg) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.trainPolynomial(deg, 0.2);
      setModelData(res);
      // Run initial prediction
      const pred = await api.predictPolynomial(inputSqft, deg);
      setPrediction(pred);
    } catch (err) {
      setError(err.message || 'Failed to train polynomial regression models');
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e?.preventDefault();
    if (!inputSqft || inputSqft <= 0) return;
    try {
      setPredLoading(true);
      const pred = await api.predictPolynomial(Number(inputSqft), degree);
      setPrediction(pred);
    } catch (err) {
      console.error(err);
    } finally {
      setPredLoading(false);
    }
  };

  useEffect(() => {
    fetchPolynomial(degree);
  }, [degree]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-dark-850 p-6 rounded-2xl border border-dark-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Core Module 8 — Unit 1 Supervised Learning Foundation</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Polynomial Curve Fitting (Area → Price)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervised non-linear regression with strict 80/20 train/test split. Comparing Linear, Quadratic, and Cubic functions.
          </p>
        </div>

        {/* Degree Selection Buttons */}
        <div className="flex bg-dark-900 p-1 rounded-xl border border-dark-700">
          {[1, 2, 3].map((d) => (
            <button
              key={d}
              onClick={() => setDegree(d)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                degree === d
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Degree {d} {d === 1 ? '(Linear)' : d === 2 ? '(Quadratic)' : '(Cubic)'}
            </button>
          ))}
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

      {!loading && modelData && (
        <>
          {/* Active Model Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                Test Set R² Score
              </span>
              <div className="text-2xl font-bold text-accent-cyan mt-1 font-mono">
                {modelData.selected_model.r2_test.toFixed(4)}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Train R²: {modelData.selected_model.r2_train.toFixed(4)}
              </p>
            </div>

            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                Test RMSE (₹)
              </span>
              <div className="text-2xl font-bold text-accent-amber mt-1 font-mono">
                ₹{Number(modelData.selected_model.rmse_test).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Train RMSE: ₹{Number(modelData.selected_model.rmse_train).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                Test MSE (₹²)
              </span>
              <div className="text-2xl font-bold text-slate-200 mt-1 font-mono truncate" title={modelData.selected_model.mse_test.toLocaleString()}>
                {(modelData.selected_model.mse_test / 1e9).toFixed(2)}B
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Mean Squared Error</p>
            </div>

            <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                Splitting Protocol
              </span>
              <div className="text-xl font-bold text-emerald-400 mt-1">
                80% / 20%
              </div>
              <p className="text-[10px] text-slate-400 mt-1">11,695 Train / 2,924 Test</p>
            </div>
          </div>

          {/* Fitted Equation Banner */}
          <div className="bg-gradient-to-r from-dark-900 to-dark-850 border border-brand-500/30 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider block">
              Fitted Degree {degree} Regression Equation:
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-white bg-dark-950/80 p-3 rounded-xl border border-dark-750 overflow-x-auto">
              {modelData.selected_model.equation}
            </div>
            <p className="text-xs text-slate-400">
              Coefficients learned via Ordinary Least Squares (OLS) minimization on training partition exclusively.
            </p>
          </div>

          {/* Interactive Scatter Plot & Fitted Curve */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Scatter Plot & Fitted Polynomial Curve</h3>
                <p className="text-xs text-slate-400">
                  Data points sample (circles) with Degree {degree} regression line (solid curve)
                </p>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart>
                  <XAxis
                    dataKey="living_area"
                    type="number"
                    domain={[0, 8000]}
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `${v} sqft`}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111722', borderColor: '#26344d', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val, name) => [
                      `₹${Number(val).toLocaleString()}`,
                      name === 'price' ? 'Actual House' : 'Fitted Polynomial'
                    ]}
                    labelFormatter={(v) => `Living Area: ${v} sqft`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  {/* Scatter actual houses */}
                  <Scatter
                    name="Actual Properties"
                    data={modelData.scatter_sample}
                    dataKey="price"
                    fill="#818cf8"
                    opacity={0.5}
                  />
                  {/* Polynomial Curve line */}
                  <Line
                    type="monotone"
                    name={`Degree ${degree} Curve`}
                    data={modelData.curve_points}
                    dataKey="price_pred"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Model Comparison Table */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-semibold text-white">Degrees 1, 2, and 3 Performance Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark-750 text-slate-400 bg-dark-900/60">
                    <th className="py-2.5 px-3">Polynomial Model</th>
                    <th className="py-2.5 px-3">Train R²</th>
                    <th className="py-2.5 px-3">Test R²</th>
                    <th className="py-2.5 px-3">Test RMSE</th>
                    <th className="py-2.5 px-3">Test MSE</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-750">
                  {modelData.all_degrees_comparison.map((m) => (
                    <tr
                      key={m.degree}
                      onClick={() => setDegree(m.degree)}
                      className={`hover:bg-dark-750/40 cursor-pointer transition-colors ${
                        m.degree === degree ? 'bg-brand-500/10' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-white flex items-center space-x-2">
                        {m.degree === degree && <span className="w-2 h-2 rounded-full bg-brand-400" />}
                        <span>
                          Degree {m.degree} {m.degree === 1 ? '(Linear)' : m.degree === 2 ? '(Quadratic)' : '(Cubic)'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">{m.r2_train.toFixed(4)}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-accent-cyan">{m.r2_test.toFixed(4)}</td>
                      <td className="py-2.5 px-3 font-mono text-accent-amber">₹{Number(m.rmse_test).toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{(m.mse_test / 1e9).toFixed(2)}B</td>
                      <td className="py-2.5 px-3">
                        {m.degree === degree ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Click to inspect</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Price Estimation Tool */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 text-brand-400">
              <Calculator className="w-4 h-4" />
              <h3 className="text-base font-semibold text-white">
                Live Price Estimation from Living Area (sqft)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Enter any living area to compute the model's estimated market price using the trained Degree {degree} polynomial.
            </p>

            <form onSubmit={handlePredict} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={inputSqft}
                  onChange={(e) => setInputSqft(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full bg-dark-900 border border-dark-650 text-white text-sm rounded-xl px-4 py-2.5 focus:border-brand-500 focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">sqft</span>
              </div>
              <button
                type="submit"
                disabled={predLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{predLoading ? 'Estimating...' : 'Calculate Estimate'}</span>
              </button>
            </form>

            {prediction && (
              <div className="bg-dark-900/80 p-5 rounded-xl border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Polynomial Model Market Estimate:</span>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    ₹{Number(prediction.predicted_price).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">
                    Living Area: {prediction.living_area.toLocaleString()} sqft &bull; Degree {prediction.degree} Model
                  </p>
                </div>
                <div className="text-xs text-slate-400 bg-dark-850 p-3 rounded-lg border border-dark-750 max-w-sm">
                  <span className="font-semibold text-slate-200">Formula Application:</span><br/>
                  Evaluated using: <span className="font-mono text-[10px] text-brand-300">{prediction.equation}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
