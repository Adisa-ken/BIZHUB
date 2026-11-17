import React from 'react';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { getCopy } from '../i18n/translations';
import type { Language, ThemeMode } from '../theme/tokens';
import type { UserSession } from '../utils/appLogic';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  theme: ThemeMode;
  lang: Language;
  session: UserSession | null;
  unreadCount: number;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onOpenAlerts: () => void;
  onOpenProfile: () => void;
  onLogoClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  lang,
  session,
  unreadCount,
  onToggleTheme,
  onToggleLang,
  onOpenAlerts,
  onOpenProfile,
  onLogoClick,
}) => {
  const t = getCopy(lang);
  const initial =
    session?.mode !== 'guest'
      ? session?.firstName?.[0]?.toUpperCase() || session?.email?.[0]?.toUpperCase() || null
      : null;

  return (
    <header className="sticky top-0 z-30 h-[52px] border-b border-[var(--bh-border)] bg-[var(--bh-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onLogoClick}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-1 text-lg font-extrabold tracking-tight text-[var(--bh-text)] whitespace-nowrap"
          >
            <span>{t.brandName}</span>
          </button>
          <span
            className="rounded-full border border-[var(--bh-amber)]/50 bg-[var(--bh-amber-soft)] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[var(--bh-amber-text)] whitespace-nowrap shrink-0"
            aria-label={`${t.brandName} ${t.demoBadge}`}
          >
            {t.demoBadge}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:block">
            <PWAInstallButton lang={lang} variant="compact" />
          </div>

          <button
            type="button"
            onClick={onToggleLang}
            aria-label={t.topBar.switchLanguageAria}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] px-3 text-xs font-bold text-[var(--bh-text)] whitespace-nowrap shrink-0 transition-colors hover:border-[var(--bh-coral)]"
          >
            {t.topBar.switchLanguage}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.topBar.switchToLight : t.topBar.switchToDark}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] shrink-0 transition-colors hover:border-[var(--bh-coral)]"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] text-[var(--bh-amber-text)]" aria-hidden="true" />
            ) : (
              <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAlerts}
            aria-label={
              unreadCount > 0
                ? `${t.topBar.notificationsAria} (${unreadCount} ${t.topBar.unreadSuffix})`
                : t.topBar.notificationsAria
            }
            className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] text-[var(--bh-text)] shrink-0 transition-colors hover:border-[var(--bh-coral)]"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="tabular-nums absolute -top-1 -end-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--bh-coral)] px-1 text-[11px] font-bold text-[var(--bh-coral-ink)]">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label={t.topBar.profileAria}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] text-sm font-bold text-[var(--bh-text)] shrink-0 transition-colors hover:border-[var(--bh-coral)]"
          >
            {initial ? (
              <span className="text-[var(--bh-coral-text)]">{initial}</span>
            ) : (
              <User className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
