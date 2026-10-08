import type { Locale } from "@/lib/i18n";

/**
 * Section copy for the blog index and article pages, per locale.
 *
 * Headings are written in sentence case; the desktop layout capitalises each word with CSS, as
 * the desktop design does. Every non-English locale PENDING a native speaker's review.
 */
export type BlogCopy = {
  heroTitle: string;
  featuredKicker: string;
  featuredTitle: string;
  readStory: string;
  author: string;
  minRead: (n: number) => string;
  forDrivers: string;
  storiesKicker: string;
  storiesTitle: string;
  storiesSub: string;
  latestKicker: string;
  latestTitle: string;
  loadMore: string;
  guidesKicker: string;
  guidesTitle: string;
  guidesSub: string;
  newsKicker: string;
  newsTitle: string;
  read: string;
  ctaTitle: string;
  ctaSub: string;
  ctaDrive: string;
  ctaTalk: string;
  moreTitle: string;
};

const en: BlogCopy = {
  heroTitle: "Stories From The Road",
  featuredKicker: "Featured",
  featuredTitle: "This Month On The Blog",
  readStory: "Read The Story",
  author: "Team Everest",
  minRead: (n) => `${n} min read`,
  forDrivers: "For Drivers",
  storiesKicker: "Driver Stories",
  storiesTitle: "Drivers Who Made It Work",
  storiesSub: "In their own words, from Everest drivers.",
  latestKicker: "Latest",
  latestTitle: "New On The Blog",
  loadMore: "Load More Posts",
  guidesKicker: "Guides",
  guidesTitle: "Quick Guides For Drivers",
  guidesSub: "Short answers for drivers who are getting started.",
  newsKicker: "In The News",
  newsTitle: "What Others Are Saying",
  read: "Read",
  ctaTitle: "Start Your Journey With Everest",
  ctaSub: "Drive with us, or tell us what your business needs.",
  ctaDrive: "Drive With Us",
  ctaTalk: "Talk To Our Team",
  moreTitle: "More Guides",
};

const hi: BlogCopy = {
  heroTitle: "सड़क से कहानियाँ",
  featuredKicker: "ख़ास",
  featuredTitle: "इस महीने ब्लॉग पर",
  readStory: "पूरा पढ़िए",
  author: "टीम Everest",
  minRead: (n) => `${n} मिनट`,
  forDrivers: "ड्राइवरों के लिए",
  storiesKicker: "ड्राइवरों की कहानियाँ",
  storiesTitle: "जिन ड्राइवरों ने कर दिखाया",
  storiesSub: "Everest ड्राइवरों की ज़ुबानी।",
  latestKicker: "नया",
  latestTitle: "ब्लॉग पर नया",
  loadMore: "और लेख देखिए",
  guidesKicker: "गाइड",
  guidesTitle: "ड्राइवरों के लिए छोटी गाइड",
  guidesSub: "शुरुआत करने वाले ड्राइवरों के लिए सीधे जवाब।",
  newsKicker: "ख़बरों में",
  newsTitle: "दूसरे क्या कह रहे हैं",
  read: "पढ़िए",
  ctaTitle: "Everest के साथ शुरुआत कीजिए",
  ctaSub: "हमारे साथ गाड़ी चलाइए, या अपने बिज़नेस की ज़रूरत बताइए।",
  ctaDrive: "हमारे साथ चलाइए",
  ctaTalk: "हमारी टीम से बात कीजिए",
  moreTitle: "और गाइड",
};

const te: BlogCopy = {
  heroTitle: "రోడ్డు మీది కథలు",
  featuredKicker: "ప్రత్యేకం",
  featuredTitle: "ఈ నెల బ్లాగ్‌లో",
  readStory: "పూర్తిగా చదవండి",
  author: "టీమ్ Everest",
  minRead: (n) => `${n} నిమిషాలు`,
  forDrivers: "డ్రైవర్ల కోసం",
  storiesKicker: "డ్రైవర్ల కథలు",
  storiesTitle: "సాధించి చూపిన డ్రైవర్లు",
  storiesSub: "Everest డ్రైవర్ల మాటల్లోనే.",
  latestKicker: "కొత్తవి",
  latestTitle: "బ్లాగ్‌లో కొత్తవి",
  loadMore: "మరిన్ని వ్యాసాలు",
  guidesKicker: "గైడ్‌లు",
  guidesTitle: "డ్రైవర్ల కోసం చిన్న గైడ్‌లు",
  guidesSub: "కొత్తగా మొదలుపెడుతున్న డ్రైవర్లకు సూటి సమాధానాలు.",
  newsKicker: "వార్తల్లో",
  newsTitle: "ఇతరులు ఏమంటున్నారు",
  read: "చదవండి",
  ctaTitle: "Everest తో మీ ప్రయాణం మొదలుపెట్టండి",
  ctaSub: "మాతో కారు నడపండి, లేదా మీ వ్యాపార అవసరం చెప్పండి.",
  ctaDrive: "మాతో నడపండి",
  ctaTalk: "మా టీమ్‌తో మాట్లాడండి",
  moreTitle: "మరిన్ని గైడ్‌లు",
};

