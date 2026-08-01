"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAMPAIGN_STATUS_OPTIONS } from "@/lib/constants";
import { campaignSchema, type CampaignFormInput, type CampaignInput } from "@/lib/validations/campaign";
import { createCampaign } from "@/actions/campaigns";

export function CreateCampaignDialog({ creators }: { creators: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CampaignFormInput, unknown, CampaignInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      brand: "",
      budget: 0,
      objective: "",
      status: "PLANNING",
      creatorIds: [],
    },
  });

  async function onSubmit(values: CampaignInput) {
    setIsSubmitting(true);
    try {
      await createCampaign(values);
      toast.success("Campaign created");
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>Set up a campaign and assign creators.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Campaign Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Brand</Label>
              <Input {...register("brand")} />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Budget</Label>
              <Input type="number" {...register("budget")} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMPAIGN_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Expected Reach</Label>
              <Input type="number" {...register("expectedReach")} />
            </div>
            <div className="space-y-1.5">
              <Label>Expected Sales</Label>
              <Input type="number" {...register("expectedSales")} />
            </div>
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Input type="date" {...register("endDate")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Objective</Label>
            <Textarea rows={2} {...register("objective")} />
          </div>

          <div className="space-y-1.5">
            <Label>Assigned Creators</Label>
            <Controller
              control={control}
              name="creatorIds"
              render={({ field }) => (
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border p-2">
                  {creators.length === 0 && <p className="text-xs text-muted-foreground">No creators yet.</p>}
                  {creators.map((creator) => (
                    <label key={creator.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={(field.value ?? []).includes(creator.id)}
                        onCheckedChange={(checked) => {
                          const current: string[] = field.value ?? [];
                          field.onChange(
                            checked ? [...current, creator.id] : current.filter((id) => id !== creator.id)
                          );
                        }}
                      />
                      {creator.name}
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
