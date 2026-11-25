# Ashima Empowers website: how to edit it

This website is plain HTML. There is no page builder, no database and no build step: **what you see in each file is what goes on the site.** Change the words and save, and the site updates.

Preview (hidden from Google): https://harryroguecoachteams-cmd.github.io/ashima-empowers-preview/

---

## 1. Where things live

| I want to change… | Edit this file |
|---|---|
| A price, a Stripe buy link, the WhatsApp number, the free WhatsApp community link, or the Google Analytics ID | `site-settings.js` (one file for the whole site) |
| Words on the home page | `index.html` |
| Words on another page | the page's own file (table below) |
| The menu at the top of every page | `_shared/menu.html`, then ask Rogue Coach Teams to run the sync (section 5) |
| The footer or the mobile bar at the bottom of the inner pages | `_shared/footer.html` or `_shared/mobile-bar.html`, then the same sync |
| A photo | replace the file in `assets/` with a new one **of the same name** (section 4) |
| Colours, spacing or button styles | ask Rogue Coach Teams (`v9.css`) |

| Page | File |
|---|---|
| Home | `index.html` |
| About Ashima | `about.html` |
| All sessions | `sessions.html` |
| 1:1 Coaching (with the application form) | `coaching.html` |
| VIP Circle ($199/month) | `vip.html` |
| Empower Your Inner World, live sessions ($21/month) | `empower.html` |
| 10-minute One-Question session ($27) | `one-question.html` |
| 30-minute session ($99) | `consultation-30.html` |
| 1-hour session ($149) | `consultation-60.html` |
| Details form buyers see after paying | `details.html` |
| Privacy, Terms, Refunds | `privacy.html`, `terms.html`, `refunds.html` |

`index-v2.html` and `index-v3.html` are colour samples for review only. They are rebuilt from `index.html` automatically, so don't edit them.

## 2. Editing words (the usual job)

1. Open the page file on GitHub and click the **pencil** icon (Edit).
2. Press **Ctrl + F** and search for a few words you can see on the live page.
3. Change only the words **between** the tags. For example, in `<p>Ashima's team replies within 24 to 48 hours.</p>`, change the sentence and leave `<p>` and `</p>` alone.
4. Click **Commit changes**. The live preview updates in about 1 to 2 minutes. Refresh with **Ctrl + Shift + R**.

Each part of a page starts with a comment like this, so you can find your place:

```
<!-- ===== SECTION: REVIEWS · "What clients say after working with Ashima" ===== -->
```

**Safe to change:** words, headings, button labels, FAQ questions and answers, image `alt="…"` descriptions.
**Leave alone:** anything inside `< >` such as `class="…"`, `data-offer="…"` or `data-price="…"`, and the `<!-- SHARED … -->` and `<!-- SECTION … -->` lines.

Mistakes are easy to undo: on GitHub, open the file's **History**, pick the earlier version and restore it.

## 3. Prices and buy links

Prices on every page come from `site-settings.js`. Change `"consult-60": "$149"` there and every "$149" for the 1-hour session updates on all pages.

If a price changes, **also**:
1. Create a new Payment Link in Stripe for the new price, with the after-payment page set to `details.html?offer=<key>` (for example `…/details.html?offer=consult-60`).
2. Paste the new link into `links` in `site-settings.js`.
3. Update the price in the page descriptions Google shows (the `<meta name="description" …>` line near the top of that page) and in the policy pages (`terms.html`, `refunds.html`).
4. Tell Rogue Coach Teams, so the sales log and the buyer emails show the right product (they match products by amount).

House rules for the words:
- All prices are in **USD** and **non-refundable**. Never promise a refund or a free trial.
- Only the WhatsApp community and the Calm Mind Reset are **free**. Never call the Skool community or anything paid "free".
- 1:1 coaching shows **no price**: it is by application, and the price is given on the call.
- No medical promises (no "cures", "heals depression", "anxiety-free"). Ashima offers guidance, not treatment.
- Never write "NLP": say "mind reprogramming".
- The **private** WhatsApp group link for paying members must never go on the website. It is sent by email and shown only after a member pays.

## 4. Photos

