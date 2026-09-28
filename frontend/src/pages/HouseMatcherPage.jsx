import React, { useState } from 'react';
import {
  Sparkles,
  IndianRupee,
  Maximize2,
  BedDouble,
  Bath,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sliders,
  HelpCircle,
  Building,
  Award,
  Calendar,
  Plane,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '../services/api';

export default function HouseMatcherPage() {
  // Input requirements state
  const [budget, setBudget] = useState(500000);
  const [livingArea, setLivingArea] = useState(2000);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);

  // Optional filters
  const [showFilters, setShowFilters] = useState(false);
  const [minGrade, setMinGrade] = useState('');
  const [minCondition, setMinCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Configurable weights
  const [showWeights, setShowWeights] = useState(false);
  const [wArea, setWArea] = useState(0.40);
  const [wBudget, setWBudget] = useState(0.30);
  const [wBed, setWBed] = useState(0.15);
  const [wBath, setWBath] = useState(0.15);

  // Result state
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload = {
        budget: Number(budget),
        living_area: Number(livingArea),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        weight_area: Number(wArea),
        weight_budget: Number(wBudget),
        weight_bedroom: Number(wBed),
        weight_bathroom: Number(wBath),
      };
      if (minGrade) payload.min_grade = Number(minGrade);
      if (minCondition) payload.min_condition = Number(minCondition);
      if (maxPrice) payload.max_price = Number(maxPrice);

      const res = await api.matchHouses(payload);
      setMatchResult(res);
    } catch (err) {
      setError(err.message || 'Failed to match properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-dark-850 p-6 rounded-2xl border border-dark-750">
        <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Modules 9, 10, 11, 12 — Multi-Objective Housing Analyzer</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Smart House Requirement & Budget Matcher</h1>
        <p className="text-xs text-slate-400 mt-1">
          Ranks 14,619 actual properties against your budget and spatial criteria using transparent normalized similarity distance.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Budget */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your Budget (₹)</span>
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              step="10000"
              min="50000"
              required
              className="w-full bg-dark-900 border border-dark-650 text-white text-sm font-mono rounded-xl px-3.5 py-2.5 focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">e.g. ₹500,000</span>
          </div>

          {/* Living Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Required Living Area (sqft)</span>
            </label>
            <input
              type="number"
              value={livingArea}
              onChange={(e) => setLivingArea(e.target.value)}
              step="50"
              min="300"
              required
              className="w-full bg-dark-900 border border-dark-650 text-white text-sm font-mono rounded-xl px-3.5 py-2.5 focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">e.g. 2,000 sqft</span>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <BedDouble className="w-3.5 h-3.5 text-brand-400" />
              <span>Bedrooms</span>
            </label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              step="1"
              min="1"
              max="15"
              required
              className="w-full bg-dark-900 border border-dark-650 text-white text-sm font-mono rounded-xl px-3.5 py-2.5 focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">e.g. 3</span>
          </div>

          {/* Bathrooms */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Bath className="w-3.5 h-3.5 text-accent-purple" />
              <span>Bathrooms</span>
            </label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              step="0.25"
              min="0.5"
              max="10"
              required
              className="w-full bg-dark-900 border border-dark-650 text-white text-sm font-mono rounded-xl px-3.5 py-2.5 focus:border-brand-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">e.g. 2 or 2.5</span>
          </div>
        </div>

        {/* Collapsible Configurable Weights & Filters */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-dark-750">
          <button
            type="button"
            onClick={() => setShowWeights(!showWeights)}
            className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Configure Matching Weights (Area, Budget, Beds, Baths)</span>
            {showWeights ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
          >
            <span>Optional Quality Filters</span>
            {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Weights Controls */}
        {showWeights && (
          <div className="bg-dark-900/60 p-4 rounded-xl border border-dark-750 space-y-3">
            <span className="text-xs font-bold text-slate-300 block">Configurable Objective Weighting:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Living Area ({Math.round(wArea * 100)}%)</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.80"
                  step="0.05"
                  value={wArea}
                  onChange={(e) => setWArea(parseFloat(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Budget ({Math.round(wBudget * 100)}%)</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.80"
                  step="0.05"
                  value={wBudget}
                  onChange={(e) => setWBudget(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Bedrooms ({Math.round(wBed * 100)}%)</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  value={wBed}
                  onChange={(e) => setWBed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Bathrooms ({Math.round(wBath * 100)}%)</label>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  value={wBath}
                  onChange={(e) => setWBath(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Weights are automatically normalized to sum to 100% in the matching algorithm.
            </p>
          </div>
        )}

        {/* Optional Filters Controls */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-dark-900/60 p-4 rounded-xl border border-dark-750">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Min Grade (1-13)</label>
              <input
                type="number"
                placeholder="e.g. 7"
                min="1"
                max="13"
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Min Condition (1-5)</label>
              <input
                type="number"
                placeholder="e.g. 3"
                min="1"
                max="5"
                value={minCondition}
                onChange={(e) => setMinCondition(e.target.value)}
                className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Max Ceiling Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 600000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2 font-mono"
              />
            </div>
          </div>
        )}

        {/* Submit CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan hover:from-brand-500 hover:to-accent-cyan text-white font-bold text-sm shadow-xl shadow-brand-500/20 transition-all flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Analyzing 14,619 Properties...' : 'Find My Best Match'}</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {matchResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Comparison: Requirements vs Polynomial Estimate vs Best Match */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: User Requirements */}
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                1. Your Requirements
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Budget:</span>
                  <span className="font-mono text-white font-bold">₹{Number(budget).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Living Area:</span>
                  <span className="font-mono text-white font-bold">{Number(livingArea).toLocaleString()} sqft</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dark-750">
                  <span className="text-slate-400">Bedrooms:</span>
                  <span className="font-mono text-white font-bold">{bedrooms}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Bathrooms:</span>
                  <span className="font-mono text-white font-bold">{bathrooms}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Polynomial Model Market Estimate */}
            <div className="bg-dark-850 border border-brand-500/30 p-5 rounded-2xl space-y-3 bg-brand-500/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                2. Polynomial Model Market Estimate
              </span>
              <div className="text-2xl font-mono font-extrabold text-white">
                ₹{Number(matchResult.polynomial_estimate.predicted_price).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Supervised quadratic regression estimate for <strong className="text-white">{livingArea} sqft</strong>.
              </p>
              <div className="pt-2 text-[11px] border-t border-dark-750 flex justify-between">
                <span className="text-slate-400">Vs Your Budget:</span>
                <span className={`font-mono font-bold ${
                  budget >= matchResult.polynomial_estimate.predicted_price ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {budget >= matchResult.polynomial_estimate.predicted_price
                    ? `+₹${(budget - matchResult.polynomial_estimate.predicted_price).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    : `-₹${(matchResult.polynomial_estimate.predicted_price - budget).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                </span>
              </div>
            </div>

            {/* Card 3: Best Match Property Overview */}
            <div className="bg-dark-850 border border-emerald-500/30 p-5 rounded-2xl space-y-3 bg-emerald-500/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  3. Best Matched Property
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {matchResult.best_match.match_score}% Match
                </span>
              </div>
              <div className="text-2xl font-mono font-extrabold text-white">
                ₹{Number(matchResult.best_match.price).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-300">
                {matchResult.best_match.living_area.toLocaleString()} sqft &bull; {matchResult.best_match.bedrooms} beds &bull; {matchResult.best_match.bathrooms} baths
              </p>
              <div className="pt-2 text-[11px] border-t border-dark-750 flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-bold ${matchResult.budget_gap.is_within_budget ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {matchResult.budget_gap.status}
                </span>
              </div>
            </div>
          </div>

          {/* Budget Gap Analysis Banner */}
          <div className={`p-5 rounded-2xl border ${
            matchResult.budget_gap.is_within_budget
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {matchResult.budget_gap.is_within_budget ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                  )}
                  <h3 className="text-base font-bold text-white">
                    {matchResult.budget_gap.is_within_budget
                      ? 'Your Budget is Fully Sufficient!'
                      : 'Additional Funding Required'}
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  {matchResult.budget_gap.summary_message}
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {matchResult.budget_gap.is_within_budget ? 'Surplus Reserve' : 'Funding Deficit'}
                </span>
                <div className="text-xl font-mono font-extrabold text-white">
                  ₹{matchResult.budget_gap.difference_amount.toLocaleString()}
                </div>
                <span className="text-[11px] font-mono text-slate-300">
                  {matchResult.budget_gap.difference_pct.toFixed(1)}% of your budget
                </span>
              </div>
            </div>
          </div>

          {/* Why Was This Property Selected? */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-brand-400" />
              <span>Why Was This Property Selected as Best Match? (ID #{matchResult.best_match.id})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated programmatically from actual property dimensions and attributes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
              {matchResult.best_match.why_selected.map((reason, idx) => (
                <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-dark-900/60 border border-dark-750 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Module 11: "What Can I Afford?" Summary */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">What Can You Afford in This Market?</h3>
                <p className="text-xs text-slate-400">
                  Aggregate distribution of houses within your budget of ₹{Number(budget).toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20">
                {matchResult.affordability.percentage_affordable}% Affordable
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-dark-900/60 p-3 rounded-xl border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Affordable Houses</span>
                <span className="text-sm font-mono font-bold text-white">
                  {matchResult.affordability.affordable_houses_count.toLocaleString()} / {matchResult.affordability.total_houses_count.toLocaleString()}
                </span>
              </div>
              <div className="bg-dark-900/60 p-3 rounded-xl border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Median Living Area</span>
                <span className="text-sm font-mono font-bold text-accent-cyan">
                  {matchResult.affordability.median_affordable_area.toLocaleString()} sqft
                </span>
              </div>
              <div className="bg-dark-900/60 p-3 rounded-xl border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Avg Living Area</span>
                <span className="text-sm font-mono font-bold text-white">
                  {matchResult.affordability.average_affordable_area.toLocaleString()} sqft
                </span>
              </div>
              <div className="bg-dark-900/60 p-3 rounded-xl border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Avg Bedrooms</span>
                <span className="text-sm font-mono font-bold text-white">
                  {matchResult.affordability.average_bedrooms}
                </span>
              </div>
              <div className="bg-dark-900/60 p-3 rounded-xl border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Avg Bathrooms</span>
                <span className="text-sm font-mono font-bold text-white">
                  {matchResult.affordability.average_bathrooms}
                </span>
              </div>
              <div className="bg-dark-900/60 p-3 rounded-xl border border-dark-750">
                <span className="text-[10px] text-slate-400 block">Price Range</span>
                <span className="text-xs font-mono font-bold text-emerald-400 truncate block">
                  ₹{(matchResult.affordability.min_price / 1000).toFixed(0)}k - ₹{(matchResult.affordability.max_price / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>

          {/* Top 5 Ranked Matches */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Top 5 Best Matching Properties</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark-750 text-slate-400 bg-dark-900/60">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Living Area</th>
                    <th className="py-2.5 px-3">Beds / Baths</th>
                    <th className="py-2.5 px-3">Grade / Cond</th>
                    <th className="py-2.5 px-3">Airport Dist</th>
                    <th className="py-2.5 px-3">Budget Status</th>
                    <th className="py-2.5 px-3 text-right">Match Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-750">
                  {matchResult.top_5_matches.map((house) => (
                    <tr key={house.id} className="hover:bg-dark-750/30">
                      <td className="py-2.5 px-3 font-bold text-white">
                        <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 inline-flex items-center justify-center text-[10px]">
                          #{house.rank}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white">
                        ₹{house.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {house.living_area.toLocaleString()} sqft
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {house.bedrooms}b / {house.bathrooms}ba
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        Grade {house.grade} &bull; Cond {house.condition}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">
                        {house.airport_distance} km
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          house.is_within_budget
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {house.is_within_budget ? 'Within Budget' : 'Over Budget'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-accent-cyan text-sm">
                        {house.match_score}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Academic Notice */}
            <div className="pt-3 text-[11px] text-slate-400 border-t border-dark-750 flex items-center space-x-2">
              <HelpCircle className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>
                <strong>Methodology: </strong> {matchResult.methodology}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
