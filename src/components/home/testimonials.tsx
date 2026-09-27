import Image from "next/image";
import { Play } from "@phosphor-icons/react/ssr";
import { Eyebrow } from "./ui";

const arrow = "absolute top-[204px] hidden size-[52px] place-items-center rounded-full text-[28px] leading-none shadow-[0_6px_18px_rgba(6,47,80,0.18)] md:grid";
const homeArrow =
  "absolute top-[91px] grid size-8 place-items-center rounded-full border-2 border-fog bg-white text-lg leading-none text-navy lg:top-[226px] lg:size-[52px] lg:border-0 lg:text-[28px] lg:shadow-[0_6px_18px_rgba(6,47,80,0.18)]";

/* The home export tints the still navy, strongest at the top, so the white labels read on it. */
const homeTint =
  "bg-[linear-gradient(180deg,rgba(6,47,80,0.5)_0%,rgba(6,47,80,0.17)_48%,rgba(6,47,80,0.18)_75%,rgba(6,47,80,0.24)_100%)]";

function HomePlayMark() {
  return (
    <>
      <span className="grid h-12 w-[68px] place-items-center rounded-xl bg-[#ff0000] lg:hidden">
        <svg viewBox="0 0 20 22" aria-hidden className="ml-1 h-[22px] w-5 fill-white">
          <path d="M0 0 20 11 0 22Z" />
        </svg>
      </span>
      <span className="hidden size-24 place-items-center rounded-full border-2 border-white/50 bg-white/10 lg:grid">
        <span className="grid size-[76px] place-items-center rounded-full bg-white/95">
          <svg viewBox="0 0 18 22" aria-hidden className="ml-1 h-[22px] w-[18px] fill-brand">
            <path d="M0 0 18 11 0 22Z" />
          </svg>
        </span>
      </span>
    </>
  );
}

