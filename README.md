# Ashima Empowers website: how to edit it

This website is plain HTML. There is no page builder, no database and no build step: **what you see in each file is what goes on the site.** Change the words, save, and the site updates.

Preview (hidden from Google): https://harryroguecoachteams-cmd.github.io/ashima-empowers-preview/

---

## 1. Where things live

| I want to change… | Edit this |
|---|---|
| A price, a Stripe buy link, the WhatsApp number, the support email, the free WhatsApp community link, or the Google Analytics ID | `site-settings.js` (one file for the whole site) |
| Words on the home page | `index.html` |
| A Google review on the home page (add, remove or fix one) | `home.js`: the `REVIEWS` list near the top. One review per line: `["Name", "Month Year", "Review text"],` newest first, copied word for word from Google. If the total changes, also update "80" and "Eighty" in `index.html` (Ctrl + F) |
| Words on another page | the page's own file (table below) |
| The menu at the top of every page | `_shared/menu.html`, then the sync in section 5 |
| The footer or the mobile bar on the inner pages | `_shared/footer.html` or `_shared/mobile-bar.html`, then the sync in section 5 |
| A photo | replace the file in `assets/` with a new one **of the same name** (section 4) |
| Colours, spacing or button styles | ask Rogue Coach Teams (`v9.css`) |

| Page | File |
|---|---|
| Home | `index.html` |
| About Ashima | `about.html` |
| All sessions | `sessions.html` |
| 1:1 Coaching (with the application form) | `coaching.html` |
| VIP Circle (monthly) | `vip.html` |
| Empower Your Inner World, live sessions (monthly) | `empower.html` |
| 10-minute One-Question session | `one-question.html` |
| 30-minute session | `consultation-30.html` |
| 1-hour session | `consultation-60.html` |
| Details form buyers see after paying | `details.html` |
| Privacy, Terms, Refunds | `privacy.html`, `terms.html`, `refunds.html` |
| Brand guidelines (internal, not in the menu) | `brand.html` |
| Ashima's homepage video script (internal) | `video-script.html` |

Current prices: see `prices` in `site-settings.js`.

`index-v2.html` and `index-v3.html` are colour samples for review only. Rogue Coach Teams rebuilds them from `index.html` with `tools/make_themes.py`, so they can lag behind your edits. Don't edit them.

## 2. Editing words (the usual job)

1. Open the page file on GitHub and click the **pencil** icon (Edit).
2. Press **Ctrl + F** and search for a few words you can see on the live page. If nothing is found, search for just 2 or 3 words: a sentence can be split by a link or a bold word (`<a>`, `<b>`, `<i>`, `<em>`, `<span>`), and some quotes are curly (’ “ ”).
3. Change only the words **between** the tags. For example, in the home page FAQ `<p>Both. On video from anywhere in the world, or in person at 5550 152 St #201, …</p>`, change the sentence and leave `<p>` and `</p>` alone.
4. Click **Commit changes**. The live preview updates in about 1 to 2 minutes. Refresh with **Ctrl + Shift + R**.

Each part of a page starts with a comment like this, so you can find your place:

```
<!-- ===== SECTION: REVIEWS · "Eighty people took the time to write it down." ===== -->
```

**Safe to change:** words, headings, button labels, FAQ questions and answers, image `alt="…"` descriptions.
**Leave alone:** anything inside `< >` such as `class="…"`, `data-offer="…"`, `data-price="…"` or `data-email`, and the `<!-- SHARED … -->` and `<!-- SECTION … -->` lines.

Mistakes are easy to undo: on GitHub, open the file's **History**, pick the earlier version and restore it.

## 3. Prices and buy links

Prices on the pages come from `site-settings.js`. Change `"consult-60": "$149"` there and every 1-hour price shown on every page updates, including the Terms and Refunds pages.

In the page files you will still see the old number inside `<span data-price="…">$149</span>`. That is normal: the page swaps in the price from `site-settings.js`, and changing the number inside the span does nothing. (Tidy-up, optional: change those numbers too with find and replace.)

If a price changes, **also**:
1. Create a new Payment Link in Stripe for the new price. Set its after-payment page to `details.html?offer=<key>&session_id={CHECKOUT_SESSION_ID}` (for example `https://…/details.html?offer=consult-60&session_id={CHECKOUT_SESSION_ID}`), so buyers land on the details form and each sale is counted once in Google Analytics.
2. Paste the new link into `links` in `site-settings.js`.
3. Prices in page titles and Google descriptions are **not** automatic. Search for the old price (e.g. `$149`) and change it in the `<title>` and `<meta name="description">` lines at the top of: 1-hour: `consultation-60.html` (title) and `sessions.html`. 30-minute: `consultation-30.html` (title) and `sessions.html`. One-Question: `one-question.html` (title) and `sessions.html`. VIP: `vip.html` (description) and `sessions.html`. Live sessions: `empower.html` (title and description) and `sessions.html`.
4. Tell Rogue Coach Teams, so the sales log and the buyer emails show the right product (they match products by amount).

House rules for the words:
- All prices are in **USD** and **non-refundable**. Never promise a refund or a free trial.
- Only the WhatsApp community and the Calm Mind Reset are **free**. Never call the Skool community or anything paid "free".
- 1:1 coaching shows **no price**: it is by application, and the price is given on the call.
- No medical promises (no "cures", "heals depression", "anxiety-free"). Ashima offers guidance, not treatment.
- Never write "NLP": say "mind reprogramming".
- The **private** WhatsApp group link for paying members must never go on the website. Members get it after paying.

