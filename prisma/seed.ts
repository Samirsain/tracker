import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { calculateScore, DEFAULT_THRESHOLDS, DEFAULT_WEIGHTS } from "../src/lib/scoring";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const NICHES = [
  "FITNESS",
  "DOCTOR",
  "NUTRITIONIST",
  "ATHLETE",
  "LIFESTYLE",
  "BEAUTY",
  "COMEDY",
  "FINANCE",
  "TECHNOLOGY",
  "FOOD",
  "FASHION",
  "OTHER",
] as const;

const PLATFORMS = ["INSTAGRAM", "YOUTUBE", "TIKTOK", "FACEBOOK", "OTHER"] as const;

const STAGES = [
  "PROSPECT",
  "SHORTLISTED",
  "CONTACTED",
  "WAITING_REPLY",
  "INTERESTED",
  "NEGOTIATION",
  "PRODUCT_SENT",
  "CAMPAIGN_LIVE",
  "COMPLETED",
  "AMBASSADOR",
  "INACTIVE",
] as const;

const CITIES = ["Los Angeles", "New York", "Miami", "Austin", "Mumbai", "London", "Toronto"];
const COUNTRIES = ["United States", "India", "United Kingdom", "Canada"];
const LANGUAGES = ["English", "Hindi", "Spanish", "French"];

