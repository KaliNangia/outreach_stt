To build the desktop dashboard interface, here is the mapping of how the spreadsheet parameters (columns) are utilized to display the metrics, filters, and charts on the screen:

---

### 🎛️ 1. Header Section: Universal Filters
These parameters from the sheet must be exposed as drop-down selection filters at the top of the dashboard:
1.  **Date Filter:** Mapped to **Col 2 (`Test Date`)** *(Filter by Today, Last 7 Days, Last 30 Days, or Custom Range)*.
2.  **Build Version:** Mapped to **Col 5 (`Build / Version`)**.
3.  **Sprint / Cycle:** Mapped to **Col 6 (`Sprint / Cycle`)**.
4.  **Channel Tested:** Mapped to **Col 7 (`Channel Tested`)** *(Web App / WhatsApp)*.
5.  **Language Tested:** Mapped to **Col 8 (`Language Tested`)**.
6.  **Question Category:** Mapped to **Col 11 (`Question Category`)**.
7.  **Tester Name:** Mapped to **Col 3 (`Tester Name`)**.
8.  **Type of Question:** Mapped to **Col 4 (`Type of Question`)** *(GDB / Unique / Dynamic)*.
9.  **Overall Test Status:** Mapped to **Col 73 (`Overall Test Status`)** *(Pass / Fail / Partial)*.
10. **Defect Severity:** Mapped to **Col 74 (`Defect Severity`)** *(Critical / High / Medium / Low / Info / No Defect)*.

---

### 📊 2. Row 1: Executive KPI Cards (Primary Summary Metrics)
These four cards are shown as large-digit indicators at the top of the page:

| Dashboard Metric Card | Required Parameters (Sheet Columns) | Calculation Logic / Display |
| :--- | :--- | :--- |
| **ACE Trust Score (%)** | • **Col 53** (`Answer Scientifically Correct?`) <br>• **Cols 66, 67, 68** (`Weather`, `Mandi`, `Scheme` correctness) <br>• **Col 56** (`Source Links Provided?`) <br>• **Cols 54, 55** (`Expert Displayed`, `Correct Expert Name`) <br>• **Col 20** (`Translation Quality`) <br>• **Col 72** (`WhatsApp vs Web Answer Match?`) <br>• **Col 17** (`Question Correctly Framed?`) | Weighted average score:<br>$$0.40(A_{\text{sci}}) + 0.20(A_{\text{dom}}) + 0.10(S_{\text{lnk}}) + 0.10(E_{\text{exp}}) + 0.10(Q_{\text{trn}}) + 0.10(C_{\text{chn}})$$<br>• $A_{\text{sci}} = \% \text{ "Correct" in Col 53}$<br>• $A_{\text{dom}} = \text{Avg}(\% \text{ "Yes" in Cols 66, 67, 68})$<br>• $S_{\text{lnk}} = \% \text{ "Provided \& Relevant" in Col 56}$<br>• $E_{\text{exp}} = \% \text{ where Col 54 is "Displayed" and Col 55 is "Yes"}$<br>• $Q_{\text{trn}} = \% \text{ "Correct" or "Good" in Col 20}$<br>• $C_{\text{chn}} = \% \text{ "Yes" in Col 72}$ |
| **Farmer Experience Score (%)** | • **Col 14** (`Respo nse Time [Auto]`) <br>• **Col 15** (`SLA Status`) <br>• **Cols 61, 62, 63, 64** (`Voice Input/Output Working & Quality`) <br>• **Col 20** (`Translation Quality`) <br>• **Cols 58, 59, 60** (`Notification Received`, `Same Thread`, `Correct Q-ID`) <br>• **Col 57** (`120-min Msg Shown to User?`) | Weighted average score:<br>$$0.30(S_{\text{rsp}}) + 0.20(S_{\text{sla}}) + 0.20(V_{\text{io}}) + 0.15(Q_{\text{trn}}) + 0.15(N_{\text{exp}})$$<br>• $S_{\text{rsp}} = \text{Scaled Response Time (100\% if } \le 15\text{m, scaling to 0\% if } > 120\text{m)}$<br>• $S_{\text{sla}} = \% \text{ "Within SLA" in Col 15}$<br>• $V_{\text{io}} = \frac{\% \text{ Yes (Col 61)} + \% \text{ Yes (Col 62)} + \% \text{ "Clear" (Col 63)} + \% \text{ "Clear" (Col 64)}}{4}$<br>• $Q_{\text{trn}} = \% \text{ "Correct" or "Good" in Col 20}$<br>• $N_{\text{exp}} = \% \text{ where Col 58 is "Received on Time"/"Received Late" and Col 59 is "Yes" and Col 60 is "Yes"}$ |
| **Critical Failures Today (Count)** | • **Col 2** (`Test Date`) <br>• **Col 53** (`Answer Scientifically Correct?`) <br>• **Cols 66, 67, 68** (`Weather/Mandi/Scheme` correctness) <br>• **Cols 69, 70** (`Question/Answer Saved in DB?`) <br>• **Col 71** (`Q-ID Consistent Across Systems?`) <br>• **Col 74** (`Defect Severity`) | Count of rows matching selected day where:<br>• Col 53 is `"Incorrect"` OR<br>• Col 66/67/68 is `"No"` OR<br>• Col 69/70 is `"Not Saved"` OR<br>• Col 71 is `"Wrongly Identified as Duplicate"` OR<br>• Col 74 is `"Critical"` |
| **Release Health (%)** | • **Col 73** (`Overall Test Status`) <br>• **Col 74** (`Defect Severity`) <br>• **Cols 69, 70, 71** (`DB Saves & Q-ID Consistency`) | Pass rate minus critical defects and data integrity failures:<br>$$\text{Release Health \%} = \left(\frac{\text{Total Passed Tests}}{\text{Total Tests Executed}} \times 100\right) - \text{Count(Critical Defects)} - \text{Count(Data Integrity Failures)}$$<br>• $\text{Pass Rate} = \% \text{ "Pass" in Col 73}$<br>• $\text{Critical Defects} = \text{Count where Col 74 is "Critical"}$<br>• $\text{Data Integrity Failures} = \text{Count where Col 69/70 is "Not Saved" or Col 71 is "Wrongly Identified as Duplicate"}$ |

