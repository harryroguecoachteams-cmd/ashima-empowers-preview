/* Ashima Empowers — site behaviour
   ------------------------------------------------------------------
   SET-UP: paste each payment / booking link below (Stripe Payment Link,
   Cal.com or Calendly URL). While a link is empty, the button opens
   WhatsApp with a pre-written message for that offer, so nothing breaks.
*/
const CONFIG = {
  whatsapp: "16044454743",           // [CONFIRM] Ashima's WhatsApp number, digits only with country code
  email: "hello@ashimaempowers.com", // [CONFIRM]
  formEndpoint: "",                  // optional: URL that accepts a JSON POST (Apps Script, Formspree, Zapier hook)
  // Brevo form "Website freebie - Calm Mind Reset": adds the contact to list #3 "Freebie sign-ups",
  // sends the Calm Mind Reset email, and starts the day-2 / day-5 nurture automation.
  brevoFreebieForm: "https://00a0b09d.sibforms.com/serve/MUIFANl0JWzgHP8mmylHxeoVYR3TFE0B9nAeZR_9L-dBfDbpZyFLvvTZlb22ygreM0vT7loYJIELcxFqBBXWvkT5Ahhf8Ln1BQ_yZ6wLjXa-8B_cRLaR6W5yhLtmfwvIA3FM55Pkh2v6kQ24mqOb1h7tdgJEd-v2Hsgr7GeC4BL2lTVkRLuVGqxBx85GLJgED5Kkae49wwcB08ZNFg==",
  links: {
    // Stripe Payment Links (live, USD), created 23 Nov 2026. After paying, buyers are told to book on WhatsApp.
    "consult-60": "https://buy.stripe.com/8x2bJ2bjHgzkbIa4VZgEg0l",   // 1-hour consultation, $199 USD
    "question-10": "https://buy.stripe.com/fZueVegE1cj4dQi4VZgEg0k",  // 1-question consultation, 10 min, $27 USD
    "discovery-10": "https://buy.stripe.com/bJefZi2Nb96S3bEbkngEg0m", // coaching discovery call, 10 min, $10 USD
    "discovery-20": "https://buy.stripe.com/dRm00kbjH4QCh2u0FJgEg0n", // coaching discovery call, 20 min, $20 USD
    "vip-monthly": "https://buy.stripe.com/aFabJ29bz2Iu27AdsvgEg0o",  // VIP Circle, $299 USD / month
    "inner-world": "https://buy.stripe.com/14A9AUcnL2IufYqgEHgEg0p",  // Empower Your Inner World, $29 USD / month
    "manage": "https://billing.stripe.com/p/login/eVqfZigE13MycMecorgEg00", // Stripe customer portal: members cancel or update their card
    "community": "https://www.skool.com/empower-your-inner-world-7218/about" // Skool: Empower Your Inner World (free, private)
  },
  labels: {
    "consult-60": "the 1-Hour Private Consultation ($199 USD)",
    "question-10": "the 10-Minute One-Question Consultation ($27 USD)",
    "discovery-10": "a 10-minute coaching discovery call ($10 USD)",
    "discovery-20": "a 20-minute coaching discovery call ($20 USD)",
    "vip-monthly": "the VIP Circle membership ($299 USD / month)",
    "inner-world": "Empower Your Inner World ($29 USD / month)",
    "community": "the Empower Your Inner World community on Skool",
    "manage": "help with my membership"
  }
};

const wa = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

// Wire every [data-offer] button to its link, or to WhatsApp as a fallback.
document.querySelectorAll("[data-offer]").forEach((el) => {
  const key = el.dataset.offer;
  const url = CONFIG.links[key];
  el.href = url || wa(`Hi Ashima, I'd like to book ${CONFIG.labels[key] || "a session"}.`);
  if (!url) el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.href = wa(el.dataset.whatsapp || "Hi Ashima, I have a question.");
  el.target = "_blank";
  el.rel = "noopener";
});

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "✕" : "☰";
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  }));
}

