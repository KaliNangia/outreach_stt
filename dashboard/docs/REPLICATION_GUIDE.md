# Replication Guide: Agri Advisory QA Test Log & ACE Executive Health Dashboard

This document contains every parameter, formula, filtering rule, normalization step, and structural repair needed to fully duplicate the dashboard system. Treat this as the single source of truth.

---

## 1. System Overview

**Purpose:** QA testing dashboard for Annam AI / ACE (Agricultural Chatbot for Experts). Tracks AI chatbot performance validated through a human-in-the-loop pipeline: Authors write answers, Reviewers 1-5 validate, Moderators finalize, then delivery to farmers via Web App and WhatsApp.

**Tech Stack:**
- Python 3 -- Data normalization (`normalize_and_clean.py`)
- Node.js / Express -- Backend server (`server.js`)
- Vanilla JavaScript + Chart.js -- Frontend dashboard (`public/app.js`)
- HTML5 / CSS3 -- UI

**Data Flow:**
```
Raw XLSX/CSV (5,515+ rows, 81 columns)
  --> [Python normalize_and_clean.py]
    --> cleandataset.csv (909 rows, strictly filtered)
  --> [Node.js server.js serves via API]
    --> updated.csv (default, ~3,000 rows, standardized but not strictly filtered)
  --> [Frontend app.js fetches /api/data]
    --> Browser renders 4 KPI cards, 3 diagnostic panels, 3 trend charts
```

**Critical Distinction:** The server defaults to serving `updated.csv` (standardized but not strictly null-filtered). The Python script produces `cleandataset.csv` (strict null filtering applied). The frontend has a toggle "Exclude Failures" that does additional runtime filtering.

---

## 2. Input Data Schema (81 Columns)

### Column Map (All 81 Columns)

