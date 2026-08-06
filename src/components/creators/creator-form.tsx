"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AiAutoFill } from "@/components/creators/ai-autofill";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  NICHE_OPTIONS,
  CREATOR_TYPE_OPTIONS,
  COLLABORATION_CATEGORY_OPTIONS,
  PLATFORM_OPTIONS,
  RELATIONSHIP_STAGE_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/constants";
import { creatorSchema, type CreatorFormInput, type CreatorInput } from "@/lib/validations/creator";
import { createCreator, updateCreator } from "@/actions/creators";

const DEFAULT_VALUES: CreatorInput = {
  profileImage: "",
  name: "",
  instagramUsername: "",
  platform: "INSTAGRAM",
  niche: "OTHER",
  creatorType: "LIFESTYLE",
  collaborationCategory: "BARTER",
  location: "",
  language: "",
  gender: "",
  email: "",
  phone: "",
  website: "",
  followers: 0,
  avgReelViews: 0,
  avgStoryViews: 0,
  avgLikes: 0,
  avgComments: 0,
  engagementRate: 0,
  audienceAgeRange: "",
  audienceGenderSplit: "",
  audienceCountry: "",
  audienceCity: "",
  storyPrice: undefined,
  reelPrice: undefined,
  postPrice: undefined,
  youtubePrice: undefined,
  packagePrice: undefined,
  monthlyRetainer: undefined,
  productInterested: "",
  couponCode: "",
  deliverablesCompleted: "",
  affiliateAvailable: false,
  barterAvailable: false,
  managerNotes: "",
  previousCollaborations: "",
  specialRequirements: "",
  contractAttached: false,
  mediaKitAttached: false,
  relationshipStage: "PROSPECT",
  status: "ACTIVE",
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function CreatorForm({
  creatorId,
  defaultValues,
}: {
  creatorId?: string;
  defaultValues?: Partial<CreatorInput>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreatorFormInput, unknown, CreatorInput>({
    resolver: zodResolver(creatorSchema),
    defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
  });

  const handleAiFill = React.useCallback(
    (data: Partial<CreatorInput>) => {
      (Object.entries(data) as [keyof CreatorInput, CreatorInput[keyof CreatorInput]][]).forEach(
        ([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            setValue(key, value as never, { shouldDirty: true, shouldValidate: false });
          }
        }
      );
      toast.success("✨ Form filled with AI details!");
    },
    [setValue]
  );

  async function onSubmit(values: CreatorInput) {
    setIsSubmitting(true);
    try {
      const creator = creatorId ? await updateCreator(creatorId, values) : await createCreator(values);
      toast.success(creatorId ? "Creator updated" : "Creator added");
      router.push(`/creators/${creator.id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {!creatorId && <AiAutoFill onFill={handleAiFill} />}

      <FormSection title="Basic Information">
        <Field label="Creator name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Jane Doe" />
        </Field>
        <Field label="Instagram username">
          <Input {...register("instagramUsername")} placeholder="@janedoe" />
        </Field>
        <Field label="Profile image URL">
          <Input {...register("profileImage")} placeholder="https://..." />
        </Field>
        <Field label="Platform">
          <Controller
            control={control}
            name="platform"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {/* PRD Categorization */}
        <Field label="Niche">
          <Controller
            control={control}
            name="niche"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NICHE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Creator Type (PRD)">
          <Controller
            control={control}
            name="creatorType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CREATOR_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                      {option.hint && <span className="ml-1.5 text-muted-foreground">{option.hint}</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Collaboration Model (PRD)">
          <Controller
            control={control}
            name="collaborationCategory"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLLABORATION_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                      {option.hint && <span className="ml-1.5 text-muted-foreground">{option.hint}</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Location">
          <Input {...register("location")} placeholder="Mumbai, India" />
        </Field>
        <Field label="Language">
          <Input {...register("language")} placeholder="Hindi / English" />
        </Field>
        <Field label="Gender">
          <Input {...register("gender")} placeholder="Female / Male" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input {...register("email")} placeholder="creator@email.com" />
        </Field>
        <Field label="Phone">
          <Input {...register("phone")} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Website" error={errors.website?.message}>
          <Input {...register("website")} placeholder="https://..." />
        </Field>
      </FormSection>

      <FormSection title="Audience Metrics">
        <Field label="Followers">
          <Input type="number" {...register("followers")} />
        </Field>
        <Field label="Average Reel Views">
          <Input type="number" {...register("avgReelViews")} />
        </Field>
        <Field label="Average Story Views">
          <Input type="number" {...register("avgStoryViews")} />
        </Field>
        <Field label="Average Likes">
          <Input type="number" {...register("avgLikes")} />
        </Field>
        <Field label="Average Comments">
          <Input type="number" {...register("avgComments")} />
        </Field>
        <Field label="Engagement Rate (%)">
          <Input type="number" step="0.01" {...register("engagementRate")} />
        </Field>
        <Field label="Audience Age Range">
          <Input {...register("audienceAgeRange")} placeholder="18-24" />
        </Field>
        <Field label="Audience Gender Split">
          <Input {...register("audienceGenderSplit")} placeholder="60% Female / 40% Male" />
        </Field>
        <Field label="Audience Country">
          <Input {...register("audienceCountry")} placeholder="India" />
        </Field>
        <Field label="Audience City">
          <Input {...register("audienceCity")} placeholder="Mumbai" />
        </Field>
      </FormSection>

      <FormSection title="Commercials & Deliverables (PRD)">
        <Field label="Story Price">
          <Input type="number" {...register("storyPrice")} />
        </Field>
        <Field label="Reel Price">
          <Input type="number" {...register("reelPrice")} />
        </Field>
        <Field label="Post Price">
          <Input type="number" {...register("postPrice")} />
        </Field>
        <Field label="YouTube Price">
          <Input type="number" {...register("youtubePrice")} />
        </Field>
        <Field label="Monthly Retainer (Ambassador)">
          <Input type="number" {...register("monthlyRetainer")} placeholder="e.g. 50000" />
        </Field>
        <Field label="Package Price">
          <Input type="number" {...register("packagePrice")} />
        </Field>
        <Field label="Product Interested">
          <Input {...register("productInterested")} placeholder="e.g. Daily Whey Protein" />
        </Field>
        <Field label="Coupon Code">
          <Input {...register("couponCode")} placeholder="e.g. CARRY20" />
        </Field>
        <Field label="Deliverables Completed">
          <Input {...register("deliverablesCompleted")} placeholder="e.g. 1 Reel, 3 Stories" />
        </Field>

        <div className="flex items-center gap-6 sm:col-span-2">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="affiliateAvailable"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label>Affiliate Available</Label>
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="barterAvailable"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label>Barter Available</Label>
          </div>
        </div>
      </FormSection>

      <FormSection title="Brand Fit & Internal Notes">
        <Field label="Manager Notes">
          <Textarea rows={3} {...register("managerNotes")} />
        </Field>
        <Field label="Previous Collaborations">
          <Textarea rows={3} {...register("previousCollaborations")} />
        </Field>
        <Field label="Special Requirements">
          <Textarea rows={3} {...register("specialRequirements")} />
        </Field>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="contractAttached"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label>Contract Attached</Label>
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="mediaKitAttached"
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label>Media Kit Attached</Label>
          </div>
        </div>
      </FormSection>

      <FormSection title="Relationship & Status (PRD Lifecycle)">
        <Field label="Relationship Stage">
          <Controller
            control={control}
            name="relationshipStage"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_STAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Status">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </FormSection>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
          {creatorId ? "Save Changes" : "Add Creator"}
        </Button>
      </div>
    </form>
  );
}
