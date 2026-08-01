"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, StickyNote } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { noteSchema, type NoteInput } from "@/lib/validations/communication";
import { addNote } from "@/actions/communications";

type NoteRecord = {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: { name: string | null } | null;
};

export function NotesTab({ creatorId, notes }: { creatorId: string; notes: NoteRecord[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: { creatorId, content: "" },
  });

  async function onSubmit(values: NoteInput) {
    setIsSubmitting(true);
    try {
      await addNote(values);
      toast.success("Note added");
      reset({ creatorId, content: "" });
      router.refresh();
    } catch {
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Textarea rows={3} placeholder="Add an internal note..." {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <StickyNote />}
              Add Note
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {notes.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No notes yet.</p>}
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="space-y-1 p-4">
              <p className="whitespace-pre-wrap text-sm">{note.content}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(note.createdAt)}
                {note.createdBy?.name ? ` · ${note.createdBy.name}` : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
