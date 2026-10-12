import Script from "next/script";
import { GA_ID, GTM_ID } from "@/lib/analytics";
import { SITE_URL } from "@/lib/company";

/**
 * Tags run on the live domain only. Drafts and previews (the Amplify address, website-admin,
 * localhost) load nothing, so test visits and test leads never reach GA4 or the Ads conversion.
 */
const LIVE = new URL(SITE_URL).hostname;
const onLive = `['${LIVE}','www.${LIVE}'].indexOf(location.hostname)>-1`;

/**
 * Google's tags, on public pages only. With NEXT_PUBLIC_GTM_ID the Tag Manager container loads and
 * carries GA4 and the Ads tag itself, so GA4 is not loaded a second time; otherwise
 * NEXT_PUBLIC_GA_ID loads GA4 on its own. With neither, nothing renders.
 */
export function Analytics() {
  if (GTM_ID) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`if(${onLive}){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');}`}
      </Script>
    );
  }
  if (!GA_ID) return null;
  return (
    <Script id="ga4" strategy="afterInteractive">
      {`if(${onLive}){var t=document.createElement('script');t.async=true;t.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(t);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');}`}
    </Script>
  );
}
