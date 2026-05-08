// Prof. Yendoubé Lare site, shared scripts.
document.addEventListener('DOMContentLoaded', function () {

  // Language toggle, default English, persists in localStorage.
  const savedLang = localStorage.getItem('siteLang') || 'en';
  applyLang(savedLang);

  document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = btn.dataset.lang;
      applyLang(lang);
      localStorage.setItem('siteLang', lang);
    });
  });

  function applyLang(lang) {
    document.body.classList.remove('lang-en', 'lang-fr');
    document.body.classList.add('lang-' + lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  // Mobile nav toggle.
  const navToggle = document.querySelector('.nav-toggle');
  const navRight = document.querySelector('.nav-right');
  if (navToggle && navRight) {
    navToggle.addEventListener('click', function () {
      navRight.classList.toggle('open');
    });
  }

  // Active nav link highlight.
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.primary a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Gallery filter tabs.
  const filterButtons = document.querySelectorAll('.gallery-filter');
  if (filterButtons.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const cat = btn.dataset.category;
        filterButtons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        document.querySelectorAll('.album-card').forEach(function (card) {
          const cardCat = card.dataset.category;
          card.classList.toggle('hidden', cat !== 'all' && cardCat !== cat);
        });
      });
    });
  }

  // Gallery lightbox with album scoped navigation.
  const galleryImgs = document.querySelectorAll('.album-card img');
  if (galleryImgs.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav prev" aria-label="Previous">&#x2039;</button>
      <button class="lightbox-nav next" aria-label="Next">&#x203A;</button>
      <img src="" alt="">
      <div class="lightbox-counter"></div>
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('img');
    const lbCaption = lb.querySelector('.lightbox-caption');
    const lbCounter = lb.querySelector('.lightbox-counter');
    const lbPrev = lb.querySelector('.lightbox-nav.prev');
    const lbNext = lb.querySelector('.lightbox-nav.next');
    const lbClose = lb.querySelector('.lightbox-close');

    let currentAlbum = [];
    let currentIndex = 0;

    function showAt(i) {
      currentIndex = (i + currentAlbum.length) % currentAlbum.length;
      const img = currentAlbum[currentIndex];
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
      lbCounter.textContent = (currentIndex + 1) + ' / ' + currentAlbum.length;
      lbPrev.style.display = currentAlbum.length > 1 ? '' : 'none';
      lbNext.style.display = currentAlbum.length > 1 ? '' : 'none';
    }

    galleryImgs.forEach(function (img) {
      img.addEventListener('click', function () {
        const album = img.closest('.album-card');
        currentAlbum = Array.from(album.querySelectorAll('img'));
        showAt(currentAlbum.indexOf(img));
        lb.classList.add('active');
      });
    });

    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); showAt(currentIndex - 1); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); showAt(currentIndex + 1); });
    lbClose.addEventListener('click', function () { lb.classList.remove('active'); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('active'); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') lb.classList.remove('active');
      if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
      if (e.key === 'ArrowRight') showAt(currentIndex + 1);
    });
  }

  // Contact form, posts to Formspree (or any compatible endpoint).
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const status = document.getElementById('form-status');
      status.className = 'form-status';
      status.textContent = '';

      const action = form.action;
      // If the endpoint is still the placeholder, fall back to mailto.
      if (action.includes('YOUR_FORM_ID')) {
        const name = form.name_field.value;
        const email = form.email.value;
        const subject = form.subject.value;
        const message = form.message.value;
        const body = encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message);
        window.location.href = 'mailto:yenlare@yahoo.fr?subject=' + encodeURIComponent(subject) + '&body=' + body;
        return;
      }

      try {
        const data = new FormData(form);
        const res = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          status.classList.add('success');
          status.textContent = document.body.classList.contains('lang-fr')
            ? 'Merci, votre message a été envoyé.'
            : 'Thank you, your message has been sent.';
          form.reset();
        } else {
          throw new Error('bad response');
        }
      } catch (err) {
        status.classList.add('error');
        status.textContent = document.body.classList.contains('lang-fr')
          ? 'Une erreur est survenue, veuillez réessayer.'
          : 'Something went wrong, please try again.';
      }
    });
  }

  // Format the citation stats date in the visitor's locale.
  const statsBlock = document.querySelector('.citation-stats');
  if (statsBlock && statsBlock.dataset.updated) {
    const lang = document.body.classList.contains('lang-fr') ? 'fr-FR' : 'en-US';
    const date = new Date(statsBlock.dataset.updated);
    const formatted = date.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
    statsBlock.querySelectorAll('.stats-date').forEach(function (el) { el.textContent = formatted; });
    // Re format when the language toggles.
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.addEventListener('click', function () {
        const newLang = b.dataset.lang === 'fr' ? 'fr-FR' : 'en-US';
        const f = date.toLocaleDateString(newLang, { year: 'numeric', month: 'long', day: 'numeric' });
        statsBlock.querySelectorAll('.stats-date').forEach(function (el) { el.textContent = f; });
      });
    });
  }

  // Footer year.
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
});
