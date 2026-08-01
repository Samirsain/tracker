export const PLATFORM_OPTIONS = [
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "TWITTER", label: "Twitter / X" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "OTHER", label: "Other" },
] as const;

export const NICHE_OPTIONS = [
  { value: "FITNESS", label: "Fitness" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "NUTRITIONIST", label: "Nutritionist" },
  { value: "ATHLETE", label: "Athlete" },
  { value: "LIFESTYLE", label: "Lifestyle" },
  { value: "BEAUTY", label: "Beauty" },
  { value: "COMEDY", label: "Comedy" },
  { value: "FINANCE", label: "Finance" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "FOOD", label: "Food" },
  { value: "FASHION", label: "Fashion" },
  { value: "OTHER", label: "Other" },
] as const;

export const RELATIONSHIP_STAGE_OPTIONS = [
  { value: "PROSPECT", label: "Prospect" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "INTERESTED", label: "Interested" },
  { value: "NEGOTIATING", label: "Negotiating" },
  { value: "GIFT_SENT", label: "Gift Sent" },
  { value: "BARTER", label: "Barter" },
  { value: "AFFILIATE", label: "Affiliate" },
  { value: "PAID_STORY", label: "Paid Story" },
  { value: "PAID_REEL", label: "Paid Reel" },
  { value: "AMBASSADOR", label: "Ambassador" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "BLACKLISTED", label: "Blacklisted" },
] as const;

export const COMMUNICATION_TYPE_OPTIONS = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "CALL", label: "Call" },
  { value: "MEETING", label: "Meeting" },
  { value: "INSTAGRAM_DM", label: "Instagram DM" },
] as const;

export const CAMPAIGN_STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "PAUSED", label: "Paused" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  PAUSED: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  BLACKLISTED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export const RELATIONSHIP_BADGE_CLASSES: Record<string, string> = {
  PROSPECT: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300",
  CONTACTED: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  INTERESTED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  NEGOTIATING: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  GIFT_SENT: "bg-pink-100 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
  BARTER: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  AFFILIATE: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  PAID_STORY: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
  PAID_REEL: "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",
  AMBASSADOR: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  INACTIVE: "bg-gray-100 text-gray-500 dark:bg-gray-500/10 dark:text-gray-400",
};

export function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}
