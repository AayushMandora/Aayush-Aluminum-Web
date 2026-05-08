export function formatCurrency(amount, currency = "₹") {
  const value = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return `${currency}${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(Math.round(value))}`;
}

export function formatDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function formatQuantity(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2
  }).format(number);
}

