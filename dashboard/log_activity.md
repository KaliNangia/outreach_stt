# Activity Log

This file tracks all significant changes, updates, and maintenance activities for the ACE Dashboard project.

---

## Format

Each entry follows this format:
```
### [Date] - [Category] - [Summary]
- **Changed by:** [Name/Team]
- **Files affected:** [List of files]
- **Description:** [Detailed description]
- **Impact:** [What this changes]
- **Rollback:** [How to revert if needed]
```

---

## Log Entries

### 2026-07-18 - Structure - Project Reorganization

- **Changed by:** AI Assistant
- **Files affected:** All files (moved)
- **Description:** Complete project folder restructuring for better organization.
  - Created `src/` for backend code
  - Created `data/raw/` and `data/processed/` for data files
  - Created `docs/` for all documentation
  - Created `notebooks/` for Jupyter notebooks
  - Created `screenshots/` for dashboard images
  - Updated `server.js` paths to reflect new structure
  - Updated `normalize_and_clean.py` default paths
  - Added `.gitignore` for node_modules and uploads
- **Impact:** All file paths changed. Server must be started from project root with `node src/server.js`.
- **Rollback:** Move files back to root directory, restore original paths in server.js and normalize_and_clean.py.

---

### 2026-07-18 - Documentation - Added README Files

- **Changed by:** AI Assistant
- **Files affected:** 
  - `README.md` (root)
  - `src/README.md`
  - `public/README.md`
  - `data/README.md`
  - `docs/README.md`
  - `notebooks/README.md`
  - `screenshots/README.md`
- **Description:** Added detailed README documentation to every directory explaining contents, usage, and relationships.
- **Impact:** Improved project understandability and onboarding.
- **Rollback:** Delete README files.

---

### 2026-07-18 - Documentation - Created Activity Log

- **Changed by:** AI Assistant
- **Files affected:** `log_activity.md`
- **Description:** Created this activity log file to track all project changes.
- **Impact:** Enables change tracking and audit trail.
- **Rollback:** Delete this file.

---

### 2026-07-18 - Config - Added .gitignore

- **Changed by:** AI Assistant
- **Files affected:** `.gitignore`
- **Description:** Added gitignore file to exclude node_modules, .DS_Store, and upload files.
- **Impact:** Prevents unnecessary files from being committed to git.
- **Rollback:** Delete .gitignore.

---

### 2026-07-15 - Data - Initial Dataset

- **Changed by:** QA Team
- **Files affected:** 
  - `data/raw/Agri_Advisory_QA_Test_Log (1.0).xlsx`
  - `data/raw/Agri_Advisory_QA_Test_Log (1.0) - Test Log_1.csv`
  - `data/raw/Agri_Advisory_QA_Test_Log (1.0) - Test Log_1 (1).csv`
- **Description:** Original QA test log data exported from Google Sheets. 81 columns, 5,515+ rows.
- **Impact:** Source data for all processing.
- **Rollback:** N/A (original data).

---

### 2026-07-15 - Processing - Data Normalization Pipeline

- **Changed by:** QA Team
- **Files affected:** 
  - `src/normalize_and_clean.py`
  - `data/processed/cleandataset.csv`
- **Description:** Created Python normalization pipeline with:
  - 200+ name variations mapped to 70 standardized names
  - 7 date format parsers
  - 4 time format parsers
  - 19 binary column standardizations
  - 18-column strict null filter
  - Category-conditional rules
  - Structural repairs for TL-2477 and TL-5222
- **Impact:** Reduced dataset from 5,515 to 909 rows. Improved KPI accuracy.
- **Rollback:** Use raw data directly.

---

### 2026-07-15 - Backend - Express Server

- **Changed by:** QA Team
- **Files affected:** 
  - `src/server.js`
  - `package.json`
- **Description:** Created Node.js Express server with:
  - CSV parsing with csv-parser
  - File upload with multer
  - API endpoints: /api/data, /api/upload
  - Static file serving for frontend
- **Impact:** Enables dashboard to load and display data.
- **Rollback:** Delete server.js and package.json.

---

### 2026-07-15 - Frontend - Dashboard UI

- **Changed by:** QA Team
- **Files affected:** 
  - `public/index.html`
  - `public/app.js`
  - `public/style.css`
- **Description:** Created dashboard frontend with:
  - 4 executive KPI cards
  - 3 diagnostic panels
  - 3 Chart.js visualizations
  - 10 filter dropdowns
  - CSV upload functionality
  - Exclude Failures toggle
- **Impact:** Complete dashboard interface for viewing QA metrics.
- **Rollback:** Delete public/ files.

---

### 2026-07-14 - Data - Date/Time Standardization

- **Changed by:** QA Team
- **Files affected:** All processed CSV files
- **Description:** Standardized all date and time columns:
  - Dates: 7 formats → ISO YYYY-MM-DD
  - Times: 12h/24h/decimal → HH:MM:SS
  - TAT columns: Recalculated from standardized times
- **Impact:** Consistent temporal data for calculations.
- **Rollback:** Use previous version of processed files.

---

### 2026-07-14 - Data - Name Standardization

- **Changed by:** QA Team
- **Files affected:** All processed CSV files
- **Description:** Standardized all actor names:
  - 200+ raw variations → 70 standardized names
  - Applied to 8 name columns
  - Preserved NA/NIL placeholders
- **Impact:** Consistent actor tracking across metrics.
- **Rollback:** Use previous version of processed files.

---

## Upcoming Changes

Track planned changes here:

### [Date] - [Category] - [Planned Change]
- **Planned by:** [Name]
- **Description:** [What will be changed]
- **Expected impact:** [What this will affect]
- **Status:** [Planning/In Progress/Complete]

---

## Maintenance Schedule

### Weekly
- Review and merge any pending changes
- Update this log with completed activities

### Monthly
- Review data quality metrics
- Update NAME_MAP if new team members joined
- Check for dependency updates

### Quarterly
- Review and update documentation
- Audit KPI formulas for accuracy
- Performance optimization review

---

## Contact

For questions about changes:
- **Data Issues:** QA Team
- **Code Issues:** Development Team
- **Documentation:** Project Manager

---

*Last updated: 2026-07-18*
