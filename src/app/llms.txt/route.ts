import { WHATSAPP_HREF } from "@/components/home/ui";
import { getDictionary } from "@/content/dictionary";
import { COMPANY, COMPANY_BLURB, SITE_URL } from "@/lib/company";
import { cityPath } from "@/lib/city-route";
import { planFor, rupees } from "@/lib/content";
import { blogPostsFor } from "@/lib/blog-posts";
import { EXTRA_LOCALES, localePath, type ExtraLocale } from "@/lib/i18n";
import { NEWS, newsDate, newsPath } from "@/lib/news";
import { PLAN_PAGES } from "@/lib/plan-pages";
import { getLiveData } from "@/lib/fleet-data";
import { CONTACT_ROOT, FLEET_ROOT, RENT_ROOT, contactPath, fleetPath, rentPath } from "@/lib/search-pages";
import { allCityFacts, listNames } from "@/lib/seo-data";
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
  const [content, live] = await Promise.all([getContent(), getLiveData()]);
  const dict = getDictionary("en");
  const facts = allCityFacts(content, live);
  const rent = facts.map((c) => {
    const cars = listNames(c.cars.map((x) => x.name));
    return `- [Car on rent for Uber in ${c.name}](${link(rentPath(c.slug))})${cars ? `: ${cars}` : ""}${c.hubs.length ? `; ${c.hubs.length} hubs` : ""}`;
  });
  const fleet = facts.map((c) => `- [Uber fleet in ${c.name}](${link(fleetPath(c.slug))})${c.readyCars ? `: ${c.readyCars.toLocaleString("en-IN")} cars ready` : ""}${c.hubs.length ? `; ${c.hubs.length} hubs` : ""}`);
  const contact = facts.map((c) => `- [Driver job contact number, ${c.name}](${link(contactPath(c.slug))})${c.phone ? `: ${c.phone.display}` : ""}`);
  const cities = content.cities.map((c) => c.name.en);

  const plans = PLAN_PAGES.flatMap(({ path, planId }) => {
    const plan = planFor(content, planId);
    if (!plan?.visible) return [];
    const figures = [
      plan.price.upfront && `upfront ${rupees(plan.price.upfront)}`,
      !plan.price.upfront && plan.price.deposit && `deposit ${rupees(plan.price.deposit)}`,
    ].filter(Boolean);
    const line = figures.join(", ");
    const summary = [plan.summary.en, line ? `${line[0].toUpperCase()}${line.slice(1)}.` : ""].filter(Boolean).join(" ");
    return [`- [${plan.name.en}](${link(path)})${summary ? `: ${summary}` : ""}`];
  });

  const guides = blogPostsFor(content, "en").map((p) => `- [${p.title}](${link(`/blog/${p.slug}`)})${p.excerpt ? `: ${p.excerpt}` : ""}`);

  const lines = [
    "# Everest Fleet",
    "",
    `> ${COMPANY_BLURB}`,
    "",
    `Everest Fleet offers driver jobs in ${cities.join(", ")}. It gives the driver a car, the insurance and the permit to drive on Uber, and pays out every week. Drivers can drive on a refundable deposit or own the car at the end of a plan.`,
    "",
    "## Driver guides",
    `- [Uber driver requirements in India](${link("/uber-driver-requirements")}): documents, licence, and driving on Uber without a car`,
    `- [Drive for Uber without a car](${link("/drive-for-uber-without-a-car")}): getting a car from a fleet partner, plans and documents`,
    `- [Fleet management company](${link("/fleet-management-company")}): Everest Fleet across India, by city`,
    `- [EV driver jobs](${link("/ev-driver-jobs")}): electric cars on Uber by city`,
    "",
    "## Car on rent for Uber",
    `- [All cities](${link(RENT_ROOT)})`,
    ...rent,
    "",
    "## Uber fleet partner by city",
    `- [Uber fleet partner](${link(FLEET_ROOT)}): what driving with a fleet partner means`,
    ...fleet,
    "",
    "## Driver job contact numbers",
    `- [All cities](${link(CONTACT_ROOT)})`,
    ...contact,
    "",
    "## Driver jobs",
    `- [Driver jobs in all cities](${link("/drive-with-us")}): plans, hubs and how to apply`,
    ...content.cities.map((c) => `- [Driver job in ${c.name.en}](${link(cityPath(c.slug))})`),
    ...EXTRA_LOCALES.map((l) => `- ${LANGUAGE_NAMES[l]}: ${link(localePath(l, "/drive-with-us"))}`),
    "",
    "## How to apply",
    `- Online: the form on any driver job page, three fields (name, mobile number, city)`,
    `- Phone: ${COMPANY.phone}`,
    `- Email: ${COMPANY.email}`,
    `- WhatsApp: ${WHATSAPP_HREF}`,
    `- Documents to bring: ${dict.documents.join(", ")}`,
    "",
    "## Plans",
    `- [All plans compared](${link("/our-plans")})`,
    ...plans,
    "",
    ...(guides.length ? ["## Driver guides", ...guides, ""] : []),
    "## Refer a driver",
    `- [Everest Dost](${link("/everest-dost")}): refer drivers through the Everest Dost app and get paid at every milestone, from car allotted to trip targets`,
    "",
    "## Services for businesses",
    `- [All services](${link("/our-services")}): fleet logistics, employee mobility, intercity travel and advertising on cars`,
    `- [Fleet Logistics](${link("/fleet-logistics")}): chilled, frozen and ambient delivery vans, tracked live on every trip`,
    `- [Employee Mobility](${link("/employee-mobility")}): electric office cabs with certified drivers, route planning and backup cabs`,
    `- [Intercity](${link("/intercity")}): one way, round trip and multi-way cabs, airport transfers and city rides`,
    `- [Advertise With Us](${link("/advertise-with-us")}): in-cab branding, cab branding and in-cab sampling across ${COMPANY.vehicles} cabs`,
    "",
    "## Company",
    `- [About Everest Fleet](${link("/about-us")}): founded ${COMPANY.founded}, ${COMPANY.vehicles} cars, ${COMPANY.cities} cities (as of ${COMPANY.asOf})`,
    `- [Investors](${link("/investors")}): backers, debt partners, leadership team and milestones`,
    `- [Careers](${link("/careers")}): open roles, employee benefits and life at Everest`,
    `- [FAQ](${link("/faq")})`,
    "",
    "## In the news",
    `- [Newsroom](${link("/newsroom")}): every press story about Everest Fleet`,
    ...NEWS.slice(0, 5).map((p) => `- [${p.title}](${link(newsPath(p.slug))}) (${newsDate(p.date)})`),
    "",
    "## Legal",
    `- [Privacy Policy](${link("/privacy-policy")})`,
    `- [Terms of Service](${link("/terms-of-service")})`,
    `- [App Privacy Policy](${link("/app-privacy-policy")})`,
    `- [Referral Program Terms](${link("/terms-and-conditions-for-referral-program")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
