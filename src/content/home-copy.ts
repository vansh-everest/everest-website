import { DEFAULT_LOCALE, isMainLocale, type Locale, type MainLocale } from "@/lib/i18n";

/**
 * Every string the home page shows, in English, Hindi and Kannada.
 *
 * The Hindi and Kannada are the everyday words a driver uses, not the literary register, and keep
 * brand and product names (Everest Fleet, Own Now, Uber, CNG, WagonR) in Latin script, as the
 * driver pages do. Figures stay as written. Title Case applies to the English only.
 *
 * A key missing from any language fails the type check, so a section can never render half
 * translated. A native speaker should read each language once before it is published.
 */

/** A line set in two colours: `lead`, then `key` in the accent, then `tail`. */
export type Accent = { lead: string; key: string; tail: string };

type Benefit = { title: string; body: string; titleMd?: string; bodyMd?: string };

export type FormCopy = {
  name: string;
  nameExample: string;
  nameFull: string;
  mobile: string;
  mobilePlaceholder: string;
  city: string;
  selectCity: string;
  submit: string;
  sending: string;
  call: string;
  done: string;
  doneNote: string;
  /** `{phone}` prints the phone number. */
  failed: string;
};

export type StoryCopy = {
  region: string;
  previous: string;
  next: string;
  /** `{name}` prints the driver's name. */
  play: string;
  playAnon: string;
  tapForSound: string;
  /** `{n}` prints the story's number. */
  story: string;
};

/** The city strip's skylines, by the name of their artwork. */
export type StripCity = "bangalore" | "mumbai" | "chennai" | "pune" | "delhi" | "hyderabad" | "kolkata";

export type HomeCopy = {
  /** `{cities}` prints the number of cities. */
  meta: { title: string; description: string };
  hero: { badge: string; alt: string };
  headline: { lead: string; highlight: string; join: string; call: string };
  why: {
    title: string;
    /** In the order of the icons: earnings, deposit, maintenance, ownership, support. */
    benefits: [Benefit, Benefit, Benefit, Benefit, Benefit];
    footnote: string;
    videoAlt: string;
  };
  cities: { title: string; region: string; names: Record<StripCity, string> };
  plans: { title: string; region: string; join: string };
  ownNow: { introducing: string; logoAlt: string; photoAlt: string; line: string; perks: [string, string, string]; cta: string };
  cars: { title: string; subtitle: string; region: string; cta: string };
  fleetApp: {
    /** The heading: `before`, the brand in blue, then `after`. */
    before: string;
    brand: string;
    after: string;
    phoneLines: [Accent, Accent, Accent];
    desktopLines: [Accent, Accent, Accent];
    allInOne: string;
    /** Ends each desktop line. */
    stop: string;
    getItOn: string;
    googlePlay: string;
    alt: string;
  };
  dost: {
    before: string;
    brand: string;
    /** Shown from the desktop layout up. */
    after: string;
    phoneTitle: [string, string];
    phoneLines: [string, string, string];
    desktopTitle: [string, string, string];
    cta: string;
    bandAlt: string;
    phoneAlt: string;
  };
  stories: { eyebrow: string; title: string; reel: StoryCopy };
  start: { eyebrow: string; title: string; form: FormCopy };
};

