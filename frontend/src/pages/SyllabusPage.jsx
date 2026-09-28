import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Code2,
  Calculator,
} from 'lucide-react';

const SYLLABUS_MAPPING = [
  {
    id: 1,
    concept: '1. Dataset Loading & Exploration',
    module: 'Core Module 1 (Dataset Explorer)',
    path: 'backend/data_loader.py & main.py: /api/dataset/summary',
    formula: 'N = 14,619 \\text{ rows}, \\quad D = 23 \\text{ attributes}',
    theory: 'Loading raw tabular housing transaction data, auditing missing values, verifying datatypes, and ensuring data integrity before statistical modeling.',
    implementation: 'Dynamic CSV loading, 0 missing value verification, 0 duplicates, dtypes audit. All prices represented in Indian Rupees (₹).'
  },
  {
    id: 2,
    concept: '2. Mean (μ)',
    module: 'Core Module 2 (Descriptive Statistics)',
    path: 'backend/statistics.py: calculate_feature_statistics',
    formula: '\\mu = \\frac{1}{N} \\sum_{i=1}^N x_i',
    theory: 'The arithmetic average of all observed values representing the central balance point of the distribution.',
    implementation: 'Calculated across all numeric features. Average house price is ₹538,806.28; average living area is 2,098.16 sqft.'
  },
  {
    id: 3,
    concept: '3. Median (Q2)',
    module: 'Core Module 2 (Descriptive Statistics)',
    path: 'backend/statistics.py: calculate_feature_statistics',
    formula: 'Q2 = \\text{Value at rank } 0.50 \\times (N + 1)',
    theory: 'The 50th percentile rank; robust against extreme luxury outliers that skew the arithmetic mean.',
    implementation: 'Median house price is ₹450,000.00. Because Mean (₹538k) > Median (₹450k), the price distribution is positively right-skewed.'
  },
  {
    id: 4,
    concept: '4. Mode',
    module: 'Core Module 2 (Descriptive Statistics)',
    path: 'backend/statistics.py: calculate_feature_statistics',
    formula: '\\text{Mode} = \\arg\\max_x P(X = x)',
    theory: 'The most frequently occurring observation in the sample space.',
    implementation: 'Empirical mode for bedrooms is 3 bedrooms (6,612 properties); modal price bin is ₹450,000.'
  },
  {
    id: 5,
    concept: '5. Variance (s²)',
    module: 'Core Module 2 (Measures of Dispersion)',
    path: 'backend/statistics.py: calculate_feature_statistics',
    formula: 's^2 = \\frac{1}{N - 1} \\sum_{i=1}^N (x_i - \\bar{x})^2',
    theory: 'Expected squared deviation of observations from their sample mean with Bessel correction (ddof=1) for unbiased population estimation.',
    implementation: 'Sample price variance is ₹1.348 × 10¹¹ (₹²), quantifying market price volatility.'
  },
  {
    id: 6,
    concept: '6. Standard Deviation (s)',
    module: 'Core Module 2 (Measures of Dispersion)',
    path: 'backend/statistics.py: calculate_feature_statistics',
    formula: 's = \\sqrt{s^2}',
    theory: 'The square root of variance, returning dispersion to the original measurement units (Rupees ₹ or sqft).',
    implementation: 'Price standard deviation is ₹367,229.36.'
  },
  {
    id: 7,
    concept: '7. Quantiles (Q1, Q2, Q3)',
    module: 'Core Module 2 (Five-Number Summary)',
    path: 'backend/statistics.py: calculate_feature_statistics',
    formula: 'Q1 = 25\\text{th percentile}, \\quad Q2 = 50\\text{th}, \\quad Q3 = 75\\text{th}',
    theory: 'Values partitioning sorted observations into four equal-sized quartiles.',
    implementation: 'Price Q1 = ₹320,000.00, Median Q2 = ₹450,000.00, Q3 = ₹645,000.00.'
  },
  {
    id: 8,
    concept: '8. Interquartile Range (IQR) & Outliers',
    module: 'Core Module 2 & Outlier Detection',
    path: 'backend/statistics.py: calculate_feature_statistics',
    formula: '\\text{IQR} = Q3 - Q1, \\quad [Q1 - 1.5\\cdot\\text{IQR}, \\; Q3 + 1.5\\cdot\\text{IQR}]',
    theory: 'Measures spread of the middle 50% and identifies Tukey outlier boundaries.',
    implementation: 'Price IQR = ₹325,000.00. Identifies 760 luxury properties above ₹1,132,500 as upper outliers.'
  },
  {
    id: 9,
    concept: '9. Probability Distributions',
    module: 'Core Module 4 (Probability Analysis)',
    path: 'backend/probability.py: calculate_probability',
    formula: 'P(E) = \\frac{\\text{Count}(E)}{N}',
    theory: 'Assigning empirical probabilities to housing events based on dataset frequency.',
    implementation: 'P(Price < ₹500,000) = 8,418 / 14,619 = 57.58%.'
  },
  {
    id: 10,
    concept: '10. Mathematical Expectation E[X]',
    module: 'Core Module 7 (Expectation)',
    path: 'backend/probability.py: calculate_expectation',
    formula: 'E[X] = \\sum_{x} x \\cdot P(X = x)',
    theory: 'The theoretical long-run expected average outcome weighted by probability mass.',
    implementation: 'For discrete bedrooms: E[Bedrooms] = Σ x·P(X=x) = 3.379, exactly matching the arithmetic sample mean.'
  },
  {
    id: 11,
    concept: '11. Covariance Cov(X, Y)',
    module: 'Core Module 3 (Bivariate Dispersion)',
    path: 'backend/statistics.py: calculate_covariance_matrix',
    formula: '\\text{Cov}(X, Y) = \\frac{1}{N - 1} \\sum_{i=1}^N (x_i - \\bar{x})(y_i - \\bar{y})',
    theory: 'Quantifies whether higher values of one variable correspond to higher values of another.',
    implementation: 'Living Area and Price covariance is +2.428 × 10⁸ (sqft · ₹), demonstrating positive co-movement.'
  },
  {
    id: 12,
    concept: '12. Pearson Correlation Coefficient (r)',
    module: 'Core Module 3 (Correlation Heatmap)',
    path: 'backend/statistics.py: calculate_correlation_matrix',
    formula: 'r = \\frac{\\text{Cov}(X, Y)}{s_X \\cdot s_Y} \\in [-1, +1]',
    theory: 'Scale-invariant linear association index removing measurement units.',
    implementation: 'Living Area vs Price r = 0.7123 (strong positive); Construction Grade vs Price r = 0.6710; Airport Distance vs Price r = 0.0105 (negligible).'
  },
  {
    id: 13,
    concept: '13. Conditional Probability P(A|B)',
    module: 'Core Module 5 (Conditional Probability)',
    path: 'backend/probability.py: calculate_conditional_probability',
    formula: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{\\text{Count}(A \\cap B)}{\\text{Count}(B)}',
    theory: 'Restricts the sample space exclusively to instances satisfying conditioning event B.',
    implementation: 'Given Price < ₹500,000 (8,418 houses), the probability of 3+ bedrooms is 6,863 / 8,418 = 81.53%.'
  },
  {
    id: 14,
    concept: '14. Bayes\' Theorem',
    module: 'Core Module 6 (Bayes Theorem Lab)',
    path: 'backend/bayes.py: calculate_bayes',
    formula: 'P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}',
    theory: 'Mathematical formula updating prior belief P(A) with likelihood P(B|A) and evidence P(B) to obtain posterior P(A|B).',
    implementation: 'Evaluated dynamically; theoretical Bayes posterior matches direct empirical count within float precision (Δ = 1.11 × 10⁻¹⁶).'
  },
  {
    id: 15,
    concept: '15. Polynomial Curve Fitting',
    module: 'Core Module 8 (Polynomial Regression)',
    path: 'backend/polynomial.py: train_and_evaluate',
    formula: '\\hat{y} = a_0 + a_1 x + a_2 x^2 + \\dots + a_d x^d',
    theory: 'Supervised regression modeling non-linear market pricing curves between square footage (X) and price in Rupees (Y).',
    implementation: 'Ordinary Least Squares regression trained for Degrees 1, 2, 3 on living area vs price.'
  },
  {
    id: 16,
    concept: '16. Basic Supervised Learning Concept',
    module: 'Core Module 8 & 12 (Estimation & Evaluation)',
    path: 'backend/polynomial.py: predict',
    formula: 'D = D_{\\text{train}} \\cup D_{\\text{test}}, \\quad R^2 = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}, \\quad \\text{RMSE} = \\sqrt{\\text{MSE}}',
    theory: 'Splitting into train/test sets to evaluate out-of-sample generalization and estimate target values.',
    implementation: '80/20 train-test split (11,695 train / 2,924 test). Degree 2 achieves Test R² = 0.5847, Test RMSE = ₹247,908.42.'
  },
];

