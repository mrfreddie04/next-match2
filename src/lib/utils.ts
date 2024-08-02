import { differenceInYears } from "date-fns";

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function calculateAge(dob: Date) {
  return differenceInYears(new Date(), dob);
}