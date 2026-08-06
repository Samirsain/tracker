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

// `label` is the short name — it goes in table cells, detail rows and CSV
// exports, so it has to stay tight. `hint` carries the explanatory detail and
// is only rendered inside the form dropdowns, where there is room for it.
export const CREATOR_TYPE_OPTIONS = [
  { value: "SCIENCE", label: "Science", hint: "Doctor, nutritionist, researcher" },
  { value: "PERFORMANCE", label: "Performance", hint: "Runner, athlete, cyclist" },
  { value: "LIFESTYLE", label: "Lifestyle", hint: "Wellness, entrepreneur" },
  { value: "COMMUNITY", label: "Community", hint: "Nano / micro niche" },
  { value: "CELEBRITY", label: "Celebrity", hint: "Mass awareness" },
] as const;

export const COLLABORATION_CATEGORY_OPTIONS = [
  { value: "BARTER", label: "Barter", hint: "Product only" },
  { value: "GIFT_BOX", label: "Gift Box", hint: "PR package" },
  { value: "STORY", label: "Story Campaign", hint: "" },
  { value: "REEL", label: "Reel Campaign", hint: "" },
  { value: "AFFILIATE", label: "Affiliate Partner", hint: "" },
  { value: "AMBASSADOR", label: "Brand Ambassador", hint: "" },
  { value: "SPONSORED", label: "Sponsored Partnership", hint: "" },
] as const;

export const RELATIONSHIP_STAGE_OPTIONS = [
  { value: "PROSPECT", label: "Prospect" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "WAITING_REPLY", label: "Waiting Reply" },
  { value: "INTERESTED", label: "Interested" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "PRODUCT_SENT", label: "Product Sent" },
  { value: "CAMPAIGN_LIVE", label: "Campaign Live" },
  { value: "COMPLETED", label: "Completed" },
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

export const CAMPAIGN_CATEGORY_OPTIONS = [
  { value: "SCIENCE", label: "Science Campaign" },
  { value: "ATHLETE", label: "Athlete Campaign" },
  { value: "LIFESTYLE", label: "Lifestyle Campaign" },
  { value: "LAUNCH", label: "Launch Campaign" },
  { value: "SEASONAL", label: "Seasonal Campaign" },
] as const;

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  PAUSED: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  BLACKLISTED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

// The pipeline is a progression, so colour encodes *how far along* rather than
// giving every stage its own hue. Four families, each meaning something:
//   slate   = cold, nothing owed by anyone
//   blue    = in motion, ball is in our court
//   amber   = blocked, waiting on the creator
//   emerald = live or won
// Ten different hues (incl. purple, pink, indigo) just read as decoration.
export const RELATIONSHIP_BADGE_CLASSES: Record<string, string> = {
  PROSPECT: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300",
  SHORTLISTED: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
  CONTACTED: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  WAITING_REPLY: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  INTERESTED: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  NEGOTIATION: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  PRODUCT_SENT: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  CAMPAIGN_LIVE: "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-500/15 dark:text-emerald-300",
  COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  AMBASSADOR: "bg-emerald-600 text-white font-semibold dark:bg-emerald-500 dark:text-emerald-950",
  INACTIVE: "bg-muted text-muted-foreground",
};

export function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}
