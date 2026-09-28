"""
backend/main.py
FastAPI Server for Smart House Budget & Requirement Analyzer.
Exposes REST endpoints for Dataset Exploration, Descriptive Statistics,
Covariance & Correlation, Probability & Bayes Theorem, Polynomial Regression,
and House Matching with Budget Gap Analysis.
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.data_loader import dataset_manager
from backend.statistics import (
    calculate_feature_statistics,
    get_all_features_summary,
    calculate_covariance_matrix,
    calculate_correlation_matrix,
    KEY_NUMERICAL_FEATURES,
)
from backend.probability import (
    calculate_probability,
    calculate_conditional_probability,
    calculate_expectation,
)
from backend.bayes import calculate_bayes
from backend.polynomial import polynomial_manager
from backend.matcher import match_houses, calculate_affordability_summary
from backend.viva import VIVA_QUESTIONS
from backend.models import (
    DatasetSummaryResponse,
    DatasetPreviewResponse,
    FeatureStatistics,
    CovarianceResponse,
    CorrelationResponse,
    ProbabilityRequest,
    ProbabilityResponse,
    ConditionalProbabilityRequest,
    ConditionalProbabilityResponse,
    BayesRequest,
    BayesResponse,
    ExpectationResponse,
    PolynomialTrainRequest,
    PolynomialTrainResponse,
    PolynomialPredictRequest,
    PolynomialPredictResponse,
    HouseMatchRequest,
    HouseMatchResponse,
    AffordabilityRequest,
    AffordabilityResponse,
    VivaQuestion,
)

app = FastAPI(
    title="FirstNest — Smart House Budget & Requirement Analyzer API",
    description="Academic Unit-1 Machine Learning Backend: Statistics, Probability, Bayes Rule, Polynomial Regression, and House Matching",
    version="1.0.0"
)

# Enable CORS for local Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Load dataset and pre-train models on application startup."""
    print("Initializing FirstNest Smart House Analyzer backend...")
    dataset_manager.load_data()
    polynomial_manager.initialize_models()
    print("FirstNest backend initialization complete. Dataset loaded and polynomial models trained.")


@app.get("/api/health")
def health_check():
    """Service health status check."""
    return {"status": "ok", "app": "FirstNest"}



