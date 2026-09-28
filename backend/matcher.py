"""
backend/matcher.py
Smart House Requirement Matcher, Budget Gap Analyzer, and Affordability Evaluator.
Implements a transparent, rule-based normalized weighted similarity algorithm.
IMPORTANT: Clearly documented as a similarity heuristic, NOT a trained ML classifier.
"""

from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd

from backend.data_loader import dataset_manager
from backend.polynomial import polynomial_manager
from backend.models import (
    HouseMatchRequest,
    HouseMatchResponse,
    MatchedHouse,
    BudgetGapAnalysis,
    AffordabilitySummary,
    AffordabilityRequest,
    AffordabilityResponse,
)


def _generate_why_selected_explanation(
    house_price: float,
    budget: float,
    house_area: float,
    req_area: float,
    house_beds: float,
    req_beds: float,
    house_baths: float,
    req_baths: float,
    grade: int,
    condition: int
) -> List[str]:
    """Generates an honest, mathematically backed verbal explanation for why a house was ranked high."""
    points = []

    # 1. Living Area comparison
    area_diff_pct = abs(house_area - req_area) / req_area * 100
    if area_diff_pct < 5:
        points.append(f"Living area ({int(house_area):,} sqft) is an exceptional match to your requested {int(req_area):,} sqft (within {area_diff_pct:.1f}%).")
    elif area_diff_pct < 15:
        points.append(f"Living area ({int(house_area):,} sqft) closely aligns with your target of {int(req_area):,} sqft (±{area_diff_pct:.1f}%).")
    else:
        points.append(f"Living area ({int(house_area):,} sqft) offers a viable alternative to your requested {int(req_area):,} sqft.")

    # 2. Budget status
    if house_price <= budget:
        remaining = budget - house_price
        savings_pct = (remaining / budget) * 100
        points.append(f"Price (₹{int(house_price):,}) is comfortably within your budget of ₹{int(budget):,}, leaving ₹{int(remaining):,} in reserve ({savings_pct:.1f}% savings).")
    else:
        gap = house_price - budget
        gap_pct = (gap / budget) * 100
        points.append(f"Price (₹{int(house_price):,}) slightly exceeds your budget by ₹{int(gap):,} ({gap_pct:.1f}% additional funding required).")


    # 3. Bedrooms comparison
    if house_beds == req_beds:
        points.append(f"Provides exactly {int(house_beds)} bedrooms, matching your exact requirement.")
    elif house_beds > req_beds:
        points.append(f"Provides {int(house_beds)} bedrooms, offering extra space over your {int(req_beds)} bedroom requirement.")
    else:
        points.append(f"Offers {int(house_beds)} bedrooms, close to your requested {int(req_beds)} bedrooms.")

    # 4. Bathrooms comparison
    if abs(house_baths - req_baths) < 0.25:
        points.append(f"Bathroom count ({house_baths:g}) exactly satisfies your target ({req_baths:g}).")
    else:
        points.append(f"Features {house_baths:g} bathrooms compared to your requested {req_baths:g}.")

    # 5. Quality metrics
    if grade >= 8:
        points.append(f"High construction grade of {grade}/13 indicates premium build quality.")
    if condition >= 4:
        points.append(f"Well-maintained condition rating of {condition}/5.")

    return points


