import {
  Eye,
  Flame,
  Hand,
  Handshake,
  Heart,
  Lightbulb,
  MessageCircleHeart,
  Rocket,
  Star,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ImpactRow } from "./impact-row";

type Tone = "blue" | "plum" | "lime" | "sun";

type Value = {
  id: string;
  letter: string;
  name: string;
  /** The letter-card icon, also the phone card's icon. */
  icon: LucideIcon;
  /** Desktop's larger icon in the tinted circle. */
  mark: LucideIcon;
  tone: Tone;
  points: [string, string, string];
};

const values: Value[] = [
  {
    id: "innovation",
    letter: "I",
    name: "Innovation",
    icon: Lightbulb,
    mark: Lightbulb,
    tone: "blue",
    points: [
      "We challenge the usual way of doing things.",
      "We experiment boldly and learn from every result.",
      "We stay curious and keep finding better solutions.",
    ],
  },
  {
    id: "empower",
    letter: "M",
    name: "eMpower",
    icon: Handshake,
    mark: Hand,
    tone: "blue",
    points: [
      "We trust our people to take ownership and decide.",
      "We act early, solve problems and share ideas openly.",
      "We give every team the guidance and tools to grow.",
    ],
  },
  {
    id: "passion",
    letter: "P",
    name: "Passion",
    icon: Heart,
    mark: Flame,
    tone: "plum",
    points: [
      "We bring energy and purpose to everything we do.",
      "We take pride in our work and keep improving it.",
      "We go beyond what is expected of us.",
    ],
  },
  {
    id: "agility",
    letter: "A",
    name: "Agility",
    icon: Zap,
    mark: Rocket,
    tone: "plum",
    points: [
      "We move fast and act decisively.",
      "We keep things simple and focus on outcomes.",
      "We adapt quickly and turn ideas into action.",
    ],
  },
  {
    id: "customer-first",
    letter: "C",
    name: "Customer First",
    icon: User,
    mark: MessageCircleHeart,
    tone: "lime",
    points: [
      "We put our customers at the heart of every decision.",
      "We listen closely and respond quickly.",
      "We measure our success by our customers’ success.",
    ],
  },
  {
    id: "transparency",
    letter: "T",
    name: "Transparency",
    icon: Eye,
    mark: Eye,
    tone: "sun",
    points: [
      "We communicate openly, honestly and respectfully.",
      "We share information and explain our decisions.",
      "We speak up when something isn’t right.",
    ],
  },
  {
    id: "team-spirit",
    letter: "T",
    name: "Team Spirit",
    icon: Star,
    mark: Users,
    tone: "sun",
    points: [
      "We work together and support one another.",
      "We value every perspective and include everyone.",
      "We celebrate our successes together.",
    ],
  },
];

/** Letter colour, tint behind icons, icon colour and the phone card's accent bar and bullets. */
const tones: Record<Tone, { letter: string; tint: string; icon: string; accent: string }> = {
  blue: { letter: "text-brand", tint: "bg-[#e8f2fb]", icon: "text-brand", accent: "bg-brand" },
  plum: { letter: "text-plum", tint: "bg-[#f6eaf5]", icon: "text-plum", accent: "bg-plum" },
  lime: { letter: "text-lime", tint: "bg-[#f2f7de]", icon: "text-lime", accent: "bg-lime" },
  sun: { letter: "text-navy", tint: "bg-[#fdf8da]", icon: "text-sun", accent: "bg-sun" },
};

/**
 * Hover colours, written out whole so Tailwind finds them: on a letter card the card takes a soft
 * tint and its letter and icon deepen; in the values grid the icon circle deepens to its tone.
 */
const hovers: Record<Tone, { card: string; letter: string; tile: string; circle: string }> = {
  blue: {
    card: "hover:bg-[#f5f9fd]",
    letter: "group-hover/card:text-[#004f86]",
    tile: "group-hover/card:bg-[#d4e7f7] group-hover/card:text-[#004f86]",
    circle: "group-hover/value:bg-[#d4e7f7] group-hover/value:text-brand",
  },
  plum: {
    card: "hover:bg-[#fbf5fa]",
    letter: "group-hover/card:text-[#7a2c73]",
    tile: "group-hover/card:bg-[#efd9ec] group-hover/card:text-[#7a2c73]",
    circle: "group-hover/value:bg-[#efd9ec] group-hover/value:text-plum",
  },
  lime: {
    card: "hover:bg-[#f9fbef]",
    letter: "group-hover/card:text-[#8ba51f]",
    tile: "group-hover/card:bg-[#e6f0c2] group-hover/card:text-[#8ba51f]",
    circle: "group-hover/value:bg-[#e6f0c2] group-hover/value:text-[#8ba51f]",
  },
  sun: {
    card: "hover:bg-[#fffdf0]",
    letter: "group-hover/card:text-[#021c31]",
    tile: "group-hover/card:bg-[#fbf0b3] group-hover/card:text-[#c9ae00]",
    circle: "group-hover/value:bg-[#fbf0b3] group-hover/value:text-[#c9ae00]",
  },
};

/** Before its card's turn in the one-time lift (see ImpactRow), a letter and icon wait in grey. */
const waiting = {
  letter: "group-data-[lit=off]/card:text-[#c5ccd4]",
  tile: "group-data-[lit=off]/card:bg-[#eef1f4] group-data-[lit=off]/card:text-[#b9c2cb]",
};

/**
 * "Our Values Our Foundation": the seven values that spell IMPACTT, as letter cards, then each value
 * in full. Phones put each value on a white card; from lg the values sit in a four-column grid.
 */
