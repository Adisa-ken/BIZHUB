import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  UserPlus,
  Wallet,
} from 'lucide-react';
import type { EmployeeIndustryDataset } from '../../data/employee';
import { getCopy } from '../../i18n/translations';
import {
  UI_CLASSES,
  type EmployeeIndustryId,
  type Language,
  type ProfileRoleId,
} from '../../theme/tokens';
import type { UserSession } from '../../utils/appLogic';
import { calculateEmployeeEarnings } from '../../utils/employeeLogic';
import { ClientHelpView } from '../client/ClientHelpView';
import { ProfileSwitcher } from '../ProfileSwitcher';
import { EmployeeIndustryBar } from './EmployeeIndustryBar';

interface EmployeeProfileViewProps {
  lang: Language;
  session: UserSession;
  industry: EmployeeIndustryId;
  dataset: EmployeeIndustryDataset;
  onChangeIndustry: (industry: EmployeeIndustryId) => void;
  onSwitchRole: (role: ProfileRoleId) => void;
  onOpenCreateAccount: () => void;
  onReturnToLaunch: () => void;
  onHelpMessageSent: (senderName: string) => void;
}

export const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  lang,
  session,
  industry,
  dataset,
  onChangeIndustry,
  onSwitchRole,
  onOpenCreateAccount,
  onReturnToLaunch,
  onHelpMessageSent,
}) => {
  const copy = getCopy(lang);
  const t = copy.employee.profile;
  const industryCopy = copy.employee.industries[industry];
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;
  const [showSupport, setShowSupport] = useState(false);

  const earnings = useMemo(
    () => calculateEmployeeEarnings(dataset.earningsBase, dataset.appointments),
    [dataset.earningsBase, dataset.appointments]
  );

  const isSignedIn = session.mode !== 'guest' && Boolean(session.email);
  const displayName =
    session.firstName && session.lastName
      ? `${session.firstName} ${session.lastName}`
      : session.firstName ||
        (lang === 'ar' ? dataset.defaultPersonaAr : dataset.defaultPersonaEn);
  const roleTitle = lang === 'ar' ? dataset.roleTitleAr : dataset.roleTitleEn;
  const workplace = lang === 'ar' ? dataset.workplaceAr : dataset.workplaceEn;

  if (showSupport) {
    return (
      <div>
        <div className="mx-auto w-full max-w-4xl px-4 pt-5 sm:px-6 sm:pt-8">
          <button
            type="button"
            onClick={() => setShowSupport(false)}
            className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-xs`}
          >
            <BackArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.backToProfileButton}</span>
          </button>
        </div>
        <ClientHelpView
          lang={lang}
          defaultEmail={session.email}
          defaultName={displayName}
          onMessageSent={onHelpMessageSent}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      {/* Header */}
      <section aria-labelledby="employee-profile-heading" className="space-y-1">
        <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
          {roleTitle} · {workplace}
        </p>
        <h1
          id="employee-profile-heading"
          className="text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl"
        >
          {displayName}
        </h1>
        <p className="text-sm text-[var(--bh-text-muted)]">
          {isSignedIn ? session.email : t.title}
        </p>
      </section>

      {/* Personal Earnings Card */}
      <section
        aria-labelledby="employee-earnings-heading"
        className={`${UI_CLASSES.card} space-y-5 p-6`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Wallet className="h-5 w-5 text-[var(--bh-amber-text)]" aria-hidden="true" />
            <h2
              id="employee-earnings-heading"
              className="text-lg font-extrabold text-[var(--bh-text)]"
            >
              {t.earningsHeading} · {industryCopy.earningsLabel}
            </h2>
          </div>
          <span className="tabular-nums text-xs font-semibold text-[var(--bh-text-muted)]">
            {earnings.completedWeekCount} {industryCopy.unitPlural}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4">
            <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
              {t.todayLabel}
            </p>
            <p className="tabular-nums mt-1 text-2xl font-extrabold text-[var(--bh-amber-text)]">
              ${earnings.todayTotal}
            </p>
          </div>
          <div className="rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4">
            <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
              {t.weekLabel}
            </p>
            <p className="tabular-nums mt-1 text-2xl font-extrabold text-[var(--bh-text)]">
              ${earnings.weekTotal}
            </p>
          </div>
          <div className="rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)] p-4">
            <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
              {t.monthLabel}
            </p>
            <p className="tabular-nums mt-1 text-2xl font-extrabold text-[var(--bh-success)]">
              ${earnings.monthToDateTotal}
            </p>
          </div>
        </div>

        <dl className="divide-y divide-[var(--bh-border)] text-sm">
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-[var(--bh-text-muted)]">{t.commissionBreakdown}</dt>
            <dd className="tabular-nums font-bold text-[var(--bh-text)]">
              ${earnings.weekCommission}
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-[var(--bh-text-muted)]">{t.tipsBreakdown}</dt>
            <dd className="tabular-nums font-bold text-[var(--bh-text)]">
              ${earnings.weekTips}
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-[var(--bh-text-muted)]">{t.avgTicketLabel}</dt>
            <dd className="tabular-nums font-bold text-[var(--bh-text)]">
              ${earnings.averageTicket}
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="text-[var(--bh-text-muted)]">{t.rateLabel}</dt>
            <dd className="tabular-nums font-bold text-[var(--bh-text)]">
              {dataset.earningsBase.commissionRatePercent}%
            </dd>
          </div>
        </dl>

        <div className="space-y-2 border-t border-[var(--bh-border)] pt-4">
          <p className="text-xs font-semibold text-[var(--bh-text-muted)]">
            {t.recentPayoutsHeading}
          </p>
          <div className="space-y-2">
            {dataset.earningsBase.recentPayouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-[var(--bh-text)]">
                  {lang === 'ar' ? payout.labelAr : payout.labelEn}{' '}
                  <span className="text-xs text-[var(--bh-text-muted)]">
                    · {lang === 'ar' ? payout.dateAr : payout.dateEn}
                  </span>
                </span>
                <span className="tabular-nums font-bold text-[var(--bh-success)]">
                  +${payout.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Specialization Selector */}
      <section className={`${UI_CLASSES.card} space-y-3 p-6`}>
        <h2 className="text-sm font-bold text-[var(--bh-text)]">{t.industryHeading}</h2>
        <EmployeeIndustryBar
          lang={lang}
          industry={industry}
          onChangeIndustry={onChangeIndustry}
        />
      </section>

      {/* Role Switcher & Actions */}
      <section className={`${UI_CLASSES.card} space-y-5 p-6`}>
        <ProfileSwitcher
          lang={lang}
          activeRole={session.activeRole}
          onSelectRole={onSwitchRole}
        />

        <div className="flex flex-wrap gap-3 border-t border-[var(--bh-border)] pt-5">
          {!isSignedIn && (
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className={UI_CLASSES.pillButtonPrimary}
            >
              <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{copy.profile.createAccountButton}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowSupport(true)}
            className={UI_CLASSES.pillButtonSecondary}
          >
            <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.supportButton}</span>
          </button>

          <button
            type="button"
            onClick={onReturnToLaunch}
            className={UI_CLASSES.pillButtonSecondary}
          >
            <BackArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{copy.shell.backToLaunch}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
