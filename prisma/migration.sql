-- =============================================
-- IMS Tracker - Full Schema (from Prisma schema)
-- Run this in Supabase SQL Editor
-- =============================================

-- Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TEAM_MEMBER');
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'OTHER');
CREATE TYPE "Niche" AS ENUM ('FITNESS', 'DOCTOR', 'NUTRITIONIST', 'ATHLETE', 'LIFESTYLE', 'BEAUTY', 'COMEDY', 'FINANCE', 'TECHNOLOGY', 'FOOD', 'FASHION', 'OTHER');
CREATE TYPE "RelationshipStage" AS ENUM ('PROSPECT', 'CONTACTED', 'INTERESTED', 'NEGOTIATING', 'GIFT_SENT', 'BARTER', 'AFFILIATE', 'PAID_STORY', 'PAID_REEL', 'AMBASSADOR', 'INACTIVE');
CREATE TYPE "CreatorStatus" AS ENUM ('ACTIVE', 'PAUSED', 'BLACKLISTED');
CREATE TYPE "CommunicationType" AS ENUM ('WHATSAPP', 'EMAIL', 'CALL', 'MEETING', 'INSTAGRAM_DM');
CREATE TYPE "CampaignStatus" AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- User table (Auth)
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'TEAM_MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Account table (Auth)
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Session table (Auth)
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- VerificationToken table (Auth)
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Creator table
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "profileImage" TEXT,
    "name" TEXT NOT NULL,
    "instagramUsername" TEXT,
    "platform" "Platform" NOT NULL DEFAULT 'INSTAGRAM',
    "niche" "Niche" NOT NULL DEFAULT 'OTHER',
    "location" TEXT,
    "language" TEXT,
    "gender" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "avgReelViews" INTEGER NOT NULL DEFAULT 0,
    "avgStoryViews" INTEGER NOT NULL DEFAULT 0,
    "avgLikes" INTEGER NOT NULL DEFAULT 0,
    "avgComments" INTEGER NOT NULL DEFAULT 0,
    "engagementRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "audienceAgeRange" TEXT,
    "audienceGenderSplit" TEXT,
    "audienceCountry" TEXT,
    "audienceCity" TEXT,
    "storyPrice" DOUBLE PRECISION,
    "reelPrice" DOUBLE PRECISION,
    "postPrice" DOUBLE PRECISION,
    "youtubePrice" DOUBLE PRECISION,
    "packagePrice" DOUBLE PRECISION,
    "affiliateAvailable" BOOLEAN NOT NULL DEFAULT false,
    "barterAvailable" BOOLEAN NOT NULL DEFAULT false,
    "managerNotes" TEXT,
    "previousCollaborations" TEXT,
    "specialRequirements" TEXT,
    "contractAttached" BOOLEAN NOT NULL DEFAULT false,
    "mediaKitAttached" BOOLEAN NOT NULL DEFAULT false,
    "relationshipStage" "RelationshipStage" NOT NULL DEFAULT 'PROSPECT',
    "status" "CreatorStatus" NOT NULL DEFAULT 'ACTIVE',
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grade" TEXT,
    "recommendation" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Creator_niche_idx" ON "Creator"("niche");
CREATE INDEX "Creator_relationshipStage_idx" ON "Creator"("relationshipStage");
CREATE INDEX "Creator_status_idx" ON "Creator"("status");
CREATE INDEX "Creator_totalScore_idx" ON "Creator"("totalScore");

-- Score table
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "audienceFit" INTEGER NOT NULL,
    "trustCredibility" INTEGER NOT NULL,
    "contentQuality" INTEGER NOT NULL,
    "costEfficiency" INTEGER NOT NULL,
    "reach" INTEGER NOT NULL,
    "audienceScore" DOUBLE PRECISION NOT NULL,
    "trustScore" DOUBLE PRECISION NOT NULL,
    "contentScore" DOUBLE PRECISION NOT NULL,
    "costScore" DOUBLE PRECISION NOT NULL,
    "reachScore" DOUBLE PRECISION NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "grade" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "scoredById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Score_creatorId_idx" ON "Score"("creatorId");

-- ScoringConfig table
CREATE TABLE "ScoringConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "audienceWeight" DOUBLE PRECISION NOT NULL DEFAULT 3,
    "trustWeight" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "contentWeight" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "costWeight" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "reachWeight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "thresholdAmbassador" DOUBLE PRECISION NOT NULL DEFAULT 90,
    "thresholdPaidReel" DOUBLE PRECISION NOT NULL DEFAULT 80,
    "thresholdAffiliate" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "thresholdBarter" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoringConfig_pkey" PRIMARY KEY ("id")
);

-- Campaign table
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "objective" TEXT,
    "expectedReach" INTEGER,
    "expectedSales" INTEGER,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "CampaignStatus" NOT NULL DEFAULT 'PLANNING',
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CampaignCreator table
CREATE TABLE "CampaignCreator" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignCreator_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CampaignCreator_campaignId_creatorId_key" ON "CampaignCreator"("campaignId", "creatorId");

-- Communication table
CREATE TABLE "Communication" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "type" "CommunicationType" NOT NULL,
    "notes" TEXT,
    "nextFollowUpDate" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Communication_creatorId_idx" ON "Communication"("creatorId");
CREATE INDEX "Communication_nextFollowUpDate_idx" ON "Communication"("nextFollowUpDate");

-- Note table
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Note_creatorId_idx" ON "Note"("creatorId");

-- Foreign Keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Score" ADD CONSTRAINT "Score_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Score" ADD CONSTRAINT "Score_scoredById_fkey" FOREIGN KEY ("scoredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CampaignCreator" ADD CONSTRAINT "CampaignCreator_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CampaignCreator" ADD CONSTRAINT "CampaignCreator_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Communication" ADD CONSTRAINT "Communication_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Communication" ADD CONSTRAINT "Communication_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Note" ADD CONSTRAINT "Note_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Note" ADD CONSTRAINT "Note_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
