"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2, Eye, Users, Plus } from "lucide-react";
import { toast } from "sonner";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import { RelationshipStageBadge, ScoreBadge, StatusBadge } from "@/components/creators/badges";
import { labelFor, NICHE_OPTIONS, CREATOR_TYPE_OPTIONS, COLLABORATION_CATEGORY_OPTIONS } from "@/lib/constants";
import { formatCompactNumber, handle, initials } from "@/lib/utils";
import { deleteCreator } from "@/actions/creators";

type CreatorRow = {
  id: string;
  name: string;
  profileImage: string | null;
  instagramUsername: string | null;
  niche: string;
  creatorType?: string;
  collaborationCategory?: string;
  platform: string;
  followers: number;
  engagementRate: number;
  totalScore: number;
  grade: string | null;
  relationshipStage: string;
  status: string;
};

export function CreatorTable({ creators, canDelete }: { creators: CreatorRow[]; canDelete: boolean }) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = React.useState<CreatorRow | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCreator(deleteTarget.id);
      toast.success(`${deleteTarget.name} was deleted`);
      router.refresh();
    } catch {
      toast.error("Failed to delete creator");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (creators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-16 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">No creators match this view</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Clear your filters, or add a creator and let the Instagram auto-fill do the typing.
          </p>
        </div>
        <Button asChild size="sm" className="mt-1">
          <Link href="/creators/new">
            <Plus /> Add creator
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead>Type & Niche</TableHead>
              <TableHead>Collaboration Model</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.map((creator) => (
              <TableRow key={creator.id}>
                <TableCell>
                  <Link href={`/creators/${creator.id}`} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {creator.profileImage && <AvatarImage src={creator.profileImage} alt={creator.name || "Creator"} />}
                      <AvatarFallback className="text-xs">{initials(creator.name || "Creator")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{creator.name || "Unnamed Creator"}</p>
                      {creator.instagramUsername && (
                        <p className="truncate text-xs text-muted-foreground">{handle(creator.instagramUsername)}</p>
                      )}
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="space-y-1">
                    <span className="inline-block whitespace-nowrap rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                      {labelFor(CREATOR_TYPE_OPTIONS, creator.creatorType || "LIFESTYLE")}
                    </span>
                    <p className="text-xs text-muted-foreground">{labelFor(NICHE_OPTIONS, creator.niche)}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="inline-block whitespace-nowrap rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {labelFor(COLLABORATION_CATEGORY_OPTIONS, creator.collaborationCategory || "BARTER")}
                  </span>
                </TableCell>
                <TableCell className="text-sm tabular-nums">{formatCompactNumber(creator.followers ?? 0)}</TableCell>
                <TableCell className="text-sm tabular-nums">{(creator.engagementRate ?? 0).toFixed(1)}%</TableCell>
                <TableCell>
                  <ScoreBadge score={creator.totalScore ?? 0} />
                </TableCell>
                <TableCell>
                  <RelationshipStageBadge stage={creator.relationshipStage || "PROSPECT"} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={creator.status || "ACTIVE"} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Row actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/creators/${creator.id}`}>
                          <Eye /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/creators/${creator.id}/edit`}>
                          <Pencil /> Edit
                        </Link>
                      </DropdownMenuItem>
                      {canDelete && (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => setDeleteTarget(creator)}
                        >
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
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
    </>
  );
}
