import React, { useEffect, useState } from 'react';
import { Clock3, Film, PlayCircle } from 'lucide-react';
import type { AiGeneratedVideoResult, AiLibraryItem } from '../../data/aiStudio';
import { SOCIAL_MEDIA_PRESETS, type SocialMediaPresetId } from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  AI_CREDIT_COSTS,
  UI_CLASSES,
  type AiVideoMode,
  type Language,
} from '../../theme/tokens';
import { generateFakeVideoResult } from '../../utils/aiStudioLogic';
import { AiStudioResultActions } from './AiStudioResultActions';

interface AiVideoTabProps {
  lang: Language;
  savedIds: Set<string>;
  onSpendCredits: (cost: number) => boolean;
  onSaveLibraryItem: (item: AiLibraryItem) => void;
  onSendToComposer: (payload: {
    caption: string;
    mediaPresetId: SocialMediaPresetId | null;
  }) => void;
}

const VIDEO_MODES: AiVideoMode[] = ['text_to_video', 'image_to_animation'];

export const AiVideoTab: React.FC<AiVideoTabProps> = ({
  lang,
  savedIds,
  onSpendCredits,
  onSaveLibraryItem,
  onSendToComposer,
}) => {
  const copy = getCopy(lang).aiStudio;
  const t = copy.video;
  const cost = AI_CREDIT_COSTS.video;

  const [mode, setMode] = useState<AiVideoMode>('text_to_video');
  const [prompt, setPrompt] = useState(
    lang === 'ar'
      ? 'حركة كاميرا سينمائية بطيئة عبر كراسي الحلاقة والمرايا المضاءة'
      : 'Slow cinematic dolly glide past warm illuminated barber stations'
  );
  const [sourcePresetId, setSourcePresetId] =
    useState<SocialMediaPresetId>('carousel_before_after');
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(100);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<AiGeneratedVideoResult | null>(() =>
    generateFakeVideoResult({
      mode: 'text_to_video',
      prompt:
        lang === 'ar'
          ? 'حركة كاميرا سينمائية بطيئة عبر كراسي الحلاقة والمرايا المضاءة'
          : 'Slow cinematic dolly glide past warm illuminated barber stations',
      sourcePresetId: 'reel_fade',
    })
  );

  useEffect(() => {
    if (!isRendering) return;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + 20);
        if (next >= 100) {
          window.clearInterval(timer);
          setIsRendering(false);
        }
        return next;
      });
    }, 120);
    return () => window.clearInterval(timer);
  }, [isRendering]);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setErrorMsg(t.emptyError);
      return;
    }
    if (!onSpendCredits(cost)) {
      setErrorMsg(copy.insufficientCreditsError);
      return;
    }
    setErrorMsg(null);
    setProgress(15);
    setIsRendering(true);
    setVideoResult(
      generateFakeVideoResult({
        mode,
        prompt,
        sourcePresetId,
      })
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Controls */}
      <section
        aria-labelledby="ai-video-prompt-label"
        className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6 lg:col-span-6`}
      >
        <div className="space-y-2">
          <p className="text-xs font-bold text-[var(--bh-text)]">{t.modesLabel}</p>
          <div role="group" aria-label={t.modesLabel} className="grid grid-cols-2 gap-2">
            {VIDEO_MODES.map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setMode(m);
                    setErrorMsg(null);
                  }}
                  className={`min-h-[44px] rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                  }`}
                >
                  {t.modes[m]}
                </button>
              );
            })}
          </div>
        </div>

        {mode === 'image_to_animation' && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--bh-text)]">{t.sourceLabel}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SOCIAL_MEDIA_PRESETS.map((preset) => {
                const active = sourcePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSourcePresetId(preset.id)}
                    className={`flex min-h-[48px] items-center gap-2.5 rounded-[16px] border px-3 py-2 text-start text-xs font-bold transition-colors ${
                      active
                        ? 'border-[var(--bh-amber)] bg-[var(--bh-amber-soft)] text-[var(--bh-amber-text)]'
                        : 'border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-amber)]'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[var(--bh-border)] bg-gradient-to-br text-[10px] font-extrabold ${preset.toneClass}`}
                    >
                      {preset.aspectEn}
                    </span>
                    <span className="line-clamp-2">
                      {lang === 'ar' ? preset.labelAr : preset.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              id="ai-video-prompt-label"
              htmlFor="ai-video-prompt-input"
              className="text-xs font-bold text-[var(--bh-text)]"
            >
              {t.promptLabel}
            </label>
            <button
              type="button"
              onClick={() =>
                setPrompt(
                  lang === 'ar'
                    ? 'لقطة مقربة متحركة لعرض المواعيد المتاحة هذا الأسبوع مع إضاءة ذهبية'
                    : 'Smooth parallax motion across open studio chairs with subtle amber spotlight sweep'
                )
              }
              className="text-xs font-bold text-[var(--bh-coral-text)] hover:underline"
            >
              {t.samplePromptButton}
            </button>
          </div>
          <textarea
            id="ai-video-prompt-input"
            rows={3}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setErrorMsg(null);
            }}
            placeholder={t.promptPlaceholder}
            className="w-full rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-bg)] px-4 py-3 text-sm text-[var(--bh-text)] placeholder:text-[var(--bh-text-muted)] focus:border-[var(--bh-coral)] focus:outline-none"
          />
        </div>

        {errorMsg && (
          <p role="alert" className="text-xs font-semibold text-[var(--bh-error)]">
            {errorMsg}
          </p>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isRendering}
          className={`${UI_CLASSES.pillButtonPrimary} w-full`}
        >
          <Film className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t.generateButton} (-{cost} {copy.costSuffix})
          </span>
        </button>
      </section>

      {/* Progress Bar & Video Result Card */}
      <section aria-labelledby="ai-video-result-heading" className="lg:col-span-6">
        <div className={`${UI_CLASSES.card} space-y-4 p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-2">
            <h2
              id="ai-video-result-heading"
              className="text-base font-extrabold text-[var(--bh-text)]"
            >
              {isRendering ? t.progressHeading : t.readyResultTitle}
            </h2>
            <span className="tabular-nums rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)] px-3 py-1 text-xs font-bold text-[var(--bh-amber-text)]">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t.progressHeading}
            className="h-3 w-full overflow-hidden rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)]"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--bh-coral)] to-[var(--bh-amber)] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Mandatory "ready in a few minutes" status message */}
          <div
            role="status"
            className="flex items-center gap-2.5 rounded-[16px] border border-[var(--bh-amber)]/40 bg-[var(--bh-amber-soft)] px-4 py-3 text-xs font-bold text-[var(--bh-amber-text)]"
          >
            <Clock3 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.readySoonMessage}</span>
          </div>

          {videoResult && (
            <div className="space-y-4">
              <div
                className={`flex min-h-[170px] flex-col items-center justify-center gap-2 rounded-[18px] border border-[var(--bh-border)] bg-gradient-to-br p-5 text-center ${videoResult.gradientClass}`}
              >
                <PlayCircle
                  className="h-10 w-10 text-[var(--bh-coral-text)]"
                  aria-hidden="true"
                />
                <p className="text-sm font-extrabold text-[var(--bh-text)]">
                  {lang === 'ar' ? videoResult.modeLabelAr : videoResult.modeLabelEn}
                </p>
                <p className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
                  {t.durationBadge}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-[var(--bh-text-muted)]">
                {lang === 'ar' ? videoResult.captionAr : videoResult.captionEn}
              </p>

              <AiStudioResultActions
                lang={lang}
                isSaved={savedIds.has(videoResult.id)}
                onSaveToLibrary={() =>
                  onSaveLibraryItem({
                    id: videoResult.id,
                    kind: 'video',
                    titleEn: `${videoResult.modeLabelEn} · Queued clip`,
                    titleAr: `${videoResult.modeLabelAr} · مقطع قيد التجهيز`,
                    captionEn: videoResult.captionEn,
                    captionAr: videoResult.captionAr,
                    badgeEn: 'Video',
                    badgeAr: 'فيديو',
                    mediaPresetId: videoResult.mediaPresetId,
                    gradientClass: videoResult.gradientClass,
                    savedAtLabelEn: 'Just now',
                    savedAtLabelAr: 'الآن',
                  })
                }
                onSendToComposer={() =>
                  onSendToComposer({
                    caption:
                      lang === 'ar' ? videoResult.captionAr : videoResult.captionEn,
                    mediaPresetId: videoResult.mediaPresetId,
                  })
                }
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
