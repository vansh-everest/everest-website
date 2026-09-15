import Image from "next/image";
import { SectionHead } from "./section-head";

const rows = [
  {
    img: "/figma/svc-benefit-1.jpg",
    alt: "Smiling fleet driver holding a tablet with an earnings chart",
    title: "Earn On Your Terms",
    body: "Choose when you drive and how much you earn. Flexible plans designed for professionals who value control.",
  },
  {
    img: "/figma/svc-benefit-2.jpg",
    alt: "Workshop bench laid out with maintenance tools",
    title: "We Handle All Maintenance",
    body: "24×7 on-road assistance and scheduled maintenance so you can focus on driving, not repairs.",
    flip: true,
  },
  {
    img: "/figma/svc-benefit-3.jpg",
    alt: "Car key on a road that leads to vehicle ownership",
    title: "Drive Now, Own Later",
    body: "Build equity toward ownership with every trip. A clear path from your first drive to owning your vehicle.",
  },
];

export function BenefitRows() {
  return (
    <section className="bg-white px-6 py-16 lg:px-20">
      <SectionHead eyebrow="Benefits" title="Benefits For You" sub="A better way to drive, earn, and own." />
      <ul className="mx-auto mt-16 max-w-[1280px] space-y-12">
        {rows.map((row) => (
          <li
            key={row.title}
            className={`grid items-center gap-8 lg:gap-12 ${row.flip ? "lg:grid-cols-[1fr_560px]" : "lg:grid-cols-[560px_1fr]"}`}
          >
            <div className={`relative aspect-[560/320] overflow-hidden rounded-3xl ${row.flip ? "lg:order-2" : ""}`}>
              <Image src={row.img} alt={row.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
            <div className={row.flip ? "lg:order-1" : ""}>
              <h3 className="text-[30px] font-bold leading-tight text-navy lg:text-[40px] lg:leading-[48px]">{row.title}</h3>
              <p className="mt-3 text-lg leading-8 text-ink-soft lg:text-xl">{row.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
