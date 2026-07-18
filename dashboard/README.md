# Agri Advisory QA Test Log & ACE Executive Health Dashboard

> **Version:** 1.0 | **Last Updated:** 2026-07-18 | **Maintainer:** Annam AI Team

---

## 1. Project Overview

This project is a **Quality Assurance (QA) testing dashboard** for **Annam AI's ACE** (Agricultural Chatbot for Experts). It tracks the performance of an AI-powered agricultural advisory chatbot that answers farmer questions about crops, weather, market prices, and government schemes.

The system involves a **human-in-the-loop validation pipeline** where Authors write answers, Reviewers (1-5) validate, and Moderators finalize before delivery to farmers via Web App and WhatsApp.

### Key Features
- **4 Executive KPI Cards:** ACE Trust Score, Farmer Experience Score, Critical Failures, Release Health
- **3 Diagnostic Panels:** Bottleneck Detection, Weakest Module, Open Critical Defects
- **3 Trend Charts:** Trust & Experience over time, Latency trends, Defect volume by sprint
- **10 Filter Dropdowns:** Date, Build, Sprint, Channel, Language, Category, Tester, Type, Status, Severity
- **CSV Upload:** Dynamic data refresh via file upload

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Data Processing** | Python 3 | Normalization, cleaning, filtering |
| **Backend** | Node.js + Express | CSV parsing, API server, file uploads |
| **Frontend** | Vanilla JavaScript + Chart.js | Dashboard UI, KPI calculations, visualizations |
| **Styling** | HTML5 + CSS3 | Responsive dashboard layout |

---

## 3. Project Structure

```
dashboard/
├── src/                    # Backend source code
│   ├── server.js          # Express API server (port 3000)
│   └── normalize_and_clean.py  # Data normalization pipeline
│
├── public/                 # Frontend assets (served by Express)
│   ├── index.html         # Dashboard HTML structure
│   ├── app.js             # Frontend logic & KPI calculations
│   └── style.css          # Dashboard styling
│
├── data/                   # All data files
│   ├── raw/               # Original source data (XLSX, CSV)
│   ├── processed/         # Cleaned/standardized outputs
│   └── uploads/           # Runtime CSV uploads
│
├── docs/                   # Documentation & reference
│   ├── REPLICATION_GUIDE.md  # Full replication instructions
│   ├── master_technical_blueprint.md  # Architecture & formulas
│   ├── plan.md            # KPI mapping specification
│   ├── column_analysis.md # Column-by-column audit
│   ├── dataset_comparison.md  # Raw vs clean comparison
│   ├── diif.md            # Row-by-row diff log
│   ├── info.md            # QA analysis report
│   ├── report.md          # Standardization report
│   ├── KPI_Formula.pdf    # KPI formula reference
│   ├── cleaning_and_standardization_log.pdf
│   └── Tester Data Dashboard requirements.pdf
│
├── notebooks/              # Jupyter notebooks for EDA
│   ├── column_audit.ipynb
│   └── notebook 1.ipynb
│
├── screenshots/            # Dashboard screenshots
│   ├── kpi_page_1.png
│   ├── kpi_page_2.png
│   ├── kpi_page_3.png
│   └── kpi_page_4.png
│
├── log_activity.md         # Change log & activity tracking
├── package.json            # Node.js dependencies
└── .gitignore
```

---

## 4. Quick Start

### Prerequisites
- Node.js 14+ installed
- Python 3.7+ installed
- npm packages: `express`, `csv-parser`, `multer`

### Installation
```bash
cd dashboard
npm install
```

### Running the Dashboard
```bash
# Start the backend server
node src/server.js

# Open in browser
open http://localhost:3000
```

### Running Data Normalization
```bash
# From the src/ directory
cd src
python3 normalize_and_clean.py

# Or with custom paths
python3 normalize_and_clean.py --input ../data/raw/raw_data.csv --output ../data/processed/clean.csv
```

---

## 5. Data Pipeline

