import React, { useEffect } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { getCopy, type AlertItem } from '../i18n/translations';
import { UI_CLASSES, type Language } from '../theme/tokens';

interface AlertBoardSheetProps {
  open: boolean;
  lang: Language;
  alerts: AlertItem[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const AlertBoardSheet: React.FC<AlertBoardSheetProps> = ({
  open,
  lang,
  alerts,
  onClose,
  onMarkRead,
  onMarkAllRead,
}) => {
  const t = getCopy(lang).alerts;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const hasUnread = alerts.some((a) => !a.read);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-board-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-6 shadow-2xl sm:rounded-[20px]"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-[var(--bh-border)] sm:hidden" aria-hidden="true" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--bh-coral-soft)] text-[var(--bh-coral-text)]">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="alert-board-title" className="text-lg font-bold text-[var(--bh-text)]">
                {t.title}
              </h2>
              <p className="text-xs text-[var(--bh-text-muted)]">{t.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className={UI_CLASSES.iconButton}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={!hasUnread}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[var(--bh-coral-text)] transition-opacity hover:underline disabled:opacity-40"
          >
            <CheckCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.markAllRead}</span>
          </button>
        </div>

        <div className="mt-2 max-h-[55dvh] space-y-3 overflow-y-auto pe-1">
          {alerts.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--bh-text-muted)]">{t.empty}</p>
          ) : (
            alerts.map((item) => {
              const title = lang === 'ar' ? item.titleAr : item.titleEn;
              const body = lang === 'ar' ? item.bodyAr : item.bodyEn;
              const time = lang === 'ar' ? item.timeAr : item.timeEn;
              const catLabel = t.categoryLabels[item.category];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onMarkRead(item.id)}
                  className={`w-full rounded-[20px] border p-4 text-start transition-colors ${
                    item.read
                      ? 'border-[var(--bh-border)] bg-[var(--bh-bg)]/60 opacity-80'
                      : 'border-[var(--bh-coral)]/50 bg-[var(--bh-surface-elevated)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[var(--bh-amber-text)]">
                      {catLabel}
                    </span>
                    <div className="flex items-center gap-2 text-[var(--bh-text-muted)]">
                      <span>{time}</span>
                      <span aria-hidden="true">·</span>
                      <span className={item.read ? '' : 'font-semibold text-[var(--bh-coral-text)]'}>
                        {item.read ? t.readLabel : t.unreadLabel}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm font-bold text-[var(--bh-text)]">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--bh-text-muted)]">{body}</p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
