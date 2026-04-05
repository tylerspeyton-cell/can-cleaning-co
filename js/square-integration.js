/* ============================================
   Can Cleaning Co. — Square Payment Integration

   SETUP INSTRUCTIONS:
   ──────────────────────────────────────────
   1. Create a Square Developer account at https://developer.squareup.com
   2. Create an application in the Square Developer Dashboard
   3. Replace the placeholder values below with your actual credentials
   4. For subscriptions, you need a backend server (Node.js/PHP/etc.)
      OR use Square Payment Links (no backend required - see Option B)

   TWO OPTIONS:
   ─────────────
   OPTION A: Web Payments SDK (this file) — custom card form on your site
     • Requires a backend to create the actual charge/subscription
     • Most seamless user experience

   OPTION B: Square Payment Links (easier, no backend)
     • Go to Square Dashboard > Online Checkout > Payment Links
     • Create a "One-time service" item at $15/unit
     • Create a "Monthly plan" item at $45/month
     • Paste the generated links into the PAYMENT_LINKS section below
     • Replace the pay() function to redirect to those links instead
   ============================================ */

// ─── CONFIGURE YOUR SQUARE CREDENTIALS HERE ─────────────────────────────────

const SQUARE_CONFIG = {
  // TODO: Replace with your Square Application ID
  // Found in Square Developer Dashboard > Applications > [Your App] > Credentials
  // Use sandbox ID (starts with "sandbox-sq0idb") for testing
  // Use production ID (starts with "sq0idb") for live payments
  APPLICATION_ID: 'REPLACE_WITH_YOUR_SQUARE_APPLICATION_ID',

  // TODO: Replace with your Square Location ID
  // Found in Square Developer Dashboard > [Your App] > Locations
  LOCATION_ID: 'REPLACE_WITH_YOUR_SQUARE_LOCATION_ID',

  // Set to true for production, false for sandbox/testing
  PRODUCTION: false,
};

// ─── OPTION B: Square Payment Links ─────────────────────────────────────────
// If using Square Payment Links (easier setup), paste your links here
const PAYMENT_LINKS = {
  ONE_TIME: 'https://square.link/u/nABuQJvF',
  MONTHLY: 'https://square.link/u/ufEBAgeW',
};

// ─── Square Web Payments SDK ─────────────────────────────────────────────────

let squarePayments = null;
let squareCard = null;

async function initSquarePayments() {
  const container = document.getElementById('card-container');
  if (!container) return;

  // Check if real credentials are set
  if (SQUARE_CONFIG.APPLICATION_ID.startsWith('REPLACE_')) {
    showSquarePlaceholder();
    return;
  }

  try {
    // Load Square Web Payments SDK
    // For sandbox testing: https://sandbox.web.squarecdn.com/v1/square.js
    // For production:      https://web.squarecdn.com/v1/square.js
    squarePayments = Square.payments(SQUARE_CONFIG.APPLICATION_ID, SQUARE_CONFIG.LOCATION_ID);
    squareCard = await squarePayments.card({
      style: {
        '.input-container': {
          borderColor: '#E2E8F0',
          borderRadius: '8px',
        },
        '.input-container.is-focused': {
          borderColor: '#1565C0',
        },
        '.message-text': {
          color: '#64748B',
        },
        '.message-icon': {
          color: '#64748B',
        },
      }
    });
    await squareCard.attach('#card-container');
    console.log('Square card form attached successfully');
  } catch (err) {
    console.error('Failed to initialize Square:', err);
    showSquarePlaceholder('Square payment form failed to load. Please refresh the page.');
  }
}

function showSquarePlaceholder(message) {
  const container = document.getElementById('card-container');
  if (!container) return;
  container.innerHTML = `
    <div class="square-placeholder">
      <strong>⚙️ Square Setup Required</strong><br><br>
      ${message || `To accept live payments, add your Square credentials in <code>js/square-integration.js</code>:<br><br>
      1. Set <code>APPLICATION_ID</code> to your Square App ID<br>
      2. Set <code>LOCATION_ID</code> to your Square Location ID<br>
      3. Set up a backend endpoint to process payments<br><br>
      <strong>Quick alternative:</strong> Use Square Payment Links (no backend needed).
      Create links in your Square Dashboard and update <code>PAYMENT_LINKS</code> in this file.`}
    </div>
  `;
}

