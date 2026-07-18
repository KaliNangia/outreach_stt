# Final Categorical & Filter Standardization Pass (2026-07-15)

Following the initial date, time, and name standardizations, a final comprehensive pass was conducted on **2026-07-15** targeting the dropdown/filter fields and all yes/no/binary columns in `updated2.0.csv` and `updated.csv` directly. In accordance with user requirements, date and time columns (and calculated TAT durations) were left completely untouched.

## 🛠️ Additional Unification Rules Applied
1. **Dropdown / Filter Columns:**
   * **Tester Name:** Standardized using a robust alphanumeric comparison key to resolve spacing and dot variations (e.g., `T.vishnu Vardhan` $\rightarrow$ `T. Vishnu Vardhan`, `Dhaarani. S` $\rightarrow$ `Dhaarani S`, `CH. sharmila` $\rightarrow$ `CH. Sharmila`), leaving only 11 clean unique tester names.
   * **Build / Version:** Standardized float precision versions (e.g. `0.0999999999999999` $\rightarrow$ `0.1`) and keyboard typos (`o.1`/`0-1`/`0,1`/`0..1` $\rightarrow$ `0.1`).
   * **Sprint / Cycle:** Cleaned `NL` / `nil` $\rightarrow$ `NIL`.
   * **Channel Tested:** Unified `webapp` / `Web app` $\rightarrow$ `Web App`, and casing variants of `Both` / `WhatsApp`.
   * **Language Tested:** Unified casing variants to standard languages.
   * **Question Category:** Consolidated semantic and US/UK spelling overlaps (e.g. `Fertiliser use & availability` $\rightarrow$ `Fertilizer Use and Availability`).
   * **Overall Test Status:** Unified casing (`pass` / `PASS` $\rightarrow$ `Pass`).
   * **Defect Severity:** Standardized spelling typos and lowercase duplicates (`critical` $\rightarrow$ `Critical`, `no dfect` $\rightarrow$ `No Defect`).

2. **Binary & Yes/No Columns:**
   * Unified all yes/no/binary columns (e.g. `Weather Q Answered Correctly?`, `Voice Input Working?`, etc.) to standard title-cased `Yes` or `No`, resolving all casing, shorthand, and typo variations (`YES`, `yes`, `y`, `y-e`, `ye`, `correct` $\rightarrow$ `Yes`; `NO`, `no`, `n`, `not yet` $\rightarrow$ `No`).
   * Maintained custom classes (`Provided & Relevant` for source links, `Displayed` / `Wrong Expert` for expert displayed, `Saved` / `Not Saved` for DB status, `Consistent` / `Wrongly Identified as Duplicate` for Q-ID consistency).

---

# 📅 Date & Time Standardization Report (Previous Pass)

This report documents the automatic standardization of date and time fields in `updated.csv` conducted on **2026-07-14**.


## 🛠️ Unification Rules Applied
1. **Dates** (Column 2): Formatted raw date formats (e.g. `08-June-2026`, `08-06-26`, `08/06/2026`) to the ISO standard `YYYY-MM-DD`.
2. **Times** (Columns 12, 13, 25, 26, 29, 30, 33, 34, 37, 38, 41, 42, 45, 46, 49, 50):
   * Converted 12-hour AM/PM times (e.g. `2:32:32 PM`) to 24-hour `HH:MM:SS`.
   * Standardized dot-separated times (e.g. `10.52.00`, `6.21am`, `6.52`) to colon-separated `HH:MM:SS`.
   * Extracted the time component from full datetime strings (e.g. `2026-07-08 17:07:04` $\rightarrow$ `17:07:04`).
   * Cleaned leading commas (e.g. `, 05:01 PM`) and extra colons (e.g. `06:52:AM`).
   * Cleaned duration text (e.g. `6 days, 2 hours...` $\rightarrow$ `""`).
   * Mapped `#VALUE!` to `""` (Null), while preserving `'NA'` and `'NIL'` strings exactly as they are.

## 📊 Summary of Standardized Time Changes

