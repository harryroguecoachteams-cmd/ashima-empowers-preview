/* Homepage interactions: hero video, Google reviews carousel, Instagram reel lightbox. */

// Hero "Watch This First": a short silent loop plays behind the play button. Clicking plays the full intro
// from the start with sound: data-full (Ashima's recorded intro, see VIDEO-SCRIPT.md) if set, else the loop itself.
(() => {
  const box = document.getElementById("hero-video");
  if (!box) return;
  const v = box.querySelector("video");
  const loopSrc = v.currentSrc || v.querySelector("source")?.src;
  const full = box.dataset.full;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
  box.addEventListener("click", () => {
    if (box.classList.contains("playing")) return;
    box.classList.add("playing");
    if (full) { v.src = full; v.load(); }
    v.loop = false;
    v.muted = false;
    v.currentTime = 0;
    v.controls = true;
    v.play();
  });
  v.addEventListener("ended", () => {
    box.classList.remove("playing"); v.controls = false; v.muted = true; v.loop = true;
    if (full) { v.src = loopSrc; v.load(); }
    v.play();
  });
})();

// Google reviews, copied word for word from Ashima's Google Business Profile on 22 Nov 2026.
const REVIEWS = [
  ["Roop K.", "November 2026", "I got my reading with Ashima mam today!!! She is a true gem 💎 such a wonderful lady with lots of amazing knowledge… She explained each and every single thing very clearly and all of her predictions were so true, so accurate, which I could relate with. She makes you comfortable and she will clear all your doubts, all your worries and give you proper true guidance ❤️ She helps with anxiety, if anyone is having any mental health issue she will guide you properly. I don't believe in astrology because in today's time people misguide you just for dollars, BUT when I got my reading with her my misconception got cleared, because she isn't like the other astrologers. SHE IS A TRUE DIAMOND 💎"],
  ["Sujata B.", "November 2026", "Didi was very kind, understanding and to the point. She took care of me like her own sister. I booked her for personal guidance and I will contact her after my results. Thank you!!"],
  ["Kamal B.", "November 2026", "I felt really comfortable with her. Half of my problems were gone after just sitting with her in the first two minutes. She listened to me with a compassionate heart and I am very much moved by how she speaks and listens to everyone with love and genuine care. Her energy is very healing. Thank you so much Ashima ji. You gave me not only a consultation but also life coaching in just one session."],
  ["Navneet S.", "November 2026", "I had a great experience with Ashima sister. She is so friendly and well educated. I feel like I am talking to my real sister. She listens very carefully and gives the remedies. I have never seen anyone with such a positive behaviour. Her aura is totally different and I feel so much positive just after one session. I highly recommend people to visit or call to book their sessions. Thank you di"],
  ["Ange G.", "November 2026", "I had a wonderful experience with her, she is very knowledgeable, patient, and professional. Her guidance was insightful and gave me a better understanding and clarity. I truly appreciate her time, positive energy, and thoughtful advice. Highly recommended!"],
  ["Suvojit D.", "November 2026", "This is my 2nd review and it definitely doesn't do justice to the kind of work this madam does. Whatever she said came true for me. Definitely book a session, as you will thank me later: you will be able to see what is up with your life and have a sense of direction."],
  ["Ms K.", "November 2026", "My experience with Ashima Ji was absolutely wonderful! She is very genuine, kind, and knowledgeable. Her astrology reading was amazing, and she explained everything with so much patience and clarity. I truly appreciate her honest guidance and positive energy. She made me feel comfortable and answered all my questions beautifully. ❤️"],
  ["Gurkirat S.", "November 2026", "I had a great experience with Ashima Ji! She answered every question that came to my mind with clear, honest, and straight-up answers, without any sugarcoating. She makes you feel comfortable asking even the smallest questions and ensures you leave with clarity and confidence. I would recommend her 101% without a second thought! 🙌"],
  ["Dhananjoy B.", "November 2026", "Ashima is really amazing at what she does, she is empathic and a very good listener. Apart from astrology she is also a very good life coach. She is practical, kind and empowering. Do not hesitate to book in a session with her."],
  ["Dilpreet K.", "November 2026", "She explained and guided me very well and suggested what I need to do and what I should not do based on my Kundli, which I liked the most. She tells you the truth to make you aware of your future. I would definitely recommend taking a session with Ashima Dii and experiencing it yourself."],
  ["Debbi R.", "November 2026", "I spoke with ma'am today, and it was a very pleasant experience. She speaks very affectionately and explains things with great kindness. Everything she says regarding the job is completely true. She listens to you with love and guides you in the right direction."],
  ["Simran S.", "October 2026", "She has positive energy. I was shocked she knows everything about my life and the way she talks shows she is so kind."],
  ["Aman J.", "August 2026", "She's an amazing amazing lady. All my life events were accurately told by her. Motivated me to the highest level. Wow is the word for her. God bless."],
  ["Manvi O.", "July 2026", "She was extremely patient, calm, and took the time to listen to all of my concerns before giving her guidance. Her insights through astrology and palmistry gave me so much clarity and peace of mind. Her past predictions, especially regarding my career, turned out to be accurate, which increased my trust in her guidance."],
  ["Minahil", "July 2026", "I was truly amazed by how accurately she described things about my life. Her insights felt incredibly genuine and gave me a lot of clarity. Beyond her knowledge, she is such a sweet, kind-hearted, humble, and down-to-earth person. She patiently answered all my questions with compassion and honesty."],
  ["Komaljeet K.", "June 2026", "I was honestly surprised by how accurate it was. Whatever she told me exactly matched what I'm going through now. She took the time to answer my questions and never made me feel rushed. I also appreciate that she gave me a remedy without charging anything extra. I left the session feeling much more positive and hopeful."],
  ["Suckie K.", "June 2026", "Everything that was said was correct. She was telling me everything I have been through. The connection was so calming and the advice was genuine. I wasn't pressured to do any rituals or wear anything, it's all about the mind. Thank you for the reading."],
  ["Harmandeep", "June 2026", "Her unique way of combining astro, palmistry & numerology to create a reading felt accurate & personal. I felt understood, reassured & clear after our session. The session did not feel rushed, she took her sweet time to understand & listen to me. Highly recommend her for anyone looking for clarity, self awareness or meaningful guidance."],
  ["Simar H.", "May 2026", "A few months ago I was extremely stressed after meeting a pandit who told me my marriage would break after October 2025. He said the only way to save my marriage was to pay $1700 for a special puja. Later I connected with Ashima. She calmly listened, checked my palms carefully, and gave me a completely different perspective. Instead of creating fear or asking for expensive remedies, she encouraged me to focus on my future, stay positive, and work consistently toward my goals. Her guidance gave me peace of mind and confidence again."],
];
(() => {
  const track = document.getElementById("rv-track");
  if (!track) return;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  track.innerHTML = REVIEWS.map(([name, when, text], i) => `
    <article class="rv">
      <div class="rv-head"><span class="av${i % 2 ? " alt" : ""}">${esc(name[0])}</span>
        <div><b>${esc(name)}</b><small>${esc(when)}</small></div>
        <svg class="g" aria-label="Google review"><use href="#g-logo"/></svg></div>
      <div class="stars" aria-label="5 out of 5 stars">★★★★★ <svg class="tick" aria-hidden="true"><use href="#tick"/></svg></div>
      <p>${esc(text)}</p>
      <button type="button">Read more</button>
    </article>`).join("");
  track.querySelectorAll(".rv").forEach((card) => {
    const p = card.querySelector("p"), b = card.querySelector("button");
    requestAnimationFrame(() => { if (p.scrollHeight <= p.clientHeight + 2) b.style.visibility = "hidden"; });
    b.addEventListener("click", () => { card.classList.toggle("open"); b.textContent = card.classList.contains("open") ? "Hide" : "Read more"; });
  });
  const step = () => track.querySelector(".rv").getBoundingClientRect().width + 14;
  document.querySelector(".rv-arrow.prev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  document.querySelector(".rv-arrow.next").addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
})();

// Video lightbox: Instagram reels and YouTube play through their own embeds; client videos (data-video) are hosted on the site.
(() => {
  const box = document.getElementById("lightbox");
  if (!box) return;
  const frame = box.querySelector("iframe"), vid = box.querySelector("video");
  let last = null;
  const close = () => {
    box.classList.remove("open"); frame.src = "about:blank"; frame.hidden = true;
    if (vid) { vid.pause(); vid.removeAttribute("src"); vid.load(); vid.hidden = true; }
    if (last && last.focus) last.focus();
  };
  const show = () => { box.classList.add("open"); box.querySelector(".x").focus(); };
  const openFrame = (src, wide) => { last = document.activeElement; frame.hidden = false; if (vid) vid.hidden = true; frame.src = src; box.classList.toggle("wide", wide); show(); };
  const openVideo = (src) => { last = document.activeElement; frame.hidden = true; vid.hidden = false; vid.src = src; box.classList.remove("wide"); show(); vid.play().catch(() => {}); };
  document.querySelectorAll("[data-reel]").forEach((btn) => btn.addEventListener("click", () => openFrame(`https://www.instagram.com/reel/${btn.dataset.reel}/embed/`, false)));
  document.querySelectorAll("[data-yt]").forEach((btn) => btn.addEventListener("click", () => openFrame(`https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`, true)));
  if (vid) document.querySelectorAll('button[data-video$=".mp4"]').forEach((btn) => btn.addEventListener("click", () => openVideo(btn.dataset.video)));
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("x")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("open")) close(); });
})();

