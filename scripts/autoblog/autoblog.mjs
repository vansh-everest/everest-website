#!/usr/bin/env node
/**
 * The daily blog post, run by cron on the everest-intercity EC2 (see README.md).
 *
 * 1. Reads the posts already published from GitHub, and stops if today's is there, so a rerun
 *    never posts twice.
 * 2. Collects the last three days' headlines from Google News for the topics drivers care about.
 * 3. Asks OpenAI, with web search, to pick one story, read the reporting and write the post, citing
 *    only pages it actually opened.
 * 4. Generates a cover photograph.
 * 5. Commits the post (src/content/auto-posts.json) and the cover (public/blog/auto/) to the
 *    website repo in one commit. Amplify builds that commit and the post is live.
 *
 * Node 22, no dependencies. `--dry-run` writes the post and cover to ./out instead of committing.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DRY_RUN = process.argv.includes("--dry-run");

await loadEnv(path.join(HERE, ".env"));

const CONFIG = {
  openaiKey: required("OPENAI_API_KEY"),
  githubToken: DRY_RUN ? process.env.GITHUB_TOKEN ?? "" : required("GITHUB_TOKEN"),
  repo: process.env.GITHUB_REPO || "EverestFleetOrg/everestfleet-website",
  branch: process.env.GITHUB_BRANCH || "main",
  textModel: process.env.TEXT_MODEL || "gpt-5.5",
  imageModel: process.env.IMAGE_MODEL || "gpt-image-2",
  fallbackImageModel: "gpt-image-1",
  reviewModel: process.env.REVIEW_MODEL || "gpt-5.4-mini",
};

const POSTS_PATH = "src/content/auto-posts.json";
const COVER_DIR = "public/blog/auto";

const TOPICS = [
  "CNG price India",
  "petrol diesel price India",
  "EV charging stations India",
  "new CNG car launch India",
  "electric taxi India",
  "driving licence rules India",
  "FASTag rules",
  "e-Shram gig workers registration",
  "gig workers welfare scheme India",
  "airport cab pickup India",
  "Uber India drivers",
  "road safety drivers India",
  "Everest Fleet",
];

/** For days when no news fits: a practical guide, still written from official pages. */
const EVERGREEN = [
  "how to renew a driving licence or apply for a badge on Parivahan",
  "how to register on e-Shram and what the card gives a driver",
  "keeping a CNG car in good shape: cylinder testing, servicing and refuelling",
  "the documents to carry on every trip and how DigiLocker copies are treated",
  "how FASTag balance, KYC and toll deductions work",
  "PUC certificates: how often, where, and what a check costs",
  "driving safely at night and on highways",
  "looking after a car in the monsoon, summer or winter heat",
  "accident insurance and health cover options for gig workers",
  "how to handle a traffic challan and pay it online",
];

main().catch((error) => {
  log(`FAILED: ${error.stack || error.message}`);
  process.exit(1);
});

async function main() {
  const today = istDate();
  log(`run for ${today}${DRY_RUN ? " (dry run)" : ""}`);

  const existing = await readPublishedPosts();
  if (existing.some((p) => p.date === today) && !DRY_RUN) {
    log("today's post is already published; nothing to do");
    return;
  }

  const headlines = await collectHeadlines();
  log(`${headlines.length} headlines from the last three days`);

  let draft;
  let post;
  const refusals = [];
  for (let attempt = 1; !post; attempt++) {
    draft = await writePost({ headlines, existing, today, refusals });
    try {
      post = finalise(draft, existing, today);
      await secondRead(post);
    } catch (error) {
      post = undefined;
      log(`draft ${attempt} "${draft.title}": ${error.message}`);
      if (attempt === 3) throw error;
      refusals.push(`"${draft.title}" was refused: ${error.message.replace(/^post refused: /, "")}. Pick a different, uncontroversial topic.`);
    }
  }
  log(`post: "${post.title}" (${wordCount(post)} words, ${post.sources.length} sources) -> /blog/${post.slug}/`);

  const cover = await makeCover(draft.image_prompt);
  log(`cover: ${(cover.length / 1024).toFixed(0)} KB`);

  if (DRY_RUN) {
    const out = path.join(HERE, "out");
    await mkdir(out, { recursive: true });
    await writeFile(path.join(out, `${post.slug}.json`), JSON.stringify(post, null, 2));
    await writeFile(path.join(out, `${post.slug}.webp`), cover);
    log(`dry run: wrote out/${post.slug}.json and out/${post.slug}.webp`);
    return;
  }

  const commit = await commitPost(post, cover);
  log(`committed ${commit.slice(0, 7)} to ${CONFIG.repo}@${CONFIG.branch}; Amplify builds it next`);
}

