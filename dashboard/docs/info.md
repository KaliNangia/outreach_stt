# Agri Advisory (Annam AI) QA Test Log & Dashboard Blueprint

This document serves as both a **Detailed QA Analysis Report** of the testing log dataset (`Agri_Advisory_QA_Test_Log (1.0).xlsx` - Sheet: `Test Log_1`) and a **Technical Blueprint/Specification** for building the **ACE Executive Health Dashboard** based on `Tester Data Dashboard requirements.pdf`.

---

## 🎯 Part 1: Dashboard Goals & Tech Stack

Based on management requirements, the dashboard will serve as a decision-making tool for tracking the performance of the **GDB (Global Database) answering model** and the human expert ecosystem.

* **Primary Users:** Management / Executive leadership.
* **Core Decisions:** Evaluate GDB answering accuracy, expert response bottleneck stages, and overall platform health.
* **Tech Stack:** **Node.js** backend with a web-based frontend.
* **Data Integration:** Read-only interface that periodically pulls and refreshes data from the central Google Sheet log.
* **Reporting:** Support exporting executive reports to **PDF**.

---

## 📐 Part 2: Executive KPIs & Mathematical Logic

The dashboard will calculate and display four primary high-level metrics and three operational diagnostic indicators.

### 1. ACE Trust Score (Quality Indicator)
Evaluates scientific accuracy, compliance, and consistency of answers across channels.
$$\text{ACE Trust Score} = 40\%(\text{Scientific Accuracy}) + 20\%(\text{Domain Accuracy}) + 10\%(\text{Source Links}) + 10\%(\text{Expert Accuracy}) + 10\%(\text{Translation Quality}) + 10\%(\text{Cross Channel Consistency})$$

* **Mapped Columns:**
  * `Answer Scientifically Correct?` (Scientific Accuracy)
  * `Weather Q Answered Correctly?`, `Mandi Price Q Correct?`, `Scheme Q Correct?` (Domain Accuracy)
  * `Source Links Provided?` (Source Links)
  * `Correct Expert Name?`, `Expert Name Displayed?` (Expert Accuracy)
  * `Translation Quality`, `Question Correctly Framed?` (Translation Quality)
  * `WhatsApp vs Web Answer Match?` (Cross-Channel Consistency)

### 2. Farmer Experience (FX) Score (Performance Indicator)
Measures the user-facing latency and usability of the platforms.
$$\text{Farmer Experience Score} = 30\%(\text{Response Speed}) + 20\%(\text{SLA Compliance}) + 20\%(\text{Voice Quality}) + 15\%(\text{Translation Quality}) + 15\%(\text{Notification Experience})$$

* **Mapped Columns:**
  * `Response Time (mins) [Auto]` (Response Speed)
  * `SLA Status` (SLA Compliance)
  * `Voice Input Working?`, `Voice Output Working?`, `Voice Input Quality`, `Voice Output Quality` (Voice Quality)
  * `Translation Quality`, `Question Correctly Framed?` (Translation)
  * `Notification Received?`, `Notification on Same Thread?`, `Notification Linked Correct Q-ID?`, `120-min Msg Shown to User?` (Notification Experience)

### 3. Critical Failures Today
A direct summation of today's fatal errors in logic, accuracy, database integration, or notifications.
* **Logic/Rule:** Count of records where any of the following are failed or critical:
  * `Answer Scientifically Correct?` is "Incorrect"
  * `Weather Q Answered Correctly?` or `Mandi Price Q Correct?` or `Scheme Q Correct?` is "Incorrect"
  * `Question Saved in DB?` or `Answer Saved in DB?` is "No" or "Not Saved"
  * `Q-ID Consistent Across Systems?` is "No"
  * `Notification Linked Correct Q-ID?` is "No"
  * `Defect Severity` is "Critical"

### 4. Release Health
A combined KPI indicating the stability and readiness of the current build version.
$$\text{Release Health} = \text{Overall Pass Rate} - \text{Critical Defect Count} - \text{Data Integrity Failures}$$

* **Mapped Columns:** `Overall Test Status`, `Defect Severity`, `Status`, `Build / Version`, `Sprint / Cycle`, `Question Saved in DB?`, `Answer Saved in DB?`, `Q-ID Consistent Across Systems?`.

### 5. Biggest Bottleneck (Operational Diagnostic)
* **Logic:** Evaluates the average turnaround times (TAT) at each stage of the human-in-the-loop validation flow and flags the stage with the highest latency.
* **Stages Tracked:** `Author TAT (mins) [Auto]`, `Review1 TAT` through `Review5 TAT`, and `Moderator TAT (mins) [Auto]`.

### 6. Weakest Module (Operational Diagnostic)
* **Logic:** Identifies the module category or feature set with the lowest average accuracy.
* **Components Evaluated:** Weather Queries, Mandi Price Queries, Scheme Queries, Translation Quality, Voice Input Quality, and Voice Output Quality.

---

## 🖥️ Part 3: Dashboard Wireframe & Layout

The Node.js UI layout follows a structured executive grid:

```mermaid
graph TD
    subgraph Header
        H[\"ACE Executive Health Dashboard\"/]
    end
    subgraph Filters
        F[\"Date Range | Build Version | Sprint Cycle | Channel | Language | Category | Tester | Question Type\"/]
    end
    subgraph Row 1: High-Level KPIs
        K1[\"ACE Trust Score\"/]
        K2[\"Farmer Experience Score\"/]
        K3[\"Critical Failures\"/]
        K4[\"Release Health\"/]
    end
    subgraph Row 2: Diagnostic Metrics
        D1[\"Biggest Bottleneck\"/]
        D2[\"Weakest Module\"/]
        D3[\"Historical Trends (Chart)\"/]
        D4[\"Open Critical Defects List\"/]
    end
    Header --> Filters
    Filters --> Row 1
    Row 1 --> Row 2
```

---

---

## ⚠️ Critical Duplicate Violations (Unique Key & Row Redundancy)

> [!WARNING]
> The spreadsheet contains active duplicate violations that must be resolved before dashboard ingestion:

### 1. Duplicate Test IDs (Primary Key Violations)
The following `Test ID` values are repeated across different rows. Under our golden rules, `Test ID` must be unique. Duplicate keys break dashboard indexing.

| Duplicate Test ID | Row Numbers |
| :--- | :--- |
| `TL-4613` | Excel Rows: 4620, 4634 |
| `TL-4614` | Excel Rows: 4621, 4635 |
| `TL-4615` | Excel Rows: 4622, 4636 |
| `TL-4616` | Excel Rows: 4623, 4637 |
| `TL-4617` | Excel Rows: 4624, 4638 |
| `TL-4618` | Excel Rows: 4625, 4639 |
| `TL-4619` | Excel Rows: 4626, 4640 |
| `TL-4620` | Excel Rows: 4627, 4641 |
| `TL-4621` | Excel Rows: 4628, 4642 |
| `TL-4622` | Excel Rows: 4629, 4643 |
| `TL-4623` | Excel Rows: 4630, 4644 |
| `TL-4624` | Excel Rows: 4631, 4645 |
| `TL-4625` | Excel Rows: 4632, 4646 |
| `TL-4626` | Excel Rows: 4633, 4647 |


### 2. Completely Identical Data Rows (Redundancy Violations)
The following rows contain 100% identical data values (ignoring the `Test ID` column). 

* **What is Duplicate here?** 
  These duplicate rows represent **boilerplate duplicate test entries** where the QA testers left most fields (such as `Query Text`, `Test Date`, `Tester Name`, and `Question Category`) completely blank. Instead, they only entered identical static placeholder strings like `'NA'`, `'NIL'`, and `'Successfully Identified as Duplicate'`. Because these placeholder footprints are identical across columns, the rows appear as 100% duplicates of one another.
  
  *Example footprint (e.g. Row 7):*
  * `Translation Error Type` = `'NIL'`
  * `Tagging` = `'NA'`
  * Time & TAT fields = `'NA'`
  * `Q-ID Consistent Across Systems?` = `'Successfully Identified as Duplicate'`
  * `Reviewer Remarks` = `'NIL'`
  * *All other columns* = `None` (empty)

| Occurrences | Row Numbers | Pattern / Query Excerpt |
| :---: | :--- | :--- |
| 3x | Excel Rows: 7, 511, 512 | Boilerplate row with no unique test data (Only `'NA'`, `'NIL'`) |
| 15x | Excel Rows: 39, 120, 305, 318, 319, 320, 321, 326, 327, 352, 477, 531, 536, 545, 558 | Boilerplate row with `Sprint/Cycle: 'NIL'` (All other data empty) |
| 2x | Excel Rows: 41, 42 | Identical rows with `Tester Name: 'Ithagani Shireesha'` and boilerplate `'NA'`s |
| 5x | Excel Rows: 1174, 1175, 1176, 1177, 1178 | Identical rows with `Tester Name: 'Ithagani shireesha '` and boilerplate `'NA'`s |
| 7x | Excel Rows: 1704, 1705, 1706, 1707, 1708, 1709, 1731 | Boilerplate row with `Voice Input Quality: 'Clear'` |
| 2x | Excel Rows: 727, 728 | Identical rows with `Test Date: '15-06-2026'`, `Tester Name: 'Ithagani shireesha '`, `Build/Version: 0.1` |

## 🔎 Part 4: Column-by-Column Data Audit (Golden Rules Validation)

As requested, each column has been audited against the golden rules for formatting, nullability, and casing. Columns flagged as **❌ Prep** require cleaning before loading into the dashboard.

