"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { campaignSchema, type CampaignInput } from "@/lib/validations/campaign";

export async function getCampaigns() {
  return prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { creators: { include: { creator: { select: { id: true, name: true, profileImage: true } } } } },
  });
}

export async function createCampaign(input: CampaignInput) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = campaignSchema.parse(input);

  const campaign = await prisma.campaign.create({
    data: {
      name: data.name,
      brand: data.brand,
      budget: data.budget,
      objective: data.objective || null,
      expectedReach: data.expectedReach,
      expectedSales: data.expectedSales,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status,
      creators: data.creatorIds && data.creatorIds.length > 0 ? {
        create: data.creatorIds.map((creatorId) => ({ creatorId })),
      } : undefined,
    },
  });

  revalidatePath("/campaigns");
  revalidatePath("/dashboard");
  return campaign;
}
