import type { AlertItem } from '../i18n/translations';
import type { Language, ProfileRoleId, ThemeMode } from '../theme/tokens';

export interface UserSession {
  mode: 'guest' | 'email' | 'account';
  email: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  activeRole: ProfileRoleId;
}

export interface EmailValidationResult {
  valid: boolean;
  normalized: string;
  errorKey: 'required' | 'invalid' | null;
}

export interface SignUpFormInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export type SignUpFieldErrorKey =
  | 'firstNameRequired'
  | 'lastNameRequired'
  | 'phoneInvalid'
  | 'emailRequired'
  | 'emailInvalid'
  | 'passwordTooShort';

export interface SignUpValidationResult {
  valid: boolean;
  normalized: SignUpFormInput;
  errors: Partial<Record<keyof SignUpFormInput, SignUpFieldErrorKey>>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(rawEmail: string): EmailValidationResult {
  const normalized = rawEmail.trim();
  if (!normalized) {
    return { valid: false, normalized: '', errorKey: 'required' };
  }
  if (!EMAIL_PATTERN.test(normalized)) {
    return { valid: false, normalized, errorKey: 'invalid' };
  }
  return { valid: true, normalized, errorKey: null };
}

export function validateSignUpForm(input: SignUpFormInput): SignUpValidationResult {
  const normalized: SignUpFormInput = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    password: input.password,
  };

  const errors: Partial<Record<keyof SignUpFormInput, SignUpFieldErrorKey>> = {};

  if (!normalized.firstName) {
    errors.firstName = 'firstNameRequired';
  }
  if (!normalized.lastName) {
    errors.lastName = 'lastNameRequired';
  }
  const phoneDigits = normalized.phone.replace(/\D/g, '');
  if (phoneDigits.length < 7) {
    errors.phone = 'phoneInvalid';
  }
  const emailCheck = validateEmail(normalized.email);
  if (!emailCheck.valid) {
    errors.email = emailCheck.errorKey === 'required' ? 'emailRequired' : 'emailInvalid';
  }
  if (normalized.password.length < 6) {
    errors.password = 'passwordTooShort';
  }

  return {
    valid: Object.keys(errors).length === 0,
    normalized,
    errors,
  };
}

export function getDirectionForLang(lang: Language): 'ltr' | 'rtl' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function resolveNextTheme(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}

export function resolveNextLang(current: Language): Language {
  return current === 'en' ? 'ar' : 'en';
}

export function createGuestSession(activeRole: ProfileRoleId = 'client'): UserSession {
  return { mode: 'guest', email: null, activeRole };
}

export function createEmailSession(
  email: string,
  activeRole: ProfileRoleId = 'client'
): UserSession {
  return { mode: 'email', email: email.trim(), activeRole };
}

export function createAccountSession(
  input: Omit<SignUpFormInput, 'password'>,
  activeRole: ProfileRoleId
): UserSession {
  return {
    mode: 'account',
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    activeRole,
  };
}

export function switchSessionRole(
  session: UserSession,
  nextRole: ProfileRoleId
): UserSession {
  return {
    ...session,
    activeRole: nextRole,
  };
}

export function countUnreadAlerts(alerts: AlertItem[]): number {
  return alerts.reduce((count, alert) => (alert.read ? count : count + 1), 0);
}

export function markAlertRead(alerts: AlertItem[], alertId: string): AlertItem[] {
  return alerts.map((item) => (item.id === alertId ? { ...item, read: true } : item));
}

export function markAllAlertsRead(alerts: AlertItem[]): AlertItem[] {
  return alerts.map((item) => (item.read ? item : { ...item, read: true }));
}

export function parseInitialAutostart(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get('autostart') === '1';
}
