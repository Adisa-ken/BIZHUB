import React from 'react';
import { Bookmark, BookmarkCheck, Send } from 'lucide-react';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';

interface AiStudioResultActionsProps {
  lang: Language;
  isSaved: boolean;
  onSaveToLibrary: () => void;
  onSendToComposer: () => void;
  compact?: boolean;
}

export const AiStudioResultActions: React.FC<AiStudioResultActionsProps> = ({
  lang,
  isSaved,
  onSaveToLibrary,
  onSendToComposer,
  compact = false,
}) => {
  const t = getCopy(lang).aiStudio.actions;

  return (
    <div
      className={`flex flex-wrap gap-2 ${
        compact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'
      }`}
    >
      <button
        type="button"
        onClick={onSaveToLibrary}
        className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] flex-1 px-4 py-2 text-xs ${
          isSaved ? 'border-[var(--bh-success)] text-[var(--bh-success)]' : ''
        }`}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <Bookmark className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span>{isSaved ? t.savedToLibrary : t.saveToLibrary}</span>
      </button>

      <button
        type="button"
        onClick={onSendToComposer}
        className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] flex-1 px-4 py-2 text-xs`}
      >
        <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{t.sendToComposer}</span>
      </button>
    </div>
  );
};