| Index | Column Name | Expected Type | Nullability Spec | Nulls Count (% Null) | Casing Inconsistencies | Format Errors | Status |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | **Test ID** | N | N | 0 (0.0%) | 0 | 0 | ✅ GOOD |
| 2 | **Test Date** | Date | Y | 204 (3.7%) | 0 | 69 | ❌ Prep (Format) |
| 3 | **Tester Name** | NC | N | 203 (3.7%) | 8 | 0 | ✅ GOOD |
| 4 | **Type of Question** | C | Y | 1435 (26.0%) | 5 | 0 | ✅ GOOD |
| 5 | **Build / Version** | C | Y | 218 (4.0%) | 0 | 0 | ✅ GOOD |
| 6 | **Sprint / Cycle** | C | Y | 249 (4.5%) | 1 | 0 | ✅ GOOD |
| 7 | **Channel Tested** | C | Y | 261 (4.7%) | 3 | 0 | ✅ GOOD |
| 8 | **Language Tested** | C | Y | 231 (4.2%) | 0 | 0 | ✅ GOOD |
| 9 | **Question ID** | N | N | 480 (8.7%) | 0 | 0 | ✅ GOOD |
| 10 | **Query Text (Original)** | NC | Y | 241 (4.4%) | 15 | 0 | ✅ GOOD |
| 11 | **Question Category** | C | Y | 394 (7.1%) | 3 | 0 | ✅ GOOD |
| 12 | **Time Question Asked (HH:MM:SS)** | Time | Y | 409 (7.4%) | 0 | 121 | ❌ Prep (Format) |
| 13 | **Time Answer Received (HH:MM:SS)** | Time | Y | 1357 (24.6%) | 1 | 286 | ❌ Prep (Format) |
| 14 | **Respo nse Time (mins) [Auto]** | Time | Y | 1722 (31.2%) | 20 | 3756 | ❌ Prep (Format) |
| 15 | **SLA Status** | C | Y | 1124 (20.4%) | 3 | 0 | ✅ GOOD |
| 16 | **Question in Review Model?** | C | Y | 958 (17.4%) | 2 | 0 | ✅ GOOD |
| 17 | **Question Correctly Framed?** | C | Y | 908 (16.5%) | 0 | 0 | ✅ GOOD |
| 18 | **Original Language** | C | Y | 809 (14.7%) | 3 | 0 | ✅ GOOD |
| 19 | **Translated Language** | C | Y | 828 (15.0%) | 2 | 0 | ✅ GOOD |
| 20 | **Translation Quality** | C | Y | 847 (15.4%) | 4 | 0 | ✅ GOOD |
| 21 | **Translation Error Type** | C | Y | 699 (12.7%) | 2 | 0 | ✅ GOOD |
| 22 | **Tagging** | C | Y | 794 (14.4%) | 1 | 0 | ✅ GOOD |
| 23 | **Allocated to Reviewer?** | C | Y | 1224 (22.2%) | 5 | 0 | ✅ GOOD |
| 24 | **Author's Name** | NC | Y | 1517 (27.5%) | 119 | 0 | ✅ GOOD |
| 25 | **Author Assignment Time** | Time | Y | 677 (12.3%) | 0 | 3970 | ❌ Prep (Format) |
| 26 | **Author Completion Time** | Time | Y | 713 (12.9%) | 0 | 3950 | ❌ Prep (Format) |
| 27 | **Author TAT (mins) [Auto]** | Duration | Y | 699 (12.7%) | 0 | 4605 | ❌ Prep (Format) |
| 28 | **Reviewer1 Name** | NC | Y | 669 (12.1%) | 45 | 0 | ✅ GOOD |
| 29 | **Reviewer1 Assignment Time** | Time | Y | 679 (12.3%) | 0 | 3975 | ❌ Prep (Format) |
| 30 | **Reviewer1 Completion Time** | Time | Y | 723 (13.1%) | 0 | 3946 | ❌ Prep (Format) |
| 31 | **Review1 TAT (mins) [Auto]** | Duration | Y | 717 (13.0%) | 0 | 4585 | ❌ Prep (Format) |
| 32 | **Reviewer2 Name** | NC | Y | 671 (12.2%) | 46 | 0 | ✅ GOOD |
| 33 | **Reviewer2 Assignment Time** | Time | Y | 680 (12.3%) | 0 | 3973 | ❌ Prep (Format) |
| 34 | **Reviewer2 Completion Time** | Time | Y | 728 (13.2%) | 0 | 3937 | ❌ Prep (Format) |
| 35 | **Review2 TAT (mins) [Auto]** | Duration | Y | 720 (13.1%) | 0 | 4584 | ❌ Prep (Format) |
| 36 | **Reviewer3 Name** | NC | Y | 671 (12.2%) | 47 | 0 | ✅ GOOD |
| 37 | **Reviewer3 Assignment Time** | Time | Y | 679 (12.3%) | 0 | 3973 | ❌ Prep (Format) |
| 38 | **Reviewer3 Completion Time** | Time | Y | 721 (13.1%) | 0 | 3943 | ❌ Prep (Format) |
| 39 | **Review3 TAT (mins) [Auto]** | Duration | Y | 720 (13.1%) | 0 | 4585 | ❌ Prep (Format) |
| 40 | **Reviewer4 Name** | NC | Y | 503 (9.1%) | 3 | 0 | ✅ GOOD |
| 41 | **Reviewer4 Assignment Time** | Time | Y | 510 (9.2%) | 1 | 4986 | ❌ Prep (Format) |
| 42 | **Reviewer4 Completion Time** | Time | Y | 511 (9.3%) | 1 | 4986 | ❌ Prep (Format) |
| 43 | **Review4 TAT (mins) [Auto]** | Duration | Y | 511 (9.3%) | 1 | 4998 | ❌ Prep (Format) |
| 44 | **Reviewer5 Name** | NC | Y | 511 (9.3%) | 1 | 0 | ✅ GOOD |
| 45 | **Reviewer5 Assignment Time** | Time | Y | 512 (9.3%) | 1 | 4996 | ❌ Prep (Format) |
| 46 | **Reviewer5 Completion Time** | Time | Y | 512 (9.3%) | 1 | 4996 | ❌ Prep (Format) |
| 47 | **Review5 TAT (mins) [Auto]** | Duration | Y | 511 (9.3%) | 1 | 5002 | ❌ Prep (Format) |
| 48 | **Moderator's Name** | NC | Y | 748 (13.6%) | 21 | 0 | ✅ GOOD |
| 49 | **Moderator Assignment Time** | Time | Y | 759 (13.8%) | 1 | 4307 | ❌ Prep (Format) |
| 50 | **ModeratorCompletion Time** | Time | Y | 732 (13.3%) | 0 | 3888 | ❌ Prep (Format) |
| 51 | **Moderator TAT (mins) [Auto]** | Duration | Y | 726 (13.2%) | 0 | 4558 | ❌ Prep (Format) |
| 52 | **Follow-up Q in Review Model?** | C | Y | 1213 (22.0%) | 2 | 0 | ✅ GOOD |
| 53 | **Answer Scientifically Correct?** | C | Y | 1519 (27.5%) | 3 | 0 | ✅ GOOD |
| 54 | **Expert Name Displayed?** | NC | Y | 1552 (28.1%) | 2 | 0 | ✅ GOOD |
| 55 | **Correct Expert Name?** | NC | Y | 1543 (28.0%) | 3 | 0 | ✅ GOOD |
| 56 | **Source Links Provided?** | C | Y | 1586 (28.8%) | 4 | 0 | ✅ GOOD |
| 57 | **120-min Msg Shown to User?** | C | Y | 1260 (22.8%) | 4 | 0 | ✅ GOOD |
| 58 | **Notification Received?** | C | Y | 1609 (29.2%) | 3 | 0 | ✅ GOOD |
| 59 | **Notification on Same Thread?** | C | Y | 1606 (29.1%) | 5 | 0 | ✅ GOOD |
| 60 | **Notification Linked Correct Q-ID?** | N | N | 1624 (29.4%) | 4 | 0 | ✅ GOOD |
| 61 | **Voice Input Working?** | C | Y | 1163 (21.1%) | 4 | 0 | ✅ GOOD |
| 62 | **Voice Output Working?** | C | Y | 1261 (22.9%) | 4 | 0 | ✅ GOOD |
| 63 | **Voice Input Quality** | C | Y | 1176 (21.3%) | 8 | 0 | ✅ GOOD |
| 64 | **Voice Output Quality** | C | Y | 1277 (23.2%) | 4 | 0 | ✅ GOOD |
| 65 | **Voice Issue Description** | NC | Y | 1387 (25.1%) | 15 | 0 | ✅ GOOD |
| 66 | **Weather Q Answered Correctly?** | C | Y | 1125 (20.4%) | 3 | 0 | ✅ GOOD |
| 67 | **Mandi Price Q Correct?** | C | Y | 1099 (19.9%) | 1 | 0 | ✅ GOOD |
| 68 | **Scheme Q Correct?** | C | Y | 1103 (20.0%) | 1 | 0 | ✅ GOOD |
| 69 | **Question Saved in DB?** | C | Y | 1340 (24.3%) | 6 | 0 | ✅ GOOD |
| 70 | **Answer Saved in DB?** | C | Y | 1715 (31.1%) | 4 | 0 | ✅ GOOD |
| 71 | **Q-ID Consistent Across Systems?** | N | N | 641 (11.6%) | 0 | 0 | ✅ GOOD |
| 72 | **WhatsApp vs Web Answer Match?** | C | Y | 1494 (27.1%) | 3 | 0 | ✅ GOOD |
| 73 | **Overall Test Status** | C | Y | 1714 (31.1%) | 5 | 0 | ✅ GOOD |
| 74 | **Defect Severity** | C | Y | 1848 (33.5%) | 14 | 0 | ✅ GOOD |
| 75 | **Defect ID / Bug Ref Zoho Desk Ticketing** | N | N | 3432 (62.2%) | 3 | 0 | ✅ GOOD |
| 76 | **Reviewer Remarks** | NC | Y | 1200 (21.8%) | 1 | 0 | ✅ GOOD |
| 77 | **Tester Remarks** | NC | Y | 1223 (22.2%) | 33 | 0 | ✅ GOOD |
| 78 | **Status** | C | Y | 1832 (33.2%) | 2 | 0 | ✅ GOOD |
| 79 | **Unnamed: 79** | C | Y | 5514 (100.0%) | 0 | 0 | ✅ GOOD |
| 80 | **Unnamed: 80** | C | Y | 5515 (100.0%) | 0 | 0 | ✅ GOOD |
| 81 | **Unnamed: 81** | C | Y | 5514 (100.0%) | 0 | 0 | ✅ GOOD |

---

## 📝 Part 5: Diagnostic Summary of Column Group Failures (With Real Examples)

Below are the exact row numbers and values demonstrating the errors found during the data audit of the spreadsheet.

### 1. 🚨 Critical Null Violations in Required Columns
* **Tester Name (Col 3):** 203 null cells.
  * *Examples:* Row 7 (Test ID: `TL-0005`), Row 8 (Test ID: `TL-0006`), Row 10 (Test ID: `TL-0008`), Row 16 (Test ID: `TL-0014`), Row 24 (Test ID: `TL-0022`).
Based on an analysis of the **Tester Name** column in the `Copy_of_Agri_Advisory_QA_Test` table, here are the unique entries and distinct values present.

There are **37 raw unique text variations** in the table, which resolve to **11 distinct tester names** after cleaning up inconsistent spacing, line breaks, casing, and minor typos.

### Distinct Tester Names (Cleaned & Standardized)
Below is the standardized list of the 11 actual testers identified, along with their record counts and the raw variations found in the table:

| Standardized Tester Name | Record Count | Raw Variations Found in Table                                                                                                                                             |
| :----------------------- | :----------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Lavanya Mathialagan**  | 863          | `Lavanya Mathialagan`, `Lavanya \nmathialagan`, `Lavanya \nMathialagan`, `lavanya Mathialagan`, `  Lavanya Mathialagan `, ` Lavanya Mathialagan  `, `Lavanya mathialagan` |
| **Ithagani Shireesha**   | 850          | `Ithagani Shireesha`, `Ithagani shireesha`, ` Ithagani shireesha  `, ` Ithagani Shireesha  `                                                                              |
| **Dhaarani S**           | 820          | `Dhaarani S`, `Dhaarani. S`, `Dhaarani.S`, ` Dhaarani.S  `, ` Dhaarani. S  `                                                                                              |
| **Joydeep**              | 769          | `JOYDEEP`, ` JOYDEEP  `, `JHOYDEEP` *(typo)*                                                                                                                              |
| **K. Deni Sudha**        | 584          | `K.Deni sudha`, `K. Deni sudha`, ` K.Deni sudha  `                                                                                                                        |
| **Rishi Kumar G**        | 512          | `Rishi Kumar G`, `Rishi Kumar.G`                                                                                                                                          |
| **T. Vishnu Vardhan**    | 499          | `T.Vishnu Vardhan`, `T.Vishnu vardhan`, `T. Vishnu vardhan`, `T. Vishnu Vardhn` *(typo)*, `T. Vishnu Vardhan`, `T.VIshnu Vardhan`                                         |
| **CH. Sharmila**         | 401          | `CH.Sharmila`, ` CH.sharmila  `, `CH. sharmila`                                                                                                                           |
| **Nimisha**              | 11           | `Nimisha`                                                                                                                                                                 |
| **Souvik Roy**           | 1            | `Souvik Roy`                                                                                                                                                              |
| **Suruchi Mittal**       | 1            | `SURUCHI MITTAL`                                                                                                                                                          |

