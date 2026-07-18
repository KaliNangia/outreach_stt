# 📊 QA Dataset Comparison & Word-for-Word Standardization Report

This report provides a detailed comparison and a word-for-word audit log documenting all standardizations, fixes, and filters applied to transition the raw dataset (`Agri_Advisory_QA_Test_Log (1.0) - Test Log_1.csv` / `updated2.0.csv`) to the strictly clean dataset (`cleandataset.csv`).

---

## 📈 Side-by-Side KPI Comparison

The table below shows the performance of the chatbot and validation flow under the standardized raw dataset vs the clean dataset, computed using the official formulas:

| Metric / Parameter | Standardized Raw (updated2.0) | Strictly Clean (cleandataset) | Net Difference / Impact |
| :--- | :---: | :---: | :---: |
| **Total Evaluated Rows** | 5,110 | 909 | `-4,201 rows` (17.8% remaining) |
| **ACE Trust Score (%)** | 70.10% | 82.49% | **`+12.39%` (Improvement)** |
| **Farmer Experience Score (%)** | 51.90% | 66.70% | **`+14.80%` (Improvement)** |
| **Overall Pass Rate (%)** | 65.60% | 91.31% | **`+25.71%` (Improvement)** |
| **Critical Defects (Count)** | 101 | 63 | `-38 defects` |
| **Critical Defect Rate (%)** | 1.98% | 6.93% | `+4.95%` (Proportional increase) |
| **Data Integrity Failures (Count)** | 3,259 | 872 | `-2,387 failures` |
| **Data Integrity Failure Rate (%)** | 63.78% | 95.93% | `+32.15%` (Proportional increase) |
| **Release Health (Rate-Based) (%)** | 0.00% | 0.00% | `0.00%` (Unchanged due to bugs) |

---

## 🛠️ Word-for-Word Cleaning & Standardization Log

To resolve the severe inconsistencies, spelling errors, and format mismatches present in the raw data, the following structural and content transformations were applied.

### 1. 👤 Name Columns Standardization Reference Map
Raw actor names (testers, authors, reviewers, moderators) were consolidated, stripped of trailing dots and extra spaces, title-cased, and mapped to a standardized set of 11 distinct names. NA/NIL placeholders were strictly preserved as-is.

