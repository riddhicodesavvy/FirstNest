/**
 * frontend/src/services/api.js
 * Centralized API client for communicating with the FastAPI backend.
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Dataset
  getDatasetSummary: () => request('/dataset/summary'),
  getDatasetPreview: (page = 1, pageSize = 20, sortBy = 'Price', sortOrder = 'desc') =>
    request(`/dataset/preview?page=${page}&page_size=${pageSize}&sort_by=${encodeURIComponent(sortBy)}&sort_order=${sortOrder}`),

  // Statistics
  getFeatureStatistics: (feature) => request(`/statistics/${encodeURIComponent(feature)}`),
  getAllStatistics: () => request('/statistics/summary/all'),

  // Covariance & Correlation
  getCovariance: () => request('/covariance'),
  getCorrelation: () => request('/correlation'),

  // Probability
  calculateProbability: (conditions, logic = 'AND') =>
    request('/probability', {
      method: 'POST',
      body: JSON.stringify({ conditions, logic }),
    }),

  calculateConditionalProbability: (conditionA, conditionB) =>
    request('/conditional-probability', {
      method: 'POST',
      body: JSON.stringify({ condition_a: conditionA, condition_b: conditionB }),
    }),

  // Bayes Theorem
  calculateBayes: (hypothesisA, evidenceB) =>
    request('/bayes', {
      method: 'POST',
      body: JSON.stringify({ hypothesis_a: hypothesisA, evidence_b: evidenceB }),
    }),

  // Expectation
  getExpectation: (feature) => request(`/expectation/${encodeURIComponent(feature)}`),

  // Polynomial Regression
  trainPolynomial: (degree = 2, testSize = 0.2) =>
    request('/polynomial/train', {
      method: 'POST',
      body: JSON.stringify({ degree, test_size: testSize }),
    }),

  predictPolynomial: (livingArea, degree = 2) =>
    request('/polynomial/predict', {
      method: 'POST',
      body: JSON.stringify({ living_area: livingArea, degree }),
    }),

  // House Matcher
  matchHouses: (payload) =>
    request('/houses/match', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Affordability
  getAffordability: (budget) =>
    request('/affordability', {
      method: 'POST',
      body: JSON.stringify({ budget }),
    }),

  // Viva Q&A
  getVivaQA: () => request('/viva/qa'),
};