/* --------------------------------------------------------------------------- news */

async function collectHeadlines() {
  const seen = new Set();
  const all = [];
  for (const topic of TOPICS) {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${topic} when:3d`)}&hl=en-IN&gl=IN&ceid=IN:en`;
    try {
      const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (everest-autoblog)" }, signal: AbortSignal.timeout(15_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      for (const item of parseRss(await res.text()).slice(0, 8)) {
        const key = item.title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        all.push({ ...item, topic });
      }
    } catch (error) {
      log(`news for "${topic}" failed: ${error.message}`);
    }
  }
  return all.slice(0, 60);
}

function parseRss(xml) {
  const items = [];
  for (const [, block] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const tag = (name) => decode(block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? "");
    const title = tag("title");
    if (!title) continue;
    items.push({ title, source: tag("source"), published: tag("pubDate") });
  }
  return items;
}

function decode(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

/* -------------------------------------------------------------------------- writing */

const POST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["slug", "title", "excerpt", "body", "image_prompt", "image_alt", "sources"],
  properties: {
    slug: { type: "string", description: "lowercase-kebab-case, at most 70 characters" },
    title: { type: "string", description: "40 to 80 characters" },
    excerpt: { type: "string", description: "one sentence, at most 160 characters" },
    body: {
      type: "array",
      items: { type: "string" },
      description: "paragraphs in order; a subheading is its own item starting with '## '",
    },
    image_prompt: { type: "string" },
    image_alt: { type: "string", description: "plain description of the cover, at most 120 characters" },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "url"],
        properties: { title: { type: "string" }, url: { type: "string" } },
      },
    },
  },
};

const INSTRUCTIONS = `You write the daily post for the blog of Everest Fleet, an Uber fleet partner in India that puts drivers in cars on monthly plans. Readers are cab drivers in Indian cities (Uber, Ola, Rapido and others), people thinking about driving as a job, and car owners. They read on a phone, often in their second language.

Your job today:
1. Pick ONE topic that gives these readers useful, practical information. Best is a recent development (last 3 days) from the candidate headlines that changes something in a driver's working day: fuel, CNG and EV charging prices, new charging stations or CNG pumps, new or changed rules explained (licences, permits, FASTag, PUC, challans), airport or city pickup arrangements, new roads and expressways opening, welfare schemes and how to register, insurance cover, new cars suited to cab work, app features for drivers, seasonal demand such as festivals. Prefer stories about cars and cab drivers over two-wheelers. Skip anything already covered by the recent posts listed. If no headline fits, write a practical guide on one of these: ${EVERGREEN.join("; ")}.
2. Never pick a controversial story. That means no police cases, FIRs, arrests, court cases, lawsuits, crimes, accidents or deaths, strikes, protests, bans or crackdowns, disputes between companies, unions or governments, political fights, layoffs, or stories that put any company, person or group in a bad light. When a story has a controversial side, leave that side out entirely and only write the information part, or pick another story.
3. Use web search to open and read at least two reliable pages on it (government and official sites first, then national and business papers, company announcements).
4. Write the post.

Rules for the post:
- 600 to 850 words. Plain English, short sentences, short paragraphs (2 to 4 sentences). Write for a driver, address them as "you".
- State each fact once. When several outlets report the same detail, give it once and name one of them; do not retell the story outlet by outlet.
- Information first, like a helpful guide rather than a news report. Structure: an opening paragraph saying what changed (or what the guide covers) in one or two sentences; then 3 or 4 subheadings, each its own body item starting with "## ", covering what it is, who it applies to, the key dates and figures, and the steps a driver can take (where to apply, what to carry, what to check). Steps are written as sentences, not a list.
- Name officials, union leaders and private people only when the information depends on it; usually a department or company name is enough.
- Every fact, number, date and name comes from a page you opened. Name the publisher when giving a figure ("according to The Hindu"). If a detail is unclear, leave it out. Never invent quotes, numbers or people.
- Paraphrase. Never copy more than one short sentence from a source, and put any quote in quotation marks with its speaker.
- Calm, neutral, helpful tone. No hype, no alarm, no opinion, no rhetorical questions, no exclamation marks, no em dashes, no emojis, no markdown other than the "## " subheadings (no bold, no lists, no links in the text).
- Everest Fleet may appear at most once, as the final sentence of the post, by name and only as a place drivers can go for a car. Never state or suggest any Everest Fleet price, rent, deposit, fee, payout, earnings figure, guarantee or promise. Never claim Everest Fleet said or did anything.
- Do not criticise Uber or any company beyond what the reports state. No legal or financial advice.
- title: clear and specific, says what the reader will learn, 40 to 80 characters, no clickbait, no colon-heavy SEO stuffing.
- excerpt: one sentence on what a driver gets from reading it.
- slug: lowercase words joined by hyphens, from the title, at most 70 characters.
- sources: 2 to 5 pages you actually opened, each with the article's own headline as title and its full URL. Only URLs you visited in this session.
- image_prompt: a realistic editorial photograph that fits the story, set in an Indian city: for example a cab on a city road, a CNG station, an EV charging point, an airport pickup lane, a driver checking a phone beside a car. Calm and everyday; no police, crowds, protests or damaged vehicles. Natural light, documentary style, 3:2 landscape. No text, no signage with readable words, no logos or brand marks, no number plates, no recognisable faces (people far away or from behind).
- image_alt: what the photo shows, plainly.`;

