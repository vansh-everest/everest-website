import { Car, DollarSign, Form, MapPin } from "lucide-react";
import { SectionHead } from "./section-head";

const steps = [
  { icon: Form, tone: "text-brand", title: "Register Online", body: "Fill a short form in under 2 minutes." },
  { icon: Car, tone: "text-navy", title: "Pick Your Vehicle", body: "Choose a vehicle and earning model." },
  { icon: MapPin, tone: "text-navy", title: "Hit The Road", body: "Start driving and earning immediately." },
  { icon: DollarSign, tone: "text-navy", title: "Get Paid", body: "Reliable weekly payouts and transparent earnings." },
];

export function HowItWorks() {
  return (
    <section className="bg-white px-6 py-16 lg:px-20">
      <SectionHead eyebrow="Process" title="How Does It Work?" sub="A simple, transparent journey from registration to your first payout." />
      <ol className="mx-auto mt-10 grid max-w-[1280px] grid-cols-2 gap-3 sm:mt-16 sm:gap-8 lg:grid-cols-4">
        {steps.map(({ icon: Icon, tone, title, body }, i) => (
          <li key={title} className="rounded-2xl border border-line bg-white p-4 shadow-[0_10px_30px_rgba(6,47,80,0.08)] sm:p-8 lg:h-[274px]">
            {/* Side by side on a phone, where the cards are two across; stacked from sm up. */}
            <div className="flex items-center gap-3 sm:block">
              <span className="grid size-10 place-items-center rounded-full bg-sun text-base font-bold text-navy sm:size-12 sm:text-[17px]">
                {i + 1}
              </span>
              <span className={`grid size-10 place-items-center rounded-lg bg-mist sm:mt-5 sm:size-12 ${tone}`}>
                <Icon size={22} strokeWidth={1.75} />
              </span>
            </div>
            <h3 className="mt-4 text-[17px] font-bold leading-[22px] text-navy sm:mt-5 sm:text-xl sm:leading-6">{title}</h3>
            <p className="mt-1.5 text-sm leading-5 text-ink-soft sm:mt-2 sm:text-[15px] sm:leading-[21px]">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