### Other Entries & Anomalies
In addition to the valid tester names, the following entries were found in the column:
* **Missing / Blank Entries (234 records)**: Rows where the tester name was left blank.
* **Metadata Row (1 record)**: A spreadsheet section header row containing `[merged] Project: Agri Advisory`.
* **Data Entry Error (1 record)**: One row (Test ID `TL-2507`) has `TL-2523` entered in the `Tester Name` column (and `TL-2522` in the `Test Date` column), which appears to be a copy-paste error.

* **Question ID (Col 9):** 480 null cells.
  * *Examples:* Row 7 (Test ID: `TL-0005`), Row 8 (Test ID: `TL-0006`), Row 10 (Test ID: `TL-0008`), Row 16 (Test ID: `TL-0014`), Row 24 (Test ID: `TL-0022`).
* **Notification Linked Correct Q-ID? (Col 60):** 1,624 null cells.
  * *Examples:* Row 4 (Test ID: `1.0`), Row 5 (Test ID: `2.0`), Row 6 (Test ID: `Project:  Agri Advisory`), Row 7 (Test ID: `TL-0005`).
* **Q-ID Consistent Across Systems? (Col 71):** 641 null cells.
  * *Examples:* Row 7 (Test ID: `TL-0005`), Row 8 (Test ID: `TL-0006`), Row 10 (Test ID: `TL-0008`), Row 16 (Test ID: `TL-0014`).
* **Defect ID / Bug Ref Zoho Desk Ticketing (Col 75):** 3,432 null cells.
  * *Examples:* Row 5 (Test ID: `2.0`), Row 6 (Test ID: `Project:  Agri Advisory`), Row 7 (Test ID: `TL-0005`), Row 8 (Test ID: `TL-0006`).

### 2. 📅 Format & Type Violations
* **Test Date (Col 2):** 69 rows containing non-standard dates written as text strings instead of Date objects.
  * *Examples:*
    * Row 226 (Test ID: `TL-0224`): `'10.06.2026'` (contains dot delimiters)
    * Row 456 (Test ID: `TL-0454`): `'14-06-2026'` (hyphenated text string)
    * Row 481 (Test ID: `TL-0479`): `'12-06 -2026'` (contains trailing space error)
    * Row 559 (Test ID: `TL-0557`): `'13-06-2026'` (unparsed date string)
* **Times (Asked & Received Columns):** 121 Asked errors and 286 Received errors containing string text, floats, or unparsed values.
  * *Examples:*
    * Row 9 (Test ID: `TL-0007`) in *Time Asked*: `'06:52:AM'` (uses a string suffix)
    * Row 11 (Test ID: `TL-0009`) in *Time Received*: `'6.21am'` (uses dot delimiter and suffix)
    * Row 12 (Test ID: `TL-0010`) in *Time Asked*: `11.0` (floating-point decimal number)
    * Row 12 (Test ID: `TL-0010`) in *Time Received*: `6.52` (floating-point decimal number)
    * Row 17 (Test ID: `TL-0015`) in *Time Received*: `7.48` (floating-point decimal number)
* **Response Time (Col 14):** 3,756 cells containing string values, timedelta formulas, and failed calculations.
  * *Examples:*
    * Row 11 (Test ID: `TL-0009`): `'#VALUE!'` (failed Excel formula)
    * Row 25 (Test ID: `TL-0023`): `'#VALUE!'` (failed Excel formula)
    * Row 26 (Test ID: `TL-0024`): `'#VALUE!'`
    * Row 27 (Test ID: `TL-0025`): `'#VALUE!'`
    * Row 28 (Test ID: `TL-0026`): `'#VALUE!'`
* **TAT Columns (Cols 27, 31, 35, 39, 43, 47, 51):** Over 4,500 cells with uncalculatable values or formula failures.
  * *Examples:*
    * Row 4 (Test ID: `1.0`): `'NA'` (string fallback)
    * Row 5 (Test ID: `2.0`): `'NA'`
    * Row 7 (Test ID: `TL-0005`): `'NA'`
    * Row 8 (Test ID: `TL-0006`): `'NA'`
    * Row 9 (Test ID: `TL-0007`): `'NA'`

### 3. 🔠 Casing & Spelling Inconsistencies
* **Defect Severity:** 30 variations, including casing errors and custom sentences.
  * *All Casing & Spelling Variants present in logs:*
    * `NO DEFECT`, `No Defect`, `no defect`, `No defect`, `NO defect`, `NO Defect`, `NIL`, `Nil`, `NA`, `N A`, `No`, `no dfect` (typo)
    * `critical`, `Crtical` (typo), `Critical`
    * `medium`, `MEDIUM`, `Medium`
    * `low`, `LOW`, `Low`
    * `high`, `HIGH`, `High`
    * `info`, `INFO`, `Info`
    * Custom tester comments (e.g. `'Appearance of some gibberish letters in between the text.'`, `'extreme'`, `'Answer is not relevant to the asked question'`, `'missed few points'`)
* **Overall Test Status:** 11 variations.
  * *All Variants present in logs:* `Pass`, `pass`, `PASS`, `FAIL`, `Fail`, `PARTIAL`, `partial`, `Partial`, `Pas` (typo), `NA`, `\\` (slash)
* **SLA Status:** 11 variations.
  * *All Variants present in logs:* `Within SLA`, `within SLA`, `WITHIN SLA`, `Within the SLA`, `SLA Breached`, `SLA breached`, `SLA Breachd` (typo), `Breached SLA`, `Not Applicable`, `NA`, `\\`
* **Channel Tested:** 7 variations.
  * *All Variants present in logs:* `Web App`, `Web app`, `webapp`, `WhatsApp`, `Both`, `BOTH`, `both`

---

### 4. 🔬 Deep-Dive: Column 4 (Type of Question) Inconsistencies
Based on a detailed audit of the **Type of Question** column (Column 4), we found **13 raw variations** (including blank cells) representing a mix of spelling typos and casing duplicates. These resolve to **4 standardized categories** (excluding nulls).

### Standardized Question Types (Cleaned)
If casing issues and typos are resolved, the distribution of question types is as follows:

| Standardized Category | Standarized Count | Mapped Raw Variations (with Counts) |
| :------------------- | :---------------: | :---------------------------------- |
| **GDB**              | 1,565             | `GDB` (1,559), `gdb` (6) |
| **GDP**              | 190               | `GDP` (190) |
| **Unique**           | 1,955             | `Unique` (1,322), `UNIQUE` (578), `unique` (54), `Uniuqe` (1) *(typo)* |
| **Dynamic**          | 365               | `Dynamic` (237), `DYNAMIC` (93), `dynamic` (34), `Dynmic` (1) *(typo)* |
| **Quality checking**  | 5                 | `Quality checking` (5) |
| *Missing (Null)*     | 1,435             | `[NULL]` (1,435) |

### Spelling Typos & Anomalies Highlighted
* **`GDP` (190 records)**: Treated as a distinct and valid category separate from `GDB` (appearing in rows like Rows 1075, 1076, 1077, 1078, 1079).
* **`Uniuqe` (1 record)**: A spelling typo for `Unique` found on **Row 1453** (Test ID: `TL-1451`).
* **`Dynmic` (1 record)**: A spelling typo for `Dynamic` found on **Row 3784** (Test ID: `TL-3774`).
* **`Quality checking` (5 records)**: A unique non-standard category found on Rows 5505, 5506, 5507, 5508, 5509.
* **Missing / Blank Entries (1,435 records)**: 26.0% of the dataset is missing a question type. In accordance with data rules, these must not be assumed or filled, and must remain null.

### Raw Values & Row Examples
* **`GDB`** (1,559 records): Rows 1389, 1390, 1391, 1392, 1393
* **`Unique`** (1,322 records): Rows 1017, 1018, 1019, 1020, 1021
* **`UNIQUE`** (578 records): Rows 1507, 1508, 1509, 1510, 1511
* **`Dynamic`** (237 records): Rows 1085, 1086, 1087, 1229, 1230
* **`GDP`** (190 records): Rows 1075, 1076, 1077, 1078, 1079
* **`DYNAMIC`** (93 records): Rows 1542, 1543, 1544, 1545, 1546
* **`unique`** (54 records): Rows 1815, 1816, 1817, 1818, 1819
* **`dynamic`** (34 records): Rows 980, 981, 982, 986, 987
* **`gdb`** (6 records): Rows 983, 1385, 1386, 1387, 1408
* **`Quality checking`** (5 records): Rows 5505, 5506, 5507, 5508, 5509
* **`Uniuqe`** (1 record): Row 1453
* **`Dynmic`** (1 record): Row 3784

### 5. 🔬 Deep-Dive: Column 5 (Build / Version) Inconsistencies
Based on a detailed audit of the **Build / Version** column (Column 5), we found **13 raw variations** (including blank cells) caused by Excel binary floating-point representation errors and manual typing typos. These resolve to **2 standardized builds** (excluding nulls).

### Build / Versions Distribution (Unmerged)
As per instructions, the exact raw values and floating-point approximations are kept separate and not consolidated under `0.1`:

| Build / Version Value | Record Count | Data Type | Notes / Description |
| :------------------- | :----------: | :-------: | :------------------ |
| **0.1**              | 5,019        | float     | Standard build value |
| **0.0999999999999999**| 132          | float     | Floating-point representation of `0.1` |
| **0.0999999999999995**| 88           | float     | Floating-point representation of `0.1` |
| **0.0999999999999998**| 41           | float     | Floating-point representation of `0.1` |
| **0.0999999999999997**| 8            | float     | Floating-point representation of `0.1` |
| **0.0999999999999996**| 1            | float     | Floating-point representation of `0.1` |
| **0,1**              | 3            | str       | Typo using comma delimiter |
| **o.1**              | 1            | str       | Typo using letter 'o' |
| **0-1**              | 1            | str       | Typo using hyphen delimiter |
| **0..1**             | 1            | str       | Typo using double dots |
| **0.0**              | 1            | float     | Alternative build version |
| **0,0**              | 1            | str       | Typo for build `0.0` |
| **[NULL]**           | 218          | None      | Missing version entries |

