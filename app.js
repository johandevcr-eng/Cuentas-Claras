document.addEventListener('DOMContentLoaded', () => {
  // Limpiar tema oscuro (si es aplicado)
  try {
    localStorage.removeItem('cc-theme');
  } catch (e) {
    // localStorage no disponible
  }
  document.body.classList.remove('dark-theme');

  // Banner de consentimiento de cookies
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
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

  if (cookieRejectBtn) {
    cookieRejectBtn.addEventListener('click', () => {
      try { localStorage.setItem('cc-cookies-choice', 'rejected'); } catch (e) {}
      closeCookieBanner();
    });
  }
  const backToTopButton = document.getElementById('backToTopBtn');
  const whatsappFloatButton = document.querySelector('.whatsapp-float[data-href]');

  const incomeInput = document.getElementById('ingresos');
  const expensesInput = document.getElementById('gastos');
  const rateInput = document.getElementById('tasa');
  const calculateButton = document.getElementById('calcularImpuesto');

  const incomeResult = document.getElementById('resultadoIngresos');
  const expensesResult = document.getElementById('resultadoGastos');
  const baseResult = document.getElementById('resultadoBase');
  const taxResult = document.getElementById('resultadoImpuesto');

  function formatCurrency(value) {
    value = value || 0;
    // Fallback para navegadores sin Intl
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        maximumFractionDigits: 0
      }).format(value);
    }
    // Fallback manual
    return '₡ ' + Math.round(value).toLocaleString('es-CR');
  }

  function calculateTax() {
    if (!incomeInput || !expensesInput || !rateInput || !incomeResult || !expensesResult || !baseResult || !taxResult) {
      return;
    }

    const income = Number(incomeInput.value) || 0;
    const expenses = Number(expensesInput.value) || 0;
    const rate = (Number(rateInput.value) || 0) / 100;
    const taxableBase = Math.max(0, income - expenses);
    const estimatedTax = taxableBase * rate;

    incomeResult.textContent = formatCurrency(income);
    expensesResult.textContent = formatCurrency(expenses);
    baseResult.textContent = formatCurrency(taxableBase);
    taxResult.textContent = formatCurrency(estimatedTax);
  }

  calculateTax();

  if (calculateButton) {
    calculateButton.addEventListener('click', calculateTax);
  }

  if (incomeInput) {
    incomeInput.addEventListener('input', calculateTax);
  }

  if (expensesInput) {
    expensesInput.addEventListener('input', calculateTax);
  }

  if (rateInput) {
    rateInput.addEventListener('change', calculateTax);
  }

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

  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
