"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma, Niche, Platform, RelationshipStage, CreatorStatus } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { creatorSchema, type CreatorInput } from "@/lib/validations/creator";

export type CreatorFilters = {
  search?: string;
  niche?: string;
  creatorType?: string;
  collaborationCategory?: string;
  platform?: string;
  relationshipStage?: string;
  status?: string;
  recommendation?: string;
  minScore?: number;
  maxScore?: number;
  minFollowers?: number;
};

export async function getCreators(filters: CreatorFilters = {}) {
  const where: Prisma.CreatorWhereInput = {};

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { instagramUsername: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.niche) where.niche = filters.niche as Niche;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (filters.creatorType) (where as Record<string, unknown>).creatorType = filters.creatorType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (filters.collaborationCategory) (where as Record<string, unknown>).collaborationCategory = filters.collaborationCategory;
  if (filters.platform) where.platform = filters.platform as Platform;
  if (filters.relationshipStage) where.relationshipStage = filters.relationshipStage as RelationshipStage;
  if (filters.status) where.status = filters.status as CreatorStatus;
  if (filters.recommendation) where.recommendation = filters.recommendation;
  if (filters.minFollowers) where.followers = { gte: filters.minFollowers };
  if (filters.minScore || filters.maxScore) {
    where.totalScore = {
      ...(filters.minScore ? { gte: filters.minScore } : {}),
      ...(filters.maxScore ? { lte: filters.maxScore } : {}),
    };
  }

  return prisma.creator.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCreator(id: string) {
  return prisma.creator.findUnique({
    where: { id },
    include: {
      scores: { orderBy: { createdAt: "desc" }, include: { scoredBy: { select: { name: true } } } },
      communications: {
        orderBy: { createdAt: "desc" },
        include: { createdBy: { select: { name: true } } },
      },
      notes: { orderBy: { createdAt: "desc" }, include: { createdBy: { select: { name: true } } } },
      campaigns: { include: { campaign: true } },
    },
  });
}

export async function createCreator(input: CreatorInput) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = creatorSchema.parse(input);

  const creator = await prisma.creator.create({
    data: {
      ...data,
      createdById: session.user.id,
    },
  });

  revalidatePath("/creators");
  revalidatePath("/dashboard");
  return creator;
}

export async function updateCreator(id: string, input: CreatorInput) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = creatorSchema.parse(input);

  const creator = await prisma.creator.update({
    where: { id },
    data,
  });

  revalidatePath("/creators");
  revalidatePath(`/creators/${id}`);
  revalidatePath("/dashboard");
  return creator;
}

export async function deleteCreator(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") {
    throw new Error("Only admins can delete creators.");
  }

  await prisma.creator.delete({ where: { id } });

  revalidatePath("/creators");
  revalidatePath("/dashboard");
}

export async function updateRelationshipStage(id: string, stage: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.creator.update({
    where: { id },
    data: { relationshipStage: stage as RelationshipStage },
  });

  revalidatePath("/creators");
  revalidatePath(`/creators/${id}`);
  revalidatePath("/dashboard");
}
