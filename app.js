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

  // Animación de entrada para secciones y tarjetas al hacer scroll
  function revealOnScroll() {
    const elements = document.querySelectorAll('.section, .hero-card, .card, .step, .faq-item');
    const triggerBottom = window.innerHeight * 0.92;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add('visible');
      }
    });

    if (backToTopButton) {
      backToTopButton.classList.toggle('is-visible', window.scrollY > 220);
    }
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

  (function () {
			var track = document.getElementById('carouselTrack');
			var dotsContainer = document.getElementById('carouselDots');
			if (!track) return;

			var originalCards = Array.from(track.querySelectorAll('.carousel-card'));
			var total = originalCards.length;

			// Clonar tarjetas al inicio y al final para el efecto infinito
			var clonesBefore = originalCards.map(function (c) { return c.cloneNode(true); });
			var clonesAfter = originalCards.map(function (c) { return c.cloneNode(true); });
			clonesBefore.forEach(function (c) { track.insertBefore(c, track.firstChild); });
			clonesAfter.forEach(function (c) { track.appendChild(c); });

			var allCards = track.querySelectorAll('.carousel-card');
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
				dotsContainer.appendChild(dot);
			}

			function getCardWidth() {
				var gap = parseInt(getComputedStyle(track).gap) || 24;
				return allCards[0].offsetWidth + gap;
			}

			function updateDots() {
				var realIndex = (current - total + total) % total;
				document.querySelectorAll('.carousel-dot').forEach(function (d, i) {
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
			setPosition(current, false);
			updateDots();

			document.querySelector('.carousel-btn--prev').addEventListener('click', function () {
				goTo(current - 1);
			});
			document.querySelector('.carousel-btn--next').addEventListener('click', function () {
				goTo(current + 1);
			});

			window.addEventListener('resize', function () {
				setPosition(current, false);
			});
		})();

  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