const mr: BlogCopy = {
  heroTitle: "रस्त्यावरच्या गोष्टी",
  featuredKicker: "खास",
  featuredTitle: "या महिन्यात ब्लॉगवर",
  readStory: "पूर्ण वाचा",
  author: "टीम Everest",
  minRead: (n) => `${n} मिनिटे`,
  forDrivers: "ड्रायव्हरसाठी",
  storiesKicker: "ड्रायव्हरच्या गोष्टी",
  storiesTitle: "ज्या ड्रायव्हरनी करून दाखवले",
  storiesSub: "Everest ड्रायव्हरच्या शब्दांत.",
  latestKicker: "नवीन",
  latestTitle: "ब्लॉगवर नवीन",
  loadMore: "आणखी लेख पाहा",
  guidesKicker: "गाइड",
  guidesTitle: "ड्रायव्हरसाठी छोटे गाइड",
  guidesSub: "सुरुवात करणाऱ्या ड्रायव्हरसाठी सरळ उत्तरे.",
  newsKicker: "बातम्यांमध्ये",
  newsTitle: "इतर काय म्हणतात",
  read: "वाचा",
  ctaTitle: "Everest सोबत सुरुवात करा",
  ctaSub: "आमच्यासोबत गाडी चालवा, किंवा तुमच्या व्यवसायाची गरज सांगा.",
  ctaDrive: "आमच्यासोबत चालवा",
  ctaTalk: "आमच्या टीमशी बोला",
  moreTitle: "आणखी गाइड",
};

const kn: BlogCopy = {
  heroTitle: "ರಸ್ತೆಯ ಕಥೆಗಳು",
  featuredKicker: "ವಿಶೇಷ",
  featuredTitle: "ಈ ತಿಂಗಳು ಬ್ಲಾಗ್‌ನಲ್ಲಿ",
  readStory: "ಪೂರ್ತಿ ಓದಿ",
  author: "ಟೀಮ್ Everest",
  minRead: (n) => `${n} ನಿಮಿಷ`,
  forDrivers: "ಡ್ರೈವರ್‌ಗಳಿಗಾಗಿ",
  storiesKicker: "ಡ್ರೈವರ್‌ಗಳ ಕಥೆಗಳು",
  storiesTitle: "ಸಾಧಿಸಿ ತೋರಿಸಿದ ಡ್ರೈವರ್‌ಗಳು",
  storiesSub: "Everest ಡ್ರೈವರ್‌ಗಳ ಮಾತುಗಳಲ್ಲೇ.",
  latestKicker: "ಹೊಸದು",
  latestTitle: "ಬ್ಲಾಗ್‌ನಲ್ಲಿ ಹೊಸದು",
  loadMore: "ಇನ್ನಷ್ಟು ಲೇಖನಗಳು",
  guidesKicker: "ಗೈಡ್‌ಗಳು",
  guidesTitle: "ಡ್ರೈವರ್‌ಗಳಿಗಾಗಿ ಸಣ್ಣ ಗೈಡ್‌ಗಳು",
  guidesSub: "ಹೊಸದಾಗಿ ಆರಂಭಿಸುವ ಡ್ರೈವರ್‌ಗಳಿಗೆ ನೇರ ಉತ್ತರಗಳು.",
  newsKicker: "ಸುದ್ದಿಯಲ್ಲಿ",
  newsTitle: "ಇತರರು ಏನು ಹೇಳುತ್ತಿದ್ದಾರೆ",
  read: "ಓದಿ",
  ctaTitle: "Everest ಜೊತೆ ನಿಮ್ಮ ಪಯಣ ಆರಂಭಿಸಿ",
  ctaSub: "ನಮ್ಮೊಂದಿಗೆ ಕಾರು ಓಡಿಸಿ, ಅಥವಾ ನಿಮ್ಮ ವ್ಯವಹಾರದ ಅಗತ್ಯ ತಿಳಿಸಿ.",
  ctaDrive: "ನಮ್ಮೊಂದಿಗೆ ಓಡಿಸಿ",
  ctaTalk: "ನಮ್ಮ ತಂಡದೊಂದಿಗೆ ಮಾತನಾಡಿ",
  moreTitle: "ಇನ್ನಷ್ಟು ಗೈಡ್‌ಗಳು",
};