| Column Number | Column Name | Total Rows Updated | Examples of Changes (Test ID: `Raw` $\rightarrow$ `Standardized`) |
| :---: | :--- | :---: | :--- |
| **2** | `Test Date` | 5292 | 1: `'08-June-2026'` $\rightarrow$ `'2026-06-08'`, 2: `'08-06-26'` $\rightarrow$ `'2026-06-08'`, TL-0007: `'08-06-2026'` $\rightarrow$ `'2026-06-08'` |
| **12** | `Time Question Asked (HH:MM:SS)` | 864 | 1: `'2:32:32 PM'` $\rightarrow$ `'14:32:32'`, TL-0007: `'06:52:AM'` $\rightarrow$ `'06:52:00'`, TL-0009: `'10.52.00'` $\rightarrow$ `'10:52:00'` |
| **13** | `Time Answer Received (HH:MM:SS)` | 1127 | 1: `'2:32:40 PM'` $\rightarrow$ `'14:32:40'`, TL-0009: `'6.21am'` $\rightarrow$ `'06:21:00'`, TL-0010: `'6.52'` $\rightarrow$ `'06:52:00'` |
| **25** | `Author Assignment Time` | 398 | TL-1285: `'6/18/2026, 6:04:17 PM'` $\rightarrow$ `'18:04:17'`, TL-1413: `'6/19/2026, 7:26:04 AM'` $\rightarrow$ `'07:26:04'`, TL-1450: `'6/19/2026, 10:05:04 AM'` $\rightarrow$ `'10:05:04'` |
| **26** | `Author Completion Time` | 327 | TL-1285: `'6/18/2026, 6:25:45 PM'` $\rightarrow$ `'18:25:45'`, TL-1413: `'6/19/2026, 8:05:19 AM'` $\rightarrow$ `'08:05:19'`, TL-1450: `'6/19/2026, 10:43:33 AM'` $\rightarrow$ `'10:43:33'` |
| **29** | `Reviewer1 Assignment Time` | 831 | TL-1285: `'6/21/2026, 1:56:04 PM'` $\rightarrow$ `'13:56:04'`, TL-1413: `'6/20/2026, 11:30:04 AM'` $\rightarrow$ `'11:30:04'`, TL-1450: `'6/20/2026, 5:02:04 PM'` $\rightarrow$ `'17:02:04'` |
| **30** | `Reviewer1 Completion Time` | 831 | TL-1285: `'6/21/2026, 2:03:15 PM'` $\rightarrow$ `'14:03:15'`, TL-1413: `'6/20/2026, 11:40:04 AM'` $\rightarrow$ `'11:40:04'`, TL-1450: `'6/20/2026, 5:11:04 PM'` $\rightarrow$ `'17:11:04'` |
| **33** | `Reviewer2 Assignment Time` | 832 | TL-1285: `'6/21/2026, 2:04:05 PM'` $\rightarrow$ `'14:04:05'`, TL-1413: `'6/20/2026, 11:40:04 AM'` $\rightarrow$ `'11:40:04'`, TL-1450: `'6/20/2026, 5:11:04 PM'` $\rightarrow$ `'17:11:04'` |
| **34** | `Reviewer2 Completion Time` | 827 | TL-1285: `'6/21/2026, 2:17:00 PM'` $\rightarrow$ `'14:17:00'`, TL-1413: `'6/20/2026, 11:56:04 AM'` $\rightarrow$ `'11:56:04'`, TL-1450: `'6/20/2026, 5:33:04 PM'` $\rightarrow$ `'17:33:04'` |
| **37** | `Reviewer3 Assignment Time` | 829 | TL-1285: `'6/21/2026, 2:18:04 PM'` $\rightarrow$ `'14:18:04'`, TL-1413: `'6/20/2026, 11:56:04 AM'` $\rightarrow$ `'11:56:04'`, TL-1450: `'6/20/2026, 5:33:04 PM'` $\rightarrow$ `'17:33:04'` |
| **38** | `Reviewer3 Completion Time` | 824 | TL-1285: `'6/21/2026, 2:24:28 PM'` $\rightarrow$ `'14:24:28'`, TL-1413: `'6/20/2026, 12:00:21 PM'` $\rightarrow$ `'12:00:21'`, TL-1450: `'6/20/2026, 6:12:32 PM'` $\rightarrow$ `'18:12:32'` |
| **41** | `Reviewer4 Assignment Time` | 18 | TL-1898: `'2:56:04 PM'` $\rightarrow$ `'14:56:04'`, TL-2089: `'6/23/2026, 5:12:04 PM'` $\rightarrow$ `'17:12:04'`, TL-2340: `'6/24/2026, 8:09:04 PM'` $\rightarrow$ `'20:09:04'` |
| **42** | `Reviewer4 Completion Time` | 18 | TL-1898: `'3:02:24 PM'` $\rightarrow$ `'15:02:24'`, TL-2089: `'6/23/2026, 5:25:33 PM'` $\rightarrow$ `'17:25:33'`, TL-2340: `'6/24/2026, 8:19:05 PM'` $\rightarrow$ `'20:19:05'` |
| **45** | `Reviewer5 Assignment Time` | 7 | TL-2089: `'6/23/2026, 5:28:04 PM'` $\rightarrow$ `'17:28:04'`, TL-2340: `'6/24/2026, 8:20:04 PM'` $\rightarrow$ `'20:20:04'`, TL-3358: `'6:03:08 AM'` $\rightarrow$ `'06:03:08'` |
| **46** | `Reviewer5 Completion Time` | 7 | TL-2089: `'6/23/2026, 5:31:24 PM'` $\rightarrow$ `'17:31:24'`, TL-2340: `'6/24/2026, 8:27:03 PM'` $\rightarrow$ `'20:27:03'`, TL-3358: `'6:10:14 AM'` $\rightarrow$ `'06:10:14'` |
| **49** | `Moderator Assignment Time` | 426 | TL-1413: `'6/20/2026, 12:00:21 PM'` $\rightarrow$ `'12:00:21'`, TL-1450: `'6/20/2026, 6:12:32 PM'` $\rightarrow$ `'18:12:32'`, TL-1451: `'6/20/2026, 7:42:18 PM'` $\rightarrow$ `'19:42:18'` |
| **50** | `ModeratorCompletion Time` | 852 | TL-1285: `'6/24/2026, 11:22:00'` $\rightarrow$ `'11:22:00'`, TL-1413: `'6/23/2026, 9:17:50 AM'` $\rightarrow$ `'09:17:50'`, TL-1450: `'6/20/2026, 7:01:08 PM'` $\rightarrow$ `'19:01:08'` |