## 4. Photos

- Keep the same file name and replace the file in `assets/`, and the new photo appears wherever the old one did. Use JPG or WebP, about 1600 px on the long side and under 400 KB (compress it at squoosh.app).
- Some photos exist twice, as `.webp` and `.png`/`.jpg` (for example `assets/ashima-cutout-speaking.webp` and `.png`). Replace both, or most visitors keep seeing the old one.
- If the new photo shows something different, also update its `alt="…"` text (Ctrl + F the file name).
- To use a new file name, find the old name in the page (Ctrl + F, e.g. `ashima-seated.jpg`) and change it in `src="assets/…"`.
- Stock photo and clip-art credits are in `assets/stock/CREDITS.txt`, `assets/story/CREDITS.md`, `assets/art7/CREDITS.txt` and `assets/film/CREDITS.txt`. Add a line when you add one.
- Client faces that are blurred must stay blurred.

## 5. Menu, footer and mobile bar (shared parts)

These appear on every page except `brand.html` and `video-script.html`. In each page they sit between `<!-- SHARED:menu START … -->` and `<!-- SHARED:menu END -->` (also `footer` and `mobile-bar`). To change one:
1. Edit `_shared/menu.html` (or `footer.html`, `mobile-bar.html`) and commit.
2. Ask Rogue Coach Teams to run `python tools/sync_shared.py`. It copies the new version into every page in a few seconds. Never edit the menu inside a single page: the next sync overwrites it.

The home page has its own footer (with the Calm Mind Reset form) and its own mobile bar, marked `SECTION: FOOTER (home page only …)` and `SECTION: MOBILE BAR (home page only …)` in `index.html`. Edit those directly, and if you change a footer link there, change it in `_shared/footer.html` too.

## 6. Where leads and sales go

| What happens on the site | Where it goes |
|---|---|
| Calm Mind Reset sign-up (footer form or pop-up) | Brevo list #3, which sends the welcome email and the day-2 and day-5 emails |
| Coaching application | Brevo list #9 (the "I've received your application" email). The applicant's WhatsApp also opens with their answers ready to send to Ashima; it only arrives if they press Send |
| A purchase on Stripe | Brevo list #8 (buyer welcome email, day-10 check-in) |
| Details form after paying (birth details and palm photos) | the client details page for Ashima's team (Rogue Coach Teams has the private link) |
| **All of the above** | the **leads log** (applications with all their answers), shown in the Google Sheet "Ashima Empowers - Website leads and sales" |

The sheet refreshes itself about once an hour. For a live view, open the leads page link kept with the sheet. Add your own notes in the columns to the **right** of the data, and they stay next to the right row as new leads arrive (new rows are added at the bottom).

## 7. Google Analytics (GA4)

The tracking code is on every public page (not `brand.html` or `video-script.html`) and switches on when you add the ID:
1. In GA4: Admin → Data streams → Web → copy the **Measurement ID** (starts with `G-`).
2. In `site-settings.js`, put it in `ga4: "G-XXXXXXXXXX",` and commit.
3. In GA4 → Admin → Events, mark `purchase`, `generate_lead` and `sign_up` as **key events**.

Besides page views, the site sends `begin_checkout` (a buy button is clicked, with the price), `purchase` (the details page opens after a Stripe payment), `generate_lead` (coaching application), `sign_up` (Calm Mind Reset), `details_submitted`, `join_group` (WhatsApp or Skool community link) and `contact` (WhatsApp chat). Check it works in GA4 → Reports → Realtime while you click around the site.

## 8. Before the site goes live on ashimaempowers.com

The preview is hidden from Google on purpose. When it replaces the real site:
- remove `<meta name="robots" content="noindex, nofollow">` from every page, and delete `robots.txt`
- delete `index-v2.html`, `index-v3.html` and the `themes/` folder (once a colour is chosen)
- set each Stripe Payment Link's after-payment page to `https://ashimaempowers.com/details.html?offer=<key>&session_id={CHECKOUT_SESSION_ID}`
- add the GA4 ID (section 7). The details form and the leads log already accept ashimaempowers.com, so nothing to change there

## 9. For developers (Rogue Coach Teams)

- Styles: inner pages load `home.css`, `pages.css`, `v7.css`, `v9.css`; the home page loads `home.css`, `v7.css`, `v8.css`, `v9.css`. Make new design changes in `v9.css`.
- `site-settings.js` (settings) and `analytics.js` (GA4, only when `ga4` is set) load in the `<head>` of every public page. `main.js` is the behaviour: menu, buy buttons, prices, forms, pop-up, leads log and analytics events. `home.js` is the home page film, session picker, video lightbox and the Google reviews list (`REVIEWS`); it is loaded on every page.
- `tools/sync_shared.py` copies `_shared/*.html` into every page (keeps each file's line endings, warns about missing markers). `tools/make_themes.py` rebuilds the colour samples from `index.html`; run it after any CSS or home page change while the samples are still in use.
- The old page generator is retired (`_build/archive/`, not deployed). Pages are edited directly, so never re-run it. The team edits on GitHub, so pull before changing anything locally.
- Back-end code (Cloudflare Workers for the details form, the leads log and Stripe buyers) is in `client-details-worker/` and `stripe-brevo-worker/` on the team's machine, not in this repository. The details Worker writes details submissions to the leads log itself.
