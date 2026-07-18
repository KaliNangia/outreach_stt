# Notebooks

This directory contains Jupyter notebooks for exploratory data analysis and column auditing.

---

## Files

### `column_audit.ipynb`

**Purpose:** Systematic column-by-column audit of all 81 columns in the dataset.

**Contents:**
- Data loading and initial inspection
- Column-by-column analysis:
  - Data types and formats
  - Null value counts and patterns
  - Unique value distributions
  - Data quality issues
  - Cleaning requirements
- Summary statistics
- Recommendations for normalization

**Key Findings:**
- 18 core columns identified for strict null filtering
- 19 binary columns need standardization
- 16 time columns need format normalization
- 8 actor name columns need unification
- 2 rows with structural repairs required (TL-2477, TL-5222)

---

### `notebook 1.ipynb`

**Purpose:** General exploratory data analysis and missing value mitigation.

**Contents:**
- Dataset overview and shape analysis
- Missing value analysis:
  - Heatmaps of null patterns
  - Column-wise null percentages
  - Row-wise null distributions
- Data type conversions
- Date and time parsing experiments
- Name standardization exploration
- Initial KPI calculations
- Visualization of key metrics

**Key Insights:**
- 67.3% of rows have empty `Q-ID Consistent Across Systems?`
- Strict filtering reduces dataset from 5,515 to 909 rows (17.8% retention)
- Incomplete records significantly skew KPI scores downward

---

## Usage

### Opening Notebooks

```bash
# From project root
cd notebooks

# Start Jupyter
jupyter notebook

# Or use VS Code with Jupyter extension
code .
```

### Running Notebooks

1. Ensure Python 3.7+ is installed
2. Install Jupyter: `pip install jupyter`
3. Install dependencies: `pip install pandas matplotlib seaborn`
4. Open notebook in browser
5. Run all cells: Kernel → Restart & Run All

---

## Dependencies

```
pandas>=1.3.0
numpy>=1.21.0
matplotlib>=3.4.0
seaborn>=0.11.0
jupyter>=1.0.0
```

---

## Notes

- Notebooks are for analysis only, not production code
- Results are documented in `docs/` markdown files
- Raw data paths in notebooks may need updating after reorganization
- Output cells contain pre-computed results for quick reference
