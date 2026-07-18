# 🔬 Agri Advisory QA Test Log - Column-by-Column Analysis

This document provides a line-by-line detailed audit of all **81 columns** in the `Test Log_1` worksheet of `Agri_Advisory_QA_Test_Log (1.0).xlsx` as of 2026-07-14.

## ⚠️ Data Constraints Reference (Golden Rules)
* **Nominal (N):** Unique identifier fields (e.g. IDs). Must be non-null and not have duplicate casing versions.
* **Categorical (C):** Pre-defined categories. Variations in capitalization or spacing represent duplicate spelling casing errors.
* **Date (Date):** Represents test dates. Should be parsed as standard Date objects or conform to standard formatting.
* **Time (Time):** Represents timestamps. Format must be 24-hour `HH:MM:SS` or standard 12-hour AM/PM.
* **Duration (Duration):** Numeric difference value. Text, Excel formula errors (`#VALUE!`), or negative durations violate this rule.
* **Required / Nullable Spec:** Columns marked as **Required** must not contain missing/null cells. Missing required values represents a database/integrity failure. No assumptions/imputations are allowed.

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

## 📂 Column Breakdown

### Column 1: `Test ID`
* **Expected Type (Rule):** `Nominal`
* **Nullability Specification:** `Required`
* **Data Types Present in Excel Cell Objects:** ` float, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5515 | 100.0% filled |
| **Null Cells** | 0 | 0.0% empty |
| **Unique Entries** | 5501 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Duplicate Key Violation:** Column contains **14 duplicate Test ID keys** that appear multiple times. Under the golden rules, Nominal fields must contain strictly unique values.
  * *Duplicate Test ID Examples:* 'TL-4613' (Rows: [4620, 4634]), 'TL-4614' (Rows: [4621, 4635]), 'TL-4615' (Rows: [4622, 4636]), 'TL-4616' (Rows: [4623, 4637]), 'TL-4617' (Rows: [4624, 4638])

* **Sample Values:** `TL-0676`, `TL-4383`, `TL-0077`, `TL-1500`, `TL-3888`, `TL-2922`

---

### Column 2: `Test Date`
* **Expected Type (Rule):** `Date`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5311 | 96.3% filled |
| **Null Cells** | 204 | 3.7% empty |
| **Unique Entries** | 100 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 69 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 69 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 225: '10.06.2026', Row 480: '12-06 -2026', Row 661: '14-06-206', Row 1204: '17-06-026', Row 1296: '18-6-2026'

* **Sample Values:** `19/06/2026`, `13-07-2026`, `15-06-2026`, `14-06-2039`, `25-0-6-2026`, `14-06-2036`

---

### Column 3: `Tester Name`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Required`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5312 | 96.3% filled |
| **Null Cells** | 203 | 3.7% empty |
| **Unique Entries** | 29 | Distinct values present |
| **Casing Duplicates** | 8 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Null Violation:** Marked as **Required** but has 203 missing cells. *Note: Under our golden rules, missing values cannot be assumed or imputed.* 

* **Sample Values:** `Rishi Kumar.G`, `K. Deni sudha`, `Lavanya mathialagan`, `T.VIshnu Vardhan`, `T. Vishnu Vardhn`, `Nimisha`
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

---

### Column 4: `Type of Question`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4080 | 74.0% filled |
| **Null Cells** | 1435 | 26.0% empty |
| **Unique Entries** | 12 | Distinct values present |
| **Casing Duplicates** | 5 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling & Typo Violations:** Contains 12 distinct text variations due to mixed casing and typos.
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

---

### Column 5: `Build / Version`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` float, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5297 | 96.0% filled |
| **Null Cells** | 218 | 4.0% empty |
| **Unique Entries** | 12 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 7 | Typo errors |

**🔍 Diagnostics & Findings:**
❌ **Format & Typo Violations:** Contains 270 records of floating-point approximation noise and 7 manual typing typos.
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

---

### Column 6: `Sprint / Cycle`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5266 | 95.5% filled |
| **Null Cells** | 249 | 4.5% empty |
| **Unique Entries** | 4 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 1 | Anomaly error |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Anomaly Violations:** Contains 1 standalone anomaly `'Ye'` and 24 abbreviation errors `'NL'`.
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

---

### Column 7: `Channel Tested`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5254 | 95.3% filled |
| **Null Cells** | 261 | 4.7% empty |
| **Unique Entries** | 7 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing & Spacing Violations:** Contains 4 non-standard variations across Web App and Both clusters.
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

### Column 8: `Language Tested`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5284 | 95.8% filled |
| **Null Cells** | 231 | 4.2% empty |
| **Unique Entries** | 5 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ **Clean Category:** Column is clean and fully compliant with the golden rules. No spelling or casing issues found.
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

### Column 9: `Question ID`
* **Expected Type (Rule):** `Nominal`
* **Nullability Specification:** `Required`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5035 | 91.3% filled |
| **Null Cells** | 480 | 8.7% empty |
| **Unique Entries** | 4853 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 258 | Formatting & corruption errors |

**🔍 Diagnostics & Findings:**
❌ **Nominal, Format & Null Violations:** Contains 480 null cells in a Required column, plus 258 formatting and string corruption issues.
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

---