// Header stays on screen; past the hero it slims to logo + Join VIP + Book a Session.
(() => {
  const shell = document.querySelector(".nav-shell");
  if (!shell) return;
  let last = null;
  const update = () => { const slim = window.scrollY > 120; if (slim !== last) { shell.classList.toggle("slim", slim); last = slim; } };
  update();
  window.addEventListener("scroll", update, { passive: true });
})();

// Sections fade up as they come into view.
(() => {
  const els = document.querySelectorAll(".rise");
  if (!els.length) return;
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  els.forEach((e) => io.observe(e));
})();

// The change story: the photo on the left follows the step you're reading (desktop). On phones each step has its own photo.
(() => {
  const root = document.getElementById("s7");
  if (!root) return;
  const steps = [...root.querySelectorAll(".s7-step")], imgs = [...root.querySelectorAll(".s7-frame img")], caps = [...root.querySelectorAll(".s7-cap span")];
  const bar = root.querySelector(".s7-bar i");
  let cur = 0;
  const set = (i) => {
    if (i === cur) return; cur = i;
    steps.forEach((x, k) => x.classList.toggle("on", k === i));
    imgs.forEach((x, k) => x.classList.toggle("on", k === i));
    caps.forEach((x, k) => x.classList.toggle("on", k === i));
  };
  const onScroll = () => {
    const mid = innerHeight * 0.5;
    let best = 0;
    steps.forEach((st, k) => { if (st.getBoundingClientRect().top < mid) best = k; });
    set(best);
    if (bar) { const r = root.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (mid - r.top) / r.height)); bar.style.height = (p * 100).toFixed(1) + "%"; }
  };
  imgs.forEach((im) => { im.loading = "eager"; });
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
})();

// Session-length picker: tap 10 / 30 / 60 minutes to see what you get. Arrow keys move between lengths.
document.querySelectorAll("[data-picker]").forEach((pk) => {
  const tabs = [...pk.querySelectorAll(".ptab")];
  const pick = (t, focus) => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; document.getElementById(x.getAttribute("aria-controls")).classList.toggle("on", on); });
    if (focus) t.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => pick(t));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); pick(tabs[(i + 1) % tabs.length], true); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); pick(tabs[(i - 1 + tabs.length) % tabs.length], true); }
    });
  });
  pick(tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0]);
});
