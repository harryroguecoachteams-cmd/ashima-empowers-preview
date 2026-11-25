/* =====================================================================
   ASHIMA EMPOWERS · SITE SETTINGS
   ---------------------------------------------------------------------
   This is the ONE file to change links, prices, contact details and
   Google Analytics. Every page reads it, so a change here updates the
   whole website.

   How to edit safely:
   - Change only the text between the "quotes".
   - Keep the quotes, the colon and the comma at the end of each line.
   - Lines starting with // are notes for you. The website ignores them.
   - After saving, the live site updates in about 1 to 2 minutes.
   ===================================================================== */

window.SITE = {

  // --- Google Analytics 4 ------------------------------------------------
  // Paste the Measurement ID from GA4 (Admin > Data streams > Web), e.g. "G-ABC123XYZ9".
  // Leave it empty ("") and no analytics code loads at all.
  ga4: "",

  // --- Contact ------------------------------------------------------------
  whatsapp: "16044454743",                 // Ashima's WhatsApp number: digits only, with country code
  email: "hello@ashimaempowers.com",

  // --- Prices shown on the website ----------------------------------------
  // These update every price on every page. If you change a price, ALSO make a
  // new Stripe Payment Link for it and paste it under "links" below.
  prices: {
    "question-10": "$27",     // 10-Minute One-Question Consultation
    "consult-30": "$99",      // 30-Minute Private Consultation
    "consult-60": "$149",     // 1-Hour Private Consultation
    "vip-monthly": "$199",    // VIP Circle, per month
    "inner-world": "$21"      // Empower Your Inner World, per month
  },

  // --- Buy buttons and links ----------------------------------------------
  // Stripe Payment Links (live, USD). After paying, Stripe sends buyers to details.html.
  // If a link is left empty, that button opens WhatsApp with a ready-made message instead.
  links: {
    "question-10": "https://buy.stripe.com/fZueVegE1cj4dQi4VZgEg0k",   // $27  One-Question Consultation
    "consult-30": "https://buy.stripe.com/6oUcN673r82O8vY1JNgEg0q",    // $99  30-Minute Private Consultation
    "consult-60": "https://buy.stripe.com/14A9AU5Znerc3bE3RVgEg0r",    // $149 1-Hour Private Consultation
    "vip-monthly": "https://buy.stripe.com/6oUdRa9bz96Sh2u747gEg0s",   // $199/month VIP Circle
    "inner-world": "https://buy.stripe.com/bJecN6evT2Iuh2ugEHgEg0t",   // $21/month Empower Your Inner World
    "manage": "https://billing.stripe.com/p/login/eVqfZigE13MycMecorgEg00", // members cancel or update their card here
    "community": "https://www.skool.com/empower-your-inner-world-7218/about", // Skool (paid members only, never call it free)
    // The FREE WhatsApp community. The private members' group link must NEVER go in this file:
    // paying members get it by email and on the details form's thank-you screen.
    "wa-free": "https://chat.whatsapp.com/G9WLwUiDfK6DKEwlAcjtLo"
  },

  // Words used in the WhatsApp message when a buy link above is empty.
  labels: {
    "question-10": "the 10-Minute One-Question Consultation",
    "consult-30": "the 30-Minute Private Consultation",
    "consult-60": "the 1-Hour Private Consultation",
    "vip-monthly": "the VIP Circle membership",
    "inner-world": "Empower Your Inner World",
    "community": "the Empower Your Inner World community on Skool",
    "manage": "help with my membership"
  },

  // --- Where forms are sent (ask Rogue Coach Teams before changing these) ---
  // Calm Mind Reset sign-ups -> Brevo list #3 (welcome email + day-2 / day-5 emails)
  brevoFreebieForm: "https://00a0b09d.sibforms.com/serve/MUIFANl0JWzgHP8mmylHxeoVYR3TFE0B9nAeZR_9L-dBfDbpZyFLvvTZlb22ygreM0vT7loYJIELcxFqBBXWvkT5Ahhf8Ln1BQ_yZ6wLjXa-8B_cRLaR6W5yhLtmfwvIA3FM55Pkh2v6kQ24mqOb1h7tdgJEd-v2Hsgr7GeC4BL2lTVkRLuVGqxBx85GLJgED5Kkae49wwcB08ZNFg==",
  // Coaching applications -> Brevo list #9 ("I've received your application" email)
  brevoApplyForm: "https://00a0b09d.sibforms.com/serve/MUIFAMGTVBw61w8cTzR_PKAlxoH3D6B1VDPl5F76Wqz4Q0Yk2HN9H1vtnicSRufzzWmqq0at55yRhJObPaU9iszsdZmRON0fm2dmF9YR3k23sgcYA5vYiaWnKyeANBCKPs4_0DlVV6tBfU4Dj5bZVPotHuizJn6_dogl0gttOpWtqrEhecXdKHxi0JGMmbfvA7e1DBnzmxmB5OhBSw==",
  // Birth details + palm photos after payment (Cloudflare Worker, team view at /admin)
  detailsEndpoint: "https://ashima-client-details.roguecoachteams.workers.dev/submit",
  // Leads log: every sign-up and application is also written here, and the Google Sheet
  // "Ashima Empowers - Website leads and sales" shows them all (purchases are added by Stripe).
  leadsLog: "https://ashima-client-details.roguecoachteams.workers.dev/log"
};
