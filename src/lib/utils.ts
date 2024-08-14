import { differenceInYears, format, formatDistance } from "date-fns";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function calculateAge(dob: Date) {
  return differenceInYears(new Date(), dob);
}

export function formatShortDateTime(date: Date) {
  return format(date, "dd MMM yy h:mm:a");
}

export function timeAgo(date: string) {
  return formatDistance(new Date(date), new Date()) + ' ago';
}

export function handleFormServerErrors<TFieldValues extends FieldValues>(
  errorResponse: {error: string | ZodIssue[]},
  setError: UseFormSetError<TFieldValues>
){ 
  if(Array.isArray(errorResponse.error)) {
    errorResponse.error.forEach( (e: ZodIssue) => {
      const fieldName = e.path.join(".") as Path<TFieldValues>;
      setError(fieldName, {message: e.message});
    });
  } else if(typeof errorResponse.error === "string") {
    setError("root.serverError", {message:errorResponse.error});
  }  
}

export function transformImageUrl(imageUrl?: string | null) {
  if(!imageUrl) return null;
  if(!imageUrl.includes("cloudinary")) return imageUrl;

  const search = '/upload/';
  const transformation = 'c_fill,w_300,h_300,g_faces/';

  // const uploadIndex = imageUrl.indexOf(search) + search.length;
  // return `${imageUrl.slice(0,uploadIndex)}${transformation}${imageUrl.slice(uploadIndex)}`;
  const parts = imageUrl.split(search);
  return parts.join(`${search}${transformation}`);
}

export function truncateString(text?: string | null, num = 50) {
  if(!text) return null;
  if(text.length <= num) return text;
  return text.slice(0, num) + "...";
}

export function createChatId(a: string, b: string) {
  return a <= b ? `${a}-${b}` : `${b}-${a}`;
}