*   **Aditi Dhadwal**: Mapped from `ADITI`, `Aditi`, `aditi`, `aditi.dhadwal`
*   **Aditya Kumar**: Mapped from `aditya.kumar`
*   **Anil Kumar S**: Mapped from `ANIL`, `Anil`, `anil`, `anil.kumar.S`, `anil.kumar.s`
*   **Anjali Chauhan**: Mapped from `Anjali`, `anjali`
*   **Anmol Kaundal**: Mapped from `ANMOL KAUNDOL`
*   **B. Sasidhar**: Mapped from `B.Sasidhar`, `B.sasidhar`, `SASHIDHAR`, `SASIDHAR`, `Sasidhar`, `b.sasidhar`, `sasidhar`
*   **Bisen Nupur Chandrakumar**: Mapped from `BISEN NUPUR CHNADRAKUMAR`, `Bisen`, `Bisen Nupur`, `NUPUR`, `Nupur`, `Nupur bisen`, `bisen`, `bisen nupur`, `nupur`, `nupur chandra kumar`, `nupur chandra.kumar`, `nupur.chandra.kumar`
*   **CH. Sharmila**: Mapped from `CH.Sharmila`, ` CH.sharmila  `, `CH. sharmila`
*   **Deepak**: Mapped from `DEEPAK.SR`, `deppak`
*   **Deepika R**: Mapped from `DEEPIKA . R`, `DEEPIKA.R`
*   **Deepika Rathore**: Mapped from `DEEPIKA`, `Deepika`, `deepika`
*   **Dev Jagdishbhai Bhutiya**: Mapped from `DEV`, `Dev`, `dev`, `dev.bhutiya`
*   **Dhaarani S**: Mapped from `Dhaarani S`, `Dhaarani. S`, `Dhaarani.S`, ` Dhaarani.S  `, ` Dhaarani. S  `
*   **Dheeraj Sharma**: Mapped from `DHERAJ SHARMA`, `dheeraj`
*   **Divyadarshini**: Mapped from `DIVYADARSHNI`, `DIVYADASRSHNI`, `Divyadarshni`, `divya darshini`
*   **Emayamathi G**: Mapped from `emayamathig`
*   **Girishma Gonnabathula**: Mapped from `Girishma`, `Grishma`, `girishma`, `grishma`
*   **Gontyala Veena**: Mapped from `G.VEENA`, `GONTYALA`, `Gontyala`, `Veena`, `veena`
*   **Ithagani Shireesha**: Mapped from `Ithagani Shireesha`, `Ithagani shireesha`, ` Ithagani shireesha  `, ` Ithagani Shireesha  `
*   **Jahnavi Gaddam**: Mapped from `JAHANVI`, `JAHNAVI`, `JAHNAVI.G`, `JAHNAVI.GADDAM`, `JAHNVAI`, `JANHNVI`, `JANHVI`, `JHANHVI`, `Jahanavi`, `Jahnavi`, `Janahavi`, `Janhavi`, `Jhanavi`, `Jhanvai`, `jahnavi`
*   **Jayashree N**: Mapped from `JAYASHREE`, `Jayashree`, `Jayasree`, `Jayshree`, `jayashree`, `jayashree.N`
*   **Joydeep**: Mapped from `JOYDEEP`, ` JOYDEEP  `, `JHOYDEEP`
*   **K. Deni Sudha**: Mapped from `K.Deni sudha`, `K. Deni sudha`, ` K.Deni sudha  `
*   **Kavya Ponugoti**: Mapped from `Kavya`, `Kavya Ponnugoti`
*   **Khaja Suhaib**: Mapped from `KHAJA`, `Khaja`, `Khaja Suhai`, `Khaja Suhaib .`
*   **Lakshmi Aravind**: Mapped from `LAKSHMI`, `Lakshmi`, `Lakshmi Arvind`
*   **Lakshmi Ranganath C J**: Mapped from `LAKSHMI RANGANATH`, `LAKSHMI.RANGANATH`, `Lakshmi ranganath`, `Lakshmi ranganath.c`, `RANGANATH C J`
*   **Lavail Joy**: Mapped from `LAVAIL`, `LAVAIL  JOY`, `Lavail`
*   **Lavanya Mathialagan**: Mapped from `Lavanya Mathialagan`, `Lavanya \nmathialagan`, `Lavanya \nMathialagan`, `lavanya Mathialagan`, `  Lavanya Mathialagan `, ` Lavanya Mathialagan  `, `Lavanya mathialagan`
*   **Likitha Gantla**: Mapped from `Likhitha Gantla`, `Likitha`
*   **Mallikarjun**: Mapped from `MALLIKARJIN`, `MALLIKARJUNA`
*   **Mariselvi**: Mapped from `MARESALVI`, `MARESELVI`, `MARESILVI`, `MARIDELVI`, `Marislevi`
*   **Mini Mahajan**: Mapped from `MINI`, `Min`, `Mini`
*   **Mohammad Saleem Paasha**: Mapped from `MOHAMMAD`, `MOHAMMAND`, `MOHAMMED SALEEM PAASHA`, `Mohammad`, `Mohammad Saleem pasha`, `Mohammed`, `Mohammmad`, `md.saleem`, `saleem`
*   **Monica M**: Mapped from `MONICA`, `MONICA M•`, `MONICA.M`, `Monica`
*   **Neelima M B**: Mapped from `NEELIMA`, `NEELIMA.MB`, `Neelima`, `Neelima MB`, `Nieema`, `Nileema`, `neelima.mb`, `nileema`
*   **Pallavi J P**: Mapped from `PALLAVI`, `PALLAVI JP`, `Pallavi`, `Pallavi .JP`, `Pallavi JP`, `pallavi`, `pallavi jp`, `pallavi.jp`
*   **Pooja Soni**: Mapped from `pooja`
*   **Prerna Bharti**: Mapped from `PRERNA`, `Perana`, `Perna`, `Prerna`
*   **Rajwant Kaur**: Mapped from `RAJWANT`, `Rajwant`, `Rajwanth kaur`, `Rajwat`
*   **Ravindra Prasad**: Mapped from `RAVINDRA`, `RAVINDRA.PRASAD`, `RAVIRNDRA`, `RAvindra`, `Ravinder`, `Ravindera`, `Ravindra`, `ravindra`
*   **Rimpa Bera**: Mapped from `RIMPA`, `RImpa`, `Rimpa`, `rimpa`
*   **Rishi Kumar G**: Mapped from `Rishi Kumar G`, `Rishi Kumar.G`
*   **Ritik Thakur**: Mapped from `Ritik`
*   **Rohan Chand**: Mapped from `Rohan`
*   **Rojan Darjee**: Mapped from `Rojan`, `rojan.darjee`
*   **Rounaq Ansari**: Mapped from `ROUNAQ ANSAR`
*   **Salim Sahaji**: Mapped from `Salim`, `Salim Sahaj`, `Salim Sahaji•`, `Salim sahji`
*   **Sanjay Choudhary**: Mapped from `SANJAY`, `Sanjay`, `Sanjay  Choudhary`, `Sanjay Choudhar`, `sanjay`, `sanjay choudary`, `sanjay chowdary`
*   **Sapanpreet Kaur**: Mapped from `SAPANPREET`, `Sapanpreet`
*   **Satarupa Saha**: Mapped from `SATARUPA`, `SATARUPA SAPA`, `Satruo saha`, `Satrupa saha`, `satarupa`, `satarupa sa`, `satarupa sah`
*   **Sharmila S**: Mapped from `SHARMILA`, `SHARMILA.S`, `Sharmila`, `Sharmila.S`, `Sharnila`, `sharmila`, `sharmila.S`
*   **Shivendra Pratap Singh**: Mapped from `SHIVENDRA`, `SHIVENDRA PRATAP`, `Shivender`, `Shivendra`, `Shivendra Pratap`, `Shivendra Pratap Sing`, `Shivendra Pratap Singh•`, `shivendra`
*   **Sippora Nandam**: Mapped from `SIPPORA`, `Sippora`, `sippora`
*   **Soumya R**: Mapped from `SOUMYA`, `Sowmiya`, `Sowmya`, `Sowmya .R`, `Sowmya R`, `Sowmya.R`, `sowmya`, `sowmya.R`, `sowmya.r`
*   **Srimanta Bagdi**: Mapped from `srimanta`
*   **Sugyani Kar**: Mapped from `SUGYANI`, `SUGYANI.KAR`, `Sugyani`
*   **Suraiya Amin**: Mapped from `SURAIYA`, `Suraiya`
*   **Suresh Bhardwaj**: Mapped from `SURESH`, `SURESH BHARADWAJ`, `SURSH`, `Suresh`, `Suresh.bhardwaj`
*   **Tejas Dange**: Mapped from `Teja`, `Tejas`, `Tejas Dan`, `Tejas Dang`, `ejas Dange`
*   **Tharalakshmi A K**: Mapped from `THARA LAKSHMI`, `THARALAKSHMI`, `Tharalakshmi`, `Tharalakshmi AK`, `Tharalaksmi`, `Tharalaxmi`
*   **Utkarsh Singh Vishen**: Mapped from `UTKARSH SINGH`, `Utarkarsh`, `Utkarsh`, `Utkarsh Singh`, `Utkarsh Singh Vishe`, `utarkrsh`
*   **Varsha Shekhar**: Mapped from `VARSHA`, `VARSHA SHEKAR`, `VARSHSA`, `VASRSHA`, `Varsha`, `varsha`
*   **Yash Praveen Khot**: Mapped from `YASH`, `YASH PARVEEN`, `YASH PARVIN`, `YASH PRAVEEN`, `Yash`, `Yash Praveen`, `Yash praveen`, `Yash praveen.khot`