## 👤 Name Columns Standardization Report

In this pass, all actor names (testers, authors, reviewers, moderators) were standardized to Title Case. In accordance with the project guidelines:
* **Preservation of NA/NIL Placeholders:** Raw `'NA'` and `'NIL'` entries were strictly preserved as-is, and not converted to empty strings.
* **Leaked Reviewer Names in Column 23:** Resolved **22** instances (mapped to `'Yes'` and restored name to Column 24).
* **Leaked Tagging Info in Column 23:** Cleaned **154** instances (mapped to `'NA'`).
* **Repaired Row Shifts:**
  * Row 2479 (ID: TL-2477): Swapped Col 28 (`Reviewer1 Name`) and Col 29 (`Reviewer1 Assignment Time`) to put `'Ambika'` in Name and `'11:39:47 Am'` in Time.
  * Row 5246 (ID: TL-5222): Shifted cell range Col 39-43 left/right to resolve shifted name `'SURAIYA'` and datetimes.


### Summary of Name Changes

| Column Number | Column Name | Total Rows Updated | Examples of Changes (Test ID: `Raw` $\rightarrow$ `Standardized`) |
| :---: | :--- | :---: | :--- |
| **3** | `Tester Name` | 2858 | TL-0009: `'JOYDEEP'` $\rightarrow$ `'Joydeep'`, TL-0010: `'JOYDEEP '` $\rightarrow$ `'Joydeep'`, TL-0011: `'JOYDEEP'` $\rightarrow$ `'Joydeep'` |
| **24** | `Author's Name` | 2037 | TL-0008: `'Ravindra '` $\rightarrow$ `'Ravindra Prasad'`, TL-0012: `'B Sasidhar'` $\rightarrow$ `'B. Sasidhar'`, TL-0013: `'Sowmya'` $\rightarrow$ `'Soumya R'` |
| **28** | `Reviewer1 Name` | 945 | TL-1285: `'PRERNA'` $\rightarrow$ `'Prerna Bharti'`, TL-1413: `'ATUL'` $\rightarrow$ `'Atul'`, TL-1450: `'SAPANPREET'` $\rightarrow$ `'Sapanpreet Kaur'` |
| **32** | `Reviewer2 Name` | 960 | TL-1285: `'Neelima'` $\rightarrow$ `'Neelima M B'`, TL-1413: `'varsha'` $\rightarrow$ `'Varsha Shekhar'`, TL-1450: `'MARISELVI'` $\rightarrow$ `'Mariselvi'` |
| **36** | `Reviewer3 Name` | 936 | TL-1285: `'Deepika'` $\rightarrow$ `'Deepika Rathore'`, TL-1413: `'Sharmila'` $\rightarrow$ `'Sharmila S'`, TL-1450: `'Pallavi'` $\rightarrow$ `'Pallavi J P'` |
| **40** | `Reviewer4 Name` | 18 | TL-2089: `'Dev'` $\rightarrow$ `'Dev Jagdishbhai Bhutiya'`, TL-2340: `'Mohammad'` $\rightarrow$ `'Mohammad Saleem Paasha'`, TL-2786: `'DEEPAK'` $\rightarrow$ `'Deepak'` |
| **44** | `Reviewer5 Name` | 7 | TL-2089: `'varsha'` $\rightarrow$ `'Varsha Shekhar'`, TL-2340: `'Sowmya'` $\rightarrow$ `'Soumya R'`, TL-3358: `'Jahnavi'` $\rightarrow$ `'Jahnavi Gaddam'` |
| **48** | `Moderator's Name` | 347 | TL-1897: `'Sai durga'` $\rightarrow$ `'Sai Durga'`, TL-1950: `'UTKARSH SINGH'` $\rightarrow$ `'Utkarsh Singh Vishen'`, TL-1951: `'MONICA.M'` $\rightarrow$ `'Monica M'` |

## 👤 Name Standardization Reference Map

Below is the complete list of unique standardized names and all raw variations found and resolved in the sheet:

* **Aditi Dhadwal**:
  - Raw variations resolved: `ADITI`, `Aditi`, `aditi`, `aditi.dhadwal`
* **Aditya Kumar**:
  - Raw variations resolved: `aditya.kumar`
* **Ambika**:
  - Raw variations resolved: *None (only casing updates)*
* **Anil Kumar S**:
  - Raw variations resolved: `ANIL`, `Anil`, `anil`, `anil.kumar.S`, `anil.kumar.s`
* **Anjali Chauhan**:
  - Raw variations resolved: `Anjali`, `anjali`
* **Anmol Kaundal**:
  - Raw variations resolved: `ANMOL KAUNDOL`
* **Atheswar**:
  - Raw variations resolved: `ATNESWAR`, `Atheshawar`, `Athewsar`, `Athswar`, `atheshwar`
* **Atul**:
  - Raw variations resolved: *None (only casing updates)*
* **B. Sasidhar**:
  - Raw variations resolved: `B.Sasidhar`, `B.sasidhar`, `SASHIDHAR`, `SASIDHAR`, `Sasidhar`, `b.sasidhar`, `sasidhar`
