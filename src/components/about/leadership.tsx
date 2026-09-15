import Image from "next/image";

// Names, photos and bios are the Figma placeholders until the real team details arrive.
const leaders = [
  { name: "Founder Name 1", title: "Co-Founder & CEO", bio: "10+ years in fleet management", img: "/figma/leader-1.jpg" },
  { name: "Founder Name 2", title: "Co-Founder & COO", bio: "Scaling operations across 7 cities", img: "/figma/leader-2.jpg" },
  { name: "Founder Name 3", title: "Head of Operations", bio: "Driver-first operations leader", img: "/figma/leader-3.jpg" },
  { name: "Founder Name 4", title: "Head of Driver Relations", bio: "Champion for 35,000+ drivers", img: "/figma/leader-4.jpg" },
];

export function Leadership() {
  return (
    <section className="bg-white px-6 py-[72px]">
      <div className="text-center">
        <p className="inline-flex h-[29px] items-center rounded-full bg-navy px-4 text-xs font-bold uppercase tracking-[1px] text-white">
          Meet the team
        </p>
        <h2 className="mt-4 text-[34px] font-bold leading-tight tracking-[-0.5px] text-navy lg:text-[64px] lg:leading-[77px]">
          The People Behind Everest
        </h2>
        <p className="mt-4 text-lg leading-[19px] text-ink-soft">Driven by purpose. United by vision.</p>
      </div>
      <ul className="mx-auto mt-10 grid max-w-[1104px] gap-6 md:grid-cols-2">
        {leaders.map((leader) => (
          <li key={leader.name} className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_1px_3px_rgba(6,47,80,0.08)]">
            <div className="relative h-[224px]">
              <Image src={leader.img} alt={leader.name} fill sizes="(min-width: 768px) 540px, 100vw" className="object-cover" />
            </div>
            <div className="px-5 pb-5 pt-[18px]">
              <div className="flex items-center justify-between">
                <p className="text-[22px] font-bold leading-6 text-navy">{leader.name}</p>
                <a
                  href="#"
                  aria-label={`${leader.name} on LinkedIn`}
                  className="grid size-4 place-items-center rounded-[3px] bg-[#9ca3af] text-[9px] font-bold leading-none text-white"
                >
                  in
                </a>
              </div>
              <span aria-hidden className="mt-2 block h-[3px] w-8 bg-sun" />
              <p className="mt-2 text-[15px] leading-[17px] text-navy">{leader.title}</p>
              <p className="mt-2 text-sm leading-4 text-ink-soft">{leader.bio}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center">
        <a href="#" className="text-[15px] font-semibold leading-[17px] text-navy">
          View full leadership team →
        </a>
      </p>
    </section>
  );
}
