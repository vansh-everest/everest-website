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
    /** The link from a hub to its place on a map. */
    map: string;
    otherCities: string;
  };
  cta: { apply: string; call: string; whatsapp: string; formTitle: string; formNote: string };
  form: { name: string; mobile: string; city: string; selectCity: string; submit: string; sending: string; done: string; failed: string };
  documents: string[];
  /** One line per plan on a city page, by plan id, worded as the plan's own page describes it. */
  plans: { "own-now": string; "drive-to-own": string; leasing: string };
  faq: { q: string; a: string }[];
  blog: { title: string; intro: string; readMore: string; empty: string; back: string; metaDescription: string };
  /** Labels for a plan's figures on a city page; {n} is the number of months. */
  figures: { from: string; deposit: string; upfront: string; term: string; months: string };
  common: { languages: string };
};

const en: Dictionary = {
  hub: {
    eyebrow: "Drive With Us",
    title: "Driver Jobs With A Car Included",
    intro: "Drive on Uber in a car from Everest Fleet.",
    pickCity: "Choose Your City",
    metaTitle: "Driver Jobs in 7 Cities, Car Included",
    metaDescription:
      "Apply for a cab driver job in Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune or Kolkata. Car, insurance and permit included. Weekly payouts.",
  },
  city: {
    title: "Driver Job In {city}, Car Included",
    intro: "Drive on Uber in {city}, in a car from Everest Fleet.",
    jobTitle: "Cab Driver (Uber)",
    metaTitle: "Driver Job in {city}, Car on Rent for Uber",
    metaDescription:
      "Apply for a cab driver job in {city}. Car on rent for Uber, refundable deposit, weekly payouts, hub addresses and the documents you need.",
    readyCars: "Cars Ready In {city}",
    plansHeading: "Plans In {city}",
    documentsHeading: "What To Bring",
    faqHeading: "Questions Drivers Ask",
    hubsHeading: "Hubs In {city}",
    map: "Map",
    otherCities: "Other Cities",
  },
  cta: {
    apply: "Apply Now",
    call: "Call Us",
    whatsapp: "WhatsApp",
    formTitle: "Apply In 30 Seconds",
    formNote: "We call you back.",
  },
  form: {
    name: "Full Name",
    mobile: "Mobile Number",
    city: "City",
    selectCity: "Select your city",
    submit: "Apply Now",
    sending: "Sending",
    done: "Got it. We will call you shortly.",
    failed: "That did not send. Please call us instead.",
  },
  documents: ["Aadhaar Card", "PAN Card", "Driving Licence", "Proof Of Address"],
  plans: {
    "own-now": "Pay upfront, then a low daily rent. The car is yours at the end of the term.",
    "drive-to-own": "Pay a refundable deposit, then a daily rent. The car is yours at the end of the term.",
    leasing: "Pay a refundable deposit, then a daily rent. The car stays on rent.",
  },
  faq: [
    { q: "Do I Need My Own Car?", a: "No. We give you the car. You bring your licence and your documents." },
    { q: "When Am I Paid?", a: "Every week, directly to your bank account." },
    { q: "Who Pays For Fuel?", a: "The driver pays for fuel or charging. Insurance and maintenance are covered." },
    { q: "Can I Own The Car?", a: "Yes. On Own Now and Drive To Own, the car is yours at the end of the term." },
  ],
  blog: {
    title: "Driver Guides",
    intro: "Straight answers about renting a car, driving on Uber and what you actually take home.",
    readMore: "Read",
    empty: "No posts yet.",
    back: "All Guides",
    metaDescription: "Guides for drivers on renting a car, earnings, documents and plans across Indian cities.",
  },
  figures: { from: "From", deposit: "Deposit", upfront: "Upfront", term: "Term", months: "{n} Months" },
  common: { languages: "Languages" },
};

