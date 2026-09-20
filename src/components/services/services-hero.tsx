import Image from "next/image";
import Link from "next/link";

export function ServicesHero() {
  return (
    <section className="relative h-[560px] overflow-hidden lg:h-[869px]">
      <Image
        src="/figma/svc-hero.webp"
        alt="Electric sedan on a city street at dusk"
        fill
        preload
        loading="eager"
        sizes="100vw"
        className="object-cover object-[70%_center] lg:object-center"
      />
      <div className="absolute inset-x-6 top-16 lg:left-[75px] lg:right-auto lg:top-[175px]">
        <p className="inline-flex h-[31px] items-center rounded-full border-[1.5px] border-sun px-4 text-xs font-bold uppercase tracking-[1px] text-sun lg:text-[13px]">
          India&apos;s fastest growing fleet
        </p>
        <h1 className="mt-5 text-5xl font-bold leading-[1.1] tracking-[-1px] text-white lg:text-[80px] lg:leading-[88px]">
          Drive. Earn.
          <br />
          Thrive.
          <br />
          Your Way.
        </h1>
        <Link href="/#apply" className="mt-11 inline-flex h-12 items-center rounded-full bg-sun px-6 text-[15px] font-medium text-navy">
          Start Driving Today
        </Link>
      </div>
    </section>
  );
}
