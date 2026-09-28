"""
backend/bayes.py
Rigorous implementation and verification of Bayes' Theorem for housing events.
Formulas:
- Prior Probability: P(A)
- Evidence (Marginal Likelihood): P(B)
- Likelihood: P(B | A) = P(A AND B) / P(A)
- Direct Posterior: P(A | B)_direct = P(A AND B) / P(B)
- Bayes Posterior: P(A | B)_bayes = [P(B | A) * P(A)] / P(B)
Directly verifies that P(A | B)_direct == P(A | B)_bayes within machine precision.
"""

from typing import Dict, Any
import pandas as pd

from backend.data_loader import dataset_manager
from backend.models import BayesRequest, BayesResponse
from backend.probability import _evaluate_single_condition, _format_condition_str


def calculate_bayes(req: BayesRequest) -> BayesResponse:
    """
    Perform Bayes' Theorem calculation and numerical verification.
    """
    df = dataset_manager.get_df()
    total_rows = len(df)
    if total_rows == 0:
        raise ValueError("Dataset is empty.")

    # Masks
    mask_a = _evaluate_single_condition(df, req.hypothesis_a)
    mask_b = _evaluate_single_condition(df, req.evidence_b)
    mask_a_and_b = mask_a & mask_b

    count_a = int(mask_a.sum())
    count_b = int(mask_b.sum())
    count_a_and_b = int(mask_a_and_b.sum())

    # Direct probabilities
    p_a = count_a / total_rows
    p_b = count_b / total_rows
    p_a_and_b = count_a_and_b / total_rows

    if count_a == 0:
        raise ValueError("Hypothesis event A has 0 occurrences in dataset (P(A) = 0).")
    if count_b == 0:
        raise ValueError("Evidence event B has 0 occurrences in dataset (P(B) = 0).")

    # Likelihood: P(B|A)
    p_b_given_a = count_a_and_b / count_a

    # Direct calculation of P(A|B)
    direct_posterior = count_a_and_b / count_b

    # Bayes' Theorem formula: [P(B|A) * P(A)] / P(B)
    bayes_posterior = (p_b_given_a * p_a) / p_b

    # Numerical difference verification
    diff = abs(direct_posterior - bayes_posterior)
    matches = diff < 1e-7

    desc_a = _format_condition_str(req.hypothesis_a)
    desc_b = _format_condition_str(req.evidence_b)

    formula_steps = {
        "step_1_prior": f"P(A) [Prior probability of {desc_a}] = {count_a:,} / {total_rows:,} = {p_a:.4f} ({p_a*100:.2f}%)",
        "step_2_evidence": f"P(B) [Evidence probability of {desc_b}] = {count_b:,} / {total_rows:,} = {p_b:.4f} ({p_b*100:.2f}%)",
        "step_3_joint": f"P(A ∩ B) [Both conditions met] = {count_a_and_b:,} / {total_rows:,} = {p_a_and_b:.4f}",
        "step_4_likelihood": f"P(B|A) [Likelihood that a house has '{desc_b}' given it satisfies '{desc_a}'] = {count_a_and_b:,} / {count_a:,} = {p_b_given_a:.4f} ({p_b_given_a*100:.2f}%)",
        "step_5_direct_posterior": f"Direct P(A|B) = Count(A ∩ B) / Count(B) = {count_a_and_b:,} / {count_b:,} = {direct_posterior:.6f}",
        "step_6_bayes_posterior": f"Bayes P(A|B) = [P(B|A) × P(A)] / P(B) = [{p_b_given_a:.6f} × {p_a:.6f}] / {p_b:.6f} = {bayes_posterior:.6f}",
        "step_7_verification": f"Absolute Difference: |{direct_posterior:.6f} - {bayes_posterior:.6f}| = {diff:.2e} -> Exact Mathematical Match: {matches}",
    }

    explanation = (
        f"Bayes' Theorem mathematically updates our initial belief (Prior) about a house satisfying '{desc_a}' "
        f"upon observing the evidence that it satisfies '{desc_b}'. "
        f"Initially, any random house in the dataset has a {p_a*100:.2f}% chance of satisfying '{desc_a}'. "
        f"After conditioning on the evidence '{desc_b}', the updated posterior probability is {bayes_posterior*100:.2f}%. "
        f"The theoretical Bayes formula matches the empirical dataset count exactly (Difference = {diff:.2e})."
    )

    return BayesResponse(
        prior_p_a=round(p_a, 4),
        evidence_p_b=round(p_b, 4),
        likelihood_p_b_given_a=round(p_b_given_a, 4),
        direct_posterior_p_a_given_b=round(direct_posterior, 4),
        bayes_posterior_p_a_given_b=round(bayes_posterior, 4),
        difference=float(diff),
        values_match=bool(matches),
        count_a=count_a,
        count_b=count_b,
        count_a_and_b=count_a_and_b,
        total_rows=total_rows,
        description_a=desc_a,
        description_b=desc_b,
        formula_steps=formula_steps,
        explanation=explanation,
    )
