/**
 * Tells Bing (and the other IndexNow engines) about every address in the live sitemap, in place of
 * waiting for a recrawl. ChatGPT search draws on Bing's index, so new pages reach it sooner.
 * Run after a deploy that adds pages: node scripts/indexnow.mjs
 * The key is public by design: IndexNow checks that public/<key>.txt holds it.
 */
const HOST = "everestfleet.com";
const KEY = "f7ab7440bfa1a748f17c31d192273d63";

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`${urlList.length} addresses sent, IndexNow answered ${res.status}`);
if (!res.ok && res.status !== 202) process.exit(1);
