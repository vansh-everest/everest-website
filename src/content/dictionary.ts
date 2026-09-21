import type { Locale } from "@/lib/i18n";

/**
 * Every string the driver pages and the blog can show, in each locale.
 *
 * Written natively rather than machine translated, because these pages exist to be found
 * by someone searching in their own language. A native speaker must read each locale once
 * before it is published; the Hindi and Telugu below are a first draft.
 */
export type Dictionary = {
  hub: {
    eyebrow: string;
    title: string;
    intro: string;
    pickCity: string;
    metaTitle: string;
    metaDescription: string;
  };
  city: {
    /** {city} is replaced at render time. */
    title: string;
    intro: string;
    metaTitle: string;
    metaDescription: string;
    readyCars: string;
    plansHeading: string;
    documentsHeading: string;
    faqHeading: string;
    hubsHeading: string;
    otherCities: string;
    earningsHeading: string;
    earningsNote: string;
  };
  cta: { apply: string; call: string; whatsapp: string; formTitle: string; formNote: string };
  form: { name: string; mobile: string; city: string; selectCity: string; submit: string; sending: string; done: string; failed: string };
  documents: string[];
  benefits: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  blog: { title: string; intro: string; readMore: string; empty: string; back: string; metaDescription: string };
  common: { pending: string; languages: string };
};

const en: Dictionary = {
  hub: {
    eyebrow: "Drive with us",
    title: "Drive an Uber without owning a car",
    intro:
      "Everest Fleet gives you a car, the insurance and the permit. You drive on Uber and keep what you earn after the daily rent. Pick your city to see plans, hub addresses and what to bring.",
    pickCity: "Choose your city",
    metaTitle: "Drive an Uber without owning a car",
    metaDescription:
      "Rent or own a car to drive on Uber across seven Indian cities, with low deposit, weekly payouts, insurance and maintenance included.",
  },
  city: {
    title: "Car on rent for Uber in {city}",
    intro:
      "Get a car to drive on Uber in {city}. No car of your own needed. Insurance, permit and maintenance are handled, and you are paid every week.",
    metaTitle: "Car on rent for Uber in {city}",
    metaDescription:
      "Rent a car to drive on Uber in {city}. Daily rent, refundable deposit, hub addresses and the documents you need.",
    readyCars: "Cars ready in {city}",
    plansHeading: "Plans in {city}",
    documentsHeading: "What to bring",
    faqHeading: "Questions drivers ask",
    hubsHeading: "Hubs in {city}",
    otherCities: "Other cities",
    earningsHeading: "What you keep in {city}",
    earningsNote:
      "Figures are pending approval by operations and are not published until then.",
  },
  cta: {
    apply: "Apply now",
    call: "Call us",
    whatsapp: "WhatsApp",
    formTitle: "Apply in 30 seconds",
    formNote: "We call you back. No fee to apply.",
  },
  form: {
    name: "Full name",
    mobile: "Mobile number",
    city: "City",
    selectCity: "Select your city",
    submit: "Apply now",
    sending: "Sending",
    done: "Got it. We will call you shortly.",
    failed: "That did not send. Please call us instead.",
  },
  documents: ["Aadhaar card", "PAN card", "Driving licence", "Proof of address"],
  benefits: [
    { title: "No car needed", body: "We provide the car, the permit and the insurance." },
    { title: "Weekly payouts", body: "Your earnings reach your bank account every week." },
    { title: "Maintenance covered", body: "Servicing and repairs are handled by us." },
    { title: "Choose your hours", body: "Drive full time or part time. You decide." },
  ],
  faq: [
    { q: "Do I need my own car?", a: "No. We give you the car. You bring your licence and your documents." },
    { q: "What deposit is required?", a: "A refundable deposit, and the amount depends on the city and the plan. The exact figure is confirmed at the hub." },
    { q: "Do I need a commercial licence?", a: "A valid driving licence is required. The hub will tell you if a commercial endorsement is needed in your city." },
    { q: "When am I paid?", a: "Every week, directly to your bank account." },
    { q: "Who pays for fuel?", a: "Fuel or charging is paid by the driver. Insurance and maintenance are ours." },
    { q: "Can I own the car?", a: "Yes. The Own Now plan transfers ownership to you at the end of the term." },
  ],
  blog: {
    title: "Driver guides",
    intro: "Straight answers about renting a car, driving on Uber and what you actually take home.",
    readMore: "Read",
    empty: "No posts yet.",
    back: "All guides",
    metaDescription: "Guides for drivers on renting a car, earnings, documents and plans across Indian cities.",
  },
  common: { pending: "Pending approval", languages: "Languages" },
};

