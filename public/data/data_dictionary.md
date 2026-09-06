# Data Dictionary — Medication Administration & Near-Miss Safety Dataset

File: `medication_admin_safety_full.csv` (32,000 rows, 22 columns)
Free preview: `medication_admin_safety_SAMPLE.csv` (750 rows)

| Column | Type | Description |
|---|---|---|
| event_id | string | Unique identifier for the medication administration event (fictional). |
| facility_id | string | Fictional hospital facility code (FAC-001 to FAC-008). |
| ward_unit | string | Ward or unit type (e.g., ICU, Medical Ward A, Forensic Mental Health Unit). |
| shift_date | date (YYYY-MM-DD) | Calendar date of the shift. |
| day_of_week | string | Day of week corresponding to shift_date. |
| shift_type | string | Day / Evening / Night. |
| scheduled_time | string (HH:MM) | Scheduled administration time for the medication. |
| time_variance_minutes | integer | Minutes between scheduled and actual administration (negative = early, positive = late). |
| staff_role | string | Registered Nurse / Enrolled Nurse / Assistant in Nursing / Clinical Pharmacist (fictional staff). |
| staff_years_experience | float | Years of clinical experience of the administering staff member (fictional, synthetic distribution). |
| staffing_ratio_patients_per_nurse | float | Patients-per-nurse ratio on the ward at time of administration. |
| medication_name | string | Generic medication name (real generic drug names used for realism; not linked to any real prescription or patient). |
| medication_class | string | Pharmacological class of the medication. |
| high_risk_medication | string (Yes/No) | Flag for medications commonly classified as higher-risk / narrow therapeutic index. |
| route_prescribed | string | Prescribed administration route (Oral, IV, IM, Subcutaneous, Sublingual, Topical, PR). |
| route_administered | string | Actual administration route. |
| dose_prescribed_mg | float | Prescribed dose (synthetic units, mg-equivalent). |
| dose_administered_mg | float | Actual administered dose (synthetic units, mg-equivalent). |
| event_type | string | Administered as prescribed / one of several near-miss or error categories. |
| severity | string | Severity coding where applicable (None, None (intercepted), Minor, Moderate, Severe). |
| contributing_factor | string | Primary contributing factor identified for near-miss/error events. |
| incident_reported | string (Yes/No/N/A) | Whether the event was formally reported (N/A where no event occurred). |

**Categorical value lists**

- `shift_type`: Day, Evening, Night
- `staff_role`: Registered Nurse, Enrolled Nurse, Assistant in Nursing, Clinical Pharmacist
- `event_type`: Administered as prescribed; Near-miss: wrong time; Near-miss: wrong dose; Near-miss: wrong route; Near-miss: omitted dose; Near-miss: wrong patient (caught); Error reached patient: minor harm; Error reached patient: no harm
- `severity`: Not applicable (administered as prescribed), None (intercepted), Minor, Moderate, Severe
- `incident_reported`: Yes, No, Not applicable (administered as prescribed)

**Data-quality note:** as of v1.0, `severity` and `incident_reported` use the explicit value
`"Not applicable (administered as prescribed)"` rather than `"None"`/`"N/A"` for non-event
rows, because those shorter strings are silently read as missing data (`NaN`) by default in
pandas and similar tools. See `QA_AUDIT_REPORT.md` for detail.
