# Source Code

This directory contains the backend server and data processing pipeline for the ACE Dashboard.

---

## Files

### `server.js` - Express API Server

**Purpose:** Backend HTTP server that parses CSV data, serves the frontend, and provides API endpoints.

**Dependencies:**
- `express` v4.19.2 - HTTP server framework
- `csv-parser` v3.0.0 - CSV file parsing
- `multer` v1.4.5-lts.1 - File upload handling

**Port:** 3000 (hardcoded)

**API Endpoints:**

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/data` | GET | Returns all parsed records | `{ success: true, totalRecords: N, records: [...] }` |
| `/api/upload` | POST | Upload new CSV file | `{ success: true, totalRecords: N }` |

**Key Functions:**

```javascript
parseCSV(filePath, callback)
```
- Reads CSV file content
- Finds header row starting with "Test ID"
- Filters out boilerplate rows (Project headers, repeated headers)
- Returns array of record objects

```javascript
loadInitialData()
```
- Called on server startup
- Loads `data/processed/updated.csv` if it exists
- Stores records in memory (`parsedRecords`)

**Path Configuration (Updated 2026-07-18):**
- Static files: `../public/` (relative to src/)
- Upload directory: `../data/uploads/`
- Default CSV: `../data/processed/updated.csv`

**Usage:**
```bash
# From project root
node src/server.js

# Server starts at http://localhost:3000
```

---

### `normalize_and_clean.py` - Data Normalization Pipeline

**Purpose:** Python script that cleans and standardizes raw QA test log data.

**Dependencies:**
- Python 3.7+
- Standard library only: `csv`, `re`, `argparse`, `datetime`

**Input:** Raw CSV/XLSX with 81 columns, 5,500+ rows
**Output:** Clean CSV with ~909 rows (strictly filtered)

**Key Functions:**

#### `clean_name(name)`
Standardizes actor names (testers, authors, reviewers, moderators).
- Strips whitespace, newlines, collapses multiple spaces
- Maps 200+ raw name variations to 70 standardized names via `NAME_MAP`
- Falls back to Title Case if not found in map
- Preserves `NA` and `NIL` as-is

#### `clean_date(date_str)`
Converts mixed date formats to ISO standard.
- Tries 7 formats: `%d-%B-%Y`, `%d-%b-%Y`, `%d-%m-%Y`, `%d-%m-%y`, `%d.%m.%Y`, `%d/%m/%Y`, `%Y-%m-%d`
- Output: `YYYY-MM-DD`

#### `parse_time_to_minutes(time_str)`
Converts time strings to numeric minutes.
- Handles: decimal floats, integers, AM/PM, HH:MM:SS
- Returns `None` for empty/NA/NIL/#VALUE!

#### `clean_binary(val)`
Standardizes binary columns to Yes/No.
- Maps: YES/Y/YE/CORRECT/DISPLAYED → Yes
- Maps: NO/N/NOT YET/NOT DISPLAYED → No
- Preserves NA/NIL

#### `process_file(input_path, output_path)`
Main pipeline that applies all cleaning steps:
1. Header detection (finds "Test ID" row)
2. Structural repairs (TL-2477, TL-5222)
3. Name standardization (8 columns)
4. Date standardization (Test Date)
5. Categorical cleanup (Status, Severity)
6. Binary standardization (19 columns)
7. Strict null filtering (18 core columns)
8. Category-conditional rules
9. Expert attribution check

**Command Line:**
```bash
cd src

# Default usage
python3 normalize_and_clean.py

# Custom paths
python3 normalize_and_clean.py \
  --input ../data/raw/raw_data.csv \
  --output ../data/processed/clean.csv
```

**Arguments:**
| Argument | Default | Description |
|----------|---------|-------------|
| `--input` | `../data/raw/Agri_Advisory_QA_Test_Log (1.0) - Test Log_1 (1).csv` | Path to raw input CSV |
| `--output` | `../data/processed/cleandataset.csv` | Path to output clean CSV |

**NAME_MAP Dictionary:**
Located at lines 8-69 of the file. Contains 200+ raw name variations mapped to standardized names. Must be updated when new team members join.

---

## Running the Server

```bash
# From project root
cd /path/to/dashboard

# Install dependencies (first time only)
npm install

# Start server
node src/server.js

# Output:
# Dashboard backend running at http://localhost:3000
# Loaded XXX records successfully.
```

---

## Development Notes

1. **Column Name Typo:** The column `Response Time (mins) [Auto]` has a space inside "Response" → `Respo nse Time (mins) [Auto]`. All code must reference this exact string.

2. **In-Memory Storage:** Parsed records are held in memory. Large datasets (>100K rows) may cause issues.

3. **No Authentication:** The server has no auth. Add for production use.

4. **Upload Overwrites:** The `/api/upload` endpoint permanently overwrites `updated.csv`. No versioning.
