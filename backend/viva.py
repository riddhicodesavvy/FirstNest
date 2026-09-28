"""
backend/viva.py
Academic Viva Guide & Unit-1 Concept Explanations.
Comprehensive questions, answers, and syllabus mappings tailored for viva examinations.
"""

from typing import List, Dict, Any

VIVA_QUESTIONS: List[Dict[str, Any]] = [
    {
        "id": 1,
        "question": "What is the Mean, and how is it used in this project?",
        "concept": "Measures of Central Tendency (Unit 1)",
        "short_answer": "The arithmetic mean is the sum of all observed values divided by the total number of observations: μ = (1/N) Σ x_i.",
        "in_depth_explanation": (
            "The mean represents the central balance point of a dataset. In our housing dataset of 14,619 records, "
            "the average house price is ~$538,806 and average living area is ~2,098 sqft. "
            "However, the mean is sensitive to extreme outliers (such as luxury mansions priced at $7.7M), "
            "which is why comparing the mean to the median is crucial to identify right-skewness."
        ),
        "mathematical_formula": "μ = \\frac{1}{N} \\sum_{i=1}^{N} x_i",
        "dataset_context": "Calculated dynamically across Price, Living Area, Bedrooms, Bathrooms, and Grade."
    },
    {
        "id": 2,
        "question": "What is Variance and Standard Deviation, and why do we use (N - 1) in the denominator?",
        "concept": "Measures of Dispersion (Unit 1)",
        "short_answer": "Variance measures the average squared deviation of data points from their mean. Standard deviation is its square root, in original data units.",
        "in_depth_explanation": (
            "Variance s² = Σ(x_i - x̄)² / (N - 1). We divide by (N - 1) rather than N to apply Bessel's Correction, "
            "which provides an unbiased estimator of the population variance from a sample. Standard deviation "
            "expresses this spread in the original feature unit (e.g., dollars for Price or square feet for Area), "
            "quantifying volatility and dispersion."
        ),
        "mathematical_formula": "s^2 = \\frac{1}{N-1} \\sum_{i=1}^{N} (x_i - \\bar{x})^2, \\quad s = \\sqrt{s^2}",
        "dataset_context": "Sample variance and standard deviation are programmatically computed with ddof=1 for all numerical features."
    },
    {
        "id": 3,
        "question": "What is Covariance, and how does it differ from Correlation?",
        "concept": "Bivariate Statistics & Association (Unit 1)",
        "short_answer": "Covariance measures the directional joint variability between two variables. Correlation standardizes covariance into a scale from -1 to +1.",
        "in_depth_explanation": (
            "Cov(X, Y) = (1 / (N - 1)) Σ (x_i - x̄)(y_i - ȳ). A positive covariance indicates that when X increases, Y tends to increase. "
            "However, covariance depends on the units of measurement (e.g., sqft × dollars), making it impossible to judge association strength directly. "
            "Pearson's correlation coefficient r = Cov(X, Y) / (s_x · s_y) normalizes this to [-1, 1], where +1 is perfect positive correlation, "
            "0 is no linear association, and -1 is perfect negative correlation. In our dataset, living area and price have r ≈ 0.70."
        ),
        "mathematical_formula": "Cov(X,Y) = \\frac{1}{N-1} \\sum (x_i - \\bar{x})(y_i - \\bar{y}), \\quad r = \\frac{Cov(X,Y)}{s_X s_Y}",
        "dataset_context": "Calculated between Living Area, Bedrooms, Bathrooms, Grade, Lot Area, and Price."
    },
    {
        "id": 4,
        "question": "What is Conditional Probability, and how is it evaluated here?",
        "concept": "Probability Theory & Conditioning (Unit 1)",
        "short_answer": "Conditional probability P(A|B) is the probability of event A occurring given that event B is already known to have occurred.",
        "in_depth_explanation": (
            "The formula is P(A|B) = P(A ∩ B) / P(B), provided P(B) > 0. In empirical frequency terms, this equals "
            "Count(A AND B) / Count(B). For instance, if B is 'Price < $500,000' and A is 'Bedrooms >= 3', "
            "conditional probability restricts the sample space exclusively to houses priced below $500k, and calculates "
            "what fraction of that sub-population has 3 or more bedrooms."
        ),
        "mathematical_formula": "P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{Count(A \\cap B)}{Count(B)}",
        "dataset_context": "Directly computed by querying intersecting boolean masks on the dataset DataFrame."
    },
    {
        "id": 5,
        "question": "What is Bayes' Theorem, and how does this application verify it?",
        "concept": "Bayes' Rule & Posterior Inference (Unit 1)",
        "short_answer": "Bayes' theorem calculates the posterior probability P(A|B) by updating the prior P(A) with likelihood P(B|A) and evidence P(B).",
        "in_depth_explanation": (
            "P(A|B) = [P(B|A) · P(A)] / P(B). In our system, we select a hypothesis A (e.g., house has 3+ bedrooms) and evidence B "
            "(e.g., price is under $500,000). The app computes the empirical Prior P(A), Likelihood P(B|A), and Evidence P(B). "
            "It then calculates Bayes' formula and compares it against direct filtering P(A|B) = Count(A ∩ B) / Count(B). "
            "The two calculations match within 10⁻¹⁰ precision, providing absolute empirical proof of Bayes' theorem."
        ),
        "mathematical_formula": "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
        "dataset_context": "Demonstrated with interactive selectors and step-by-step arithmetic traces."
    },
    {
        "id": 6,
        "question": "What is Polynomial Curve Fitting, and why is it considered a Unit-1 concept?",
        "concept": "Curve Fitting & Supervised Foundations (Unit 1)",
        "short_answer": "Polynomial curve fitting models the non-linear relationship between an independent variable X and dependent variable Y as a degree-d polynomial.",
        "in_depth_explanation": (
            "Unit 1 introduces curve fitting as the foundational bridge between analytical calculus and supervised machine learning. "
            "For X = Living Area and Y = Price, Degree 1 represents standard linear regression (y = a₀ + a₁x). "
            "Degree 2 (y = a₀ + a₁x + a₂x²) and Degree 3 (y = a₀ + a₁x + a₂x² + a₃x³) introduce curvature to capture non-linear market pricing, "
            "where larger homes often exhibit non-linear square-footage value appreciation."
        ),
        "mathematical_formula": "\\hat{y} = a_0 + a_1 x + a_2 x^2 + \\dots + a_d x^d",
        "dataset_context": "Fitted on living area vs price using scikit-learn LinearRegression with PolynomialFeatures."
    },
    {
        "id": 7,
        "question": "Why do we use Train/Test Split in Polynomial Regression?",
        "concept": "Generalization & Overfitting Avoidance (Unit 1)",
        "short_answer": "To evaluate how well our model generalizes to unseen data and detect overfitting.",
        "in_depth_explanation": (
            "If we evaluate a model only on the data it was trained on, higher-degree polynomials can memorize noise and achieve "
            "artificially low training error (overfitting). By splitting the 14,619 houses into an 80% training set and 20% testing set, "
            "we fit polynomial coefficients strictly on the training partition and test on the unseen test partition. "
            "This guarantees that the reported R² and RMSE reflect true generalization performance."
        ),
        "mathematical_formula": "D = D_{train} \\cup D_{test}, \\quad D_{train} \\cap D_{test} = \\emptyset",
        "dataset_context": "80/20 train/test split with random_state=42."
    },
    {
        "id": 8,
        "question": "What is R² (Coefficient of Determination)?",
        "concept": "Model Evaluation Metrics (Unit 1)",
        "short_answer": "R² measures the proportion of total variance in the dependent variable explained by the regression model.",
        "in_depth_explanation": (
            "R² = 1 - (SS_res / SS_tot), where SS_res = Σ(y_i - ŷ_i)² is the residual sum of squares and SS_tot = Σ(y_i - ȳ)² is the total sum of squares. "
            "An R² of 1.0 means the model perfectly predicts the target; an R² of 0.0 means the model performs no better than predicting the mean ȳ. "
            "In our project, living area alone explains ~49% of price variance (R² ≈ 0.49)."
        ),
        "mathematical_formula": "R^2 = 1 - \\frac{\\sum_{i=1}^N (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^N (y_i - \\bar{y})^2}",
        "dataset_context": "Reported on both training and test sets for Degrees 1, 2, and 3."
    },
    {
        "id": 9,
        "question": "What is RMSE (Root Mean Squared Error) and why is it preferred over MSE?",
        "concept": "Error Metrics (Unit 1)",
        "short_answer": "RMSE is the square root of the mean squared errors between actual and predicted values: RMSE = sqrt(MSE).",
        "in_depth_explanation": (
            "While MSE (Mean Squared Error) squares the errors, its units are squared dollars ($²), which is unintuitive for stakeholders. "
            "RMSE takes the square root, returning the error metric to the original unit ($ dollars). "
            "Furthermore, because deviations are squared before averaging, RMSE penalizes large errors more heavily than MAE (Mean Absolute Error)."
        ),
        "mathematical_formula": "RMSE = \\sqrt{\\frac{1}{N} \\sum_{i=1}^{N} (y_i - \\hat{y}_i)^2}",
        "dataset_context": "Displayed alongside MSE and R² for each polynomial degree."
    },
    {
        "id": 10,
        "question": "Why is the House Matching Score NOT an ML model?",
        "concept": "Heuristic Similarity vs. Machine Learning (Unit 1)",
        "short_answer": "The matching score is a deterministic rule-based similarity metric based on normalized distances, not a model trained via gradient descent or statistical loss minimization.",
        "in_depth_explanation": (
            "An ML model learns parameters (weights, coefficients) from data by minimizing a loss function (like MSE). "
            "Our house matching algorithm, conversely, is an analytical multi-criteria decision heuristic (MCDM). "
            "It computes normalized relative distances for living area, budget, bedrooms, and bathrooms, and takes a configurable "
            "weighted sum: Score = 0.40·Area + 0.30·Budget + 0.15·Beds + 0.15·Baths. "
            "It represents an expert-designed utility function rather than a predictive machine learning algorithm. "
            "Being transparent about this distinction is a critical mark of rigorous engineering."
        ),
        "mathematical_formula": "S_{match} = 100 \\times \\sum_{k} w_k \\cdot (1 - \\text{dist}_k)",
        "dataset_context": "Clearly labeled in the UI as 'rule-based similarity score' and completely distinct from the polynomial model."
    }
]
