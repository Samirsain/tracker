"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMUNICATION_TYPE_OPTIONS, labelFor } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { communicationSchema, type CommunicationInput } from "@/lib/validations/communication";
import { addCommunication } from "@/actions/communications";

type CommunicationRecord = {
  id: string;
  type: string;
  notes: string | null;
  nextFollowUpDate: Date | null;
  createdAt: Date;
  createdBy: { name: string | null } | null;
};

export function CommunicationTab({ creatorId, communications }: { creatorId: string; communications: CommunicationRecord[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommunicationInput>({
    resolver: zodResolver(communicationSchema),
    defaultValues: { creatorId, type: "WHATSAPP", notes: "", nextFollowUpDate: "" },
  });

  async function onSubmit(values: CommunicationInput) {
    setIsSubmitting(true);
    try {
      await addCommunication(values);
      toast.success("Communication logged");
      reset({ creatorId, type: values.type, notes: "", nextFollowUpDate: "" });
      router.refresh();
    } catch {
      toast.error("Failed to log communication");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <CardContent className="space-y-4 p-4">
          <p className="text-sm font-medium">Log a new interaction</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNICATION_TYPE_OPTIONS.map((option) => (
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
              <Label>Notes</Label>
              <Textarea rows={3} {...register("notes")} placeholder="What was discussed?" />
            </div>
            <div className="space-y-1.5">
              <Label>Next Follow Up Date</Label>
              <Input type="date" {...register("nextFollowUpDate")} />
              {errors.nextFollowUpDate && (
                <p className="text-xs text-destructive">{errors.nextFollowUpDate.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <MessageSquarePlus />}
              Log Interaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {communications.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No communication history yet.</p>
        )}
        {communications.map((comm) => (
          <Card key={comm.id}>
            <CardContent className="space-y-1 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{labelFor(COMMUNICATION_TYPE_OPTIONS, comm.type)}</span>
                <span className="text-xs text-muted-foreground">{formatDate(comm.createdAt)}</span>
              </div>
              {comm.notes && <p className="text-sm text-muted-foreground">{comm.notes}</p>}
              {comm.nextFollowUpDate && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Follow up: {formatDate(comm.nextFollowUpDate)}
                </p>
              )}
              {comm.createdBy?.name && <p className="text-xs text-muted-foreground">Logged by {comm.createdBy.name}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
