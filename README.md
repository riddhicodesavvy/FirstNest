# FirstNest: Smart House Budget & Requirement Analyzer
### Academic Machine Learning Unit-1 Comprehensive Project
*Built with Python, FastAPI, Pandas, NumPy, SciPy, Scikit-Learn, React, Vite, and Tailwind CSS.*

---

## 1. Project Overview

**FirstNest** is an end-to-end Machine Learning Unit-1 academic application designed to bridge statistical theory, probability modeling, supervised polynomial curve fitting, and multi-criteria decision intelligence. All monetary valuations throughout FirstNest are strictly denominated in **Indian Rupees (₹)**.

The application dynamically loads and explores the real-world **House Price India** dataset (14,619 housing transactions across 23 numerical and spatial features), computing all statistics, probabilities, and model regressions programmatically without synthetic data or hardcoded results.

### Key Capabilities:
- **Dataset Exploration:** Dynamic loading, data integrity verification, zero-missing-value confirmation, and interactive tabular browsing.
- **Descriptive Statistics:** Programmatic evaluation of Mean, Median, Mode, Sample Variance ($s^2$), Standard Deviation ($s$), Quantiles ($Q1, Q2, Q3$), Interquartile Range ($\text{IQR}$), and Tukey's $1.5 \times \text{IQR}$ outlier detection in Rupees (₹).
- **Bivariate Association:** Joint Sample Covariance $\text{Cov}(X, Y)$ and Pearson Correlation Coefficient $r \in [-1, +1]$ matrices with interactive heatmaps and mathematically derived verbal interpretations.
- **Probability Theory:** Direct empirical probability $P(\text{Condition})$, multi-condition compound logic ($\text{AND} / \text{OR}$), and conditional probability $P(A \mid B) = \frac{P(A \cap B)}{P(B)}$.
- **Bayes' Theorem Laboratory:** Rigorous empirical calculation of Prior $P(A)$, Likelihood $P(B \mid A)$, Evidence $P(B)$, and Posterior $P(A \mid B)$, proving that theoretical Bayes updates match empirical dataset frequencies within float precision ($\Delta \approx 10^{-16}$).
- **Mathematical Expectation:** Expectation $E[X] = \sum x \cdot P(X = x)$ for discrete features (e.g., bedrooms, bathrooms), proving equivalence with the arithmetic sample mean.
- **Supervised Polynomial Curve Fitting:** Training Degrees 1, 2, and 3 regression models ($X = \text{Living Area}, Y = \text{Price (₹)}$) on a strict $80/20$ train/test split, evaluating $\text{MSE}$, $\text{RMSE}$, and $R^2$.
- **House Matcher & Budget Gap Intelligence:** Multi-objective rule-based similarity scoring (normalized spatial, budget in ₹, and bedroom/bathroom distances) ranking properties, identifying budget surpluses or deficits, and evaluating overall dataset affordability in Rupees.
- **Unit 1 Syllabus Mapping Matrix:** Integrated academic knowledge base providing definitions, mathematical formulas, and exact FirstNest code locations for all 16 Unit-1 syllabus topics.

---

## 2. Unit 1 Concept Mapping

Every single feature in FirstNest directly implements and demonstrates a core topic from the Machine Learning Unit-1 curriculum:

