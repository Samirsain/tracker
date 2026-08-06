import { z } from "zod";
import type { Creator } from "@prisma/client";

export const creatorSchema = z.object({
  profileImage: z.string().url().optional().or(z.literal("")),
  name: z.string().min(2, "Name is required"),
  instagramUsername: z.string().optional().or(z.literal("")),
  platform: z.enum(["INSTAGRAM", "YOUTUBE", "TIKTOK", "FACEBOOK", "TWITTER", "LINKEDIN", "OTHER"]),
  niche: z.enum([
    "FITNESS",
    "DOCTOR",
    "NUTRITIONIST",
    "ATHLETE",
    "LIFESTYLE",
    "BEAUTY",
    "COMEDY",
    "FINANCE",
    "TECHNOLOGY",
    "FOOD",
    "FASHION",
    "OTHER",
  ]),
  creatorType: z.enum(["SCIENCE", "PERFORMANCE", "LIFESTYLE", "COMMUNITY", "CELEBRITY"]).default("LIFESTYLE"),
  collaborationCategory: z.enum([
    "BARTER",
    "GIFT_BOX",
    "STORY",
    "REEL",
    "AFFILIATE",
    "AMBASSADOR",
    "SPONSORED",
  ]).default("BARTER"),

  location: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),

  followers: z.coerce.number().min(0).default(0),
  avgReelViews: z.coerce.number().min(0).default(0),
  avgStoryViews: z.coerce.number().min(0).default(0),
  avgLikes: z.coerce.number().min(0).default(0),
  avgComments: z.coerce.number().min(0).default(0),
  engagementRate: z.coerce.number().min(0).max(100).default(0),
  audienceAgeRange: z.string().optional().or(z.literal("")),
  audienceGenderSplit: z.string().optional().or(z.literal("")),
  audienceCountry: z.string().optional().or(z.literal("")),
  audienceCity: z.string().optional().or(z.literal("")),

  storyPrice: z.coerce.number().min(0).optional(),
  reelPrice: z.coerce.number().min(0).optional(),
  postPrice: z.coerce.number().min(0).optional(),
  youtubePrice: z.coerce.number().min(0).optional(),
  packagePrice: z.coerce.number().min(0).optional(),
  monthlyRetainer: z.coerce.number().min(0).optional(),
  productInterested: z.string().optional().or(z.literal("")),
  couponCode: z.string().optional().or(z.literal("")),
  deliverablesCompleted: z.string().optional().or(z.literal("")),
  affiliateAvailable: z.boolean().default(false),
  barterAvailable: z.boolean().default(false),

  managerNotes: z.string().optional().or(z.literal("")),
  previousCollaborations: z.string().optional().or(z.literal("")),
  specialRequirements: z.string().optional().or(z.literal("")),
  contractAttached: z.boolean().default(false),
  mediaKitAttached: z.boolean().default(false),

  relationshipStage: z.enum([
    "PROSPECT",
    "SHORTLISTED",
    "CONTACTED",
    "WAITING_REPLY",
    "INTERESTED",
    "NEGOTIATION",
    "PRODUCT_SENT",
    "CAMPAIGN_LIVE",
    "COMPLETED",
    "AMBASSADOR",
    "INACTIVE",
  ]),
  status: z.enum(["ACTIVE", "PAUSED", "BLACKLISTED"]),
});

export type CreatorInput = z.infer<typeof creatorSchema>;
export type CreatorFormInput = z.input<typeof creatorSchema>;

// Extended creator type that includes PRD fields not yet in generated Prisma types
type CreatorWithPrd = Creator & {
  creatorType?: string;
  collaborationCategory?: string;
  monthlyRetainer?: number | null;
  productInterested?: string | null;
  couponCode?: string | null;
  deliverablesCompleted?: string | null;
};

export function creatorToFormValues(creator: Creator): CreatorInput {
  const c = creator as CreatorWithPrd;
  return {
    profileImage: c.profileImage ?? "",
    name: c.name,
    instagramUsername: c.instagramUsername ?? "",
    platform: c.platform,
    niche: c.niche,
    creatorType: (c.creatorType as CreatorInput["creatorType"]) ?? "LIFESTYLE",
    collaborationCategory: (c.collaborationCategory as CreatorInput["collaborationCategory"]) ?? "BARTER",
    location: c.location ?? "",
    language: c.language ?? "",
    gender: c.gender ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    website: c.website ?? "",
    followers: c.followers,
    avgReelViews: c.avgReelViews,
    avgStoryViews: c.avgStoryViews,
    avgLikes: c.avgLikes,
    avgComments: c.avgComments,
    engagementRate: c.engagementRate,
    audienceAgeRange: c.audienceAgeRange ?? "",
    audienceGenderSplit: c.audienceGenderSplit ?? "",
    audienceCountry: c.audienceCountry ?? "",
    audienceCity: c.audienceCity ?? "",
    storyPrice: c.storyPrice ?? undefined,
    reelPrice: c.reelPrice ?? undefined,
    postPrice: c.postPrice ?? undefined,
    youtubePrice: c.youtubePrice ?? undefined,
    packagePrice: c.packagePrice ?? undefined,
    monthlyRetainer: c.monthlyRetainer ?? undefined,
    productInterested: c.productInterested ?? "",
    couponCode: c.couponCode ?? "",
    deliverablesCompleted: c.deliverablesCompleted ?? "",
    affiliateAvailable: c.affiliateAvailable,
    barterAvailable: c.barterAvailable,
    managerNotes: c.managerNotes ?? "",
    previousCollaborations: c.previousCollaborations ?? "",
    specialRequirements: c.specialRequirements ?? "",
    contractAttached: c.contractAttached,
    mediaKitAttached: c.mediaKitAttached,
    relationshipStage: c.relationshipStage as CreatorInput["relationshipStage"],
    status: c.status,
  };
}
