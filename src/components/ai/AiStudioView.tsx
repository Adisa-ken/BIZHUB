import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Coins,
  Film,
  Image as ImageIcon,
  Info,
  Megaphone,
  Plus,
  Sparkles,
  Trash2,
  Type,
  Wrench,
  X,
} from 'lucide-react';
import type { AiLibraryItem } from '../../data/aiStudio';
import type { SocialMediaPresetId } from '../../data/socialHub';
import { getCopy } from '../../i18n/translations';
import {
  UI_CLASSES,
  type AiStudioTabId,
  type Language,
} from '../../theme/tokens';
import { buildSocialComposerPayload } from '../../utils/aiStudioLogic';
import { AiImageTab } from './AiImageTab';
import { AiTextTab } from './AiTextTab';
import { AiToolsTab } from './AiToolsTab';
import { AiVideoTab } from './AiVideoTab';

interface AiStudioViewProps {
  lang: Language;
  credits: number;
  library: AiLibraryItem[];
  onSpendCredits: (cost: number) => boolean;
  onTopUpCredits: () => void;
  onSaveLibraryItem: (item: AiLibraryItem) => void;
  onRemoveLibraryItem: (itemId: string) => void;
  onSendToComposer: (payload: {
    caption: string;
    mediaPresetId: SocialMediaPresetId | null;
  }) => void;
  onOpenSocialHub?: () => void;
  onBack?: () => void;
}

const AI_STUDIO_TABS: Array<{
  id: AiStudioTabId;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}> = [
  { id: 'text', icon: Type },
  { id: 'image', icon: ImageIcon },
  { id: 'video', icon: Film },
  { id: 'tools', icon: Wrench },
];

export const AiStudioView: React.FC<AiStudioViewProps> = ({
  lang,
  credits,
  library,
  onSpendCredits,
  onTopUpCredits,
  onSaveLibraryItem,
  onRemoveLibraryItem,
  onSendToComposer,
  onOpenSocialHub,
  onBack,
}) => {
  const t = getCopy(lang).aiStudio;
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  const [activeSubTab, setActiveSubTab] = useState<AiStudioTabId>('text');
  const [libraryOpen, setLibraryOpen] = useState(false);

  const savedIds = useMemo(
    () => new Set(library.map((item) => item.id)),
    [library]
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      {/* Header + Credits Bar */}
      <section aria-labelledby="ai-studio-heading" className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--bh-coral-text)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.eyebrow}</span>
            </p>
            <h1
              id="ai-studio-heading"
              className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
            >
              {t.title}
            </h1>
          </div>

          {/* Credits Balance, Top-Up, Library & Social Hub Shortcut */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              aria-label={`${t.creditsLabel}: ${credits}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--bh-amber)]/50 bg-[var(--bh-amber-soft)] px-4 py-2 text-xs font-extrabold text-[var(--bh-amber-text)]"
            >
              <Coins className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.creditsLabel}:</span>
              <span className="tabular-nums text-sm">{credits}</span>
            </div>

            <button
              type="button"
              onClick={onTopUpCredits}
              className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-3.5 py-2 text-xs`}
            >
              <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{t.topUpButton}</span>
            </button>

            <button
              type="button"
              onClick={() => setLibraryOpen(true)}
              className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-3.5 py-2 text-xs`}
            >
              <Bookmark className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                {t.libraryButton} (<span className="tabular-nums">{library.length}</span>)
              </span>
            </button>

            {onOpenSocialHub && (
              <button
                type="button"
                onClick={onOpenSocialHub}
                className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-3.5 py-2 text-xs`}
              >
                <Megaphone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{t.openSocialHubButton}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mandatory Notice: "Demo: results are placeholders." */}
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-[16px] border border-[var(--bh-amber)]/45 bg-[var(--bh-amber-soft)] px-4 py-3 text-sm font-semibold text-[var(--bh-amber-text)]"
        >
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.notice}</span>
        </div>

        {/* 4 Internal Tabs: Text, Image, Video, Tools */}
        <div
          role="tablist"
          aria-label={t.title}
          className="grid grid-cols-4 gap-1 rounded-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-1.5 sm:rounded-full"
        >
          {AI_STUDIO_TABS.map(({ id, icon: Icon }) => {
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

      {/* Sub-tab Panels */}
      {activeSubTab === 'text' && (
        <AiTextTab
          lang={lang}
          savedIds={savedIds}
          onSpendCredits={onSpendCredits}
          onSaveLibraryItem={onSaveLibraryItem}
          onSendToComposer={onSendToComposer}
        />
      )}

      {activeSubTab === 'image' && (
        <AiImageTab
          lang={lang}
          savedIds={savedIds}
          onSpendCredits={onSpendCredits}
          onSaveLibraryItem={onSaveLibraryItem}
          onSendToComposer={onSendToComposer}
        />
      )}

      {activeSubTab === 'video' && (
        <AiVideoTab
          lang={lang}
          savedIds={savedIds}
          onSpendCredits={onSpendCredits}
          onSaveLibraryItem={onSaveLibraryItem}
          onSendToComposer={onSendToComposer}
        />
      )}

      {activeSubTab === 'tools' && (
        <AiToolsTab
          lang={lang}
          savedIds={savedIds}
          onSpendCredits={onSpendCredits}
          onSaveLibraryItem={onSaveLibraryItem}
          onSendToComposer={onSendToComposer}
        />
      )}

      {/* Saved AI Library Sheet Modal */}
      {libraryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-library-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <div
            className={`${UI_CLASSES.card} flex max-h-[85vh] w-full max-w-2xl flex-col rounded-b-none p-5 sm:rounded-[20px] sm:p-6`}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--bh-border)] pb-4">
              <div>
                <h2
                  id="ai-library-title"
                  className="text-lg font-extrabold text-[var(--bh-text)]"
                >
                  {t.libraryTitle}
                </h2>
                <p className="mt-0.5 text-xs text-[var(--bh-text-muted)]">
                  {t.librarySubtitle}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.libraryClose}
                onClick={() => setLibraryOpen(false)}
                className={UI_CLASSES.iconButton}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-3 overflow-y-auto pe-1">
              {library.length === 0 ? (
                <div className="rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-6 text-center text-sm text-[var(--bh-text-muted)]">
                  {t.libraryEmpty}
                </div>
              ) : (
                library.map((item) => (
                  <article
                    key={item.id}
                    className="space-y-3 rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--bh-coral-text)]">
                        {lang === 'ar' ? item.badgeAr : item.badgeEn}
                      </span>
                      <span className="text-[11px] text-[var(--bh-text-muted)]">
                        {lang === 'ar' ? item.savedAtLabelAr : item.savedAtLabelEn}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--bh-text)]">
                        {lang === 'ar' ? item.titleAr : item.titleEn}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--bh-text-muted)]">
                        {lang === 'ar' ? item.captionAr : item.captionEn}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLibraryOpen(false);
                          onSendToComposer(buildSocialComposerPayload(item, lang));
                        }}
                        className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] flex-1 px-4 py-2 text-xs`}
                      >
                        {t.actions.sendToComposer}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveLibraryItem(item.id)}
                        className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-3.5 py-2 text-xs`}
                      >
                        <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{t.removeLibraryItem}</span>
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
