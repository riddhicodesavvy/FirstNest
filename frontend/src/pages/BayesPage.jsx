import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
  Calculator,
  ArrowRight,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { api } from '../services/api';

const HYPOTHESIS_PRESETS = [
  { id: 'beds3', label: 'House has 3+ bedrooms', feat: 'number of bedrooms', op: '>=', val: 3 },
  { id: 'beds4', label: 'House has 4+ bedrooms', feat: 'number of bedrooms', op: '>=', val: 4 },
  { id: 'baths2', label: 'House has 2+ bathrooms', feat: 'number of bathrooms', op: '>=', val: 2 },
  { id: 'grade8', label: 'High build grade (Grade >= 8)', feat: 'grade of the house', op: '>=', val: 8 },
  { id: 'area2000', label: 'Living Area > 2,000 sqft', feat: 'living area', op: '>', val: 2000 },
];

const EVIDENCE_PRESETS = [
  { id: 'price500', label: 'Price < ₹500,000', feat: 'Price', op: '<', val: 500000 },
  { id: 'price400', label: 'Price < ₹400,000', feat: 'Price', op: '<', val: 400000 },
  { id: 'price700', label: 'Price < ₹700,000', feat: 'Price', op: '<', val: 700000 },
  { id: 'airport60', label: 'Within 60km of Airport', feat: 'Distance from the airport', op: '<=', val: 60 },
];


