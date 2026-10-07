export const LEAD_STATUSES = ["new", "contacted", "converted", "closed"] as const;

/** The filters the leads page passes on to Jarvis; anything else in the address is dropped. */
const FILTERS = ["status", "source", "city", "q", "date_from", "date_to", "page"] as const;

export type LeadFilters = Partial<Record<(typeof FILTERS)[number], string>>;

export function leadFilters(params: URLSearchParams | Record<string, string | string[] | undefined>): LeadFilters {
  const get = (key: string) =>
    params instanceof URLSearchParams ? params.get(key) : [params[key]].flat()[0];
  const out: LeadFilters = {};
  for (const key of FILTERS) {
    const value = get(key)?.trim();
    if (value) out[key] = value.slice(0, 60);
  }
  return out;
}

export function leadQuery(params: URLSearchParams | Record<string, string | string[] | undefined>): string {
  return new URLSearchParams(leadFilters(params)).toString();
}