const bn: BlogCopy = {
  heroTitle: "রাস্তার গল্প",
  featuredKicker: "বিশেষ",
  featuredTitle: "এই মাসে ব্লগে",
  readStory: "পুরোটা পড়ুন",
  author: "টিম Everest",
  minRead: (n) => `${n} মিনিট`,
  forDrivers: "ড্রাইভারদের জন্য",
  storiesKicker: "ড্রাইভারদের গল্প",
  storiesTitle: "যে ড্রাইভাররা করে দেখিয়েছেন",
  storiesSub: "Everest ড্রাইভারদের নিজেদের কথায়।",
  latestKicker: "নতুন",
  latestTitle: "ব্লগে নতুন",
  loadMore: "আরও লেখা দেখুন",
  guidesKicker: "গাইড",
  guidesTitle: "ড্রাইভারদের জন্য ছোট গাইড",
  guidesSub: "নতুন শুরু করা ড্রাইভারদের জন্য সোজা উত্তর।",
  newsKicker: "খবরে",
  newsTitle: "অন্যরা কী বলছেন",
  read: "পড়ুন",
  ctaTitle: "Everest-এর সঙ্গে শুরু করুন",
  ctaSub: "আমাদের সঙ্গে গাড়ি চালান, বা আপনার ব্যবসার প্রয়োজন জানান।",
  ctaDrive: "আমাদের সঙ্গে চালান",
  ctaTalk: "আমাদের টিমের সঙ্গে কথা বলুন",
  moreTitle: "আরও গাইড",
};

const ta: BlogCopy = {
  heroTitle: "சாலையிலிருந்து கதைகள்",
  featuredKicker: "சிறப்பு",
  featuredTitle: "இந்த மாதம் வலைப்பதிவில்",
  readStory: "முழுவதும் படியுங்கள்",
  author: "டீம் Everest",
  minRead: (n) => `${n} நிமிடம்`,
  forDrivers: "டிரைவர்களுக்கு",
  storiesKicker: "டிரைவர்களின் கதைகள்",
  storiesTitle: "சாதித்துக் காட்டிய டிரைவர்கள்",
  storiesSub: "Everest டிரைவர்களின் சொந்த வார்த்தைகளில்.",
  latestKicker: "புதியவை",
  latestTitle: "வலைப்பதிவில் புதியவை",
  loadMore: "மேலும் கட்டுரைகள்",
  guidesKicker: "வழிகாட்டிகள்",
  guidesTitle: "டிரைவர்களுக்கான சிறு வழிகாட்டிகள்",
  guidesSub: "புதிதாகத் தொடங்கும் டிரைவர்களுக்கு நேரடி பதில்கள்.",
  newsKicker: "செய்திகளில்",
  newsTitle: "மற்றவர்கள் என்ன சொல்கிறார்கள்",
  read: "படியுங்கள்",
  ctaTitle: "Everest உடன் உங்கள் பயணத்தைத் தொடங்குங்கள்",
  ctaSub: "எங்களுடன் கார் ஓட்டுங்கள், அல்லது உங்கள் வணிகத் தேவையைச் சொல்லுங்கள்.",
  ctaDrive: "எங்களுடன் ஓட்டுங்கள்",
  ctaTalk: "எங்கள் குழுவுடன் பேசுங்கள்",
  moreTitle: "மேலும் வழிகாட்டிகள்",
};

const COPY: Record<Locale, BlogCopy> = { en, hi, mr, kn, te, bn, ta };

export function blogCopy(locale: Locale): BlogCopy {
  return COPY[locale];
}
