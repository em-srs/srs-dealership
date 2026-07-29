export const USD_TO_INR_EXCHANGE_RATE = 83;

/**
 * Formats a USD price amount into INR currency format with Lakh/Crore digit grouping and ₹ symbol.
 * Example: 26000 USD * 83 = 2,158,000 INR -> "₹21,58,000"
 * @param {number|string} amountInUSD 
 * @returns {string} Formatted price string with ₹ prefix
 */
export function formatINR(amountInUSD) {
  const num = Number(amountInUSD);
  if (amountInUSD === null || amountInUSD === undefined || isNaN(num)) {
    return '₹0';
  }
  const amountInINR = num * USD_TO_INR_EXCHANGE_RATE;
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amountInINR);
  return `₹${formatted}`;
}
