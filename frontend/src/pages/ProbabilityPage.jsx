import React, { useState, useEffect } from 'react';
import {
  PieChart,
  HelpCircle,
  Filter,
  ArrowRight,
  Calculator,
  Percent,
  TrendingUp,
  Table,
} from 'lucide-react';
import { api } from '../services/api';

const FEATURE_OPTIONS = [
  { id: 'Price', label: 'Price (₹)', defaultVal: 500000, step: 25000 },
  { id: 'living area', label: 'Living Area (sqft)', defaultVal: 2000, step: 100 },
  { id: 'number of bedrooms', label: 'Bedrooms', defaultVal: 3, step: 1 },
  { id: 'number of bathrooms', label: 'Bathrooms', defaultVal: 2, step: 0.25 },
  { id: 'grade of the house', label: 'Grade (1-13)', defaultVal: 7, step: 1 },
  { id: 'condition of the house', label: 'Condition (1-5)', defaultVal: 3, step: 1 },
];

export default function ProbabilityPage() {
  // Direct Probability State
  const [cond1Feat, setCond1Feat] = useState('Price');
  const [cond1Op, setCond1Op] = useState('<');
  const [cond1Val, setCond1Val] = useState(500000);

  const [useCompound, setUseCompound] = useState(true);
  const [logicOp, setLogicOp] = useState('AND');
  const [cond2Feat, setCond2Feat] = useState('number of bedrooms');
  const [cond2Op, setCond2Op] = useState('>=');
  const [cond2Val, setCond2Val] = useState(3);

  const [probResult, setProbResult] = useState(null);
  const [probLoading, setProbLoading] = useState(false);

  // Conditional Probability State
  const [condAFeat, setCondAFeat] = useState('number of bedrooms');
  const [condAOp, setCondAOp] = useState('>=');
  const [condAVal, setCondAVal] = useState(3);

  const [condBFeat, setCondBFeat] = useState('Price');
  const [condBOp, setCondBOp] = useState('<');
  const [condBVal, setCondBVal] = useState(500000);

  const [condProbResult, setCondProbResult] = useState(null);
  const [condProbLoading, setCondProbLoading] = useState(false);

  // Expectation State
  const [expFeat, setExpFeat] = useState('number of bedrooms');
  const [expResult, setExpResult] = useState(null);
  const [expLoading, setExpLoading] = useState(false);

  // Fetch Direct Probability
  const calculateDirectProbability = async () => {
    try {
      setProbLoading(true);
      const conditions = [{ feature: cond1Feat, operator: cond1Op, value: Number(cond1Val) }];
      if (useCompound) {
        conditions.push({ feature: cond2Feat, operator: cond2Op, value: Number(cond2Val) });
      }
      const res = await api.calculateProbability(conditions, logicOp);
      setProbResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setProbLoading(false);
    }
  };

  // Fetch Conditional Probability
  const calculateConditional = async () => {
    try {
      setCondProbLoading(true);
      const res = await api.calculateConditionalProbability(
        { feature: condAFeat, operator: condAOp, value: Number(condAVal) },
        { feature: condBFeat, operator: condBOp, value: Number(condBVal) }
      );
      setCondProbResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCondProbLoading(false);
    }
  };

  // Fetch Expectation
  const fetchExpectation = async () => {
    try {
      setExpLoading(true);
      const res = await api.getExpectation(expFeat);
      setExpResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setExpLoading(false);
    }
  };

  useEffect(() => {
    calculateDirectProbability();
    calculateConditional();
    fetchExpectation();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="bg-dark-850 p-6 rounded-2xl border border-dark-750">
        <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
          <PieChart className="w-3.5 h-3.5" />
          <span>Core Modules 4, 5 & 7 — Unit 1 Probability & Expectation</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Probability Theory & Expectation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Empirical probabilities, joint condition intersections, conditional likelihood P(A|B), and expected values E[X].
        </p>
      </div>

      {/* SECTION 1: Direct & Compound Probability */}
      <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-dark-750 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
              <span>Direct Probability Calculator: P(Condition)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              P(Event) = Count of Matching Houses / 14,619 Total Valid Records
            </p>
          </div>
          <button
            onClick={calculateDirectProbability}
            disabled={probLoading}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{probLoading ? 'Calculating...' : 'Compute Probability'}</span>
          </button>
        </div>

        {/* Condition 1 Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-dark-900/60 p-4 rounded-xl border border-dark-750">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Feature</label>
            <select
              value={cond1Feat}
              onChange={(e) => setCond1Feat(e.target.value)}
              className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2"
            >
              {FEATURE_OPTIONS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Operator</label>
            <select
              value={cond1Op}
              onChange={(e) => setCond1Op(e.target.value)}
              className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2 font-mono"
            >
              <option value="<">&lt; (Less than)</option>
              <option value="<=">&le; (Less than or equal)</option>
              <option value=">">&gt; (Greater than)</option>
              <option value=">=">&ge; (Greater than or equal)</option>
              <option value="==">== (Exactly equal)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Threshold Value</label>
            <input
              type="number"
              value={cond1Val}
              onChange={(e) => setCond1Val(e.target.value)}
              className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2 font-mono"
            />
          </div>
        </div>

        {/* Toggle Compound Condition */}
        <div className="flex items-center space-x-3 text-xs">
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useCompound}
              onChange={(e) => setUseCompound(e.target.checked)}
              className="rounded bg-dark-800 border-dark-600 text-brand-500 focus:ring-0"
            />
            <span className="font-semibold">Add Compound Condition</span>
          </label>
          {useCompound && (
            <div className="flex bg-dark-900 p-0.5 rounded-lg border border-dark-700">
              <button
                onClick={() => setLogicOp('AND')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  logicOp === 'AND' ? 'bg-brand-600 text-white' : 'text-slate-400'
                }`}
              >
                AND (Intersection)
              </button>
              <button
                onClick={() => setLogicOp('OR')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  logicOp === 'OR' ? 'bg-brand-600 text-white' : 'text-slate-400'
                }`}
              >
                OR (Union)
              </button>
            </div>
          )}
        </div>

        {/* Condition 2 Form */}
        {useCompound && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-dark-900/60 p-4 rounded-xl border border-dark-750">
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Second Feature</label>
              <select
                value={cond2Feat}
                onChange={(e) => setCond2Feat(e.target.value)}
                className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2"
              >
                {FEATURE_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Operator</label>
              <select
                value={cond2Op}
                onChange={(e) => setCond2Op(e.target.value)}
                className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2 font-mono"
              >
                <option value="<">&lt; (Less than)</option>
                <option value="<=">&le; (Less than or equal)</option>
                <option value=">">&gt; (Greater than)</option>
                <option value=">=">&ge; (Greater than or equal)</option>
                <option value="==">== (Exactly equal)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Threshold Value</label>
              <input
                type="number"
                value={cond2Val}
                onChange={(e) => setCond2Val(e.target.value)}
                className="w-full bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2.5 py-2 font-mono"
              />
            </div>
          </div>
        )}

        {/* Direct Probability Result Showcase */}
        {probResult && (
          <div className="bg-gradient-to-br from-dark-900 to-dark-850 p-5 rounded-xl border border-brand-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-brand-400 font-semibold uppercase tracking-wider">
                  Evaluated Query
                </span>
                <div className="text-sm font-mono text-white font-bold mt-0.5">
                  P( {probResult.conditions_description} )
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-accent-cyan tracking-tight">
                  {probResult.percentage.toFixed(2)}%
                </div>
                <div className="text-xs font-mono text-slate-400">
                  P = {probResult.probability.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Matching: <strong className="text-white">{probResult.matching_rows.toLocaleString()}</strong> houses</span>
                <span>Total: {probResult.total_rows.toLocaleString()} houses</span>
              </div>
              <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, probResult.percentage))}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Conditional Probability */}
      <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-dark-750 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
              <span>Conditional Probability: P(A | B) = P(A ∩ B) / P(B)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Measures the probability of event A given that conditioning event B has occurred.
            </p>
          </div>
          <button
            onClick={calculateConditional}
            disabled={condProbLoading}
            className="px-4 py-2 rounded-xl bg-accent-amber/20 hover:bg-accent-amber/30 text-amber-300 border border-accent-amber/30 font-medium text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{condProbLoading ? 'Calculating...' : 'Compute P(A | B)'}</span>
          </button>
        </div>

        {/* Condition A & B inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Event A */}
          <div className="bg-dark-900/60 p-4 rounded-xl border border-dark-750 space-y-3">
            <span className="text-xs font-bold text-brand-300 uppercase tracking-wider block">
              Event A (Target Hypothesis)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={condAFeat}
                onChange={(e) => setCondAFeat(e.target.value)}
                className="bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2 py-2"
              >
                {FEATURE_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
              <select
                value={condAOp}
                onChange={(e) => setCondAOp(e.target.value)}
                className="bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2 py-2 font-mono"
              >
                <option value=">=">&ge;</option>
                <option value=">">&gt;</option>
                <option value="<=">&le;</option>
                <option value="<">&lt;</option>
                <option value="==">==</option>
              </select>
              <input
                type="number"
                value={condAVal}
                onChange={(e) => setCondAVal(e.target.value)}
                className="bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2 py-2 font-mono"
              />
            </div>
          </div>

          {/* Event B */}
          <div className="bg-dark-900/60 p-4 rounded-xl border border-dark-750 space-y-3">
            <span className="text-xs font-bold text-accent-amber uppercase tracking-wider block">
              Event B (Conditioning Evidence)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={condBFeat}
                onChange={(e) => setCondBFeat(e.target.value)}
                className="bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2 py-2"
              >
                {FEATURE_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
              <select
                value={condBOp}
                onChange={(e) => setCondBOp(e.target.value)}
                className="bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2 py-2 font-mono"
              >
                <option value="<">&lt;</option>
                <option value="<=">&le;</option>
                <option value=">">&gt;</option>
                <option value=">=">&ge;</option>
                <option value="==">==</option>
              </select>
              <input
                type="number"
                value={condBVal}
                onChange={(e) => setCondBVal(e.target.value)}
                className="bg-dark-800 border border-dark-650 text-white text-xs rounded-lg px-2 py-2 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Conditional Probability Output */}
        {condProbResult && (
          <div className="bg-dark-900/90 p-5 rounded-xl border border-accent-amber/30 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-dark-850 p-3 rounded-lg border border-dark-750">
                <span className="text-[10px] text-slate-400 block">P(A)</span>
                <span className="text-sm font-mono font-bold text-white">{condProbResult.p_a.toFixed(4)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{condProbResult.count_a.toLocaleString()} houses</span>
              </div>
              <div className="bg-dark-850 p-3 rounded-lg border border-dark-750">
                <span className="text-[10px] text-slate-400 block">P(B)</span>
                <span className="text-sm font-mono font-bold text-amber-300">{condProbResult.p_b.toFixed(4)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{condProbResult.count_b.toLocaleString()} houses</span>
              </div>
              <div className="bg-dark-850 p-3 rounded-lg border border-dark-750">
                <span className="text-[10px] text-slate-400 block">P(A ∩ B)</span>
                <span className="text-sm font-mono font-bold text-white">{condProbResult.p_a_and_b.toFixed(4)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{condProbResult.count_a_and_b.toLocaleString()} houses</span>
              </div>
              <div className="bg-dark-850 p-3 rounded-lg border border-accent-amber/40 bg-accent-amber/5">
                <span className="text-[10px] text-accent-amber font-bold block">P(A | B)</span>
                <span className="text-base font-mono font-extrabold text-white">{(condProbResult.p_a_given_b * 100).toFixed(2)}%</span>
                <span className="text-[10px] text-slate-300 block font-mono">P = {condProbResult.p_a_given_b.toFixed(4)}</span>
              </div>
            </div>

            <div className="p-3.5 bg-dark-850 rounded-lg border border-dark-750 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">Interpretation: </span>
              {condProbResult.explanation}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Mathematical Expectation E[X] */}
      <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-750 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Mathematical Expectation: E[X] = Σ x · P(X = x)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Theoretical long-run average outcome weighted by empirical probability mass.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={expFeat}
              onChange={(e) => setExpFeat(e.target.value)}
              className="bg-dark-900 border border-dark-650 text-white text-xs rounded-xl px-3 py-2"
            >
              <option value="number of bedrooms">Bedrooms (Discrete)</option>
              <option value="number of bathrooms">Bathrooms (Discrete)</option>
              <option value="condition of the house">Condition (Discrete)</option>
              <option value="grade of the house">Grade (Discrete)</option>
              <option value="Price">Price (Continuous)</option>
              <option value="living area">Living Area (Continuous)</option>
            </select>
            <button
              onClick={fetchExpectation}
              disabled={expLoading}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all"
            >
              {expLoading ? '...' : 'Compute E[X]'}
            </button>
          </div>
        </div>

        {expResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-dark-900/60 p-4 rounded-xl border border-dark-750">
                <span className="text-[11px] text-slate-400 font-medium">Expected Value E[X]</span>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">
                  {expFeat === 'Price' ? `₹${Number(expResult.expected_value).toLocaleString()}` : expResult.expected_value}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Weighted Sum of Probability Distribution</p>
              </div>

              <div className="bg-dark-900/60 p-4 rounded-xl border border-dark-750">
                <span className="text-[11px] text-slate-400 font-medium">Empirical Mean (x̄)</span>
                <div className="text-2xl font-extrabold text-white mt-1 font-mono">
                  {expFeat === 'Price' ? `₹${Number(expResult.mean_value).toLocaleString()}` : expResult.mean_value}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Arithmetic Dataset Average: (1/N) Σ x_i</p>
              </div>
            </div>

            <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-750 text-xs text-slate-300">
              <span className="font-semibold text-white">Mathematical Proof: </span>
              {expResult.formula_explanation}
            </div>

            {/* Discrete Breakdown Table */}
            {expResult.is_discrete && expResult.discrete_breakdown && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Probability Mass Distribution & Contributions
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-dark-750 text-slate-400 bg-dark-900/60">
                        <th className="py-2 px-3">Outcome Value (x)</th>
                        <th className="py-2 px-3">Frequency Count</th>
                        <th className="py-2 px-3">Empirical Probability P(X = x)</th>
                        <th className="py-2 px-3 font-semibold text-emerald-400">Contribution x · P(X = x)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-750">
                      {expResult.discrete_breakdown.map((item, idx) => (
                        <tr key={idx} className="hover:bg-dark-750/30">
                          <td className="py-2 px-3 font-mono font-bold text-white">{item.value}</td>
                          <td className="py-2 px-3 font-mono text-slate-400">{item.count.toLocaleString()}</td>
                          <td className="py-2 px-3 font-mono text-slate-300">{(item.probability * 100).toFixed(2)}% ({item.probability.toFixed(4)})</td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-300">{item.contribution.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-dark-600 bg-dark-900/80 font-bold">
                        <td className="py-2 px-3 text-white">Sum / Total</td>
                        <td className="py-2 px-3 text-slate-300">14,619</td>
                        <td className="py-2 px-3 text-slate-300">1.0000 (100%)</td>
                        <td className="py-2 px-3 text-emerald-400 text-sm font-mono">E[X] = {expResult.expected_value}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