| Col # | Column Name | Type | Used In KPI | Notes |
|-------|------------|------|-------------|-------|
| 1 | Test ID | String | -- | Unique row ID, format `TL-XXXX` |
| 2 | Test Date | Date | All | ISO `YYYY-MM-DD` after cleaning |
| 3 | Tester Name | String | Filters | 11 standardized names |
| 4 | Type of Question | String | Filters | GDB / Unique / Dynamic |
| 5 | Build / Version | String | Filters | e.g. `0.1` |
| 6 | Sprint / Cycle | String | Filters | Sprint name |
| 7 | Channel Tested | String | Filters | Web App / WhatsApp / Both |
| 8 | Language Tested | String | Filters | Regional languages |
| 9 | Query Text | String | -- | Farmer question text |
| 10 | Question ID | String | Core filter | Unique Q-ID |
| 11 | Question Category | String | Filters, A_dom, Weakest Module | e.g. Plant Protection, Weather |
| 12 | Time Question Asked (HH:MM:SS) | Time | -- | 24h format |
| 13 | Time Answer Received (HH:MM:SS) | Time | -- | 24h format |
| 14 | Response Time (mins) [Auto] | Numeric | S_rsp | Parsed to minutes |
| 15 | SLA Status | String | S_sla | Within SLA / SLA Breached |
| 16 | Question in Review Model? | Binary | -- | Yes/No |
| 17 | Question Correctly Framed? | Multi | -- | Well Framed / Other |
| 18 | Original Language | String | -- | e.g. Bengali |
| 19 | Translated Language | String | -- | e.g. English |
| 20 | Translation Quality | String | Q_trn | Correct / Good / Poor |
| 21 | Translation Error Type | String | -- | Error category |
| 22 | Tagging | Multi | -- | Correctly Tagged as Dynamic/Duplicate |
| 23 | Allocated to Reviewer? | Binary | -- | Yes/No |
| 24 | Author's Name | String | -- | Standardized |
| 25 | Author Assignment Time | Time | -- | |
| 26 | Author Completion Time | Time | -- | |
| 27 | Author TAT (mins) [Auto] | Numeric | Bottleneck | Parsed to minutes |
| 28 | Reviewer1 Name | String | -- | Standardized |
| 29 | Reviewer1 Assignment Time | Time | -- | |
| 30 | Reviewer1 Completion Time | Time | -- | |
| 31 | Review1 TAT (mins) [Auto] | Numeric | Bottleneck | Parsed to minutes |
| 32 | Reviewer2 Name | String | -- | |
| 33 | Reviewer2 Assignment Time | Time | -- | |
| 34 | Reviewer2 Completion Time | Time | -- | |
| 35 | Review2 TAT (mins) [Auto] | Numeric | Bottleneck | |
| 36 | Reviewer3 Name | String | -- | |
| 37 | Reviewer3 Assignment Time | Time | -- | |
| 38 | Reviewer3 Completion Time | Time | -- | |
| 39 | Review3 TAT (mins) [Auto] | Numeric | Bottleneck | |
| 40 | Reviewer4 Name | String | -- | |
| 41 | Reviewer4 Assignment Time | Time | -- | |
| 42 | Reviewer4 Completion Time | Time | -- | |
| 43 | Review4 TAT (mins) [Auto] | Numeric | Bottleneck | |
| 44 | Reviewer5 Name | String | -- | |
| 45 | Reviewer5 Assignment Time | Time | -- | |
| 46 | Reviewer5 Completion Time | Time | -- | |
| 47 | Review5 TAT (mins) [Auto] | Numeric | Bottleneck | |
| 48 | Moderator's Name | String | -- | Standardized |
| 49 | Moderator Assignment Time | Time | -- | |
| 50 | Moderator Completion Time | Time | -- | |
| 51 | Moderator TAT (mins) [Auto] | Numeric | Bottleneck | |
| 52 | Follow-up Q in Review Model? | Binary | -- | |
| 53 | Answer Scientifically Correct? | String | A_sci, Critical Failures | Correct / Incorrect / Partially Correct |
| 54 | Expert Name Displayed? | Binary | E_exp | Displayed / Not Displayed |
| 55 | Correct Expert Name? | Binary | E_exp | Yes / No |
| 56 | Source Links Provided? | Multi | S_lnk | Provided & Relevant / Not Provided |
| 57 | 120-min Msg Shown to User? | Binary | -- | |
| 58 | Notification Received? | Multi | N_exp | Received on Time / Received Late / Not Received |
| 59 | Notification on Same Thread? | Binary | N_exp | Yes / No |
| 60 | Notification Linked Correct Q-ID? | Binary | N_exp | Yes / No |
| 61 | Voice Input Working? | Binary | V_io | Yes / No |
| 62 | Voice Output Working? | Binary | V_io | Yes / No |
| 63 | Voice Input Quality | Multi | V_io | Clear / Good / Poor |
| 64 | Voice Output Quality | Multi | V_io | Clear / Good / Poor |
| 65 | Voice Issue Description | String | -- | Free text |
| 66 | Weather Q Answered Correctly? | Binary | A_dom | Yes / No / NA |
| 67 | Mandi Price Q Correct? | Binary | A_dom | Yes / No / NA |
| 68 | Scheme Q Correct? | Binary | A_dom | Yes / No / NA |
| 69 | Question Saved in DB? | Multi | Critical Failures, Release Health | Saved / Not Saved / Duplicate |
| 70 | Answer Saved in DB? | Multi | Critical Failures, Release Health | Saved / Not Saved / Duplicate |
| 71 | Q-ID Consistent Across Systems? | Multi | Critical Failures, Release Health | Consistent / Wrongly Identified as Duplicate |
| 72 | WhatsApp vs Web Answer Match? | Binary | C_chn | Yes / No |
| 73 | Overall Test Status | String | Release Health | Pass / Fail / Partial |
| 74 | Defect Severity | Multi | Critical Failures, Release Health, Exclude Failures | Critical / High / Medium / Low / Info / No Defect |
| 75 | Defect ID / Bug Ref Zoho Desk Ticketing | URL | Open Critical Defects | Zoho Desk links |
| 76 | Defect Description | String | -- | |
| 77 | Defect Screenshots | URL | -- | |
| 78 | Status | Multi | -- | Expected Output / Other |
| 79 | Remarks | String | -- | Free text |
| 80 | Tester Remarks | String | -- | Free text |
| 81 | Timestamp | Time | -- | |

---

## 3. Data Normalization Pipeline (Stage 1: Python)

File: `normalize_and_clean.py`

### 3.1 Header Detection

The CSV may have metadata rows before the actual header. The script scans for the first row where column 0 equals `Test ID` (case-insensitive, trimmed). Everything before that row is discarded. All data rows after that header row are processed.

### 3.2 Structural Row Repairs

Two specific rows have known cell transposition/shift bugs that are hardcoded fixes:

