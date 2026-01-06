// Enhance navigation toggle for mobile screens
const navToggles = document.querySelectorAll('.nav-toggle');
navToggles.forEach((toggle) => {
  const controlledMenuId = toggle.getAttribute('aria-controls');
  const menu = document.getElementById(controlledMenuId);
  if (!menu) return;

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

// Smooth anchor scrolling with active navigation state
const getNormalizedPath = (inputUrl) => inputUrl.pathname.replace(/\/$/, '');
const currentPath = getNormalizedPath(window.location);
const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
const samePageNavLinks = navLinks.filter((link) => {
  const href = link.getAttribute('href');
  if (!href) return false;
  const url = new URL(href, window.location.href);
  if (!url.hash || url.hash.length <= 1) return false;
  return getNormalizedPath(url) === currentPath;
});

let activeHash = window.location.hash ? window.location.hash.toLowerCase() : '';

const setActiveNav = (hash) => {
  const normalized = (hash || '').toLowerCase();
  if (activeHash === normalized) return;
  activeHash = normalized;
  samePageNavLinks.forEach((link) => {
    if (!link.hash) return;
    const matches = link.hash.toLowerCase() === normalized;
    if (matches) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'true');
    } else {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  });
};

if (activeHash) {
  setActiveNav(activeHash);
}

const updateHash = (hash, push = false) => {
  if (!hash) return;
  const normalized = hash.startsWith('#') ? hash : `#${hash}`;
  if (window.location.hash === normalized) return;
  const url = `${window.location.pathname}${window.location.search}${normalized}`;
  const method = push ? 'pushState' : 'replaceState';
  if (typeof history[method] === 'function') {
    history[method](null, '', url);
  } else {
    window.location.hash = normalized;
  }
};

const prefersReducedMotion =
  typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

samePageNavLinks.forEach((link) => {
  const target = document.querySelector(link.hash);
  if (!target) return;

  link.addEventListener('click', (event) => {
    event.preventDefault();
    const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
    const focusDelay = prefersReducedMotion.matches ? 0 : 300;
    window.setTimeout(() => {
      target.focus({ preventScroll: true });
    }, focusDelay);
    setActiveNav(link.hash);
    updateHash(link.hash, true);
  });
});

window.addEventListener('hashchange', () => {
  const newHash = window.location.hash.toLowerCase();
  if (!newHash) return;
  const hasMatch = samePageNavLinks.some((link) => link.hash && link.hash.toLowerCase() === newHash);
  if (hasMatch) {
    setActiveNav(newHash);
  }
});

if (samePageNavLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        .forEach((entry) => {
          const hash = `#${entry.target.id}`;
          setActiveNav(hash);
          updateHash(hash);
        });
    },
    {
      rootMargin: '-55% 0px -40% 0px',
      threshold: [0.2, 0.6],
    }
  );

  samePageNavLinks.forEach((link) => {
    const target = document.querySelector(link.hash);
    if (target) {
      observer.observe(target);
    }
  });
}

