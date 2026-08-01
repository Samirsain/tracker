import { z } from "zod";

export const communicationSchema = z.object({
  creatorId: z.string().min(1),
  type: z.enum(["WHATSAPP", "EMAIL", "CALL", "MEETING", "INSTAGRAM_DM"]),
  notes: z.string().optional().or(z.literal("")),
  nextFollowUpDate: z.string().optional().or(z.literal("")),
});

export type CommunicationInput = z.infer<typeof communicationSchema>;

export const noteSchema = z.object({
  creatorId: z.string().min(1),
  content: z.string().min(1, "Note cannot be empty"),
});

export type NoteInput = z.infer<typeof noteSchema>;
