document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const incomeInput = document.getElementById('ingresos');
  const expensesInput = document.getElementById('gastos');
  const rateInput = document.getElementById('tasa');
  const calculateButton = document.getElementById('calcularImpuesto');

  const incomeResult = document.getElementById('resultadoIngresos');
  const expensesResult = document.getElementById('resultadoGastos');
  const baseResult = document.getElementById('resultadoBase');
  const taxResult = document.getElementById('resultadoImpuesto');

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);

    if (themeIcon) {
      themeIcon.textContent = isDark ? '☾' : '☀';
    }

    if (themeToggle) {
      themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      themeToggle.setAttribute('title', isDark ? 'Modo oscuro activo' : 'Modo claro activo');
    }
  }

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

  const savedTheme = localStorage.getItem('cc-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  calculateTax();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      localStorage.setItem('cc-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

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
});
