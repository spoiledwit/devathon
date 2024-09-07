import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toReadableDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function capitalizeFirstLetter(text: string | undefined) {
  return text?.charAt(0).toUpperCase() + text!.slice(1);
}

export function countDaysBetween(startDate: Date, endDate: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const differenceInTime = endDate.getTime() - startDate.getTime();
  const differenceInDays = Math.round(differenceInTime / oneDay);
  return differenceInDays;
}
