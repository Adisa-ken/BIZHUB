import React, { useId, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, X } from 'lucide-react';
import { getCopy } from '../i18n/translations';
import { UI_CLASSES, type Language, type ProfileRoleId } from '../theme/tokens';
import {
  validateSignUpForm,
  type SignUpFieldErrorKey,
  type SignUpFormInput,
} from '../utils/appLogic';
import { ROLE_ICONS } from './roleIcons';

interface SignUpFormScreenProps {
  lang: Language;
  selectedRole: ProfileRoleId;
  prefilledEmail?: string;
  onBackToRoles: () => void;
  onCancel: () => void;
  onCompleteSignUp: (data: Omit<SignUpFormInput, 'password'>, role: ProfileRoleId) => void;
}

export const SignUpFormScreen: React.FC<SignUpFormScreenProps> = ({
  lang,
  selectedRole,
  prefilledEmail = '',
  onBackToRoles,
  onCancel,
  onCompleteSignUp,
}) => {
  const copy = getCopy(lang);
  const t = copy.signUp;
  const roleInfo = copy.profileTypes.roles[selectedRole];
  const RoleIcon = ROLE_ICONS[selectedRole];
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  const firstNameId = useId();
  const lastNameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const passwordId = useId();

  const [form, setForm] = useState<SignUpFormInput>({
    firstName: '',
    lastName: '',
    phone: '',
    email: prefilledEmail,
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormInput, SignUpFieldErrorKey>>>(
    {}
  );

  const updateField = (field: keyof SignUpFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = validateSignUpForm(form);
    if (!res.valid) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    onCompleteSignUp(
      {
        firstName: res.normalized.firstName,
        lastName: res.normalized.lastName,
        phone: res.normalized.phone,
        email: res.normalized.email,
      },
      selectedRole
    );
  };

  return (
    <section
      aria-labelledby="signup-heading"
      className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-10"
    >
      <div className={`${UI_CLASSES.card} p-6 shadow-xl shadow-black/10 sm:p-8`}>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToRoles}
            aria-label={t.backAria}
            className={UI_CLASSES.iconButton}
          >
            <BackArrow className="h-5 w-5" aria-hidden="true" />
          </button>

          <h1
            id="signup-heading"
            className="flex-1 text-center text-xl font-extrabold tracking-tight text-[var(--bh-text)]"
          >
            {t.title}
          </h1>

          <button
            type="button"
            onClick={onCancel}
            aria-label={t.closeAria}
            className={UI_CLASSES.iconButton}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Selected Role Summary */}
        <div className="mt-5 flex items-center justify-between gap-3 rounded-[20px] border border-[var(--bh-coral)]/50 bg-[var(--bh-surface-elevated)] px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]">
              <RoleIcon className="h-4 w-4" aria-hidden={true} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[var(--bh-text-muted)]">
                {t.selectedRoleLabel}
              </p>
              <p className="text-sm font-extrabold leading-tight text-[var(--bh-text)]">
                {roleInfo.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToRoles}
            className="inline-flex min-h-[44px] items-center rounded-full px-3 text-xs font-semibold text-[var(--bh-coral-text)] whitespace-nowrap shrink-0 hover:underline"
          >
            {t.changeRole}
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={firstNameId}
                className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]"
              >
                {t.firstNameLabel}
              </label>
              <input
                id={firstNameId}
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder={t.firstNamePlaceholder}
                aria-invalid={errors.firstName ? 'true' : 'false'}
                className={UI_CLASSES.inputPill}
              />
              {errors.firstName && (
                <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                  {t.errors[errors.firstName]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={lastNameId}
                className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]"
              >
                {t.lastNameLabel}
              </label>
              <input
                id={lastNameId}
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder={t.lastNamePlaceholder}
                aria-invalid={errors.lastName ? 'true' : 'false'}
                className={UI_CLASSES.inputPill}
              />
              {errors.lastName && (
                <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                  {t.errors[errors.lastName]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor={phoneId}
              className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]"
            >
              {t.phoneLabel}
            </label>
            <input
              id={phoneId}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder={t.phonePlaceholder}
              aria-invalid={errors.phone ? 'true' : 'false'}
              className={UI_CLASSES.inputPill}
            />
            {errors.phone && (
              <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                {t.errors[errors.phone]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={emailId}
              className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]"
            >
              {t.emailLabel}
            </label>
            <input
              id={emailId}
              type="email"
              inputMode="email"
              autoComplete="email"
              dir="ltr"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder={t.emailPlaceholder}
              aria-invalid={errors.email ? 'true' : 'false'}
              className={UI_CLASSES.inputPill}
            />
            {errors.email && (
              <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                {t.errors[errors.email]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="mb-1.5 block text-sm font-semibold text-[var(--bh-text)]"
            >
              {t.passwordLabel}
            </label>
            <div className="relative">
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                dir="ltr"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder={t.passwordPlaceholder}
                aria-invalid={errors.password ? 'true' : 'false'}
                className={`${UI_CLASSES.inputPill} pe-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t.hidePasswordAria : t.showPasswordAria}
                className="absolute top-1/2 end-1.5 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p role="alert" className="mt-1.5 text-xs font-semibold text-[var(--bh-error)]">
                {t.errors[errors.password]}
              </p>
            )}
          </div>

          <button type="submit" className={`${UI_CLASSES.pillButtonPrimary} mt-2 w-full`}>
            {t.submitButton}
          </button>

          <p className="text-center text-xs text-[var(--bh-text-muted)]">{t.demoHint}</p>
        </form>
      </div>
    </section>
  );
};
