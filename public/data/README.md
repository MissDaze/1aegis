# Medication Administration & Near-Miss Safety — Dataset README

## Overview

32,000 synthetic medication administration events across 8 fictional hospital facilities and
10 ward/unit types, spanning 2025-01-01 to 2025-12-30. Each row is one administration event,
modelling the relationship between staffing ratios, staff experience, shift type, and
medication near-miss/error rates. 100% synthetic — see the disclaimer below.

- **Rows:** 32,000 (full) / 750 (sample preview)
- **Columns:** 22
- **Grain:** one row per medication administration event

## Schema summary

Facility/ward context, shift and timing fields, staff role/experience, staffing ratio,
medication name/class, prescribed vs. administered dose and route, event type (near-miss or
error category), severity, contributing factor, and incident-reported flag. Full column list
and types: see `data_dictionary.md`.

## Main modelled relationships (illustrative simulation rules, not real-world evidence)

- Near-miss/error likelihood rises with higher patient-to-nurse staffing ratios, lower staff
  experience, night shift, and high-risk medication classes.
- Error severity is weighted higher for high-risk medications.
- These are modelling choices made to produce a usable, directionally-realistic synthetic
  dataset — not measurements of any real health system.

## Included assets

`data_dictionary.md`, `methodology_bias_limitations.md`, `summary_statistics.md`,
`business_questions.md`, `sql_practice_queries.sql`, `notebooks/01_medication_safety_analysis.ipynb`,
`charts/`.

## Quick-start snippets

**Python:**
```python
import pandas as pd
df = pd.read_csv("medication_admin_safety_full.csv")
df['event_type'].value_counts(normalize=True)
```

**SQL (after loading — see sql_practice_queries.sql):**
```sql
SELECT shift_type, COUNT(*) AS events,
       SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) AS incidents
FROM medication_admin_safety
GROUP BY shift_type;
```

**Power BI / Tableau:** Get Data → Text/CSV → select `medication_admin_safety_full.csv`.

## Limitations

Each row is an independent event (no linked patient history across rows); no free-text
clinical notes; contributing factors are single-selected per event; not reviewed or validated
by any health service or regulator. Full detail: `methodology_bias_limitations.md`.

## ⚠️ Synthetic data disclaimer

100% synthetic. No real patients, staff, or facilities. Not clinically validated. For
research, education, software testing, and AI/ML training/evaluation only — see
`../LICENSE_AND_ACCEPTABLE_USE.md`.

Business questions: `business_questions.md`. Notebook: `notebooks/01_medication_safety_analysis.ipynb`.
