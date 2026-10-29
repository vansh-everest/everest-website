#!/usr/bin/env node
/**
 * Tells the Content Engine WhatsApp group that a daily post run failed, and why. run.sh calls it
 * after a failed run with the month's log and the line count the log had before the run, so only
 * this run's lines are read.
 *
 * Sent through WA_BOT's send API on this box (the same one blog-watch announces posts with). One
 * message per error per day: a retry that fails the same way stays quiet, a different error is sent.
 *
 *   node alert.mjs <log file> <first line of this run>
 *
 * Env (.env next to this file): WA_API_SECRET (WA_BOT's API_SECRET); optional WA_SEND_URL
 * (default http://127.0.0.1:8100/send), WA_GROUP (default claudedump, the Content Engine group).
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STATE = path.join(HERE, "logs", "alert.json");

/** The cron runs, UTC hour and minute. Keep in step with the crontab line in deploy.sh. */
const RUNS_UTC = [[4, 20], [5, 20], [7, 20], [9, 20], [11, 20]];

/** Known failures and what fixes them. */
const FIXES = [
  [/no credits remaining|insufficient_quota|billing/i, "Add credits to the OpenAI account (platform.openai.com, Billing)."],
  [/OpenAI .*\b401\b|invalid_api_key|Incorrect API key/i, "The OpenAI key was refused: replace OPENAI_API_KEY in the server's .env."],
  [/GitHub .*\b401\b|Bad credentials/i, "The GitHub token has expired: replace it with scripts/autoblog/settoken.sh."],
  [/GitHub .*\b(403|404)\b/i, "The GitHub token lost access to the website repo: check it in GitHub settings."],
];

await loadEnv(path.join(HERE, ".env"));

const [logFile, startArg] = process.argv.slice(2);
const secret = process.env.WA_API_SECRET || "";
const sendUrl = process.env.WA_SEND_URL || "http://127.0.0.1:8100/send";
const group = process.env.WA_GROUP || "claudedump";

main().catch((error) => {
  log(`alert failed: ${error.message}`);
});

async function main() {
  if (!secret) return log("alert: WA_API_SECRET is not set; nothing sent");
  const lines = (await readFile(logFile, "utf8").catch(() => "")).split("\n").slice(Number(startArg) || 0);
  const error = failure(lines);
  const now = new Date();
  const today = istDate(now);

  const last = JSON.parse(await readFile(STATE, "utf8").catch(() => "{}"));
  if (last.date === today && last.error === error) return log("alert: same error already sent today");

  const fix = FIXES.find(([pattern]) => pattern.test(error))?.[1];
  const next = nextRun(now);
  const text = [
    "Daily blog post failed",
    `Run: ${istDate(now, { day: "numeric", month: "short" })}, ${istTime(now)} IST`,
    `Error: ${error}`,
    fix ? `Fix: ${fix}` : null,
    `Next try: ${next ? `${istTime(next)} IST` : "none today"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch(sendUrl, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-secret": secret },
    body: JSON.stringify({ group, text }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) return log(`alert: send API answered ${res.status} ${await res.text()}`);
  await writeFile(STATE, JSON.stringify({ date: today, error }));
  log(`alert: sent to ${group}`);
}

/** This run's error: the FAILED line's message, else the last error-looking line (a crash). */
function failure(lines) {
  const failed = lines.find((l) => / FAILED: /.test(l));
  const raw = failed
    ? failed.replace(/^.*? FAILED: (Error: )?/, "")
    : [...lines].reverse().find((l) => /error|exception|killed|not found/i.test(l)) ?? "the run stopped without logging an error";
  const clean = raw.replace(/^\S+Z\s+/, "").replace(/\s+/g, " ").trim();
  return clean.length > 300 ? `${clean.slice(0, 297)}...` : clean;
}

/** The next cron run, if it still falls on today's date in India. */
function nextRun(now) {
  for (const offset of [0, 1]) {
    for (const [hour, minute] of RUNS_UTC) {
      const at = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offset, hour, minute));
      if (at > now) return istDate(at) === istDate(now) ? at : null;
    }
  }
  return null;
}

function istDate(date, parts = { year: "numeric", month: "2-digit", day: "2-digit" }) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...parts }).format(date);
}

function istTime(date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }).format(date);
}

function log(message) {
  console.log(`${new Date().toISOString()} ${message}`);
}

async function loadEnv(file) {
  const text = await readFile(file, "utf8").catch(() => "");
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
