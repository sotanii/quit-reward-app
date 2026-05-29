export function isValidDateString(dateText: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return false;
  const date = new Date(`${dateText}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return false;
  const [y, m, d] = dateText.split('-').map(Number);
  return date.getUTCFullYear() === y && date.getUTCMonth() + 1 === m && date.getUTCDate() === d;
}

export function isNotFutureDate(dateText: string): boolean {
  if (!isValidDateString(dateText)) return false;
  const input = new Date(`${dateText}T00:00:00`);
  const today = new Date();
  input.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return input.getTime() <= today.getTime();
}

export function isValidHttpUrl(url: string): boolean {
  return /^https?:\/\//.test(url.trim());
}
