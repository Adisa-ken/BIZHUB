import React, { useEffect, useMemo, useState } from 'react';
import { CalendarClock, GripVertical, Trash2, X } from 'lucide-react';
import {
  SOCIAL_CHANNEL_META,
  SOCIAL_MEDIA_PRESETS,
  type SocialPostRecord,
  type SocialPostStatus,
} from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';
import { sortSocialPosts } from '../../utils/socialHubLogic';

interface SocialQueueTabProps {
  lang: Language;
  posts: SocialPostRecord[];
  initialFilter?: SocialPostStatus;
  onReschedulePost: (postId: string, nextDateKey: string, nextTime24: string) => void;
  onSwapPostSlots: (draggedId: string, targetId: string) => void;
  onDeletePost: (postId: string) => void;
  onGoToCreate: () => void;
}

export const SocialQueueTab: React.FC<SocialQueueTabProps> = ({
  lang,
  posts,
  initialFilter = 'scheduled',
  onReschedulePost,
  onSwapPostSlots,
  onDeletePost,
  onGoToCreate,
}) => {
  const t = getCopy(lang).socialHub.queue;
  const [filter, setFilter] = useState<SocialPostStatus>(initialFilter);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<SocialPostRecord | null>(null);
  const [draftDate, setDraftDate] = useState('2026-11-20');
  const [draftTime, setDraftTime] = useState('10:00');

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  useEffect(() => {
    if (!rescheduleTarget) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRescheduleTarget(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [rescheduleTarget]);

  const upcomingPosts = useMemo(
    () => sortSocialPosts(posts.filter((p) => p.status === 'scheduled')),
    [posts]
  );
  const draftPosts = useMemo(
    () => sortSocialPosts(posts.filter((p) => p.status === 'draft')),
    [posts]
  );
  const activeList = filter === 'scheduled' ? upcomingPosts : draftPosts;

  const openReschedule = (post: SocialPostRecord) => {
    setRescheduleTarget(post);
    setDraftDate(post.dateKey);
    setDraftTime(post.time24);
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--bh-text)]">{t.title}</h2>
          <p className="mt-0.5 text-xs text-[var(--bh-text-muted)]">{t.subtitle}</p>
        </div>

        <div
          role="tablist"
          aria-label={t.title}
          className="grid grid-cols-2 gap-1 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] p-1 sm:w-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'scheduled'}
            onClick={() => setFilter('scheduled')}
            className={`tabular-nums min-h-[44px] rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'scheduled'
                ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                : 'text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]'
            }`}
          >
            {t.upcomingTab} ({upcomingPosts.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'draft'}
            onClick={() => setFilter('draft')}
            className={`tabular-nums min-h-[44px] rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'draft'
                ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                : 'text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]'
            }`}
          >
            {t.draftsTab} ({draftPosts.length})
          </button>
        </div>
      </div>

      {/* Queue List */}
      {activeList.length === 0 ? (
        <div className={`${UI_CLASSES.card} space-y-4 p-8 text-center`}>
          <p className="text-sm text-[var(--bh-text-muted)]">
            {filter === 'scheduled' ? t.emptyUpcoming : t.emptyDrafts}
          </p>
          <button
            type="button"
            onClick={onGoToCreate}
            className={UI_CLASSES.pillButtonPrimary}
          >
            {t.createCta}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {activeList.map((post) => {
            const media = post.mediaPresetId
              ? SOCIAL_MEDIA_PRESETS.find((m) => m.id === post.mediaPresetId)
              : null;
            const isDragging = draggedId === post.id;

            return (
              <article
                key={post.id}
                draggable={filter === 'scheduled'}
                onDragStart={() => setDraggedId(post.id)}
                onDragOver={(e) => {
                  if (filter === 'scheduled' && draggedId && draggedId !== post.id) {
                    e.preventDefault();
                  }
                }}
                onDrop={() => {
                  if (filter === 'scheduled' && draggedId && draggedId !== post.id) {
                    onSwapPostSlots(draggedId, post.id);
                  }
                  setDraggedId(null);
                }}
                onDragEnd={() => setDraggedId(null)}
                className={`${UI_CLASSES.card} flex flex-col justify-between gap-4 p-4 transition-opacity sm:flex-row sm:items-center sm:p-5 ${
                  isDragging ? 'opacity-60 border-[var(--bh-coral)]' : ''
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  {filter === 'scheduled' && (
                    <span
                      title={t.dragHint}
                      aria-hidden="true"
                      className="mt-1 hidden cursor-grab text-[var(--bh-text-muted)] sm:block"
                    >
                      <GripVertical className="h-5 w-5" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="tabular-nums text-[var(--bh-amber-text)]">
                        {post.dateKey} · {post.time24}
                      </span>
                      <span className="text-[var(--bh-text-muted)]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-[var(--bh-coral-text)]">
                        {post.channels
                          .map((ch) =>
                            lang === 'ar'
                              ? SOCIAL_CHANNEL_META[ch].nameAr
                              : SOCIAL_CHANNEL_META[ch].nameEn
                          )
                          .join(' · ')}
                      </span>
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-[var(--bh-text)]">
                      {post.caption}
                    </p>

                    {media && (
                      <p className="text-xs text-[var(--bh-text-muted)]">
                        {lang === 'ar' ? media.labelAr : media.labelEn}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openReschedule(post)}
                    className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-xs`}
                  >
                    <CalendarClock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      {filter === 'scheduled'
                        ? t.rescheduleButton
                        : t.scheduleDraftButton}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeletePost(post.id)}
                    aria-label={`${t.deleteButton} — ${post.dateKey} ${post.time24}`}
                    className={`${UI_CLASSES.iconButton} text-[var(--bh-error)]`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Tap-to-Reschedule Sheet */}
      {rescheduleTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setRescheduleTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reschedule-social-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-6 shadow-2xl sm:rounded-[20px]"
          >
            <div className="flex items-center justify-between gap-3">
              <h3
                id="reschedule-social-title"
                className="text-lg font-extrabold text-[var(--bh-text)]"
              >
                {t.modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                aria-label={t.modalClose}
                className={UI_CLASSES.iconButton}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-2 line-clamp-2 text-xs text-[var(--bh-text-muted)]">
              {rescheduleTarget.caption}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraftDate('2026-11-18');
                  setDraftTime('10:00');
                }}
                className={`${UI_CLASSES.pillButtonSecondary} min-h-[40px] px-3.5 py-1.5 text-xs`}
              >
                {t.quickTomorrow}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftDate('2026-11-20');
                  setDraftTime('14:00');
                }}
                className={`${UI_CLASSES.pillButtonSecondary} min-h-[40px] px-3.5 py-1.5 text-xs`}
              >
                {t.quickNextWeek}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reschedule-date-input"
                  className="mb-1 block text-xs font-bold text-[var(--bh-text)]"
                >
                  {getCopy(lang).socialHub.create.dateLabel}
                </label>
                <input
                  id="reschedule-date-input"
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className={`${UI_CLASSES.inputPill} tabular-nums`}
                />
              </div>
              <div>
                <label
                  htmlFor="reschedule-time-input"
                  className="mb-1 block text-xs font-bold text-[var(--bh-text)]"
                >
                  {getCopy(lang).socialHub.create.timeLabel}
                </label>
                <input
                  id="reschedule-time-input"
                  type="time"
                  value={draftTime}
                  onChange={(e) => setDraftTime(e.target.value)}
                  className={`${UI_CLASSES.inputPill} tabular-nums`}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onReschedulePost(rescheduleTarget.id, draftDate, draftTime);
                setRescheduleTarget(null);
              }}
              className={`${UI_CLASSES.pillButtonPrimary} mt-5 w-full`}
            >
              {t.modalSave}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
