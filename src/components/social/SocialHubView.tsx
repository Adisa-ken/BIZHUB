import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Info,
  ListOrdered,
  PenSquare,
  Sparkles,
} from 'lucide-react';
import {
  INITIAL_SOCIAL_ANALYTICS,
  type SocialMediaPresetId,
  type SocialPostRecord,
  type SocialPostStatus,
} from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  UI_CLASSES,
  type Language,
  type SocialChannelId,
  type SocialHubTabId,
} from '../../theme/tokens';
import { SocialAnalyticsTab } from './SocialAnalyticsTab';
import { SocialCalendarTab } from './SocialCalendarTab';
import { SocialCreateTab, type SocialComposerPrefill } from './SocialCreateTab';
import { SocialQueueTab } from './SocialQueueTab';

interface SocialHubViewProps {
  lang: Language;
  posts: SocialPostRecord[];
  composerPrefill?: SocialComposerPrefill | null;
  onSavePost: (input: {
    caption: string;
    channels: SocialChannelId[];
    dateKey: string;
    time24: string;
    mediaPresetId: SocialMediaPresetId | null;
    status: SocialPostStatus;
  }) => void;
  onReschedulePost: (postId: string, nextDateKey: string, nextTime24: string) => void;
  onSwapPostSlots: (draggedId: string, targetId: string) => void;
  onDeletePost: (postId: string) => void;
  onOpenAiStudio?: () => void;
  onBack?: () => void;
}

const SOCIAL_TABS: Array<{
  id: SocialHubTabId;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'calendar', icon: CalendarDays },
  { id: 'create', icon: PenSquare },
  { id: 'queue', icon: ListOrdered },
  { id: 'analytics', icon: BarChart3 },
];

export const SocialHubView: React.FC<SocialHubViewProps> = ({
  lang,
  posts,
  composerPrefill,
  onSavePost,
  onReschedulePost,
  onSwapPostSlots,
  onDeletePost,
  onOpenAiStudio,
  onBack,
}) => {
  const fullCopy = getCopy(lang);
  const t = fullCopy.socialHub;
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  const [activeSubTab, setActiveSubTab] = useState<SocialHubTabId>(
    composerPrefill ? 'create' : 'calendar'
  );
  const [createDateKey, setCreateDateKey] = useState('2026-11-20');
  const [queueFilter, setQueueFilter] = useState<SocialPostStatus>('scheduled');

  useEffect(() => {
    if (composerPrefill) {
      setActiveSubTab('create');
    }
  }, [composerPrefill?.nonce]);

  const handleCreateForDate = (dateKey: string) => {
    setCreateDateKey(dateKey);
    setActiveSubTab('create');
  };

  const handleGoToQueue = (filter: SocialPostStatus) => {
    setQueueFilter(filter);
    setActiveSubTab('queue');
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      {/* Header & Mandatory Demo Notice */}
      <section aria-labelledby="social-hub-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className={`${UI_CLASSES.pillButtonSecondary} mb-3 min-h-[44px] px-4 py-2 text-xs`}
              >
                <BackArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.backButton}</span>
              </button>
            )}
            <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
              {t.eyebrow}
            </p>
            <h1
              id="social-hub-heading"
              className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
            >
              {t.title}
            </h1>
          </div>

          {onOpenAiStudio && (
            <button
              type="button"
              onClick={onOpenAiStudio}
              className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-xs`}
            >
              <Sparkles className="h-4 w-4 shrink-0 text-[var(--bh-coral-text)]" aria-hidden="true" />
              <span>{fullCopy.shell.openAiStudioButton}</span>
            </button>
          )}
        </div>

        {/* Notice banner: "Demo: posts are not really published." */}
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-[16px] border border-[var(--bh-amber)]/45 bg-[var(--bh-amber-soft)] px-4 py-3 text-sm font-semibold text-[var(--bh-amber-text)]"
        >
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.notice}</span>
        </div>

        {/* Internal Tabs: Calendar, Create, Queue, Analytics */}
        <div
          role="tablist"
          aria-label={t.title}
          className="grid grid-cols-4 gap-1 rounded-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-1.5 sm:rounded-full"
        >
          {SOCIAL_TABS.map(({ id, icon: Icon }) => {
            const isActive = activeSubTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveSubTab(id)}
                className={`inline-flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-full px-1.5 py-1.5 text-[11px] font-bold whitespace-nowrap transition-colors sm:min-h-[44px] sm:flex-row sm:gap-2 sm:px-4 sm:text-sm ${
                  isActive
                    ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)] shadow-sm'
                    : 'text-[var(--bh-text-muted)] hover:bg-[var(--bh-surface-elevated)] hover:text-[var(--bh-text)]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden={true} />
                <span>{t.tabs[id]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Sub-Tab Panel */}
      {activeSubTab === 'calendar' && (
        <SocialCalendarTab
          lang={lang}
          posts={posts}
          onCreateForDate={handleCreateForDate}
        />
      )}

      {activeSubTab === 'create' && (
        <SocialCreateTab
          lang={lang}
          initialDateKey={createDateKey}
          prefill={composerPrefill}
          onSavePost={onSavePost}
          onGoToQueue={handleGoToQueue}
        />
      )}

      {activeSubTab === 'queue' && (
        <SocialQueueTab
          lang={lang}
          posts={posts}
          initialFilter={queueFilter}
          onReschedulePost={onReschedulePost}
          onSwapPostSlots={onSwapPostSlots}
          onDeletePost={onDeletePost}
          onGoToCreate={() => setActiveSubTab('create')}
        />
      )}

      {activeSubTab === 'analytics' && (
        <SocialAnalyticsTab
          lang={lang}
          analytics={INITIAL_SOCIAL_ANALYTICS}
          posts={posts}
        />
      )}
    </div>
  );
};