### Key Build Anomalies Highlighted
1. **Binary Floating-Point Noise (270 records)**: Excel stores decimal floats as binary. Due to precision limits, `0.1` was loaded as floating-point approximations like `0.0999999999999999` (132 records), `0.0999999999999995` (88 records), `0.0999999999999998` (41 records), etc. These must be cleaned to string `"0.1"`.
2. **Keyboard Typos (7 records)**:
   * **`o.1`** (Letter `'o'` typo): Found on **Row 110** (Test ID: `TL-0108`).
   * **`0-1`** (Hyphen typo): Found on **Row 171** (Test ID: `TL-0169`).
   * **`0,1`** (Comma typo): Found on **Row 255**, **Row 256**, **Row 257** (Test IDs: `TL-0253`, `TL-0254`, `TL-0255`).
   * **`0..1`** (Double dot typo): Found on **Row 508** (Test ID: `TL-0506`).
   * **`0,0`** (Comma typo for `0.0` build): Found on **Row 825** (Test ID: `TL-0823`).
3. **Missing / Blank Entries (218 records)**: 4.0% of data has no version. As per data rules, these must not be assumed or filled, and must remain null.

### 6. 🔬 Deep-Dive: Column 6 (Sprint / Cycle) Inconsistencies
Based on a detailed audit of the **Sprint / Cycle** column (Column 6), we found **5 raw variations** (including blank cells) caused by manual entry typos and abbreviations.

### Sprint / Cycle Distribution (Unmerged)
As per instructions, all distinct variations are kept separate and classified as typos or abbreviations:

| Value present in Column 6 | Record Count | Classification | Notes / Description |
| :------------------------ | :----------: | :------------: | :------------------ |
| **NIL**                   | 5,240        | Standard       | Standard value indicating no cycle |
| **NL**                    | 24           | Abbreviation   | Abbreviation (`abr`) of `NIL` (e.g. Rows 751, 824, 844, 874) |
| **nil**                   | 1            | Casing         | Lowercase casing duplicate of `NIL` (Row 1735) |
| **Ye**                    | 1            | Typo / Abr     | Typo or abbreviation of `Yes` found on **Row 1447** (Test ID: `TL-1445`) |
| **[NULL]**                | 249          | Null           | Missing entries |

### Column 6 Anomaly Highlights
* **`Ye` (1 record)**: Typo or abbreviation of `Yes` found on **Row 1447** (Test ID: `TL-1445`), entered during a test by tester *Lavanya Mathialagan* under the *Soil Health and Nutrient Management* category.
* **`NL` (24 records)**: Abbreviation (`abr`) of `NIL` occurring in 24 rows (e.g., Rows 751, 824, 844, 874).
* **`nil` (1 record)**: Lowercase casing duplicate of `NIL` occurring on Row 1735.
* **Missing / Blank Entries (249 records)**: 4.5% of the data lacks cycle labels. These must remain blank.

### 7. 🔬 Deep-Dive: Column 7 (Channel Tested) Inconsistencies
Based on a detailed audit of the **Channel Tested** column (Column 7), we grouped the **7 raw text variations** into **3 main clusters** of similar values (excluding nulls):

### Channel Tested Cluster Analysis
As per instructions, similar values are clustered and counted below:

| Cluster Group | Cluster Total | Raw Variation Value | Variation Count | Example Rows |
| :------------ | :-----------: | :------------------ | :-------------: | :----------- |
| **Web App**   | 3,913         | `Web App`           | 3,911           | Rows 4, 5, 9, 14, 15 |
|               |               | `Web app`           | 1               | Row 825 |
|               |               | `webapp`            | 1               | Row 1463 |
| **WhatsApp**  | 1,284         | `WhatsApp`          | 1,284           | Rows 52, 58, 61, 63, 66 |
| **Both**      | 57            | `Both`              | 51              | Rows 3364, 3365, 3366, 3367, 4207 |
|               |               | `BOTH`              | 5               | Rows 11, 12, 13, 17, 36 |
|               |               | `both`              | 1               | Row 306 |
| *Missing*     | 261           | `[NULL]`            | 261             | Rows 7, 8, 10, 16, 24 |

### Column 7 Cluster Highlights
* **Web App Casing & Space Errors (2 records)**:
  * `Web app` (lowercase 'a') appears on **Row 825** (Test ID: `TL-0823`).
  * `webapp` (lowercase, no space) appears on **Row 1463** (Test ID: `TL-1461`).
* **Both Casing Errors (6 records)**:
  * `BOTH` (all uppercase) appears 5 times (e.g. Rows 11, 12, 13, 17, 36).
  * `both` (all lowercase) appears on **Row 306** (Test ID: `TL-0304`).
* **Missing / Blank Entries (261 records)**: 4.7% of the records have no channel designated. These must remain blank.

### 8. 🔬 Deep-Dive: Column 8 (Language Tested) Inconsistencies
Based on a detailed audit of the **Language Tested** column (Column 8), we found **5 raw text variations** (excluding nulls). They are 100% clean with no casing duplicates or spelling typos.

### Language Tested Cluster Analysis
As per instructions, similar values are clustered and counted below:

| Cluster Group | Cluster Total | Raw Variation Value | Variation Count | Example Rows |
| :------------ | :-----------: | :------------------ | :-------------: | :----------- |
| **English**   | 5,053         | `English`           | 5,053           | Rows 4, 5, 9, 11, 12 |
| **Telugu**    | 132           | `Telugu`            | 132             | Rows 599, 600, 601, 602, 970 |
| **Bengali**   | 72            | `Bengali`           | 72              | Rows 905, 906, 907, 908, 909 |
| **Tamil**     | 21            | `Tamil`             | 21              | Rows 892, 1097, 1102, 1116, 1277 |
| **Hindi**     | 6             | `Hindi`             | 6               | Rows 1666, 1667, 1668, 1669, 1670 |
| *Missing*     | 231           | `[NULL]`            | 231             | Rows 7, 8, 10, 16, 24 |

### Column 8 Cluster Highlights
* **Clean Data**: Unlike other categorical columns, Column 8 contains zero casing duplicates, space padding errors, or typos.
* **Missing / Blank Entries (231 records)**: 4.2% of the records have no language designated. These must remain blank.

### 9. 🔬 Deep-Dive: Column 9 (Question ID) Format & Integrity Violations
Based on a detailed format and integrity audit of the **Question ID** column (Column 9), we found that the column contains a mixture of **UUIDs** and **MongoDB ObjectIDs**, along with severe logging corruptions (newline splits, quote wraps, concatenated dual-IDs, and invalid hex suffixes).

### Question ID Format & Clustering Analysis
All present IDs fall into the following formats and structural categories:

| ID Format / Structural Type | Record Count | Percentage | Description / Example Rows |
| :------------------------- | :----------: | :--------: | :------------------------- |
| **UUID (Standard 36-char)** | 4,199        | 76.1%      | Clean UUIDv4 format (e.g. Rows 4, 5, 9, 11, 12) |
| **MongoDB ObjectID (24-hex)**| 698         | 12.7%      | Clean MongoDB Hex format (e.g. Rows 1389, 1390, 1391) |
| **Quote Wrapped IDs**       | 121         | 2.2%       | Wrapped in balanced/unbalanced double quotes (e.g., Row 3774: `'"6a46a3d5c9d577fd9e1d148c"'` or Row 3776: `'6a46a7ffc9d577fd9e1d15ab"'`) |
| **Embedded Newline Splits** | 66          | 1.2%       | Split by a `\n` carriage return, often concatenating a UUID and ObjectID (e.g., Row 59: `'1f164051-aa6b-6589-8005\n-e26f38a64855'` or Row 3371: `'1f17475e...\n6a43a6...'`) |
| **Dual Concatenated IDs**   | 2           | <0.1%      | Two UUIDs joined in one cell with `(1)` and `(2)` suffixes (Row 306: `'1f1654d3... (1)   1f165717... (2)'`) |
| **Misc Typos & Corruptions**| 69          | 1.3%       | Concatenated UUID+ObjectID on one line (e.g., Row 3398), invalid hex characters (Row 5355: ends with `'h'`), or length errors (Rows 5336-5338: ends with `'10'`) |
| **NA String Anomaly**       | 1           | <0.1%      | Literal string `'NA'` entered as a key (Row 3064) |
| **Missing (Null)**          | 480         | 8.7%       | Required key left blank (e.g. Rows 7, 8, 10, 16, 24) |

### Key Question ID Integrity Failures
1. **Required Null Violations (480 records)**: Question ID is marked as **Required** but has 480 missing cells, indicating database sync or tracking failures.
2. **Logging Format Heterogeneity**: Mixing 36-character UUID strings and 24-character MongoDB ObjectIDs indicates logs were merged from different database backends without schema standardization.
3. **Data Corruption & Carriage Returns (66 records)**: Embedded newlines break CSV/JSON parsing pipelines and indicate copy-paste mistakes or log export encoding errors.
4. **Hex-Encoding Corruptions (4 records)**:
   * Row 5355: `'6a51f9610937d9b2aab2733h'` (ends with `'h'`, which is outside the hexadecimal range `a-f`).
   * Rows 5336, 5337, 5338: 25-character IDs ending in suffix `'10'`, `'11'`, `'12'` (e.g., `'6a51c5130937d9b2aab26da10'`).
### 🛠️ Preprocessing Rules: How to Consider & Handle Malformed IDs
To ensure database integrity and avoid dashboard crashes, the ingestion pipeline should process Column 9 using the following rules:

1. **Quote Cleaning**: Strip all leading and trailing single or double quotes (e.g., `'"6a46..."'` becomes `6a46...`).
2. **Carriage Return Repair**: If a single ID is split by a newline (e.g. `1f16...\n-e26f...`), strip the `\n` and join the parts.
3. **Concatenated Dual IDs**: Where a cell contains both a UUID and an ObjectID (separated by whitespace or a newline, e.g., Row 3371), use regex `[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}` and `[a-fA-F0-9]{24}` to extract them. Register both or select the primary system ID depending on business logic.
4. **Suffix & Typo Pruning**:
   * **25-character IDs**: Strip the trailing index numbers (e.g., ending in `'10'`, `'11'`, `'12'`) to restore the 24-character ObjectID.
   * **Non-hex trailing characters**: Strip trailing invalid hex characters (e.g., Row 5355 ending in `'h'`) to restore the 24-character ObjectID.
5. **Literal `NA`**: Map the literal string `"NA"` (Row 3064) directly to `None` / `Null`.

### 10. 🔬 Deep-Dive: Column 10 (Query Text (Original)) Inconsistencies
Based on a detailed audit of the **Query Text (Original)** column (Column 10), we identified casing duplicates, character corruption, foreign scripts, and whitespace anomalies.

### Query Text Casing & Formatting Clusters
We found **45 distinct groups** of queries that are semantically identical but contain casing, punctuation, space padding, or newline variations:

