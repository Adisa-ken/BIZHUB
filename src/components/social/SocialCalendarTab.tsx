import React, { useMemo, useState } from 'react';
import { CalendarPlus, Clock } from 'lucide-react';
import {
  SOCIAL_CHANNEL_META,
  SOCIAL_MEDIA_PRESETS,
  type SocialPostRecord,
} from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';
import {
  buildMonthGrid,
  groupScheduledPostsByDate,
} from '../../utils/socialHubLogic';

interface SocialCalendarTabProps {
  lang: Language;
  posts: SocialPostRecord[];
  onCreateForDate: (dateKey: string) => void;
}

export const SocialCalendarTab: React.FC<SocialCalendarTabProps> = ({
  lang,
  posts,
  onCreateForDate,
}) => {
  const t = getCopy(lang).socialHub.calendar;
  const [selectedDateKey, setSelectedDateKey] = useState<string>('2026-11-17');

  const monthCells = useMemo(() => buildMonthGrid(2026, 10), []);
  const postsByDate = useMemo(() => groupScheduledPostsByDate(posts), [posts]);
  const selectedPosts = postsByDate[selectedDateKey] ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Month Grid */}
      <section
        aria-labelledby="social-calendar-month"
        className={`${UI_CLASSES.card} p-4 sm:p-6 lg:col-span-7`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="social-calendar-month"
            className="text-lg font-extrabold tracking-tight text-[var(--bh-text)]"
          >
            {t.monthLabel}
          </h2>
          <span className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
            {posts.filter((p) => p.status === 'scheduled').length} {t.postPlural}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {t.weekdays.map((day) => (
            <div
              key={day}
              className="py-1.5 text-[11px] font-bold text-[var(--bh-text-muted)]"
            >
              {day}
            </div>
          ))}

          {monthCells.map((cell) => {
            const dayPosts = postsByDate[cell.dateKey] ?? [];
            const isSelected = selectedDateKey === cell.dateKey;
            const hasPosts = dayPosts.length > 0;

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => setSelectedDateKey(cell.dateKey)}
                aria-pressed={isSelected}
                aria-label={`${cell.dateKey}${
                  hasPosts ? ` (${dayPosts.length} ${t.postPlural})` : ''
                }`}
                className={`flex min-h-[52px] flex-col items-center justify-between rounded-[14px] border p-1.5 transition-colors sm:min-h-[64px] sm:p-2 ${
                  isSelected
                    ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-surface-elevated)]'
                    : hasPosts
                      ? 'border-[var(--bh-border)] bg-[var(--bh-bg)] hover:border-[var(--bh-coral)]'
                      : 'border-transparent bg-[var(--bh-bg)]/50 hover:border-[var(--bh-border)]'
                } ${cell.inCurrentMonth ? 'opacity-100' : 'opacity-40'}`}
              >
                <span
                  className={`tabular-nums text-xs font-bold ${
                    isSelected
                      ? 'text-[var(--bh-coral-text)]'
                      : 'text-[var(--bh-text)]'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {hasPosts ? (
                  <span className="tabular-nums rounded-full bg-[var(--bh-coral-soft)] px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--bh-coral-text)]">
                    {dayPosts.length}
                  </span>
                ) : (
                  <span className="h-3" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Day Agenda */}
      <aside
        aria-labelledby="selected-date-heading"
        className={`${UI_CLASSES.card} flex flex-col justify-between gap-5 p-5 sm:p-6 lg:col-span-5`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
                {t.scheduledOnDateHeading}
              </p>
              <h3
                id="selected-date-heading"
                className="tabular-nums text-lg font-extrabold text-[var(--bh-text)]"
              >
                {selectedDateKey}
              </h3>
            </div>
            <span className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
              {selectedPosts.length}{' '}
              {selectedPosts.length === 1 ? t.postSingular : t.postPlural}
            </span>
          </div>

          {selectedPosts.length === 0 ? (
            <div className="rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-5 text-sm text-[var(--bh-text-muted)]">
              {t.emptyDate}
            </div>
          ) : (
            <div className="space-y-3">
              {selectedPosts.map((post) => {
                const media = post.mediaPresetId
                  ? SOCIAL_MEDIA_PRESETS.find((m) => m.id === post.mediaPresetId)
                  : null;
                return (
                  <article
                    key={post.id}
                    className="space-y-2 rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="tabular-nums inline-flex items-center gap-1 font-bold text-[var(--bh-amber-text)]">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {post.time24}
                      </span>
                      <span className="font-semibold text-[var(--bh-text-muted)]">
                        {post.channels
                          .map((ch) =>
                            lang === 'ar'
                              ? SOCIAL_CHANNEL_META[ch].nameAr
                              : SOCIAL_CHANNEL_META[ch].nameEn
                          )
                          .join(' · ')}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--bh-text)]">
                      {post.caption}
                    </p>
                    {media && (
                      <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
                        {lang === 'ar' ? media.labelAr : media.labelEn}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onCreateForDate(selectedDateKey)}
          className={`${UI_CLASSES.pillButtonPrimary} w-full`}
        >
          <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.createForDateButton}</span>
        </button>
      </aside>
    </div>
  );
};
