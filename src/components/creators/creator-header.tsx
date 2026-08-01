"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Megaphone, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RelationshipStageBadge, ScoreBadge, StatusBadge } from "@/components/creators/badges";
import { AddScoreDialog } from "@/components/scoring/add-score-dialog";
import { initials } from "@/lib/utils";
import { deleteCreator, updateCreator } from "@/actions/creators";
import { creatorToFormValues } from "@/lib/validations/creator";
import type { ScoringThresholds, ScoringWeights } from "@/lib/scoring";
import type { Creator } from "@prisma/client";

export function CreatorHeader({
  creator,
  isAdmin,
  weights,
  thresholds,
}: {
  creator: Creator;
  isAdmin: boolean;
  weights: ScoringWeights;
  thresholds: ScoringThresholds;
}) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleArchive() {
    setIsArchiving(true);
    try {
      await updateCreator(creator.id, { ...creatorToFormValues(creator), status: "PAUSED" });
      toast.success("Creator archived (status set to Paused)");
      router.refresh();
    } catch {
      toast.error("Failed to archive creator");
    } finally {
      setIsArchiving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteCreator(creator.id);
      toast.success("Creator deleted");
      router.push("/creators");
    } catch {
      toast.error("Failed to delete creator");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {creator.profileImage && <AvatarImage src={creator.profileImage} alt={creator.name} />}
          <AvatarFallback className="text-lg">{initials(creator.name)}</AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold">{creator.name}</h1>
          {creator.instagramUsername && <p className="text-sm text-muted-foreground">@{creator.instagramUsername}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <ScoreBadge score={creator.totalScore} />
            <RelationshipStageBadge stage={creator.relationshipStage} />
            <StatusBadge status={creator.status} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href={`/creators/${creator.id}/edit`}>
            <Pencil /> Edit
          </Link>
        </Button>
        <AddScoreDialog creatorId={creator.id} weights={weights} thresholds={thresholds} />
        <Button variant="outline" asChild>
          <Link href="/campaigns">
            <Megaphone /> Add Campaign
          </Link>
        </Button>
        <Button variant="outline" onClick={handleArchive} disabled={isArchiving}>
          <Archive /> Archive
        </Button>
        {isAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {creator.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the creator and all associated scores, notes, and communication history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
