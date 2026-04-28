/* =========================================
   script.js — Ankush Rai Portfolio
   Interactions, Animations, Utilities
   ========================================= */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverTargets = 'a, button, .polaroid, .skill-card, .stat-box, .sticky-note, .tl-card, .contact-card, .style-panel, .btn-scrap';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      ring.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      ring.classList.remove('hovered');
    });
  });
})();


/* ============================================================
   2. NAV — scroll behaviour + hamburger
   ============================================================ */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!nav) return;

  // Scrolled state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
})();


/* ============================================================
   3. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children with a slight delay cascade
          const delay = parseFloat(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80; // Slight cascade per group
    observer.observe(el);
  });
})();


/* ============================================================
   4. SKILL BARS — fill on scroll
   ============================================================ */
(function initSkillBars() {
  const cards = document.querySelectorAll('.skill-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  cards.forEach((card) => observer.observe(card));
})();


/* ============================================================
   5. POLAROID TILT ON MOUSE MOVE (subtle 3D)
   ============================================================ */
(function initPolaroidTilt() {
  const polaroids = document.querySelectorAll('.polaroid, .tl-card, .skill-card');

  polaroids.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `
        perspective(500px)
        rotateY(${x * 8}deg)
        rotateX(${-y * 6}deg)
        translateZ(6px)
      `;
    });

    el.addEventListener('mouseleave', () => {
      // Restore the original rotation class
      const originalTransform = getComputedStyle(el).transform;
      el.style.transform = '';
      // Small spring-back
      el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
})();


/* ============================================================
   6. MARQUEE PAUSE ON HOVER
   ============================================================ */
(function initMarquee() {
  const track = document.querySelector('.tm-track');
  if (!track) return;
  const strip = track.closest('.tape-marquee');
  if (!strip) return;

  strip.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  strip.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


/* ============================================================
   7. SMOOTH ACTIVE NAV LINK HIGHLIGHTING
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();


/* ============================================================
   8. SCATTERED ELEMENT PARALLAX (subtle, on scroll)
   ============================================================ */
(function initParallax() {
  const doodles = document.querySelectorAll('.doodle, .hero-pol-1, .hero-pol-2, .hero-sticky');
  if (!doodles.length) return;

  let lastY = 0;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    doodles.forEach((el, i) => {
      const speed = (i % 3 === 0) ? 0.08 : (i % 3 === 1) ? 0.05 : 0.12;
      const dir   = (i % 2 === 0) ? 1 : -1;
      el.style.transform = `translateY(${y * speed * dir}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================================
   9. STICKY NOTE RANDOM WOBBLE ON HOVER
   ============================================================ */
(function initStickyWobble() {
  const stickies = document.querySelectorAll('.sticky-note');
  stickies.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const r = (Math.random() - 0.5) * 6;
      el.style.transform = `rotate(${r}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();


/* ============================================================
   10. HERO HEADING TEXT ANIMATE (letter-by-letter)
   ============================================================ */
(function initHeroLetters() {
  // The big title letters animate in via CSS, nothing extra needed
  // But we can add a small cursor blink effect on the period
  const period = document.querySelector('.ht-period');
  if (!period) return;

  let visible = true;
  setInterval(() => {
    visible = !visible;
    period.style.opacity = visible ? '1' : '0.3';
  }, 900);
})();


/* ============================================================
   11. POLAROID GALLERY — random float animation on load
   ============================================================ */
(function initGalleryFloat() {
  const pgItems = document.querySelectorAll('.pg-item');
  pgItems.forEach((item, i) => {
    const delay    = i * 0.15;
    const duration = 3 + Math.random() * 2;
    const amplitude = 4 + Math.random() * 4;
    const sign     = i % 2 === 0 ? 1 : -1;

    // Only float after reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          item.style.animation = `
            polaroidFloat${i} ${duration}s ease-in-out ${delay}s infinite
          `;
          observer.unobserve(item);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(item);

    // Inject keyframe
    const style = document.createElement('style');
    style.textContent = `
      @keyframes polaroidFloat${i} {
        0%, 100% { transform: rotate(${sign * (1 + i * 0.5)}deg) translateY(0); }
        50%       { transform: rotate(${sign * (1 + i * 0.5) * 0.5}deg) translateY(${-amplitude}px); }
      }
    `;
    document.head.appendChild(style);
  });
})();


/* ============================================================
   12. SCROLL HINT HIDE
   ============================================================ */
(function initScrollHint() {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
    } else {
      hint.style.opacity = '1';
    }
  }, { passive: true });
})();


/* ============================================================
   13. NAV ACTIVE LINK CSS
   ============================================================ */
(function injectNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    #nav-links a.active:not(.nav-pill) { color: var(--ink); }
    #nav-links a.active:not(.nav-pill)::after { width: 100%; }
  `;
  document.head.appendChild(style);
})();
