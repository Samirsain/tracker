// Checks the score maths and the auto-suggestions derived from creator metrics.
// Run: node scripts/check-scoring.mjs
import assert from "assert";
import {
  calculateScore,
  suggestScores,
  autoReachScore,
  autoTrustScore,
  autoCostEfficiencyScore,
  DEFAULT_WEIGHTS,
  DEFAULT_THRESHOLDS,
} from "../src/lib/scoring.ts";

// --- weighted total & recommendation bands ---------------------------------
const at = (v) =>
  calculateScore(
    { audienceFit: v, trustCredibility: v, contentQuality: v, costEfficiency: v, reach: v },
    DEFAULT_WEIGHTS,
    DEFAULT_THRESHOLDS
  );

assert.strictEqual(at(5).maxScore, 100, "default weights should total 100 points");
assert.strictEqual(at(5).totalScore, 50);
assert.strictEqual(at(5).recommendation, "Skip");
assert.strictEqual(at(8).totalScore, 80);
assert.strictEqual(at(8).recommendation, "Paid Reel Campaign");
assert.strictEqual(at(10).grade, "A+");
assert.strictEqual(at(10).recommendation, "Founding Ambassador");

// Weighting must beat raw rating sum: audience-heavy loses to nothing, but a
// creator strong only in the light categories must rank below one strong in
// the heavy ones despite an equal rating total.
const heavy = calculateScore(
  { audienceFit: 9, trustCredibility: 9, contentQuality: 5, costEfficiency: 5, reach: 5 },
  DEFAULT_WEIGHTS
);
const light = calculateScore(
  { audienceFit: 5, trustCredibility: 5, contentQuality: 9, costEfficiency: 9, reach: 9 },
  DEFAULT_WEIGHTS
);
assert.ok(heavy.totalScore > light.totalScore, "audience/trust must outweigh content/cost/reach");

// --- inputs are clamped, never trusted blindly -----------------------------
assert.strictEqual(at(99).totalScore, 100, "ratings above 10 must clamp");
assert.strictEqual(at(-5).totalScore, 10, "ratings below 1 must clamp");

// --- auto-suggestions -------------------------------------------------------
assert.strictEqual(autoReachScore({ followers: 0, avgReelViews: 0 }), 0, "no data => no suggestion");
assert.strictEqual(autoTrustScore({ engagementRate: 0, followers: 5000 }), 0, "no data => no suggestion");
assert.strictEqual(autoCostEfficiencyScore({ price: 0, reach: 100000 }), 0, "no price => no suggestion");

// Reach is log-scaled and monotonic.
const reaches = [5_000, 50_000, 500_000, 5_000_000].map((f) => autoReachScore({ followers: f, avgReelViews: 0 }));
assert.deepStrictEqual([...reaches].sort((a, b) => a - b), reaches, "reach score must rise with audience");
assert.ok(reaches.every((r) => r >= 1 && r <= 10), "reach score out of 1-10");

// A mega account at 2% ER must not be scored below a micro account at 2% ER —
// that is the whole point of the per-tier benchmark.
const mega = autoTrustScore({ engagementRate: 2, followers: 5_000_000 });
const micro = autoTrustScore({ engagementRate: 2, followers: 5_000 });
assert.ok(mega > micro, `tier benchmark not applied (mega=${mega}, micro=${micro})`);

// Cheaper reach must score better.
assert.ok(
  autoCostEfficiencyScore({ price: 1000, reach: 1_000_000 }) >
    autoCostEfficiencyScore({ price: 50_000, reach: 1_000_000 }),
  "lower CPM must score higher"
);

// --- end-to-end suggestion from a real-shaped creator row ------------------
const { values, basis } = suggestScores({
  followers: 1_991_556,
  avgReelViews: 1_194_934,
  avgLikes: 50_000,
  avgComments: 1_200,
  engagementRate: 2.67,
  reelPrice: 3201,
  postPrice: null,
  storyPrice: null,
});
assert.deepStrictEqual(Object.keys(values).sort(), ["costEfficiency", "reach", "trustCredibility"]);
assert.ok(!("audienceFit" in values), "Audience Fit must stay manual");
assert.ok(!("contentQuality" in values), "Content Quality must stay manual");
for (const [k, v] of Object.entries(values)) {
  assert.ok(v >= 1 && v <= 10, `${k}=${v} out of 1-10`);
  assert.ok(basis[k], `${k} suggested without an explanation`);
}
console.log("suggested:", values);
console.log("basis:", basis);

console.log("PASS: scoring maths and auto-suggestions behave");
