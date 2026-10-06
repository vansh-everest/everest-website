import type { LucideIcon } from "lucide-react";
import { Eyebrow, IconTile } from "./ui";

export type Feature = { icon: LucideIcon; title: string; body: string };

/**
 * The six (or four) things on offer. A desktop sets the title and a line of context on the left and the
 * items as a two-column list; a phone centres the title and shows the items as cards.
 */
export function Features({
  eyebrow,
  title,
  sub,
  items,
}: {
  eyebrow: string;
  /** Desktop lines, joined with a space on a phone. */
  title: string[];
  sub: string;
  items: Feature[];
}) {
  return (
    <section className="bg-[#f2f5fd] px-4 pb-10 pt-12 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1104px] lg:grid-cols-[340px_1fr] lg:gap-x-10 xl:grid-cols-[432px_1fr] xl:gap-x-[52px]">
        <div className="text-center lg:text-left">
          <Eyebrow className="justify-center lg:justify-start">{eyebrow}</Eyebrow>
          <h2 className="mt-2 text-[22px] font-bold leading-[30px] text-navy lg:mt-[18px] lg:text-[40px] lg:leading-[46px] lg:tracking-[-0.5px] xl:text-[48px] xl:leading-[54px]">
            {title.map((line, i) => (
              <span key={line} className="lg:block">
                {i > 0 ? " " : ""}
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 hidden max-w-[400px] text-[17px] leading-[26px] text-ink-soft lg:block">{sub}</p>
        </div>
        <ul className="mx-auto mt-[27px] grid w-full max-w-[560px] grid-cols-2 gap-3 lg:mt-0 lg:max-w-none lg:gap-x-[33px] lg:gap-y-0">
          {items.map(({ icon: Icon, title: name, body }) => (
            <li
              key={name}
              className="min-h-[158px] rounded-xl border border-[#e8e9ed] bg-white p-4 lg:flex lg:min-h-0 lg:gap-4 lg:rounded-none lg:border-0 lg:border-t lg:border-[#e7e9ed] lg:bg-transparent lg:px-0.5 lg:pb-[23px] lg:pt-[23px]"
            >
              <IconTile className="size-8 rounded-lg lg:hidden">
                <Icon size={18} strokeWidth={1.75} />
              </IconTile>
              <Icon aria-hidden size={22} strokeWidth={1.75} className="hidden shrink-0 text-brand lg:block" />
              <div>
                <h3 className="mt-3 text-[15px] font-bold leading-[18px] text-navy lg:mt-0 lg:text-lg lg:leading-[22px] lg:tracking-[-0.3px]">{name}</h3>
                <p className="mt-1.5 text-xs leading-[15px] text-ink-soft lg:mt-[2px] lg:text-sm lg:leading-[19px] lg:tracking-[-0.2px]">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