### Column 10: `Query Text (Original)`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5275 | 95.6% filled |
| **Null Cells** | 240 | 4.4% empty |
| **Unique Entries** | 4197 | Distinct values present |
| **Casing Duplicates** | 45 | Semantic duplicate groups |
| **Format Errors** | 4 | Formatting & script anomalies |

**🔍 Diagnostics & Findings:**
❌ **Casing & Typo Violations:** Contains 45 groups of semantically identical queries with casing/punctuation differences, 1 whitespace-only query, and 2 character/script anomalies.
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

* **Sample Values:** `Is it permissible to mix NPK 19-19-19 fertilizer with pesticides for foliar application in onion crops in Andhra Pradesh?`, `Caterpillars have infested the urd (black gram) crop. What to do?`, `What are the best practices and methods for the proper storage of ginger rhizomes to prevent spoilage and maintain quality in Kerala?`, `What are the causes and management strategies for deformed fruit formation in pumpkin crops in Odisha?`, `How can I effectively manage mite infestations in cowpea crops, and what is the recommended chemical application protocol in Odisha?`, `What are the key agronomic and morphological characteristics of the cauliflower variety 'Julie'?`

---

### Column 11: `Question Category`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5121 | 92.9% filled |
| **Null Cells** | 394 | 7.1% empty |
| **Unique Entries** | 34 | Distinct values present |
| **Casing Duplicates** | 5 | Casing/spacing duplicates |
| **Format Errors** | 5 | Semantic overlaps |

**🔍 Diagnostics & Findings:**
❌ **Casing & Semantic Overlap Violations:** Contains casing variations in 2 categories, and 5 sets of semantically overlapping category names.
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

* **Sample Values:** `Insect–Pest Management`, `Sowing time & weather`, `Irrigation and Water Management`, `PLANT PROTECTION`, `Market Prices, MSP and Marketing`, `Plant Protection`

---

### Column 12: `Time Question Asked (HH:MM:SS)`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` datetime, float, str, time `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5106 | 92.6% filled |
| **Null Cells** | 409 | 7.4% empty |
| **Unique Entries** | 3323 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 826 | Formatting & type violations |

**🔍 Diagnostics & Findings:**
❌ **Time Format & Type Confusions:** Contains 686 datetime objects, 127 string formats, and 13 decimal floats that must be standardized.
Based on a detailed format and type audit of the **Time Question Asked** column (Column 12), we identified widespread data type confusion and manual typing errors.

### Column 12 Data Type & Value Distribution
Excel cells in this column contain 4 distinct Python data types instead of a standardized time object:

| Data Type Present | Count | Percentage | Description / Example Rows |
| :---------------- | :---: | :--------: | :------------------------- |
| **Time Object**   | 4,280 | 77.6%      | Clean, standardized `time` objects (e.g. Rows 4, 5, 14) |
| **Datetime Object**| 686  | 12.4%      | Contains both date and time (e.g. Rows 175, 205, 229) |
| **String Type**   | 127   | 2.3%       | Text representations of time (e.g. Rows 9, 11, 19) |
| **Float Type**    | 13    | 0.2%       | Numeric decimal times (e.g. Rows 12, 13, 17) |
| **Missing (Null)**| 409   | 7.4%       | Left blank (e.g. Rows 7, 8, 10) |

### Time String Format Clusters
The 127 string entries are grouped into the following formatting clusters:
1. **Colon with AM/PM (78 records)**: Contains extra colons or leading commas.
   * E.g. Row 9: `'06:52:AM'`, Row 54: `', 05:01 PM'`, Row 76: `'22:30:29 PM'` *(redundant 24-hr PM marker)*.
2. **Dot Delimited Strings (23 records)**: Uses dots instead of colons.
   * E.g. Row 11: `'10.52.00'`, Row 19: `'11.29 AM'`.
3. **Leading Commas & Datetime Text (22 records)**:
   * E.g. Row 623: `', 09:30:03'`, Row 1206: `'20/06/2026,   10:26:43'`.
4. **Error & Placeholder Strings (4 records)**:
   * E.g. Row 263/1123: `'#VALUE!'` *(Excel reference failure)*, Row 5505/5507: `'NA'`.

### Decimal Float Times (13 records)
These represent times entered as floating-point decimals (e.g., Row 12: `11.0`, Row 13: `11.04`, Row 23: `11.5`, Row 36: `14.4`). The decimals represent fractional hours (e.g., `11.5` $
ightarrow$ 11:30:00).

### 🛠️ Preprocessing Rules: How to Consider Column 12
* **Type Conversion**: Check if the value is a datetime object. If so, extract the time component (`.time()`).
* **String Cleaning**:
  * Strip leading/trailing commas, spaces, and quotes (e.g. `', 05:01 PM'` $
ightarrow$ `'05:01 PM'`).
  * Replace dots with colons (e.g., `'10.52.00'` $
ightarrow$ `'10:52:00'`).
  * If the string has a 12-hour AM/PM suffix, parse using 12-hour logic (e.g. `'11.29 AM'` $
ightarrow$ `'11:29:00'`).
* **Float Parsing**: Convert float hours to standard `HH:MM:SS` (multiply the fractional part by 60 to get minutes, and convert to string).
* **Null Mapping**: Map `'NA'`, `'#VALUE!'`, and empty strings directly to `Null`.

* **Sample Values:** `17:18:23`, `13:58:26`, `23:06:00`, `16:47:00`, `09:57:00`, `09:32:47`

---

