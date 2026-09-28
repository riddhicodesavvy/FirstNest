"""
backend/models.py
Pydantic Schemas for Requests, Responses, and Statistical Structures.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


# -------------------------------------------------------------
# Dataset Models
# -------------------------------------------------------------
class DatasetSummaryResponse(BaseModel):
    total_raw_rows: int
    total_raw_cols: int
    clean_row_count: int
    clean_col_count: int
    missing_values: Dict[str, int]
    duplicates_removed: int
    column_names: List[str]
    column_dtypes: Dict[str, str]
    display_names: Dict[str, str]


class DataPreviewRow(BaseModel):
    id: int
    Price: float
    living_area: float = Field(alias="living area")
    lot_area: float = Field(alias="lot area")
    bedrooms: float = Field(alias="number of bedrooms")
    bathrooms: float = Field(alias="number of bathrooms")
    grade: int = Field(alias="grade of the house")
    condition: int = Field(alias="condition of the house")
    Built_Year: int = Field(alias="Built Year")
    Distance_airport: float = Field(alias="Distance from the airport")

    class Config:
        populate_by_name = True


class DatasetPreviewResponse(BaseModel):
    total_rows: int
    page: int
    page_size: int
    rows: List[Dict[str, Any]]


# -------------------------------------------------------------
# Statistical Analysis Models
# -------------------------------------------------------------
class HistogramBin(BaseModel):
    bin_start: float
    bin_end: float
    label: str
    count: int


class BoxplotStats(BaseModel):
    min: float
    q1: float
    median: float
    q3: float
    max: float
    iqr: float
    lower_fence: float
    upper_fence: float
    outlier_count: int


class FeatureStatistics(BaseModel):
    feature_name: str
    display_name: str
    count: int
    mean: float
    median: float
    mode: float
    variance: float
    std_dev: float
    min: float
    max: float
    q1: float
    q2: float
    q3: float
    iqr: float
    outliers_count: int
    histogram: List[HistogramBin]
    boxplot: BoxplotStats


class AllFeaturesSummary(BaseModel):
    features: List[Dict[str, Any]]


# -------------------------------------------------------------
# Covariance & Correlation Models
# -------------------------------------------------------------
class KeyPairRelationship(BaseModel):
    feature_x: str
    feature_y: str
    covariance: float
    correlation: float
    relationship: str
    direction: str
    strength: str
    explanation: str


class CovarianceResponse(BaseModel):
    features: List[str]
    matrix: List[List[float]]
    key_pairs: List[KeyPairRelationship]


class CorrelationHeatmapCell(BaseModel):
    x: str
    y: str
    value: float


class CorrelationResponse(BaseModel):
    features: List[str]
    matrix: List[List[float]]
    heatmap_data: List[CorrelationHeatmapCell]
    key_pairs: List[KeyPairRelationship]
    explanations: List[str]


# -------------------------------------------------------------
# Probability Models
# -------------------------------------------------------------
class ProbabilityCondition(BaseModel):
    feature: str
    operator: str  # "<", "<=", ">", ">=", "==", "!="
    value: float


class ProbabilityRequest(BaseModel):
    conditions: List[ProbabilityCondition]
    logic: str = "AND"  # "AND" or "OR"


class ProbabilityResponse(BaseModel):
    conditions_description: str
    matching_rows: int
    total_rows: int
    probability: float
    percentage: float
    feature_distribution_hint: Optional[Dict[str, Any]] = None


class ConditionalProbabilityRequest(BaseModel):
    condition_a: ProbabilityCondition
    condition_b: ProbabilityCondition


class ConditionalProbabilityResponse(BaseModel):
    p_a: float
    p_b: float
    p_a_and_b: float
    p_a_given_b: float
    count_a: int
    count_b: int
    count_a_and_b: int
    total_rows: int
    description_a: str
    description_b: str
    explanation: str
    formula: str


# -------------------------------------------------------------
# Bayes Theorem Models
# -------------------------------------------------------------
class BayesRequest(BaseModel):
    hypothesis_a: ProbabilityCondition  # Event A (e.g. Bedrooms >= 3)
    evidence_b: ProbabilityCondition    # Event B (e.g. Price < 500000)


class BayesResponse(BaseModel):
    prior_p_a: float
    evidence_p_b: float
    likelihood_p_b_given_a: float
    direct_posterior_p_a_given_b: float
    bayes_posterior_p_a_given_b: float
    difference: float
    values_match: bool
    count_a: int
    count_b: int
    count_a_and_b: int
    total_rows: int
    description_a: str
    description_b: str
    formula_steps: Dict[str, str]
    explanation: str


# -------------------------------------------------------------
# Expectation Models
# -------------------------------------------------------------
class DiscreteExpectationItem(BaseModel):
    value: float
    count: int
    probability: float
    contribution: float


class ExpectationResponse(BaseModel):
    feature: str
    display_name: str
    is_discrete: bool
    expected_value: float
    mean_value: float
    formula_explanation: str
    discrete_breakdown: Optional[List[DiscreteExpectationItem]] = None


# -------------------------------------------------------------
# Polynomial Regression Models
# -------------------------------------------------------------
class PolynomialMetrics(BaseModel):
    degree: int
    mse_train: float
    rmse_train: float
    r2_train: float
    mse_test: float
    rmse_test: float
    r2_test: float
    equation: str
    coefficients: List[float]
    intercept: float


class PolynomialCurvePoint(BaseModel):
    living_area: float
    price_pred: float


class ScatterSamplePoint(BaseModel):
    living_area: float
    price: float


class PolynomialTrainRequest(BaseModel):
    degree: int = Field(default=2, ge=1, le=5)
    test_size: float = Field(default=0.2, gt=0.05, lt=0.5)
    random_state: int = Field(default=42)


class PolynomialTrainResponse(BaseModel):
    selected_degree: int
    selected_model: PolynomialMetrics
    all_degrees_comparison: List[PolynomialMetrics]
    curve_points: List[PolynomialCurvePoint]
    scatter_sample: List[ScatterSamplePoint]


class PolynomialPredictRequest(BaseModel):
    living_area: float = Field(..., gt=100, lt=50000)
    degree: int = Field(default=2, ge=1, le=5)


class PolynomialPredictResponse(BaseModel):
    living_area: float
    predicted_price: float
    degree: int
    equation: str
    disclaimer: str = "Polynomial model estimate based on dataset curve fitting"


# -------------------------------------------------------------
# House Matcher & Budget Gap Models
# -------------------------------------------------------------
class HouseMatchRequest(BaseModel):
    budget: float = Field(..., gt=1000)
    living_area: float = Field(..., gt=100)
    bedrooms: float = Field(..., gt=0)
    bathrooms: float = Field(..., gt=0)
    min_grade: Optional[int] = Field(default=None, ge=1, le=13)
    min_condition: Optional[int] = Field(default=None, ge=1, le=5)
    max_price: Optional[float] = None
    weight_area: float = Field(default=0.40, ge=0.0, le=1.0)
    weight_budget: float = Field(default=0.30, ge=0.0, le=1.0)
    weight_bedroom: float = Field(default=0.15, ge=0.0, le=1.0)
    weight_bathroom: float = Field(default=0.15, ge=0.0, le=1.0)


class MatchedHouse(BaseModel):
    rank: int
    id: int
    price: float
    living_area: float
    bedrooms: float
    bathrooms: float
    grade: int
    condition: int
    floors: float
    built_year: int
    airport_distance: float
    schools_nearby: int
    area_score: float
    budget_score: float
    bedroom_score: float
    bathroom_score: float
    match_score: float  # Percentage [0 - 100]
    is_within_budget: bool
    budget_diff: float
    why_selected: List[str]


class BudgetGapAnalysis(BaseModel):
    is_within_budget: bool
    status: str
    user_budget: float
    best_match_price: float
    difference_amount: float
    difference_pct: float
    summary_message: str


class AffordabilitySummary(BaseModel):
    user_budget: float
    affordable_houses_count: int
    total_houses_count: int
    percentage_affordable: float
    median_affordable_area: float
    average_affordable_area: float
    average_bedrooms: float
    average_bathrooms: float
    min_price: float
    max_price: float


class HouseMatchResponse(BaseModel):
    user_requirements: Dict[str, Any]
    polynomial_estimate: PolynomialPredictResponse
    best_match: MatchedHouse
    top_5_matches: List[MatchedHouse]
    budget_gap: BudgetGapAnalysis
    affordability: AffordabilitySummary
    why_selected_explanation: List[str]
    methodology: str = "Rule-based weighted similarity score (Normalized distances). Not an ML model prediction."


class AffordabilityRequest(BaseModel):
    budget: float = Field(..., gt=1000)


class AffordabilityResponse(BaseModel):
    summary: AffordabilitySummary



# -------------------------------------------------------------
# Viva Q&A Model
# -------------------------------------------------------------
class VivaQuestion(BaseModel):
    id: int
    question: str
    concept: str
    short_answer: str
    in_depth_explanation: str
    mathematical_formula: Optional[str] = None
    dataset_context: str
