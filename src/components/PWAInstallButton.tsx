import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { getCopy } from '../i18n/translations';
import { UI_CLASSES, type Language } from '../theme/tokens';

interface PWAInstallButtonProps {
  lang: Language;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang, variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const t = getCopy(lang).pwa;

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={
          variant === 'full'
            ? `${UI_CLASSES.pillButtonSecondary} w-full`
            : 'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] px-4 py-2 text-xs font-semibold text-[var(--bh-text)] whitespace-nowrap shrink-0 transition-colors hover:border-[var(--bh-coral)]'
        }
      >
        <Download className="h-4 w-4 shrink-0 text-[var(--bh-coral-text)]" aria-hidden="true" />
        <span>{t.installButton}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={
            variant === 'full'
              ? `${UI_CLASSES.pillButtonSecondary} w-full`
              : 'inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] px-4 py-2 text-xs font-semibold text-[var(--bh-text)] whitespace-nowrap shrink-0 transition-colors hover:border-[var(--bh-coral)]'
          }
        >
          <Download className="h-4 w-4 shrink-0 text-[var(--bh-coral-text)]" aria-hidden="true" />
          <span>{t.installIosButton}</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className={`${UI_CLASSES.card} w-full max-w-sm p-6 shadow-xl`}>
              <h3 id="ios-install-title" className="text-lg font-bold text-[var(--bh-text)]">
                {t.iosTitle}
              </h3>
              <div className="mt-3 space-y-2 text-sm text-[var(--bh-text-muted)]">
                <p>{t.iosStep1}</p>
                <p>{t.iosStep2}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className={`${UI_CLASSES.pillButtonPrimary} mt-6 w-full`}
              >
                {t.iosClose}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
