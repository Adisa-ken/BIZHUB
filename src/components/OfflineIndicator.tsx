import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getCopy } from '../i18n/translations';
import type { Language } from '../theme/tokens';

interface OfflineIndicatorProps {
  lang: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang }) => {
  const isOnline = useOnlineStatus();
  const t = getCopy(lang).pwa;

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--bh-amber)] bg-[var(--bh-surface)] px-4 py-2 text-xs font-semibold text-[var(--bh-amber-text)] shadow-lg"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">{t.offlineBanner}</span>
    </div>
  );
};