export default function BayesPage() {
  const [selectedHypo, setSelectedHypo] = useState('beds3');
  const [selectedEvid, setSelectedEvid] = useState('price500');
  const [bayesResult, setBayesResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const runBayesCalculation = async () => {
    try {
      setLoading(true);
      setError(null);
      const hPreset = HYPOTHESIS_PRESETS.find((h) => h.id === selectedHypo) || HYPOTHESIS_PRESETS[0];
      const ePreset = EVIDENCE_PRESETS.find((e) => e.id === selectedEvid) || EVIDENCE_PRESETS[0];

      const res = await api.calculateBayes(
        { feature: hPreset.feat, operator: hPreset.op, value: hPreset.val },
        { feature: ePreset.feat, operator: ePreset.op, value: ePreset.val }
      );
      setBayesResult(res);
    } catch (err) {
      setError(err.message || 'Failed to compute Bayes Theorem');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runBayesCalculation();
  }, [selectedHypo, selectedEvid]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-dark-850 p-6 rounded-2xl border border-dark-750">
        <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Core Module 6 — Unit 1 Probabilistic Reasoning</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Bayes' Theorem Laboratory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Updating Prior belief P(A) with Likelihood P(B|A) and Evidence P(B) to evaluate Posterior P(A|B).
        </p>
      </div>

      {/* Preset Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-dark-850 border border-dark-750 p-6 rounded-2xl">
        {/* Hypothesis A */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-brand-300 uppercase tracking-wider block">
            Select Hypothesis Event A:
          </label>
          <select
            value={selectedHypo}
            onChange={(e) => setSelectedHypo(e.target.value)}
            className="w-full bg-dark-900 border border-dark-650 text-white text-xs rounded-xl px-3 py-2.5 focus:border-brand-500"
          >
            {HYPOTHESIS_PRESETS.map((h) => (
              <option key={h.id} value={h.id}>{h.label}</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">
            Our hypothesis about property attributes (e.g., number of bedrooms).
          </p>
        </div>

        {/* Evidence B */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-accent-amber uppercase tracking-wider block">
            Select Observed Evidence Event B:
          </label>
          <select
            value={selectedEvid}
            onChange={(e) => setSelectedEvid(e.target.value)}
            className="w-full bg-dark-900 border border-dark-650 text-white text-xs rounded-xl px-3 py-2.5 focus:border-brand-500"
          >
            {EVIDENCE_PRESETS.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">
            The observed condition or budget constraint (e.g., property price under ₹500k).
          </p>

        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {!loading && bayesResult && (
        <>
          {/* Bayes 4 Fundamental Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Term 1: Prior P(A) */}
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">
                1. Prior Probability
              </span>
              <div className="text-sm font-semibold text-white mt-1">P(A)</div>
              <div className="text-2xl font-mono font-extrabold text-white mt-2">
                {(bayesResult.prior_p_a * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {bayesResult.count_a.toLocaleString()} / {bayesResult.total_rows.toLocaleString()} houses
              </p>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-dark-750">
                Initial probability of hypothesis A before observing any evidence.
              </div>
            </div>

            {/* Term 2: Evidence P(B) */}
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[10px] font-bold text-accent-amber uppercase tracking-wider block">
                2. Marginal Evidence
              </span>
              <div className="text-sm font-semibold text-white mt-1">P(B)</div>
              <div className="text-2xl font-mono font-extrabold text-amber-300 mt-2">
                {(bayesResult.evidence_p_b * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {bayesResult.count_b.toLocaleString()} / {bayesResult.total_rows.toLocaleString()} houses
              </p>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-dark-750">
                Overall probability of evidence B across the entire dataset.
              </div>
            </div>

            {/* Term 3: Likelihood P(B|A) */}
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
              <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider block">
                3. Likelihood
              </span>
              <div className="text-sm font-semibold text-white mt-1">P(B | A)</div>
              <div className="text-2xl font-mono font-extrabold text-accent-cyan mt-2">
                {(bayesResult.likelihood_p_b_given_a * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {bayesResult.count_a_and_b.toLocaleString()} / {bayesResult.count_a.toLocaleString()} houses
              </p>
              <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-dark-750">
                Probability of observing evidence B if hypothesis A is known to be true.
              </div>
            </div>

            {/* Term 4: Posterior P(A|B) */}
            <div className="bg-dark-850 border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden bg-emerald-500/5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                4. Posterior Probability
              </span>
              <div className="text-sm font-semibold text-white mt-1">P(A | B)</div>
              <div className="text-2xl font-mono font-extrabold text-emerald-300 mt-2">
                {(bayesResult.bayes_posterior_p_a_given_b * 100).toFixed(2)}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {bayesResult.count_a_and_b.toLocaleString()} / {bayesResult.count_b.toLocaleString()} houses
              </p>
              <div className="text-[10px] text-emerald-400 mt-2 pt-2 border-t border-emerald-500/20 font-medium">
                Updated belief in hypothesis A given the evidence B!
              </div>
            </div>
          </div>

          {/* Mathematical Equivalence Verification Showcase */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Empirical Proof & Equivalence Verification</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparing Direct dataset count filtering against the theoretical Bayes' formula
                </p>
              </div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Exact Match (Δ = {bayesResult.difference.toExponential(2)})</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Direct Calculation */}
              <div className="bg-dark-900/70 p-4 rounded-xl border border-dark-750 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Method 1: Direct Empirical Frequency</span>
                <div className="font-mono text-xs text-slate-400 bg-dark-950 p-3 rounded-lg border border-dark-700">
                  P(A|B) = Count(A ∩ B) / Count(B)<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {bayesResult.count_a_and_b.toLocaleString()} / {bayesResult.count_b.toLocaleString()}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <strong className="text-accent-cyan text-sm">{bayesResult.direct_posterior_p_a_given_b.toFixed(6)}</strong>
                </div>
              </div>

              {/* Bayes Theorem */}
              <div className="bg-dark-900/70 p-4 rounded-xl border border-dark-750 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Method 2: Bayes' Theorem Formula</span>
                <div className="font-mono text-xs text-slate-400 bg-dark-950 p-3 rounded-lg border border-dark-700">
                  P(A|B) = [P(B|A) × P(A)] / P(B)<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= [{bayesResult.likelihood_p_b_given_a.toFixed(4)} × {bayesResult.prior_p_a.toFixed(4)}] / {bayesResult.evidence_p_b.toFixed(4)}<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <strong className="text-emerald-400 text-sm">{bayesResult.bayes_posterior_p_a_given_b.toFixed(6)}</strong>
                </div>
              </div>
            </div>

            {/* Plain English Explanation */}
            <div className="bg-dark-900/50 p-4 rounded-xl border border-dark-750 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Interpretation: </span>
              {bayesResult.explanation}
            </div>
          </div>

          {/* Step-by-Step Breakdown List */}
          <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Step-by-Step Computational Trace
            </h3>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              {Object.entries(bayesResult.formula_steps).map(([k, stepText]) => (
                <div key={k} className="p-2.5 rounded-lg bg-dark-900/60 border border-dark-750">
                  {stepText}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
