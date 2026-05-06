/* ============================================================
   BEAN IDENTITY — NARRATIVE ORCHESTRATION  v1.0
   assets/bean-narrative.js
   Pure vanilla JS. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth < 992;


  /* ============================================================
     2. HERO — MOOD TEXT ROTATOR
     Crossfades subline text every 3.5s
     ============================================================ */
  function initHeroMoodRotator() {
    const sublines = document.querySelectorAll('.hero-subline');
    if (!sublines.length) return;

    const moods = [
      'Some days you\'re calm.',
      'Some days you\'re chaos.',
      'Today you\'re magnetic.',
      'Right now you\'re everything.',
      'Some versions just feel right.'
    ];

    sublines.forEach(function (subline) {
      const original = subline.textContent.trim();
      subline.innerHTML = '<span class="bi-mood-text">' + original + '</span>';
      const span = subline.querySelector('.bi-mood-text');
      let idx = 0;

      setInterval(function () {
        if (REDUCED) return;
        idx = (idx + 1) % moods.length;
        span.classList.add('bi-fade-out');
        setTimeout(function () {
          span.textContent = moods[idx];
          span.classList.remove('bi-fade-out');
          span.classList.add('bi-fade-in');
          setTimeout(function () { span.classList.remove('bi-fade-in'); }, 500);
        }, 460);
      }, 3500);
    });
  }

  /* ============================================================
     3. IDENTITY COPY — WORD SPLIT + CLIP-PATH REVEAL
     Splits headline into per-word spans, reveals on scroll
     ============================================================ */
  function initWordReveal() {
    const headlines = document.querySelectorAll('.identity-copy__headline');
    if (!headlines.length) return;

    headlines.forEach(function (headline) {
      headline.setAttribute('aria-label', headline.textContent.trim());

      var html = headline.innerHTML.trim();
      html = html.replace(/<br\s*\/?>/gi, ' ##BR## ');
      var words = html.split(/\s+/);

      headline.innerHTML = words
        .map(function (w) {
          if (w === '##BR##') return '<br>';
          if (!w) return '';
          return '<span class="bi-word" aria-hidden="true">' + w + '</span>';
        })
        .join(' ');

      const spans = headline.querySelectorAll('.bi-word');

      if (REDUCED) {
        spans.forEach(function (s) { s.classList.add('bi-in-view'); });
        return;
      }

      const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          spans.forEach(function (span, i) {
            setTimeout(function () { span.classList.add('bi-in-view'); }, i * 65);
          });
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.25 });

      obs.observe(headline);
    });
  }

  /* ============================================================
     4. QUIZ — DAILY CHECK-IN MOOD ROTATOR
     Injects a rotating label above the quiz headline
     ============================================================ */
  function initQuizCheckin() {
    const wrapper = document.querySelector('.quiz-prompt__wrapper');
    if (!wrapper) return;

    const quizMoods = [
      'Bold', 'Grounded', 'Chaotic', 'Quiet', 'Magnetic',
      'Soft', 'Fierce', 'Dreamy', 'Charged', 'Raw'
    ];

    const label = document.createElement('p');
    label.className = 'bi-checkin-label';
    label.innerHTML = 'Right now, you feel… <span class="bi-checkin-mood">' + quizMoods[0] + '</span>';
    wrapper.insertBefore(label, wrapper.firstChild);

    const moodSpan = label.querySelector('.bi-checkin-mood');
    let qIdx = 0;

    setInterval(function () {
      if (REDUCED) return;
      qIdx = (qIdx + 1) % quizMoods.length;
      moodSpan.classList.add('bi-swap-out');
      setTimeout(function () {
        moodSpan.textContent = quizMoods[qIdx];
        moodSpan.classList.remove('bi-swap-out');
        moodSpan.classList.add('bi-swap-in');
        setTimeout(function () { moodSpan.classList.remove('bi-swap-in'); }, 380);
      }, 360);
    }, 2200);
  }

  /* ============================================================
     5. STORY TILES — SHOP BY BEAN
     a) Injects story layer into each card
     b) 3D mouse tilt per card
     c) Breathing animation randomness
     d) Staggered entrance on scroll
     e) Animated tab transitions
     ============================================================ */

  /* Bean personality data */
  var beanData = {
    coffee: { line: 'Calm outside. Loud mind.', mood: 'Coffee Bean', accent: 'rgba(141,106,79,0.92)' },
    chilli: { line: 'Too much? Nah. Just enough.', mood: 'Chilli Bean', accent: 'rgba(179,69,43,0.92)' },
    jelly: { line: 'Online 24/7. Offline never.', mood: 'Jelly Bean', accent: 'rgba(214,113,161,0.92)' },
    green: { line: 'Soft focus. Sharp instincts.', mood: 'Green Bean', accent: 'rgba(111,144,88,0.92)' },
    vanilla: { line: 'Clean, quiet, expensive energy.', mood: 'Vanilla Bean', accent: 'rgba(204,181,126,0.92)' }
  };

  function getBeanKey(panel) {
    var title = (panel.querySelector('.cst-scene-copy strong') || {}).textContent || '';
    title = title.toLowerCase();
    for (var key in beanData) {
      if (title.indexOf(key) !== -1) return key;
    }
    /* Fallback: sniff tab label */
    var panelId = panel.id || '';
    for (var k in beanData) {
      if (panelId.toLowerCase().indexOf(k) !== -1) return k;
    }
    return 'coffee';
  }

  function injectStoryLayers() {
    var panels = document.querySelectorAll('.cst-tab-content');
    panels.forEach(function (panel) {
      var key = getBeanKey(panel);
      var data = beanData[key] || beanData.coffee;

      var cards = panel.querySelectorAll('.cst-card');
      cards.forEach(function (card, i) {
        /* Story layer */
        if (!card.querySelector('.cst-card-story-layer')) {
          var layer = document.createElement('div');
          layer.className = 'cst-card-story-layer';
          layer.innerHTML =
            '<span class="cst-story-line">' + data.line + '</span>' +
            '<span class="cst-mood-tag">' + data.mood + '</span>';
          var imgWrapper = card.querySelector('.cst-card-image-wrapper');
          if (imgWrapper) imgWrapper.appendChild(layer);
        }

        /* Breathing randomness */
        var drift = (8 + Math.random() * 4).toFixed(1) + 's';
        card.querySelector('.cst-card-img') &&
          (card.querySelector('.cst-card-img').style.setProperty('--bi-drift', drift));
      });

      /* Stagger on card-items */
      var items = panel.querySelectorAll('.cst-card-item');
      items.forEach(function (item, i) {
        item.style.setProperty('--bi-stagger', (i * 75) + 'ms');
      });
    });
  }

  function initCardEntrance() {
    var items = document.querySelectorAll('.cst-card-item');
    if (!items.length) return;

    if (REDUCED) {
      items.forEach(function (el) { el.classList.add('bi-card-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('bi-card-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { obs.observe(el); });
  }

  function initCardTilt() {
    if (REDUCED || isMobile()) return;

    document.querySelectorAll('.cst-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var cx = (e.clientX - rect.left) / rect.width - 0.5;
        var cy = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--ty', (cx * 10).toFixed(2) + 'deg');
        card.style.setProperty('--tx', (-cy * 6).toFixed(2) + 'deg');
        card.classList.add('bi-tilt-active');
      });

      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--ty', '0deg');
        card.style.setProperty('--tx', '0deg');
        card.classList.remove('bi-tilt-active');
      });
    });
  }

  function initTabTransitions() {
    var tabBtns = document.querySelectorAll('.cst-tab-btn');
    if (!tabBtns.length) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetSelector = btn.dataset.tabTarget;
        if (!targetSelector) return;

        var currentPanel = document.querySelector('.cst-tab-content.active');
        var nextPanel = document.querySelector(targetSelector);
        if (!nextPanel || nextPanel === currentPanel) return;

        if (REDUCED) return; /* Let native handler proceed */

        /* Out */
        if (currentPanel) {
          currentPanel.classList.add('bi-tab-out');
        }

        setTimeout(function () {
          /* Native tab switch will have fired by now — just animate in */
          if (currentPanel) {
            currentPanel.classList.remove('bi-tab-out');
          }
          nextPanel.classList.remove('bi-tab-in');
          void nextPanel.offsetWidth; /* reflow */
          nextPanel.classList.add('bi-tab-in');

          /* Re-trigger stagger on newly visible cards */
          var newItems = nextPanel.querySelectorAll('.cst-card-item');
          newItems.forEach(function (item) { item.classList.remove('bi-card-visible'); });
          requestAnimationFrame(function () {
            newItems.forEach(function (item, i) {
              setTimeout(function () { item.classList.add('bi-card-visible'); }, i * 80);
            });
          });

          setTimeout(function () { nextPanel.classList.remove('bi-tab-in'); }, 450);
        }, 260);
      });
    });
  }

  /* ============================================================
     6. TESTIMONIALS — AUTO-SCROLLING MARQUEE (desktop)
     Duplicates cards for seamless loop
     ============================================================ */
  function initTestimonialMarquee() {
    if (isMobile()) return;

    var tracks = document.querySelectorAll('.tm-track');
    tracks.forEach(function (track) {
      /* Build marquee wrapper */
      var cards = Array.from(track.querySelectorAll('.tm-card'));
      if (cards.length < 2) return;

      /* Assign random rotation & highlight */
      var rots = [-1.8, 1.2, -0.8, 2, -1.4, 0.9, -2, 1.6];
      cards.forEach(function (card, i) {
        card.classList.add('bi-tm-card');
        card.style.setProperty('--bi-rot', rots[i % rots.length]);

        /* Highlight first 4 words of quote */
        var quoteEl = card.querySelector('.tm-quote');
        if (quoteEl) {
          var txt = quoteEl.textContent.trim().replace(/^"|"$/g, '');
          var words = txt.split(' ');
          var highlighted = '<mark class="bi-highlight">' + words.slice(0, 4).join(' ') + '</mark> ' + words.slice(4).join(' ');
          quoteEl.innerHTML = '"' + highlighted + '"';
        }
      });

      /* Clone for seamless loop */
      var clone = cards.map(function (c) { return c.cloneNode(true); });
      clone.forEach(function (c) {
        c.setAttribute('aria-hidden', 'true');
        track.appendChild(c);
      });

      /* Wrap in marquee structure */
      var parent = track.parentElement;
      var wrap = document.createElement('div');
      wrap.className = 'bi-tm-marquee-wrap';

      var inner = document.createElement('div');
      inner.className = 'bi-tm-marquee-inner';

      /* Move all cards into inner */
      var allCards = Array.from(track.querySelectorAll('.tm-card'));
      allCards.forEach(function (c) { inner.appendChild(c); });

      wrap.appendChild(inner);
      parent.insertBefore(wrap, track);
      track.style.display = 'none'; /* Hide original track */
    });
  }

  /* ============================================================
     7. FINAL CTA — INJECT BLOBS
     ============================================================ */
  function initFinalCtaBlobs() {
    var wrapper = document.querySelector('.final-cta__wrapper');
    if (!wrapper) return;

    if (REDUCED) return;

    [1, 2, 3].forEach(function (n) {
      var blob = document.createElement('div');
      blob.className = 'bi-blob bi-blob--' + n;
      blob.setAttribute('aria-hidden', 'true');
      wrapper.parentElement.appendChild(blob);
    });
  }

  /* ============================================================
     8. GLOBAL SCROLL REVEAL
     Finds .bi-reveal elements and fades them in
     ============================================================ */
  function initScrollReveal() {
    var els = document.querySelectorAll('.bi-reveal');
    if (!els.length) return;

    if (REDUCED) {
      els.forEach(function (el) { el.classList.add('bi-in-view'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('bi-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ============================================================
     INIT — Run on DOMContentLoaded
     ============================================================ */
  function init() {

    initHeroMoodRotator();
    initWordReveal();
    initQuizCheckin();
    injectStoryLayers();
    initCardEntrance();
    initCardTilt();
    initTabTransitions();
    initTestimonialMarquee();
    initFinalCtaBlobs();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
