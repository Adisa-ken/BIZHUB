import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';
import {
  AI_IMAGE_STYLE_META,
  type AiGeneratedImageResult,
  type AiLibraryItem,
} from '../../data/aiStudio';
import type { SocialMediaPresetId } from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  AI_CREDIT_COSTS,
  UI_CLASSES,
  type AiAspectRatio,
  type AiStylePresetId,
  type Language,
} from '../../theme/tokens';
import { generateFakeImageResults } from '../../utils/aiStudioLogic';
import { AiStudioResultActions } from './AiStudioResultActions';

interface AiImageTabProps {
  lang: Language;
  savedIds: Set<string>;
  onSpendCredits: (cost: number) => boolean;
  onSaveLibraryItem: (item: AiLibraryItem) => void;
  onSendToComposer: (payload: {
    caption: string;
    mediaPresetId: SocialMediaPresetId | null;
  }) => void;
}

const STYLE_IDS: AiStylePresetId[] = [
  'editorial',
  'neon_noir',
  'minimal_studio',
  'warm_film',
];
const ASPECT_RATIOS: AiAspectRatio[] = ['1:1', '4:5', '16:9', '9:16'];

function ratioBoxClass(ratio: AiAspectRatio): string {
  if (ratio === '4:5') return 'aspect-[4/5] max-h-[210px]';
  if (ratio === '16:9') return 'aspect-video';
  if (ratio === '9:16') return 'aspect-[9/16] max-h-[220px]';
  return 'aspect-square max-h-[190px]';
}

export const AiImageTab: React.FC<AiImageTabProps> = ({
  lang,
  savedIds,
  onSpendCredits,
  onSaveLibraryItem,
  onSendToComposer,
}) => {
  const copy = getCopy(lang).aiStudio;
  const t = copy.image;
  const cost = AI_CREDIT_COSTS.image;

  const [prompt, setPrompt] = useState(
    lang === 'ar'
      ? 'كرسي حلاقة جلد دافئ مع إضاءة مسائية وأدوات تشذيب نحاسية'
      : 'Leather barber chair lit by warm golden-hour sunlight and brass clippers'
  );
  const [style, setStyle] = useState<AiStylePresetId>('editorial');
  const [aspectRatio, setAspectRatio] = useState<AiAspectRatio>('4:5');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<AiGeneratedImageResult[]>(() =>
    generateFakeImageResults({
      prompt:
        lang === 'ar'
          ? 'كرسي حلاقة جلد دافئ مع إضاءة مسائية وأدوات تشذيب نحاسية'
          : 'Leather barber chair lit by warm golden-hour sunlight and brass clippers',
      style: 'editorial',
      aspectRatio: '4:5',
    })
  );

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
    setResults(
      generateFakeImageResults({
        prompt,
        style,
        aspectRatio,
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Prompt + Presets Card */}
      <section
        aria-labelledby="ai-image-prompt-label"
        className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6`}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              id="ai-image-prompt-label"
              htmlFor="ai-image-prompt-input"
              className="text-xs font-bold text-[var(--bh-text)]"
            >
              {t.promptLabel}
            </label>
            <button
              type="button"
              onClick={() =>
                setPrompt(
                  lang === 'ar'
                    ? 'تفصيل بدلة صوفية فاخرة داخل مشغل هادئ بإضاءة دافئة'
                    : 'Bespoke charcoal wool jacket tailored on a wooden form in warm studio light'
                )
              }
              className="text-xs font-bold text-[var(--bh-coral-text)] hover:underline"
            >
              {t.samplePromptButton}
            </button>
          </div>
          <textarea
            id="ai-image-prompt-input"
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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Style Presets */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--bh-text)]">{t.styleLabel}</p>
            <div role="group" aria-label={t.styleLabel} className="grid grid-cols-2 gap-2">
              {STYLE_IDS.map((styleId) => {
                const active = style === styleId;
                return (
                  <button
                    key={styleId}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setStyle(styleId)}
                    className={`min-h-[44px] rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                      active
                        ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                    }`}
                  >
                    {t.styles[styleId]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--bh-text)]">{t.aspectLabel}</p>
            <div role="group" aria-label={t.aspectLabel} className="grid grid-cols-2 gap-2">
              {ASPECT_RATIOS.map((ratio) => {
                const active = aspectRatio === ratio;
                return (
                  <button
                    key={ratio}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setAspectRatio(ratio)}
                    className={`tabular-nums min-h-[44px] rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                      active
                        ? 'border border-[var(--bh-amber)] bg-[var(--bh-amber-soft)] text-[var(--bh-amber-text)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-amber)]'
                    }`}
                  >
                    {t.aspects[ratio]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {errorMsg && (
          <p role="alert" className="text-xs font-semibold text-[var(--bh-error)]">
            {errorMsg}
          </p>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          className={`${UI_CLASSES.pillButtonPrimary} w-full sm:w-auto`}
        >
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t.generateButton} (-{cost} {copy.costSuffix})
          </span>
        </button>
      </section>

      {/* 4 Placeholder Results Grid */}
      <section aria-labelledby="ai-image-results-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2
            id="ai-image-results-heading"
            className="text-base font-extrabold text-[var(--bh-text)]"
          >
            {t.resultsHeading}
          </h2>
          <span className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
            {results.length} / 4
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {results.map((item) => {
            const meta = AI_IMAGE_STYLE_META[item.style];
            return (
              <article
                key={item.id}
                className={`${UI_CLASSES.card} flex flex-col justify-between gap-4 p-4 sm:p-5`}
              >
                <div className="space-y-3">
                  {/* Visual Placeholder Artwork */}
                  <div className="flex justify-center rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-3">
                    <div
                      className={`flex w-full items-center justify-center rounded-[14px] border border-[var(--bh-border)] bg-gradient-to-br p-4 text-center ${item.gradientClass} ${ratioBoxClass(item.aspectRatio)}`}
                    >
                      <div className="space-y-1.5">
                        <ImageIcon
                          className="mx-auto h-6 w-6 text-[var(--bh-coral-text)]"
                          aria-hidden="true"
                        />
                        <p className="text-xs font-extrabold text-[var(--bh-text)]">
                          {t.conceptPrefix} #{item.index}
                        </p>
                        <p className="tabular-nums text-[11px] font-semibold text-[var(--bh-text-muted)]">
                          {t.styles[item.style]} · {item.aspectRatio}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[var(--bh-text)]">
                      {lang === 'ar' ? item.titleAr : item.titleEn}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--bh-text-muted)]">
                      {lang === 'ar' ? meta.tagAr : meta.tagEn}
                    </p>
                  </div>
                </div>

                <AiStudioResultActions
                  lang={lang}
                  compact={true}
                  isSaved={savedIds.has(item.id)}
                  onSaveToLibrary={() =>
                    onSaveLibraryItem({
                      id: item.id,
                      kind: 'image',
                      titleEn: item.titleEn,
                      titleAr: item.titleAr,
                      captionEn: item.captionEn,
                      captionAr: item.captionAr,
                      badgeEn: `Image · ${item.aspectRatio}`,
                      badgeAr: `صورة · ${item.aspectRatio}`,
                      mediaPresetId: item.mediaPresetId,
                      gradientClass: item.gradientClass,
                      aspectRatio: item.aspectRatio,
                      savedAtLabelEn: 'Just now',
                      savedAtLabelAr: 'الآن',
                    })
                  }
                  onSendToComposer={() =>
                    onSendToComposer({
                      caption: lang === 'ar' ? item.captionAr : item.captionEn,
                      mediaPresetId: item.mediaPresetId,
                    })
                  }
                />
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
