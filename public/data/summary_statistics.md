# Summary Statistics — Medication Administration & Near-Miss Safety Dataset

- Total records: 32,000
- Facilities represented: 8
- Wards/units represented: 10
- Date range: 2025-01-01 to 2025-12-30

## Event type distribution

| event_type                        |   proportion |
|:----------------------------------|-------------:|
| Administered as prescribed        |        94.13 |
| Near-miss: wrong time             |         1.71 |
| Near-miss: wrong dose             |         1.33 |
| Near-miss: omitted dose           |         0.82 |
| Error reached patient: minor harm |         0.65 |
| Near-miss: wrong route            |         0.57 |
| Near-miss: wrong patient (caught) |         0.42 |
| Error reached patient: no harm    |         0.36 |

## Near-miss/error rate by shift type

| shift_type   |   event_type |
|:-------------|-------------:|
| Day          |         5.31 |
| Evening      |         5.61 |
| Night        |         7.12 |

## Near-miss/error rate by staff experience band

| exp_band   |   event_type |
|:-----------|-------------:|
| <1yr       |         6.96 |
| 1-3yr      |         6.08 |
| 3-10yr     |         5.87 |
| 10yr+      |         5.51 |

![Summary charts](charts/summary_charts_overview.png)
