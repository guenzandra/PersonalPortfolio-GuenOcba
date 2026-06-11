/**
 * login.js — Admin Login + Forgot Password
 * Guen Zandra Portfolio Admin
 *
 * Handles:
 *  - Page loader
 *  - Floating particle system
 *  - Form validation (login + forgot password)
 *  - Password show/hide toggle
 *  - Password strength indicator
 *  - Remember me (localStorage)
 *  - Login form submit with loading state
 *  - Forgot password submit with success state
 *  - Toast notifications
 *  - Modal dialogs (blocked account, max attempts, etc.)
 *  - Ripple button effect
 *  - Input real-time validation
 */

'use strict';

/* ══════════════════════════════════════
   PAGE DETECTION
   Determines which page we're on and runs
   the relevant initializer.
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const isLoginPage         = !!document.getElementById('loginForm');
  const isForgotPasswordPage = !!document.getElementById('forgotPasswordForm');

  initPageLoader();
  injectBaseMarkup();    // adds bg layers, corners, loader, toast container
  initParticles();

  if (isLoginPage)          initLoginPage();
  if (isForgotPasswordPage) initForgotPasswordPage();
});


/* ══════════════════════════════════════
   PAGE LOADER
   Creates and removes the loading overlay.
══════════════════════════════════════ */
function initPageLoader() {
  // Hide after short fixed delay — avoids getting stuck on reload
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 800);
}


