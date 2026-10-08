import { getImageProps } from "next/image";
import type { Icon } from "@phosphor-icons/react";
import { Car, CurrencyInr, Headset, LockSimpleOpen, Wrench } from "@phosphor-icons/react/ssr";
import { homeCopy, type HomeCopy } from "@/content/home-copy";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { youtubeId } from "@/lib/youtube";
import { WhyVideo } from "./why-video";

/** Each card's mark, in the order of the copy's benefits: earnings, deposit, maintenance, ownership, support. */
const marks: { icon: Icon; bold?: boolean; tone: string; wide?: boolean }[] = [
  { icon: CurrencyInr, bold: true, tone: "bg-sun text-[#343330]" },
  { icon: LockSimpleOpen, tone: "bg-brand text-white" },
  { icon: Wrench, tone: "bg-navy text-white" },
  { icon: Car, tone: "bg-plum text-white" },
  { icon: Headset, tone: "bg-lime text-[#343330]", wide: true },
];

/** The two-column layout from md up carries its own wording where the Figma frames differ. */
function Copy({ text, md }: { text: string; md?: string }) {
  if (!md) return text;
  return (
    <>
      <span className="md:hidden">{text}</span>
      <span className="hidden md:inline">{md}</span>
    </>
  );
}

// The link is a fixed, valid watch address, so the id is always there.
const videoId = youtubeId("https://www.youtube.com/watch?v=oxH7PnSsMsQ")!;

/** The video, behind a still from the Figma frames: the phone frame shows a different shot at a different crop. */
function Video({ copy }: { copy: HomeCopy["why"] }) {
  const videoAlt = copy.videoAlt;
  const {
    props: { srcSet: desktop },
  } = getImageProps({ src: "/figma/home/why-video.webp", alt: videoAlt, width: 1116, height: 626, sizes: "558px" });
  const {
    props: { srcSet: mobile, src, ...img },
  } = getImageProps({
    src: "/figma/home/why-video-mobile.webp",
    alt: videoAlt,
    width: 1312,
    height: 727,
    sizes: "(min-width: 768px) 656px, 100vw",
  });

  return (
    <WhyVideo
      id={videoId}
      title={copy.videoTitle}
      label={copy.videoPlay}
      tapForSound={copy.tapForSound}
      className="relative mx-auto aspect-video w-full max-w-[656px] overflow-hidden rounded-[10px] bg-navy ring-2 ring-white xl:mx-0 xl:max-w-[558px] xl:rounded-xl xl:shadow-[0_12px_28px_rgba(6,47,80,0.16)] xl:ring-0"
    >
      <picture>
        <source media="(min-width: 1280px)" srcSet={desktop} sizes="558px" />
        <img {...img} src={src} srcSet={mobile} alt={videoAlt} className="size-full object-cover" />
      </picture>
    </WhyVideo>
  );
}

export function WhyChooseUs({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const copy = homeCopy(locale).why;
  return (
    <section className="bg-mist lg:bg-paper">
      <h2 className="px-5 pt-[25px] text-center text-[28px] font-bold leading-[34px] text-navy lg:bg-navy lg:pb-16 lg:pt-[53px] lg:text-[64px] lg:leading-none lg:text-white">
        {copy.title}
      </h2>
      <div className="mx-auto max-w-[696px] px-5 pb-[21px] pt-[25px] lg:pb-[55px] lg:pt-16 xl:grid xl:max-w-[1328px] xl:grid-cols-[minmax(0,1fr)_656px] xl:items-start xl:gap-[66px] xl:px-6">
        <Video copy={copy} />
        <div className="mx-auto mt-[21px] w-full max-w-[656px] xl:mt-0">
          <ul className="grid gap-[18px] md:grid-cols-2 md:gap-5">
            {copy.benefits.map(({ title, titleMd, body, bodyMd }, i) => {
              const { icon: BenefitIcon, bold, tone, wide } = marks[i];
              return (
                <li
                  key={title}
                  className={`flex min-h-[70px] items-center gap-3.5 rounded-[14px] border border-line bg-white px-[11px] py-2 md:min-h-[88px] md:gap-4 md:rounded-2xl md:px-[19px] md:py-[18px] ${wide ? "md:col-span-2" : ""}`}
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-[10px] md:size-12 md:rounded-xl ${tone}`}>
                    <BenefitIcon aria-hidden weight={bold ? "bold" : "regular"} className="size-[26px] md:size-7" />
                  </span>
                  <div>
                    <p className="text-[19px] font-bold leading-7 text-navy md:text-lg md:leading-7">
                      <Copy text={title} md={titleMd} />
                    </p>
                    <p className="text-[15px] leading-[23px] text-ink-soft md:text-sm md:leading-[22px]">
                      <Copy text={body} md={bodyMd} />
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs leading-5 text-ink-soft">{copy.footnote}</p>
        </div>
      </div>
    </section>
  );
}