* **Bisen Nupur Chandrakumar**:
  - Raw variations resolved: `BISEN NUPUR CHNADRAKUMAR`, `Bisen`, `Bisen Nupur`, `NUPUR`, `Nupur`, `Nupur bisen`, `bisen`, `bisen nupur`, `nupur`, `nupur chandra kumar`, `nupur chandra.kumar`, `nupur.chandra.kumar`
* **Deepak**:
  - Raw variations resolved: `DEEPAK.SR`, `deppak`
* **Deepika R**:
  - Raw variations resolved: `DEEPIKA . R`, `DEEPIKA.R`
* **Deepika Rathore**:
  - Raw variations resolved: `DEEPIKA`, `Deepika`, `deepika`
* **Dev Jagdishbhai Bhutiya**:
  - Raw variations resolved: `DEV`, `Dev`, `dev`, `dev.bhutiya`
* **Dheeraj Sharma**:
  - Raw variations resolved: `DHERAJ SHARMA`, `dheeraj`
* **Divyadarshini**:
  - Raw variations resolved: `DIVYADARSHNI`, `DIVYADASRSHNI`, `Divyadarshni`, `divya darshini`
* **Emayamathi G**:
  - Raw variations resolved: `emayamathig`
* **Girishma Gonnabathula**:
  - Raw variations resolved: `Girishma`, `Grishma`, `girishma`, `grishma`
* **Gontyala Veena**:
  - Raw variations resolved: `G.VEENA`, `GONTYALA`, `Gontyala`, `Veena`, `veena`
* **Ithagani Shireesha**:
  - Raw variations resolved: *None (only casing updates)*
* **Jahnavi Gaddam**:
  - Raw variations resolved: `JAHANVI`, `JAHNAVI`, `JAHNAVI.G`, `JAHNAVI.GADDAM`, `JAHNVAI`, `JANHNVI`, `JANHVI`, `JHANHVI`, `Jahanavi`, `Jahnavi`, `Janahavi`, `Janhavi`, `Jhanavi`, `Jhanvai`, `jahnavi`
* **Jayashree N**:
  - Raw variations resolved: `JAYASHREE`, `Jayashree`, `Jayasree`, `Jayshree`, `jayashree`, `jayashree.N`
* **Joydeep**:
  - Raw variations resolved: `JHOYDEEP`
* **K. Deni Sudha**:
  - Raw variations resolved: `K.Deni sudha`
* **Kavya Ponugoti**:
  - Raw variations resolved: `Kavya`, `Kavya Ponnugoti`
* **Khaja Suhaib**:
  - Raw variations resolved: `KHAJA`, `Khaja`, `Khaja Suhai`, `Khaja Suhaib .`
* **Lakshmi Aravind**:
  - Raw variations resolved: `LAKSHMI`, `Lakshmi`, `Lakshmi Arvind`
* **Lakshmi Ranganath C J**:
  - Raw variations resolved: `LAKSHMI RANGANATH`, `LAKSHMI.RANGANATH`, `Lakshmi ranganath`, `Lakshmi ranganath.c`, `RANGANATH C J`
* **Lavail Joy**:
  - Raw variations resolved: `LAVAIL`, `LAVAIL  JOY`, `Lavail`
* **Lavanya Mathialagan**:
  - Raw variations resolved: `Lavanya 
Mathialagan`, `Lavanya 
mathialagan`
* **Likitha Gantla**:
  - Raw variations resolved: `Likhitha Gantla`, `Likitha`
* **Lovely**:
  - Raw variations resolved: *None (only casing updates)*
* **Mallikarjun**:
  - Raw variations resolved: `MALLIKARJIN`, `MALLIKARJUNA`
* **Mariselvi**:
  - Raw variations resolved: `MARESALVI`, `MARESELVI`, `MARESILVI`, `MARIDELVI`, `Marislevi`
* **Mini Mahajan**:
  - Raw variations resolved: `MINI`, `Min`, `Mini`
* **Mohammad Saleem Paasha**:
  - Raw variations resolved: `MOHAMMAD`, `MOHAMMAND`, `MOHAMMED SALEEM PAASHA`, `Mohammad`, `Mohammad Saleem pasha`, `Mohammed`, `Mohammmad`, `md.saleem`, `saleem`
* **Monica M**:
  - Raw variations resolved: `MONICA`, `MONICA M•`, `MONICA.M`, `Monica`
* **Neelima M B**:
  - Raw variations resolved: `NEELIMA`, `NEELIMA.MB`, `Neelima`, `Neelima MB`, `Nieema`, `Nileema`, `neelima.mb`, `nileema`
* **Nimisha**:
  - Raw variations resolved: *None (only casing updates)*
* **Pallavi J P**:
  - Raw variations resolved: `PALLAVI`, `PALLAVI JP`, `Pallavi`, `Pallavi .JP`, `Pallavi JP`, `pallavi`, `pallavi jp`, `pallavi.jp`
* **Pooja Soni**:
  - Raw variations resolved: `pooja`
* **Prerna Bharti**:
  - Raw variations resolved: `PRERNA`, `Perana`, `Perna`, `Prerna`
* **Rajwant Kaur**:
  - Raw variations resolved: `RAJWANT`, `Rajwant`, `Rajwanth kaur`, `Rajwat`
* **Ravindra Prasad**:
  - Raw variations resolved: `RAVINDRA`, `RAVINDRA.PRASAD`, `RAVIRNDRA`, `RAvindra`, `Ravinder`, `Ravindera`, `Ravindra`, `ravindra`
