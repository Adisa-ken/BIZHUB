import React, { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, CheckCircle2, CreditCard } from 'lucide-react';
import { TIME_SLOTS, type BookingRecord, type BusinessRecord } from '../../data/businesses';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';
import { buildSevenDayStrip, createBookingRecord } from '../../utils/clientLogic';

interface ClientBookViewProps {
  lang: Language;
  businesses: BusinessRecord[];
  initialBusinessId?: string | null;
  initialServiceId?: string | null;
  initialStaffId?: string | null;
  initialDateKey?: string | null;
  onConfirmBooking: (booking: BookingRecord) => void;
  onViewBookings: () => void;
}

export const ClientBookView: React.FC<ClientBookViewProps> = ({
  lang,
  businesses,
  initialBusinessId,
  initialServiceId,
  initialStaffId,
  initialDateKey,
  onConfirmBooking,
  onViewBookings,
}) => {
  const t = getCopy(lang).client.book;
  const profileCopy = getCopy(lang).client.profileView;

  const dayStrip = useMemo(() => buildSevenDayStrip(new Date(2026, 10, 17), lang), [lang]);

  const [step, setStep] = useState<'select' | 'deposit' | 'confirmed'>('select');
  const [businessId, setBusinessId] = useState<string>(initialBusinessId || businesses[0].id);

  const selectedBusiness = useMemo(
    () => businesses.find((b) => b.id === businessId) ?? businesses[0],
    [businesses, businessId]
  );

  const [serviceId, setServiceId] = useState<string>(
    initialServiceId || selectedBusiness.services[0].id
  );
  const [staffId, setStaffId] = useState<string>(
    initialStaffId && selectedBusiness.staff.some((s) => s.id === initialStaffId)
      ? initialStaffId
      : selectedBusiness.staff[0].id
  );
  const [dateKey, setDateKey] = useState<string>(
    initialDateKey && dayStrip.some((d) => d.dateKey === initialDateKey)
      ? initialDateKey
      : dayStrip[0].dateKey
  );
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (initialBusinessId) {
      const biz = businesses.find((b) => b.id === initialBusinessId) ?? businesses[0];
      setBusinessId(biz.id);
      setServiceId(
        initialServiceId && biz.services.some((s) => s.id === initialServiceId)
          ? initialServiceId
          : biz.services[0].id
      );
      setStaffId(
        initialStaffId && biz.staff.some((s) => s.id === initialStaffId)
          ? initialStaffId
          : biz.staff[0].id
      );
      if (initialDateKey && dayStrip.some((d) => d.dateKey === initialDateKey)) {
        setDateKey(initialDateKey);
      }
      setStep('select');
    }
  }, [initialBusinessId, initialServiceId, initialStaffId, initialDateKey, businesses, dayStrip]);

  const handleBusinessChange = (nextBizId: string) => {
    const biz = businesses.find((b) => b.id === nextBizId) ?? businesses[0];
    setBusinessId(biz.id);
    setServiceId(biz.services[0].id);
    setStaffId(biz.staff[0].id);
  };

  const selectedService =
    selectedBusiness.services.find((s) => s.id === serviceId) ?? selectedBusiness.services[0];
  const selectedStaff =
    selectedBusiness.staff.find((st) => st.id === staffId) ?? selectedBusiness.staff[0];

  const handlePayAndConfirm = () => {
    const booking = createBookingRecord({
      id: `bk-${Date.now().toString().slice(-4)}`,
      business: selectedBusiness,
      serviceId: selectedService.id,
      staffId: selectedStaff.id,
      dateKey,
      timeSlot,
    });
    setConfirmedBooking(booking);
    onConfirmBooking(booking);
    setStep('confirmed');
  };

  const resetForAnother = () => {
    setConfirmedBooking(null);
    setStep('select');
  };

  const bizName = lang === 'ar' ? selectedBusiness.nameAr : selectedBusiness.nameEn;
  const svcName = lang === 'ar' ? selectedService.nameAr : selectedService.nameEn;
  const staffName = lang === 'ar' ? selectedStaff.nameAr : selectedStaff.nameEn;
  const remainingAtVenue = Math.max(0, selectedService.priceUsd - selectedService.depositUsd);

  if (step === 'confirmed' && confirmedBooking) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
        <section
          aria-labelledby="booking-confirmed-heading"
          className={`${UI_CLASSES.card} space-y-6 p-6 text-center sm:p-8`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bh-success-soft)] text-[var(--bh-success)]">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <h1
              id="booking-confirmed-heading"
              className="text-2xl font-extrabold text-[var(--bh-text)]"
            >
              {t.confirmedTitle}
            </h1>
            <p className="text-sm text-[var(--bh-text-muted)]">{t.confirmedSubtitle}</p>
          </div>

          <dl className="divide-y divide-[var(--bh-border)] rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 px-4 text-start text-sm">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.refLabel}</dt>
              <dd className="tabular-nums font-bold uppercase text-[var(--bh-coral-text)]">
                {confirmedBooking.id}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.pickBusinessLabel}</dt>
              <dd className="font-bold text-[var(--bh-text)]">{bizName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.summaryServiceLabel}</dt>
              <dd className="font-semibold text-[var(--bh-text)]">{svcName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.summaryStaffLabel}</dt>
              <dd className="font-semibold text-[var(--bh-text)]">{staffName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.summaryDateTimeLabel}</dt>
              <dd className="tabular-nums font-semibold text-[var(--bh-text)]" dir="ltr">
                {confirmedBooking.dateKey} · {confirmedBooking.timeSlot}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.dueNowLabel}</dt>
              <dd className="tabular-nums font-bold text-[var(--bh-success)]">
                ${confirmedBooking.depositUsd}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onViewBookings}
              className={`${UI_CLASSES.pillButtonPrimary} flex-1`}
            >
              <CalendarCheck2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.viewBookings}</span>
            </button>
            <button
              type="button"
              onClick={resetForAnother}
              className={`${UI_CLASSES.pillButtonSecondary} flex-1`}
            >
              {t.bookAnother}
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (step === 'deposit') {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
        <section
          aria-labelledby="deposit-heading"
          className={`${UI_CLASSES.card} space-y-6 p-6 sm:p-8`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--bh-amber-soft)] text-[var(--bh-amber-text)]">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h1
                id="deposit-heading"
                className="text-xl font-extrabold text-[var(--bh-text)] sm:text-2xl"
              >
                {t.depositTitle}
              </h1>
              <p className="text-xs text-[var(--bh-text-muted)]">{t.depositSubtitle}</p>
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 p-4 text-sm">
            <p className="font-bold text-[var(--bh-text)]">{bizName}</p>
            <p className="mt-0.5 text-[var(--bh-text-muted)]">
              {svcName} · {staffName}
            </p>
            <p className="tabular-nums mt-1 text-xs font-semibold text-[var(--bh-coral-text)]" dir="ltr">
              {dateKey} · {timeSlot}
            </p>
          </div>

          <dl className="divide-y divide-[var(--bh-border)] text-sm">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.serviceTotalLabel}</dt>
              <dd className="tabular-nums font-semibold text-[var(--bh-text)]">
                ${selectedService.priceUsd}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.dueAtVenueLabel}</dt>
              <dd className="tabular-nums font-semibold text-[var(--bh-text)]">
                ${remainingAtVenue}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="font-bold text-[var(--bh-text)]">{t.dueNowLabel}</dt>
              <dd className="tabular-nums text-lg font-extrabold text-[var(--bh-coral-text)]">
                ${selectedService.depositUsd}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-[var(--bh-text-muted)]">{t.demoCardLabel}</dt>
              <dd className="tabular-nums font-semibold text-[var(--bh-text)]">
                {t.demoCardValue}
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handlePayAndConfirm}
              className={`${UI_CLASSES.pillButtonPrimary} flex-1`}
            >
              {t.payAndConfirm}
            </button>
            <button
              type="button"
              onClick={() => setStep('select')}
              className={UI_CLASSES.pillButtonSecondary}
            >
              {t.backToEdit}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl">
        {t.title}
      </h1>

      {/* 1. Pick Business & Service */}
      <section aria-labelledby="step-service-heading" className={`${UI_CLASSES.card} space-y-4 p-5 sm:p-6`}>
        <h2 id="step-service-heading" className="text-base font-extrabold text-[var(--bh-text)]">
          {t.stepService}
        </h2>

        <div>
          <label
            htmlFor="book-business-select"
            className="mb-1.5 block text-xs font-semibold text-[var(--bh-text-muted)]"
          >
            {t.pickBusinessLabel}
          </label>
          <select
            id="book-business-select"
            value={selectedBusiness.id}
            onChange={(e) => handleBusinessChange(e.target.value)}
            className={`${UI_CLASSES.inputPill} cursor-pointer`}
          >
            {businesses.map((biz) => (
              <option key={biz.id} value={biz.id}>
                {lang === 'ar' ? biz.nameAr : biz.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div role="radiogroup" aria-label={t.stepService} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {selectedBusiness.services.map((svc) => {
            const active = svc.id === selectedService.id;
            return (
              <button
                key={svc.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setServiceId(svc.id)}
                className={`flex min-h-[68px] items-center justify-between gap-3 rounded-[20px] p-4 text-start transition-colors ${
                  active
                    ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-surface-elevated)]'
                    : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 hover:border-[var(--bh-text-muted)]'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[var(--bh-text)]">
                    {lang === 'ar' ? svc.nameAr : svc.nameEn}
                  </p>
                  <p className="tabular-nums mt-0.5 text-xs text-[var(--bh-text-muted)]">
                    {svc.durationMin} {profileCopy.durationUnit} · {profileCopy.depositPrefix} ${svc.depositUsd}
                  </p>
                </div>
                <span className="tabular-nums shrink-0 text-base font-extrabold text-[var(--bh-coral-text)]">
                  ${svc.priceUsd}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Pick Staff */}
      <section aria-labelledby="step-staff-heading" className={`${UI_CLASSES.card} space-y-4 p-5 sm:p-6`}>
        <h2 id="step-staff-heading" className="text-base font-extrabold text-[var(--bh-text)]">
          {t.stepStaff}
        </h2>
        <div role="radiogroup" aria-label={t.stepStaff} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {selectedBusiness.staff.map((member) => {
            const active = member.id === selectedStaff.id;
            return (
              <button
                key={member.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setStaffId(member.id)}
                className={`flex min-h-[64px] items-center justify-between gap-3 rounded-[20px] p-3.5 text-start transition-colors ${
                  active
                    ? 'border-2 border-[var(--bh-coral)] bg-[var(--bh-surface-elevated)]'
                    : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 hover:border-[var(--bh-text-muted)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active
                        ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                        : 'bg-[var(--bh-surface-elevated)] text-[var(--bh-coral-text)]'
                    }`}
                  >
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--bh-text)]">
                      {lang === 'ar' ? member.nameAr : member.nameEn}
                    </p>
                    <p className="truncate text-xs text-[var(--bh-text-muted)]">
                      {lang === 'ar' ? member.roleAr : member.roleEn}
                    </p>
                  </div>
                </div>
                <span className="tabular-nums shrink-0 text-xs font-bold text-[var(--bh-amber-text)]">
                  {member.rating.toFixed(1)} ★
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Pick Date (7-day strip) & 4. Pick Time Slot */}
      <section aria-labelledby="step-date-heading" className={`${UI_CLASSES.card} space-y-5 p-5 sm:p-6`}>
        <div className="space-y-3">
          <h2 id="step-date-heading" className="text-base font-extrabold text-[var(--bh-text)]">
            {t.stepDate}
          </h2>
          <div
            role="radiogroup"
            aria-label={t.stepDate}
            className="grid grid-cols-7 gap-1.5 sm:gap-2"
          >
            {dayStrip.map((day) => {
              const active = day.dateKey === dateKey;
              return (
                <button
                  key={day.dateKey}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDateKey(day.dateKey)}
                  className={`flex min-h-[64px] flex-col items-center justify-center rounded-[16px] px-1 py-2 text-center transition-colors ${
                    active
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                  }`}
                >
                  <span className="text-[11px] font-semibold opacity-85">{day.dayShort}</span>
                  <span className="tabular-nums text-base font-extrabold">{day.dayNum}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-[var(--bh-text)]">{t.stepTime}</h2>
          <div
            role="radiogroup"
            aria-label={t.stepTime}
            className="grid grid-cols-3 gap-2 sm:grid-cols-6"
          >
            {TIME_SLOTS.map((slot) => {
              const active = slot === timeSlot;
              return (
                <button
                  key={slot}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTimeSlot(slot)}
                  dir="ltr"
                  className={`tabular-nums min-h-[44px] rounded-full px-3 py-2 text-sm font-bold transition-colors ${
                    active
                      ? 'bg-[var(--bh-coral)] text-[var(--bh-coral-ink)]'
                      : 'border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 text-[var(--bh-text)] hover:border-[var(--bh-coral)]'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep('deposit')}
          className={`${UI_CLASSES.pillButtonPrimary} w-full`}
        >
          {t.continueToDeposit}
        </button>
      </section>
    </div>
  );
};
