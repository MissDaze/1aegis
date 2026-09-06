-- ============================================================================
-- SQL Practice Queries — Medication Administration & Near-Miss Safety
-- Synthetic data. For learning/portfolio/testing purposes only.
-- ============================================================================
--
-- LOADING THE DATA (pick one — these are comments, not part of the queries below)
--
-- SQLite (command line):
--   sqlite3 medsafety.db
--   .mode csv
--   .import medication_admin_safety_full.csv medication_admin_safety
--
-- DuckDB (Python):
--   import duckdb
--   duckdb.sql("CREATE TABLE medication_admin_safety AS SELECT * FROM read_csv_auto('medication_admin_safety_full.csv')")
--
-- PostgreSQL (after CREATE TABLE medication_admin_safety with matching columns):
--   \copy medication_admin_safety FROM 'medication_admin_safety_full.csv' WITH (FORMAT csv, HEADER true)
--
-- All queries below use plain ANSI-style SQL and the table name `medication_admin_safety`.
-- ============================================================================

-- 1. [Beginner] Event count per facility
SELECT facility_id, COUNT(*) AS total_events
FROM medication_admin_safety
GROUP BY facility_id
ORDER BY facility_id;

-- 2. [Beginner] Event type distribution
SELECT event_type, COUNT(*) AS event_count,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM medication_admin_safety), 2) AS pct
FROM medication_admin_safety
GROUP BY event_type
ORDER BY event_count DESC;

-- 3. [Beginner] Average staff experience by role
SELECT staff_role, ROUND(AVG(staff_years_experience), 2) AS avg_years_experience
FROM medication_admin_safety
GROUP BY staff_role
ORDER BY avg_years_experience DESC;

-- 4. [Beginner] Most frequent medication class
SELECT medication_class, COUNT(*) AS administrations
FROM medication_admin_safety
GROUP BY medication_class
ORDER BY administrations DESC
LIMIT 5;

-- 5. [Beginner] Event count by shift type
SELECT shift_type, COUNT(*) AS event_count
FROM medication_admin_safety
GROUP BY shift_type
ORDER BY event_count DESC;

-- 6. [Intermediate] Near-miss/error rate by shift type
SELECT shift_type,
       COUNT(*) AS total_events,
       SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) AS incidents,
       ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY shift_type
ORDER BY incident_rate_pct DESC;

-- 7. [Intermediate] Incident rate by staff experience band
SELECT
  CASE
    WHEN staff_years_experience < 1 THEN '<1yr'
    WHEN staff_years_experience < 3 THEN '1-3yr'
    WHEN staff_years_experience < 10 THEN '3-10yr'
    ELSE '10yr+'
  END AS experience_band,
  COUNT(*) AS total_events,
  ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY experience_band
ORDER BY incident_rate_pct DESC;

-- 8. [Intermediate] Most common error/near-miss types (excludes normal administrations)
SELECT event_type, COUNT(*) AS occurrences
FROM medication_admin_safety
WHERE event_type <> 'Administered as prescribed'
GROUP BY event_type
ORDER BY occurrences DESC;

-- 9. [Intermediate] Severity by high-risk medication flag
SELECT high_risk_medication, severity, COUNT(*) AS event_count
FROM medication_admin_safety
GROUP BY high_risk_medication, severity
ORDER BY high_risk_medication, event_count DESC;

-- 10. [Intermediate] Incident rate by ward/unit
SELECT ward_unit,
       COUNT(*) AS total_events,
       ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY ward_unit
ORDER BY incident_rate_pct DESC;

-- 11. [Advanced] Staffing ratio bucketed, vs incident rate
SELECT
  CASE
    WHEN staffing_ratio_patients_per_nurse < 4 THEN 'Under 4:1'
    WHEN staffing_ratio_patients_per_nurse < 6 THEN '4:1 - 6:1'
    WHEN staffing_ratio_patients_per_nurse < 8 THEN '6:1 - 8:1'
    ELSE '8:1 or higher'
  END AS ratio_band,
  COUNT(*) AS total_events,
  ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY ratio_band
ORDER BY ratio_band;

-- 12. [Advanced] Timing variance buckets vs incident rate
SELECT
  CASE
    WHEN time_variance_minutes < -15 THEN 'Early (>15 min)'
    WHEN time_variance_minutes BETWEEN -15 AND 15 THEN 'On time (+/-15 min)'
    ELSE 'Late (>15 min)'
  END AS timing_band,
  COUNT(*) AS total_events,
  ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY timing_band
ORDER BY timing_band;

-- 13. [Advanced] Incident rate by shift x staff role (for a small dashboard drill-through)
SELECT shift_type, staff_role,
       COUNT(*) AS total_events,
       ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY shift_type, staff_role
ORDER BY shift_type, incident_rate_pct DESC;

-- 14. [Advanced] Contributing factor breakdown, incidents only
SELECT contributing_factor, COUNT(*) AS occurrences
FROM medication_admin_safety
WHERE event_type <> 'Administered as prescribed'
GROUP BY contributing_factor
ORDER BY occurrences DESC;

-- 15. [Advanced] Contributing factor: near-miss vs error-reached-patient comparison
SELECT
  contributing_factor,
  SUM(CASE WHEN event_type LIKE 'Near-miss%' THEN 1 ELSE 0 END) AS near_miss_count,
  SUM(CASE WHEN event_type LIKE 'Error reached patient%' THEN 1 ELSE 0 END) AS error_reached_count
FROM medication_admin_safety
WHERE event_type <> 'Administered as prescribed'
GROUP BY contributing_factor
ORDER BY error_reached_count DESC;