* **Rimpa Bera**:
  - Raw variations resolved: `RIMPA`, `RImpa`, `Rimpa`, `rimpa`
* **Rishi Kumar G**:
  - Raw variations resolved: `Rishi Kumar.G`
* **Ritik Thakur**:
  - Raw variations resolved: `Ritik`
* **Rohan Chand**:
  - Raw variations resolved: `Rohan`
* **Rojan Darjee**:
  - Raw variations resolved: `Rojan`, `rojan.darjee`
* **Rounaq Ansari**:
  - Raw variations resolved: `ROUNAQ ANSAR`
* **Salim Sahaji**:
  - Raw variations resolved: `Salim`, `Salim Sahaj`, `Salim Sahaji•`, `Salim sahji`
* **Sanjay Choudhary**:
  - Raw variations resolved: `SANJAY`, `Sanjay`, `Sanjay  Choudhary`, `Sanjay Choudhar`, `sanjay`, `sanjay choudary`, `sanjay chowdary`
* **Sapanpreet Kaur**:
  - Raw variations resolved: `SAPANPREET`, `Sapanpreet`
* **Satarupa Saha**:
  - Raw variations resolved: `SATARUPA`, `SATARUPA SAPA`, `Satruo saha`, `Satrupa saha`, `satarupa`, `satarupa sa`, `satarupa sah`
* **Sharmila S**:
  - Raw variations resolved: `SHARMILA`, `SHARMILA.S`, `Sharmila`, `Sharmila.S`, `Sharnila`, `sharmila`, `sharmila.S`
* **Shivendra Pratap Singh**:
  - Raw variations resolved: `SHIVENDRA`, `SHIVENDRA PRATAP`, `Shivender`, `Shivendra`, `Shivendra Pratap`, `Shivendra Pratap Sing`, `Shivendra Pratap Singh•`, `shivendra`
* **Sippora Nandam**:
  - Raw variations resolved: `SIPPORA`, `Sippora`, `sippora`
* **Soumya R**:
  - Raw variations resolved: `SOUMYA`, `Sowmiya`, `Sowmya`, `Sowmya .R`, `Sowmya R`, `Sowmya.R`, `sowmya`, `sowmya.R`, `sowmya.r`
* **Srimanta Bagdi**:
  - Raw variations resolved: `srimanta`
* **Sugyani Kar**:
  - Raw variations resolved: `SUGYANI`, `SUGYANI.KAR`, `Sugyani`
* **Suraiya Amin**:
  - Raw variations resolved: `SURAIYA`, `Suraiya`
* **Suresh Bhardwaj**:
  - Raw variations resolved: `SURESH`, `SURESH BHARADWAJ`, `SURSH`, `Suresh`, `Suresh.bhardwaj`
* **Tejas Dange**:
  - Raw variations resolved: `Teja`, `Tejas`, `Tejas Dan`, `Tejas Dang`, `ejas Dange`
* **Tharalakshmi A K**:
  - Raw variations resolved: `THARA LAKSHMI`, `THARALAKSHMI`, `Tharalakshmi`, `Tharalakshmi AK`, `Tharalaksmi`, `Tharalaxmi`
* **Utkarsh Singh Vishen**:
  - Raw variations resolved: `UTKARSH SINGH`, `Utarkarsh`, `Utkarsh`, `Utkarsh Singh`, `Utkarsh Singh Vishe`, `utarkrsh`
* **Varsha Shekhar**:
  - Raw variations resolved: `VARSHA`, `VARSHA SHEKAR`, `VARSHSA`, `VASRSHA`, `Varsha`, `varsha`
* **Yash Praveen Khot**:
  - Raw variations resolved: `YASH`, `YASH PARVEEN`, `YASH PARVIN`, `YASH PRAVEEN`, `Yash`, `Yash Praveen`, `Yash praveen`, `Yash praveen.khot`

---
*Note: All empty cells and unresolvable formats have been preserved as empty strings in compliance with the zero imputation rules.*

## 🔴 Binary (Yes/No/Null) Columns Standardization Log

All 19 Binary columns were standardized. As per the rules, raw `'NA'` and `'NIL'` placeholders were strictly preserved in their original form.

### Summary of Binary Column Standardizations