// Hero video: autoplays muted; one button pauses/plays, one toggles sound.
document.querySelectorAll(".video-card").forEach((card) => {
  const v = card.querySelector("video");
  const playBtn = card.querySelector("[data-video=play]");
  const soundBtn = card.querySelector("[data-video=sound]");
  if (!v) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.removeAttribute("autoplay"), v.pause();
  const sync = () => { if (playBtn) playBtn.innerHTML = v.paused ? "▶ Play" : "❚❚ Pause"; };
  v.addEventListener("play", sync); v.addEventListener("pause", sync); sync();
  playBtn && playBtn.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
  // Sound toggle only shows when the video has a voice track (set data-audio="true" on <video>).
  if (soundBtn && v.dataset.audio !== "true") soundBtn.remove();
  else if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      v.muted = !v.muted;
      soundBtn.textContent = v.muted ? "🔇 Sound off" : "🔊 Sound on";
      if (v.paused) v.play();
    });
  }
});

// Generic form sender: posts JSON to CONFIG.formEndpoint, else hands off to WhatsApp.
async function sendForm(form, summaryTitle) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.form = summaryTitle;
  data.page = location.pathname;
  data.sent = new Date().toISOString();
  if (CONFIG.formEndpoint) {
    try {
      await fetch(CONFIG.formEndpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(data) });
      return "sent";
    } catch (e) { /* fall through to WhatsApp */ }
  }
  const lines = Object.entries(data).filter(([k]) => !["page", "sent", "form"].includes(k)).map(([k, v]) => `${k}: ${v}`);
  window.open(wa(`${summaryTitle}\n\n${lines.join("\n")}`), "_blank", "noopener");
  return "whatsapp";
}

// Free gift form (home page): signs up to Brevo, which emails the Calm Mind Reset and starts the nurture emails.
const giftForm = document.getElementById("gift-form");
if (giftForm) {
  giftForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = giftForm.querySelector(".form-msg");
    const btn = giftForm.querySelector("button[type=submit]");
    const name = giftForm.elements.name.value.trim();
    const email = giftForm.elements.email.value.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.textContent = "Please enter a valid email address.";
      giftForm.elements.email.focus();
      return;
    }
    btn.disabled = true;
    msg.textContent = "Sending…";
    const fd = new FormData();
    fd.append("EMAIL", email);
    fd.append("FIRSTNAME", name);
    fd.append("email_address_check", ""); // Brevo honeypot, must stay empty
    fd.append("locale", "en");
    try {
      const res = await fetch(`${CONFIG.brevoFreebieForm}?isAjax=1`, { method: "POST", body: fd });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === false) throw new Error(out.message || res.status);
      msg.textContent = "Thank you! Your Calm Mind Reset is on its way. Check your inbox (and Promotions or Spam) in a few minutes.";
      giftForm.reset();
    } catch (err) {
      msg.innerHTML = `Sorry, that didn't go through. Please try again, or <a href="${wa("Hi Ashima, please send me the free Calm Mind Reset.")}" target="_blank" rel="noopener">message Ashima on WhatsApp</a>.`;
    } finally {
      btn.disabled = false;
    }
  });
}

// Coaching application (coaching.html): step 1 form → step 2 choose the paid discovery call
const appForm = document.getElementById("apply-form");
if (appForm) {
  appForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!appForm.reportValidity()) return;
    await sendForm(appForm, "Coaching application");
    document.getElementById("step-1").classList.add("hidden");
    document.getElementById("step-2").classList.remove("hidden");
    document.querySelectorAll(".stepper span").forEach((s, i) => s.classList.toggle("on", i === 1));
    document.getElementById("apply").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const callBtn = document.getElementById("book-call");
  document.querySelectorAll("input[name=call]").forEach((r) => r.addEventListener("change", () => {
    callBtn.dataset.offer = r.value;
    const url = CONFIG.links[r.value];
    callBtn.href = url || wa(`Hi Ashima, I've just sent my coaching application. I'd like to book ${CONFIG.labels[r.value]}.`);
  }));
  document.querySelector("input[name=call]:checked")?.dispatchEvent(new Event("change"));
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
