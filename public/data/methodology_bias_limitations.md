# Methodology, Bias Statement & Known Limitations
## Medication Administration & Near-Miss Safety Dataset

## Generation Methodology

This dataset is **fully synthetic ("born synthetic")**. It was generated programmatically
from a designed statistical model — it was not sampled, seeded, transformed, or derived from
any real patient record, real staff record, or real hospital's operational data. No real
individual's information was used at any stage.

The generation logic encodes clinically-informed relationships between variables rather than
producing independent random values for every field. Specifically:

- Near-miss/error probability increases with higher patient-to-nurse staffing ratios, lower
  staff experience, night shift, and high-risk medication classes.
- Severity of error events is weighted higher for high-risk medications.
- Contributing factors (interruption, workload, look-alike/sound-alike medications, etc.) are
  drawn from a distribution informed by publicly documented medication-safety incident
  reporting literature, not from any specific institution's real incident data.
- Real generic medication names and drug classes are used for realism (these are public
  pharmacological facts, not linked to any patient or prescription).

The design was specified by a Registered Nurse with forensic/clinical nursing background to
ensure the relationships between variables are directionally realistic, even though exact
rates and distributions are illustrative rather than epidemiologically validated.

## Bias & Representativeness Statement

- This dataset represents a **modelled approximation** of medication administration patterns,
  not a statistically validated sample of any real health system.
- Facility, ward, and staff identifiers are entirely fictional and do not correspond to any
  real hospital, unit, or individual.
- The dataset is generated for a single hypothetical multi-facility group and should not be
  assumed to reflect national, state, or jurisdiction-specific incident rates.
- Near-miss and error rates in this dataset (approx. 5-6% of events) are intentionally
  elevated relative to some published clinical benchmarks, to ensure the dataset contains a
  usable volume of positive/error-class examples for testing, training, and analytics
  purposes. This is a deliberate design choice for usability, not a claim about real-world
  incidence.
- Distributions of staff experience, staffing ratios, and ward types are illustrative and
  should not be used to draw conclusions about real healthcare workforce conditions.

## Known Limitations

- Does not model multi-event chains for a single patient (each row is an independent event;
  there is no persistent synthetic patient history linking events).
- Does not include free-text clinical notes — all fields are structured/categorical or numeric.
- Contributing factors are single-selected per event; real incidents often involve multiple
  concurrent contributing factors.
- Time-of-day and seasonal patterns are simplified and do not model specific known events
  (e.g., public holidays, flu season surges).
- This dataset has not been reviewed or validated by any health service, safety and quality
  body, or regulator. It is a synthetic modelling exercise only.

## README — Licensing & Permitted Use

**Permitted use:** This dataset is licensed for research, software testing, analytics
development, and AI/ML model training and evaluation purposes only.

**Not permitted:** This dataset must **not** be used, represented, or relied upon for real
clinical decision-making, real patient safety investigations, or as a substitute for
validated real-world medication safety data. It is not certified, validated, or endorsed by
any health authority.

**Data privacy:** No real individuals are represented in this dataset. All identifiers
(facility, staff, event IDs) are synthetic and randomly generated.

**Format:** CSV (UTF-8, comma-delimited).

**Contact:** consultant@nixsec.co.site
