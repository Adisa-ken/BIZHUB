import React, { useState } from 'react';
import { Languages, Sparkles, Wand2 } from 'lucide-react';
import {
  AI_TEXT_SAMPLE_PROMPTS,
  type AiGeneratedTextResult,
  type AiLibraryItem,
} from '../../data/aiStudio';
import type { SocialMediaPresetId } from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  AI_CREDIT_COSTS,
  UI_CLASSES,
  type AiTextMode,
  type AiToneId,
  type AiTranslateDirection,
  type Language,
} from '../../theme/tokens';
import { generateFakeTextResult } from '../../utils/aiStudioLogic';
import { AiStudioResultActions } from './AiStudioResultActions';

interface AiTextTabProps {
  lang: Language;
  savedIds: Set<string>;
  onSpendCredits: (cost: number) => boolean;
  onSaveLibraryItem: (item: AiLibraryItem) => void;
  onSendToComposer: (payload: {
    caption: string;
    mediaPresetId: SocialMediaPresetId | null;
  }) => void;
}

const TEXT_MODES: AiTextMode[] = ['caption', 'paraphrase', 'translate'];
const TONE_IDS: AiToneId[] = ['bold', 'warm', 'luxury', 'playful'];

export const AiTextTab: React.FC<AiTextTabProps> = ({
  lang,
  savedIds,
  onSpendCredits,
  onSaveLibraryItem,
  onSendToComposer,
}) => {
  const copy = getCopy(lang).aiStudio;
  const t = copy.text;
  const cost = AI_CREDIT_COSTS.text;

  const [mode, setMode] = useState<AiTextMode>('caption');
  const [tone, setTone] = useState<AiToneId>('bold');
  const [translateDir, setTranslateDir] = useState<AiTranslateDirection>('en_to_ar');
  const [prompt, setPrompt] = useState(
    lang === 'ar'
      ? AI_TEXT_SAMPLE_PROMPTS.caption.ar
      : AI_TEXT_SAMPLE_PROMPTS.caption.en
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [results, setResults] = useState<AiGeneratedTextResult[]>(() => [
    generateFakeTextResult({
      mode: 'caption',
      tone: 'bold',
      prompt:
        lang === 'ar'
          ? AI_TEXT_SAMPLE_PROMPTS.caption.ar
          : AI_TEXT_SAMPLE_PROMPTS.caption.en,
      translateDirection: 'en_to_ar',
    }),
  ]);

  const handleModeChange = (nextMode: AiTextMode) => {
    setMode(nextMode);
    setErrorMsg(null);
    setPrompt(
      lang === 'ar'
        ? AI_TEXT_SAMPLE_PROMPTS[nextMode].ar
        : AI_TEXT_SAMPLE_PROMPTS[nextMode].en
    );
  };

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
    const next = generateFakeTextResult({
      mode,
      tone,
      prompt,
      translateDirection: translateDir,
    });
    setResults((prev) => [next, ...prev.slice(0, 2)]);
  };

  const placeholder =
    mode === 'caption'
      ? t.inputPlaceholderCaption
      : mode === 'paraphrase'
        ? t.inputPlaceholderParaphrase
        : t.inputPlaceholderTranslate;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Controls Column */}
      <section
        aria-labelledby="ai-text-prompt-label"
        className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6 lg:col-span-6`}
      >
        {/* Mode Switcher */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[var(--bh-text)]">{t.modesLabel}</p>
          <div role="group" aria-label={t.modesLabel} className="flex flex-wrap gap-2">
            {TEXT_MODES.map((m) => {
              const isSelected = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleModeChange(m)}
                  className={`min-h-[44px] rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                    isSelected
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

        {/* Translation Direction Picker (only in translate mode) */}
        {mode === 'translate' && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--bh-text)]">
              <Languages className="h-3.5 w-3.5 text-[var(--bh-amber-text)]" aria-hidden="true" />
              <span>{t.translateDirectionLabel}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['en_to_ar', 'ar_to_en'] as const).map((dir) => {
                const active = translateDir === dir;
                return (
                  <button
                    key={dir}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setTranslateDir(dir);
                      setPrompt(
                        dir === 'en_to_ar'
                          ? AI_TEXT_SAMPLE_PROMPTS.translate.en
                          : AI_TEXT_SAMPLE_PROMPTS.translate.ar
                      );
                    }}
                    className={`min-h-[44px] rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                      active
                        ? 'border border-[var(--bh-amber)] bg-[var(--bh-amber-soft)] text-[var(--bh-amber-text)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-amber)]'
                    }`}
                  >
                    {dir === 'en_to_ar' ? t.enToAr : t.arToEn}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tone Picker */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-[var(--bh-text)]">{t.toneLabel}</p>
          <div role="group" aria-label={t.toneLabel} className="grid grid-cols-2 gap-2">
            {TONE_IDS.map((toneId) => {
              const isSelected = tone === toneId;
              return (
                <button
                  key={toneId}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setTone(toneId)}
                  className={`min-h-[44px] rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'border border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                  }`}
                >
                  {t.tones[toneId]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              id="ai-text-prompt-label"
              htmlFor="ai-text-prompt-input"
              className="text-xs font-bold text-[var(--bh-text)]"
            >
              {t.inputLabel}
            </label>
            <button
              type="button"
              onClick={() =>
                setPrompt(
                  lang === 'ar'
                    ? AI_TEXT_SAMPLE_PROMPTS[mode].ar
                    : AI_TEXT_SAMPLE_PROMPTS[mode].en
                )
              }
              className="text-xs font-bold text-[var(--bh-coral-text)] hover:underline"
            >
              {t.samplePromptButton}
            </button>
          </div>
          <textarea
            id="ai-text-prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setErrorMsg(null);
            }}
            placeholder={placeholder}
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
          className={`${UI_CLASSES.pillButtonPrimary} w-full`}
        >
          <Wand2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t.generateButton} (-{cost} {copy.costSuffix})
          </span>
        </button>
      </section>

      {/* Output Column */}
      <section
        aria-labelledby="ai-text-results-heading"
        className="space-y-4 lg:col-span-6"
      >
        <div className="flex items-center justify-between gap-2">
          <h2
            id="ai-text-results-heading"
            className="flex items-center gap-2 text-base font-extrabold text-[var(--bh-text)]"
          >
            <Sparkles className="h-4 w-4 text-[var(--bh-amber-text)]" aria-hidden="true" />
            <span>{t.resultHeading}</span>
          </h2>
          <span className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
            {results.length}
          </span>
        </div>

        <div className="space-y-4">
          {results.map((item) => {
            const mainCopy = lang === 'ar' ? item.outputAr : item.outputEn;
            const altCopy = lang === 'ar' ? item.outputEn : item.outputAr;
            const fullCaptionEn = `${item.outputEn} ${item.hashtags}`;
            const fullCaptionAr = `${item.outputAr} ${item.hashtags}`;

            return (
              <article
                key={item.id}
                className={`${UI_CLASSES.card} space-y-4 p-5`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)] px-3 py-1 text-[11px] font-bold text-[var(--bh-coral-text)]">
                    {lang === 'ar' ? item.modeLabelAr : item.modeLabelEn}
                  </span>
                  <span className="rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface-elevated)] px-3 py-1 text-[11px] font-semibold text-[var(--bh-amber-text)]">
                    {t.tones[item.tone]}
                  </span>
                </div>

                <p className="text-sm font-medium leading-relaxed text-[var(--bh-text)]">
                  {mainCopy}
                </p>

                <p className="rounded-[14px] border border-[var(--bh-border)] bg-[var(--bh-bg)] px-3.5 py-2.5 text-xs leading-relaxed text-[var(--bh-text-muted)]">
                  {altCopy}
                </p>

                <p className="text-xs font-semibold text-[var(--bh-amber-text)]" dir="ltr">
                  {item.hashtags}
                </p>

                <AiStudioResultActions
                  lang={lang}
                  isSaved={savedIds.has(item.id)}
                  onSaveToLibrary={() =>
                    onSaveLibraryItem({
                      id: item.id,
                      kind: 'text',
                      titleEn: `${item.modeLabelEn} · ${item.tone}`,
                      titleAr: `${item.modeLabelAr} · ${t.tones[item.tone]}`,
                      captionEn: fullCaptionEn,
                      captionAr: fullCaptionAr,
                      badgeEn: 'Text',
                      badgeAr: 'نص',
                      mediaPresetId: item.mediaPresetId,
                      savedAtLabelEn: 'Just now',
                      savedAtLabelAr: 'الآن',
                    })
                  }
                  onSendToComposer={() =>
                    onSendToComposer({
                      caption: lang === 'ar' ? fullCaptionAr : fullCaptionEn,
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
