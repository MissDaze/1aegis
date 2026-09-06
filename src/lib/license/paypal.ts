import { create } from "zustand";
import { persist } from "zustand/middleware";
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

type SellerState = {
  merchantEmail: string;
  setMerchantEmail: (email: string) => void;
};

export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export const useSeller = create<SellerState>()(
  persist(
    (set) => ({
      merchantEmail: PAYPAL_BUSINESS,
      setMerchantEmail: (email) => set({ merchantEmail: email.trim() }),
    }),
    {
      name: "aegis-atlas-paypal",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<SellerState>;
        const saved = (p.merchantEmail ?? "").trim();
        return {
          ...current,
          merchantEmail: isEmail(saved) ? saved : PAYPAL_BUSINESS,
        };
      },
    },
  ),
);

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
