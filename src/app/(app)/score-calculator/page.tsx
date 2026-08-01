import { getScoringConfig } from "@/actions/scoring";
import { prisma } from "@/lib/prisma";
import { ScoreCalculatorClient } from "@/components/scoring/score-calculator-client";

export default async function ScoreCalculatorPage() {
  const [config, creators] = await Promise.all([
    getScoringConfig(),
    prisma.creator.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Score Calculator</h1>
        <p className="text-sm text-muted-foreground">
          Preview a creator&apos;s score and recommendation before committing it to their profile.
        </p>
      </div>

      <ScoreCalculatorClient
        weights={{
          audienceWeight: config.audienceWeight,
          trustWeight: config.trustWeight,
          contentWeight: config.contentWeight,
          costWeight: config.costWeight,
          reachWeight: config.reachWeight,
        }}
        thresholds={{
          thresholdAmbassador: config.thresholdAmbassador,
          thresholdPaidReel: config.thresholdPaidReel,
          thresholdAffiliate: config.thresholdAffiliate,
          thresholdBarter: config.thresholdBarter,
        }}
        creators={creators}
      />
    </div>
  );
}