export function Values() {
  return (
    <section className="relative isolate overflow-clip bg-[#f2f5fd] px-4 pb-14 pt-10 sm:px-6 sm:py-16 lg:px-10 lg:pb-[125px] lg:pt-[108px]">
      <div className="mx-auto max-w-[1200px]">
        <p className="mt-3.5 flex items-center gap-3 text-[13px] font-medium uppercase leading-4 tracking-[1px] text-brand sm:mt-0 lg:hidden">
          <span aria-hidden className="h-0.5 w-5 bg-sun" />
          Our values
        </p>
        <h2 className="mt-3 text-[28px] font-bold leading-[34px] text-navy sm:text-[36px] sm:leading-[44px] lg:mt-0 lg:text-center lg:text-[64px] lg:leading-[76px]">
          Our Values Our Foundation<span className="hidden lg:inline">.</span>
        </h2>
        <p className="mt-3 text-base leading-[26px] text-ink-soft lg:hidden">
          Seven values that spell IMPACTT. Guiding how we work, empowering who we are.
        </p>

        <ImpactRow className="mt-[41px] grid grid-cols-4 gap-2 sm:max-w-[520px] lg:mt-[86px] lg:flex lg:max-w-none lg:gap-[13px]">
          {values.map((v) => {
            const t = tones[v.tone];
            const h = hovers[v.tone];
            const Icon = v.icon;
            return (
              <li key={v.id} className="group/card min-w-0 lg:flex-1 lg:basis-0">
                <a
                  href={`#${v.id}`}
                  className={`flex h-[120px] flex-col items-center rounded-[14px] bg-white px-1 pt-2.5 text-center shadow-[0_6px_18px_rgba(6,47,80,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(6,47,80,0.1)] lg:h-[262px] lg:rounded-[20px] lg:px-1.5 lg:pt-[13px] xl:px-2 ${h.card}`}
                >
                  <span
                    aria-hidden
                    className={`text-[28px] font-bold leading-[34px] transition-colors duration-700 lg:text-[64px] lg:font-extrabold lg:leading-[96px] xl:text-[80px] ${t.letter} ${h.letter} ${waiting.letter}`}
                  >
                    {v.letter}
                  </span>
                  <span
                    aria-hidden
                    className={`mt-0.5 grid size-9 place-items-center rounded-lg transition-colors duration-700 lg:mt-[9px] lg:h-14 lg:w-16 lg:rounded-[14px] ${t.tint} ${t.icon} ${h.tile} ${waiting.tile}`}
                  >
                    <Icon className="size-[30px]" strokeWidth={1.5} />
                  </span>
                  <span className="mt-2 text-[10px] font-bold leading-3 text-navy lg:mt-[17px] lg:text-sm lg:leading-[20px] xl:text-xl xl:leading-[28px]">
                    {v.name}
                  </span>
                </a>
              </li>
            );
          })}
        </ImpactRow>

        <div className="relative mt-[38px] lg:mt-[101px]">
          {/* Colour flows down from the letter cards in the values' own tints, drifting slowly. */}
          <div
            aria-hidden
            className="values-wash pointer-events-none absolute -bottom-14 -top-6 left-1/2 -z-10 w-screen -translate-x-1/2 sm:-bottom-16 lg:-bottom-[125px] lg:-top-[90px]"
          >
            <span className="values-blob values-blob-blue" />
            <span className="values-blob values-blob-plum" />
            <span className="values-blob values-blob-lime" />
            <span className="values-blob values-blob-sun" />
          </div>
          <ol className="flex flex-col gap-6 md:flex-row md:flex-wrap md:justify-center lg:gap-x-8 lg:gap-y-[49px] xl:gap-x-14">
            {values.map((v, i) => {
              const t = tones[v.tone];
              const h = hovers[v.tone];
              const Icon = v.icon;
              const Mark = v.mark;
              return (
                <li
                  key={v.id}
                  id={v.id}
                  className="group/value scroll-mt-28 rounded-[20px] bg-white p-5 text-center shadow-[0_6px_18px_rgba(6,47,80,0.05)] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-6rem)/4)] lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none xl:w-[calc((100%-10.5rem)/4)]"
                >
                  <div className="flex flex-col items-center">
                    <span aria-hidden className={`grid size-14 place-items-center rounded-[14px] lg:hidden ${t.tint} ${t.icon}`}>
                      <Icon className="size-[34px]" strokeWidth={1.6} />
                    </span>
                    <span
                      aria-hidden
                      className={`hidden size-[120px] place-items-center rounded-full text-navy transition duration-300 group-hover/value:scale-105 lg:grid ${t.tint} ${h.circle}`}
                    >
                      <Mark className="size-16" strokeWidth={1.5} />
                    </span>
                    <span className="mt-3 text-[36px] font-bold leading-[44px] text-brand lg:mt-[21px] lg:block lg:text-[52px] lg:font-normal lg:leading-[60px] lg:text-navy">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-2 text-[28px] font-bold leading-[34px] text-navy lg:mt-1 lg:text-[28px] lg:leading-[34px] lg:text-brand">
                    {v.name}
                  </h3>
                  <span aria-hidden className={`mx-auto mt-2 block h-[3px] w-10 rounded-full lg:hidden ${t.accent}`} />
                  <ul className="mx-auto mt-[13px] max-w-[280px] space-y-[9px] text-base leading-[26px] text-navy/80 lg:mt-[14px] lg:space-y-3 lg:text-base lg:leading-[21px] lg:text-navy/85">
                    {v.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