// Keep footer year current
const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const translations = {
  en: {
    'meta.language': 'en',
    'meta.index.title': 'Moventa - The work tool for personal trainers',
    'meta.index.description': 'Manage clients, plan workouts, and track progress all in one place.',
    'meta.index.ogTitle': 'Moventa - The work tool for personal trainers',
    'meta.index.ogDescription': 'Discover the essential work tool for personal trainers.',
    'meta.index.ogLocale': 'en_US',
  
    'meta.privacy.title': 'Moventa - Privacy Policy',
    'meta.privacy.description': 'Privacy policy for the Moventa application',
    'meta.privacy.ogTitle': 'Moventa Privacy Information',
    'meta.privacy.ogDescription': 'Transparency about how Moventa collects, uses, and protects your data.',
    'meta.privacy.ogLocale': 'en_US',
  
    'nav.features': 'Features',
    'nav.showcase': 'Showcase',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy Policy',
  
    'hero.eyebrow': 'A new work tool for personal trainers',
    'hero.heading': 'Moventa',
    'hero.lead': 'Manage clients, plan workouts, and track progress. All in one place!',
    'hero.cta': 'Download on the App Store',
    'hero.aboutapp': 'Learn more',
  
    'features.heading': 'Why you’ll love Moventa',
    'features.lead': 'Because it has everything you need!',
    'features.card1.title': 'Client management',
    'features.card1.body': 'Manage an unlimited number of clients, log their workouts, and track their progress.',
    'features.card2.title': 'Session planning',
    'features.card2.body': 'The calendar lets you quickly schedule training sessions and keep track of when payments are due.',
    'features.card3.title': 'Exercise demonstrations',
    'features.card3.body': 'Every exercise in Moventa includes a video showing how to perform it correctly.',
    'features.card4.title': 'Report generation',
    'features.card4.body': 'You can check client progress at any time and generate PDF reports of their strength development and body measurements.',
  
    'showcase.heading': 'This is what Moventa looks like',
    'showcase.lead': 'We offer a 3-month free trial for new users',
    'showcase.slide1': 'Add as many clients as you want',
    'showcase.slide2': 'Monitor progress and set training goals',
    'showcase.slide3': 'Log all sessions and payments in one place',
  
    'contact.heading': 'Contact us',
    'contact.lead': 'Have questions? Contact us and we’ll respond as quickly as we can.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'How can we help?',
    'contact.form.submit': 'Send message',
  
    'contact.aside.heading': 'Our contact details',
    'contact.aside.email': 'Write to <a href="mailto:tominebastudios.dev@gmail.com">tominebastudios.dev@gmail.com</a> or call <a href="tel:+48669669629">+48 669 669 629</a>.',
    'contact.aside.location': 'We work from 8 AM to 6 PM',
  
    'footer.rights': 'Moventa. All rights reserved.',
  
    'privacy.heading': 'Privacy Policy',
    'privacy.intro': 'Here you’ll find the privacy policy for the Moventa application.',
    'privacy.section1.title': 'What you’ll find on this page',
    'privacy.section1.body': 'We are preparing full documentation explaining how we collect, use, and protect your data. Here’s what you can expect from the final version of the policy:',
    'privacy.section1.item1': 'Clear explanations of the types of data processed by Moventa.',
    'privacy.section1.item2': 'Information on how long data is stored and the reasons for these periods.',
    'privacy.section1.item3': 'Your rights to access, correct, and delete your data.',
    'privacy.section1.item4': 'Contact details for our privacy team.',
  
    'privacy.section2.title': 'Need urgent help?',
    'privacy.section2.body': 'Have questions about your data? Contact us at <a href="mailto:privacy@moventa.pl">privacy@moventa.pl</a>. We usually respond within two business days.',
  
    'privacy.section3.title': 'Future updates',
    'privacy.section3.body': 'This information will be updated before Moventa is released publicly. We will notify registered users about important changes via email and include a version history on this page.',
  },
  pl: {
    'meta.language': 'pl',
    'meta.index.title': 'Moventa - Narzędzie pracy trenerów personalnych',
    'meta.index.description': 'Zarządzaj podopiecznymi, planuj treningi i śledź postępy w jednym miejscu.',
    'meta.index.ogTitle': 'Moventa - Narzędzie pracy trenerów personalnych',
    'meta.index.ogDescription': 'Poznaj narzędzie pracy dla trenerów personalnych',
    'meta.index.ogLocale': 'pl_PL',
    'meta.privacy.title': 'Moventa - Polityka prywatności',
    'meta.privacy.description': 'Polityka prywatności aplikacji Moventa',
    'meta.privacy.ogTitle': 'Informacja o prywatności Moventa',
    'meta.privacy.ogDescription': 'Przejrzystość w zakresie gromadzenia, wykorzystywania i ochrony danych przez Moventę.',
    'meta.privacy.ogLocale': 'pl_PL',
    'nav.features': 'Funkcje',
    'nav.showcase': 'Prezentacja',
    'nav.contact': 'Kontakt',
    'nav.privacy': 'Polityka prywatności',
    'hero.eyebrow': 'Nowe narzędzie pracy dla trenerów personalnych',
    'hero.heading': 'Moventa',
    'hero.lead': 'Zarządzaj podopiecznymi, planuj treningi i śledź postępy. Wszystko w jednym miejscu!',
    'hero.cta': 'Pobierz w App Store',
    'hero.aboutapp': 'Dowiedz się więcej',
    'features.heading': 'Dlaczego pokochasz Moventę',
    'features.lead': 'Bo ma wszystko czego potrzebujesz!',
    'features.card1.title': 'Zarządzanie podopiecznymi',
    'features.card1.body': 'Możesz zarządzać nieskończoną liczbą podopiecznych, zapisywać ich treningi i monitorować postępy',
    'features.card2.title': 'Planowanie spotkań',
    'features.card2.body': 'Kalendarz pozwoli szybko zapisać z kim i o której masz trening oraz kiedy podopieczny ma Ci zapłacić',
    'features.card3.title': 'Wykonywanie ćwiczeń',
    'features.card3.body': 'W Moventa przy każdym ćwiczeniu są filmiki które pokazują jak je poprawnie wykonać',
    'features.card4.title': 'Generowanie raportów',
    'features.card4.body': 'W każdej chwili możesz zobaczyć postęp podopiecznych i wygenerować raporty PDF z ich progressu siłowego oraz pomiarów ciała',
    'showcase.heading': 'Tak właśnie wygląda Moventa',
    'showcase.lead': 'Dla nowych użytkowników oferujemy 3-miesięczny bezpłatny okres próbny',
    'showcase.slide1': 'Dodawaj podopiecznych, ile tylko chcesz',
    'showcase.slide2': 'Mnitoruj postępy i ustawiaj cele treningowe',
    'showcase.slide3': 'Zapisuj wszystkie spotkania i płatności w jednym miejscu',
    'contact.heading': 'Skontaktuj się z nami',
    'contact.lead': 'Masz pytania? Skontaktuj się znami, a odpowiemy tak szybko jak umiemy.',
    'contact.form.name': 'Imię',
    'contact.form.email': 'E-mail',
    'contact.form.message': 'Jak możemy pomóc?',
    'contact.form.submit': 'Wyślij wiadomość',
    'contact.aside.heading': 'Nasze dane',
    'contact.aside.email': 'Napisz na <a href="mailto:tominebastudios.dev@gmail.com">tominebastudios.dev@gmail.com</a> lub zadzwoń pod <a href="tel:+48669669629">+48 669 669 629</a>.',
    'contact.aside.location': 'Pracujemy w godzinach 8-18',
    'footer.rights': 'Moventa. Wszelkie prawa zastrzeżone.',
    'privacy.heading': 'Polityka prywatności',
    'privacy.intro': 'Tutaj jest polityka prywatności aplikacji Moventa',
    'privacy.section1.title': 'Co znajdziesz na tej stronie',
    'privacy.section1.body': 'Przygotowujemy pełną dokumentację wyjaśniającą, jak zbieramy, wykorzystujemy i chronimy Twoje dane. Oto, czego możesz się spodziewać po finalnej polityce:',
    'privacy.section1.item1': 'Przejrzyste wyjaśnienia rodzajów danych przetwarzanych przez Moventę.',
    'privacy.section1.item2': 'Informacje o czasie przechowywania danych i powodach takich okresów.',
    'privacy.section1.item3': 'Twoje prawa do dostępu, poprawy i usunięcia danych.',
    'privacy.section1.item4': 'Dane kontaktowe do naszego zespołu ds. prywatności.',
    'privacy.section2.title': 'Potrzebujesz pilnej pomocy?',
    'privacy.section2.body': 'Masz pytania dotyczące swoich danych? Skontaktuj się z nami pod adresem <a href="mailto:privacy@moventa.pl">privacy@moventa.pl</a>. Zwykle odpowiadamy w ciągu dwóch dni roboczych.',
    'privacy.section3.title': 'Przyszłe aktualizacje',
    'privacy.section3.body': 'Zanim Moventa zostanie udostępniona publicznie, zaktualizujemy tę informację. O ważnych zmianach poinformujemy zarejestrowanych użytkowników e-mailem i przedstawimy historię wersji na tej stronie.',
  },
};

