import Image from "next/image";
import { Eyebrow, SectionTitle } from "./ui";

/** `w` and `h` are the logo's size on a desktop card; phones scale it down with the card. */
export type Logo = { file: string; name: string; w: number; h: number };

/**
 * Client logos on white cards. `size` follows the two exports: four large cards (Employee Mobility)
 * or a five-across wall (Advertise With Us).
 */
export function LogoWall({ eyebrow, title, logos, size }: { eyebrow: string; title: string; logos: Logo[]; size: "large" | "wall" }) {
  const large = size === "large";
  return (
    <section className={`bg-navy px-4 pt-12 lg:px-20 lg:pt-[95px] ${large ? "pb-12 lg:pb-24" : "pb-6 lg:pb-[96px]"}`}>
      <div className="text-center">
        <Eyebrow tone="sun" className="justify-center">
          {eyebrow}
        </Eyebrow>
        <SectionTitle tone="white" size="md" className="mt-2 lg:mt-3">
          {title}
        </SectionTitle>
      </div>
      <ul
        className={`mx-auto mt-[25px] grid max-w-[560px] lg:mt-[47px] lg:max-w-[1280px] ${
          large ? "grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-8" : "grid-cols-3 gap-2.5 lg:grid-cols-5 lg:gap-6"
        }`}
      >
        {logos.map((logo) => (
          <li
            key={logo.file}
            className={`grid place-items-center bg-white ${large ? "h-24 rounded-xl lg:h-[148px] lg:rounded-[20px]" : "h-[72px] rounded-xl lg:h-32 lg:rounded-2xl"}`}
          >
            <Image
              src={`/figma/b2b/logos/${logo.file}.webp`}
              alt={logo.name}
              width={logo.w}
              height={logo.h}
              className={`h-auto ${large ? "w-[calc(var(--w)*0.62)]" : "w-[calc(var(--w)*0.5)]"} lg:w-[var(--w)]`}
              style={{ "--w": `${logo.w}px` } as React.CSSProperties}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
