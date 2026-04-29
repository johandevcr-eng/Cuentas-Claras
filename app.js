document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('cc-theme');
  document.body.classList.remove('dark-theme');

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
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0
    }).format(value || 0);
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (whatsappFloatButton) {
    whatsappFloatButton.addEventListener('click', () => {
      window.open(whatsappFloatButton.dataset.href, '_blank', 'noopener');
    });
  }

  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
});
