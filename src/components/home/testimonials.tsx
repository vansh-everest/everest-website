import Image from "next/image";
import { Play } from "@phosphor-icons/react/ssr";
import { Eyebrow } from "./ui";

const arrow = "absolute top-[204px] hidden size-[52px] place-items-center rounded-full text-[28px] leading-none shadow-[0_6px_18px_rgba(6,47,80,0.18)] md:grid";

export function Testimonials() {
  return (
    <section className="bg-mist px-6 pb-9 pt-24">
      <div className="mx-auto max-w-[720px] text-center">
        <Eyebrow trailingBar={false}>Hear it from them</Eyebrow>
        <h2 className="mt-3 text-[32px] font-bold leading-tight text-navy lg:text-[40px] lg:leading-[48px]">
          Real Drivers. Real Stories. On Camera.
        </h2>
        <p className="mx-auto mt-3 max-w-[660px] text-lg leading-[29px] text-ink-soft">
          Watch how Everest Fleet changed the lives of drivers across India in their own words.
        </p>
      </div>
      <div className="relative mx-auto mt-12 max-w-[1184px] pb-[31px]">
        <article className="mx-auto max-w-[1112px] overflow-hidden rounded-[20px] bg-white shadow-[0_12px_40px_rgba(6,47,80,0.1)]">
          <div className="relative aspect-[1112/460] overflow-hidden">
            {/* Figma places the still at (-32, -130) at 1173x589 inside the 1112x460 thumb. */}
            <div className="absolute left-[-2.878%] top-[-28.261%] h-[128.043%] w-[105.486%]">
              <Image
                src="/figma/hero.png"
                alt="Anand T., Everest Fleet driver, leaning on his sedan"
                fill
                sizes="(min-width: 1184px) 1173px, 105vw"
                className="object-cover"
              />
            </div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-[119px] bg-gradient-to-t from-black/60 to-transparent" />
            <button
              type="button"
              aria-label="Play Anand T.'s story"
              className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/30 md:size-24"
            >
              <span className="grid size-12 place-items-center rounded-full bg-white md:size-[76px]">
                <Play size={28} weight="fill" className="translate-x-0.5 text-brand" />
              </span>
            </button>
            <p className="absolute right-6 top-4 flex h-[25px] items-center gap-1.5 rounded-full bg-navy/85 px-3 text-[11px] font-semibold text-white">
              <span aria-hidden className="size-[7px] rounded-full bg-leaf" />
              2:14
            </p>
            <div className="absolute bottom-[13px] left-[9px] flex items-center gap-3">
              <Image
                src="/figma/avatar-anand.jpg"
                alt=""
                width={50}
                height={50}
                className="size-[50px] rounded-full object-cover ring-2 ring-white"
              />
              <div>
                <p className="text-base font-semibold leading-[21px] text-white">Anand T.</p>
                <p className="text-xs leading-4 text-white/80">Mumbai · 1.5 years with Everest</p>
              </div>
            </div>
          </div>
          <p className="px-6 py-6 text-center text-xl font-semibold leading-8 text-navy md:px-10 md:py-[29px] md:text-[28px] md:leading-[39px]">
            See how Anand T. secured ₹35,000 last month with Everest Fleet.
          </p>
        </article>
        <button type="button" aria-label="Previous story" className={`${arrow} left-0 bg-white text-navy`}>
          ‹
        </button>
        <button type="button" aria-label="Next story" className={`${arrow} right-0 bg-navy text-white`}>
          ›
        </button>
      </div>
      <div aria-hidden className="mt-6 flex justify-center gap-1.5">
        <span className="h-2 w-7 rounded-full bg-navy" />
        <span className="size-2 rounded-full bg-navy/20" />
        <span className="size-2 rounded-full bg-navy/20" />
      </div>
    </section>
  );
}