### Column 13: `Time Answer Received (HH:MM:SS)`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` datetime, float, str, time `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4158 | 75.4% filled |
| **Null Cells** | 1357 | 24.6% empty |
| **Unique Entries** | 3955 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 1132 | Formatting & type violations |

**🔍 Diagnostics & Findings:**
❌ **Time Format & Type Confusions:** Contains 741 datetime objects, 377 string formats, and 14 decimal floats that must be standardized.
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

* **Sample Values:** `20:04:21`, `23:30:40`, `18.30.24`, `23:06:00`, `10:06:29`, `08:04:25`

---

### Column 14: `Respo nse Time (mins) [Auto]`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` float, int, str, time, timedelta `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3793 | 68.8% filled |
| **Null Cells** | 1722 | 31.2% empty |
| **Unique Entries** | 1202 | Distinct values present |
| **Casing Duplicates** | 20 | Spelling variations |
| **Format Errors** | 3756 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3756 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: datetime.timedelta(seconds=8), Row 5: 0.2, Row 10: '#VALUE!', Row 11: -6451.2, Row 12: 8928

* **Sample Values:** `81.2`, `326.2`, `3 hours 21 minutes.`, `1700.3`, `7sec`, `01:49:15`

---

### Column 15: `SLA Status`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4391 | 79.6% filled |
| **Null Cells** | 1124 | 20.4% empty |
| **Unique Entries** | 11 | Distinct values present |
| **Casing Duplicates** | 4 | Casing variations |
| **Format Errors** | 14 | Typo & garbage values |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Semantic Violations:** Contains casing variations in 2 states, 1 spelling typo, 1 backslash garbage value, and 4 placeholder `'NA'`s.
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

* **Sample Values:** `Within the SLA`, `within SLA`, `Not Applicable`, `SLA Breached`, `WITHIN SLA`, `SLA Breachd`

---

### Column 16: `Question in Review Model?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4557 | 82.6% filled |
| **Null Cells** | 958 | 17.4% empty |
| **Unique Entries** | 8 | Distinct values present |
| **Casing Duplicates** | 3 | Casing variations |
| **Format Errors** | 101 | Placeholder 'NA' entries |

**🔍 Diagnostics & Findings:**
❌ **Casing & Semantic Violations:** Contains casing variations in Yes/No categories, 1 duplicate semantic variation, and 101 placeholder `'NA'` entries.
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

* **Sample Values:** `Successfully Identified as Duplicate`, `no`, `Yes`, `No`, `yes`, `NA`

---

### Column 17: `Question Correctly Framed?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4607 | 83.5% filled |
| **Null Cells** | 908 | 16.5% empty |
| **Unique Entries** | 5 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 24 | Placeholder & anomaly entries |

**🔍 Diagnostics & Findings:**
❌ **Format & Typo Violations:** Contains 1 binary `'Yes'` typo, and 23 placeholder `'NA'` entries.
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

* **Sample Values:** `Well Framed`, `Ambiguous`, `Incorrectly Framed`, `NA`, `Yes`

---

### Column 18: `Original Language`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4706 | 85.3% filled |
| **Null Cells** | 809 | 14.7% empty |
| **Unique Entries** | 11 | Distinct values present |
| **Casing Duplicates** | 4 | Casing variations |
| **Format Errors** | 7 | Spelling & typo errors |

**🔍 Diagnostics & Findings:**
❌ **Casing & Typo Violations:** Contains casing duplicates in English and Bengali, 2 manual spelling typos (`Englsih`, `ENG;ISH`), and 5 placeholder `'NA'` entries.
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
   * `Englsih` (Row 2255) — transposing letters 'i' and 'h'.
   * `ENG;ISH` (Row 4100) — semicolon instead of 'L'.
2. **Missing Entries (809 records)**: 14.7% of rows are empty due to duplicate flagged tests.

### 🛠️ Preprocessing Rules: How to Consider Column 18
* **Unify English**: Map `ENGLISH`, `english`, `Englsih`, and `ENG;ISH` to `"English"`.
* **Unify Bengali**: Map `BENGALI` to `"Bengali"`.
* **Placeholder Cleanup**: Map `'NA'` to `Null`.

* **Sample Values:** `Telugu`, `ENG;ISH`, `BENGALI`, `Hindi`, `english`, `English`

---

### Column 19: `Translated Language`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4687 | 85.0% filled |
| **Null Cells** | 828 | 15.0% empty |
| **Unique Entries** | 11 | Distinct values present |
| **Casing Duplicates** | 2 | Casing variations |
| **Format Errors** | 288 | Typo & placeholder entries |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Placeholder Violations:** Contains casing duplicates in English, 1 abbreviation typo (`E`), 287 placeholder `'NA'` entries, and 2 rare categories (`Marathi`, `Other`).
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

* **Sample Values:** `Telugu`, `Hindi`, `english`, `English`, `Marathi`, `Bengali`

---

### Column 20: `Translation Quality`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4668 | 84.6% filled |
| **Null Cells** | 847 | 15.4% empty |
| **Unique Entries** | 14 | Distinct values present |
| **Casing Duplicates** | 6 | Casing variations |
| **Format Errors** | 904 | Placeholder & comment entries |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Comment Violations:** Contains casing duplicates in Correct/Good categories, 1 manual tester diagnostic comment, 1 space duplicate (`N A`), and 902 placeholder entries (`NA`, `NIL`).
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