async function writePost({ headlines, existing, today, refusals = [] }) {
  const recent = existing.slice(0, 30).map((p) => `- ${p.date}: ${p.title}`).join("\n") || "- none yet";
  const candidates = headlines.map((h) => `- ${h.title}${h.source ? ` (${h.source})` : ""}${h.published ? `, ${h.published}` : ""}`).join("\n") || "- none (search yourself)";
  const refused = refusals.length ? `\n\nEarlier drafts today, do not repeat them:\n${refusals.map((r) => `- ${r}`).join("\n")}` : "";
  const input = `Today is ${today} (India).\n\nRecent posts, do not repeat these stories:\n${recent}\n\nCandidate headlines from Google News, last 3 days:\n${candidates}${refused}`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await openai("/v1/responses", {
        model: CONFIG.textModel,
        instructions: INSTRUCTIONS,
        input,
        tools: [{ type: "web_search", user_location: { type: "approximate", country: "IN" } }],
        include: ["web_search_call.action.sources"],
        reasoning: { effort: "medium" },
        text: { format: { type: "json_schema", name: "blog_post", strict: true, schema: POST_SCHEMA } },
      }, 600_000);
      const draft = JSON.parse(outputText(res));
      draft.sources = verifiedSources(draft.sources, res);
      if (draft.sources.length < 1) throw new Error("none of the cited sources were pages the search opened");
      return draft;
    } catch (error) {
      log(`writing attempt ${attempt} failed: ${error.message}`);
      if (attempt === 2) throw error;
    }
  }
}

function outputText(res) {
  if (typeof res.output_text === "string" && res.output_text) return res.output_text;
  for (const item of res.output ?? []) {
    if (item.type !== "message") continue;
    for (const part of item.content ?? []) if (part.type === "output_text" && part.text) return part.text;
  }
  throw new Error(`no text in the response (status ${res.status})`);
}

