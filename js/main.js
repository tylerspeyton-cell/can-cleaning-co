/* ============================================
   Can Cleaning Co. — Shared JS
   Navigation, service area check, FAQ, footer signup
   ============================================ */

// ─── Dallas Service Area Zip Codes ───────────
// Edit this list to add or remove zip codes in your service area
const DALLAS_ZIPS = new Set([
  // Dallas proper
  '75201','75202','75203','75204','75205','75206','75207','75208','75209',
  '75210','75211','75212','75214','75215','75216','75217','75218','75219',
  '75220','75221','75222','75223','75224','75225','75226','75227','75228',
  '75229','75230','75231','75232','75233','75234','75235','75236','75237',
  '75238','75240','75241','75242','75243','75244','75246','75247','75248',
  '75249','75250','75251','75252','75253','75254','75270','75287',
  // Plano
  '75023','75024','75025','75026','75074','75075','75093','75094',
  // Frisco
  '75033','75034','75035','75036',
  // McKinney
  '75069','75070','75071','75072',
  // Allen
  '75002','75013',
  // Garland
  '75040','75041','75042','75043','75044','75045','75046','75047','75048',
  // Richardson
  '75080','75081','75082','75083',
  // Irving
  '75014','75015','75016','75017','75038','75039','75061','75062','75063',
  // Grand Prairie
  '75050','75051','75052','75053','75054',
  // Arlington
  '76001','76002','76003','76004','76005','76006','76007','76010','76011',
  '76012','76013','76014','76015','76016','76017','76018','76019',
  // Mesquite
  '75149','75150','75180','75181','75182','75183',
  // Carrollton
  '75006','75007','75010','75011',
  // Lewisville
  '75019','75022','75028','75029','75056','75057','75067','75068',
  // Denton
  '76201','76202','76203','76204','76205','76206','76207','76208','76209',
  '76210','76226','76227',
  // Flower Mound
  '75022','75028',
  // Southlake / Colleyville / Grapevine
  '76034','76051','76092',
  // Addison / Farmers Branch
  '75001','75244',
  // Cedar Hill / DeSoto / Lancaster
  '75104','75115','75116','75134','75137','75138','75141','75146',
  // Duncanville / Mansfield
  '75116','75137','76063',
  // Rockwall / Rowlett / Sachse / Wylie
  '75032','75087','75088','75089','75098',
  // North Richland Hills / Hurst / Euless / Bedford
  '76053','76054','76055','76180','76148','76022','76039','76040',
]);

// Dallas area city names for fuzzy matching
const DALLAS_CITIES = [
  'dallas','plano','frisco','mckinney','allen','garland','richardson',
  'irving','grand prairie','arlington','mesquite','carrollton',
  'lewisville','denton','flower mound','southlake','colleyville',
  'grapevine','addison','farmers branch','cedar hill','desoto',
  'lancaster','duncanville','mansfield','rockwall','rowlett',
  'sachse','wylie','north richland hills','hurst','euless','bedford',
  'fort worth','keller','roanoke','trophy club','westlake','coppell',
];

function checkServiceArea(input) {
  const val = input.trim();
  if (!val) return null;
  // Check zip code
  if (/^\d{5}$/.test(val)) {
    return DALLAS_ZIPS.has(val);
  }
  // Check city name
  const lower = val.toLowerCase().replace(/\s+/g, ' ');
  return DALLAS_CITIES.some(c => lower.includes(c) || c.includes(lower));
}

// ─── Service Area Checker Widget ─────────────
function initServiceAreaCheck() {
  const form = document.getElementById('area-check-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('area-input').value;
    const result = document.getElementById('area-result');
    const check = checkServiceArea(input);
    result.className = '';
    if (check === true) {
      result.textContent = '✓ Great news! We service your area. Book your cleaning today!';
      result.className = 'success';
    } else if (check === false) {
      result.textContent = '✗ We\'re not currently in your area, but we\'re growing! Enter your email below to be notified when we expand.';
      result.className = 'error';
    } else {
      result.textContent = 'Please enter a valid 5-digit zip code or city name.';
      result.className = 'error';
    }
  });
}

// ─── Navigation ───────────────────────────────
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function() {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  // Highlight active page
  const links = document.querySelectorAll('.nav-links a, .nav-mobile a');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── FAQ Accordion ───────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ─── Footer Email Signup ──────────────────────
function initFooterSignup() {
  const form = document.getElementById('footer-signup');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const msg = document.getElementById('signup-success');
    if (msg) {
      msg.textContent = `Thanks! We'll send deals and updates to ${email}.`;
      msg.style.display = 'block';
    }
    form.reset();
    // TODO: Connect to your email provider (Mailchimp, ConvertKit, etc.)
    // sendToEmailProvider(email);
  });
}

// ─── Radio Option Styling ─────────────────────
function initRadioOptions() {
  document.querySelectorAll('.radio-option').forEach(option => {
    const input = option.querySelector('input[type="radio"]');
    if (!input) return;
    option.addEventListener('click', function() {
      const name = input.name;
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.closest('.radio-option')?.classList.remove('selected');
      });
      option.classList.add('selected');
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    if (input.checked) option.classList.add('selected');
  });
}

// ─── Form Validation Helpers ──────────────────
function validateField(input) {
  const group = input.closest('.form-group');
  const error = group?.querySelector('.form-error');
  let valid = true;
  let message = '';

  if (input.required && !input.value.trim()) {
    valid = false;
    message = 'This field is required.';
  } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    valid = false;
    message = 'Please enter a valid email address.';
  } else if (input.type === 'tel' && input.value && !/^[\d\s\-\(\)\+]{7,}$/.test(input.value)) {
    valid = false;
    message = 'Please enter a valid phone number.';
  } else if (input.type === 'number') {
    const val = parseInt(input.value);
    if (input.min && val < parseInt(input.min)) {
      valid = false;
      message = `Minimum value is ${input.min}.`;
    } else if (input.max && val > parseInt(input.max)) {
      valid = false;
      message = `Maximum value is ${input.max}.`;
    }
  }

  input.classList.toggle('invalid', !valid);
  if (error) {
    error.textContent = message;
    error.classList.toggle('show', !valid);
  }
  return valid;
}

function validateForm(form) {
  let allValid = true;
  form.querySelectorAll('[required], input[type="email"]:not([required]), input[type="tel"]:not([required])').forEach(input => {
    if (!validateField(input)) allValid = false;
  });
  return allValid;
}

function initLiveValidation() {
  document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', function() { validateField(this); });
    field.addEventListener('input', function() {
      if (this.classList.contains('invalid')) validateField(this);
    });
  });
}

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initNav();
  initFAQ();
  initServiceAreaCheck();
  initFooterSignup();
  initRadioOptions();
  initLiveValidation();
});
