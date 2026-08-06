import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export const maxDuration = 30;

// ─── Types ─────────────────────────────────────────────────────────────────

interface CreatorEnrichment {
  name: string;
  instagramUsername: string;
  profileImage: string;
  platform: "INSTAGRAM";
  niche: string;
  language: string;
  gender: string;
  location: string;
  website: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  audienceAgeRange: string;
  audienceGenderSplit: string;
  audienceCountry: string;
  _meta: {
    isVerified: boolean;
    following: number;
    postCount: number;
    bio: string;
    category: string;
    followersFormatted: string;
    engagementRateFormatted: string;
    detectedNiche: string;
    detectedGender: string;
    source: "Instagram API" | "Instagram API + AI";
    sampledPosts: number;
    /** Fields the AI guessed from bio/captions — not measured facts. */
    estimatedFields: string[];
  };
}

const RAPIDAPI_HOST = process.env.RAPIDAPI_INSTAGRAM_HOST || "instagram120.p.rapidapi.com";

// Must stay in sync with the `niche` enum in src/lib/validations/creator.ts —
// anything else is rejected by the form's zod schema.
const VALID_NICHES = [
  "FITNESS", "DOCTOR", "NUTRITIONIST", "ATHLETE", "LIFESTYLE", "BEAUTY",
  "COMEDY", "FINANCE", "TECHNOLOGY", "FOOD", "FASHION", "OTHER",
] as const;

// Keyword → niche. First match wins, so order matters (more specific first).
const NICHE_KEYWORDS: [RegExp, string][] = [
  [/\b(doctor|dr\.?|md|surgeon|dermatolog|physician|cardiolog|dentist)\b/i, "DOCTOR"],
  [/\b(nutrition|dietit|dietic)\b/i, "NUTRITIONIST"],
  [/\b(athlete|cricket|footballer|olympic|sportsperson|boxer|wrestler)\b/i, "ATHLETE"],
  [/\b(fitness|gym|workout|trainer|bodybuild|yoga|crossfit)\b/i, "FITNESS"],
  [/\b(beauty|makeup|skincare|cosmetic|mua|salon)\b/i, "BEAUTY"],
  [/\b(comedy|comedian|humor|humour|meme|standup|stand-up)\b/i, "COMEDY"],
  [/\b(finance|invest|stock|trading|money|wealth|mutual fund|crypto)\b/i, "FINANCE"],
  [/\b(tech|technolog|gadget|software|developer|coding|programm|ai\b|startup)\b/i, "TECHNOLOGY"],
  [/\b(food|chef|recipe|cook|restaurant|foodie|baking|kitchen)\b/i, "FOOD"],
  [/\b(fashion|style|outfit|clothing|apparel|model|designer)\b/i, "FASHION"],
  [/\b(lifestyle|travel|vlog|blogger|creator|influencer)\b/i, "LIFESTYLE"],
];

function detectNiche(...text: (string | undefined)[]): string {
  const haystack = text.filter(Boolean).join(" ");
  for (const [pattern, niche] of NICHE_KEYWORDS) {
    if (pattern.test(haystack)) return niche;
  }
  return "OTHER";
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return `${count}`;
}

// ─── Instagram API (RapidAPI) ──────────────────────────────────────────────

async function rapidApi(path: string, body: unknown): Promise<unknown> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error("RAPIDAPI_KEY is not configured");

  const res = await fetch(`https://${RAPIDAPI_HOST}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": RAPIDAPI_HOST,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Instagram API ${path} failed (${res.status})`);
  return res.json();
}

type IgUser = {
  username?: string;
  full_name?: string;
  biography?: string;
  category?: string;
  external_url?: string;
  city_name?: string;
  follower_count?: number;
  following_count?: number;
  media_count?: number;
  is_verified?: boolean;
  profile_pic_url?: string;
  hd_profile_pic_url_info?: { url?: string };
};

function pickUser(payload: unknown): IgUser | null {
  const result = (payload as { result?: unknown })?.result;
  const first = Array.isArray(result) ? result[0] : result;
  const user = (first as { user?: IgUser })?.user ?? (first as IgUser);
  return user && typeof user === "object" && user.username ? user : null;
}

/** Real averages from the creator's most recent posts. Zero if unavailable. */
function averageEngagement(payload: unknown) {
  const edges = (payload as { result?: { edges?: { node?: Record<string, unknown> }[] } })?.result?.edges;
  if (!Array.isArray(edges) || edges.length === 0) return { avgLikes: 0, avgComments: 0, sampled: 0 };

  const nodes = edges.map((e) => e?.node).filter(Boolean) as Record<string, unknown>[];
  const likes = nodes.map((n) => Number(n.like_count)).filter((n) => Number.isFinite(n) && n >= 0);
  const comments = nodes.map((n) => Number(n.comment_count)).filter((n) => Number.isFinite(n) && n >= 0);

  const mean = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
  return { avgLikes: mean(likes), avgComments: mean(comments), sampled: nodes.length };
}

function captionsFrom(payload: unknown, limit = 6): string[] {
  const edges = (payload as { result?: { edges?: { node?: { caption?: { text?: string } } }[] } })?.result?.edges;
  if (!Array.isArray(edges)) return [];
  return edges
    .map((e) => e?.node?.caption?.text?.trim())
    .filter((t): t is string => Boolean(t))
    .slice(0, limit)
    .map((t) => t.slice(0, 220));
}

// ─── OpenAI: only the fields Instagram does not expose ─────────────────────
//
// Deliberately never touches followers / likes / comments / engagement rate —
// those come from the real API. An LLM asked to invent audience numbers is what
// made every username return identical data before. Here it only reads the
// creator's real bio, category and captions and labels them.

