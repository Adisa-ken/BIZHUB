import React, { useMemo, useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { TIME_SLOTS, type BookingRecord } from '../../data/businesses';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';
import { buildSevenDayStrip } from '../../utils/clientLogic';

interface ClientBookingsViewProps {
  lang: Language;
  bookings: BookingRecord[];
  onCancelBooking: (bookingId: string) => void;
  onRescheduleBooking: (bookingId: string, dateKey: string, timeSlot: string) => void;
  onExploreBusinesses: () => void;
  onBookAgain: (businessId: string) => void;
}

export const ClientBookingsView: React.FC<ClientBookingsViewProps> = ({
  lang,
  bookings,
  onCancelBooking,
  onRescheduleBooking,
  onExploreBusinesses,
  onBookAgain,
}) => {
  const t = getCopy(lang).client.bookings;
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<BookingRecord | null>(null);

  const dayStrip = useMemo(() => buildSevenDayStrip(new Date(2026, 10, 17), lang), [lang]);
  const [newDateKey, setNewDateKey] = useState<string>(dayStrip[0].dateKey);
  const [newTimeSlot, setNewTimeSlot] = useState<string>(TIME_SLOTS[0]);

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'upcoming'),
    [bookings]
  );
  const pastBookings = useMemo(
    () => bookings.filter((b) => b.status !== 'upcoming'),
    [bookings]
  );

  const displayed = tab === 'upcoming' ? upcomingBookings : pastBookings;

  const openReschedule = (bk: BookingRecord) => {
    setRescheduleTarget(bk);
    setNewDateKey(dayStrip.some((d) => d.dateKey === bk.dateKey) ? bk.dateKey : dayStrip[0].dateKey);
    setNewTimeSlot(bk.timeSlot);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl">
        {t.title}
      </h1>

      {/* Segmented Tabs: Upcoming / Past */}
      <div
        role="tablist"
        aria-label={t.title}
        className="grid grid-cols-2 gap-1.5 rounded-full border border-[var(--bh-border)] bg-[var(--bh-surface)] p-1.5"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'upcoming'}
          onClick={() => setTab('upcoming')}
          className={`tabular-nums min-h-[44px] rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            tab === 'upcoming'
              ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
              : 'text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]'
          }`}
        >
          {t.upcomingTab} ({upcomingBookings.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'past'}
          onClick={() => setTab('past')}
          className={`tabular-nums min-h-[44px] rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            tab === 'past'
              ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
              : 'text-[var(--bh-text-muted)] hover:text-[var(--bh-text)]'
          }`}
        >
          {t.pastTab} ({pastBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {displayed.length === 0 ? (
        <div className={`${UI_CLASSES.card} space-y-4 p-8 text-center`}>
          <p className="text-sm text-[var(--bh-text-muted)]">
            {tab === 'upcoming' ? t.emptyUpcoming : t.emptyPast}
          </p>
          <button
            type="button"
            onClick={onExploreBusinesses}
            className={UI_CLASSES.pillButtonPrimary}
          >
            {t.browseCta}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((bk) => {
            const bizName = lang === 'ar' ? bk.businessNameAr : bk.businessNameEn;
            const svcName = lang === 'ar' ? bk.serviceNameAr : bk.serviceNameEn;
            const staffName = lang === 'ar' ? bk.staffNameAr : bk.staffNameEn;
            const isConfirmingCancel = confirmCancelId === bk.id;

            return (
              <article key={bk.id} className={`${UI_CLASSES.card} space-y-4 p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-xs font-bold ${
                        bk.status === 'upcoming'
                          ? 'text-[var(--bh-coral-text)]'
                          : bk.status === 'cancelled'
                            ? 'text-[var(--bh-error)]'
                            : 'text-[var(--bh-success)]'
                      }`}
                    >
                      {t.statusLabels[bk.status]} · {t.depositPaid} ${bk.depositUsd}
                    </p>
                    <h2 className="mt-1 text-lg font-extrabold text-[var(--bh-text)]">
                      {bizName}
                    </h2>
                    <p className="text-sm text-[var(--bh-text-muted)]">
                      {svcName} · {staffName}
                    </p>
                  </div>

                  <span className="tabular-nums text-base font-extrabold text-[var(--bh-text)]">
                    ${bk.priceUsd}
                  </span>
                </div>

                <div className="tabular-nums flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--bh-text-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[var(--bh-coral-text)]" aria-hidden="true" />
                    <span dir="ltr">{bk.dateKey}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[var(--bh-amber-text)]" aria-hidden="true" />
                    <span dir="ltr">{bk.timeSlot}</span>
                  </span>
                </div>

                {bk.status === 'upcoming' ? (
                  isConfirmingCancel ? (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[var(--bh-error)]/40 bg-[var(--bh-error-soft)] p-3">
                      <span className="text-xs font-bold text-[var(--bh-text)]">
                        {t.confirmCancelPrompt}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onCancelBooking(bk.id);
                            setConfirmCancelId(null);
                          }}
                          className="min-h-[44px] rounded-full bg-[var(--bh-error)] px-4 py-2 text-xs font-bold text-white"
                        >
                          {t.confirmCancelYes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancelId(null)}
                          className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-xs`}
                        >
                          {t.confirmCancelNo}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--bh-border)] pt-3">
                      <button
                        type="button"
                        onClick={() => openReschedule(bk)}
                        className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] flex-1 px-4 py-2 text-xs`}
                      >
                        {t.rescheduleButton}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmCancelId(bk.id)}
                        className="min-h-[44px] rounded-full border border-[var(--bh-error)]/50 px-5 py-2 text-xs font-bold text-[var(--bh-error)] transition-colors hover:bg-[var(--bh-error-soft)]"
                      >
                        {t.cancelButton}
                      </button>
                    </div>
                  )
                ) : (
                  <div className="border-t border-[var(--bh-border)] pt-3">
                    <button
                      type="button"
                      onClick={() => onBookAgain(bk.businessId)}
                      className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-5 py-2 text-xs`}
                    >
                      {t.bookAgain}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Reschedule Sheet */}
      {rescheduleTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setRescheduleTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reschedule-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg space-y-5 rounded-t-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-6 shadow-2xl sm:rounded-[20px]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="reschedule-dialog-title"
                className="text-lg font-extrabold text-[var(--bh-text)]"
              >
                {t.rescheduleTitle}
              </h2>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                aria-label={t.rescheduleCancel}
                className={UI_CLASSES.iconButton}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {dayStrip.map((day) => {
                const active = day.dateKey === newDateKey;
                return (
                  <button
                    key={day.dateKey}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setNewDateKey(day.dateKey)}
                    className={`flex min-h-[60px] flex-col items-center justify-center rounded-[14px] px-1 py-2 text-center transition-colors ${
                      active
                        ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 text-[var(--bh-text)]'
                    }`}
                  >
                    <span className="text-[10px] font-semibold opacity-85">{day.dayShort}</span>
                    <span className="tabular-nums text-sm font-extrabold">{day.dayNum}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => {
                const active = slot === newTimeSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setNewTimeSlot(slot)}
                    dir="ltr"
                    className={`tabular-nums min-h-[44px] rounded-full px-3 py-2 text-sm font-bold ${
                      active
                        ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                        : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 text-[var(--bh-text)]'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  onRescheduleBooking(rescheduleTarget.id, newDateKey, newTimeSlot);
                  setRescheduleTarget(null);
                }}
                className={`${UI_CLASSES.pillButtonPrimary} flex-1`}
              >
                {t.rescheduleSave}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