const en: HomeCopy = {
  meta: {
    title: "Everest Fleet: Driver Jobs and Cars for Uber in India",
    description:
      "Get a driver job with Everest Fleet: the car, insurance and permit to drive on Uber in {cities} cities, " +
      "weekly payouts, and plans to own the car. Apply in 30 seconds.",
  },
  hero: { badge: "India’s Largest Fleet", alt: "Everest Fleet driver leaning on a white Everest sedan" },
  headline: { lead: "Drive, Earn", highlight: "and Own.", join: "Join As Driver", call: "Call Now" },
  why: {
    title: "Why Drivers Choose Us",
    benefits: [
      { title: "Earn Up To ₹40,000/mo", body: "Direct bank transfer every week" },
      { title: "Low Deposit", titleMd: "Low Deposit Plan", body: "Start with a minimum deposit" },
      { title: "₹0 Maintenance*", body: "100% service & repairs covered" },
      {
        title: "Ownership Plans Available",
        titleMd: "Ownership Plans",
        body: "Own your car starting from 11 months",
        bodyMd: "Own car in less than 12 months",
      },
      { title: "24 × 7 Support", body: "Tele-support for you", bodyMd: "Reliable tele-support anytime you need" },
    ],
    footnote: "*Covers normal wear; accident or misuse damage is charged to the driver.",
    videoAlt: "Everest Fleet driver with his car",
  },
  cities: {
    title: "Cities We Operate In",
    region: "Cities",
    names: {
      bangalore: "Bangalore",
      mumbai: "Mumbai",
      chennai: "Chennai",
      pune: "Pune",
      delhi: "Delhi",
      hyderabad: "Hyderabad",
      kolkata: "Kolkata",
    },
  },
  plans: { title: "We Have Plans For Everyone", region: "Plans", join: "Join Now" },
  ownNow: {
    introducing: "Introducing",
    logoAlt: "Own-Now by Everest",
    photoAlt: "Car keys being handed over to a new owner",
    line: "Now become owner of your own car",
    perks: ["Without Loan", "Without CIBIL Score", "With Minimal Upfront Payment"],
    cta: "Know More",
  },
  cars: {
    title: "Car That Earns For You",
    subtitle: "Drive India's most trusted and well-maintained fleet",
    region: "Our cars",
    cta: "Drive This Car",
  },
  fleetApp: {
    before: "Introducing ",
    brand: "Everest Fleet",
    after: " App",
    phoneLines: [
      { lead: "Book ", key: "Appointments", tail: "" },
      { lead: "Know Your ", key: "Earnings", tail: "" },
      { lead: "100% ", key: "Transparent", tail: "" },
    ],
    desktopLines: [
      { lead: "Track Your ", key: "Trips", tail: "" },
      { lead: "Know Your ", key: "Earnings", tail: "" },
      { lead: "100% ", key: "Transparent", tail: "" },
    ],
    allInOne: "All In One App",
    stop: ".",
    getItOn: "Get it on",
    googlePlay: "Google Play",
    alt: "Everest Fleet app showing this week's rent paid and a completed payment",
  },
  dost: {
    before: "Introducing ",
    brand: "Everest Dost",
    after: " App",
    phoneTitle: ["Become An Everest", "Dost"],
    phoneLines: ["Refer Drivers.", "Hit Milestones.", "Earn Rewards."],
    desktopTitle: ["Not Behind The Wheel?", "You Can Still Drive The", "Change."],
    cta: "Know More",
    bandAlt: "Everest Dost partner checking the app on his phone",
    phoneAlt: "Everest Dost app with referral payouts and follow-ups",
  },
  stories: {
    eyebrow: "Hear it from them",
    title: "Real Drivers Real Stories",
    reel: {
      region: "Driver stories",
      previous: "Previous story",
      next: "Next story",
      play: "Play {name}'s story",
      playAnon: "Play this driver's story",
      tapForSound: "Tap For Sound",
      story: "Story {n}",
    },
  },
  start: {
    eyebrow: "How it works",
    title: "Start Driving Today",
    form: {
      name: "Name",
      nameExample: "e.g. Ravi Kumar",
      nameFull: "Your full name",
      mobile: "Mobile Number",
      mobilePlaceholder: "10-digit mobile number",
      city: "City",
      selectCity: "Select your city",
      submit: "Submit & Apply",
      sending: "Sending",
      call: "Call Now",
      done: "Application submitted successfully!",
      doneNote: "We'll contact you within 24 hours.",
      failed: "Not sent. Try again, or call {phone}.",
    },
  },
};

