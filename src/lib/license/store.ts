import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TierId } from "@/lib/data/catalog";

export type { TierId };

export type License = {
  key: string;
  org: string;
  contact: string;
  email: string;
  tier: TierId;
  issuedAt: string;
};

type LicenseState = {
  licenses: License[];
  addLicense: (input: Omit<License, "key" | "issuedAt">) => License;
};

function mintKey(tier: TierId) {
  const n = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AA-${tier.slice(0, 3).toUpperCase()}-${n}`;
}

export const useLicenses = create<LicenseState>()(
  persist(
    (set, get) => ({
      licenses: [],
      addLicense: (input) => {
        const issued: License = {
          ...input,
          key: mintKey(input.tier),
          issuedAt: new Date().toISOString(),
        };
        set({ licenses: [issued, ...get().licenses] });
        return issued;
      },
    }),
    { name: "aegis-atlas-licenses" },
  ),
);

export function isPaidTier(tier: TierId): tier is "personal" | "commercial" {
  return tier === "personal" || tier === "commercial";
}

export function tierName(tier: TierId) {
  if (tier === "commercial") return "Commercial";
  if (tier === "personal") return "The file";
  return "Sample";
}

export function hasPaidUnlock(licenses: License[]) {
  return licenses.some((l) => isPaidTier(l.tier));
}
