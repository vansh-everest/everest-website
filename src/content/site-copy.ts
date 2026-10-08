import { DEFAULT_LOCALE, isMainLocale, type Locale, type MainLocale } from "@/lib/i18n";

/**
 * The words around every page (top bar, header, menus, footer) in English, Hindi and Kannada.
 * A page in another language keeps the English. Product names stay in Latin script.
 * A key missing from any language fails the type check.
 */

/** Every link the header, menus and footer carry. */
export type LinkKey =
  | "home"
  | "about"
  | "plans"
  | "ownNow"
  | "driveToEarn"
  | "driveToOwn"
  | "services"
  | "fleetLogistics"
  | "employeeMobility"
  | "intercity"
  | "advertise"
  | "dost"
  | "forInvestors"
  | "blog"
  | "esg"
  | "faq"
  | "benefits"
  | "careers"
  | "investorHub"
  | "metrics"
  | "leadership"
  | "reports"
  | "whatsapp"
  | "investorsPartners";

export type SiteCopy = {
  links: Record<LinkKey, string>;
  header: {
    driveWithUs: string;
    /** The main navigation's accessible name. */
    main: string;
    menu: string;
    closeMenu: string;
    /** `{label}` prints the group's name, e.g. "Our Plans pages". */
    groupPages: string;
    /** `{phone}` prints the phone number. */
    call: string;
  };
  language: { title: string; titleLocal: string };
  footer: {
    /** `{vehicles}`, `{cities}` and `{founded}` print the company figures. */
    blurb: string;
    drivers: string;
    company: string;
    investors: string;
    contact: string;
    /** `{year}` prints the current year. */
    rights: string;
    /** The social buttons' accessible names. */
    instagram: string;
    linkedin: string;
  };
};

const en: SiteCopy = {
  links: {
    home: "Home",
    about: "About Us",
    plans: "Our Plans",
    ownNow: "Own Now",
    driveToEarn: "Drive To Earn",
    driveToOwn: "Drive To Own",
    services: "Other Services",
    fleetLogistics: "Fleet Logistics",
    employeeMobility: "Employee Mobility",
    intercity: "Intercity",
    advertise: "Advertise With Us",
    dost: "Everest Dost",
    forInvestors: "For Investors",
    blog: "Blogs",
    esg: "ESG Report",
    faq: "Driver FAQs",
    benefits: "Benefits",
    careers: "Careers",
    investorHub: "Investor Hub",
    metrics: "Metrics & Impact",
    leadership: "Leadership",
    reports: "Reports & Downloads",
    whatsapp: "WhatsApp Us",
    investorsPartners: "For Investors & Partners",
  },
  header: {
    driveWithUs: "Drive With Us",
    main: "Main",
    menu: "Menu",
    closeMenu: "Close menu",
    groupPages: "{label} pages",
    call: "Call {phone}",
  },
  language: { title: "Select Language", titleLocal: "भाषा चुनें" },
  footer: {
    blurb:
      "India's Largest Fleet Management Company. {vehicles} vehicles. {cities} cities. " +
      "Powering driver earnings and investor returns since {founded}.",
    drivers: "Drivers",
    company: "Company",
    investors: "Investors",
    contact: "Contact",
    rights: "© {year} Everest Fleet Pvt Ltd. All rights reserved.",
    instagram: "Everest Fleet on Instagram",
    linkedin: "Everest Fleet on LinkedIn",
  },
};

const hi: SiteCopy = {
  links: {
    home: "होम",
    about: "हमारे बारे में",
    plans: "हमारे प्लान",
    ownNow: "Own Now",
    driveToEarn: "Drive To Earn",
    driveToOwn: "Drive To Own",
    services: "दूसरी सेवाएँ",
    fleetLogistics: "फ्लीट लॉजिस्टिक्स",
    employeeMobility: "कर्मचारियों का सफ़र",
    intercity: "इंटरसिटी",
    advertise: "हमारे साथ विज्ञापन",
    dost: "Everest Dost",
    forInvestors: "निवेशकों के लिए",
    blog: "ब्लॉग",
    esg: "ESG रिपोर्ट",
    faq: "ड्राइवरों के सवाल",
    benefits: "फ़ायदे",
    careers: "करियर",
    investorHub: "निवेशक हब",
    metrics: "आँकड़े और असर",
    leadership: "लीडरशिप",
    reports: "रिपोर्ट और डाउनलोड",
    whatsapp: "WhatsApp कीजिए",
    investorsPartners: "निवेशकों और पार्टनर्स के लिए",
  },
  header: {
    driveWithUs: "हमारे साथ चलाइए",
    main: "मुख्य",
    menu: "मेन्यू",
    closeMenu: "मेन्यू बंद करें",
    groupPages: "{label} के पेज",
    call: "कॉल करें {phone}",
  },
  language: { title: "भाषा चुनें", titleLocal: "Select Language" },
  footer: {
    blurb:
      "भारत की सबसे बड़ी फ्लीट मैनेजमेंट कंपनी। {vehicles} गाड़ियाँ। {cities} शहर। " +
      "{founded} से ड्राइवरों की कमाई और निवेशकों का मुनाफ़ा बढ़ा रहे हैं।",
    drivers: "ड्राइवर",
    company: "कंपनी",
    investors: "निवेशक",
    contact: "संपर्क",
    rights: "© {year} Everest Fleet Pvt Ltd. सर्वाधिकार सुरक्षित।",
    instagram: "Instagram पर Everest Fleet",
    linkedin: "LinkedIn पर Everest Fleet",
  },
};