**Row TL-2477 (Reviewer1 Transposition):**
- Column `Reviewer1 Name` was overwritten with time string `11:39:47 Am`
- Column `Reviewer1 Assignment Time` contained the name `Ambika`
- Fix: Set Reviewer1 Name = `Ambika`, Reviewer1 Assignment Time = `2026-06-25 11:39:47`, Reviewer1 Completion Time = `2026-06-25 11:39:47`, Review1 TAT = `0.0`

**Row TL-5222 (Reviewer4 Shifted Cells):**
- Columns 39-43 (Reviewer4 range) were shifted horizontally
- Fix: Set Reviewer4 Name = `Suraiya Amin`, Reviewer4 Assignment Time = `2026-07-10 20:00:04`, Reviewer4 Completion Time = `2026-07-10 20:07:13`, Review4 TAT = `7.13`

**If replicating:** You must identify these exact rows by their Test ID and apply the same hardcoded corrections, or build a general shift-detection algorithm.

### 3.3 Name Standardization

**8 name columns are cleaned:** Tester Name, Author's Name, Reviewer1-5 Name, Moderator's Name

**Algorithm:**
1. Strip whitespace, newlines, carriage returns
2. Collapse multiple spaces to single space
3. If result is `NA` or `NIL`, return as-is
4. Uppercase the cleaned name and look up in `NAME_MAP` dictionary (case-insensitive match)
5. If found, return the standardized value from the map
6. If not found, return the name in Title Case

**NAME_MAP contains 200+ raw name variations mapping to ~70 standardized names.** Key examples:
- `ADITI`, `ADITI.DHADWAL`, `ADITI DHADWAL` --> `Aditi Dhadwal`
- `ANMOL KAUNDOL` --> `Anmol Kaundal`
- `SASHIDHAR`, `SASIDHAR`, `B.sasidhar` --> `B. Sasidhar`
- `BISEN NUPUR CHNADRAKUMAR`, `NUPUR`, `nupur.chandra.kumar` --> `Bisen Nupur Chandrakumar`
- `SHIVENDRA`, `SHIVENDRA PRATAP`, `Shivendra Pratap Singh*` --> `Shivendra Pratap Singh`
- `YASH`, `YASH PARVEEN`, `YASH PRAVEEN` --> `Yash Praveen Khot`

**Full NAME_MAP dictionary:** See `normalize_and_clean.py` lines 8-69.

### 3.4 Date Standardization

**Column:** Test Date

**Algorithm:** Try parsing against 7 formats in order:
1. `%d-%B-%Y` (e.g. `08-June-2026`)
2. `%d-%b-%Y` (e.g. `08-Jun-2026`)
3. `%d-%m-%Y` (e.g. `08-06-2026`)
4. `%d-%m-%y` (e.g. `08-06-26`)
5. `%d.%m.%Y` (e.g. `08.06.2026`)
6. `%d/%m/%Y` (e.g. `08/06/2026`)
7. `%Y-%m-%d` (e.g. `2026-06-08`)

**Output:** ISO format `YYYY-MM-DD`

**Edge cases:** Empty strings, `NA`, `NIL` are returned as empty string. Unparseable dates are returned unchanged.

### 3.5 Time Parsing to Minutes

**Function:** `parse_time_to_minutes(time_str)`

**Algorithm (4 format attempts):**

1. **Decimal float** (regex: `^\d+\.\d+$`):
   - If value > 24.0, treat as raw minutes and return as-is
   - Otherwise: hours = int part, mins = round((decimal - int) * 100), clamp mins to max 59
   - Return `hours * 60 + mins`
   - Example: `11.5` --> 11 hours, 50 mins --> 710 minutes

2. **Integer** (regex: `^\d+$`):
   - Return `value * 60`
   - Example: `11` --> 660 minutes

3. **AM/PM format** (regex: `^(\d+)(?::(\d+))?(?::(\d+))?(AM|PM)$`):
   - If PM and hour < 12: hour += 12
   - If AM and hour == 12: hour = 0
   - Return `hours * 60 + minutes`
   - Example: `2:30PM` --> 14:30 --> 870 minutes

4. **HH:MM:SS format** (regex: `^(\d+):(\d+)(?::(\d+))?$`):
   - Return `hours * 60 + minutes`
   - Example: `06:52:00` --> 412 minutes

**Null handling:** Returns `None` for empty, `NA`, `NIL`, `#VALUE!`

**Frontend `timeToMinutes()` differs slightly:** See Section 5.1.

