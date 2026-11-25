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
  // details.html posts here: Cloudflare Worker "ashima-client-details" (Rogue Coach Teams account), stored in KV.
  detailsEndpoint: "https://ashima-client-details.roguecoachteams.workers.dev/submit",
  // Brevo form "Website freebie - Calm Mind Reset": adds the contact to list #3 "Freebie sign-ups",
  // sends the Calm Mind Reset email, and starts the day-2 / day-5 nurture automation.
  brevoFreebieForm: "https://00a0b09d.sibforms.com/serve/MUIFANl0JWzgHP8mmylHxeoVYR3TFE0B9nAeZR_9L-dBfDbpZyFLvvTZlb22ygreM0vT7loYJIELcxFqBBXWvkT5Ahhf8Ln1BQ_yZ6wLjXa-8B_cRLaR6W5yhLtmfwvIA3FM55Pkh2v6kQ24mqOb1h7tdgJEd-v2Hsgr7GeC4BL2lTVkRLuVGqxBx85GLJgED5Kkae49wwcB08ZNFg==",
  brevoApplyForm: "https://00a0b09d.sibforms.com/serve/MUIFAMGTVBw61w8cTzR_PKAlxoH3D6B1VDPl5F76Wqz4Q0Yk2HN9H1vtnicSRufzzWmqq0at55yRhJObPaU9iszsdZmRON0fm2dmF9YR3k23sgcYA5vYiaWnKyeANBCKPs4_0DlVV6tBfU4Dj5bZVPotHuizJn6_dogl0gttOpWtqrEhecXdKHxi0JGMmbfvA7e1DBnzmxmB5OhBSw==", // coaching applicants → list #9, sends "I've received your application"
  links: {
    // Stripe Payment Links (live, USD). After paying, Stripe sends buyers to details.html (the birth-details form).
    "question-10": "https://buy.stripe.com/fZueVegE1cj4dQi4VZgEg0k",  // One-Question Consultation, 10 min, $27 USD
    "consult-30": "https://buy.stripe.com/6oUcN673r82O8vY1JNgEg0q",   // 30-Minute Private Consultation, $99 USD (created 25 Nov 2026)
    "consult-60": "https://buy.stripe.com/14A9AU5Znerc3bE3RVgEg0r",   // 1-Hour Private Consultation, $149 USD (created 25 Nov 2026)
    "vip-monthly": "https://buy.stripe.com/6oUdRa9bz96Sh2u747gEg0s",  // VIP Circle, $199 USD / month (created 25 Nov 2026)
    "inner-world": "https://buy.stripe.com/bJecN6evT2Iuh2ugEHgEg0t",  // Empower Your Inner World, $21 USD / month (created 25 Nov 2026)
    "manage": "https://billing.stripe.com/p/login/eVqfZigE13MycMecorgEg00", // Stripe customer portal: members cancel or update their card
    "community": "https://www.skool.com/empower-your-inner-world-7218/about", // Skool: Empower Your Inner World (members only; never call it free)
    // WhatsApp communities. The FREE one is public. The PRIVATE one is for paying members only, so it never
    // appears on a public page: it goes out in the buyer email and on the details form's thank-you for members.
    "wa-free": "https://chat.whatsapp.com/G9WLwUiDfK6DKEwlAcjtLo"
  },
  labels: {
    "question-10": "the 10-Minute One-Question Consultation ($27 USD)",
    "consult-30": "the 30-Minute Private Consultation ($99 USD)",
    "consult-60": "the 1-Hour Private Consultation ($149 USD)",
    "vip-monthly": "the VIP Circle membership ($199 USD / month)",
    "inner-world": "Empower Your Inner World ($21 USD / month)",
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
document.querySelectorAll("[data-link]").forEach((el) => {
  const url = CONFIG.links[el.dataset.link];
  if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
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

// Calm Mind Reset sign-up. Used by the footer form and the pop-up. The Brevo form adds the contact to
// list #3, which sends the welcome email and starts the "Freebie nurture" automation (day 2 and day 5 emails).
const SUB_KEY = "ae_subscribed", POP_KEY = "ae_popup_closed";
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};
async function brevoSignup(name, email, extra = {}) {
  const fd = new FormData();
  fd.append("EMAIL", email);
  fd.append("FIRSTNAME", name);
  if (extra.last) fd.append("LASTNAME", extra.last);
  if (extra.phone) fd.append("PHONE_TEXT", extra.phone);
  fd.append("email_address_check", ""); // Brevo honeypot, must stay empty
  fd.append("locale", "en");
  const res = await fetch(`${CONFIG.brevoFreebieForm}?isAjax=1`, { method: "POST", body: fd });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || out.success === false) throw new Error(out.message || res.status);
  store.set(SUB_KEY, String(Date.now()));
}
function wireGiftForm(form, onDone) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = form.querySelector(".form-msg");
    const btn = form.querySelector("button[type=submit]");
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      msg.textContent = "Please enter a valid email address.";
      form.elements.email.focus();
      return;
    }
    btn.disabled = true;
    msg.textContent = "Sending…";
    try {
      const f = form.elements;
      await brevoSignup(name, email, { last: f.last ? f.last.value.trim() : "", phone: f.phone ? f.phone.value.trim() : "" });
      msg.textContent = "Thank you! Your Calm Mind Reset is on its way. Check your inbox (and Promotions or Spam) in a few minutes.";
      form.reset();
      if (onDone) onDone();
    } catch (err) {
      msg.innerHTML = `Sorry, that didn't go through. Please try again, or <a href="${wa("Hi Ashima, please send me the free Calm Mind Reset.")}" target="_blank" rel="noopener">message Ashima on WhatsApp</a>.`;
    } finally {
      btn.disabled = false;
    }
  });
}
const giftForm = document.getElementById("gift-form");
if (giftForm) wireGiftForm(giftForm);

