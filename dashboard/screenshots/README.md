# Screenshots

This directory contains dashboard screenshots for documentation and presentation purposes.

---

## Files

| File | Description | Page |
|------|-------------|------|
| `kpi_page_1.png` | Main dashboard view with all KPI cards | Page 1 |
| `kpi_page_2.png` | Dashboard with filters applied | Page 2 |
| `kpi_page_3.png` | Charts and trend visualizations | Page 3 |
| `kpi_page_4.png` | Diagnostics and defect tracking | Page 4 |

---

## Usage

### In Documentation

Reference screenshots in markdown files:
```markdown
![Dashboard Overview](screenshots/kpi_page_1.png)
```

### In Presentations

Copy screenshots to presentation software:
```bash
cp screenshots/*.png ~/Desktop/presentation/
```

### Taking New Screenshots

1. Start the dashboard: `node src/server.js`
2. Open browser: `http://localhost:3000`
3. Take screenshot using:
   - **macOS:** `Cmd + Shift + 4`
   - **Windows:** `Snipping Tool`
   - **Linux:** `gnome-screenshot`
4. Save to this directory with descriptive name

---

## Naming Convention

Use format: `kpi_page_N.png` where N is the page/section number.

For new screenshots, use descriptive names:
- `dashboard_overview.png`
- `filter_demo.png`
- `chart_trust_trend.png`
- `diagnostics_bottleneck.png`

---

## Image Specifications

- **Format:** PNG
- **Resolution:** At least 1920×1080 for clarity
- **Content:** Show full dashboard section
- **Annotations:** Add arrows/highlights in documentation, not in images

---

## Current Screenshots

The existing screenshots show:
1. **kpi_page_1.png** - Default view with all 4 KPI cards visible
2. **kpi_page_2.png** - View with specific filters applied
3. **kpi_page_3.png** - Charts section with trend data
4. **kpi_page_4.png** - Diagnostics panels and defect list
