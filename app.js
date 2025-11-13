// Enhance navigation toggle for mobile screens
const navToggles = document.querySelectorAll('.nav-toggle');
navToggles.forEach((toggle) => {
  const controlledMenuId = toggle.getAttribute('aria-controls');
  const menu = document.getElementById(controlledMenuId);
  if (!menu) return;

  // Collapse menu when JS is enabled on small screens
  menu.classList.add('is-collapsed');
  toggle.setAttribute('aria-expanded', 'false');

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle('is-collapsed');
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
