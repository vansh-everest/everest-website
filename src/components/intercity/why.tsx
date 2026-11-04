import Image from "next/image";
import { ArrowRight, CarFront, IndianRupee, ShieldCheck, UserCheck, type LucideIcon } from "lucide-react";

type Reason = { title: string; icon: LucideIcon; photo: string; alt: string };

const REASONS: Reason[] = [
  { title: "Clean, comfortable cars", icon: CarFront, photo: "why-wash", alt: "A hand washing a car wheel with a foam mitt" },
  { title: "Reliable, safe trips", icon: ShieldCheck, photo: "why-road", alt: "A white electric car on a highway past a city skyline" },
  { title: "From ₹10/km", icon: IndianRupee, photo: "why-fare", alt: "₹10 in large numerals on a yellow background" },
  { title: "Verified drivers", icon: UserCheck, photo: "why-driver", alt: "A driver at the wheel of a white car giving a thumbs up" },
];

function Icon({ icon: Glyph }: { icon: LucideIcon }) {
  return (
    <span className="grid size-[26px] shrink-0 place-items-center rounded-full bg-[#e8f2fa] text-brand lg:size-10">
      <Glyph aria-hidden size={18} strokeWidth={1.9} className="lg:size-5" />
    </span>
  );
}

const CARD = "overflow-hidden rounded-2xl border border-[#e8edf3] bg-white shadow-[0_4px_14px_rgba(6,47,80,0.05)]";
const TITLE = "text-[clamp(14px,3.65vw,15px)] font-semibold leading-[19px] text-navy lg:text-xl lg:leading-7";

/** Five photo cards: three and two on a desktop; two, two and a wide one on a phone. */
export function WhyEverest() {
  return (
    <section className="bg-[#f6f9fc] px-4 pb-10 pt-[38px] lg:px-6 lg:pb-14 lg:pt-14">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-center text-[28px] font-bold leading-9 text-navy lg:text-[40px] lg:leading-[48px]">Why Travel With Everest?</h2>
        <p className="mt-2.5 text-center text-[15px] leading-6 text-ink-soft lg:text-lg lg:leading-[26px]">The basics, done properly, every single trip.</p>
        <ul className="mt-[21px] grid grid-cols-2 gap-x-3 gap-y-6 px-1 lg:mt-[33px] lg:px-0 lg:grid-cols-3 lg:gap-x-[26px] lg:gap-y-[34px]">
          {REASONS.map(({ title, icon, photo, alt }) => (
            <li key={title} className={CARD}>
              <div className="relative h-[108px] lg:h-[189px]">
                <Image src={`/figma/intercity/${photo}.webp`} alt={alt} fill sizes="(min-width: 1024px) 382px, 50vw" className="object-cover" />
              </div>
              <div className="flex min-h-[67px] items-center gap-2 py-2.5 pl-3 pr-2 lg:h-[87px] lg:gap-3 lg:px-[23px] lg:py-0">
                <Icon icon={icon} />
                <p className={TITLE}>{title}</p>
              </div>
            </li>
          ))}
          <li className={`col-span-2 flex lg:col-span-1 lg:block ${CARD}`}>
            <div className="relative h-[142px] w-[48.4%] shrink-0 lg:h-[189px] lg:w-auto">
              <Image
                src="/figma/intercity/why-one-way-phone.webp"
                alt="A forest road with ONE WAY painted across it"
                fill
                sizes="50vw"
                className="object-cover lg:hidden"
              />
              <Image
                src="/figma/intercity/why-one-way.webp"
                alt="A forest road with ONE WAY painted across it"
                fill
                sizes="382px"
                className="hidden object-cover lg:block"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 pl-3 pr-2 lg:h-[87px] lg:gap-3 lg:px-[23px]">
              <Icon icon={ArrowRight} />
              <p className={TITLE}>One-way, no return fare</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