// Pop-up: offers the free Calm Mind Reset once a visitor has shown interest (45% scroll, 30 s on the page,
// or moving to leave on desktop). Never for people who already signed up; after a close it rests for 7 days.
// Any link with data-popup="open" opens it on demand.
(function popup() {
  const wrap = document.createElement("div");
  wrap.className = "pop";
  wrap.hidden = true;
  wrap.innerHTML = `
    <div class="pop-card" role="dialog" aria-modal="true" aria-labelledby="pop-title">
      <button class="pop-x" type="button" aria-label="Close">×</button>
      <div class="pop-art"><img src="assets/ashima-headshot.jpg" alt="" width="900" height="1200" loading="lazy"><span class="pop-tag">Free · 5 minutes</span></div>
      <div class="pop-body">
        <div class="eyebrow">A gift from Ashima</div>
        <h2 id="pop-title">Quiet your mind <em>in 5 minutes.</em></h2>
        <p>Get my free 5-Minute Calm Mind Reset, the same practice I give my clients when overthinking takes over. Plus gentle guidance in your inbox.</p>
        <form class="pop-form" novalidate>
          <input name="name" placeholder="First name" aria-label="First name" autocomplete="given-name">
          <input name="email" type="email" placeholder="Email address" aria-label="Email address" autocomplete="email" required>
          <button class="btn-gold" type="submit">Send me the reset →</button>
          <p class="form-msg" role="status"></p>
        </form>
        <p class="pop-fine">No spam. Unsubscribe anytime. <a href="privacy.html">Privacy</a></p>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  const card = wrap.querySelector(".pop-card"), form = wrap.querySelector(".pop-form");
  let lastFocus = null, shown = false;
  const open = (manual) => {
    if (!manual && (shown || store.get(SUB_KEY))) return;
    const closed = Number(store.get(POP_KEY) || 0);
    if (!manual && Date.now() - closed < 7 * 864e5) return;
    if (!manual && document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    shown = true;
    lastFocus = document.activeElement;
    wrap.hidden = false;
    requestAnimationFrame(() => wrap.classList.add("on"));
    document.documentElement.classList.add("pop-lock");
    setTimeout(() => form.elements.name.focus(), 60);
  };
  const close = () => {
    wrap.classList.remove("on");
    document.documentElement.classList.remove("pop-lock");
    store.set(POP_KEY, String(Date.now()));
    setTimeout(() => { wrap.hidden = true; }, 250);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  wrap.querySelector(".pop-x").addEventListener("click", close);
  wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
  document.addEventListener("keydown", (e) => {
    if (wrap.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") { // keep focus inside the dialog
      const f = card.querySelectorAll("button, input, a[href]");
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  wireGiftForm(form, () => { setTimeout(close, 4000); });
  document.querySelectorAll('[data-popup="open"]').forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); open(true); }));
  if (store.get(SUB_KEY)) return;
  const armAt = Date.now() + 6000; // never in the first 6 seconds
  const ready = () => Date.now() > armAt;
  setTimeout(() => open(false), 30000);
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (h > 0 && scrollY / h > 0.45 && ready()) { open(false); removeEventListener("scroll", onScroll); }
  };
  addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget && e.clientY <= 0 && ready()) open(false); });
})();

// Coaching application (coaching.html). No discovery call any more (Ashima, 25 Nov 2026): the applicant goes
// to Brevo list #9 (which emails "I've received your application"), Ashima gets the full answers on WhatsApp,
// and the page says her team will reply within 24-48 hours to schedule a call.
function brevoApply(form) {
  const f = form.elements, fd = new FormData();
  fd.append("EMAIL", f.email.value.trim());
  fd.append("FIRSTNAME", f.name.value.trim().split(/\s+/)[0] || "");
  fd.append("PHONE_TEXT", f.phone.value.trim());
  fd.append("COACHING_FOCUS", f.focus.value);
  fd.append("email_address_check", "");
  fd.append("locale", "en");
  return fetch(`${CONFIG.brevoApplyForm}?isAjax=1`, { method: "POST", body: fd, keepalive: true }).catch(() => {});
}
const appForm = document.getElementById("apply-form");
if (appForm) {
  appForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!appForm.reportValidity()) return;
    brevoApply(appForm); // runs alongside; the WhatsApp hand-off below must open straight from the click
    await sendForm(appForm, "Coaching application");
    document.getElementById("step-1").classList.add("hidden");
    document.getElementById("step-2").classList.remove("hidden");
    document.querySelectorAll(".stepper span").forEach((s, i) => s.classList.toggle("on", i === 1));
    document.getElementById("apply").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}


// Post-purchase details form (details.html). Photos are shrunk in the browser (max 2400 px, JPEG) so they upload
// fast on phones, then everything goes to the details Worker. Stripe sends buyers here with ?offer=<key>.
async function shrink(file) {
  if (!file.type.startsWith("image/") || file.size < 1.5e6) return file;
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 2400 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.88));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch (e) { return file; }
}
const detailsForm = document.getElementById("details-form");
if (detailsForm) {
  const q = new URLSearchParams(location.search);
  if (q.get("offer")) detailsForm.elements.offer.value = q.get("offer");
  if (q.get("email")) detailsForm.elements.email.value = q.get("email");
  detailsForm.querySelectorAll(".upload input").forEach((inp) => inp.addEventListener("change", () => {
    const box = inp.closest(".upload"), img = box.querySelector("img"), files = [...inp.files].slice(0, inp.multiple ? 4 : 1);
    box.classList.toggle("has", files.length > 0);
    box.dataset.count = files.length > 1 ? `${files.length} photos` : "✓ added";
    if (files[0]) img.src = URL.createObjectURL(files[0]);
  }));
  detailsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = detailsForm.querySelector(".form-msg"), btn = detailsForm.querySelector("button[type=submit]");
    if (!detailsForm.reportValidity()) return;
    btn.disabled = true; msg.textContent = "Sending your details and photos…";
    try {
      const fd = new FormData();
      for (const el of detailsForm.elements) {
        if (!el.name || el.type === "file") continue;
        fd.append(el.name, el.value);
      }
      for (const inp of detailsForm.querySelectorAll("input[type=file]")) {
        for (const f of [...inp.files].slice(0, inp.multiple ? 4 : 1)) fd.append(inp.name, await shrink(f));
      }
      const res = await fetch(CONFIG.detailsEndpoint, { method: "POST", body: fd });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || res.status);
      if (out.wa) { document.getElementById("d-private-link").href = out.wa; document.getElementById("d-private").classList.remove("hidden"); }
      document.getElementById("d-step-1").classList.add("hidden");
      document.getElementById("d-step-2").classList.remove("hidden");
      document.getElementById("details").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      msg.innerHTML = `Sorry, that didn't go through${err.message && isNaN(err.message) ? ": " + err.message : ""}. Please try again, or <a href="${wa("Hi Ashima, I've paid and I'd like to send my birth details and palm photos.")}" target="_blank" rel="noopener">send them on WhatsApp</a>.`;
    } finally { btn.disabled = false; }
  });
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
