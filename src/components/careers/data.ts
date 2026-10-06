/**
 * Everything on the Careers page that someone may need to change: where "Explore jobs" goes,
 * the benefits and the employee videos. Openings are listed on LinkedIn, so the page carries
 * no job list of its own.
 */

export const JOBS_URL = "https://www.linkedin.com/company/everest-fleet-pvt-ltd/jobs/";
export const LINKEDIN_URL = "https://www.linkedin.com/company/everest-fleet-pvt-ltd/";
export const VALUES_HREF = "/about-us/";

/** The seven values, one tile per letter. */
export const IMPACTT: { letter: string; tone: string }[] = [
  { letter: "I", tone: "bg-brand text-white" },
  { letter: "M", tone: "bg-brand text-white" },
  { letter: "P", tone: "bg-plum text-white" },
  { letter: "A", tone: "bg-plum text-white" },
  { letter: "C", tone: "bg-lime text-navy" },
  { letter: "T", tone: "bg-sun text-navy" },
  { letter: "T", tone: "bg-sun text-navy" },
];

export const BENEFITS = [
  {
    title: "JIFY",
    image: "/figma/careers/benefit-jify.webp",
    imagePhone: "/figma/careers/benefit-jify-mobile.webp",
    tone: "bg-[#052c4d]",
    body: "We believe in empowering our employees beyond the traditional norms. Introducing a groundbreaking initiative that puts financial control directly into your hands – the ability to access a portion of your salary in advance, making salary disbursement a breeze in times of need.",
  },
  {
    title: "Loan",
    image: "/figma/careers/benefit-loan.webp",
    imagePhone: "/figma/careers/benefit-loan-mobile.webp",
    tone: "bg-[#0c3873]",
    body: "Your financial ease, our priority for your unexpected needs, we’ve got you covered. In partnership with Entitled, our employees can secure a loan up to 1 Lakh within 48 hours at a flat 1.5% monthly interest rate. Your financial ease, our priority.",
  },
  {
    title: "Doctor On Call",
    image: "/figma/careers/benefit-ekure.webp",
    imagePhone: "/figma/careers/benefit-ekure-mobile.webp",
    tone: "bg-[#385973]",
    body: "We prioritize the health and well-being of our valued employees. Our employee’s well-being is our top priority, beyond being a benefit, it’s our unwavering commitment to ensure our employee’s health and happiness always come first.",
  },
];

/** Interviews on the company YouTube channel, in the order the design shows them. */
export const VIDEOS = [
  { id: "dqM7YpRCqsA", name: "Rashid Shaikh, Operations Manager", image: "/figma/careers/video-rashid.webp" },
  { id: "8yZV6g2UpqE", name: "Awadhesh Yaduvanshi, City Lead", image: "/figma/careers/video-awadhesh.webp" },
  { id: "naV2lSpkLOQ", name: "Sagar Moondra, Founder’s Office", image: "/figma/careers/video-sagar.webp" },
];
