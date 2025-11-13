// Moventa promo interactions
(function () {
  const toggle = document.querySelector('.nav-toggle');

  if (document.body) {
    document.body.classList.remove('no-js');
    if (toggle) {
      document.body.classList.add('js-enabled');
    }
  }

  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-navigation') || document.querySelector('.privacy-page .site-nav');

  if (header && toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    nav.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      }
    });
  }

  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const track = carousel.querySelector('.carousel-track');
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');

  let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (currentIndex < 0) currentIndex = 0;

  function activateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', String(i === index));
    });
    currentIndex = index;
    const activeSlide = slides[index];
    if (activeSlide && track) {
      activeSlide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => activateSlide(i));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex - 1 + slides.length) % slides.length;
      activateSlide(nextIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      activateSlide(nextIndex);
    });
  }

  if (track) {
    let isAuto = true;
    let timer = window.setInterval(() => {
      if (!isAuto) return;
      const nextIndex = (currentIndex + 1) % slides.length;
      activateSlide(nextIndex);
    }, 6000);

    const pauseAuto = () => {
      isAuto = false;
      window.clearInterval(timer);
    };

    ['mouseenter', 'focusin', 'touchstart'].forEach((eventName) => {
      track.addEventListener(eventName, pauseAuto, { once: true });
    });
  }
})();
