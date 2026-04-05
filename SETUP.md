# Can Cleaning Co. — Website Setup Guide

## Quick Start

1. **Add your logo** — copy your logo image to `images/logo.png`
2. **Update contact info** — search all HTML files for `TODO:` comments
3. **Set up Square payments** — see Square Setup below
4. **Set up contact form** — see Form Submission below
5. **Deploy** — upload to GitHub Pages, Netlify, or any web host

---

## File Structure

```
can-cleaning-co/
├── index.html          ← Home page
├── book.html           ← Residential booking + payment
├── monthly-plan.html   ← Monthly subscription landing page
├── commercial.html     ← Commercial quote request form
├── about.html          ← About Us page
├── contact.html        ← Contact page with form
├── css/
│   └── styles.css      ← All styles (edit colors/fonts here)
├── js/
│   ├── main.js                ← Navigation, FAQ, service area check
│   ├── booking.js             ← Booking form logic + pricing
│   └── square-integration.js ← Square payment setup
└── images/
    └── logo.png        ← YOUR LOGO (add this file!)
```

---

## TODO Checklist

Search for `TODO:` in any file to find all items to customize.

### Required before going live:
- [ ] Add `images/logo.png`
- [ ] Update phone number (currently: `(972) 555-0100`)
- [ ] Update email (currently: `hello@cancleaningco.com`)
- [ ] Set up Square payments (see below)
- [ ] Set up contact/commercial form submissions (see below)
- [ ] Update service area cities/zip codes in `js/main.js`

### Optional:
- [ ] Add favicon (`<link rel="icon" href="images/favicon.ico">` already in `<head>`)
- [ ] Replace placeholder testimonials with real ones
- [ ] Add real team photo on About page
- [ ] Add real social media links in footer

---

## Google Calendar Appointment Scheduling

The booking page embeds your Google Calendar scheduling page so customers can pick real available time slots.

### Steps to set it up:

1. Go to [calendar.google.com](https://calendar.google.com) (sign in with your Google Workspace account)
2. Click **+ Create** → **Appointment schedule**
3. Fill in:
   - Name: e.g. "Trash Can Cleaning"
   - Duration: 30 min (or however long your service takes per stop)
   - Availability: set your working hours (Mon–Sat 7am–6pm)
   - Scheduling window: how far in advance people can book
4. Click **Next** → **Open booking page**
5. Copy the URL — it looks like:
   `https://calendar.google.com/calendar/appointments/schedules/AbCdEfG123...`
6. Open `book.html` and find this line (around line 168):
   ```html
   src="https://calendar.google.com/calendar/appointments/schedules/REPLACE_WITH_YOUR_SCHEDULE_ID?gv=true"
   ```
7. Replace `REPLACE_WITH_YOUR_SCHEDULE_ID` with your actual schedule ID from the URL you copied. Keep `?gv=true` at the end.

**Result:** Customers see your live calendar, pick an available slot, it books directly into your Google Calendar, and they get a confirmation email automatically.

---

## Square Payment Setup

### Option A: Square Web Payments SDK (Custom card form)
*Best for seamless on-site checkout. Requires a backend server.*

1. Go to [developer.squareup.com](https://developer.squareup.com)
2. Create or open your application
3. Go to **Credentials** → copy your **Application ID** and **Location ID**
4. Open `js/square-integration.js` and set:
   ```js
   APPLICATION_ID: 'your-application-id-here',
   LOCATION_ID: 'your-location-id-here',
   ```
5. Uncomment the Square SDK `<script>` tag in `book.html`:
   ```html
   <!-- For sandbox testing: -->
   <script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>
   <!-- For production: -->
   <script src="https://web.squarecdn.com/v1/square.js"></script>
   ```
6. Set up a backend endpoint at `/api/process-payment` to complete charges
   - Square docs: https://developer.squareup.com/docs/web-payments/take-card-payment
   - For subscriptions: https://developer.squareup.com/docs/subscriptions-api/overview

### Option B: Square Payment Links (No backend needed — easiest!)
1. Log into your Square Dashboard
2. Go to **Online Checkout** → **Payment Links**
3. Create two links:
   - One-time: Item = "Trash Can Cleaning", price = "$15 × quantity"
   - Monthly: Subscription item at $45/month
4. Open `js/square-integration.js` and update:
   ```js
   const PAYMENT_LINKS = {
     ONE_TIME: 'https://square.link/your-one-time-link',
     MONTHLY: 'https://square.link/your-monthly-link',
   };
   ```
5. Update the `processSquarePayment()` function to redirect:
   ```js
   window.location.href = PAYMENT_LINKS.ONE_TIME; // or MONTHLY
   ```

---

## Contact / Commercial Form Submission

The contact and commercial forms currently simulate submission (for demo). To receive real submissions:

### Option A: Formspree (Free, no backend)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a form and copy your form ID
3. In `contact.html` and `commercial.html`, uncomment and update:
   ```js
   const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data),
   });
   ```

### Option B: Netlify Forms (if hosting on Netlify)
Add `data-netlify="true"` to your `<form>` tags. Netlify handles the rest automatically.

### Option C: EmailJS (Client-side email sending)
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create a template and get your service/template IDs
3. Add the EmailJS script and call `emailjs.send(...)` on form submit

---

## Updating Pricing

All pricing is centralized in `js/booking.js`:

```js
const PRICING = {
  ONE_TIME_PER_CAN: 15,   // $15 per trash can, one-time
  MONTHLY_FLAT: 45,        // $45/month regardless of number of cans
};
```

Update these two values and all pricing calculations will update automatically throughout the booking flow.

Also manually update the pricing shown in `index.html` and `monthly-plan.html` (pricing cards).

---

## Updating Service Area

Edit the zip code list and city list in `js/main.js`:

```js
const DALLAS_ZIPS = new Set([
  '75201', '75202', // ... add/remove zips
]);

const DALLAS_CITIES = [
  'dallas', 'plano', // ... add/remove cities
];
```

---

## Deployment Options

### GitHub Pages (Free)
1. Push to a GitHub repo
2. Go to Settings → Pages → Deploy from branch `main`
3. Your site will be at `https://yourusername.github.io/repo-name/`

### Netlify (Free, recommended)
1. Drag and drop the `can-cleaning-co/` folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Get a free URL instantly
3. Connect to GitHub for auto-deploys
4. Add a custom domain in settings

### Vercel (Free)
Similar to Netlify — connect your GitHub repo and deploy automatically.

---

## Brand Colors (CSS Variables)

To change the color scheme, edit the variables at the top of `css/styles.css`:

```css
:root {
  --blue:        #1565C0;   /* Primary brand blue */
  --blue-dark:   #0D47A1;   /* Dark blue (hover states, header) */
  --blue-light:  #1E88E5;   /* Light blue */
  --yellow:      #FFC107;   /* Accent yellow (CTAs) */
  --yellow-dark: #F9A825;   /* Darker yellow */
}
```
