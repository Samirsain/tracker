import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreRing } from "@/components/scoring/score-ring";
import { RecommendationBadge } from "@/components/creators/badges";
import { AddScoreDialog } from "@/components/scoring/add-score-dialog";
import { RECOMMENDATION_COLORS, type Recommendation, type ScoringThresholds, type ScoringWeights } from "@/lib/scoring";
import { formatDate } from "@/lib/utils";

type ScoreRecord = {
  id: string;
  audienceFit: number;
  trustCredibility: number;
  contentQuality: number;
  costEfficiency: number;
  reach: number;
  totalScore: number;
  grade: string;
  recommendation: string;
  createdAt: Date;
  scoredBy: { name: string | null } | null;
};

export function ScoringTab({
  creatorId,
  scores,
  weights,
  thresholds,
}: {
  creatorId: string;
  scores: ScoreRecord[];
  weights: ScoringWeights;
  thresholds: ScoringThresholds;
}) {
  const latest = scores[0];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Current Score</CardTitle>
          <AddScoreDialog creatorId={creatorId} weights={weights} thresholds={thresholds} />
        </CardHeader>
        <CardContent>
          {latest ? (
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
              <ScoreRing
                percentage={latest.totalScore}
                grade={latest.grade}
                color={RECOMMENDATION_COLORS[latest.recommendation as Recommendation] ?? "var(--color-primary)"}
              />
              <div className="space-y-2 text-center sm:text-left">
                <RecommendationBadge recommendation={latest.recommendation} />
                <p className="text-sm text-muted-foreground">Last scored {formatDate(latest.createdAt)}</p>
                {latest.scoredBy?.name && (
                  <p className="text-xs text-muted-foreground">by {latest.scoredBy.name}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              This creator hasn&apos;t been scored yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score History</CardTitle>
        </CardHeader>
        <CardContent>
          {scores.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No score history yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Trust</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Reach</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.map((score) => (
                  <TableRow key={score.id}>
                    <TableCell className="text-sm">{formatDate(score.createdAt)}</TableCell>
                    <TableCell>{score.audienceFit}</TableCell>
                    <TableCell>{score.trustCredibility}</TableCell>
                    <TableCell>{score.contentQuality}</TableCell>
                    <TableCell>{score.costEfficiency}</TableCell>
                    <TableCell>{score.reach}</TableCell>
                    <TableCell className="font-semibold">{Math.round(score.totalScore)}</TableCell>
                    <TableCell>
                      <RecommendationBadge recommendation={score.recommendation} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
