import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getCopy } from '../i18n/translations';
import {
  PROFILE_ROLE_IDS,
  UI_CLASSES,
  type Language,
  type ProfileRoleId,
} from '../theme/tokens';
import { ROLE_ICONS } from './roleIcons';

interface SelectProfileTypeSheetProps {
  open: boolean;
  lang: Language;
  initialRole?: ProfileRoleId | null;
  onClose: () => void;
  onConfirmRole: (role: ProfileRoleId) => void;
}

export const SelectProfileTypeSheet: React.FC<SelectProfileTypeSheetProps> = ({
  open,
  lang,
  initialRole = null,
  onClose,
  onConfirmRole,
}) => {
  const t = getCopy(lang).profileTypes;
  const [selectedRole, setSelectedRole] = useState<ProfileRoleId | null>(initialRole);

  useEffect(() => {
    if (open) {
      setSelectedRole(initialRole);
    }
  }, [open, initialRole]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-profile-type-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-5 shadow-2xl sm:rounded-[20px] sm:p-6"
      >
        <div
          className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--bh-border)] sm:hidden"
          aria-hidden="true"
        />

        {/* Header with close (X) button at top-left (start edge) */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeAria}
            className={UI_CLASSES.iconButton}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <h2
            id="select-profile-type-title"
            className="flex-1 text-center text-base font-extrabold tracking-wide text-[var(--bh-text)] sm:text-lg"
          >
            {t.sheetTitle}
          </h2>

          {/* Spacer matching 44px button width to keep title visually centered */}
          <div className="h-[44px] w-[44px] shrink-0" aria-hidden="true" />
        </div>

        <p className="mt-2 text-center text-sm text-[var(--bh-text-muted)]">
          {t.sheetSubtitle}
        </p>

        <div
          role="radiogroup"
          aria-labelledby="select-profile-type-title"
          className="mt-5 grid grid-cols-1 gap-3"
        >
          {PROFILE_ROLE_IDS.map((roleId) => {
            const roleCopy = t.roles[roleId];
            const Icon = ROLE_ICONS[roleId];
            const isSelected = selectedRole === roleId;

            return (
              <button
                key={roleId}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedRole(roleId)}
                className={`flex min-h-[76px] w-full items-center gap-4 rounded-[20px] p-4 text-start transition-colors duration-150 ${
                  isSelected
                    ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-surface-elevated)] ring-2 ring-[var(--bh-coral)]/25'
                    : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/60 hover:border-[var(--bh-text-muted)]'
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    isSelected
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'bg-[var(--bh-surface-elevated)] text-[var(--bh-coral-text)]'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden={true} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold tracking-wide text-[var(--bh-text)]">
                    {roleCopy.title}
                  </div>
                  <p className="mt-0.5 text-xs leading-snug text-[var(--bh-text-muted)] sm:text-sm">
                    {roleCopy.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <button
            type="button"
            disabled={!selectedRole}
            onClick={() => {
              if (selectedRole) {
                onConfirmRole(selectedRole);
              }
            }}
            className={`${UI_CLASSES.pillButtonPrimary} w-full`}
          >
            {t.ctaButton}
          </button>
        </div>
      </div>
    </div>
  );
};
