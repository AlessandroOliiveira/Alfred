export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('A senha deve ter pelo menos 6 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateNumber(value: string): boolean {
  return !isNaN(Number(value)) && value.trim().length > 0;
}

export function validatePositiveNumber(value: string): boolean {
  return validateNumber(value) && Number(value) > 0;
}