export function Testimonials({
  variant = "home",
  title = "Real Drivers. Real Stories. On Camera.",
}: {
  variant?: "home" | "page";
  title?: string;
}) {
  const page = variant === "page";
  return (
    <section
      className={page ? "bg-fog px-6 pb-[84px] pt-24" : "bg-white px-4 pb-9 pt-9 lg:bg-fog lg:px-6 lg:pb-[111px] lg:pt-24"}
    >
      <div className="mx-auto max-w-[1248px] text-center">
        {page ? (
          <Eyebrow trailingBar={false}>Hear it from them</Eyebrow>
        ) : (
          <p className="flex items-center justify-center gap-2 text-[13px] font-bold uppercase leading-4 tracking-[0.07em] text-brand lg:gap-[11px]">
            <span aria-hidden className="h-[3px] w-7 rounded-full bg-sun" />
            Hear it from them
            <span aria-hidden className="h-[3px] w-7 rounded-full bg-sun lg:hidden" />
          </p>
        )}
        <h2
          className={
            page
              ? "mt-3 text-[32px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[40px] lg:leading-[48px]"
              : "mt-[15px] text-[28.5px] font-bold leading-[35px] tracking-[-0.3px] text-navy lg:mt-3 lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.25px]"
          }
        >
          {title}
        </h2>
      </div>
      <div className={`relative mx-auto max-w-[1184px] ${page ? "mt-12 pb-[31px]" : "mt-[15px] lg:mt-12 lg:pb-[31px]"}`}>
        <article
          className={`mx-auto max-w-[1112px] overflow-hidden ${
            page
              ? "rounded-[20px] bg-white shadow-[0_12px_40px_rgba(6,47,80,0.1)]"
              : "rounded-2xl bg-mist p-0.5 lg:rounded-[20px] lg:bg-white lg:p-0 lg:shadow-[0_12px_40px_rgba(6,47,80,0.1)]"
          }`}
        >
          <div
            className={`relative overflow-hidden ${
              page
                ? "aspect-[1112/460]"
                : "aspect-[376/210] rounded-[14px] lg:aspect-[1112/460] lg:rounded-[20px] lg:shadow-[0_10px_24px_rgba(6,47,80,0.14)]"
            }`}
          >
            {/* Figma places the still at (-32, -130) at 1173x589 inside the 1112x460 thumb. */}
            <div
              className={`absolute ${
                page
                  ? "left-[-2.878%] top-[-28.261%] h-[128.043%] w-[105.486%]"
                  : "left-[-5.5%] top-[-1%] h-[102.7%] w-[114%] lg:left-[-2.878%] lg:top-[-28.261%] lg:h-[128.043%] lg:w-[105.486%]"
              }`}
            >
              <Image
                src="/figma/hero.webp"
                alt="Anand T., Everest Fleet driver, leaning on his sedan"
                fill
                sizes={page ? "(min-width: 1184px) 1173px, 105vw" : "(min-width: 1184px) 1173px, (min-width: 1024px) 105vw, 114vw"}
                className="object-cover"
              />
            </div>
            {page ? (
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-[119px] bg-gradient-to-t from-black/60 to-transparent" />
            ) : (
              <div aria-hidden className={`absolute inset-0 ${homeTint}`} />
            )}
            <button
              type="button"
              aria-label="Play Anand T.'s story"
              className={
                page
                  ? "absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/30 md:size-24"
                  : "absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center lg:top-[calc(50%-11px)]"
              }
            >
              {page ? (
                <span className="grid size-12 place-items-center rounded-full bg-white md:size-[76px]">
                  <Play size={28} weight="fill" className="translate-x-0.5 text-brand" />
                </span>
              ) : (
                <HomePlayMark />
              )}
            </button>
            <p
              className={`absolute h-[25px] items-center gap-1.5 rounded-full bg-navy/85 text-[11px] font-semibold text-white ${
                page ? "right-6 top-4 flex px-3" : "right-[39px] top-[21px] hidden px-[11px] lg:flex"
              }`}
            >
              <span aria-hidden className="size-[7px] rounded-full bg-leaf" />
              2:14
            </p>
            <div
              className={`absolute flex items-center ${
                page ? "bottom-[13px] left-[9px] gap-3" : "bottom-[11px] left-[9px] gap-1.5 lg:bottom-3 lg:left-2 lg:gap-5"
              }`}
            >
              <Image
                src="/figma/home/avatar-anand.webp"
                alt=""
                width={50}
                height={50}
                className={page ? "size-[50px] rounded-full object-cover ring-2 ring-white" : "size-6 rounded-full object-cover lg:size-[50px]"}
              />
              <div>
                <p
                  className={
                    page
                      ? "text-base font-semibold leading-[21px] text-white"
                      : "text-xs font-semibold leading-4 text-white lg:text-base lg:leading-[21px]"
                  }
                >
                  Anand T.
                </p>
                <p className={page ? "text-xs leading-4 text-white/80" : "text-[10px] leading-3 text-white/85 lg:mt-0.5 lg:text-xs lg:leading-4"}>
                  Mumbai · 1.5 years with Everest
                </p>
              </div>
            </div>
          </div>
          <p
            className={
              page
                ? "px-6 py-6 text-center text-xl font-semibold leading-8 text-navy md:px-10 md:py-[29px] md:text-[28px] md:leading-[39px]"
                : "px-4 py-[13px] text-center text-xs font-semibold leading-4 text-navy lg:px-10 lg:py-[29px] lg:text-[28px] lg:leading-[39px]"
            }
          >
            Anand has driven with Everest Fleet in Mumbai for a year and a half.
          </p>
        </article>
        {page ? (
          <>
            <button type="button" aria-label="Previous story" className={`${arrow} left-0 bg-white text-navy`}>
              ‹
            </button>
            <button type="button" aria-label="Next story" className={`${arrow} right-0 bg-white text-navy`}>
              ›
            </button>
          </>
        ) : (
          <>
            <button type="button" aria-label="Previous story" className={`${homeArrow} -left-2 lg:left-0`}>
              ‹
            </button>
            <button type="button" aria-label="Next story" className={`${homeArrow} -right-2 lg:right-0`}>
              ›
            </button>
          </>
        )}
      </div>
      <div aria-hidden className={`flex justify-center ${page ? "mt-6 gap-1.5" : "mt-4 gap-2 lg:mt-6"}`}>
        <span className={page ? "h-2 w-7 rounded-full bg-navy" : "size-2 rounded-full bg-navy lg:w-7"} />
        {page ? null : (
          <>
            <span className="size-2 rounded-full bg-fog lg:hidden" />
            <span className="size-2 rounded-full bg-fog lg:hidden" />
          </>
        )}
      </div>
    </section>
  );
}
