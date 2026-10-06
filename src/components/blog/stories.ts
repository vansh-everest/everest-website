/**
 * Driver testimonials from the blog design, English only.
 * The design links each one to a long-form story whose interview is still pending; the link
 * appears once a story page exists.
 */
export type Story = {
  badge: string;
  tone: "lime" | "sun" | "sky";
  quote: string;
  initials: string;
  name: string;
  meta: string;
  href?: string;
};

export const STORIES: Story[] = [
  {
    badge: "20 cars",
    tone: "lime",
    quote: "From being a driver, I became a businessman — assigning drivers to cars, and earning more.",
    initials: "PK",
    name: "Pankaj Kumar Gupta",
    meta: "Driver → fleet operator · 1 year",
  },
  {
    badge: "2.5 years",
    tone: "sun",
    quote: "Breakdowns are repaired within 24 hours, and servicing is on time. No worries.",
    initials: "SK",
    name: "Shabbir Khan",
    meta: "Driver · Mumbai",
  },
  {
    badge: "Freedom",
    tone: "sky",
    quote: "I can log in and out at my convenience. There is no pressure to be online all the time.",
    initials: "AT",
    name: "Anand Tiwari",
    meta: "Driver · 1.5 years",
  },
];

/** Guide order on the index, by post slug. Posts not listed here are not shown as guides. */
export const GUIDE_SLUGS = ["rent-or-own-a-car", "how-weekly-payouts-work", "documents-to-drive-an-uber"];