const hi: Dictionary = {
  hub: {
    eyebrow: "हमारे साथ चलाइए",
    title: "अपनी गाड़ी के बिना Uber चलाइए",
    intro:
      "Everest Fleet आपको गाड़ी, बीमा और परमिट देता है। आप Uber पर चलाइए और रोज़ का किराया देने के बाद जो कमाई बचे वह आपकी। प्लान, हब का पता और ज़रूरी कागज़ देखने के लिए अपना शहर चुनिए।",
    pickCity: "अपना शहर चुनिए",
    metaTitle: "अपनी गाड़ी के बिना Uber चलाइए",
    metaDescription:
      "सात शहरों में Uber चलाने के लिए किराए की या अपनी गाड़ी, कम डिपॉज़िट, हफ़्ते की पेमेंट, बीमा और मेंटेनेंस के साथ।",
  },
  city: {
    title: "{city} में Uber के लिए किराए पर गाड़ी",
    intro:
      "{city} में Uber चलाने के लिए गाड़ी लीजिए। अपनी गाड़ी की ज़रूरत नहीं। बीमा, परमिट और मेंटेनेंस हम देखते हैं, और पेमेंट हर हफ़्ते मिलती है।",
    metaTitle: "{city} में Uber के लिए किराए पर गाड़ी",
    metaDescription:
      "{city} में Uber चलाने के लिए गाड़ी किराए पर लीजिए। रोज़ का किराया, वापस मिलने वाला डिपॉज़िट, हब का पता और ज़रूरी कागज़।",
    readyCars: "{city} में तैयार गाड़ियाँ",
    plansHeading: "{city} के प्लान",
    documentsHeading: "साथ क्या लाना है",
    faqHeading: "ड्राइवर यह पूछते हैं",
    hubsHeading: "{city} के हब",
    otherCities: "दूसरे शहर",
    earningsHeading: "{city} में आपकी जेब में कितना",
    earningsNote: "यह आँकड़े मंज़ूरी के बाद ही दिखाए जाएँगे।",
  },
  cta: {
    apply: "अभी अप्लाई करें",
    call: "कॉल करें",
    whatsapp: "WhatsApp",
    formTitle: "30 सेकंड में अप्लाई कीजिए",
    formNote: "हम आपको कॉल करेंगे। अप्लाई करने की कोई फ़ीस नहीं।",
  },
  form: {
    name: "पूरा नाम",
    mobile: "मोबाइल नंबर",
    city: "शहर",
    selectCity: "अपना शहर चुनिए",
    submit: "अभी अप्लाई करें",
    sending: "भेजा जा रहा है",
    done: "मिल गया। हम जल्दी कॉल करेंगे।",
    failed: "भेजा नहीं जा सका। कृपया कॉल कीजिए।",
  },
  documents: ["आधार कार्ड", "पैन कार्ड", "ड्राइविंग लाइसेंस", "पते का प्रमाण"],
  benefits: [
    { title: "गाड़ी की ज़रूरत नहीं", body: "गाड़ी, परमिट और बीमा हम देते हैं।" },
    { title: "हफ़्ते की पेमेंट", body: "कमाई हर हफ़्ते सीधे आपके बैंक खाते में।" },
    { title: "मेंटेनेंस हमारा", body: "सर्विस और मरम्मत हम कराते हैं।" },
    { title: "अपने समय पर", body: "फुल टाइम चलाइए या पार्ट टाइम। फ़ैसला आपका।" },
  ],
  faq: [
    { q: "क्या अपनी गाड़ी चाहिए?", a: "नहीं। गाड़ी हम देते हैं। आप अपना लाइसेंस और कागज़ लाइए।" },
    { q: "डिपॉज़िट कितना लगता है?", a: "डिपॉज़िट वापस मिलने वाला होता है, और रकम शहर और प्लान पर निर्भर करती है। सही रकम हब पर बताई जाती है।" },
    { q: "क्या कमर्शियल लाइसेंस चाहिए?", a: "वैध ड्राइविंग लाइसेंस ज़रूरी है। आपके शहर में कमर्शियल एंडोर्समेंट चाहिए या नहीं, यह हब बताएगा।" },
    { q: "पेमेंट कब मिलती है?", a: "हर हफ़्ते, सीधे आपके बैंक खाते में।" },
    { q: "ईंधन का खर्च कौन उठाता है?", a: "ईंधन या चार्जिंग का खर्च ड्राइवर का होता है। बीमा और मेंटेनेंस हमारा।" },
    { q: "क्या गाड़ी मेरी हो सकती है?", a: "हाँ। Own Now प्लान में अवधि पूरी होने पर गाड़ी आपके नाम हो जाती है।" },
  ],
  blog: {
    title: "ड्राइवर गाइड",
    intro: "गाड़ी किराए पर लेने, Uber चलाने और असल में कितना बचता है, इसके सीधे जवाब।",
    readMore: "पढ़िए",
    empty: "अभी कोई लेख नहीं।",
    back: "सभी गाइड",
    metaDescription: "गाड़ी किराए पर लेने, कमाई, कागज़ात और प्लान के बारे में ड्राइवरों के लिए गाइड।",
  },
  common: { pending: "मंज़ूरी बाकी", languages: "भाषाएँ" },
};

