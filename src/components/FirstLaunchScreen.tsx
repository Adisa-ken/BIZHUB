import React, { useId, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, Mail, UserPlus } from 'lucide-react';
import { getCopy } from '../i18n/translations';
import { UI_CLASSES, type Language } from '../theme/tokens';
import { validateEmail } from '../utils/appLogic';

interface FirstLaunchScreenProps {
  lang: Language;
  onBrowseGuest: () => void;
  onContinueEmail: (email: string) => void;
  onOpenCreateAccount: () => void;
}

export const FirstLaunchScreen: React.FC<FirstLaunchScreenProps> = ({
  lang,
  onBrowseGuest,
  onContinueEmail,
  onOpenCreateAccount,
}) => {
  const t = getCopy(lang);
  const fl = t.firstLaunch;
  const emailInputId = useId();
  const errorId = useId();

  const [email, setEmail] = useState('');
  const [errorKey, setErrorKey] = useState<'required' | 'invalid' | null>(null);

  const DirectionalArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateEmail(email);
    if (!result.valid) {
      setErrorKey(result.errorKey);
      return;
    }
    setErrorKey(null);
    onContinueEmail(result.normalized);
  };

  const errorMessage =
    errorKey === 'required'
      ? fl.emailRequiredError
      : errorKey === 'invalid'
        ? fl.emailInvalidError
        : null;

  return (
    <section
      aria-labelledby="launch-heading"
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:py-12"
    >
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Start Column: Brand Logo, Headline & Shell Context */}
        <div className="space-y-6 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-4xl">
              {t.brandName}
            </span>
            <span className="rounded-full border border-[var(--bh-amber)]/50 bg-[var(--bh-amber-soft)] px-2.5 py-1 text-xs font-bold tracking-wider text-[var(--bh-amber-text)]">
              {t.demoBadge}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[var(--bh-coral-text)]">
              {fl.eyebrow}
            </p>
            <h1
              id="launch-heading"
              className="max-w-2xl text-[32px] font-extrabold leading-[1.12] tracking-tight text-[var(--bh-text)] text-balance sm:text-5xl"
            >
              {fl.headline}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[var(--bh-text-muted)] sm:text-lg">
              {fl.subhead}
            </p>
          </div>

          <div className={`${UI_CLASSES.card} hidden p-6 lg:block`}>
            <p className="text-sm font-semibold text-[var(--bh-text)]">
              {fl.shellPreviewTitle}
            </p>
            <p className="mt-1 text-sm text-[var(--bh-text-muted)]">
              {fl.shellPreviewCaption}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--bh-text-muted)]">
              <span>{t.tabs.home}</span>
              <span aria-hidden="true">·</span>
              <span>{t.tabs.book}</span>
              <span aria-hidden="true">·</span>
              <span>{t.tabs.bookings}</span>
              <span aria-hidden="true">·</span>
              <span>{t.tabs.explore}</span>
              <span aria-hidden="true">·</span>
              <span>{t.tabs.help}</span>
            </div>
          </div>
        </div>

        {/* End Column: Primary Launch Actions Card */}
        <div className="lg:col-span-5">
          <div className={`${UI_CLASSES.card} p-6 shadow-xl shadow-black/10 sm:p-8`}>
            <button
              type="button"
              onClick={onBrowseGuest}
              className={`${UI_CLASSES.pillButtonPrimary} w-full`}
            >
              <Compass className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{fl.browseButton}</span>
            </button>

            <p className="mt-3 text-center text-xs text-[var(--bh-text-muted)]">
              {fl.guestHint}
            </p>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--bh-border)]" aria-hidden="true" />
              <span className="text-xs font-medium text-[var(--bh-text-muted)]">
                {fl.orDivider}
              </span>
              <div className="h-px flex-1 bg-[var(--bh-border)]" aria-hidden="true" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label
                  htmlFor={emailInputId}
                  className="mb-2 block text-sm font-semibold text-[var(--bh-text)]"
                >
                  {fl.emailLabel}
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute top-1/2 start-4 h-[18px] w-[18px] -translate-y-1/2 text-[var(--bh-text-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    id={emailInputId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorKey) setErrorKey(null);
                    }}
                    placeholder={fl.emailPlaceholder}
                    aria-invalid={errorMessage ? 'true' : 'false'}
                    aria-describedby={errorMessage ? errorId : undefined}
                    className={`${UI_CLASSES.inputPill} ps-11`}
                  />
                </div>
                {errorMessage && (
                  <p
                    id={errorId}
                    role="alert"
                    className="mt-2 text-xs font-semibold text-[var(--bh-error)]"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`${UI_CLASSES.pillButtonSecondary} w-full`}
              >
                <span>{fl.continueButton}</span>
                <DirectionalArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onOpenCreateAccount}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-[var(--bh-coral-text)] transition-opacity hover:underline"
              >
                <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{fl.createAccountLink}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
