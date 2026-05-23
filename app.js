document.addEventListener('DOMContentLoaded', () => {
  // Banner de consentimiento de cookies
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const cookieEssentialBtn = document.getElementById('cookie-essential');
  const cookieRejectBtn = document.getElementById('cookie-reject');

  try {
    const cookieChoice = localStorage.getItem('cc-cookies-choice');
    const legacyAccepted = localStorage.getItem('cc-cookies-accepted');
    if (cookieBanner && !cookieChoice && !legacyAccepted) {
      cookieBanner.removeAttribute('hidden');
    }
  } catch (e) {
    // Si localStorage no está disponible, mostrar siempre
    if (cookieBanner) cookieBanner.removeAttribute('hidden');
  }

  function closeCookieBanner() {
    if (cookieBanner) {
      cookieBanner.style.animation = 'cookieSlidein 0.3s reverse both';
      setTimeout(() => cookieBanner.setAttribute('hidden', ''), 280);
    }
  }

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => {
      try { localStorage.setItem('cc-cookies-choice', 'accepted'); } catch (e) {}
      closeCookieBanner();
    });
  }

  if (cookieEssentialBtn) {
    cookieEssentialBtn.addEventListener('click', () => {
      try { localStorage.setItem('cc-cookies-choice', 'essential-only'); } catch (e) {}
      closeCookieBanner();
    });
  }

  if (cookieRejectBtn) {
    cookieRejectBtn.addEventListener('click', () => {
      try { localStorage.setItem('cc-cookies-choice', 'rejected'); } catch (e) {}
      closeCookieBanner();
    });
  }

  const openCookieSettings = document.getElementById('open-cookie-settings');
  if (openCookieSettings) {
    openCookieSettings.addEventListener('click', (e) => {
      e.preventDefault();
      if (cookieBanner) {
        cookieBanner.style.animation = '';
        cookieBanner.removeAttribute('hidden');
        cookieBanner.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  }
  const backToTopButton = document.getElementById('backToTopBtn');
  const whatsappFloatButton = document.querySelector('.whatsapp-float[data-href]');
  const instagramFloatButton = document.querySelector('.instagram-float[data-href]');
  const navbar = document.querySelector('.navbar');
  const menuBubble = document.querySelector('.menu-bubble');
  const navLinks = document.querySelector('.nav-links');

  var revealElements = Array.from(document.querySelectorAll('.section, .hero-card, .card, .step, .faq-item'));

  function updateBackToTopVisibility() {
    if (!backToTopButton) return;
    backToTopButton.classList.toggle('is-visible', window.scrollY > 220);
  }

  function setupRevealAnimations() {
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0
      });

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
      return;
    }

    // Fallback para navegadores sin IntersectionObserver
    function fallbackReveal() {
      var triggerBottom = window.innerHeight * 0.92;
      revealElements = revealElements.filter(function (el) {
        if (el.getBoundingClientRect().top < triggerBottom) {
          el.classList.add('visible');
          return false;
        }
        return true;
      });

      if (!revealElements.length) {
        window.removeEventListener('scroll', fallbackReveal);
      }
    }

    fallbackReveal();
    window.addEventListener('scroll', fallbackReveal, { passive: true });
  }

  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      // Scroll suave con fallback para navegadores antiguos
      if (window.scrollTo && window.scrollTo.length === 0) {
        // Navegador sin soporte para opciones
        window.scrollTo(0, 0);
      } else {
        try {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } catch (e) {
          // Fallback
          window.scrollTo(0, 0);
        }
      }
    });
  }

  if (whatsappFloatButton) {
    whatsappFloatButton.addEventListener('click', () => {
      const href = whatsappFloatButton.getAttribute('data-href');
      if (href) {
        window.open(href, '_blank', 'noopener');
      }
    });
  }

  if (instagramFloatButton) {
    instagramFloatButton.addEventListener('click', () => {
      const href = instagramFloatButton.getAttribute('data-href');
      if (href) {
        window.open(href, '_blank', 'noopener');
      }
    });
  }

  if (navbar && menuBubble && navLinks) {
    function closeMobileMenu() {
      navbar.classList.remove('is-open');
      menuBubble.setAttribute('aria-expanded', 'false');
    }

    menuBubble.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('is-open');
      menuBubble.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  function initCarousel() {
			var track = document.getElementById('carouselTrack');
			var dotsContainer = document.getElementById('carouselDots');
			if (!track) return;
      if (!dotsContainer) return;
      if (track.dataset.initialized === 'true') return;
      track.dataset.initialized = 'true';

			var originalCards = Array.from(track.querySelectorAll('.carousel-card'));
			var total = originalCards.length;
      if (!total) return;

			// Clonar tarjetas al inicio y al final para el efecto infinito
			var clonesBefore = originalCards.map(function (c) { return c.cloneNode(true); });
			var clonesAfter = originalCards.map(function (c) { return c.cloneNode(true); });
			clonesBefore.forEach(function (c) { track.insertBefore(c, track.firstChild); });
			clonesAfter.forEach(function (c) { track.appendChild(c); });

			var allCards = track.querySelectorAll('.carousel-card');
      var prevBtn = document.querySelector('.carousel-btn--prev');
      var nextBtn = document.querySelector('.carousel-btn--next');
      var dotButtons = [];
      var cachedCardWidth = 0;
			// current apunta a las tarjetas reales (offset = total clonadas al inicio)
			var current = total; // empieza en la primera tarjeta real
			var isTransitioning = false;

			// Crear dots (uno por tarjeta real)
			for (var i = 0; i < total; i++) {
				var dot = document.createElement('button');
				dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
				dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
				dot.dataset.index = i;
				dot.addEventListener('click', function () {
					if (isTransitioning) return;
					goTo(parseInt(this.dataset.index) + total);
				});
        dotButtons.push(dot);
				dotsContainer.appendChild(dot);
			}

      function measureCardWidth() {
        if (!allCards.length) return;
				var gap = parseInt(getComputedStyle(track).gap) || 24;
        cachedCardWidth = allCards[0].offsetWidth + gap;
      }

      function getCardWidth() {
        if (!cachedCardWidth) {
          measureCardWidth();
        }
        return cachedCardWidth;
			}

			function updateDots() {
				var realIndex = (current - total + total) % total;
        dotButtons.forEach(function (d, i) {
					d.classList.toggle('active', i === realIndex);
				});
			}

			function setPosition(index, animate) {
				track.style.transition = animate ? 'transform 0.42s cubic-bezier(.4,1,.6,1)' : 'none';
				track.style.transform = 'translateX(-' + (index * getCardWidth()) + 'px)';
			}

			function goTo(index) {
				if (isTransitioning) return;
				isTransitioning = true;
				current = index;
				setPosition(current, true);
				updateDots();
			}

			// Al terminar la transición, saltar sin animación si estamos en un clon
			track.addEventListener('transitionend', function () {
				isTransitioning = false;
				if (current < total) {
					current = current + total;
					setPosition(current, false);
				} else if (current >= total * 2) {
					current = current - total;
					setPosition(current, false);
				}
			});

			// Posición inicial sin animación
      measureCardWidth();
			setPosition(current, false);
			updateDots();

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          goTo(current - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          goTo(current + 1);
        });
      }

			window.addEventListener('resize', function () {
        measureCardWidth();
				setPosition(current, false);
			});
		}

  function scheduleCarouselInit() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(function () {
        initCarousel();
      }, { timeout: 1200 });
      return;
    }
    setTimeout(initCarousel, 120);
  }

  var carouselSection = document.querySelector('.carousel-section');
  if (carouselSection && 'IntersectionObserver' in window) {
    var carouselObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          scheduleCarouselInit();
          obs.disconnect();
        }
      });
    }, {
      root: null,
      rootMargin: '320px 0px',
      threshold: 0
    });
    carouselObserver.observe(carouselSection);
  } else {
    scheduleCarouselInit();
  }

  setupRevealAnimations();
  updateBackToTopVisibility();

  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      updateBackToTopVisibility();
      scrollTicking = false;
    });
  }, { passive: true });
});