* **Sample Values:** `Correct`, `NA`, `Major Error`, `Minor Error`, `good`, `correct`

---

### Column 21: `Translation Error Type`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4816 | 87.3% filled |
| **Null Cells** | 699 | 12.7% empty |
| **Unique Entries** | 13 | Distinct values present |
| **Casing Duplicates** | 2 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 2 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Asked question in hindi but gave answer in english mixed hindi`, `I have asked question in Kannada(English text), it gave answer also in Kannada(English text) kanglish.`, `Nil`, `Question asked in english but answer is given in hindi`, `Correct`, `Major`

---

### Column 22: `Tagging`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4721 | 85.6% filled |
| **Null Cells** | 794 | 14.4% empty |
| **Unique Entries** | 10 | Distinct values present |
| **Casing Duplicates** | 2 | Casing variations |
| **Format Errors** | 2131 | Placeholder entries |

**🔍 Diagnostics & Findings:**
❌ **Casing & Placeholder Violations:** Contains casing duplicate in Correctly Tagged category, 1 abbreviation typo, and 2,131 placeholder `'NA'` entries.
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

* **Sample Values:** `Correctly Tagged as Duplicate`, `NA`, `Correctly Tagged as Dynamic`, `Wrongly Tagged as Duplicate`, `Dynamic but not tagged`, `Duplicate but not tagged`

---

### Column 23: `Allocated to Reviewer?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4291 | 77.8% filled |
| **Null Cells** | 1224 | 22.2% empty |
| **Unique Entries** | 33 | Distinct values present |
| **Casing Duplicates** | 3 | Casing variations |
| **Format Errors** | 180 | Leaked names and tagging info |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Inversion Violations:** Contains casing duplicates in Yes/No, 26 records with leaked reviewer names, and 154 records with leaked Column 22 tagging labels.
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

* **Sample Values:** `NA`, `Yes`, `NO`, `YES`, `No`, `Successfully Identified as Duplicate/Dynamic`

---

### Column 24: `Author's Name`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4124 | 74.8% filled |
| **Null Cells** | 1391 | 25.2% empty |
| **Unique Entries** | 132 | Distinct values present |
| **Casing Duplicates** | 22 | Casing variations |
| **Format Errors** | 24 | Punctuation & spelling typos |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Prefix Violations:** Contains severe spelling variations (e.g. Atheswar / Satarupa splits), dot/colon prefixed names, and leaked non-name values (`NO`).
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

* **Sample Values:** `Jayshree N`, `ROUNAQ ANSARI`, `ATHESWAR`, `Mini`, `Veena`, `pooja soni`

---

### Column 25: `Author Assignment Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4838 | 87.7% filled |
| **Null Cells** | 677 | 12.3% empty |
| **Unique Entries** | 799 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3970 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3970 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `2026-07-08 17:07:04`, `19:13:08`, `2026-07-05 14:48:42`, `15:24:05`, `2026-06-23 15:26:03`, `07:46:05`

---

### Column 26: `Author Completion Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, timedelta, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4802 | 87.1% filled |
| **Null Cells** | 713 | 12.9% empty |
| **Unique Entries** | 867 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3950 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3950 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `09:41:59`, `2026-07-03 07:52:08`, `2026-07-02 09:26:30`, `17:17:30`, `20:27:48`, `2026-06-29 07:24:32`

---

### Column 27: `Author TAT (mins) [Auto]`
* **Expected Type (Rule):** `Duration`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` float, int, str, time, timedelta `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4816 | 87.3% filled |
| **Null Cells** | 699 | 12.7% empty |
| **Unique Entries** | 740 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 4605 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4605 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `32m 10s`, `29m 24s`, `46m 22s`, `38m`, `36m 2s`, `13m 22s`

---

### Column 28: `Reviewer1 Name`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4291 | 77.8% filled |
| **Null Cells** | 1224 | 22.2% empty |
| **Unique Entries** | 114 | Distinct values present |
| **Casing Duplicates** | 25 | Casing variations |
| **Format Errors** | 12 | Spelling & punctuation typos |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Spacing Violations:** Contains severe name casing, spacing, and punctuation variations.
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

* **Sample Values:** `AMBIKA`, `ATHESWAR`, `Anil`, `ADITI`, `ANIL`, `Aditi`

---

### Column 29: `Reviewer1 Assignment Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4836 | 87.7% filled |
| **Null Cells** | 679 | 12.3% empty |
| **Unique Entries** | 819 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3975 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3975 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `19:41:03`, `07:48:05`, `2026-07-05 14:48:42`, `14:48:05`, `2026-07-01 13:18:05`, `08:04:25`

---

### Column 30: `Reviewer1 Completion Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4792 | 86.9% filled |
| **Null Cells** | 723 | 13.1% empty |
| **Unique Entries** | 859 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3946 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3946 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `18:31:16`, `13:24:32`, `13:29:49`, `19:29:35`, `18:00:19`, `00:01:46`

---

### Column 31: `Review1 TAT (mins) [Auto]`
* **Expected Type (Rule):** `Duration`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` datetime, float, int, str, time, timedelta `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4798 | 87.0% filled |
| **Null Cells** | 717 | 13.0% empty |
| **Unique Entries** | 614 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 4585 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4585 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `1h 8m 8s`, `5m 31s`, `17m 1s`, `59m 56s`, `2m 59s`, `35m 4s`

---

