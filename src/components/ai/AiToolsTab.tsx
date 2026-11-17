import React, { useState } from 'react';
import { Eraser, Palette, Sparkles, ZoomIn } from 'lucide-react';
import {
  AI_BRAND_PALETTES,
  AI_TOOL_SAMPLE_ASSETS,
  INITIAL_BRAND_KIT,
  type AiBrandKitState,
  type AiGeneratedToolResult,
  type AiLibraryItem,
} from '../../data/aiStudio';
import type { SocialMediaPresetId } from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  AI_CREDIT_COSTS,
  UI_CLASSES,
  type AiToneId,
  type AiToolKind,
  type Language,
} from '../../theme/tokens';
import { generateFakeToolResult } from '../../utils/aiStudioLogic';
import { AiStudioResultActions } from './AiStudioResultActions';

interface AiToolsTabProps {
  lang: Language;
  savedIds: Set<string>;
  onSpendCredits: (cost: number) => boolean;
  onSaveLibraryItem: (item: AiLibraryItem) => void;
  onSendToComposer: (payload: {
    caption: string;
    mediaPresetId: SocialMediaPresetId | null;
  }) => void;
}

const TOOL_KINDS: Array<{
  id: AiToolKind;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'bg_remover', icon: Eraser },
  { id: 'upscaler', icon: ZoomIn },
  { id: 'brand_kit', icon: Palette },
];

const PALETTE_SWATCH_CLASSES: Record<
  AiBrandKitState['paletteId'],
  [string, string, string]
> = {
  coral_navy: ['bg-[#0B1120]', 'bg-[#FF6B5B]', 'bg-[#F59E0B]'],
  amber_charcoal: ['bg-[#18181B]', 'bg-[#F59E0B]', 'bg-[#FDE68A]'],
  emerald_ivory: ['bg-[#064E3B]', 'bg-[#34D399]', 'bg-[#F8FAFC]'],
};

const TONE_IDS: AiToneId[] = ['bold', 'warm', 'luxury', 'playful'];
const PALETTE_IDS: Array<AiBrandKitState['paletteId']> = [
  'coral_navy',
  'amber_charcoal',
  'emerald_ivory',
];

