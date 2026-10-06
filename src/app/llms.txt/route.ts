import { WHATSAPP_HREF } from "@/components/home/ui";
import { getDictionary } from "@/content/dictionary";
import { COMPANY, COMPANY_BLURB, SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { headline, planFor, postsFor, rupees } from "@/lib/content";
import { EXTRA_LOCALES, localePath, type ExtraLocale } from "@/lib/i18n";
import { PLAN_PAGES } from "@/lib/plan-pages";
import { getContent } from "@/lib/store";

// Rebuilt hourly, so a price published in the admin reaches this file the same day.
export const revalidate = 3600;

const LANGUAGE_NAMES: Record<ExtraLocale, string> = {
  hi: "Hindi",
  mr: "Marathi",
  kn: "Kannada",
  te: "Telugu",
  bn: "Bengali",
  ta: "Tamil",
};

const link = (path: string) => `${SITE_URL}${path.endsWith("/") ? path : `${path}/`}`;

/**
 * /llms.txt: the site in plain Markdown for AI assistants (llmstxt.org). Every figure comes
 * from the same content as the pages, so an assistant quoting this file quotes the site.
 */
export async function GET() {
  const content = await getContent();
  const dict = getDictionary("en");
  const cities = content.cities.map((c) => c.name.en);

  const plans = PLAN_PAGES.flatMap(({ path, planId }) => {
    const plan = planFor(content, planId);
    if (!plan?.visible) return [];
    const figures = [
      headline(plan.price) && `rent from ${headline(plan.price)}`,
      plan.price.upfront && `upfront ${rupees(plan.price.upfront)}`,
      !plan.price.upfront && plan.price.deposit && `deposit ${rupees(plan.price.deposit)}`,
    ].filter(Boolean);
    const line = figures.join(", ");
    const summary = [plan.summary.en, line ? `${line[0].toUpperCase()}${line.slice(1)}.` : ""].filter(Boolean).join(" ");
    return [`- [${plan.name.en}](${link(path)})${summary ? `: ${summary}` : ""}`];
  });

  const guides = postsFor(content, "en").map((p) => `- [${p.title}](${link(`/blog/${p.slug}`)})${p.excerpt ? `: ${p.excerpt}` : ""}`);

  const lines = [
    "# Everest Fleet",
    "",
    `> ${COMPANY_BLURB}`,
    "",
    `Everest Fleet offers driver jobs in ${cities.join(", ")}. It gives the driver a car, the insurance and the permit to drive on Uber, and pays out every week. Drivers can rent the car or own it at the end of a plan.`,
    "",
    "## Driver jobs",
    `- [Driver jobs in all cities](${link("/drive-with-us")}): plans, hubs and how to apply`,
    ...content.cities.map((c) => `- [Driver job in ${c.name.en}](${link(cityPath(c.slug))})`),
    ...EXTRA_LOCALES.map((l) => `- ${LANGUAGE_NAMES[l]}: ${link(localePath(l, "/drive-with-us"))}`),
    "",
    "## How to apply",
    `- Online: the form on any driver job page, three fields (name, mobile number, city)`,
    `- Phone: ${COMPANY.phone}`,
    `- WhatsApp: ${WHATSAPP_HREF}`,
    `- Documents to bring: ${dict.documents.join(", ")}`,
    "",
    "## Plans",
    `- [All plans compared](${link("/our-plans")})`,
    ...plans,
    "",
    ...(guides.length ? ["## Driver guides", ...guides, ""] : []),
    "## Company",
    `- [About Everest Fleet](${link("/about-us")}): founded ${COMPANY.founded}, ${COMPANY.vehicles} cars, ${COMPANY.drivers} drivers, ${COMPANY.cities} cities (as of ${COMPANY.asOf})`,
    `- [Services](${link("/our-services")})`,
    `- [FAQ](${link("/faq")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
