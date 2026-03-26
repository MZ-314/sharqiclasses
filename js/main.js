// =============================================
// SHARQI CLASSES — MAIN JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---- Active nav on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => sectionIO.observe(s));

  // ---- Mobile hamburger ----
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Hero Slideshow ----
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0;
  let timer = null;

  function goToSlide(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function start() { timer = setInterval(() => goToSlide(current + 1), 4500); }
  function reset() { clearInterval(timer); start(); }

  dots.forEach(d => d.addEventListener('click', () => { goToSlide(+d.dataset.slide); reset(); }));
  start();
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());

  // ---- Callback Modal ----
  const modal = document.getElementById('callbackModal');
  const modalClose = document.getElementById('modalClose');

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // All callback triggers
  document.querySelectorAll('.callback-trigger').forEach(btn => {
    btn.addEventListener('click', openModal);
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ---- Callback Form — AJAX submit via FormSubmit ----
  const cbForm = document.getElementById('callbackForm');
  const cbSuccess = document.getElementById('cbSuccess');
  const cbBtn = document.getElementById('cbSubmitBtn');

  if (cbForm) {
    cbForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate at least one subject checkbox
      const checked = cbForm.querySelectorAll('input[type="checkbox"]:checked');
      if (checked.length === 0) {
        alert('Please select at least one subject.');
        return;
      }

      cbBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      cbBtn.disabled = true;

      try {
        const formData = new FormData(cbForm);
        const response = await fetch(cbForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          cbForm.style.display = 'none';
          cbSuccess.style.display = 'block';
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        // Fallback: submit normally if fetch fails
        cbForm.submit();
      }
    });
  }

});
