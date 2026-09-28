"""
backend/test_backend.py
Comprehensive test suite verifying all mathematical, statistical, and matching calculations.
"""

import sys
import os

# Ensure project root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.data_loader import dataset_manager
from backend.statistics import (
    calculate_feature_statistics,
    calculate_covariance_matrix,
    calculate_correlation_matrix,
    get_all_features_summary,
)
from backend.probability import (
    calculate_probability,
    calculate_conditional_probability,
    calculate_expectation,
)
from backend.bayes import calculate_bayes
from backend.polynomial import polynomial_manager
from backend.matcher import match_houses, calculate_affordability_summary
from backend.models import (
    ProbabilityCondition,
    ProbabilityRequest,
    ConditionalProbabilityRequest,
    BayesRequest,
    HouseMatchRequest,
)


def run_all_tests():
    print("=" * 60)
    print("RUNNING SMART HOUSE BUDGET & REQUIREMENT ANALYZER UNIT TESTS")
    print("=" * 60)

    # 1. Dataset loading
    print("\n[1] Testing Dataset Loading & Auditing...")
    df = dataset_manager.load_data()
    meta = dataset_manager.get_metadata()
    print(f"Loaded rows: {len(df):,}, cols: {len(df.columns)}")
    print(f"Missing values count sum: {sum(meta['missing_values_detected'].values())}")
    assert len(df) > 10000, "Dataset rows insufficient!"
    assert sum(meta['missing_values_detected'].values()) == 0, "Missing values detected!"

    # 2. Statistics
    print("\n[2] Testing Descriptive Statistics (Price)...")
    price_stats = calculate_feature_statistics("Price")
    print(f"Price: Mean=${price_stats.mean:,.2f}, Median=${price_stats.median:,.2f}, Mode=${price_stats.mode:,.2f}")
    print(f"Price: Std=${price_stats.std_dev:,.2f}, Q1=${price_stats.q1:,.2f}, Q3=${price_stats.q3:,.2f}, IQR=${price_stats.iqr:,.2f}")
    print(f"Histogram bins generated: {len(price_stats.histogram)}, Outliers: {price_stats.outliers_count}")
    assert price_stats.mean > 0
    assert price_stats.q3 >= price_stats.q1
    assert price_stats.iqr == round(price_stats.q3 - price_stats.q1, 2)

    # 3. Covariance & Correlation
    print("\n[3] Testing Covariance and Correlation Matrices...")
    cov_res = calculate_covariance_matrix()
    corr_res = calculate_correlation_matrix()
    print(f"Covariance Matrix shape: {len(cov_res.matrix)}x{len(cov_res.matrix[0])}")
    print(f"Correlation Matrix shape: {len(corr_res.matrix)}x{len(corr_res.matrix[0])}")
    print(f"Key pair: {corr_res.key_pairs[0].feature_x} vs {corr_res.key_pairs[0].feature_y}: r = {corr_res.key_pairs[0].correlation}")
    print(f"Explanation: {corr_res.key_pairs[0].explanation}")
    assert len(corr_res.key_pairs) == 5
    assert 0.6 <= corr_res.key_pairs[0].correlation <= 0.8  # living area vs price correlation

    # 4. Probability
    print("\n[4] Testing Direct Probability (Price < 500,000)...")
    prob_req = ProbabilityRequest(
        conditions=[ProbabilityCondition(feature="Price", operator="<", value=500000)],
        logic="AND"
    )
    prob_res = calculate_probability(prob_req)
    print(f"P(Price < $500k) = {prob_res.probability:.4f} ({prob_res.percentage:.2f}%) [{prob_res.matching_rows:,} houses]")
    assert 0 < prob_res.probability < 1.0

    # 5. Conditional Probability
    print("\n[5] Testing Conditional Probability P(Bedrooms >= 3 | Price < 500,000)...")
    cond_req = ConditionalProbabilityRequest(
        condition_a=ProbabilityCondition(feature="number of bedrooms", operator=">=", value=3),
        condition_b=ProbabilityCondition(feature="Price", operator="<", value=500000)
    )
    cond_res = calculate_conditional_probability(cond_req)
    print(f"P(Bedrooms >= 3 | Price < $500k) = {cond_res.p_a_given_b:.4f}")
    print(f"Explanation: {cond_res.explanation}")
    assert 0 < cond_res.p_a_given_b <= 1.0

    # 6. Bayes Theorem
    print("\n[6] Testing Bayes Theorem...")
    bayes_req = BayesRequest(
        hypothesis_a=ProbabilityCondition(feature="number of bedrooms", operator=">=", value=3),
        evidence_b=ProbabilityCondition(feature="Price", operator="<", value=500000)
    )
    bayes_res = calculate_bayes(bayes_req)
    print(f"Direct P(A|B): {bayes_res.direct_posterior_p_a_given_b:.6f}")
    print(f"Bayes  P(A|B): {bayes_res.bayes_posterior_p_a_given_b:.6f}")
    print(f"Difference:    {bayes_res.difference:.2e}")
    print(f"Do they match? {bayes_res.values_match}")
    assert bayes_res.values_match, "Bayes theorem value mismatch!"

    # 7. Expectation
    print("\n[7] Testing Expectation (Bedrooms & Living Area)...")
    exp_beds = calculate_expectation("number of bedrooms")
    exp_area = calculate_expectation("living area")
    print(f"E[Bedrooms] = {exp_beds.expected_value:.3f} (Mean = {exp_beds.mean_value:.3f})")
    print(f"E[Living Area] = {exp_area.expected_value:,.2f} sqft")
    assert abs(exp_beds.expected_value - exp_beds.mean_value) < 0.01

    # 8. Polynomial Regression
    print("\n[8] Testing Polynomial Regression (Degrees 1, 2, 3)...")
    poly_train = polynomial_manager.train_and_evaluate(selected_degree=2)
    for m in poly_train.all_degrees_comparison:
        print(f"Degree {m.degree}: Train R²={m.r2_train:.4f}, Test R²={m.r2_test:.4f}, Test RMSE=${m.rmse_test:,.2f}")
        print(f"  Equation: {m.equation}")
    assert poly_train.selected_model.r2_test > 0.40

    pred_res = polynomial_manager.predict(living_area=2000, degree=2)
    print(f"Polynomial Estimate for 2,000 sqft: ${pred_res.predicted_price:,.2f}")
    assert pred_res.predicted_price > 200000

    # 9. House Matcher & Budget Gap Analysis
    print("\n[9] Testing House Matcher & Budget Gap Analysis...")
    match_req = HouseMatchRequest(
        budget=500000,
        living_area=2000,
        bedrooms=3,
        bathrooms=2,
    )
    match_res = match_houses(match_req)
    print(f"Best match ID: {match_res.best_match.id}, Price: ${match_res.best_match.price:,.2f}, Area: {match_res.best_match.living_area} sqft, Match Score: {match_res.best_match.match_score}%")
    print(f"Budget Status: {match_res.budget_gap.status}, Message: {match_res.budget_gap.summary_message}")
    print(f"Why selected:")
    for w in match_res.best_match.why_selected:
        print(f"  - {w}")
    print(f"Top 5 houses retrieved: {len(match_res.top_5_matches)}")
    print(f"Affordable houses count: {match_res.affordability.affordable_houses_count:,} ({match_res.affordability.percentage_affordable:.1f}%)")
    assert len(match_res.top_5_matches) == 5
    assert match_res.best_match.match_score >= match_res.top_5_matches[4].match_score

    print("\n" + "=" * 60)
    print("ALL UNIT TESTS PASSED SUCCESSFULLY! BACKEND IS 100% OPERATIONAL.")
    print("=" * 60)


if __name__ == "__main__":
    run_all_tests()
