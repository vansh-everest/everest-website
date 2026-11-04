import Image, { getImageProps } from "next/image";
import { ArrowRight, Package, Phone, Truck } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/components/home/ui";
import { STATS } from "./data";
import { TabLink, type EnquiryTab } from "./tab-link";

const PHOTO = { alt: "Everest trucks lined up at a warehouse dock at sunset", sizes: "100vw" };

/** The phone gets its own framing of the same scene, so only one of the two photos ever downloads. */
function HeroPhoto() {
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...PHOTO, src: "/figma/logistics/hero.webp", width: 2880, height: 1000 });
  const {
    props: { srcSet: phone, ...rest },
  } = getImageProps({ ...PHOTO, src: "/figma/logistics/hero-phone.webp", width: 750, height: 362, loading: "eager", fetchPriority: "high" });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} />
      <source srcSet={phone} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- getImageProps carries the alt. */}
      <img {...rest} className="aspect-[375/181] w-full object-cover md:aspect-[1440/500] lg:aspect-auto lg:h-[500px]" />
    </picture>
  );
}

function PathCard({ tab, icon, tile, title, action }: { tab: EnquiryTab; icon: React.ReactNode; tile: string; title: string; action: string }) {
  return (
    <TabLink
      tab={tab}
      className="group flex h-20 w-full items-center gap-4 rounded-2xl bg-white pl-4 pr-4 transition hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun lg:w-[340px] lg:gap-4 lg:pl-3"
    >
      <span className={`grid size-12 shrink-0 place-items-center rounded-xl lg:size-14 ${tile}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-[17px] font-semibold leading-[22px] text-navy lg:text-lg">{title}</span>
        <span className="mt-0.5 flex items-center gap-2 text-[15px] font-semibold leading-5 text-brand">
          {action}
          <ArrowRight aria-hidden size={17} strokeWidth={2.25} className="transition group-hover:translate-x-0.5" />
        </span>
      </span>
    </TabLink>
  );
}

function Stats() {
  return (
    <div className="relative z-10 rounded-[20px] bg-white px-5 pb-[19px] pt-3.5 shadow-[0_14px_40px_rgba(6,47,80,0.14)] lg:flex lg:h-[121px] lg:items-center lg:rounded-3xl lg:bg-[#f6f9fc] lg:px-10 lg:py-0">
      <div className="flex items-center justify-between border-b border-line pb-2 lg:block lg:h-[60px] lg:w-[191px] lg:shrink-0 lg:border-b-0 lg:border-r lg:pb-0">
        <p className="text-[15px] font-medium leading-5 text-ink-soft lg:text-sm lg:leading-5">Backed by</p>
        <Image src="/figma/logo.png" alt="Everest" width={84} height={48} className="-mr-1 h-11 w-auto lg:-ml-2.5 lg:-mt-0.5 lg:h-[50px]" />
      </div>
      <dl className="mt-[15px] grid grid-cols-4 gap-x-1.5 lg:mt-0 lg:flex lg:flex-1 lg:justify-between lg:pl-10 xl:pl-[106px]">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse justify-end">
            <dt className="mt-0.5 text-[13px] leading-[15px] text-ink-soft lg:mt-1 lg:text-[15px] lg:leading-5">{stat.label}</dt>
            <dd className="text-[17px] font-bold leading-6 text-navy lg:text-[36px] lg:leading-[44px]">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function LogisticsHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <HeroPhoto />
      <div className="relative">
        {/* The site's wave, stretched and cropped to the export: it stops at the stats card's top edge. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[321px] overflow-hidden lg:block">
          <div className="absolute inset-x-0 -top-[188px] h-[1012px]">
            <Image src="/figma/wave.svg" alt="" fill className="object-fill" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1136px] px-4 pt-[17px] lg:pt-[47px]">
          <h1 className="text-center text-[36px] font-bold leading-10 tracking-[-0.3px] text-white lg:text-[76px] lg:font-extrabold lg:leading-[96px] xl:text-[96px] xl:tracking-[0.5px]">
            Everest Fleet Logistics
          </h1>
          <p className="mt-[15px] text-lg leading-[27px] text-white/85 lg:hidden">Frozen, chilled and ambient goods, moved for brands, retailers and 3PLs.</p>
          <div className="mt-6 grid gap-3.5 lg:mt-[37px] lg:flex lg:justify-center lg:gap-4">
            <PathCard tab="quote" icon={<Package aria-hidden size={26} strokeWidth={1.75} />} tile="bg-[#e8f2fa] text-brand" title="I need goods moved" action="Get a quote" />
            <PathCard tab="attach" icon={<Truck aria-hidden size={26} strokeWidth={1.75} />} tile="bg-sun text-navy" title="I have vehicles to attach" action="Attach your vehicle" />
          </div>
          <a href={PHONE_HREF} className="mt-3.5 flex items-center gap-2.5 text-[17px] leading-6 text-white lg:hidden">
            <Phone aria-hidden size={18} strokeWidth={1.75} />
            Or call {PHONE_DISPLAY}
          </a>
        </div>
        <div className="relative mt-[33px] lg:mt-[62px]">
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-white lg:h-[34%]" />
          <div className="mx-auto w-full max-w-[1136px] px-4">
            <Stats />
          </div>
        </div>
      </div>
    </section>
  );
}
