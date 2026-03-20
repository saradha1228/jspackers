/* =============================================
   JS PACKERS AND MOVERS — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---- MOBILE MENU ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  }

  // ---- HERO SLIDER ----
  initSlider({
    containerSel: '.hero-slider',
    slidesSel: '.hero-slider .slide',
    dotsSel: '.hero-dots',
    prevSel: '.hero-prev',
    nextSel: '.hero-next',
    autoplay: true,
    interval: 4500
  });

  // ---- HOW-IT-WORKS SLIDER ----
  initSlider({
    containerSel: '.how-slider',
    slidesSel: '.how-slide',
    dotsSel: '.how-dots',
    prevSel: '.how-prev',
    nextSel: '.how-next',
    autoplay: true,
    interval: 3800
  });

  // ---- TESTIMONIALS SLIDER ----
  initTestimonialsSlider();

  // ---- GALLERY (Home Preview) ----
  renderHomeGallery();

  // ---- GALLERY PAGE ----
  renderFullGallery();

  // ---- STATS COUNTER ----
  setupStatsCounter();

  // ---- LIGHTBOX ----
  setupLightbox();

  // ---- ENQUIRY MODAL ----
  setupEnquiryModal();

  // ---- ACTIVE NAV LINK ----
  setActiveNav();

});

/* =============================================
   TESTIMONIALS SLIDER
   ============================================= */
function initTestimonialsSlider() {
  const slider = document.querySelector('.testimonials-slider');
  if (!slider) return;

  const pages = [
    slider.querySelectorAll('.testimonials-track > .test-slide:first-child ~ * , .testimonials-track > .test-slide'),
  ];

  // Re-build: collect cards, paginate 3 per slide
  const track = slider.querySelector('.testimonials-track');
  const allCards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (allCards.length === 0) return;

  // Clear and rebuild as proper pages
  track.innerHTML = '';
  track.style.display = 'block';
  track.style.position = 'relative';
  track.style.overflow = 'hidden';

  const pageSize = window.innerWidth < 768 ? 1 : 3;
  const paginated = [];
  for (let i = 0; i < allCards.length; i += pageSize) {
    paginated.push(allCards.slice(i, i + Math.min(pageSize, allCards.length - i)));
  }

  const slides = paginated.map((cards) => {
    const slide = document.createElement('div');
    slide.className = 'test-slide';
    slide.style.cssText = 'display:none; grid-template-columns:repeat(' + (window.innerWidth < 768 ? 1 : 3) + ',1fr); gap:24px;';
    cards.forEach(c => slide.appendChild(c));
    track.appendChild(slide);
    return slide;
  });

  if (slides.length === 0) return;

  let current = 0;
  slides[0].style.display = slides[0].style.cssText.includes('grid') ? 'grid' : 'block';
  slides[0].style.display = 'grid';

  const dotsContainer = slider.querySelector('.test-dots');
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer && dotsContainer.appendChild(dot);
  });

  function goTo(n) {
    slides[current].style.display = 'none';
    dotsContainer && dotsContainer.querySelectorAll('.dot')[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].style.display = 'grid';
    dotsContainer && dotsContainer.querySelectorAll('.dot')[current]?.classList.add('active');
  }

  const prevBtn = slider.querySelector('.test-prev');
  const nextBtn = slider.querySelector('.test-next');
  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  const timer = setInterval(() => goTo(current + 1), 5000);
  slider.addEventListener('mouseenter', () => clearInterval(timer));
}

/* =============================================
   SLIDER FACTORY
   ============================================= */
function initSlider({ containerSel, slidesSel, dotsSel, prevSel, nextSel, autoplay, interval }) {
  const container = document.querySelector(containerSel);
  if (!container) return;

  const slides = Array.from(container.querySelectorAll(':scope > .slide, :scope > .how-slide, :scope > .test-slide'));
  if (slides.length === 0) return;

  let current = 0;
  let timer = null;

  // Build dots
  const dotsContainer = container.querySelector('.hero-dots, .how-dots, .test-dots') ||
                        document.querySelector(dotsSel);
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(n) {
    slides[current].classList.remove('active');
    if (dotsContainer) dotsContainer.querySelectorAll('.dot')[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dotsContainer) dotsContainer.querySelectorAll('.dot')[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  const prevBtn = container.querySelector('.hero-prev, .how-prev, .test-prev');
  const nextBtn = container.querySelector('.hero-next, .how-next, .test-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

  if (autoplay) {
    timer = setInterval(next, interval);
    container.addEventListener('mouseenter', () => clearInterval(timer));
    container.addEventListener('mouseleave', () => { timer = setInterval(next, interval); });
  }

  function resetAuto() {
    if (autoplay) { clearInterval(timer); timer = setInterval(next, interval); }
  }

  // Initialise first slide
  slides[0].classList.add('active');
}

/* =============================================
   GALLERY — HOME PREVIEW (shows first 8)
   ============================================= */
function renderHomeGallery() {
  const grid = document.getElementById('home-gallery-grid');
  if (!grid || typeof galleryImages === 'undefined') return;

  const toShow = galleryImages.slice(0, 8);

  // Pad to 8 if fewer images
  const padded = [...toShow];
  while (padded.length < 8) padded.push(null);

  padded.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    if (img) {
      item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
      item.dataset.src = img.src;
      item.dataset.alt = img.alt;
    } else {
      item.classList.add('placeholder');
      item.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <span>Add photo</span>`;
    }
    grid.appendChild(item);
  });
}

/* =============================================
   GALLERY — FULL PAGE (shows all)
   ============================================= */
function renderFullGallery() {
  const grid = document.getElementById('full-gallery-grid');
  if (!grid || typeof galleryImages === 'undefined') return;

  galleryImages.forEach((img) => {
    const item = document.createElement('div');
    item.className = 'gallery-item gallery-page-grid-item';
    item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
    item.dataset.src = img.src;
    item.dataset.alt = img.alt;
    grid.appendChild(item);
  });
}

/* =============================================
   LIGHTBOX
   ============================================= */
function setupLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('img');
  const closeBtn = lb.querySelector('.lb-close');

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item[data-src]');
    if (item) {
      lbImg.src = item.dataset.src;
      lbImg.alt = item.dataset.alt || '';
      lb.classList.add('open');
    }
  });

  closeBtn && closeBtn.addEventListener('click', () => lb.classList.remove('open'));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.classList.remove('open'); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lb.classList.remove('open');
  });
}

/* =============================================
   STATS COUNTER ANIMATION
   ============================================= */
function setupStatsCounter() {
  const section = document.getElementById('stats');
  if (!section) return;

  const counters = section.querySelectorAll('[data-target]');
  let animated = false;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(el => animateCount(el));
    }
  }, { threshold: 0.4 });

  obs.observe(section);
}

function animateCount(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, step);
}

/* =============================================
   ENQUIRY MODAL
   ============================================= */
function setupEnquiryModal() {
  const overlay = document.getElementById('enquiry-modal');
  if (!overlay) return;

  const openBtns = document.querySelectorAll('[data-enquiry]');
  const closeBtn = overlay.querySelector('.modal-close');
  const form = overlay.querySelector('form');

  openBtns.forEach(btn => btn.addEventListener('click', () => overlay.classList.add('open')));
  closeBtn && closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = 'Sent! We\'ll contact you soon ✓';
    btn.style.background = '#2ab514';
    setTimeout(() => {
      overlay.classList.remove('open');
      btn.textContent = 'Send Enquiry';
      btn.style.background = '';
      form.reset();
    }, 2500);
  });
}

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') ||
        (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}
