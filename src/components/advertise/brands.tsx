import Image from "next/image";
import { Eyebrow } from "@/components/b2b/ui";
import type { Logo } from "@/components/b2b/logo-wall";

const BRANDS: Logo[] = [
  { file: "aakash", name: "Aakash BYJU'S", w: 130, h: 99 },
  { file: "maac", name: "MAAC", w: 159, h: 53 },
  { file: "prince", name: "Prince Piping Systems", w: 171, h: 38 },
  { file: "weikfield", name: "Weikfield", w: 135, h: 50 },
  { file: "ikea", name: "IKEA", w: 156, h: 56 },
  { file: "bank-of-baroda", name: "Bank of Baroda", w: 165, h: 45 },
  { file: "idfc-first", name: "IDFC FIRST Bank", w: 162, h: 60 },
  { file: "amfi", name: "AMFI", w: 74, h: 76 },
  { file: "gomechanic", name: "GoMechanic", w: 173, h: 38 },
  { file: "onsitego", name: "Onsitego", w: 141, h: 40 },
  { file: "netflix", name: "Netflix", w: 158, h: 46 },
  { file: "incredible-india", name: "Incredible India", w: 138, h: 36 },
  { file: "gujarat-tourism", name: "Gujarat Tourism", w: 168, h: 59 },
  { file: "garnier", name: "Garnier", w: 160, h: 46 },
  { file: "himalaya", name: "Himalaya", w: 152, h: 56 },
  { file: "lakme", name: "Lakmé", w: 152, h: 38 },
  { file: "mobil", name: "Mobil", w: 149, h: 48 },
  { file: "gulf", name: "Gulf", w: 111, h: 100 },
  { file: "puneri-paltan", name: "Puneri Paltan", w: 85, h: 100 },
  { file: "leverage-edu", name: "Leverage Edu", w: 130, h: 67 },
];

export function Brands() {
  return (
    <section className="bg-navy px-4 pb-12 pt-[47px] lg:px-20 lg:pb-[54px] lg:pt-[55px]">
      <div className="text-center">
        <Eyebrow tone="sun" className="justify-center lg:text-[13px]! lg:tracking-[2px]!">
          Clients
        </Eyebrow>
        <h2 className="mt-1.5 text-[clamp(21px,5.85vw,24px)] font-bold leading-[34px] text-white lg:mt-[13px] lg:text-[52px] lg:leading-[60px]">
          The Brands We Already Carry
        </h2>
      </div>
      <ul className="mx-auto mt-[22px] grid max-w-[560px] grid-cols-3 gap-2.5 lg:mt-[49px] lg:max-w-[1280px] lg:grid-cols-5 lg:gap-6">
        {BRANDS.map((logo) => (
          <li key={logo.file} className="grid h-[72px] place-items-center rounded-xl bg-white lg:h-32 lg:rounded-2xl">
            <Image
              src={`/figma/b2b/logos/${logo.file}.webp`}
              alt={logo.name}
              width={logo.w}
              height={logo.h}
              className="h-auto w-[calc(var(--w)*0.5)] lg:w-[var(--w)]"
              style={{ "--w": `${logo.w}px` } as React.CSSProperties}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
