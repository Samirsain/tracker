import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || isNaN(value)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactNumber(value: number | null | undefined) {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function formatPercent(value: number | null | undefined, digits = 1) {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return `${value.toFixed(digits)}%`;
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(d);
}

/**
 * Instagram handles are stored inconsistently — auto-fill saves them with a
 * leading "@", hand-typed ones usually without. Render through this so the "@"
 * appears exactly once either way.
 */
export function handle(username: string | null | undefined) {
  const clean = username?.trim().replace(/^@+/, "");
  return clean ? `@${clean}` : "";
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
