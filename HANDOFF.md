# Can Cleaning Co. — AI Handoff Document
*Pass this file to a new AI to pick up where we left off.*

---

## Project Overview
A complete, mobile-first website for **Can Cleaning Co.**, a family-owned residential and commercial trash can cleaning business serving the Dallas, TX area.

**Location on disk:** `/Users/tylerpeyton/can-cleaning-co/`

---

## Business Details (confirmed)
| Field | Value |
|-------|-------|
| Business Name | Can Cleaning Co. |
| Phone | (254) 229-8753 / tel:+12542298753 |
| Email | info@can-cleaning-co.com |
| Service Area | Dallas, TX and surrounding suburbs |
| Facebook | To be added later (placeholder `href="#"` currently in all footers) |
| One-time price | $15 per trash can |
| Monthly price | $45/month flat (all cans) |

---

## File Structure
```
can-cleaning-co/
├── index.html           Home page
├── book.html            Residential booking (3-step: service → schedule/details → payment)
├── monthly-plan.html    Monthly plan landing page
├── commercial.html      Commercial quote request form
├── about.html           About Us
├── contact.html         Contact + service area checker
├── css/styles.css       All styles — CSS variables for brand colors at top
├── js/main.js           Nav, FAQ accordion, Dallas zip/city checker, form validation
├── js/booking.js        3-step booking form, live price calc, Google Calendar init
├── js/square-integration.js  Square Web Payments SDK placeholder
├── images/logo.png      ✅ Logo added (family cartoon with cleaning equipment)
├── SETUP.md             Full setup instructions
└── HANDOFF.md           This file
```

---

## What's Built & Working
- [x] 6 fully designed, mobile-responsive HTML pages
- [x] Sticky navigation with mobile hamburger menu
- [x] Hero section with floating logo animation
- [x] How It Works (3 steps), Benefits, Pricing cards, FAQ accordion
- [x] Dallas service area zip code + city checker widget
- [x] Testimonial cards (placeholder copy — needs real reviews)
- [x] Email signup form (currently simulated — needs email provider)
- [x] 3-step residential booking form with live price calculator
- [x] Google Calendar Appointment Scheduling embed in booking step 2
- [x] Square payment integration structure with full setup instructions
- [x] Commercial quote request form (13 fields, simulated submission)
- [x] Contact form (simulated submission)
- [x] Sticky mobile CTA bar (bottom of screen on phones)
- [x] Footer with contact info, links, social placeholders
- [x] Real phone + email set on all pages

---

## Still Needs To Be Done (user's TODO list)

### High Priority (needed to go live)
1. **Square payments** — open `js/square-integration.js`, follow the instructions to add Application ID + Location ID. Easiest option: use Square Payment Links (no backend needed).
2. **Google Calendar scheduling** — in `book.html` around line 168, replace `REPLACE_WITH_YOUR_SCHEDULE_ID` with the real schedule ID from Google Calendar → Create → Appointment Schedule.
3. **Contact/commercial form submissions** — currently simulated. Connect to Formspree (free, easiest) or Netlify Forms. Instructions in `SETUP.md`.

### Lower Priority
4. **Facebook link** — user said they'll add it later. Search all HTML files for `href="#" aria-label="Facebook"` and replace `#` with the real Facebook URL.
5. **Real testimonials** — replace the 3 placeholder testimonial cards in `index.html` and `monthly-plan.html`.
6. **Business hours** — update the hours table in `contact.html` if needed (currently Mon–Sat 7am–6pm).
7. **Deploy** — drag-and-drop to Netlify or push to GitHub Pages. Full instructions in `SETUP.md`.

---

## Tech Stack
- Pure HTML5, CSS3, vanilla JavaScript — no frameworks, no build tools
- Google Fonts: Inter
- Square Web Payments SDK (not yet active — placeholder)
- Google Calendar Appointment Scheduling embed (not yet active — placeholder)
- Fully static — can be hosted anywhere (GitHub Pages, Netlify, Vercel, any web host)

---

## Brand Colors (in css/styles.css)
```css
--blue:        #1565C0   /* Primary */
--blue-dark:   #0D47A1   /* Dark blue */
--blue-light:  #1E88E5   /* Light blue */
--yellow:      #FFC107   /* Accent (CTAs) */
--yellow-dark: #F9A825
```

---

## Key Code Locations
| What | File | Where |
|------|------|--------|
| Pricing config | `js/booking.js` | Top of file — `const PRICING = {...}` |
| Square credentials | `js/square-integration.js` | Top — `SQUARE_CONFIG` object |
| Square payment links | `js/square-integration.js` | `PAYMENT_LINKS` object |
| Google Calendar URL | `book.html` | ~line 168 — iframe `src` attribute |
| Dallas zip codes | `js/main.js` | `DALLAS_ZIPS` Set |
| Dallas city names | `js/main.js` | `DALLAS_CITIES` array |
| Facebook link | All HTML footers | `href="#" aria-label="Facebook"` |
| Contact form submit | `contact.html` | Bottom `<script>` block |
| Commercial form submit | `commercial.html` | Bottom `<script>` block |
