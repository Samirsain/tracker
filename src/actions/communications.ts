"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { communicationSchema, noteSchema, type CommunicationInput, type NoteInput } from "@/lib/validations/communication";

export async function addCommunication(input: CommunicationInput) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = communicationSchema.parse(input);

  const communication = await prisma.communication.create({
    data: {
      creatorId: data.creatorId,
      type: data.type,
      notes: data.notes || null,
      nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,
      createdById: session.user.id,
    },
  });

  revalidatePath(`/creators/${data.creatorId}`);
  return communication;
}

export async function addNote(input: NoteInput) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = noteSchema.parse(input);

  const note = await prisma.note.create({
    data: {
      creatorId: data.creatorId,
      content: data.content,
      createdById: session.user.id,
    },
  });

  revalidatePath(`/creators/${data.creatorId}`);
  return note;
}
