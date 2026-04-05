/* ============================================
   Can Cleaning Co. — Residential Booking Logic
   Handles multi-step form, pricing, and payment
   ============================================ */

// ─── PRICING CONFIGURATION ───────────────────
// Edit these values to update your pricing
const PRICING = {
  ONE_TIME_PER_CAN: 15,   // $15 per trash can, one-time
  MONTHLY_FLAT: 45,        // $45/month regardless of number of cans
};

// ─── State ────────────────────────────────────
let currentStep = 1;
const TOTAL_STEPS = 3;

let orderState = {
  serviceType: 'one-time',  // 'one-time' | 'monthly'
  canCount: 1,
  subtotal: 0,
  date: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
};

// ─── Step Navigation ──────────────────────────
function goToStep(step) {
  if (step < 1 || step > TOTAL_STEPS) return;
  document.querySelectorAll('.booking-step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.add('active');

  // Update step indicator
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 < step) dot.classList.add('done');
    else if (i + 1 === step) dot.classList.add('active');
  });

  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep() {
  const step = document.getElementById(`step-${currentStep}`);
  if (step) {
    const fields = step.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) {
      const firstInvalid = step.querySelector('.invalid');
      firstInvalid?.focus();
      return;
    }
    // Google Calendar confirmation check on step 2
    if (currentStep === 2) {
      const gcalCheck = document.getElementById('gcal-confirmed');
      const gcalError = document.getElementById('gcal-confirmed-error');
      if (gcalCheck && !gcalCheck.checked) {
        gcalError.textContent = 'Please select your appointment time on the calendar above first.';
        gcalError.classList.add('show');
        gcalCheck.closest('.gcal-confirm-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (gcalError) gcalError.classList.remove('show');

      // Service area check
      const zip = document.getElementById('zip')?.value || '';
      const check = checkServiceArea(zip);
      if (check === false) {
        showStep2AreaError();
        return;
      }
    }
    collectStepData(currentStep);
  }
  updateOrderSummary();
  goToStep(currentStep + 1);
}

function prevStep() {
  goToStep(currentStep - 1);
}

function showStep2AreaError() {
  const alert = document.getElementById('step2-area-alert');
  if (alert) {
    alert.textContent = 'Sorry, we don\'t currently service that zip code. We serve the greater Dallas area. Please confirm your location or contact us.';
    alert.className = 'alert show alert-error';
    alert.scrollIntoView({ behavior: 'smooth' });
  }
}

function collectStepData(step) {
  if (step === 1) {
    const typeRadio = document.querySelector('input[name="service-type"]:checked');
    orderState.serviceType = typeRadio ? typeRadio.value : 'one-time';
    orderState.canCount = parseInt(document.getElementById('can-count')?.value || '1');
  }
  if (step === 2) {
    orderState.date = 'Selected via Google Calendar';
    orderState.name = document.getElementById('customer-name')?.value || '';
    orderState.email = document.getElementById('customer-email')?.value || '';
    orderState.phone = document.getElementById('customer-phone')?.value || '';
    orderState.address = document.getElementById('street-address')?.value || '';
    orderState.city = document.getElementById('city')?.value || '';
    orderState.zip = document.getElementById('zip')?.value || '';
  }
  calculatePrice();
}

// ─── Pricing Calculation ─────────────────────
function calculatePrice() {
  if (orderState.serviceType === 'monthly') {
    orderState.subtotal = PRICING.MONTHLY_FLAT;
  } else {
    orderState.subtotal = PRICING.ONE_TIME_PER_CAN * orderState.canCount;
  }
}

function updateOrderSummary() {
  calculatePrice();

  const serviceEl = document.getElementById('summary-service');
  const cansEl = document.getElementById('summary-cans');
  const priceEl = document.getElementById('summary-price');
  const totalEl = document.getElementById('summary-total');
  const billingEl = document.getElementById('summary-billing');
  const savingsEl = document.getElementById('summary-savings');

  if (serviceEl) serviceEl.textContent = orderState.serviceType === 'monthly' ? 'Monthly Subscription' : 'One-Time Cleaning';
  if (cansEl) cansEl.textContent = orderState.canCount;

  const amount = orderState.subtotal;
  if (priceEl) priceEl.textContent = formatCurrency(amount);
  if (totalEl) totalEl.textContent = formatCurrency(amount);

  if (billingEl) {
    billingEl.textContent = orderState.serviceType === 'monthly' ? 'per month, cancel anytime' : 'one-time charge';
  }

  // Show savings for monthly vs one-time with multiple cans
  if (savingsEl) {
    const oneTimeEquiv = PRICING.ONE_TIME_PER_CAN * orderState.canCount;
    const savings = oneTimeEquiv - PRICING.MONTHLY_FLAT;
    if (orderState.serviceType === 'monthly' && orderState.canCount >= 3 && savings > 0) {
      savingsEl.textContent = `You save $${savings}/month vs one-time!`;
      savingsEl.style.display = 'block';
    } else {
      savingsEl.style.display = 'none';
    }
  }

  // Populate review step
  const reviewEl = document.getElementById('review-details');
  if (reviewEl) {
    reviewEl.innerHTML = `
      <div class="summary-line"><span class="summary-label">Service</span><span class="summary-value">${orderState.serviceType === 'monthly' ? 'Monthly Plan' : 'One-Time'}</span></div>
      <div class="summary-line"><span class="summary-label">Trash Cans</span><span class="summary-value">${orderState.canCount}</span></div>
      <div class="summary-line"><span class="summary-label">Date</span><span class="summary-value">${formatDate(orderState.date)}</span></div>
      <div class="summary-line"><span class="summary-label">Name</span><span class="summary-value">${escapeHtml(orderState.name)}</span></div>
      <div class="summary-line"><span class="summary-label">Email</span><span class="summary-value">${escapeHtml(orderState.email)}</span></div>
      <div class="summary-line"><span class="summary-label">Address</span><span class="summary-value">${escapeHtml(orderState.address + ', ' + orderState.city + ', TX ' + orderState.zip)}</span></div>
      <div class="summary-line"><span class="summary-label"><strong>Total</strong></span><span class="summary-value"><strong>${formatCurrency(orderState.subtotal)}${orderState.serviceType === 'monthly' ? '/mo' : ''}</strong></span></div>
    `;
  }
}

// ─── Price Display Updates (live) ────────────
function updatePriceDisplay() {
  const serviceType = document.querySelector('input[name="service-type"]:checked')?.value || 'one-time';
  const canCount = parseInt(document.getElementById('can-count')?.value || '1');

  orderState.serviceType = serviceType;
  orderState.canCount = canCount;
  calculatePrice();

  const livePrice = document.getElementById('live-price');
  const liveDesc = document.getElementById('live-desc');
  if (livePrice) livePrice.textContent = formatCurrency(orderState.subtotal);
  if (liveDesc) {
    if (serviceType === 'monthly') {
      liveDesc.textContent = `Flat $${PRICING.MONTHLY_FLAT}/month — clean as many cans as you have!`;
    } else {
      liveDesc.textContent = `$${PRICING.ONE_TIME_PER_CAN} × ${canCount} can${canCount !== 1 ? 's' : ''} = ${formatCurrency(orderState.subtotal)}`;
    }
  }

  // Show monthly savings hint
  const hint = document.getElementById('monthly-hint');
  if (hint) {
    if (serviceType === 'one-time' && canCount >= 3) {
      const savings = (PRICING.ONE_TIME_PER_CAN * canCount) - PRICING.MONTHLY_FLAT;
      if (savings > 0) {
        hint.textContent = `💡 Save $${savings} with a monthly subscription for ${canCount} cans!`;
        hint.classList.add('show');
      }
    } else if (serviceType === 'monthly' && canCount >= 3) {
      const savings = (PRICING.ONE_TIME_PER_CAN * canCount) - PRICING.MONTHLY_FLAT;
      if (savings > 0) {
        hint.textContent = `✓ You're saving $${savings}/month vs one-time pricing!`;
        hint.classList.add('show');
      } else {
        hint.classList.remove('show');
      }
    } else {
      hint.classList.remove('show');
    }
  }
}

// ─── Payment Form Submission ──────────────────
function initPaymentForm() {
  const payBtn = document.getElementById('pay-btn');
  if (!payBtn) return;

  payBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    collectStepData(2);

    const paymentData = {
      serviceType: orderState.serviceType,
      canCount: orderState.canCount,
      amountCents: Math.round(orderState.subtotal * 100),
      name: orderState.name,
      email: orderState.email,
      phone: orderState.phone,
      address: `${orderState.address}, ${orderState.city}, TX ${orderState.zip}`,
      date: orderState.date,
      description: orderState.serviceType === 'monthly'
        ? `Can Cleaning Co. Monthly Subscription`
        : `Can Cleaning Co. One-Time Service (${orderState.canCount} can${orderState.canCount !== 1 ? 's' : ''})`,
    };

    await processSquarePayment(paymentData);
  });
}