| Unit-1 Syllabus Topic | Project Implementation & Module | Source File & Route | Mathematical Formula / Implementation |
| :--- | :--- | :--- | :--- |
| **1. Dataset Exploration** | Core Module 1 (Dataset Explorer) | `backend/data_loader.py`<br>`GET /api/dataset/summary` | Dynamic CSV loading, auditing 14,619 rows, 23 columns, verifying 0 missing values and 0 duplicates. |
| **2. Mean ($\mu$)** | Core Module 2 (Descriptive Statistics) | `backend/statistics.py`<br>`GET /api/statistics/{feature}` | $\mu = \frac{1}{N} \sum_{i=1}^N x_i$. Arithmetic center of gravity. Mean price = ₹538,806. |
| **3. Median ($Q2$)** | Core Module 2 (Descriptive Statistics) | `backend/statistics.py`<br>`GET /api/statistics/{feature}` | 50th percentile rank; robust against luxury price outliers. Median price = ₹450,000. |
| **4. Mode** | Core Module 2 (Descriptive Statistics) | `backend/statistics.py`<br>`GET /api/statistics/{feature}` | $\text{Mode} = \arg\max_x P(X = x)$; empirical peak frequency. Mode price = ₹350,000. |
| **5. Variance ($s^2$)** | Core Module 2 (Measures of Dispersion) | `backend/statistics.py`<br>`GET /api/statistics/{feature}` | $s^2 = \frac{1}{N-1} \sum_{i=1}^N (x_i - \bar{x})^2$ with Bessel's correction ($\text{ddof}=1$). |
| **6. Standard Deviation ($s$)** | Core Module 2 (Measures of Dispersion) | `backend/statistics.py`<br>`GET /api/statistics/{feature}` | $s = \sqrt{s^2}$; returns volatility spread to native units (₹ or $\text{sqft}$). Price $s =$ ₹367,229. |
| **7. Quantiles ($Q1, Q2, Q3$)** | Core Module 2 (Five-Number Summary) | `backend/statistics.py`<br>`GET /api/statistics/{feature}` | 25th, 50th, and 75th percentiles partitioning sorted distributions into quartiles. |
| **8. Interquartile Range ($\text{IQR}$)** | Core Module 2 & Outlier Detection | `backend/statistics.py`<br>`GET /api/statistics/{feature}` | $\text{IQR} = Q3 - Q1$; Tukey fences $[Q1 - 1.5\cdot\text{IQR}, Q3 + 1.5\cdot\text{IQR}]$. Price $\text{IQR} =$ ₹325,000. |
| **9. Probability Distributions** | Core Module 4 (Probability Analysis) | `backend/probability.py`<br>`POST /api/probability` | $P(E) = \frac{\text{Count}(E)}{N}$; empirical mass & multi-condition boolean filters. |
| **10. Expectation ($E[X]$)** | Core Module 7 (Expectation) | `backend/probability.py`<br>`GET /api/expectation/{feature}` | $E[X] = \sum x_i P(X = x_i)$ for discrete features; verified to equal $\bar{x}$. |
| **11. Covariance ($\text{Cov}$)** | Core Module 3 (Bivariate Association) | `backend/statistics.py`<br>`GET /api/covariance` | $\text{Cov}(X, Y) = \frac{1}{N-1} \sum (x_i - \bar{x})(y_i - \bar{y})$; evaluates joint directional co-variation. |
| **12. Correlation ($r$)** | Core Module 3 (Correlation Heatmap) | `backend/statistics.py`<br>`GET /api/correlation` | $r = \frac{\text{Cov}(X, Y)}{s_X s_Y} \in [-1, +1]$; scale-invariant Pearson linear dependence. Area vs Price $r = 0.71$. |
| **13. Conditional Probability** | Core Module 5 (Conditional Probability) | `backend/probability.py`<br>`POST /api/conditional-probability` | $P(A \mid B) = \frac{P(A \cap B)}{P(B)} = \frac{\text{Count}(A \cap B)}{\text{Count}(B)}$ restricting sample space to $B$. |
| **14. Bayes' Theorem** | Core Module 6 (Bayes Theorem Lab) | `backend/bayes.py`<br>`POST /api/bayes` | $P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$; empirical verification against direct filtering ($\Delta < 10^{-10}$). |
| **15. Polynomial Curve Fitting** | Core Module 8 (Polynomial Regression) | `backend/polynomial.py`<br>`POST /api/polynomial/train` | Ordinary Least Squares (OLS) fitting for Degrees 1, 2, 3; $y = a_0 + a_1 x + a_2 x^2 + \dots$ |
| **16. Supervised Learning Concept** | Core Module 8 & 12 (Estimation & Evaluation) | `backend/polynomial.py`<br>`POST /api/polynomial/predict` | $80/20$ Train/Test split, evaluation via $\text{MSE}$, $\text{RMSE}$, $R^2$, and generalization estimation. |

---

## 3. Project Structure