/** Keeps the cited pages the search actually returned or opened; drops anything else. */
function verifiedSources(sources, res) {
  const consulted = new Set();
  for (const item of res.output ?? []) {
    if (item.type === "web_search_call") {
      for (const s of item.action?.sources ?? []) if (s.url) consulted.add(normalUrl(s.url));
      if (item.action?.url) consulted.add(normalUrl(item.action.url));
    }
    if (item.type === "message") {
      for (const part of item.content ?? []) for (const a of part.annotations ?? []) if (a.url) consulted.add(normalUrl(a.url));
    }
  }
  const kept = [];
  for (const source of sources ?? []) {
    if (!/^https:\/\//.test(source.url)) continue;
    if (consulted.has(normalUrl(source.url))) kept.push({ title: source.title.trim(), url: cleanUrl(source.url) });
    else log(`dropped a source the search did not return: ${source.url}`);
  }
  return kept.slice(0, 5);
}

/** Drops tracking parameters and doubled slashes. */
function cleanUrl(url) {
  const u = new URL(url);
  for (const key of [...u.searchParams.keys()]) if (/^utm_|^fbclid$|^gclid$/.test(key)) u.searchParams.delete(key);
  u.pathname = u.pathname.replace(/\/{2,}/g, "/");
  return u.toString();
}

function normalUrl(url) {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return url;
  }
}

/* ------------------------------------------------------------------------- checking */