---

### 🔍 3. Row 2: Optimization, Diagnostics & Defect Tracking
These panels provide deeper debugging and diagnostic capability for developers:

*   **Biggest Bottleneck (Stage & Time):**
    *   *Parameters:* **Col 27** (`Author TAT`), **Cols 31, 35, 39, 43, 47** (`Reviewer 1-5 TAT`), and **Col 51** (`Moderator TAT`).
    *   *Display:* The name of the process stage with the highest average duration, displaying its time in `HH:MM:SS`.
*   **Weakest Module (Topic):**
    *   *Parameters:* **Col 11** (`Question Category`) grouped by correctness flags.
    *   *Display:* The category name that scored the lowest scientific accuracy or longest average response time.
*   **Open Critical Defects List:**
    *   *Parameters:* **Col 74** (`Defect Severity` = `"Critical"`) and **Col 75** (`Defect ID / Bug Ref Zoho Desk Ticketing`).
    *   *Display:* A table listing active Zoho Desk ticket links for critical bugs.

---

### 📈 4. Row 3: Historical Trend Charts
Interactive line charts plotting performance across dates or sprint cycles:
*   **Accuracy Trends:** Plotting *ACE Trust Score* against **Col 2 (`Test Date`)**.
*   **Latency Trends:** Plotting *Avg Response Time* against **Col 2 (`Test Date`)**.
*   **Defect Volume:** Plotting *Critical Defect Count* against **Col 6 (`Sprint / Cycle`)**.

Based on the **81 columns** available in the dataset, we can derive several advanced, high-value insights to add to the dashboard to make it more actionable for management and developers:

---

### 1. 👥 Actor Performance & Workload Analytics (Leaderboards)
Since the dataset tracks the names and times of Testers, Authors, Reviewers, and Moderators, the dashboard can show:
*   **Author Throughput & Quality:** A leaderboard of Authors (**Col 24**) showing their average writing speed (**Col 27**) and the percentage of their answers that moderator's pass as `"Correct"` (**Col 53**).
*   **Reviewer Efficiency:** A chart plotting Reviewer throughput and average review speed (**Cols 31, 35, 39**). This identifies if specific reviewers are overloaded or holding up the queue.
*   **Moderator Workload:** A breakdown of how many questions each moderator (**Col 48**) is resolving, and their average decision time.

### 2. ⏳ Cumulative TAT Stacked Breakdown (Phase Bottlenecks)
Instead of just displaying the "longest" average bottleneck, the dashboard can show a **Stacked Bar Chart** representing the lifecycle of delayed questions:
*   For each delayed question, the chart displays how much time it spent in each phase:
    $$\text{Total Latency} = \text{Authoring (Col 27)} + \text{Reviewing (Col 31+35+39)} + \text{Moderation (Col 51)}$$
*   *Value:* Developers can instantly see if a delay was due to an author taking too long to write, or a reviewer taking too long to sign off.

### 3. 🌐 Localization & Translation Health
Localization is key to farmer engagement. The dashboard can track:
*   **Language-Specific TATs:** Compare response speeds (**Col 14**) across languages (**Col 8**). If Telugu or Bengali questions take significantly longer, it signals a shortage of regional experts.
*   **Translation Error Distribution:** A pie chart showing the breakdown of *Translation Error Types* (**Col 21**) (e.g., % of `"Kannada Translation Issue"`, % of `"English-Hindi Inversion"`). This directly helps the engineering team tune the LLM translation layer.

### 4. 🔀 SLA Breach Correlation Matrix
A diagnostic grid showing which factors correlate most with **SLA Breaches** (**Col 15**):
*   *Channel Breach Rate:* Compare SLA breach percentage on WhatsApp vs. Web App (**Col 7**).
*   *Category Breach Rate:* Which Crop Categories (**Col 11**) breach the 2-hour SLA most often (e.g. maybe "Plant Protection" is highly accurate but suffers from heavy delays).

### 5. 🗣️ Voice Mechanics & Audio Diagnostics
Since the dataset tracks both input/output status and detailed quality descriptions:
*   **Voice Quality Failures:** A breakdown of *Voice Issue Descriptions* (**Col 65**) and *Output Quality* (**Col 64**) showing the percentages of `"Low Volume"`, `"Distorted"`, or `"No Output"` errors.
*   *Value:* Helps the audio engineering team debug the Text-to-Speech (TTS) and Speech-to-Text (STT) services.

### 6. 📝 Crop & Topic Interest (Word Cloud / Text Analytics)
*   By running simple keyword extraction on **Col 10 (`Query Text`)**, the dashboard can display a **Topic Word Cloud** showing the most frequently discussed crops (e.g., *Chilli*, *Ash Gourd*, *Cotton*, *Rice*) and problems (*wilt*, *caterpillars*, *rain*, *fertilizer*).
*   *Value:* Gives management real-time insight into what farmers are currently struggling with in the field.