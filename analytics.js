/* Google Analytics 4 for Ashima Empowers.
   Turned on by pasting the Measurement ID into site-settings.js (ga4: "G-..."). Nothing to change here.

   Besides page views (and GA4's automatic scroll, outbound-click and video measurement), the site sends:
     begin_checkout   a buy button is clicked (item, price in USD)
     purchase         the details page opens after a Stripe payment (once per payment, best effort)
     generate_lead    a coaching application is sent
     sign_up          someone asks for the Calm Mind Reset (footer form or pop-up)
     details_submitted  a buyer sends their birth details and photos
     join_group       the free WhatsApp community or the Skool community link is clicked
     contact          a WhatsApp chat link is clicked
   Mark purchase, generate_lead and sign_up as "key events" in GA4 (Admin > Events). */
(function () {
  var S = window.SITE || {};
  var id = (S.ga4 || "").trim();
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  // Everyone else on the site calls track(); it does nothing while GA4 is off.
  window.track = function (name, params) {
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;
    try { window.gtag("event", name, params || {}); } catch (e) {}
  };
  if (!/^G-[A-Z0-9]+$/i.test(id)) return;
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(s);
  window.gtag("js", new Date());
  window.gtag("config", id);
})();
