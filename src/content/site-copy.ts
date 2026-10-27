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
  | "faq"
  | "benefits"
  | "careers"
  | "investorHub"
  | "metrics"
  | "leadership"
  | "reports"
  | "whatsapp"
  | "investorsPartners"
  | "newsroom"
  | "privacy"
  | "terms";

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
    /** The label before the registered office address. */
    office: string;
    /** The social buttons' accessible names. */
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
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
    faq: "Driver FAQs",
    benefits: "Benefits",
    careers: "Careers",
    investorHub: "Investor Hub",
    metrics: "Metrics & Impact",
    leadership: "Leadership",
    reports: "Reports & Downloads",
    whatsapp: "WhatsApp Us",
    investorsPartners: "For Investors & Partners",
    newsroom: "Newsroom",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
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
      "Powering driver earnings since {founded}.",
    drivers: "Drivers",
    company: "Company",
    investors: "Investors",
    contact: "Contact",
    rights: "© {year} Everest Fleet Pvt Ltd. All rights reserved.",
    office: "Registered office:",
    instagram: "Everest Fleet on Instagram",
    linkedin: "Everest Fleet on LinkedIn",
    facebook: "Everest Fleet on Facebook",
    youtube: "Everest Fleet on YouTube",
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
    faq: "ड्राइवरों के सवाल",
    benefits: "फ़ायदे",
    careers: "करियर",
    investorHub: "निवेशक हब",
    metrics: "आँकड़े और असर",
    leadership: "लीडरशिप",
    reports: "रिपोर्ट और डाउनलोड",
    whatsapp: "WhatsApp कीजिए",
    investorsPartners: "निवेशकों और पार्टनर्स के लिए",
    newsroom: "न्यूज़रूम",
    privacy: "प्राइवेसी पॉलिसी",
    terms: "सेवा की शर्तें",
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
      "{founded} से ड्राइवरों की कमाई बढ़ा रहे हैं।",
    drivers: "ड्राइवर",
    company: "कंपनी",
    investors: "निवेशक",
    contact: "संपर्क",
    rights: "© {year} Everest Fleet Pvt Ltd. सर्वाधिकार सुरक्षित।",
    office: "पंजीकृत कार्यालय:",
    instagram: "Instagram पर Everest Fleet",
    linkedin: "LinkedIn पर Everest Fleet",
    facebook: "Facebook पर Everest Fleet",
    youtube: "YouTube पर Everest Fleet",
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
    faq: "ಡ್ರೈವರ್ ಪ್ರಶ್ನೆಗಳು",
    benefits: "ಪ್ರಯೋಜನಗಳು",
    careers: "ಉದ್ಯೋಗಾವಕಾಶಗಳು",
    investorHub: "ಹೂಡಿಕೆದಾರರ ಹಬ್",
    metrics: "ಅಂಕಿಅಂಶ ಮತ್ತು ಪರಿಣಾಮ",
    leadership: "ನಾಯಕತ್ವ",
    reports: "ವರದಿಗಳು ಮತ್ತು ಡೌನ್‌ಲೋಡ್‌ಗಳು",
    whatsapp: "WhatsApp ಮಾಡಿ",
    investorsPartners: "ಹೂಡಿಕೆದಾರರು ಮತ್ತು ಪಾಲುದಾರರಿಗೆ",
    newsroom: "ನ್ಯೂಸ್‌ರೂಮ್",
    privacy: "ಗೌಪ್ಯತಾ ನೀತಿ",
    terms: "ಸೇವಾ ನಿಯಮಗಳು",
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
      "{founded} ರಿಂದ ಡ್ರೈವರ್‌ಗಳ ಗಳಿಕೆ ಹೆಚ್ಚಿಸುತ್ತಿದ್ದೇವೆ.",
    drivers: "ಡ್ರೈವರ್‌ಗಳು",
    company: "ಕಂಪನಿ",
    investors: "ಹೂಡಿಕೆದಾರರು",
    contact: "ಸಂಪರ್ಕ",
    rights: "© {year} Everest Fleet Pvt Ltd. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    office: "ನೋಂದಾಯಿತ ಕಚೇರಿ:",
    instagram: "Instagram ನಲ್ಲಿ Everest Fleet",
    linkedin: "LinkedIn ನಲ್ಲಿ Everest Fleet",
    facebook: "Facebook ನಲ್ಲಿ Everest Fleet",
    youtube: "YouTube ನಲ್ಲಿ Everest Fleet",
  },
};

const ta: SiteCopy = {
  links: {
    home: "முகப்பு",
    about: "எங்களைப் பற்றி",
    plans: "எங்கள் திட்டங்கள்",
    ownNow: "Own Now",
    driveToEarn: "Drive To Earn",
    driveToOwn: "Drive To Own",
    services: "பிற சேவைகள்",
    fleetLogistics: "ஃப்ளீட் லாஜிஸ்டிக்ஸ்",
    employeeMobility: "ஊழியர் பயணம்",
    intercity: "இன்டர்சிட்டி",
    advertise: "எங்களுடன் விளம்பரம்",
    dost: "Everest Dost",
    forInvestors: "முதலீட்டாளர்களுக்கு",
    blog: "வலைப்பதிவு",
    faq: "டிரைவர் கேள்விகள்",
    benefits: "நன்மைகள்",
    careers: "வேலைவாய்ப்புகள்",
    investorHub: "முதலீட்டாளர் மையம்",
    metrics: "அளவீடுகள் மற்றும் தாக்கம்",
    leadership: "தலைமை",
    reports: "அறிக்கைகள் மற்றும் பதிவிறக்கங்கள்",
    whatsapp: "WhatsApp செய்யுங்கள்",
    investorsPartners: "முதலீட்டாளர்கள் மற்றும் பார்ட்னர்களுக்கு",
    newsroom: "நியூஸ்ரூம்",
    privacy: "தனியுரிமைக் கொள்கை",
    terms: "சேவை விதிமுறைகள்",
  },
  header: {
    driveWithUs: "எங்களுடன் ஓட்டுங்கள்",
    main: "முதன்மை",
    menu: "மெனு",
    closeMenu: "மெனுவை மூடு",
    groupPages: "{label} பக்கங்கள்",
    call: "{phone} அழையுங்கள்",
  },
  language: { title: "மொழியைத் தேர்ந்தெடுங்கள்", titleLocal: "Select Language" },
  footer: {
    blurb:
      "இந்தியாவின் மிகப்பெரிய ஃப்ளீட் மேனேஜ்மென்ட் நிறுவனம். {vehicles} வாகனங்கள். {cities} நகரங்கள். " +
      "{founded} முதல் டிரைவர்களின் வருமானத்தை உயர்த்தி வருகிறோம்.",
    drivers: "டிரைவர்கள்",
    company: "நிறுவனம்",
    investors: "முதலீட்டாளர்கள்",
    contact: "தொடர்பு",
    rights: "© {year} Everest Fleet Pvt Ltd. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    office: "பதிவு அலுவலகம்:",
    instagram: "Instagram-இல் Everest Fleet",
    linkedin: "LinkedIn-இல் Everest Fleet",
    facebook: "Facebook-இல் Everest Fleet",
    youtube: "YouTube-இல் Everest Fleet",
  },
};

export const SITE_COPY: Record<MainLocale, SiteCopy> = { en, hi, kn, ta };

/** The site's own words in `locale`; English for a locale they are not written in. */
export function siteCopy(locale: Locale): SiteCopy {
  return SITE_COPY[isMainLocale(locale) ? locale : DEFAULT_LOCALE];
}
