import type { CSSProperties } from "react";
import Image from "next/image";

// Pixel size of each 2x skyline: it draws at half size on the 1440 frame, and at 80% of that below xl.
const cities = [
  { name: "Bangalore", slug: "bangalore", w: 261, h: 227 },
  { name: "Mumbai", slug: "mumbai", w: 291, h: 227 },
  { name: "Chennai", slug: "chennai", w: 233, h: 213 },
  { name: "Pune", slug: "pune", w: 307, h: 217 },
  { name: "Delhi", slug: "delhi", w: 196, h: 237 },
  { name: "Hyderabad", slug: "hyderabad", w: 296, h: 241 },
  { name: "Kolkata", slug: "kolkata", w: 362, h: 199 },
];

export function CitiesStrip() {
  return (
    // Below lg the row scrolls, so a dark fade on the right edge (under the icons) hints at more.
    <section className="bg-[linear-gradient(to_left,#133664,rgb(19_54_100/0)_62px),linear-gradient(to_bottom_right,#062f50,#006db8)] pb-[17px] pt-[9px] lg:bg-[linear-gradient(to_bottom_right,#062f50,#006db8)] xl:py-0">
      <div className="mx-auto max-w-[1440px] xl:flex xl:h-[240px] xl:items-center xl:pl-10 xl:pr-[21px]">
        <h2 className="text-center text-xl font-semibold leading-7 text-white xl:w-[176px] xl:shrink-0 xl:text-left xl:text-[36px] xl:leading-[44px]">
          Cities we operate in
        </h2>
        <span aria-hidden className="hidden h-[211px] w-px shrink-0 bg-white xl:ml-[10px] xl:block" />
        <div className="relative mt-[13px] xl:mt-0 xl:flex-1 xl:pl-3">
          <ul
            tabIndex={0}
            aria-label="Cities"
            className="flex snap-x snap-mandatory scroll-px-[21px] items-end gap-[18px] overflow-x-auto px-[21px] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:justify-center xl:justify-between xl:gap-0 xl:overflow-visible xl:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {cities.map((city) => (
              <li
                key={city.slug}
                className="flex min-w-[104px] shrink-0 snap-start flex-col items-center gap-5 xl:min-w-0 xl:gap-[19px]"
              >
                <Image
                  src={`/figma/home/city-${city.slug}.webp`}
                  alt=""
                  width={city.w}
                  height={city.h}
                  style={{ "--w": `${city.w / 2}px` } as CSSProperties}
                  className="h-auto w-[calc(var(--w)*0.8)] drop-shadow-[0_0_0.4px_#fff] xl:w-(--w) xl:drop-shadow-none"
                />
                <span className="text-sm font-medium uppercase leading-5 text-white xl:text-xl xl:leading-6">{city.name}</span>
              </li>
            ))}
          </ul>
          <svg
            aria-hidden
            viewBox="0 0 8 12"
            className="pointer-events-none absolute right-3 top-[55px] h-3 w-2 -translate-y-1/2 fill-white/75 drop-shadow-[0_0_2px_#062f50] lg:hidden"
          >
            <path d="M0 0h3.5L8 6l-4.5 6H0l4.5-6z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