| Cluster / Semantic Query | Raw Variations | Rows |
| :----------------------- | :------------- | :--- |
| **Ash Gourd Nutrient Source** | `How can fish... for Ash Gourd... Kerala?`<br>`How can fish... for Ash Gourd... Kerala?` with `\n` | Rows 67, 3078<br>Row 70 |
| **Ash Gourd Tip Necrosis**   | `What are the causes... crops in Kerala?`<br>`What are the causes... crops in Kerala` (No `?`) | Row 3080<br>Rows 81, 82 |
| **Wheat Price Distance**     | `Where can I get... wheat within 50 km?`<br>`Where can I get... wheat within 50 km` (No `?`) | Rows 87, 88, 409<br>Rows 1404, 1484, 1485 |
| **Paddy Seed Karnataka**     | `Which is the best... paddy in Karnataka?`<br>`Which is the best... paddy in karnataka` (Lowercase `k`) | Rows 1227, 1228, 1411<br>Row 115 |
| **Chilli Sowing Punjab**     | `What is the recommended... Punjab state?`<br>`what is the recommended... punjab state` (Lowercase `w` & `p`) | Rows 1225, 1226<br>Row 119 |

### Column 10 Key Anomalies
1. **Whitespace-Only Query (1 record)**: **Row 3371** (Test ID: `TL-3361`) contains a single blank space `' '` instead of a text query.
2. **Foreign Script Leak (1 record)**: **Row 3352** (Test ID: `TL-3342`) contains Hebrew text `הגל` (representing Green Leafhopper) leaked into an English query structure: `How can I identify and manage הגל (Green Leafhopper)...`.
3. **Unicode / Non-ASCII Dash (1 record)**: **Row 922** (Test ID: `TL-0920`) uses a Unicode en-dash (`–`) instead of a standard ASCII hyphen (`-`): `'Why are the leaves of 3–5 months old ginger crop...'`.
4. **Missing (Null) Entries (240 records)**: 4.4% of rows are empty due to duplicate system runs (these must remain null).

### 🛠️ Preprocessing Rules: How to Consider Column 10
* **Whitespace Pruning**: Trim all queries with `.strip()`. If a query becomes empty (like Row 3371), map it to `Null`.
* **Carriage Return Removal**: Remove embedded `\n` carriage returns inside queries (e.g. Row 70) and replace them with a standard space.
* **Casing Standardisation**: For matching and indexing in dashboard analytics, lowercase the query text and strip trailing punctuation/question marks.

### 11. 🔬 Deep-Dive: Column 11 (Question Category) Inconsistencies
Based on a detailed audit of the **Question Category** column (Column 11), we found **34 raw unique variations** (excluding nulls) which resolve to **25 distinct categories** after cleaning casing and combining overlapping semantic duplicates.

### Question Category Cluster Analysis
All raw variations present in Column 11 are clustered below:

| Standard / Semantic Group | Raw Value Found in Column 11 | Count | Example Rows |
| :------------------------ | :--------------------------- | :---: | :----------- |
| **Plant Protection**      | `Plant protection`<br>`Plant Protection`<br>`PLANT PROTECTION` | 1,188<br>6<br>1 | Rows 447, 468<br>Rows 4, 5<br>Row 1399 |
| **Soil Health & Nutrition**| `Soil Health and Nutrient Management` | 796 | Rows 10, 11, 12, 13 |
| **Insect–Pest Management** | `Insect–Pest Management` | 527 | Rows 25, 46, 47, 52 |
| **Cultural Management**    | `Cultural and Crop Management Practices` | 496 | Rows 9, 16, 24, 26 |
| **Seed & Variety Selection**| `Seed and Variety Selection`<br>`Seed and Variety selection` | 448<br>2 | Rows 14, 15, 19<br>Rows 871, 872 |
| **Disease Management**    | `Disease Management` | 395 | Rows 18, 49, 51, 57 |
| **Climate & Stress Mgmt**  | `Climate, Weather and Stress Management` | 237 | Rows 36, 43, 59 |
| **Market Prices & MSP**   | `Market Prices, MSP and Marketing`<br>`Market information` *(overlap)* | 230<br>48 | Rows 56, 87, 88<br>Rows 2775, 2969 |
| **Weed Management**       | `Weed Management` | 196 | Rows 103, 104, 214 |
| **Fertilizer Use & Avail.**| `Fertiliser use & availability`<br>`Fertilizer Use and Availability` *(overlap)* | 117<br>2 | Rows 1967, 2074<br>Rows 1591, 1592 |
| **Irrigation & Water**     | `Irrigation and Water Management` | 100 | Rows 113, 114, 282 |
| **Bio-fertilizers**       | `Bio-fertilizers and Bio-pesticides` | 72 | Rows 1129, 1130, 1136 |
| **Organic Farming**       | `Organic and Natural Farming`<br>`Organic farming` *(overlap)* | 64<br>1 | Rows 54, 64, 65<br>Row 1894 |
| **Post-Harvest & Storage** | `Post-Harvest Management and Storage` | 49 | Rows 189, 203, 223 |
| **Sowing Time & Weather**  | `Sowing time & weather` | 49 | Rows 1629, 1630, 1656 |
| **Horticulture**          | `Horticulture & allied agriculture` | 46 | Rows 1775, 1818, 1869 |
| **Extension Services**    | `Extension & Capacity Building` | 16 | Rows 1286, 1863, 1864 |
| **Field Preparation**     | `Field Preparation` | 12 | Rows 3613, 3673, 3861 |
| **Financial Services**    | `Financial & Institutional Services`<br>`Credit, Loan and Insurance` *(overlap)* | 8<br>1 | Rows 2542, 3124<br>Row 311 |
| **Agricultural Schemes**   | `Agricultural Schemes and Subsidies` | 7 | Rows 1559, 4769, 5427 |
| **Livestock & Husbandry**  | `live stock & animal husbandary` | 2 | Rows 1783, 4958 |
| **Farm Mechanisation**    | `Farm Tools and Mechanisation`<br>`Agriculture Mechanization` *(overlap)* | 1<br>1 | Row 4730<br>Row 5505 |
| **Yield & Population**    | `YIELD & PLANT POPULATION` | 1 | Row 5169 |
| **Soil Testing**          | `Soil Testing` | 1 | Row 1448 |
| **General**               | `General` | 1 | Row 1314 |
| *Missing (Null)*          | `[NULL]` | 394 | Rows 7, 8, 30, 31, 35 |

### Column 11 Key Anomalies
1. **Casing Inconsistencies**: `Plant Protection` has three casing variations (lowercase, capitalized, uppercase). `Seed and Variety selection` has lowercase `'s'` in selection.
2. **Semantic Spelling/Symbol Overlaps**:
   * `Fertiliser use & availability` (UK spelling/symbol) vs `Fertilizer Use and Availability` (US spelling/words).
   * `Organic and Natural Farming` vs `Organic farming`.
   * `Farm Tools and Mechanisation` vs `Agriculture Mechanization`.
   * `Market Prices, MSP and Marketing` vs `Market information`.
   * `Financial & Institutional Services` vs `Credit, Loan and Insurance`.
3. **Missing / Blank Entries (394 records)**: 7.1% of the dataset lacks a question category. These must remain blank.

### 🛠️ Preprocessing Rules: How to Consider Column 11
* **Casing Uniformity**: Title-case all categories (e.g. map `Plant protection`/`PLANT PROTECTION` to `Plant Protection`).
* **Semantic Consolidation**: Map overlapping categories to a single standardized category to avoid duplicate chart legends in the dashboard:
  * Map `Fertiliser use & availability` and `Fertilizer Use and Availability` to `Fertilizer Use and Availability`.
  * Map `Organic farming` to `Organic and Natural Farming`.
  * Map `Agriculture Mechanization` and `Farm Tools and Mechanisation` to `Farm Tools and Mechanisation`.
  * Map `Market information` to `Market Prices, MSP and Marketing`.
  * Map `Credit, Loan and Insurance` to `Financial & Institutional Services`.

### 12. 🔬 Deep-Dive: Column 12 & 13 Asked/Received Time Analysis
### 🔬 Column 12 & 13: Asked vs. Received Time Comparative Analysis

Below is a side-by-side comparison of the data type distribution and formatting styles in **Column 12 (Time Asked)** and **Column 13 (Time Received)**:

| Metric / Dimension | Column 12 (Time Asked) | Column 13 (Time Received) | Comparison / Findings |
| :----------------- | :--------------------: | :-----------------------: | :-------------------- |
| **Filled Cells**   | 5,106                  | 4,158                     | Col 12 has 948 more entries (Time Received has 1,357 nulls). |
| **Null Cells**     | 409                    | 1,357                     | Empty cells represent unrecorded test runs or duplicate filters. |
| **Time Objects**   | 4,280 (77.6%)          | 3,026 (54.9%)             | Col 12 is cleaner; Col 13 has significantly more formatting errors. |
| **Datetime Objects**| 686 (12.4%)            | 741 (13.4%)               | Contaminated with date details (e.g. `20/06/2026`). |
| **String (Text)**  | 127 (2.3%)             | 377 (6.8%)                | Col 13 contains 3x more string entries, mostly dot-delimited. |
| **Float (Decimals)**| 13 (0.2%)              | 14 (0.3%)                 | Entered as decimal hours (e.g., `11.5` $\rightarrow$ 11:30:00). |
| **Total Violations**| **826**                | **1,132**                 | Combined format/type mismatches that must be standardized. |

### Formatting Differences & Structural Anomalies
* **Dot Delimited (Col 12: 23 vs Col 13: 110)**: Col 13 has a massive number of dot-separated times, such as `'6.21am'` (Row 11) or `'11.40.4'` (Row 302).
* **Date-Time Text (Col 12: 22 vs Col 13: 167)**: String values combining date and time (e.g., Row 56: `'17/6/2026, 7:50:34 am'`).
* **Duration String (Col 13 unique)**: **Row 217** (Test ID: `TL-0215`) in *Time Received* contains a literal duration string `'6 days, 2 hours, 9 minutes, 28 seconds'` instead of a timestamp!
* **Formula Failures**: Both columns have failed Excel reference strings `'#VALUE!'` (e.g., Col 12 Row 263, Col 13 Row 25).

### ⚙️ How to Unify Asked & Received Times
To clean and unify both columns into standard 24-hour `HH:MM:SS` format:
1. **Datetime Objects**: Extract the time component programmatically (e.g. `val.time()`).
2. **Text Strings with Date**: Extract the time portion via regex or split on comma (e.g. `'17/6/2026, 7:50:34 am'` $\rightarrow$ `'7:50:34 am'`).
3. **Dot Delimiters**: Replace dots with colons (e.g. `'7.12.10'` $\rightarrow$ `'07:12:10'`).
4. **AM/PM Strings**: Standardize 12-hour values into 24-hour formats (e.g., `'6.21am'` $\rightarrow$ `'06:21:00'`).
5. **Decimals (Floats)**: Convert fractional hours into standard minutes/seconds:
   * *Formula*: $\text{Hours} = \lfloor\text{val}\rfloor$, $\text{Minutes} = \lfloor(\text{val} - \text{Hours}) \times 60\rfloor$. E.g. `11.5` $\rightarrow$ `11:30:00`.
6. **Duration String (Col 13 Row 217)**: Since this is a duration, parse it and add it to the *Asked Time* to reconstruct the *Received Time*, or map to Null since it violates timestamp constraints.
7. **Errors & NA**: Convert `'#VALUE!'` and `'NA'` to `Null`.