### Column 32: `Reviewer2 Name`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 2154 | 39.1% filled |
| **Null Cells** | 3361 | 60.9% empty |
| **Unique Entries** | 89 | Distinct values present |
| **Casing Duplicates** | 25 | Casing variations |
| **Format Errors** | 12 | Spelling & punctuation typos |

**🔍 Diagnostics & Findings:**
❌ **Casing, Typo & Spacing Violations:** Contains severe name casing, spacing, and punctuation variations.
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

* **Sample Values:** `LAKSHMI.RANGANATH`, `LAKSHMI RANGANATH`, `DEEPIKA`, `RIMPA`, `TEJAS`, `SURAIYA`

---

### Column 33: `Reviewer2 Assignment Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4835 | 87.7% filled |
| **Null Cells** | 680 | 12.3% empty |
| **Unique Entries** | 808 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3973 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3973 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `2026-07-01 14:19:06`, `19:29:35`, `, 3:59:04 pm`, `15:52:11`, `2026-07-03 14:43:04`, `22:36:04`

---

### Column 34: `Reviewer2 Completion Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4787 | 86.8% filled |
| **Null Cells** | 728 | 13.2% empty |
| **Unique Entries** | 860 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3937 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3937 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `14:55:15`, `12:07:17`, `2026-07-09 10:57:21`, `18:31:16`, `15:43:20`, `20:18:03`

---

### Column 35: `Review2 TAT (mins) [Auto]`
* **Expected Type (Rule):** `Duration`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` timedelta, float, int, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4795 | 86.9% filled |
| **Null Cells** | 720 | 13.1% empty |
| **Unique Entries** | 587 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 4584 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4584 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `7s`, `19m 14s`, `13m 41s`, `15m 4`, `2m 59s`, `3m 56s`

---

### Column 36: `Reviewer3 Name`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4844 | 87.8% filled |
| **Null Cells** | 671 | 12.2% empty |
| **Unique Entries** | 141 | Distinct values present |
| **Casing Duplicates** | 47 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Janhavi`, `ATUL`, `Bisen a`, `Gontyala`, `Jayashree`, `Mohammed`

---

### Column 37: `Reviewer3 Assignment Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4836 | 87.7% filled |
| **Null Cells** | 679 | 12.3% empty |
| **Unique Entries** | 819 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3973 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3973 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `09:34:04`, `2026-07-01 14:19:06`, `07:48:05`, `09:03:06`, `2026-07-01 15:38:06`, `10:08:05`

---

### Column 38: `Reviewer3 Completion Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4794 | 86.9% filled |
| **Null Cells** | 721 | 13.1% empty |
| **Unique Entries** | 859 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3943 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3943 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `18:56:35`, `19:40:31`, `2026-06-29 07:46:01`, `14:41:51`, `18:42:18`, `2026-07-06 00:06:58`

---

### Column 39: `Review3 TAT (mins) [Auto]`
* **Expected Type (Rule):** `Duration`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` timedelta, float, int, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4795 | 86.9% filled |
| **Null Cells** | 720 | 13.1% empty |
| **Unique Entries** | 614 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 4585 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4585 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `4m 41s`, `13m 22s`, `28m 14s`, `5m 31s`, `3m 15s`, `5m 21s`

---

### Column 40: `Reviewer4 Name`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5012 | 90.9% filled |
| **Null Cells** | 503 | 9.1% empty |
| **Unique Entries** | 23 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Pallavi`, `Gontyala`, `DEEPAK`, `Bisen`, `SURAIYA`, `Vinay`

---

### Column 41: `Reviewer4 Assignment Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5005 | 90.8% filled |
| **Null Cells** | 510 | 9.2% empty |
| **Unique Entries** | 23 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 4986 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4986 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `2026-07-10 20:07:13`, `22:03:19`, `20:11:00`, `2026-07-09 19:54:04`, `18:32:04`, `23:18:04`

---

### Column 42: `Reviewer4 Completion Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5004 | 90.7% filled |
| **Null Cells** | 511 | 9.3% empty |
| **Unique Entries** | 21 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 4986 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4986 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `16:58:58`, `22:48:10`, `16:36:48`, `7m 8s`, `Na`, `18:42:09`

---

### Column 43: `Review4 TAT (mins) [Auto]`
* **Expected Type (Rule):** `Duration`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` timedelta, float, int, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5004 | 90.7% filled |
| **Null Cells** | 511 | 9.3% empty |
| **Unique Entries** | 20 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 4998 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4998 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `15m 6s`, `10m 2s`, `0:09:38`, `8.5`, `6m`, `13.5`

---

### Column 44: `Reviewer5 Name`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5004 | 90.7% filled |
| **Null Cells** | 511 | 9.3% empty |
| **Unique Entries** | 9 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Sowmya`, `Atheshwar`, `Na`, `Atul`, `NA`, `Dev`

---

### Column 45: `Reviewer5 Assignment Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5003 | 90.7% filled |
| **Null Cells** | 512 | 9.3% empty |
| **Unique Entries** | 9 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 4996 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4996 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `16:43:04`, `2026-07-08 20:19:04`, `2026-06-23 17:28:04`, `2026-06-24 20:20:04`, `Na`, `NA`

---

### Column 46: `Reviewer5 Completion Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5003 | 90.7% filled |
| **Null Cells** | 512 | 9.3% empty |
| **Unique Entries** | 9 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 4996 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4996 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `22:56:46`, `16:51:57`, `2026-06-24 20:27:03`, `14:17:44`, `Na`, `NA`

