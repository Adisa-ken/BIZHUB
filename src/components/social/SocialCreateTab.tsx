import React, { useEffect, useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  FileText,
  ImagePlus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  SOCIAL_CHANNEL_META,
  SOCIAL_MEDIA_PRESETS,
  type SocialMediaPresetId,
  type SocialPostStatus,
} from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  SOCIAL_CHANNEL_IDS,
  UI_CLASSES,
  type Language,
  type SocialChannelId,
} from '../../theme/tokens';
import { validateSocialPostInput } from '../../utils/socialHubLogic';

export interface SocialComposerPrefill {
  caption: string;
  mediaPresetId: SocialMediaPresetId | null;
  nonce: number;
}

interface SocialCreateTabProps {
  lang: Language;
  initialDateKey: string;
  prefill?: SocialComposerPrefill | null;
  onSavePost: (input: {
    caption: string;
    channels: SocialChannelId[];
    dateKey: string;
    time24: string;
    mediaPresetId: SocialMediaPresetId | null;
    status: SocialPostStatus;
  }) => void;
  onGoToQueue: (filter: SocialPostStatus) => void;
}

export const SocialCreateTab: React.FC<SocialCreateTabProps> = ({
  lang,
  initialDateKey,
  prefill,
  onSavePost,
  onGoToQueue,
}) => {
  const t = getCopy(lang).socialHub.create;

  const [caption, setCaption] = useState(prefill?.caption ?? '');
  const [selectedChannels, setSelectedChannels] = useState<SocialChannelId[]>([
    'instagram',
    'x',
  ]);
  const [mediaPresetId, setMediaPresetId] = useState<SocialMediaPresetId | null>(
    prefill !== undefined && prefill !== null ? prefill.mediaPresetId : 'reel_fade'
  );
  const [dateKey, setDateKey] = useState(initialDateKey || '2026-11-20');
  const [time24, setTime24] = useState('14:00');
  const [errorKey, setErrorKey] = useState<
    'captionOrMediaRequired' | 'channelsRequired' | 'dateTimeRequired' | null
  >(null);
  const [savedNotice, setSavedNotice] = useState<SocialPostStatus | null>(null);

  useEffect(() => {
    if (!prefill) return;
    setCaption(prefill.caption);
    setMediaPresetId(prefill.mediaPresetId);
    setErrorKey(null);
    setSavedNotice(null);
  }, [prefill?.nonce]);

  const activeMedia = mediaPresetId
    ? SOCIAL_MEDIA_PRESETS.find((m) => m.id === mediaPresetId) ?? null
    : null;

  const toggleChannel = (channel: SocialChannelId) => {
    setErrorKey(null);
    setSavedNotice(null);
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const cycleMediaPreset = () => {
    setErrorKey(null);
    setSavedNotice(null);
    if (!mediaPresetId) {
      setMediaPresetId(SOCIAL_MEDIA_PRESETS[0].id);
      return;
    }
    const idx = SOCIAL_MEDIA_PRESETS.findIndex((m) => m.id === mediaPresetId);
    const next = SOCIAL_MEDIA_PRESETS[(idx + 1) % SOCIAL_MEDIA_PRESETS.length];
    setMediaPresetId(next.id);
  };

  const submitPost = (status: SocialPostStatus) => {
    const check = validateSocialPostInput({
      caption,
      channels: selectedChannels,
      dateKey,
      time24,
      mediaPresetId,
      targetStatus: status,
    });
    if (!check.valid) {
      setErrorKey(check.errorKey);
      setSavedNotice(null);
      return;
    }

    onSavePost({
      caption,
      channels: selectedChannels,
      dateKey,
      time24,
      mediaPresetId,
      status,
    });
    setErrorKey(null);
    setSavedNotice(status);
    setCaption('');
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Composer Column */}
      <section
        aria-labelledby="social-post-caption-label"
        className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6 lg:col-span-7`}
      >
        {/* Caption Box */}
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label
              id="social-post-caption-label"
              htmlFor="social-post-caption"
              className="text-xs font-bold text-[var(--bh-text)]"
            >
              {t.captionLabel}
            </label>
            <span className="tabular-nums text-xs text-[var(--bh-text-muted)]">
              {caption.length} {t.charactersUnit}
              {selectedChannels.includes('x') ? ` · ${t.xLimitHint}` : ''}
            </span>
          </div>
          <textarea
            id="social-post-caption"
            rows={4}
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
              setErrorKey(null);
              setSavedNotice(null);
            }}
            placeholder={t.captionPlaceholder}
            className="w-full rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-bg)] px-4 py-3 text-sm text-[var(--bh-text)] placeholder:text-[var(--bh-text-muted)] focus:border-[var(--bh-coral)] focus:outline-none"
          />
        </div>

        {/* Media Upload Placeholder */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[var(--bh-text)]">{t.mediaLabel}</p>

          {activeMedia ? (
            <div className="flex flex-col justify-between gap-3 rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-[var(--bh-border)] bg-gradient-to-br ${activeMedia.toneClass} text-xs font-extrabold text-[var(--bh-text)]`}
                >
                  {activeMedia.aspectEn}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--bh-text)]">
                    {lang === 'ar' ? activeMedia.labelAr : activeMedia.labelEn}
                  </p>
                  <p className="text-xs text-[var(--bh-text-muted)]">
                    {lang === 'ar' ? activeMedia.formatAr : activeMedia.formatEn}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={cycleMediaPreset}
                  className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-3.5 py-2 text-xs`}
                >
                  <RefreshCw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{t.mediaSwap}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaPresetId(null)}
                  className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-3.5 py-2 text-xs`}
                >
                  <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{t.mediaRemove}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={cycleMediaPreset}
              className="flex min-h-[84px] w-full flex-col items-center justify-center gap-1.5 rounded-[20px] border border-dashed border-[var(--bh-border)] bg-[var(--bh-bg)] p-4 text-center transition-colors hover:border-[var(--bh-coral)]"
            >
              <ImagePlus
                className="h-5 w-5 text-[var(--bh-coral-text)]"
                aria-hidden="true"
              />
              <span className="text-sm font-bold text-[var(--bh-text)]">
                {t.mediaEmptyTitle}
              </span>
              <span className="text-xs text-[var(--bh-text-muted)]">
                {t.mediaEmptySubtitle}
              </span>
            </button>
          )}
        </div>

        {/* Channel Chips */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[var(--bh-text)]">{t.channelsLabel}</p>
          <div role="group" aria-label={t.channelsLabel} className="flex flex-wrap gap-2">
            {SOCIAL_CHANNEL_IDS.map((ch) => {
              const meta = SOCIAL_CHANNEL_META[ch];
              const isSelected = selectedChannels.includes(ch);
              return (
                <button
                  key={ch}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleChannel(ch)}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                  }`}
                >
                  <span className="font-extrabold">{meta.shortCode}</span>
                  <span>{lang === 'ar' ? meta.nameAr : meta.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date / Time Picker */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="social-post-date"
              className="mb-1.5 block text-xs font-bold text-[var(--bh-text)]"
            >
              {t.dateLabel}
            </label>
            <input
              id="social-post-date"
              type="date"
              value={dateKey}
              onChange={(e) => {
                setDateKey(e.target.value);
                setErrorKey(null);
              }}
              className={`${UI_CLASSES.inputPill} tabular-nums`}
            />
          </div>

          <div>
            <label
              htmlFor="social-post-time"
              className="mb-1.5 block text-xs font-bold text-[var(--bh-text)]"
            >
              {t.timeLabel}
            </label>
            <input
              id="social-post-time"
              type="time"
              value={time24}
              onChange={(e) => {
                setTime24(e.target.value);
                setErrorKey(null);
              }}
              className={`${UI_CLASSES.inputPill} tabular-nums`}
            />
          </div>
        </div>

        {errorKey && (
          <p role="alert" className="text-xs font-semibold text-[var(--bh-error)]">
            {t.errors[errorKey]}
          </p>
        )}

        {savedNotice && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[var(--bh-success)]/40 bg-[var(--bh-bg)] p-3.5 text-xs">
            <span className="inline-flex items-center gap-2 font-bold text-[var(--bh-success)]">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              {savedNotice === 'scheduled' ? t.feedbackScheduled : t.feedbackDraft}
            </span>
            <button
              type="button"
              onClick={() => onGoToQueue(savedNotice)}
              className="font-bold text-[var(--bh-coral-text)] hover:underline"
            >
              {t.goToQueue}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => submitPost('scheduled')}
            className={`${UI_CLASSES.pillButtonPrimary} flex-1`}
          >
            <CalendarCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.scheduleButton}</span>
          </button>

          <button
            type="button"
            onClick={() => submitPost('draft')}
            className={`${UI_CLASSES.pillButtonSecondary} flex-1`}
          >
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.saveDraftButton}</span>
          </button>
        </div>
      </section>

      {/* Per-Channel Live Previews */}
      <aside
        aria-labelledby="channel-preview-heading"
        className={`${UI_CLASSES.card} space-y-4 p-5 sm:p-6 lg:col-span-5`}
      >
        <h2
          id="channel-preview-heading"
          className="text-base font-extrabold text-[var(--bh-text)]"
        >
          {t.previewHeading}
        </h2>

        {selectedChannels.length === 0 ? (
          <div className="rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-5 text-sm text-[var(--bh-text-muted)]">
            {t.previewEmpty}
          </div>
        ) : (
          <div className="space-y-3">
            {selectedChannels.map((ch) => {
              const meta = SOCIAL_CHANNEL_META[ch];
              const channelName = lang === 'ar' ? meta.nameAr : meta.nameEn;
              const previewText = caption.trim() || t.captionPlaceholder;
              const clippedText =
                previewText.length > meta.maxChars
                  ? `${previewText.slice(0, meta.maxChars - 1)}…`
                  : previewText;

              return (
                <article
                  key={ch}
                  aria-label={`${channelName} preview`}
                  className="space-y-2.5 rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-7 min-w-[28px] items-center justify-center rounded-full border px-2 text-[11px] font-extrabold ${meta.accentClass}`}
                      >
                        {meta.shortCode}
                      </span>
                      <div>
                        <p className="text-xs font-extrabold text-[var(--bh-text)]">
                          {channelName}
                        </p>
                        <p className="text-[11px] text-[var(--bh-text-muted)]" dir="ltr">
                          {meta.handle}
                        </p>
                      </div>
                    </div>
                    <span className="tabular-nums text-[11px] font-semibold text-[var(--bh-text-muted)]">
                      {dateKey} · {time24}
                    </span>
                  </div>

                  {activeMedia && (
                    <div
                      className={`flex h-20 items-center justify-between rounded-[12px] border border-[var(--bh-border)] bg-gradient-to-br px-3 ${activeMedia.toneClass}`}
                    >
                      <span className="text-xs font-bold text-[var(--bh-text)]">
                        {lang === 'ar' ? activeMedia.labelAr : activeMedia.labelEn}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--bh-text-muted)]">
                        {t.previewMediaBadge}
                      </span>
                    </div>
                  )}

                  <p
                    className={`text-xs leading-relaxed ${
                      caption.trim()
                        ? 'text-[var(--bh-text)]'
                        : 'text-[var(--bh-text-muted)]'
                    }`}
                  >
                    {clippedText}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </aside>
    </div>
  );
};