const hi: Dictionary = {
  hub: {
    eyebrow: "हमारे साथ चलाइए",
    title: "ड्राइवर की नौकरी, गाड़ी हमारी",
    intro: "Everest Fleet की गाड़ी से Uber चलाइए।",
    pickCity: "अपना शहर चुनिए",
    metaTitle: "Driver Job Chahiye: ड्राइवर की नौकरी, गाड़ी हमारी",
    metaDescription:
      "Driver job chahiye to 7 शहरों में अप्लाई कीजिए: गाड़ी, बीमा और परमिट Everest Fleet का, आप Uber चलाइए। हफ़्ते की पेमेंट।",
  },
  city: {
    title: "{city} में ड्राइवर की नौकरी, गाड़ी हमारी",
    intro: "{city} में Everest Fleet की गाड़ी से Uber चलाइए।",
    jobTitle: "कैब ड्राइवर (Uber)",
    metaTitle: "{city} में ड्राइवर जॉब, Uber के लिए किराए पर गाड़ी",
    metaDescription:
      "{city} में driver job चाहिए तो अप्लाई कीजिए: Uber के लिए किराए पर गाड़ी, वापस मिलने वाला डिपॉज़िट, हर हफ़्ते पेमेंट, हब का पता और ज़रूरी कागज़।",
    readyCars: "{city} में तैयार गाड़ियाँ",
    plansHeading: "{city} के प्लान",
    documentsHeading: "साथ क्या लाना है",
    faqHeading: "ड्राइवर यह पूछते हैं",
    hubsHeading: "{city} के हब",
    map: "मैप",
    otherCities: "दूसरे शहर",
  },
  cta: {
    apply: "अभी अप्लाई करें",
    call: "कॉल करें",
    whatsapp: "WhatsApp",
    formTitle: "30 सेकंड में अप्लाई कीजिए",
    formNote: "हम आपको कॉल करेंगे।",
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
  plans: {
    "own-now": "पहले शुरुआती रकम, फिर कम रोज़ का किराया। अवधि पूरी होने पर गाड़ी आपकी।",
    "drive-to-own": "वापस मिलने वाला डिपॉज़िट, फिर रोज़ का किराया। अवधि पूरी होने पर गाड़ी आपकी।",
    leasing: "वापस मिलने वाला डिपॉज़िट, फिर रोज़ का किराया। गाड़ी किराए पर ही रहती है।",
  },
  faq: [
    { q: "क्या अपनी गाड़ी चाहिए?", a: "नहीं। गाड़ी हम देते हैं। आप अपना लाइसेंस और कागज़ लाइए।" },
    { q: "पेमेंट कब मिलती है?", a: "हर हफ़्ते, सीधे आपके बैंक खाते में।" },
    { q: "ईंधन का खर्च कौन उठाता है?", a: "ईंधन या चार्जिंग का खर्च ड्राइवर का होता है। बीमा और मेंटेनेंस हमारा।" },
    { q: "क्या गाड़ी मेरी हो सकती है?", a: "हाँ। Own Now और Drive To Own प्लान में अवधि पूरी होने पर गाड़ी आपके नाम हो जाती है।" },
  ],
  blog: {
    title: "ड्राइवर गाइड",
    intro: "गाड़ी किराए पर लेने, Uber चलाने और असल में कितना बचता है, इसके सीधे जवाब।",
    readMore: "पढ़िए",
    empty: "अभी कोई लेख नहीं।",
    back: "सभी गाइड",
    metaDescription: "गाड़ी किराए पर लेने, कमाई, कागज़ात और प्लान के बारे में ड्राइवरों के लिए गाइड।",
  },
  figures: { from: "किराया", deposit: "डिपॉज़िट", upfront: "शुरुआती रकम", term: "अवधि", months: "{n} महीने" },
  common: { languages: "भाषाएँ" },
};

const te: Dictionary = {
  hub: {
    eyebrow: "మాతో నడపండి",
    title: "కారుతో సహా డ్రైవర్ ఉద్యోగాలు",
    intro: "Everest Fleet కారుతో Uber నడపండి.",
    pickCity: "మీ నగరాన్ని ఎంచుకోండి",
    metaTitle: "Driver Job: 7 నగరాల్లో డ్రైవర్ ఉద్యోగాలు, కారు మాది",
    metaDescription:
      "ఏడు నగరాల్లో క్యాబ్ డ్రైవర్ ఉద్యోగం: కారు, బీమా మరియు పర్మిట్ Everest Fleet ఇస్తుంది, మీరు Uber నడపండి. వారానికి చెల్లింపు.",
  },
  city: {
    title: "{city} లో డ్రైవర్ ఉద్యోగం, కారు మాది",
    intro: "{city} లో Everest Fleet కారుతో Uber నడపండి.",
    jobTitle: "క్యాబ్ డ్రైవర్ (Uber)",
    metaTitle: "{city} లో డ్రైవర్ జాబ్, Uber కోసం అద్దెకు కారు",
    metaDescription:
      "{city} లో క్యాబ్ డ్రైవర్ ఉద్యోగానికి దరఖాస్తు చేయండి: Uber కోసం అద్దెకు కారు, తిరిగి ఇచ్చే డిపాజిట్, వారానికి చెల్లింపు, హబ్ చిరునామాలు మరియు కావలసిన పత్రాలు.",
    readyCars: "{city} లో సిద్ధంగా ఉన్న కార్లు",
    plansHeading: "{city} లో ప్లాన్లు",
    documentsHeading: "ఏమి తీసుకురావాలి",
    faqHeading: "డ్రైవర్లు అడిగే ప్రశ్నలు",
    hubsHeading: "{city} లో హబ్‌లు",
    map: "మ్యాప్",
    otherCities: "ఇతర నగరాలు",
  },
  cta: {
    apply: "ఇప్పుడే దరఖాస్తు చేయండి",
    call: "కాల్ చేయండి",
    whatsapp: "WhatsApp",
    formTitle: "30 సెకన్లలో దరఖాస్తు",
    formNote: "మేము మీకు కాల్ చేస్తాము.",
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
  plans: {
    "own-now": "మొదట ముందస్తు మొత్తం, తర్వాత తక్కువ రోజువారీ అద్దె. గడువు చివర కారు మీదే.",
    "drive-to-own": "తిరిగి ఇచ్చే డిపాజిట్, తర్వాత రోజువారీ అద్దె. గడువు చివర కారు మీదే.",
    leasing: "తిరిగి ఇచ్చే డిపాజిట్, తర్వాత రోజువారీ అద్దె. కారు అద్దెలోనే ఉంటుంది.",
  },
  faq: [
    { q: "సొంత కారు కావాలా?", a: "అవసరం లేదు. కారు మేము ఇస్తాము. మీరు లైసెన్స్ మరియు పత్రాలు తీసుకురండి." },
    { q: "చెల్లింపు ఎప్పుడు?", a: "ప్రతి వారం, నేరుగా మీ బ్యాంక్ ఖాతాకు." },
    { q: "ఇంధనం ఖర్చు ఎవరిది?", a: "ఇంధనం లేదా ఛార్జింగ్ ఖర్చు డ్రైవర్‌ది. బీమా మరియు మెయింటెనెన్స్ మాది." },
    { q: "కారు నాది అవుతుందా?", a: "అవును. Own Now మరియు Drive To Own ప్లాన్‌లలో గడువు పూర్తయ్యాక కారు మీ పేరు మీదకు వస్తుంది." },
  ],
  blog: {
    title: "డ్రైవర్ గైడ్‌లు",
    intro: "కారు అద్దెకు తీసుకోవడం, Uber నడపడం మరియు నిజంగా ఎంత మిగులుతుంది అనే వాటికి సూటి సమాధానాలు.",
    readMore: "చదవండి",
    empty: "ఇంకా వ్యాసాలు లేవు.",
    back: "అన్ని గైడ్‌లు",
    metaDescription: "కారు అద్దె, సంపాదన, పత్రాలు మరియు ప్లాన్ల గురించి డ్రైవర్ల కోసం గైడ్‌లు.",
  },
  figures: { from: "అద్దె", deposit: "డిపాజిట్", upfront: "ముందస్తు మొత్తం", term: "వ్యవధి", months: "{n} నెలలు" },
  common: { languages: "భాషలు" },
};

const mr: Dictionary = {
  hub: {
    eyebrow: "आमच्यासोबत चालवा",
    title: "ड्रायव्हरची नोकरी, गाडी आमची",
    intro: "Everest Fleet च्या गाडीने Uber चालवा.",
    pickCity: "तुमचे शहर निवडा",
    metaTitle: "Driver Job: 7 शहरांत ड्रायव्हरची नोकरी, गाडी आमची",
    metaDescription:
      "मुंबई, पुणे आणि आणखी 5 शहरांत कॅब ड्रायव्हरच्या नोकरीसाठी अर्ज करा: गाडी, विमा आणि परमिट Everest Fleet चे, तुम्ही Uber चालवा, पेमेंट दर आठवड्याला.",
  },
  city: {
    title: "{city} मध्ये ड्रायव्हरची नोकरी, गाडी आमची",
    intro: "{city} मध्ये Everest Fleet च्या गाडीने Uber चालवा.",
    jobTitle: "कॅब ड्रायव्हर (Uber)",
    metaTitle: "{city} मध्ये ड्रायव्हर जॉब, Uber साठी भाड्याने गाडी",
    metaDescription:
      "{city} मध्ये कॅब ड्रायव्हरच्या नोकरीसाठी अर्ज करा: Uber साठी भाड्याने गाडी, परत मिळणारे डिपॉझिट, दर आठवड्याला पेमेंट, हबचे पत्ते आणि लागणारी कागदपत्रे.",
    readyCars: "{city} मध्ये तयार गाड्या",
    plansHeading: "{city} मधील प्लॅन",
    documentsHeading: "सोबत काय आणायचे",
    faqHeading: "ड्रायव्हर हे विचारतात",
    hubsHeading: "{city} मधील हब",
    map: "नकाशा",
    otherCities: "इतर शहरे",
  },
  cta: {
    apply: "आत्ताच अर्ज करा",
    call: "कॉल करा",
    whatsapp: "WhatsApp",
    formTitle: "30 सेकंदांत अर्ज करा",
    formNote: "आम्ही तुम्हाला कॉल करू.",
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
  plans: {
    "own-now": "आधी सुरुवातीची रक्कम, मग कमी रोजचे भाडे. मुदतीअखेर गाडी तुमची.",
    "drive-to-own": "परत मिळणारे डिपॉझिट, मग रोजचे भाडे. मुदतीअखेर गाडी तुमची.",
    leasing: "परत मिळणारे डिपॉझिट, मग रोजचे भाडे. गाडी भाड्यानेच राहते.",
  },
  faq: [
    { q: "स्वतःची गाडी लागते का?", a: "नाही. गाडी आम्ही देतो. तुम्ही तुमचे लायसन्स आणि कागदपत्रे आणा." },
    { q: "पेमेंट कधी मिळते?", a: "दर आठवड्याला, थेट तुमच्या बँक खात्यात." },
    { q: "इंधनाचा खर्च कोण करतो?", a: "इंधन किंवा चार्जिंगचा खर्च ड्रायव्हरचा असतो. विमा आणि देखभाल आमची." },
    { q: "गाडी माझी होऊ शकते का?", a: "हो. Own Now आणि Drive To Own प्लॅनमध्ये मुदत पूर्ण झाल्यावर गाडी तुमच्या नावावर होते." },
  ],
  blog: {
    title: "ड्रायव्हर गाइड",
    intro: "गाडी भाड्याने घेणे, Uber चालवणे आणि खरंच किती हातात उरते, याची सरळ उत्तरे.",
    readMore: "वाचा",
    empty: "अजून एकही लेख नाही.",
    back: "सर्व गाइड",
    metaDescription: "गाडी भाड्याने घेणे, कमाई, कागदपत्रे आणि प्लॅनबद्दल ड्रायव्हरसाठी गाइड.",
  },
  figures: { from: "भाडे", deposit: "डिपॉझिट", upfront: "सुरुवातीची रक्कम", term: "कालावधी", months: "{n} महिने" },
  common: { languages: "भाषा" },
};

const kn: Dictionary = {
  hub: {
    eyebrow: "ನಮ್ಮೊಂದಿಗೆ ಓಡಿಸಿ",
    title: "ಕಾರಿನ ಜೊತೆಗೆ ಡ್ರೈವರ್ ಕೆಲಸ",
    intro: "Everest Fleet ಕಾರಿನಲ್ಲಿ Uber ಓಡಿಸಿ.",
    pickCity: "ನಿಮ್ಮ ನಗರವನ್ನು ಆರಿಸಿ",
    metaTitle: "Driver Job: 7 ನಗರಗಳಲ್ಲಿ ಡ್ರೈವರ್ ಕೆಲಸ, ಕಾರು ನಮ್ಮದು",
    metaDescription:
      "ಬೆಂಗಳೂರು ಸೇರಿದಂತೆ 7 ನಗರಗಳಲ್ಲಿ ಕ್ಯಾಬ್ ಡ್ರೈವರ್ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಹಾಕಿ: ಕಾರು, ವಿಮೆ ಮತ್ತು ಪರ್ಮಿಟ್ Everest Fleet ನದು, ನೀವು Uber ಓಡಿಸಿ, ಪಾವತಿ ಪ್ರತಿ ವಾರ.",
  },
  city: {
    title: "{city} ನಗರದಲ್ಲಿ ಡ್ರೈವರ್ ಕೆಲಸ, ಕಾರು ನಮ್ಮದು",
    intro: "{city} ನಗರದಲ್ಲಿ Everest Fleet ಕಾರಿನಲ್ಲಿ Uber ಓಡಿಸಿ.",
    jobTitle: "ಕ್ಯಾಬ್ ಡ್ರೈವರ್ (Uber)",
    metaTitle: "{city} ನಗರದಲ್ಲಿ ಡ್ರೈವರ್ ಜಾಬ್, Uber ಗಾಗಿ ಬಾಡಿಗೆ ಕಾರು",
    metaDescription:
      "{city} ನಗರದಲ್ಲಿ ಕ್ಯಾಬ್ ಡ್ರೈವರ್ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಹಾಕಿ: Uber ಗಾಗಿ ಬಾಡಿಗೆ ಕಾರು, ಹಿಂತಿರುಗಿಸುವ ಠೇವಣಿ, ಪ್ರತಿ ವಾರ ಪಾವತಿ, ಹಬ್ ವಿಳಾಸಗಳು ಮತ್ತು ಬೇಕಾದ ದಾಖಲೆಗಳು.",
    readyCars: "{city} ನಗರದಲ್ಲಿ ಸಿದ್ಧವಿರುವ ಕಾರುಗಳು",
    plansHeading: "{city} ನಗರದ ಪ್ಲಾನ್‌ಗಳು",
    documentsHeading: "ಏನು ತರಬೇಕು",
    faqHeading: "ಡ್ರೈವರ್‌ಗಳು ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು",
    hubsHeading: "{city} ನಗರದ ಹಬ್‌ಗಳು",
    map: "ನಕ್ಷೆ",
    otherCities: "ಇತರ ನಗರಗಳು",
  },
  cta: {
    apply: "ಈಗಲೇ ಅರ್ಜಿ ಹಾಕಿ",
    call: "ಕರೆ ಮಾಡಿ",
    whatsapp: "WhatsApp",
    formTitle: "30 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಅರ್ಜಿ",
    formNote: "ನಾವು ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತೇವೆ.",
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
  plans: {
    "own-now": "ಮೊದಲು ಆರಂಭಿಕ ಮೊತ್ತ, ನಂತರ ಕಡಿಮೆ ದಿನದ ಬಾಡಿಗೆ. ಅವಧಿಯ ಕೊನೆಗೆ ಕಾರು ನಿಮ್ಮದು.",
    "drive-to-own": "ಹಿಂತಿರುಗಿಸುವ ಠೇವಣಿ, ನಂತರ ದಿನದ ಬಾಡಿಗೆ. ಅವಧಿಯ ಕೊನೆಗೆ ಕಾರು ನಿಮ್ಮದು.",
    leasing: "ಹಿಂತಿರುಗಿಸುವ ಠೇವಣಿ, ನಂತರ ದಿನದ ಬಾಡಿಗೆ. ಕಾರು ಬಾಡಿಗೆಯಲ್ಲೇ ಇರುತ್ತದೆ.",
  },
  faq: [
    { q: "ಸ್ವಂತ ಕಾರು ಬೇಕೇ?", a: "ಬೇಡ. ಕಾರು ನಾವು ಕೊಡುತ್ತೇವೆ. ನೀವು ಲೈಸೆನ್ಸ್ ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ತನ್ನಿ." },
    { q: "ಪಾವತಿ ಯಾವಾಗ?", a: "ಪ್ರತಿ ವಾರ, ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ." },
    { q: "ಇಂಧನದ ಖರ್ಚು ಯಾರದು?", a: "ಇಂಧನ ಅಥವಾ ಚಾರ್ಜಿಂಗ್ ಖರ್ಚು ಡ್ರೈವರ್‌ದು. ವಿಮೆ ಮತ್ತು ನಿರ್ವಹಣೆ ನಮ್ಮದು." },
    { q: "ಕಾರು ನನ್ನದಾಗಬಹುದೇ?", a: "ಹೌದು. Own Now ಮತ್ತು Drive To Own ಪ್ಲಾನ್‌ಗಳಲ್ಲಿ ಅವಧಿ ಮುಗಿದ ನಂತರ ಕಾರು ನಿಮ್ಮ ಹೆಸರಿಗೆ ಬರುತ್ತದೆ." },
  ],
  blog: {
    title: "ಡ್ರೈವರ್ ಗೈಡ್‌ಗಳು",
    intro: "ಕಾರು ಬಾಡಿಗೆಗೆ ಪಡೆಯುವುದು, Uber ಓಡಿಸುವುದು ಮತ್ತು ನಿಜವಾಗಿ ಎಷ್ಟು ಉಳಿಯುತ್ತದೆ ಎಂಬುದಕ್ಕೆ ನೇರ ಉತ್ತರಗಳು.",
    readMore: "ಓದಿ",
    empty: "ಇನ್ನೂ ಯಾವುದೇ ಲೇಖನಗಳಿಲ್ಲ.",
    back: "ಎಲ್ಲಾ ಗೈಡ್‌ಗಳು",
    metaDescription: "ಕಾರು ಬಾಡಿಗೆ, ಗಳಿಕೆ, ದಾಖಲೆಗಳು ಮತ್ತು ಪ್ಲಾನ್‌ಗಳ ಬಗ್ಗೆ ಡ್ರೈವರ್‌ಗಳಿಗಾಗಿ ಗೈಡ್‌ಗಳು.",
  },
  figures: { from: "ಬಾಡಿಗೆ", deposit: "ಠೇವಣಿ", upfront: "ಆರಂಭಿಕ ಮೊತ್ತ", term: "ಅವಧಿ", months: "{n} ತಿಂಗಳು" },
  common: { languages: "ಭಾಷೆಗಳು" },
};

const bn: Dictionary = {
  hub: {
    eyebrow: "আমাদের সঙ্গে চালান",
    title: "গাড়ি সহ ড্রাইভারের চাকরি",
    intro: "Everest Fleet-এর গাড়িতে Uber চালান।",
    pickCity: "আপনার শহর বেছে নিন",
    metaTitle: "Driver Job: 7টি শহরে ড্রাইভারের চাকরি, গাড়ি আমাদের",
    metaDescription:
      "কলকাতা সহ 7টি শহরে ক্যাব ড্রাইভারের চাকরির জন্য আবেদন করুন: গাড়ি, বিমা আর পারমিট Everest Fleet-এর, আপনি Uber চালান, পেমেন্ট প্রতি সপ্তাহে।",
  },
  city: {
    title: "{city} শহরে ড্রাইভারের চাকরি, গাড়ি আমাদের",
    intro: "{city} শহরে Everest Fleet-এর গাড়িতে Uber চালান।",
    jobTitle: "ক্যাব ড্রাইভার (Uber)",
    metaTitle: "{city} শহরে ড্রাইভার জব, Uber-এর জন্য ভাড়ায় গাড়ি",
    metaDescription:
      "{city} শহরে ক্যাব ড্রাইভারের চাকরির জন্য আবেদন করুন: Uber-এর জন্য ভাড়ায় গাড়ি, ফেরতযোগ্য ডিপোজিট, প্রতি সপ্তাহে পেমেন্ট, হাবের ঠিকানা আর দরকারি কাগজপত্র।",
    readyCars: "{city} শহরে তৈরি গাড়ি",
    plansHeading: "{city} শহরের প্ল্যান",
    documentsHeading: "সঙ্গে কী আনবেন",
    faqHeading: "ড্রাইভাররা যা জানতে চান",
    hubsHeading: "{city} শহরের হাব",
    map: "ম্যাপ",
    otherCities: "অন্যান্য শহর",
  },
  cta: {
    apply: "এখনই আবেদন করুন",
    call: "কল করুন",
    whatsapp: "WhatsApp",
    formTitle: "30 সেকেন্ডে আবেদন করুন",
    formNote: "আমরা আপনাকে কল করব।",
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
  plans: {
    "own-now": "প্রথমে শুরুর টাকা, তারপর কম রোজের ভাড়া। মেয়াদ শেষে গাড়ি আপনার।",
    "drive-to-own": "ফেরতযোগ্য ডিপোজিট, তারপর রোজের ভাড়া। মেয়াদ শেষে গাড়ি আপনার।",
    leasing: "ফেরতযোগ্য ডিপোজিট, তারপর রোজের ভাড়া। গাড়ি ভাড়াতেই থাকে।",
  },
  faq: [
    { q: "নিজের গাড়ি লাগবে?", a: "না। গাড়ি আমরা দিই। আপনি লাইসেন্স আর কাগজপত্র আনুন।" },
    { q: "পেমেন্ট কবে পাব?", a: "প্রতি সপ্তাহে, সরাসরি আপনার ব্যাংক অ্যাকাউন্টে।" },
    { q: "জ্বালানির খরচ কে দেয়?", a: "জ্বালানি বা চার্জিংয়ের খরচ ড্রাইভারের। বিমা আর রক্ষণাবেক্ষণ আমাদের।" },
    { q: "গাড়ি কি আমার হতে পারে?", a: "হ্যাঁ। Own Now আর Drive To Own প্ল্যানে মেয়াদ শেষে গাড়ি আপনার নামে হয়ে যায়।" },
  ],
  blog: {
    title: "ড্রাইভার গাইড",
    intro: "গাড়ি ভাড়া নেওয়া, Uber চালানো আর আসলে কত হাতে থাকে, তার সোজা উত্তর।",
    readMore: "পড়ুন",
    empty: "এখনও কোনো লেখা নেই।",
    back: "সব গাইড",
    metaDescription: "গাড়ি ভাড়া, আয়, কাগজপত্র আর প্ল্যান নিয়ে ড্রাইভারদের জন্য গাইড।",
  },
  figures: { from: "ভাড়া", deposit: "ডিপোজিট", upfront: "শুরুর টাকা", term: "মেয়াদ", months: "{n} মাস" },
  common: { languages: "ভাষা" },
};

const ta: Dictionary = {
  hub: {
    eyebrow: "எங்களுடன் ஓட்டுங்கள்",
    title: "காருடன் டிரைவர் வேலை",
    intro: "Everest Fleet காரில் Uber ஓட்டுங்கள்.",
    pickCity: "உங்கள் நகரத்தைத் தேர்ந்தெடுங்கள்",
    metaTitle: "Driver Job: 7 நகரங்களில் டிரைவர் வேலை, கார் எங்களுடையது",
    metaDescription:
      "சென்னை உட்பட 7 நகரங்களில் கேப் டிரைவர் வேலைக்கு விண்ணப்பியுங்கள்: கார், காப்பீடு மற்றும் பெர்மிட் Everest Fleet-உடையது, நீங்கள் Uber ஓட்டுங்கள், பணம் ஒவ்வொரு வாரமும்.",
  },
  city: {
    title: "{city} நகரில் டிரைவர் வேலை, கார் எங்களுடையது",
    intro: "{city} நகரில் Everest Fleet காரில் Uber ஓட்டுங்கள்.",
    jobTitle: "கேப் டிரைவர் (Uber)",
    metaTitle: "{city} நகரில் டிரைவர் வேலை, Uber-க்கு வாடகை கார்",
    metaDescription:
      "{city} நகரில் கேப் டிரைவர் வேலைக்கு விண்ணப்பியுங்கள்: Uber-க்கு வாடகை கார், திரும்பக் கிடைக்கும் டெபாசிட், வாராந்திர பணம், ஹப் முகவரிகள் மற்றும் தேவையான ஆவணங்கள்.",
    readyCars: "{city} நகரில் தயாராக உள்ள கார்கள்",
    plansHeading: "{city} நகரில் திட்டங்கள்",
    documentsHeading: "என்ன கொண்டு வர வேண்டும்",
    faqHeading: "டிரைவர்கள் கேட்கும் கேள்விகள்",
    hubsHeading: "{city} நகரில் ஹப்கள்",
    map: "வரைபடம்",
    otherCities: "மற்ற நகரங்கள்",
  },
  cta: {
    apply: "இப்போதே விண்ணப்பியுங்கள்",
    call: "அழையுங்கள்",
    whatsapp: "WhatsApp",
    formTitle: "30 விநாடிகளில் விண்ணப்பம்",
    formNote: "நாங்கள் உங்களை அழைப்போம்.",
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
  plans: {
    "own-now": "முதலில் முன்பணம், பிறகு குறைந்த தினசரி வாடகை. காலம் முடிவில் கார் உங்களுடையது.",
    "drive-to-own": "திரும்பக் கிடைக்கும் டெபாசிட், பிறகு தினசரி வாடகை. காலம் முடிவில் கார் உங்களுடையது.",
    leasing: "திரும்பக் கிடைக்கும் டெபாசிட், பிறகு தினசரி வாடகை. கார் வாடகையிலேயே இருக்கும்.",
  },
  faq: [
    { q: "சொந்த கார் வேண்டுமா?", a: "வேண்டாம். கார் நாங்கள் தருகிறோம். நீங்கள் உரிமம் மற்றும் ஆவணங்களைக் கொண்டு வாருங்கள்." },
    { q: "பணம் எப்போது கிடைக்கும்?", a: "ஒவ்வொரு வாரமும், நேரடியாக உங்கள் வங்கிக் கணக்கில்." },
    { q: "எரிபொருள் செலவு யாருடையது?", a: "எரிபொருள் அல்லது சார்ஜிங் செலவு டிரைவருடையது. காப்பீடு மற்றும் பராமரிப்பு எங்களுடையது." },
    { q: "கார் என்னுடையதாக ஆகுமா?", a: "ஆம். Own Now மற்றும் Drive To Own திட்டங்களில் காலம் முடிந்ததும் கார் உங்கள் பெயருக்கு மாறும்." },
  ],
  blog: {
    title: "டிரைவர் வழிகாட்டிகள்",
    intro: "கார் வாடகைக்கு எடுப்பது, Uber ஓட்டுவது, உண்மையில் எவ்வளவு மிஞ்சும் என்பதற்கு நேரடி பதில்கள்.",
    readMore: "படியுங்கள்",
    empty: "இன்னும் கட்டுரைகள் இல்லை.",
    back: "அனைத்து வழிகாட்டிகளும்",
    metaDescription: "கார் வாடகை, வருமானம், ஆவணங்கள் மற்றும் திட்டங்கள் பற்றி டிரைவர்களுக்கான வழிகாட்டிகள்.",
  },
  figures: { from: "வாடகை", deposit: "டெபாசிட்", upfront: "முன்பணம்", term: "காலம்", months: "{n} மாதங்கள்" },
  common: { languages: "மொழிகள்" },
};

const DICTIONARIES: Record<Locale, Dictionary> = { en, hi, mr, kn, te, bn, ta };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** fill("{city} में", { city: "मुंबई" }) */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}