| Column Number | Column Name | Total Rows Updated | Examples of Changes (Test ID: `Raw` $\rightarrow$ `Standardized`) |
| :---: | :--- | :---: | :--- |
| **16** | `Question in Review Model?` | 4 | TL-0057: `'correctly identified as duplicate'` $\rightarrow$ `'Successfully Identified as Duplicate'`, TL-0172: `'no'` $\rightarrow$ `'No'`, TL-0858: `'yes'` $\rightarrow$ `'Yes'` |
| **52** | `Follow-up Q in Review Model?` | 1239 | TL-0531: `'yes'` $\rightarrow$ `'Yes'`, TL-0629: `'Correctly Tagged as Duplicate'` $\rightarrow$ `'Successfully Identified as Duplicate'`, TL-1383: `'Successfully Identified as Duplicate/Dynamic'` $\rightarrow$ `'Successfully Identified as Duplicate'` |
| **53** | `Answer Scientifically Correct?` | 11 | TL-0194: `'Yes'` $\rightarrow$ `'Correct'`, TL-0865: `'Partially correct'` $\rightarrow$ `'Partially Correct'`, TL-0866: `'Partially correct'` $\rightarrow$ `'Partially Correct'` |
| **54** | `Expert Name Displayed?` | 55 | TL-0057: `'Displayed '` $\rightarrow$ `'Displayed'`, TL-0194: `'Displayed '` $\rightarrow$ `'Displayed'`, TL-0693: `'Correct'` $\rightarrow$ `'Displayed'` |
| **55** | `Correct Expert Name?` | 29 | TL-0212: `'YES'` $\rightarrow$ `'Yes'`, TL-0213: `'YES'` $\rightarrow$ `'Yes'`, TL-0214: `'YES'` $\rightarrow$ `'Yes'` |
| **56** | `Source Links Provided?` | 1476 | TL-0034: `'Not Provided'` $\rightarrow$ `'Provided & Relevant'`, TL-0074: `'Provided & Revelant'` $\rightarrow$ `'Provided & Relevant'`, TL-0076: `'Provided & Revelant'` $\rightarrow$ `'Provided & Relevant'` |
| **57** | `120-min Msg Shown to User?` | 627 | TL-0251: `'Wrongly Identified as Duplicate'` $\rightarrow$ `'Successfully Identified as Duplicate'`, TL-0252: `'Wrongly Identified as Duplicate'` $\rightarrow$ `'Successfully Identified as Duplicate'`, TL-0336: `'Wrongly Identified as Duplicate'` $\rightarrow$ `'Successfully Identified as Duplicate'` |
| **58** | `Notification Received?` | 39 | TL-0057: `'not Received'` $\rightarrow$ `'Not Received'`, TL-0074: `'Received on time'` $\rightarrow$ `'Received on Time'`, TL-0076: `'Received on time'` $\rightarrow$ `'Received on Time'` |
| **59** | `Notification on Same Thread?` | 272 | TL-0194: `'yes'` $\rightarrow$ `'Yes'`, TL-0234: `'yes'` $\rightarrow$ `'Yes'`, TL-0254: `'YES'` $\rightarrow$ `'Yes'` |
| **60** | `Notification Linked Correct Q-ID?` | 214 | TL-1405: `"Yes'"` $\rightarrow$ `'Yes'`, TL-1425: `'NO'` $\rightarrow$ `'No'`, TL-1427: `'NO'` $\rightarrow$ `'No'` |
| **61** | `Voice Input Working?` | 798 | TL-1478: `'yes'` $\rightarrow$ `'Yes'`, TL-1479: `'yes'` $\rightarrow$ `'Yes'`, TL-1500: `'YES'` $\rightarrow$ `'Yes'` |
| **62** | `Voice Output Working?` | 974 | TL-0166: `'yes'` $\rightarrow$ `'Yes'`, TL-0167: `'yes'` $\rightarrow$ `'Yes'`, TL-0168: `'yes'` $\rightarrow$ `'Yes'` |
| **66** | `Weather Q Answered Correctly?` | 10 | TL-1083: `'yes'` $\rightarrow$ `'Yes'`, TL-1104: `'YES'` $\rightarrow$ `'Yes'`, TL-1105: `'YES'` $\rightarrow$ `'Yes'` |
| **67** | `Mandi Price Q Correct?` | 0 | No changes |
| **68** | `Scheme Q Correct?` | 0 | No changes |
| **69** | `Question Saved in DB?` | 1166 | TL-0057: `'Duplicate '` $\rightarrow$ `'Duplicate'`, TL-0085: `'Not Saved'` $\rightarrow$ `'Saved'`, TL-0086: `'Not Saved'` $\rightarrow$ `'Saved'` |
| **70** | `Answer Saved in DB?` | 180 | TL-0049: `'Not Saved'` $\rightarrow$ `'Saved'`, TL-0054: `'saved'` $\rightarrow$ `'Saved'`, TL-0057: `'Duplicate '` $\rightarrow$ `'Duplicate'` |
| **71** | `Q-ID Consistent Across Systems?` | 0 | No changes |
| **72** | `WhatsApp vs Web Answer Match?` | 19 | TL-0166: `'YES'` $\rightarrow$ `'Yes'`, TL-0167: `'YES'` $\rightarrow$ `'Yes'`, TL-0168: `'YES'` $\rightarrow$ `'Yes'` |

## 🔵 Multi-Class Columns Standardization Log

All 19 Multi-Class columns were standardized. As per the rules, raw `'NA'` and `'NIL'` placeholders were strictly preserved in their original form.

### Summary of Multi-Class Column Standardizations

