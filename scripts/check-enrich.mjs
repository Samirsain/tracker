// Integration check for the Instagram enrichment used by /api/ai/enrich-creator.
// Fails if the RapidAPI contract changes or if different usernames start
// returning identical data (the bug this route was rewritten to fix).
// Run: node scripts/check-enrich.mjs
import fs from "fs";
import assert from "assert";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split("\n")
    .map((l) => l.match(/^(\w+)="?([^"]*)"?/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]])
);

const HOST = env.RAPIDAPI_INSTAGRAM_HOST || "instagram120.p.rapidapi.com";
const call = (path, body) =>
  fetch(`https://${HOST}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": env.RAPIDAPI_KEY,
      "x-rapidapi-host": HOST,
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());

const mean = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);

const NICHES = ["FITNESS","DOCTOR","NUTRITIONIST","ATHLETE","LIFESTYLE","BEAUTY","COMEDY","FINANCE","TECHNOLOGY","FOOD","FASHION","OTHER"];

async function askAi(profile) {
  if (!env.OPENAI_API_KEY) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.4-mini",
      messages: [
        { role: "system", content: "You classify Instagram creators for a brand-collaboration CRM. Use only the profile data given. If a field cannot be reasonably inferred, return an empty string rather than guessing. Never invent statistics." },
        { role: "user", content: JSON.stringify(profile) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "creator_profile",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["niche", "language", "gender", "location", "audienceAgeRange", "audienceGenderSplit", "audienceCountry"],
            properties: {
              niche: { type: "string", enum: NICHES },
              language: { type: "string" },
              gender: { type: "string", enum: ["Male", "Female", "Other", ""] },
              location: { type: "string" },
              audienceAgeRange: { type: "string" },
              audienceGenderSplit: { type: "string" },
              audienceCountry: { type: "string" },
            },
          },
        },
      },
    }),
  });
  // Read the body only on failure — building the message eagerly would consume it.
  if (!res.ok) assert.fail(`OpenAI call failed: ${res.status} ${await res.text().catch(() => "")}`);
  const j = await res.json();
  return JSON.parse(j.choices[0].message.content);
}

const seen = [];
const aiSeen = [];
for (const username of ["mkbhd", "carryminati", "virat.kohli"]) {
  const [info, posts] = await Promise.all([
    call("api/instagram/userInfo", { username }),
    call("api/instagram/posts", { username, maxId: "" }),
  ]);

  const user = info?.result?.[0]?.user;
  assert.ok(user?.username, `no user payload for @${username}`);

  const nodes = (posts?.result?.edges || []).map((e) => e.node);
  const avgLikes = mean(nodes.map((n) => Number(n.like_count)).filter(Number.isFinite));
  const avgComments = mean(nodes.map((n) => Number(n.comment_count)).filter(Number.isFinite));
  const followers = Number(user.follower_count) || 0;
  const er = followers > 0 ? Number((((avgLikes + avgComments) / followers) * 100).toFixed(2)) : 0;

  assert.ok(followers > 0, `@${username}: follower_count missing`);
  assert.ok(avgLikes > 0, `@${username}: like_count missing from posts`);
  console.log(`${username.padEnd(14)} ${String(followers).padEnd(11)} avgLikes=${String(avgLikes).padEnd(9)} ER=${er}%`);
  seen.push(`${user.full_name}|${followers}|${avgLikes}|${er}`);

  const ai = await askAi({
    username,
    fullName: user.full_name || "",
    bio: user.biography || "",
    category: user.category || "",
    followers,
    captions: nodes.map((n) => n.caption?.text?.trim()).filter(Boolean).slice(0, 6).map((t) => t.slice(0, 220)),
  });
  if (ai) {
    assert.ok(NICHES.includes(ai.niche), `@${username}: invalid niche "${ai.niche}"`);
    console.log(`  ai -> niche=${ai.niche} lang=${ai.language} gender=${ai.gender} audience=${ai.audienceCountry} ${ai.audienceGenderSplit}`);
    aiSeen.push(JSON.stringify(ai));
  }
}

assert.strictEqual(new Set(seen).size, seen.length, "identical data returned for different usernames");
if (aiSeen.length) {
  assert.strictEqual(new Set(aiSeen).size, aiSeen.length, "AI returned identical output for different creators");
}
console.log("PASS: every username returns distinct real data");
