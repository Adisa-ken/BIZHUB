import React from 'react';
import { Dumbbell, HeartPulse, Scissors, Shirt, Sparkles } from 'lucide-react';
import type { BusinessCategory, BusinessRecord } from '../../data/businesses';

export const CATEGORY_ICONS: Record<
  BusinessCategory,
  React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  barber: Scissors,
  gym: Dumbbell,
  tailor: Shirt,
  salon: Sparkles,
  clinic: HeartPulse,
};

const COVER_TONE_CLASSES: Record<BusinessRecord['coverTone'], string> = {
  coral:
    'from-[#D64234]/20 via-[#EAEFF7] to-[#DCE4F2] dark:from-[#FF6B5B]/30 dark:via-[#1A2642] dark:to-[#0B1120]',
  amber:
    'from-[#F59E0B]/25 via-[#EAEFF7] to-[#DCE4F2] dark:from-[#F59E0B]/30 dark:via-[#1A2642] dark:to-[#0B1120]',
  teal:
    'from-[#0D9488]/20 via-[#EAEFF7] to-[#DCE4F2] dark:from-[#14B8A6]/30 dark:via-[#1A2642] dark:to-[#0B1120]',
  indigo:
    'from-[#4F46E5]/20 via-[#EAEFF7] to-[#DCE4F2] dark:from-[#6366F1]/30 dark:via-[#1A2642] dark:to-[#0B1120]',
  rose:
    'from-[#E11D48]/20 via-[#EAEFF7] to-[#DCE4F2] dark:from-[#FB7185]/30 dark:via-[#1A2642] dark:to-[#0B1120]',
};

interface BusinessPhotoPlaceholderProps {
  category: BusinessCategory;
  tone: BusinessRecord['coverTone'];
  label: string;
  heightClass?: string;
}

export const BusinessPhotoPlaceholder: React.FC<BusinessPhotoPlaceholderProps> = ({
  category,
  tone,
  label,
  heightClass = 'h-36',
}) => {
  const Icon = CATEGORY_ICONS[category];
  const gradientClasses = COVER_TONE_CLASSES[tone] ?? COVER_TONE_CLASSES.coral;

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-[16px] border border-[var(--bh-border)] bg-gradient-to-br ${gradientClasses} ${heightClass}`}
    >
      <div
        className="pointer-events-none absolute inset-0 text-[var(--bh-text)] opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 25%, currentColor 1px, transparent 1px), radial-gradient(circle at 80% 75%, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)]/95 text-[var(--bh-coral-text)] shadow-sm">
        <Icon className="h-6 w-6" aria-hidden={true} />
      </div>
    </div>
  );
};
