// lib/utils.ts
import { twMerge } from "tailwind-merge";

/**
 * Conditionally join Tailwind classes.
 */
export function cn(...inputs: Array<string | undefined | null | boolean>) {
  return twMerge(
    inputs
      .filter(Boolean)
      .map(String)
      .join(" ")
  );
}
