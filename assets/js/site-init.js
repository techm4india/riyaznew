/**
 * TechM4India — shared page init
 * Fixes black-screen loader on refresh; handles nav, scroll, reveals.
 */
(function () {
  'use strict';

  var LOADER_KEY = 'tm4_loader_seen';
  var NAV_KEY = 'tm4_nav_transition';

  var loader = document.getElementById('loader');

  function hideLoader() {
    if (loader) {
      loader.classList.add('hidden');
      loader.setAttribute('aria-hidden', 'true');
    }
    document.documentElement.classList.add('loaded');
    document.body.style.removeProperty('opacity');
    document.body.style.removeProperty('transition');
  }

  /* Dismiss loader ASAP — never wait for all assets */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    hideLoader();
  }
  setTimeout(hideLoader, 300);

  try {
    sessionStorage.setItem(LOADER_KEY, '1');
  } catch (e) {}

  /* Reveal fallback */
  function revealFallback() {
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) {
      el.classList.add('visible');
      el.classList.add('revealed');
    });
  }

  /* Navigation */
  var navLinks = document.getElementById('navLinks');
  var navToggle = document.getElementById('navToggle');
  var navOverlay = document.getElementById('navOverlay');
  var navClose = document.getElementById('navClose');

  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    }
    if (navOverlay) navOverlay.classList.remove('visible');
  }

  function openNav() {
    if (!navLinks) return;
    navLinks.classList.add('open');
    document.body.classList.add('nav-open');
    if (navToggle) {
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close navigation menu');
    }
    if (navOverlay) navOverlay.classList.add('visible');
    if (navClose) navClose.focus();
  }

  function toggleNavMenu() {
    if (navLinks && navLinks.classList.contains('open')) closeNav();
    else openNav();
  }

  window.toggleNav = toggleNavMenu;
  window.closeNav = closeNav;

  if (navToggle) navToggle.addEventListener('click', toggleNavMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeNav);
  if (navClose) navClose.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeNav();
      if (navToggle) navToggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) closeNav();
  });

  /* Progress bar + nav scroll */
  window.addEventListener('scroll', function () {
    var progressEl = document.getElementById('progress-bar') || document.getElementById('spb');
    if (progressEl && document.body.scrollHeight > window.innerHeight) {
      progressEl.style.width =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100 + '%';
    }
    var navbarEl = document.getElementById('navbar') || document.getElementById('mainNav');
    if (navbarEl) navbarEl.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* Reveal observer */
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          e.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(function (el) {
      ro.observe(el);
    });
  } else {
    revealFallback();
  }

  /* Internal link handling — smooth scroll + optional fade (no fade on refresh) */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a');
    if (!anchor) return;

    var href = anchor.getAttribute('href') || anchor.dataset.href;
    if (!href) return;

    if (href.startsWith('#')) {
      if (href === '#') return;
      var targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
        closeNav();
      }
      return;
    }

    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;

    if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        var url = new URL(href);
        if (url.origin !== window.location.origin) return;
      } catch (err) {
        return;
      }
    }

    if (anchor.getAttribute('target') === '_blank') return;

    e.preventDefault();

    // Map clean URLs to relative file paths for local file preview (file://)
    if (window.location.protocol === 'file:' && href.startsWith('/')) {
      var isNested = window.location.pathname.indexOf('/divisions/') !== -1 || window.location.pathname.indexOf('/pages/') !== -1;
      var prefix = isNested ? '../' : '';
      
      var parts = href.split('#');
      var cleanPath = parts[0];
      var hash = parts[1] ? '#' + parts[1] : '';
      
      var urlMap = {
        '/': 'index.html',
        '/engineering': 'divisions/engineering.html',
        '/solutions': 'divisions/solutions.html',
        '/space': 'divisions/space.html',
        '/schools': 'divisions/schools.html',
        '/about': 'pages/about.html',
        '/careers': 'pages/careers.html',
        '/contact': 'pages/contact.html',
        '/programs': 'pages/programs.html',
        '/research': 'pages/research.html',
        '/impact': 'pages/impact.html',
        '/vision': 'pages/vision.html',
        '/ecosystem': 'pages/ecosystem.html',
        '/login': 'pages/login.html',
        '/admin': 'pages/admin.html'
      };
      
      if (urlMap[cleanPath]) {
        href = prefix + urlMap[cleanPath] + hash;
      }
    }

    try {
      sessionStorage.setItem(NAV_KEY, '1');
    } catch (err) {}
    document.body.style.transition = 'opacity 0.2s ease';
    document.body.style.opacity = '0.85';
    setTimeout(function () {
      window.location.href = href;
    }, 180);
  });

  /* Arriving from internal nav — brief fade-in only, never start hidden */
  try {
    if (sessionStorage.getItem(NAV_KEY) === '1') {
      sessionStorage.removeItem(NAV_KEY);
      document.body.style.opacity = '0.92';
      document.body.style.transition = 'opacity 0.25s ease';
      requestAnimationFrame(function () {
        document.body.style.opacity = '1';
      });
    }
  } catch (e) {}

  /* Experts carousel (when present) */
  (function initExpertsCarousel() {
    var carousel = document.getElementById('expertsCarousel');
    var dotsContainer = document.getElementById('expertsDots');
    if (!carousel || !dotsContainer) return;

    var cards = carousel.querySelectorAll('.expert-card');
    var bp = carousel.closest('.experts-sect') ? 768 : 1150;
    var mq = window.matchMedia('(min-width: ' + bp + 'px)');

    function buildDots() {
      dotsContainer.innerHTML = '';
      if (mq.matches || cards.length === 0) return;
      cards.forEach(function (card, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'View team member ' + (i + 1));
        if (i === 0) dot.setAttribute('aria-current', 'true');
        dot.addEventListener('click', function () {
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (mq.matches) return;
      var dots = dotsContainer.querySelectorAll('.carousel-dot');
      if (!dots.length) return;
      var center = carousel.scrollLeft + carousel.clientWidth / 2;
      var active = 0;
      var minDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2));
        if (dist < minDist) {
          minDist = dist;
          active = i;
        }
      });
      dots.forEach(function (d, i) {
        d.setAttribute('aria-current', i === active ? 'true' : 'false');
      });
    }

    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (mq.matches) return;
      var idx = 0;
      dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
        if (d.getAttribute('aria-current') === 'true') idx = i;
      });
      if (e.key === 'ArrowRight' && idx < cards.length - 1) {
        e.preventDefault();
        cards[idx + 1].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault();
        cards[idx - 1].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    buildDots();
    carousel.addEventListener('scroll', updateDots, { passive: true });
    mq.addEventListener('change', function () {
      buildDots();
      updateDots();
    });
  })();

  /* Scroll-spy for in-page nav */
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (navAnchors.length) {
    var sections = [];
    navAnchors.forEach(function (a) {
      var id = a.getAttribute('href');
      if (id && id.length > 1) {
        var sec = document.querySelector(id);
        if (sec) sections.push({ link: a, el: sec });
      }
    });
    function updateActiveNav() {
      var scrollPos = window.scrollY + 120;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.el.offsetTop <= scrollPos) current = s;
      });
      navAnchors.forEach(function (a) {
        a.classList.remove('active');
      });
      if (current) current.link.classList.add('active');
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }
})();
