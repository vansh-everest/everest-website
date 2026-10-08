import Image from "next/image";
import Link from "next/link";

function YellowCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={`shrink-0 ${className}`}>
      <circle cx="8" cy="8" r="8" className="fill-sun" />
      <path d="M4.6 8.3 7 10.6l4.4-4.9" fill="none" className="stroke-navy" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const perks = ["Without loan", "Without CIBIL score", "With minimal upfront payment"];

/*
 * Desktop is laid out on the 1440 export frame. --u is one frame pixel: it shrinks with the
 * viewport below 1440 so the photo's curve and the copy keep their places, and stops at 1px above it.
 */
export function OwnNowBanner() {
  return (
    <section className="@container bg-[linear-gradient(165.5deg,#062f50_0%,#006db8_100%)]">
      <div className="relative [--u:calc(min(100cqw,1440px)/1440)] lg:h-[calc(var(--u)*348)]">
        <div className="relative aspect-[412/220] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[calc(var(--u)*770)]">
          <Image
            src="/figma/home/own-now-photo-mobile.webp"
            alt="Car keys being handed over to a new owner"
            fill
            sizes="(min-width: 1024px) 0px, 100vw"
            className="object-cover lg:hidden"
          />
          {/* The blue beyond the yellow curve is transparent, so the section gradient shows through. */}
          <Image
            src="/figma/home/own-now-photo.webp"
            alt="Car keys being handed over to a new owner"
            fill
            sizes="(min-width: 1024px) min(770px, 54vw), 0px"
            className="hidden object-cover lg:block"
          />
        </div>

        <div className="px-6 pb-6 pt-[22px] text-white lg:absolute lg:left-[calc(var(--u)*811)] lg:top-[calc(var(--u)*33)] lg:p-0">
          {/* The logo carries "by Everest" under its wordmark, so the heading keeps the two-line height it had as text. */}
          <h2 className="flex items-start justify-center gap-2.5 text-xl font-bold leading-7 tracking-[0.35px] lg:h-[calc(var(--u)*120)] lg:justify-start lg:gap-[calc(var(--u)*20)] lg:text-[length:calc(var(--u)*48)] lg:leading-[calc(var(--u)*60)] lg:tracking-[calc(var(--u)*0.3)]">
            Introducing
            <Image
              src="/figma/home/own-now-logo.webp"
              alt="Own-Now by Everest"
              width={1017}
              height={353}
              className="h-12 w-auto lg:mt-[calc(var(--u)*6)] lg:h-[calc(var(--u)*92)]"
            />
          </h2>
          <p className="mt-[5px] text-center text-sm leading-5 tracking-[0.2px] lg:mt-[calc(var(--u)*21)] lg:text-left lg:text-[length:calc(var(--u)*24)] lg:font-semibold lg:leading-[calc(var(--u)*29)] lg:tracking-[calc(var(--u)*0.35)]">
            Now become owner of your own car
          </p>
          <ul className="mt-1 lg:mt-[calc(var(--u)*5)]">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex h-8 items-center gap-2 text-base lg:h-[calc(var(--u)*28)] lg:gap-[calc(var(--u)*6)] lg:text-[length:calc(var(--u)*20)]"
              >
                <YellowCheck className="size-3.5 lg:size-[calc(var(--u)*15)]" />
                {perk}
              </li>
            ))}
          </ul>
          <Link
            href="/own-now/"
            className="mt-1.5 flex h-14 w-full items-center justify-center rounded-full bg-sun text-base font-medium tracking-[0.2px] text-navy transition hover:brightness-95 lg:absolute lg:left-[calc(var(--u)*340)] lg:top-[calc(var(--u)*200)] lg:mt-0 lg:h-[calc(var(--u)*55)] lg:w-[calc(var(--u)*154)] lg:text-[length:calc(var(--u)*15)] lg:tracking-[calc(var(--u)*1.2)]"
          >
            Know more
          </Link>
        </div>
      </div>
    </section>
  );
}
