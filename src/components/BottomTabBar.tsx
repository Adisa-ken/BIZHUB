import React from 'react';
import {
  CalendarCheck2,
  CalendarDays,
  CalendarPlus,
  ClipboardCheck,
  Compass,
  HelpCircle,
  Home,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { getCopy } from '../i18n/translations';
import type {
  ClientTabId,
  CreatorTabId,
  EmployeeTabId,
  Language,
  ProfileRoleId,
} from '../theme/tokens';

export type ShellTabId = ClientTabId | EmployeeTabId | CreatorTabId;

interface BottomTabBarProps {
  activeTab: ShellTabId;
  activeRole: ProfileRoleId;
  lang: Language;
  onSelectTab: (tab: ShellTabId) => void;
}

const CLIENT_TABS: Array<{
  id: ShellTabId;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'home', icon: Home },
  { id: 'book', icon: CalendarPlus },
  { id: 'bookings', icon: CalendarCheck2 },
  { id: 'explore', icon: Compass },
  { id: 'help', icon: HelpCircle },
];

const EMPLOYEE_TABS: Array<{
  id: ShellTabId;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'today', icon: ClipboardCheck },
  { id: 'schedule', icon: CalendarDays },
  { id: 'clients', icon: Users },
  { id: 'profile', icon: User },
];

const CREATOR_TABS: Array<{
  id: ShellTabId;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'home', icon: Home },
  { id: 'ai_studio', icon: Sparkles },
  { id: 'profile', icon: User },
  { id: 'help', icon: HelpCircle },
];

const ROLE_TABS: Array<{
  id: ShellTabId;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'home', icon: Home },
  { id: 'profile', icon: User },
  { id: 'help', icon: HelpCircle },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  activeRole,
  lang,
  onSelectTab,
}) => {
  const t = getCopy(lang);
  const items =
    activeRole === 'client'
      ? CLIENT_TABS
      : activeRole === 'employee'
        ? EMPLOYEE_TABS
        : activeRole === 'creator_marketer'
          ? CREATOR_TABS
          : ROLE_TABS;
  const gridColsClass =
    items.length === 5
      ? 'grid-cols-5'
      : items.length === 4
        ? 'grid-cols-4'
        : 'grid-cols-3';

  return (
    <nav
      aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'}
      className="fixed bottom-2 left-1/2 z-40 w-[calc(100%-24px)] max-w-md -translate-x-1/2 sm:bottom-4 sm:max-w-lg"
    >
      <div
        className={`grid h-[60px] items-center gap-1 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)]/95 p-1.5 shadow-xl shadow-black/25 backdrop-blur-md ${gridColsClass}`}
      >
        {items.map(({ id, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[46px] flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1 transition-colors duration-150 ${
                isActive
                  ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)] shadow-sm'
                  : 'text-[var(--bh-text-muted)] hover:bg-[var(--bh-surface-elevated)] hover:text-[var(--bh-text)]'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden={true} />
              <span className="max-w-full truncate text-[11px] font-semibold leading-none whitespace-nowrap">
                {t.tabs[id]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
