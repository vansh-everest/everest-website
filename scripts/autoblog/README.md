# Daily blog post

`autoblog.mjs` writes one post a day for /blog/ and commits it to this repo; Amplify builds the
commit and the post is live. It runs from cron on the `everest-intercity` EC2
(i-01f33b2e7b669d803, ap-south-1), in `/home/ubuntu/everest-autoblog`.

What one run does: reads Google News headlines from the last three days for practical driver topics, asks
OpenAI (with web search) to pick one story and write about it from the pages it opened, generates
a cover photo, then commits `src/content/auto-posts.json` and `public/blog/auto/<slug>.webp` in one
commit. A post that is off length, has list markup, or puts Everest next to a price is refused and
nothing is committed.

Posts are information first (fuel and CNG prices, rules explained, charging, airport pickups,
welfare schemes, car care), with a practical guide on days no news fits. Controversial stories
(police cases, court, strikes, protests, bans, accidents, disputes) are excluded in the prompt, and a
title or excerpt that reads like one, or a body that dwells on one, is refused and rewritten, up to
three drafts. A second, cheaper model then reads the finished post and can refuse it for the same
reasons or for any Everest price or promise.

Guides in `SERIES` come before the news, one a day in list order, until each has a post (the post
stores its `series` key). The current series is earning more on ride-hailing apps: best hours, best
areas, ratings, acceptance and cancellation, incentives, airport queues, running costs, a weekly
plan. Each entry carries the phrase drivers search for (Google India autocomplete), which the title
and opening use. To queue more guides, append entries; once the list is used up the bot is back on
the news.

Covers: each day offers the writer three of the 12 `FRAMINGS` (four apart, so consecutive days never
share one) plus a light and car colour on their own cycles, and the prompt bans the stock "person
beside a white car with a phone" shot.

## Schedule

Ubuntu's crontab, server clock in UTC:

```
20 4,5,7,9,11 * * * /home/ubuntu/everest-autoblog/run.sh
```

09:50 IST, so the build is live around 10:00. The 10:50, 12:50, 14:50 and 16:50 runs are retries (an OpenAI outage
or empty credit balance in the morning still gets a post out): each run first checks GitHub for
today's post and exits if it is there.

## Operating it

- Logs: `/home/ubuntu/everest-autoblog/logs/<yyyy-mm>.log`
- Try without publishing: `node autoblog.mjs --dry-run` (writes to `out/`)
- Take a post down: switch it off under Daily posts in the admin's Blog tab and publish. In git,
  set `"published": false` on it in `src/content/auto-posts.json`. A `git revert`
  also works, but before 16:50 IST on its own day the next retry writes a new post for that day.
- Pause: comment out the crontab line (`crontab -e` as ubuntu)
- Keys: `.env` next to the script (see `.env.example`), mode 600
- Update the server copy: `scripts/autoblog/deploy.sh` from a laptop with SSM access