---

### Column 47: `Review5 TAT (mins) [Auto]`
* **Expected Type (Rule):** `Duration`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` timedelta, float, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 5004 | 90.7% filled |
| **Null Cells** | 511 | 9.3% empty |
| **Unique Entries** | 9 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 5002 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 5002 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `7m 5s`, `5m 6s`, `8m`, `Na`, `3.3`, `NA`

---

### Column 48: `Moderator's Name`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4767 | 86.4% filled |
| **Null Cells** | 748 | 13.6% empty |
| **Unique Entries** | 86 | Distinct values present |
| **Casing Duplicates** | 21 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Monica M`, `Utkarsh Singh`, `Lavail joy`, `satarupa sah`, `Sai Durga`, `Tejas dange`

---

### Column 49: `Moderator Assignment Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4756 | 86.2% filled |
| **Null Cells** | 759 | 13.8% empty |
| **Unique Entries** | 447 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 4307 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4307 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `2026-06-29 07:46:01`, `14:41:51`, `18:42:18`, `2026-07-05 15:39:00`, `2026-07-09 20:20:00.330000`, `2026-07-09 20:12:37.759000`

---

### Column 50: `ModeratorCompletion Time`
* **Expected Type (Rule):** `Time`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, datetime, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4783 | 86.7% filled |
| **Null Cells** | 732 | 13.3% empty |
| **Unique Entries** | 893 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 3888 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 3888 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `08:06:30`, `2026-07-01 17:20:40`, `17:12:08`, `2026-07-04 08:33:10`, `10:17:34`, `08:55:52`

---

### Column 51: `Moderator TAT (mins) [Auto]`
* **Expected Type (Rule):** `Duration`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` time, float, int, str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4789 | 86.8% filled |
| **Null Cells** | 726 | 13.2% empty |
| **Unique Entries** | 692 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 4558 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Format Violation:** Contains 4558 cells with invalid data types or string formatting.
  * *Invalid Format Examples:* Row 4: 'NA', Row 5: 'NA', Row 6: 'NA', Row 7: 'NA', Row 8: 'NA'

* **Sample Values:** `20.5`, `5 minutes 4 seconds`, `13 minutes 39 seconds 326 ms`, `40 minutes 26 seconds 644 ms`, `7 minutes 35 seconds 893 ms`, `: 26 minutes 53 seconds 463 ms`

---

### Column 52: `Follow-up Q in Review Model?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4302 | 78.0% filled |
| **Null Cells** | 1213 | 22.0% empty |
| **Unique Entries** | 12 | Distinct values present |
| **Casing Duplicates** | 2 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 2 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `c`, `Successfully Identified as Duplicate`, `Yes`, `No`, `Correctly Tagged as Duplicate`, `NIL`

---

### Column 53: `Answer Scientifically Correct?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3996 | 72.5% filled |
| **Null Cells** | 1519 | 27.5% empty |
| **Unique Entries** | 8 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 3 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Partially Correct`, `Correct`, `Yes`, `Partially correct`, `NA`, `Incorrect`

---

### Column 54: `Expert Name Displayed?`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3963 | 71.9% filled |
| **Null Cells** | 1552 | 28.1% empty |
| **Unique Entries** | 9 | Distinct values present |
| **Casing Duplicates** | 2 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Correct`, `Yes`, `Displayed`, `yes`, `NA`, `Not Displayed`

---

### Column 55: `Correct Expert Name?`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3972 | 72.0% filled |
| **Null Cells** | 1543 | 28.0% empty |
| **Unique Entries** | 11 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Successfully Identified as Duplicate`, `Correct`, `Yes`, `No`, `NO`, `Displayed`

---

### Column 56: `Source Links Provided?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3929 | 71.2% filled |
| **Null Cells** | 1586 | 28.8% empty |
| **Unique Entries** | 17 | Distinct values present |
| **Casing Duplicates** | 4 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 4 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Provided & Not Relevant`, `Provided & Relevant`, `Yes`, `NO`, `yes`, `Provided & Revelant`

---

### Column 57: `120-min Msg Shown to User?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4255 | 77.2% filled |
| **Null Cells** | 1260 | 22.8% empty |
| **Unique Entries** | 14 | Distinct values present |
| **Casing Duplicates** | 4 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 4 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Successfully Identified as Duplicate`, `na`, `Yes`, `No`, `NO`, `N0`

---

### Column 58: `Notification Received?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3906 | 70.8% filled |
| **Null Cells** | 1609 | 29.2% empty |
| **Unique Entries** | 10 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 3 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Successfully Identified as Duplicate`, `Not received`, `Received on Time`, `Yes`, `NO`, `NA`

---

### Column 59: `Notification on Same Thread?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3909 | 70.9% filled |
| **Null Cells** | 1606 | 29.1% empty |
| **Unique Entries** | 10 | Distinct values present |
| **Casing Duplicates** | 5 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 5 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Successfully Identified as Duplicate`, `Yes`, `Received on Time`, `No`, `NO`, `YEs`

---

### Column 60: `Notification Linked Correct Q-ID?`
* **Expected Type (Rule):** `Nominal`
* **Nullability Specification:** `Required`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3891 | 70.6% filled |
| **Null Cells** | 1624 | 29.4% empty |
| **Unique Entries** | 12 | Distinct values present |
| **Casing Duplicates** | 4 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Null Violation:** Marked as **Required** but has 1624 missing cells. *Note: Under our golden rules, missing values cannot be assumed or imputed.* 

* **Sample Values:** `Successfully Identified as Duplicate`, `Coreect`, `Correct`, `Yes`, `Received on Time`, `No`

---

### Column 61: `Voice Input Working?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4352 | 78.9% filled |
| **Null Cells** | 1163 | 21.1% empty |
| **Unique Entries** | 8 | Distinct values present |
| **Casing Duplicates** | 4 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 4 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Successfully Identified as Duplicate`, `Yes`, `No`, `NO`, `yes`, `Na`

---

### Column 62: `Voice Output Working?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4254 | 77.1% filled |
| **Null Cells** | 1261 | 22.9% empty |
| **Unique Entries** | 9 | Distinct values present |
| **Casing Duplicates** | 4 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 4 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Successfully Identified as Duplicate`, `good`, `Yes`, `No`, `NO`, `yes`

---

### Column 63: `Voice Input Quality`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4339 | 78.7% filled |
| **Null Cells** | 1176 | 21.3% empty |
| **Unique Entries** | 17 | Distinct values present |
| **Casing Duplicates** | 8 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 8 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `NO INPUT`, `No Output`, `Good`, `Correct`, `good`, `Yes`

---

### Column 64: `Voice Output Quality`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4238 | 76.8% filled |
| **Null Cells** | 1277 | 23.2% empty |
| **Unique Entries** | 12 | Distinct values present |
| **Casing Duplicates** | 4 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 4 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Low Volume`, `No Output`, `good`, `Yes`, `No ouput`, `Na`

