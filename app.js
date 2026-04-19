document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('cc-theme');
  document.body.classList.remove('dark-theme');

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
});
