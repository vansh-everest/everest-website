import type { Hub, SiteContent } from "@/lib/content";

/**
 * Every city's hubs as the city pages list them. Source: Everest's Google Business Profile sheet
 * ("My Business page - EF", last updated 21 Jul 2025): name, fuel, address, hours and the link to
 * the hub's Google page. Hubs Jarvis lists that the sheet has no address for are added after the
 * sheet's, with Jarvis's address and map link (marked below). Rows with no address anywhere
 * (Sector 8 Rohini, Chennai EV Auto) are left out.
 *
 * This list stands in for Jarvis's hubs and the admin's; edit it here when a hub opens, moves or closes.
 */
const MAPS = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const HUBS: Record<string, Hub[]> = {
  mumbai: [
    {
      name: "Thane",
      fuel: "CNG",
      address: "F-R-4, 4th Floor, Korum Mall, Eastern Express Highway, Shahid Mangal Pandey Rd, Samata Nagar, Thane West, Maharashtra 400606",
      hours: "8am–8pm",
      daily: true,
      mapUrl: "https://g.co/kgs/ZF2CGFk",
    },
    {
      name: "Goregaon",
      fuel: "CNG + EV",
      address: "Lot 603, BMC/MCGM Public Parking, 1st Floor, opp. Romell Aether, Goregaon, Mumbai, Maharashtra 400063",
      hours: "9:30am–6:30pm",
      daily: true,
      mapUrl: "https://g.co/kgs/uJn2r3h",
    },
    {
      name: "Vasai",
      fuel: "CNG",
      address: "Plot 82/2C, Sativali Rd, near Shailesh Industrial Estate, Tarke Nagar, Golani Naka, Vasai East, Waliv, Vasai-Virar, Maharashtra 401208",
      hours: "8am–8pm",
      daily: true,
      mapUrl: "https://g.co/kgs/C6Bb2ga",
    },
    {
      name: "Kopar Khairane",
      fuel: "CNG",
      address: "32RC+35G, C-13, TTC Industrial Estate MIDC, Pawne, Kopar Khairane, Navi Mumbai, Maharashtra 400705",
      hours: "9:30am–6:30pm",
      daily: true,
      mapUrl: "https://g.co/kgs/L9Adr1S",
    },
    {
      name: "Lower Parel",
      fuel: "EV",
      address: "The Park, Lodha Parkside, Lower Parel, Mumbai, Maharashtra 400013",
      hours: "24 hours",
      daily: true,
      mapUrl: "https://g.co/kgs/n5BEhJm",
    },
    {
      name: "Chunabhatti",
      fuel: "CNG",
      address: "Jogani Industrial Estate, Vama Complex, VN Purav Marg, beside Hyundai showroom, ATI Staff CHS, Chunabhatti, Sion, Mumbai, Maharashtra 400022",
      hours: "9am–6pm",
      daily: true,
      mapUrl: "https://g.co/kgs/nEDBi6C",
    },
    // Jarvis only.
    {
      name: "Ghatkopar",
      address: "BMC Parking 1, The Address by Wadhwa Groups, Lal Bahadur Shastri Marg, opposite R City Mall, Godrej & Boyce Industry Estate, Vikhroli West, Mumbai, Maharashtra 400086",
      hours: "",
      mapUrl: "https://maps.app.goo.gl/jYbEAc5dBbb7Lc6X7",
    },
  ],
  pune: [
    {
      name: "Sus",
      fuel: "CNG",
      address: "HQ27+M5R, Sus, Pune, Maharashtra 411021",
      hours: "10am–6pm",
      mapUrl: "https://g.co/kgs/kgBdN6U",
    },
    {
      name: "Hadapsar",
      fuel: "CNG",
      address: "Leela Grandeur, Laxmi Colony, Hadapsar, Pune, Maharashtra 412307",
      hours: "9:30am–6:30pm",
      mapUrl: "https://g.co/kgs/2oe29RH",
    },
  ],
  delhi: [
    {
      name: "Gurugram Sector 17",
      fuel: "CNG",
      address: "Sukhrali Enclave, Sector 17, Gurugram, Haryana 122001",
      hours: "9am–7pm",
      mapUrl: "https://g.co/kgs/htHxVQk",
    },
    {
      name: "Gurugram Sector 35",
      fuel: "CNG + EV",
      address: "Delhi–Jaipur Expressway, Mohammed Pur, Sector 35, Gurugram, Haryana 122004",
      hours: "9:30am–6:30pm",
      mapUrl: "https://g.co/kgs/H2DxLfc",
    },
    {
      name: "Noida",
      fuel: "CNG",
      address: "Multi-Level Car Parking, Future Mall, Sector 38, Noida, Uttar Pradesh 201301",
      hours: "",
      mapUrl: MAPS("Multi-Level Car Parking, Future Mall, Sector 38, Noida, Uttar Pradesh 201301"),
    },
    {
      name: "Dwarka Sector 10",
      fuel: "EV",
      address: "H3J4+PFQ, Sector 10 Dwarka, Delhi 110075",
      hours: "",
      mapUrl: "https://g.co/kgs/J568fdY",
    },
    // The sheet lists it with no address; Jarvis's.
    {
      name: "Gurugram Tech Garden",
      fuel: "EV",
      address: "Tech Garden, Plot No 4, Udyog Vihar, Sector 35, Gurugram, Haryana 122004",
      hours: "",
      mapUrl: "https://maps.app.goo.gl/HiaPEwvKh1vVTnFMA",
    },
  ],
  bengaluru: [
    {
      name: "Airport",
      fuel: "CNG",
      address: "Minerva Movements, Begur Dr, Chikkanahalli, Bandikodegehalli Amanikere, Bengaluru, Karnataka 562157",
      hours: "9:30am–6:30pm",
      mapUrl: "https://share.google/ApfXAibniG4EpQqOh",
    },
    {
      name: "Whitefield",
      fuel: "CNG + EV",
      address: "XPMV+8GC, Pattandur Agrahara, Whitefield, Bengaluru, Karnataka 560066",
      hours: "9am–5pm",
      mapUrl: "https://g.co/kgs/VC3rijq",
    },
    {
      name: "Singasandra",
      fuel: "CNG",
      address: "VJHV+9PC, Aishwarya Crystal Layout, Begur, Bengaluru, Karnataka 560068",
      hours: "9:30am–6:30pm",
      mapUrl: "https://share.google/WxOBXch7sBlDN6vcv",
    },
    {
      name: "Electronic City",
      fuel: "EV",
      address: "237B, Bommasandra Industrial Area, Hosur Rd, Tranquil City, Bommasandra Village, Bengaluru, Karnataka 560099",
      hours: "9:30am–6:30pm",
      mapUrl: "https://g.co/kgs/Rx4R4G1",
    },
    // Jarvis only.
    {
      name: "Bhyrathi",
      address: "3MF3+WQC, Visthar, Bengaluru, Karnataka 560077 (near BMTC Bus Depot 48, Bairathi)",
      hours: "",
      mapUrl: "https://maps.app.goo.gl/s3mDbHPqBX2EYqCt5",
    },
  ],
  hyderabad: [
    {
      name: "Bachupally",
      fuel: "CNG + EV",
      address: "G9J4+CVQ, Bachupally, Hyderabad, Telangana 500090",
      hours: "",
      mapUrl: "https://g.co/kgs/jbrf3S8",
    },
    {
      name: "Dammaiguda",
      fuel: "CNG",
      address: "8-12, Street Number 12, Raji Reddy Nagar, Narayana Puri Colony, New Santoshnagar, Santosh Nagar, Hyderabad, Secunderabad, Telangana 500083",
      hours: "",
      // The sheet's link is a URL shortener that refuses checks; Jarvis's map link for the same hub.
      mapUrl: "https://maps.app.goo.gl/FTrXVMbJWkTGg24D7",
    },
  ],
  kolkata: [
    {
      name: "Taratala",
      address: "P-12/1, Taratala Rd, near Britannia Factory, CPT Colony, Taratala, Kolkata, West Bengal 700088",
      hours: "",
      mapUrl: "https://g.co/kgs/hkEaJCs",
    },
    // Jarvis only.
    {
      name: "North Dumdum",
      fuel: "EV",
      address: "Belgachia Rd, Golpark, North Dumdum, Kolkata, West Bengal",
      hours: "",
      mapUrl: "https://maps.app.goo.gl/5dVcgC4PmzAxEbnm8",
    },
  ],
  chennai: [
    {
      name: "Vanagaram",
      fuel: "CNG",
      address: "1, Yadaval St, behind M Convention Hall, Ayanambakkam, Rajankuppam, Maduravoyal, Chennai, Tamil Nadu 600095",
      hours: "9:30am–6:30pm",
      mapUrl: "https://g.co/kgs/5oWWLrT",
    },
  ],
};

/** The site's content with each city's hubs taken from the list above. */
export function withHubList(content: SiteContent): SiteContent {
  return { ...content, cities: content.cities.map((city) => ({ ...city, hubs: HUBS[city.slug] ?? city.hubs })) };
}
