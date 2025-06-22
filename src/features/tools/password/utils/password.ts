import { PasswordOptions } from '../types';

export function generatePassword(options: PasswordOptions): string {
  let chars = '';

  if (options.includeLowercase) {
    chars += 'abcdefghijklmnopqrstuvwxyz';
  }
  if (options.includeUppercase) {
    chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (options.includeNumbers) {
    chars += '0123456789';
  }
  if (options.includeSymbols) {
    chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }

  if (!chars) {
    return '';
  }

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('パスワードは8文字以上にしてください');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('小文字を含めてください');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('大文字を含めてください');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('数字を含めてください');
  }

  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('記号を含めてください');
  }

  return { score, feedback };
}