def match_houses(req: HouseMatchRequest) -> HouseMatchResponse:
    """
    Ranks houses in the dataset based on weighted multi-objective similarity to user preferences.
    """
    df = dataset_manager.get_df().copy()
    total_houses_in_dataset = len(df)

    # Optional initial filters if provided
    if req.min_grade is not None:
        df = df[df['grade of the house'] >= req.min_grade]
    if req.min_condition is not None:
        df = df[df['condition of the house'] >= req.min_condition]
    if req.max_price is not None:
        df = df[df['Price'] <= req.max_price]

    if len(df) == 0:
        # Fallback to unfiltered dataset if filters eliminated all rows
        df = dataset_manager.get_df().copy()

    # Normalize weights so they sum to 1.0
    w_sum = req.weight_area + req.weight_budget + req.weight_bedroom + req.weight_bathroom
    if w_sum <= 0:
        w_area, w_budget, w_beds, w_baths = 0.40, 0.30, 0.15, 0.15
    else:
        w_area = req.weight_area / w_sum
        w_budget = req.weight_budget / w_sum
        w_beds = req.weight_bedroom / w_sum
        w_baths = req.weight_bathroom / w_sum

    # Calculate component similarity scores [0.0 to 1.0]
    # 1. Area similarity
    area_diff_ratio = (df['living area'] - req.living_area).abs() / req.living_area
    area_score = np.clip(1.0 - area_diff_ratio, 0.0, 1.0)

    # 2. Budget similarity
    price_diff = df['Price'] - req.budget
    # If price <= budget, score is high with a gentle incentive for closer price / minor savings
    within_mask = price_diff <= 0
    budget_score = np.zeros(len(df), dtype=float)
    # Houses below budget: 1.0 - 0.25 * (budget - price)/budget
    budget_score[within_mask] = np.clip(1.0 - 0.25 * ((-price_diff[within_mask]) / req.budget), 0.70, 1.0)
    # Houses above budget: 1.0 - 1.5 * (price - budget)/budget
    budget_score[~within_mask] = np.clip(1.0 - 1.5 * (price_diff[~within_mask] / req.budget), 0.0, 1.0)

    # 3. Bedroom similarity
    bed_diff_ratio = (df['number of bedrooms'] - req.bedrooms).abs() / max(1.0, req.bedrooms)
    bed_score = np.clip(1.0 - bed_diff_ratio, 0.0, 1.0)

    # 4. Bathroom similarity
    bath_diff_ratio = (df['number of bathrooms'] - req.bathrooms).abs() / max(1.0, req.bathrooms)
    bath_score = np.clip(1.0 - bath_diff_ratio, 0.0, 1.0)

    # Final weighted similarity percentage [0 to 100%]
    total_score = (
        w_area * area_score +
        w_budget * budget_score +
        w_beds * bed_score +
        w_baths * bath_score
    ) * 100.0

    df['match_score'] = total_score
    df['area_score'] = area_score * 100.0
    df['budget_score'] = budget_score * 100.0
    df['bedroom_score'] = bed_score * 100.0
    df['bathroom_score'] = bath_score * 100.0

    # Sort descending by match score
    sorted_df = df.sort_values(by='match_score', ascending=False)
    top_5_df = sorted_df.head(5)

    top_matches: List[MatchedHouse] = []
    for rank_idx, (_, row) in enumerate(top_5_df.iterrows(), start=1):
        h_price = float(row['Price'])
        is_within = h_price <= req.budget
        b_diff = req.budget - h_price  # positive if within budget, negative if over

        why_points = _generate_why_selected_explanation(
            house_price=h_price,
            budget=req.budget,
            house_area=float(row['living area']),
            req_area=req.living_area,
            house_beds=float(row['number of bedrooms']),
            req_beds=req.bedrooms,
            house_baths=float(row['number of bathrooms']),
            req_baths=req.bathrooms,
            grade=int(row['grade of the house']),
            condition=int(row['condition of the house'])
        )

        top_matches.append(MatchedHouse(
            rank=rank_idx,
            id=int(row['id']),
            price=h_price,
            living_area=float(row['living area']),
            bedrooms=float(row['number of bedrooms']),
            bathrooms=float(row['number of bathrooms']),
            grade=int(row['grade of the house']),
            condition=int(row['condition of the house']),
            floors=float(row['number of floors']),
            built_year=int(row['Built Year']),
            airport_distance=float(row['Distance from the airport']),
            schools_nearby=int(row['Number of schools nearby']),
            area_score=round(float(row['area_score']), 1),
            budget_score=round(float(row['budget_score']), 1),
            bedroom_score=round(float(row['bedroom_score']), 1),
            bathroom_score=round(float(row['bathroom_score']), 1),
            match_score=round(float(row['match_score']), 1),
            is_within_budget=is_within,
            budget_diff=round(b_diff, 2),
            why_selected=why_points,
        ))

    best_match = top_matches[0]

    # Budget Gap Analysis for Best Match
    best_price = best_match.price
    if best_price <= req.budget:
        budget_status = "Within budget"
        diff_amount = req.budget - best_price
        diff_pct = (diff_amount / req.budget) * 100.0
        summary_msg = f"Your budget is sufficient. You have ₹{diff_amount:,.2f} ({diff_pct:.1f}%) remaining."
    else:
        budget_status = "Additional funding required"
        diff_amount = best_price - req.budget
        diff_pct = (diff_amount / req.budget) * 100.0
        summary_msg = f"Additional funding required: ₹{diff_amount:,.2f} ({diff_pct:.1f}% over your budget)."


    budget_gap = BudgetGapAnalysis(
        is_within_budget=best_match.is_within_budget,
        status=budget_status,
        user_budget=req.budget,
        best_match_price=best_price,
        difference_amount=round(diff_amount, 2),
        difference_pct=round(diff_pct, 2),
        summary_message=summary_msg,
    )

    # Affordability across entire dataset
    affordability = calculate_affordability_summary(req.budget)

    # Polynomial price prediction for the user's living area
    poly_estimate = polynomial_manager.predict(living_area=req.living_area, degree=2)

    return HouseMatchResponse(
        user_requirements={
            "budget": req.budget,
            "living_area": req.living_area,
            "bedrooms": req.bedrooms,
            "bathrooms": req.bathrooms,
            "weights": {
                "living_area": round(w_area, 2),
                "budget": round(w_budget, 2),
                "bedrooms": round(w_beds, 2),
                "bathrooms": round(w_baths, 2),
            }
        },
        polynomial_estimate=poly_estimate,
        best_match=best_match,
        top_5_matches=top_matches,
        budget_gap=budget_gap,
        affordability=affordability,
        why_selected_explanation=best_match.why_selected,
        methodology=(
            "Rule-based similarity score using normalized multi-attribute distance metrics: "
            f"Score = {w_area*100:.0f}% Area + {w_budget*100:.0f}% Budget + "
            f"{w_beds*100:.0f}% Bedrooms + {w_baths*100:.0f}% Bathrooms. "
            "Note: This is an analytical heuristic matching algorithm, not a supervised ML classifier."
        )
    )


