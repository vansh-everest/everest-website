import Image from "next/image";
import { ChartBar, Headset, UserRoundCog, ZapOff } from "lucide-react";

const points = [
  { icon: UserRoundCog, title: "Driver Support", body: "Dedicated support programs ensuring our drivers are trained, motivated, and cared for." },
  { icon: ChartBar, title: "Tech-Driven Operations", body: "Smart dispatch, real-time tracking, and data-driven route optimization at your fingertips." },
  { icon: ZapOff, title: "Sustainability", body: "EV-forward fleet commitment reducing carbon footprint one route at a time." },
  { icon: Headset, title: "24/7 Assistance", body: "Round-the-clock customer and driver support so help is always one call away." },
];

export function Difference() {
  return (
    <section className="bg-blue-gradient px-6 py-20 lg:px-20 lg:py-[120px]">
      <div className="mx-auto max-w-[1280px]">
        <h2 className="text-[34px] font-light uppercase leading-tight text-white lg:text-[64px] lg:leading-[64px]">
          The Everest Fleet difference
        </h2>
        <p className="mt-3 flex items-center gap-4 text-lg text-sun lg:text-xl">
          <span aria-hidden className="h-0.5 w-10 bg-sun" />
          What sets us apart from the rest
        </p>
        <div className="mt-16 grid overflow-hidden rounded-3xl bg-navy lg:h-[400px] lg:grid-cols-[780px_1fr]">
          <div className="px-8 py-12 lg:px-16 lg:pb-0 lg:pt-[92px]">
            <p className="text-sm font-bold uppercase leading-[17px] text-sun">Core advantage</p>
            <h3 className="mt-4 text-4xl font-light leading-tight text-white lg:text-5xl lg:leading-[58px]">Fleet Quality</h3>
            <p className="mt-4 max-w-[600px] text-lg leading-[30px] text-white/80 lg:text-xl">
              Modern, well-maintained vehicles with rigorous safety inspections to keep every journey reliable.
            </p>
            <p className="mt-8 flex items-center gap-3 text-sm font-bold uppercase text-white">
              Safety score: 98%
              <span aria-hidden className="h-4 w-px bg-white/30" />
              Daily inspections
            </p>
          </div>
          <div className="relative aspect-[5/4] lg:aspect-auto">
            <Image
              src="/figma/difference-car.jpg"
              alt="Everest Fleet sedan on a rain-lit city street"
              fill
              sizes="(min-width: 1024px) 500px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {points.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-center gap-8 rounded-3xl bg-[#111b21] p-8 lg:h-[165px] lg:px-10 lg:py-0">
              <span className="grid size-14 shrink-0 place-items-center text-sun">
                <Icon size={40} strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="text-2xl font-light leading-[29px] text-white">{title}</h3>
                <p className="mt-2 text-base leading-6 text-white/60">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
