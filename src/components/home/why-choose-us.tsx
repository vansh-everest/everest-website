import { getImageProps } from "next/image";
import type { Icon } from "@phosphor-icons/react";
import { Car, CurrencyInr, Headset, LockSimpleOpen, Wrench } from "@phosphor-icons/react/ssr";

type Benefit = {
  icon: Icon;
  bold?: boolean;
  tone: string;
  title: string;
  body: string;
  /** The two-column layout from md up carries its own wording where the Figma frames differ. */
  titleMd?: string;
  bodyMd?: string;
  wide?: boolean;
};

const benefits: Benefit[] = [
  { icon: CurrencyInr, bold: true, tone: "bg-sun text-[#343330]", title: "Earn up to ₹40,000/mo", body: "Direct bank transfer every week" },
  {
    icon: LockSimpleOpen,
    tone: "bg-brand text-white",
    title: "Low Deposit",
    titleMd: "Low Deposit Plan",
    body: "Start with a minimum deposit",
  },
  { icon: Wrench, tone: "bg-navy text-white", title: "₹0 Maintenance*", body: "100% service & repairs covered" },
  {
    icon: Car,
    tone: "bg-plum text-white",
    title: "Ownership Plans Available",
    titleMd: "Ownership Plans",
    body: "Own your car starting from 11 months",
    bodyMd: "Own car in less than 12 months",
  },
  {
    icon: Headset,
    tone: "bg-lime text-[#343330]",
    title: "24 × 7 Support",
    body: "Tele-support for you",
    bodyMd: "Reliable tele-support anytime you need",
    wide: true,
  },
];

function Copy({ text, md }: { text: string; md?: string }) {
  if (!md) return text;
  return (
    <>
      <span className="md:hidden">{text}</span>
      <span className="hidden md:inline">{md}</span>
    </>
  );
}

const videoAlt = "Everest Fleet driver with his car";

/** Two Figma frames, two photos: the phone frame shows a different shot at a different crop. */
function VideoThumbnail() {
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
    <div className="relative mx-auto aspect-[372/206] w-full max-w-[656px] overflow-hidden rounded-[10px] ring-2 ring-white xl:mx-0 xl:aspect-[558/314] xl:max-w-[558px] xl:rounded-xl xl:shadow-[0_12px_28px_rgba(6,47,80,0.16)] xl:ring-0">
      <picture>
        <source media="(min-width: 1280px)" srcSet={desktop} sizes="558px" />
        <img {...img} src={src} srcSet={mobile} alt={videoAlt} className="size-full object-cover" />
      </picture>
      {/* Stands in for the video until one is published, so it is a picture rather than a control. */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 grid h-12 w-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-[#ff0000] xl:h-[50px] xl:w-[72px] xl:rounded-[14px]"
      >
        <svg viewBox="0 0 20 22" className="ml-1 h-[25px] w-[22px] fill-white xl:ml-0 xl:h-[21px] xl:w-[19px]">
          <path d="M0 0 20 11 0 22z" />
        </svg>
      </span>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="bg-mist lg:bg-paper">
      <h2 className="px-5 pt-[25px] text-center text-[28px] font-bold leading-[34px] text-navy lg:bg-navy lg:pb-16 lg:pt-[53px] lg:text-[64px] lg:leading-none lg:text-white">
        Why Drivers Choose Us
      </h2>
      <div className="mx-auto max-w-[696px] px-5 pb-[21px] pt-[25px] lg:pb-[55px] lg:pt-16 xl:grid xl:max-w-[1328px] xl:grid-cols-[minmax(0,1fr)_656px] xl:items-start xl:gap-[66px] xl:px-6">
        <VideoThumbnail />
        <div className="mx-auto mt-[21px] w-full max-w-[656px] xl:mt-0">
          <ul className="grid gap-[18px] md:grid-cols-2 md:gap-5">
            {benefits.map(({ icon: BenefitIcon, bold, tone, title, titleMd, body, bodyMd, wide }) => (
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
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-ink-soft">
            *Covers normal wear; accident or misuse damage is charged to the driver.
          </p>
        </div>
      </div>
    </section>
  );
}
