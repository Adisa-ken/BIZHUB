import React, { useEffect, useState } from 'react';
import { CalendarOff, CalendarPlus, CheckCircle2, X } from 'lucide-react';
import type {
  EmployeeIndustryDataset,
  EmployeeShiftDay,
  TimeOffRequestRecord,
  TimeOffType,
} from '../../data/employee';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type EmployeeIndustryId, type Language } from '../../theme/tokens';
import { validateTimeOffRequest } from '../../utils/employeeLogic';

interface EmployeeScheduleViewProps {
  lang: Language;
  industry: EmployeeIndustryId;
  dataset: EmployeeIndustryDataset;
  schedule: EmployeeShiftDay[];
  timeOffRequests: TimeOffRequestRecord[];
  onSubmitTimeOff: (input: {
    dayId: string;
    type: TimeOffType;
    reason: string;
  }) => void;
  onCancelTimeOff: (requestId: string) => void;
}

const LEAVE_TYPES: TimeOffType[] = ['full_day', 'morning_half', 'afternoon_half'];

export const EmployeeScheduleView: React.FC<EmployeeScheduleViewProps> = ({
  lang,
  industry,
  dataset,
  schedule,
  timeOffRequests,
  onSubmitTimeOff,
  onCancelTimeOff,
}) => {
  const copy = getCopy(lang);
  const t = copy.employee.schedule;
  const industryCopy = copy.employee.industries[industry];
  const workplace = lang === 'ar' ? dataset.workplaceAr : dataset.workplaceEn;

  const firstEligibleDayId =
    schedule.find((d) => d.status === 'scheduled')?.id ?? schedule[0]?.id ?? '';

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(firstEligibleDayId);
  const [leaveType, setLeaveType] = useState<TimeOffType>('full_day');
  const [reason, setReason] = useState('');
  const [errorKey, setErrorKey] = useState<'dayRequired' | 'dayOffBlocked' | 'reasonTooShort' | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalOpen]);

  const openTimeOffModal = (dayId?: string) => {
    setSelectedDayId(dayId ?? firstEligibleDayId);
    setLeaveType('full_day');
    setReason('');
    setErrorKey(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDay = schedule.find((d) => d.id === selectedDayId);
    const check = validateTimeOffRequest({ day: targetDay, reason });
    if (!check.valid) {
      setErrorKey(check.errorKey);
      return;
    }
    onSubmitTimeOff({ dayId: selectedDayId, type: leaveType, reason });
    setModalOpen(false);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      {/* Header */}
      <section aria-labelledby="employee-schedule-heading" className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
            {industryCopy.label} · {workplace}
          </p>
          <h1
            id="employee-schedule-heading"
            className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
          >
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--bh-text-muted)]">{t.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => openTimeOffModal()}
          className={`${UI_CLASSES.pillButtonPrimary} shrink-0`}
        >
          <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.requestTimeOffButton}</span>
        </button>
      </section>

      {/* Weekly Schedule List */}
      <section aria-label={t.title} className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {schedule.map((day) => {
          const dayLabel = lang === 'ar' ? day.dayAr : day.dayEn;
          const shortDate = lang === 'ar' ? day.shortDateAr : day.shortDateEn;
          const shiftTime = lang === 'ar' ? day.shiftTimeAr : day.shiftTimeEn;
          const station = lang === 'ar' ? day.stationAr : day.stationEn;

          const statusText =
            day.status === 'off'
              ? t.statusOff
              : day.status === 'time_off_requested'
                ? t.statusRequested
                : t.statusScheduled;

          const statusColor =
            day.status === 'time_off_requested'
              ? 'text-[var(--bh-amber-text)]'
              : day.status === 'off'
                ? 'text-[var(--bh-text-muted)]'
                : 'text-[var(--bh-success)]';

          return (
            <article
              key={day.id}
              className={`${UI_CLASSES.card} flex items-center justify-between gap-4 p-4 sm:p-5`}
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-[var(--bh-text)]">
                    {dayLabel} · {shortDate}
                  </span>
                  <span className="text-[var(--bh-text-muted)]" aria-hidden="true">
                    ·
                  </span>
                  <span className={statusColor}>{statusText}</span>
                </div>

                <p className="tabular-nums text-base font-extrabold text-[var(--bh-text)]">
                  {shiftTime}
                </p>

                <p className="tabular-nums text-xs text-[var(--bh-text-muted)]">
                  {station}
                  {day.bookedCount > 0
                    ? ` · ${day.bookedCount} ${industryCopy.unitPlural}`
                    : ''}
                </p>
              </div>

              {day.status === 'scheduled' && (
                <button
                  type="button"
                  onClick={() => openTimeOffModal(day.id)}
                  aria-label={`${t.requestTimeOffButton} (${dayLabel})`}
                  className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] shrink-0 px-3.5 py-2 text-xs`}
                >
                  <CalendarOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="hidden sm:inline">{t.requestTimeOffButton}</span>
                </button>
              )}
            </article>
          );
        })}
      </section>

      {/* Submitted Time-Off Requests */}
      <section aria-labelledby="time-off-requests-heading" className="space-y-3">
        <h2
          id="time-off-requests-heading"
          className="text-lg font-extrabold tracking-tight text-[var(--bh-text)]"
        >
          {t.pendingRequestsHeading}
        </h2>

        {timeOffRequests.length === 0 ? (
          <div className={`${UI_CLASSES.card} p-5 text-sm text-[var(--bh-text-muted)]`}>
            {t.noPendingRequests}
          </div>
        ) : (
          <div className="space-y-3">
            {timeOffRequests.map((req) => (
              <article
                key={req.id}
                className={`${UI_CLASSES.card} flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center`}
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1 text-[var(--bh-amber-text)]">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.pendingBadge}
                    </span>
                    <span className="text-[var(--bh-text-muted)]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[var(--bh-text-muted)]">
                      {lang === 'ar' ? req.submittedAtAr : req.submittedAtEn}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-[var(--bh-text)]">
                    {lang === 'ar' ? req.dayLabelAr : req.dayLabelEn} · {t.types[req.type]}
                  </p>
                  <p className="text-xs text-[var(--bh-text-muted)]">{req.reason}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onCancelTimeOff(req.id)}
                  className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] shrink-0 px-4 py-2 text-xs`}
                >
                  {t.cancelRequest}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Request Time Off Dialog */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-time-off-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[24px] border border-[var(--bh-border)] bg-[var(--bh-surface)] p-6 shadow-2xl sm:rounded-[20px]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="request-time-off-title"
                  className="text-lg font-extrabold text-[var(--bh-text)]"
                >
                  {t.modalTitle}
                </h2>
                <p className="mt-0.5 text-xs text-[var(--bh-text-muted)]">
                  {t.modalSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label={t.closeAria}
                className={UI_CLASSES.iconButton}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="time-off-day"
                  className="mb-1.5 block text-xs font-semibold text-[var(--bh-text)]"
                >
                  {t.selectDayLabel}
                </label>
                <select
                  id="time-off-day"
                  value={selectedDayId}
                  onChange={(e) => {
                    setSelectedDayId(e.target.value);
                    setErrorKey(null);
                  }}
                  className={UI_CLASSES.inputPill}
                >
                  {schedule.map((d) => (
                    <option key={d.id} value={d.id}>
                      {lang === 'ar'
                        ? `${d.dayAr} · ${d.shortDateAr} (${d.shiftTimeAr})`
                        : `${d.dayEn} · ${d.shortDateEn} (${d.shiftTimeEn})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold text-[var(--bh-text)]">
                  {t.typeLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {LEAVE_TYPES.map((typeKey) => {
                    const active = leaveType === typeKey;
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setLeaveType(typeKey)}
                        className={`min-h-[44px] rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                          active
                            ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                            : 'border border-[var(--bh-border)] bg-[var(--bh-bg)] text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                        }`}
                      >
                        {t.types[typeKey]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="time-off-reason"
                  className="mb-1.5 block text-xs font-semibold text-[var(--bh-text)]"
                >
                  {t.reasonLabel}
                </label>
                <textarea
                  id="time-off-reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setErrorKey(null);
                  }}
                  placeholder={t.reasonPlaceholder}
                  className="w-full rounded-[20px] border border-[var(--bh-border)] bg-[var(--bh-bg)] px-4 py-3 text-sm text-[var(--bh-text)] placeholder:text-[var(--bh-text-muted)] focus:border-[var(--bh-coral)] focus:outline-none"
                />
              </div>

              {errorKey && (
                <p role="alert" className="text-xs font-semibold text-[var(--bh-error)]">
                  {t.errors[errorKey]}
                </p>
              )}

              <button type="submit" className={`${UI_CLASSES.pillButtonPrimary} w-full`}>
                {t.submitButton}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