/* ══════════════════════════════════════
   BASE MARKUP INJECTION
   Injects background layers, corner marks,
   loader, and toast container into the page
   (so the HTML files stay minimal).
══════════════════════════════════════ */
function injectBaseMarkup() {
  const body = document.body;

  // Background glow
  const bgGlow = document.createElement('div');
  bgGlow.className = 'bg-glow';
  body.prepend(bgGlow);

  // Animated grid
  const bgGrid = document.createElement('div');
  bgGrid.className = 'bg-grid';
  body.prepend(bgGrid);

  // Corner accent marks
  ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(pos => {
    const c = document.createElement('div');
    c.className = `corner-mark ${pos}`;
    body.appendChild(c);
  });

  // Toast container
  if (!document.getElementById('toast-container')) {
    const tc = document.createElement('div');
    tc.id = 'toast-container';
    body.appendChild(tc);
  }

  // Page loader
  if (!document.getElementById('page-loader')) {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <div class="loader-mono">GZ</div>
      <div class="loader-bar-track"><div class="loader-bar-fill"></div></div>
    `;
    body.appendChild(loader);
  }

  // Modal overlay container
  if (!document.getElementById('modal-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-panel" id="modal-panel">
        <button class="modal-close" id="modal-close" aria-label="Close">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="modal-icon-wrap" id="modal-icon-wrap"></div>
        <div class="modal-title" id="modal-title"></div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-actions" id="modal-actions"></div>
      </div>
    `;
    body.appendChild(overlay);

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Close button
    document.getElementById('modal-close').addEventListener('click', closeModal);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Wrap existing page content in .login-wrapper if not already wrapped
  const existing = document.querySelector('.login-container');
  if (existing && !existing.parentElement.classList.contains('login-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'login-wrapper';

    // Insert logo above the card
    wrapper.innerHTML = `
      <div class="login-logo">
        <span class="login-monogram">GZ</span>
        <span class="login-logo-sub">Portfolio Admin</span>
      </div>
    `;

    // Move the .login-container into a card shell
    const card = document.createElement('div');
    card.className = 'login-card';

    existing.parentNode.insertBefore(wrapper, existing);
    card.appendChild(existing);
    wrapper.appendChild(card);

    // Move the card/wrapper to replace the original position in body
    body.appendChild(wrapper);
  }
}


/* ══════════════════════════════════════
   PARTICLE SYSTEM
   Generates small floating circles that
   drift upward for ambient atmosphere.
══════════════════════════════════════ */
function initParticles() {
  const count = 22;
  const colors = [
    'rgba(232,130,154,0.4)',
    'rgba(184,41,60,0.3)',
    'rgba(201,168,76,0.25)',
    'rgba(122,30,46,0.35)',
  ];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 6 + 3; // 3–9px
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      bottom: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * -20}s;
    `;

    document.body.appendChild(p);
  }
}


/* ══════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════ */
function initLoginPage() {
  buildLoginUI();
  initPasswordToggle('password', 'pw-toggle-login');
  initPasswordStrength('password', 'pw-strength-login');
  initRipple(document.querySelector('.btn-submit'));
  loadRememberedUser();
  handleLoginSubmit();

  // Show welcome toast after loader clears
  setTimeout(() => {
    showToast('info', 'Admin Access', 'Enter your credentials to continue.');
  }, 1800);
}


/* ── Build Login UI ──
   Transforms the bare HTML into the styled UI
   by injecting header, icons, extras into the form.
*/
function buildLoginUI() {
  const container = document.querySelector('.login-container');
  if (!container) return;

  // Restyle the h2 into a header block
  const h2 = container.querySelector('h2');
  if (h2) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'login-header';
    headerDiv.innerHTML = `
      <h2>Admin <span class="serif-word">Login</span></h2>
      <p>Restricted area — authorised personnel only.</p>
    `;
    h2.replaceWith(headerDiv);
  }

  // Style form groups with icons
  const usernameGroup = container.querySelector('#username')?.closest('.form-group');
  const passwordGroup = container.querySelector('#password')?.closest('.form-group');

  if (usernameGroup) {
    styleInputGroup(usernameGroup, '#username', 'username', `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>`, 'Enter your username');
    addFieldError(usernameGroup, 'username-error');
  }

  if (passwordGroup) {
    styleInputGroup(passwordGroup, '#password', 'password', `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>`, '••••••••');
    addPasswordToggle(passwordGroup, 'pw-toggle-login');
    addPasswordStrength(passwordGroup, 'pw-strength-login');
    addFieldError(passwordGroup, 'password-error');
  }

  // Insert remember me + forgot password row before submit
  const submitBtn = container.querySelector('button[type="submit"]');
  if (submitBtn) {
    const extras = document.createElement('div');
    extras.className = 'form-extras';
    extras.innerHTML = `
      <label class="remember-wrap">
        <input type="checkbox" id="rememberMe" />
        <span class="remember-label">Remember me</span>
      </label>
    `;

    // Move the existing forgot password link into the extras row
    const existingForgot = container.querySelector('#forgotPasswordLink, a[href*="forgot"]');
    if (existingForgot) {
      existingForgot.className = 'forgot-link';
      existingForgot.textContent = 'Forgot password?';
      extras.appendChild(existingForgot);
      existingForgot.closest('span')?.remove();
    }

    submitBtn.parentNode.insertBefore(extras, submitBtn);

    // Style submit button
    submitBtn.className = 'btn-submit';
    submitBtn.innerHTML = `
      <div class="btn-spinner"></div>
      <span class="btn-label">Sign In</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    `;
  }

  // Remove old span wrapper around forgot link if still present
  container.querySelectorAll('span').forEach(s => {
    if (s.children.length === 0 && s.textContent.trim() === '') s.remove();
  });

  // Security badge below card
  const card = container.closest('.login-card');
  if (card) {
    const badge = document.createElement('div');
    badge.className = 'security-badge';
    badge.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      256-bit SSL encrypted connection
    `;
    card.insertAdjacentElement('afterend', badge);
  }
}


/* ── Handle Login Submit ── */
function handleLoginSubmit() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Static only - no validation or auth. Wire up backend here later.
    window.location.href = 'admin/dashboard.html';
  });
}



/* ── Load Remembered Username ── */
function loadRememberedUser() {
  const saved = localStorage.getItem('gz_admin_user');
  if (saved) {
    const input = document.getElementById('username');
    const check = document.getElementById('rememberMe');
    if (input) input.value = saved;
    if (check) check.checked = true;
  }
}


/* ══════════════════════════════════════
   FORGOT PASSWORD PAGE
══════════════════════════════════════ */
function initForgotPasswordPage() {
  buildForgotUI();
  initRipple(document.querySelector('.btn-submit'));
  handleForgotSubmit();
}


