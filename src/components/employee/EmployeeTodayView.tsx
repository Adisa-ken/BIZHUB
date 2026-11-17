import React, { useMemo } from 'react';
import { Check, CheckCircle2, Clock, Play } from 'lucide-react';
import type { EmployeeIndustryDataset } from '../../data/employee';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type EmployeeIndustryId, type Language } from '../../theme/tokens';
import type { UserSession } from '../../utils/appLogic';
import {
  calculateEmployeeEarnings,
  sortAppointmentsByTime,
} from '../../utils/employeeLogic';
import { EmployeeIndustryBar } from './EmployeeIndustryBar';

interface EmployeeTodayViewProps {
  lang: Language;
  session: UserSession;
  industry: EmployeeIndustryId;
  dataset: EmployeeIndustryDataset;
  onChangeIndustry: (industry: EmployeeIndustryId) => void;
  onStartAppointment: (appointmentId: string) => void;
  onCompleteAppointment: (appointmentId: string) => void;
}

export const EmployeeTodayView: React.FC<EmployeeTodayViewProps> = ({
  lang,
  session,
  industry,
  dataset,
  onChangeIndustry,
  onStartAppointment,
  onCompleteAppointment,
}) => {
  const copy = getCopy(lang);
  const t = copy.employee;
  const industryCopy = t.industries[industry];

  const orderedAppointments = useMemo(
    () => sortAppointmentsByTime(dataset.appointments),
    [dataset.appointments]
  );

  const earnings = useMemo(
    () => calculateEmployeeEarnings(dataset.earningsBase, dataset.appointments),
    [dataset.earningsBase, dataset.appointments]
  );

  const remainingCount = orderedAppointments.filter((a) => a.status !== 'completed').length;

  const employeeName =
    session.firstName && session.lastName
      ? `${session.firstName} ${session.lastName}`
      : session.firstName ||
        (lang === 'ar' ? dataset.defaultPersonaAr : dataset.defaultPersonaEn);
  const roleTitle = lang === 'ar' ? dataset.roleTitleAr : dataset.roleTitleEn;
  const workplace = lang === 'ar' ? dataset.workplaceAr : dataset.workplaceEn;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      {/* Header & Industry Mode Switcher */}
      <section aria-labelledby="employee-today-heading" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
              {roleTitle} · {workplace}
            </p>
            <h1
              id="employee-today-heading"
              className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
            >
              {industryCopy.todayTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--bh-text-muted)]">
              {employeeName} · {industryCopy.todaySubtitle}
            </p>
          </div>

          <div className="w-full max-w-sm">
            <EmployeeIndustryBar
              lang={lang}
              industry={industry}
              onChangeIndustry={onChangeIndustry}
            />
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className={`${UI_CLASSES.card} p-3.5 sm:p-4`}>
            <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
              {t.today.completedStat}
            </p>
            <p className="tabular-nums mt-1 text-xl font-extrabold text-[var(--bh-success)] sm:text-2xl">
              {earnings.completedTodayCount}
            </p>
          </div>
          <div className={`${UI_CLASSES.card} p-3.5 sm:p-4`}>
            <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
              {t.today.remainingStat}
            </p>
            <p className="tabular-nums mt-1 text-xl font-extrabold text-[var(--bh-text)] sm:text-2xl">
              {remainingCount}
            </p>
          </div>
          <div className={`${UI_CLASSES.card} p-3.5 sm:p-4`}>
            <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
              {t.today.earnedStat}
            </p>
            <p className="tabular-nums mt-1 text-xl font-extrabold text-[var(--bh-amber-text)] sm:text-2xl">
              ${earnings.todayTotal}
            </p>
          </div>
        </div>
      </section>

      {/* Ordered Appointments List */}
      <section aria-label={industryCopy.todayTitle} className="space-y-3">
        {orderedAppointments.map((appt) => {
          const clientName = lang === 'ar' ? appt.clientNameAr : appt.clientNameEn;
          const serviceName = lang === 'ar' ? appt.serviceAr : appt.serviceEn;
          const station = lang === 'ar' ? appt.stationAr : appt.stationEn;
          const isCompleted = appt.status === 'completed';
          const isInProgress = appt.status === 'in_progress';

          const statusText = isCompleted
            ? t.today.statusCompleted
            : isInProgress
              ? t.today.statusInProgress
              : t.today.statusScheduled;

          const statusColor = isCompleted
            ? 'text-[var(--bh-success)]'
            : isInProgress
              ? 'text-[var(--bh-amber-text)]'
              : 'text-[var(--bh-text-muted)]';

          return (
            <article
              key={appt.id}
              className={`${
                isInProgress ? UI_CLASSES.cardElevated : UI_CLASSES.card
              } flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5 ${
                isInProgress ? 'border-[var(--bh-coral)]/70' : ''
              }`}
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex min-w-[64px] shrink-0 flex-col items-center justify-center rounded-[14px] border border-[var(--bh-border)] bg-[var(--bh-bg)] px-2.5 py-2 text-center">
                  <span className="tabular-nums text-sm font-extrabold text-[var(--bh-text)]">
                    {appt.time24}
                  </span>
                  <span className="tabular-nums text-[11px] text-[var(--bh-text-muted)]">
                    {appt.durationMin} {t.today.durationUnit}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className={statusColor}>{statusText}</span>
                    <span className="text-[var(--bh-text-muted)]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[var(--bh-text-muted)]">{station}</span>
                  </div>

                  <h2 className="text-base font-extrabold text-[var(--bh-text)] sm:text-lg">
                    {clientName}
                  </h2>

                  <p className="text-sm font-medium text-[var(--bh-text-muted)]">
                    {serviceName}
                  </p>

                  <p className="tabular-nums text-xs text-[var(--bh-text-muted)]">
                    ${appt.price} · +{appt.estimatedTip > 0 ? `$${appt.estimatedTip} ${t.today.tipPrefix}` : ''}
                    {isCompleted && appt.completedAtLabel
                      ? ` · ${t.today.completedAtPrefix} ${appt.completedAtLabel}`
                      : ''}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                {appt.status === 'scheduled' && (
                  <button
                    type="button"
                    onClick={() => onStartAppointment(appt.id)}
                    aria-label={`${t.today.startButton} — ${clientName}`}
                    className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] w-full px-5 py-2.5 text-sm sm:w-auto`}
                  >
                    <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.today.startButton}</span>
                  </button>
                )}

                {appt.status === 'in_progress' && (
                  <button
                    type="button"
                    onClick={() => onCompleteAppointment(appt.id)}
                    aria-label={`${t.today.completeButton} — ${clientName}`}
                    className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] w-full px-5 py-2.5 text-sm sm:w-auto`}
                  >
                    <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.today.completeButton}</span>
                  </button>
                )}

                {appt.status === 'completed' && (
                  <div className="inline-flex min-h-[44px] items-center gap-1.5 px-3 text-xs font-bold text-[var(--bh-success)]">
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.today.statusCompleted}</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {orderedAppointments.length === 0 && (
          <div className={`${UI_CLASSES.card} flex items-center gap-3 p-6 text-sm text-[var(--bh-text-muted)]`}>
            <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{t.today.statusScheduled}</span>
          </div>
        )}
      </section>
    </div>
  );
};
