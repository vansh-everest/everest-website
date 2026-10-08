import { Eye, IndianRupee, UserPlus, Users, type LucideIcon } from "lucide-react";

const BENEFITS: { icon: LucideIcon; title: string; points: [string, string] }[] = [
  { icon: IndianRupee, title: "Make It Your Side Business", points: ["Keep Your Job, Refer In Your Free Time", "The More You Refer, The More You Earn"] },
  { icon: Eye, title: "Everything Is Transparent", points: ["Track Every Referral, Stage By Stage", "See Every Payout, Itemised In The App"] },
  { icon: UserPlus, title: "No Driving Required", points: ["Just Refer Family, Friends And People You Know", "No Car Or Driving Licence Needed"] },
  { icon: Users, title: "Grow Your Own Network", points: ["Add Sub-Vendors Under You", "You Both Get Paid On Their Referrals"] },
];

export function DostBenefits() {
  return (
    <section className="bg-paper px-4 lg:bg-[#f0f4f8] pb-12 pt-12 lg:pb-[98px] lg:pt-24">
      <div className="text-center">
        <p className="text-[12.5px] font-medium uppercase leading-4 tracking-[0.6px] text-brand lg:text-[13px] lg:font-semibold lg:tracking-[1px]">
          Benefits
        </p>
        <h2 className="mt-[7px] text-2xl font-bold capitalize leading-[30px] text-navy lg:mt-[11px] lg:text-[52px] lg:normal-case lg:leading-[60px]">
          What You Get As A Dost
        </h2>
      </div>
      <ul className="mx-auto mt-6 grid max-w-[1104px] gap-4 lg:mt-[52px] lg:grid-cols-2 lg:gap-x-6 lg:gap-y-7">
        {BENEFITS.map(({ icon: Icon, title, points }) => (
          <li
            key={title}
            className="rounded-xl border border-line bg-white px-[19px] pb-5 pt-[19px] lg:min-h-[243px] lg:rounded-3xl lg:px-[30px] lg:pb-10 lg:pt-[30px]"
          >
            <h3 className="flex items-center gap-2 text-base font-bold leading-6 text-navy lg:block lg:text-2xl lg:leading-[30px]">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#e8f2fa] text-brand lg:mb-[19px] lg:size-[50px] lg:rounded-xl">
                <Icon className="size-4 lg:size-6" strokeWidth={1.75} />
              </span>
              {title}
            </h3>
            <ul className="mt-[11px] grid text-[13.5px] leading-[19px] text-ink-soft lg:mt-[19px] lg:gap-2 lg:text-[14.5px] lg:leading-[22px]">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-[7px] pl-[3px] lg:gap-3 lg:pl-0">
                  <span aria-hidden className="size-[3px] shrink-0 rounded-full bg-ink-soft lg:size-1.5 lg:bg-sun" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
