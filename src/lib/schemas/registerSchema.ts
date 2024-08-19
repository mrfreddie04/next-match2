import { z } from "zod";
import { calculateAge, isValidDate } from "../utils";

export const userDetailsSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),

});

export const profileSchema = z.object({
  gender: z.enum(["male", "female"]),
  description: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  dateOfBirth: z.string().min(1, {
    message: "Date of birth is required"
  }).refine((dateStr:string) => {
    if(!isValidDate(dateStr)) return false;
    const age = calculateAge(new Date(dateStr));
    return age >= 18; //return true if valid
  }, {
    message: "You must be at least 18 to use this app"
  })  
});

export type RegisterSchema = z.infer<typeof userDetailsSchema & typeof profileSchema>;

export type ProfileSchema = z.infer<typeof profileSchema>;

//combine schema objects 
export const registerSchema = userDetailsSchema.and(profileSchema);

export type RegisterFields = keyof RegisterSchema;