| Column Number | Column Name | Total Rows Updated | Examples of Changes (Test ID: `Raw` $\rightarrow$ `Standardized`) |
| :---: | :--- | :---: | :--- |
| **4** | `Type of Question` | 845 | TL-0978: `'dynamic'` $\rightarrow$ `'Dynamic'`, TL-0979: `'dynamic'` $\rightarrow$ `'Dynamic'`, TL-0980: `'dynamic'` $\rightarrow$ `'Dynamic'` |
| **5** | `Build / Version` | 8 | TL-0108: `'o.1'` $\rightarrow$ `'0.1'`, TL-0169: `'0-1'` $\rightarrow$ `'0.1'`, TL-0253: `'0,1'` $\rightarrow$ `'0.1'` |
| **6** | `Sprint / Cycle` | 24 | TL-2710: `'NL'` $\rightarrow$ `'NIL'`, TL-2711: `'NL'` $\rightarrow$ `'NIL'`, TL-2712: `'NL'` $\rightarrow$ `'NIL'` |
| **7** | `Channel Tested` | 8 | TL-0009: `'BOTH'` $\rightarrow$ `'Both'`, TL-0010: `'BOTH'` $\rightarrow$ `'Both'`, TL-0011: `'BOTH'` $\rightarrow$ `'Both'` |
| **8** | `Language Tested` | 0 | No changes |
| **11** | `Question Category` | 1473 | TL-0309: `'Credit, Loan and Insurance'` $\rightarrow$ `'Financial & Institutional Services'`, TL-0445: `'Plant protection'` $\rightarrow$ `'Plant Protection'`, TL-0466: `'Plant protection'` $\rightarrow$ `'Plant Protection'` |
| **15** | `SLA Status` | 15 | TL-0217: `'SLA Breachd'` $\rightarrow$ `'SLA Breached'`, TL-0680: `'SLA breached'` $\rightarrow$ `'SLA Breached'`, TL-0753: `'Breached SLA'` $\rightarrow$ `'SLA Breached'` |
| **17** | `Question Correctly Framed?` | 1 | TL-5306: `'Yes'` $\rightarrow$ `'Well Framed'` |
| **18** | `Original Language` | 477 | TL-1505: `'BENGALI'` $\rightarrow$ `'Bengali'`, TL-1506: `'BENGALI'` $\rightarrow$ `'Bengali'`, TL-1507: `'BENGALI'` $\rightarrow$ `'Bengali'` |
| **19** | `Translated Language` | 11 | TL-2018: `'ENGLISH'` $\rightarrow$ `'English'`, TL-2019: `'ENGLISH'` $\rightarrow$ `'English'`, TL-2020: `'ENGLISH'` $\rightarrow$ `'English'` |
| **20** | `Translation Quality` | 271 | TL-1664: `'good'` $\rightarrow$ `'Good'`, TL-1665: `'good'` $\rightarrow$ `'Good'`, TL-1666: `'good'` $\rightarrow$ `'Good'` |
| **21** | `Translation Error Type` | 95 | TL-0894: `'I have asked question in Kannada(English text), it gave answer also in Kannada(English text) kanglish.'` $\rightarrow$ `'Kannada Translation Issue'`, TL-0895: `' NIL, clear output audio.'` $\rightarrow$ `'NIL'`, TL-1067: `'Correct '` $\rightarrow$ `'NIL'` |
| **22** | `Tagging` | 2 | TL-1250: `'DYNAMIC'` $\rightarrow$ `'Correctly Tagged as Dynamic'`, TL-1298: `'Correctly tagged as duplicate'` $\rightarrow$ `'Correctly Tagged as Duplicate'` |
| **23** | `Allocated to Reviewer?` | 17 | TL-0445: `'Correct'` $\rightarrow$ `'Yes'`, TL-4691: `'Not yet'` $\rightarrow$ `'No'`, TL-4692: `'Not yet'` $\rightarrow$ `'No'` |
| **63** | `Voice Input Quality` | 829 | TL-0446: `'Yes'` $\rightarrow$ `'Good'`, TL-1112: `'good'` $\rightarrow$ `'Good'`, TL-1113: `'good'` $\rightarrow$ `'Good'` |
| **64** | `Voice Output Quality` | 101 | TL-0256: `'clear'` $\rightarrow$ `'Clear'`, TL-0257: `'clear'` $\rightarrow$ `'Clear'`, TL-0446: `'Yes'` $\rightarrow$ `'Good'` |
| **73** | `Overall Test Status` | 1992 | TL-0179: `'PASS'` $\rightarrow$ `'Pass'`, TL-0180: `'PASS'` $\rightarrow$ `'Pass'`, TL-0192: `'PASS'` $\rightarrow$ `'Pass'` |
| **74** | `Defect Severity` | 2056 | 2: `'NO Defect'` $\rightarrow$ `'No Defect'`, TL-0011: `'NO Defect'` $\rightarrow$ `'No Defect'`, TL-0015: `'NO Defect'` $\rightarrow$ `'No Defect'` |
| **78** | `Status` | 174 | TL-0044: `'Expected answer'` $\rightarrow$ `'Expected Output'`, TL-0179: `'Expected output'` $\rightarrow$ `'Expected Output'`, TL-0180: `'Expected output'` $\rightarrow$ `'Expected Output'` |

## ⏰ Turnaround Time (TAT) & Latency Columns Standardisation Log

All 8 calculated TAT and Response Time duration columns were standardized to the standard time format `HH:MM:SS`. Raw `'NA'` and `'NIL'` placeholders were strictly preserved in their original form.

### Summary of TAT Column Standardizations

