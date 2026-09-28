"""
backend/probability.py
Implementation of Unit 1 Probability Foundations:
- Direct Probability: P(Condition) = Count(Condition) / N
- Joint Probability: P(A AND B)
- Conditional Probability: P(A|B) = P(A AND B) / P(B)
- Expectation: E[X] = sum(x * P(X = x))
"""

from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd

from backend.data_loader import dataset_manager
from backend.models import (
    ProbabilityCondition,
    ProbabilityRequest,
    ProbabilityResponse,
    ConditionalProbabilityRequest,
    ConditionalProbabilityResponse,
    ExpectationResponse,
    DiscreteExpectationItem,
)


def _evaluate_single_condition(df: pd.DataFrame, condition: ProbabilityCondition) -> pd.Series:
    """Evaluates a single condition against the dataframe and returns a boolean series."""
    feat = condition.feature
    if feat not in df.columns:
        raise ValueError(f"Feature '{feat}' not present in dataset.")

    op = condition.operator.strip()
    val = float(condition.value)
    series = df[feat]

    if op == "<":
        return series < val
    elif op == "<=":
        return series <= val
    elif op == ">":
        return series > val
    elif op == ">=":
        return series >= val
    elif op in ("==", "="):
        return series == val
    elif op == "!=":
        return series != val
    else:
        raise ValueError(f"Unsupported operator '{op}'. Supported: <, <=, >, >=, ==, !=")


def _format_condition_str(cond: ProbabilityCondition) -> str:
    """Format condition for human readable display."""
    disp_names = dataset_manager.get_feature_display_names()
    name = disp_names.get(cond.feature, cond.feature)
    val_str = f"₹{int(cond.value):,}" if "price" in cond.feature.lower() else f"{cond.value:g}"
    return f"{name} {cond.operator} {val_str}"



def calculate_probability(req: ProbabilityRequest) -> ProbabilityResponse:
    """
    Direct probability calculation:
    P(E) = Number of favorable outcomes / Total possible outcomes = count(E) / N
    """
    df = dataset_manager.get_df()
    total_rows = len(df)
    if total_rows == 0:
        raise ValueError("Dataset is empty.")

    if not req.conditions:
        raise ValueError("At least one condition must be specified.")

    bool_masks = [_evaluate_single_condition(df, c) for c in req.conditions]

    if req.logic.upper() == "OR":
        final_mask = bool_masks[0]
        for m in bool_masks[1:]:
            final_mask = final_mask | m
        logic_str = " OR "
    else:  # default AND
        final_mask = bool_masks[0]
        for m in bool_masks[1:]:
            final_mask = final_mask & m
        logic_str = " AND "

    matching_count = int(final_mask.sum())
    prob = matching_count / total_rows
    pct = prob * 100.0

    cond_descriptions = [_format_condition_str(c) for c in req.conditions]
    desc = logic_str.join(cond_descriptions)

    return ProbabilityResponse(
        conditions_description=desc,
        matching_rows=matching_count,
        total_rows=total_rows,
        probability=round(prob, 4),
        percentage=round(pct, 2),
    )


def calculate_conditional_probability(req: ConditionalProbabilityRequest) -> ConditionalProbabilityResponse:
    """
    Conditional Probability:
    P(A | B) = P(A AND B) / P(B)
    """
    df = dataset_manager.get_df()
    total_rows = len(df)
    if total_rows == 0:
        raise ValueError("Dataset is empty.")

    mask_a = _evaluate_single_condition(df, req.condition_a)
    mask_b = _evaluate_single_condition(df, req.condition_b)
    mask_a_and_b = mask_a & mask_b

    count_a = int(mask_a.sum())
    count_b = int(mask_b.sum())
    count_a_and_b = int(mask_a_and_b.sum())

    p_a = count_a / total_rows
    p_b = count_b / total_rows
    p_a_and_b = count_a_and_b / total_rows

    if count_b == 0:
        p_a_given_b = 0.0
        explanation = (
            f"The conditioning event B has 0 occurrences in the dataset (P(B) = 0). "
            f"Conditional probability P(A|B) is undefined (division by zero)."
        )
    else:
        p_a_given_b = count_a_and_b / count_b
        desc_a = _format_condition_str(req.condition_a)
        desc_b = _format_condition_str(req.condition_b)
        explanation = (
            f"Given that event B is satisfied ({desc_b}, {count_b:,} houses), "
            f"there are {count_a_and_b:,} houses that also satisfy event A ({desc_a}). "
            f"Hence, P(A | B) = {count_a_and_b} / {count_b} = {p_a_given_b:.4f} ({p_a_given_b * 100:.2f}%)."
        )

    desc_a = _format_condition_str(req.condition_a)
    desc_b = _format_condition_str(req.condition_b)
    formula_str = (
        f"P(A|B) = P(A ∩ B) / P(B) = ({count_a_and_b}/{total_rows}) / ({count_b}/{total_rows}) = {count_a_and_b}/{count_b} = {p_a_given_b:.4f}"
    )

    return ConditionalProbabilityResponse(
        p_a=round(p_a, 4),
        p_b=round(p_b, 4),
        p_a_and_b=round(p_a_and_b, 4),
        p_a_given_b=round(p_a_given_b, 4),
        count_a=count_a,
        count_b=count_b,
        count_a_and_b=count_a_and_b,
        total_rows=total_rows,
        description_a=desc_a,
        description_b=desc_b,
        explanation=explanation,
        formula=formula_str,
    )


def calculate_expectation(feature_name: str) -> ExpectationResponse:
    """
    Calculate Mathematical Expectation E[X]:
    For discrete variable: E[X] = sum(x_i * P(X = x_i))
    For continuous sample: E[X] = (1 / N) * sum(x_i) = sample mean
    """
    df = dataset_manager.get_df()
    if feature_name not in df.columns:
        raise ValueError(f"Feature '{feature_name}' not found.")

    series = df[feature_name].dropna().to_numpy(dtype=float)
    total_count = len(series)
    display_names = dataset_manager.get_feature_display_names()
    disp_name = display_names.get(feature_name, feature_name)

    unique_vals = np.unique(series)
    is_discrete = len(unique_vals) <= 20

    mean_val = float(np.mean(series))

    discrete_items: List[DiscreteExpectationItem] = []
    if is_discrete:
        calculated_expected_value = 0.0
        for val in sorted(unique_vals):
            cnt = int(np.sum(series == val))
            prob = cnt / total_count
            contrib = float(val * prob)
            calculated_expected_value += contrib
            discrete_items.append(DiscreteExpectationItem(
                value=float(val),
                count=cnt,
                probability=round(prob, 4),
                contribution=round(contrib, 4)
            ))
        exp_val = calculated_expected_value
        explanation = (
            f"For discrete feature '{disp_name}', Expectation E[X] is computed as the sum of each "
            f"possible outcome multiplied by its empirical probability: E[X] = Σ x · P(X = x). "
            f"Here, Σ x · P(X = x) = {exp_val:.3f}, exactly matching the sample mean {mean_val:.3f}."
        )
    else:
        exp_val = mean_val
        explanation = (
            f"For continuous feature '{disp_name}', under the empirical distribution of the dataset, "
            f"the expected value of a randomly selected house is equal to the sample mean: "
            f"E[X] = (1/N) Σ x_i = {exp_val:,.2f}."
        )

    return ExpectationResponse(
        feature=feature_name,
        display_name=disp_name,
        is_discrete=is_discrete,
        expected_value=round(exp_val, 3),
        mean_value=round(mean_val, 3),
        formula_explanation=explanation,
        discrete_breakdown=discrete_items if is_discrete else None,
    )