export const AiToolsTab: React.FC<AiToolsTabProps> = ({
  lang,
  savedIds,
  onSpendCredits,
  onSaveLibraryItem,
  onSendToComposer,
}) => {
  const copy = getCopy(lang).aiStudio;
  const t = copy.tools;
  const textTones = copy.text.tones;
  const cost = AI_CREDIT_COSTS.tools;

  const [toolKind, setToolKind] = useState<AiToolKind>('bg_remover');
  const [assetId, setAssetId] = useState<string>(AI_TOOL_SAMPLE_ASSETS[0].id);
  const [upscaleFactor, setUpscaleFactor] = useState<'2x' | '4x'>('2x');
  const [brandKit, setBrandKit] = useState<AiBrandKitState>(INITIAL_BRAND_KIT);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toolResult, setToolResult] = useState<AiGeneratedToolResult>(() =>
    generateFakeToolResult({
      toolKind: 'bg_remover',
      assetId: AI_TOOL_SAMPLE_ASSETS[0].id,
      upscaleFactor: '2x',
      brandKit: INITIAL_BRAND_KIT,
    })
  );

  const selectedAsset =
    AI_TOOL_SAMPLE_ASSETS.find((a) => a.id === assetId) ?? AI_TOOL_SAMPLE_ASSETS[0];

  const handleRunTool = (kind: AiToolKind) => {
    if (!onSpendCredits(cost)) {
      setErrorMsg(copy.insufficientCreditsError);
      return;
    }
    setErrorMsg(null);
    setToolResult(
      generateFakeToolResult({
        toolKind: kind,
        assetId,
        upscaleFactor,
        brandKit,
      })
    );
  };

  const applyButtonLabel =
    toolKind === 'bg_remover'
      ? t.applyBgRemoveButton
      : toolKind === 'upscaler'
        ? t.applyUpscaleButton
        : t.applyBrandKitButton;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Controls Column */}
      <section
        aria-labelledby="ai-tools-heading"
        className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6 lg:col-span-6`}
      >
        <div className="space-y-2">
          <p id="ai-tools-heading" className="text-xs font-bold text-[var(--bh-text)]">
            {t.subToolsLabel}
          </p>
          <div role="group" aria-label={t.subToolsLabel} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TOOL_KINDS.map(({ id, icon: Icon }) => {
              const active = toolKind === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setToolKind(id);
                    setErrorMsg(null);
                  }}
                  className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden={true} />
                  <span>{t.kinds[id]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Background Remover & Image Upscaler Asset Controls */}
        {(toolKind === 'bg_remover' || toolKind === 'upscaler') && (
          <div className="space-y-4">
            <p className="text-xs leading-relaxed text-[var(--bh-text-muted)]">
              {toolKind === 'bg_remover' ? t.bgRemoverHint : t.upscalerHint}
            </p>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--bh-text)]">{t.assetLabel}</p>
              <div className="space-y-2">
                {AI_TOOL_SAMPLE_ASSETS.map((asset) => {
                  const active = asset.id === assetId;
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setAssetId(asset.id)}
                      className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[16px] border px-3.5 py-2.5 text-start transition-colors ${
                        active
                          ? 'border-[var(--bh-amber)] bg-[var(--bh-amber-soft)] text-[var(--bh-amber-text)]'
                          : 'border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-amber)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-9 w-9 shrink-0 rounded-[10px] border border-[var(--bh-border)] bg-gradient-to-br ${asset.gradientClass}`}
                        />
                        <span className="text-xs font-bold">
                          {lang === 'ar' ? asset.labelAr : asset.labelEn}
                        </span>
                      </div>
                      <span className="tabular-nums text-[11px] font-semibold text-[var(--bh-text-muted)]">
                        {asset.resolutionBefore}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {toolKind === 'upscaler' && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-[var(--bh-text)]">
                  {t.upscaleFactorLabel}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(['2x', '4x'] as const).map((factor) => {
                    const active = upscaleFactor === factor;
                    const resText =
                      factor === '4x'
                        ? selectedAsset.resolutionAfter4x
                        : selectedAsset.resolutionAfter2x;
                    return (
                      <button
                        key={factor}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setUpscaleFactor(factor)}
                        className={`tabular-nums min-h-[44px] rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                          active
                            ? 'border border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                            : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                        }`}
                      >
                        {factor.toUpperCase()} · {resText}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand Kit Editor (Logo monogram, colors, tone of voice) */}
        {toolKind === 'brand_kit' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[var(--bh-text)]">
              {t.brandKitHeading}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="ai-brand-name-input"
                  className="mb-1.5 block text-xs font-bold text-[var(--bh-text)]"
                >
                  {t.brandNameLabel}
                </label>
                <input
                  id="ai-brand-name-input"
                  type="text"
                  value={brandKit.brandName}
                  onChange={(e) =>
                    setBrandKit((prev) => ({ ...prev, brandName: e.target.value }))
                  }
                  className={UI_CLASSES.inputPill}
                />
              </div>

              <div>
                <label
                  htmlFor="ai-brand-monogram-input"
                  className="mb-1.5 block text-xs font-bold text-[var(--bh-text)]"
                >
                  {t.monogramLabel}
                </label>
                <input
                  id="ai-brand-monogram-input"
                  type="text"
                  maxLength={3}
                  value={brandKit.monogram}
                  onChange={(e) =>
                    setBrandKit((prev) => ({ ...prev, monogram: e.target.value }))
                  }
                  className={`${UI_CLASSES.inputPill} text-center font-extrabold uppercase`}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--bh-text)]">{t.paletteLabel}</p>
              <div className="space-y-2">
                {PALETTE_IDS.map((pid) => {
                  const palette = AI_BRAND_PALETTES[pid];
                  const active = brandKit.paletteId === pid;
                  const swatches = PALETTE_SWATCH_CLASSES[pid];
                  return (
                    <button
                      key={pid}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setBrandKit((prev) => ({ ...prev, paletteId: pid }))
                      }
                      className={`flex min-h-[46px] w-full items-center justify-between gap-3 rounded-[16px] border px-3.5 py-2 text-xs font-bold transition-colors ${
                        active
                          ? 'border-[var(--bh-amber)] bg-[var(--bh-amber-soft)] text-[var(--bh-amber-text)]'
                          : 'border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-amber)]'
                      }`}
                    >
                      <span>{lang === 'ar' ? palette.labelAr : palette.labelEn}</span>
                      <span className="flex items-center gap-1.5" aria-hidden="true">
                        {swatches.map((bgClass) => (
                          <span
                            key={bgClass}
                            className={`h-4 w-4 rounded-full border border-white/30 ${bgClass}`}
                          />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone of voice */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--bh-text)]">{t.brandToneLabel}</p>
              <div className="grid grid-cols-2 gap-2">
                {TONE_IDS.map((tid) => {
                  const active = brandKit.toneOfVoice === tid;
                  return (
                    <button
                      key={tid}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setBrandKit((prev) => ({ ...prev, toneOfVoice: tid }))
                      }
                      className={`min-h-[44px] rounded-full px-3 py-2 text-xs font-bold transition-colors ${
                        active
                          ? 'border border-[var(--bh-coral)] bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]'
                          : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                      }`}
                    >
                      {textTones[tid]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <p role="alert" className="text-xs font-semibold text-[var(--bh-error)]">
            {errorMsg}
          </p>
        )}

        <button
          type="button"
          onClick={() => handleRunTool(toolKind)}
          className={`${UI_CLASSES.pillButtonPrimary} w-full`}
        >
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {applyButtonLabel} (-{cost} {copy.costSuffix})
          </span>
        </button>
      </section>

      {/* Output Card */}
      <section aria-labelledby="ai-tools-output-heading" className="lg:col-span-6">
        <div className={`${UI_CLASSES.card} space-y-4 p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-2">
            <h2
              id="ai-tools-output-heading"
              className="text-base font-extrabold text-[var(--bh-text)]"
            >
              {t.resultHeading}
            </h2>
            <span className="rounded-full border border-[var(--bh-border)] bg-[var(--bh-bg)] px-3 py-1 text-[11px] font-bold text-[var(--bh-amber-text)]">
              {t.kinds[toolResult.toolKind]}
            </span>
          </div>

          {/* Visual Comparison / Brand Card */}
          {toolResult.toolKind === 'brand_kit' ? (
            <div
              className={`flex min-h-[175px] flex-col justify-between rounded-[18px] border border-[var(--bh-border)] bg-gradient-to-br p-5 ${toolResult.accentGradient}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/25 text-base font-extrabold tracking-tight text-white">
                  {brandKit.monogram.trim().slice(0, 3).toUpperCase() || 'BH'}
                </div>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {PALETTE_SWATCH_CLASSES[brandKit.paletteId].map((bgClass) => (
                    <span
                      key={bgClass}
                      className={`h-5 w-5 rounded-full border border-white/30 ${bgClass}`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-lg font-extrabold text-white">
                  {brandKit.brandName.trim() || 'BizHub Studio'}
                </p>
                <p className="text-xs font-semibold text-white/80">
                  {textTones[brandKit.toneOfVoice]}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-[var(--bh-text-muted)]">
                  {t.beforeLabel}
                </p>
                <div
                  className={`flex h-36 items-center justify-center rounded-[16px] border border-[var(--bh-border)] bg-gradient-to-br p-3 text-center ${selectedAsset.gradientClass}`}
                >
                  <span className="tabular-nums text-xs font-bold text-[var(--bh-text)]">
                    {selectedAsset.resolutionBefore}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-[var(--bh-coral-text)]">
                  {t.afterLabel}
                </p>
                <div
                  className={`flex h-36 items-center justify-center rounded-[16px] border border-[var(--bh-coral)]/50 p-3 text-center ${
                    toolResult.toolKind === 'bg_remover'
                      ? 'bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:12px_12px]'
                      : `bg-gradient-to-br ${toolResult.accentGradient}`
                  }`}
                >
                  <span className="rounded-full bg-[var(--bh-surface)]/90 px-3 py-1 text-xs font-extrabold text-[var(--bh-text)]">
                    {toolResult.toolKind === 'bg_remover'
                      ? 'Alpha PNG'
                      : `${upscaleFactor.toUpperCase()} HD`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-[var(--bh-text)]">
              {lang === 'ar' ? toolResult.titleAr : toolResult.titleEn}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--bh-text-muted)]">
              {lang === 'ar' ? toolResult.summaryAr : toolResult.summaryEn}
            </p>
          </div>

          <AiStudioResultActions
            lang={lang}
            isSaved={savedIds.has(toolResult.id)}
            onSaveToLibrary={() =>
              onSaveLibraryItem({
                id: toolResult.id,
                kind: 'tool',
                titleEn: toolResult.titleEn,
                titleAr: toolResult.titleAr,
                captionEn: toolResult.captionEn,
                captionAr: toolResult.captionAr,
                badgeEn: t.kinds[toolResult.toolKind],
                badgeAr: t.kinds[toolResult.toolKind],
                mediaPresetId: toolResult.mediaPresetId,
                gradientClass: toolResult.accentGradient,
                savedAtLabelEn: 'Just now',
                savedAtLabelAr: 'الآن',
              })
            }
            onSendToComposer={() =>
              onSendToComposer({
                caption: lang === 'ar' ? toolResult.captionAr : toolResult.captionEn,
                mediaPresetId: toolResult.mediaPresetId,
              })
            }
          />
        </div>
      </section>
    </div>
  );
};