const hi: HomeCopy = {
  meta: {
    title: "Everest Fleet: Uber के लिए ड्राइवर की नौकरी और गाड़ी",
    description:
      "Everest Fleet के साथ ड्राइवर की नौकरी: {cities} शहरों में Uber चलाने के लिए गाड़ी, बीमा और परमिट, " +
      "हर हफ़्ते पेमेंट, और गाड़ी अपनी बनाने के प्लान। 30 सेकंड में अप्लाई कीजिए।",
  },
  hero: { badge: "भारत का सबसे बड़ा फ्लीट", alt: "सफ़ेद Everest सेडान के पास खड़ा Everest Fleet ड्राइवर" },
  headline: { lead: "चलाइए, कमाइए", highlight: "और मालिक बनिए।", join: "ड्राइवर बनिए", call: "अभी कॉल करें" },
  why: {
    title: "ड्राइवर हमें क्यों चुनते हैं",
    benefits: [
      { title: "महीने में ₹40,000 तक कमाइए", body: "हर हफ़्ते सीधे बैंक खाते में" },
      { title: "कम डिपॉज़िट", titleMd: "कम डिपॉज़िट वाला प्लान", body: "थोड़े से डिपॉज़िट से शुरू कीजिए" },
      { title: "₹0 मेंटेनेंस*", body: "सर्विस और मरम्मत का पूरा खर्च हमारा" },
      {
        title: "गाड़ी अपनी बनाने के प्लान",
        titleMd: "मालिकाना प्लान",
        body: "11 महीने में गाड़ी अपनी बनाइए",
        bodyMd: "12 महीने से कम में गाड़ी आपकी",
      },
      { title: "24 × 7 मदद", body: "फ़ोन पर मदद", bodyMd: "जब भी ज़रूरत हो, फ़ोन पर पक्की मदद" },
    ],
    footnote: "*आम घिसावट शामिल है; दुर्घटना या गलत इस्तेमाल से हुए नुकसान का खर्च ड्राइवर का।",
    videoAlt: "अपनी गाड़ी के साथ Everest Fleet ड्राइवर",
  },
  cities: {
    title: "हम इन शहरों में हैं",
    region: "शहर",
    names: {
      bangalore: "बेंगलुरु",
      mumbai: "मुंबई",
      chennai: "चेन्नई",
      pune: "पुणे",
      delhi: "दिल्ली",
      hyderabad: "हैदराबाद",
      kolkata: "कोलकाता",
    },
  },
  plans: { title: "हर ड्राइवर के लिए प्लान", region: "प्लान", join: "अभी जुड़िए" },
  ownNow: {
    introducing: "पेश है",
    logoAlt: "Own-Now by Everest",
    photoAlt: "नए मालिक को गाड़ी की चाबी दी जा रही है",
    line: "अब बनिए अपनी गाड़ी के मालिक",
    perks: ["बिना लोन", "बिना CIBIL स्कोर", "थोड़ी सी शुरुआती रकम पर"],
    cta: "और जानिए",
  },
  cars: {
    title: "आपके लिए कमाने वाली गाड़ी",
    subtitle: "भारत का सबसे भरोसेमंद और अच्छी हालत वाला फ्लीट चलाइए",
    region: "हमारी गाड़ियाँ",
    cta: "यह गाड़ी चलाइए",
  },
  fleetApp: {
    before: "पेश है ",
    brand: "Everest Fleet",
    after: " ऐप",
    phoneLines: [
      { lead: "", key: "अपॉइंटमेंट", tail: " बुक कीजिए" },
      { lead: "अपनी ", key: "कमाई", tail: " देखिए" },
      { lead: "100% ", key: "साफ़ हिसाब", tail: "" },
    ],
    desktopLines: [
      { lead: "अपनी ", key: "ट्रिप", tail: " देखिए" },
      { lead: "अपनी ", key: "कमाई", tail: " देखिए" },
      { lead: "100% ", key: "साफ़ हिसाब", tail: "" },
    ],
    allInOne: "सब एक ही ऐप में",
    stop: "।",
    getItOn: "डाउनलोड करें",
    googlePlay: "Google Play",
    alt: "Everest Fleet ऐप, जिसमें इस हफ़्ते का किराया और पूरा हुआ भुगतान दिख रहा है",
  },
  dost: {
    before: "पेश है ",
    brand: "Everest Dost",
    after: " ऐप",
    phoneTitle: ["Everest Dost", "बनिए"],
    phoneLines: ["ड्राइवर रेफ़र कीजिए।", "टारगेट पूरे कीजिए।", "इनाम पाइए।"],
    desktopTitle: ["गाड़ी नहीं चलाते?", "फिर भी आप बदलाव", "ला सकते हैं।"],
    cta: "और जानिए",
    bandAlt: "फ़ोन पर ऐप देखता Everest Dost पार्टनर",
    phoneAlt: "रेफ़रल पेमेंट और फ़ॉलो-अप के साथ Everest Dost ऐप",
  },
  stories: {
    eyebrow: "उन्हीं की ज़ुबानी",
    title: "असली ड्राइवर, असली कहानियाँ",
    reel: {
      region: "ड्राइवरों की कहानियाँ",
      previous: "पिछली कहानी",
      next: "अगली कहानी",
      play: "{name} की कहानी चलाइए",
      playAnon: "इस ड्राइवर की कहानी चलाइए",
      tapForSound: "आवाज़ के लिए टैप करें",
      story: "कहानी {n}",
    },
  },
  start: {
    eyebrow: "कैसे काम करता है",
    title: "आज ही गाड़ी चलाना शुरू कीजिए",
    form: {
      name: "नाम",
      nameExample: "जैसे रवि कुमार",
      nameFull: "आपका पूरा नाम",
      mobile: "मोबाइल नंबर",
      mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
      city: "शहर",
      selectCity: "अपना शहर चुनिए",
      submit: "अप्लाई करें",
      sending: "भेजा जा रहा है",
      call: "अभी कॉल करें",
      done: "आपका आवेदन मिल गया!",
      doneNote: "हम 24 घंटे के अंदर आपसे बात करेंगे।",
      failed: "भेजा नहीं जा सका। दोबारा कोशिश कीजिए या {phone} पर कॉल कीजिए।",
    },
  },
};

