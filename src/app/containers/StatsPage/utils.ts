export function formatNumber(num: number, decimal: number) {
  return num.toLocaleString('en', {
    maximumFractionDigits: decimal,
    minimumFractionDigits: decimal,
  });
}
