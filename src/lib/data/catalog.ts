export const RELEASE = {
  name: "Aegis Atlas",
  code: "2026.1",
  vintage: "2025",
  events: 32_000,
  sample: 750,
  facilities: 8,
  wards: 10,
  columns: 22,
  incidentRate: 5.87,
  file: "/data/medication_admin_safety_full.csv",
  sampleFile: "/data/medication_admin_safety_SAMPLE.csv",
} as const;

export type TierId = "sample" | "personal" | "commercial";
export type PaidTierId = "personal" | "commercial";

export const TIERS = [
  {
    id: "sample" as const,
    name: "Sample",
    price: "Free",
    amount: 0,
    cadence: "Keep it",
    size: "750 events",
    blurb: "CSV of 750 events, dictionary, SQL, and 15 questions. Evaluation only.",
    featured: false,
    includes: ["CSV of 750 events", "Data dictionary", "SQL + 15 questions", "Evaluation use only"],
  },
  {
    id: "personal" as const,
    name: "The file",
    price: "$29",
    amount: 29,
    cadence: "One-time",
    size: "32,000 events",
    blurb: "Full 32k-event CSV. Personal, teaching, and research. Yours to keep.",
    featured: true,
    includes: [
      "Full 32k-event CSV",
      "Dictionary, SQL, methods note",
      "Personal, teaching, and research",
      "Yours to keep — no subscription",
    ],
  },
  {
    id: "commercial" as const,
    name: "Commercial",
    price: "$99",
    amount: 99,
    cadence: "One-time",
    size: "32,000 events",
    blurb: "Use in a shipped product. One legal entity. Do not wrap and resell the raw file.",
    featured: false,
    includes: [
      "Everything in The file",
      "Use in a shipped product",
      "One legal entity, unlimited seats",
      "Do not wrap and resell the raw file",
    ],
  },
] as const;

export const FEATURED_TIER = TIERS.find((t) => t.featured)!;
export const COMMERCIAL_TIER = TIERS.find((t) => t.id === "commercial")!;

export const FIELDS = [
  { name: "event_id", type: "string", note: "Unique fictional event id" },
  { name: "facility_id", type: "string", note: "FAC-001 to FAC-008" },
  { name: "ward_unit", type: "string", note: "10 ward / unit types" },
  { name: "shift_date", type: "date", note: "2025-01-01 to 2025-12-30" },
  { name: "day_of_week", type: "string", note: "Calendar day" },
  { name: "shift_type", type: "string", note: "Day / Evening / Night" },
  { name: "scheduled_time", type: "time", note: "Scheduled administration" },
  { name: "time_variance_minutes", type: "int", note: "Early negative, late positive" },
  { name: "staff_role", type: "string", note: "RN / EN / AIN / pharmacist" },
  { name: "staff_years_experience", type: "float", note: "Synthetic years" },
  { name: "staffing_ratio_patients_per_nurse", type: "float", note: "Patients per nurse" },
  { name: "medication_name", type: "string", note: "Generic name" },
  { name: "medication_class", type: "string", note: "Pharmacological class" },
  { name: "high_risk_medication", type: "enum", note: "Yes / No" },
  { name: "route_prescribed", type: "string", note: "Prescribed route" },
  { name: "route_administered", type: "string", note: "Actual route" },
  { name: "dose_prescribed_mg", type: "float", note: "Prescribed dose" },
  { name: "dose_administered_mg", type: "float", note: "Administered dose" },
  { name: "event_type", type: "string", note: "Prescribed / near-miss / error" },
  { name: "severity", type: "string", note: "None through severe" },
  { name: "contributing_factor", type: "string", note: "Primary modelled factor" },
  { name: "incident_reported", type: "enum", note: "Yes / No / not applicable" },
] as const;

export const USE_CASES = [
  { title: "SQL practice", body: "Fifteen questions with working queries against a single 32k-row table." },
  { title: "Dashboard mock-ups", body: "Shift, staffing, and high-risk flags already in the grain you would chart." },
  { title: "Classifier homework", body: "Imbalanced labels (~5.87% incidents) without touching a real incident log." },
  { title: "Vendor demos", body: "Ship a medication-safety screen with realistic columns and no PHI review." },
];