### 3.6 Binary Value Standardization

**19 binary columns are cleaned:**

| Input Values | Output |
|---|---|
| `YES`, `Y`, `YE`, `CORRECT`, `DISPLAYED` | `Yes` |
| `NO`, `N`, `NOT YET`, `NOT DISPLAYED` | `No` |
| `NA`, `NIL` | Preserved as-is |
| Anything else | Returned unchanged |

### 3.7 Categorical Label Cleanup

**Overall Test Status:**
- `PASS`, `CORRECT` --> `Pass`
- `FAIL`, `INCORRECT` --> `Fail`

**Defect Severity:**
- `NO DEFECT`, `NO DFECT`, `NIL`, `NA` --> `No Defect`
- `CRITICAL` --> `Critical`

### 3.8 Strict Null Filtering (Core 18 Columns)

A row is **kept** only if ALL of these 18 columns are non-empty, non-`NA`, non-`NIL`, non-`NAN`, non-`N/A`, non-`\\`:

```
Test Date, Tester Name, Build / Version, Channel Tested, Language Tested,
Question ID, Question Category, Type of Question, Overall Test Status,
SLA Status, Defect Severity, Answer Scientifically Correct?,
Question Saved in DB?, Answer Saved in DB?,
Q-ID Consistent Across Systems?, Source Links Provided?,
Translation Quality, Response Time (mins) [Auto]
```

**If any one of these 18 is missing, the row is rejected.**

**Note:** The column `Response Time (mins) [Auto]` has a typo in the header with a space inside: `Respo nse Time (mins) [Auto]`. The code references it with the exact string including the space.

### 3.9 Category-Conditional Rules

After the core null check, additional category-specific rules are applied:

| Condition | Rule |
|---|---|
| Question Category contains `WEATHER` | `Weather Q Answered Correctly?` must not be empty/NA/NIL |
| Question Category contains `MANDI` or `MARKET` | `Mandi Price Q Correct?` must not be empty/NA/NIL |
| Question Category contains `SCHEME` | `Scheme Q Correct?` must not be empty/NA/NIL |

### 3.10 Expert Attribution Check

If `Expert Name Displayed?` = `Yes` AND `Correct Expert Name?` is empty/NA/NIL, the row is rejected.

---

## 4. Backend Server (Stage 2: Node.js)

File: `server.js`

### 4.1 CSV Parsing Logic

1. Read entire file content as UTF-8
2. Find the substring starting at `"Test ID,"` (header row marker)
3. Parse using `csv-parser` library
4. For each row: keep only if `Test ID` is present AND does not start with `Project:` AND is not a repeated `Test ID` header
5. Store parsed records in memory

### 4.2 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/data` | GET | Returns `{ success: true, totalRecords: N, records: [...] }` |
| `/api/upload` | POST | Accepts `multipart/form-data` with field `file`, validates CSV, saves as `updated.csv`, replaces in-memory data |

### 4.3 Default Data

On server start, loads `updated.csv` from project root. If not found, `parsedRecords` is empty.

### 4.4 Static Files

Serves `public/` directory at root `/`. Frontend files: `index.html`, `app.js`, `style.css`.

---

## 5. Frontend Dashboard (Stage 3: JavaScript)

File: `public/app.js`

### 5.1 Frontend Time Parser (Different from Python)

```javascript
function timeToMinutes(timeStr) {
  // Returns null for NA/NIL/empty
  // If numeric string, returns parseFloat directly (raw minutes)
  // If HH:MM:SS format: hours*60 + mins + secs/60
  // If MM:SS format: mins + secs/60
}
```

**Key difference from Python:** The frontend `timeToMinutes` returns fractional minutes (includes seconds as decimal), while the Python `parse_time_to_minutes` returns integer minutes. The frontend also handles `MM:SS` (2-part) format that Python does not.

### 5.2 Filter System (10 Filters)

| Filter ID | CSV Key | Values |
|---|---|---|
| `filter-date-range` | `Test Date` | all, today, 7days, 30days, custom |
| `filter-build` | `Build / Version` | Dynamic from data |
| `filter-sprint` | `Sprint / Cycle` | Dynamic from data |
| `filter-channel` | `Channel Tested` | Dynamic from data |
| `filter-language` | `Language Tested` | Dynamic from data |
| `filter-category` | `Question Category` | Dynamic from data |
| `filter-tester` | `Tester Name` | Dynamic from data |
| `filter-type` | `Type of Question` | Dynamic from data |
| `filter-status` | `Overall Test Status` | Dynamic from data |
| `filter-severity` | `Defect Severity` | Dynamic from data |

