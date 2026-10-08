import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/site/marquee";
import { homeCopy, type StripCity } from "@/content/home-copy";
import { cityPath } from "@/lib/city-route";
import { DEFAULT_LOCALE, hrefIn, type Locale } from "@/lib/i18n";

// Pixel size of each 2x skyline: it draws at half size on the 1440 frame, and at 80% of that below xl.
// `slug` names the skyline file; `page` is the city's driver page.
const cities: { slug: StripCity; page: string; w: number; h: number }[] = [
  { slug: "bangalore", page: "bengaluru", w: 261, h: 227 },
  { slug: "mumbai", page: "mumbai", w: 291, h: 227 },
  { slug: "chennai", page: "chennai", w: 233, h: 213 },
  { slug: "pune", page: "pune", w: 307, h: 217 },
  { slug: "delhi", page: "delhi", w: 196, h: 237 },
  { slug: "hyderabad", page: "hyderabad", w: 296, h: 241 },
  { slug: "kolkata", page: "kolkata", w: 362, h: 199 },
];

function City({ city, locale, copy = false }: { city: (typeof cities)[number]; locale: Locale; copy?: boolean }) {
  return (
    <Link
      href={hrefIn(locale, cityPath(city.page))}
      tabIndex={copy ? -1 : undefined}
      className="flex flex-col items-center justify-end gap-5 rounded-lg transition hover:-translate-y-0.5 hover:opacity-90 xl:gap-[19px]"
    >
      <Image
        src={`/figma/home/city-${city.slug}.webp`}
        alt=""
        width={city.w}
        height={city.h}
        style={{ "--w": `${city.w / 2}px` } as CSSProperties}
        className="h-auto w-[calc(var(--w)*0.8)] drop-shadow-[0_0_0.4px_#fff] xl:w-(--w) xl:drop-shadow-none"
      />
      <span className="text-sm font-medium uppercase leading-5 text-white xl:text-xl xl:leading-6">
        {homeCopy(locale).cities.names[city.slug]}
      </span>
    </Link>
  );
}

export function CitiesStrip({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = homeCopy(locale).cities;
  return (
    <section className="bg-[linear-gradient(to_bottom_right,#062f50,#006db8)] pb-[17px] pt-[9px] xl:py-0">
      <div className="mx-auto max-w-[1440px] xl:flex xl:h-[240px] xl:items-center xl:pl-10">
        <h2 className="text-center text-xl font-semibold leading-7 text-white xl:w-[176px] xl:shrink-0 xl:text-left xl:text-[36px] xl:leading-[44px]">
          {copy.title}
        </h2>
        <span aria-hidden className="hidden h-[211px] w-px shrink-0 bg-white xl:ml-[10px] xl:block" />
        <Marquee
          label={copy.region}
          seconds={28}
          items={cities.map((city) => ({
            key: city.slug,
            node: <City city={city} locale={locale} />,
            copyNode: <City city={city} locale={locale} copy />,
          }))}
          itemClassName="items-end pr-9 xl:pr-16"
          className="mt-[13px] [mask-image:linear-gradient(90deg,transparent,#000_32px,#000_calc(100%-32px),transparent)] xl:mt-0 xl:flex-1 xl:pl-3"
        />
      </div>
    </section>
  );
}
