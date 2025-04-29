import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with thousands separator (locale-aware)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value)
}