```
ML-rev1/
├── House Price India.csv          # Real dataset (14,619 rows, 23 attributes)
├── README.md                      # Comprehensive academic documentation & syllabus guide
├── run_servers.py                 # Single-command launcher for both backend & frontend
├── start.bat                      # Windows batch launcher (dual-window startup)
├── start_backend.py               # Standalone backend server launcher
├── backend/
│   ├── main.py                    # FastAPI application, CORS middleware, 16 REST endpoints
│   ├── data_loader.py             # CSV dynamic loader, missing values audit, data cleaning
│   ├── statistics.py              # Mean, Median, Mode, Variance, Std, Quantiles, IQR, Covariance, Correlation
│   ├── probability.py             # Direct probability, compound filters, conditional probability, expectation
│   ├── bayes.py                   # Bayes' Theorem calculation & empirical mathematical verification
│   ├── polynomial.py              # Scikit-learn PolynomialFeatures & LinearRegression with 80/20 train/test split
│   ├── matcher.py                 # Transparent rule-based similarity scoring, budget gap & affordability analysis
│   ├── models.py                  # Pydantic schemas for requests, responses, and validation
│   ├── test_backend.py            # Comprehensive unit test suite auditing all modules
│   └── requirements.txt           # Python dependencies
└── frontend/
    ├── package.json               # Node.js project manifest & scripts
    ├── vite.config.js             # Vite build configuration
    ├── tailwind.config.js         # Custom dark theme color tokens & typography
    ├── postcss.config.js          # PostCSS Tailwind processor
    ├── index.html                 # HTML shell with Google Fonts (Inter, Fira Code)
    └── src/
        ├── index.css              # Glassmorphic utilities, custom scrollbars, and Tailwind directives
        ├── main.jsx               # React DOM entry point
        ├── App.jsx                # Application root with tab routing & backend health polling
        ├── services/
        │   └── api.js             # Centralized fetch client for FastAPI endpoints
        ├── components/
        │   └── Navbar.jsx         # Responsive navigation header with FirstNest brand & status
        └── pages/
            ├── Dashboard.jsx          # Key metrics in ₹, empirical price/area histograms, syllabus shortcuts
            ├── StatisticsPage.jsx     # Dropdown feature selector, Tukey outlier fences, comparison table in ₹
            ├── CorrelationPage.jsx    # Covariance & Pearson correlation matrices, interactive heatmap
            ├── ProbabilityPage.jsx    # Condition builder, P(A|B) analyzer, and E[X] mass distribution table
            ├── BayesPage.jsx          # Prior, Evidence, Likelihood, Posterior, and empirical proof in ₹
            ├── PolynomialPage.jsx     # Degrees 1, 2, 3 curves, R², RMSE in ₹, MSE in ₹², and live sqft predictor
            ├── HouseMatcherPage.jsx   # Multi-objective house matcher, budget gap analysis in ₹, affordability
            ├── DatasetPage.jsx        # Data integrity audit, 23 feature types, paginated table with sorting in ₹
            └── SyllabusPage.jsx       # 16 Unit-1 Syllabus concepts mapping matrix & formula deep-dive
```

---

## 4. Setup & Execution Instructions

### Prerequisites
- **Python**: Version 3.10+ (Tested on Python 3.11.9)
- **Node.js**: Version 18+ (Tested on Node v22.16.0, npm 10.9.2)

### Step 1: Install Python Backend Dependencies
From the repository root:
```bash
pip install -r backend/requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Run FirstNest (Single Command)
You can start both the FastAPI backend (`http://127.0.0.1:8000`) and the Vite frontend (`http://127.0.0.1:5173`) using either method:

**Cross-Platform Python Launcher (Recommended):**
```bash
python run_servers.py
```

**Windows Batch Script:**
Double-click `start.bat` or run:
```cmd
start.bat
```

**Manual Separate Commands (Optional):**
- Terminal 1 (Backend):
  ```bash
  python start_backend.py
  ```
- Terminal 2 (Frontend):
  ```bash
  cd frontend
  npm run dev
  ```

---

## 5. Live Localhost Access Links

