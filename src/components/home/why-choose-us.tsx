import Image from "next/image";
import type { Icon } from "@phosphor-icons/react";
import { CreditCard, CurrencyInr, Headset, LockSimpleOpen, Wrench } from "@phosphor-icons/react/ssr";

const benefits: { icon: Icon; tone: string; title: string; body: string }[] = [
  { icon: CurrencyInr, tone: "bg-sun text-navy", title: "Earn up to ₹40,000/mo", body: "Direct bank transfer every week" },
  { icon: LockSimpleOpen, tone: "bg-[#207fc1] text-white", title: "Low Refundable Deposit", body: "Start with minimal upfront cost" },
  { icon: Wrench, tone: "bg-navy text-white", title: "₹0 Maintenance", body: "100% service & repairs covered" },
  { icon: CreditCard, tone: "bg-plum text-white", title: "Weekly Payouts", body: "No delays, reliable income" },
  { icon: Headset, tone: "bg-lime text-navy", title: "24 × 7 Support", body: "Tele-support for you" },
];

export function WhyChooseUs() {
  return (
    <section className="bg-mist px-6 pb-[83px] pt-[72px]">
      <h2 className="text-center text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[60px]">
        Why 50,000+ drivers choose us
      </h2>
      <div className="mx-auto mt-12 grid max-w-[1248px] items-center gap-10 lg:mt-[72px] lg:grid-cols-[568px_1fr] lg:gap-16">
        <div className="relative mx-auto aspect-[512/640] w-full max-w-[512px] overflow-hidden rounded-2xl lg:mx-0">
          <Image
            src="/figma/why-driver.jpg"
            alt="Everest driver standing at the open door of his car"
            fill
            sizes="(min-width: 1024px) 512px, 100vw"
            className="object-cover"
          />
        </div>
        <ul className="flex flex-col gap-1.5 lg:max-w-[512px]">
          {benefits.map(({ icon: BenefitIcon, tone, title, body }) => (
            <li key={title} className="flex items-center gap-[18px] py-[18px] pl-[18px]">
              <span className={`grid size-12 shrink-0 place-items-center rounded-lg ${tone}`}>
                <BenefitIcon size={32} weight="bold" />
              </span>
              <div>
                <p className="text-2xl font-semibold leading-8 text-navy lg:text-[36px] lg:leading-[44px]">{title}</p>
                <p className="text-base leading-6 text-ink-soft lg:text-lg">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
