import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ✅ Use your backend running port + /api
export const BASE_URL = "http://127.0.0.1:8000/api";
