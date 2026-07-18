# Documentation

This directory contains all project documentation, reference materials, and analysis reports.

---

## Documentation Index

### Core Reference

| File | Description | When to Use |
|------|-------------|-------------|
| **REPLICATION_GUIDE.md** | Complete replication instructions | When setting up the project from scratch |
| **master_technical_blueprint.md** | Architecture, data flow, and KPI formulas | When understanding system design |
| **plan.md** | KPI mapping specification (81 columns → dashboard) | When modifying dashboard metrics |

### Analysis Reports

| File | Description | When to Use |
|------|-------------|-------------|
| **column_analysis.md** | Column-by-column audit of all 81 columns | When understanding data fields |
| **dataset_comparison.md** | Raw vs clean dataset KPI comparison | When evaluating cleaning impact |
| **info.md** | QA analysis report and diagnostics | When reviewing test results |
| **diif.md** | Row-by-row diff log of all standardizations | When auditing specific changes |
| **report.md** | Final standardization pass report | When reviewing cleaning rules |

### Reference PDFs

| File | Description |
|------|-------------|
| **KPI_Formula.pdf** | Visual reference for KPI calculations |
| **cleaning_and_standardization_log.pdf** | Detailed cleaning audit trail |
| **Tester Data Dashboard requirements.pdf** | Original requirements specification |

---

## Document Details

### REPLICATION_GUIDE.md

The most comprehensive document. Contains:
- Full 81-column schema
- Python normalization pipeline (all functions)
- Backend server configuration
- Frontend KPI formulas (exact implementation)
- Python vs Frontend discrepancies
- Step-by-step replication instructions
- Known issues and gotchas

**Start here** if you need to duplicate the system.

---

### master_technical_blueprint.md

Technical architecture document with:
- Mermaid data flow diagram
- Structural repair documentation (TL-2477, TL-5222)
- Mathematical formulas for all KPIs
- Code implementation snippets
- Stage bottleneck calculation logic

---

### plan.md

KPI mapping specification:
- 10 filter dropdowns and their column mappings
- 4 executive KPI cards with formulas
- 3 diagnostic panels
- 3 trend charts
- Advanced analytics opportunities

---

### column_analysis.md

Detailed audit of all 81 columns:
- Data type and format
- Null handling rules
- Value distributions
- KPI relevance
- Cleaning requirements

---

### dataset_comparison.md

Side-by-side comparison:
- Raw dataset (5,110 rows) vs Clean (909 rows)
- KPI score changes
- Selection bias analysis
- Data integrity failure explanation

---

### diif.md

Row-by-row change log:
- Every standardization applied
- Before/after values
- Test IDs affected
- Change categories

---

### report.md

Final standardization report:
- Name column changes (2,858+ rows)
- Date/time standardization (16 columns)
- Binary column cleanup (19 columns)
- Multi-class column cleanup (19 columns)
- TAT column standardization (8 columns)

---

## PDF Reference Documents

### KPI_Formula.pdf
Visual reference showing:
- Trust Score component weights
- FX Score component weights
- Response Speed scaling curve
- Release Health formula

### cleaning_and_standardization_log.pdf
Complete audit trail of:
- All cleaning rules applied
- Row counts affected
- Before/after examples

### Tester Data Dashboard requirements.pdf
Original requirements:
- Dashboard layout specification
- KPI definitions
- Filter requirements
- Chart types

---

## Reading Order

For new team members:
1. Start with root `README.md` for overview
2. Read `REPLICATION_GUIDE.md` for full understanding
3. Reference `master_technical_blueprint.md` for formulas
4. Use `column_analysis.md` for data questions

For debugging:
1. Check `dataset_comparison.md` for expected values
2. Review `diif.md` for specific changes
3. Consult `report.md` for cleaning rules

---

## Documentation Standards

All markdown files follow:
- GitHub Flavored Markdown
- Mermaid diagrams where applicable
- Code blocks with syntax highlighting
- Tables for structured data
- Emoji prefixes for section headers (optional)