const kn: SiteCopy = {
  links: {
    home: "ಮುಖಪುಟ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    plans: "ನಮ್ಮ ಪ್ಲಾನ್‌ಗಳು",
    ownNow: "Own Now",
    driveToEarn: "Drive To Earn",
    driveToOwn: "Drive To Own",
    services: "ಇತರ ಸೇವೆಗಳು",
    fleetLogistics: "ಫ್ಲೀಟ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್",
    employeeMobility: "ಉದ್ಯೋಗಿಗಳ ಪ್ರಯಾಣ",
    intercity: "ಇಂಟರ್‌ಸಿಟಿ",
    advertise: "ನಮ್ಮೊಂದಿಗೆ ಜಾಹೀರಾತು",
    dost: "Everest Dost",
    forInvestors: "ಹೂಡಿಕೆದಾರರಿಗೆ",
    blog: "ಬ್ಲಾಗ್",
    esg: "ESG ವರದಿ",
    faq: "ಡ್ರೈವರ್ ಪ್ರಶ್ನೆಗಳು",
    benefits: "ಪ್ರಯೋಜನಗಳು",
    careers: "ಉದ್ಯೋಗಾವಕಾಶಗಳು",
    investorHub: "ಹೂಡಿಕೆದಾರರ ಹಬ್",
    metrics: "ಅಂಕಿಅಂಶ ಮತ್ತು ಪರಿಣಾಮ",
    leadership: "ನಾಯಕತ್ವ",
    reports: "ವರದಿಗಳು ಮತ್ತು ಡೌನ್‌ಲೋಡ್‌ಗಳು",
    whatsapp: "WhatsApp ಮಾಡಿ",
    investorsPartners: "ಹೂಡಿಕೆದಾರರು ಮತ್ತು ಪಾಲುದಾರರಿಗೆ",
  },
  header: {
    driveWithUs: "ನಮ್ಮೊಂದಿಗೆ ಓಡಿಸಿ",
    main: "ಮುಖ್ಯ",
    menu: "ಮೆನು",
    closeMenu: "ಮೆನು ಮುಚ್ಚಿ",
    groupPages: "{label} ಪುಟಗಳು",
    call: "ಕರೆ ಮಾಡಿ {phone}",
  },
  language: { title: "ಭಾಷೆ ಆರಿಸಿ", titleLocal: "Select Language" },
  footer: {
    blurb:
      "ಭಾರತದ ಅತಿ ದೊಡ್ಡ ಫ್ಲೀಟ್ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ಕಂಪನಿ. {vehicles} ವಾಹನಗಳು. {cities} ನಗರಗಳು. " +
      "{founded} ರಿಂದ ಡ್ರೈವರ್‌ಗಳ ಗಳಿಕೆ ಮತ್ತು ಹೂಡಿಕೆದಾರರ ಲಾಭ ಹೆಚ್ಚಿಸುತ್ತಿದ್ದೇವೆ.",
    drivers: "ಡ್ರೈವರ್‌ಗಳು",
    company: "ಕಂಪನಿ",
    investors: "ಹೂಡಿಕೆದಾರರು",
    contact: "ಸಂಪರ್ಕ",
    rights: "© {year} Everest Fleet Pvt Ltd. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    instagram: "Instagram ನಲ್ಲಿ Everest Fleet",
    linkedin: "LinkedIn ನಲ್ಲಿ Everest Fleet",
  },
};

export const SITE_COPY: Record<MainLocale, SiteCopy> = { en, hi, kn };

/** The site's own words in `locale`; English for a locale they are not written in. */
export function siteCopy(locale: Locale): SiteCopy {
  return SITE_COPY[isMainLocale(locale) ? locale : DEFAULT_LOCALE];
}