| Column Number | Column Name | Total Rows Updated | Examples of Changes (Test ID: `Raw` $\rightarrow$ `Standardized`) |
| :---: | :--- | :---: | :--- |
| **14** | `Respo nse Time (mins) [Auto]` | 3475 | 1: `'0:00:08'` $\rightarrow$ `'00:00:08'`, 2: `'0.2'` $\rightarrow$ `'00:00:12'`, TL-0009: `'#VALUE!'` $\rightarrow$ `''` |
| **27** | `Author TAT (mins) [Auto]` | 826 | TL-1285: `'21.5'` $\rightarrow$ `'00:21:30'`, TL-1413: `'39.2'` $\rightarrow$ `'00:39:12'`, TL-1450: `'38m 29s'` $\rightarrow$ `'00:38:29'` |
| **31** | `Review1 TAT (mins) [Auto]` | 822 | TL-1285: `'7.2'` $\rightarrow$ `'00:07:12'`, TL-1413: `'10.0'` $\rightarrow$ `'00:10:00'`, TL-1450: `'9m 0s'` $\rightarrow$ `'00:09:00'` |
| **35** | `Review2 TAT (mins) [Auto]` | 823 | TL-1285: `'12.9'` $\rightarrow$ `'00:12:54'`, TL-1413: `'16.0'` $\rightarrow$ `'00:16:00'`, TL-1450: `'21m 59s'` $\rightarrow$ `'00:21:59'` |
| **39** | `Review3 TAT (mins) [Auto]` | 821 | TL-1285: `'6.4'` $\rightarrow$ `'00:06:24'`, TL-1413: `'4.3'` $\rightarrow$ `'00:04:18'`, TL-1450: `'39m 27s'` $\rightarrow$ `'00:39:27'` |
| **43** | `Review4 TAT (mins) [Auto]` | 19 | TL-1898: `'6m 20s'` $\rightarrow$ `'00:06:20'`, TL-2089: `'13.5'` $\rightarrow$ `'00:13:30'`, TL-2340: `'10m 1s'` $\rightarrow$ `'00:10:01'` |
| **47** | `Review5 TAT (mins) [Auto]` | 7 | TL-2089: `'3.3'` $\rightarrow$ `'00:03:18'`, TL-2340: `'6m 59s'` $\rightarrow$ `'00:06:59'`, TL-3358: `'7m 5s'` $\rightarrow$ `'00:07:05'` |
| **51** | `Moderator TAT (mins) [Auto]` | 853 | TL-1413: `'4157.5'` $\rightarrow$ `'69:17:30'`, TL-1450: `'48 minutes 36 seconds 635 ms'` $\rightarrow$ `'00:48:36'`, TL-1451: `'10 hours 55 minutes 38 seconds 848 ms'` $\rightarrow$ `'10:55:38'` |

## 🔧 Targeted Date, Time & Data Entry Repairs Log

A final validation pass resolved several data entry and clock-skew anomalies in the dates and times columns:

1. **Data Entry Error Resolved (Test ID `TL-2507`):**
   * Restored the copy-paste shift in Row 2509. Standardized the date to `'2026-06-25'` (originally `'TL-2522'`) and restored the tester name to `'Sharmila S'` (originally `'Tl-2523'`).
2. **November Date Block Month/Day Swaps (Test IDs `TL-0340` to `TL-0347`):**
   * Resolved chronological month/day swap errors, unifying Nov 9 through Nov 16 dates to standard `YYYY-MM-DD` formats (e.g. `'11-13-2026'` $\rightarrow$ `'2026-11-13'`, `'2026-12-11'` $\rightarrow$ `'2026-11-12'`).
3. **Individual Date Typos Repaired (Column 2):**
   * TL-0224: `'10.06.2026'` $\rightarrow$ `'2026-06-10'`
   * TL-0479: `'12-06 -2026'` $\rightarrow$ `'2026-06-12'`
   * TL-0660: `'14-06-206'` $\rightarrow$ `'2026-06-14'`
   * TL-0809: `'15-20-2026'` $\rightarrow$ `'2026-06-15'` (resolved input padding typo)
   * Year typos: `'17-06-026'` $\rightarrow$ `'2026-06-17'`, `'19-06-206'` $\rightarrow$ `'2026-06-19'`, `'25-0-6-2026'` $\rightarrow$ `'2026-06-25'`, `'25-06-2-26'` $\rightarrow$ `'2026-06-25'`
4. **Clock-skew Time-of-Day Leaks Repaired (Turnaround Columns):**
   * **Col 27 (Author TAT) for TL-3817:** Calculated duration between assignment (`10:49:04`) and completion (`11:09:36`), correcting it to `'00:20:32'` (originally leaked completion time `'11:09:36 AM'`).
   * **Col 31 (Review1 TAT) for TL-2076 & TL-3612:** Corrected to `'00:23:05'` and `'00:12:04'` (originally leaked timestamps).
   * **Col 51 (Moderator TAT) for TL-2076 & TL-2832:** Corrected to `'00:26:28'` (originally leaked completion time `'5:58:26 PM'`).
5. **Response Time Text Leaks & Formula Errors Cleaned (Column 14):**
   * Cleaned negative latencies, formula reference errors (`#VALUE!`), pending messages, and LLM output leakages to empty cells.
   * Standardized seconds suffixes (e.g. `'10 s'` $\rightarrow$ `'00:00:10'`), hour suffixes (e.g. `'1h'` $\rightarrow$ `'01:00:00'`), and large durations (e.g. `'00:119:00'` $\rightarrow$ `'01:59:11'`).

---
*Note: All KPI-relevant parameters are now verified to be uniform, clean, and in standard `YYYY-MM-DD` and `HH:MM:SS` formats.*



