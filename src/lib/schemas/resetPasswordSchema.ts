import { z } from 'zod';

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine( data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'] //where to show
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export type ResetPasswordFields = keyof ResetPasswordSchema;