---

### Column 65: `Voice Issue Description`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4128 | 74.9% filled |
| **Null Cells** | 1387 | 25.1% empty |
| **Unique Entries** | 118 | Distinct values present |
| **Casing Duplicates** | 15 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `take long time`, `NIl, no issue`, `Output voice error`, `NO voice output`, `Took 7 seconds for the first time, ten after no time tooked, voice given as soon as clicked.`, `NIL, it was clear.`

---

### Column 66: `Weather Q Answered Correctly?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4390 | 79.6% filled |
| **Null Cells** | 1125 | 20.4% empty |
| **Unique Entries** | 9 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 3 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Yes`, `No`, `yes`, `Na`, `Partial`, `NA`

---

### Column 67: `Mandi Price Q Correct?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4416 | 80.1% filled |
| **Null Cells** | 1099 | 19.9% empty |
| **Unique Entries** | 6 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 1 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Yes`, `No`, `Na`, `Partial`, `NA`, `NIL`

---

### Column 68: `Scheme Q Correct?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4412 | 80.0% filled |
| **Null Cells** | 1103 | 20.0% empty |
| **Unique Entries** | 5 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 1 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Yes`, `No`, `Na`, `NA`, `NIL`

---

### Column 69: `Question Saved in DB?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4175 | 75.7% filled |
| **Null Cells** | 1340 | 24.3% empty |
| **Unique Entries** | 15 | Distinct values present |
| **Casing Duplicates** | 6 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 6 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Successfully Identified as Duplicate`, `SAVED`, `Partial Save`, `Saved`, `Yes`, `Duplicate`

---

### Column 70: `Answer Saved in DB?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3800 | 68.9% filled |
| **Null Cells** | 1715 | 31.1% empty |
| **Unique Entries** | 10 | Distinct values present |
| **Casing Duplicates** | 4 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 4 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Partial Save`, `Saved`, `Yes`, `Duplicate`, `yes`, `saved`

---

### Column 71: `Q-ID Consistent Across Systems?`
* **Expected Type (Rule):** `Nominal`
* **Nullability Specification:** `Required`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4874 | 88.4% filled |
| **Null Cells** | 641 | 11.6% empty |
| **Unique Entries** | 4 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Null Violation:** Marked as **Required** but has 641 missing cells. *Note: Under our golden rules, missing values cannot be assumed or imputed.* 

* **Sample Values:** `Yes`, `NA`, `Successfully Identified as Duplicate`, `Wrongly Identified as Duplicate`

---

### Column 72: `WhatsApp vs Web Answer Match?`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4021 | 72.9% filled |
| **Null Cells** | 1494 | 27.1% empty |
| **Unique Entries** | 7 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 3 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Yes`, `No`, `NO`, `yes`, `Partial`, `NA`

---

### Column 73: `Overall Test Status`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3801 | 68.9% filled |
| **Null Cells** | 1714 | 31.1% empty |
| **Unique Entries** | 11 | Distinct values present |
| **Casing Duplicates** | 5 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 5 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `partial`, `PARTIAL`, `Pass`, `PASS`, `Partial`, `NA`

---

### Column 74: `Defect Severity`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3667 | 66.5% filled |
| **Null Cells** | 1848 | 33.5% empty |
| **Unique Entries** | 30 | Distinct values present |
| **Casing Duplicates** | 14 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 14 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `extreme`, `medium`, `NO Defect`, `Appearance of some gibberish letters in between the text.`, `missed few points`, `info`

---

