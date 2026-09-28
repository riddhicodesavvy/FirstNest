"""
backend/data_loader.py
Dataset Loader & Preprocessor for Smart House Budget & Requirement Analyzer.
Handles dynamic CSV loading, missing value detection, duplicate checks,
and clean dataset caching.
"""

import os
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np


class DatasetManager:
    """Singleton-style manager to load, clean, and provide access to the House Price India dataset."""

    _instance: Optional["DatasetManager"] = None
    _df: Optional[pd.DataFrame] = None
    _raw_df: Optional[pd.DataFrame] = None
    _metadata: Dict[str, Any] = {}

    def __new__(cls) -> "DatasetManager":
        if cls._instance is None:
            cls._instance = super(DatasetManager, cls).__new__(cls)
            cls._instance._df = None
            cls._instance._raw_df = None
            cls._instance._metadata = {}
        return cls._instance

    @classmethod
    def find_csv_path(cls) -> str:
        """Find the House Price India.csv file dynamically across common relative paths."""
        potential_paths = [
            os.path.join(os.getcwd(), "House Price India.csv"),
            os.path.join(os.path.dirname(__file__), "..", "House Price India.csv"),
            os.path.join(os.path.dirname(__file__), "House Price India.csv"),
            "House Price India.csv",
        ]
        for path in potential_paths:
            normalized = os.path.abspath(path)
            if os.path.exists(normalized):
                return normalized
        raise FileNotFoundError("Could not find 'House Price India.csv'. Please ensure the file is in the project directory.")

    def load_data(self, force_reload: bool = False) -> pd.DataFrame:
        """Load and audit dataset programmatically."""
        if self._df is not None and not force_reload:
            return self._df

        csv_path = self.find_csv_path()
        raw_df = pd.read_csv(csv_path)
        self._raw_df = raw_df.copy()

        # Audit information
        total_raw_rows = len(raw_df)
        total_raw_cols = len(raw_df.columns)
        missing_by_col = raw_df.isnull().sum().to_dict()
        duplicate_count = int(raw_df.duplicated().sum())

        # Clean dataset without silently deleting rows
        df = raw_df.copy()
        if duplicate_count > 0:
            df = df.drop_duplicates()

        # Ensure correct numeric types for key columns
        numeric_cols = [
            'number of bedrooms', 'number of bathrooms', 'living area', 'lot area',
            'number of floors', 'waterfront present', 'number of views',
            'condition of the house', 'grade of the house',
            'Area of the house(excluding basement)', 'Area of the basement',
            'Built Year', 'Renovation Year', 'Postal Code', 'Lattitude', 'Longitude',
            'living_area_renov', 'lot_area_renov', 'Number of schools nearby',
            'Distance from the airport', 'Price'
        ]

        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')

        # Drop any row that might have introduced NaN from conversion
        initial_clean_rows = len(df)
        df = df.dropna()
        dropped_nan_rows = initial_clean_rows - len(df)

        self._df = df
        self._metadata = {
            "csv_path": csv_path,
            "total_raw_rows": total_raw_rows,
            "total_raw_cols": total_raw_cols,
            "clean_row_count": len(df),
            "clean_col_count": len(df.columns),
            "missing_values_detected": missing_by_col,
            "duplicates_removed": duplicate_count,
            "invalid_numerical_rows_removed": dropped_nan_rows,
            "column_names": list(df.columns),
            "column_dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        }
        return self._df

    def get_df(self) -> pd.DataFrame:
        """Get the cached clean DataFrame."""
        if self._df is None:
            return self.load_data()
        return self._df

    def get_metadata(self) -> Dict[str, Any]:
        """Get dataset metadata and audit logs."""
        if not self._metadata:
            self.load_data()
        return self._metadata

    @staticmethod
    def get_feature_display_names() -> Dict[str, str]:
        """Mapping from dataset column names to clean human-readable UI titles."""
        return {
            "Price": "Price (₹)",
            "living area": "Living Area (sqft)",
            "lot area": "Lot Area (sqft)",
            "number of bedrooms": "Bedrooms",
            "number of bathrooms": "Bathrooms",
            "grade of the house": "Construction Grade (1-13)",
            "condition of the house": "Condition (1-5)",
            "number of floors": "Floors",
            "Area of the house(excluding basement)": "Living Area (Excl. Basement)",
            "Area of the basement": "Basement Area (sqft)",
            "Built Year": "Built Year",
            "Renovation Year": "Renovation Year",
            "Distance from the airport": "Distance to Airport (km)",
            "Number of schools nearby": "Nearby Schools",
        }



# Convenience singleton instance
dataset_manager = DatasetManager()
