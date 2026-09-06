import sample from "./sample.json";

export type MedEvent = {
  event_id: string;
  facility_id: string;
  ward_unit: string;
  shift_date: string;
  day_of_week: string;
  shift_type: string;
  scheduled_time: string;
  time_variance_minutes: string;
  staff_role: string;
  staff_years_experience: string;
  staffing_ratio_patients_per_nurse: string;
  medication_name: string;
  medication_class: string;
  high_risk_medication: string;
  route_prescribed: string;
  route_administered: string;
  dose_prescribed_mg: string;
  dose_administered_mg: string;
  event_type: string;
  severity: string;
  contributing_factor: string;
  incident_reported: string;
};

export const PRESCRIBED = "Administered as prescribed";

export function getSampleEvents(): MedEvent[] {
  return sample as MedEvent[];
}

export function isIncident(e: MedEvent) {
  return e.event_type !== PRESCRIBED;
}
