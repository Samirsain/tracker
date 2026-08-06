import { z } from "zod";

export const campaignSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(["SCIENCE", "ATHLETE", "LIFESTYLE", "LAUNCH", "SEASONAL"]).default("LAUNCH"),
  budget: z.coerce.number().min(0).default(0),
  objective: z.string().optional().or(z.literal("")),
  expectedReach: z.coerce.number().min(0).optional(),
  expectedSales: z.coerce.number().min(0).optional(),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"]),
  creatorIds: z.array(z.string()).optional(),
});

export type CampaignInput = z.infer<typeof campaignSchema>;
export type CampaignFormInput = z.input<typeof campaignSchema>;
