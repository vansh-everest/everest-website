import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { IMPACTT, LINKEDIN_URL, VALUES_HREF } from "./data";

const ALT = "Everest Fleet team in a meeting around a long table in a bright office";

/** Desktop: a white card over a full-width office photo. Phones: the text first, the photo framed below it. */
export function Culture() {
  return (
    <section className="relative bg-white px-4 pb-5 pt-[23px] lg:h-[632px] lg:p-0">
      <Image
        src="/figma/careers/culture.webp"
        alt={ALT}
        fill
        sizes="(min-width: 1024px) 100vw, 0px"
        className="hidden object-cover object-left lg:block"
      />
      <div className="relative lg:absolute lg:left-[67px] lg:top-[118px] lg:w-[520px] lg:rounded-3xl lg:bg-white lg:px-6 lg:pb-[21px] lg:pt-6 lg:shadow-[0_8px_24px_rgba(6,47,80,0.12)]">
        <h2 className="text-center text-[28px] font-bold leading-[34px] text-navy lg:text-left lg:text-[44px] lg:leading-[53px] lg:tracking-[-0.01em]">
          Our <span className="lg:capitalize">culture</span>
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
            Read our values
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:underline">
            See life at Everest on LinkedIn
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
