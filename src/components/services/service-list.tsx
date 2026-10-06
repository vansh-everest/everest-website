import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { GetStarted } from "./get-started";
import { SERVICES, type Service } from "./services";

/** The four services, alternating white and tinted bands, the photo swapping sides each time from lg. */
export function ServiceList() {
  return (
    <>
      {SERVICES.map((s, i) => (
        <ServiceBlock key={s.slug} service={s} tinted={i % 2 === 1} />
      ))}
    </>
  );
}

function ServiceBlock({ service: s, tinted }: { service: Service; tinted: boolean }) {
  // Cards sit on the opposite tone to their band.
  const card = tinted ? "bg-white" : "bg-[#f7f9fc]";
  return (
    <section
      id={s.slug}
      aria-labelledby={`${s.slug}-title`}
      className={`scroll-mt-24 px-5 pb-[35px] pt-[38px] sm:px-6 sm:pb-14 sm:pt-12 lg:px-10 lg:pb-20 lg:pt-[79px] ${tinted ? "bg-[#f8f9fc]" : "bg-white"}`}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="lg:flex lg:items-start lg:justify-between lg:gap-8">
          <div>
            <h2
              id={`${s.slug}-title`}
              className="text-[31px] font-bold leading-[38px] tracking-[-0.4px] text-navy lg:text-[44px] lg:leading-[54px] lg:tracking-normal"
            >
              {s.title}
            </h2>
            <ul className="mt-[9px] flex flex-wrap gap-2 lg:mt-[11px]">
              {s.tags.map((t) => (
                <li
                  key={t}
                  className="flex h-6 items-center rounded-full bg-[#e8f2fa] px-2.5 text-xs font-bold text-brand lg:h-[25px]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <dl className="mt-[27px] flex flex-wrap gap-2 lg:mt-1 lg:shrink-0 lg:gap-3.5">
            {s.stats.map((st) => (
              <div
                key={st.label}
                className={`flex flex-col-reverse rounded-2xl border border-line px-[15px] pb-3 pt-3 lg:px-4 lg:pb-[18px] lg:pt-[17px] ${card}`}
              >
                <dt className="mt-1 whitespace-nowrap lg:mt-0.5 text-[13px] leading-4 text-ink-soft">{st.label}</dt>
                <dd className="text-[22px] font-bold leading-7 text-navy lg:text-[26px] lg:leading-8">{st.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          className={`mt-[25px] grid gap-[26px] md:grid-cols-2 lg:mt-12 lg:gap-12 ${
            tinted ? "lg:grid-cols-[minmax(0,592fr)_minmax(0,560fr)]" : "lg:grid-cols-[minmax(0,560fr)_minmax(0,592fr)]"
          }`}
        >
          <div className={`relative aspect-[372/231] overflow-hidden rounded-2xl md:aspect-auto md:min-h-[300px] lg:h-[340px] lg:rounded-[22px] ${tinted ? "md:order-2" : ""}`}>
            <Image src={s.img} alt={s.alt} fill sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className={`flex flex-col rounded-[20px] border border-line px-6 pb-[26px] pt-[19px] lg:rounded-3xl lg:px-8 lg:pb-[19px] lg:pt-[17px] ${card}`}>
            <ul className="space-y-3.5 text-base font-semibold leading-6 text-navy lg:space-y-[19px] lg:text-[17px]">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-3.5">
                  <CircleCheck aria-hidden className="size-[18px] shrink-0 text-brand lg:size-5" strokeWidth={1.75} />
                  {p}
                </li>
              ))}
            </ul>
            <GetStarted service={s.slug} className="mt-[39px] lg:mt-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