### 2. 📅 Date & Time Standardization Mappings
*   **Date Format Standardization:** Converted unstandardized date text formats (e.g. `'10.06.2026'`, `'14-06-2026'`, or trailing space strings like `'12-06 -2026'`) to standard ISO `YYYY-MM-DD`.
*   **Asked & Received Time Standardization:**
    *   Unified float decimal representation (e.g., `11.0` Asked Time $\rightarrow$ `11:00:00`, `6.52` Received Time $\rightarrow$ `06:52:00`).
    *   Removed text string suffixes and commas (e.g., `'06:52:AM'` $\rightarrow$ `'06:52:00'`, `', 05:01 PM'` $\rightarrow$ `'17:01:00'`).
    *   Converted 12-hour formats to 24-hour equivalent (e.g., `'2:32:32 PM'` $\rightarrow$ `'14:32:32'`).

### 3. ✅ Binary & Multi-Class Label Consolidations
*   **Yes/No Standardization:** Mapped spelling typos and lowercase duplicates (`YES`, `yes`, `y`, `ye` $\rightarrow$ `Yes`, and `NO`, `no`, `n` $\rightarrow$ `No`) to standard Title-cased `Yes` or `No` across all 19 binary columns.
*   **Overall Test Status:** Unified casing variations of `PASS`, `pass`, and `Pass` to a single `'Pass'` label.
*   **Defect Severity:** Unified variants such as `Crtical`/`critical` to `'Critical'` and `no dfect`/`NO Defect` to `'No Defect'`.
*   **Question Category (Module):** Unified US/UK spelling overlaps and semantic duplicates (e.g., `Fertiliser use & availability` $\rightarrow$ `Fertilizer Use and Availability`).

