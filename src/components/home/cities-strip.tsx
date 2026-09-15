import Image from "next/image";

const cities = [
  { name: "Mumbai", src: "/figma/city-mumbai.png", w: 119, h: 117 },
  { name: "Chennai", src: "/figma/city-chennai.png", w: 115, h: 115 },
  { name: "Pune", src: "/figma/city-pune.png", w: 140, h: 117 },
  { name: "Delhi", src: "/figma/city-delhi.png", w: 117, h: 117 },
  { name: "Hyderabad", src: "/figma/city-hyderabad.png", w: 117, h: 117 },
  { name: "Kolkata", src: "/figma/city-kolkata.png", w: 170, h: 116 },
];

export function CitiesStrip() {
  return (
    <section className="bg-blue-gradient-x">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6 py-10 lg:h-[241px] lg:flex-row lg:gap-0 lg:py-0 lg:pl-[43px] lg:pr-0">
        <h2 className="text-center text-[28px] font-medium leading-[44px] text-white lg:w-[174px] lg:text-left lg:text-[32px]">
          Cities we operate in
        </h2>
        <span aria-hidden className="hidden h-[211px] w-px bg-white/40 lg:ml-[62px] lg:mr-[58px] lg:block" />
        <ul className="grid grid-cols-3 gap-6 sm:grid-cols-6 lg:flex lg:gap-7">
          {cities.map((city) => (
            <li key={city.name} className="flex w-[100px] flex-col items-center gap-4 lg:w-36">
              {/* Cropped from the design render; "lighten" drops the baked-in blue behind the line art. */}
              <Image
                src={city.src}
                alt=""
                width={city.w}
                height={city.h}
                className="h-[80px] w-auto mix-blend-lighten lg:h-[117px]"
              />
              <span className="text-sm font-medium uppercase leading-[23px] text-white lg:text-lg">{city.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