**Date Range Logic:**
- `today`: Hardcoded to `2026-07-15` (mock system baseline)
- `7days`: Within 7 calendar days of `2026-07-15`
- `30days`: Within 30 calendar days of `2026-07-15`
- `custom`: User picks start/end date pickers

**Dynamic filter options:** Extracted from `allRecords` with unique trimmed values, excluding empty, `NA`, `NIL`.

### 5.3 Exclude Failures Toggle

When the toggle is ON, records are filtered to exclude:
- `Question Saved in DB?` = `Not Saved`
- `Answer Saved in DB?` = `Not Saved`
- `Q-ID Consistent Across Systems?` = `Wrongly Identified as Duplicate`
- `Defect Severity` = `Critical`

### 5.4 KPI Formulas (Exact Implementation)

All percentages use: `Math.round((numerator / denominator) * 100)`

#### KPI 1: ACE Trust Score

```
Trust Score = 0.40 * A_sci + 0.20 * A_dom + 0.10 * S_lnk + 0.10 * E_exp + 0.10 * Q_trn + 0.10 * C_chn
```

| Component | Definition | Filter Logic |
|---|---|---|
| **A_sci** (Scientific Accuracy) | % rows where `Answer Scientifically Correct?` = `Correct` | Count matching / N * 100 |
| **A_dom** (Domain Accuracy) | Average of 3 sub-accuracies | Each sub-accuracy: if subset is empty, default to 100% |
| -- Weather Acc | `Weather Q Answered Correctly?` = `Yes` / total non-empty Weather rows * 100 | Exclude empty/NA/NIL from denominator |
| -- Mandi Acc | `Mandi Price Q Correct?` = `Yes` / total non-empty Mandi rows * 100 | Exclude empty/NA/NIL from denominator |
| -- Scheme Acc | `Scheme Q Correct?` = `Yes` / total non-empty Scheme rows * 100 | Exclude empty/NA/NIL from denominator |
| **S_lnk** (Source Links) | `Source Links Provided?` = `Provided & Relevant` / N * 100 | |
| **E_exp** (Expert Attribution) | `Expert Name Displayed?` = `Displayed` AND `Correct Expert Name?` = `Yes` / N * 100 | Both conditions must be true |
| **Q_trn** (Translation Quality) | `Translation Quality` = `Correct` OR `Good` / N * 100 | |
| **C_chn** (Cross-Channel Match) | `WhatsApp vs Web Answer Match?` = `Yes` / N * 100 | |

**Final score is `Math.round()` of the weighted sum.**

#### KPI 2: Farmer Experience Score

```
FX Score = 0.30 * S_rsp + 0.20 * S_sla + 0.20 * V_io + 0.15 * Q_trn + 0.15 * N_exp
```

| Component | Definition | Formula |
|---|---|---|
| **S_rsp** (Response Speed) | Per-row linear scaling, then average | If mins <= 15: score=100. If mins > 120: score=0. Else: `100 - ((mins-15)/(120-15))*100`. Average across all valid rows. |
| **S_sla** (SLA Compliance) | `SLA Status` = `Within SLA` / N * 100 | |
| **V_io** (Voice Quality) | Average of 4 binary rates | (VoiceInputYes% + VoiceOutputYes% + VoiceInputClear% + VoiceOutputClear%) / 4 |
| **Q_trn** (Translation Quality) | Same as Trust Score Q_trn | Reused value |
| **N_exp** (Notification Exp) | All 3 conditions met | `Notification Received?` in {`Received on Time`, `Received Late`, `Yes`} AND `Notification on Same Thread?` = `Yes` AND `Notification Linked Correct Q-ID?` = `Yes`, count / N * 100 |

**S_rsp detailed math:**
```
For each row:
  mins = timeToMinutes(Response Time)
  if mins <= 15: score = 100
  elif mins > 120: score = 0
  else: score = 100 - ((mins - 15) / 105) * 100
S_rsp = average of all per-row scores (only rows with valid time)
```

#### KPI 3: Critical Failures Today

```
Critical Failures = countIncorrect + countDbFailure + countNotifFailure + countCriticalBugs
```

