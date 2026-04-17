document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     SMOOTH SCROLL — all anchor links
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────
     REVEAL ANIMATIONS on scroll
  ────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('revealed');
          revealObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────
     VIDEO MODAL
  ────────────────────────────────────── */
  const cards       = document.querySelectorAll('.work-card');
  const videoModal  = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalClose  = document.getElementById('modalClose');

  function openVideoModal(id) {
    modalIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    videoModal.classList.remove('open');
    modalIframe.src = '';
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-video');
      if (id) openVideoModal(id);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  modalClose.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideoModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideoModal(); });

  /* ──────────────────────────────────────
     MOBILE BOTTOM NAV — active state on scroll
  ────────────────────────────────────── */
  const mbnItems = document.querySelectorAll('.mbn-item');
  const sections = [
    { id: 'landing', navId: 'mbn-home'  },
    { id: 'work',    navId: 'mbn-work'  },
    { id: 'about',   navId: 'mbn-about' },
    { id: 'why',     navId: 'mbn-about' }, // "about" tab stays active on why section too
    { id: 'contact', navId: 'mbn-hire'  },
  ];

  function setActiveMbn(navId) {
    mbnItems.forEach(item => item.classList.remove('active'));
    const active = document.getElementById(navId);
    if (active) active.classList.add('active');
  }

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = sections.find(s => s.id === entry.target.id);
          if (match) setActiveMbn(match.navId);
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) sectionObserver.observe(el);
  });

  /* ──────────────────────────────────────
     CONTACT FORM → Formspree
     Step: replace YOUR_FORM_ID below with
     the ID from formspree.io/dashboard
  ────────────────────────────────────── */
  const FORMSPREE_ID  = 'xjgjypgp';
  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');
  const formError     = document.getElementById('formError');
  const submitBtn     = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const msg   = document.getElementById('msgInput').value.trim();
    if (!name || !email || !msg) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    formSuccess.classList.remove('show');
    formError.classList.remove('show');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(contactForm),
      });

      if (res.ok) {
        submitBtn.textContent = 'Sent ✓';
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => {
          submitBtn.disabled    = false;
          submitBtn.textContent = 'Send Message';
          formSuccess.classList.remove('show');
        }, 7000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
      formError.classList.add('show');
      setTimeout(() => formError.classList.remove('show'), 6000);
    }
  });

});
