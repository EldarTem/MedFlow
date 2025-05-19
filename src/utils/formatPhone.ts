// src/utils/formatPhone.ts
export function formatPhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (!digits.startsWith('7')) {
    digits = '7' + digits;
  }
  let formatted = '+7';
  if (digits.length > 1) {
    formatted += ' (' + digits.substring(1, 4);
  }
  if (digits.length >= 5) {
    formatted += ') ' + digits.substring(4, 7);
  }
  if (digits.length >= 8) {
    formatted += '-' + digits.substring(7, 9);
  }
  if (digits.length >= 10) {
    formatted += '-' + digits.substring(9, 11);
  }
  return formatted;
}