// ─── Tokenize Card & Process Payment ─────────────────────────────────────────
async function processSquarePayment(orderData) {
  // If using Payment Links, redirect instead
  if (SQUARE_CONFIG.APPLICATION_ID.startsWith('REPLACE_')) {
    simulatePaymentSuccess(orderData);
    return;
  }

  const btn = document.getElementById('pay-btn');
  const alert = document.getElementById('payment-alert');
  setButtonLoading(btn, true);

  try {
    // Step 1: Tokenize the card
    const tokenResult = await squareCard.tokenize();
    if (tokenResult.status !== 'OK') {
      const errors = tokenResult.errors?.map(e => e.message).join(', ') || 'Card error';
      showAlert(alert, errors, 'error');
      setButtonLoading(btn, false);
      return;
    }

    const token = tokenResult.token;

    // Step 2: Send token + order data to YOUR backend
    // ─────────────────────────────────────────────────────────────────────────
    // TODO: Replace '/api/process-payment' with your actual backend endpoint
    //
    // Your backend should:
    //   - Receive the nonce (token) + order details
    //   - Call Square Payments API: POST /v2/payments
    //   - Return { success: true } or { error: '...' }
    //
    // For subscriptions, your backend should:
    //   - Create/find a Square Customer
    //   - Create a Card on File
    //   - Create a Subscription via POST /v2/subscriptions
    //
    // Backend example (Node.js) available at:
    //   https://developer.squareup.com/docs/web-payments/take-card-payment
    // ─────────────────────────────────────────────────────────────────────────

    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceId: token,
        amount: orderData.amountCents,        // Amount in cents (e.g., 4500 for $45)
        currency: 'USD',
        note: orderData.description,
        customerEmail: orderData.email,
        customerName: orderData.name,
        serviceType: orderData.serviceType,   // 'one-time' or 'monthly'
      }),
    });

    const result = await response.json();

    if (result.success) {
      showPaymentSuccess(orderData);
    } else {
      showAlert(alert, result.error || 'Payment failed. Please try again.', 'error');
      setButtonLoading(btn, false);
    }
  } catch (err) {
    console.error('Payment error:', err);
    showAlert(alert, 'A network error occurred. Please check your connection and try again.', 'error');
    setButtonLoading(btn, false);
  }
}

// ─── Simulate Success (dev/demo mode) ────────────────────────────────────────
function simulatePaymentSuccess(orderData) {
  // In demo mode (no real credentials), show a simulated success
  const btn = document.getElementById('pay-btn');
  setButtonLoading(btn, true);
  setTimeout(() => {
    showPaymentSuccess(orderData);
  }, 1500);
}

function showPaymentSuccess(orderData) {
  const form = document.getElementById('booking-form-wrapper');
  const summary = document.getElementById('order-summary-card');
  const success = document.getElementById('booking-success');

  if (form) form.style.display = 'none';
  if (summary) summary.style.display = 'none';
  if (success) {
    success.classList.add('show');
    const nameEl = success.querySelector('.success-customer-name');
    const emailEl = success.querySelector('.success-email');
    const typeEl = success.querySelector('.success-service-type');
    const amountEl = success.querySelector('.success-amount');
    if (nameEl) nameEl.textContent = orderData.name || '';
    if (emailEl) emailEl.textContent = orderData.email || '';
    if (typeEl) typeEl.textContent = orderData.serviceType === 'monthly' ? 'Monthly Subscription' : 'One-Time Cleaning';
    if (amountEl) amountEl.textContent = formatCurrency(orderData.amountCents / 100);
    success.scrollIntoView({ behavior: 'smooth' });
  }
}

// ─── Utility helpers ──────────────────────────
function setButtonLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle('loading', loading);
}

function showAlert(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = `alert show alert-${type}`;
}

function hideAlert(el) {
  if (!el) return;
  el.className = 'alert';
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