### 14. 🔬 Deep-Dive: Column 15 (SLA Status) Inconsistencies
Based on a detailed audit of the **SLA Status** column (Column 15), we mapped the **11 raw variations** (including blanks) into **3 standard business states** plus anomalies and nulls.

### SLA Status Cluster Analysis
All variations in Column 15 are clustered and counted below:

| Standard business State | Raw Variation Value | Record Count | Classification | Example Rows |
| :---------------------- | :------------------ | :----------: | :------------: | :----------- |
| **Within SLA**          | `Within SLA`<br>`WITHIN SLA`<br>`within SLA`<br>`Within the SLA` | 2,607<br>5<br>1<br>3 | Standard<br>Casing<br>Casing<br>Semantic | Rows 4, 5, 32<br>Rows 1248, 1249<br>Row 1300<br>Rows 867, 868 |
| **SLA Breached**        | `SLA Breached`<br>`Breached SLA`<br>`SLA breached`<br>`SLA Breachd` | 1,733<br>4<br>1<br>1 | Standard<br>Word order<br>Casing<br>Spelling typo | Rows 11, 12, 13<br>Rows 755, 759<br>Row 682<br>Row 219 |
| **Not Applicable**      | `Not Applicable`    | 31           | Standard       | Rows 211, 245, 246 |
| **Garbage / Anomaly**   | `\\`<br>`NA`              | 1<br>4       | Garbage<br>Placeholder  | Row 683<br>Rows 3050, 3823 |
| *Missing (Null)*        | `[NULL]`            | 1,124        | Null           | Rows 7, 8, 9, 10 |

### What do the SLA Status Options Tell Us?
* **`Within SLA`**: Tells us that the system's answer was delivered to the farmer within the contractual time window (typically $\le 120$ minutes).
* **`SLA Breached`**: Tells us that the system took too long to respond ($> 120$ minutes), representing a slow response failure.
* **`Not Applicable`**: Tells us that this test row is exempt from SLA calculations (usually duplicate queries, system test runs, or metadata rows).
* **`Missing / Blank` (1,124 records)**: Tells us that no SLA status was recorded. Many of these correspond to rows flagged as duplicates by the answering model.

### 🔗 Relationship between Column 14 (Response Time) and Column 15 (SLA Status)
SLA Status is derived directly from **Response Time (mins)**. However, there are major discrepancies in the source logging:
* **Negative Latency Corruptions**: Row 11 has a Response Time of `-6451.2` minutes but is marked as `SLA Breached` (due to unparsed Asked/Received times).
* **Formula Failures**: Multiple rows have `#VALUE!` in Response Time but still contain `Within SLA` or `SLA Breached` in Column 15 (indicating manual or mismatched entries).

### 🛠️ Preprocessing Rules: How to Consider Column 15
* **Standardization**: Map all variations of `Within SLA` (including `WITHIN SLA`, `within SLA`, `Within the SLA`) to `"Within SLA"`.
* **Breach Correction**: Map `SLA breached`, `SLA Breachd`, and `Breached SLA` to `"SLA Breached"`.
* **Garbage Cleanup**: Map garbage string `'\'` and placeholder `'NA'` to `Null`.
* **Null Preservation**: Preserve the 1,124 missing records as `Null`.

### 15. 🔬 Deep-Dive: Column 16 (Question in Review Model?) Inconsistencies
Based on a detailed audit of the **Question in Review Model?** column (Column 16), we grouped the **9 raw variations** (including blanks) into **5 standardized business categories** plus nulls.

### Question in Review Model Cluster Analysis
All variations in Column 16 are clustered and counted below:

| Standard Category | Raw Variation Value | Record Count | Classification | Example Rows |
| :---------------- | :------------------ | :----------: | :------------: | :----------- |
| **Yes**           | `Yes`<br>`yes`       | 3,004<br>2   | Standard<br>Casing | Rows 4, 5, 11<br>Rows 860, 861 |
| **No**            | `No`<br>`no`         | 199<br>1     | Standard<br>Casing | Rows 36, 87, 88<br>Row 174 |
| **Successfully Identified as Duplicate** | `Successfully Identified as Duplicate`<br>`correctly identified as duplicate` | 1,196<br>1 | Standard<br>Semantic/Casing | Rows 14, 15, 17<br>Row 59 |
| **Wrongly Identified as Duplicate** | `Wrongly Identified as Duplicate` | 53 | Standard | Rows 210, 211, 245 |
| **Not Applicable (NA)** | `NA`               | 101          | Standard | Rows 26, 27, 28 |
| *Missing (Null)*  | `[NULL]`            | 958          | Null | Rows 7, 8, 9, 10 |

### What do the Review Model Options Tell Us?
* **`Yes`**: The question was correctly routed to the review model.
* **`No`**: The question did not require review model routing.
* **`Successfully Identified as Duplicate` (including `correctly identified as duplicate`)**: The question was correctly recognized as a duplicate of an existing query.
* **`Wrongly Identified as Duplicate`**: The system incorrectly classified a unique query as a duplicate.
* **`NA`**: Review model routing was not applicable.

### 🛠️ Preprocessing Rules: How to Consider Column 16
* **Standardize Yes**: Map `yes` and `Yes` to `"Yes"`.
* **Standardize No**: Map `no` and `No` to `"No"`.
* **Standardize Duplicates**: Map lowercase `correctly identified as duplicate` to `"Successfully Identified as Duplicate"`.
* **Preserve States**: Keep `"Wrongly Identified as Duplicate"` and `"NA"` as separate distinct states.
* **Preserve Nulls**: Keep the 958 missing records as `Null`.

### 16. 🔬 Deep-Dive: Column 17 (Question Correctly Framed?) Inconsistencies
Based on a detailed audit of the **Question Correctly Framed?** column (Column 17), we mapped the **6 raw variations** (including blanks) into **3 standard business states** plus anomalies and nulls.

### Question Correctly Framed Cluster Analysis
All variations in Column 17 are clustered and counted below:

| Standard Category | Raw Variation Value | Record Count | Classification | Example Rows |
| :---------------- | :------------------ | :----------: | :------------: | :----------- |
| **Well Framed**   | `Well Framed`       | 4,549        | Standard       | Rows 4, 5, 11, 12, 13 |
| **Ambiguous**     | `Ambiguous`         | 30           | Standard       | Rows 36, 353, 354, 784, 785 |
| **Incorrectly Framed**| `Incorrectly Framed` | 4        | Standard       | Rows 371, 1923, 2688, 4403 |
| **Yes (Anomaly)** | `Yes`               | 1            | Typo Anomaly   | Row 5330 (Test ID: `TL-5309`) |
| **Not Applicable (NA)**| `NA`               | 23          | Standard | Rows 25, 26, 27, 28 |
| *Missing (Null)*  | `[NULL]`            | 908          | Null           | Rows 7, 8, 9, 10, 16 |

### What do the Question Correctly Framed Options Tell Us?
* **`Well Framed`**: The query asked by the farmer was grammatically and structurally clean.
* **`Ambiguous`**: The query was vague or open to multiple interpretations.
* **`Incorrectly Framed`**: The query had bad grammar or structural issues.
* **`Yes`**: Standalone typo found on **Row 5330** (representing a binary entry instead of categorical text).
* **`NA`**: Framing checks were not applicable.

### 🛠️ Preprocessing Rules: How to Consider Column 17
* **Standardize Yes**: Map `'Yes'` (Row 5330) directly to `Null` or flag it as an anomaly, since it represents a binary value instead of a framing classification.
* **Preserve Standard States**: Preserve `'Well Framed'`, `'Ambiguous'`, `'Incorrectly Framed'`, and `'NA'` as distinct valid states.
* **Preserve Nulls**: Keep the 908 missing records as `Null`.

### 17. 🔬 Deep-Dive: Column 18 (Original Language) Inconsistencies
Based on a detailed audit of the **Original Language** column (Column 18), we mapped the **12 raw variations** (including blanks) into **5 standardized languages** plus typos, placeholders, and nulls.

### Column 18 (Original Language) Cluster Analysis
All variations in Column 18 are clustered below:

| Standard Language | Raw Variation Value | Record Count | Classification | Example Rows |
| :---------------- | :------------------ | :----------: | :------------: | :----------- |
| **English**       | `English`<br>`ENGLISH`<br>`english`<br>`Englsih`<br>`ENG;ISH` | 4,150<br>454<br>11<br>1<br>1 | Standard<br>Casing duplicate<br>Casing duplicate<br>Spelling typo<br>Semicolon typo | Rows 4, 5, 10<br>Rows 1537, 1538<br>Rows 2018, 2019<br>Row 2255 (Test ID: `TL-2244`)<br>Row 4100 (Test ID: `TL-4081`) |
| **Bengali**       | `Bengali`<br>`BENGALI` | 51<br>10     | Standard<br>Casing duplicate | Rows 905, 906<br>Rows 1507, 1508 |
| **Telugu**        | `Telugu`            | 12           | Standard       | Rows 599, 600, 601 |
| **Hindi**         | `Hindi`             | 8            | Standard       | Rows 1666, 1667, 1668 |
| **Tamil**         | `Tamil`             | 3            | Standard       | Rows 1116, 2000, 2005 |
| **Not Appl. (NA)**| `NA`                | 5            | Placeholder    | Rows 2426, 3050, 3823 |
| *Missing (Null)*  | `[NULL]`            | 809          | Null           | Rows 7, 8, 9, 16 |

### Column 18 Key Anomalies
1. **Manual Entry Typos**:
   * `Englsih` (Row 2255) — letters 'i' and 'h' transposed.
   * `ENG;ISH` (Row 4100) — semicolon typed instead of 'L'.
2. **Missing Entries (809 records)**: 14.7% of rows are empty due to duplicate flagged tests.

### 🛠️ Preprocessing Rules: How to Consider Column 18
* **Unify English**: Map `ENGLISH`, `english`, `Englsih`, and `ENG;ISH` to `"English"`.
* **Unify Bengali**: Map `BENGALI` to `"Bengali"`.
* **Placeholder Cleanup**: Map `'NA'` to `Null`.\n\n### 18. 🔬 Deep-Dive: Column 19 (Translated Language) Inconsistencies
Based on a detailed audit of the **Translated Language** column (Column 19), we mapped the **12 raw variations** (including blanks) into **6 standardized languages** plus abbreviations, placeholders, and nulls.

### Column 19 (Translated Language) Cluster Analysis
All variations in Column 19 are clustered below:

