import React from 'react';
import { Dumbbell, Scissors, Shirt } from 'lucide-react';
import { getCopy } from '../../i18n/translations';
import type { EmployeeIndustryId, Language } from '../../theme/tokens';

interface EmployeeIndustryBarProps {
  lang: Language;
  industry: EmployeeIndustryId;
  onChangeIndustry: (industry: EmployeeIndustryId) => void;
}

const INDUSTRY_ITEMS: Array<{
  id: EmployeeIndustryId;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'barber', icon: Scissors },
  { id: 'trainer', icon: Dumbbell },
  { id: 'tailor', icon: Shirt },
];

export const EmployeeIndustryBar: React.FC<EmployeeIndustryBarProps> = ({
  lang,
  industry,
  onChangeIndustry,
}) => {
  const t = getCopy(lang).employee;

  return (
    <div
      role="radiogroup"
      aria-label={t.industrySwitcherLabel}
      className="grid grid-cols-3 gap-1.5 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] p-1"
    >
      {INDUSTRY_ITEMS.map(({ id, icon: Icon }) => {
        const isActive = industry === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChangeIndustry(id)}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors duration-150 sm:text-sm ${
              isActive
                ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)] shadow-sm'
                : 'text-[var(--bh-text-muted)] hover:bg-[var(--bh-surface-elevated)] hover:text-[var(--bh-text)]'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden={true} />
            <span>{t.industries[id].label}</span>
          </button>
        );
      })}
    </div>
  );
};
