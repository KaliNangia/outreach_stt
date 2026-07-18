# Public Assets

This directory contains the frontend files served by the Express backend at `http://localhost:3000`.

---

## Files

### `index.html` - Dashboard HTML Structure

**Purpose:** Main HTML page with the dashboard layout.

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Header: Title + CSV Upload + Status                 │
├─────────────────────────────────────────────────────┤
│ Filters Row: 10 dropdown selectors                 │
├─────────────┬─────────────┬─────────────┬───────────┤
│ ACE Trust   │ Farmer Exp  │ Critical    │ Release   │
│ Score       │ Score       │ Failures    │ Health    │
├─────────────┴─────────────┴─────────────┴───────────┤
│ Diagnostics: Bottleneck | Weakest Module | Defects  │
├─────────────────────────────────────────────────────┤
│ Charts: Trust/Exp | Latency | Defect Volume        │
└─────────────────────────────────────────────────────┘
```

**Key Elements:**
- `#upload-status` - Displays loaded record count
- `#csv-upload` - File input for CSV upload
- `#toggle-clean-data` - Exclude Failures toggle
- `#kpi-trust-score`, `#kpi-experience-score`, etc. - KPI value displays
- `#chart-scores`, `#chart-latency`, `#chart-defects` - Chart canvases
- `#tat-bars-container` - Bottleneck visualization bars
- `#critical-tickets-list` - Zoho Desk ticket links

---

### `app.js` - Frontend Logic & KPI Calculations

**Purpose:** All client-side JavaScript for data fetching, filtering, KPI calculations, and chart rendering.

**Global Variables:**
```javascript
let allRecords = [];        // All records from API
let chartScores = null;     // Chart.js instance for scores
let chartLatency = null;    // Chart.js instance for latency
let chartDefects = null;    // Chart.js instance for defects
```

**Key Functions:**

#### Data Fetching
```javascript
async function fetchData()
```
- Calls `GET /api/data`
- Stores records in `allRecords`
- Initializes filters and updates dashboard

#### Filter System
```javascript
function initializeFilters()
```
- Populates 9 dropdown filters from unique values in data
- Filters: Build, Sprint, Channel, Language, Category, Tester, Type, Status, Severity
- Excludes empty, NA, NIL values

#### Dashboard Update
```javascript
function updateDashboard()
```
- Main calculation function (called on any filter change)
- Applies all active filters to `allRecords`
- Computes 4 KPI scores
- Runs 3 diagnostic analyses
- Updates DOM elements
- Calls `renderCharts()`

#### KPI Calculations (Exact Implementation)

**ACE Trust Score:**
```javascript
const trustScore = Math.round(
  (0.40 * A_sci) + (0.20 * A_dom) + (0.10 * S_lnk) + 
  (0.10 * E_exp) + (0.10 * Q_trn) + (0.10 * C_chn)
);
```

**Farmer Experience Score:**
```javascript
const experienceScore = Math.round(
  (0.30 * S_rsp) + (0.20 * S_sla) + (0.20 * V_io) + 
  (0.15 * Q_trn) + (0.15 * N_exp)
);
```

**Response Speed (S_rsp):**
```javascript
// Per-row scoring:
if (mins <= 15) score = 100;
else if (mins > 120) score = 0;
else score = 100 - ((mins - 15) / (120 - 15)) * 100;
// Average across all valid rows
```

#### Chart Rendering
```javascript
function renderCharts(records)
```
- Aggregates data by date for line charts
- Aggregates by sprint for bar chart
- Uses Chart.js for visualization

#### Time Parser
```javascript
function timeToMinutes(timeStr)
```
- Different from Python version
- Returns fractional minutes (includes seconds as decimal)
- Handles: numeric, HH:MM:SS, MM:SS formats

#### Exclude Failures Toggle
```javascript
// When toggle is ON, filters out:
// - Question Saved in DB? = "Not Saved"
// - Answer Saved in DB? = "Not Saved"
// - Q-ID Consistent? = "Wrongly Identified as Duplicate"
// - Defect Severity = "Critical"
```

---

### `style.css` - Dashboard Styling

**Purpose:** CSS styling for the dashboard UI.

**Design System:**
- **Font:** Inter (Google Fonts)
- **Colors:** 
  - Primary: `#4f46e5` (Indigo)
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Amber)
  - Danger: `#ef4444` (Red)
- **Border Radius:** 12px for cards
- **Shadows:** Subtle box shadows for depth

**Layout:**
- CSS Grid for main layout
- Flexbox for filter rows
- Responsive breakpoints for mobile

---

## Frontend Dependencies

Loaded via CDN in `index.html`:
- **Chart.js** - For line and bar charts
- **Google Fonts (Inter)** - Typography

No build step required. Files are served as-is by Express.

---

## API Communication

The frontend communicates with the backend via:

| Action | Method | Endpoint | Data |
|--------|--------|----------|------|
| Load data | GET | `/api/data` | `{ success, totalRecords, records }` |
| Upload CSV | POST | `/api/upload` | `multipart/form-data` with `file` field |

---

## Development Notes

1. **Hardcoded Date:** `app.js` line 166 uses `new Date('2026-07-15')` as "now" baseline. Change for production.

2. **Column Name Typo:** References `Respo nse Time (mins) [Auto]` with space inside "Response".

3. **No State Management:** All state is in global variables. Consider Redux/Vue for scaling.

4. **Chart.js Version:** Using Chart.js via CDN. Pin version for stability.
