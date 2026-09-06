import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInt(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPct(n: number, digits = 2) {
  return `${n.toFixed(digits)}%`;
}
