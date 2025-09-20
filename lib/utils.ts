import { type ClassValue, clsx } from "clsx";
import { formatDate } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublishedDate(dateString: number) {
  return dateString
    ? formatDate(dateString, "MMM dd, yyyy")
    : formatDate(dateString, "MMM dd, yyyy");
}