/* ── Build Forgot Password UI ── */
function buildForgotUI() {
  const container = document.querySelector('.login-container');
  if (!container) return;

  // Replace h2
  const h2 = container.querySelector('h2');
  if (h2) {
    const headerDiv = document.createElement('div');
    headerDiv.className = 'login-header';
    headerDiv.innerHTML = `
      <a href="login.html" class="back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to login
      </a>
      <h2>Reset <span class="serif-word">Password</span></h2>
      <p>We'll send a secure reset link to your email address.</p>
    `;
    h2.replaceWith(headerDiv);
  }

  // Style email field
  const emailGroup = container.querySelector('#email')?.closest('.form-group');
  if (emailGroup) {
    styleInputGroup(emailGroup, '#email', 'email', `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>`, 'your@email.com');
    addFieldError(emailGroup, 'email-error');
  }

  // Style submit button
  const submitBtn = container.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.className = 'btn-submit';
    submitBtn.innerHTML = `
      <div class="btn-spinner"></div>
      <span class="btn-label">Send Reset Link</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    `;
  }

  // Add success state block (hidden until submit)
  const successDiv = document.createElement('div');
  successDiv.className = 'success-state';
  successDiv.id = 'forgot-success';
  successDiv.innerHTML = `
    <div class="success-icon-wrap">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    </div>
    <h3>Check your inbox</h3>
    <p>A password reset link has been sent. It expires in 30 minutes. Check your spam folder if it doesn't arrive.</p>
  `;
  container.appendChild(successDiv);

  // Footer link back to login
  const footer = document.createElement('div');
  footer.className = 'login-footer';
  footer.innerHTML = `<a href="login.html">Back to login</a>`;
  container.appendChild(footer);
}


/* ── Handle Forgot Password Submit ── */
function handleForgotSubmit() {
  const form = document.getElementById('forgotPasswordForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailEl  = document.getElementById('email');
    const btn      = form.querySelector('.btn-submit');
    const email    = emailEl?.value.trim() || '';

    clearFieldError('email-error');
    emailEl?.classList.remove('input-error');

    // Validate email
    if (!email) {
      showFieldError('email-error', 'Email address is required.');
      emailEl?.classList.add('input-error');
      return;
    }

    if (!isValidEmail(email)) {
      showFieldError('email-error', 'Enter a valid email address.');
      emailEl?.classList.add('input-error');
      showToast('error', 'Invalid Email', 'Please enter a valid email format.');
      return;
    }

    setButtonLoading(btn, true);

    // Simulate sending reset email (replace with real API call)
    await simulateResetEmail(email)
      .then(() => {
        setButtonLoading(btn, false);

        // Hide form, show success state
        form.style.display = 'none';
        const success = document.getElementById('forgot-success');
        if (success) success.classList.add('show');

        showToast('success', 'Reset Link Sent', `Check ${email} for instructions.`);
      })
      .catch(() => {
        setButtonLoading(btn, false);
        showToast('error', 'Send Failed', 'Could not send the email. Please try again.');
      });
  });

  // Real-time clear
  document.getElementById('email')?.addEventListener('input', () => {
    document.getElementById('email')?.classList.remove('input-error');
    clearFieldError('email-error');
  });
}


/* ── Simulate Reset Email (replace with real API call) ── */
function simulateResetEmail(email) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1600);
  });
}


/* ══════════════════════════════════════
   UI HELPERS
══════════════════════════════════════ */

/**
 * Wraps an existing input in .input-wrap, adds a left icon and placeholder.
 */
function styleInputGroup(group, selector, name, iconSVG, placeholder) {
  const input = group.querySelector(selector);
  if (!input) return;

  input.setAttribute('placeholder', placeholder);
  input.setAttribute('autocomplete', name === 'password' ? 'current-password' : name);

  // Wrap input
  const wrap = document.createElement('div');
  wrap.className = 'input-wrap';

  const iconSpan = document.createElement('span');
  iconSpan.className = 'input-icon';
  iconSpan.innerHTML = iconSVG;

  input.parentNode.insertBefore(wrap, input);
  wrap.appendChild(iconSpan);
  wrap.appendChild(input);
}

/**
 * Appends a password show/hide toggle button to the input wrap.
 */
function addPasswordToggle(group, btnId) {
  const wrap = group.querySelector('.input-wrap');
  if (!wrap) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = btnId;
  btn.className = 'pw-toggle';
  btn.setAttribute('aria-label', 'Toggle password visibility');
  btn.innerHTML = `
    <svg id="${btnId}-icon-show" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
    <svg id="${btnId}-icon-hide" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  `;
  wrap.appendChild(btn);
}

/**
 * Appends a password strength bar to the form group.
 */
function addPasswordStrength(group, barId) {
  const bar = document.createElement('div');
  bar.className = 'pw-strength';
  bar.id = barId;
  bar.innerHTML = `<div class="pw-strength-fill" id="${barId}-fill"></div>`;
  group.appendChild(bar);
}

