/* Moventa — wspólne zachowania stron. Tłumaczenia każda strona podaje w window.I18N. */
(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* --- wejście w widok --- */
  var revealed = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- eksplorator: lista + panel (bez JS moduły po prostu lecą w pionie) --- */
  document.querySelectorAll('.explorer').forEach(function (ex) {
    var rail = ex.querySelector('.mod-rail');
    var tabs = Array.prototype.slice.call(ex.querySelectorAll('.mod-rail button'));
    var mods = Array.prototype.slice.call(ex.querySelectorAll('.mod'));
    if (!tabs.length) return;
    ex.classList.add('js');

    mods.forEach(function (m) {
      m.id = 'mod-' + m.dataset.mod;
      m.setAttribute('role', 'tabpanel');
    });
    tabs.forEach(function (t) {
      t.id = 'tab-' + t.dataset.mod;
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-controls', 'mod-' + t.dataset.mod);
    });

    function show(id, center) {
      tabs.forEach(function (t) {
        var on = t.dataset.mod === id;
        t.classList.toggle('on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        // w wąskim układzie lista jest pozioma: aktywna pozycja wraca na środek
        if (on && center && rail.scrollWidth > rail.clientWidth) {
          rail.scrollTo({ left: t.offsetLeft - (rail.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
        }
      });
      mods.forEach(function (m) {
        var on = m.dataset.mod === id;
        m.classList.toggle('on', on);
        m.setAttribute('aria-labelledby', 'tab-' + m.dataset.mod);
        if (on) m.querySelectorAll('img[loading="lazy"]').forEach(function (i) { i.loading = 'eager'; });
      });
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t.dataset.mod, true); });
      t.addEventListener('keydown', function (e) {
        var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus();
        show(n.dataset.mod, true);
      });
    });
    show(tabs[0].dataset.mod, false);
  });

  /* --- półka ze zrzutami --- */
  document.querySelectorAll('[data-shelf]').forEach(function (nav) {
    var shelf = document.getElementById(nav.dataset.shelf);
    if (!shelf) return;
    var prev = nav.querySelector('[data-dir="-1"]');
    var next = nav.querySelector('[data-dir="1"]');
    function sync() {
      var max = shelf.scrollWidth - shelf.clientWidth - 2;
      prev.disabled = shelf.scrollLeft <= 2;
      next.disabled = shelf.scrollLeft >= max;
      nav.style.visibility = max <= 0 ? 'hidden' : '';
    }
    [prev, next].forEach(function (b) {
      b.addEventListener('click', function () {
        var step = shelf.querySelector('figure').offsetWidth + 32;
        shelf.scrollBy({ left: step * +b.dataset.dir, behavior: 'smooth' });
      });
    });
    shelf.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  /* --- PL / EN --- */
  var dict = window.I18N;
  if (!dict) return;

  var nodes = document.querySelectorAll('[data-i18n]');
  var snapshot = {};
  function read(el) {
    var attr = el.getAttribute('data-i18n-attr');
    if (attr) return el.getAttribute(attr);
    return el.getAttribute('data-i18n-html') === 'true' ? el.innerHTML : el.textContent;
  }
  function write(el, val) {
    var attr = el.getAttribute('data-i18n-attr');
    if (attr) el.setAttribute(attr, val);
    else if (el.getAttribute('data-i18n-html') === 'true') el.innerHTML = val;
    else el.textContent = val;
  }
  nodes.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!(key in snapshot)) snapshot[key] = read(el);
  });

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.dataset.lang === lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    nodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      write(el, lang === 'pl' ? snapshot[key] : (dict.en[key] || snapshot[key]));
    });
    try { localStorage.setItem('moventa-lang', lang); } catch (e) {}
  }

  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  var initial = 'pl';
  try {
    var saved = localStorage.getItem('moventa-lang');
    if (saved === 'pl' || saved === 'en') initial = saved;
    else if ((navigator.language || '').toLowerCase().indexOf('en') === 0) initial = 'en';
  } catch (e) {}
  if (initial === 'en') setLang('en');
  else document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.setAttribute('aria-pressed', b.dataset.lang === 'pl' ? 'true' : 'false');
  });
})();
