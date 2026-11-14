const toast = document.querySelector('#toast');
function notify(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Cinematic Intro
const intro = document.querySelector('#cinematicIntro');
const skipIntro = document.querySelector('#skipIntro');
function closeIntro() {
  if (!intro) return;
  intro.classList.add('hide');
  sessionStorage.setItem('jeeb_intro_seen', '1');
}
if (sessionStorage.getItem('jeeb_intro_seen') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  intro?.remove();
} else {
  setTimeout(closeIntro, 1300);
  skipIntro?.addEventListener('click', closeIntro);
}

// Mobile Menu
const menuBtn = document.querySelector('#menuBtn');
const navLinks = document.querySelector('#navLinks');
menuBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));

// Scroll Progress
const scrollProgress = document.querySelector('#scrollProgress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100;
  if (scrollProgress) scrollProgress.style.width = `${pct}%`;
}, { passive: true });

// Scroll Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Feature Badges Interactive Tooltip (Mobile + Desktop)
const tipBox = document.querySelector('#badgeTipBox');
document.querySelectorAll('.f-badge').forEach(btn => {
  const showTip = () => {
    document.querySelectorAll('.f-badge').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (tipBox) tipBox.textContent = btn.dataset.tip;
  };
  btn.addEventListener('click', showTip);
  btn.addEventListener('mouseenter', showTip);
});

// Subtle 3D Tilt on Desktop
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (document.body.classList.contains('reduce-motion')) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Settings Drawer
const drawer = document.querySelector('#settingsDrawer');
const overlay = document.querySelector('#drawerOverlay');
const openSettings = document.querySelector('#openSettings');
const closeSettings = document.querySelector('#closeSettings');

function toggleSettings(open) {
  drawer?.classList.toggle('open', open);
  overlay?.classList.toggle('open', open);
}
openSettings?.addEventListener('click', () => toggleSettings(true));
closeSettings?.addEventListener('click', () => toggleSettings(false));
overlay?.addEventListener('click', () => toggleSettings(false));

// Theme Toggle
const themeToggle = document.querySelector('#themeToggle');
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('jeeb_theme', t);
  if (themeToggle) themeToggle.textContent = t === 'light' ? 'الوضع الفاتح ☀️' : 'الوضع الداكن 🌙';
}
applyTheme(localStorage.getItem('jeeb_theme') || 'dark');
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  notify(next === 'light' ? 'تم تفعيل الوضع الفاتح' : 'تم تفعيل الوضع الداكن');
});

// Motion Toggle
const motionToggle = document.querySelector('#motionToggle');
function applyMotion(reduced) {
  document.body.classList.toggle('reduce-motion', reduced);
  localStorage.setItem('jeeb_reduce_motion', reduced ? '1' : '0');
  if (motionToggle) motionToggle.textContent = reduced ? 'مخفّضة ⏸️' : 'مفعّلة ✨';
}
applyMotion(localStorage.getItem('jeeb_reduce_motion') === '1');
motionToggle?.addEventListener('click', () => {
  const next = !document.body.classList.contains('reduce-motion');
  applyMotion(next);
  notify(next ? 'تم تقليل الحركات' : 'تم تفعيل الحركات السينمائية');
});

// Rating & Feedback
let rating = 5;
const starBtns = document.querySelectorAll('#starRating button');
function paintStars(val) {
  rating = val;
  starBtns.forEach(b => b.classList.toggle('active', Number(b.dataset.star) <= val));
}
paintStars(5);
starBtns.forEach(b => b.addEventListener('click', () => paintStars(Number(b.dataset.star))));

document.querySelector('#sendFeedbackBtn')?.addEventListener('click', () => {
  const text = document.querySelector('#feedbackInput')?.value.trim();
  const msg = `تقييم موقع جيب لي ⭐
التقييم: ${rating} / 5
الملاحظة: ${text || 'تجربة رائعة!'}`;
  notify('جاري فتح واتساب لإرسال تقييمك...');
  window.open(`https://wa.me/966571664509?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});