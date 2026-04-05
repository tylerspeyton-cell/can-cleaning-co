# Can Cleaning Co. — Handoff Document
*Pass this file to a new AI to pick up where we left off.*

---

## Project Overview
A complete, mobile-first website for **Can Cleaning Co.**, a family-owned residential and commercial trash can cleaning business serving the Dallas, TX area.

**Local path:** `/Users/tylerpeyton/can-cleaning-co/`
**GitHub:** https://github.com/tylerspeyton-cell/can-cleaning-co
**Live site:** https://can-cleaning-co.com (GitHub Pages — DNS pending full propagation)

---

## Business Details
| Field | Value |
|-------|-------|
| Business Name | Can Cleaning Co. |
| Phone | (254) 229-8753 |
| Email | info@can-cleaning-co.com |
| Service Area | Dallas and surrounding areas |
| One-time price | $15 per trash can |
| Monthly price | $45/month flat (all cans) |
| Facebook | Placeholder `href="#"` in all footers — add real URL when ready |

---

## File Structure
```
can-cleaning-co/
├── index.html             Home page
├── book.html              Booking page — date picker form → Formspree
├── monthly-plan.html      Monthly plan landing page
├── commercial.html        Commercial quote request form
├── about.html             About Us
├── contact.html           Contact + service area checker
├── css/styles.css         All styles — CSS variables for brand colors at top
├── js/main.js             Nav, FAQ accordion, Dallas zip/city checker, form validation
├── js/booking.js          Old booking logic (not used on book.html anymore — kept for reference)
├── js/square-integration.js  Square SDK placeholder (not active)
├── images/logo.png        Logo (family cartoon with cleaning equipment)
├── CNAME                  can-cleaning-co.com (GitHub Pages custom domain)
├── SETUP.md               Setup instructions
└── HANDOFF.md             This file
```

---

## What's Built & Working
- [x] 6 fully designed, mobile-responsive HTML pages
- [x] Sticky navigation with mobile hamburger menu
- [x] Hero section with logo, tagline, booking CTAs
- [x] How It Works, Benefits, Pricing cards, FAQ accordion
- [x] Dallas service area zip code + city checker widget
- [x] Testimonial cards (placeholder copy — needs real reviews)
- [x] Booking page with service picker (one-time vs monthly) + date picker form
- [x] Booking form submits via Formspree — form ID: `mbdppzga`
- [x] Commercial quote request form
- [x] Contact form
- [x] Sticky mobile CTA bar
- [x] Footer with contact info, links, social placeholders
- [x] Deployed to GitHub Pages with custom domain can-cleaning-co.com

---

## Still Needs To Be Done

### DNS (in progress)
- Add 4 A records pointing `@` to GitHub's IPs and 1 CNAME `www` → `tylerspeyton-cell.github.io` in Google Workspace DNS (Squarespace interface)
- GitHub IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`

### Content
- **Real testimonials** — replace placeholder cards in `index.html` and `monthly-plan.html`
- **Facebook link** — search all HTML files for `href="#" aria-label="Facebook"` and replace `#` with real URL
- **Business hours** — update table in `contact.html` if needed (currently Mon–Sat 7am–6pm)

### Forms
- **Commercial form** (`commercial.html`) — currently simulated, not connected to Formspree yet
- **Contact form** (`contact.html`) — currently simulated, not connected to Formspree yet
- Both can be connected to Formspree the same way as the booking form

---

## Booking Flow (current)
`book.html` uses a simple HTML form — no Calendly, no Square, no multi-step wizard.

1. Customer picks **One-Time** or **Monthly Plan**
2. Fills out name, phone, email, address, number of cans, preferred date
3. Submits → goes to Formspree (`https://formspree.io/f/mbdppzga`) → owner gets email
4. Owner contacts customer to confirm

No time slots — customers pick any date. Unlimited bookings per day.
Payment collected day-of (cash, Venmo, card).

---

## Tech Stack
- Pure HTML5, CSS3, vanilla JavaScript — no frameworks, no build tools
- Google Fonts: Nunito
- Formspree for booking form submissions (form ID: `mbdppzga`)
- Hosted on GitHub Pages with custom domain

---

## Brand Colors
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
| Pricing config | `js/booking.js` | Top — `const PRICING = {...}` |
| Formspree form ID | `book.html` | `action="https://formspree.io/f/mbdppzga"` |
| Service switcher | `book.html` | `switchService()` in bottom `<script>` |
| Dallas zip codes | `js/main.js` | `DALLAS_ZIPS` Set |
| Dallas city names | `js/main.js` | `DALLAS_CITIES` array |
| Facebook link | All HTML footers | `href="#" aria-label="Facebook"` |
| Brand CSS variables | `css/styles.css` | Top of file |
