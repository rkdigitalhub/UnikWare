/* ══════════════════════════════════════════
   UnikWare – Main Script
   ══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   WEB3FORMS CONFIGURATION  (free – 250/month)
   ──────────────────────────────────────────
   1. Go to https://web3forms.com
   2. Enter  hello@unikware.in  and click "Create Access Key"
   3. Check your inbox → copy the Access Key
   4. Paste it below.
   No account or backend needed.
   ────────────────────────────────────────── */
const WEB3FORMS_ACCESS_KEY = 'c0afca3b-5468-4910-8edc-0d188e828c32';  // e.g. 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

(function () {
  'use strict';

  /* ── Dark / Light mode toggle ── */
  (function () {
    var root    = document.documentElement;
    var toggle  = document.getElementById('themeToggle');
    var STORAGE = 'uw-theme';

    // Apply saved or system preference immediately (before paint)
    var saved = localStorage.getItem(STORAGE);
    if (saved) {
      root.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.setAttribute('data-theme', 'dark');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme');
        var next    = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE, next);
      });
    }
  }());

  /* ── Splash screen (fires on every page load) ── */
  const splash = document.getElementById('splashScreen');
  if (splash) {
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      splash.classList.add('hide');
      document.body.style.overflow = '';
    }, 3000);
  }

  /* ── Services circle diagram – segment hover ── */
  var svcCenter = document.getElementById('svcCenter');
  document.querySelectorAll('.svc-seg').forEach(function (seg) {
    seg.addEventListener('mouseenter', function () {
      var idx   = seg.getAttribute('data-seg');
      var title = seg.getAttribute('data-title');
      var icon  = seg.getAttribute('data-icon');
      var color = seg.getAttribute('data-color');
      // Populate center popup
      if (svcCenter) {
        svcCenter.querySelector('.svc-center-icon').className = 'svc-center-icon fa-solid ' + icon;
        svcCenter.querySelector('.svc-center-title').textContent = title;
        svcCenter.style.setProperty('--hl-color', color);
        svcCenter.classList.add('active');
      }
      // Highlight matching labels
      document.querySelectorAll('.svc-label[data-seg="' + idx + '"]').forEach(function (l) {
        l.style.setProperty('--hl-color', color);
        l.classList.add('highlight');
      });
    });
    seg.addEventListener('mouseleave', function () {
      if (svcCenter) svcCenter.classList.remove('active');
      document.querySelectorAll('.svc-label').forEach(function (l) { l.classList.remove('highlight'); });
    });
  });

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  /* ── Scroll-triggered animations ── */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  animatedEls.forEach(el => observer.observe(el));

  /* ── Animated counters (stats band) ── */
  function animateCounter(el, end, suffix = '', duration = 1600) {
    let start = 0;
    const step = end / (duration / 16);
    const tick = () => {
      start += step;
      if (start < end) {
        el.textContent = Math.floor(start).toLocaleString() + suffix;
        requestAnimationFrame(tick);
      } else {
        el.textContent = end.toLocaleString() + suffix;
      }
    };
    requestAnimationFrame(tick);
  }

  /* Hero stat value (12,540) */
  const statValue = document.querySelector('.stat-value');
  if (statValue) {
    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(statValue, 12540);
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });
    counterObserver.observe(statValue);
  }

  /* Stats band counters */
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const end = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, end, suffix);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ════════════════════════════════════════
     CONTACT FORM
     ════════════════════════════════════════ */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formErrMsg  = document.getElementById('formErrorMsg');

  if (!form) return;

  /* ── Validation rules ── */
  const validators = {
    'cf-name':    { el: null, errEl: null, test: v => v.trim().length >= 2,           msg: 'Please enter your full name.' },
    'cf-email':   { el: null, errEl: null, test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
    'cf-service': { el: null, errEl: null, test: v => v !== '',                        msg: 'Please select a service.' },
    'cf-message': { el: null, errEl: null, test: v => v.trim().length >= 10,           msg: 'Please describe your project (at least 10 characters).' },
  };

  Object.keys(validators).forEach(id => {
    validators[id].el    = document.getElementById(id);
    validators[id].errEl = document.getElementById('err-' + id.replace('cf-', ''));
  });

  function validateField(id) {
    const rule = validators[id];
    if (!rule) return true;
    const val   = rule.el.value;
    const valid = rule.test(val);
    rule.el.closest('.input-wrap').querySelector('input, select, textarea')
      .classList.toggle('invalid', !valid);
    if (rule.errEl) rule.errEl.textContent = valid ? '' : rule.msg;
    return valid;
  }

  function validateAll() {
    return Object.keys(validators).map(validateField).every(Boolean);
  }

  /* Live validation on blur */
  Object.keys(validators).forEach(id => {
    validators[id].el.addEventListener('blur', () => validateField(id));
    validators[id].el.addEventListener('input', () => {
      if (validators[id].el.classList.contains('invalid')) validateField(id);
    });
  });

  /* ── Set loading state ── */
  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.querySelector('.btn-label').hidden  = loading;
    submitBtn.querySelector('.btn-loading').hidden = !loading;
  }

  /* ── Form submit ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formSuccess.hidden  = true;
    formErrMsg.hidden   = true;

    if (!validateAll()) return;

    setLoading(true);

    const params = {
      from_name:  document.getElementById('cf-name').value.trim(),
      from_email: document.getElementById('cf-email').value.trim(),
      phone:      document.getElementById('cf-phone').value.trim() || 'Not provided',
      company:    document.getElementById('cf-company').value.trim() || 'Not provided',
      service:    document.getElementById('cf-service').value,
      message:    document.getElementById('cf-message').value.trim(),
      to_email:   'hello@unikware.in',
    };

    /* ── Dev fallback: mailto if key not yet set ── */
    if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY') {
      const body = encodeURIComponent(
        `Name: ${params.from_name}\nEmail: ${params.from_email}\nPhone: ${params.phone}\nCompany: ${params.company}\nService: ${params.service}\n\nMessage:\n${params.message}`
      );
      window.location.href = `mailto:hello@unikware.in?subject=New Enquiry – ${params.service}&body=${body}`;
      setLoading(false);
      return;
    }

    /* ── Web3Forms API call ── */
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key:   WEB3FORMS_ACCESS_KEY,
        subject:      `New Enquiry – ${params.service} | UnikWare`,
        from_name:    params.from_name,
        email:        params.from_email,
        phone:        params.phone,
        company:      params.company,
        service:      params.service,
        message:      params.message,
        botcheck:     '',   /* honeypot spam protection */
      }),
    })
    .then(res => res.json())
    .then(data => {
      setLoading(false);
      if (data.success) {
        form.reset();
        form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    })
    .catch(() => {
      setLoading(false);
      formErrMsg.hidden = false;
      formErrMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

})();
