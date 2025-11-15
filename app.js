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
    'meta.index.title': 'Moventa — Effortless Money Movement',
    'meta.index.description': 'Moventa keeps money in motion with instant transfers, smart budgets, and real-time insights.',
    'meta.index.ogTitle': 'Moventa — Effortless Money Movement',
    'meta.index.ogDescription': 'Experience lightning-fast transfers, intuitive budgeting, and personalized alerts with Moventa.',
    'meta.index.ogLocale': 'en_US',
    'meta.privacy.title': 'Moventa Privacy Notice',
    'meta.privacy.description': 'Learn how Moventa handles personal information and privacy commitments.',
    'meta.privacy.ogTitle': 'Moventa Privacy Notice',
    'meta.privacy.ogDescription': 'Transparency about how Moventa collects, uses, and protects your personal data.',
    'meta.privacy.ogLocale': 'en_US',
    'nav.features': 'Features',
    'nav.showcase': 'Showcase',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy',
    'hero.eyebrow': 'Finance reimagined',
    'hero.heading': 'Moventa keeps your money in motion',
    'hero.lead': 'Instant transfers, smart budgeting, and personalized insights—wrapped in one sleek mobile experience.',
    'hero.cta': 'Download on the App Store',
    'features.heading': 'Why you’ll love Moventa',
    'features.lead': 'Designed to simplify every step of your financial life with trustworthy tools.',
    'features.card1.title': 'Lightning-fast transfers',
    'features.card1.body': 'Send and receive funds globally with real-time status updates and no surprise fees.',
    'features.card2.title': 'Smart budgeting',
    'features.card2.body': 'Build flexible budgets that adapt to your spending habits and keep you on track.',
    'features.card3.title': 'Personalized alerts',
    'features.card3.body': 'Get instant notifications when payments clear, bills are due, or balances shift.',
    'features.card4.title': 'Secure vault',
    'features.card4.body': 'Industry-grade encryption protects your information with biometric login support.',
    'showcase.heading': 'Take a look inside the app',
    'showcase.lead': 'Explore highlights below—on mobile, swipe through the gallery.',
    'showcase.slide1': 'Dashboard with real-time balance and quick actions.',
    'showcase.slide2': 'Budgeting assistant highlighting spending trends.',
    'showcase.slide3': 'Instant transfer confirmation with status timeline.',
    'contact.heading': 'Stay in touch',
    'contact.lead': 'Have questions or want early access? Drop us a note and we’ll get back to you.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'How can we help?',
    'contact.form.submit': 'Send message',
    'contact.aside.heading': 'Prefer direct contact?',
    'contact.aside.email': 'Email us at <a href="mailto:hello@moventa.pl">hello@moventa.pl</a> or call <a href="tel:+1234567890">+1 (234) 567-890</a>.',
    'contact.aside.location': 'We’re headquartered in Berlin, serving customers worldwide.',
    'footer.rights': 'Moventa. All rights reserved.',
    'privacy.heading': 'Privacy notice',
    'privacy.intro': 'We built Moventa with security and transparency at the core. This overview shares our commitments to your privacy.',
    'privacy.section1.title': 'What this page covers',
    'privacy.section1.body': 'We’re preparing the full documentation explaining how we collect, use, and safeguard your information. Here’s what you can expect from the finished policy:',
    'privacy.section1.item1': 'Clear explanations of the types of data Moventa processes.',
    'privacy.section1.item2': 'Details on how long we retain information and why.',
    'privacy.section1.item3': 'Your rights to access, correct, or delete your data.',
    'privacy.section1.item4': 'Contact information for our privacy team.',
    'privacy.section2.title': 'Need immediate assistance?',
    'privacy.section2.body': 'If you have questions about your data today, reach our privacy team at <a href="mailto:privacy@moventa.pl">privacy@moventa.pl</a>. We typically respond within two business days.',
    'privacy.section3.title': 'Future updates',
    'privacy.section3.body': 'This notice will be updated before Moventa publicly launches. We’ll notify registered users via email about significant changes and provide version history on this page.',
  },
  pl: {
    'meta.language': 'pl',
    'meta.index.title': 'Moventa — Mobilne finanse bez wysiłku',
    'meta.index.description': 'Moventa utrzymuje finanse w ruchu dzięki błyskawicznym przelewom, inteligentnym budżetom i analizom na żywo.',
    'meta.index.ogTitle': 'Moventa — Mobilne finanse bez wysiłku',
    'meta.index.ogDescription': 'Poznaj błyskawiczne przelewy, intuicyjne budżetowanie i spersonalizowane alerty w Movencie.',
    'meta.index.ogLocale': 'pl_PL',
    'meta.privacy.title': 'Informacja o prywatności Moventa',
    'meta.privacy.description': 'Poznaj sposób, w jaki Moventa chroni dane osobowe i realizuje zobowiązania dotyczące prywatności.',
    'meta.privacy.ogTitle': 'Informacja o prywatności Moventa',
    'meta.privacy.ogDescription': 'Przejrzystość w zakresie gromadzenia, wykorzystywania i ochrony danych przez Moventę.',
    'meta.privacy.ogLocale': 'pl_PL',
    'nav.features': 'Funkcje',
    'nav.showcase': 'Prezentacja',
    'nav.contact': 'Kontakt',
    'nav.privacy': 'Prywatność',
    'hero.eyebrow': 'Finanse w nowej odsłonie',
    'hero.heading': 'Moventa utrzymuje Twoje finanse w ruchu',
    'hero.lead': 'Błyskawiczne przelewy, sprytne budżety i spersonalizowane analizy — wszystko w jednej eleganckiej aplikacji mobilnej.',
    'hero.cta': 'Pobierz w App Store',
    'features.heading': 'Dlaczego pokochasz Moventę',
    'features.lead': 'Stworzona, by uprościć każdy etap zarządzania finansami dzięki narzędziom, którym możesz zaufać.',
    'features.card1.title': 'Błyskawiczne przelewy',
    'features.card1.body': 'Wysyłaj i odbieraj środki na całym świecie z powiadomieniami w czasie rzeczywistym i bez ukrytych opłat.',
    'features.card2.title': 'Inteligentne budżetowanie',
    'features.card2.body': 'Twórz elastyczne budżety dopasowane do Twoich nawyków wydatkowych i trzymaj się planu.',
    'features.card3.title': 'Spersonalizowane alerty',
    'features.card3.body': 'Otrzymuj natychmiastowe powiadomienia o rozliczeniach, terminach płatności i zmianach salda.',
    'features.card4.title': 'Bezpieczny sejf',
    'features.card4.body': 'Szyfrowanie na poziomie bankowym chroni Twoje dane z obsługą logowania biometrycznego.',
    'showcase.heading': 'Zajrzyj do aplikacji',
    'showcase.lead': 'Poznaj najważniejsze ekrany poniżej — na telefonie przewijaj galerię przesunięciem.',
    'showcase.slide1': 'Panel główny z saldem na żywo i szybkim dostępem do funkcji.',
    'showcase.slide2': 'Asystent budżetowy pokazujący trendy wydatków.',
    'showcase.slide3': 'Potwierdzenie przelewu z osią czasu i statusem.',
    'contact.heading': 'Pozostańmy w kontakcie',
    'contact.lead': 'Masz pytania lub chcesz wcześniejszy dostęp? Napisz do nas, a szybko odpowiemy.',
    'contact.form.name': 'Imię',
    'contact.form.email': 'E-mail',
    'contact.form.message': 'Jak możemy pomóc?',
    'contact.form.submit': 'Wyślij wiadomość',
    'contact.aside.heading': 'Wolisz bezpośredni kontakt?',
    'contact.aside.email': 'Napisz na <a href="mailto:hello@moventa.pl">hello@moventa.pl</a> lub zadzwoń pod <a href="tel:+1234567890">+1 (234) 567-890</a>.',
    'contact.aside.location': 'Nasza siedziba mieści się w Berlinie, a obsługujemy klientów na całym świecie.',
    'footer.rights': 'Moventa. Wszelkie prawa zastrzeżone.',
    'privacy.heading': 'Informacja o prywatności',
    'privacy.intro': 'Moventę stworzyliśmy z myślą o bezpieczeństwie i przejrzystości. Ten skrót przedstawia nasze zobowiązania dotyczące prywatności.',
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

