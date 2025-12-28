import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateRange = (window: { start: string, end: string }) => {
  if (!window || !window.start) return "TBD";
  const s = new Date(window.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const e = new Date(window.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${s} - ${e}`;
};