```
Raw XLSX/CSV (5,515+ rows, 81 columns)
    │
    ▼
[Python: normalize_and_clean.py]
    ├── Name standardization (200+ variations → 70 names)
    ├── Date cleaning (7 formats → ISO YYYY-MM-DD)
    ├── Time parsing (4 formats → minutes)
    ├── Binary standardization (19 columns → Yes/No)
    ├── Structural repairs (TL-2477, TL-5222)
    ├── Strict null filtering (18 core columns)
    └── Category-conditional rules
    │
    ▼
cleandataset.csv (909 rows)
    │
    ▼
[Node.js: server.js]
    ├── CSV parsing with csv-parser
    ├── Boilerplate row filtering
    └── API: /api/data (GET), /api/upload (POST)
    │
    ▼
[Frontend: app.js]
    ├── 10 filter dropdowns
    ├── "Exclude Failures" toggle
    ├── 4 KPI calculations
    ├── 3 diagnostic analyses
    └── 3 Chart.js visualizations
    │
    ▼
Browser Dashboard (localhost:3000)
```

---

## 6. KPI Formulas

### ACE Trust Score
```
Trust Score = 0.40 × A_sci + 0.20 × A_dom + 0.10 × S_lnk + 0.10 × E_exp + 0.10 × Q_trn + 0.10 × C_chn
```
Where:
- **A_sci** = % rows where Answer Scientifically Correct = "Correct"
- **A_dom** = Average of (Weather%, Mandi%, Scheme%) accuracy
- **S_lnk** = % rows where Source Links = "Provided & Relevant"
- **E_exp** = % rows where Expert Displayed = "Displayed" AND Correct Expert = "Yes"
- **Q_trn** = % rows where Translation Quality in {"Correct", "Good"}
- **C_chn** = % rows where WhatsApp vs Web Match = "Yes"

### Farmer Experience Score
```
FX Score = 0.30 × S_rsp + 0.20 × S_sla + 0.20 × V_io + 0.15 × Q_trn + 0.15 × N_exp
```
Where:
- **S_rsp** = Linear scaling: 100% at ≤15min, 0% at >120min
- **S_sla** = % rows where SLA Status = "Within SLA"
- **V_io** = Average of (VoiceIn%, VoiceOut%, VoiceInClear%, VoiceOutClear%)
- **Q_trn** = Same as Trust Score
- **N_exp** = % rows where notification received + same thread + correct Q-ID

### Release Health %
```
Release Health % = max(0, min(100, PassRate% - CriticalDefectRate% - DataIntegrityRate%))
```

---

## 7. Known Issues

| Issue | Description | Workaround |
|-------|-------------|------------|
| **Column typo** | `Respo nse Time (mins) [Auto]` has space inside "Response" | All code references must match exactly |
| **Hardcoded date** | `app.js` uses `new Date('2026-07-15')` as baseline | Change for production use |
| **Selection bias** | Clean dataset has 95.9% data integrity failures | Understand the filtering effect |
| **Upload overwrites** | `/api/upload` permanently overwrites `updated.csv` | No versioning built in |
| **No auth** | Server has no authentication | Add for production |

---

## 8. Documentation

| Document | Location | Description |
|----------|----------|-------------|
| **REPLICATION_GUIDE.md** | `docs/` | Complete replication instructions |
| **Technical Blueprint** | `docs/master_technical_blueprint.md` | Architecture & formulas |
| **KPI Mapping** | `docs/plan.md` | Column-to-KPI mapping |
| **Column Audit** | `docs/column_analysis.md` | 81-column analysis |
| **Dataset Comparison** | `docs/dataset_comparison.md` | Raw vs clean metrics |
| **Diff Log** | `docs/diif.md` | Row-by-row changes |
| **Activity Log** | `log_activity.md` | Change tracking |

---

## 9. License

Internal project - Annam AI. Not for distribution.

---

*For detailed replication instructions, see `docs/REPLICATION_GUIDE.md`*