# -------------------------------------------------------------
# Core Module 1: Dataset Explorer Endpoints
# -------------------------------------------------------------
@app.get("/api/dataset/summary", response_model=DatasetSummaryResponse)
def get_dataset_summary():
    """Returns row counts, column counts, missing value audits, duplicates, and data types."""
    try:
        meta = dataset_manager.get_metadata()
        display_names = dataset_manager.get_feature_display_names()
        return DatasetSummaryResponse(
            total_raw_rows=meta["total_raw_rows"],
            total_raw_cols=meta["total_raw_cols"],
            clean_row_count=meta["clean_row_count"],
            clean_col_count=meta["clean_col_count"],
            missing_values=meta["missing_values_detected"],
            duplicates_removed=meta["duplicates_removed"],
            column_names=meta["column_names"],
            column_dtypes=meta["column_dtypes"],
            display_names=display_names,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dataset/preview", response_model=DatasetPreviewResponse)
def get_dataset_preview(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: Optional[str] = Query(default="Price"),
    sort_order: Optional[str] = Query(default="desc")
):
    """Returns paginated, sorted dataset rows for inspection."""
    try:
        df = dataset_manager.get_df()
        total_rows = len(df)

        if sort_by and sort_by in df.columns:
            ascending = (sort_order.lower() == "asc")
            df = df.sort_values(by=sort_by, ascending=ascending)

        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        page_df = df.iloc[start_idx:end_idx]

        # Convert to dictionary with native python types
        records = page_df.to_dict(orient="records")
        clean_records = []
        for r in records:
            clean_r = {}
            for k, v in r.items():
                if isinstance(v, (int, float, str, bool)):
                    clean_r[k] = v
                else:
                    clean_r[k] = float(v)
            clean_records.append(clean_r)

        return DatasetPreviewResponse(
            total_rows=total_rows,
            page=page,
            page_size=page_size,
            rows=clean_records,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Module 2: Statistical Analysis Endpoints
# -------------------------------------------------------------
@app.get("/api/statistics/{feature}", response_model=FeatureStatistics)
def get_feature_statistics(feature: str):
    """Calculates mean, median, mode, variance, std dev, Q1, Q2, Q3, IQR, outliers, and histogram."""
    try:
        return calculate_feature_statistics(feature)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/statistics/summary/all")
def get_all_statistics():
    """Returns overview table of all key numerical features."""
    try:
        return {"features": get_all_features_summary()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Module 3: Covariance & Correlation Endpoints
# -------------------------------------------------------------
@app.get("/api/covariance", response_model=CovarianceResponse)
def get_covariance():
    """Calculates covariance matrix and relationship breakdown for key features."""
    try:
        return calculate_covariance_matrix()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/correlation", response_model=CorrelationResponse)
def get_correlation():
    """Calculates correlation matrix, heatmap data, and dynamic verbal explanations."""
    try:
        return calculate_correlation_matrix()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Module 4: Probability Analysis Endpoint
# -------------------------------------------------------------
@app.post("/api/probability", response_model=ProbabilityResponse)
def evaluate_probability(req: ProbabilityRequest):
    """Direct probability: P(condition) = count / N."""
    try:
        return calculate_probability(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Module 5: Conditional Probability Endpoint
# -------------------------------------------------------------
@app.post("/api/conditional-probability", response_model=ConditionalProbabilityResponse)
def evaluate_conditional_probability(req: ConditionalProbabilityRequest):
    """Conditional probability: P(A | B) = P(A AND B) / P(B)."""
    try:
        return calculate_conditional_probability(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Module 6: Bayes' Theorem Endpoint
# -------------------------------------------------------------
@app.post("/api/bayes", response_model=BayesResponse)
def evaluate_bayes(req: BayesRequest):
    """Calculates Bayes' Theorem and compares against direct empirical calculation."""
    try:
        return calculate_bayes(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Module 7: Expectation Endpoint
# -------------------------------------------------------------
@app.get("/api/expectation/{feature}", response_model=ExpectationResponse)
def get_feature_expectation(feature: str):
    """Calculates mathematical expectation E[X] = sum(x * P(x)) for discrete or mean for continuous."""
    try:
        return calculate_expectation(feature)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Module 8: Polynomial Curve Fitting Endpoints
# -------------------------------------------------------------
@app.post("/api/polynomial/train", response_model=PolynomialTrainResponse)
def train_polynomial_models(req: PolynomialTrainRequest):
    """Trains polynomial regression models across degrees 1, 2, 3 with train/test split."""
    try:
        return polynomial_manager.train_and_evaluate(selected_degree=req.degree)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/polynomial/predict", response_model=PolynomialPredictResponse)
def predict_polynomial_price(req: PolynomialPredictRequest):
    """Predicts house price for given sqft using the trained polynomial model."""
    try:
        return polynomial_manager.predict(living_area=req.living_area, degree=req.degree)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Core Modules 9, 10, 11, 12: House Requirement Matcher & Budget Gap
# -------------------------------------------------------------
@app.post("/api/houses/match", response_model=HouseMatchResponse)
def match_houses_endpoint(req: HouseMatchRequest):
    """
    Ranks houses using transparent multi-criteria similarity metric,
    computes budget gap analysis, affordability summary, and polynomial estimate.
    """
    try:
        return match_houses(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/affordability", response_model=AffordabilityResponse)
def get_affordability_endpoint(req: AffordabilityRequest):
    """Returns dataset affordability statistics for a specific budget."""
    try:
        summary = calculate_affordability_summary(req.budget)
        return AffordabilityResponse(summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------------------
# Viva Mode Endpoint
# -------------------------------------------------------------
@app.get("/api/viva/qa", response_model=List[VivaQuestion])
def get_viva_qa():
    """Returns Unit 1 Viva examination questions, formulas, and in-depth explanations."""
    return [VivaQuestion(**q) for q in VIVA_QUESTIONS]


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