- Keep the same file name and replace the file in `assets/`, and the new photo appears wherever the old one did. Use JPG or WebP, about 1600 px on the long side and under 400 KB (compress it at squoosh.app).
- To use a new file name, find the old name in the page (Ctrl + F, e.g. `ashima-seated.jpg`) and change it in `src="assets/…"`.
- Stock photos and clip art credits are in `assets/stock/CREDITS.txt`, `assets/art7/CREDITS.txt` and `assets/film/CREDITS.txt`. Add a line when you add one.
- Client faces that are blurred must stay blurred.

## 5. Menu, footer and mobile bar (shared parts)

These appear on every page. In each page they sit between `<!-- SHARED:menu START … -->` and `<!-- SHARED:menu END -->` (also `footer` and `mobile-bar`). To change one:
1. Edit `_shared/menu.html` (or `footer.html`, `mobile-bar.html`).
2. Run `python tools/sync_shared.py` in the website folder (Rogue Coach Teams can do this). It copies the new version into every page.

The home page has its own footer (with the Calm Mind Reset form) and its own mobile bar. Edit those directly in `index.html`.

## 6. Where leads and sales go

| What happens on the site | Where it goes |
|---|---|
| Calm Mind Reset sign-up (footer form or pop-up) | Brevo list #3, which sends the welcome email and the day-2 and day-5 emails |
| Coaching application | Brevo list #9 (the "I've received your application" email), plus Ashima's WhatsApp with the full answers |
| A purchase on Stripe | Brevo list #8 (buyer welcome email, day-10 check-in) |
| Details form after paying (birth details and palm photos) | the client details page for Ashima's team (Rogue Coach Teams has the private link) |
| **All of the above** | the **leads log**, shown in the Google Sheet "Ashima Empowers - Website leads and sales" |

The sheet refreshes itself about once an hour. For a live view, open the leads page link kept with the sheet. Add your own notes in the columns to the **right** of the data, and they stay next to the right row as new leads arrive (new rows are added at the bottom).

## 7. Google Analytics (GA4)

The tracking code is already on every page and switches on when you add the ID:
1. In GA4: Admin → Data streams → Web → copy the **Measurement ID** (starts with `G-`).
2. In `site-settings.js`, put it in `ga4: "G-XXXXXXXXXX",` and commit.
3. In GA4 → Admin → Events, mark `purchase`, `generate_lead` and `sign_up` as **key events**.

Besides page views, the site sends `begin_checkout` (a buy button is clicked, with the price), `purchase` (the details page opens after a Stripe payment), `generate_lead` (coaching application), `sign_up` (Calm Mind Reset), `details_submitted`, `join_group` (WhatsApp or Skool community link) and `contact` (WhatsApp chat). Check it works in GA4 → Reports → Realtime while you click around the site.

## 8. Before the site goes live on ashimaempowers.com

The preview is hidden from Google on purpose. When it replaces the real site:
- remove `<meta name="robots" content="noindex, nofollow">` from every page, and `robots.txt`
- delete `index-v2.html`, `index-v3.html` and the `themes/` folder (once a colour is chosen)
- confirm each Stripe Payment Link sends buyers to `https://ashimaempowers.com/details.html?offer=…`
- add the GA4 ID (section 7), and add `ashimaempowers.com` in the details Worker's allowed sites (Rogue Coach Teams; it is already allowed)

## 9. For developers (Rogue Coach Teams)

- Styles load in this order: `home.css`, `pages.css` (inner pages), `v7.css`, `v8.css`, `v9.css`. Make new design changes in `v9.css`.
- `main.js` is the behaviour (menu, buy buttons, forms, pop-up, leads log, analytics events). `home.js` is the home page film, session picker and video lightbox. `analytics.js` loads GA4 only when `ga4` is set.
- `tools/sync_shared.py` copies `_shared/*.html` into every page. `tools/make_themes.py` rebuilds the colour samples from `index.html` (run it after any CSS or home page change while the samples are still in use).
- The old page generator is retired (`_build/archive/`, not deployed). Pages are edited directly, so never re-run it.
- Back-end code (Cloudflare Workers for the details form, the leads log and Stripe buyers) is in `client-details-worker/` and `stripe-brevo-worker/` on the team's machine, not in this repository.
