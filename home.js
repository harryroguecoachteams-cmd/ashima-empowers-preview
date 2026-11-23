/* Homepage interactions: hero video, Google reviews carousel, Instagram reel lightbox. */

// Hero "Watch This First": the muted preview loops behind the play button; clicking plays from the start with sound.
(() => {
  const box = document.getElementById("hero-video");
  if (!box) return;
  const v = box.querySelector("video");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
  box.addEventListener("click", () => {
    if (box.classList.contains("playing")) return;
    box.classList.add("playing");
    v.loop = false;
    v.muted = false;
    v.currentTime = 0;
    v.controls = true;
    v.play();
  });
  v.addEventListener("ended", () => { box.classList.remove("playing"); v.controls = false; v.muted = true; v.loop = true; v.play(); });
})();

// Google reviews, copied word for word from Ashima's Google Business Profile on 22 Nov 2026.
const REVIEWS = [
  ["Gurkirat S.", "2 weeks ago", "I had a great experience with Ashima Ji! She answered every question that came to my mind with clear, honest, and straight-up answers, without any sugarcoating. I really appreciate her patience, knowledge, and the way she explains everything so well. She makes you feel comfortable asking even the smallest questions and ensures you leave with clarity and confidence. Truly one of the best experiences I've had. I would recommend her 101% without a second thought! Highly recommended! 🙌"],
  ["Simar H.", "6 months ago", "A few months ago I was extremely stressed after meeting a pandit who told me my marriage would break after October 2025. He scared me a lot and then said the only way to save my marriage was to pay $1700 for a special puja. After that I was mentally very disturbed and confused. Later, through my sister, I connected with Ashima for a reading. She calmly listened to everything, checked my palms carefully, and gave me a completely different perspective. Instead of creating fear or asking for expensive remedies, she encouraged me to focus on my future, stay positive, and work consistently toward my goals. Her guidance honestly gave me peace of mind and confidence again. I really appreciated how genuine, supportive, and honest she was throughout the session. Thank you Ashima for bringing positivity and clarity during a difficult time in my life. Highly recommended."],
  ["Manvi O.", "4 months ago", "I had a wonderful consultation with Ashima Ma'am. She was extremely patient, calm, and took the time to listen to all of my concerns before giving her guidance. Her insights through astrology and palmistry gave me so much clarity and peace of mind. What impressed me the most was that her past predictions, especially regarding my career, turned out to be accurate, which increased my trust in her guidance. She is not only knowledgeable in astrology and palmistry but also a genuinely gifted healer who makes you feel comfortable and positive throughout the session. I highly recommend Ashima Ma'am to anyone seeking clarity, guidance, and genuine support. Thank you so much, Ma'am, for your kindness and wisdom!"],
  ["Harmandeep", "5 months ago", "I had such an incredible experience with Ashima. Her unique way of combining Astro, Palmistry & Numerology to create a reading felt accurate & personal. I felt understood, reassured & clear after our session. Session did not felt rushed, she took her sweet time to understand & listen to me. Highly recommend her for anyone looking clarity, self awareness or meaningful guidance."],
  ["Minahil", "4 months ago", "I highly recommend my astrologer (Ashima Empower) to anyone looking for genuine guidance. I had my session with her yesterday, and I was truly amazed by how accurately she described things about my life. Her insights felt incredibly genuine and gave me a lot of clarity. Beyond her knowledge, she is such a sweet, kind-hearted, humble, and down-to-earth person. She made me feel comfortable throughout the session and patiently answered all my questions with compassion and honesty. I wholeheartedly recommend her."],
  ["Alka B.", "7 months ago", "I recently got readings done with Ashima ji for my son, my husband, and myself. Whatever she shared about our past was very accurate and realistic. I truly felt a genuine connection during the session. What I appreciated most was that she didn't try to sell any remedies — just honest guidance. She is very sincere in her work. I would definitely recommend her to anyone looking for a reading."],
  ["Panny S.", "6 months ago", "I recently had a plan reading with Ashima Gautam and I was truly amazed by the experience. She was incredibly accurate and I genuinely felt like she was reading my soul. For the first time in a long while, I felt understood on an emotional, intellectual and spritual level in ways that are very hard to explain and that very few people can understand. I loved hearing the positive insight about my future, as well as the guidance on the areas I need to work on within myself. Her advice to trust my intuition and continue moving forward deeply resonated with me. Thank you Ashima for the time energy and guidance you shared with me. I truly appreciate your support in helping me connect with my higher self."],
  ["Komaljeet K.", "5 months ago", "I got a reading from her recently and was honestly surprised by how accurate it was. Whatever she told me exactly matched what I'm going through now. She took the time to answer my questions and never made feel rushed. I also appreciate that she gave me remedy without charging anything extra. Overall, it was great experience and I left the session feeling much more positive and hopeful. I would definitely recommend Ashima to anyone looking for honest guidance and a pleasant experience."],
  ["Princejeet R.", "6 months ago", "I had a truly insightful experience with Ashima Astrologer. Her readings were incredibly accurate and detailed, and she took the time to explain everything in a way that was easy to understand. What stood out the most was her genuine approach—she didn't just make predictions but also offered practical guidance that felt thoughtful and relevant to my situation."],
  ["Ange G.", "a week ago", "I had a wonderful experience with the her she is very knowledgeable, patient, and professional. Their guidance was insightful and gave me a better understanding and clarity. I truly appreciate their time, positive energy, and thoughtful advice. Highly recommended!"]
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

// Instagram reels and TV segments open in a lightbox and play through each platform's own embed.
(() => {
  const box = document.getElementById("lightbox");
  if (!box) return;
  const frame = box.querySelector("iframe");
  const close = () => { box.classList.remove("open"); frame.src = "about:blank"; };
  const open = (src, wide) => { frame.src = src; box.classList.toggle("wide", wide); box.classList.add("open"); box.querySelector(".x").focus(); };
  document.querySelectorAll("[data-reel]").forEach((btn) => btn.addEventListener("click", () => open(`https://www.instagram.com/reel/${btn.dataset.reel}/embed/`, false)));
  // TV segments play through YouTube's privacy-enhanced embed.
  document.querySelectorAll("[data-yt]").forEach((btn) => btn.addEventListener("click", () => open(`https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`, true)));
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("x")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("open")) close(); });
})();