const kn: HomeCopy = {
  meta: {
    title: "Everest Fleet: Uber ಗಾಗಿ ಡ್ರೈವರ್ ಕೆಲಸ ಮತ್ತು ಕಾರು",
    description:
      "Everest Fleet ಜೊತೆ ಡ್ರೈವರ್ ಕೆಲಸ: {cities} ನಗರಗಳಲ್ಲಿ Uber ಓಡಿಸಲು ಕಾರು, ವಿಮೆ ಮತ್ತು ಪರ್ಮಿಟ್, " +
      "ಪ್ರತಿ ವಾರ ಪಾವತಿ, ಮತ್ತು ಕಾರನ್ನು ಸ್ವಂತ ಮಾಡಿಕೊಳ್ಳುವ ಪ್ಲಾನ್‌ಗಳು. 30 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಅರ್ಜಿ ಹಾಕಿ.",
  },
  hero: { badge: "ಭಾರತದ ಅತಿ ದೊಡ್ಡ ಫ್ಲೀಟ್", alt: "ಬಿಳಿ Everest ಸೆಡಾನ್‌ಗೆ ಒರಗಿ ನಿಂತ Everest Fleet ಡ್ರೈವರ್" },
  headline: { lead: "ಓಡಿಸಿ, ಗಳಿಸಿ", highlight: "ಮತ್ತು ಮಾಲೀಕರಾಗಿ.", join: "ಡ್ರೈವರ್ ಆಗಿ ಸೇರಿ", call: "ಈಗಲೇ ಕರೆ ಮಾಡಿ" },
  why: {
    title: "ಡ್ರೈವರ್‌ಗಳು ನಮ್ಮನ್ನೇ ಏಕೆ ಆರಿಸುತ್ತಾರೆ",
    benefits: [
      { title: "ತಿಂಗಳಿಗೆ ₹40,000 ವರೆಗೆ ಗಳಿಸಿ", body: "ಪ್ರತಿ ವಾರ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ" },
      { title: "ಕಡಿಮೆ ಠೇವಣಿ", titleMd: "ಕಡಿಮೆ ಠೇವಣಿಯ ಪ್ಲಾನ್", body: "ಕನಿಷ್ಠ ಠೇವಣಿಯಿಂದ ಶುರು ಮಾಡಿ" },
      { title: "₹0 ನಿರ್ವಹಣೆ*", body: "ಸರ್ವೀಸ್ ಮತ್ತು ರಿಪೇರಿ ಖರ್ಚು ಪೂರ್ತಿ ನಮ್ಮದು" },
      {
        title: "ಕಾರು ಸ್ವಂತ ಮಾಡಿಕೊಳ್ಳುವ ಪ್ಲಾನ್‌ಗಳು",
        titleMd: "ಮಾಲೀಕತ್ವದ ಪ್ಲಾನ್‌ಗಳು",
        body: "11 ತಿಂಗಳಲ್ಲೇ ಕಾರು ನಿಮ್ಮದಾಗಿಸಿ",
        bodyMd: "12 ತಿಂಗಳೊಳಗೆ ಕಾರು ನಿಮ್ಮದು",
      },
      { title: "24 × 7 ಸಹಾಯ", body: "ಫೋನ್‌ನಲ್ಲಿ ಸಹಾಯ", bodyMd: "ಬೇಕಾದಾಗಲೆಲ್ಲ ಫೋನ್‌ನಲ್ಲಿ ನಂಬಿಕೆಯ ಸಹಾಯ" },
    ],
    footnote: "*ಸಾಮಾನ್ಯ ಸವೆತ ಸೇರಿದೆ; ಅಪಘಾತ ಅಥವಾ ದುರುಪಯೋಗದಿಂದಾದ ಹಾನಿಯ ಖರ್ಚು ಡ್ರೈವರ್‌ದು.",
    videoAlt: "ತನ್ನ ಕಾರಿನ ಜೊತೆ Everest Fleet ಡ್ರೈವರ್",
  },
  cities: {
    title: "ನಾವು ಇರುವ ನಗರಗಳು",
    region: "ನಗರಗಳು",
    names: {
      bangalore: "ಬೆಂಗಳೂರು",
      mumbai: "ಮುಂಬೈ",
      chennai: "ಚೆನ್ನೈ",
      pune: "ಪುಣೆ",
      delhi: "ದೆಹಲಿ",
      hyderabad: "ಹೈದರಾಬಾದ್",
      kolkata: "ಕೋಲ್ಕತ್ತಾ",
    },
  },
  plans: { title: "ಪ್ರತಿ ಡ್ರೈವರ್‌ಗೂ ಒಂದು ಪ್ಲಾನ್", region: "ಪ್ಲಾನ್‌ಗಳು", join: "ಈಗಲೇ ಸೇರಿ" },
  ownNow: {
    introducing: "ಬಂದಿದೆ",
    logoAlt: "Own-Now by Everest",
    photoAlt: "ಹೊಸ ಮಾಲೀಕರಿಗೆ ಕಾರಿನ ಕೀ ಕೊಡಲಾಗುತ್ತಿದೆ",
    line: "ಈಗ ನಿಮ್ಮದೇ ಕಾರಿನ ಮಾಲೀಕರಾಗಿ",
    perks: ["ಸಾಲ ಇಲ್ಲದೆ", "CIBIL ಸ್ಕೋರ್ ಇಲ್ಲದೆ", "ಕಡಿಮೆ ಮುಂಗಡ ಹಣದೊಂದಿಗೆ"],
    cta: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
  },
  cars: {
    title: "ನಿಮಗಾಗಿ ಗಳಿಸುವ ಕಾರು",
    subtitle: "ಭಾರತದ ಅತ್ಯಂತ ನಂಬಿಕೆಯ, ಚೆನ್ನಾಗಿ ನೋಡಿಕೊಂಡ ಫ್ಲೀಟ್ ಓಡಿಸಿ",
    region: "ನಮ್ಮ ಕಾರುಗಳು",
    cta: "ಈ ಕಾರು ಓಡಿಸಿ",
  },
  fleetApp: {
    before: "",
    brand: "Everest Fleet",
    after: " ಆ್ಯಪ್ ಬಂದಿದೆ",
    phoneLines: [
      { lead: "", key: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್", tail: " ಬುಕ್ ಮಾಡಿ" },
      { lead: "ನಿಮ್ಮ ", key: "ಗಳಿಕೆ", tail: " ನೋಡಿ" },
      { lead: "100% ", key: "ಪಾರದರ್ಶಕ", tail: "" },
    ],
    desktopLines: [
      { lead: "ನಿಮ್ಮ ", key: "ಟ್ರಿಪ್‌ಗಳು", tail: " ನೋಡಿ" },
      { lead: "ನಿಮ್ಮ ", key: "ಗಳಿಕೆ", tail: " ನೋಡಿ" },
      { lead: "100% ", key: "ಪಾರದರ್ಶಕ", tail: "" },
    ],
    allInOne: "ಎಲ್ಲವೂ ಒಂದೇ ಆ್ಯಪ್‌ನಲ್ಲಿ",
    stop: ".",
    getItOn: "ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    googlePlay: "Google Play",
    alt: "ಈ ವಾರದ ಬಾಡಿಗೆ ಮತ್ತು ಮುಗಿದ ಪಾವತಿ ತೋರಿಸುತ್ತಿರುವ Everest Fleet ಆ್ಯಪ್",
  },
  dost: {
    before: "",
    brand: "Everest Dost",
    after: " ಆ್ಯಪ್ ಬಂದಿದೆ",
    phoneTitle: ["Everest Dost", "ಆಗಿ"],
    phoneLines: ["ಡ್ರೈವರ್‌ಗಳನ್ನು ರೆಫರ್ ಮಾಡಿ.", "ಗುರಿ ತಲುಪಿ.", "ಬಹುಮಾನ ಗಳಿಸಿ."],
    desktopTitle: ["ಕಾರು ಓಡಿಸುವುದಿಲ್ಲವೇ?", "ಆದರೂ ನೀವು ಬದಲಾವಣೆ", "ತರಬಹುದು."],
    cta: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    bandAlt: "ಫೋನ್‌ನಲ್ಲಿ ಆ್ಯಪ್ ನೋಡುತ್ತಿರುವ Everest Dost ಪಾರ್ಟ್ನರ್",
    phoneAlt: "ರೆಫರಲ್ ಪಾವತಿ ಮತ್ತು ಫಾಲೋ-ಅಪ್‌ಗಳಿರುವ Everest Dost ಆ್ಯಪ್",
  },
  stories: {
    eyebrow: "ಅವರ ಮಾತಲ್ಲೇ ಕೇಳಿ",
    title: "ನಿಜವಾದ ಡ್ರೈವರ್‌ಗಳು, ನಿಜವಾದ ಕಥೆಗಳು",
    reel: {
      region: "ಡ್ರೈವರ್‌ಗಳ ಕಥೆಗಳು",
      previous: "ಹಿಂದಿನ ಕಥೆ",
      next: "ಮುಂದಿನ ಕಥೆ",
      play: "{name} ಅವರ ಕಥೆ ಪ್ಲೇ ಮಾಡಿ",
      playAnon: "ಈ ಡ್ರೈವರ್‌ನ ಕಥೆ ಪ್ಲೇ ಮಾಡಿ",
      tapForSound: "ಧ್ವನಿಗಾಗಿ ಟ್ಯಾಪ್ ಮಾಡಿ",
      story: "ಕಥೆ {n}",
    },
  },
  start: {
    eyebrow: "ಇದು ಹೇಗೆ ನಡೆಯುತ್ತದೆ",
    title: "ಇಂದೇ ಡ್ರೈವಿಂಗ್ ಶುರು ಮಾಡಿ",
    form: {
      name: "ಹೆಸರು",
      nameExample: "ಉದಾ: ರವಿ ಕುಮಾರ್",
      nameFull: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು",
      mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      mobilePlaceholder: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      city: "ನಗರ",
      selectCity: "ನಿಮ್ಮ ನಗರವನ್ನು ಆರಿಸಿ",
      submit: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      sending: "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ",
      call: "ಈಗಲೇ ಕರೆ ಮಾಡಿ",
      done: "ನಿಮ್ಮ ಅರ್ಜಿ ತಲುಪಿದೆ!",
      doneNote: "24 ಗಂಟೆಗಳೊಳಗೆ ನಾವು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
      failed: "ಕಳುಹಿಸಲು ಆಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ {phone} ಗೆ ಕರೆ ಮಾಡಿ.",
    },
  },
};

export const HOME_COPY: Record<MainLocale, HomeCopy> = { en, hi, kn };

/** The home page copy in `locale`; the English for a locale the home page is not written in. */
export function homeCopy(locale: Locale): HomeCopy {
  return HOME_COPY[isMainLocale(locale) ? locale : DEFAULT_LOCALE];
}

/* ------------------------------------------------------------------ admin-managed text */

/**
 * Text the home page shows from the admin (plan cards, cars, driver stories), keyed by the English
 * the content was seeded with. A Hindi or Kannada page shows the translation when the admin text
 * still matches a known English line, and the admin's own words when it has been changed.
 */
const SEED_TEXT: Record<string, Record<Exclude<MainLocale, "en">, string>> = {
  // Plan cards: the tab above the card.
  "Ownership model": { hi: "मालिकाना मॉडल", kn: "ಮಾಲೀಕತ್ವದ ಮಾದರಿ" },
  "Renting model": { hi: "किराये का मॉडल", kn: "ಬಾಡಿಗೆ ಮಾದರಿ" },
  "Earning model": { hi: "कमाई का मॉडल", kn: "ಗಳಿಕೆಯ ಮಾದರಿ" },
  // Plan cards: the figure boxes.
  "Rent/day": { hi: "किराया/दिन", kn: "ಬಾಡಿಗೆ/ದಿನ" },
  "Rent/week": { hi: "किराया/हफ़्ता", kn: "ಬಾಡಿಗೆ/ವಾರ" },
  "Rent/mo": { hi: "किराया/महीना", kn: "ಬಾಡಿಗೆ/ತಿಂಗಳು" },
  Rent: { hi: "किराया", kn: "ಬಾಡಿಗೆ" },
  Upfront: { hi: "शुरुआती रकम", kn: "ಮುಂಗಡ" },
  Deposit: { hi: "डिपॉज़िट", kn: "ಠೇವಣಿ" },
  Onwards: { hi: "से शुरू", kn: "ರಿಂದ" },
  // Plan cards: the bullet points.
  "Car transferred to your name at tenure end": { hi: "अवधि पूरी होने पर गाड़ी आपके नाम", kn: "ಅವಧಿ ಮುಗಿದಾಗ ಕಾರು ನಿಮ್ಮ ಹೆಸರಿಗೆ" },
  "No fixed rent - earnings-linked model": { hi: "तय किराया नहीं, कमाई से जुड़ा मॉडल", kn: "ನಿಗದಿತ ಬಾಡಿಗೆ ಇಲ್ಲ, ಗಳಿಕೆಗೆ ತಕ್ಕ ಮಾದರಿ" },
  "No ownership or loan liability": { hi: "न गाड़ी की ज़िम्मेदारी, न लोन", kn: "ಕಾರಿನ ಹೊಣೆ ಇಲ್ಲ, ಸಾಲವೂ ಇಲ್ಲ" },
  "No CIBIL": { hi: "CIBIL की ज़रूरत नहीं", kn: "CIBIL ಬೇಕಿಲ್ಲ" },
  "Daily Instalments": { hi: "रोज़ की किस्त", kn: "ದಿನದ ಕಂತು" },
  "No Insurance": { hi: "बीमा का खर्च नहीं", kn: "ವಿಮೆ ಖರ್ಚು ಇಲ್ಲ" },
  "No Regulatory Charges": { hi: "कोई रेगुलेटरी चार्ज नहीं", kn: "ರೆಗ್ಯುಲೇಟರಿ ಶುಲ್ಕ ಇಲ್ಲ" },
  "100% Uber incentive": { hi: "Uber इंसेंटिव 100% आपका", kn: "Uber ಇನ್ಸೆಂಟಿವ್ 100% ನಿಮ್ಮದು" },
  "No paperwork": { hi: "कागज़ी झंझट नहीं", kn: "ಕಾಗದಪತ್ರದ ಕಿರಿಕಿರಿ ಇಲ್ಲ" },
  "No loan required": { hi: "लोन की ज़रूरत नहीं", kn: "ಸಾಲ ಬೇಕಿಲ್ಲ" },
  "Free Repair & Maintenance": { hi: "मुफ़्त मरम्मत और मेंटेनेंस", kn: "ಉಚಿತ ರಿಪೇರಿ ಮತ್ತು ನಿರ್ವಹಣೆ" },
  "Free repair and maintenance": { hi: "मुफ़्त मरम्मत और मेंटेनेंस", kn: "ಉಚಿತ ರಿಪೇರಿ ಮತ್ತು ನಿರ್ವಹಣೆ" },
  "24×7 Support": { hi: "24×7 मदद", kn: "24×7 ಸಹಾಯ" },
  "24/7 Support": { hi: "24/7 मदद", kn: "24/7 ಸಹಾಯ" },
  // Cars: the tab above the card, and the photos.
  "India’s Most Driven & Trusted Choice": { hi: "भारत की सबसे ज़्यादा चलने वाली भरोसेमंद गाड़ी", kn: "ಭಾರತದಲ್ಲಿ ಹೆಚ್ಚು ಓಡುವ, ನಂಬಿಕೆಯ ಕಾರು" },
  "Our Most Popular Eco-Friendly Favorite": { hi: "हमारी सबसे पसंदीदा इको-फ़्रेंडली गाड़ी", kn: "ನಮ್ಮ ಅತ್ಯಂತ ಜನಪ್ರಿಯ ಪರಿಸರ ಸ್ನೇಹಿ ಕಾರು" },
  "White Everest Fleet WagonR": { hi: "सफ़ेद Everest Fleet WagonR", kn: "ಬಿಳಿ Everest Fleet WagonR" },
  "White Everest Fleet Tigor EV": { hi: "सफ़ेद Everest Fleet Tigor EV", kn: "ಬಿಳಿ Everest Fleet Tigor EV" },
  "Maruti Suzuki Dzire in a studio": { hi: "स्टूडियो में Maruti Suzuki Dzire", kn: "ಸ್ಟುಡಿಯೋದಲ್ಲಿ Maruti Suzuki Dzire" },
  "Tata Tigor in a studio": { hi: "स्टूडियो में Tata Tigor", kn: "ಸ್ಟುಡಿಯೋದಲ್ಲಿ Tata Tigor" },
  "Maruti Suzuki S-Presso in a studio": { hi: "स्टूडियो में Maruti Suzuki S-Presso", kn: "ಸ್ಟುಡಿಯೋದಲ್ಲಿ Maruti Suzuki S-Presso" },
  "Toyota Rumion in a studio": { hi: "स्टूडियो में Toyota Rumion", kn: "ಸ್ಟುಡಿಯೋದಲ್ಲಿ Toyota Rumion" },
  // Driver stories: the names as the videos give them.
  "Hasan Karim Shah": { hi: "हसन करीम शाह", kn: "ಹಸನ್ ಕರೀಂ ಶಾ" },
  "Somnath Lamkane": { hi: "सोमनाथ लामकाने", kn: "ಸೋಮನಾಥ್ ಲಾಮಕಾನೆ" },
};

/** Case, spacing and the apostrophe's shape do not stop a match: the site title-cases admin text. */
const normalise = (text: string) => text.trim().replace(/\s+/g, " ").replace(/[’‘]/g, "'").toLowerCase();

const SEED_INDEX = new Map(Object.entries(SEED_TEXT).map(([english, t]) => [normalise(english), t]));

/** Admin text in `locale`: the translation of a known seed line, otherwise the text as typed. */
export function seedText(text: string, locale: Locale): string {
  if (!text || locale === DEFAULT_LOCALE || !isMainLocale(locale)) return text;
  return SEED_INDEX.get(normalise(text))?.[locale] ?? text;
}
