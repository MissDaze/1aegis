import raw from "./stats.json";

export type RateRow = { key: string; n: number; incidents?: number; rate?: number; pct?: number };

type StatsFile = {
  n: number;
  incidentRate: number;
  incidents: number;
  facilities: number;
  wards: number;
  SHIFT_RATES: RateRow[];
  EXP_RATES: RateRow[];
  STAFF_RATES: RateRow[];
  HIGH_RISK_RATES: RateRow[];
  HIGH_RISK_MEDS: RateRow[];
  EVENT_TYPES: RateRow[];
  CF: RateRow[];
};

export const STATS = raw as StatsFile;
export const SHIFT_RATES = STATS.SHIFT_RATES;
export const EXP_RATES = STATS.EXP_RATES;
export const STAFF_RATES = STATS.STAFF_RATES;
export const HIGH_RISK_RATES = STATS.HIGH_RISK_RATES;
export const HIGH_RISK_MEDS = STATS.HIGH_RISK_MEDS;
export const EVENT_TYPES = STATS.EVENT_TYPES;
export const CF = STATS.CF;