| Sub-count | Filter |
|---|---|
| `countIncorrect` | `Answer Scientifically Correct?` = `Incorrect` |
| `countDbFailure` | `Question Saved in DB?` = `Not Saved` OR `Answer Saved in DB?` = `Not Saved` |
| `countNotifFailure` | `Notification Received?` = `Not Received` OR `Notification on Same Thread?` = `No` OR `Notification Linked Correct Q-ID?` = `No` |
| `countCriticalBugs` | `Defect Severity` = `Critical` |

#### KPI 4: Release Health %

```
Release Health % = max(0, min(100, Pass Rate % - Critical Defect Rate % - Data Integrity Failure Rate %))
```

| Sub-rate | Definition |
|---|---|
| `Pass Rate %` | `Overall Test Status` = `Pass` / N * 100 |
| `Critical Defect Rate %` | `Defect Severity` = `Critical` / N * 100 |
| `Data Integrity Failure Rate %` | (`Question Saved in DB?` = `Not Saved` OR `Answer Saved in DB?` = `Not Saved` OR `Q-ID Consistent Across Systems?` = `Wrongly Identified as Duplicate`) / N * 100 |

**Bounded to [0, 100].**

### 5.5 Diagnostic: Biggest Bottleneck

7 stages evaluated:
```
Authoring    -> Author TAT (mins) [Auto]
Review 1     -> Review1 TAT (mins) [Auto]
Review 2     -> Review2 TAT (mins) [Auto]
Review 3     -> Review3 TAT (mins) [Auto]
Review 4     -> Review4 TAT (mins) [Auto]
Review 5     -> Review5 TAT (mins) [Auto]
Moderator    -> Moderator TAT (mins) [Auto]
```

For each stage: parse all valid TAT values to minutes, compute average. Stage with highest average is the bottleneck.

### 5.6 Diagnostic: Weakest Module

For each unique `Question Category`:
1. Filter rows for that category
2. Count rows where `Answer Scientifically Correct?` = `Correct`
3. Compute accuracy = count / total for category * 100
4. Category with lowest accuracy is the weakest module

### 5.7 Diagnostic: Open Critical Defects

Filter rows where `Defect Severity` = `Critical` OR `High`. Extract unique `Defect ID / Bug Ref Zoho Desk Ticketing` URLs. Display first 10 as clickable ticket links.

### 5.8 Chart Data

**Trust & Experience Trend (Line Chart):**
- Group rows by `Test Date`
- For each date: simplified Trust = `0.5 * A_sci + 0.5 * C_chn`
- For each date: Experience = SLA compliance %

**Latency Trend (Line Chart):**
- For each date: average of `timeToMinutes(Response Time)`

**Defect Volume (Bar Chart):**
- Group rows by `Sprint / Cycle`
- For each sprint: count of Critical + High severity defects

---

## 6. Python vs Frontend Discrepancies

These differences matter when replicating results:

| Aspect | Python (`normalize_and_clean.py`) | Frontend (`app.js`) |
|---|---|---|
| **Time parser output** | Integer minutes | Fractional minutes (includes secs) |
| **Time parser formats** | 4 formats (decimal, integer, AM/PM, HH:MM) | 3 formats (numeric, HH:MM:SS, MM:SS) |
| **Decimal time handling** | >24.0 = raw minutes, else hours+mins | All decimals treated as raw minutes via parseFloat |
| **Default dataset** | Outputs `cleandataset.csv` (909 rows) | Loads `updated.csv` (~3,000 rows) |
| **Null filter** | 18 core columns must be non-empty | Only runtime "Exclude Failures" toggle |
| **NA/NIL handling** | Preserved in binary cols, stripped in names | Stripped in filter options |
| **Date hardcode** | None | `now = new Date('2026-07-15')` hardcoded |

---

## 7. What You Need to Duplicate

### 7.1 Required Files

```
normalize_and_clean.py    # Python cleaning pipeline
server.js                 # Node.js Express backend
public/
  index.html              # Dashboard UI
  app.js                  # Frontend KPI logic
  style.css               # Styling
```

### 7.2 Required Dependencies

```bash
npm install express csv-parser multer
```

### 7.3 Step-by-Step Replication

**Step 1: Get the raw data**
- Source: Google Sheet export as `.xlsx` or `.csv`
- Must have all 81 columns matching the column map in Section 2
- If your column names differ, update all header references in `normalize_and_clean.py` and `app.js`

