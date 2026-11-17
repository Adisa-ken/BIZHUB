import React from 'react';
import { getCopy } from '../i18n/translations';
import {
  PROFILE_ROLE_IDS,
  type Language,
  type ProfileRoleId,
} from '../theme/tokens';
import { ROLE_ICONS } from './roleIcons';

interface ProfileSwitcherProps {
  lang: Language;
  activeRole: ProfileRoleId;
  onSelectRole: (role: ProfileRoleId) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  lang,
  activeRole,
  onSelectRole,
}) => {
  const copy = getCopy(lang);
  const t = copy.profile;
  const rolesCopy = copy.profileTypes.roles;

  return (
    <div className="space-y-2.5">
      <div>
        <h3 className="text-xs font-semibold text-[var(--bh-text-muted)]">
          {t.switcherHeading}
        </h3>
        <p className="mt-0.5 text-xs text-[var(--bh-text-muted)]">
          {t.switcherSubtitle}
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label={t.switcherHeading}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {PROFILE_ROLE_IDS.map((roleId) => {
          const Icon = ROLE_ICONS[roleId];
          const isActive = activeRole === roleId;
          const role = rolesCopy[roleId];

          return (
            <button
              key={roleId}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onSelectRole(roleId)}
              className={`flex min-h-[56px] items-center justify-between gap-2.5 rounded-[20px] px-3.5 py-2.5 text-start transition-colors duration-150 ${
                isActive
                  ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-surface-elevated)] ring-2 ring-[var(--bh-coral)]/20'
                  : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/60 hover:border-[var(--bh-text-muted)]'
              }`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isActive
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'bg-[var(--bh-surface-elevated)] text-[var(--bh-coral-text)]'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden={true} />
                </div>
                <span className="truncate text-xs font-extrabold tracking-wide text-[var(--bh-text)]">
                  {role.title}
                </span>
              </div>

              {isActive && (
                <span className="shrink-0 text-[11px] font-bold text-[var(--bh-coral-text)]">
                  {t.activeBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
