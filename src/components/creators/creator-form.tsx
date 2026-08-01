"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  NICHE_OPTIONS,
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
    formState: { errors },
  } = useForm<CreatorFormInput, unknown, CreatorInput>({
    resolver: zodResolver(creatorSchema),
    defaultValues: { ...DEFAULT_VALUES, ...defaultValues },
  });

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
        <Field label="Location">
          <Input {...register("location")} placeholder="Mumbai, India" />
        </Field>
        <Field label="Language">
          <Input {...register("language")} placeholder="English" />
        </Field>
        <Field label="Gender">
          <Input {...register("gender")} placeholder="Female" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input {...register("email")} placeholder="creator@email.com" />
        </Field>
        <Field label="Phone">
          <Input {...register("phone")} placeholder="+1 555 000 0000" />
        </Field>
        <Field label="Website" error={errors.website?.message}>
          <Input {...register("website")} placeholder="https://..." />
        </Field>
      </FormSection>

      <FormSection title="Audience">
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
          <Input {...register("audienceCountry")} placeholder="United States" />
        </Field>
        <Field label="Audience City">
          <Input {...register("audienceCity")} placeholder="Los Angeles" />
        </Field>
      </FormSection>

      <FormSection title="Pricing">
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
        <Field label="Package Price">
          <Input type="number" {...register("packagePrice")} />
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

      <FormSection title="Relationship & Status">
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