**Step 2: Run normalization**
```bash
python normalize_and_clean.py --input "raw_data.csv" --output "cleandataset.csv"
```
- Produces 909 clean rows (assuming same raw data)
- The `NAME_MAP` must match your team's actor names. If new testers join, add their variations to the dictionary

**Step 3: Prepare `updated.csv`**
- Copy either your raw standardized data or the cleaned output to `updated.csv` in the project root
- The server loads this on startup
- If you want the "full" dataset without strict null filtering, use a less aggressive cleaning pass

**Step 4: Start the server**
```bash
node server.js
# Runs at http://localhost:3000
```

**Step 5: Verify KPIs**
- Open browser to `http://localhost:3000`
- Expected values for `cleandataset.csv` (909 rows):
  - ACE Trust Score: 82.49%
  - Farmer Experience Score: 66.70%
  - Pass Rate: 91.31%
  - Critical Defects: 63

### 7.4 Critical Parameters That Affect Results

1. **Column name typos in headers:** The column `Response Time (mins) [Auto]` actually has a space inside the word "Response" -> `Respo nse Time (mins) [Auto]`. All references must match exactly.

2. **Date baseline:** The frontend hardcodes `now = new Date('2026-07-15')`. Change this to `new Date()` for live data.

3. **NAME_MAP completeness:** If your data has new actors not in the dictionary, they'll fall back to Title Case but won't match other rows that were standardized to a full name.

4. **Empty subset default for A_dom:** If all Weather rows are empty, weather accuracy defaults to 100%. This inflates Trust Score when domain data is sparse.

5. **S_rsp scoring curve:** The 15-min floor and 120-min ceiling for response speed scoring are arbitrary thresholds. Changing them shifts FX Score significantly.

6. **Binary column semantics:** Some columns use non-standard labels:
   - `Source Links Provided?`: `Provided & Relevant` (not just `Yes`)
   - `Expert Name Displayed?`: `Displayed` (not `Yes`)
   - `Question Saved in DB?`: `Saved` / `Not Saved` / `Duplicate`
   - `Q-ID Consistent Across Systems?`: `Consistent` / `Wrongly Identified as Duplicate`

7. **Exclusion criteria difference:** Python excludes rows missing 18 core fields. Frontend toggle only excludes Critical severity + DB failures + Q-ID inconsistencies. These are different filters producing different row counts.

8. **TAT column naming:** Review stages use `Review1 TAT (mins) [Auto]` through `Review5 TAT (mins) [Auto]` (no space between Review and number). The `Author TAT (mins) [Auto]` and `Moderator TAT (mins) [Auto]` follow the same pattern.

---

## 8. KPI Impact: Raw vs Clean Dataset

| Metric | Raw (5,110 rows) | Clean (909 rows) | Change |
|---|---|---|---|
| ACE Trust Score | 70.10% | 82.49% | +12.39% |
| Farmer Experience Score | 51.90% | 66.70% | +14.80% |
| Overall Pass Rate | 65.60% | 91.31% | +25.71% |
| Critical Defects | 101 | 63 | -38 |
| Data Integrity Failures | 3,259 | 872 | -2,387 |

**Explanation:** Incomplete QA records (missing test statuses, categories, response times) were skewing performance metrics downward. Filtering to fully complete records reveals significantly higher chatbot quality.

---

## 9. Known Issues & Gotchas

1. **Selection Bias in Clean Dataset:** The strict null filter requires `Q-ID Consistent Across Systems?` to be populated. In raw data, 67.3% of rows leave this blank. Forcing it to be filled selects a subset where 95.9% are logged as `Wrongly Identified as Duplicate`, inflating the Data Integrity Failure Rate to 95.93%.

2. **Hardcoded Date:** `app.js` line 166 uses `new Date('2026-07-15')` as the "now" baseline. This must be changed for production use.

3. **Release Health Always 0% in Some Configs:** Due to the high data integrity failure rate (from the selection bias above), `passRate - criticalDefectRate - dataIntegrityRate` often goes negative, clamped to 0%.

4. **Column Name Whitespace:** `Respo nse Time (mins) [Auto]` has a space inside "Response". All code references must match this exactly.

5. **Upload Overwrites:** The `/api/upload` endpoint overwrites `updated.csv` permanently. There is no versioning or backup.

6. **No Authentication:** The server has no auth. Anyone on the network can upload data.

7. **In-Memory Data:** Parsed records are held in memory. Large datasets (>100K rows) may cause memory issues.
