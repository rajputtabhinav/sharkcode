import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Legacy function for backwards compatibility
export function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