const PLAIN = (text) =>
  text
    .replace(/\*\*|__|`/g, "")
    .replace(/\s*—\s*/g, ", ")
    .replace(/–/g, "-")
    .replace(/\s+/g, " ")
    .trim();

/** A story a reader would see as a dispute or a crime, judged from the title and excerpt. */
const CONTROVERSY = /\b(fir|arrest\w*|police case|booked (by|for|under)|court|lawsuit|sued|petition|probe|crackdown|ban(s|ned|ning)?|strike\w*|protest\w*|agitation|boycott|accident\w*|crash\w*|injur\w*|killed|dead|death\w*|murder|assault\w*|harass\w*|molest\w*|scam\w*|scandal\w*|fraud\w*|theft|stolen|raid\w*|seiz\w*|illegal\w*|unauthori[sz]ed|alleged\w*|accused|complaint\w*|suspend\w*|fined|clash\w*|dispute\w*|row|slams?|outrage|tragedy|controvers\w*|layoff\w*)\b/i;

/**
 * The same, for the body, where an information post can mention one of these in passing ("accident
 * cover", "beware of FASTag fraud"); a second one means the story is about it.
 */
const CONTROVERSY_BODY = /\b(fir|arrest\w*|police case|booked (by|for|under)|lawsuit|sued|probe|crackdown|strike\w*|protest\w*|agitation|boycott|killed|murder|assault\w*|harass\w*|molest\w*|scam\w*|scandal\w*|fraud\w*|theft|raid\w*|seiz\w*|illegal\w*|unauthori[sz]ed|alleged\w*|accused|suspend\w*|clash\w*|outrage|tragedy|controvers\w*|layoff\w*)\b/gi;

/** Any figure or money word; checked around every mention of Everest. */
const MONEY = /₹|\brs\b|\binr\b|\d|\b(rent\w*|deposit\w*|fee|fees|free|price\w*|cost\w*|cheap\w*|lowest|guarantee\w*|income|earn\w*|payout\w*|salary|emi|per day|discount\w*|offer\w*)\b/i;

/** Sentences, without breaking at "Rs." or "Pvt." */
const sentences = (text) => text.replace(/\b(Rs|Pvt|Ltd|No|Dr|Mr|Ms)\./g, "$1").split(/(?<=[.!?])\s+/);

function finalise(draft, existing, today) {
  const body = draft.body.map(PLAIN).filter(Boolean);
  const title = PLAIN(draft.title).replace(/[.!]+$/, "");
  const excerpt = PLAIN(draft.excerpt);
  const post = {
    slug: uniqueSlug(draft.slug || title, existing),
    locale: "en",
    title,
    excerpt,
    body,
    published: true,
    date: today,
    coverImage: { label: "Daily post cover", url: "", alt: PLAIN(draft.image_alt).slice(0, 160) },
    sources: draft.sources,
  };
  post.coverImage.url = `/blog/auto/${post.slug}.webp`;

  const problems = [];
  const words = wordCount(post);
  if (words < 450 || words > 1100) problems.push(`${words} words`);
  if (title.length < 20 || title.length > 100) problems.push(`title is ${title.length} characters`);
  if (!excerpt || excerpt.length > 220) problems.push("excerpt length");
  if (body.filter((p) => !p.startsWith("## ")).length < 6) problems.push("too few paragraphs");
  if (body.some((p) => /^[-*•]\s|\[[^\]]+\]\(/.test(p))) problems.push("list or link markup in the body");
  const loaded = `${title} ${excerpt}`.match(CONTROVERSY);
  if (loaded) problems.push(`reads as a controversial story ("${loaded[0]}")`);
  const heavy = body.join(" ").match(CONTROVERSY_BODY) ?? [];
  if (heavy.length >= 2) problems.push(`the body is about a dispute or crime ("${heavy.slice(0, 3).join('", "')}")`);
  if (/everest/i.test(`${title} ${excerpt}`)) problems.push("Everest in the title or excerpt");
  const text = sentences(body.join(" "));
  const mentions = text.flatMap((sentence, i) => (/everest/i.test(sentence) ? [i] : []));
  if (mentions.length > 1) problems.push(`Everest mentioned ${mentions.length} times`);
  // The sentence naming Everest and the one after it carry no figure, so no price can attach to it.
  const priced = mentions.find((i) => MONEY.test(text[i]) || MONEY.test(text[i + 1] ?? ""));
  if (priced !== undefined) problems.push(`a figure next to Everest: "${text[priced]}"`);
  const usedUrls = new Set(existing.flatMap((p) => (p.sources ?? []).map((s) => normalUrl(s.url))));
  if (post.sources.every((s) => usedUrls.has(normalUrl(s.url)))) problems.push("every source was already used by an earlier post");
  if (problems.length) throw new Error(`post refused: ${problems.join("; ")}`);
  return post;
}

const SECOND_READ = {
  type: "object",
  additionalProperties: false,
  required: ["controversial", "everest_offer", "reason"],
  properties: {
    controversial: { type: "boolean" },
    everest_offer: { type: "boolean" },
    reason: { type: "string" },
  },
};

/** A separate model reads the finished post the way an Everest manager would, and can refuse it. */
async function secondRead(post) {
  const res = await openai("/v1/responses", {
    model: CONFIG.reviewModel,
    instructions: `You check a blog post before it is published on Everest Fleet's website, read by cab drivers.
controversial: true if the post is about, or dwells on, a crime, police or court action, an accident, a strike or protest, a ban or crackdown, a dispute, or anything that puts a company, person, union or government in a bad light. A passing mention inside a practical guide (insurance that covers accidents, how to avoid fraud) is not controversial.
everest_offer: true if the post states or suggests any Everest Fleet price, rent, deposit, fee, earnings, payout, discount, guarantee or promise, or claims Everest Fleet said or did something. One closing sentence that names Everest Fleet as a place drivers can go for a car, with no figure or promise, is allowed: that alone is false.
reason: one short sentence.`,
    input: `${post.title}\n\n${post.excerpt}\n\n${post.body.join("\n\n")}`,
    reasoning: { effort: "low" },
    text: { format: { type: "json_schema", name: "second_read", strict: true, schema: SECOND_READ } },
  }, 120_000);
  const verdict = JSON.parse(outputText(res));
  if (verdict.controversial || verdict.everest_offer) {
    throw new Error(`post refused by the second read: ${verdict.reason}`);
  }
}

function wordCount(post) {
  return post.body.join(" ").split(/\s+/).filter(Boolean).length;
}

function uniqueSlug(raw, existing) {
  let base = raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Cut at a whole word.
  if (base.length > 70) base = base.slice(0, 70).replace(/-[^-]*$/, "");
  base ||= "daily-post";
  const taken = new Set(existing.map((p) => p.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

/* ---------------------------------------------------------------------------- cover */

async function makeCover(prompt) {
  const full = `${prompt}\n\nPhotorealistic, editorial, no text, no logos, no number plates, no recognisable faces.`;
  for (const model of [CONFIG.imageModel, CONFIG.fallbackImageModel]) {
    try {
      const res = await openai("/v1/images/generations", {
        model,
        prompt: full,
        size: "1536x1024",
        quality: "medium",
        output_format: "webp",
        output_compression: 80,
        n: 1,
      }, 300_000);
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error("no image in the response");
      return Buffer.from(b64, "base64");
    } catch (error) {
      log(`cover with ${model} failed: ${error.message}`);
    }
  }
  throw new Error("no cover could be generated");
}

/* --------------------------------------------------------------------------- GitHub */

async function github(method, route, body, accept = "application/vnd.github+json") {
  const res = await fetch(`https://api.github.com${route}`, {
    method,
    headers: {
      authorization: `Bearer ${CONFIG.githubToken}`,
      accept,
      "x-github-api-version": "2022-11-28",
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60_000),
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const error = new Error(`GitHub ${method} ${route}: ${res.status} ${json.message ?? text.slice(0, 200)}`);
    error.status = res.status;
    throw error;
  }
  return json;
}

