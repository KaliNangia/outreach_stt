# Data Directory

This directory contains all data files for the ACE Dashboard, organized by processing stage.

---

## Directory Structure

```
data/
├── raw/                    # Original source data (DO NOT MODIFY)
│   ├── Agri_Advisory_QA_Test_Log (1.0).xlsx
│   ├── Agri_Advisory_QA_Test_Log (1.0) - Test Log_1.csv
│   └── Agri_Advisory_QA_Test_Log (1.0) - Test Log_1 (1).csv
│
├── processed/              # Cleaned/standardized outputs
│   ├── cleandataset.csv    # Strictly filtered (909 rows)
│   ├── updated.csv         # Default served by server (~3,000 rows)
│   ├── updated2.0.csv      # Intermediate version
│   ├── updated3.0.csv      # Latest iteration
│   ├── Merged_Checkpoint2_Time_Fixed.csv
│   └── updated.xlsx        # Excel version
│
└── uploads/                # Runtime CSV uploads
    └── .gitkeep
```

---

## Data Files

### Raw Data (`raw/`)

| File | Format | Rows | Description |
|------|--------|------|-------------|
| `Agri_Advisory_QA_Test_Log (1.0).xlsx` | Excel | 5,515 | Original Google Sheet export |
| `Agri_Advisory_QA_Test_Log (1.0) - Test Log_1.csv` | CSV | 7,179 | CSV export (includes metadata rows) |
| `Agri_Advisory_QA_Test_Log (1.0) - Test Log_1 (1).csv` | CSV | 7,179 | Alternate CSV export |

**Important:** These are the source of truth. Never modify these files. Use them as input for the normalization pipeline.

---

### Processed Data (`processed/`)

| File | Rows | Description | Used By |
|------|------|-------------|---------|
| `cleandataset.csv` | 909 | Strictly filtered (18 core columns non-empty) | Analysis |
| `updated.csv` | ~3,000 | Standardized but not strictly filtered | **Server default** |
| `updated2.0.csv` | ~5,000 | Intermediate cleaning version | Comparison |
| `updated3.0.csv` | ~5,000 | Latest iteration | Backup |
| `Merged_Checkpoint2_Time_Fixed.csv` | ~5,000 | Merged with time fixes | Checkpoint |

**Default Dataset:** The server loads `updated.csv` on startup. This is the dataset served to the frontend by default.

---

### Uploads (`uploads/`)

Runtime directory for CSV files uploaded via the dashboard UI. Files are temporarily stored here, validated, then copied to `processed/updated.csv`.

---

## Data Schema (81 Columns)

### Core Identification
| Col | Name | Type | Description |
|-----|------|------|-------------|
| 1 | Test ID | String | Unique row ID (`TL-XXXX`) |
| 2 | Test Date | Date | ISO `YYYY-MM-DD` |
| 10 | Question ID | String | Unique Q-ID |

### Actor Information
| Col | Name | Type | Description |
|-----|------|------|-------------|
| 3 | Tester Name | String | 11 standardized names |
| 24 | Author's Name | String | Answer author |
| 28-44 | Reviewer1-5 Name | String | Review pipeline actors |
| 48 | Moderator's Name | String | Final validator |

### Query Details
| Col | Name | Type | Description |
|-----|------|------|-------------|
| 9 | Query Text | String | Farmer question |
| 11 | Question Category | String | e.g., Plant Protection |
| 4 | Type of Question | String | GDB / Unique / Dynamic |
| 7 | Channel Tested | String | Web App / WhatsApp |
| 8 | Language Tested | String | Regional language |

### Timeline
| Col | Name | Type | Description |
|-----|------|------|-------------|
| 12 | Time Asked | Time | HH:MM:SS |
| 13 | Time Received | Time | HH:MM:SS |
| 14 | Response Time (mins) | Numeric | Parsed to minutes |
| 15 | SLA Status | String | Within SLA / Breached |

### Quality Checks (19 Binary Columns)
| Col | Name | Values |
|-----|------|--------|
| 53 | Answer Scientifically Correct? | Correct / Incorrect / Partially Correct |
| 54 | Expert Name Displayed? | Displayed / Not Displayed |
| 55 | Correct Expert Name? | Yes / No |
| 56 | Source Links Provided? | Provided & Relevant / Not Provided |
| 61 | Voice Input Working? | Yes / No |
| 62 | Voice Output Working? | Yes / No |
| 66 | Weather Q Answered Correctly? | Yes / No / NA |
| 67 | Mandi Price Q Correct? | Yes / No / NA |
| 68 | Scheme Q Correct? | Yes / No / NA |
| 69 | Question Saved in DB? | Saved / Not Saved / Duplicate |
| 70 | Answer Saved in DB? | Saved / Not Saved / Duplicate |
| 71 | Q-ID Consistent? | Consistent / Wrongly Identified as Duplicate |
| 72 | WhatsApp vs Web Match? | Yes / No |

### Status & Defects
| Col | Name | Values |
|-----|------|--------|
| 73 | Overall Test Status | Pass / Fail / Partial |
| 74 | Defect Severity | Critical / High / Medium / Low / Info / No Defect |
| 75 | Defect ID / Bug Ref | Zoho Desk ticket URL |

---

## Data Flow

```
raw/*.csv
    │
    ▼
normalize_and_clean.py
    │
    ▼
processed/cleandataset.csv (909 rows, strict)
    │
    ▼
server.js loads processed/updated.csv (default)
    │
    ▼
GET /api/data → Frontend
    │
    ▼
Browser renders dashboard
```

---

## Important Notes

1. **Never modify raw data.** Always work with copies in `processed/`.

2. **Column name typo:** `Respo nse Time (mins) [Auto]` has a space inside "Response". All code must match this exactly.

3. **NA/NIL handling:** These values are preserved as-is in binary columns. They are not converted to empty strings.

4. **File sizes:** Raw CSVs are ~7,000 lines (including metadata). Clean output is ~900 rows.

5. **Encoding:** All files use UTF-8 encoding.