const supportedLanguages = Object.keys(translations);
const defaultLanguage = 'en';
let currentLanguage = defaultLanguage;

const storageKey = 'moventa-language';
let storageAvailable = true;
try {
  const storageTestKey = '__storage_test__';
  localStorage.setItem(storageTestKey, storageTestKey);
  localStorage.removeItem(storageTestKey);
} catch (error) {
  storageAvailable = false;
}

const getStoredLanguage = () => {
  if (!storageAvailable) return null;
  try {
    const stored = localStorage.getItem(storageKey);
    return stored && supportedLanguages.includes(stored) ? stored : null;
  } catch (error) {
    return null;
  }
};

const persistLanguage = (lang) => {
  if (!storageAvailable) return;
  try {
    localStorage.setItem(storageKey, lang);
  } catch (error) {
    // Ignore storage failures to keep experience smooth
  }
};

const detectPreferredLanguage = () => {
  const stored = getStoredLanguage();
  if (stored) {
    return stored;
  }

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

  return defaultLanguage;
};

const translationElements = Array.from(document.querySelectorAll('[data-i18n]'));

const applyLanguage = (lang) => {
  const normalized = supportedLanguages.includes(lang) ? lang : defaultLanguage;
  currentLanguage = normalized;
  const dictionary = translations[normalized];
  const fallbackDictionary = translations[defaultLanguage];

  translationElements.forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (!key) return;
    const translation = dictionary[key] ?? fallbackDictionary[key];
    if (!translation) return;

    const attr = element.getAttribute('data-i18n-attr');
    if (attr) {
      element.setAttribute(attr, translation);
    }

    if (element.dataset.i18nHtml === 'true') {
      element.innerHTML = translation;
    } else if (element.tagName !== 'META') {
      element.textContent = translation;
    }
  });

  const htmlLang = dictionary['meta.language'] ?? normalized;
  document.documentElement.lang = htmlLang;
  document.body.dataset.language = htmlLang;

  document.querySelectorAll('meta[name="language"]').forEach((meta) => {
    meta.setAttribute('content', htmlLang);
  });
};

const setLanguage = (lang, shouldPersist = false) => {
  applyLanguage(lang);
  if (shouldPersist) {
    persistLanguage(currentLanguage);
  }
};

setLanguage(detectPreferredLanguage());

