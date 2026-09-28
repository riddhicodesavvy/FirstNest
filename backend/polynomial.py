"""
backend/polynomial.py
Polynomial Curve Fitting (Degree 1, 2, 3) between Living Area and Price.
Uses strictly scikit-learn for PolynomialFeatures, LinearRegression, and train_test_split.
Calculates MSE, RMSE, R² for both training and test splits.
"""

from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

from backend.data_loader import dataset_manager
from backend.models import (
    PolynomialMetrics,
    PolynomialCurvePoint,
    ScatterSamplePoint,
    PolynomialTrainResponse,
    PolynomialPredictResponse,
)


class PolynomialModelManager:
    """Manages training, caching, and predictions for polynomial regression models."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PolynomialModelManager, cls).__new__(cls)
            cls._instance._trained_models = {}  # degree -> (model, poly_features, metrics)
            cls._instance._X_test = None
            cls._instance._y_test = None
            cls._instance._X_train = None
            cls._instance._y_train = None
            cls._instance._is_initialized = False
        return cls._instance

    def initialize_models(self, test_size: float = 0.2, random_state: int = 42) -> None:
        """Fit Degree 1, 2, 3 models on the training partition."""
        df = dataset_manager.get_df()
        X = df[['living area']].to_numpy(dtype=float)
        y = df['Price'].to_numpy(dtype=float)

        # Strict Train / Test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )

        self._X_train = X_train
        self._X_test = X_test
        self._y_train = y_train
        self._y_test = y_test
        self._trained_models = {}

        # Train degrees 1, 2, 3, 4
        for d in range(1, 5):
            poly = PolynomialFeatures(degree=d, include_bias=False)
            X_train_poly = poly.fit_transform(X_train)
            X_test_poly = poly.transform(X_test)

            model = LinearRegression()
            model.fit(X_train_poly, y_train)

            # Predictions
            y_pred_train = model.predict(X_train_poly)
            y_pred_test = model.predict(X_test_poly)

            # Train metrics
            mse_train = float(mean_squared_error(y_train, y_pred_train))
            rmse_train = float(np.sqrt(mse_train))
            r2_train = float(r2_score(y_train, y_pred_train))

            # Test metrics
            mse_test = float(mean_squared_error(y_test, y_pred_test))
            rmse_test = float(np.sqrt(mse_test))
            r2_test = float(r2_score(y_test, y_pred_test))

            # Equation string
            intercept = float(model.intercept_)
            coeffs = [float(c) for c in model.coef_]

            terms = [f"{intercept:,.1f}"]
            for idx, c in enumerate(coeffs):
                pow_val = idx + 1
                sign = "+" if c >= 0 else "-"
                abs_c = abs(c)
                if pow_val == 1:
                    terms.append(f"{sign} {abs_c:.2f}·x")
                else:
                    terms.append(f"{sign} {abs_c:.4e}·x^{pow_val}")
            equation_str = "Price = " + " ".join(terms)

            metrics = PolynomialMetrics(
                degree=d,
                mse_train=round(mse_train, 2),
                rmse_train=round(rmse_train, 2),
                r2_train=round(r2_train, 4),
                mse_test=round(mse_test, 2),
                rmse_test=round(rmse_test, 2),
                r2_test=round(r2_test, 4),
                equation=equation_str,
                coefficients=[round(c, 6) for c in coeffs],
                intercept=round(intercept, 2),
            )

            self._trained_models[d] = {
                "model": model,
                "poly": poly,
                "metrics": metrics,
            }

        self._is_initialized = True

    def train_and_evaluate(self, selected_degree: int = 2) -> PolynomialTrainResponse:
        """Returns comparison across degrees, curve coordinates, and scatter sample."""
        if not self._is_initialized:
            self.initialize_models()

        if selected_degree not in self._trained_models:
            selected_degree = 2

        selected_info = self._trained_models[selected_degree]
        selected_model: LinearRegression = selected_info["model"]
        selected_poly: PolynomialFeatures = selected_info["poly"]
        selected_metrics: PolynomialMetrics = selected_info["metrics"]

        # Comparison of degrees 1, 2, 3
        all_metrics = [
            self._trained_models[d]["metrics"]
            for d in sorted(self._trained_models.keys())
            if d <= 3
        ]

        # Generate smooth curve points across data domain
        df = dataset_manager.get_df()
        min_x = float(df['living area'].min())
        max_x = float(df['living area'].max())
        x_grid = np.linspace(min_x, max_x, 100).reshape(-1, 1)
        x_grid_poly = selected_poly.transform(x_grid)
        y_grid_pred = selected_model.predict(x_grid_poly)

        curve_points = [
            PolynomialCurvePoint(
                living_area=round(float(x_grid[i, 0]), 1),
                price_pred=round(float(y_grid_pred[i]), 2)
            )
            for i in range(len(x_grid))
        ]

        # Create stratified/sampled scatter dataset (300 points) for responsive UI charts
        sample_df = df[['living area', 'Price']].sample(n=min(350, len(df)), random_state=42)
        scatter_sample = [
            ScatterSamplePoint(
                living_area=round(float(row['living area']), 1),
                price=round(float(row['Price']), 2)
            )
            for _, row in sample_df.iterrows()
        ]

        return PolynomialTrainResponse(
            selected_degree=selected_degree,
            selected_model=selected_metrics,
            all_degrees_comparison=all_metrics,
            curve_points=curve_points,
            scatter_sample=scatter_sample,
        )

    def predict(self, living_area: float, degree: int = 2) -> PolynomialPredictResponse:
        """Predict house price for a given living area using the polynomial model."""
        if not self._is_initialized:
            self.initialize_models()

        if degree not in self._trained_models:
            degree = 2

        model_info = self._trained_models[degree]
        model: LinearRegression = model_info["model"]
        poly: PolynomialFeatures = model_info["poly"]
        metrics: PolynomialMetrics = model_info["metrics"]

        x_arr = np.array([[living_area]])
        x_poly = poly.transform(x_arr)
        pred_val = float(model.predict(x_poly)[0])

        return PolynomialPredictResponse(
            living_area=living_area,
            predicted_price=round(max(50000.0, pred_val), 2),  # lower clamp for extreme extrapolation
            degree=degree,
            equation=metrics.equation,
            disclaimer="Polynomial model estimate based on dataset curve fitting"
        )


# Singleton instance
polynomial_manager = PolynomialModelManager()