// ─── Google Calendar iframe setup ────────────
function initGoogleCalendar() {
  const iframe = document.getElementById('gcal-iframe');
  const placeholder = document.getElementById('gcal-placeholder');
  if (!iframe || !placeholder) return;

  const isPlaceholder = iframe.src.includes('REPLACE_WITH_YOUR_SCHEDULE_ID');
  if (isPlaceholder) {
    iframe.style.display = 'none';
    placeholder.style.display = 'block';
  }
}

// ─── Utility ─────────────────────────────────
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initGoogleCalendar();

  // Service type & can count live updates
  document.querySelectorAll('input[name="service-type"]').forEach(r => {
    r.addEventListener('change', updatePriceDisplay);
  });
  const canCountInput = document.getElementById('can-count');
  if (canCountInput) {
    canCountInput.addEventListener('input', updatePriceDisplay);
    canCountInput.addEventListener('change', updatePriceDisplay);
  }
  updatePriceDisplay();

  // Step navigation buttons
  document.getElementById('next-step-1')?.addEventListener('click', () => nextStep());
  document.getElementById('next-step-2')?.addEventListener('click', () => nextStep());
  document.getElementById('prev-step-2')?.addEventListener('click', () => prevStep());
  document.getElementById('prev-step-3')?.addEventListener('click', () => prevStep());

  // Initialize Square
  initSquarePayments();
  initPaymentForm();
  updateOrderSummary();

  // Zip code change clears service area error
  document.getElementById('zip')?.addEventListener('input', function() {
    const alert = document.getElementById('step2-area-alert');
    if (alert) alert.className = 'alert';
  });
});
