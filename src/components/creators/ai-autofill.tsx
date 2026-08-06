"use client";

import * as React from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, User, Users, TrendingUp, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreatorInput } from "@/lib/validations/creator";

interface EnrichMeta {
  isVerified: boolean;
  following: number;
  postCount: number;
  bio: string;
  category: string;
  followersFormatted: string;
  engagementRateFormatted: string;
  detectedNiche: string;
  detectedGender: string;
  source?: "Instagram API" | "Instagram API + AI";
  /** AI-guessed fields (audience demographics etc.) — manager should verify. */
  estimatedFields?: string[];
}

interface EnrichResult {
  name: string;
  instagramUsername: string;
  profileImage: string;
  platform: "INSTAGRAM";
  niche: CreatorInput["niche"];
  location: string;
  website: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  _meta: EnrichMeta;
}

interface AiAutoFillProps {
  onFill: (data: Partial<CreatorInput>) => void;
}

type Status = "idle" | "loading" | "success" | "error";

export function AiAutoFill({ onFill }: AiAutoFillProps) {
  const [username, setUsername] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [preview, setPreview] = React.useState<EnrichResult | null>(null);

  async function handleEnrich() {
    const trimmed = username.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMsg("");
    setPreview(null);

    try {
      const res = await fetch("/api/ai/enrich-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || "Failed to fetch creator details.");
        setStatus("error");
        return;
      }

      setPreview(json.data as EnrichResult);
      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  function handleApply() {
    if (!preview) return;
    const formData = { ...preview };
    delete (formData as Partial<EnrichResult>)._meta;
    onFill(formData);
    setPreview(null);
    setStatus("idle");
    setUsername("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleEnrich();
  }

  return (
    <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-fuchsia-500/5 p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">AI Auto-fill</p>
          <p className="text-xs text-muted-foreground">
            Instagram username se details automatically fill karein
          </p>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="username"
            className="pl-7 border-violet-500/30 focus:border-violet-500 bg-background/50"
            disabled={status === "loading"}
          />
        </div>
        <Button
          type="button"
          onClick={handleEnrich}
          disabled={status === "loading" || !username.trim()}
          className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shrink-0"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1.5" />
              Fetch
            </>
          )}
        </Button>
      </div>

      {/* Result Preview */}
      <AnimatePresence mode="wait">
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2"
          >
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <p className="text-xs text-destructive">{errorMsg}</p>
          </motion.div>
        )}

        {status === "success" && preview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {/* Profile Card */}
            <div className="flex items-start gap-3 rounded-lg bg-background/60 border border-border/60 p-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                {preview.profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview.profileImage}
                    alt={preview.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-violet-500/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-violet-500" />
                  </div>
                )}
                {preview._meta.isVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-sm truncate">{preview.name}</p>
                  <span className="text-xs text-violet-500 font-medium">{preview.instagramUsername}</span>
                  {preview._meta.source && (
                    <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-mono">
                      ✨ {preview._meta.source}
                    </span>
                  )}
                </div>
                {preview._meta.bio && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{preview._meta.bio}</p>
                )}
                {preview._meta.category && (
                  <span className="inline-block mt-1 text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/20">
                    {preview._meta.category}
                  </span>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              <StatCard
                icon={<Users className="h-3.5 w-3.5" />}
                label="Followers"
                value={preview._meta.followersFormatted}
                color="violet"
              />
              <StatCard
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                label="Engagement"
                value={preview._meta.engagementRateFormatted}
                color="emerald"
              />
              <StatCard
                icon={<Sparkles className="h-3.5 w-3.5" />}
                label="Niche"
                value={preview._meta.detectedNiche}
                color="fuchsia"
              />
            </div>

            {preview.location && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {preview.location}
              </div>
            )}

            {preview._meta.estimatedFields && preview._meta.estimatedFields.length > 0 && (
              <div className="flex items-start gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-px" />
                <p className="text-[11px] text-amber-600 dark:text-amber-400 leading-relaxed">
                  AI estimate (verify karein): {preview._meta.estimatedFields.join(", ")}.
                  Followers, likes aur engagement rate Instagram se real hain.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                size="sm"
                onClick={handleApply}
                className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                Apply to Form
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => { setStatus("idle"); setPreview(null); setUsername(""); }}
                className="border-border/60"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "violet" | "emerald" | "fuchsia";
}) {
  const colorMap = {
    violet: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    fuchsia: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
  };

  return (
    <div className={`rounded-lg border p-2 text-center ${colorMap[color]}`}>
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {icon}
        <Label className="text-[10px] font-medium uppercase tracking-wide opacity-70">{label}</Label>
      </div>
      <p className="text-sm font-bold truncate">{value || "—"}</p>
    </div>
  );
}
