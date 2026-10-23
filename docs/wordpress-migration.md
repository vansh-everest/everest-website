# everestfleet.com: WordPress to this site

Audit of 23 Oct 2026. Every address in the WordPress sitemaps (`/sitemap_index.xml`, 15 sub-sitemaps, 3,903 URLs) and the old menus, checked against this site at website-admin.everestfleet.com.

Nothing below is built yet. Each "To decide" row needs an owner's call before the domain moves.

## Summary

| Group | URLs | Here |
|---|---|---|
| Marketing pages, driver city pages, legal pages | 16 | Served at the same address |
| Press stories | 22 | Served at the same address |
| Old pages with a new home (jobs, thank-you, team, logistics, mobility) | 35 | 308 redirect |
| Public pages with no home yet | 3 (plus `/feed/` and `/contact/`, not in the sitemap) | 404 |
| Intranet (HR policies, birthdays, anniversaries, announcements) | 3,811 | 404 |
| WordPress leftovers (categories, author, theme parts, test pages) | 16 | 404 |

## Served at the same address

`/`, `/drive-with-us/`, the 7 `/drive-with-us/driver-job-in-<city>/` pages, `/intercity/`, `/advertise-with-us/`, `/newsroom/`, `/privacy-policy/`, `/terms-of-service/`, `/app-privacy-policy/`, `/terms-and-conditions-for-referral-program/`, and all 22 press stories at their root addresses.

## Redirected (next.config.ts, `MOVED`)

| Old | Goes to | Note |
|---|---|---|
| `/OwnNow/` | `/own-now/` | |
| `/about-everest-fleet/` | `/about-us/` | |
| `/our-team/` | `/about-us/` | To decide: `/investors/#leadership` now lists the full team |
| `/gallery/` | `/about-us/` | To decide: `/careers/` now carries the gallery photos |
| `/career/`, `/job-opening/*` (10), 11 old job pages | `/careers/` | |
| `/everest-fleet-logistics/` | `/fleet-logistics/` | |
| `/everest-employee-mobility/` | `/employee-mobility/` | |
| `/thank-you-<city>/` (7) | that city's driver page | |
| `/thank-you/` | `/` | |
| `/sitemap_index.xml`, `/wp-sitemap.xml`, `/page-sitemap.xml`, `/post-sitemap.xml`, `/category-sitemap.xml`, `/author-sitemap.xml` | `/sitemap.xml` | Added 23 Oct |

## Public pages with no home yet (To decide)

| Old | What it is | Options |
|---|---|---|
| `/contact-us/` (and `/contact/`) | Contact page with the registered office address | Build a contact page, or redirect to `/about-us/` (footer carries the address) |
| `/franchise/` | Franchise programme: why, commitment, investment, recruitment | Redirect to `/eip/` once that page is public, or build |
| `/ride-hailing-business/` | Drive-with-Uber landing page (rental cars, weekly payouts) | Redirect to `/drive-to-earn/` or `/drive-with-us/` |
| `/feed/` | WordPress RSS feed | Redirect to `/blog/`, or add an RSS route |

## Intranet (To decide)

Not part of the public site. Today all of it is public and indexed, including employee names with birthdays and work anniversaries.

| Old | URLs |
|---|---|
| `/intranet/`, `/hr-policies/`, `/announcement/`, `/department-schedule/`, `/policy-announcment/` | 5 |
| `/document/*`: leave, exit, payroll, appraisal, code of conduct and 9 more HR policies | 14 |
| `/announcement/*`, `/department-schedule/*`, `/department/*` (hr, it, operation) | 8 |
| `/emplyoee-spotlight/*` | 28 |
| `/birthday/*` | 1,878 |
| `/work-anniversary/*` | 1,878 |

Options: keep WordPress running on a subdomain behind a login (for example intranet.everestfleet.com) and redirect these paths there, or let them return 410 Gone. Either way, take them out of public search.

## WordPress leftovers (return 404 or 410)

`/sample-page/`, `/register-3/`, `/author/jbmh3/`, `/elementor-hf/*` (4), `/category/*` (9; the city ones could redirect to that city's driver page).

`/wp-content/uploads/*`: the old images. Press sites and Google Images link to some of them. Once the domain moves they 404, unless WordPress stays reachable on a subdomain and these paths redirect there.

## Tracking and verification

| Item | Old site | This site |
|---|---|---|
| GA4 `G-4HGGTJ2JEN` | gtag on every page | Inside GTM `GTM-5PC2NFDV` |
| Google tag `GT-K4TP2VLL` | gtag on every page | To check: confirm it is in the GTM container |
| Google Ads `AW-10887541567` | | Inside GTM |
| Search Console | Verified by DNS TXT | Survives the move |
| Meta/Bing verification tags | None | None |

GTM loads only on everestfleet.com, so it starts with the domain switch.

## Crawler files

| File | Old site | This site |
|---|---|---|
| `/robots.txt` | Yoast default, points to `/sitemap_index.xml` | Named crawlers allowed; `/api/`, `/admin/`, `/thank-you` blocked; points to `/sitemap.xml` |
| `/sitemap.xml` | Yoast index of 15 sitemaps | One sitemap, 121 URLs: pages, driver pages in every language, blog, press |
| `/llms.txt` | None | Every public page, latest press, legal pages |
| `/ads.txt`, `/security.txt` | None | None |

## At the switch

1. Point everestfleet.com at Amplify (infra).
2. In Search Console, submit `/sitemap.xml`.
3. Spot-check the redirect rows above on the real domain.
4. Watch Search Console's 404 report for two weeks and add redirects for anything with traffic.
