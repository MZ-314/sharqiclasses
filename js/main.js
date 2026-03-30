document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));

  // ---- Active nav ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.3 }).observe && sections.forEach(s => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { threshold: 0.3 }).observe(s);
  });

  // ---- Hamburger ----
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  }));

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // ---- Hero Slideshow ----
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  let current = 0, timer = null;
  function goTo(idx) {
    slides[current].classList.remove('active'); dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active'); dots[current].classList.add('active');
  }
  function start() { timer = setInterval(() => goTo(current + 1), 4500); }
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.slide); clearInterval(timer); start(); }));
  start();
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());

  // ---- Callback Modal ----
  const modal = document.getElementById('callbackModal');
  const modalClose = document.getElementById('modalClose');
  function openModal() { modal.classList.add('active'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeModal() { modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  document.querySelectorAll('.callback-trigger').forEach(b => b.addEventListener('click', openModal));
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ---- Callback Form ----
  const cbForm = document.getElementById('callbackForm');
  const cbSuccess = document.getElementById('cbSuccess');
  const cbBtn = document.getElementById('cbSubmitBtn');
  if (cbForm) {
    cbForm.addEventListener('submit', async e => {
      e.preventDefault();
      const checked = cbForm.querySelectorAll('input[type="checkbox"]:checked');
      if (checked.length === 0) { alert('Please select at least one subject.'); return; }
      cbBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      cbBtn.disabled = true;
      try {
        const res = await fetch(cbForm.action, { method:'POST', body: new FormData(cbForm), headers:{'Accept':'application/json'} });
        if (res.ok) { cbForm.style.display='none'; cbSuccess.style.display='block'; }
        else throw new Error();
      } catch { cbForm.submit(); }
    });
  }

  // ======================================
  // ENROLL FORM — full interactive logic
  // ======================================

  const enrollForm = document.getElementById('enrollForm');
  if (!enrollForm) return;

  const enrollSuccess = document.getElementById('enrollSuccess');
  const step4 = document.getElementById('step4');
  const step5 = document.getElementById('step5');
  const subjectGrid = document.getElementById('subjectGrid');
  const subjectHint = document.getElementById('subject-hint');
  const sebaNote = document.getElementById('sebaNote');
  const feeAmount = document.getElementById('feeAmount');
  const feeDetail = document.getElementById('feeDetail');
  const feeOffer = document.getElementById('feeOffer');
  const feeOfferAmount = document.getElementById('feeOfferAmount');
  const feeBreakdown = document.getElementById('feeBreakdown');
  const timetablePreview = document.getElementById('timetablePreview');
  const submitBtn = document.getElementById('enrollSubmitBtn');
  const enrollNote = document.getElementById('enrollNote');
  const hiddenTimetable = document.getElementById('hidden-timetable');
  const hiddenFee = document.getElementById('hidden-fee');

  let selectedBatch = null;   // 'batch1' | 'batch2'
  let selectedBoard = null;   // 'SEBA' | 'CBSE' | 'ICSE'
  let selectedSubjects = [];  // array of subject keys

  const PRICE_PER_SUBJECT = 480; // ₹480/month per subject
  const OFFER_DISCOUNT = 0.30;

  const SUBJECTS = {
    maths:   { label: 'Mathematics',        icon: 'fa-square-root-variable', boards: ['SEBA','CBSE','ICSE'] },
    science: { label: 'Science',            icon: 'fa-atom',                 boards: ['SEBA','CBSE','ICSE'] },
    comp:    { label: 'Computer Science',   icon: 'fa-laptop-code',          boards: ['CBSE','ICSE','SEBA'] },
    adv:     { label: 'Advanced Maths',     icon: 'fa-infinity',             boards: ['SEBA'] },
  };

  // Timetable data: batch1 and batch2
  // Each entry: { day, slots: [{time, subject, board}] }
  const TIMETABLES = {
    batch1: [
      { day: 'Mon', slots: [{ time: '5–6 PM', subject: 'maths' }, { time: '6–7 PM', subject: 'adv' }] },
      { day: 'Wed', slots: [{ time: '5–6 PM', subject: 'science' }, { time: '6–7 PM', subject: 'comp' }] },
      { day: 'Fri', slots: [{ time: '5–6 PM', subject: 'maths' }, { time: '6–7 PM', subject: 'adv' }] },
      { day: 'Sun', slots: [{ time: '5–6 PM', subject: 'science' }, { time: '6–7 PM', subject: 'comp' }] },
    ],
    batch2: [
      { day: 'Tue', slots: [{ time: '5–6 PM', subject: 'maths' }, { time: '6–7 PM', subject: 'adv' }] },
      { day: 'Thu', slots: [{ time: '5–6 PM', subject: 'science' }, { time: '6–7 PM', subject: 'comp' }] },
      { day: 'Sat', slots: [{ time: '5–6 PM', subject: 'maths' }, { time: '6–7 PM', subject: 'adv' }] },
      { day: 'Sun', slots: [{ time: '10–11 AM', subject: 'science' }, { time: '11–12 PM', subject: 'comp' }] },
    ]
  };

  // --- Batch selection ---
  document.querySelectorAll('.batch-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.batch-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.querySelector('input').checked = true;
      selectedBatch = card.querySelector('input').value.includes('Batch 1') ? 'batch1' : 'batch2';
      updateSubjectsAndFee();
    });
  });

  // --- Board selection ---
  document.querySelectorAll('.board-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.board-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      card.querySelector('input').checked = true;
      selectedBoard = card.querySelector('input').value;
      selectedSubjects = [];
      renderSubjectGrid();
      step4.style.display = 'block';
      step5.style.display = 'none';
      submitBtn.style.display = 'none';
      enrollNote.style.display = 'none';
      updateFeeDisplay();
    });
  });

  function renderSubjectGrid() {
    subjectGrid.innerHTML = '';
    if (!selectedBoard) return;

    const isSEBA = selectedBoard === 'SEBA';
    sebaNote.style.display = isSEBA ? 'flex' : 'none';

    // For SEBA: show all 4. For CBSE/ICSE: show maths, science, comp
    const toShow = isSEBA
      ? ['maths', 'science', 'adv', 'comp']
      : ['maths', 'science', 'comp'];

    subjectHint.textContent = isSEBA
      ? 'Select up to 3 — Adv. Maths and Comp. Science are mutually exclusive'
      : 'Select 1, 2 or 3 subjects';

    toShow.forEach(key => {
      const s = SUBJECTS[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'subject-select-btn';
      btn.dataset.key = key;
      btn.innerHTML = `
        <div class="subject-check"><i class="fa-solid fa-check"></i></div>
        <i class="fa-solid ${s.icon}"></i>
        <span>${s.label}</span>
        <span class="sub-price">₹480/month</span>
      `;
      btn.addEventListener('click', () => toggleSubject(key, btn, isSEBA));
      subjectGrid.appendChild(btn);
    });
  }

  function toggleSubject(key, btn, isSEBA) {
    const isSelected = selectedSubjects.includes(key);

    if (isSelected) {
      // Deselect
      selectedSubjects = selectedSubjects.filter(s => s !== key);
      btn.classList.remove('selected');
    } else {
      // SEBA mutual exclusion: adv and comp can't coexist
      if (isSEBA && key === 'adv' && selectedSubjects.includes('comp')) {
        selectedSubjects = selectedSubjects.filter(s => s !== 'comp');
        subjectGrid.querySelector('[data-key="comp"]')?.classList.remove('selected');
      }
      if (isSEBA && key === 'comp' && selectedSubjects.includes('adv')) {
        selectedSubjects = selectedSubjects.filter(s => s !== 'adv');
        subjectGrid.querySelector('[data-key="adv"]')?.classList.remove('selected');
      }
      // Max 3
      if (selectedSubjects.length >= 3) {
        // Flash a warning
        btn.style.border = '2px solid #e53935';
        setTimeout(() => btn.style.border = '', 700);
        subjectHint.textContent = 'Maximum 3 subjects';
        subjectHint.style.color = '#e53935';
        setTimeout(() => { subjectHint.style.color = ''; renderSubjectGrid(); selectedSubjects.forEach(k => { subjectGrid.querySelector('[data-key="'+k+'"]')?.classList.add('selected'); }); }, 800);
        return;
      }
      selectedSubjects.push(key);
      btn.classList.add('selected');
    }

    updateFeeDisplay();
    if (selectedSubjects.length > 0 && selectedBatch) {
      step5.style.display = 'block';
      submitBtn.style.display = 'flex';
      enrollNote.style.display = 'block';
      updateTimetable();
    } else {
      step5.style.display = 'none';
      submitBtn.style.display = 'none';
      enrollNote.style.display = 'none';
    }
  }

  function updateFeeDisplay() {
    const count = selectedSubjects.length;
    const fee = count * PRICE_PER_SUBJECT;
    const offerFee = Math.round(fee * (1 - OFFER_DISCOUNT));

    feeAmount.textContent = count === 0 ? '₹0' : '₹' + fee.toLocaleString('en-IN');
    feeDetail.textContent = count === 0
      ? 'Select subjects above'
      : count + ' subject' + (count > 1 ? 's' : '') + ' × ₹480 = ₹' + fee.toLocaleString('en-IN') + '/month';

    if (count > 0) {
      feeOffer.style.display = 'flex';
      feeOfferAmount.textContent = '₹' + offerFee.toLocaleString('en-IN');
      feeBreakdown.innerHTML = `
        <div><span>Regular fee</span><strong>₹${fee.toLocaleString('en-IN')}/mo</strong></div>
        <div><span>Offer (30% off)</span><strong>₹${offerFee.toLocaleString('en-IN')}/mo</strong></div>
        <div><span>Classes/month</span><strong>${count * 8}</strong></div>
        <div><span>Per class</span><strong>₹60</strong></div>
      `;
      hiddenFee.value = 'Regular: ₹' + fee + '/month | Offer (30% off, 3 months): ₹' + offerFee + '/month';
    } else {
      feeOffer.style.display = 'none';
      feeBreakdown.innerHTML = '';
    }
  }

  function updateTimetable() {
    if (!selectedBatch || selectedSubjects.length === 0) { timetablePreview.innerHTML = ''; return; }
    const tt = TIMETABLES[selectedBatch];
    let html = '<div class="tp-title"><i class="fa-regular fa-calendar"></i> Your Personal Timetable</div><div class="tp-rows">';
    let ttText = '';

    tt.forEach(day => {
      const mySlots = day.slots.filter(s => selectedSubjects.includes(s.subject));
      if (mySlots.length === 0) return;
      html += `<div class="tp-row"><span class="tp-day">${day.day}</span><div class="tp-slots">`;
      mySlots.forEach(s => {
        html += `<div class="tp-slot">${s.time}<span>· ${SUBJECTS[s.subject].label}</span></div>`;
        ttText += day.day + ' ' + s.time + ': ' + SUBJECTS[s.subject].label + ' | ';
      });
      html += '</div></div>';
    });
    html += '</div>';
    timetablePreview.innerHTML = html;
    hiddenTimetable.value = ttText;
  }

  function updateSubjectsAndFee() {
    if (selectedBoard) {
      renderSubjectGrid();
      selectedSubjects.forEach(k => { subjectGrid.querySelector('[data-key="'+k+'"]')?.classList.add('selected'); });
      updateFeeDisplay();
      if (selectedSubjects.length > 0) updateTimetable();
    }
  }

  // ---- Enroll form submit ----
  enrollForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!selectedBatch) { alert('Please select a batch.'); return; }
    if (!selectedBoard) { alert('Please select your board.'); return; }
    if (selectedSubjects.length === 0) { alert('Please select at least one subject.'); return; }

    // Add subjects to hidden field
    const subNames = selectedSubjects.map(k => SUBJECTS[k].label).join(', ');
    const subInput = enrollForm.querySelector('input[name="Subjects"]') || document.createElement('input');
    subInput.type = 'hidden'; subInput.name = 'Subjects'; subInput.value = subNames;
    enrollForm.appendChild(subInput);

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    try {
      const res = await fetch(enrollForm.action, { method:'POST', body: new FormData(enrollForm), headers:{'Accept':'application/json'} });
      if (res.ok) { enrollForm.style.display='none'; enrollSuccess.style.display='block'; }
      else throw new Error();
    } catch { enrollForm.submit(); }
  });

});