import type { CSSProperties } from "react";
import Image from "next/image";
import { FounderStory } from "@/components/about/founder";
import { BACKERS, LENDERS, TEAM, type Logo, type TeamMember } from "./data";
import { Heading, Label } from "./ui";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

/** A card's width for two, three or six to a row, so a short last row can sit centred. */
function TeamCard({ member }: { member: TeamMember }) {
  return (
    <li className="w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-80px)/6)]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-mist">
        {member.photo ? (
          <Image
            src={`/figma/investors/team-${member.photo}.webp`}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 172px, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span aria-hidden className="grid h-full place-items-center text-[28px] font-bold text-navy/30 lg:text-[32px]">
            {initials(member.name)}
          </span>
        )}
      </div>
      <p className="mt-2.5 text-sm font-semibold leading-5 text-navy lg:text-[15px]">{member.name}</p>
    </li>
  );
}

const tile = "grid h-16 place-items-center rounded-xl border border-line bg-white lg:h-[88px]";

/**
 * One logo at its drawn size. Backers shrink a little on phones; lenders keep their size, since
 * several carry small print. On a narrow desktop the tile can be slimmer than the logo, so it
 * scales down inside it.
 */
function LogoImage({ logo, kind }: { logo: Logo; kind: "backer" | "lender" }) {
  return (
    <Image
      src={`/figma/investors/${kind}-${logo.id}.webp`}
      alt={logo.name}
      width={logo.w}
      height={logo.h}
      style={{ "--w": `${logo.w}px`, "--h": `${logo.h}px` } as CSSProperties}
      className={`max-w-[88%] object-contain ${
        kind === "backer" ? "h-[calc(var(--h)*0.86)] w-[calc(var(--w)*0.86)] lg:h-(--h) lg:w-(--w)" : "h-(--h) w-(--w)"
      }`}
    />
  );
}

export function Leadership() {
  return (
    <section id="leadership" className="scroll-mt-28 bg-white px-4 pb-10 pt-[30px] sm:px-6 lg:pb-[100px] lg:pt-[97px]">
      <div className="mx-auto w-full max-w-[1104px]">
        <Heading>Leadership</Heading>

        <Label className="mt-[30px] lg:mt-11">Founder</Label>
        <FounderStory short flush className="mt-6 lg:mt-8" />

        <Label className="mt-12 lg:mt-16">Leadership team</Label>
        <ul className="mt-[26px] flex flex-wrap justify-center gap-x-3 gap-y-5 lg:mt-4 lg:gap-x-4 lg:gap-y-6">
          {TEAM.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </ul>

        <Label className="mt-12 lg:mt-16">Backed by</Label>
        <ul className="mt-[26px] grid grid-cols-2 gap-3 lg:mt-4 lg:flex lg:gap-4">
          {BACKERS.map((b) => (
            <li key={b.id} className={`${tile} lg:w-[144px]`}>
              <LogoImage logo={b} kind="backer" />
            </li>
          ))}
        </ul>

        <Label className="mt-10 lg:mt-12">Debt partners</Label>
        <ul className="mt-[26px] grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-4 lg:grid-cols-7 lg:gap-4">
          {LENDERS.map((l) => (
            <li key={l.id} className={tile}>
              <LogoImage logo={l} kind="lender" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