export default function SyllabusPage() {
  const [selectedTopic, setSelectedTopic] = useState(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-dark-850 p-6 rounded-2xl border border-dark-750">
        <div className="inline-flex items-center space-x-2 text-brand-400 text-xs font-semibold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum Alignment Matrix</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Machine Learning Unit-1 Syllabus Mapping</h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed academic mapping connecting every implemented feature in FirstNest directly to the Unit-1 syllabus.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Curriculum Concepts
          </span>
          <div className="text-2xl font-bold text-white mt-1 font-mono">16 / 16</div>
          <p className="text-[10px] text-emerald-400 mt-1">100% Coverage</p>
        </div>

        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Currency Standard
          </span>
          <div className="text-2xl font-bold text-accent-cyan mt-1 font-mono">Rupees (₹)</div>
          <p className="text-[10px] text-slate-400 mt-1">Indian Housing Market</p>
        </div>

        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Splitting Strategy
          </span>
          <div className="text-2xl font-bold text-brand-300 mt-1 font-mono">80 / 20</div>
          <p className="text-[10px] text-slate-400 mt-1">Train / Test Generalization</p>
        </div>

        <div className="bg-dark-850 border border-dark-750 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
            Model Type
          </span>
          <div className="text-2xl font-bold text-accent-amber mt-1 font-mono">Polynomial</div>
          <p className="text-[10px] text-slate-400 mt-1">Degrees 1, 2, and 3</p>
        </div>
      </div>

      {/* Comprehensive Mapping Table */}
      <div className="bg-dark-850 border border-dark-750 p-6 rounded-2xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-brand-400" />
            <span>Complete Unit 1 Syllabus Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any row to view its theoretical definition, formula, and FirstNest code implementation.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dark-750 text-slate-400 bg-dark-900/60">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Unit-1 Syllabus Topic</th>
                <th className="py-2.5 px-3">FirstNest Module</th>
                <th className="py-2.5 px-3">Source Code Location</th>
                <th className="py-2.5 px-3">Empirical Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-750">
              {SYLLABUS_MAPPING.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedTopic(row.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedTopic === row.id ? 'bg-brand-500/10' : 'hover:bg-dark-750/30'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{row.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap flex items-center space-x-1.5">
                    {selectedTopic === row.id && <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />}
                    <span>{row.concept}</span>
                  </td>
                  <td className="py-2.5 px-3 text-brand-300 font-medium">{row.module}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{row.path}</td>
                  <td className="py-2.5 px-3 text-slate-300 leading-snug">{row.implementation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Topic Deep-Dive Card */}
      {(() => {
        const active = SYLLABUS_MAPPING.find((s) => s.id === selectedTopic) || SYLLABUS_MAPPING[0];
        return (
          <div className="bg-dark-850 border border-brand-500/30 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dark-750 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-xs">
                  {active.id}
                </span>
                <h3 className="text-base font-bold text-white">{active.concept}</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {active.module}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-dark-900/70 p-4 rounded-xl border border-dark-750 space-y-2">
                <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider block">
                  Theoretical Definition
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {active.theory}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Mathematical Expression
                  </span>
                  <div className="font-mono text-xs text-brand-300 bg-dark-950 p-2.5 rounded-lg border border-dark-700 overflow-x-auto">
                    {active.formula}
                  </div>
                </div>
              </div>

              <div className="bg-dark-900/70 p-4 rounded-xl border border-dark-750 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Implementation in FirstNest
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {active.implementation}
                </p>
                <div className="pt-2 border-t border-dark-750">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Code Reference
                  </span>
                  <div className="font-mono text-[11px] text-slate-400 bg-dark-950 p-2 rounded-lg border border-dark-700">
                    {active.path}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