/**
 * Appends a hidden field error element.
 */
function addFieldError(group, errorId) {
  const err = document.createElement('div');
  err.className = 'field-error';
  err.id = errorId;
  err.innerHTML = `
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span></span>
  `;
  group.appendChild(err);
}

/**
 * Shows a field error message.
 */
function showFieldError(errorId, message) {
  const el = document.getElementById(errorId);
  if (!el) return;
  el.querySelector('span').textContent = message;
  el.classList.add('show');
}

/**
 * Hides a field error message.
 */
function clearFieldError(errorId) {
  const el = document.getElementById(errorId);
  if (!el) return;
  el.classList.remove('show');
}

/**
 * Activates show/hide toggle for a password field.
 */
function initPasswordToggle(fieldId, btnId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(fieldId);
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';

    document.getElementById(`${btnId}-icon-show`).style.display = isHidden ? 'none' : 'block';
    document.getElementById(`${btnId}-icon-hide`).style.display = isHidden ? 'block' : 'none';
  });
}

/**
 * Drives password strength indicator as user types.
 */
function initPasswordStrength(fieldId, barId) {
  const input   = document.getElementById(fieldId);
  const barWrap = document.getElementById(barId);
  const fill    = document.getElementById(`${barId}-fill`);
  if (!input || !fill || !barWrap) return;

  input.addEventListener('input', () => {
    const val = input.value;

    if (!val) {
      barWrap.classList.remove('visible');
      return;
    }

    barWrap.classList.add('visible');
    fill.className = 'pw-strength-fill ' + getPasswordStrength(val);
  });
}

/**
 * Returns 'weak' | 'medium' | 'strong' for a password string.
 */
function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)                          score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw))  score++;
  if (/[0-9]/.test(pw))                        score++;
  if (/[^A-Za-z0-9]/.test(pw))                score++;

  if (score <= 1) return 'weak';
  if (score <= 2) return 'medium';
  return 'strong';
}

/**
 * Adds a ripple effect to a button on click.
 */
function initRipple(btn) {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    const rect    = btn.getBoundingClientRect();
    const size    = Math.max(rect.width, rect.height) * 2;
    const x       = e.clientX - rect.left - size / 2;
    const y       = e.clientY - rect.top  - size / 2;
    const ripple  = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}

/**
 * Sets button loading state on/off.
 */
function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

/**
 * Validates an email address format.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ══════════════════════════════════════
   TOAST SYSTEM
   type: 'success' | 'error' | 'info' | 'warning'
══════════════════════════════════════ */
const TOAST_DURATION = 4000; // ms before auto-dismiss

const TOAST_ICONS = {
  success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  error:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

function showToast(type, title, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  // Limit to 4 toasts at a time
  const existing = container.querySelectorAll('.toast');
  if (existing.length >= 4) existing[0].remove();

  toast.innerHTML = `
    <div class="toast-icon ${type}">${TOAST_ICONS[type] || TOAST_ICONS.info}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <div class="toast-bar ${type}" style="animation: toastBar ${TOAST_DURATION}ms linear forwards;"></div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

  const timer = setTimeout(() => dismissToast(toast), TOAST_DURATION);

  // Click to dismiss early
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 450);
}


/* ══════════════════════════════════════
   MODAL SYSTEM
   showModal({ type, icon, title, body, actions })
   actions: [{ label, type: 'primary'|'ghost', onclick }]
══════════════════════════════════════ */
function showModal({ type = 'info', icon, title, body, actions = [] }) {
  const overlay    = document.getElementById('modal-overlay');
  const iconWrap   = document.getElementById('modal-icon-wrap');
  const titleEl    = document.getElementById('modal-title');
  const bodyEl     = document.getElementById('modal-body');
  const actionsEl  = document.getElementById('modal-actions');
  if (!overlay) return;

  // Icon type class
  iconWrap.className = `modal-icon-wrap ${type}`;
  iconWrap.innerHTML = icon || '';

  titleEl.textContent   = title || '';
  bodyEl.textContent    = body  || '';

  // Build action buttons
  actionsEl.innerHTML = '';
  actions.forEach(({ label, type: btnType = 'ghost', onclick }) => {
    const btn = document.createElement('button');
    btn.className = `modal-btn ${btnType}`;
    btn.textContent = label;
    if (onclick) btn.addEventListener('click', onclick);
    actionsEl.appendChild(btn);
  });

  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}