/* Ashima Empowers · site behaviour (menu, buttons, forms, pop-up).
   To change links, prices, contact details or Google Analytics, edit site-settings.js, not this file.
   While a buy link is empty there, its button opens WhatsApp with a ready-made message, so nothing breaks.
*/
// All links, prices, contact details and the GA4 ID live in site-settings.js (loaded first on every page).
const CONFIG = window.SITE || { links: {}, labels: {}, prices: {} };
const track = (name, params) => { try { window.track && window.track(name, params); } catch (e) {} };
const priceNum = (key) => Number(String((CONFIG.prices || {})[key] || "").replace(/[^0-9.]/g, "")) || undefined;

// Prices on the page come from site-settings.js, so one change there updates every page.
document.querySelectorAll("[data-price]").forEach((el) => {
  const p = (CONFIG.prices || {})[el.dataset.price];
  if (p) el.textContent = p;
});

// Leads log: a copy of every sign-up and application goes to the team's Google Sheet (see site-settings.js).
function logLead(type, data) {
  if (!CONFIG.leadsLog) return Promise.resolve();
  const body = JSON.stringify({ type, page: location.pathname.replace(/^.*\//, "") || "index.html", ...data });
  return fetch(CONFIG.leadsLog, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body, keepalive: true }).catch(() => {});
}

const wa = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

// Wire every [data-offer] button to its link, or to WhatsApp as a fallback.
document.querySelectorAll("[data-offer]").forEach((el) => {
  const key = el.dataset.offer;
  const url = CONFIG.links[key];
  const price = (CONFIG.prices || {})[key];
  el.href = url || wa(`Hi Ashima, I'd like to book ${CONFIG.labels[key] || "a session"}${price ? ` (${price} USD)` : ""}.`);
  if (!url) el.target = "_blank";
  el.rel = "noopener";
  if (price) el.addEventListener("click", () => track("begin_checkout", { currency: "USD", value: priceNum(key),
    items: [{ item_id: key, item_name: (CONFIG.labels[key] || key).replace(/^the /, ""), price: priceNum(key), quantity: 1 }] }));
});
document.querySelectorAll("[data-link]").forEach((el) => {
  const url = CONFIG.links[el.dataset.link];
  if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
  if (["wa-free", "community"].includes(el.dataset.link)) el.addEventListener("click", () => track("join_group", { group_id: el.dataset.link }));
});
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
  if (a) track("contact", { method: "WhatsApp", link_text: (a.textContent || "").trim().slice(0, 60) });
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
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.textContent = "☰"; menuBtn.focus();
    }
  });
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
      const last = f.last ? f.last.value.trim() : "", phone = f.phone ? f.phone.value.trim() : "";
      await brevoSignup(name, email, { last, phone });
      const where = form.classList.contains("pop-form") ? "popup" : "freebie";
      logLead(where, { name: [name, last].filter(Boolean).join(" "), email, phone, offer: "Calm Mind Reset" });
      track("sign_up", { method: where === "popup" ? "Pop-up" : "Footer form" });
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
          <button class="btn-gold" type="submit">Send me the reset</button>
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
    const f = appForm.elements, answers = {};
    appForm.querySelectorAll(".field").forEach((fld) => {
      const label = (fld.querySelector("label") || {}).textContent || "";
      const els = [...fld.querySelectorAll("input, select, textarea")].filter((el) => el.name && !["name", "email", "phone", "website"].includes(el.name));
      const vals = els.filter((el) => !["radio", "checkbox"].includes(el.type) || el.checked).map((el) => el.value.trim()).filter(Boolean);
      if (vals.length) answers[label.replace(/\s+/g, " ").trim().slice(0, 140) || els[0].name] = vals.join(", ");
    });
    logLead("application", { name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(), offer: "1:1 Coaching", answers });
    track("generate_lead", { lead_source: "Coaching application" });
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
  // Stripe sends buyers here straight after paying: count the sale in GA4 once per payment.
  const offer = q.get("offer"), paidKey = "ae_paid_" + (q.get("session_id") || offer + "_" + new Date().toISOString().slice(0, 10));
  if (offer && priceNum(offer) && !store.get(paidKey)) {
    store.set(paidKey, "1");
    track("purchase", { transaction_id: q.get("session_id") || undefined, currency: "USD", value: priceNum(offer),
      items: [{ item_id: offer, item_name: (CONFIG.labels[offer] || offer).replace(/^the /, ""), price: priceNum(offer), quantity: 1 }] });
  }
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
      track("details_submitted", { offer: detailsForm.elements.offer.value });
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