async function postsAt(ref) {
  try {
    // The raw form: the JSON form leaves `content` empty once the file passes 1 MB.
    return await github("GET", `/repos/${CONFIG.repo}/contents/${POSTS_PATH}?ref=${ref}`, undefined, "application/vnd.github.raw+json");
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

async function readPublishedPosts() {
  if (!CONFIG.githubToken) {
    // A dry run without a token reads the file from a local checkout, if there is one.
    const local = path.join(HERE, "..", "..", POSTS_PATH);
    return JSON.parse(await readFile(local, "utf8").catch(() => "[]"));
  }
  return postsAt(CONFIG.branch);
}

/** One commit with the post and its cover. A push that lands first is picked up and retried. */
async function commitPost(post, cover) {
  const repo = `/repos/${CONFIG.repo}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const ref = await github("GET", `${repo}/git/ref/heads/${CONFIG.branch}`);
    const head = ref.object.sha;
    const posts = await postsAt(head);
    if (posts.some((p) => p.date === post.date)) throw new Error("a post for today landed while this one was being written");
    const next = [post, ...posts.filter((p) => p.slug !== post.slug)];

    const [imageBlob, postsBlob] = await Promise.all([
      github("POST", `${repo}/git/blobs`, { content: cover.toString("base64"), encoding: "base64" }),
      github("POST", `${repo}/git/blobs`, { content: `${JSON.stringify(next, null, 2)}\n`, encoding: "utf-8" }),
    ]);
    const baseTree = (await github("GET", `${repo}/git/commits/${head}`)).tree.sha;
    const tree = await github("POST", `${repo}/git/trees`, {
      base_tree: baseTree,
      tree: [
        { path: `${COVER_DIR}/${post.slug}.webp`, mode: "100644", type: "blob", sha: imageBlob.sha },
        { path: POSTS_PATH, mode: "100644", type: "blob", sha: postsBlob.sha },
      ],
    });
    const commit = await github("POST", `${repo}/git/commits`, {
      message: `content: daily blog post, ${post.title}\n\nWritten by scripts/autoblog on the everest-intercity EC2.\nSources:\n${post.sources.map((s) => `- ${s.url}`).join("\n")}`,
      tree: tree.sha,
      parents: [head],
    });
    try {
      await github("PATCH", `${repo}/git/refs/heads/${CONFIG.branch}`, { sha: commit.sha, force: false });
      return commit.sha;
    } catch (error) {
      if (error.status !== 422 || attempt === 3) throw error;
      log(`${CONFIG.branch} moved while committing; retrying`);
    }
  }
}

/* ---------------------------------------------------------------------------- utils */

async function openai(route, body, timeout) {
  const res = await fetch(`https://api.openai.com${route}`, {
    method: "POST",
    headers: { authorization: `Bearer ${CONFIG.openaiKey}`, "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`OpenAI ${route}: ${res.status} ${json.error?.message ?? ""}`);
  return json;
}

function istDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function log(message) {
  console.log(`${new Date().toISOString()} ${message}`);
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    log(`missing ${name} (set it in ${path.join(HERE, ".env")})`);
    process.exit(2);
  }
  return value;
}

async function loadEnv(file) {
  const text = await readFile(file, "utf8").catch(() => "");
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
