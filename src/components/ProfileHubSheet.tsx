import React, { useEffect } from 'react';
import { LogOut, Moon, Sun, User, UserPlus, X } from 'lucide-react';
import { getCopy } from '../i18n/translations';
import {
  UI_CLASSES,
  type Language,
  type ProfileRoleId,
  type ThemeMode,
} from '../theme/tokens';
import type { UserSession } from '../utils/appLogic';
import { ProfileSwitcher } from './ProfileSwitcher';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileHubSheetProps {
  open: boolean;
  lang: Language;
  theme: ThemeMode;
  session: UserSession;
  onClose: () => void;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onSwitchRole: (role: ProfileRoleId) => void;
  onOpenCreateAccount: () => void;
  onSignOutToLaunch: () => void;
}

export const ProfileHubSheet: React.FC<ProfileHubSheetProps> = ({
  open,
  lang,
  theme,
  session,
  onClose,
  onToggleTheme,
  onToggleLang,
  onSwitchRole,
  onOpenCreateAccount,
  onSignOutToLaunch,
}) => {
  const copy = getCopy(lang);
  const t = copy.profile;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isSignedIn = session.mode !== 'guest' && Boolean(session.email);
  const displayName =
    session.firstName && session.lastName
      ? `${session.firstName} ${session.lastName}`
      : isSignedIn
        ? session.email
        : t.guestTitle;
  const avatarInitial =
    session.firstName?.[0]?.toUpperCase() || session.email?.[0]?.toUpperCase() || null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-hub-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-6 shadow-2xl sm:rounded-[20px]"
      >
        <div
          className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[var(--bh-border)] sm:hidden"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--bh-coral-soft)] text-base font-bold text-[var(--bh-coral-text)]">
              {avatarInitial || <User className="h-5 w-5" aria-hidden="true" />}
            </div>
            <div className="min-w-0">
              <h2 id="profile-hub-title" className="text-lg font-bold text-[var(--bh-text)]">
                {t.title}
              </h2>
              <p className="truncate text-sm font-semibold text-[var(--bh-text)]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[var(--bh-text-muted)]">
                {isSignedIn
                  ? `${session.email} · ${copy.profileTypes.roles[session.activeRole].title}`
                  : t.guestSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className={UI_CLASSES.iconButton}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {!isSignedIn && (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCreateAccount();
              }}
              className={`${UI_CLASSES.pillButtonPrimary} w-full`}
            >
              <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.createAccountButton}</span>
            </button>
          </div>
        )}

        <div className="mt-5 border-t border-[var(--bh-border)] pt-5">
          <ProfileSwitcher
            lang={lang}
            activeRole={session.activeRole}
            onSelectRole={(role) => {
              onSwitchRole(role);
              onClose();
            }}
          />
        </div>

        <div className="mt-5 space-y-3 border-t border-[var(--bh-border)] pt-5">
          <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
            {t.preferencesHeading}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex min-h-[48px] items-center justify-between rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--bh-text)] transition-colors hover:border-[var(--bh-coral)]"
            >
              <span>{t.themeLabel}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--bh-coral-text)]">
                {theme === 'dark' ? (
                  <>
                    <Moon className="h-4 w-4" aria-hidden="true" />
                    <span>{t.darkLabel}</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" aria-hidden="true" />
                    <span>{t.lightLabel}</span>
                  </>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleLang}
              className="flex min-h-[48px] items-center justify-between rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] px-4 py-3 text-sm font-semibold text-[var(--bh-text)] transition-colors hover:border-[var(--bh-coral)]"
            >
              <span>{t.languageLabel}</span>
              <span className="text-xs font-bold text-[var(--bh-coral-text)]">
                {lang === 'en' ? 'English → العربية' : 'العربية → English'}
              </span>
            </button>
          </div>

          <PWAInstallButton lang={lang} variant="full" />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[var(--bh-border)] pt-5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOutToLaunch();
            }}
            className={`${UI_CLASSES.pillButtonSecondary} w-full`}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.signOutButton}</span>
          </button>
          <p className="text-center text-xs text-[var(--bh-text-muted)]">{t.demoNotice}</p>
        </div>
      </div>
    </div>
  );
};
