import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Star } from 'lucide-react';
import type { BusinessRecord } from '../../data/businesses';
import { getCopy } from '../../i18n/translations';
import { UI_CLASSES, type Language } from '../../theme/tokens';
import { formatPriceLevel } from '../../utils/clientLogic';
import { BusinessProfileLinks } from '../BusinessProfileLinks';
import { BusinessPhotoPlaceholder } from './BusinessVisual';

interface BusinessProfileViewProps {
  lang: Language;
  business: BusinessRecord;
  onBack: () => void;
  onBookService: (businessId: string, serviceId?: string) => void;
}

const GALLERY_TONES = {
  coral: 'from-[#FF6B5B]/25 to-[var(--bh-surface-elevated)]',
  amber: 'from-[#F59E0B]/25 to-[var(--bh-surface-elevated)]',
  slate: 'from-[#64748B]/25 to-[var(--bh-surface-elevated)]',
  emerald: 'from-[#10B981]/25 to-[var(--bh-surface-elevated)]',
} as const;

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  lang,
  business,
  onBack,
  onBookService,
}) => {
  const copy = getCopy(lang);
  const t = copy.client.profileView;
  const categories = copy.client.categories;
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;
  const [linkFeedback, setLinkFeedback] = useState<string | null>(null);

  const name = lang === 'ar' ? business.nameAr : business.nameEn;
  const tagline = lang === 'ar' ? business.taglineAr : business.taglineEn;
  const neighborhood = lang === 'ar' ? business.neighborhoodAr : business.neighborhoodEn;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 pt-5 pb-28 sm:px-6 sm:pt-8">
      <button
        type="button"
        onClick={onBack}
        className={`${UI_CLASSES.pillButtonSecondary} min-h-[44px] px-4 py-2 text-sm`}
      >
        <BackArrow className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{t.back}</span>
      </button>

      {/* Cover & Identity Header */}
      <section className={`${UI_CLASSES.card} overflow-hidden p-5 sm:p-7`}>
        <BusinessPhotoPlaceholder
          category={business.category}
          tone={business.coverTone}
          label={name}
          heightClass="h-44 sm:h-56"
        />

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[var(--bh-coral-text)]">
              {categories[business.category]} · {neighborhood}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--bh-text)] sm:text-3xl">
              {name}
            </h1>
            <p className="text-sm text-[var(--bh-text-muted)]">{tagline}</p>
            <div className="tabular-nums flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--bh-text-muted)]">
              <span className="inline-flex items-center gap-1 font-bold text-[var(--bh-amber-text)]">
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                {business.rating.toFixed(1)} ({business.reviewCount} {t.reviewsSuffix})
              </span>
              <span aria-hidden="true">·</span>
              <span>{business.distanceKm.toFixed(1)} km</span>
              <span aria-hidden="true">·</span>
              <span className="font-bold text-[var(--bh-text)]">
                {formatPriceLevel(business.priceLevel)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookService(business.id)}
            className={`${UI_CLASSES.pillButtonPrimary} shrink-0`}
          >
            {t.bookCta}
          </button>
        </div>
      </section>

      {/* Services with Prices */}
      <section aria-labelledby="profile-services-heading" className={`${UI_CLASSES.card} p-5 sm:p-7`}>
        <h2
          id="profile-services-heading"
          className="text-lg font-extrabold text-[var(--bh-text)]"
        >
          {t.servicesHeading}
        </h2>
        <div className="mt-4 divide-y divide-[var(--bh-border)]">
          {business.services.map((svc) => {
            const svcName = lang === 'ar' ? svc.nameAr : svc.nameEn;
            return (
              <div
                key={svc.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
              >
                <div>
                  <h3 className="text-sm font-bold text-[var(--bh-text)] sm:text-base">
                    {svcName}
                  </h3>
                  <p className="tabular-nums mt-0.5 text-xs text-[var(--bh-text-muted)]">
                    {svc.durationMin} {t.durationUnit} · {t.depositPrefix} ${svc.depositUsd}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="tabular-nums text-base font-extrabold text-[var(--bh-text)]">
                    ${svc.priceUsd}
                  </span>
                  <button
                    type="button"
                    onClick={() => onBookService(business.id, svc.id)}
                    className={`${UI_CLASSES.pillButtonPrimary} min-h-[44px] px-4 py-2 text-xs`}
                  >
                    {copy.client.explore.bookNow}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Staff */}
        <section aria-labelledby="profile-staff-heading" className={`${UI_CLASSES.card} p-5 sm:p-7`}>
          <h2
            id="profile-staff-heading"
            className="text-lg font-extrabold text-[var(--bh-text)]"
          >
            {t.staffHeading}
          </h2>
          <div className="mt-4 space-y-3">
            {business.staff.map((member) => {
              const memberName = lang === 'ar' ? member.nameAr : member.nameEn;
              const role = lang === 'ar' ? member.roleAr : member.roleEn;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-[16px] border border-[var(--bh-border)] bg-[var(--bh-bg)]/50 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--bh-coral-soft)] text-sm font-bold text-[var(--bh-coral-text)]">
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--bh-text)]">{memberName}</p>
                      <p className="text-xs text-[var(--bh-text-muted)]">{role}</p>
                    </div>
                  </div>
                  <span className="tabular-nums text-xs font-bold text-[var(--bh-amber-text)]">
                    {member.rating.toFixed(1)} ★
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hours */}
        <section aria-labelledby="profile-hours-heading" className={`${UI_CLASSES.card} p-5 sm:p-7`}>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--bh-coral-text)]" aria-hidden="true" />
            <h2
              id="profile-hours-heading"
              className="text-lg font-extrabold text-[var(--bh-text)]"
            >
              {t.hoursHeading}
            </h2>
          </div>
          <dl className="mt-4 divide-y divide-[var(--bh-border)]">
            {business.hours.map((row) => (
              <div
                key={row.dayEn}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <dt className="text-[var(--bh-text-muted)]">
                  {lang === 'ar' ? row.dayAr : row.dayEn}
                </dt>
                <dd className="tabular-nums font-semibold text-[var(--bh-text)]" dir="ltr">
                  {lang === 'ar' ? row.hoursAr : row.hoursEn}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Gallery */}
      <section aria-labelledby="profile-gallery-heading" className={`${UI_CLASSES.card} p-5 sm:p-7`}>
        <h2
          id="profile-gallery-heading"
          className="text-lg font-extrabold text-[var(--bh-text)]"
        >
          {t.galleryHeading}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {business.gallery.map((tile) => (
            <div
              key={tile.id}
              className={`flex h-28 items-end rounded-[16px] border border-[var(--bh-border)] bg-gradient-to-br ${GALLERY_TONES[tile.tone]} p-3`}
            >
              <span className="text-xs font-semibold text-[var(--bh-text)]">
                {lang === 'ar' ? tile.captionAr : tile.captionEn}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Links: Instagram, Facebook, Google Review, Website, Call, WhatsApp */}
      <section aria-labelledby="profile-links-heading" className={`${UI_CLASSES.card} p-5 sm:p-7`}>
        <h2
          id="profile-links-heading"
          className="text-lg font-extrabold text-[var(--bh-text)]"
        >
          {t.linksHeading}
        </h2>
        <div className="mt-4">
          <BusinessProfileLinks
            lang={lang}
            links={business.links}
            onDemoLinkClick={(channel) =>
              setLinkFeedback(`${t.demoLinkFeedbackPrefix} ${channel} — ${name}`)
            }
          />
        </div>
        {linkFeedback && (
          <p
            role="status"
            className="mt-3 text-xs font-semibold text-[var(--bh-amber-text)]"
          >
            {linkFeedback}
          </p>
        )}
      </section>
    </div>
  );
};
