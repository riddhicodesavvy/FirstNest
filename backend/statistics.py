"""
backend/statistics.py
Programmatic implementation of Machine Learning Unit-1 statistical foundations:
Mean, Median, Mode, Variance, Standard Deviation, Quantiles, IQR, Covariance, Correlation.
All values are computed dynamically from the clean dataset.
"""

from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd
from scipy import stats as sp_stats

from backend.data_loader import dataset_manager
from backend.models import (
    FeatureStatistics,
    HistogramBin,
    BoxplotStats,
    CovarianceResponse,
    CorrelationResponse,
    CorrelationHeatmapCell,
    KeyPairRelationship,
)

# Standard key numerical features for statistical analysis
KEY_NUMERICAL_FEATURES = [
    "Price",
    "living area",
    "lot area",
    "number of bedrooms",
    "number of bathrooms",
    "grade of the house",
    "condition of the house",
    "Distance from the airport",
]


def calculate_feature_statistics(feature_name: str) -> FeatureStatistics:
    """
    Calculate comprehensive descriptive statistics for a chosen numerical feature.
    Explicitly implements:
    - Count
    - Mean: sum(x) / N
    - Median: 50th percentile
    - Mode: argmax_x P(X = x)
    - Variance: sum((x - mean)^2) / (N - 1)
    - Standard Deviation: sqrt(variance)
    - Min, Max
    - Q1, Q2, Q3, IQR: Q3 - Q1
    - 1.5 * IQR Outlier detection
    - Binned distribution (histogram)
    """
    df = dataset_manager.get_df()
    if feature_name not in df.columns:
        raise ValueError(f"Feature '{feature_name}' not found in dataset columns: {list(df.columns)}")

    series = df[feature_name].dropna().to_numpy(dtype=float)
    display_names = dataset_manager.get_feature_display_names()
    disp_name = display_names.get(feature_name, feature_name)

    n = len(series)
    if n == 0:
        raise ValueError(f"Feature '{feature_name}' has no valid numeric rows.")

    # Mathematical calculations
    mean_val = float(np.mean(series))
    median_val = float(np.median(series))

    # Mode using scipy stats mode
    mode_res = sp_stats.mode(series, keepdims=True)
    mode_val = float(mode_res.mode[0]) if len(mode_res.mode) > 0 else median_val

    # Sample variance (ddof=1) & Sample standard deviation
    variance_val = float(np.var(series, ddof=1))
    std_val = float(np.std(series, ddof=1))

    min_val = float(np.min(series))
    max_val = float(np.max(series))

    # Quantiles (Q1 = 25th percentile, Q2 = 50th percentile, Q3 = 75th percentile)
    q1_val = float(np.percentile(series, 25))
    q2_val = float(np.percentile(series, 50))
    q3_val = float(np.percentile(series, 75))
    iqr_val = float(q3_val - q1_val)

    # Tukey's Boxplot Fences for Outlier Detection
    lower_fence = float(q1_val - 1.5 * iqr_val)
    upper_fence = float(q3_val + 1.5 * iqr_val)
    outliers = series[(series < lower_fence) | (series > upper_fence)]
    outlier_count = int(len(outliers))

    # Histogram generation (15 bins for smooth visualization)
    # For discrete features with few unique values (e.g. condition, grade, bedrooms), bin on unique values
    unique_vals = np.unique(series)
    num_unique = len(unique_vals)

    histogram_bins: List[HistogramBin] = []
    if num_unique <= 15:
        # Categorical/discrete style bins
        for val in sorted(unique_vals):
            cnt = int(np.sum(series == val))
            histogram_bins.append(HistogramBin(
                bin_start=float(val),
                bin_end=float(val),
                label=f"{int(val) if val.is_integer() else val}",
                count=cnt
            ))
    else:
        # Continuous binned frequency
        num_bins = 18
        counts, bin_edges = np.histogram(series, bins=num_bins)
        for i in range(len(counts)):
            b_start = float(bin_edges[i])
            b_end = float(bin_edges[i + 1])
            # Friendly label formatting
            if max_val >= 10000:
                lbl = f"{int(b_start // 1000)}k-{int(b_end // 1000)}k"
            elif max_val >= 1000:
                lbl = f"{int(b_start)}-{int(b_end)}"
            else:
                lbl = f"{b_start:.1f}-{b_end:.1f}"
            histogram_bins.append(HistogramBin(
                bin_start=round(b_start, 2),
                bin_end=round(b_end, 2),
                label=lbl,
                count=int(counts[i])
            ))

    boxplot_stats = BoxplotStats(
        min=round(min_val, 2),
        q1=round(q1_val, 2),
        median=round(median_val, 2),
        q3=round(q3_val, 2),
        max=round(max_val, 2),
        iqr=round(iqr_val, 2),
        lower_fence=round(lower_fence, 2),
        upper_fence=round(upper_fence, 2),
        outlier_count=outlier_count,
    )

    return FeatureStatistics(
        feature_name=feature_name,
        display_name=disp_name,
        count=n,
        mean=round(mean_val, 2),
        median=round(median_val, 2),
        mode=round(mode_val, 2),
        variance=round(variance_val, 2),
        std_dev=round(std_val, 2),
        min=round(min_val, 2),
        max=round(max_val, 2),
        q1=round(q1_val, 2),
        q2=round(q2_val, 2),
        q3=round(q3_val, 2),
        iqr=round(iqr_val, 2),
        outliers_count=outlier_count,
        histogram=histogram_bins,
        boxplot=boxplot_stats,
    )