| Standard Language | Raw Variation Value | Record Count | Classification | Example Rows |
| :---------------- | :------------------ | :----------: | :------------: | :----------- |
| **English**       | `English`<br>`ENGLISH`<br>`english`<br>`E` | 4,220<br>5<br>5<br>1 | Standard<br>Casing duplicate<br>Casing duplicate<br>Abbreviation typo | Rows 4, 5, 10<br>Rows 2020, 2021<br>Rows 3474, 3475<br>Row 5050 (Test ID: `TL-5030`) |
| **Telugu**        | `Telugu`            | 91           | Standard       | Rows 599, 600, 601 |
| **Bengali**       | `Bengali`           | 52           | Standard       | Rows 905, 906, 907 |
| **Tamil**         | `Tamil`             | 14           | Standard       | Rows 133, 134, 135 |
| **Hindi**         | `Hindi`             | 10           | Standard       | Rows 364, 375, 455 |
| **Marathi**       | `Marathi`           | 1            | Standard (Rare)| Row 368 (Test ID: `TL-0366`) |
| **Other**         | `Other`             | 1            | Standard (Rare)| Row 353 (Test ID: `TL-0351`) |
| **Not Appl. (NA)**| `NA`                | 287          | Placeholder    | Rows 514, 607, 608 |
| *Missing (Null)*  | `[NULL]`            | 828          | Null           | Rows 7, 8, 9, 16 |

### Column 19 Key Anomalies
1. **Abbreviation Typo**: `E` (Row 5050) — standardizes to `English`.
2. **Rare Classes**: `Marathi` (1 record, Row 368) and `Other` (1 record, Row 353).
3. **Missing & NA (1,115 records)**: 20.2% of the column is blank or marked as `'NA'`, representing tests where translation was not required.

### 🛠️ Preprocessing Rules: How to Consider Column 19
* **Unify English**: Map `ENGLISH`, `english`, and `E` to `"English"`.
* **Placeholder Cleanup**: Map `'NA'` to `Null`.

### 19. 🔬 Deep-Dive: Column 20 (Translation Quality) Inconsistencies
Based on a detailed audit of the **Translation Quality** column (Column 20), we mapped the **15 raw variations** (including blanks) into **6 standard quality states** plus a manual diagnostic comment, placeholders, and nulls.

### Column 20 (Translation Quality) Cluster Analysis
All variations in Column 20 are clustered and counted below:

| Standardized Quality State | Raw Variation Value | Record Count | Classification | Example Rows |
| :------------------------- | :------------------ | :----------: | :------------: | :----------- |
| **Correct**                | `Correct`<br>`correct`<br>`CORRECT` | 3,277<br>81<br>84 | Standard<br>Casing duplicate<br>Casing duplicate | Rows 4, 10, 11<br>Rows 1763, 1764<br>Rows 2404, 2405 |
| **Good**                   | `Good`<br>`good`<br>`GOOD` | 210<br>6<br>96 | Standard<br>Casing duplicate<br>Casing duplicate | Rows 2000, 2004<br>Rows 1666, 1667<br>Rows 2510, 2511 |
| **Incorrect**              | `Incorrect`<br>`Wrong` | 3<br>3        | Standard<br>Semantic duplicate | Rows 2953, 2954, 2969<br>Rows 3289, 3473, 3488 |
| **Major Error**            | `Major Error`       | 4            | Standard       | Rows 176, 364, 375, 378 |
| **Minor Error**            | `Minor Error`       | 1            | Standard       | Row 455 |
| **Not Applicable (NA)**    | `NA`<br>`N A`<br>`NIL` | 868<br>1<br>33 | Standard<br>Spacing duplicate<br>Semantic placeholder | Rows 5, 25, 26<br>Row 2227 (Test ID: `TL-2216`)<br>Rows 3936, 3937 |
| **Manual Comment**         | `Not able trnaslate disease word in telugu(తెగుళ్ల)` | 1 | Translation Bug Note | Row 4403 (Test ID: `TL-4382`) |
| *Missing (Null)*           | `[NULL]`            | 847          | Null           | Rows 7, 8, 9, 16 |

### Column 20 Key Anomalies
1. **Tester Comments inside Categorical Field**:
   * **Row 4403** contains the manual comment `"Not able trnaslate disease word in telugu(తెగుళ్ల)"` instead of a standardized category. This represents an identified translation bug.
2. **Casing & Spelling Duplications**:
   * `Correct` has three casing variants (`Correct`, `correct`, `CORRECT`).
   * `Good` has three casing variants (`Good`, `good`, `GOOD`).
   * `N A` (with space) is a duplicate of `NA`.
3. **Semantic Overlaps**:
   * `Wrong` and `Incorrect` are semantically identical.
   * `NIL` is used as a placeholder for nulls or not applicable.

### 🛠️ Preprocessing Rules: How to Consider Column 20
* **Unify Correct/Good**: Keep `"Correct"` and `"Good"` as standard acceptable quality states, but unify casing to Title Case.
* **Unify Incorrect/Wrong**: Map `"Wrong"` to `"Incorrect"`.
* **Standardize Errors**: Keep `"Major Error"` and `"Minor Error"` as separate severity states.
* **Isolate Bug Note**: Extract the manual comment on **Row 4403**, log it under a separate translation bugs sheet/metric, and map the Column 20 value to `Null` or `"Incorrect"` for category grouping.
* **Placeholder & Space Standardisation**: Map `N A` and `NIL` to `NA` or standard `Null`.

### 20. 🔬 Deep-Dive: Column 22 (Tagging) Inconsistencies
Based on a detailed audit of the **Tagging** column (Column 22), we mapped the **10 raw variations** (including blanks) into **6 standardized tagging states** plus nulls.

### Column 22 (Tagging) Cluster Analysis
All variations in Column 22 are clustered below:

| Standard Tagging State | Raw Variation Value | Record Count | Classification | Example Rows |
| :--------------------- | :------------------ | :----------: | :------------: | :----------- |
| **Correctly Tagged as Duplicate** | `Correctly Tagged as Duplicate`<br>`Correctly tagged as duplicate` | 2,231<br>1 | Standard<br>Casing duplicate | Rows 4, 5, 59<br>Row 1300 |
| **Correctly Tagged as Dynamic** | `Correctly Tagged as Dynamic`<br>`DYNAMIC` | 148<br>1 | Standard<br>Abbreviation | Rows 124, 125<br>Row 1821 |
| **Wrongly Tagged as Duplicate** | `Wrongly Tagged as Duplicate` | 107 | Standard | Rows 210, 211, 245 |
| **Dynamic but not tagged** | `Dynamic but not tagged` | 73           | Standard       | Rows 36, 127, 241 |
| **Duplicate but not tagged** | `Duplicate but not tagged` | 23       | Standard       | Rows 24, 76, 219 |
| **Wrongly Tagged as Dynamic** | `Wrongly Tagged as Dynamic` | 6       | Standard       | Rows 1317, 3636 |
| **Not Applicable (NA)** | `NA`                | 2,131        | Placeholder    | Rows 25, 26, 27 |
| *Missing (Null)*       | `[NULL]`            | 794          | Null           | Rows 7, 8, 9 |

### 🛠️ Preprocessing Rules: How to Consider Column 22
* **Unify Duplicate Tagging**: Map `Correctly tagged as duplicate` $
ightarrow$ `"Correctly Tagged as Duplicate"`.
* **Unify Dynamic Tagging**: Map `DYNAMIC` $
ightarrow$ `"Correctly Tagged as Dynamic"` (or `"Correctly Tagged as Dynamic"` depending on its context).
* **Placeholder Cleanup**: Map `'NA'` $
ightarrow$ `Null`.

### 21. 🔬 Deep-Dive: Column 23 (Allocated to Reviewer?) Inconsistencies
Based on a detailed audit of the **Allocated to Reviewer?** column (Column 23), we identified **33 raw variations** (excluding blanks). These contain casing issues, semantic duplicates, and a **severe copy-paste cell shift bug** where reviewer names were pasted into this column.

### Column 23 (Allocated to Reviewer?) Cluster Analysis
All variations in Column 23 are clustered below:

| Standard Category | Raw Variation Value | Record Count | Classification | Example Rows |
| :---------------- | :------------------ | :----------: | :------------: | :----------- |
| **Yes**           | `Yes`<br>`YES`<br>`yes`<br>`Correct` | 1,521<br>242<br>60<br>1 | Standard<br>Casing duplicate<br>Casing duplicate<br>Semantic typo | Rows 11, 12, 23<br>Rows 839, 1103<br>Rows 841, 1190<br>Row 4511 (Test ID: `TL-4492`) |
| **No**            | `No`<br>`NO`<br>`no`<br>`Not yet` | 234<br>298<br>1<br>16 | Standard<br>Casing duplicate<br>Casing duplicate<br>Semantic variant | Rows 8, 43, 46<br>Rows 533, 1253<br>Row 1774<br>Rows 210, 211 |
| **Not Appl. (NA)**| `NA`<br>`na`<br>`NIL` | 1,736<br>2<br>1 | Standard<br>Casing duplicate<br>Semantic placeholder | Rows 25, 26, 27<br>Rows 1598, 1671<br>Row 1300 |
| **Reviewer Name** | *E.g.* `pooja soni`<br>`Shivendra Pratap Singh`<br>`C Sai Durga`<br>`MONICA M`<br>`satarupa saha`<br>`Salim Sahaji` *(15 distinct names)* | 4<br>3<br>3<br>2<br>2<br>2<br>*(Total: 26)* | **Copy-Paste Shift Error** (Belongs in Col 24) | Rows 2052, 3537<br>Row 3722<br>Row 2652<br>Row 3466<br>Row 2246<br>Row 1783 |
| **Duplicate Checking Info** | `Successfully Identified as Duplicate/Dynamic`<br>`Duplicate`<br>`Correctly Tagged as Duplicate`<br>`Wrongly Tagged as Duplicate`<br>`Duplicate but not tagged`<br>`Wrongly Identified as Duplicate/Dynamic` | 85<br>46<br>19<br>2<br>1<br>1 | **Copy-Paste Column Inversion** (Belongs in Col 22) | Rows 14, 15, 17<br>Rows 32, 33, 34<br>Rows 59, 124<br>Rows 219, 224<br>Row 76<br>Row 210 |
| *Missing (Null)*  | `[NULL]`            | 1,224        | Null           | Rows 7, 8, 9 |

### Column 23 Key Anomalies
1. **Tester Names Leak (26 records)**: Names like `pooja soni`, `Shivendra Pratap Singh`, etc. belong in Column 24 (`Author's Name`). This is a cell shift error.
2. **Duplicate/Dynamic Labels (154 records)**: Categorical labels from Column 22 (`Tagging`) leaked into Column 23. E.g., Row 14 contains `"Successfully Identified as Duplicate/Dynamic"`.
3. **Casing & Semantic duplicates**: `YES`/`Yes`/`yes`, `NO`/`No`/`no`, and `Not yet` (meaning No).

### 🛠️ Preprocessing Rules: How to Consider Column 23
* **Standardize Yes**: Map `YES`, `yes`, and `Correct` to `"Yes"`.
* **Standardize No**: Map `NO`, `no`, and `Not yet` to `"No"`.
* **Standardize NA**: Map `na` and `NIL` to `"NA"`.
* **Clean Leaked Reviewers**: Check if cell contains a name. If so, map Column 23 value to `"Yes"` (since a reviewer was assigned) and copy the name to Column 24 if Column 24 is blank.
* **Clean Leaked Tagging Labels**: Map labels like `Successfully Identified as Duplicate` to `"NA"` or `"No"` depending on standard business logic, as they represent automatic routing rather than manual reviewer allocation.

