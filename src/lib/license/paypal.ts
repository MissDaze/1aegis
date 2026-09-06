import type { PaidTierId } from "@/lib/data/catalog";

export const PAYPAL_BUSINESS = String(
  import.meta.env.VITE_PAYPAL_EMAIL ?? "Mydaze7@gmail.com",
).trim();
const PENDING_KEY = "aegis-atlas-pending-paypal";

export type PendingPay = {
  tier: PaidTierId;
  email: string;
  contact: string;
  org: string;
};

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function paypalCheckoutAction() {
  return "https://www.paypal.com/cgi-bin/webscr";
}

export function stashPending(p: PendingPay) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(p));
}

export function takePending(): PendingPay | null {
  const raw = sessionStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_KEY);
  try {
    return JSON.parse(raw) as PendingPay;
  } catch {
    return null;
  }
}
