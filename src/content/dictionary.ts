import type { Locale } from "@/lib/i18n";

/**
 * Every string the driver pages and the blog can show, in each locale.
 *
 * Written natively rather than machine translated, because these pages exist to be found
 * by someone searching in their own language. A native speaker must read each locale once
 * before it is published; every non-English locale below is a first draft.
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
    /** The job title in the page's job listing markup: the role alone, as Google for Jobs asks. */
    jobTitle: string;
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
    title: "Driver jobs with a car included",
    intro:
      "Driver jobs in seven cities, with the car, the insurance and the permit from Everest Fleet. You drive on Uber and keep what you earn after the daily rent. Pick your city to see plans, hub addresses and what to bring.",
    pickCity: "Choose your city",
    metaTitle: "Driver Jobs in 7 Cities, Car Included",
    metaDescription:
      "Apply for a cab driver job in Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune or Kolkata. Car, insurance and permit included. Weekly payouts.",
  },
  city: {
    title: "Driver job in {city}, car included",
    intro:
      "A driver job in {city} with a car on rent for Uber. No car of your own needed. Insurance, permit and maintenance are handled, and you are paid every week.",
    jobTitle: "Cab Driver (Uber)",
    metaTitle: "Driver Job in {city}, Car on Rent for Uber",
    metaDescription:
      "Apply for a cab driver job in {city}. Car on rent for Uber, refundable deposit, weekly payouts, hub addresses and the documents you need.",
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
    title: "ड्राइवर की नौकरी, गाड़ी हमारी",
    intro:
      "सात शहरों में ड्राइवर की नौकरी, और गाड़ी, बीमा और परमिट Everest Fleet का। आप Uber पर चलाइए और रोज़ का किराया देने के बाद जो कमाई बचे वह आपकी। प्लान, हब का पता और ज़रूरी कागज़ देखने के लिए अपना शहर चुनिए।",
    pickCity: "अपना शहर चुनिए",
    metaTitle: "Driver Job Chahiye: ड्राइवर की नौकरी, गाड़ी हमारी",
    metaDescription:
      "Driver job chahiye to 7 शहरों में अप्लाई कीजिए: गाड़ी, बीमा और परमिट Everest Fleet का, आप Uber चलाइए। हफ़्ते की पेमेंट।",
  },
  city: {
    title: "{city} में ड्राइवर की नौकरी, गाड़ी हमारी",
    intro:
      "{city} में ड्राइवर की नौकरी, Uber के लिए किराए की गाड़ी के साथ। अपनी गाड़ी की ज़रूरत नहीं। बीमा, परमिट और मेंटेनेंस हम देखते हैं, और पेमेंट हर हफ़्ते मिलती है।",
    jobTitle: "कैब ड्राइवर (Uber)",
    metaTitle: "{city} में ड्राइवर जॉब, Uber के लिए किराए पर गाड़ी",
    metaDescription:
      "{city} में driver job चाहिए तो अप्लाई कीजिए: Uber के लिए किराए पर गाड़ी, वापस मिलने वाला डिपॉज़िट, हर हफ़्ते पेमेंट, हब का पता और ज़रूरी कागज़।",
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
    title: "కారుతో సహా డ్రైవర్ ఉద్యోగాలు",
    intro:
      "ఏడు నగరాల్లో డ్రైవర్ ఉద్యోగాలు, కారు, బీమా మరియు పర్మిట్ Everest Fleet ఇస్తుంది. మీరు Uber లో నడిపి, రోజువారీ అద్దె పోను మిగిలినది మీరే తీసుకుంటారు. ప్లాన్లు, హబ్ చిరునామా మరియు కావలసిన పత్రాల కోసం మీ నగరాన్ని ఎంచుకోండి.",
    pickCity: "మీ నగరాన్ని ఎంచుకోండి",
    metaTitle: "Driver Job: 7 నగరాల్లో డ్రైవర్ ఉద్యోగాలు, కారు మాది",
    metaDescription:
      "ఏడు నగరాల్లో క్యాబ్ డ్రైవర్ ఉద్యోగం: కారు, బీమా మరియు పర్మిట్ Everest Fleet ఇస్తుంది, మీరు Uber నడపండి. వారానికి చెల్లింపు.",
  },
  city: {
    title: "{city} లో డ్రైవర్ ఉద్యోగం, కారు మాది",
    intro:
      "{city} లో డ్రైవర్ ఉద్యోగం, Uber కోసం అద్దెకు కారుతో. సొంత కారు అవసరం లేదు. బీమా, పర్మిట్ మరియు మెయింటెనెన్స్ మేము చూసుకుంటాం, చెల్లింపు ప్రతి వారం.",
    jobTitle: "క్యాబ్ డ్రైవర్ (Uber)",
    metaTitle: "{city} లో డ్రైవర్ జాబ్, Uber కోసం అద్దెకు కారు",
    metaDescription:
      "{city} లో క్యాబ్ డ్రైవర్ ఉద్యోగానికి దరఖాస్తు చేయండి: Uber కోసం అద్దెకు కారు, తిరిగి ఇచ్చే డిపాజిట్, వారానికి చెల్లింపు, హబ్ చిరునామాలు మరియు కావలసిన పత్రాలు.",
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

const mr: Dictionary = {
  hub: {
    eyebrow: "आमच्यासोबत चालवा",
    title: "ड्रायव्हरची नोकरी, गाडी आमची",
    intro:
      "सात शहरांमध्ये ड्रायव्हरची नोकरी, आणि गाडी, विमा व परमिट Everest Fleet चे. तुम्ही Uber वर गाडी चालवा आणि रोजचे भाडे वजा करून उरलेली कमाई तुमची. प्लॅन, हबचा पत्ता आणि लागणारी कागदपत्रे पाहण्यासाठी तुमचे शहर निवडा.",
    pickCity: "तुमचे शहर निवडा",
    metaTitle: "Driver Job: 7 शहरांत ड्रायव्हरची नोकरी, गाडी आमची",
    metaDescription:
      "मुंबई, पुणे आणि आणखी 5 शहरांत कॅब ड्रायव्हरच्या नोकरीसाठी अर्ज करा: गाडी, विमा आणि परमिट Everest Fleet चे, तुम्ही Uber चालवा, पेमेंट दर आठवड्याला.",
  },
  city: {
    title: "{city} मध्ये ड्रायव्हरची नोकरी, गाडी आमची",
    intro:
      "{city} मध्ये ड्रायव्हरची नोकरी, Uber साठी भाड्याच्या गाडीसह. स्वतःची गाडी लागत नाही. विमा, परमिट आणि देखभाल आम्ही पाहतो, आणि पेमेंट दर आठवड्याला मिळते.",
    jobTitle: "कॅब ड्रायव्हर (Uber)",
    metaTitle: "{city} मध्ये ड्रायव्हर जॉब, Uber साठी भाड्याने गाडी",
    metaDescription:
      "{city} मध्ये कॅब ड्रायव्हरच्या नोकरीसाठी अर्ज करा: Uber साठी भाड्याने गाडी, परत मिळणारे डिपॉझिट, दर आठवड्याला पेमेंट, हबचे पत्ते आणि लागणारी कागदपत्रे.",
    readyCars: "{city} मध्ये तयार गाड्या",
    plansHeading: "{city} मधील प्लॅन",
    documentsHeading: "सोबत काय आणायचे",
    faqHeading: "ड्रायव्हर हे विचारतात",
    hubsHeading: "{city} मधील हब",
    otherCities: "इतर शहरे",
    earningsHeading: "{city} मध्ये तुमच्या हातात किती",
    earningsNote: "हे आकडे मंजुरीनंतरच दाखवले जातील.",
  },
  cta: {
    apply: "आत्ताच अर्ज करा",
    call: "कॉल करा",
    whatsapp: "WhatsApp",
    formTitle: "30 सेकंदांत अर्ज करा",
    formNote: "आम्ही तुम्हाला कॉल करू. अर्जासाठी कोणतेही शुल्क नाही.",
  },
  form: {
    name: "पूर्ण नाव",
    mobile: "मोबाइल नंबर",
    city: "शहर",
    selectCity: "तुमचे शहर निवडा",
    submit: "आत्ताच अर्ज करा",
    sending: "पाठवत आहोत",
    done: "मिळाले. आम्ही लवकरच कॉल करू.",
    failed: "पाठवता आले नाही. कृपया कॉल करा.",
  },
  documents: ["आधार कार्ड", "पॅन कार्ड", "ड्रायव्हिंग लायसन्स", "पत्त्याचा पुरावा"],
  benefits: [
    { title: "गाडीची गरज नाही", body: "गाडी, परमिट आणि विमा आम्ही देतो." },
    { title: "दर आठवड्याला पेमेंट", body: "कमाई दर आठवड्याला थेट तुमच्या बँक खात्यात." },
    { title: "देखभाल आमची", body: "सर्व्हिसिंग आणि दुरुस्ती आम्ही करतो." },
    { title: "तुमच्या वेळेनुसार", body: "पूर्ण वेळ चालवा किंवा अर्धवेळ. निर्णय तुमचा." },
  ],
  faq: [
    { q: "स्वतःची गाडी लागते का?", a: "नाही. गाडी आम्ही देतो. तुम्ही तुमचे लायसन्स आणि कागदपत्रे आणा." },
    { q: "डिपॉझिट किती लागते?", a: "डिपॉझिट परत मिळणारे असते, आणि रक्कम शहर व प्लॅनवर अवलंबून असते. नेमकी रक्कम हबवर सांगितली जाते." },
    { q: "कमर्शियल लायसन्स लागते का?", a: "वैध ड्रायव्हिंग लायसन्स आवश्यक आहे. तुमच्या शहरात कमर्शियल एंडोर्समेंट लागते का, हे हब सांगेल." },
    { q: "पेमेंट कधी मिळते?", a: "दर आठवड्याला, थेट तुमच्या बँक खात्यात." },
    { q: "इंधनाचा खर्च कोण करतो?", a: "इंधन किंवा चार्जिंगचा खर्च ड्रायव्हरचा असतो. विमा आणि देखभाल आमची." },
    { q: "गाडी माझी होऊ शकते का?", a: "हो. Own Now प्लॅनमध्ये मुदत पूर्ण झाल्यावर गाडी तुमच्या नावावर होते." },
  ],
  blog: {
    title: "ड्रायव्हर गाइड",
    intro: "गाडी भाड्याने घेणे, Uber चालवणे आणि खरंच किती हातात उरते, याची सरळ उत्तरे.",
    readMore: "वाचा",
    empty: "अजून एकही लेख नाही.",
    back: "सर्व गाइड",
    metaDescription: "गाडी भाड्याने घेणे, कमाई, कागदपत्रे आणि प्लॅनबद्दल ड्रायव्हरसाठी गाइड.",
  },
  common: { pending: "मंजुरी बाकी", languages: "भाषा" },
};

const kn: Dictionary = {
  hub: {
    eyebrow: "ನಮ್ಮೊಂದಿಗೆ ಓಡಿಸಿ",
    title: "ಕಾರಿನ ಜೊತೆಗೆ ಡ್ರೈವರ್ ಕೆಲಸ",
    intro:
      "ಏಳು ನಗರಗಳಲ್ಲಿ ಡ್ರೈವರ್ ಕೆಲಸ, ಕಾರು, ವಿಮೆ ಮತ್ತು ಪರ್ಮಿಟ್ Everest Fleet ನಿಂದ. ನೀವು Uber ನಲ್ಲಿ ಓಡಿಸಿ, ದಿನದ ಬಾಡಿಗೆ ಕಳೆದು ಉಳಿದ ಗಳಿಕೆ ನಿಮ್ಮದು. ಪ್ಲಾನ್‌ಗಳು, ಹಬ್ ವಿಳಾಸ ಮತ್ತು ಬೇಕಾದ ದಾಖಲೆಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ನಗರವನ್ನು ಆರಿಸಿ.",
    pickCity: "ನಿಮ್ಮ ನಗರವನ್ನು ಆರಿಸಿ",
    metaTitle: "Driver Job: 7 ನಗರಗಳಲ್ಲಿ ಡ್ರೈವರ್ ಕೆಲಸ, ಕಾರು ನಮ್ಮದು",
    metaDescription:
      "ಬೆಂಗಳೂರು ಸೇರಿದಂತೆ 7 ನಗರಗಳಲ್ಲಿ ಕ್ಯಾಬ್ ಡ್ರೈವರ್ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಹಾಕಿ: ಕಾರು, ವಿಮೆ ಮತ್ತು ಪರ್ಮಿಟ್ Everest Fleet ನದು, ನೀವು Uber ಓಡಿಸಿ, ಪಾವತಿ ಪ್ರತಿ ವಾರ.",
  },
  city: {
    title: "{city} ನಗರದಲ್ಲಿ ಡ್ರೈವರ್ ಕೆಲಸ, ಕಾರು ನಮ್ಮದು",
    intro:
      "{city} ನಗರದಲ್ಲಿ ಡ್ರೈವರ್ ಕೆಲಸ, Uber ಗಾಗಿ ಬಾಡಿಗೆ ಕಾರಿನೊಂದಿಗೆ. ಸ್ವಂತ ಕಾರು ಬೇಕಿಲ್ಲ. ವಿಮೆ, ಪರ್ಮಿಟ್ ಮತ್ತು ನಿರ್ವಹಣೆ ನಾವು ನೋಡಿಕೊಳ್ಳುತ್ತೇವೆ, ಪಾವತಿ ಪ್ರತಿ ವಾರ.",
    jobTitle: "ಕ್ಯಾಬ್ ಡ್ರೈವರ್ (Uber)",
    metaTitle: "{city} ನಗರದಲ್ಲಿ ಡ್ರೈವರ್ ಜಾಬ್, Uber ಗಾಗಿ ಬಾಡಿಗೆ ಕಾರು",
    metaDescription:
      "{city} ನಗರದಲ್ಲಿ ಕ್ಯಾಬ್ ಡ್ರೈವರ್ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಹಾಕಿ: Uber ಗಾಗಿ ಬಾಡಿಗೆ ಕಾರು, ಹಿಂತಿರುಗಿಸುವ ಠೇವಣಿ, ಪ್ರತಿ ವಾರ ಪಾವತಿ, ಹಬ್ ವಿಳಾಸಗಳು ಮತ್ತು ಬೇಕಾದ ದಾಖಲೆಗಳು.",
    readyCars: "{city} ನಗರದಲ್ಲಿ ಸಿದ್ಧವಿರುವ ಕಾರುಗಳು",
    plansHeading: "{city} ನಗರದ ಪ್ಲಾನ್‌ಗಳು",
    documentsHeading: "ಏನು ತರಬೇಕು",
    faqHeading: "ಡ್ರೈವರ್‌ಗಳು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು",
    hubsHeading: "{city} ನಗರದ ಹಬ್‌ಗಳು",
    otherCities: "ಇತರ ನಗರಗಳು",
    earningsHeading: "{city} ನಗರದಲ್ಲಿ ನಿಮಗೆ ಉಳಿಯುವುದು",
    earningsNote: "ಈ ಅಂಕಿಗಳು ಅನುಮೋದನೆಯ ನಂತರವೇ ಪ್ರಕಟವಾಗುತ್ತವೆ.",
  },
  cta: {
    apply: "ಈಗಲೇ ಅರ್ಜಿ ಹಾಕಿ",
    call: "ಕರೆ ಮಾಡಿ",
    whatsapp: "WhatsApp",
    formTitle: "30 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಅರ್ಜಿ",
    formNote: "ನಾವು ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತೇವೆ. ಅರ್ಜಿಗೆ ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲ.",
  },
  form: {
    name: "ಪೂರ್ಣ ಹೆಸರು",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    city: "ನಗರ",
    selectCity: "ನಿಮ್ಮ ನಗರವನ್ನು ಆರಿಸಿ",
    submit: "ಈಗಲೇ ಅರ್ಜಿ ಹಾಕಿ",
    sending: "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ",
    done: "ಸಿಕ್ಕಿದೆ. ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಕರೆ ಮಾಡುತ್ತೇವೆ.",
    failed: "ಕಳುಹಿಸಲು ಆಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಕರೆ ಮಾಡಿ.",
  },
  documents: ["ಆಧಾರ್ ಕಾರ್ಡ್", "ಪ್ಯಾನ್ ಕಾರ್ಡ್", "ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್", "ವಿಳಾಸದ ಪುರಾವೆ"],
  benefits: [
    { title: "ಕಾರು ಬೇಕಿಲ್ಲ", body: "ಕಾರು, ಪರ್ಮಿಟ್ ಮತ್ತು ವಿಮೆ ನಾವು ಕೊಡುತ್ತೇವೆ." },
    { title: "ಪ್ರತಿ ವಾರ ಪಾವತಿ", body: "ನಿಮ್ಮ ಗಳಿಕೆ ಪ್ರತಿ ವಾರ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ." },
    { title: "ನಿರ್ವಹಣೆ ನಮ್ಮದು", body: "ಸರ್ವೀಸಿಂಗ್ ಮತ್ತು ರಿಪೇರಿ ನಾವು ನೋಡಿಕೊಳ್ಳುತ್ತೇವೆ." },
    { title: "ನಿಮ್ಮ ಸಮಯ, ನಿಮ್ಮ ಇಷ್ಟ", body: "ಪೂರ್ಣ ಸಮಯ ಅಥವಾ ಅರೆಕಾಲಿಕ. ನಿರ್ಧಾರ ನಿಮ್ಮದು." },
  ],
  faq: [
    { q: "ಸ್ವಂತ ಕಾರು ಬೇಕೇ?", a: "ಬೇಡ. ಕಾರು ನಾವು ಕೊಡುತ್ತೇವೆ. ನೀವು ಲೈಸೆನ್ಸ್ ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ತನ್ನಿ." },
    { q: "ಠೇವಣಿ ಎಷ್ಟು?", a: "ಠೇವಣಿ ಹಿಂತಿರುಗಿಸಲಾಗುತ್ತದೆ, ಮೊತ್ತ ನಗರ ಮತ್ತು ಪ್ಲಾನ್ ಮೇಲೆ ಅವಲಂಬಿತ. ನಿಖರ ಮೊತ್ತವನ್ನು ಹಬ್‌ನಲ್ಲಿ ತಿಳಿಸಲಾಗುತ್ತದೆ." },
    { q: "ಕಮರ್ಷಿಯಲ್ ಲೈಸೆನ್ಸ್ ಬೇಕೇ?", a: "ಮಾನ್ಯವಾದ ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಅಗತ್ಯ. ನಿಮ್ಮ ನಗರದಲ್ಲಿ ಕಮರ್ಷಿಯಲ್ ಎಂಡೋರ್ಸ್‌ಮೆಂಟ್ ಬೇಕೇ ಎಂದು ಹಬ್ ತಿಳಿಸುತ್ತದೆ." },
    { q: "ಪಾವತಿ ಯಾವಾಗ?", a: "ಪ್ರತಿ ವಾರ, ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ." },
    { q: "ಇಂಧನದ ಖರ್ಚು ಯಾರದು?", a: "ಇಂಧನ ಅಥವಾ ಚಾರ್ಜಿಂಗ್ ಖರ್ಚು ಡ್ರೈವರ್‌ದು. ವಿಮೆ ಮತ್ತು ನಿರ್ವಹಣೆ ನಮ್ಮದು." },
    { q: "ಕಾರು ನನ್ನದಾಗಬಹುದೇ?", a: "ಹೌದು. Own Now ಪ್ಲಾನ್‌ನಲ್ಲಿ ಅವಧಿ ಮುಗಿದ ನಂತರ ಕಾರು ನಿಮ್ಮ ಹೆಸರಿಗೆ ಬರುತ್ತದೆ." },
  ],
  blog: {
    title: "ಡ್ರೈವರ್ ಗೈಡ್‌ಗಳು",
    intro: "ಕಾರು ಬಾಡಿಗೆಗೆ ಪಡೆಯುವುದು, Uber ಓಡಿಸುವುದು ಮತ್ತು ನಿಜವಾಗಿ ಎಷ್ಟು ಉಳಿಯುತ್ತದೆ ಎಂಬುದಕ್ಕೆ ನೇರ ಉತ್ತರಗಳು.",
    readMore: "ಓದಿ",
    empty: "ಇನ್ನೂ ಯಾವುದೇ ಲೇಖನಗಳಿಲ್ಲ.",
    back: "ಎಲ್ಲಾ ಗೈಡ್‌ಗಳು",
    metaDescription: "ಕಾರು ಬಾಡಿಗೆ, ಗಳಿಕೆ, ದಾಖಲೆಗಳು ಮತ್ತು ಪ್ಲಾನ್‌ಗಳ ಬಗ್ಗೆ ಡ್ರೈವರ್‌ಗಳಿಗಾಗಿ ಗೈಡ್‌ಗಳು.",
  },
  common: { pending: "ಅನುಮೋದನೆ ಬಾಕಿ", languages: "ಭಾಷೆಗಳು" },
};

const bn: Dictionary = {
  hub: {
    eyebrow: "আমাদের সঙ্গে চালান",
    title: "গাড়ি সহ ড্রাইভারের চাকরি",
    intro:
      "সাতটি শহরে ড্রাইভারের চাকরি, গাড়ি, বিমা আর পারমিট Everest Fleet-এর। আপনি Uber-এ গাড়ি চালান, রোজের ভাড়া বাদ দিয়ে যা আয় থাকে তা আপনার। প্ল্যান, হাবের ঠিকানা আর কী কী কাগজ লাগবে দেখতে আপনার শহর বেছে নিন।",
    pickCity: "আপনার শহর বেছে নিন",
    metaTitle: "Driver Job: 7টি শহরে ড্রাইভারের চাকরি, গাড়ি আমাদের",
    metaDescription:
      "কলকাতা সহ 7টি শহরে ক্যাব ড্রাইভারের চাকরির জন্য আবেদন করুন: গাড়ি, বিমা আর পারমিট Everest Fleet-এর, আপনি Uber চালান, পেমেন্ট প্রতি সপ্তাহে।",
  },
  city: {
    title: "{city} শহরে ড্রাইভারের চাকরি, গাড়ি আমাদের",
    intro:
      "{city} শহরে ড্রাইভারের চাকরি, Uber-এর জন্য ভাড়ার গাড়ি সহ। নিজের গাড়ি লাগবে না। বিমা, পারমিট আর রক্ষণাবেক্ষণ আমরা দেখি, আর পেমেন্ট হয় প্রতি সপ্তাহে।",
    jobTitle: "ক্যাব ড্রাইভার (Uber)",
    metaTitle: "{city} শহরে ড্রাইভার জব, Uber-এর জন্য ভাড়ায় গাড়ি",
    metaDescription:
      "{city} শহরে ক্যাব ড্রাইভারের চাকরির জন্য আবেদন করুন: Uber-এর জন্য ভাড়ায় গাড়ি, ফেরতযোগ্য ডিপোজিট, প্রতি সপ্তাহে পেমেন্ট, হাবের ঠিকানা আর দরকারি কাগজপত্র।",
    readyCars: "{city} শহরে তৈরি গাড়ি",
    plansHeading: "{city} শহরের প্ল্যান",
    documentsHeading: "সঙ্গে কী আনবেন",
    faqHeading: "ড্রাইভাররা যা জানতে চান",
    hubsHeading: "{city} শহরের হাব",
    otherCities: "অন্যান্য শহর",
    earningsHeading: "{city} শহরে আপনার হাতে কত থাকে",
    earningsNote: "এই অঙ্কগুলো অনুমোদনের পরেই দেখানো হবে।",
  },
  cta: {
    apply: "এখনই আবেদন করুন",
    call: "কল করুন",
    whatsapp: "WhatsApp",
    formTitle: "30 সেকেন্ডে আবেদন করুন",
    formNote: "আমরা আপনাকে কল করব। আবেদনের কোনো ফি নেই।",
  },
  form: {
    name: "পুরো নাম",
    mobile: "মোবাইল নম্বর",
    city: "শহর",
    selectCity: "আপনার শহর বেছে নিন",
    submit: "এখনই আবেদন করুন",
    sending: "পাঠানো হচ্ছে",
    done: "পেয়েছি। আমরা শিগগির কল করব।",
    failed: "পাঠানো গেল না। দয়া করে কল করুন।",
  },
  documents: ["আধার কার্ড", "প্যান কার্ড", "ড্রাইভিং লাইসেন্স", "ঠিকানার প্রমাণ"],
  benefits: [
    { title: "গাড়ি লাগবে না", body: "গাড়ি, পারমিট আর বিমা আমরা দিই।" },
    { title: "প্রতি সপ্তাহে পেমেন্ট", body: "আপনার আয় প্রতি সপ্তাহে সরাসরি ব্যাংক অ্যাকাউন্টে।" },
    { title: "রক্ষণাবেক্ষণ আমাদের", body: "সার্ভিসিং আর মেরামত আমরা করি।" },
    { title: "নিজের সময়ে", body: "ফুল টাইম চালান বা পার্ট টাইম। সিদ্ধান্ত আপনার।" },
  ],
  faq: [
    { q: "নিজের গাড়ি লাগবে?", a: "না। গাড়ি আমরা দিই। আপনি লাইসেন্স আর কাগজপত্র আনুন।" },
    { q: "ডিপোজিট কত লাগে?", a: "ডিপোজিট ফেরতযোগ্য, আর পরিমাণ শহর ও প্ল্যানের উপর নির্ভর করে। সঠিক অঙ্ক হাবে জানানো হয়।" },
    { q: "কমার্শিয়াল লাইসেন্স লাগবে?", a: "বৈধ ড্রাইভিং লাইসেন্স দরকার। আপনার শহরে কমার্শিয়াল এনডোর্সমেন্ট লাগবে কিনা, তা হাব জানাবে।" },
    { q: "পেমেন্ট কবে পাব?", a: "প্রতি সপ্তাহে, সরাসরি আপনার ব্যাংক অ্যাকাউন্টে।" },
    { q: "জ্বালানির খরচ কে দেয়?", a: "জ্বালানি বা চার্জিংয়ের খরচ ড্রাইভারের। বিমা আর রক্ষণাবেক্ষণ আমাদের।" },
    { q: "গাড়ি কি আমার হতে পারে?", a: "হ্যাঁ। Own Now প্ল্যানে মেয়াদ শেষে গাড়ি আপনার নামে হয়ে যায়।" },
  ],
  blog: {
    title: "ড্রাইভার গাইড",
    intro: "গাড়ি ভাড়া নেওয়া, Uber চালানো আর আসলে কত হাতে থাকে, তার সোজা উত্তর।",
    readMore: "পড়ুন",
    empty: "এখনও কোনো লেখা নেই।",
    back: "সব গাইড",
    metaDescription: "গাড়ি ভাড়া, আয়, কাগজপত্র আর প্ল্যান নিয়ে ড্রাইভারদের জন্য গাইড।",
  },
  common: { pending: "অনুমোদন বাকি", languages: "ভাষা" },
};

const ta: Dictionary = {
  hub: {
    eyebrow: "எங்களுடன் ஓட்டுங்கள்",
    title: "காருடன் டிரைவர் வேலை",
    intro:
      "ஏழு நகரங்களில் டிரைவர் வேலை, கார், காப்பீடு மற்றும் பெர்மிட் Everest Fleet தருகிறது. நீங்கள் Uber-இல் ஓட்டுங்கள், தினசரி வாடகை போக மீதி வருமானம் உங்களுடையது. திட்டங்கள், ஹப் முகவரி மற்றும் தேவையான ஆவணங்களைப் பார்க்க உங்கள் நகரத்தைத் தேர்ந்தெடுங்கள்.",
    pickCity: "உங்கள் நகரத்தைத் தேர்ந்தெடுங்கள்",
    metaTitle: "Driver Job: 7 நகரங்களில் டிரைவர் வேலை, கார் எங்களுடையது",
    metaDescription:
      "சென்னை உட்பட 7 நகரங்களில் கேப் டிரைவர் வேலைக்கு விண்ணப்பியுங்கள்: கார், காப்பீடு மற்றும் பெர்மிட் Everest Fleet-உடையது, நீங்கள் Uber ஓட்டுங்கள், பணம் ஒவ்வொரு வாரமும்.",
  },
  city: {
    title: "{city} நகரில் டிரைவர் வேலை, கார் எங்களுடையது",
    intro:
      "{city} நகரில் டிரைவர் வேலை, Uber-க்கு வாடகை காருடன். சொந்த கார் தேவையில்லை. காப்பீடு, பெர்மிட் மற்றும் பராமரிப்பை நாங்கள் கவனிக்கிறோம், பணம் ஒவ்வொரு வாரமும் கிடைக்கும்.",
    jobTitle: "கேப் டிரைவர் (Uber)",
    metaTitle: "{city} நகரில் டிரைவர் வேலை, Uber-க்கு வாடகை கார்",
    metaDescription:
      "{city} நகரில் கேப் டிரைவர் வேலைக்கு விண்ணப்பியுங்கள்: Uber-க்கு வாடகை கார், திரும்பக் கிடைக்கும் டெபாசிட், வாராந்திர பணம், ஹப் முகவரிகள் மற்றும் தேவையான ஆவணங்கள்.",
    readyCars: "{city} நகரில் தயாராக உள்ள கார்கள்",
    plansHeading: "{city} நகரில் திட்டங்கள்",
    documentsHeading: "என்ன கொண்டு வர வேண்டும்",
    faqHeading: "டிரைவர்கள் கேட்கும் கேள்விகள்",
    hubsHeading: "{city} நகரில் ஹப்கள்",
    otherCities: "மற்ற நகரங்கள்",
    earningsHeading: "{city} நகரில் உங்களுக்கு மிஞ்சுவது",
    earningsNote: "இந்த எண்கள் ஒப்புதலுக்குப் பிறகே வெளியிடப்படும்.",
  },
  cta: {
    apply: "இப்போதே விண்ணப்பியுங்கள்",
    call: "அழையுங்கள்",
    whatsapp: "WhatsApp",
    formTitle: "30 விநாடிகளில் விண்ணப்பம்",
    formNote: "நாங்கள் உங்களை அழைப்போம். விண்ணப்பிக்க கட்டணம் எதுவும் இல்லை.",
  },
  form: {
    name: "முழுப் பெயர்",
    mobile: "மொபைல் எண்",
    city: "நகரம்",
    selectCity: "உங்கள் நகரத்தைத் தேர்ந்தெடுங்கள்",
    submit: "இப்போதே விண்ணப்பியுங்கள்",
    sending: "அனுப்பப்படுகிறது",
    done: "கிடைத்தது. விரைவில் அழைப்போம்.",
    failed: "அனுப்ப முடியவில்லை. தயவுசெய்து அழையுங்கள்.",
  },
  documents: ["ஆதார் அட்டை", "பான் அட்டை", "ஓட்டுநர் உரிமம்", "முகவரிச் சான்று"],
  benefits: [
    { title: "கார் தேவையில்லை", body: "கார், பெர்மிட் மற்றும் காப்பீடு நாங்கள் தருகிறோம்." },
    { title: "வாராந்திர பணம்", body: "உங்கள் வருமானம் ஒவ்வொரு வாரமும் நேரடியாக வங்கிக் கணக்கில்." },
    { title: "பராமரிப்பு எங்களுடையது", body: "சர்வீஸ் மற்றும் பழுதுபார்ப்பை நாங்கள் செய்கிறோம்." },
    { title: "உங்கள் நேரம், உங்கள் விருப்பம்", body: "முழு நேரம் அல்லது பகுதி நேரம். முடிவு உங்களுடையது." },
  ],
  faq: [
    { q: "சொந்த கார் வேண்டுமா?", a: "வேண்டாம். கார் நாங்கள் தருகிறோம். நீங்கள் உரிமம் மற்றும் ஆவணங்களைக் கொண்டு வாருங்கள்." },
    { q: "டெபாசிட் எவ்வளவு?", a: "டெபாசிட் திரும்பக் கிடைக்கும், தொகை நகரம் மற்றும் திட்டத்தைப் பொறுத்தது. சரியான தொகை ஹப்பில் சொல்லப்படும்." },
    { q: "கமர்ஷியல் உரிமம் வேண்டுமா?", a: "செல்லுபடியாகும் ஓட்டுநர் உரிமம் அவசியம். உங்கள் நகரத்தில் கமர்ஷியல் எண்டார்ஸ்மென்ட் தேவையா என்பதை ஹப் சொல்லும்." },
    { q: "பணம் எப்போது கிடைக்கும்?", a: "ஒவ்வொரு வாரமும், நேரடியாக உங்கள் வங்கிக் கணக்கில்." },
    { q: "எரிபொருள் செலவு யாருடையது?", a: "எரிபொருள் அல்லது சார்ஜிங் செலவு டிரைவருடையது. காப்பீடு மற்றும் பராமரிப்பு எங்களுடையது." },
    { q: "கார் என்னுடையதாக ஆகுமா?", a: "ஆம். Own Now திட்டத்தில் காலம் முடிந்ததும் கார் உங்கள் பெயருக்கு மாறும்." },
  ],
  blog: {
    title: "டிரைவர் வழிகாட்டிகள்",
    intro: "கார் வாடகைக்கு எடுப்பது, Uber ஓட்டுவது, உண்மையில் எவ்வளவு மிஞ்சும் என்பதற்கு நேரடி பதில்கள்.",
    readMore: "படியுங்கள்",
    empty: "இன்னும் கட்டுரைகள் இல்லை.",
    back: "அனைத்து வழிகாட்டிகளும்",
    metaDescription: "கார் வாடகை, வருமானம், ஆவணங்கள் மற்றும் திட்டங்கள் பற்றி டிரைவர்களுக்கான வழிகாட்டிகள்.",
  },
  common: { pending: "ஒப்புதல் நிலுவையில்", languages: "மொழிகள்" },
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, hi, mr, kn, te, bn, ta };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** fill("{city} में", { city: "मुंबई" }) */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
