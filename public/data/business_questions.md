# Business Questions — Medication Administration & Near-Miss Safety

*Product-use disclaimer: this dataset is 100% synthetic. Questions and analyses below are for
learning, portfolio, and testing purposes only — not real clinical or safety findings.*

## Beginner

1. **[Excel]** What proportion of events fall into each `event_type`? Build a pivot table and
   a pie/bar chart of the split.
2. **[SQL]** How many total medication administration events are recorded per `facility_id`?
   A simple `GROUP BY` and `COUNT(*)`.
3. **[Python]** What is the average `staff_years_experience` by `staff_role`? A `groupby().mean()`
   summary table.
4. **[Excel]** Which `medication_class` appears most frequently in the dataset? A `COUNTIF` or
   pivot table ranking.
5. **[Power BI/Tableau]** Build a simple bar chart of event count by `shift_type` (Day/Evening/
   Night).

## Intermediate

6. **[SQL]** Which shifts have the highest modelled near-miss/error rate (i.e., `event_type` <>
   'Administered as prescribed')? A `GROUP BY shift_type` with a computed rate column.
7. **[Python]** How does the incident rate vary by staff experience band (e.g., <1yr, 1-3yr,
   3-10yr, 10yr+)? Bucket `staff_years_experience` with `pd.cut()` then compare rates.
8. **[Power BI/Tableau]** Which error types (`event_type`) are most common? A ranked bar chart
   excluding "Administered as prescribed".
9. **[SQL]** How does `high_risk_medication` relate to event severity? A `GROUP BY
   high_risk_medication, severity` cross-tab query.
10. **[Python]** Which simulated `ward_unit` values show the highest incident rate? A
    `groupby('ward_unit')` rate comparison, sorted descending.

## Advanced

11. **[Python]** Build a `staffing_ratio_patients_per_nurse` vs. near-miss-rate scatter/binned
    chart — does the modelled relationship hold across every `shift_type` or only some?
12. **[SQL]** Write a query using a `CASE WHEN` to bucket `time_variance_minutes` into "early",
    "on time", and "late", then compare the near-miss rate across buckets.
13. **[Power BI/Tableau]** Build a small multi-panel dashboard: incident rate by shift x staff
    role, with a drill-through to `contributing_factor` breakdown.
14. **[ML/analytics practice]** Using only the pre-event fields (shift, staff experience,
    staffing ratio, medication class, high-risk flag — never the outcome fields), build a
    simple, clearly-labelled educational classifier predicting whether an event is a
    near-miss/error. Report precision/recall, not just accuracy, given the class imbalance.
15. **[Python]** Compare `contributing_factor` distributions between "Near-miss" events and
    "Error reached patient" events — is any factor disproportionately associated with harm
    reaching the patient in the simulated data?