### Column 75: `Defect ID / Bug Ref Zoho Desk Ticketing`
* **Expected Type (Rule):** `Nominal`
* **Nullability Specification:** `Required`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 2083 | 37.8% filled |
| **Null Cells** | 3432 | 62.2% empty |
| **Unique Entries** | 80 | Distinct values present |
| **Casing Duplicates** | 3 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Null Violation:** Marked as **Required** but has 3432 missing cells. *Note: Under our golden rules, missing values cannot be assumed or imputed.* 

* **Sample Values:** `https://desk.zoho.in/agent/annamai/annam-ai/tickets/details/202216000001805001`, `https://desk.zoho.in/agent/annamai/annam-ai/tickets/details/202216000001875009`, `https://desk.zoho.in/agent/annamai/annam-ai/tickets/details/202216000001953115`, `https://desk.zoho.in/agent/annamai/annam-ai/tickets/details/202216000002083001`, `https://desk.zoho.in/agent/annamai/annam-ai/tickets/details/202216000002066132`, `https://desk.zoho.in/agent/annamai/annam-ai/tickets/details/202216000002053075`

---

### Column 76: `Reviewer Remarks`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4315 | 78.2% filled |
| **Null Cells** | 1200 | 21.8% empty |
| **Unique Entries** | 5 | Distinct values present |
| **Casing Duplicates** | 1 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Nil`, `NA`, `Ambika Kumari
Jul 3, 2026, 05:37 PM
Acetamiprid and acephate are not in the source. Management of yellow vein mosaic virus: -Remove and destroy virus-infected plants as soon as they appear to reduce the spread of the disease. Grow resistant or tolerant varieties wherever available. -Since Yellow Vein Mosaic Virus (YVMV) is transmitted by whiteflies, effective whitefly management is essential. -At the time of sowing, treat seeds with Imidacloprid 70% WS @ 5 g/kg seed to protect young seedlings from early whitefly infestation. -Spray any one of the following insecticides at the first appearance of whiteflies and repeat at 10-day intervals, if required: Imidacloprid 17.8% SL @ 60–80 mL/acre, or Thiamethoxam 25% WG @ 40 g/acre, or Acetamiprid 20% SP @ 40 g/acre. Install yellow sticky traps (10–12 traps/acre) to monitor and reduce whitefly populations, keep the field free from weeds that act as alternate hosts, and avoid growing infected crops nearby.

MALLIKARJUN
Jul 3, 2026, 05:11 PM
Acephate is not mentioned in source

Vinay Choudhary
Jul 3, 2026, 04:56 PM
correct the dose of Acetamiprid is- Acetamiprid 20% SP @ 30 g/acre (equivalent to 75 g/ha). and Acephate 75% SP @ 162 g/acre is not there in attached source.`, `Safety precaution: Wear personal protective equipment including rubber gloves, a face mask, and long sleeves while mixing and spraying insecticides like Cyantraniliprole 10.26% OD. Ensure you strictly adhere to the recommended dosage to prevent chemical runoff into nearby water bodies, and observe the specific pre-harvest interval (PHI) printed on the pesticide label before picking any cucumbers for consumption.`, `NIL`

---

### Column 77: `Tester Remarks`
* **Expected Type (Rule):** `Non-Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 4292 | 77.8% filled |
| **Null Cells** | 1223 | 22.2% empty |
| **Unique Entries** | 1241 | Distinct values present |
| **Casing Duplicates** | 33 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `The provided question succesfully identified as duplicate and fetched the answer corrrectly and pushed the question in tno the GDB.`, `UNIQUE QUESTIOIN`, `In whatsapp the follow question about the crop grown but it didnt ask about the state, it itself took karanataka on its own and gave weather data`, `GDP QUESTION , ANSWER RECEIVED IN IMMADIATELY`, `2 hours disclaimer is seen. I received the correct answer (24/06/2026)`, `Answer are too short and Structure of answer is poor`

---

### Column 78: `Status`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 3683 | 66.8% filled |
| **Null Cells** | 1832 | 33.2% empty |
| **Unique Entries** | 15 | Distinct values present |
| **Casing Duplicates** | 2 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
❌ **Casing/Spelling Violation:** Contains 2 duplicate variants caused by inconsistencies in letter capitalization or spacing.

* **Sample Values:** `Expected output`, `Anomaly Found in Output`, `satisfactory output`, `Anomalies found in the output`, `Expected Output`, `Anomaly found.`

---

### Column 79: `Unnamed: 79`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 1 | 0.0% filled |
| **Null Cells** | 5514 | 100.0% empty |
| **Unique Entries** | 1 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `Anomaly Found in Output`

---

### Column 80: `Unnamed: 80`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` NoneType `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 0 | 0.0% filled |
| **Null Cells** | 5515 | 100.0% empty |
| **Unique Entries** | 0 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

---

### Column 81: `Unnamed: 81`
* **Expected Type (Rule):** `Categorical`
* **Nullability Specification:** `Nullable`
* **Data Types Present in Excel Cell Objects:** ` str `

**📊 Column Metrics:**
| Metric | Value | Details |
| :--- | :--- | :--- |
| **Filled Cells** | 1 | 0.0% filled |
| **Null Cells** | 5514 | 100.0% empty |
| **Unique Entries** | 1 | Distinct values present |
| **Casing Duplicates** | 0 | Spelling variations |
| **Format Errors** | 0 | Data type mismatches |

**🔍 Diagnostics & Findings:**
✅ Column is clean and fully compliant with the golden rules. No issues found.

* **Sample Values:** `:`

---