const te: Dictionary = {
  hub: {
    eyebrow: "మాతో నడపండి",
    title: "సొంత కారు లేకుండా Uber నడపండి",
    intro:
      "Everest Fleet మీకు కారు, బీమా మరియు పర్మిట్ ఇస్తుంది. మీరు Uber లో నడిపి, రోజువారీ అద్దె పోను మిగిలినది మీరే తీసుకుంటారు. ప్లాన్లు, హబ్ చిరునామా మరియు కావలసిన పత్రాల కోసం మీ నగరాన్ని ఎంచుకోండి.",
    pickCity: "మీ నగరాన్ని ఎంచుకోండి",
    metaTitle: "సొంత కారు లేకుండా Uber నడపండి",
    metaDescription:
      "ఏడు నగరాల్లో Uber నడపడానికి అద్దె లేదా సొంత కారు, తక్కువ డిపాజిట్, వారానికి చెల్లింపు, బీమా మరియు మెయింటెనెన్స్‌తో.",
  },
  city: {
    title: "{city} లో Uber కోసం అద్దెకు కారు",
    intro:
      "{city} లో Uber నడపడానికి కారు తీసుకోండి. సొంత కారు అవసరం లేదు. బీమా, పర్మిట్ మరియు మెయింటెనెన్స్ మేము చూసుకుంటాం, చెల్లింపు ప్రతి వారం.",
    metaTitle: "{city} లో Uber కోసం అద్దెకు కారు",
    metaDescription:
      "{city} లో Uber నడపడానికి కారు అద్దెకు తీసుకోండి. రోజువారీ అద్దె, తిరిగి ఇచ్చే డిపాజిట్, హబ్ చిరునామాలు మరియు కావలసిన పత్రాలు.",
    readyCars: "{city} లో సిద్ధంగా ఉన్న కార్లు",
    plansHeading: "{city} లో ప్లాన్లు",
    documentsHeading: "ఏమి తీసుకురావాలి",
    faqHeading: "డ్రైవర్లు అడిగే ప్రశ్నలు",
    hubsHeading: "{city} లో హబ్‌లు",
    otherCities: "ఇతర నగరాలు",
    earningsHeading: "{city} లో మీకు మిగిలేది",
    earningsNote: "ఈ అంకెలు ఆమోదం పొందిన తర్వాతే ప్రచురించబడతాయి.",
  },
  cta: {
    apply: "ఇప్పుడే దరఖాస్తు చేయండి",
    call: "కాల్ చేయండి",
    whatsapp: "WhatsApp",
    formTitle: "30 సెకన్లలో దరఖాస్తు",
    formNote: "మేము మీకు కాల్ చేస్తాము. దరఖాస్తుకు ఎటువంటి రుసుము లేదు.",
  },
  form: {
    name: "పూర్తి పేరు",
    mobile: "మొబైల్ నంబర్",
    city: "నగరం",
    selectCity: "మీ నగరాన్ని ఎంచుకోండి",
    submit: "ఇప్పుడే దరఖాస్తు చేయండి",
    sending: "పంపుతోంది",
    done: "అందింది. మేము త్వరలో కాల్ చేస్తాము.",
    failed: "పంపడం కాలేదు. దయచేసి కాల్ చేయండి.",
  },
  documents: ["ఆధార్ కార్డ్", "పాన్ కార్డ్", "డ్రైవింగ్ లైసెన్స్", "చిరునామా రుజువు"],
  benefits: [
    { title: "కారు అవసరం లేదు", body: "కారు, పర్మిట్ మరియు బీమా మేము ఇస్తాము." },
    { title: "వారానికి చెల్లింపు", body: "మీ సంపాదన ప్రతి వారం నేరుగా బ్యాంక్ ఖాతాకు." },
    { title: "మెయింటెనెన్స్ మాది", body: "సర్వీసింగ్ మరియు మరమ్మతులు మేము చూసుకుంటాం." },
    { title: "మీ సమయం మీ ఇష్టం", body: "పూర్తి సమయం లేదా పార్ట్ టైమ్. నిర్ణయం మీదే." },
  ],
  faq: [
    { q: "సొంత కారు కావాలా?", a: "అవసరం లేదు. కారు మేము ఇస్తాము. మీరు లైసెన్స్ మరియు పత్రాలు తీసుకురండి." },
    { q: "డిపాజిట్ ఎంత?", a: "డిపాజిట్ తిరిగి ఇవ్వబడుతుంది, మొత్తం నగరం మరియు ప్లాన్ ఆధారంగా ఉంటుంది. ఖచ్చితమైన మొత్తం హబ్ లో చెబుతారు." },
    { q: "కమర్షియల్ లైసెన్స్ కావాలా?", a: "చెల్లుబాటు అయ్యే డ్రైవింగ్ లైసెన్స్ అవసరం. మీ నగరంలో కమర్షియల్ ఎండార్స్‌మెంట్ కావాలో లేదో హబ్ చెబుతుంది." },
    { q: "చెల్లింపు ఎప్పుడు?", a: "ప్రతి వారం, నేరుగా మీ బ్యాంక్ ఖాతాకు." },
    { q: "ఇంధనం ఖర్చు ఎవరిది?", a: "ఇంధనం లేదా ఛార్జింగ్ ఖర్చు డ్రైవర్‌ది. బీమా మరియు మెయింటెనెన్స్ మాది." },
    { q: "కారు నాది అవుతుందా?", a: "అవును. Own Now ప్లాన్‌లో గడువు పూర్తయ్యాక కారు మీ పేరు మీదకు వస్తుంది." },
  ],
  blog: {
    title: "డ్రైవర్ గైడ్‌లు",
    intro: "కారు అద్దెకు తీసుకోవడం, Uber నడపడం మరియు నిజంగా ఎంత మిగులుతుంది అనే వాటికి సూటి సమాధానాలు.",
    readMore: "చదవండి",
    empty: "ఇంకా వ్యాసాలు లేవు.",
    back: "అన్ని గైడ్‌లు",
    metaDescription: "కారు అద్దె, సంపాదన, పత్రాలు మరియు ప్లాన్ల గురించి డ్రైవర్ల కోసం గైడ్‌లు.",
  },
  common: { pending: "ఆమోదం పెండింగ్", languages: "భాషలు" },
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, hi, te };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** fill("{city} में", { city: "मुंबई" }) */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
