/**
 * The site's two addresses (see src/proxy.ts). MAIN_SITE_URL is the main site: the Amplify address
 * until everestfleet.com points at this app, then https://everestfleet.com.
 */
export const ADMIN_HOST = process.env.ADMIN_HOST || "website-admin.everestfleet.com";
export const MAIN_SITE_URL = (process.env.MAIN_SITE_URL || "https://main.dnki9wkljicay.amplifyapp.com").replace(/\/+$/, "");
