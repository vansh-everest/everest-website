import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, PenSquare, RefreshCw } from "lucide-react";
import { readSession } from "@/lib/auth";
import { getLiveStatus, siteCarFor, siteCityFor, type LivePlanPrice } from "@/lib/fleet-data";
import { fleetConnectEnabled, jarvisAdminEnabled } from "@/lib/jarvis";
import { getContent } from "@/lib/store";
import { refreshLiveDataAction } from "./actions";

export const dynamic = "force-dynamic";

const inr = (n: number | null) => (n === null ? "" : `₹${n.toLocaleString("en-IN")}`);

/** "₹650/day · ₹15,000 deposit", or a dash where Jarvis quotes nothing. */
function quote(p: LivePlanPrice | undefined): string {
  if (!p) return "–";
  const parts = [
    p.rent !== null ? `${inr(p.rent)}/day` : "",
    p.upfront !== null ? `${inr(p.upfront)} upfront` : "",
    p.deposit !== null ? `${inr(p.deposit)} deposit` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "–";
}

function updated(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

const button = "flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-navy hover:bg-mist";

export default async function LiveDataPage() {
  if (!fleetConnectEnabled()) redirect("/admin");
  if (!(await readSession())) redirect("/admin");

  const [{ live, error }, content] = await Promise.all([getLiveStatus(), getContent()]);
  const plans = content.plans.filter((p) => p.visible);
  const matched = new Set((live?.cities ?? []).map((c) => siteCityFor(c, content)).filter(Boolean));
  const unmatched = content.cities.filter((c) => !matched.has(c.slug));
  const ready = (live?.cities ?? []).reduce((sum, c) => sum + c.readyCars, 0);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-line bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center gap-3 px-4 lg:px-6">
          <Image src="/figma/logo.png" alt="Everest Fleet" width={135} height={78} className="h-11 w-auto" />
          <span aria-hidden className="h-6 w-px bg-line" />
          <h1 className="text-[15px] font-bold text-navy">Live data</h1>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <form action={refreshLiveDataAction}>
              <button type="submit" className={button}>
                <RefreshCw size={14} />
                Refresh
              </button>
            </form>
            {jarvisAdminEnabled() ? (
              <Link href="/admin/leads" className={button}>
                <Inbox size={14} />
                <span className="hidden sm:inline">Leads</span>
              </Link>
            ) : null}
            <Link href="/admin" className={button}>
              <PenSquare size={14} />
              <span className="hidden sm:inline">Site content</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 py-6 lg:px-6">
        {!live ? (
          <div className="rounded-2xl border border-line bg-white p-6 text-sm text-ink-soft">
            <p>Jarvis cities: 0</p>
            {error ? <p className="mt-2 font-mono text-xs text-navy">{error}</p> : null}
          </div>
        ) : (
          <>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-ink-soft">Updated</dt>
                <dd className="font-semibold text-navy">{updated(live.at)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-soft">Jarvis cities</dt>
                <dd className="font-semibold text-navy">{live.cities.length}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-soft">Ready cars</dt>
                <dd className="font-semibold text-navy">{ready.toLocaleString("en-IN")}</dd>
              </div>
              {unmatched.length ? (
                <div className="flex gap-2">
                  <dt className="text-ink-soft">Site cities without Jarvis figures</dt>
                  <dd className="font-semibold text-navy">{unmatched.map((c) => c.name.en).join(", ")}</dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6 grid gap-4">
              {live.cities.map((city) => {
                const slug = siteCityFor(city, content);
                const siteCity = content.cities.find((c) => c.slug === slug);
                return (
                  <section key={city.id} className="min-w-0 rounded-2xl border border-line bg-white p-5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-lg font-bold text-navy">{city.name}</h2>
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${siteCity ? "bg-mist text-navy" : "bg-sun/20 text-navy"}`}>
                        {siteCity ? `Site: ${siteCity.name.en}` : "Not on the site"}
                      </span>
                      <span className="text-sm text-ink-soft">
                        {city.readyCars.toLocaleString("en-IN")} ready · {city.hubs.length} {city.hubs.length === 1 ? "hub" : "hubs"}
                        {city.recommendedCar ? ` · Recommended: ${city.recommendedCar}` : ""}
                      </span>
                    </div>

                    {city.cars.length ? (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[720px] whitespace-nowrap text-left text-[13px]">
                          <thead className="text-ink-soft">
                            <tr className="border-b border-line">
                              <th className="py-2 pr-3 font-medium">Car</th>
                              <th className="py-2 pr-3 font-medium">Site car</th>
                              {plans.map((p) => (
                                <th key={p.id} className="py-2 pr-3 font-medium">
                                  {p.name.en}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {city.cars.map((car) => {
                              const siteCar = siteCarFor(car.name, content);
                              return (
                                <tr key={car.name} className="border-b border-line last:border-0">
                                  <td className="py-2 pr-3 font-semibold text-navy">
                                    {car.name}
                                    <span className="ml-1.5 font-normal text-ink-soft">{car.fuel}</span>
                                  </td>
                                  <td className="py-2 pr-3 text-ink-soft">
                                    {siteCar ? content.cars.find((c) => c.id === siteCar)?.name : "–"}
                                  </td>
                                  {plans.map((p) => (
                                    <td key={p.id} className="py-2 pr-3 text-navy">
                                      {quote(car.plans[p.id])}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-ink-soft">0 cars ready to hand over.</p>
                    )}

                    {city.hubs.length ? (
                      <ul className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
                        {city.hubs.map((hub) => (
                          <li key={`${hub.name}|${hub.address}`} className="rounded-xl bg-mist px-3 py-2">
                            <p className="font-semibold text-navy">
                              {hub.mapUrl ? (
                                <a href={hub.mapUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                                  {hub.name}
                                </a>
                              ) : (
                                hub.name
                              )}
                            </p>
                            <p className="text-ink-soft">{hub.address}</p>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}
