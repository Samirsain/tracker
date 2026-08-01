import { z } from "zod";

export const scoreSchema = z.object({
  creatorId: z.string().min(1),
  audienceFit: z.coerce.number().min(1).max(10),
  trustCredibility: z.coerce.number().min(1).max(10),
  contentQuality: z.coerce.number().min(1).max(10),
  costEfficiency: z.coerce.number().min(1).max(10),
  reach: z.coerce.number().min(1).max(10),
});

export type ScoreInput = z.infer<typeof scoreSchema>;

export const scoringConfigSchema = z.object({
  audienceWeight: z.coerce.number().min(0).max(10),
  trustWeight: z.coerce.number().min(0).max(10),
  contentWeight: z.coerce.number().min(0).max(10),
  costWeight: z.coerce.number().min(0).max(10),
  reachWeight: z.coerce.number().min(0).max(10),
  thresholdAmbassador: z.coerce.number().min(0).max(100),
  thresholdPaidReel: z.coerce.number().min(0).max(100),
  thresholdAffiliate: z.coerce.number().min(0).max(100),
  thresholdBarter: z.coerce.number().min(0).max(100),
});

export type ScoringConfigInput = z.infer<typeof scoringConfigSchema>;
export type ScoringConfigFormInput = z.input<typeof scoringConfigSchema>;