const CREATOR_NAMES = [
  "Ava Sinclair",
  "Marcus Lee",
  "Priya Nair",
  "Jordan Blake",
  "Sofia Martinez",
  "Ethan Brooks",
  "Olivia Chen",
  "Liam Carter",
  "Maya Patel",
  "Noah Rivera",
  "Isabella Kim",
  "Lucas Fernandes",
  "Chloe Anderson",
  "Ryan Thompson",
  "Zara Ahmed",
  "Daniel Wright",
  "Emma Rodriguez",
  "Kai Nakamura",
];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@creatorscore.app" },
    update: { name: "Samir Sain" },
    create: {
      name: "Samir Sain",
      email: "admin@creatorscore.app",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  const teamMember = await prisma.user.upsert({
    where: { email: "team@creatorscore.app" },
    update: {},
    create: {
      name: "Jamie Lee",
      email: "team@creatorscore.app",
      password: passwordHash,
      role: "TEAM_MEMBER",
    },
  });

  await prisma.scoringConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...DEFAULT_WEIGHTS, ...DEFAULT_THRESHOLDS },
  });

  const creators = [];
  for (let i = 0; i < CREATOR_NAMES.length; i++) {
    const name = CREATOR_NAMES[i];
    const followers = randomInt(5_000, 2_000_000);
    const engagementRate = Number((Math.random() * 8 + 1).toFixed(2));
    const avgLikes = Math.round(followers * (engagementRate / 100) * 0.85);
    const avgComments = Math.round(followers * (engagementRate / 100) * 0.15);

    const creator = await prisma.creator.create({
      data: {
        name,
        instagramUsername: name.toLowerCase().replace(/\s+/g, ""),
        platform: randomFrom(PLATFORMS),
        niche: randomFrom(NICHES),
        location: randomFrom(CITIES),
        language: randomFrom(LANGUAGES),
        gender: randomFrom(["Female", "Male", "Non-binary"]),
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: `+1555${randomInt(1000000, 9999999)}`,
        website: `https://${name.toLowerCase().replace(/\s+/g, "")}.com`,
        followers,
        avgReelViews: Math.round(followers * randomInt(20, 60) / 100),
        avgStoryViews: Math.round(followers * randomInt(10, 30) / 100),
        avgLikes,
        avgComments,
        engagementRate,
        audienceAgeRange: randomFrom(["18-24", "25-34", "35-44"]),
        audienceGenderSplit: randomFrom(["60% Female / 40% Male", "70% Male / 30% Female", "50% / 50%"]),
        audienceCountry: randomFrom(COUNTRIES),
        audienceCity: randomFrom(CITIES),
        storyPrice: randomInt(50, 500),
        reelPrice: randomInt(200, 5000),
        postPrice: randomInt(150, 3000),
        youtubePrice: randomInt(500, 8000),
        packagePrice: randomInt(1000, 12000),
        affiliateAvailable: Math.random() > 0.4,
        barterAvailable: Math.random() > 0.5,
        managerNotes: "Responsive and professional to work with.",
        previousCollaborations: "Worked with 2 skincare brands in the last 6 months.",
        contractAttached: Math.random() > 0.6,
        mediaKitAttached: Math.random() > 0.5,
        relationshipStage: randomFrom(STAGES),
        status: Math.random() > 0.85 ? "PAUSED" : "ACTIVE",
        createdById: Math.random() > 0.5 ? admin.id : teamMember.id,
      },
    });

    creators.push(creator);
  }

  for (const creator of creators) {
    if (Math.random() > 0.15) {
      const inputs = {
        audienceFit: randomInt(3, 10),
        trustCredibility: randomInt(3, 10),
        contentQuality: randomInt(3, 10),
        costEfficiency: randomInt(3, 10),
        reach: randomInt(3, 10),
      };
      const breakdown = calculateScore(inputs, DEFAULT_WEIGHTS, DEFAULT_THRESHOLDS);

      await prisma.score.create({
        data: {
          creatorId: creator.id,
          ...inputs,
          audienceScore: breakdown.audienceScore,
          trustScore: breakdown.trustScore,
          contentScore: breakdown.contentScore,
          costScore: breakdown.costScore,
          reachScore: breakdown.reachScore,
          totalScore: breakdown.totalScore,
          grade: breakdown.grade,
          recommendation: breakdown.recommendation,
          scoredById: Math.random() > 0.5 ? admin.id : teamMember.id,
        },
      });

      await prisma.creator.update({
        where: { id: creator.id },
        data: {
          totalScore: breakdown.totalScore,
          grade: breakdown.grade,
          recommendation: breakdown.recommendation,
        },
      });
    }

    if (Math.random() > 0.4) {
      await prisma.communication.create({
        data: {
          creatorId: creator.id,
          type: randomFrom(["WHATSAPP", "EMAIL", "CALL", "MEETING", "INSTAGRAM_DM"]),
          notes: "Discussed collaboration terms and content expectations.",
          nextFollowUpDate: Math.random() > 0.5 ? new Date(Date.now() + randomInt(1, 20) * 86400000) : null,
          createdById: Math.random() > 0.5 ? admin.id : teamMember.id,
        },
      });
    }

    if (Math.random() > 0.6) {
      await prisma.note.create({
        data: {
          creatorId: creator.id,
          content: "Great engagement on recent posts, worth prioritizing for the next campaign.",
          createdById: Math.random() > 0.5 ? admin.id : teamMember.id,
        },
      });
    }
  }

  const campaignData = [
    { name: "Summer Wellness Launch", brand: "VitaBoost", status: "ACTIVE" as const },
    { name: "Holiday Skincare Push", brand: "Glowly", status: "COMPLETED" as const },
    { name: "New Year Fitness Challenge", brand: "FitCore", status: "ACTIVE" as const },
    { name: "Back to School Tech", brand: "GadgetHub", status: "PLANNING" as const },
    { name: "Spring Fashion Drop", brand: "Threadline", status: "COMPLETED" as const },
  ];

  for (const data of campaignData) {
    const budget = randomInt(5000, 50000);
    const cost = Math.round(budget * (0.7 + Math.random() * 0.3));
    const revenue = Math.round(cost * (0.8 + Math.random() * 1.5));
    const assigned = creators.sort(() => Math.random() - 0.5).slice(0, randomInt(2, 5));

    await prisma.campaign.create({
      data: {
        name: data.name,
        brand: data.brand,
        budget,
        objective: "Drive awareness and conversions through authentic creator content.",
        expectedReach: randomInt(50_000, 2_000_000),
        expectedSales: randomInt(100, 5000),
        startDate: new Date(Date.now() - randomInt(10, 90) * 86400000),
        endDate: new Date(Date.now() + randomInt(-10, 60) * 86400000),
        status: data.status,
        views: randomInt(10_000, 1_000_000),
        clicks: randomInt(500, 50_000),
        sales: randomInt(20, 2000),
        revenue,
        cost,
        creators: {
          create: assigned.map((creator) => ({ creatorId: creator.id })),
        },
      },
    });
  }

  console.log(`Seeded ${creators.length} creators, ${campaignData.length} campaigns, and 2 users.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