| Application Service | Localhost URL | Description |
| :--- | :--- | :--- |
| **FirstNest Frontend Web App** | **[http://localhost:5173/](http://localhost:5173/)** | Complete interactive user interface, data explorer, statistics, probability, Bayes lab, polynomial regression, house matcher, and syllabus mapping. |
| **FastAPI Interactive Docs (Swagger)** | **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** | Interactive OpenAPI documentation for all 16 endpoints. |
| **FastAPI Alternative Docs (ReDoc)** | **[http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)** | Clean reference documentation for the backend API. |
| **API Health Check** | **[http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)** | Live JSON status endpoint confirming FirstNest service health. |

---

## 6. Mathematical & Algorithmic Explanations

### 6.1 Multi-Objective House Matching Algorithm
The house matching score is an **analytical multi-criteria decision heuristic (MCDM)** based on normalized attribute distances, NOT a black-box machine learning classifier.

Given user requirements:
- Required living area: $A_{\text{req}}$
- User budget in Rupees: $B_{\text{user}}$
- Required bedrooms: $\text{Bed}_{\text{req}}$
- Required bathrooms: $\text{Bath}_{\text{req}}$

Component similarity scores $\in [0.0, 1.0]$ are calculated for each property $i$:
1. **Living Area Score:**
   $$\Delta_{\text{area}} = \frac{|A_i - A_{\text{req}}|}{A_{\text{req}}}, \quad S_{\text{area}} = \max\left(0, 1 - \Delta_{\text{area}}\right)$$
2. **Budget Score (Rupees ₹):**
   - If $P_i \le B_{\text{user}}$ (Within budget):
     $$S_{\text{budget}} = \text{clip}\left(1.0 - 0.25 \cdot \frac{B_{\text{user}} - P_i}{B_{\text{user}}}, 0.70, 1.0\right)$$
   - If $P_i > B_{\text{user}}$ (Over budget):
     $$S_{\text{budget}} = \max\left(0, 1.0 - 1.5 \cdot \frac{P_i - B_{\text{user}}}{B_{\text{user}}}\right)$$
3. **Bedroom Score:**
   $$S_{\text{bed}} = \max\left(0, 1 - \frac{|\text{Bed}_i - \text{Bed}_{\text{req}}|}{\max(1, \text{Bed}_{\text{req}})}\right)$$
4. **Bathroom Score:**
   $$S_{\text{bath}} = \max\left(0, 1 - \frac{|\text{Bath}_i - \text{Bath}_{\text{req}}|}{\max(1, \text{Bath}_{\text{req}})}\right)$$

**Total Match Percentage:**
$$\text{Match Score} = 100 \times \left(w_{\text{area}} S_{\text{area}} + w_{\text{budget}} S_{\text{budget}} + w_{\text{bed}} S_{\text{bed}} + w_{\text{bath}} S_{\text{bath}}\right)$$
*Default configurable weights: Area = 40%, Budget = 30%, Bedrooms = 15%, Bathrooms = 15%.*

### 6.2 Polynomial Curve Fitting & Supervised Evaluation
We model the relationship between independent feature $X = \text{Living Area}$ and target variable $Y = \text{Price (₹)}$:
- **Degree 1 (Linear):** $\hat{y} = a_0 + a_1 x$
- **Degree 2 (Quadratic):** $\hat{y} = a_0 + a_1 x + a_2 x^2$
- **Degree 3 (Cubic):** $\hat{y} = a_0 + a_1 x + a_2 x^2 + a_3 x^3$

**Evaluation Protocol:**
- **Splitting:** 80% Training ($N_{\text{train}} = 11,695$), 20% Testing ($N_{\text{test}} = 2,924$) with `random_state=42`.
- **Metrics Computed:**
  $$\text{MSE} = \frac{1}{N} \sum_{i=1}^N (y_i - \hat{y}_i)^2, \quad \text{RMSE} = \sqrt{\text{MSE}}, \quad R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$$
- **Empirical Results (Denominated in ₹ Rupees):**
  - Degree 1: Test $R^2 = 0.5323$, Test $\text{RMSE} =$ ₹263,098.62
  - Degree 2: Test $R^2 = 0.5847$, Test $\text{RMSE} =$ ₹247,908.42
  - Degree 3: Test $R^2 = 0.5884$, Test $\text{RMSE} =$ ₹246,804.17

### 6.3 Bayes' Theorem Verification
We demonstrate Bayes' Rule using meaningful housing conditions:
- **Hypothesis $A$:** House has $3+$ bedrooms ($12,596$ houses, $P(A) \approx 0.8616$).
- **Evidence $B$:** House costs under ₹500,000 ($8,418$ houses, $P(B) \approx 0.5758$).

We compute:
1. Likelihood: $P(B \mid A) = \frac{\text{Count}(A \cap B)}{\text{Count}(A)} = \frac{6,863}{12,596} \approx 0.544863$
2. Prior: $P(A) = \frac{12,596}{14,619} \approx 0.861618$
3. Evidence: $P(B) = \frac{8,418}{14,619} \approx 0.575826$
4. Bayes Posterior:
   $$P(A \mid B)_{\text{Bayes}} = \frac{P(B \mid A) \cdot P(A)}{P(B)} = \frac{0.544863 \times 0.861618}{0.575826} = 0.815277$$
5. Direct Dataset Filtering:
   $$P(A \mid B)_{\text{direct}} = \frac{\text{Count}(A \cap B)}{\text{Count}(B)} = \frac{6,863}{8,418} = 0.815277$$
6. Verification Delta: $|P(A \mid B)_{\text{direct}} - P(A \mid B)_{\text{Bayes}}| = 1.11 \times 10^{-16} \approx 0$ (exact empirical match within floating-point precision).

---

## 7. Unit-1 Curriculum Syllabus Mapping Matrix

FirstNest maps 100% of the Machine Learning Unit-1 curriculum into functional, interactive application views:

1. **Dataset Exploration & Auditing:**
   - *Theory:* Real-world datasets require integrity verification before modeling.
   - *FirstNest Location:* `frontend/src/pages/DatasetPage.jsx` & `backend/data_loader.py`.
   - *Key Finding:* 14,619 rows, 23 numerical features, exactly 0 missing values, 0 duplicate records.

2. **Mean ($\mu$):**
   - *Theory:* Arithmetic center of gravity $\mu = \frac{1}{N} \sum x_i$.
   - *FirstNest Location:* `frontend/src/pages/StatisticsPage.jsx` & `backend/statistics.py`.
   - *Key Finding:* Average price is ₹538,806. Sensitive to upper luxury outliers.

3. **Median ($Q2$):**
   - *Theory:* 50th percentile rank; robust against extreme skewness.
   - *FirstNest Location:* `frontend/src/pages/StatisticsPage.jsx` & `backend/statistics.py`.
   - *Key Finding:* Median price is ₹450,000, lower than the mean by ₹88,806, proving right-skewed pricing.

4. **Mode:**
   - *Theory:* Most frequently occurring value $\arg\max P(X = x)$.
   - *FirstNest Location:* `frontend/src/pages/StatisticsPage.jsx` & `backend/statistics.py`.
   - *Key Finding:* Mode price is ₹350,000 (172 houses).

5. **Variance ($s^2$):**
   - *Theory:* Average squared deviation from the mean with Bessel's correction $N-1$.
   - *FirstNest Location:* `frontend/src/pages/StatisticsPage.jsx` & `backend/statistics.py`.
   - *Key Finding:* Quantifies total squared dispersion around the mean.

6. **Standard Deviation ($s$):**
   - *Theory:* Square root of variance; restores dispersion to native feature units (₹ or sqft).
   - *FirstNest Location:* `frontend/src/pages/StatisticsPage.jsx` & `backend/statistics.py`.
   - *Key Finding:* Price standard deviation is ₹367,229.

7. **Quantiles ($Q1, Q2, Q3$):**
   - *Theory:* Points partitioning sorted observations into 4 equal quarters (25th, 50th, 75th percentiles).
   - *FirstNest Location:* `frontend/src/pages/StatisticsPage.jsx` & `backend/statistics.py`.
   - *Key Finding:* $Q1 =$ ₹320,000, $Q2 =$ ₹450,000, $Q3 =$ ₹645,000.

8. **Interquartile Range ($\text{IQR}$):**
   - *Theory:* Middle 50% spread $\text{IQR} = Q3 - Q1$. Outliers defined via Tukey fences $[Q1 - 1.5\cdot\text{IQR}, Q3 + 1.5\cdot\text{IQR}]$.
   - *FirstNest Location:* `frontend/src/pages/StatisticsPage.jsx` & `backend/statistics.py`.
   - *Key Finding:* Price $\text{IQR} =$ ₹325,000; upper fence is ₹1,132,500, identifying 782 high-value outlier properties.

9. **Probability Distributions:**
   - *Theory:* Empirical probability mass $P(E) = \frac{\text{Count}(E)}{N}$.
   - *FirstNest Location:* `frontend/src/pages/ProbabilityPage.jsx` & `backend/probability.py`.
   - *Key Finding:* Direct single and compound boolean condition evaluation over 14,619 properties.

10. **Expectation ($E[X]$):**
    - *Theory:* $E[X] = \sum x_i P(X = x_i)$ for discrete random variables.
    - *FirstNest Location:* `frontend/src/pages/ProbabilityPage.jsx` & `backend/probability.py`.
    - *Key Finding:* Discrete expected bedrooms $E[\text{Bedrooms}] = 3.3796$, mathematically identical to the arithmetic sample mean.

11. **Covariance ($\text{Cov}$):**
    - *Theory:* Joint directional variability $\text{Cov}(X, Y) = \frac{1}{N-1} \sum (x_i - \bar{x})(y_i - \bar{y})$.
    - *FirstNest Location:* `frontend/src/pages/CorrelationPage.jsx` & `backend/statistics.py`.
    - *Key Finding:* Positive covariance between living area and price indicates they grow together.

12. **Correlation ($r$):**
    - *Theory:* Pearson linear correlation coefficient $r = \frac{\text{Cov}(X, Y)}{s_X s_Y} \in [-1, +1]$.
    - *FirstNest Location:* `frontend/src/pages/CorrelationPage.jsx` & `backend/statistics.py`.
    - *Key Finding:* Strong positive correlation ($r = 0.71$) between living area and price.

13. **Conditional Probability:**
    - *Theory:* $P(A \mid B) = \frac{P(A \cap B)}{P(B)}$ by restricting sample space to condition $B$.
    - *FirstNest Location:* `frontend/src/pages/ProbabilityPage.jsx` & `backend/probability.py`.
    - *Key Finding:* Restricting properties to those under ₹500,000 shifts the probability of having $3+$ bedrooms from $86.16\%$ to $81.53\%$.

14. **Bayes' Theorem:**
    - *Theory:* $P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$ updating priors with likelihoods.
    - *FirstNest Location:* `frontend/src/pages/BayesPage.jsx` & `backend/bayes.py`.
    - *Key Finding:* Verified empirically against direct dataset filtering ($\Delta = 1.11 \times 10^{-16}$).

15. **Polynomial Curve Fitting:**
    - *Theory:* Supervised regression modeling $y = \sum a_j x^j$ via Ordinary Least Squares.
    - *FirstNest Location:* `frontend/src/pages/PolynomialPage.jsx` & `backend/polynomial.py`.
    - *Key Finding:* Degree 2 quadratic regression captures diminishing marginal space appreciation, boosting test $R^2$ to $0.5847$.

16. **Supervised Learning Protocol:**
    - *Theory:* Independent train/test partition ($80/20$) evaluating generalization with MSE, RMSE, and $R^2$.
    - *FirstNest Location:* `frontend/src/pages/PolynomialPage.jsx` & `backend/polynomial.py`.
    - *Key Finding:* Evaluated on 2,924 unseen test samples; Degree 2 RMSE is ₹247,908.

---

## 8. Verification & Audit Results

The entire platform was rigorously verified over live network sockets:
- **Unit Tests:** `backend/test_backend.py` executed with exit code 0.
- **REST API Endpoints:** All 16 endpoints tested via HTTP and returning 200 OK.
- **Frontend Production Build:** `npm run build` compiled 2,468 modules cleanly with 0 errors.
- **Live Localhost Servers:** Verified operational concurrently on ports 8000 and 5173.
