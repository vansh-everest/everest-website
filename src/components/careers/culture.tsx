import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { IMPACTT, LINKEDIN_URL, VALUES_HREF } from "./data";

const ALT = "The Everest Fleet team in Hyderabad, together in the office";

/** City teams from the old site, 4:3 at 800×600 (files are /figma/careers/city-team-<n>.webp). */
const CITY_TEAMS = [
  "The Everest Fleet team in Hyderabad, together in the office",
  "An Everest Fleet city team outside their hub",
  "An Everest Fleet city team out on the street together",
  "An Everest Fleet city team around a meeting table",
];

/** Desktop: the text in a white card, four city team photos beside it. Phones: the text first, one team photo framed below it. */
export function Culture() {
  return (
    <section className="relative bg-white px-4 pb-5 pt-[23px] lg:h-[632px] lg:bg-[#f5f8fc] lg:p-0">
      <ul className="hidden lg:absolute lg:left-[627px] lg:right-6 lg:top-1/2 lg:grid lg:-translate-y-1/2 lg:grid-cols-2 lg:gap-4 xl:right-[67px]">
        {CITY_TEAMS.map((alt, i) => (
          <li key={alt} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={`/figma/careers/city-team-${i + 1}.webp`} alt={alt} fill sizes="(min-width: 1024px) 374px, 0px" className="object-cover" />
          </li>
        ))}
      </ul>
      <div className="relative lg:absolute lg:left-[67px] lg:top-[118px] lg:w-[520px] lg:rounded-3xl lg:bg-white lg:px-6 lg:pb-[21px] lg:pt-6 lg:shadow-[0_8px_24px_rgba(6,47,80,0.12)]">
        <h2 className="text-center text-[28px] font-bold leading-[34px] text-navy lg:text-left lg:text-[44px] lg:leading-[53px] lg:tracking-[-0.01em]">
          Our <span className="lg:capitalize">Culture</span>
        </h2>
        <p className="mt-3 text-[15px] leading-6 text-ink-soft lg:mt-[17px] lg:text-lg lg:leading-[29px]">
          We&rsquo;re more than just colleagues. We&rsquo;re a family. Your growth is our priority, and every win moves the whole team forward.
        </p>
        <p className="mt-3.5 text-[15px] leading-6 text-ink-soft lg:mt-[18px] lg:text-lg lg:leading-[29px]">
          Seven values guide how we work. Together, they spell IMPACTT.
        </p>
        <ul aria-label="IMPACTT" className="mt-[17px] flex gap-1.5 lg:mt-[18px] lg:gap-2">
          {IMPACTT.map(({ letter, tone }, i) => (
            <li key={i} className={`grid size-10 place-items-center rounded-lg text-xl font-bold lg:size-[52px] lg:text-2xl ${tone}`}>
              {letter}
            </li>
          ))}
        </ul>
        <div className="mt-[9px] flex flex-col items-start gap-[7.5px] text-base font-semibold text-brand lg:mt-[21px] lg:flex-row lg:gap-8 lg:whitespace-nowrap lg:text-[15.5px]">
          <Link href={VALUES_HREF} className="inline-flex items-center gap-2.5 hover:underline">
            Read Our Values
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:underline">
            See Life At Everest On LinkedIn
            <ExternalLink className="size-4" strokeWidth={2.25} />
          </a>
        </div>
      </div>
      <div className="relative mt-[13px] aspect-[380/220] overflow-hidden rounded-2xl lg:hidden">
        <Image src="/figma/careers/culture-mobile.webp" alt={ALT} fill sizes="(min-width: 1024px) 0px, 100vw" className="object-cover" />
      </div>
    </section>
  );
}
