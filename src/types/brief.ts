import { z } from "zod";

export const SERVICE_OPTIONS = [
  "Product Shoot",
  "Ad Editing",
  "Full-Stack Website",
  "Landing Page",
  "Other",
] as const;

export const BUDGET_RANGES = [
  "$4,500 - $7,500",
  "$7,500 - $15,000",
  "$15,000 - $30,000",
  "$30,000+",
  "Undecided / Flexible",
] as const;

export const TIMELINE_OPTIONS = [
  "Within 2 weeks (Rush)",
  "Within 1 month",
  "1 to 2 months",
  "3+ months / Flexible",
] as const;

export const HEARD_ABOUT_OPTIONS = [
  "Google / Search",
  "Instagram",
  "Twitter / X",
  "LinkedIn",
  "Client Referral",
  "Other",
] as const;

export const briefFormSchema = z.object({
  // Step 1: About You
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional(),
  companyName: z.string().min(1, "Company or brand name is required"),
  websiteOrSocial: z.string().optional(),

  // Step 2: Your Project
  services: z.array(z.string()).min(1, "Please select at least one service needed"),
  projectDescription: z
    .string()
    .min(20, "Please describe your project in at least 20 characters")
    .max(2000, "Description must be within 2000 characters"),
  deliverablesCount: z.string().optional(),
  referenceLinks: z.string().optional(),

  // Step 3: Logistics
  budgetRange: z.string().min(1, "Please select your budget range"),
  timeline: z.string().min(1, "Please select your target timeline"),
  heardAboutUs: z.string().optional(),
  consentAgreed: z.boolean().refine((val) => val === true, {
    message: "You must consent to receiving our response regarding your project",
  }),

  // Honeypot spam trap (must be left empty by legitimate users)
  botCheckField: z.string().optional(),
});

export type BriefFormData = z.infer<typeof briefFormSchema>;

export interface BriefApiResponse {
  success: boolean;
  message: string;
  error?: string;
}
