// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let isDark = prefersDark;
syncThemeToggle();

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  rootEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
  syncThemeToggle();
});

function syncThemeToggle() {
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.querySelector('span[aria-hidden]').textContent = isDark ? '\u2600' : '\u263D';
  themeToggle.lastChild.textContent = isDark ? ' Light mode' : ' Dark mode';
}

// ===== Accessible Modal Dialog Logic =====
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const overlay = document.getElementById('modalOverlay');
const modal = document.getElementById('addRecordModal');
const form = document.getElementById('addProjectForm');

let lastFocusedElement = null;

function openModal() {
  lastFocusedElement = document.activeElement; // remember where focus was
  overlay.hidden = false;
  const firstField = modal.querySelector('input, select');
  if (firstField) firstField.focus(); // move focus into the dialog
  document.addEventListener('keydown', handleKeydown);
}

function closeModal() {
  overlay.hidden = true;
  document.removeEventListener('keydown', handleKeydown);
  if (lastFocusedElement) lastFocusedElement.focus(); // return focus (WCAG 2.4.3)
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    closeModal();
    return;
  }
  if (e.key === 'Tab') {
    trapFocus(e);
  }
}

// Basic focus trap so Tab/Shift+Tab stay inside the open dialog
function trapFocus(e) {
  const focusable = modal.querySelectorAll('input, select, button');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal(); // click outside modal closes it
});

// ===== Simple accessible validation feedback =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');

  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      valid = false;
      const errorEl = document.getElementById(field.getAttribute('aria-describedby'));
      if (errorEl) errorEl.textContent = 'This field is required.';
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  });

  if (valid) {
    alert('Project saved (demo only — connect to backend later).');
    form.reset();
    closeModal();
  }
});
