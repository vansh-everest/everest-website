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
      <ol className="mx-auto mt-16 grid max-w-[1280px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, tone, title, body }, i) => (
          <li key={title} className="rounded-2xl border border-line bg-white p-8 shadow-[0_10px_30px_rgba(6,47,80,0.08)] lg:h-[274px]">
            <span className="grid size-12 place-items-center rounded-full bg-sun text-[17px] font-bold text-navy">{i + 1}</span>
            <span className={`mt-5 grid size-12 place-items-center rounded-lg bg-mist ${tone}`}>
              <Icon size={24} strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 text-xl font-bold leading-6 text-navy">{title}</h3>
            <p className="mt-2 text-[15px] leading-[21px] text-ink-soft">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