const AI_FIELDS = [
  "niche", "language", "gender", "location",
  "audienceAgeRange", "audienceGenderSplit", "audienceCountry",
] as const;

type AiFields = Partial<Record<(typeof AI_FIELDS)[number], string>>;

const AI_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [...AI_FIELDS],
  properties: {
    niche: { type: "string", enum: [...VALID_NICHES] },
    language: { type: "string", description: "Primary content language, e.g. 'Hindi', 'English', 'Hindi / English'. Empty string if unclear." },
    gender: { type: "string", enum: ["Male", "Female", "Other", ""] },
    location: { type: "string", description: "City, Country if stated or clearly implied. Empty string otherwise." },
    audienceAgeRange: { type: "string", description: "Likely dominant age band, e.g. '18-24'. Empty string if unclear." },
    audienceGenderSplit: { type: "string", description: "Rough split, e.g. '70% Male / 30% Female'. Empty string if unclear." },
    audienceCountry: { type: "string", description: "Likely primary audience country. Empty string if unclear." },
  },
} as const;

async function enrichWithAi(profile: {
  username: string;
  fullName: string;
  bio: string;
  category: string;
  followers: number;
  captions: string[];
}): Promise<AiFields | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
        messages: [
          {
            role: "system",
            content:
              "You classify Instagram creators for a brand-collaboration CRM. Use only the profile data given. " +
              "If a field cannot be reasonably inferred, return an empty string rather than guessing. Never invent statistics.",
          },
          { role: "user", content: JSON.stringify(profile) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "creator_profile", strict: true, schema: AI_SCHEMA },
        },
      }),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("OpenAI enrichment failed:", res.status, await res.text().catch(() => ""));
      return null;
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    return typeof content === "string" ? (JSON.parse(content) as AiFields) : null;
  } catch (error) {
    console.error("OpenAI enrichment error:", error);
    return null;
  }
}

// ─── Route ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let username: unknown;
  try {
    ({ username } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof username !== "string" || !username.trim()) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  // Accept "@name", "name", or a full profile URL.
  const clean = username
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "")
    .toLowerCase();

  if (!/^[a-z0-9._]{1,30}$/.test(clean)) {
    return NextResponse.json({ error: "Enter a valid Instagram username" }, { status: 400 });
  }

  try {
    const [infoResult, postsResult] = await Promise.allSettled([
      rapidApi("api/instagram/userInfo", { username: clean }),
      rapidApi("api/instagram/posts", { username: clean, maxId: "" }),
    ]);

    if (infoResult.status === "rejected") throw infoResult.reason;

    const user = pickUser(infoResult.value);
    if (!user) {
      return NextResponse.json(
        { error: `Instagram profile "@${clean}" not found or is unavailable.` },
        { status: 404 }
      );
    }

    const { avgLikes, avgComments, sampled } =
      postsResult.status === "fulfilled"
        ? averageEngagement(postsResult.value)
        : { avgLikes: 0, avgComments: 0, sampled: 0 };

    const followers = Number(user.follower_count) || 0;
    const engagementRate =
      followers > 0 ? Number((((avgLikes + avgComments) / followers) * 100).toFixed(2)) : 0;

    const ai = await enrichWithAi({
      username: clean,
      fullName: user.full_name?.trim() || "",
      bio: user.biography?.trim() || "",
      category: user.category?.trim() || "",
      followers,
      captions: postsResult.status === "fulfilled" ? captionsFrom(postsResult.value) : [],
    });

    // AI only supplies soft fields. Real API values always win, and a blank AI
    // answer stays blank — no invented defaults.
    const pick = (aiValue: string | undefined, apiValue: string) => apiValue || aiValue?.trim() || "";
    const estimatedFields = ai
      ? AI_FIELDS.filter((f) => ai[f]?.trim() && !(f === "location" && user.city_name?.trim()))
      : [];

    const aiNiche = ai?.niche && VALID_NICHES.includes(ai.niche as (typeof VALID_NICHES)[number]) ? ai.niche : "";
    const niche = aiNiche || detectNiche(user.category, user.biography, user.full_name, clean);

    const data: CreatorEnrichment = {
      name: user.full_name?.trim() || clean,
      instagramUsername: `@${user.username || clean}`,
      // Instagram CDN URLs are signed and expire after a few weeks; re-run
      // auto-fill (or proxy/re-host the image) if avatars start 403-ing.
      profileImage: user.hd_profile_pic_url_info?.url || user.profile_pic_url || "",
      platform: "INSTAGRAM",
      niche,
      language: ai?.language?.trim() || "",
      gender: ai?.gender?.trim() || "",
      location: pick(ai?.location, user.city_name?.trim() || ""),
      website: user.external_url?.trim() || "",
      followers,
      avgLikes,
      avgComments,
      engagementRate,
      // Not exposed by the public API. AI estimates these from the bio and
      // captions — verify against the creator's own insights screenshot.
      audienceAgeRange: ai?.audienceAgeRange?.trim() || "",
      audienceGenderSplit: ai?.audienceGenderSplit?.trim() || "",
      audienceCountry: ai?.audienceCountry?.trim() || "",
      _meta: {
        isVerified: Boolean(user.is_verified),
        following: Number(user.following_count) || 0,
        postCount: Number(user.media_count) || 0,
        bio: user.biography?.trim() || "",
        category: user.category?.trim() || "",
        followersFormatted: formatFollowers(followers),
        engagementRateFormatted: `${engagementRate}%`,
        detectedNiche: niche,
        detectedGender: ai?.gender?.trim() || "",
        source: ai ? "Instagram API + AI" : "Instagram API",
        sampledPosts: sampled,
        estimatedFields,
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("enrich-creator failed:", error);
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "Instagram lookup timed out. Please try again."
        : "Could not fetch Instagram data right now. Please try again or enter details manually.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
