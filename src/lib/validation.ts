import { z } from "zod";

// Shared validation schemas used by both client forms and API routes.

export const signupSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .regex(/^[+]?[\d\s()-]{7,20}$/, "Please enter a valid phone number"),
  email: z.union([z.string().trim().email("Please enter a valid email address"), z.literal("")]).optional(),
  message: z.string().trim().min(5, "Please describe the job (min 5 characters)").max(2000),
  service: z.string().trim().max(100).optional(),
  postcode: z.string().trim().min(3, "Please enter the project postcode").max(12, "Please enter a valid postcode"),
  propertyType: z.string().trim().max(100).optional(),
  timeline: z.string().trim().max(100).optional(),
  budget: z.string().trim().max(100).optional(),
  preferredContact: z.string().trim().max(100).optional(),
  website: z.string().max(200).optional(),
});

export const quoteStatusSchema = z.object({
  status: z.enum(["Received", "Reviewing", "Estimate Sent", "Approved", "In Progress", "Completed"]),
  adminNotes: z.string().trim().max(1000, "Notes must be under 1000 characters").optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