def calculate_affordability_summary(budget: float) -> AffordabilitySummary:
    """Computes comprehensive affordability distribution for a given budget."""
    df = dataset_manager.get_df()
    total_count = len(df)
    affordable_df = df[df['Price'] <= budget]
    aff_count = len(affordable_df)

    pct_affordable = (aff_count / total_count * 100.0) if total_count > 0 else 0.0

    if aff_count > 0:
        med_area = float(affordable_df['living area'].median())
        mean_area = float(affordable_df['living area'].mean())
        avg_beds = float(affordable_df['number of bedrooms'].mean())
        avg_baths = float(affordable_df['number of bathrooms'].mean())
        min_p = float(affordable_df['Price'].min())
        max_p = float(affordable_df['Price'].max())
    else:
        med_area = 0.0
        mean_area = 0.0
        avg_beds = 0.0
        avg_baths = 0.0
        min_p = 0.0
        max_p = 0.0

    return AffordabilitySummary(
        user_budget=budget,
        affordable_houses_count=aff_count,
        total_houses_count=total_count,
        percentage_affordable=round(pct_affordable, 2),
        median_affordable_area=round(med_area, 1),
        average_affordable_area=round(mean_area, 1),
        average_bedrooms=round(avg_beds, 2),
        average_bathrooms=round(avg_baths, 2),
        min_price=round(min_p, 2),
        max_price=round(max_p, 2),
    )
