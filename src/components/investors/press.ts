/**
 * Press coverage, shared by the investors page and the blog.
 *
 * The designs also list "Series C: ₹251.7 crore, led by Uber" (Business Outreach, Sep 2024),
 * "Axis Bank lends ₹100 crore for Everest's EVs" (Inc42, May 2024) and "BII backs Everest Fleet
 * as India EV commitments top $300 Mn". Those headlines carry funding figures with no source in
 * this codebase, so they are left out until the figures are confirmed.
 *
 * PENDING: article links. A story shows its "Read" link only once `url` is set.
 */
export type PressItem = { outlet: string; date: string; title: string; url: string };

export const PRESS: PressItem[] = [
  { outlet: "VCCircle", date: "2024-12-11", title: "BII backs Everest Fleet’s EV growth", url: "" },
  { outlet: "Forbes", date: "2024-12-11", title: "Everest Fleet at Forbes DGEMS 2024", url: "" },
  { outlet: "BW Disrupt", date: "2024-09", title: "Siddharth Ladsariya named in 40 Under 40", url: "" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2024-12-11" reads "11 Dec 2024"; a month-only "2024-09" reads "Sep 2024". */
export function pressDate(date: string, withDay = true): string {
  const [y, m, d] = date.split("-");
  const month = MONTHS[Number(m) - 1] ?? "";
  return withDay && d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`;
}