def get_all_features_summary() -> List[Dict[str, Any]]:
    """Return descriptive stats for all key numerical features."""
    results = []
    for feat in KEY_NUMERICAL_FEATURES:
        stats = calculate_feature_statistics(feat)
        results.append({
            "feature": feat,
            "display_name": stats.display_name,
            "count": stats.count,
            "mean": stats.mean,
            "median": stats.median,
            "mode": stats.mode,
            "variance": stats.variance,
            "std_dev": stats.std_dev,
            "min": stats.min,
            "max": stats.max,
            "q1": stats.q1,
            "q3": stats.q3,
            "iqr": stats.iqr,
            "outliers_count": stats.outliers_count
        })
    return results


def calculate_covariance_matrix() -> CovarianceResponse:
    """
    Calculate sample covariance matrix:
    Cov(X, Y) = (1 / (N - 1)) * sum((X_i - mean_X) * (Y_i - mean_Y))
    """
    df = dataset_manager.get_df()
    sub_df = df[KEY_NUMERICAL_FEATURES]
    cov_matrix_df = sub_df.cov()

    matrix_data = [
        [round(float(val), 2) for val in row]
        for row in cov_matrix_df.to_numpy()
    ]

    # Calculate key required pairs with explanations
    key_pairs = _evaluate_key_pairs(df, cov_matrix_df, sub_df.corr())

    return CovarianceResponse(
        features=KEY_NUMERICAL_FEATURES,
        matrix=matrix_data,
        key_pairs=key_pairs
    )


def calculate_correlation_matrix() -> CorrelationResponse:
    """
    Calculate Pearson correlation matrix:
    r = Cov(X, Y) / (std_X * std_Y)
    Values are bounded between -1 and +1.
    """
    df = dataset_manager.get_df()
    sub_df = df[KEY_NUMERICAL_FEATURES]
    corr_matrix_df = sub_df.corr()
    cov_matrix_df = sub_df.cov()

    matrix_data = [
        [round(float(val), 4) for val in row]
        for row in corr_matrix_df.to_numpy()
    ]

    heatmap_cells: List[CorrelationHeatmapCell] = []
    for i, col_y in enumerate(KEY_NUMERICAL_FEATURES):
        for j, col_x in enumerate(KEY_NUMERICAL_FEATURES):
            heatmap_cells.append(CorrelationHeatmapCell(
                x=col_x,
                y=col_y,
                value=round(float(corr_matrix_df.iloc[i, j]), 3)
            ))

    key_pairs = _evaluate_key_pairs(df, cov_matrix_df, corr_matrix_df)
    explanations = [pair.explanation for pair in key_pairs]

    return CorrelationResponse(
        features=KEY_NUMERICAL_FEATURES,
        matrix=matrix_data,
        heatmap_data=heatmap_cells,
        key_pairs=key_pairs,
        explanations=explanations
    )


def _evaluate_key_pairs(
    df: pd.DataFrame,
    cov_df: pd.DataFrame,
    corr_df: pd.DataFrame
) -> List[KeyPairRelationship]:
    """Helper to evaluate and generate mathematically grounded verbal explanations for required pairs."""
    target_pairs = [
        ("living area", "Price"),
        ("number of bedrooms", "Price"),
        ("number of bathrooms", "Price"),
        ("grade of the house", "Price"),
        ("lot area", "Price"),
    ]

    results: List[KeyPairRelationship] = []
    display_names = dataset_manager.get_feature_display_names()

    for x_feat, y_feat in target_pairs:
        cov_val = float(cov_df.loc[x_feat, y_feat])
        corr_val = float(corr_df.loc[x_feat, y_feat])

        # Direction
        if corr_val > 0.05:
            direction = "Positive"
        elif corr_val < -0.05:
            direction = "Negative"
        else:
            direction = "Negligible / Uncorrelated"

        # Strength categorization
        abs_r = abs(corr_val)
        if abs_r >= 0.7:
            strength = "Strong"
        elif abs_r >= 0.4:
            strength = "Moderate"
        elif abs_r >= 0.2:
            strength = "Weak"
        else:
            strength = "Very Weak"

        x_disp = display_names.get(x_feat, x_feat)
        y_disp = display_names.get(y_feat, y_feat)

        if direction == "Positive":
            explanation = (
                f"{x_disp} and {y_disp} show a {strength.lower()} positive relationship "
                f"(Cov = {cov_val:,.1f}, r = {corr_val:.2f}). In this dataset, houses with higher "
                f"{x_disp.lower()} consistently tend to command higher prices."
            )
        elif direction == "Negative":
            explanation = (
                f"{x_disp} and {y_disp} show a {strength.lower()} negative relationship "
                f"(Cov = {cov_val:,.1f}, r = {corr_val:.2f}). Properties with higher "
                f"{x_disp.lower()} tend to have lower prices."
            )
        else:
            explanation = (
                f"{x_disp} and {y_disp} show virtually no linear association "
                f"(Cov = {cov_val:,.1f}, r = {corr_val:.2f}). Variation in {x_disp.lower()} "
                f"does not meaningfully track with price variations."
            )

        results.append(KeyPairRelationship(
            feature_x=x_feat,
            feature_y=y_feat,
            covariance=round(cov_val, 2),
            correlation=round(corr_val, 4),
            relationship=f"{strength} {direction}",
            direction=direction,
            strength=strength,
            explanation=explanation,
        ))

    return results