### 22. 🔬 Deep-Dive: Column 24 (Author's Name) Inconsistencies
Based on a detailed audit of the **Author's Name** column (Column 24), we mapped the raw entries into standardized reviewer names. This column has severe spelling, casing, punctuation, and shift errors.

### Column 24 (Author's Name) Key Clusters & Anomalies
Reviewer names are highly duplicate-ridden:
1. **Casing & Spacing Duplicates**:
   * `Mini` (5) / `MINI` (3) / `Min` (1).
   * `VARSHA SHEKAR` (4) vs `: varsha shekhar` (1) vs `: varsha shekar` (concatenated/prefixed).
   * `SOUMYA` (3) vs `Soumya`.
   * `MONICA` (2) / `Monica` (1) / `MONICA M` (2).
   * `Rounaq Ansari` (1) / `ROUNAQ ANSARI` (13) / `ROUNAQ ANSAR` (1).
2. **Manual Spelling & Typo Variations**:
   * **Atheswar**: Split across `ATHESWAR` (9), `Athswar` (1), `Athewsar` (1), `Atheshawar` (1), `ATNESWAR` (1).
   * **Satarupa/Satrupa**: Split across `SATARUPA` (5), `Satrupa saha` (5), `Satruo saha` (2), `satarupa saha` (2).
   * **Sugyani**: Split across `SUGYANI.KAR` (2), `Sugyani Kaur` (1).
3. **Prefix & Concatenation Anomalies**:
   * Prefix colons: `: Pallavi J P` (Row 3643), `: Mohammad Saleem pasha` (Row 4266), `: varsha shekhar` (Row 4443).
   * Multiple names: `Jayashree N         Anjali Chauhan` (Row 4510), `satarupa saha   Ravindra Prasad` (Row 5121).
4. **Incorrect Value Leak**: Row 2752 contains the value `'NO'` instead of a name.

### 🛠️ Preprocessing Rules: How to Consider Column 24
* **Standardize Names**: Implement a fuzzy mapping dictionary to clean spelling errors (e.g. map `Athswar`/`Athewsar`/`ATNESWAR` to `"Atheswar"`).
* **Remove Prefixes**: Strip leading colons and extra spaces (`: Pallavi J P` $
ightarrow$ `"Pallavi J P"`).
* **Restore Leaked Names**: If Column 23 contains a name and Column 24 is blank, copy the name to Column 24.
* **Standardize Casing**: Title-case all reviewer names.

### 21. 🔬 Deep-Dive: Column 28 & 32 (Reviewer Name) Inconsistencies
Based on a detailed audit of **Reviewer1 Name** (Column 28) and **Reviewer2 Name** (Column 32), we identified widespread name spelling, casing, punctuation, and spacing variations.

### Key Reviewer Name Anomalies (Cols 28 & 32)
1. **Casing & Spelling Duplications**:
   * **Vinay**: `Vinay` (63) / `VINAY` (15) / `VInay` (1).
   * **Deepika**: `Deepika` (76) / `DEEPIKA` (21) / `deepika` (2).
   * **Mariselvi**: `MARISELVI` (39) / `Mariselvi` (15) / `mariselvi` (1).
   * **Ambika**: `Ambika` (33) / `AMBIKA` (17).
2. **Punctuation & Space Splits**:
   * **Deepika R**: `DEEPIKA.R` (7) vs `DEEPIKA . R` (1).
   * **Lakshmi Ranganath**: `LAKSHMI.RANGANATH` (2) vs `LAKSHMI RANGANATH` (5) vs `Lakshmi ranganath` (2).
   * **B Sasidhar**: `B. sasidhar` (1) vs `B. Sasidhar` (2) vs `B.Sasidhar` (1) vs `B.sasidhar` (1).
3. **Double Names & Typos**:
   * `satarupa saha   Ravindra Prasad` (Row 5121) — double assignment.

### 🛠️ Preprocessing Rules: How to Consider Columns 28 & 32
* **Fuzzy Consolidation**: Use a clean reviewer mapping dictionary to standardize spelling variants (e.g. map `B. sasidhar`/`B.Sasidhar` to `"B. Sasidhar"`).
* **Casing Uniformity**: Title-case all names (e.g., map `VINAY`/`VInay` to `"Vinay"`).
* **Strip Punctuation & Spaces**: Strip dots and replace multiple spaces with single spaces (e.g., `DEEPIKA . R` $ightarrow$ `"Deepika R"`).
* **Placeholder standardisation**: Map `'NA'` and `'NIL'` directly to `Null`.

## 💡 Part 6: Strict Guidelines for Preprocessing

To ensure data compliance without altering the integrity of the collected logs, the following rules must be enforced during preprocessing:

### ⚠️ NO ASSUMPTIONS OR IMPUTATIONS ALLOWED
> [!IMPORTANT]
> **We are strictly forbidden from adding missing values or making assumptions about blank fields.**
> * **Do NOT fill missing required columns** (e.g., `Tester Name` or `Question ID`) with dummy constants, defaults (like `Unknown`), or auto-generated values.
> * **Do NOT assume dates or times** for empty rows.
> * If a row lacks critical fields required for KPI calculations (such as an empty `Tester Name` or `Question ID`), that row must **remain blank** and be treated as unresolvable.
> * Preprocessing is limited strictly to **casing unification** and **format normalization** of existing values.

### ⚙️ Allowed Preprocessing Operations
1. **Case Unification:** Cast all string inputs in categorical columns (e.g., SLA Status, Channel, Severity, Status) to uppercase/lowercase standard equivalents (e.g., map `pass`/`PASS` to `Pass`, map `Web app`/`webapp` to `Web App`).
2. **Spelling Correction:** Map obvious typos (e.g. `Crtical` to `Critical`, `Pas` to `Pass`) to the standard categorical option, without inventing new details.
3. **Format Standardization:** Parse existing string dates (e.g., `10.06.2026`) and times (e.g., `10.52.00`) to convert them to standard datetime format for database ingestion, but leave nulls untouched.
4. **Programmatic TAT Calculation:** Calculate TAT durations directly in Node.js when Asked/Received time fields are validly populated, instead of relying on broken Excel `#VALUE!` calculations. If any inputs are missing, the output must remain null.


## 📊 Summary of All 81 Column Data Entry Classifications

To guide the dashboard database schema and cleaning pipelines, all 81 columns of the Agri Advisory QA Test Log are classified into the following 6 ingestion categories:

| Ingestion Category | Column Count | Column Indices & Names | Key Formatting Errors | Unification Strategy |
| :--- | :---: | :--- | :--- | :--- |
| **📅 Date & Time Fields** | **17** | **2**: Test Date<br>**12**: Time Question Asked<br>**13**: Time Answer Received<br>**25**: Author Assignment Time<br>**26**: Author Completion Time<br>**29, 30**: Reviewer1 Time (Assign/Complete)<br>**33, 34**: Reviewer2 Time (Assign/Complete)<br>**37, 38**: Reviewer3 Time (Assign/Complete)<br>**41, 42**: Reviewer4 Time (Assign/Complete)<br>**45, 46**: Reviewer5 Time (Assign/Complete)<br>**49, 50**: Moderator Time (Assign/Complete) | Datetime/Time mix, float decimal hours (`11.5`), leading commas (`, 05:01 PM`), AM/PM suffix duplicates. | Extract `.time()`, remove date prefix, convert fractional hours to minutes, map `'NA'` $\rightarrow$ `Null`. |
| **👤 Actor Name Fields** | **8** | **3**: Tester Name<br>**24**: Author's Name<br>**28**: Reviewer1 Name<br>**32**: Reviewer2 Name<br>**36**: Reviewer3 Name<br>**40**: Reviewer4 Name<br>**44**: Reviewer5 Name<br>**48**: Moderator's Name | Casing duplicates, transposed spelling typos (e.g. `Englsih`), dot/colon prefixes (e.g. `: Pallavi J P`), cell shift errors. | Fuzzy dictionary mapping to standardize spelling, strip colons/dots, title-case all names, restore shifted names. |
| **✅ Standardized Binary Labels** | **19** | **16**: Question in Review Model?<br>**52**: Follow-up Q in Review Model?<br>**53**: Answer Scientifically Correct?<br>**54**: Expert Name Displayed?<br>**55**: Correct Expert Name?<br>**56**: Source Links Provided?<br>**57**: 120-min Msg Shown?<br>**58**: Notification Received?<br>**59**: Notification on Thread?<br>**60**: Notification Linked Correct Q-ID?<br>**61**: Voice Input Working?<br>**62**: Voice Output Working?<br>**66**: Weather Q Correct?<br>**67**: Mandi Price Q Correct?<br>**68**: Scheme Q Correct?<br>**69**: Question Saved in DB?<br>**70**: Answer Saved in DB?<br>**71**: Q-ID Consistent?<br>**72**: WhatsApp vs Web Match? | Casing variants (`YES`, `yes`, `Yes`, `NO`, `No`, `no`), space padding. | Convert to boolean or strict `"Yes"`/`"No"` strings. Map `'NA'` and `'NIL'` $\rightarrow$ `Null`. |
| **🏷️ Standardized Multi-Class Labels** | **19** | **4**: Type of Question<br>**5**: Build / Version<br>**6**: Sprint / Cycle<br>**7**: Channel Tested<br>**8**: Language Tested<br>**11**: Question Category<br>**15**: SLA Status<br>**17**: Question Correctly Framed?<br>**18**: Original Language<br>**19**: Translated Language<br>**20**: Translation Quality<br>**21**: Translation Error Type<br>**22**: Tagging<br>**23**: Allocated to Reviewer?<br>**63**: Voice Input Quality<br>**64**: Voice Output Quality<br>**73**: Overall Test Status<br>**74**: Defect Severity<br>**78**: Status | Spelling typos, semantic duplicates (e.g. `Wrong` vs `Incorrect`), floating version duplicates, tester comments. | Unified Title-casing, semantic consolidation maps, keep version float strings, isolate tester comments to separate bug logs. |
| **📝 Free Text & Remarks** | **5** | **10**: Query Text (Original)<br>**65**: Voice Issue Description<br>**75**: Defect ID / Bug Ref Zoho Ticketing<br>**76**: Reviewer Remarks<br>**77**: Tester Remarks | Non-ASCII characters, whitespace-only entries, carriage return breaks (`
`) in middle of text. | Trim whitespace, standardize dashes, replace internal carriage returns with space, map empty strings $\rightarrow$ `Null`. |
| **🆔 Identifiers & TAT Durations** | **13** | **1**: Test ID<br>**9**: Question ID<br>**14**: Respo nse Time (mins) [Auto]<br>**27**: Author TAT (mins)<br>**31**: Review1 TAT (mins)<br>**35**: Review2 TAT (mins)<br>**39**: Review3 TAT (mins)<br>**43**: Review4 TAT (mins)<br>**47**: Review5 TAT (mins)<br>**51**: Moderator TAT (mins)<br>**79, 80, 81**: Trailing Unnamed columns | Excel `#VALUE!` reference errors, database ID format mix, negative turnaround times, empty trailing columns. | Recalculate TAT programmatically to fix `#VALUE!`, extract ID strings, drop empty boilerplate trailing columns. |