### 4. 🔧 Structural Row & Cell Repair Log
*   **Row `TL-2477`:** Swapped Col 28 (`Reviewer1 Name`) and Col 29 (`Reviewer1 Assignment Time`) to put `'Ambika'` in Name and `'11:39:47 Am'` in Time.
*   **Row `TL-5222`:** Shifted cell range Col 39-43 left/right to resolve shifted name `'SURAIYA'` and datetimes.

### 5. ⏳ Programmatic Turnaround Time (TAT) Calculation
*   Standardized raw turnaround time columns (`Author TAT`, `Reviewer 1-5 TAT`, `Moderator TAT`) by recalculating Excel `#VALUE!` reference errors directly from standardized Asked/Received datetimes. If inputs were missing, durations were left as Null.

---

## 🔎 Deep-Dive Observations & Statistical Insights

### 1. 🚀 Massive Quality Score Boost
Filtering out incomplete rows yields a significantly higher and more accurate assessment of the chatbot's true performance:
*   **ACE Trust Score** rises from **70.10%** to **82.49%** (`+12.39%` increase).
*   **Farmer Experience Score** increases from **51.90%** to **66.70%** (`+14.80%` increase).
*   **Pass Rate** spikes by **+25.71%** to reach **91.31%**.
*   *Conclusion:* Incomplete QA records (where testers omitted test statuses, categories, or response times) were heavily skewing the performance indices downward. When evaluating only fully complete test runs, the chatbot's quality is significantly higher.

### 2. 🧲 The "Consistency Selection Bias" (High Data Integrity Failures)
You will notice that in the clean dataset, the **Data Integrity Failure Rate** rises to an extreme **95.93%** (872 out of 909 rows):
*   *Why?* The strict clean filter requires the `Q-ID Consistent Across Systems?` column to be fully populated (non-empty).
*   In the raw dataset, this consistency column is left empty (blank) for 67.3% of the rows (representing cases where duplicate checks were not logged).
*   By forcing this parameter to be filled, we naturally filtered for the subset of rows where a duplicate ID check was conducted. Out of those, **95.9%** were logged as `"Wrongly Identified as Duplicate"`. This creates a selection bias that clusters system failures into the clean subset.
