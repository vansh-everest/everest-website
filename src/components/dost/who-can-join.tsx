import { Briefcase, Building2, Truck, User, UserPlus, Users, type LucideIcon } from "lucide-react";

/** The phone export writes the card titles in sentence case, the desktop one in title case. */
const WHO: { icon: LucideIcon; title: string; titlePhone?: string; body: string }[] = [
  { icon: Users, title: "Driver Sourcing Agents", titlePhone: "Driver sourcing agents", body: "Earn on every driver you place" },
  { icon: Briefcase, title: "Agents", body: "Drivers already come to you" },
  { icon: Truck, title: "Logistics Businesses", titlePhone: "Logistics businesses", body: "Put your network of drivers to work" },
  { icon: UserPlus, title: "Anyone who knows Drivers", titlePhone: "Anyone who knows drivers", body: "Friends, family or your neighbourhood" },
  { icon: User, title: "Individuals", body: "Aadhaar, PAN and address proof" },
  { icon: Building2, title: "Companies", body: "Pvt Ltd, LLP, partnership or sole owner" },
];

export function WhoCanJoin() {
  return (
    <section className="bg-[#f2f5fd] px-4 pb-[45px] pt-12 lg:pb-[73px] lg:pt-[68px]">
      <div className="text-center">
        <p className="text-[12.5px] font-medium uppercase leading-4 tracking-[0.6px] text-brand lg:text-[13px] lg:font-semibold lg:tracking-[1px]">
          Who can become Everest Dost
        </p>
        <h2 className="mx-auto mt-[7px] max-w-[380px] text-2xl font-bold leading-[31px] text-navy sm:max-w-none lg:mt-4 lg:text-[46px] lg:leading-[56px]">
          If You Know Drivers, You Can Be A Dost
        </h2>
        <p className="mt-3.5 hidden text-[17px] leading-6 text-ink-soft lg:block">
          Join on your own or as a company, whichever fits how you work.
        </p>
      </div>
      <ul className="mx-auto mt-[27px] grid max-w-[800px] grid-cols-2 gap-3 lg:mt-[74px] lg:gap-6">
        {WHO.map(({ icon: Icon, title, titlePhone, body }) => (
          <li
            key={title}
            className="min-h-40 rounded-xl lg:min-h-0 border border-[#dfe6f2] bg-white px-4 pb-4 pt-[15px] shadow-[0_1px_2px_rgba(6,47,80,0.04)] lg:flex lg:h-[96px] lg:items-center lg:gap-4 lg:rounded-2xl lg:px-5 lg:py-0"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#eaf3fb] text-brand lg:size-14 lg:rounded-full">
              <Icon className="size-[17px] lg:size-7" strokeWidth={1.5} />
            </span>
            <span className="mt-[18px] block lg:mt-0">
              <span className="block text-[14.5px] font-bold leading-[18px] text-navy lg:text-xl lg:leading-7">
                {titlePhone ? (
                  <>
                    <span className="lg:hidden">{titlePhone}</span>
                    <span className="hidden lg:inline">{title}</span>
                  </>
                ) : (
                  title
                )}
              </span>
              <span className="mt-1 block text-[12.5px] leading-[15px] text-ink-soft lg:mt-[5px] lg:text-[14.5px] lg:leading-[22px]">
                {body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
