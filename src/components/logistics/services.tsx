import { CARGO, SERVICES } from "./data";
import { SwipeRow } from "./swipe-row";
import { Heading, Wrap } from "./ui";

/** "What We Move": three cards on a desktop, a swipe row on a phone, then the cargo list. */
export function Services() {
  return (
    <section className="bg-white pb-12 pt-[71px] lg:pb-[25px] lg:pt-[109px]">
      <Wrap>
        <Heading title="What We Move" />
        <SwipeRow
          label="Services"
          className="mt-[33px] lg:mt-[62px]"
          track="-mx-4 flex gap-3 px-4 scroll-px-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:px-0"
        >
          {SERVICES.map(({ icon: Icon, title, body, suits }) => (
            <article key={title} className="w-[292px] shrink-0 snap-start rounded-3xl border border-[#e4e9ef] bg-[#f6f9fc] p-[23px] lg:w-auto lg:p-7">
              <span className="grid size-12 place-items-center rounded-[14px] bg-[#e8f2fa] text-brand lg:size-14 lg:rounded-2xl">
                <Icon aria-hidden size={24} strokeWidth={1.75} />
              </span>
              <h3 className="mt-3.5 text-[24px] font-bold leading-8 text-navy lg:mt-4 lg:text-[26px] lg:leading-9">{title}</h3>
              <p className="mt-2.5 text-base leading-6 text-ink-soft lg:mt-3">{body}</p>
              <dl className="mt-3.5 grid gap-[5px] border-t border-[#e4e9ef] pt-3.5 text-[15px] leading-[23px] lg:text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-ink-soft">Suits</dt>
                  <dd className="text-right font-semibold text-navy lg:text-[15px]">{suits}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-ink-soft">Includes</dt>
                  <dd className="text-right font-semibold text-navy lg:text-[15px]">Vehicle and driver</dd>
                </div>
              </dl>
            </article>
          ))}
        </SwipeRow>

        <div className="mt-7 rounded-3xl bg-[#f6f9fc] px-4 pb-5 pt-[19px] lg:mt-12 lg:px-[15px] lg:pb-[25px] lg:pt-[29px]">
          <h3 className="text-xs font-bold uppercase leading-4 tracking-[1.2px] text-brand lg:text-center lg:text-[13px]">What We Carry</h3>
          <ul className="mt-3 flex flex-wrap gap-2 lg:mt-[23px] lg:justify-center lg:gap-x-0 lg:gap-y-[31px]">
            {CARGO.map(({ icon: Icon, label, phoneOnly }) => (
              <li
                key={label}
                className={`h-9 items-center gap-2 rounded-full border border-[#e4e9ef] bg-white pl-[11px] pr-3.5 lg:h-auto lg:w-[179px] lg:flex-col lg:gap-[13px] lg:rounded-none lg:border-0 lg:bg-transparent lg:px-3 lg:text-center ${
                  phoneOnly ? "flex lg:hidden" : "flex"
                }`}
              >
                <span className="grid shrink-0 place-items-center text-brand lg:size-[68px] lg:rounded-full lg:bg-white lg:shadow-[0_6px_18px_rgba(6,47,80,0.06)]">
                  <Icon aria-hidden strokeWidth={1.75} className="size-5 lg:size-[26px]" />
                </span>
                <span className="text-[15px] font-semibold leading-5 text-navy">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
