// Enhance navigation toggle for mobile screens
const navToggles = document.querySelectorAll('.nav-toggle');
navToggles.forEach((toggle) => {
  const controlledMenuId = toggle.getAttribute('aria-controls');
  const menu = document.getElementById(controlledMenuId);
  if (!menu) return;

  // Collapse menu when JS is enabled on small screens
  menu.classList.add('is-collapsed');
  toggle.setAttribute('aria-expanded', 'false');

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.add('is-collapsed');
  };

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle('is-collapsed');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      const isToggleVisible = window.getComputedStyle(toggle).display !== 'none';
      if (isToggleVisible) {
        closeMenu();
      }
    });
  });
});

// Keep footer year current
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Lightweight carousel controller
const carousels = document.querySelectorAll('[data-carousel]');
carousels.forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayId;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    const targetSlide = slides[currentIndex];
    track.scrollTo({ left: targetSlide.offsetLeft, behavior: 'smooth' });
  };

  const next = () => goToSlide(currentIndex + 1);
  const prev = () => goToSlide(currentIndex - 1);

  const nextButton = carousel.querySelector('[data-carousel-next]');
  const prevButton = carousel.querySelector('[data-carousel-prev]');

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      next();
      restartAutoplay();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      prev();
      restartAutoplay();
    });
  }

  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayId = window.setInterval(next, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = undefined;
    }
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  startAutoplay();
});

// Automatic language detection based on browser preferences
const rootElement = document.documentElement;
const supportedLanguages = ['en', 'pl'];

const detectPreferredLanguage = () => {
  const navigatorLanguages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language || ''];

  for (const locale of navigatorLanguages) {
    if (!locale) continue;
    const normalized = locale.toLowerCase();
    if (normalized.startsWith('pl')) {
      return 'pl';
    }
    if (normalized.startsWith('en')) {
      return 'en';
    }
  }

  return 'en';
};

const setLanguage = (lang) => {
  const normalized = supportedLanguages.includes(lang) ? lang : 'en';
  document.body.dataset.language = normalized;
  rootElement.lang = normalized;
};

setLanguage(detectPreferredLanguage());

// Smooth scrolling for in-page navigation links
const smoothScrollLinks = document.querySelectorAll('a[href*="#"]');

smoothScrollLinks.forEach((link) => {
  const href = link.getAttribute('href');
  if (!href) return;

  const url = new URL(href, window.location.href);
  if (!url.hash || url.hash.length <= 1) return;

  const currentPath = window.location.pathname.replace(/\/$/, '');
  const targetPath = url.pathname.replace(/\/$/, '');
  if (currentPath !== targetPath) return;

  link.addEventListener('click', (event) => {
    const target = document.querySelector(url.hash);
    if (!target) return;

    event.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView(prefersReducedMotion ? { block: 'start' } : { behavior: 'smooth', block: 'start' });
  });
});
